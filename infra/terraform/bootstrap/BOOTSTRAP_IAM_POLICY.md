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

## Security Note

⚠️ **This policy grants broad IAM permissions** - it's needed for bootstrap to create IAM resources.

After bootstrap completes and OIDC is set up:
- You can remove this policy from the user
- Future workflows will use OIDC (no access keys needed)
- Consider rotating or deleting the access keys after bootstrap

