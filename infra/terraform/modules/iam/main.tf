# IAM Module - main.tf
# IAM Role with OIDC for GitHub Actions CI/CD

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

  tags = merge(var.tags, {
    Name = "${var.environment}-github-oidc"
    Type = "OIDCProvider"
  })
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

  tags = merge(var.tags, {
    Name = "${var.environment}-github-actions-role"
    Type = "IAMRole"
  })
}

# IAM Policy for GitHub Actions
# What permissions does this role have?
resource "aws_iam_policy" "github_actions" {
  name        = "${var.environment}-github-actions-policy"
  description = "Policy for GitHub Actions to push to ECR and deploy to EKS"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:DescribeRepositories",
          "ecr:DescribeImages",
          "ecr:ListImages"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "eks:DescribeCluster",
          "eks:ListClusters"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "eks:UpdateKubeconfig"
        ]
        Resource = var.eks_cluster_name != "" ? "arn:aws:eks:${var.aws_region}:${var.aws_account_id}:cluster/${var.eks_cluster_name}" : "*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::devops-deployment-terraform-state-*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ]
        Resource = [
          "arn:aws:s3:::devops-deployment-terraform-state-*/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:DescribeTable",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:DeleteItem"
        ]
        Resource = "arn:aws:dynamodb:${var.aws_region}:${var.aws_account_id}:table/devops-deployment-terraform-lock"
      },
      {
        Effect = "Allow"
        Action = [
          "iam:*",
          "ec2:*",
          "vpc:*",
          "eks:*",
          "ecr:*",
          "logs:*",
          "autoscaling:*",
          "application-autoscaling:*"
        ]
        Resource = "*"
      }
    ]
  })

  tags = merge(var.tags, {
    Name = "${var.environment}-github-actions-policy"
    Type = "IAMPolicy"
  })
}

# Attach policy to role
resource "aws_iam_role_policy_attachment" "github_actions" {
  role       = aws_iam_role.github_actions.name
  policy_arn = aws_iam_policy.github_actions.arn
}

