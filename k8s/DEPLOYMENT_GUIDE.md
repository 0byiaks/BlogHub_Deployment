# Kubernetes Deployment Guide

## 📋 Created Manifests

All Kubernetes manifests have been created for the BlogHub application:

### Deployments
- ✅ `deployments/post-service-deployment.yaml`
- ✅ `deployments/comment-service-deployment.yaml`
- ✅ `deployments/user-service-deployment.yaml`
- ✅ `deployments/notification-service-deployment.yaml`
- ✅ `deployments/frontend-deployment.yaml`

### Services
- ✅ `services/post-service-service.yaml`
- ✅ `services/comment-service-service.yaml`
- ✅ `services/user-service-service.yaml`
- ✅ `services/notification-service-service.yaml`
- ✅ `services/frontend-service.yaml`

## 🚀 Deployment Steps

### Prerequisites
1. All Docker images must be built for `linux/amd64` platform and pushed to ECR
2. kubectl configured and connected to EKS cluster
3. Namespace `bloghub` already exists

### 1. Build and Push Images to ECR

**Important:** Build all images with `--platform linux/amd64` flag:

```bash
# Set variables
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REPO_URL="${AWS_ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/dev-bloghub"
AWS_REGION="us-east-1"

# Authenticate
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO_URL

# Build and push each service (from apps directory)
cd apps

# Comment Service
docker buildx build --platform linux/amd64 -t ${ECR_REPO_URL}:comment-service-latest --push ./comment-service

# User Service
docker buildx build --platform linux/amd64 -t ${ECR_REPO_URL}:user-service-latest --push ./user-service

# Notification Service
docker buildx build --platform linux/amd64 -t ${ECR_REPO_URL}:notification-service-latest --push ./notification-service

# Frontend (see note below)
docker buildx build --platform linux/amd64 -t ${ECR_REPO_URL}:frontend-latest --push ./frontend
```

### 2. Deploy All Services

```bash
# Deploy all deployments
kubectl apply -f k8s/deployments/

# Deploy all services
kubectl apply -f k8s/services/

# Verify deployment
kubectl get all -n bloghub
```

### 3. Check Deployment Status

```bash
# Watch pods come up
kubectl get pods -n bloghub -w

# Check all resources
kubectl get all -n bloghub

# Check specific service
kubectl get pods -n bloghub -l app=post-service
```

### 4. Test Services

```bash
# Port-forward to test services
kubectl port-forward -n bloghub svc/post-service 8080:80
kubectl port-forward -n bloghub svc/comment-service 8081:80
kubectl port-forward -n bloghub svc/user-service 8082:80
kubectl port-forward -n bloghub svc/notification-service 8083:80
kubectl port-forward -n bloghub svc/frontend 8084:80

# Test endpoints
curl http://localhost:8080/health
curl http://localhost:8080/api/posts
```

## ⚠️ Important Notes

### Frontend Configuration

The frontend's `nginx.conf` currently proxies to services on ports 3001-3004, but Kubernetes services expose port 80. 

**Option 1: Update nginx.conf before building**
Update `apps/frontend/nginx.conf` to use port 80:
```nginx
location /api/posts {
    proxy_pass http://post-service:80;
    ...
}
```

Then rebuild the frontend image.

**Option 2: Use ConfigMap (Recommended for production)**
Create a ConfigMap with nginx.conf and mount it to the pod.

### JWT Secret

The `user-service` deployment currently uses a hardcoded JWT_SECRET. For production:

1. Create a Kubernetes Secret:
```bash
kubectl create secret generic jwt-secret \
  --from-literal=JWT_SECRET=your-actual-secret-key \
  -n bloghub
```

2. Update `user-service-deployment.yaml` to use the secret:
```yaml
env:
- name: JWT_SECRET
  valueFrom:
    secretKeyRef:
      name: jwt-secret
      key: JWT_SECRET
```

## 🔧 Troubleshooting

### Pods not starting
```bash
# Check pod events
kubectl describe pod -n bloghub <pod-name>

# Check logs
kubectl logs -n bloghub <pod-name>

# Check image pull errors
kubectl describe pod -n bloghub <pod-name> | grep -A 5 "Events:"
```

### Image pull errors
- Verify image exists in ECR: `aws ecr list-images --repository-name dev-bloghub`
- Ensure image is built for `linux/amd64` platform
- Check node group has ECR permissions

### Service connectivity issues
- Verify services are running: `kubectl get svc -n bloghub`
- Check service endpoints: `kubectl get endpoints -n bloghub`
- Test from within a pod: `kubectl run -it --rm test --image=curlimages/curl --restart=Never --namespace=bloghub -- curl http://post-service/health`

## 📊 Resource Summary

Each service deployment:
- **Replicas:** 2 (for high availability)
- **Resources:** 
  - Requests: 100m CPU, 128Mi memory
  - Limits: 200m CPU, 256Mi memory
- **Health Checks:** Liveness and readiness probes configured
- **Service Type:** ClusterIP (internal only)

## 🎯 Next Steps

1. ✅ Build and push all images to ECR
2. ✅ Deploy all services
3. ⏭️ Set up Ingress for external access
4. ⏭️ Configure monitoring and logging
5. ⏭️ Set up CI/CD pipeline

