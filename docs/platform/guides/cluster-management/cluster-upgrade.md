---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: cluster-upgrade
    name: Upgrade ACE Clusters
    parent: cluster-management
    weight: 15
menu_name: docsplatform_{{.version}}
section_menu_id: guides
---

# Upgrade the KubeDB Platform: Management, Imported, and Spoke Clusters

This guide is the standard procedure for moving a self-hosted **KubeDB Platform** deployment to a new release. It covers upgrading every cluster tier, the checks to run before and after the upgrade, and how to recover from common problems.

## Cluster tiers

| Tier | What it is | Where you upgrade it |
|---|---|---|
| **Management (hub) cluster** | The cluster that runs the KubeDB Platform itself (the `ace-installer` release and the `ace` namespace). | **Platform UI → Site Administration → ACE Upgrade** |
| **Imported cluster** | A cluster imported directly into the platform, without a hub. | **Console → cluster → Settings → Update Version** |
| **Spoke cluster** | A cluster joined to a hub and grouped in a **ClusterSet**. | **Hub UI → ClusterSet → spoke → Update**, then **Update Cluster Set** |

See [Cluster Types & Feature Sets](../hub-and-spoke-featuresets.md) if you are not sure which tier a cluster belongs to.

## Upgrade order

The order matters. Always upgrade in this sequence:

