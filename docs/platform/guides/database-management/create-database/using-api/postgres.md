---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: database-management-create-api-postgres
    name: PostgreSQL
    parent: database-management-create-api
    weight: 20
menu_name: docsplatform_{{.version}}
section_menu_id: guides
---

# Creating a PostgreSQL Database via API

This page walks through the API calls needed to provision a PostgreSQL database,
equivalent to using the **Create Database** wizard in the UI at
`/db/<org>/<cluster>/kubedb.com/v1/postgreses/create`. See
[Using the API](../_index.md) for the general 3-call flow and
[PostgreSQL](../../postgres.md) for the Database Mode options this flow configures.

**Example values used throughout**: namespace `demo`, database name `pgc`, PostgreSQL
version `18.3-bookworm`, `Cluster` mode, 3 replicas, `500m` CPU / `1Gi` memory per node,
`2Gi` storage on `local-path` storage class. Swap these for your own.

---

## 1. Get Default Form Values

```bash
curl -sk "$BASE_URL/helm/packageview/values" \
  -H "Cookie: $COOKIE" -H "x-csrf-token: $CSRF" \
  --get \
  --data-urlencode "name=kubedbcom-postgres-editor-options" \
  --data-urlencode "sourceApiGroup=source.toolkit.fluxcd.io" \
  --data-urlencode "sourceKind=HelmRepository" \
  --data-urlencode "sourceNamespace=kubeops" \
  --data-urlencode "sourceName=appscode-wizards-oci" \
  --data-urlencode "version=v0.35.0" \
  --data-urlencode "group=kubedb.com" \
  --data-urlencode "kind=Postgres" \
  --data-urlencode "variant=default" \
  --data-urlencode "namespace=demo" \
  --data-urlencode "format=json"
```

> The `version` query param (`v0.35.0` above) is the wizard chart version — it gets bumped
> by 1 with each kubedb-platform release.

**Example response** (trimmed):

```json
{
  "form": {
    "alert": { "enabled": "critical", "groups": { "...": "..." } }
  },
  "metadata": {
    "release": { "name": "", "namespace": "demo" },
    "resource": { "group": "kubedb.com", "kind": "Postgres", "name": "postgreses", "scope": "Namespaced", "version": "v1alpha2" }
  },
  "spec": {
    "admin": { "databases": { "Postgres": { "mode": { "default": "Cluster" }, "versions": { "default": "18.3-bookworm", "available": [] } } } },
    "mode": "Cluster",
    "replicas": 3,
    "podResources": { "machine": "custom", "resources": { "requests": { "cpu": "500m", "memory": "1Gi" } } },
    "persistence": { "size": "2Gi" },
    "storageClasses": null
  }
}
```

Fields like `spec.admin.databases.Postgres.versions.available` and `spec.storageClasses`
come back empty/null — the defaults don't pick a storage class for you. Set your preferred
values in these fields (version, storage class, mode, replicas, resources, storage size)
before passing the config to call 2.

---

## 2. Render the Values Model (Dry-Run)

Take the `form` object from call 1, fill in your choices, and submit it here. No database
is created yet — this only validates and renders the config.

```bash
curl -sk -X PUT "$BASE_URL/helm/options/model" \
  -H "Cookie: $COOKIE" -H "x-csrf-token: $CSRF" -H "content-type: application/json" \
  --data-binary @request-model.json
```

Key fields to change per deployment, in the request body:

```json
{
  "metadata": {
    "release": { "name": "pgc", "namespace": "demo" }
  },
  "spec": {
    "mode": "Cluster",
    "replicas": 3,
    "podResources": {
      "resources": { "requests": { "cpu": "500m", "memory": "1Gi" }, "limits": { "cpu": "500m", "memory": "1Gi" } }
    },
    "persistence": { "size": "2Gi" }
  }
}
```

`spec.admin.databases.Postgres.versions.default` in the same body controls the version
(e.g. `"18.3-bookworm"`).

**Example response** (trimmed):

```json
{
  "form": { "...": "echoes back your form, resolved" },
  "resources": {
    "kubedbComPostgres": {
      "apiVersion": "kubedb.com/v1",
      "kind": "Postgres",
      "spec": {
        "mode": "Cluster",
        "replicas": 3,
        "storage": { "storageClassName": "local-path", "resources": { "requests": { "storage": "2Gi" } } },
        "version": "18.3-bookworm"
      }
    },
    "autoscalingKubedbComPostgresAutoscaler": { "...": "rendered autoscaler CR" },
    "catalogAppscodeComPostgresBinding": { "...": "rendered binding CR" }
  }
}
```

This is the key thing to check before submitting: `resources.kubedbComPostgres` is exactly
what call 3 will apply.

> Unlike the MongoDB flow, this response has no `coreKubestashComBackupConfiguration` entry
> under `resources` unless you enable backup in the form (see
> [Additional Options](../../common-steps/#6-additional-options)) — enable it if you want a
> `BackupConfiguration` created alongside the database.

---

## 3. Submit — Creates the Database

```bash
RESPONSE_ID=$(uuidgen)
curl -sk -X PUT "$BASE_URL/helm/editor?response-id=$RESPONSE_ID" \
  -H "Cookie: $COOKIE" -H "x-csrf-token: $CSRF" -H "content-type: application/json" \
  --data-binary @request-editor.json
```

`response-id` is any UUID you generate client-side — the server doesn't validate it against
earlier calls, it's only used to correlate this request with a response/progress stream.

The body is the same `form`/`metadata` as call 2, plus the `resources` map from call 2's
response — the fully rendered manifests that get applied via Helm:

- `kubedbComPostgres` — the Postgres custom resource itself
- `autoscalingKubedbComPostgresAutoscaler` — autoscaler config
- `catalogAppscodeComPostgresBinding` — service binding for the UI

A `200` response means the database (and its autoscaler/binding config) has been created.
Confirm with:

```bash
curl -sk "$BASE_URL/proxy/kubedb.com/v1alpha2/namespaces/demo/postgreses/pgc" \
  -H "Cookie: $COOKIE" -H "x-csrf-token: $CSRF"
```
