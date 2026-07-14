---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: api-rancher-overview
    name: Overview
    parent: api-rancher
    weight: 5
menu_name: docsplatform_{{.version}}
section_menu_id: api
---

# Rancher Integration — Overview

`/api/v1/rancher` (Token)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/org/:orgname/sync/users` | Site admin + Rancher-managed org | Sync Rancher users for an org |
| GET | `/org/:orgname/acerproxy` | Site admin + Rancher-managed org | ACER proxy installation command |
| GET | `/org/:orgname/ca/download` | Site admin + Rancher-managed org | Download CA certificate |
| POST | `/proxy-token` | Site admin | Create a Rancher proxy-server token |
| GET | `/nats-cred` | Token (Rancher user) | Get NATS credentials |

## Reference pages

- [Rancher](../rancher.md)
