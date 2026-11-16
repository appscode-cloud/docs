---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: cluster-upgrade
    name: Upgrade Cluster
    parent: cluster-management
    weight: 80
menu_name: docsplatform_{{.version}}
section_menu_id: guides
---


# Upgrading Your KubeDB Platform: Management, Imported, and Spoke Clusters

## Overview

Upgrade a **KubeDB Platform** deployment across all cluster tiers: the base management cluster, the KubeDB Platform cluster, general imported clusters, and spoke clusters. The example below upgrades from release `2025.5.16` to `2025.6.x`.

---

## Architecture

```
                    ┌─────────────────────────────────┐
                    │       Management Cluster         │
                    │  (KubeDB Platform control plane) │
                    └────────────────┬────────────────┘
                                     │
                  ┌──────────────────┼──────────────────┐
                  │                  │                  │
   ┌──────────────▼──────┐  ┌────────▼────────┐   ┌─────▼──────────┐
   │ KubeDB Platform     │  │ Imported Cluster │  │ Spoke Cluster  │
   │ Cluster (management)│  │ (generic import) │  │ (generic import│
   └─────────────────────┘  └─────────────────┘   └────────────────┘
```

Each tier is upgraded separately; the order matters.

---

## Pre-checks

Complete every item before starting. Do not upgrade while any item fails — an upgrade on top
of an unhealthy cluster is much harder to troubleshoot.

