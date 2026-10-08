---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: hub-ui-featuresets
    name: Hub & Spoke Feature Sets
    parent: hub-ui
    weight: 75
menu_name: docsplatform_{{.version}}
section_menu_id: guides
---



# Hub & Spoke Feature Sets

A **Feature Set** is a group of product capabilities (for example Backup & Recovery or Databases) that you can enable on a cluster. In a Hub UI setup, the same feature set can be enabled in two different scopes, so first decide **which cluster should get the feature**, then follow the matching steps below.

* **Hub cluster**: the central cluster that manages the others. See [Introduction](../hub-ui/introduction.md).
* **Spoke cluster**: a cluster connected to the hub and managed from it. Spokes run your workloads.
* **ClusterSet**: a named group of spoke clusters. Spoke feature sets are enabled per ClusterSet, not per individual spoke. See [Cluster & Clusterset](../hub-ui/cluster-and-clusterset.md).

## Which cluster should I enable it on?

| If the feature... | Enable it on | Why |
|---|---|---|
| Is needed by the central management cluster itself | **Hub** | Hub feature sets affect only the hub cluster |
| Must be present on the clusters that run your workloads | **Spokes** (via a ClusterSet) | One change is applied to every spoke in the ClusterSet |
| Is needed on some spokes but not others | **Spokes**, using separate ClusterSets | The scope is the whole ClusterSet, so group spokes by the features they need |
| Is needed on both the hub and the spokes | **Both**, separately | Enabling it on one does not enable it on the other |

Examples:

* Backup & Recovery for the hub's own data: enable on the **hub**.
* Config Syncer on every spoke in `prod-set`: enable on the **`prod-set` ClusterSet**.
* Config Syncer only on `prod-set` and not on `dev-set`: enable it on `prod-set` and leave `dev-set` unchanged.

> **Tip:** Keep spokes in a ClusterSet that share the same feature needs, for example one set for production and one for development. Enabling a feature then never turns it on for a cluster that should not have it.

## Hub vs Spoke at a glance

| | Hub feature sets | Spoke feature sets |
|---|---|---|
| Applies to | The hub cluster only | Every spoke in the selected ClusterSet |
| Where to open it | Hub cluster → **Overview** → **Feature Sets** | Hub UI → hub **Overview** → **Cluster Sets** → *ClusterSet* → *feature set* |
| Example | Enable Backup & Recovery on the hub | Enable Config Syncer on all spokes in `prod-set` |

---

## Enable a feature on the hub cluster

1. Open your hub cluster. The **Overview** page has a **Feature Sets** section.
2. Select the feature set you want, for example **Backup & Recovery**.
3. On that feature set's page, enable and configure the features you need.

![Feature Sets grid on the Overview page](../images/cluster-features/features.png)

The full enable flow is the same as for any cluster. See [Manage Feature Sets](../cluster-features.md) and [Cluster Overview](../cluster-overview.md).

---

## Enable a feature on spoke clusters

Spoke feature sets are managed from the hub, per ClusterSet.

1. Open the hub in the Hub UI. The **Overview** page has a **Cluster Sets** section with one card per ClusterSet, showing its name and **Number of Managed Cluster**. Click the ClusterSet that contains your spokes.

   ![Cluster Sets section on the hub Overview page](../images/cluster_and_clusterset/clustersets.png)

2. The ClusterSet's **Feature Sets** page lists every feature set with an **Installed** or **Not Installed** badge. Below the cards, **All cluster overview** and the **Cluster list** show the spokes in this ClusterSet. Click the feature set you want, for example **Secret Management** (**Not Installed**).

   ![Feature Sets page of a ClusterSet](../images/cluster_and_clusterset/cluster_set_feature_1.png)

3. The feature set page lists its **Components**, for example Config Syncer, External Secrets and Reloader. Click **Enable** at the top right.

   ![Secret Management feature set before enabling](../images/cluster_and_clusterset/enable_feature.png)

4. On the **Configure** page, tick the components you want to install. Enabling a component also enables any prerequisite components it needs. Click **Preview**, or **Cancel** to go back without changes.

   ![Select the components to install](../images/cluster_and_clusterset/select_feature.png)

5. **Preview** shows the `helm_release.yaml` that will be applied, in **YAML** or **JSON** with a **Copy** button. Review it, then click **Submit**. Click **Previous** to change your selection.

   ![Preview of the generated helm release](../images/cluster_and_clusterset/preview_feature.png)

6. After a successful submit, the feature set page shows **Configure** and **Disable** in place of **Enable**. Use **Configure** to change the selected components later. Each enabled component is marked with a green check, for example **Config Syncer**.

   ![Feature set after it is enabled](../images/cluster_and_clusterset/enabled_feature.png)

The **Out of sync & Unaligned clusters** table at the bottom of the page lists the spokes in the ClusterSet with two columns:

| Column | Meaning |
|---|---|
| **Additional feature list** | Features enabled on the spoke but not on the hub (unaligned) |
| **Out of sync feature list** | Hub features that have not been applied to the spoke yet |

A `-` in both columns means the spoke matches the hub. **No Data Available** (as before you enable) means there is nothing to compare yet. The change applies to all spoke clusters in the ClusterSet. See [Cluster & Clusterset](../hub-ui/cluster-and-clusterset.md).

> **Note:** Do not manage feature sets directly on a spoke cluster. Make feature changes from the hub so the two stay in sync.

---

## Quick reference

| I want to... | Go to |
|---|---|
| Enable a feature on the hub | Hub cluster → Overview → Feature Sets → *feature set* |
| Enable a feature on all spokes in a group | Hub UI → hub Overview → Cluster Sets → *ClusterSet* → *feature set* → Enable |
| Check whether spokes match the hub | ClusterSet → *feature set* → Out of sync & Unaligned clusters table |


