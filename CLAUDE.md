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

## README.md vs _index.md — do not let both exist in one directory

Hugo uses `_index.md` as a section's real index page. A few directories still
had a leftover `README.md` from the VitePress days, front-matter-spoofing the
same URL (or aliasing to it) — the two pages silently collided and broke
navigation only on those pages, even though every relative-link rule above
was followed correctly. If you find a directory with both, merge `README.md`'s
body into `_index.md` (keep `_index.md`'s frontmatter, port any `aliases:`),
then delete `README.md`. `docs/platform/`, `docs/platform/guides/`, and
`docs/platform/selfhost-setup/` already went through this fix.
