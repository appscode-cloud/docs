---
layout: 'guide'
menu:
  v2_1_0_selfhost-setup_docs_menu:
    identifier: selfhost-prod-deployment
    name: Production Deployment
    parent: selfhosted-installer
    weight: 10
menu_name: v2_1_0_selfhost-setup_docs_menu
section_menu: selfhost-setup
---

# Deploying AppsCode Platform: Self Hosted Production 

Welcome to the AppsCode Platform's "Self Hosted Demo" deployment! In this mode, you have the flexibility to customize various aspects of the deployment to meet the specific requirements of your production environment. By following this structured walkthrough, you can deploy **AppsCode Ace** in a self-hosted production environment, based on the configuration parameters required by the installation wizard. You need to have a kubernetes cluster with the following minimum configuration
* Cluster should have at least one worker node
* 4-6 CPUs
* 16 GB of RAM 
* Routable IP

You will get an instruction to deploy a k3s cluster in Ubuntu VM or you can skip this step if you already have a cluster 


### 1. Visit the AppsCode Self-Hosted Page

Navigate to [AppsCode Self-Hosted](https://appscode.com/selfhost). Here you will find your previously generated self-hosted installers. <br>
Click on the `Create New Installer` button to get started.

### 2. Choose Deployment Mode And Environment

Choose `Deployment Type` -> `Self Hosted Production` and give it a name in the installer name section.

Before beginning the installation, identify your target infrastructure and cluster type.

* **DNS & Connectivity:** 
  * **Enable DNS:** Toggle this to allow the installer to manage or integrate with your DNS provider.
  * **Target IP:** Provide the static IP addresses for your cluster nodes or load balancer.
* **Cluster Type:** Determine if you are installing on **AWS EKS Cluster** or **Red Hat OpenShift Cluster**.
* **Credential-Less Mode:** Enable this if you are using IAM roles for service accounts (IRSA) to avoid manual secret management.


#### Additional configuration for EKS cluster

**Prerequisite:**</br>
* EBS CSI Driver must be installed
* AWS Load Balancer Controller must be installed

**Run the following command to get Subnet IDs**
```
aws ec2 describe-subnets --filters "Name=vpc-id,Values=$(aws eks describe-cluster --name <cluster-name> --region <region> --query "cluster.resourcesVpcConfig.vpcId" --output text)" "Name=map-public-ip-on-launch,Values=true" --region <region> --query "Subnets[*].SubnetId" --output text
```

**Subnet IDs:** Make sure you have added the allocation id of Target IP as well. Run the following command to create EIP Allocation IDs `aws ec2 allocate-address --region <region>`

**EIP Allocation IDs:** Give EIP allocation IDs for your public subnets.Run the following command to get Kube API Server and put value of Kube API Server 

#### Configuring AWS credentialless mode

Here you have to give IRSA related information. Create Role for IRSA and get OIDC ID

```
export CLUSTER_NAME=<cluster name>
export REGION=<cluster region>
export ACCOUNT_ID=<aws account id>

OIDC_ID=$(aws eks describe-cluster --name $CLUSTER_NAME --region $REGION --query "cluster.identity.oidc.issuer" --output text | cut -d '/' -f 5)
echo $OIDC_ID

#Verify the OIDC already created or not
aws iam list-open-id-connect-providers | grep $OIDC_ID | cut -d "/" -f4

#If the command doesn't return the oidc id then create one
eksctl utils associate-iam-oidc-provider --cluster $CLUSTER_NAME --region $REGION --approve

```

Download Policy and trust-relationship files
```
for file in iam-ec2-permissions.json iam-eks-permissions.json template-trust-relationship; do
  echo "http://cdn.appscode.com/files/products/appscode/aws-selfhost/$file"
done | xargs -n 1 -P 4 curl -O
```
Create Policy using the downloaded files skip if the policy already exists, take note of the policy arn which will be attached to the role next

```
# grab the policy arn’s from the output
aws iam create-policy --policy-name AceSelfhostInstallerEC2Policy --policy-document file://iam-ec2-permissions.json
EC2_POLICY_ARN=$(aws iam list-policies --query "Policies[?PolicyName==’AceSelfhostInstallerEC2Policy’].Arn" --output text)
aws iam create-policy --policy-name AceSelfhostInstallerEKSPolicy --policy-document file://iam-eks-permissions.json
EKS_POLICY_ARN=$(aws iam list-policies --query "Policies[?PolicyName==’AceSelfhostInstallerEKSPolicy’].Arn" --output text)
```
Create Role using the downloaded trust-relationship file
```
sed -e "s/OIDC_ID/$OIDC_ID/g" -e "s/ACCOUNT_ID/$ACCOUNT_ID/g" -e "s/REGION/$REGION/g" -e "s/SA_NAMESPACE/"ace"/g" -e "s/SA_NAME/"ace"/g" template-trust-relationship > ace-trust-relationship.json
aws iam create-role --role-name AceInstaller-$OIDC_ID --assume-role-policy-document file://ace-trust-relationship.json --description "A role to be used by ACE selfhost installer"
ROLE_ARN=$(aws iam get-role --role-name AceInstaller-$OIDC_ID --query "Role.Arn" --output text)
# attach Policies to the Role
aws iam attach-role-policy --role-name AceInstaller-$OIDC_ID --policy-arn=$EC2_POLICY_ARN
aws iam attach-role-policy --role-name AceInstaller-$OIDC_ID --policy-arn=$EKS_POLICY_ARN

```
Create and associate access policy

```
# Create access entry
aws eks create-access-entry \
  --cluster-name $CLUSTER_NAME \
  --region $REGION \
  --principal-arn $ROLE_ARN \
  --type STANDARD
# Associate access policy
aws eks associate-access-policy \
  --cluster-name $CLUSTER_NAME \
  --region $REGION \
  --principal-arn $ROLE_ARN \
  --policy-arn arn:aws:eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy \
  --access-scope type=cluster
```

Provide the output role arn as Ace Installer Role ARN `echo $ROLE_ARN`in the **Ace Installer Role ARN** field. Run the following command to get Kube API Server

`aws eks describe-cluster --name <cluster-name> --region <region> --query "cluster.endpoint" --output text`



### 3. Global Administrative Settings
These credentials define the primary super-user and the initial organizational structure.

* **System Admin:** In this section, provide the administrator's following information.
  - **Admin Account Display Name:** The display name for the administrator account.
  - **Admin Account Email:** The email address for the administrator account.
  - **Admin Account Password:** The password for the administrator account.You may manually set a password or leave it blank to allow the system to **auto-generate** a secure administrative password.
  - **Initial Organization Name:** You can choose what will be the initial organization name for your account

For openshift cluster toggle Red Hat OpenShift cluster and give Kube API Server endpoint 



### 4. Release
Define the specific Kubernetes namespace and release information for the Ace components.

* **Release Name:** Defaults to `ace`.
* **Namespace:** Enter the target namespace (default: `ace`). 
* **Namespace Automation:** Toggle **"Create namespaces during Helm install"** if you want the installer to handle namespace lifecycle management.



### 5. Registry
Ace requires access to various container registries and Helm repositories to pull necessary images and charts.

**Docker Registry:** Go to the docker registry section first then look for the following settings
* **Proxies:** Put registry name for Appscode `r.appscode.com` and other Public Registries like Docker Hub, GitHub Container Registry (`ghcr.io`), Kubernetes Registry, Microsoft (`mcr.microsoft.com`), and Quay.
* **Helm Repositories:** In the helm repositories section put your helm repository url
If using private or authenticated registries, provide:
* **Credentials:** Username and Password.
* **Certs:** Upload CA Cert, Client Cert, and Client Key if required for mutual TLS.
* **Image Pull Secrets:** Define the secrets used by the cluster to authenticate with the registries. You can enable create namespace during helm install, allow nondistributable artifacts and insecure option for insecure registry


### 6. Settings
This secton is for Persistence & Resource Allocation. Properly sizing your resources is critical for production stability. Configure CPU Requests, CPU Limits, Memory Request and  Memory Limit for both cache and Database

> [!IMPORTANT]
> Ensure your cluster has a **Storage Class** defined to fulfill the PVC requests for both the Cache and the Database.
If SMTP is enabled then put Host, Username, Password and From. You can also enable Send As Plain Text and TLS. 

#### Domain White List and Proxy Servers

* Add domain one by one for whitelisting
* **Proxy Servers:** If you have proxy servers then put **HTTP Proxy**, **HTTPS Proxy** and **No Proxy**
* Put Login and Logout URL for your app


#### KubeStash
Ace uses **KubeStash** for automated backups and disaster recovery.

* **Retention Policy:** Define how long backups are kept (e.g., `keep-1mo`).
* **Schedule:** Set the backup frequency using Cron syntax (default: `0 */2 * * *` or every 2 hours).
* **Storage Secret:** Select the secret containing credentials for your cloud provider.

### 7. Infra 

* **Cloud Services:** Configure your **Provider** (e.g., AWS, GCP, Azure), **Bucket Name**, **Endpoint**, **Region** and **Prefix**. In the **Auth Section** put your `AWS Access Key ID`,`AWS Secret Access Key` and `CA CERT Data`
* **StorageClass:** Select your StorageClass in this section
* **TLS:** Configure TLS certificates for secure communication. You can choose the Issuer type from the following list.
  * **External**: Use this if you already have certificates from an external provider.
      * CA CERT: Paste the Certificate Authority certificate.
      * Certificate CERT: Paste the certificate issued for your domain.
      * Certificate Key: Paste the private key associated with the certificate.

  * **CA:** Use this if you want AppsCode to manage your certificates with its internal CA.
      * CA CERT: Paste the internal CA certificate.
      * CA Key: Paste the internal CA key.
  * **letsencrypt:** Use this for production environments to obtain globally trusted SSL/TLS certificates.
  * **letsencrypt-staging:** Use this for testing your installation

### 8. Ingress & Gateway
Configure how the application is exposed to the internet or your internal network.

* **Ingress & Gateway:** Enable either the **Gateway API** or standard **Ingress**. 


### 9. NATS

Configure NATS, which is used as the internal messaging system for the platform.

**Expose Via:**
  Choose how NATS will be exposed:

  * **HostPort:** Exposes NATS directly on the node’s network interface.

    * **Node Selector:** Specify the node label (Key and Value) to control where NATS will be scheduled.
  * **Ingress:** Use this option to expose NATS externally via an ingress controller.
**Replicas:** For production, ensure at least 1 replica is active (consider 3 for high availability).
**Resources:** Configure CPU Requests, CPU Limits, Memory Request and  Memory Limit



### 10. Self Management
In this section you can enable or disable features


### 11. Branding & UI Customization
Administrators can globally re-brand the Ace interface to match corporate identity.

* **App Name:** Changes the browser tab title.
* **Primary Color:** Enter a Hex code (default: `#009948`).
* **Assets:**
    * **Logo:** Upload a 200x30px image (SVG/PNG recommended).
    * **Favicon:** Upload a 20KB icon file.
* **App Tag:** Toggle **"Show App Tag"** to display or hide the version/tagging info in the UI.

### 12. Generate Installer and Documentation

Click the "Deploy" button to submit your information. AppsCode will generate the installer and provide the necessary documentation.

### 13. Deploy AppsCode Platform

Follow the documentation provided by AppsCode to deploy the AppsCode Platform on your system.

### 14. Explore the Deployed Platform

Once deployed, access the AppsCode Platform using the specified domain. Log in with the admin account credentials provided during the creation process.