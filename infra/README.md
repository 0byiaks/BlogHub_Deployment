# DevOps Infrastructure - Complete AWS Cloud Setup

This repository contains a complete, production-ready DevOps infrastructure setup on AWS that automatically provisions cloud resources, deploys workloads on Kubernetes (EKS), implements CI/CD pipelines with GitHub Actions, and includes comprehensive monitoring and security.

## 🏗️ **Architecture Overview**

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
                                │
                                ▼
                       ┌─────────────────┐
                       │ Prometheus +    │
                       │ Grafana         │
                       │ (Monitoring)    │
                       └─────────────────┘
```

## 📁 **Project Structure**

```
infra/
├── README.md                    # This file
└── terraform/                   # Infrastructure as Code
    ├── environments/            # Environment-specific configs
    │   ├── dev/                 # Development environment
    │   ├── staging/             # Staging environment
    │   └── prod/                # Production environment
    ├── modules/                 # Reusable Terraform modules
    │   ├── vpc/                 # Virtual Private Cloud
    │   ├── eks/                 # Elastic Kubernetes Service
    │   ├── ecr/                 # Elastic Container Registry
    │   ├── monitoring/          # Monitoring stack
    │   ├── security/            # Security configurations
    │   └── networking/          # Additional networking
    └── shared/                  # Shared configurations
```

## 🎯 **Project Goals**

✅ **Provision Cloud Infrastructure with Terraform (AWS)**
- Automated infrastructure provisioning
- Multi-environment support (dev/staging/prod)
- Infrastructure as Code best practices

✅ **Deploy Workloads on Kubernetes (EKS + ECR)**
- Managed Kubernetes cluster
- Container registry for images
- Auto-scaling and high availability

✅ **Automate Builds and Deployments with GitHub Actions**
- Continuous Integration/Continuous Deployment
- Automated testing and security scanning
- GitOps deployment strategy

✅ **Implement Observability with Prometheus & Grafana**
- Metrics collection and visualization
- Alerting and incident response
- Performance monitoring

✅ **Add Security**
- Container security scanning
- Infrastructure compliance
- Secrets management
- Network security

## 🚀 **Quick Start**

### Prerequisites

1. **AWS CLI** configured with appropriate credentials
2. **Terraform** >= 1.0 installed
3. **kubectl** installed
4. **Helm** installed
5. **Git** for version control

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd Devops_Deployment/infra
```

### 2. Configure AWS Credentials

```bash
aws configure
# Enter your AWS Access Key ID, Secret Access Key, and region
```

### 3. Initialize Terraform

```bash
cd terraform/environments/dev
terraform init
```

### 4. Plan Infrastructure

```bash
terraform plan
```

### 5. Deploy Infrastructure

```bash
terraform apply
```

## 🏗️ **Infrastructure Components**

### **VPC (Virtual Private Cloud)**
- **Public Subnets**: For load balancers and bastion hosts
- **Private Subnets**: For application servers and databases
- **NAT Gateway**: For private subnet internet access
- **Internet Gateway**: For public subnet internet access

### **EKS (Elastic Kubernetes Service)**
- **Managed Kubernetes Cluster**: Version 1.28
- **Managed Node Groups**: Auto-scaling worker nodes
- **Essential Add-ons**: VPC CNI, CoreDNS, Kube Proxy, EBS CSI Driver
- **IAM Roles**: Least privilege access

### **ECR (Elastic Container Registry)**
- **Private Container Registry**: For application images
- **Image Scanning**: Automated vulnerability detection
- **Lifecycle Policies**: Automatic cleanup of old images

### **RDS (Relational Database Service)**
- **PostgreSQL Database**: Managed database service
- **Multi-AZ Deployment**: High availability
- **Automated Backups**: Point-in-time recovery

### **Monitoring Stack**
- **Prometheus**: Metrics collection
- **Grafana**: Visualization and dashboards
- **CloudWatch**: AWS-native monitoring
- **AlertManager**: Alert routing and management

