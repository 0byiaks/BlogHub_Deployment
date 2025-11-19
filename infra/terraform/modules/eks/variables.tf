# EKS Module - variables.tf
variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
}

variable "cluster_version" {
  description = "Kubernetes version for the EKS cluster"
  type        = string
  default     = "1.28"
}

variable "vpc_id" {
  description = "ID of the VPC where the cluster will be created"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs for the EKS cluster"
  type        = list(string)
}

variable "vpc_cidr" {
  description = "CIDR block of the VPC"
  type        = string
}

variable "instance_types" {
  description = "Instance types for the EKS node group"
  type        = list(string)
  default     = ["t3.small"]  # Minimum viable size for EKS (t3.micro is too small)
}

variable "desired_size" {
  description = "Desired number of worker nodes"
  type        = number
  default     = 1  # Start with 1 node for simplicity and cost savings
}

variable "max_size" {
  description = "Maximum number of worker nodes"
  type        = number
  default     = 4
}

variable "min_size" {
  description = "Minimum number of worker nodes"
  type        = number
  default     = 1
}

variable "tags" {
  description = "A map of tags to assign to the resource"
  type        = map(string)
  default     = {}
}
