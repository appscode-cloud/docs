---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: api-cluster-management-v1
    name: Cluster Management v1
    parent: api
    weight: 50
menu_name: docsplatform_{{.version}}
section_menu_id: api
---

# Cluster Management v1

The core cluster API. Every endpoint is scoped to a single cluster identified by
`{owner}` (the organization slug or username that owns the cluster) and `{cluster}`
(the cluster name), and is served under:

```
/api/v1/clusters/{owner}/{cluster}/...
```

All routes require a personal access token sent as
`Authorization: token <YOUR_TOKEN>` (it may also be supplied as a `token` or
`access_token` query parameter). Cluster routes additionally resolve the cluster's
stored credentials and build a Kubernetes client for it ("cluster assignment"); a
few routes layer on extra authorization checks, which are called out per endpoint.

This group covers three related surfaces:

## Pages

- [Cluster Lifecycle & Info](../cluster-management-v1/lifecycle.md) — get, update, and
  delete a cluster; fetch its kubeconfig; discover available resource types; database
  status/bundle; feature values; execute whitelisted commands; create resources;
  install/uninstall deploy orders; and read resource history.
- [Kubernetes Proxy](../cluster-management-v1/kubernetes-proxy.md) — the generic
  `/proxy/*` passthrough for any Kubernetes group/version/resource (CRUD, status,
  events, controller, scale, HPAs), plus pod logs/exec, node/pod metrics, access
  reviews, the `meta.k8s.appscode.com` render endpoints, scanner/policy reports, and
  batch delete.
- [Helm](../cluster-management-v1/helm.md) — Helm console (tiller) configuration, Helm
  v3 release management (list/install/upgrade/uninstall/rollback, content, status,
  history), bundle/package views, and the resource editor.
