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

## Prerequisite

You have to create an `Access Key` and `Secret Key` with following policies attached. Check out similar [eksctl docs](https://eksctl.io/usage/minimum-iam-policies/) for reference. 

### For creating and managing the EKS Cluster and EC2 resources:

AmazonEC2FullAccess (AWS Managed Policy)
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": "ec2:*",
            "Effect": "Allow",
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "elasticloadbalancing:*",
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "cloudwatch:*",
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "autoscaling:*",
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "iam:CreateServiceLinkedRole",
            "Resource": "*",
            "Condition": {
                "StringEquals": {
                    "iam:AWSServiceName": [
                        "autoscaling.amazonaws.com",
                        "ec2scheduled.amazonaws.com",
                        "elasticloadbalancing.amazonaws.com",
                        "spot.amazonaws.com",
                        "spotfleet.amazonaws.com",
                        "transitgateway.amazonaws.com"
                    ]
                }
            }
        }
    ]
}
```
AWSCloudFormationFullAccess (AWS Managed Policy)
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "cloudformation:*"
            ],
            "Resource": "*"
        }
    ]
}
```
EksAllAccess
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "eks:*",
            "Resource": "*"
        },
        {
            "Action": [
                "ssm:GetParameter",
                "ssm:GetParameters"
            ],
            "Resource": [
                "arn:aws:ssm:*:<account_id>:parameter/aws/*",
                "arn:aws:ssm:*::parameter/aws/*"
            ],
            "Effect": "Allow"
        },
        {
             "Action": [
               "kms:CreateGrant",
               "kms:DescribeKey"
             ],
             "Resource": "*",
             "Effect": "Allow"
        },
        {
             "Action": [
               "logs:PutRetentionPolicy"
             ],
             "Resource": "*",
             "Effect": "Allow"
        }        
    ]
}
```
IamLimitedAccess
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "iam:CreateInstanceProfile",
                "iam:DeleteInstanceProfile",
                "iam:GetInstanceProfile",
                "iam:RemoveRoleFromInstanceProfile",
                "iam:GetRole",
                "iam:CreateRole",
                "iam:DeleteRole",
                "iam:AttachRolePolicy",
                "iam:PutRolePolicy",
                "iam:UpdateAssumeRolePolicy",
                "iam:AddRoleToInstanceProfile",
                "iam:ListInstanceProfilesForRole",
                "iam:PassRole",
                "iam:DetachRolePolicy",
                "iam:DeleteRolePolicy",
                "iam:GetRolePolicy",
                "iam:GetOpenIDConnectProvider",
                "iam:CreateOpenIDConnectProvider",
                "iam:DeleteOpenIDConnectProvider",
                "iam:TagOpenIDConnectProvider",
                "iam:ListAttachedRolePolicies",
                "iam:TagRole",
                "iam:UntagRole",
                "iam:GetPolicy",
                "iam:CreatePolicy",
                "iam:DeletePolicy",
                "iam:ListPolicyVersions"
            ],
            "Resource": [
                "arn:aws:iam::<account_id>:instance-profile/eksctl-*",
                "arn:aws:iam::<account_id>:role/eksctl-*",
                "arn:aws:iam::<account_id>:policy/eksctl-*",
                "arn:aws:iam::<account_id>:oidc-provider/*",
                "arn:aws:iam::<account_id>:role/aws-service-role/eks-nodegroup.amazonaws.com/AWSServiceRoleForAmazonEKSNodegroup",
                "arn:aws:iam::<account_id>:role/eksctl-managed-*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:GetRole",
                "iam:GetUser"
            ],
            "Resource": [
                "arn:aws:iam::<account_id>:role/*",
                "arn:aws:iam::<account_id>:user/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:CreateServiceLinkedRole"
            ],
            "Resource": "*",
            "Condition": {
                "StringEquals": {
                    "iam:AWSServiceName": [
                        "eks.amazonaws.com",
                        "eks-nodegroup.amazonaws.com",
                        "eks-fargate.amazonaws.com"
                    ]
                }
            }
        }
    ]
}
```

### S3:FullAccess for storing cluster backups
AmazonS3FullAccess (AWS Managed Policy)
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:*",
                "s3-object-lambda:*"
            ],
            "Resource": "*"
        }
    ]
}
```
## Application Deployment
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

**Domain White List (required):** You must specify the end users domains, the system will only allow users with those specified domains. You can Add multiple domain whitelists at the same time.

You can also create an initial `CAPI Cluster` by enabling `capi-core` feature in the `Self Management` section. 

Also, you can customize your system's appearance by setting a custom logo, favicon, and primary color in the `Branding` section.

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
