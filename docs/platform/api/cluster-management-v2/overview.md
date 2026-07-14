---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: api-cluster-management-v2-overview
    name: Overview
    parent: api-cluster-management-v2
    weight: 5
menu_name: docsplatform_{{.version}}
section_menu_id: api
---

# Cluster Management v2 — Overview

`/api/v1/clustersv2`

Newer cluster API with hub awareness, subscriptions (inbox notifications), gateway config, and
vcluster support. All routes require Token.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/providers/:provider/skip-credentials` | Check if provider credentials can be skipped |
| GET | `/all-hubs` | List all hub clusters |
| GET | `/:owner/all-clusters` | List imported clusters (site admin) |
| GET | `/identity/:clusterID` | Get cluster identity |
| GET | `/cluster-profiles` | Get cluster profiles |
| GET | `/:owner/` | List clusters |
| GET | `/:owner/hub-info`, `/:owner/has-hub` | Hub cluster info / existence |
| GET | `/:owner/:cluster/exist` | Check if cluster is imported |
| GET | `/:owner/:cluster/status` | Get cluster status |
| GET | `/:owner/:cluster/reconcile` | Reconcile Helm release |
| POST | `/:owner/:cluster/connect`, `/remove` | Connect / remove a cluster |
| GET | `/:owner/:cluster/update-version/{operations,list,:version}` | Kubernetes version upgrade info / trigger |
| GET/PUT | `/:owner/:cluster/gateway-configs` | View (GET) / update-all (PUT) gateway configs |
| PUT | `/:owner/:cluster/gateway-configs/:namespace/:name` | Update a single gateway config |
| POST | `/:owner/:cluster/reconfigure` | Reconfigure a cluster |
| POST | `/:owner/:cluster/feature/:feature/convert` | Convert a feature |
| POST/GET/DELETE | `/:owner/:cluster/subscriptions/` | Cluster-level notification subscription |
| POST/GET/DELETE | `/:owner/:cluster/subscriptions/namespaces/:namespace/` | Namespace-level subscription |
| POST/GET/DELETE | `/:owner/:cluster/subscriptions/namespaces/:namespace/:group/:version/:resource/:resourceName` | Resource-level subscription |
| POST | `/:owner/check`, `/:owner/validate` | Check existence / validate import options |
| POST | `/:owner/import` | Import a cluster |
| POST | `/:owner/vcluster/create`, `/:owner/vcluster/import` | Create / import a virtual cluster |

Related: `GET /api/v1/agent/:clusterName/:clusterID/token` (Token) — inbox agent token for a cluster.

## Reference pages

- [Clusters](../clusters.md)
- [Subscriptions & Inbox](../subscriptions.md)
