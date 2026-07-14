---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: api-multicluster-ocm-overview
    name: Overview
    parent: api-multicluster-ocm
    weight: 5
menu_name: docsplatform_{{.version}}
section_menu_id: api
---

# Multi-cluster: OCM Hub & Spoke — Overview

`/api/v1/clusters/:owner/...`

Open Cluster Management operations: hubs, spokes, cluster sets, feature sets, and OCM users.
All require Token + org/user resolution + cluster mapping.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/:owner/hubs` | List hub clusters |
| POST | `/:owner/:cluster/accept-spoke` | Accept spoke clusters into the hub |
| GET | `/:owner/:cluster/{managed-clusters,not-accepted-clusters,accepted-clusters}` | Spoke inventories |
| GET | `/:owner/:cluster/validate-profile` | Validate spoke feature sets |
| GET | `/:owner/:cluster/{available-clusters,available-clustersets}` | Available managed clusters / sets |
| GET | `/:owner/:cluster/clustersets` | List cluster sets |
| POST | `/:owner/:cluster/clustersets/{add,remove,create,delete}` | Manage cluster sets |
| GET | `/:owner/:cluster/clustersets/:clusterset/{featuresets,clusters,clusterlist}` | Cluster-set contents |
| POST | `/:owner/:cluster/clustersets/:clusterset/{install-featureset,disable-featureset}` | Install / disable feature sets |
| POST | `/:owner/:cluster/clustersets/:clusterset/:managedCluster/update-featureset` | Update a managed cluster's profile binding |
| GET | `/:owner/:cluster/clustersets/:clusterset/auth-info` | Auth info of a cluster set |
| POST/GET | `/:owner/:cluster/clustersets/:clusterset/auto-update/` (+`/check`) | Enable / check auto-update |
| GET | `/:owner/:cluster/clustersets/:clusterset/sync-status/{all-features,opscenter-features-version,:feature}` | Feature sync status |
| GET | `/:owner/:cluster/bound-namespaces`, POST `/bind`, `/unbind` | Namespace ↔ cluster-set binding |
| POST | `/:owner/:cluster/spoke-command` | Generate spoke install command |
| POST | `/:owner/:cluster/import-spoke`, `/convert/spoke` | Import / convert to spoke |
| POST | `/:owner/:cluster/remove-managed-cluster` | Remove a managed cluster |
| POST | `/:owner/:cluster/sync-accounts` | Sync account objects |
| GET | `/:owner/:cluster/users` | List OCM users |
| POST | `/:owner/:cluster/user/create` | Create an OCM user |
| GET | `/:owner/:cluster/user/:id` (+`/access`, `/:spokeName/kubeconfig`) | OCM user info / access / kubeconfig |
| POST | `/:owner/:cluster/user/:id/{remove,update}`, DELETE `/user/:id/delete` | Manage OCM user permissions |

## Reference pages

- [Hubs & spokes](../hubs-spokes.md)
- [Cluster sets](../cluster-sets.md)
- [OCM users](../ocm-users.md)
