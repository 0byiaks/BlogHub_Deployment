# Terraform Backend Bootstrap

This directory contains the bootstrap configuration to create the S3 bucket and DynamoDB table for Terraform remote backend.

## What This Creates

1. **S3 Bucket**: Stores Terraform state files
   - Name: `devops-deployment-terraform-state-us-east-1`
   - Versioning enabled
   - Encryption enabled
   - Public access blocked

2. **DynamoDB Table**: Provides state locking
   - Name: `devops-deployment-terraform-lock`
   - Prevents concurrent Terraform runs
   - Pay-per-request billing

## Bootstrap Steps

### Step 1: Create Backend Resources

```bash
cd infra/terraform/shared
terraform init
terraform plan
terraform apply
```

### Step 2: Get Output Values

After applying, note the outputs:
```bash
terraform output
```

You'll need:
- `s3_bucket_name` (e.g., `devops-deployment-terraform-state-us-east-1`)
- `dynamodb_table_name` (e.g., `devops-deployment-terraform-lock`)

### Step 3: Update Main Terraform Backend

After creating the backend resources, update the main Terraform configuration to use the remote backend.

## Important Notes

- This bootstrap uses **local backend** first (to avoid chicken-and-egg problem)
- After creating these resources, you'll configure the main Terraform to use remote backend
- These resources are shared across all environments
- Keep this state file safe - it manages your backend infrastructure

