# IAM Module - variables.tf

variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-north-1"
}

variable "aws_account_id" {
  description = "AWS Account ID"
  type        = string
}

variable "eks_cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
}

variable "github_org" {
  description = "GitHub organization or username (e.g., 'your-username' or 'your-org')"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name (e.g., 'Devops_Deployment')"
  type        = string
}

variable "tags" {
  description = "A map of tags to assign to the resource"
  type        = map(string)
  default     = {}
}

