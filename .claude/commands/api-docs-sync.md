---
description: Scan the b3 API server against docs/platform/api and update the docs to match
argument-hint: "[path to b3 checkout] [--report-only]"
allowed-tools: Bash, Read, Edit, Write, Grep, Glob
---

# Sync `docs/platform/api` with the b3 API server

`$ARGUMENTS`

`b3` is the Go API server behind these docs. This command finds every place the
two have drifted and fixes the docs. Default b3 checkout:
`../b3` relative to this repo (i.e. `go.bytebuilders.dev/b3`). If `--report-only`
is passed, produce the ranked findings list and stop — change nothing.

Docs never drive code: **b3 is always the source of truth.** Never edit b3 to
match the docs, and never invent an endpoint the router does not register.

## 1. Extract the route table

```bash
B3=${1:-../b3}
python3 hack/api-doc-sync/extract_routes.py "$B3/routers/api/v1" > /tmp/routes.txt
python3 hack/api-doc-sync/compare.py /tmp/routes.txt docs/platform/api \
    docs/platform/api/openapi.yaml > /tmp/api-diff.txt
```

`extract_routes.py` walks the registration call graph from `RegisterRoutes` and
`RegisterMarketplaceServiceRoutes`, so a helper called inside
`m.Group("/user", …)` correctly gets the `/user` prefix. Read its docstring
before trusting an odd-looking path.

**Baseline:** the last full run extracted **547 routes** (545 unique
method+path) and ended with complete md and openapi.yaml coverage.

**Sanity gate:** if the route count dropped sharply versus the baseline, or many
paths look truncated, the extractor has stopped understanding a new registration
style (a new `m.Combo` chain shape, a `m.Group` whose path is a constant, a
helper invoked as `pkg.Register(m)` rather than `register(m)`). Fix the
extractor first — a silently short route table produces confidently wrong docs.

## 2. Triage the diff

Work the sections in this order; the first three are actionable, the last is
advisory.

1. **in openapi.yaml but NOT in code** — a documented path that no longer
   exists, or a *wrong* path. Before deleting anything, grep the code for the
   handler name: a "missing" path is usually a real endpoint under a different
   prefix (a helper moved inside another `m.Group`), and the fix is to rename the
   path, not drop it.
2. **in CODE but NOT in md** — undocumented endpoints. Write them up (step 3).
3. **in CODE but NOT in openapi.yaml** — add the path/operation to the spec.
4. **in md but NOT in code** — advisory. Overview tables put several verbs on one
   line (`| GET/POST/DELETE |`) and curl examples contain concrete values, so
   most entries here are noise. Only chase one if it names a plausible endpoint
   that `grep` cannot find in b3 at all.

Known-good false positive — leave it alone:

- `ANY /*` — the `/api/v1` catch-all 404 handler (`miscellaneous.go`). It is not
  an endpoint and is deliberately absent from the docs and the spec. As of the
  last run it is the **only** entry in both code→md and code→openapi.

`compare.py` already resolves the doc conventions this repo uses: absolute
headings, headings relative to a page's declared root ("All routes on this page
are rooted at `/api/v1/user/contracts`"), several verbs sharing one path
(`PUT · PATCH /x`, `| POST/GET/DELETE |`), `/api/v1`-prefixed table entries, and
abbreviated `### GET .../kubeDb/views/x` headings (matched as a path suffix). If a
new page invents another convention, teach the tool rather than rewriting the
page — but a page whose relative headings state no root cannot be matched, so
that page does need a root sentence.

For each surviving finding, verify against the source before writing a word:
open the `file:line` the extractor printed, read the handler, and derive the
request/response shape from the bound payload type (`binding.Json(X{})` /
`bind(X{})`) and what the handler actually writes (`ctx.JSON(...)`). Cite what
you read. If a shape cannot be determined from the code, say so on the page
instead of inventing fields.

## 3. Update the docs

- Put each endpoint on the page for its API group — the group table in
  `docs/platform/api/README.md` maps base paths to pages. Match the
  surrounding page's existing section style exactly (heading form, auth line,
  path/query parameter tables, JSON examples, `Errors:` line, `curl` block).
- Respect each page's declared path root: if the page says paths are relative to
  `/api/v1/user/contracts`, write `### GET /{id}`, not the absolute path.
- Middleware → prose mapping, as the existing pages use it: `reqToken()` →
  "token required"; `reqSiteAdmin()` / `authzCheck(...:site_admin)` → site admin;
  `reqOrgFromQuery()` → resolves the org from `?org=`; `reqClusterAssignment()`
  → owner+cluster resolved and a Kubernetes client built; `authzCheck(X, "perm")`
  → name the permission string.
- Note availability when the registration is conditional in
  `routers/api/v1/api.go`: `setting.AppsCodeHosted` → "AppsCode-hosted only";
  `setting.IsBillingEnabled()` → "billing-enabled deployments only".
- Only add a `> **Verified:** …` note if you actually ran the request against a
  live deployment in this session. Never copy one from another endpoint.
- Update `docs/platform/api/openapi.yaml` alongside the md: add/rename the path,
  reuse existing `components/schemas` and `parameters` rather than duplicating,
  and tag the operation with the same tag its group's siblings use.
- If the API-group set itself changed (a whole new `register*APIs` function),
  add a row to the group table and a section page — do not bury a new group
  inside an unrelated page.

## 4. Regenerate and verify

```bash
python3 hack/api-doc-sync/refresh_reference.py            # re-inlines the spec into reference/api.html
python3 -c "import yaml;yaml.safe_load(open('docs/platform/api/openapi.yaml'))"
liche -p -h -l -s <each changed md file>                # exactly as CI runs it
python3 hack/api-doc-sync/compare.py /tmp/routes.txt docs/platform/api \
    docs/platform/api/openapi.yaml | head -40
```

The `liche` invocation must keep `-s`; this repo's links intentionally carry one
extra `../` (see `CLAUDE.md`). Never "fix" a relative link to match the on-disk
path: a sibling page in the same directory is `../sibling.md`, and a page in
another directory is `../../other-dir/page.md`.

`docs/platform/api/README.md` fails this check by design — its links use
non-standard paths, which is why CI's liche fork passes `-i '^README\.md$'`. Add
that flag when scanning recursively; the locally installed `liche` may not have
it, in which case just skip `README.md`.

Re-run `compare.py` at the end and confirm the code→md and code→openapi lists
contain nothing but the known false positives above.

## 5. Report

Give a ranked summary: wrong paths first, then missing endpoints, then spec-only
changes. For anything you chose not to change, say why in one line. Note the
route count so the next run can compare.
