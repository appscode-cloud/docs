#!/usr/bin/env python3
"""Extract the macaron route table from b3's router tree.

Walks the route-registration call graph starting from one or more entry
functions, so routes registered by a helper called inside an m.Group() get the
enclosing path prefix and group middlewares.

Usage:
    extract_routes.py [--entry func[,func...]] <dir-or-file> [...]

Default entries: RegisterRoutes and RegisterMarketplaceServiceRoutes
(both in routers/api/v1/api.go). Paths are printed without the /v1 prefix,
i.e. exactly as the docs write them relative to /api/v1.

Output, one pipe-delimited line per route, sorted by path:
    METHOD | path | handler | middlewares | register-func | file:line
"""
import re, sys, os

METHODS = ("Get", "Post", "Put", "Patch", "Delete", "Head", "Options", "Any")
V = "|".join(METHODS)
STR = r'"(?:[^"\\]|\\.)*"'
FUNC_RE  = re.compile(r"^func\s+(?:\([^)]*\)\s*)?(\w+)")
GROUP_RE = re.compile(r'^\s*m\.Group\(\s*(%s|[\w.()]+)\s*,' % STR)
VERB_RE  = re.compile(r'^\s*m\.(%s)\(\s*(%s|[\w.]+)\s*(?:,\s*(.*))?$' % (V, STR))
COMBO_HEAD = re.compile(r'^\s*m\.Combo\(')
CVERB_HEAD = re.compile(r'^\s*\.?\s*(%s)\(' % V)
CALL_RE  = re.compile(r'^\s*(\w+)\(m(?:,\s*[^)]*)?\)\s*$')
CLOSE_MW = re.compile(r'^\s*\}\s*,\s*(.*?)\)\s*$')


def nostr(l): return re.sub(STR, '""', l)
def bdelta(l): s = nostr(l); return s.count("{") - s.count("}")
def pdelta(l): s = nostr(l); return s.count("(") - s.count(")")
def unq(t): return t[1:-1] if t.startswith('"') else "<%s>" % t


def strip_comment(s):
    """Drop a trailing // comment, ignoring // inside string literals."""
    instr, i = False, 0
    while i < len(s):
        ch = s[i]
        if instr:
            if ch == "\\": i += 2; continue
            if ch == '"': instr = False
        elif ch == '"': instr = True
        elif ch == "/" and s[i:i + 2] == "//":
            return s[:i].rstrip()
        i += 1
    return s


def logical_lines(src):
    """Join gofmt-wrapped call arguments into single logical lines."""
    raw = src.split("\n")
    out, i = [], 0
    while i < len(raw):
        if raw[i].lstrip().startswith("//"):
            i += 1; continue
        buf, start = raw[i], i
        i += 1
        while i < len(raw):
            t = buf.rstrip()
            if bdelta(buf) > 0:                      # opened a closure body
                break
            j = i
            while j < len(raw) and raw[j].strip().startswith("//"): j += 1
            nxt = raw[j].strip() if j < len(raw) else ""
            if (pdelta(buf) <= 0 and not t.endswith(",") and not t.endswith("(")
                    and not t.endswith(".") and not nxt.startswith(".")):
                break
            i = j
            if not nxt:
                break
            buf = t + " " + nxt
            i += 1
        out.append((strip_comment(buf), start + 1))
    return out


def split_args(s):
    if not s: return []
    s = s.strip().rstrip(",")
    if s.endswith(")") and pdelta(s) < 0: s = s[:-1]
    parts, buf, d = [], "", 0
    for ch in s:
        if ch in "({[": d += 1
        elif ch in ")}]": d -= 1
        if ch == "," and d == 0:
            parts.append(buf.strip()); buf = ""
        else: buf += ch
    if buf.strip(): parts.append(buf.strip())
    return [p for p in parts if p and p != ")"]


def call_args(s, i):
    """s[i] == '('; return (inner text, index just past the matching ')')."""
    d, j, instr = 0, i, False
    while j < len(s):
        ch = s[j]
        if instr:
            if ch == "\\": j += 2; continue
            if ch == '"': instr = False
        elif ch == '"': instr = True
        elif ch in "({[": d += 1
        elif ch in ")}]":
            d -= 1
            if d == 0: return s[i + 1:j], j + 1
        j += 1
    return s[i + 1:], len(s)


