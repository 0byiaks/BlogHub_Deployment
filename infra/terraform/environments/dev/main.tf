# Dev Environment Root Module
# Self-contained configuration - includes provider and all resources

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  # Backend configuration is in backend.tf
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = var.project_name
      ManagedBy   = "terraform"
      Environment = var.environment
    }
  }
}

# VPC Module
module "vpc" {
  source = "../../modules/vpc"
  
  environment = var.environment
  vpc_cidr    = var.vpc_cidr
  
  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

# EKS Module
module "eks" {
  source = "../../modules/eks"
  
  cluster_name    = "${var.project_name}-${var.environment}"
  cluster_version = var.cluster_version
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnet_ids  # Using private subnets with NAT Gateway
  vpc_cidr        = var.vpc_cidr
  
  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

# ECR Module
module "ecr" {
  source = "../../modules/ecr"
  
  environment     = var.environment
  repository_name = var.repository_name
  
  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

# IAM Module for GitHub Actions (OIDC)
module "iam" {
  source = "../../modules/iam"
  
  environment      = var.environment
  aws_region       = var.aws_region
  aws_account_id   = var.aws_account_id
  eks_cluster_name = module.eks.cluster_name
  github_org        = var.github_org
  github_repo       = var.github_repo
  
  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

