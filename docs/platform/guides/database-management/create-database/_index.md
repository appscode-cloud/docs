---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: database-management-create
    name: Creating a Database
    parent: database-management
    weight: 10
menu_name: docsplatform_{{.version}}
section_menu_id: guides
---

# Creating a Database

Creating a database is a multi-step wizard: select a database engine, set a name and
namespace, configure topology and resources, and enable optional features like
monitoring, TLS, and backups.

The overall flow is the same for every engine and is documented once in
[**Common Steps**](common-steps.md). Where it differs is the **Database Mode** (topology)
and a handful of engine-specific settings — pick your engine below for a guide tailored to
it, then follow the common steps for everything else.

---

## Supported Engines

### Relational
- [PostgreSQL](postgres.md)
- [MySQL](mysql.md)
- [MariaDB](mariadb.md)
- [Percona XtraDB](perconaxtradb.md)
- [Microsoft SQL Server](mssqlserver.md)
- [Oracle](oracle.md)
- [SingleStore](singlestore.md)
- [IBM Db2](db2.md)
- [SAP HANA](hanadb.md)

### Document & Search
- [MongoDB](mongodb.md)
- [Elasticsearch](elasticsearch.md)
- [Solr](solr.md)
- [DocumentDB](documentdb.md)

### Key-Value & Cache
- [Redis](redis.md)
- [Memcached](memcached.md)
- [Ignite](ignite.md)
- [Hazelcast](hazelcast.md)

### Vector
- [Qdrant](qdrant.md)
- [Milvus](milvus.md)
- [Weaviate](weaviate.md)

### Wide-column & Time-series
- [Cassandra](cassandra.md)
- [ClickHouse](clickhouse.md)
- [Druid](druid.md)

### Streaming & Messaging
- [Kafka](kafka.md)
- [RabbitMQ](rabbitmq.md)

### Graph
- [Neo4j](neo4j.md)

### Coordination
- [ZooKeeper](zookeeper.md)

### Connection Poolers & Proxies
- [PgBouncer](pgbouncer.md)
- [Pgpool](pgpool.md)
- [ProxySQL](proxysql.md)
