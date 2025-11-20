# Bootstrap IAM Policy

The AWS user/role used for bootstrap needs these IAM permissions to create OIDC provider and IAM role.

## Required IAM Permissions

Attach this policy to your AWS user (`Devops_deployment`) or the IAM role you're using for bootstrap:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "OIDCProviderPermissions",
      "Effect": "Allow",
      "Action": [
        "iam:CreateOpenIDConnectProvider",
        "iam:GetOpenIDConnectProvider",
        "iam:ListOpenIDConnectProviders",
        "iam:TagOpenIDConnectProvider",
        "iam:UpdateOpenIDConnectProviderThumbprint",
        "iam:DeleteOpenIDConnectProvider"
      ],
      "Resource": "*"
    },
    {
      "Sid": "IAMRolePermissions",
      "Effect": "Allow",
      "Action": [
        "iam:CreateRole",
        "iam:GetRole",
        "iam:ListRoles",
        "iam:UpdateRole",
        "iam:DeleteRole",
        "iam:ListRolePolicies",
        "iam:ListAttachedRolePolicies",
        "iam:TagRole",
        "iam:UntagRole"
      ],
      "Resource": "*"
    },
    {
      "Sid": "IAMPolicyPermissions",
      "Effect": "Allow",
      "Action": [
        "iam:CreatePolicy",
        "iam:GetPolicy",
        "iam:ListPolicies",
        "iam:ListPolicyVersions",
        "iam:CreatePolicyVersion",
        "iam:DeletePolicy",
        "iam:DeletePolicyVersion",
        "iam:TagPolicy",
        "iam:UntagPolicy"
      ],
      "Resource": "*"
    },
    {
      "Sid": "IAMRolePolicyAttachmentPermissions",
      "Effect": "Allow",
      "Action": [
        "iam:AttachRolePolicy",
        "iam:DetachRolePolicy"
      ],
      "Resource": "*"
    },
    {
      "Sid": "PassRolePermissions",
      "Effect": "Allow",
      "Action": [
        "iam:PassRole"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "iam:PassedToService": [
            "ec2.amazonaws.com",
            "eks.amazonaws.com"
          ]
        }
      }
    },
    {
      "Sid": "S3BackendPermissions",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetBucketVersioning",
        "s3:GetBucketAcl",
        "s3:GetBucketLocation",
        "s3:GetObject",
        "s3:GetObjectVersion",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::devops-deployment-terraform-state-*",
        "arn:aws:s3:::devops-deployment-terraform-state-*/*"
      ]
    },
    {
      "Sid": "DynamoDBBackendPermissions",
      "Effect": "Allow",
      "Action": [
        "dynamodb:DescribeTable",
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/devops-deployment-terraform-lock"
    }
  ]
}
```

## How to Apply

### Option 1: Attach Policy to IAM User (Recommended for Bootstrap)

1. Go to AWS Console → IAM → Users → `Devops_deployment`
2. Click "Add permissions" → "Attach policies directly"
3. Click "Create policy"
4. Switch to JSON tab
5. Paste the policy above
6. Name it: `BootstrapIAMFullAccess`
7. Create policy
8. Attach it to your user

### Option 2: Use AWS CLI

```bash
# Create the policy
aws iam create-policy \
  --policy-name BootstrapIAMFullAccess \
  --policy-document file://bootstrap-iam-policy.json

# Attach to user
aws iam attach-user-policy \
  --user-name Devops_deployment \
  --policy-arn arn:aws:iam::YOUR_ACCOUNT_ID:policy/BootstrapIAMFullAccess
```

## Additional Permissions Needed

The bootstrap user also needs S3 and DynamoDB permissions for Terraform state backend:

- **S3**: For storing Terraform state files
- **DynamoDB**: For state locking (prevents concurrent modifications)

These are included in the policy above.

## Security Note

⚠️ **This policy grants broad IAM, S3, and DynamoDB permissions** - it's needed for bootstrap to:
- Create IAM resources (OIDC provider, roles, policies)
- Access Terraform state backend (S3 bucket and DynamoDB table)

After bootstrap completes and OIDC is set up:
- You can remove this policy from the user
- Future workflows will use OIDC (no access keys needed)
- Consider rotating or deleting the access keys after bootstrap

