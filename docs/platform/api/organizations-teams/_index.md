---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: api-organizations-teams
    name: Identity: Organizations & Teams
    parent: api
    weight: 20
menu_name: docsplatform_{{.version}}
section_menu_id: api
---

# Identity: Organizations & Teams

APIs for organizations and the teams inside them. Organizations own clusters,
contracts, and billing scope; teams provide per-org grouping with role-based
permissions. All authorization checks are OpenFGA-backed (relationship-based), so
access to each endpoint depends on the caller's role in the organization or team.

All routes are served under the `/api/v1` prefix. Most endpoints authenticate with a
personal access token sent as `Authorization: token <YOUR_TOKEN>` (it may also be
supplied as a `token` or `access_token` query parameter). A few read endpoints are
public (no auth) and return only what an anonymous caller may see — this is called
out per endpoint.

## Pages

- [Organizations](../organizations-teams/organizations.md) — the `/api/v1/orgs/*`
  endpoints: create/claim organizations, get/edit/delete an org, ownership and
  membership checks, member management, avatars, Rancher sync/user tokens, and org
  access/NATS tokens.
- [Teams](../organizations-teams/teams.md) — the `/api/v1/orgs/{orgname}/teams` and
  `/api/v1/teams/{teamid}/*` endpoints: list/create teams, team actions, and team
  member management.
