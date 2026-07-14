---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: api-billing-dashboard-overview
    name: Overview
    parent: api-billing-dashboard
    weight: 5
menu_name: docsplatform_{{.version}}
section_menu_id: api
---

# Billing Dashboard & Usage Reports — Overview

Available on billing-enabled deployments.

## Site-admin billing dashboard (`/api/v1/dashboard`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/users/` (+`/active`, `/inactive`) | Licensed users |
| GET | `/users/:uid/clusters/` (+`/active`, `/:cid/`) | A user's clusters |
| GET | `/users/:uid/clusters/:cid/licenses/` (+`/active`, `/:lid/`) | Licenses per cluster |
| GET | `/users/:uid/clusters/:cid/licenses/:lid/products/` (+`/:productName/`) | Licensed products |
| GET | `.../products/:productName/{resources,events-histories,events/,events/raw-event}` | Product resource history & audit events |
| GET | `/clusters/:cid/licenses/active` | Active licenses for a cluster |
| POST | `/system-outages/`, GET `/system-outages/{report,tags}` | System outage records |
| GET | `/marketplaces/subscriptions`, `/marketplaces/settings/warnings` | Marketplace subscriptions / warnings |
| GET/DELETE | `/marketplaces/:marketplace/:subscriptionId/` (+`/ping`, `/audit-logs`) | Inspect / revoke / ping a subscription |

## User billing dashboard (`/api/v1/user/dashboard/clusters`, Token)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/active` | My active clusters |
| GET | `/:cid/` (+`/events-count`) | Cluster info / events count |
| GET | `/:cid/licenses/` (+`/:lid/`) | Licenses |
| GET | `/:cid/licenses/:lid/products/:product/{events-count,events/,events/raw-event}` | License events per product |
| GET | `/:cid/licenses/:lid/products/:product/groups/:group/resources/:resource/:rid/events-count` | Per-resource events count |

## Usage reports (`/api/v1/dashboard/summary`, `/api/v1/dbaas`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/summary/generated-months` | Months with generated usage reports |
| GET | `/summary/object-quota-history/clusters/:clusterUID/objects/:objectID` | Object quota history |
| GET | `/summary/:year/:month/usage-report/products/kubeDb/views/*` | KubeDB usage views (objects, clusters, namespaces, GKS, contracts, quota history, cluster-mode) |
| GET | `/summary/:year/:month/usage-report/products/{kubeStash,kubeVault,voyager}/views/{clusters,contracts}-usage-view` | Usage views per product |
| GET | `/summary/:year/:month/download` | Download PDF usage report |
| GET | `/dbaas/billing/reports/namespaces` (+`/clusters/:clusterID/namespaces/:namespaceName`) | DBaaS billing namespace reports |

## Reference pages

- [Admin dashboard](../admin-dashboard.md)
- [User dashboard](../user-dashboard.md)
- [Usage reports](../usage-reports.md)
