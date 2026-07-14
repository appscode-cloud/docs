---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: external-console-integration
    name: External Console Integration
    parent: integrations
    weight: 60
menu_name: docsplatform_{{.version}}
section_menu_id: guides
---

# Integrating an External Console with the KubeDB Platform

This guide is for **Cloud Service Providers (CSPs)** and ISVs who already operate their
own web console and want to embed the KubeDB Platform console for their end users.

## 1. Goal

A CSP already has a console where its customers sign in. The CSP wants to offer KubeDB
(managed databases) as a feature. The KubeDB Platform console is hosted on a **subdomain of
the CSP's console**, for example:

| Role | Host |
|------|------|
| CSP console (the CSP's existing product; identity provider) | `https://console.acme.com` |
| KubeDB Platform console **and** API server (per-CSP deployment) | `https://db.acme.com` |

The requirement: **when a user logs into the CSP console, the CSP backend should
seamlessly log that same user into the KubeDB console** — no second username/password
prompt. The user's identity of record lives in the CSP console; the KubeDB Platform holds a
*mirror* of that identity that the CSP backend controls.

This is achieved with two flows:

1. **Provisioning (once per user)** — the CSP backend creates a mirrored KubeDB user
   using an **admin bearer token**. The CSP generates and stores that user's KubeDB
   password; the end user never sees or types it.
2. **Session handoff (every CSP login)** — the CSP backend performs a server-side login
   to the KubeDB Platform on the user's behalf, captures the resulting session cookies, and
   hands them to the user's browser scoped to the KubeDB subdomain.

Because both consoles share the registrable domain `acme.com`, the browser treats
`console.acme.com` → `db.acme.com` as **same-site**, so the handoff works cleanly.

---

## 2. Prerequisites

- A per-CSP KubeDB Platform deployment reachable at the subdomain (`https://db.acme.com`),
  serving both the web console and the `/api/v1` REST API.
- An **admin personal access token** (bearer token) issued to the CSP, held **only** by
  the CSP backend — never shipped to a browser. Used for `/api/v1/admin/*` calls.
- TLS on both hosts. All calls below assume `https://`.
- The mirrored KubeDB users must **not** have 2FA enabled — the password login endpoint
  rejects 2FA-enrolled users (HTTP 405). Since the CSP console is the identity provider,
  leave 2FA off on the mirror and enforce MFA in the CSP console instead.

Throughout, replace:

- `db.acme.com` → your KubeDB Platform subdomain
- `2ed08ee9a855b8ff614ef1505b33c75a8836d55d` → your admin bearer token

---

## 3. Phase 1 — Provision the mirrored user (once, at CSP signup)

When a customer signs up (or is first granted database access) on the CSP console, the
CSP backend creates the corresponding user in the KubeDB Platform. Do **not** use the public
signup API — user creation is an admin operation.

The CSP backend generates a strong random password for the KubeDB identity and **stores
it** (encrypted) alongside the CSP user record. This password is an internal credential
used only for the server-side handoff in Phase 2; the end user never learns it.

**Create user** — `POST /api/v1/admin/users`:

```bash
curl -X POST 'https://db.acme.com/api/v1/admin/users' \
  -H 'Authorization: Bearer 2ed08ee9a855b8ff614ef1505b33c75a8836d55d' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "username": "acme-user-42",
    "full_name": "Jane Doe",
    "email": "jane@customer.example.com",
    "password": "<STRONG_RANDOM_PASSWORD_GENERATED_AND_STORED_BY_CSP>",
    "must_change_password": false,
    "send_notify": false
  }'
```

Notes:

- Set `must_change_password: false` — a forced password change would break the automated
  login handoff.
- Set `send_notify: false` — the KubeDB Platform should not email the user; the CSP owns all
  user communication.
- Pick a stable, collision-free `username` (e.g. prefix with your tenant slug). Persist the
  mapping `CSP user ↔ KubeDB username` in the CSP database.

**Keep profile in sync (optional)** — when the user edits their name/email in the CSP
console, mirror it with `POST /api/v1/admin/users/{username}/update`:

```bash
curl -X POST 'https://db.acme.com/api/v1/admin/users/acme-user-42/update' \
  -H 'Authorization: Bearer 2ed08ee9a855b8ff614ef1505b33c75a8836d55d' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "name": "acme-user-42",
    "full_name": "Jane A. Doe",
    "email": "jane@customer.example.com",
    "keep_email_private": false,
    "language": "en",
    "description": "Mirrored from CSP console"
  }'
```

**Rotate the password (optional)** — if the CSP rotates the stored KubeDB credential,
push the new value with `POST /api/v1/admin/users/{username}/change-password`:

```bash
curl -X POST 'https://db.acme.com/api/v1/admin/users/acme-user-42/change-password' \
  -H 'Authorization: Bearer 2ed08ee9a855b8ff614ef1505b33c75a8836d55d' \
  -H 'Content-Type: application/json' \
  --data-raw '{ "password": "<NEW_STRONG_RANDOM_PASSWORD>" }'
```

![Provisioning the mirrored user](../images/csp-provisioning.svg)

---

## 4. Phase 2 — Session handoff (every time the user opens the KubeDB console)

The KubeDB Platform's login endpoint sets a **session cookie** plus a `_csrf` cookie. The
trick is that these cookies are obtained by the CSP backend server-to-server, then delivered
to the user's browser so it holds a valid `db.acme.com` session.

### 4.1 The login call

```bash
curl -X POST 'https://db.acme.com/accounts/user/login' \
  -H 'content-type: application/x-www-form-urlencoded' \
  --data-raw 'user_name=acme-user-42&password=<STORED_KUBEDB_PASSWORD>&remember=on' \
  -c cookie.txt -D headers.txt
```

The response's `Set-Cookie` headers (captured above in `headers.txt`, cookies jarred in
`cookie.txt`) contain the session cookie and the `_csrf` cookie. Any **subsequent
server-side API call** made with these cookies must also send the `_csrf` value in the
`X-Csrf-Token` header:

