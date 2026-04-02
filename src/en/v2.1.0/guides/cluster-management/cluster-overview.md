---
layout: 'guide'
menu:
  v2_1_0_docs_menu:
    identifier: cluster-management-overview
    name: Cluster Overview
    parent: cluster-management
    weight: 10
menu_name: v2_1_0_docs_menu
section_menu: guides
---

# Cluster Overview

The Cluster Overview page offers a high-level summary of your connected Kubernetes cluster within the AppsCode Dashboard. It provides essential information regarding your cluster's status and the availability of various AppsCode-provided feature sets.

## Basic Information

The **Basic** section details the core properties of your Kubernetes cluster, including:
- **Name:** The assigned name of the cluster in the dashboard.
- **Endpoint:** The API server address used to communicate with the cluster.
- **Provider:** The infrastructure provider hosting the cluster (e.g., Generic, AWS, GCP).
- **Status:** The current connection state of the cluster.
- **Kubernetes Version:** The specific version of Kubernetes running on the cluster.

Additionally, this section provides quick actions:
- **Connect:** Allows you to connect to the cluster securely.
- **Remove:** Disconnects and removes the cluster from the AppsCode Dashboard.

## Feature Sets

The **Feature Sets** section displays a comprehensive grid of available AppsCode product modules. Each card represents a discrete set of features and displays its current status on the cluster.

Key Feature Sets include:
- **Opscenter Core:** Core management capabilities for your cluster.
- **Databases:** Management for production-grade databases powered by KubeDB.
- **Observability:** Monitoring for your cluster resources using tools like Prometheus and Grafana.

Status badges help you quickly identify the state of each Feature Set:
- **Ready:** The feature set is successfully installed and active.
- **Not Installed:** The feature set is available but currently not installed on this cluster.

You can use the Feature Sets overview to ascertain what capabilities are ready to use and which might need to be enabled for your cluster operations.
