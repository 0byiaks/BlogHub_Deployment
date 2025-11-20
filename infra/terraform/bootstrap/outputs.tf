# Bootstrap Outputs

output "iam_role_arn" {
  description = "ARN of the IAM role for GitHub Actions"
  value       = module.iam.iam_role_arn
}

output "iam_role_name" {
  description = "Name of the IAM role"
  value       = module.iam.iam_role_name
}

output "oidc_provider_arn" {
  description = "ARN of the OIDC provider"
  value       = module.iam.oidc_provider_arn
}

output "setup_instructions" {
  description = "Instructions for next steps"
  value       = <<-EOT
    ============================================
    Bootstrap Complete! 🎉
    ============================================
    
    ✅ OIDC Provider Created
    ✅ IAM Role Created: ${module.iam.iam_role_name}
    ✅ Policy Attached
    
    📝 Next Steps:
    
    1. Verify the IAM role ARN matches your workflow configuration:
       ${module.iam.iam_role_arn}
    
    2. You can now run infrastructure.yml - it will use OIDC authentication
    
    3. Infrastructure workflow will create:
       - VPC
       - EKS Cluster
       - ECR Repository
       - (IAM is already created by bootstrap)
    
    ============================================
  EOT
}

