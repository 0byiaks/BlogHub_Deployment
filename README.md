# BlogHub - Complete DevOps Deployment Platform

A production-ready microservices blog platform deployed on AWS using Kubernetes (EKS), with complete CI/CD automation, infrastructure as code, and multi-environment support.

## Table of Contents

- [Project Description](#project-description)
- [Project Details](#project-details)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Complete Setup Guide](#complete-setup-guide)
- [Quick Start (Local Development)](#quick-start-local-development)
- [Infrastructure Setup](#infrastructure-setup)
- [Application Services](#application-services)
- [Kubernetes Deployment](#kubernetes-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)
- [Deployment Issues & Lessons Learned](#deployment-issues--lessons-learned)

## Project Description

BlogHub is a modern, scalable blog platform designed to demonstrate enterprise-grade DevOps practices. It's a full-stack microservices application that allows users to create, read, update, and delete blog posts, interact through comments, receive notifications, and manage user accounts.

### Key Features

- **User Management**: Registration, authentication, and profile management
- **Blog Posts**: Create, edit, delete, and browse blog posts
- **Comments System**: Comment on posts with threaded discussions
- **Notifications**: Real-time notifications for user interactions
- **Responsive UI**: Modern React frontend with intuitive user experience
- **Microservices Architecture**: Independent, scalable services
- **High Availability**: Multi-replica deployments with health checks
- **Automated CI/CD**: Complete deployment pipeline with GitHub Actions
- **Infrastructure as Code**: Fully automated infrastructure provisioning
- **Multi-Environment**: Separate staging and production environments

### Technology Stack

**Frontend:**
- React 18+ with Vite
- Modern CSS with component-based styling
- Responsive design

**Backend Services:**
- Node.js with Express.js
- RESTful API architecture
- JWT-based authentication
- Microservices pattern

**Infrastructure:**
- AWS EKS (Kubernetes 1.28)
- AWS ECR (Container Registry)
- AWS VPC (Networking)
- Terraform (Infrastructure as Code)
- GitHub Actions (CI/CD)

**DevOps Tools:**
- Docker & Docker Compose
- Kubernetes (K8s)
- kubectl
- AWS CLI
- Terraform

## Project Details

### Architecture Overview

BlogHub follows a microservices architecture pattern where each service is independently deployable and scalable:

```
┌─────────────┐
│   Frontend  │ (React SPA)
│  Port 3000  │
└──────┬──────┘
       │
       ├───▶ Post Service (Port 3001) ──┐
       ├───▶ Comment Service (Port 3002)│
       ├───▶ User Service (Port 3003)    │───▶ MongoDB/Database
       └───▶ Notification Service (3004) ┘
```

### Service Details

#### 1. Frontend Service
- **Technology**: React with Vite
- **Purpose**: User interface for the blog platform
- **Features**: 
  - Post creation and editing
  - User authentication UI
  - Comment display and creation
  - Notification center
  - User profile management
- **Port**: 3000
- **Deployment**: Nginx container serving static files

#### 2. Post Service
- **Technology**: Node.js/Express
- **Purpose**: Manages blog posts (CRUD operations)
- **Endpoints**:
  - `GET /api/posts` - List all posts
  - `GET /api/posts/:id` - Get single post
  - `POST /api/posts` - Create new post
  - `PUT /api/posts/:id` - Update post
  - `DELETE /api/posts/:id` - Delete post
- **Port**: 3001
- **Database**: MongoDB (or in-memory for demo)

#### 3. Comment Service
- **Technology**: Node.js/Express
- **Purpose**: Manages comments on blog posts
- **Endpoints**:
  - `GET /api/comments/post/:postId` - Get comments for a post
  - `POST /api/comments` - Create comment
  - `PUT /api/comments/:id` - Update comment
  - `DELETE /api/comments/:id` - Delete comment
- **Port**: 3002
- **Integration**: Communicates with Post Service and Notification Service

#### 4. User Service
- **Technology**: Node.js/Express
- **Purpose**: User authentication and management
- **Endpoints**:
  - `POST /api/users/register` - Register new user
  - `POST /api/users/login` - User login (returns JWT)
  - `GET /api/users/:id` - Get user profile
  - `GET /api/users` - List all users
- **Port**: 3003
- **Security**: JWT token-based authentication

#### 5. Notification Service
- **Technology**: Node.js/Express
- **Purpose**: Manages user notifications
- **Endpoints**:
  - `GET /api/notifications/user/:userId` - Get user notifications
  - `GET /api/notifications/user/:userId/unread-count` - Get unread count
  - `POST /api/notifications` - Create notification
  - `PUT /api/notifications/:id/read` - Mark as read
  - `PUT /api/notifications/user/:userId/read-all` - Mark all as read
- **Port**: 3004

### Infrastructure Components

#### AWS VPC (Virtual Private Cloud)
- **Public Subnets**: For load balancers and NAT Gateway
- **Private Subnets**: For EKS worker nodes and application pods
- **Internet Gateway**: Provides internet access to public subnets
- **NAT Gateway**: Allows private subnets to access internet (for pulling images, etc.)
- **Route Tables**: Configured for proper traffic routing
- **Security Groups**: EKS-managed for cluster and node communication

#### AWS EKS (Elastic Kubernetes Service)
- **Kubernetes Version**: 1.28
- **Cluster**: Managed control plane
- **Node Groups**: Auto-scaling worker nodes
- **Add-ons**: 
  - VPC CNI (networking)
  - CoreDNS (service discovery)
  - Kube Proxy (networking)
  - EBS CSI Driver (storage)

#### AWS ECR (Elastic Container Registry)
- **Purpose**: Private Docker image repository
- **Features**: 
  - Image scanning for vulnerabilities
  - Lifecycle policies for cleanup
  - IAM-based access control

#### Terraform Backend
- **S3 Bucket**: Stores Terraform state files
- **DynamoDB Table**: Provides state locking
- **Versioning**: Enabled for state file history
- **Encryption**: AES256 encryption at rest

### Deployment Architecture

```
GitHub Repository
    │
    ├─── Push to develop ──▶ GitHub Actions ──▶ Build Docker Images ──▶ Push to ECR
    │                                                                    │
    │                                                                    ▼
    └─── Push to develop ──▶ GitHub Actions ──▶ Deploy to EKS ──▶ Kubernetes Pods
                                                                    │
                                                                    ├─── Frontend Pods
                                                                    ├─── Post Service Pods
                                                                    ├─── Comment Service Pods
                                                                    ├─── User Service Pods
                                                                    └─── Notification Service Pods
```

### Security Features

- **OIDC Authentication**: GitHub Actions uses OIDC instead of access keys
- **IAM Roles**: Least privilege access for all services
- **Private Subnets**: Worker nodes in private subnets
- **EKS Security Groups**: Automatically managed by AWS
- **Encrypted State**: Terraform state encrypted in S3
- **Secrets Management**: Kubernetes Secrets for sensitive data
- **Network Isolation**: VPC with proper subnet segmentation

### Scalability Features

- **Horizontal Pod Autoscaling**: Ready for HPA implementation
- **Multi-Replica Deployments**: 2 replicas per service for high availability
- **Load Balancing**: Kubernetes Service load balancing
- **Auto-Scaling Node Groups**: EKS node groups can scale based on demand
- **Resource Limits**: Configured to prevent resource contention

## Architecture

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub Repo   │───▶│  GitHub Actions │───▶│   AWS EKS       │
│   (Source Code) │    │   (CI/CD)       │    │   (Kubernetes)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   AWS ECR       │    │   AWS RDS       │
                       │   (Container    │    │   (Database)    │
                       │    Registry)    │    └─────────────────┘
                       └─────────────────┘
```

### Infrastructure Components

- **VPC**: Virtual Private Cloud with public and private subnets
- **EKS**: Managed Kubernetes cluster (version 1.28)
- **ECR**: Private container registry for Docker images
- **NAT Gateway**: Internet access for private subnets
- **RDS**: Managed PostgreSQL database (optional)
- **IAM**: Role-based access control with OIDC

## Prerequisites

### Required Tools

Before starting, ensure you have the following tools installed:

- **AWS CLI** (v2 recommended) - [Install Guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- **Terraform** >= 1.6.0 - [Install Guide](https://developer.hashicorp.com/terraform/downloads)
- **kubectl** - [Install Guide](https://kubernetes.io/docs/tasks/tools/)
- **Docker** with buildx support - [Install Guide](https://docs.docker.com/get-docker/)
- **Node.js** 18+ (for local development) - [Install Guide](https://nodejs.org/)
- **Git** - [Install Guide](https://git-scm.com/downloads)

### Verify Installations

```bash
# Check AWS CLI
aws --version

# Check Terraform
terraform version

# Check kubectl
kubectl version --client

# Check Docker
docker --version
docker buildx version

# Check Node.js
node --version
npm --version
```

### AWS Account Setup

1. **Create AWS Account** (if you don't have one)
   - Sign up at https://aws.amazon.com/
   - Note your AWS Account ID

2. **Configure AWS CLI**
   ```bash
   aws configure
   # Enter your Access Key ID
   # Enter your Secret Access Key
   # Enter your default region (e.g., eu-north-1)
   # Enter output format (json)
   ```

3. **Verify AWS Access**
   ```bash
   aws sts get-caller-identity
   # Should return your account ID and user ARN
   ```

4. **GitHub Repository Setup**
   - Fork or clone this repository
   - Enable GitHub Actions in repository settings
   - Configure GitHub Secrets (see [CI/CD Pipeline](#cicd-pipeline))

## Complete Setup Guide

This guide walks you through setting up the entire BlogHub platform from scratch, including infrastructure, application deployment, and CI/CD configuration.

### Step 1: Clone Repository

```bash
git clone <your-repository-url>
cd BlogHub_Deployment
```

### Step 2: Bootstrap Terraform Backend

The Terraform backend (S3 + DynamoDB) must be created first before deploying infrastructure.

```bash
# Navigate to shared backend directory
cd infra/terraform/shared

# Initialize Terraform
terraform init

# Review what will be created
terraform plan

# Create the backend resources
terraform apply
# Type 'yes' when prompted

# Note the outputs (you'll need these)
terraform output
```

**Expected Outputs:**
- `s3_bucket_name`: `devops-deployment-terraform-state-{region}`
- `dynamodb_table_name`: `devops-deployment-terraform-lock`

### Step 3: Bootstrap IAM and OIDC

Set up OIDC provider for GitHub Actions authentication.

```bash
# Navigate to bootstrap directory
cd ../bootstrap

# Initialize Terraform
terraform init

# Review the plan
terraform plan

# Apply the bootstrap configuration
terraform apply
# Type 'yes' when prompted
```

**Important**: The AWS user/role you're using needs IAM permissions. If you encounter permission errors, ensure your AWS user has the necessary IAM, S3, and DynamoDB permissions.

### Step 4: Configure GitHub Secrets

Before using CI/CD, configure GitHub Secrets:

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following secrets:

   - `AWS_REGION`: Your AWS region (e.g., `eu-north-1`)
   - `AWS_ACCOUNT_ID`: Your AWS account ID (get it with `aws sts get-caller-identity`)

### Step 5: Configure GitHub Environments

Set up environment protection rules:

1. Go to **Settings** → **Environments**
2. Create `staging` environment:
   - Name: `staging`
   - No protection rules (auto-apply)
3. Create `production` environment:
   - Name: `production`
   - ✅ Required reviewers: 1
   - ✅ Wait timer: 5 minutes (optional)

### Step 6: Deploy Infrastructure (Staging)

Deploy the staging environment infrastructure:

```bash
# Navigate to staging environment
cd infra/terraform/environments/staging

# Initialize Terraform (will use remote backend)
terraform init
# When prompted to migrate state, type 'yes'

# Review the infrastructure plan
terraform plan

# Deploy infrastructure
terraform apply
# Type 'yes' when prompted
```

**This will create:**
- VPC with public and private subnets
- EKS cluster
- ECR repository
- NAT Gateway
- Security groups
- IAM roles

**Wait Time**: This process takes approximately 15-20 minutes.

### Step 7: Configure kubectl for EKS

After infrastructure is deployed, configure kubectl:

```bash
# Get your cluster name from Terraform outputs
terraform output

# Configure kubectl
aws eks update-kubeconfig \
  --region <your-region> \
  --name <cluster-name>

# Verify connection
kubectl get nodes
```

### Step 8: Create Kubernetes Namespace

```bash
# Create the bloghub namespace
kubectl apply -f ../../../../k8s/namespaces/bloghub-namespace.yaml

# Verify namespace created
kubectl get namespace bloghub
```

### Step 9: Build and Push Docker Images

Build all service images for the correct platform and push to ECR:

```bash
# Set variables
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION="eu-north-1"  # Change to your region
ECR_REPO_URL="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/bloghub"

# Authenticate Docker with ECR
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin $ECR_REPO_URL

# Navigate to apps directory
cd ../../../../apps

# Build and push Post Service
docker buildx build --platform linux/amd64 \
  -t ${ECR_REPO_URL}:post-service-latest \
  --push ./post-service

# Build and push Comment Service
docker buildx build --platform linux/amd64 \
  -t ${ECR_REPO_URL}:comment-service-latest \
  --push ./comment-service

# Build and push User Service
docker buildx build --platform linux/amd64 \
  -t ${ECR_REPO_URL}:user-service-latest \
  --push ./user-service

# Build and push Notification Service
docker buildx build --platform linux/amd64 \
  -t ${ECR_REPO_URL}:notification-service-latest \
  --push ./notification-service

# Build and push Frontend
docker buildx build --platform linux/amd64 \
  -t ${ECR_REPO_URL}:frontend-latest \
  --push ./frontend
```

**Note**: Ensure your ECR repository name matches what's in your Terraform configuration.

### Step 10: Update Kubernetes Manifests

Update the image references in Kubernetes manifests to match your ECR repository:

```bash
# Navigate to k8s directory
cd ../k8s

# Update image references in deployment files
# Replace the ECR URL in all deployment YAML files
# Example: sed -i 's|old-ecr-url|new-ecr-url|g' deployments/*.yaml
```

Or manually edit each deployment file in `k8s/deployments/` to use your ECR repository URL.

### Step 11: Deploy Application to Kubernetes

Deploy all services:

```bash
# Deploy all deployments
kubectl apply -f deployments/

# Deploy all services
kubectl apply -f services/

# Verify all resources
kubectl get all -n bloghub
```

### Step 12: Verify Deployment

Check that all pods are running:

```bash
# Watch pods come up
kubectl get pods -n bloghub -w

# Check deployment status
kubectl get deployments -n bloghub

# Check service status
kubectl get services -n bloghub

# View logs if needed
kubectl logs -n bloghub -l app=post-service
```

### Step 13: Test the Application

Port-forward to test services locally:

```bash
# Port-forward frontend
kubectl port-forward -n bloghub svc/frontend 3000:80

# In another terminal, port-forward a backend service
kubectl port-forward -n bloghub svc/post-service 3001:80

# Test endpoints
curl http://localhost:3001/health
curl http://localhost:3001/api/posts
```

### Step 14: Set Up CI/CD (Optional)

The CI/CD pipeline is already configured. To use it:

1. **Push to develop branch** → Automatically deploys to staging
2. **Push to main branch** → Creates plan for production (requires approval)

Test the pipeline:

```bash
# Make a small change
git checkout -b develop
# Make a change to any file
git add .
git commit -m "Test CI/CD"
git push origin develop
```

Check GitHub Actions to see the workflow run.

### Step 15: Deploy Production (When Ready)

When ready for production:

```bash
# Navigate to production environment
cd infra/terraform/environments/production

# Initialize Terraform
terraform init

# Review plan
terraform plan

# Apply (requires approval in GitHub if using CI/CD)
terraform apply
```

Then follow steps 7-12 for production deployment.

## Quick Start (Local Development)

### Local Development

#### Option 1: Quick Start Script

```bash
# Start all backend services
cd apps
./start-services.sh

# In a separate terminal, start the frontend
cd apps/frontend
npm install
npm run dev
```

#### Option 2: Docker Compose

```bash
cd apps
docker-compose up --build
```

Services will be available at:
- Frontend: http://localhost:3000
- Post Service: http://localhost:3001
- Comment Service: http://localhost:3002
- User Service: http://localhost:3003
- Notification Service: http://localhost:3004

### Stop Services

```bash
cd apps
./stop-services.sh
# or
docker-compose down
```

## Infrastructure Setup

This section provides detailed information about infrastructure components and how to deploy them. For a complete step-by-step guide, see [Complete Setup Guide](#complete-setup-guide) above.

### Infrastructure Components

The infrastructure consists of the following AWS resources:

#### 1. Terraform Backend (Shared)
- **S3 Bucket**: Stores Terraform state files
  - Name: `devops-deployment-terraform-state-{region}`
  - Features: Versioning, encryption, public access blocked
- **DynamoDB Table**: Provides state locking
  - Name: `devops-deployment-terraform-lock`
  - Prevents concurrent Terraform operations

#### 2. VPC (Virtual Private Cloud)
- **Public Subnets**: For NAT Gateway and load balancers
- **Private Subnets**: For EKS worker nodes and application pods
- **Internet Gateway**: Provides internet access to public subnets
- **NAT Gateway**: Allows private subnets to access internet
- **Route Tables**: Configured for proper traffic routing
- **CIDR Blocks**:
  - Staging: `10.1.0.0/16`
  - Production: `10.2.0.0/16`

#### 3. EKS (Elastic Kubernetes Service)
- **Cluster Version**: Kubernetes 1.28
- **Control Plane**: Fully managed by AWS
- **Node Groups**: Auto-scaling worker nodes
  - Instance Type: t3.small (minimum)
  - Auto-scaling enabled
  - Deployed in private subnets
- **Add-ons**:
  - VPC CNI (networking)
  - CoreDNS (service discovery)
  - Kube Proxy (networking)
  - EBS CSI Driver (storage)

#### 4. ECR (Elastic Container Registry)
- **Repository**: `bloghub` (or environment-specific)
- **Features**: Image scanning, lifecycle policies
- **Access**: IAM-based authentication

#### 5. IAM Roles and Policies
- **EKS Cluster Role**: For EKS control plane
- **Node Group Role**: For worker nodes
- **OIDC Provider**: For GitHub Actions authentication
- **GitHub Actions Role**: For CI/CD deployments

### Deployment Steps

#### Step 1: Bootstrap Terraform Backend

```bash
cd infra/terraform/shared
terraform init
terraform plan
terraform apply
```

**What this creates:**
- S3 bucket for state storage
- DynamoDB table for state locking

**Important**: This is a one-time setup. The backend is shared across all environments.

#### Step 2: Bootstrap IAM and OIDC

```bash
cd infra/terraform/bootstrap
terraform init
terraform plan
terraform apply
```

**What this creates:**
- OIDC provider for GitHub
- IAM role for GitHub Actions
- IAM policies for infrastructure management

**Required Permissions**: Your AWS user needs IAM, S3, and DynamoDB permissions to run bootstrap.

#### Step 3: Deploy Environment Infrastructure

**Staging Environment:**

```bash
cd infra/terraform/environments/staging
terraform init  # Will prompt to migrate state - type 'yes'
terraform plan
terraform apply
```

**Production Environment:**

```bash
cd infra/terraform/environments/production
terraform init
terraform plan
terraform apply
```

**Deployment Time**: Approximately 15-20 minutes per environment.

### Infrastructure Outputs

After deployment, get important values:

```bash
cd infra/terraform/environments/staging
terraform output
```

**Key Outputs:**
- `cluster_name`: EKS cluster name
- `cluster_endpoint`: EKS API endpoint
- `ecr_repository_url`: ECR repository URL
- `vpc_id`: VPC ID
- `node_group_name`: Node group name

### Verifying Infrastructure

```bash
# Check EKS cluster
aws eks describe-cluster --name <cluster-name> --region <region>

# Check ECR repository
aws ecr describe-repositories --repository-names bloghub --region <region>

# Check VPC
aws ec2 describe-vpcs --filters "Name=tag:Name,Values=*bloghub*" --region <region>

# Check EKS nodes
kubectl get nodes
```

### Infrastructure Costs

Approximate monthly costs (varies by region and usage):

- **EKS Cluster**: ~$0.10/hour (~$73/month)
- **EC2 Instances** (t3.small): ~$0.0208/hour per instance
- **NAT Gateway**: ~$0.045/hour + data transfer (~$32/month)
- **EBS Volumes**: ~$0.10/GB/month
- **ECR**: Storage costs (minimal)
- **S3 + DynamoDB**: < $1/month for state storage

**Total Estimated Cost**: ~$150-200/month for staging environment (depending on node count and usage).

## Application Services

### Service Structure

```
apps/
├── frontend/              # React frontend
├── post-service/          # Post management service
├── comment-service/       # Comment management service
├── user-service/          # User authentication service
└── notification-service/  # Notification service
```

### API Endpoints

#### Post Service
- `GET /api/posts` - List all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

#### Comment Service
- `GET /api/comments/post/:postId` - Get comments for post
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

#### User Service
- `POST /api/users/register` - Register user
- `POST /api/users/login` - Login user
- `GET /api/users/:id` - Get user
- `GET /api/users` - List users

#### Notification Service
- `GET /api/notifications/user/:userId` - Get all notifications
- `GET /api/notifications/user/:userId/unread-count` - Get unread count
- `POST /api/notifications` - Create notification
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/user/:userId/read-all` - Mark all as read

## Kubernetes Deployment

### Prerequisites

1. EKS cluster deployed and accessible
2. kubectl configured: `aws eks update-kubeconfig --region {region} --name {cluster-name}`
3. Docker images built for `linux/amd64` platform

### Build and Push Images to ECR

**Critical**: All images must be built for `linux/amd64` platform:

```bash
# Set variables
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION="eu-north-1"  # or your region
ECR_REPO_URL="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/bloghub"

# Authenticate
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin $ECR_REPO_URL

# Build and push each service
cd apps

# Post Service
docker buildx build --platform linux/amd64 \
  -t ${ECR_REPO_URL}:post-service-latest --push ./post-service

# Comment Service
docker buildx build --platform linux/amd64 \
  -t ${ECR_REPO_URL}:comment-service-latest --push ./comment-service

# User Service
docker buildx build --platform linux/amd64 \
  -t ${ECR_REPO_URL}:user-service-latest --push ./user-service

# Notification Service
docker buildx build --platform linux/amd64 \
  -t ${ECR_REPO_URL}:notification-service-latest --push ./notification-service

# Frontend
docker buildx build --platform linux/amd64 \
  -t ${ECR_REPO_URL}:frontend-latest --push ./frontend
```

### Deploy to Kubernetes

```bash
# Create namespace
kubectl apply -f k8s/namespaces/

# Deploy all services
kubectl apply -f k8s/deployments/
kubectl apply -f k8s/services/

# Verify deployment
kubectl get all -n bloghub
```

### Check Deployment Status

```bash
# Watch pods
kubectl get pods -n bloghub -w

# Check specific service
kubectl get pods -n bloghub -l app=post-service

# View logs
kubectl logs -n bloghub -l app=post-service
```

### Test Services

```bash
# Port-forward for testing
kubectl port-forward -n bloghub svc/post-service 8080:80
kubectl port-forward -n bloghub svc/frontend 8084:80

# Test endpoints
curl http://localhost:8080/health
curl http://localhost:8080/api/posts
```

### Kubernetes Resources

Each service includes:
- **Deployment**: 2 replicas for high availability
- **Service**: ClusterIP for internal communication
- **Resource Limits**: 200m CPU, 256Mi memory
- **Health Checks**: Liveness and readiness probes
- **Namespace**: `bloghub` for isolation

## CI/CD Pipeline

### GitHub Actions Workflows

#### Infrastructure Deployment (`infrastructure.yml`)

Deploys Terraform infrastructure:
- **Trigger**: Push to `develop` (staging) or `main` (production)
- **Actions**: Plan, Apply (with approval for production)
- **Authentication**: OIDC (no access keys needed)

#### Application Deployment (`cd.yml`)

Deploys application to Kubernetes:
- **Trigger**: Push to `develop` branch
- **Actions**: Build, Push to ECR, Deploy to EKS
- **Manual Trigger**: Available for production

### GitHub Secrets Required

Configure in GitHub Settings → Secrets:

- `AWS_REGION`: AWS region (e.g., `eu-north-1`)
- `AWS_ACCOUNT_ID`: AWS account ID
- `EKS_CLUSTER_NAME`: EKS cluster name (per environment)

### Environment Configuration

Configure in GitHub Settings → Environments:

#### Staging
- Name: `staging`
- Protection: None (auto-apply)

#### Production
- Name: `production`
- Protection: Required reviewers (1+)
- Wait timer: Optional (recommended: 5 minutes)

### Workflow Behavior

| Branch | Environment | Behavior |
|--------|-------------|----------|
| `develop` | `staging` | Auto-apply (testing/pre-production) |
| `main` | `production` | Plan only + Manual approval required |

## Environment Configuration

### Staging Environment

- **VPC CIDR**: `10.1.0.0/16`
- **State Key**: `staging/terraform.tfstate`
- **Auto-apply**: Yes (on push to develop)
- **Approval**: Not required
- **ECR Repository**: `staging-bloghub`
- **EKS Cluster**: `devops-deployment-staging`

### Production Environment

- **VPC CIDR**: `10.2.0.0/16`
- **State Key**: `production/terraform.tfstate`
- **Auto-apply**: No (manual approval required)
- **Approval**: Required (configure in GitHub Environments)
- **ECR Repository**: `production-bloghub`
- **EKS Cluster**: `devops-deployment-production`

### State Management

Each environment uses separate Terraform state files:
- Staging: `s3://bucket/staging/terraform.tfstate`
- Production: `s3://bucket/production/terraform.tfstate`

This ensures complete isolation between environments.

## Troubleshooting

### Infrastructure Issues

#### Terraform State Lock

```bash
terraform force-unlock <lock-id>
```

#### EKS Cluster Connection

```bash
aws eks update-kubeconfig --region {region} --name {cluster-name}
```

#### ECR Login

```bash
aws ecr get-login-password --region {region} | \
  docker login --username AWS --password-stdin {account-id}.dkr.ecr.{region}.amazonaws.com
```

### Kubernetes Issues

#### Pods Not Starting

```bash
# Check pod events
kubectl describe pod -n bloghub <pod-name>

# Check logs
kubectl logs -n bloghub <pod-name>

# Check image pull errors
kubectl describe pod -n bloghub <pod-name> | grep -A 5 "Events:"
```

#### Image Pull Errors

- Verify image exists: `aws ecr list-images --repository-name bloghub`
- Ensure image is built for `linux/amd64` platform
- Check node group has ECR permissions

#### Service Connectivity Issues

```bash
# Verify services
kubectl get svc -n bloghub

# Check endpoints
kubectl get endpoints -n bloghub

# Test from within pod
kubectl run -it --rm test --image=curlimages/curl --restart=Never \
  --namespace=bloghub -- curl http://post-service/health
```

### Common Commands

```bash
# Check cluster status
kubectl get nodes

# View all resources
kubectl get all -n bloghub

# View logs
kubectl logs -f -n bloghub -l app=post-service

# Restart deployment
kubectl rollout restart deployment/post-service -n bloghub

# Scale deployment
kubectl scale deployment/post-service --replicas=3 -n bloghub
```

## Deployment Issues & Lessons Learned

This project encountered several critical deployment issues that were resolved. See [DEPLOYMENT_ISSUES.md](DEPLOYMENT_ISSUES.md) for detailed information.

### Key Lessons

1. **Use Managed Services**: NAT Gateway over NAT Instance for reliability
2. **Platform Compatibility**: Always build Docker images for target platform (`linux/amd64` for EKS)
3. **EKS Security Groups**: Let EKS manage security groups automatically
4. **Instance Sizing**: Use t3.small minimum for EKS nodes (t3.nano/t2.micro insufficient)
5. **Incremental Testing**: Test in public subnets first to isolate networking issues

### Critical Issues Resolved

| Issue | Severity | Resolution |
|-------|----------|------------|
| NAT Instance Routing | Critical | Replaced with NAT Gateway |
| Platform Architecture Mismatch | Critical | Rebuild for linux/amd64 |
| Custom Security Group | High | Use EKS-managed groups |
| Instance Type Constraints | Medium | Use t3.small minimum |

## Project Structure

```
BlogHub_Deployment/
├── apps/                          # Application services
│   ├── frontend/                  # React frontend
│   ├── post-service/              # Post management
│   ├── comment-service/           # Comment management
│   ├── user-service/              # User authentication
│   ├── notification-service/      # Notifications
│   └── docker-compose.yml         # Local development
├── infra/                         # Infrastructure as Code
│   └── terraform/
│       ├── bootstrap/             # OIDC and IAM setup
│       ├── environments/          # Staging and production
│       ├── modules/               # Reusable modules (VPC, EKS, ECR)
│       └── shared/                # Terraform backend setup
├── k8s/                           # Kubernetes manifests
│   ├── deployments/               # Deployment manifests
│   ├── services/                  # Service definitions
│   ├── namespaces/                # Namespace definitions
│   ├── configmaps/                # Configuration (non-sensitive)
│   └── secrets/                   # Secrets (sensitive data)
├── .github/workflows/             # CI/CD pipelines
│   ├── infrastructure.yml         # Infrastructure deployment
│   └── cd.yml                     # Application deployment
└── scripts/                       # Utility scripts
```

## Security Best Practices

- ✅ OIDC authentication (no access keys in CI/CD)
- ✅ Environment-specific state files
- ✅ Production requires manual approval
- ✅ State encryption in S3
- ✅ EKS-managed security groups
- ✅ Private subnets for worker nodes
- ✅ Secrets stored in Kubernetes Secrets (not in code)

## Cost Optimization

- **NAT Gateway**: Managed service (slightly higher cost, better reliability)
- **Instance Types**: t3.small minimum for EKS nodes
- **Resource Limits**: Configured to prevent over-provisioning
- **State Storage**: S3 + DynamoDB (minimal cost for state files)

## Next Steps

- [ ] Set up Ingress for external access
- [ ] Configure monitoring with Prometheus and Grafana
- [ ] Implement horizontal pod autoscaling
- [ ] Add network policies for micro-segmentation
- [ ] Set up centralized logging
- [ ] Implement blue-green deployments
- [ ] Add automated testing in CI/CD pipeline

## Support

For issues or questions:
- Check [DEPLOYMENT_ISSUES.md](DEPLOYMENT_ISSUES.md) for known issues
- Review troubleshooting section above
- Check GitHub Actions logs for CI/CD issues
- Verify AWS resources in AWS Console

---

**Project Status**: ✅ Production Ready  
**Last Updated**: 2024  
**License**: MIT

