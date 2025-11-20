# Bootstrap Outputs

output "iam_role_arn" {
  description = "ARN of the IAM role for GitHub Actions"
  value       = aws_iam_role.github_actions.arn
}

output "iam_role_name" {
  description = "Name of the IAM role"
  value       = aws_iam_role.github_actions.name
}

output "oidc_provider_arn" {
  description = "ARN of the OIDC provider"
  value       = aws_iam_openid_connect_provider.github.arn
}

output "setup_instructions" {
  description = "Instructions for next steps"
  value = <<-EOT
    ============================================
    Bootstrap Complete! 🎉
    ============================================
    
    ✅ OIDC Provider Created
    ✅ IAM Role Created: ${aws_iam_role.github_actions.name}
    ✅ Policy Attached
    
    📝 Next Steps:
    
    1. Verify the IAM role ARN matches your workflow configuration:
       ${aws_iam_role.github_actions.arn}
    
    2. You can now run infrastructure.yml - it will use OIDC authentication
    
    3. Infrastructure workflow will create:
       - VPC
       - EKS Cluster
       - ECR Repository
       - Update IAM role with EKS-specific permissions
    
    ============================================
  EOT
}