1. Run the [pre-upgrade checks](#pre-upgrade-checks) and fix anything that is not healthy.
2. [Upgrade the management cluster](#step-1-download-the-new-installer-values-file).
3. [Upgrade imported clusters](#step-3-upgrade-imported-clusters) and [Upgrade spoke clusters](#step-4-upgrade-spoke-clusters), one by one.
4. [Update each ClusterSet](#step-5-update-the-clusterset) after all of its spokes are upgraded.
5. Run the [post-upgrade validation](#post-upgrade-validation).



```
appscode.com → Installer → Upgrade → Download values file
        ↓
Platform UI → Site Administration → ACE Upgrade → Update Version
(management cluster)
        ↓
Console → Imported cluster → Settings → Update Version       
(each imported cluster)
        ↓
Hub UI → ClusterSet → Spoke → Update                   
(each spoke cluster)
        ↓
Hub UI → ClusterSet → Update Cluster Set                     
(each ClusterSet)
        ↓
Post-upgrade validation: helm list -A
```

---

## Prerequisites

- You can log in to [appscode.com](https://appscode.com) and switch to the organization that owns the installer.
- You are a site administrator of the KubeDB Platform.
- You have a working kubeconfig with cluster-admin access to the management cluster and to every imported and spoke cluster you plan to upgrade.
- You know the current version and the target version.
- You have a recent backup of the platform database (`ace-db`). The platform archives it continuously when backup is configured; confirm the latest backup succeeded before you start.

---

## Pre-upgrade checks

Do not start an upgrade on an unhealthy platform. A release that is already failing will block the upgrade and is harder to diagnose afterwards.

### Record the current version

1. Log in to [appscode.com](https://appscode.com) and switch to your organization.
2. Open your installer and click **View Details**.
3. Note the **current version** and confirm the **target version**.

![Installer details showing the current release and the available Upgrade action](../images/upgrade/installer-view-details.png)

### Check the management cluster

Run these against the management cluster:
Confirm current Helm release versions on the management cluster.

```bash
helm list -A | grep ace-installer
helm list -A | grep opscenter-features

kubectl get hr -n kubeops
kubectl get hr ace -n kubeops -o jsonpath='{.spec.chart.spec.version}{"\n"}'
```

Every HelmRelease should report `READY` as `True`. The last command prints the chart version of the `ace` HelmRelease, which should match the current version you recorded.

### Check spoke clusters

On the management cluster, list the ManagedClusterProfileBinding of every spoke:

```bash
kubectl get managedclusterprofilebinding -A
```

```text
NAMESPACE      NAME           STATUS   CURRENT VERSION   AGE
ace-spoke      ace-spoke               v2026.10.30       4d21h
remove-fix-1   remove-fix-1            v2026.10.30       88m
remove-fix-2   remove-fix-2            v2026.10.30       27m
```

The `CURRENT VERSION` column shows the version each spoke is running. Note every spoke that is not on the current version.

### Check imported clusters

Run this against each imported cluster:

```bash
kubectl get hr -A
```

All HelmReleases should be `Ready`.

---

## Step 1: Download the new installer values file

1. On the installer page at [appscode.com](https://appscode.com), click **Upgrade to <x.y.z>**, the target version.
2. Wait for the installer page to show the target version.
3. Click **Download** and save the values file.

![Installer version history showing the target release and the Download button](../images/upgrade/installer-download.png)

Optional: Review the file before you apply it:

```bash
cat ~/Downloads/<target-version>.values.yaml
```

---

## Step 2: Upgrade the management cluster

### Apply the upgrade from the Platform UI

1. Log in to your self-hosted KubeDB Platform. If you are in the **Console UI**, switch to the **Platform UI**.
2. Open your organization and go to **Site Administration → ACE Upgrade**.
3. Click **Upgrade Version** and select the values file you downloaded in Step 1.
4. Click **Update Version**.

The page shows the current version and the version being installed. The platform starts a Kubernetes Job that upgrades the `ace-installer` release, which then rolls the HelmReleases forward one by one.

### Monitor the upgrade

On the management cluster:

```bash
# Monitor the upgrade job on the management cluster
kubectl get jobs -n ace -w

# Watch Helm releases roll forward
kubectl get helmreleases -A -w
```
> **Expected state:** The target-version row shows **Progressing** while its components reconcile.

The upgrade takes several minutes. HelmReleases move to the new chart version one at a time.

### Verify the management cluster

```bash
helm list -A | grep opscenter-features
kubectl get helmreleases -A

helm list -A | grep ace-installer
kubectl get hr ace -n kubeops -o jsonpath='{.spec.chart.spec.version}{"\n"}'
```

The upgrade is complete when:

- The `ace` HelmRelease shows the target version.
- Every HelmRelease in `kubeops` reports `READY` as `True`.

---

## Step 3: Upgrade imported clusters

Repeat these steps for each imported cluster.

1. In the **Console**, open the **General Imported Cluster**.
2. Go to **Settings**.
3. Click **Update Version** and confirm with **Yes**.

<!-- SCREENSHOT: images/upgrade/imported-cluster-settings.png — imported cluster Settings page with the Update Version option -->

<!-- SCREENSHOT: images/upgrade/imported-cluster-confirm.png — Update Version confirmation dialog for the imported cluster -->

The platform upgrades the HelmReleases on the imported cluster directly (not via a cluster set), so progress is visible immediately. 

You can verify: 
```bash
kubectl get hr -A -w --context <imported-cluster-context>
kubectl get pods -A | grep -vE 'Running|Completed'
```

The cluster is upgraded when every HelmRelease is `Ready` on the target version and all pods are `Running` or `Completed`.

---

## Step 4: Upgrade spoke clusters

Spoke clusters are imported as generic DBaaS generally. Update them individually before updating the cluster set.

Repeat these steps for each spoke.

1. In the **Console**, go to your **organization** and open the **Hub Cluster**.
2. Go to the **KubeDB Platform / Hub UI**
3. Select the ClusterSet the spoke was imported into, for example **Generic DBaaS**.
4. In the **Cluster list**, select the spoke cluster.

![ClusterSet page in the Hub UI with the spoke cluster in the cluster list](../images/upgrade/upgrade_1.png)

5. From the sidebar, open **Update ACE resources**.
6. On the **ACE version** page, click **Upgrade version**.

![Spoke ACE version page showing the current release as Outdated and the Upgrade version button](../images/upgrade/spoke-upgrade-version.png)

7. Confirm the target version in the dialog and click **Upgrade**.

![Spoke upgrade confirmation dialog showing the target version and the Upgrade button](../images/upgrade/upgrade_3.png)

The cluster set manifest (which holds metadata about all spoke clusters) updates almost instantly. The underlying Helm releases take longer — wait for them to reconcile before moving on.

Watch the HelmReleases from the spoke cluster:

```bash
kubectl get hr -A -w

kubectl get pods -A | grep -vE 'Running|Completed'
```

The spoke is upgraded when `CURRENT VERSION` shows the target version and every HelmRelease on the spoke is `Ready`.

---

## Step 5: Update the ClusterSet

Update a ClusterSet only after **every** clusters in it is on the target version.

1. In the **Hub UI**, click the ClusterSet.
2. Under **All cluster overview**, the **Current version** still shows the old version.
3. Click **Update Cluster Set** and confirm.

<!-- SCREENSHOT: images/upgrade/clusterset-update.png — ClusterSet page showing the old Current version and the Update Cluster Set button -->

After the update:
- **Current version** shows the target version.
- No **unaligned cluster** label.

![Showing an unaligned cluster before the ClusterSet is updated](../images/cluster_and_clusterset/unaligned.png)

<!-- SCREENSHOT: images/upgrade/clusterset-aligned.png — ClusterSet page after the update, showing the target version and all clusters in the current version -->

---

## Post-upgrade validation

### To all clusters
```bash
  helm list -A --kube-context $ctx | grep -v DEPLOYED
```
All clusters should report version x.y.z (your target release).



### Management cluster

```bash
helm list -A | grep ace
kubectl get hr -n kubeops
kubectl get hr ace -n kubeops -o jsonpath='{.spec.chart.spec.version}{"\n"}'
kubectl get pods -n ace
```

### Imported clusters / Spoke clusters

Run against each cluster:

```bash
kubectl get hr -A
kubectl get pods -A | grep -vE 'Running|Completed'
```

### Checklist

- [ ] The HelmReleases show the target version.
- [ ] Every HelmRelease on the management cluster is `Ready`.
- [ ] Every imported/spoke cluster is upgraded and all its HelmReleases are `Ready`.
- [ ] Every spoke shows the target version in `CURRENT VERSION`.
- [ ] Every ClusterSet shows the target version, with no unaligned clusters.
- [ ] Your databases are reachable and report `Ready` in the Console.

---

## Troubleshooting

### Stuck reconciliation

A HelmRelease that stays `READY: False` or `Unknown` for a long time is stuck.

Find the reason:

```bash
kubectl get hr -A | grep -v True

kubectl describe hr <name> -n <namespace>

kubectl get events -n <namespace> --sort-by=.lastTimestamp | tail -n 30
```

The `Status` conditions and events usually name the cause, for example a failed install, a timeout waiting for pods, a missing dependency, or a conflict with an existing resource.

Check the helm-controller logs:

```bash
kubectl get pods -A | grep helm-controller

kubectl logs -n <helm-controller-namespace> deploy/helm-controller --since=30m | grep <name>
```

Common causes:

| Symptom | Cause | Fix |
|---|---|---|
| `dependency ... is not ready` | A HelmRelease it depends on is not ready | Fix the dependency first; this one follows |
| Timeout waiting for pods | Pods cannot start (image pull, resources, scheduling) | `kubectl get pods -n <target-namespace>` and `kubectl describe pod` |
| Upgrade reported as failed, but the chart version is already the target | A later reconciliation succeeded | No action needed when `READY` is `True` |

### Check HelmRelease progress

```bash
kubectl get hr -A -w
```

### Spoke version does not change

If `CURRENT VERSION` changes but the HelmReleases on the spoke stay on the old version:

1. Check that the spoke is connected. On the management cluster:

   ```bash
   kubectl get managedclusters
   ```

   The spoke must show `JOINED` and `AVAILABLE` as `True`.

2. On the spoke, check the HelmReleases status


### ClusterSet stays unaligned

A ClusterSet stays unaligned when one of its spokes is not on the target version.

1. Find the spoke that is behind.
2. Upgrade that spoke, or remove it if it is no longer in use.
3. Click **Update Cluster Set** again.


## Video walkthrough on ACE Upgrade Procedure

<iframe width="1900" height="869" src="https://www.youtube.com/embed/99_8acxcr-s" title="6. Upgrade procedure" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


## Related
- [Site Administration: KubeDB Platform Upgrade](../../account-management/site-administration/ace-upgrade.md).
- [Upgrade Spoke](../hub-ui/upgrade.md) — upgrade a single spoke from the Hub UI.
- [Cluster & Clusterset](../hub-ui/cluster-and-clusterset.md) — how ClusterSets group spokes.
- [Platform Upgrade API](../../../api/ace-upgrade/overview.md) — trigger and track upgrades through the API.