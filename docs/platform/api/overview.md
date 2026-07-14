---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: api-overview
    name: Overview
    parent: api
    weight: 5
menu_name: docsplatform_{{.version}}
section_menu_id: api
---

# KubeDB Platform API Server — High-Level Design

High-level design of the KubeDB Platform API Server.
This page gives you the whole-system picture — what the KubeDB Platform API Server does, how it is put
together, how requests are authenticated and authorized, and how the pieces fit
into typical flows. For the endpoint-by-endpoint reference, use the per-group
pages linked from the [API Reference index](../_index.md); each group also has
its own **Overview** page describing that group's role in the platform.

## 1. Overview

The KubeDB Platform API Server is the backend server of the **KubeDB Platform**. It combines an identity
foundation (users, organizations, teams, authentication) with a multi-cluster Kubernetes
management platform providing:

- **Identity & access management** — users, organizations, teams, fine-grained authorization.
- **Cluster management** — import, provision, and operate Kubernetes clusters (hub/spoke via Open Cluster Management, Rancher, cloud providers).
- **A full Kubernetes API proxy** — the KubeDB Platform UI talks to member clusters through the KubeDB Platform API Server.
- **Licensing & contracts** — issuing and enforcing product licenses (KubeDB, KubeStash, KubeVault, Voyager, ...).
- **Billing & usage reporting** — usage aggregation, invoices, cloud-marketplace metering (AWS/Azure/GCP).
- **Monitoring & telemetry** — telemetry stack provisioning, Prometheus/Trickster auth proxying.

All REST APIs are served under the `/api/v1` prefix.

## 2. System Architecture

![KubeDB Platform system architecture](../images/architecture.svg)

Key runtime facts:

- One binary, multiple subcommands. The default command is the API server; `marketplace`, `monitor`,
  `aggregator`, and `summary` run as separate processes for async/billing workloads.
- **NATS/JetStream** is the event backbone: member clusters push resource/usage events; `monitor` and
  `aggregator` consume them; the API server also uses NATS for its task manager and per-user credentials.
- **FluxCD (HelmRelease)** and **OCM (ManagedCluster)** are used to deploy KubeDB Platform features onto clusters and
  to manage hub→spoke relationships.
- Deployment modes are switched by `DEPLOYMENT_TYPE`: AppsCode-hosted, self-hosted (incl. offline
  installer), or AWS/GCP marketplace deployments. Some API groups only exist in specific modes (noted below).

## 3. Authentication & Authorization

| Mechanism | Used by | Notes |
|---|---|---|
| Session cookie | Web console | Cookie-based sign-in; CSRF-protected |
| Personal access token / Bearer token | API clients, CLI | `Authorization: token <t>`, `?token=`, `?access_token=` |
| Basic auth | Token management endpoints | With optional OTP (2FA) |
| OAuth2 / OIDC | SSO; the KubeDB Platform API Server is both provider and consumer | `/login/oauth/*`, `/.well-known/openid-configuration` |
| LDAP / PAM | Enterprise sign-in sources | Configured by site admins |
| 2FA / WebAuthn | User accounts | TOTP, scratch tokens, security keys |
| License-based auth | Member clusters | Clusters authenticate with issued licenses / cluster tokens |
| Sudo | Site admins | Impersonate a user via `sudo` param/header |

Authorization is relationship-based (OpenFGA-style checks, shown as `authzCheck(<permission>)` in the
reference tables). Common middleware referenced in the API tables:

- **Token** — authenticated request required (`reqToken`).
- **Site admin** — platform administrator only.
- **Org context** — org resolved from path or `?org=` query; membership/ownership verified.
- **Cluster assignment** — resolves owner+cluster, loads cluster credentials, builds a Kubernetes client.
- **Public** — no authentication beyond baseline middleware.

Baseline middleware on every `/api/v1` route: optional-sign-in, NATS connection cleanup,
security headers (`nosniff`), API context, sudo support.

## 4. API Groups

The v1 API surface is organized into the following logical groups:

