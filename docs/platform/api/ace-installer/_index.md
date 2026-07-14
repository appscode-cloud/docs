---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: api-ace-installer
    name: Platform Installer
    parent: api
    weight: 100
menu_name: docsplatform_{{.version}}
section_menu_id: api
---

# Platform Installer API

The Platform Installer API generates and manages self-host installer bundles for the
KubeDB Platform. It serves the installer options schema,
generates and imports installer bundles, lists and inspects generated installers,
and supports reconfigure/upgrade/versioning and marketplace-installer status.

> **AppsCode-hosted only.** Every route under `/api/v1/ace-installer/...` is available
> only on the AppsCode-hosted (SaaS) deployment. On self-hosted KubeDB Platform installations these
> routes are not registered and return `404 Not Found`. All calls require a bearer token,
> an org context (resolved from the `org` query param), and per-action authorization
> checks (`view_installers`, `create_installers`, `import_installers`,
> `reconfigure_installers`, `upgrade_installers`, `download_installers`,
> `delete_installers`).

## Pages

- [Platform Installer](../ace-installer.md) — schema/model, generate/import,
  installer metadata and latest version, installers CRUD, reconfigure/upgrade,
  versions/archives, and marketplace installer status.
