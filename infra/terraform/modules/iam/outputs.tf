# IAM Module - outputs.tf

output "iam_role_arn" {
  description = "ARN of the IAM role for GitHub Actions (use this in GitHub Actions workflow)"
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
  description = "Instructions for updating GitHub Actions workflow"
  value = <<-EOT
    ============================================
    OIDC Setup Complete! 🎉
    ============================================
    
    ✅ OIDC Provider Created
    ✅ IAM Role Created: ${aws_iam_role.github_actions.name}
    ✅ Policy Attached
    
    📝 Next Steps:
    
    1. Update your GitHub Actions workflow (.github/workflows/ci-cd.yml)
    
    2. Add permissions at workflow level:
       permissions:
         id-token: write   # Required for OIDC
         contents: read
    
    3. Replace AWS credentials step with:
       - name: Configure AWS credentials
         uses: aws-actions/configure-aws-credentials@v4
         with:
           role-to-assume: ${aws_iam_role.github_actions.arn}
           aws-region: ${var.aws_region}
    
    4. Remove GitHub Secrets (no longer needed!):
       - AWS_ACCESS_KEY_ID
       - AWS_SECRET_ACCESS_KEY
    
    ============================================
    Role ARN: ${aws_iam_role.github_actions.arn}
    ============================================
  EOT
}

