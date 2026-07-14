---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: api-organizations-teams-overview
    name: Overview
    parent: api-organizations-teams
    weight: 5
menu_name: docsplatform_{{.version}}
section_menu_id: api
---

# Identity: Organizations & Teams — Overview

Organizations own clusters, contracts, and billing scope. Teams provide per-org grouping with
role-based permissions (all checks are OpenFGA-backed).

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/orgs` | Token | Create an organization |
| PATCH | `/api/v1/orgs/claim/:claimID` | Token; AppsCode-hosted | Claim a standalone (marketplace) organization |
| GET | `/api/v1/orgs/claim/` | Site admin; marketplace/dev mode | Get standalone-org claim ID |
| GET | `/api/v1/orgs/:orgname` | Org context | Get organization details |
| PATCH | `/api/v1/orgs/:orgname` | Token + authzCheck(edit:org) | Edit an organization |
| DELETE | `/api/v1/orgs/:orgname` | Token + authzCheck(delete:org) | Delete an organization |
| GET | `/api/v1/orgs/:orgname/user/:username` | Org context | Check if a user exists in the org |
| GET | `/api/v1/orgs/:orgname/is-owner` | Org context | Check if requester is org owner |
| GET/POST | `/api/v1/orgs/:orgname/avatar/`, POST `/avatar/delete` | authzCheck(view/update/delete:avatar) | Manage org avatar |
| GET | `/api/v1/orgs/:orgname/members` | Org context | List members |
| POST | `/api/v1/orgs/:orgname/members/action/:action` | Org membership | Member actions (invite, etc.) |
| GET | `/api/v1/orgs/:orgname/members/:username` | Org context | Check membership |
| DELETE | `/api/v1/orgs/:orgname/members/:username` | Org ownership + authzCheck(admin:org) | Remove a member |
| GET | `/api/v1/orgs/:orgname/public_members`, `/:username` | Org context | Public membership info |
| PUT/DELETE | `/api/v1/orgs/:orgname/public_members/:username` | Org membership | Publicize / conceal membership |
| GET/POST | `/api/v1/orgs/:orgname/teams` | Org membership + authz | List / create teams |
| POST | `/api/v1/orgs/:orgname/teams/:teamid/action/:action` | Org membership + authz | Team actions |
| GET/POST/DELETE | `/api/v1/orgs/:orgname/rancher/sync-token` | authzCheck(sync-token perms) | Manage Rancher org sync token |
| GET/POST/DELETE | `/api/v1/orgs/:orgname/rancher/user-token` | authzCheck (deprecated) | Manage Rancher user token |
| GET | `/api/v1/orgs/:orgname/tokens/access-tokens/` | authzCheck(list:access-token) | List org access tokens |
| DELETE | `/api/v1/orgs/:orgname/tokens/access-tokens/:id` | authzCheck(delete:access-token) | Delete org access token |
| GET | `/api/v1/orgs/:orgname/tokens/nats-tokens/` | authzCheck(list:nats-token) | List org NATS tokens |
| POST | `/api/v1/orgs/:orgname/tokens/nats-tokens/:id/revoke` | authzCheck(revoke:nats-token) | Revoke org NATS token |
| GET/PATCH/DELETE | `/api/v1/teams/:teamid` | authzCheck(view/edit/delete:team) | Manage a team |
| GET | `/api/v1/teams/:teamid/members`, `/:username` | authzCheck(view) | List / get team members |
| PUT/DELETE | `/api/v1/teams/:teamid/members/:username` | authzCheck(add/remove:team-member) | Add / remove team member |

## Reference pages

- [Organizations](../organizations.md)
- [Teams](../teams.md)
