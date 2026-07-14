---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: api-ace-upgrade-overview
    name: Overview
    parent: api-ace-upgrade
    weight: 5
menu_name: docsplatform_{{.version}}
section_menu_id: api
---

# Platform Upgrade — Overview

Platform and per-cluster upgrades (FluxCD-driven).

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET/POST | `/api/v1/upgrade` | Token + org; site-admin authz (view_upgrade_history / upgrade_platform) | Platform upgrade status / trigger |
| GET | `/api/v1/upgrade/{status,history,current-version}` | Token + org; site-admin authz (view_upgrade_history) | Upgrade job status, history, current version |
| GET/POST | `/api/v1/clusters/:owner/:cluster/upgrade` | Cluster assignment + runtime client | Imported-cluster upgrade status / trigger |
| GET | `/api/v1/clusters/:owner/:cluster/upgrade/{history,current-version,latest-version}` | Cluster assignment + runtime client | Upgrade info |
| GET/POST | `/api/v1/clusters/:owner/:cluster/spoke/upgrade` (+`/history`) | Cluster assignment + runtime client | Spoke-cluster upgrade status / trigger / history |

## Reference pages

- [Platform upgrade](../platform-upgrade.md)
- [Cluster upgrade](../cluster-upgrade.md)
