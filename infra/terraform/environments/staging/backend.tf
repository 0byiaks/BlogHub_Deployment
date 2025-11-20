# Terraform Remote Backend Configuration
# This uses S3 for state storage and DynamoDB for locking

terraform {
  backend "s3" {
    bucket         = "devops-deployment-terraform-state-eu-north-1"
    key            = "staging/terraform.tfstate"
    region         = "eu-north-1"
    dynamodb_table = "devops-deployment-terraform-lock"
    encrypt        = true
  }
}

