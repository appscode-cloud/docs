---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: api-cloud-providers-overview
    name: Overview
    parent: api-cloud-providers
    weight: 5
menu_name: docsplatform_{{.version}}
section_menu_id: api
---

# Cloud Providers — Overview

`/api/v1/clouds`

Discovery APIs used by the cluster-provisioning wizard. Provider routes require Token + stored
cloud credentials.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | List supported cloud providers (public) |
| POST | `/:owner/:provider/cluster` | Provision a cluster on a provider |
| GET | `/:owner/providers/gke/projects` (+ per-project `clusters`, `clusters/:cluster`; per-region under `projects/:project/regions/:region`: `kubernetesversions`, `vms`) | GKE discovery |
| GET | `/:owner/providers/aks/{regions,resourcegroups}` (+ per-region `vms`/`kubernetesversions`, per-RG `clusters` and `clusters/:cluster`) | AKS discovery |
| GET | `/:owner/providers/eks/regions` (+ per-region `kubernetesversions`, `vms`, `clusters`, `clusters/:cluster`) | EKS discovery |
| GET | `/:owner/providers/digitalocean/clusters` (+`/:id`) | DigitalOcean discovery |
| GET | `/:owner/providers/linode/clusters` (+`/:id`) | Linode discovery |
| GET | `/:owner/providers/rancher/clusters/` (+`/:id`) | Rancher-managed cluster discovery |
| GET | `/:owner/providers/hetzner/{servers,kubernetesversions,regions}` (+ per-region `servers`) | Hetzner discovery |
| GET | `/:owner/providers/kubevirt/kubernetesversions` | KubeVirt versions |

## Reference pages

- [Cloud providers](../cloud-providers.md)
