---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: api-ace-installer-overview
    name: Overview
    parent: api-ace-installer
    weight: 5
menu_name: docsplatform_{{.version}}
section_menu_id: api
---

# ACE Installer — Overview

`/api/v1/ace-installer` (AppsCode-hosted only)

Generates and manages self-host installer bundles. Token + org context; per-action authz checks.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/schema.json`, `/model.json` | Installer JSON schema / default options |
| POST | `/generate` | Generate an installer |
| POST | `/import` | Import an installer |
| GET | `/installer-meta`, `/latest-version` | Installer metadata / latest ACE version |
| GET | `/installers/` (+`/:name/`, `/:name/:id`) | List / inspect installers |
| DELETE | `/installers/:name/:id` | Delete a generated installer |
| POST | `/installers/:name/:id/{reconfigure,upgrade}` | Reconfigure / upgrade an installer |
| GET | `/installers/:name/:id/versions` | List installer versions |
| GET | `/installers/:name/:id/archives/:archiveName` | Read installer archive details |
| GET | `/installers/:name/:id/model.json` | Installer options |
| GET | `/deployment/marketplace/installers/:installerID/status` | Marketplace installer status |

## Reference pages

- [ACE installer](../ace-installer.md)
