---
layout: 'guide'
menu:
  docs_menu:
    identifier: billing-and-usage-guide-cost-management
    name: Cost Management
    parent: billing-and-usage-guide
    weight: 40
  home_menu:
    identifier: billing-and-usage-guide-cost-management
    name: Cost Management
    parent: home-billing
    weight: 40
menu_name: docs_menu
section_menu: guides
---

## **Cluster and Namespace Configuration for Cost Management**

For effective cost management, users can configure their clusters and namespaces. This section covers how to set a cluster's mode to **PROD** or **NON-PROD** for different billing rates, and how to enable a one-month free trial for KubeDB resources in a specific namespace.

### **Configuring Cluster Mode (PROD vs. NON-PROD)**

We offer different billing rates for production (**PROD**) and non-production (**NON-PROD**) environments. To distinguish between these, the user must set an annotation on the kube-system namespace of the cluster. The system considers a cluster as **PROD** only if the mode is explicitly set to `prod`. All other modes (`qa`, `staging`, `dev`) are treated as **NON-PROD**.

**To set the cluster mode:**

1. Identify the kube-system namespace in the cluster.
2. Apply the following annotation: `cluster.appscode.com/mode`.

Here are the possible values for the annotation:

| Value | Cluster Mode Interpretation |
| :---- | :---- |
| prod | **PROD** (Production) |
| qa | **NON-PROD** (Quality Assurance) |
| staging | **NON-PROD** (Staging) |
| dev | **NON-PROD** (Development) |

**Example using kubectl:**

To set a cluster to **PROD** mode, run the following command:

```shell
kubectl annotate namespace kube-system cluster.appscode.com/mode=prod --overwrite
```

To set it to a **NON-PROD** mode like staging, run:

```shell
kubectl annotate namespace kube-system cluster.appscode.com/mode=staging --overwrite
```

### **Enabling the One-Month Free Resource Trial**

Users can get a one-month free trial for every KubeDB database running within a specific namespace. This allows for evaluation of the service without incurring costs during the trial period.

To enable the free trial, the user needs to add a specific annotation to the desired namespace.

**To enable the trial:**

1. Choose the namespace where the KubeDB resources are running.
2. Apply the annotation `ace.appscode.com/enable-resource-trial` with the value `true`.

**Example using kubectl:**

To enable the free trial for a namespace named `my-app-ns`, run the following command:

```shell
kubectl annotate namespace my-app-ns ace.appscode.com/enable-resource-trial=true --overwrite
```

Once this annotation is applied, all KubeDB resources deployed within the my-app-ns namespace will automatically receive a one-month free trial.
