---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: api-chart-repositories
    name: Chart Repositories
    parent: api
    weight: 170
menu_name: docsplatform_{{.version}}
section_menu_id: api
---

# Chart Repositories

The Chart Repositories API exposes ACE's read-only view over the public Helm Hub
chart repository index. It lets you enumerate the known Helm chart repositories,
load an individual repository and list the charts it contains, and inspect the
available versions of a specific chart.

All endpoints live under the `/api/v1/chartrepositories` prefix and are
**public** — they carry no `security` requirement in the API definition and can
be called without organization context. In practice clients still send their
bearer token on every request (the platform accepts it), but no membership or
role is required. Only `GET` requests are exposed here.

## Pages

- [Chart Repositories](../chart-repositories/chart-repositories.md) — list the
  known chart repositories, list the charts inside a repository, and list the
  versions of a named chart.
