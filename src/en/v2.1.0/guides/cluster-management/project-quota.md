---
layout: 'guide'
menu:
  v2_1_0_docs_menu:
    identifier: cluster-management-project-quota
    name: Project Quota
    parent: cluster-management
    weight: 20
menu_name: v2_1_0_docs_menu
section_menu: guides
---

# Project Quota Management

The Project Quota feature in the AppsCode Dashboard helps you establish customized resource limits for specific types of resources within a designated namespace. This ensures fair resource distribution and prevents any single workload or tenant from over-consuming essential cluster resources.

## Viewing Project Quotas

To view the existing project quotas applied to your cluster:
1. Open the AppsCode Dashboard and navigate to the desired cluster.
2. Under the **Cluster Settings** section in the left sidebar, click on **Project Quota**.
3. The Project Quota page will display a list of all currently configured quotas. If no quotas exist, you will see a "No Data Available" message.

## Creating a Project Quota

To define a new project quota for a namespace, follow these steps:

1. Click on the **+ Create Quota** button located at the top right of the Project Quota page.
2. In the **Create Project Quota** form, click the **Namespace** field and select a target namespace (e.g., `kubedb`) from the dropdown list.
3. Under the **New Quota** section, specify the details for the quota you want to enforce:
   - **Group:** Select or specify the API group for the target resource. For instance, `kubedb.com` for KubeDB-managed resources.
   - **Kind:** Select the specific resource kind you are limiting, such as `MongoDB` or `Postgres`.
   - **CPU Limit:** Define the maximum CPU threshold allowed for the selected resource kind within this namespace (e.g., `8` cores).
   - **Memory Limit:** Define the maximum Memory threshold allowed for the selected resource kind within this namespace (e.g., `24Gi`).
4. Click the **+ Add Quota** button to temporarily stage this quota rule.
5. The rule will appear in the **Quotas** list at the bottom. From this list, you can review your staged rules, edit them, or remove them as needed.
6. Once all necessary quota rules are added and reviewed, click the **Save** button to apply the configured project quotas to the selected namespace.

Managing project quotas helps administration teams set fine-grained guardrails on heavy workloads, ensuring a stable and predictably performant environment.
