---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: database-management-create-mongodb
    name: MongoDB
    parent: database-management-create
    weight: 10
menu_name: docsplatform_{{.version}}
section_menu_id: guides
---


# Creating a MongoDB Database

This page covers the configuration specific to **MongoDB** — its **Database Mode** and any engine-specific settings shown below. The rest of the creation flow —
opening the wizard, namespace and name, version, machine profile, storage, and optional
features — is the same for every engine and is documented in [Common Steps](../common-steps.md).

## Database Mode

Select the topology under **Database Mode**. Three modes are available:

- **Standalone** — A single-node database without high availability or sharding. Best for development or low-traffic workloads.
- **Replicated Cluster** — A MongoDB ReplicaSet for high availability.
- **Sharded Cluster** — A fully sharded MongoDB cluster for high performance and high availability.

#### Replicated Cluster

When **Replicated Cluster** is selected, two additional fields appear:

![Replicated Cluster mode selected showing Replicaset Name (rs0) and Replicaset Number (3) fields](../../images/db-create/mongodb/replicaset-mode.png)

| Field | Description |
|---|---|
| **Replicaset Name** | The name for the replica set (e.g., `rs0`). Required. |
| **Replicaset Number** | The number of replica members (e.g., `3`). Required. |
| **mongodb+srv style DNS** | Toggle on to enable `mongodb+srv` connection string support for this replica set. |

#### Sharded Cluster

When **Sharded Cluster** is selected, three subsections appear — **Shard Nodes**, **Config Server**, and **Mongos** — each configurable independently.

![Sharded Cluster mode selected showing Shard Nodes, Config Server, and Mongos collapsible panels](../../images/db-create/mongodb/shard-mode.png)

**Shard Nodes** — Configure how MongoDB data is partitioned, replicated, and resourced across your cluster.

![Shard Nodes panel showing Shards, Replicaset Number, Storage size, Machine, CPU, and Memory fields](../../images/db-create/mongodb/shard-nodes.png)

| Field | Description |
|---|---|
| **Shards** | Number of shard partitions (e.g., `2`). Required. |
| **Replicaset Number** | Number of replicas per shard (e.g., `3`). Required. |
| **Storage size** | Disk size per shard node (e.g., `2Gi`). Required. |
| **Machine** | Preset machine profile or `custom` for manual CPU/memory. |
| **CPU** | CPU request per shard node (e.g., `900m`). |
| **Memory** | Memory request per shard node (e.g., `1Gi`). |

**Config Server** — Stores metadata about the sharded cluster including chunk distribution and shard configuration. Must run as a replica set.

![Config Server panel showing Replicaset Number, Storage size, Machine, CPU, and Memory fields](../../images/db-create/mongodb/config-server.png)

| Field | Description |
|---|---|
| **Replicaset Number** | Number of config server replicas (e.g., `3`). Required. |
| **Storage size** | Disk size per config server node (e.g., `2Gi`). Required. |
| **Machine** | Preset machine profile or `custom`. |
| **CPU** | CPU request (e.g., `800m`). |
| **Memory** | Memory request (e.g., `1Gi`). |

**Mongos** — Acts as the query router for the sharded cluster, directing client requests to the appropriate shards based on metadata from Config Servers.

![Mongos panel showing Replicaset number, Machine, CPU, and Memory fields](../../images/db-create/mongodb/mongos-mode.png)

| Field | Description |
|---|---|
| **Replicaset number** | Number of Mongos router instances (e.g., `2`). Required. |
| **Machine** | Preset machine profile or `custom`. |
| **CPU** | CPU request (e.g., `500m`). |
| **Memory** | Memory request (e.g., `1Gi`). |

## Additional MongoDB Options

| Field | Description |
|---|---|
| **Arbiter** | Toggle on to add an arbiter member (votes in elections but stores no data). Configure its pod resources. |
| **Hidden Node** | Toggle on to add hidden replica members (replicate data but are invisible to clients). Set **Replicas**, resources, and storage. |
| **HostName / IP** | Optional host name and IP used to build the connection string and certificate SANs. |

## Create a MongoDB Database

1. Open the wizard and select **MongoDB** — see [Getting Started](../common-steps/#1-getting-started) and [Select a Database Type](../common-steps/#2-select-a-database-type).
1. Set the [namespace and name](../common-steps/#3-choose-namespace-and-name).
1. Pick the database version and the **Database Mode** described above, then set the machine profile and storage — see [Configure the Database](../common-steps/#4-configure-the-database).
1. Optionally configure [Advanced Configuration](../common-steps/#5-advanced-configuration) (labels, deletion policy, credentials, point-in-time recovery) and [Additional Options](../common-steps/#6-additional-options) (monitoring, backup, TLS, gateway).
1. Click [**Deploy**](../common-steps/#7-deploy).
