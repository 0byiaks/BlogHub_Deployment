# ECR Module - variables.tf
variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "repository_name" {
  description = "Name of the ECR repository"
  type        = string
  default     = "bloghub"
}

variable "tags" {
  description = "A map of tags to assign to the resource"
  type        = map(string)
  default     = {}
}
