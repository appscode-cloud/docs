---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: api-client-organizations-overview
    name: Overview
    parent: api-client-organizations
    weight: 5
menu_name: docsplatform_{{.version}}
section_menu_id: api
---

# Client Organizations — Overview

For managed-service providers: site admins create "client orgs" and manage per-cluster user access.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/user/clients` | Site-admin authz | List client organizations |
| GET | `/api/v1/user/client/:id` | Site-admin authz | Get a client organization |
| POST | `/api/v1/user/client/create` | authzCheck(create_client_org) | Create a client organization |
| POST | `/api/v1/user/client/:orgname/{add-cluster,delete-cluster}` | authzCheck | Add / remove a cluster |
| GET | `/api/v1/user/client/:orgname/status`, `/api/v1/user/client/:orgname/cluster/:cluster/status` | authzCheck | Client org / cluster status |
| DELETE | `/api/v1/user/client/delete/:id` | authzCheck(delete_client_org) | Delete a client organization |
| GET | `/api/v1/clusters/:owner/:cluster/permission/users` | Token + client-org | List users of a client org |
| POST | `/api/v1/clusters/:owner/:cluster/permission/user/create` | Org-admin authz | Create an OCM user for a client org |
| POST | `/api/v1/clusters/:owner/:cluster/permission/user/:id` | Org-admin authz | Get client-org user info |
| GET | `/api/v1/clusters/:owner/:cluster/permission/user/:id/kubeconfig` | Org-admin authz | Kubeconfig for a client-org user |
| POST | `/api/v1/clusters/:owner/:cluster/permission/user/:id/{remove,update}` | Org-admin authz | Manage permissions |
| DELETE | `/api/v1/clusters/:owner/:cluster/permission/user/:id/delete` | Org-admin authz | Delete the OCM user |

## Reference pages

- [Management](../management.md)
- [Cluster user permissions](../cluster-user-permissions.md)
