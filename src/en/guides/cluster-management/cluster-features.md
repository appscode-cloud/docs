---
layout: 'guide'
menu:
  docs_menu:
    identifier: cluster-management-feature
    name: Feature Management
    parent: cluster-management
    weight: 30
  home_menu:
    identifier: home-cluster-feature
    name: Feature Management
    parent: home-cluster
    weight: 30
menu_name: docs_menu
section_menu: guides
---


# Manage Features in AppsCode Dashboard

Once you have successfully imported your Kubernetes cluster into the AppsCode Dashboard, you can explore and manage various Kubernetes workloads already present in the cluster. Additionally, AppsCode offers a range of powerful products, each packaged as a feature, that you can enable or disable based on your requirements.

## FeatureSets Overview

AppsCode organizes its products into FeatureSets, each comprising multiple individual features. This categorization simplifies the process of enabling or disabling related functionalities. Some prominent FeatureSets include:

- **Opscenter Core:** Core features for ACE.
- **Opscenter Tools:** DevOps tools for ACE.
- **Database:** Manage production grade databases powered by KubeDB.
- **Backup & Recovery:** Manage scheduled backup & recovery for your Kubernetes native applications.
- **Monitoring:** Monitor your Kubernetes resources with Prometheus and Grafana.
- **Security:** Manage TLS Certificates, Secrets and scan for vulnerability in images.

## Feature Management

### During Cluster Import

As part of the cluster import process, you can customize the AppsCode Dashboard by choosing which FeatureSets to enable. Additionally, within each FeatureSet, you have the option to selectively enable or disable specific features according to your preferences. After making these selections and clicking "Import," the cluster will be imported into the AppsCode Dashboard, and the chosen features will be activated.

### Post Cluster Import

Upon a successful import, you'll land on the Cluster Overview page within the AppsCode Dashboard. Here, you can view a summary of the enabled and disabled FeatureSets associated with your cluster.

Managing features in the AppsCode Dashboard is a straightforward process that allows you to enable or disable FeatureSets according to your specific needs. Follow these steps to navigate through the AppsCode Dashboard and fine-tune your cluster's features.

#### Navigate to FeatureSet Management

In cluster Overview page, you'll find a list of FeatureSets associated with your cluster, along with their current status.

Click on any FeatureSet in the list to go the FeatureSet Management page.
On the FeatureSet Management page, you'll find details specific to the selected FeatureSet.

Now you can cnfigure the features for this FeatureSet or navigate to other FeatureSets to manage them.

The Featureset Management page provides a comprehensive view of the features associated with the selected Featureset, allowing you to tailor your AppsCode Dashboard to meet your cluster's requirements.
