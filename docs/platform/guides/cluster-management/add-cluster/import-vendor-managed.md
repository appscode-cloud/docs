---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: cluster-management-add-vendormanaged
    name: Import Vendor Managed Clusters
    parent: cluster-management-add
    weight: 10
menu_name: docsplatform_{{.version}}
section_menu_id: guides
---


# Adding a Vendor-Managed Cluster to Platform Console

1. Go to the [Platform Console](https://console.appscode.com/) and click `Add Cluster`.

### Choose Provider

2. In the `Vendor Managed` section, select the provider hosting your cluster.

### Select Credential

3. Choose a credential with permission to access and import the cluster, then click `Next`. To create one, use the `+Create Credential` button (see [Credentials](../../account-management/kubernetes/credentials.md)).

### Select Cluster

4. Selection depends on the provider:
   - `Linode` / `Digital Ocean`: select the cluster directly.
   - `AKS` / `EKS` / `GKE`: choose the `Resource Group`, `Region`, or `Project`, then select the cluster.

### Customize Features and Import

5. Click `Import` to bring the cluster into the Platform Console, then explore it in the dashboard.