- [ ] **Versions known.** Log in to [appscode.com](https://appscode.com), switch to your
  organization, open your installer, click **View Details**, and note the **current** and
  **target** versions. Read the target release's CHANGELOG.
- [ ] **Tested on non-prod.** The same upgrade was applied to a QA / non-prod environment and
  passed the [Post-checks](#post-checks).
- [ ] **AppsCode notified.** At least 72 hours ahead, with the maintenance window and the
  clusters involved.
- [ ] **All HelmReleases Ready** on the management cluster and every spoke / imported cluster:
  ```bash
  # Prints nothing when every HelmRelease is Ready
  kubectl get helmreleases -A --no-headers | grep -v True
  ```
- [ ] **Flux controllers running:**
  ```bash
  kubectl get pods -n flux-system
  ```
- [ ] **All spokes connected.** On the hub, every `ManagedCluster` shows `JOINED=True` and
  `AVAILABLE=True`:
  ```bash
  kubectl get managedclusters
  ```
  Remove or fix inactive clusters first (see
  [Removing an Inactive Cluster](../troubleshooting.md#removing-an-inactive-cluster)).
- [ ] **No cluster import or removal in progress.** Every cluster reports phase `Active`
  through the API (see [Using the API](#using-the-api)).

Keep a watch open during the upgrade:

```bash
kubectl get helmreleases -A -w
```

---

## Upgrade Flow

### Step 1 — Download the new installer archive

1. On the installer page, click **Upgrade to <x.y.z>**.
2. Click **Download** to get the updated `.values` (val) file.
3. The downloaded archive lands in your local archive folder (e.g., `archive2/`).

```bash
# Optional: inspect the downloaded values file before applying
cat ~/Downloads/<release>.values.yaml
```

---

### Step 2 — Apply the upgrade via Platform UI

1. Switch from the **Console UI** to the **Platform UI**.
2. Go to **User Settings → Upgrade**.
3. Select the val file downloaded in Step 1.
4. Click **Update Version**.

The platform creates a background job that updates Helm releases one by one.

```bash
# Monitor the upgrade job on the management cluster
kubectl get jobs -n ace -w

# Watch Helm releases roll forward
kubectl get helmreleases -A -w
```

> **Expected state:** `current version: 5.16 → update in progress: 6.16`

Once the job completes, verify the op-center feature set reflects the new version.

---

### Step 3 — Upgrade spoke clusters

Spoke clusters are imported as **generic DBaaS** generally. Update them individually before
updating the cluster set.

1. In the Console, go to **Your Organization → Hub Cluster → KubeDB Platform**.
2. Select the correct **Cluster set** (how you imported). For example, Generic DBaaS.
3. Select your spoke cluster.
4. Click **Update KubeDB Platform Resources → Update Version → Yes**.

![Upgrade](../images/upgrade/upgrade_1.png)

```bash
# After triggering, watch the QB operator start the upgrade on the spoke
kubectl get helmreleases -A -w --context <spoke-cluster-context>

# Wait for all pods to return to Running
kubectl get pods -A --context <spoke-cluster-context>
```

The cluster set manifest (which holds metadata about all spoke clusters) updates
almost instantly. The underlying Helm releases take longer — wait for them to
reconcile before moving on.

---

### Step 4 — Upgrade general imported clusters

1. In the Console, select the **General Imported Cluster**.
2. Open its **Settings** page and click **Update Version**.

```bash
# Verify on the imported cluster
kubectl get helmreleases -A --context <imported-cluster-context>
```

This path updates Helm releases directly (not via a cluster set), so progress is
visible immediately.

---

### Step 5 — Update the cluster set

After **all** individual clusters are on the new version:

1. In the Console, go to **Your Organization → Hub Cluster → KubeDB Platform**.
2. Select the correct **Cluster set** (how you imported). For example, Generic DBaaS.
3. Click **Update Cluster Set**.

```bash
# Confirm cluster set version
kubectl get clusterset -A
```

> Before clicking **Update Cluster Set**, you will see the cluster set still shows the old version (e.g., `5.6`).
> After the update it will be marked as **unaligned** briefly, then reconcile.

---

### Step 6 — Verify

Run the [Post-checks](#post-checks).

---

## Post-checks

Run on the management cluster and on every spoke / imported cluster. The upgrade is complete
only when every item passes.

- [ ] **All HelmReleases Ready:**
  ```bash
  # Prints nothing when every HelmRelease is Ready
  kubectl get helmreleases -A --no-headers | grep -v True
  ```
- [ ] **All HelmReleases on the target chart version:**
  ```bash
  kubectl get helmreleases -A \
    -o custom-columns=NAMESPACE:.metadata.namespace,NAME:.metadata.name,REVISION:.status.lastAttemptedRevision
  ```
- [ ] **No Helm release stuck in a pending state:**
  ```bash
  # Prints nothing when every release is deployed
  helm list -A --all --no-headers | grep -v deployed
  ```
- [ ] **All pods healthy:**
  ```bash
  kubectl get pods -A --no-headers | grep -vE 'Running|Completed'
  ```
- [ ] **All spokes connected.** On the hub, every `ManagedCluster` shows `JOINED=True` and
  `AVAILABLE=True`:
  ```bash
  kubectl get managedclusters
  ```
- [ ] **Cluster set updated** (Step 5) and no longer shown as unaligned.
- [ ] **Every cluster `Active`** through the API (see [Using the API](#using-the-api)).

If any check fails, see [Troubleshooting](../troubleshooting.md).

---

## Using the API

The same checks can be scripted against the
[Clusters (v2) API](../../../api/cluster-management-v2/clusters.md). Paths are relative to
`https://<akp-host>/api/v1`; send `Authorization: token <YOUR_TOKEN>`.

| Purpose | Call |
|---|---|
| List clusters | `GET /clustersv2/{owner}` |
| Status of one cluster | `GET /clustersv2/{owner}/{cluster}/status` |
| Import a cluster | `POST /clustersv2/{owner}/import` |
| Remove a cluster | `POST /clustersv2/{owner}/{cluster}/remove` |
| Force a reconcile of a feature's HelmReleases | `GET /clustersv2/{owner}/{cluster}/reconcile?features=<feature>` |

Check the phase of every cluster:

```bash
api=https://<akp-host>/api/v1/clustersv2/<owner>
for c in $(curl -s -H "Authorization: token $TOKEN" "$api" | jq -r '.[].name'); do
  curl -s -H "Authorization: token $TOKEN" "$api/$c/status" \
    | jq -r '"\(.name)\t\(.status.response.phase)"'
done
```

`Active` means healthy. `Inactive` means the platform cannot reach the cluster (see
[Removing an Inactive Cluster](../troubleshooting.md#removing-an-inactive-cluster)).

`remove` is asynchronous: call it once and poll `status`. See
[Removing through the API](../troubleshooting.md#removing-through-the-api).

---

## Lessons Learned

| Observation | Takeaway |
|---|---|
| One Helm release failed to update via the job | It had already reconciled from the cluster side — not always an error |
| Cluster set update is near-instant | It only patches a manifest, not the releases themselves — releases follow async |
| Search manager self-updated | Some components pull their version from the cluster operator, not the installer job |
| Upgrade order matters | Always update individual clusters **before** the cluster set |
| Ports need time after upgrade | Wait for all pods to reach `Running` before declaring success |

---

## Quick Reference

```
appscode.com → Download val file
       ↓
Platform UI → Update Version (Management / Platform cluster)
       ↓
Console → Generic DBaaS → Update KubeDB Platform Resources (each spoke)
       ↓
Console → Generic DBaaS → Update Cluster Set
       ↓
Console → Imported Cluster → Settings → Update Version
       ↓
Verify: helm list -A across all contexts
```

No downtime during upgrade procedure — the platform performs rolling Helm release updates and
most workloads stay running throughout.

---
Here is a sample video on how you can setup the full platform:
<iframe width="1900" height="869" src="https://www.youtube.com/embed/99_8acxcr-s" title="6. Upgrade procedure" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>