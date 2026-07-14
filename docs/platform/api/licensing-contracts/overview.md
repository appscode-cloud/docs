---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: api-licensing-contracts-overview
    name: Overview
    parent: api-licensing-contracts
    weight: 5
menu_name: docsplatform_{{.version}}
section_menu_id: api
---

# Licensing & Contracts — Overview

Contracts bind an organization to products, clusters, and quotas; licenses are issued per
contract-cluster. The license flow is what member clusters (via `license-proxyserver`) use.

## License registration (always available)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/register` | License validation | Register / validate a licensed cluster |
| POST | `/api/v1/license/issue` | Token + license issuance checks | Issue a license |

## Contracts — admin (`/api/v1/contracts`, AppsCode-hosted, site-admin authz)

| Method | Path | Description |
|--------|------|-------------|
| GET/POST | `/` | List / create contracts |
| GET/PUT/DELETE | `/:id/` | Get / update / delete a contract |
| POST | `/:id/extend`, `/:id/revoke` | Extend / revoke a contract |
| GET | `/:id/document` | Download the contract document |
| GET | `/:id/audit` | Contract audit history |
| GET | `/:id/clusters/imported/non-associated` | Importable clusters not yet bound |
| GET/POST | `/:id/clusters/` | List / bind clusters to the contract |
| DELETE | `/:id/clusters/:ccID/` | Remove a cluster from the contract |
| POST | `/:id/clusters/:ccID/issue-license` | Issue a full license for a contract cluster |
| PATCH | `/:id/clusters/:ccID/{name,tags}` | Rename / retag a contract cluster |
| GET | `/active/associated-clusters/:clusterID/status`, POST `/active/associated-clusters/batch-status` | Contract status per cluster (single / batch) |
| GET | `/available_products` | Products available for new contracts |

## Contracts — user (`/api/v1/user/contracts`, AppsCode-hosted, Token)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | List my contracts |
| GET | `/active-offline-contracts` | List active offline contracts |
| POST | `/assign-cluster` | Assign a cluster to multiple contracts |
| GET | `/active/associated-with/clusters/:clusterID`, `/active/not-associated-with/clusters/:clusterID` | Contracts (not) associated with a cluster |
| GET | `/active/associated-clusters/` (+`/:clusterID/status`, POST `/batch-status`) | Cluster association status |
| GET | `/:id/` (+`/document`, `/audit`) | Contract details, document, audit |
| PUT | `/:id/preferences` | Update contract preferences |
| GET/POST | `/:id/clusters/` (+`imported/non-associated`) | List / bind clusters |
| DELETE | `/:id/clusters/:ccID/`, PATCH `/:ccID/{name,tags}` | Manage contract clusters |
| POST | `/:id/clusters/:ccID/issue-license` | Issue a license for my contract cluster |

Related: `POST /api/v1/user/license-proxy` — generate the `license-proxyserver` installer for a cluster.

## Reference pages

- [License registration](../registration.md)
- [Contracts — admin](../contracts-admin.md)
- [Contracts — user](../contracts-user.md)
