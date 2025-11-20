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

# OIDC Provider for GitHub
# This tells AWS: "Trust GitHub's identity provider"
resource "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = [
    "sts.amazonaws.com"
  ]

  # GitHub's certificate thumbprints (for security verification)
  thumbprint_list = [
    "6938fd4d98bab03faadb97b34396831e3780aea1",
    "1c58a3a8518e8759bf075b76b750d4f2df264fcd"
  ]

  tags = {
    Name        = "${var.environment}-github-oidc"
    Type        = "OIDCProvider"
    Environment = var.environment
    Project     = var.project_name
  }
}

# IAM Role for GitHub Actions
# This role will be assumed by GitHub Actions using OIDC
resource "aws_iam_role" "github_actions" {
  name = "${var.environment}-github-actions-role"

  # Trust policy: Who can assume this role?
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = aws_iam_openid_connect_provider.github.arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            "token.actions.githubusercontent.com:sub" = "repo:${var.github_org}/${var.github_repo}:*"
          }
        }
      }
    ]
  })

  tags = {
    Name        = "${var.environment}-github-actions-role"
    Type        = "IAMRole"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Basic IAM Policy for GitHub Actions (bootstrap version)
# This includes basic permissions needed for infrastructure creation
# Infrastructure workflow will update this with full permissions later
resource "aws_iam_policy" "github_actions_bootstrap" {
  name        = "${var.environment}-github-actions-policy"
  description = "Bootstrap policy for GitHub Actions - allows infrastructure creation"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ec2:*",
          "eks:*",
          "ecr:*",
          "iam:CreateRole",
          "iam:DeleteRole",
          "iam:GetRole",
          "iam:ListRoles",
          "iam:UpdateRole",
          "iam:AttachRolePolicy",
          "iam:DetachRolePolicy",
          "iam:ListAttachedRolePolicies",
          "iam:CreatePolicy",
          "iam:DeletePolicy",
          "iam:GetPolicy",
          "iam:ListPolicies",
          "iam:CreateOpenIDConnectProvider",
          "iam:GetOpenIDConnectProvider",
          "iam:ListOpenIDConnectProviders",
          "iam:TagRole",
          "iam:PassRole",
          "s3:*",
          "dynamodb:*",
          "logs:*",
          "autoscaling:*",
          "elasticloadbalancing:*"
        ]
        Resource = "*"
      }
    ]
  })

  tags = {
    Name        = "${var.environment}-github-actions-policy"
    Type        = "IAMPolicy"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Attach policy to role
resource "aws_iam_role_policy_attachment" "github_actions" {
  role       = aws_iam_role.github_actions.name
  policy_arn = aws_iam_policy.github_actions_bootstrap.arn
}

