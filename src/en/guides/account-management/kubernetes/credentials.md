---
layout: 'guide'
menu:
  docs_menu:
    identifier: account-management-kubernetes-creds
    name: Credentials
    parent: account-management-kubernetes
    weight: 20
  home_menu:
    identifier: home-account-kubernetes-creds
    name: Credentials
    parent: home-account-kubernetes
    weight: 20
menu_name: docs_menu
section_menu: guides
---


# Kubernetes Credentials Management

In order to integrate a vendor-managed Kubernetes cluster into our system, you can either opt o `Create` a new cluster or `Import` an existing one. This process involves adding specific credentials based on your vendor. <br>
Supported Credential Types include: <br>
- [AWS](#aws)
- [Azure](#azure)
- [Digital Ocean](#digital-ocean)
- [Google Cloud](#google-cloud)
- [Google OAuth](#google-oauth)
- [Linode](#linode)
- [Rancher](#rancher)

Visit https://home.appscode.com/user/settings/credentials to manage credential.


## AWS

To access EKS clusters, you need to run the following commands and provide us the generated `AccessKeyID` and `SecretAccessKey`.
- Create a policy
    ```sh
    echo '{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "eks:DescribeCluster",
                    "eks:ListClusters"
                ],
                "Resource": "*"
            },
            {
                "Effect": "Allow",
                "Action": "ec2:DescribeRegions",
                "Resource": "*"
            }
        ]
    }' > eks-cluster-policy.json
    ```
    ```sh
    aws iam create-policy --policy-name eks-cluster-policy --policy-document file://eks-cluster-policy.json

    POLICY_ARN=$(aws iam list-policies --query 'Policies[?PolicyName==`eks-cluster-policy`].Arn' --output text)
    ```
- Create a user and attach this policy to that user
    ```sh
    aws iam create-user --user-name "eks-cluster"
    aws iam attach-user-policy --user-name "eks-cluster" --policy-arn $POLICY_ARN
    ```
- Create Access Token for the user
    ```sh
    aws iam create-access-key --user-name "eks-cluster"
    ```

Then add the credential [here](https://home.appscode.com/user/settings/credentials/create) you got from previous step.

<img  width="50%" src="/images/aws-cred.png">

<!-- ![Add AWS Credential](/images/aws-cred.png) -->

## Azure

To configure Azure credentials for accessing and managing Azure Kubernetes Service (AKS) clusters, follow these steps using the Azure CLI:
- Set the Azure subscription ID using the following command.
    ```sh
    export AZURE_SUBSCRIPTION_ID=$(az account show --query id --output tsv)
    ```
- Create Azure Service Principal with `Contributor` role.
    ```sh
    az ad sp create-for-rbac --role Contributor --scopes="/subscriptions/${AZURE_SUBSCRIPTION_ID}" --sdk-auth
    ```
- Save Credentials <br>
The command will output a JSON response containing the service principal details, including clientId (Application ID), clientSecret (Client Secret), subscriptionId, tenantId, and other information. Save these credentials securely as they will be used to configure the AKS cluster.

Then add the credential [here](https://home.appscode.com/user/settings/credentials/create).


<img align="right" width="50%" src="/images/do-cred.png">

## Digital Ocean
To access Digital Ocean Managed clusters, you need to create a API token from Digital Ocean.

Ref: [How to Create a Personal Access Token](https://docs.digitalocean.com/reference/api/create-personal-access-token/)


Then add the credential [here](https://home.appscode.com/user/settings/credentials/create) you got from Digital Ocean.

<br><br><br><br>

## Google Cloud

To access GKE clusters, you need to create a GCP service account with with container.admin role.

- Set Project id, service account name
    ```sh
    # Set the project ID where you registered your Domain
    PROJECT_ID="myproject-id" # change it to your project id
    GKE_SA_NAME="gke-cluster" # change it to your desired sa name
    GKE_SA_EMAIL="$GKE_SA_NAME@${PROJECT_ID}.iam.gserviceaccount.com"
    ```
- Create Service account and Assign permission
    ```sh
    gcloud iam service-accounts create $GKE_SA_NAME --display-name $GKE_SA_NAME

    # assign google service account to dns.admin role in cloud-dns project
    gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member serviceAccount:$GKE_SA_EMAIL --role "roles/container.admin"
    ```
- Create a Service Account Secret
    ```sh
    # download static credentials
    gcloud iam service-accounts keys create $GKE_SA_NAME-credentials.json \
    --iam-account $GKE_SA_EMAIL
    ```

Then add the service account credentials [here](https://home.appscode.com/user/settings/credentials/create).

<img align="right" width="50%" src="/images/gcp-oauth.png">

## Google OAuth

Simplest way to access GKE clusters is through creating `Google OAuth` type credential. <br>
Just head over [here](https://home.appscode.com/user/settings/credentials/create) and
- Choose a `Name`
- Select Credential Type: `Google OAuth`
- Click `Continue with Google`


This will create a credential, you will be able to access your k8s cluster with.

<br><br><br>

<img align="right" width="50%" src="/images/linode-cred.png">

## Linode

To access LKE clusters, you need to create a API token from Linode with the following permissions.
- Kubernetes (Read/Write)

Ref: [Manage Linode Personal Access Tokens](https://www.linode.com/docs/products/tools/api/guides/manage-api-tokens/)


Then add the credential [here](https://home.appscode.com/user/settings/credentials/create) you got from Linode.

<br><br><br>
## Rancher



<!-- {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "eks:DescribeCluster",
                "eks:ListClusters"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "ec2:DescribeRegions",
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "eks:ListUpdates",
                "eks:UpdateClusterConfig",
                "eks:UpdateClusterVersion"
            ],
            "Resource": "arn:aws:eks:*:*:cluster/*"
        }
    ]
} -->