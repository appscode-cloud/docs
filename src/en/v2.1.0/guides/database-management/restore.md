---
layout: 'guide'
menu:
  v2_1_0_docs_menu:
    identifier: database-management-restore
    name: Backup Restore
    parent: database-management
    weight: 140
  home_menu:
    identifier: home-database-restore
    name: Restore
    parent: home-database
    weight: 140
menu_name: v2_1_0_docs_menu
section_menu: guides
---


# Restore

This guide explains how to view and create **Restore** resources using the AppsCode console. A Restore represents a database recovery operation that restores data from a previously captured snapshot or backup to a target database instance.

---

## 1. Getting Started

Navigate to **Backups** in the left sidebar and select **Restore**. This opens the Restore list page showing all restore operations across your cluster.

---

## 2. Restore List

The list page displays all Restore resources in your cluster, including both scheduled and manually triggered restores. Use the **Select Namespace** dropdown to filter by namespace.

![Restore list page showing restore operations with Name, Namespace, Target, Task, Repository, Snapshot, Total components, Duration, Phase, and Age columns](./images/backup/restore-overview.png)

| Column | Description |
|---|---|
| **Name** | The Restore resource name. |
| **Namespace** | The namespace where it is deployed. |
| **Target** | The target database instance being restored to. |
| **Task** | The restore task type executed (e.g., `logical-restore`). |
| **Repository** | The repository containing the source snapshot. |
| **Snapshot** | The snapshot being restored from. |
| **Total components** | Number of database components being restored. |
| **Duration** | Elapsed time for the restore operation. |
| **Phase** | Current status (e.g., `Succeeded`, `Running`, `Failed`). |
| **Age** | How long ago the Restore was created. |

---

## 3. Viewing a Restore

Click on any Restore name in the list to open its detail page. The detail page shows the restore's metadata, source snapshot, and target database information.

### 3.1 - Overview

The detail page opens on the **Overview** tab showing:

![Restore detail page showing Basic info, Source Snapshot table, and Target Database information](./images/backup/restore-db-overview.png)

**Basic** — Core metadata for the restore operation:

| Field | Description |
|---|---|
| **Name** | The Restore resource name. |
| **Namespace** | The namespace it belongs to. |
| **Labels** | Key-value labels attached to the resource. |
| **Annotations** | Key-value annotations linking to source and target resources. |
| **UID** | The unique Kubernetes identifier. |
| **Phase** | Current lifecycle phase (e.g., `Succeeded`, `Running`, `Failed`). |
| **Duration** | Total time taken to complete the restore operation. |

**Source Snapshot** — Information about the snapshot being restored:

| Column | Description |
|---|---|
| **Name** | The Snapshot resource name. |
| **Namespace** | Namespace of the snapshot. |
| **Repository** | The repository containing this snapshot. |
| **Size** | Size of the snapshot data. |
| **Creation Timestamp** | When the snapshot was created. |
| **Status** | Verification status of the snapshot. |

**Target Database** — The database instance being restored to:

| Column | Description |
|---|---|
| **Kind** | The database resource type (e.g., `MongoDB`). |
| **Namespace** | Namespace of the target database. |
| **Name** | The target database instance name. |
| **Status** | Current status of the target database. |

---

## 4. Creating a Restore

To manually trigger a restore operation, click **Create New Instance** from the Restore list page.

The **Create Restore** form will open with the following fields:

![Create Restore form showing Namespace, Labels & Annotations, Source Snapshot, and Target Database sections](./images/backup/restore-create-overview.png)

### 4.1 - Basic Fields

![Create Restore form showing all required and optional fields](./images/backup/restore-create-form.png)

| Field | Description |
|---|---|
| **Namespace** | The Kubernetes namespace where the Restore resource will be created. Required. |
| **Labels & Annotations** | Optional metadata key-value pairs for organization and filtering. |
| **Restore Name** | A unique name for this Restore operation (e.g., `mongodb-restore-001`). Required. |

### 4.2 - Labels & Annotations

Use the **Labels & Annotations** section to attach custom metadata:

- Use **+ Add new** under **Labels** to add key-value label pairs.
- Use **+ Add new** under **Annotations** to add key-value annotation pairs.
- Use the delete icon on any row to remove an entry.

### 4.3 - Source Snapshot Configuration

The **Source Snapshot** section specifies which backup snapshot to restore from.

![Source Snapshot panel showing Repository Namespace/Name and Snapshot Name fields](./images/backup/restore-config.png)

| Field | Description |
|---|---|
| **Repository Namespace** | The namespace of the Repository resource. Required. |
| **Repository Name** | The name of the Repository containing the snapshot. Required. |
| **Snapshot Name** | The name of the Snapshot to restore from. Required. |

### 4.4 - Target Database Configuration

The **Target Database** section identifies where the data will be restored.

![Target Database panel showing Api Group, Kind, Namespace, and Name fields](./images/backup/restore-target.png)

| Field | Description |
|---|---|
| **Api Group** | The API group of the target resource (e.g., `kubedb.com`). Required. |
| **Kind** | The resource kind of the target database (e.g., `MongoDB`). Required. |
| **Namespace** | The namespace where the target database resides. Required. |
| **Name** | The name of the target database instance. Required. |

> **Note:** All four Target fields are required. The target database must exist and be in a ready state before the restore begins.

---

## 5. Preview and Submit

Once all required fields are filled, click **Preview** to review the generated `Restore` manifest before applying it.

- The manifest is shown in **YAML** view by default. Use the **JSON** button to switch to JSON format if preferred.
- Use the **Copy** button to copy the manifest to your clipboard.
- Click **Previous** to go back and adjust your settings if needed.

> **Tip:** You can directly edit the YAML or JSON on the Preview page before submitting. This is useful for making precise adjustments beyond what the form fields expose.

1. **Submit:** Once satisfied, click **Submit** to create the Restore and begin the restoration process.

> **Note:** After submitting, the restore operation will begin immediately. Monitor the restore status on the detail page. The target database will be updated with the restored data once the operation completes successfully.

---

## Quick Reference

| Action | How to do it |
|---|---|
| View all Restores | **Backups** → **Restore** |
| Filter by namespace | Use the **Select Namespace** dropdown on the list page |
| View restore detail | Click on the Restore name in the list |
| Check restore phase | Detail page → **Basic** section → **Phase** field |
| Check restore duration | Detail page → **Basic** section → **Duration** field |
| View source snapshot | Detail page → **Source Snapshot** table |
| View target database | Detail page → **Target Database** table |
| Open the create form | List page → **Create New Instance** |
| Add labels or annotations | **Labels & Annotations** → **+ Add new** → enter Key and Value |
| Select source snapshot | **Source Snapshot** → set Repository Namespace, Name, and Snapshot Name |
| Set restore target | **Target Database** → fill Api Group, Kind, Namespace, and Name |
| Review before creating | Click **Preview** |
| Edit manifest directly | Use the **YAML** / **JSON** toggle on the Preview page |
| Start a restore operation | Click **Submit** on the Preview page |
