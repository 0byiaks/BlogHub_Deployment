# Bootstrap Terraform Configuration
# This creates ONLY the OIDC provider and IAM role for GitHub Actions
# This must run FIRST before infrastructure.yml can use OIDC authentication

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Use local backend for bootstrap (or separate S3 key)
  backend "s3" {
    bucket         = "devops-deployment-terraform-state-eu-north-1"
    key            = "bootstrap/terraform.tfstate"
    region         = "eu-north-1"
    dynamodb_table = "devops-deployment-terraform-lock"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      ManagedBy   = "terraform"
      Environment = var.environment
      Purpose     = "bootstrap"
    }
  }
}

# IAM Module for GitHub Actions (OIDC)
# Using the reusable IAM module - EKS cluster name is optional during bootstrap
module "iam" {
  source = "../modules/iam"

  environment      = var.environment
  aws_region       = var.aws_region
  aws_account_id   = var.aws_account_id
  eks_cluster_name = "" # Empty during bootstrap - EKS doesn't exist yet
  github_org       = var.github_org
  github_repo      = var.github_repo

  tags = {
    Environment = var.environment
    Project     = var.project_name
    Purpose     = "bootstrap"
  }
}

