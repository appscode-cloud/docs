---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: api-monitoring-telemetry-overview
    name: Overview
    parent: api-monitoring-telemetry
    weight: 5
menu_name: docsplatform_{{.version}}
section_menu_id: api
---

# Monitoring & Telemetry — Overview

## Telemetry stack (`/api/v1/telemetry/:owner`, Token + org admin)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/monitoring-clusters` | List clusters serving as monitoring clusters |
| POST | `/:cluster/stack` | Install the telemetry (OTel) stack on a cluster |
| GET | `/:cluster/values/appscode-otel-stack` | Helm values of the OTel stack |
| GET | `/:cluster/stack/host` | Telemetry stack endpoint |
| GET | `/:cluster/tenants/ownerlist` | Tenant owners served by this monitoring cluster |

## Trickster / Prometheus auth proxy (`/api/v1/trickster`, Token + org admin)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/register`, `/unregister` | Register / unregister a Prometheus backend |
| POST | `/perses/register`, `/perses/unregister` | Same, for Perses dashboards |
| GET | `/auth/:uidcid/*` | Ownership/auth check for a `uid.clusterid` identity |

## Reference pages

- [Telemetry stack](../telemetry-stack.md)
- [Trickster](../trickster.md)
