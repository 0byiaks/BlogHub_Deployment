# ECR Module - main.tf
# Single ECR Repository
resource "aws_ecr_repository" "main" {
  name                 = "${var.environment}-${var.repository_name}"
  image_tag_mutability = "MUTABLE"
  force_delete         = true  # Allow deletion even if repository contains images

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = merge(var.tags, {
    Name = "${var.environment}-${var.repository_name}"
    Type = "ECRRepository"
  })
}

# Lifecycle policy to clean up old images
resource "aws_ecr_lifecycle_policy" "main" {
  repository = aws_ecr_repository.main.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep last 10 images"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 10
      }
      action = {
        type = "expire"
      }
    }]
  })
}
