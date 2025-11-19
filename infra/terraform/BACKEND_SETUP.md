# Terraform Remote Backend Setup Guide

This guide will help you set up a remote backend for Terraform using S3 and DynamoDB.

## Why Remote Backend?

- **State Management**: Centralized state storage
- **Team Collaboration**: Multiple people can work on infrastructure
- **State Locking**: Prevents concurrent modifications
- **State History**: Versioning in S3
- **Security**: Encrypted state storage

## Setup Steps

### Step 1: Bootstrap Backend Resources

First, create the S3 bucket and DynamoDB table that will store your Terraform state:

```bash
cd infra/terraform/shared

# Initialize Terraform (uses local backend)
terraform init

# Review what will be created
terraform plan

# Create the resources
terraform apply
```

**Important**: This bootstrap uses local backend first. After creating these resources, you'll use them as the remote backend.

### Step 2: Get Output Values

After applying, get the resource names:

```bash
terraform output
```

You should see:
- `s3_bucket_name`: `devops-deployment-terraform-state-us-east-1`
- `dynamodb_table_name`: `devops-deployment-terraform-lock`

### Step 3: Update Backend Configuration

The backend configuration is already set up in `environments/dev/backend.tf`. 

**Before first use**, you need to migrate:

```bash
cd infra/terraform/environments/dev

# Initialize with remote backend (will prompt to migrate)
terraform init

# When prompted, type "yes" to migrate state to S3
```

### Step 4: Verify

After migration:

```bash
# Check that state is in S3
aws s3 ls s3://devops-deployment-terraform-state-us-east-1/dev/

# Your state file should be there: terraform.tfstate
```

## What Gets Created

### S3 Bucket
- **Name**: `devops-deployment-terraform-state-us-east-1`
- **Purpose**: Stores Terraform state files
- **Features**:
  - Versioning enabled (history of changes)
  - Encryption enabled (AES256)
  - Public access blocked (security)

### DynamoDB Table
- **Name**: `devops-deployment-terraform-lock`
- **Purpose**: State locking (prevents conflicts)
- **Features**:
  - Pay-per-request billing (cheap)
  - Automatic locking/unlocking

## Backend Configuration

Each environment has its own state file:
- `dev/terraform.tfstate` - Dev environment state
- `prod/terraform.tfstate` - Prod environment state (when created)

## Troubleshooting

### Error: "Backend configuration changed"
This is normal when first setting up. Run:
```bash
terraform init -migrate-state
```

### Error: "Bucket does not exist"
Make sure you ran the bootstrap step first:
```bash
cd infra/terraform/shared
terraform apply
```

### Error: "Access Denied"
Check your AWS credentials:
```bash
aws sts get-caller-identity
```

## Security Best Practices

✅ State is encrypted in S3
✅ Public access is blocked
✅ Versioning enabled (can recover previous states)
✅ State locking prevents conflicts
✅ Each environment has separate state file

## Cost

- **S3**: ~$0.023 per GB/month (very cheap for state files)
- **DynamoDB**: Pay-per-request, essentially free for low usage
- **Total**: Less than $1/month for typical usage

## Next Steps

After backend is set up:
1. Your state is now safely stored in S3
2. Team members can collaborate
3. State is versioned and recoverable
4. Ready for CI/CD integration

