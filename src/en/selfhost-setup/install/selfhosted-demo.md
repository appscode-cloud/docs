---
layout: 'guide'
menu:
  selfhost-setup_docs_menu:
    identifier: selfhost-demo-deployment
    name: Demo Deployment
    parent: selfhosted-installer
    weight: 10
menu_name: selfhost-setup_docs_menu
section_menu: selfhost-setup
---


# Deploying AppsCode Platform: Self Hosted Demo

Welcome to the AppsCode Platform's "Self Hosted Demo" deployment! Experience the power of AppsCode in a quick and convenient trial environment. Follow these steps to deploy the AppsCode Platform in Self Hosted Demo mode:

Deployment of the platform needs a Kubernetes Cluster with VM size at least **16 GB ram**, **4+ cpus** & **Routable IP**.

If you have a Ubuntu 22.04 server with **16 GB ram**, **4+ cpus** & **Routable IP**, you will find instructions to install `k3s` cluster in the server. <br>
If you already have a k8s cluster, you can skip the `k3s` setup procedure.


### 1. Visit the AppsCode Self-Hosted Page

Navigate to [AppsCode Self-Hosted](https://selfhost.appscode.com/appscode). Here you will find your previously generated self-hosted installers. <br>
Click on the `Create New Installer` button to get started.

### 2. Choose Deployment Mode

Choose `Deployment Type` -> `Self Hosted Demo`.

### 3. Provide Basic Information

You'll be prompted to provide the following basic information for Self Hosted Demo:

- **Requested Domain:** The domain where the AppsCode Platform will be hosted.
- **Public IP:** The routable IP address, to set against the hosted domain.
- **Admin Account Display Name:** The display name for the administrator account.
- **Admin Account Email:** The email address for the administrator account.
- **Admin Account Password:** The password for the administrator account.

### 4. Provide Additional Information
You can provide some additional information. if you want to customize them too. Like if you want your system to pull docker images or helm repositories from your hosted docker registries, you can set those too.

Also, if you want your system to have your custom Logo, Favicon and Primary color, you can set those too.

### 5. Generate Installer and Documentation

Click the "Done" button to submit your information. AppsCode will generate the installer and provide the necessary documentation.

### 6. Deploy AppsCode Platform

Follow the documentation provided by AppsCode to deploy the AppsCode Platform on your system.
- If using a public VM, follow the provided instructions to install k3s and deploy the platform.
- If using a Kubernetes cluster, follow the deployment documentation.

### 7. Explore the Deployed Platform

Once deployed, access the AppsCode Platform using the specified domain. Log in with the admin account credentials provided during the creation process.

### 8. Get Support

If you encounter any challenges during the deployment or have questions, reach out to AppsCode support for assistance.

Congratulations! You have successfully deployed the AppsCode Platform in Self Hosted Demo mode. Explore the features and capabilities of the platform in your customized environment.