| # | Group | Base path(s) | Availability |
|---|-------|--------------|--------------|
| 1 | [Identity: Users & Settings](../users-settings/) | `/api/v1/user`, `/api/v1/users` | always |
| 2 | [Identity: Organizations & Teams](../organizations-teams/) | `/api/v1/orgs`, `/api/v1/teams` | always |
| 3 | [Administration](../administration/) | `/api/v1/admin`, `/api/v1/accounts/admin` | always |
| 4 | [Authorization (Roles & Permissions)](../authorization/) | `/api/v1/authz` | always |
| 5 | [Cluster Management (v1 + K8s proxy + Helm)](../cluster-management-v1/) | `/api/v1/clusters` | always |
| 6 | [Cluster Management v2](../cluster-management-v2/) | `/api/v1/clustersv2` | always |
| 7 | [Multi-cluster (OCM hub/spoke)](../multicluster-ocm/) | `/api/v1/clusters/:owner/:cluster/...` | always |
| 8 | [Client Organizations](../client-organizations/) | `/api/v1/user/client*`, `/api/v1/clusters/.../permission` | always |
| 9 | [Cloud Providers](../cloud-providers/) | `/api/v1/clouds` | always |
| 10 | [Platform Installer](../ace-installer/) | `/api/v1/ace-installer` | AppsCode-hosted only |
| 11 | [Platform Upgrade](../ace-upgrade/) | `/api/v1/upgrade`, `/api/v1/clusters/.../upgrade` | always |
| 12 | [Licensing & Contracts](../licensing-contracts/) | `/api/v1/contracts`, `/api/v1/user/contracts`, `/api/v1/register`, `/api/v1/license` | contracts: AppsCode-hosted |
| 13 | [Billing Dashboard & Usage Reports](../billing-dashboard/) | `/api/v1/dashboard`, `/api/v1/user/dashboard`, `/api/v1/dbaas` | billing-enabled deployments |
| 14 | [Marketplace](../marketplace/) | `/api/v1/marketplaces` (separate service), `/api/v1/proxy/metered-billing` | marketplace deployments |
| 15 | [Monitoring & Telemetry](../monitoring-telemetry/) | `/api/v1/telemetry`, `/api/v1/trickster` | always |
| 16 | [Rancher Integration](../rancher/) | `/api/v1/rancher` | always |
| 17 | [Helm Chart Repositories (public)](../chart-repositories/) | `/api/v1/chartrepositories` | always |
| 18 | [Miscellaneous & Site Settings](../miscellaneous/) | `/api/v1/version`, `/api/v1/markdown`, `/api/v1/branding`, ... | always |

![KubeDB Platform /api/v1 API group map](../images/api-groups.svg)

## 5. Typical Request Flows

### Cluster resource access via the Kubernetes proxy

![Kubernetes proxy request flow](../images/flow-proxy.svg)

### License issuance for a contract cluster

![License issuance flow](../images/flow-license.svg)

### Usage → billing pipeline

![Usage to billing pipeline](../images/flow-billing.svg)

## 6. Deployment Modes

| Mode | `DEPLOYMENT_TYPE` | Notes |
|---|---|---|
| AppsCode-hosted (SaaS) | `Hosted` | Full surface incl. contracts admin, installer, Firebase tokens |
| Self-hosted | `SelfHostedProduction` (offline installs also set the separate `OfflineInstaller` flag) | Runs from a generated installer bundle; `/selfhost` console URL |
| AWS Marketplace | `AWSMarketplace` | Marketplace webhooks + AWS metering proxy enabled |
| GCP Marketplace | `GoogleCloudMarketplace` | Marketplace webhooks + GCP metering proxy enabled |
| Azure Marketplace | `AzureMarketplace` | Recognized marketplace mode (webhooks); no metering proxy wired up |

Feature gating summary:

- `AppsCodeHosted` → contracts admin APIs, installer APIs, org claim, Firebase token.
- `IsBillingEnabled()` → billing dashboard APIs (admin, user, usage reports).
- `DeploymentType` → which marketplace metering proxy (if any) is registered.
- License enforcement is compiled in (`ENFORCE_LICENSE=true`); the server validates its own license at startup.
