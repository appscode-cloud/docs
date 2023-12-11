---
layout: 'guide'
menu:
  docs_menu:
    identifier: cluster-management-helmcharts
    name: Manage Cluster Helm Charts
    parent: cluster-management
    weight: 60
  home_menu:
    identifier: home-cluster-helmcharts
    name: Manage Cluster Helm Charts
    parent: home-cluster
    weight: 60
menu_name: docs_menu
section_menu: guides
---


# Manage Helm Charts in AppsCode Dashboard

In AppsCode Dashboard, users can seamlessly manage Helm releases within their imported Kubernetes clusters. This functionality empowers users to interact with existing releases, install new charts, and perform various actions related to Helm charts.

## Helm Chart Management Features

### Install New Charts

Users can effortlessly install new Helm charts by following these steps:

1. **Select Chart Source:** Users can choose a chart source from publicly available URLs. Additionally, they have the option to provide a custom URL if the desired chart is not listed.

2. **Choose Chart and Version:** From the selected chart source, users can browse and choose the specific chart and version they wish to install.

3. **Customize Installation:** Users can provide a custom release name, namespace, and even specify a custom values file during the installation process.

### Interact with Existing Releases

AppsCode Dashboard allows users to interact with existing Helm releases in the following ways:

- **Modify Releases:** Users can modify existing Helm releases based on their evolving requirements.

- **Rollback to Previous Versions:** In case a rollback is necessary, users can easily revert to previous versions of Helm releases.

### User-Friendly Interface

The Helm Chart Management page in the AppsCode Dashboard provides an intuitive and user-friendly interface, ensuring that users can efficiently manage Helm releases without the need for extensive Helm CLI commands.

This streamlined management process enhances the overall Helm chart experience within the AppsCode Dashboard, providing users with a powerful toolset to handle Helm releases seamlessly.
