---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: api-readme
    name: API Reference
    parent: api
    weight: -1
menu_name: docsplatform_{{.version}}
section_menu_id: api
url: /docs/platform/{{.version}}/api/
aliases:
- /docs/platform/{{.version}}/api/README/
---

# ACE Platform API Reference

Low-level reference for the AppsCode Cloud Engine (ACE) platform backend (`b3`)
REST API. Every endpoint lists its HTTP method, path, authentication, path/query
parameters, and request/response shapes so you can implement a client directly
against it.

All routes are served under the `/api/v1` prefix unless noted otherwise. The
marketplace webhook service is a separate listener rooted at `/marketplace/api/v1`.

## Authentication

Most endpoints require a personal access token. Send it as an HTTP header:

```
Authorization: token <YOUR_TOKEN>
```

You can also pass it as a `token` or `access_token` query parameter. Token-management
endpoints accept HTTP Basic auth. The web console uses a session cookie
(`i_like_ace`); a session cookie alone does **not** authenticate the token-guarded
REST endpoints — use a token.

A machine-readable [OpenAPI 3.0.3 specification](../api/openapi.yaml) of this API is
also available (`openapi.yaml`) — load it into any OpenAPI tool (Swagger UI, Redoc,
`openapi-generator`) to explore the API or generate a client. A self-contained
Swagger UI viewer (`api.html`, with the spec inlined) is available at the repository
root.

## API groups

| Group | What it covers |
|---|---|
| [Identity: Users & Settings](../api/users-settings/public-user-apis/) | Accounts, profile/security settings, tokens, credentials |
| [Identity: Organizations & Teams](../api/organizations-teams/organizations/) | Orgs, members, teams, org tokens |
| [Administration](../api/administration/admin-org/) | Admin console, site settings |
| [Authorization](../api/authorization/roles-permissions/) | Custom roles & permissions |
| [Cluster Management v1](../api/cluster-management-v1/lifecycle/) | Cluster lifecycle, Kubernetes proxy, Helm |
| [Cluster Management v2](../api/cluster-management-v2/clusters/) | Hub-aware cluster API, subscriptions, gateways |
| [Multi-cluster (OCM)](../api/multicluster-ocm/hubs-spokes/) | Hub/spoke, cluster sets, feature sets |
| [Client Organizations](../api/client-organizations/management/) | Managed-service client orgs |
| [Cloud Providers](../api/cloud-providers/cloud-providers/) | Provider discovery for provisioning |
| [ACE Installer](../api/ace-installer/ace-installer/) | Self-host installer bundles |
| [ACE Upgrade](../api/ace-upgrade/platform-upgrade/) | Platform & cluster upgrades |
| [Licensing & Contracts](../api/licensing-contracts/registration/) | Contracts, licenses, registration |
| [Billing Dashboard](../api/billing-dashboard/admin-dashboard/) | Usage reports & billing dashboards |
| [Marketplace](../api/marketplace/webhook-service/) | Cloud-marketplace webhooks & metering |
| [Monitoring & Telemetry](../api/monitoring-telemetry/telemetry-stack/) | Telemetry stack, Trickster auth proxy |
| [Rancher Integration](../api/rancher/rancher/) | Rancher sync & proxy |
| [Chart Repositories](../api/chart-repositories/chart-repositories/) | Public Helm chart repositories |
| [Miscellaneous](../api/miscellaneous/miscellaneous/) | Version, markdown, health |