def parse_combo(l):
    """m.Combo("/p", mw...).Get(h).Post(mw, h) -> (path, common_mw, [(VERB, args)])"""
    m = COMBO_HEAD.match(l)
    if not m: return None
    inner, k = call_args(l, m.end() - 1)
    args = split_args(inner)
    if not args: return None
    verbs, rest = [], l[k:]
    while True:
        mv = CVERB_HEAD.match(rest)
        if not mv: break
        vinner, k2 = call_args(rest, mv.end() - 1)
        verbs.append((mv.group(1).upper(), split_args(vinner)))
        rest = rest[k2:]
    return args[0], args[1:], verbs


def parse_file(path, funcs):
    """funcs[name] = list of events:
        ("route", METHOD, relpath, mw, handler, "file:line")
        ("call", callee, relpath, mw)
    relpath/mw are relative to the function's own root (no enclosing prefix).
    """
    lines = logical_lines(open(path, encoding="utf-8").read())
    # pass 1: for each m.Group( line, find its closing line -> group middlewares
    depth, gstack, gmw, gclose = 0, [], {}, {}
    for idx, (l, _) in enumerate(lines):
        if GROUP_RE.match(l):
            depth += bdelta(l); gstack.append((idx, depth - 1)); continue
        d = bdelta(l); nd = depth + d
        if d < 0:
            m = CLOSE_MW.match(l)
            while gstack and gstack[-1][1] >= nd:
                gi, _ = gstack.pop()
                gmw[gi] = split_args(m.group(1)) if m else []
                gclose[gi] = idx
                m = None
        depth = nd
    for gi, _ in gstack:                      # unterminated (shouldn't happen)
        gmw.setdefault(gi, []); gclose.setdefault(gi, len(lines))

    # pass 2: walk with an explicit group stack keyed by open/close line pairs
    depth, fn, stack = 0, None, []
    for idx, (l, ln) in enumerate(lines):
        while stack and idx >= gclose[stack[-1]]:
            stack.pop()
        mf = FUNC_RE.match(l)
        if mf and depth == 0:
            fn = mf.group(1); funcs.setdefault(fn, []); stack = []
        depth += bdelta(l)
        ev = funcs.get(fn)
        if ev is None:
            continue
        prefix = "".join(unq(GROUP_RE.match(lines[g][0]).group(1)) for g in stack)
        mw = [x for g in stack for x in gmw[g]]
        if GROUP_RE.match(l):
            stack.append(idx); continue
        c = parse_combo(l)
        if c:
            p, common, verbs = unq(c[0]), c[1], c[2]
            for meth, vargs in verbs:
                ev.append(("route", meth, prefix + p, mw + common + vargs[:-1],
                           vargs[-1] if vargs else "-", "%s:%d" % (path, ln)))
            continue
        v = VERB_RE.match(l)
        if v:
            args = split_args(v.group(3))
            ev.append(("route", v.group(1).upper(), prefix + unq(v.group(2)),
                       mw + args[:-1], args[-1] if args else "-", "%s:%d" % (path, ln)))
            continue
        cl = CALL_RE.match(l)
        if cl and cl.group(1) != fn:
            ev.append(("call", cl.group(1), prefix, mw))


def emit(fname, funcs, prefix, inherited, rows, stackset):
    ev = funcs.get(fname)
    if ev is None or fname in stackset: return
    stackset.add(fname)
    for e in ev:
        if e[0] == "route":
            _, meth, p, mw, handler, src = e
            rows.append((meth, prefix + p, inherited + mw, handler, fname, src))
        else:
            _, callee, p, mw = e
            emit(callee, funcs, prefix + p, inherited + mw, rows, stackset)
    stackset.discard(fname)


def main():
    argv = sys.argv[1:]
    entries = ["RegisterRoutes", "RegisterMarketplaceServiceRoutes"]
    if argv and argv[0] == "--entry":
        entries = argv[1].split(","); argv = argv[2:]
    files = []
    for r in argv:
        if os.path.isfile(r): files.append(r)
        else:
            for dp, _, fns in os.walk(r):
                files += [os.path.join(dp, f) for f in fns
                          if f.endswith(".go") and not f.endswith("_test.go")]
    funcs = {}
    for f in sorted(files): parse_file(f, funcs)
    rows = []
    for e in entries: emit(e, funcs, "", [], rows, set())
    for meth, p, mw, handler, deffn, src in sorted(rows, key=lambda r: (r[1], r[0])):
        p = re.sub(r"/{2,}", "/", re.sub(r"^/v1", "", p)) or "/"
        print("%-6s | %-84s | %s | %s | %s | %s" %
              (meth, p, handler, ",".join(mw) or "-", deffn, src))
    print("# total routes: %d" % len(rows), file=sys.stderr)



if __name__ == "__main__":
    main()
