#!/usr/bin/env python3
"""Three-way diff: b3 routes vs. the API docs vs. openapi.yaml.

Usage:
    compare.py <routes.txt> <docs/platform/api> [openapi.yaml]

`routes.txt` is the output of extract_routes.py.

Path comparison normalizes `:name` / `{name}` / a trailing `/*` down to a single
`{}` placeholder, and drops trailing slashes — parameter *names* are allowed to
differ between the code and the docs.

Doc pages write endpoint headings either absolutely (`### GET /orgs/{org}`) or
relative to a declared page root ("All routes on this page are rooted at
`/api/v1/user/contracts`"); both forms are indexed, so a page must state its root
for its relative headings to be matched.

The "in md but NOT in code" section is ADVISORY only: overview tables group
several verbs on one line and curl examples contain concrete values, so it has a
high false-positive rate. The "in CODE but NOT in ..." sections are the ones to
act on.
"""
import re, sys, os, collections

M = "GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS|ANY"
PAGE_ROOT = re.compile(
    r"(?:relative to|rooted at|root)\b[\s\S]{0,120}?`(/api/v1[A-Za-z0-9_{}:*./\-]*)`")
# one or more verbs, then the path they share: "GET /x", "PUT · PATCH `/x`",
# "| POST/GET/DELETE | `/x`"
HEADING = re.compile(r"((?:\b(?:%s)\b[\s`|·,]*)+)(\.\.\.)?(/[A-Za-z0-9_{}:*./\-]*)" % M)


def norm(p):
    p = p.strip().rstrip("/") or "/"
    p = re.sub(r":(\w+)", r"{\1}", p)
    p = re.sub(r"\{[^}]*\}", "{}", p)          # param names need not match
    p = re.sub(r"/\*(?:[\w.]*)?$", "/{}", p)   # a wildcard tail is a path param
    return p


def load_code(f):
    out = {}
    for l in open(f, encoding="utf-8"):
        parts = [x.strip() for x in l.rstrip().split(" | ")]
        if len(parts) != 6 or not re.fullmatch(M, parts[0]):
            continue
        meth, path, handler, mw, fn, src = parts
        out.setdefault((meth, norm(path)), []).append(
            {"path": path, "handler": handler, "mw": mw, "fn": fn, "src": src})
    return out


def page_root(fp):
    """The /api/v1 sub-path a page's endpoint headings are written relative to."""
    with open(fp, encoding="utf-8") as fh:
        head = "".join([next(fh, "") for _ in range(60)])
    best = ""
    for m in PAGE_ROOT.finditer(head):
        r = m.group(1)[len("/api/v1"):].rstrip("/")
        if len(r) > len(best):
            best = r
    return best


def load_docs(d):
    """(method, path) -> locations, plus (method, suffix) for `.../x` headings.

    Long paths are abbreviated in headings as `### GET .../kubeDb/views/x`; those
    are recorded as suffixes and matched against the tail of a code path.
    """
    out = collections.defaultdict(list)
    suffixes = collections.defaultdict(list)
    for dp, _, fns in os.walk(d):
        for fn in sorted(fns):
            if not fn.endswith(".md"):
                continue
            fp = os.path.join(dp, fn)
            root = page_root(fp)
            for i, l in enumerate(open(fp, encoding="utf-8"), 1):
                for m in HEADING.finditer(l):
                    p = m.group(3)
                    loc = "%s:%d" % (os.path.relpath(fp, d), i)
                    # a heading may list several verbs for one path: "PUT · PATCH /x"
                    meths = re.findall(M, m.group(1))
                    if m.group(2):                  # "..." abbreviated prefix
                        for meth in meths:
                            suffixes[(meth, norm(p))].append(loc)
                        continue
                    forms = {p, root + p if root else p}
                    if p.startswith("/api/v1"):
                        forms.add(p[len("/api/v1"):] or "/")
                    for meth in meths:
                        for form in forms:
                            out[(meth, norm(form))].append(loc)
    return out, suffixes


def load_openapi(f):
    """Path -> operations, handling both plain keys and YAML complex keys.

    A path too long for a plain key is emitted as `? /path` / `: get:` by the
    generator, so both spellings have to be recognized.
    """
    out, cur = {}, None
    verbs = "get|post|put|patch|delete|head|options"
    for l in open(f, encoding="utf-8"):
        m = re.match(r"^  \??\s*(/\S*):?\s*$", l)
        if m:
            cur = m.group(1).rstrip(":"); continue
        m = re.match(r"^(?:    |  : )(%s):\s*$" % verbs, l)
        if m and cur:
            out[(m.group(1).upper(), norm(cur))] = cur
    return out


def report(title, keys, fmt):
    print("\n== %s (%d) ==" % (title, len(keys)))
    for k in keys:
        print("  " + fmt(k))


def main():
    code = load_code(sys.argv[1])
    docs, doc_suffixes = load_docs(sys.argv[2])
    oapi = load_openapi(sys.argv[3]) if len(sys.argv) > 3 else {}

    print("== counts (unique method+path) ==")
    print("routes in code:   %d" % len(code))
    print("documented in md: %d" % len(docs))
    print("in openapi.yaml:  %d" % len(oapi))

    def src(k):
        r = code[k][0]
        return "%-6s %-76s %s  (%s)" % (k[0], r["path"], r["fn"], r["src"])

    def documented(k):
        if k in docs:
            return True
        return any(m == k[0] and k[1].endswith(suf)
                   for m, suf in doc_suffixes)

    report("in CODE but NOT in md",
           sorted(k for k in code if not documented(k)), src)
    if oapi:
        report("in CODE but NOT in openapi.yaml",
               sorted(k for k in code if k not in oapi), src)
        report("in openapi.yaml but NOT in code",
               sorted(k for k in oapi if k not in code),
               lambda k: "%-6s %s" % (k[0], oapi[k]))
    # a doc heading is indexed under several forms (absolute, page-relative,
    # /api/v1-stripped); if any form matched, the heading itself is not stale
    matched = {loc for k, locs in docs.items() if k in code for loc in locs}
    stale_md = sorted(k for k in docs
                      if k not in code and not set(docs[k]) <= matched)
    report("in md but NOT in code (ADVISORY - high false-positive rate)",
           stale_md,
           lambda k: "%-6s %-66s %s" % (k[0], k[1], ", ".join(docs[k][:3])))


if __name__ == "__main__":
    try:
        main()
    except BrokenPipeError:      # piping into head/less
        os._exit(0)
