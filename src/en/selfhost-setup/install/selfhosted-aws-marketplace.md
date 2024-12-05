---
layout: 'guide'
menu:
  selfhost-setup_docs_menu:
    identifier: selfhost-aws-marketplace
    name: AWS Marketplace Deployment
    parent: selfhosted-installer
    weight: 10
menu_name: selfhost-setup_docs_menu
section_menu: selfhost-setup
---

# Deploying AppsCode Platform from AWS Marketplace

Welcome to the AppsCode Platform's "AWS Marketplace" deployment! Follow the steps below to deploy AppsCode Platform from AWS Marketplace.

To install the platform application you need to have the permissions to manage EC2, IAM, CloudFormation etc.

### 1. Visit the AppsCode Self-Hosted Page

Navigate to [AppsCode Self-Hosted](https://appscode.com/selfhost). Here you will see the previously created installers as well as you can create a new installer. <br>
Click on the `Create New Installer` button to get started. You have to install the application from AWS Marketplace within 2 hours after creating this `Installer`. Otherwise, this installer will be `expired`.

### 2. Choose Deployment Mode

Choose `Deployment Type` -> `AWS Marketplace`.

### 3. Provide Basic Information

You'll be prompted to provide the following basic information for Self Hosted Demo:

- **Access Key ID:** AWS access key id.
- **Secret Access Key:** AWS secret access key, these credentials will be used to manage resources to your aws account, like create bucket or create cluster.
- **Admin Account Display Name:** The display name for the administrator account.
- **Admin Account Email:** The email address for the administrator account.
- **Admin Account Password:** The password for the administrator account.

### 4. Provide Additional Information
You can provide some additional information. if you want to customize them too. Like if you want your system to pull docker images or helm repositories from your hosted docker registries, you can set those too.

**Domain White List (required):** You must specify the end users domains, the system will only allow users with that specified domains. You can Add multiple domain whitelists at the same time.

You can also create an initial `CAPI Cluster` from `self management` and enable desired features in it. 

Also, if you want your system to have your custom Logo, Favicon and Primary color, you can set those too.

### 5. Generate Installer and Documentation

Click the "Next" button to submit your information. AppsCode will generate the installer and provide the necessary documentation and further installation guideline in details.

You will find an `Installer URL` for this installer. You have to give this URL in the AWS Marketplace application.  

### 6. Deploy AppsCode Platform

The expiry time for this installer is 2 hours. You will find in detail deployment guideline after creating the installer.

Go to [AppsCode Cloud w/ Usage Billing](https://aws.amazon.com/marketplace/pp/prodview-izn7wxvkpbjuo) in the AWS Marketplace. Launch the application following the given guideline.
When deploying the CloudFormation template you have to give the `Installer URL` that you found in the previous step.

Once you complete the `Launch` process, the application may need 5-10 minutes to initialize everything and go live.

### 7. Explore the Deployed Platform

Once deployed, access the AppsCode Platform using the specified domain. Log in with the admin account credentials provided during the creation process.

### 8. Get Support

If you encounter any challenges during the deployment or have questions, email support@appscode.com for assistance.

Congratulations! You have successfully deployed the AppsCode Platform in Self Hosted Demo mode. Explore the features and capabilities of the platform in your customized environment.
