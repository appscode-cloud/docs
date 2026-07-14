---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: api-marketplace-overview
    name: Overview
    parent: api-marketplace
    weight: 5
menu_name: docsplatform_{{.version}}
section_menu_id: api
---

# Marketplace — Overview

## Webhook service (separate listener rooted at `/marketplace/api`, marketplace deployments)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/marketplace/api/v1/marketplaces/standalone-organizations/:claimID/claimable` | Public | Check claim rules of a standalone org |
| POST | `/marketplace/api/v1/marketplaces/{aws,azure,gcp}/notification/resource` | Webhook | Cloud-marketplace subscription notifications |
| GET | `/marketplace/api/v1/version` | Public | Service version |

## Metered-billing proxy (`/api/v1/proxy/metered-billing/marketplaces`, site admin)

| Method | Path | Gated by | Description |
|--------|------|----------|-------------|
| POST | `/aws/report-usage`, GET `/aws/check/readiness` | AWS marketplace deployment | Report metered usage / readiness |
| POST | `/gcp/report-usage`, GET `/gcp/check/readiness` | GCP marketplace deployment | Report metered usage / readiness |

## Reference pages

- [Webhook service](../webhook-service.md)
- [Metered billing](../metered-billing.md)
