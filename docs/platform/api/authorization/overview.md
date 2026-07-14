---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: api-authorization-overview
    name: Overview
    parent: api-authorization
    weight: 5
menu_name: docsplatform_{{.version}}
section_menu_id: api
---

# Authorization (Roles & Permissions) — Overview

Custom role management backed by the relationship-based authorization model.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/authz/objects/:objectType/:objID/allowed-permissions` | Token + org | Allowed permissions on an object |
| POST | `/api/v1/authz/objects/allowed-permissions` | Token + org | Batch allowed-permissions query |
| GET | `/api/v1/authz/roles/available_permissions` | Token + org | List available permissions |
| GET/POST | `/api/v1/authz/roles` | Token + org (+create_role:org) | List / create roles |
| GET/PUT/DELETE | `/api/v1/authz/roles/:id` | authzCheck(view/edit/delete:role) | Manage a role |
| GET | `/api/v1/authz/roles/:id/principals` | authzCheck(viewer:role) | List principals assigned to a role |

## Reference pages

- [Roles & permissions](../roles-permissions.md)