## 🔄 **CI/CD Pipeline**

### **GitHub Actions Workflow**

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    # Unit tests, linting, security scanning
  build:
    # Docker build, ECR push
  deploy:
    # EKS deployment via kubectl/helm
```

### **Pipeline Stages**

1. **Code Quality** - Linting, formatting, unit tests
2. **Security Scanning** - SAST, dependency scanning
3. **Build & Push** - Docker build, ECR push
4. **Deploy** - Kubernetes deployment
5. **Smoke Tests** - Post-deployment validation

## 📊 **Monitoring & Observability**

### **Key Metrics Tracked**
- **Infrastructure**: CPU, Memory, Disk, Network
- **Kubernetes**: Pod status, resource usage, events
- **Application**: Request rate, response time, error rate
- **Database**: Connection count, query performance
- **Security**: Failed logins, policy violations

### **Grafana Dashboards**
- **System Overview** - High-level infrastructure health
- **Application Performance** - Detailed app metrics
- **Security Posture** - Security events and compliance
- **Cost Analysis** - AWS resource costs and optimization

## 🔐 **Security Features**

### **Container Security**
- **Trivy** for vulnerability scanning
- **Falco** for runtime security monitoring
- **Pod Security Standards** enforcement
- **Network Policies** for micro-segmentation

### **Infrastructure Security**
- **AWS Security Hub** integration
- **GuardDuty** for threat detection
- **Config Rules** for compliance
- **Secrets Management** via AWS Secrets Manager

### **GitHub Security**
- **Dependabot** for dependency updates
- **CodeQL** for code analysis
- **Branch Protection** rules
- **Required Status Checks**

## 🌍 **Environment Strategy**

### **Multi-Environment Setup**
- **Development** - Feature testing and development
- **Staging** - Integration testing and pre-production
- **Production** - Live environment with high availability

### **Deployment Strategies**
- **Blue-Green** - Zero-downtime deployments
- **Rolling Updates** - Gradual pod replacement
- **Canary Releases** - Traffic splitting for testing

## 💰 **Cost Optimization**

### **Cost Management Features**
- **Resource Tagging** - Cost allocation and tracking
- **Automated Cost Alerts** - Budget monitoring
- **Right-sizing Recommendations** - Resource optimization
- **Spot Instance Utilization** - Cost-effective compute
- **Reserved Capacity Planning** - Long-term cost savings

## 🚨 **Alerting & Incident Response**

### **Alert Channels**
- **Slack/Teams** notifications
- **Email alerts**
- **PagerDuty** integration
- **SMS** for critical issues

### **Incident Response**
- **Automated runbook execution**
- **Escalation procedures**
- **Post-mortem automation**
- **Continuous improvement**

## 📚 **Documentation**

### **Terraform Modules**
- **VPC Module** - Network infrastructure
- **EKS Module** - Kubernetes cluster
- **ECR Module** - Container registry
- **Monitoring Module** - Observability stack
- **Security Module** - Security configurations

### **Environment Configuration**
- **Development** - Cost-optimized for testing
- **Staging** - Production-like environment
- **Production** - High availability and performance

## 🔧 **Troubleshooting**

### **Common Issues**

1. **Terraform State Lock**
   ```bash
   terraform force-unlock <lock-id>
   ```

2. **EKS Cluster Connection**
   ```bash
   aws eks update-kubeconfig --region us-west-2 --name devops-dev-cluster
   ```

3. **ECR Login**
   ```bash
   aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-west-2.amazonaws.com
   ```

### **Useful Commands**

```bash
# Check cluster status
kubectl get nodes

# View pods
kubectl get pods --all-namespaces

# Check services
kubectl get services

# View logs
kubectl logs -f <pod-name>

# Access Grafana
kubectl port-forward svc/grafana 3000:80
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 **Support**

For support and questions:
- Create an issue in the repository
- Contact the DevOps team
- Check the troubleshooting section

---

**Built with ❤️ by the DevOps Team**