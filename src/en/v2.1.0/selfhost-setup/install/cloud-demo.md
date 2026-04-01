---
layout: 'guide'
menu:
  selfhost-setup_docs_menu:
    identifier: selfhost-cloud-demo-deployment
    name: Cloud Demo Deployment
    parent: selfhosted-installer
    weight: 10
menu_name: selfhost-setup_docs_menu
section_menu: selfhost-setup
---

# Deploying AppsCode Platform: Cloud Demo

Welcome to the AppsCode Platform's "Cloud Demo" deployment! Follow these steps to deploy the AppsCode Platform in Cloud Demo mode.

Deployment of the platform needs a Kubernetes Cluster with VM size at least: 

* one worker node
* 4-6 CPUs
* 16 GB of RAM 
* Routable IP


You will get an instruction to deploy a k3s cluster in Ubuntu VM or you can skip this step if you already have a cluster. 

### 1. Visit the AppsCode Self-Hosted Page

Navigate to [AppsCode Self-Hosted](https://appscode.com/selfhost). Here you will find your previously generated self-hosted installers. <br>
Click on the `Create New Installer` button to get started.

### 2. Choose Deployment Mode

Choose `Deployment Type` -> `Cloud Demo` and give it a name in the installer name section.

Before beginning the installation, identify your target infrastructure and cluster type.

* **DNS & Connectivity:** 
  * **Enable DNS:** Toggle this to allow the installer to manage or integrate with your DNS provider.
  * **Target IP:** Provide the static IP addresses for your cluster nodes or load balancer.
* **Cluster Type:** Determine if you are installing on **AWS EKS Cluster** or **Red Hat OpenShift Cluster**.

### 3. Global Administrative Settings
These credentials define the primary super-user and the initial organizational structure.

* **System Admin:** In this section, provide the administrator's following information.
  - **Admin Account Display Name:** The display name for the administrator account.
  - **Admin Account Email:** The email address for the administrator account.
  - **Admin Account Password:** The password for the administrator account. You may manually set a password or leave it blank to allow the system to **auto-generate** a secure administrative password.
  - **Initial Organization Name:** You can choose what will be the initial organization name for your account


### 4. Registry
Ace requires access to various container registries and Helm repositories to pull necessary images and charts.

**Docker Registry:** Go to the docker registry section first then look for the following settings
* **Proxies:** Put registry name for Appscode `r.appscode.com` and other Public Registries like Docker Hub, GitHub Container Registry (`ghcr.io`), Kubernetes Registry, Microsoft (`mcr.microsoft.com`), and Quay.
* **Helm Repositories:** In the helm repositories section put your helm repository url
If using private or authenticated registries, provide:
* **Credentials:** Username and Password.
* **Certs:** Upload CA Cert, Client Cert, and Client Key if required for mutual TLS.
* **Image Pull Secrets:** Define the secrets used by the cluster to authenticate with the registries. You can enable create namespace during helm install, allow nondistributable artifacts and insecure option for insecure registry


### 5. Settings

* **Domain White List and Proxy Servers**: Add domain one by one for whitelisting
* **Proxy Servers:** If you have proxy servers then enter the **HTTP Proxy**, **HTTPS Proxy** and **No Proxy**
* Put Login and Logout URL



### 6. Ingress & Gateway

* Enable either the **Gateway API** or standard **Ingress**. 


### 7. Self Management
In this section you can enable or disable features.

### 8. Branding & UI Customization
Administrators can globally re-brand the Ace interface to match corporate identity.

* **App Name:** Changes the browser tab title.
* **Primary Color:** Enter a Hex code (default: `#009948`).
* **Assets:**
    * **Logo:** Upload a 200x30px image (SVG/PNG recommended).
    * **Favicon:** Upload a 20KB icon file.
* **App Tag:** Toggle **"Show App Tag"** to display or hide the version/tagging info in the UI.

### 9. Generate Installer and Documentation

Click the "Deploy" button to submit your information. AppsCode will generate the installer and provide the necessary documentation.

### 10. Deploy AppsCode Platform

Follow the documentation provided by AppsCode to deploy the AppsCode Platform on your system.

### 11. Explore the Deployed Platform

Once deployed, access the AppsCode Platform using the specified domain. Log in with the admin account credentials provided during the creation process.
## Get Support

If you encounter any challenges during the deployment or have questions, reach out to AppsCode support for assistance.

Congratulations! You have successfully deployed the AppsCode Platform in Cloud Demo mode. Explore the features and capabilities of the platform in your customized environment.
