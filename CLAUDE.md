# Docs repo notes

Migrated from VitePress to Hugo (`98965f8`). Content lives under `docs/platform/`.

## The extra `../` convention (intentional, do not "fix")

Every relative link/image in this repo needs **one extra `../`** beyond what the
real filesystem nesting implies — this applies uniformly to `_index.md` section
pages AND regular leaf `.md` pages, even for files in the *same* directory
(e.g. `cluster-overview.md` links to its sibling `images/` dir as `../images/...`).
This is real, required Hugo behavior on the live site — verified by checking
which files actually 404 vs render. Don't "correct" it back to matching disk
paths; that breaks the live site even though it looks more "correct".

Plain file links keep the `.md` extension (e.g. `../mongodb.md`) — this is fine,
Hugo resolves it. Only anchor links were converted from `.md#anchor` to `/#anchor`
form (`#134`), because `.md#anchor` doesn't resolve but `.md` alone does.

## liche (CI link checker)

CI uses a custom fork (`appscodelabs/liche`, branch `arnob-strip-prefix`) with
an extra flag: `-s, --strip-relative-prefix` — strips one leading `../` from
each relative link before checking it against the filesystem. This exists
*because* of the extra-`../` convention above: it lets the checker validate
against real on-disk paths without every link failing.

To check a file the same way CI does:
```
liche -p -h -l -s <file.md>
```
Never validate without `-s` and conclude links are broken — that check
deliberately ignores the site's real routing.
