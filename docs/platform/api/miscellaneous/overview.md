---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: api-miscellaneous-overview
    name: Overview
    parent: api-miscellaneous
    weight: 5
menu_name: docsplatform_{{.version}}
section_menu_id: api
---

# Miscellaneous — Overview

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/version` | Public | Server version |
| GET | `/api/v1/swagger` | Public (if enabled) | Swagger UI |
| POST | `/api/v1/markdown`, `/api/v1/markdown/raw` | Public | Render markdown to HTML |
| GET | `/healthz` | Public | Health check (non-API root) |
| GET | `/.well-known/openid-configuration` | Public | OIDC discovery (non-API root) |

Web (non-API) routes also exist for the sign-in/sign-up UI, OAuth2 authorize/token/userinfo endpoints,
account activation & recovery, 2FA/WebAuthn login, and static assets.

## Reference pages

- [Miscellaneous](../miscellaneous.md)
