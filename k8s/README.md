# Kubernetes Manifests

This directory contains all Kubernetes manifests for deploying the BlogHub application to EKS.

## Directory Structure

```
k8s/
├── namespaces/       # Namespace definitions
├── deployments/      # Deployment manifests for all services
├── services/         # Service definitions (ClusterIP, LoadBalancer, etc.)
├── configmaps/       # Configuration files (non-sensitive)
├── secrets/          # Secret definitions (sensitive data)
└── ingress/          # Ingress resources for external access
```

## Usage

### Deploy all resources
```bash
kubectl apply -f namespaces/
kubectl apply -f configmaps/
kubectl apply -f secrets/
kubectl apply -f deployments/
kubectl apply -f services/
kubectl apply -f ingress/
```

### Deploy specific service
```bash
kubectl apply -f deployments/post-service-deployment.yaml
kubectl apply -f services/post-service-service.yaml
```

### Delete resources
```bash
kubectl delete -f k8s/
```

## Naming Convention

- Files follow the pattern: `<service-name>-<resource-type>.yaml`
- Example: `post-service-deployment.yaml`, `post-service-service.yaml`

## Services

- **post-service**: Blog post management
- **comment-service**: Comment management
- **user-service**: User authentication and management
- **notification-service**: Notification handling
- **frontend**: React frontend application

