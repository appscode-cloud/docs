---
layout: 'guide'
menu:
  selfhost-setup_docs_menu:
    identifier: selfhost-prod-deployment
    name: Production Deployment
    parent: selfhosted-installer
    weight: 10
menu_name: selfhost-setup_docs_menu
section_menu: selfhost-setup
---

# Deploying AppsCode Platform: Self Hosted Production

Welcome to the AppsCode Platform's "Self Hosted Production" deployment! In this mode, you have the flexibility to customize various aspects of the deployment to meet the specific requirements of your production environment. Follow these steps to deploy the AppsCode Platform in Self Hosted Production mode:

### 1. Visit the AppsCode Self-Hosted Page

Navigate to [AppsCode Self-Hosted](https://appscode.com/selfhost). Here you will find your previously generated self-hosted installers. Click on the `Create New Installer` button to get started.

### 2. Choose Deployment Mode

Choose `Deployment Type` -> `Self Hosted Production`.

### 3. Provide Basic Information

You'll be prompted to provide essential information for Self Hosted Production:

- **Requested Domain:** The domain where the AppsCode Platform will be hosted.
- **Public IP:** The routable IP address, to set against the hosted domain.
- **Admin Account Display Name:** The display name for the administrator account.
- **Admin Account Email:** The email address for the administrator account.
- **Admin Account Password:** The password for the administrator account.

### 4. Additional Production Configuration

#### Release Name and Namespace
- Customize the Helm chart release name and namespace for the deployment.

#### Registry Configuration
- Define custom sources for Docker images and Helm repositories.

#### Cloud Service Provider Credentials
- Specify the cloud service provider credentials for the bucket where your data will be stored. Choose your provider from Azure, GCS, S3, or provide external credentials.

#### DNS Provider Configuration
- Select your DNS provider from the available options, which include Route53, Cloudflare, Cloud DNS, AzureDNS, and External (manual configuration).

#### TLS Issuer Configuration
- Configure the TLS issuer for secure communication. Options include Let's Encrypt, Let's Encrypt Staging, Custom Certificate Authority (CA), and External configuration.

#### Storage Class Configuration
- Specify the storage class name from your Kubernetes cluster. Leave empty to use the default storage class.

#### Backup Schedule Configuration
- If you wish to schedule regular backups, provide the necessary information for the backup schedule.

#### Ingress Configuration
- Choose how you want to expose the platform: via `Load Balancer` or `Host Port`. For Host Port, provide node selector labels.

#### Branding Configuration
- Customize the appearance of your platform with a custom logo, favicon, and primary color.
### 5. Generate Installer and Documentation

Click the "Done" button to submit your information. AppsCode will generate the installer and provide the necessary documentation.

### 6. Deploy AppsCode Platform

Follow the documentation provided by AppsCode to deploy the AppsCode Platform on your system.

### 7. Explore the Deployed Platform

Once deployed, access the AppsCode Platform using the specified domain. Log in with the admin account credentials provided during the creation process.

### 8. Get Support

If you encounter any challenges during the deployment or have questions, reach out to AppsCode support for assistance.

Congratulations! You have successfully deployed the AppsCode Platform in Self Hosted Production mode. Explore the features and capabilities of the platform in your customized environment.
