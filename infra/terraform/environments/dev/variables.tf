# Dev Environment Variables
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-north-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "devops-deployment"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "cluster_version" {
  description = "Kubernetes version for EKS cluster"
  type        = string
  default     = "1.28"
}

variable "repository_name" {
  description = "Name of the ECR repository"
  type        = string
  default     = "bloghub"
}

variable "aws_account_id" {
  description = "AWS Account ID"
  type        = string
  default     = "716769866080"
}

variable "github_org" {
  description = "GitHub organization or username"
  type        = string
  # TODO: Update with your GitHub username or organization
  default     = ""  # Will need to be set via terraform.tfvars or environment variable
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "Devops_Deployment"
}
