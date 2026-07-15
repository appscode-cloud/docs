---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: database-management-create-api-mongodb
    name: MongoDB
    parent: database-management-create-api
    weight: 10
menu_name: docsplatform_{{.version}}
section_menu_id: guides
---

# Creating a MongoDB Database via API

This page walks through the API calls needed to provision a MongoDB database, equivalent
to using the **Create Database** wizard in the UI at
`/db/<org>/<cluster>/kubedb.com/v1/mongodbs/create`. See
[Using the API](../_index.md) for the general 3-call flow and
[MongoDB](../../mongodb.md) for the Database Mode options this flow configures.

**Example values used throughout**: namespace `demo`, database name `mgc`, MongoDB version
`8.0.17`, 3-replica replica set, `900m` CPU / `1Gi` memory per node, `2Gi` storage on
`local-path` storage class. Swap these for your own.

---

## 1. Get Default Form Values

```bash
curl -sk "$BASE_URL/helm/packageview/values" \
  -H "Cookie: $COOKIE" -H "x-csrf-token: $CSRF" \
  --get \
  --data-urlencode "name=kubedbcom-mongodb-editor-options" \
  --data-urlencode "sourceApiGroup=source.toolkit.fluxcd.io" \
  --data-urlencode "sourceKind=HelmRepository" \
  --data-urlencode "sourceNamespace=kubeops" \
  --data-urlencode "sourceName=appscode-wizards-oci" \
  --data-urlencode "version=v0.35.0" \
  --data-urlencode "group=kubedb.com" \
  --data-urlencode "kind=MongoDB" \
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
    "resource": { "group": "kubedb.com", "kind": "MongoDB", "version": "v1alpha2" }
  },
  "spec": {
    "admin": { "databases": { "MongoDB": { "versions": { "default": "", "available": [] } } } },
    "mode": "Replicaset",
    "podResources": { "machine": "", "resources": { "requests": { "cpu": "900m", "memory": "1Gi" } } },
    "persistence": { "size": "2Gi" },
    "storageClasses": null,
    "replicaSet": { "name": "rs0", "replicas": 3 }
  }
}
```

Fields like `spec.admin.databases.MongoDB.versions.default` and `spec.storageClasses` come
back empty/null — the defaults don't pick a version or storage class for you. Set your
preferred values in these fields (version, storage class, mode, replicas, resources,
storage size) before passing the config to call 2.

> `spec.mode` also accepts `Standalone` and `Sharded` — see
> [MongoDB Database Mode](../../mongodb/#database-mode) for the fields each mode adds
> (e.g. `Sharded` needs shard/config-server/mongos sections instead of `replicaSet`).

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
    "release": { "name": "mgc", "namespace": "demo" }
  },
  "spec": {
    "mode": "Replicaset",
    "replicaSet": { "name": "rs0", "replicas": 3 },
    "podResources": {
      "resources": { "requests": { "cpu": "900m", "memory": "1Gi" }, "limits": { "cpu": "900m", "memory": "1Gi" } }
    },
    "persistence": { "size": "2Gi" }
  }
}
```

`spec.admin.databases.MongoDB.versions.default` in the same body controls the version
(e.g. `"8.0.17"`).

**Example response** (trimmed):

```json
{
  "form": { "...": "echoes back your form, resolved" },
  "resources": {
    "kubedbComMongoDB": {
      "apiVersion": "kubedb.com/v1",
      "kind": "MongoDB",
      "spec": {
        "replicas": 3,
        "replicaSet": { "name": "rs0" },
        "storage": { "storageClassName": "local-path", "resources": { "requests": { "storage": "2Gi" } } },
        "version": "8.0.17"
      }
    },
    "autoscalingKubedbComMongoDBAutoscaler": { "...": "rendered autoscaler CR" },
    "catalogAppscodeComMongoDBBinding": { "...": "rendered binding CR" },
    "coreKubestashComBackupConfiguration": { "...": "rendered backup config CR" }
  }
}
```

This is the key thing to check before submitting: `resources.kubedbComMongoDB` is exactly
what call 3 will apply.

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

- `kubedbComMongoDB` — the MongoDB custom resource itself
- `autoscalingKubedbComMongoDBAutoscaler` — autoscaler config
- `catalogAppscodeComMongoDBBinding` — service binding for the UI
- `coreKubestashComBackupConfiguration` — backup schedule/config

A `200` response means the database (and its autoscaler/binding/backup config) has been
created. Confirm with:

```bash
curl -sk "$BASE_URL/proxy/kubedb.com/v1alpha2/namespaces/demo/mongodbs/mgc" \
  -H "Cookie: $COOKIE" -H "x-csrf-token: $CSRF"
```