```bash
curl -X GET 'https://db.acme.com/api/v1/user/settings/profile' \
  -H 'Content-Type: application/json' \
  -H 'X-Csrf-Token: <VALUE_OF__csrf_COOKIE>' \
  -b cookie.txt
```

### 4.2 Delivering the cookies to the browser

The CSP backend can log in, but a backend cannot set cookies in the browser for a domain
other than the one that served the response. So the piece that **re-emits** the captured
cookies must run on the KubeDB host itself. Host a small **launch endpoint on the KubeDB
subdomain**, e.g. `https://db.acme.com/csp-sso/launch`, in one of two ways:

- **Reverse proxy** a path prefix (`db.acme.com/csp-sso/*`) on the KubeDB ingress to the CSP
  backend, or
- run a **tiny CSP-owned handler co-located on the subdomain**.

Either way the launch endpoint is same-origin with the KubeDB console, so the `Set-Cookie`
headers it returns are accepted by the browser for `db.acme.com`.

The end-to-end handoff:

1. User is already authenticated on `console.acme.com` and clicks **"Open Databases"**.
2. The CSP console backend mints a **short-lived, single-use handoff token** (signed, ~30 s
   TTL) identifying the CSP user, and redirects the browser to
   `https://db.acme.com/csp-sso/launch?ticket=<handoff-token>`.
3. The launch endpoint validates the ticket, looks up the mapped KubeDB username +
   stored password, and performs the **server-side login** (§4.1).
4. The launch endpoint copies the login response's `Set-Cookie` headers onto its **own
   redirect response** to the browser, then `302`s to `https://db.acme.com/`.
5. The browser now holds a valid KubeDB session cookie for `db.acme.com` and loads the
   KubeDB console fully authenticated — no login prompt.

![Session handoff / login process](../images/csp-session-handoff.svg)

### 4.3 Optional: shared-domain single sign-on

If your KubeDB Platform deployment is configured to set its session cookie with
`Domain=.acme.com` (the shared parent domain) instead of the default host-only cookie, the
same session is valid on **both** `console.acme.com` and `db.acme.com`. In that case the
launch endpoint can set the cookie once and the user moves between the two consoles without
re-handoff. This requires the KubeDB Platform cookie-domain setting; confirm with your
deployment before relying on it. The per-launch flow in §4.2 works regardless and is the
safe default.

---

## 5. Logout

When the user logs out of the CSP console, also terminate the KubeDB session so a shared
browser can't keep the console open. Call the logout route with the user's cookies and CSRF
token:

```bash
curl -X GET 'https://db.acme.com/accounts/user/logout' \
  -H 'Content-Type: application/json' \
  -H 'X-Csrf-Token: <VALUE_OF__csrf_COOKIE>' \
  -b cookie.txt
```

If you use shared-domain SSO (§4.3), clear the `.acme.com` cookie on logout as well.

---

## 6. API summary

| Step | When | Method & path | Auth |
|------|------|---------------|------|
| Create mirrored user | CSP signup (once) | `POST /api/v1/admin/users` | Admin bearer token |
| Sync profile | On CSP profile edit | `POST /api/v1/admin/users/{username}/update` | Admin bearer token |
| Rotate password | On credential rotation | `POST /api/v1/admin/users/{username}/change-password` | Admin bearer token |
| Server-side login | Each console open | `POST /accounts/user/login` (form-encoded) | Mirror user password → sets cookies |
| Authenticated API call | As needed | any `/api/v1/...` | Session cookie + `X-Csrf-Token: <_csrf>` |
| Logout | On CSP logout | `GET /accounts/user/logout` | Session cookie + `X-Csrf-Token: <_csrf>` |

---

## 7. Security checklist

- **Admin bearer token** stays server-side, in a secret manager. Rotate periodically. Its
  compromise means full control of every mirrored user.
- **Stored KubeDB passwords** are internal credentials: generate them randomly (high
  entropy), encrypt at rest, and never expose them to the browser or the end user.
- **Handoff ticket** must be short-lived (seconds), single-use, signed/encrypted, and bound
  to the authenticated CSP session — it is the only thing standing between a URL and a KubeDB
  session. Never put the KubeDB password in the URL.
- **Cookie flags**: ensure the session cookies delivered to the browser are `Secure`,
  `HttpOnly`, and `SameSite=Lax` (Lax suffices because `console.acme.com` → `db.acme.com`
  is same-site and the handoff is a top-level navigation).
- **TLS everywhere**.
- **No 2FA on mirrors** (see §2); enforce MFA in the CSP console instead.
- **Logout propagation** (§5) so a KubeDB session never outlives the CSP session on a shared
  device.
- **Deprovisioning**: when a CSP user is disabled/deleted, disable or delete the mirrored
  KubeDB user via the admin API so access is revoked in both places.
