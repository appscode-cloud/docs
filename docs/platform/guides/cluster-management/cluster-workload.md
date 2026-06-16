---
layout: docs
menu:
  docsplatform_{{.version}}:
    identifier: cluster-management-k8sworkloads
    name: Kubernetes Workload Management
    parent: cluster-management
    weight: 40
menu_name: docsplatform_{{.version}}
section_menu_id: guides
---

# Kubernetes Workload Management

The **Workloads** group in the Cluster UI sidebar is where you browse and manage everything that runs application containers — Deployments, Pods, Jobs, and the other standard Kubernetes workload types.

## Open the Workloads Section

1. Navigate to the [Platform Console](https://console.appscode.com).
2. Click on your imported cluster to open its Cluster Overview page.
3. In the left sidebar, click **Workloads** to expand it.

Every list page in this group follows the same layout: a 🔍 search box, an **All Namespaces** filter dropdown, and a green **+ Create** button top-right.

---

## Deployments

Lists every Deployment with its Namespace, Pods (ready count), Images, and Age.

![Deployments list page showing the table of deployments with namespace filter and Create button](images/cluster-workload/deployments-list.png)

---

## Replica Sets

Lists every Replica Set with its Namespace, Pods, Images, and Age.

![Replica Sets list page showing namespace, pods, images, and age columns](images/cluster-workload/replica-sets-list.png)

---

## Replication Controllers

Lists every Replication Controller with its Namespace, Pods, Images, and Age. Click **+ Create ReplicationController** to add one.

![Replication Controllers list page with no data available and a Create ReplicationController button](images/cluster-workload/replication-controllers-list.png)

---

## Stateful Sets

Lists every Stateful Set with its Namespace, Pods, Images, and Age.

![Stateful Sets list page showing namespace, pods, images, and age columns](images/cluster-workload/stateful-sets-list.png)

---

## Daemon Sets

Lists every Daemon Set with its Namespace, Pods, Dsired, Current-Scheduled, Up-to-date, Node Selector, Images, and Age.

![Daemon Sets list page showing desired, current-scheduled, and up-to-date columns](images/cluster-workload/daemon-sets-list.png)

---

## Jobs

Lists every Job with its Namespace, Annotations, Completions, Duration, Images, and Age.

![Jobs list page showing completions, duration, images, and age columns](images/cluster-workload/jobs-list.png)

---

## Cron Jobs

Lists every Cron Job with its Namespace, Annotations, Schedule, Suspend, Active, Last Schedule, Images, and Age.

![Cron Jobs list page showing schedule, suspend, active, and last schedule columns](images/cluster-workload/cron-jobs-list.png)

---

## Pods

Lists every Pod with its Namespace, Ready, Status, Restarts, IP, Images, and Age — the only Workloads item with these extra live-state columns.

![Pods list page showing Ready, Status, Restarts, and IP columns](images/cluster-workload/pods-list.png)

---

## Quick Reference

| Task | How to do it |
|---|---|
| Open the Workloads view | Click your cluster on the Platform Console → click **Workloads** in the left sidebar |
| List a workload type | Click its name under the Workloads group (e.g. Deployments, Pods) |
| Filter by namespace | Use the **All Namespaces** dropdown on any list page |
| Create a new workload | Click **+ Create** on the resource's list page |
