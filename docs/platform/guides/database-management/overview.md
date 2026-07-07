---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: database-management-overview
    name: Overview
    parent: database-management
    weight: 10
menu_name: docsplatform_{{.version}}
section_menu_id: guides
---

## Overview <br>

**Database Management** is where you operate the databases provisioned through KubeDB Platform after they've been created. It brings the day-2 operational tasks — scaling, backup, restore, version upgrades, reconfiguration, TLS, monitoring, and more — into a single, per-database console so you don't need to reach for `kubectl` or hand-craft custom resources for routine work.

**Target Audience:** This guide is intended for `database administrators` and `operators` responsible for the ongoing health, availability, and data protection of databases running on KubeDB Platform.

![Database overview page showing status, resource usage, and available operations](../images/db-overview.png)

### Key Sections

- **[Database Usage & Insights](../database-usage-insight.md):** Monitor resource consumption and get at-a-glance health information for a database.
- **[Scaling Databases](../scaling.md) / [Scaling Storages](../scaling-storage.md):** Adjust CPU, memory, replica count, or storage size — manually or through autoscaling policies.
- **[Configure Backups](../backup.md), [Instant Backup & Restore](../instant-backup-restore.md), [Backup Restore](../restore.md):** Set up scheduled backups, trigger on-demand backups, and restore data when needed.
- **[Upgrade Database Version](../upgrade-version.md), [Database Restarts](../restart-database.md), [Reconfigure Databases](../reconfigure-database.md):** Perform version upgrades, restarts, and configuration changes with minimal disruption.
- **[Configure TLS](../tls.md), [Configure Monitoring](../monitoring.md), [Expose via Gateway](../expose-via-gateway.md):** Secure connections, enable Prometheus-based monitoring, and expose databases outside the cluster.
- **[Manage Recommendations](../manage-recommendations.md), [Database Security Report](../security-report.md), [Database Constraint Violations](../contraint-violations.md):** Review platform-generated recommendations and compliance findings for a database.
- **[Delete Database](../delete-database.md):** Safely remove a database and its associated resources.

Each operation is exposed as a dedicated form or panel in the left sidebar of a database's detail page. Under the hood, most actions are translated into Kubernetes `OpsRequest` custom resources, so every change is applied declaratively and can be tracked through its lifecycle — giving you the convenience of a UI with the auditability of GitOps-style operations.
