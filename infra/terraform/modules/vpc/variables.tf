# VPC Module - variables.tf
variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets (optional - will be calculated from vpc_cidr if not provided)"
  type        = list(string)
  default     = []
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets (optional - will be calculated from vpc_cidr if not provided)"
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "A map of tags to assign to the resource"
  type        = map(string)
  default     = {}
}
