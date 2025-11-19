# Kubernetes Implementation Explanation

## Overview

This document explains the Kubernetes setup we implemented to deploy the post-service (and other BlogHub microservices) to the EKS cluster. The setup consists of three main manifest files that define how the service runs and how other services can communicate with it.

## Architecture Components

We created a Kubernetes setup to run the post-service in the EKS cluster. The setup uses three manifest files that define how the service runs and how other services can reach it.

First, we created a namespace called "bloghub" to isolate our application resources. This namespace acts like a folder that keeps all BlogHub components together, separate from other workloads. The namespace has labels for identification and organization, making it easy to find and manage resources.

Next, we created a Deployment that defines how the post-service containers run. The Deployment tells Kubernetes to run two identical copies of the post-service container, which provides redundancy. If one container fails, the other continues serving requests. The Deployment specifies the Docker image from ECR, which is the post-service image built for the linux/amd64 platform so it runs on EKS worker nodes.

The Deployment also sets environment variables like PORT and NODE_ENV, which tell the container how to run. We configured resource limits so each container requests a minimum of 128 megabytes of memory and 100 millicores of CPU, with maximum limits of 256 megabytes and 200 millicores. These limits prevent any single container from consuming too many resources and affecting other services.

We added health checks so Kubernetes can monitor container health. The liveness probe checks the /health endpoint every 10 seconds after an initial 30-second delay. If the probe fails, Kubernetes restarts the container. The readiness probe checks the same endpoint every 5 seconds after a 10-second delay. If the readiness probe fails, Kubernetes stops sending traffic to that container until it becomes healthy again. This ensures only healthy containers receive requests.

The Deployment uses labels to identify which containers belong to the post-service. The selector matches containers with the label "app: post-service", so Kubernetes knows which containers are part of this deployment.

Then we created a Service that exposes the post-service to other pods in the cluster. The Service is of type ClusterIP, which means it's only accessible from within the Kubernetes cluster. The Service acts as a stable internal endpoint that other services can use to communicate with the post-service, even if the individual pods are recreated or moved to different nodes.

The Service maps port 80 to the container's port 3001. This means when another service calls "post-service" on port 80, Kubernetes routes that traffic to one of the post-service containers on port 3001. The Service uses a selector to find all pods with the label "app: post-service", and it automatically distributes traffic across all healthy pods using round-robin load balancing.

When we applied these manifests using kubectl apply, Kubernetes read the YAML files and created the resources. The Deployment created two pod replicas, each running the post-service container. The Service created an internal IP address that routes to those pods. Kubernetes continuously monitors the pods to ensure they match the desired state, automatically replacing failed pods and distributing them across available nodes.

The pods run on the EKS worker nodes in the private subnets we configured earlier. These nodes pull the Docker image from ECR using the IAM permissions we set up, specifically the AmazonEC2ContainerRegistryReadOnly policy attached to the node group role. The containers can communicate with each other through the VPC network, and they can reach the internet through the NAT Gateway for any external dependencies.

When we used kubectl port-forward, we created a temporary tunnel from our local machine to the Service in the cluster. This allowed us to test the service by accessing localhost:8080, which forwarded traffic through the tunnel to the Service, which then routed it to one of the running pods. This is useful for testing but not for production; for production, we would use an Ingress or LoadBalancer to expose the service externally.

The entire setup ensures high availability, automatic recovery, and internal service discovery. If a pod crashes, Kubernetes automatically creates a new one. If a node fails, Kubernetes moves the pods to healthy nodes. The Service provides a stable endpoint that doesn't change even when pods are recreated, so other services can reliably connect to the post-service without needing to know the individual pod IP addresses. This architecture provides a foundation for running the rest of the BlogHub microservices using the same pattern.

## Key Components

### Namespace (bloghub-namespace.yaml)

The namespace creates logical isolation for all BlogHub resources. It's like a folder that keeps everything organized and separate from other applications running in the same cluster.

**Location:** `k8s/namespaces/bloghub-namespace.yaml`

### Deployment (post-service-deployment.yaml)

The Deployment defines:
- How many replicas to run (2 for redundancy)
- Which Docker image to use (from ECR)
- Resource limits (memory and CPU)
- Health checks (liveness and readiness probes)
- Environment variables (PORT, NODE_ENV)

**Location:** `k8s/deployments/post-service-deployment.yaml`

**Key Features:**
- Replicas: 2 (for high availability)
- Image: `716769866080.dkr.ecr.us-east-1.amazonaws.com/dev-bloghub:post-service-latest`
- Container Port: 3001
- Resource Requests: 128Mi memory, 100m CPU
- Resource Limits: 256Mi memory, 200m CPU
- Health Checks: Both liveness and readiness probes on `/health` endpoint

### Service (post-service-service.yaml)

The Service provides:
- Stable internal endpoint for other pods
- Load balancing across multiple pods
- Port mapping (80 → 3001)

**Location:** `k8s/services/post-service-service.yaml`

**Key Features:**
- Type: ClusterIP (internal only)
- Port: 80 (external)
- Target Port: 3001 (container port)
- Selector: `app: post-service` (matches deployment labels)

## How It Works Together

1. **Deployment** creates and manages pods running the post-service container
2. **Service** creates a stable DNS name (`post-service.bloghub.svc.cluster.local`) that routes to the pods
3. **Namespace** isolates all resources in the `bloghub` namespace
4. **Health Checks** ensure only healthy pods receive traffic
5. **Resource Limits** prevent resource contention
6. **Labels** enable Kubernetes to match services with their pods

## Deployment Commands

```bash
# Create namespace
kubectl apply -f k8s/namespaces/bloghub-namespace.yaml

# Deploy post-service
kubectl apply -f k8s/deployments/post-service-deployment.yaml
kubectl apply -f k8s/services/post-service-service.yaml

# Check status
kubectl get all -n bloghub

# View logs
kubectl logs -n bloghub -l app=post-service

# Port-forward for testing
kubectl port-forward -n bloghub svc/post-service 8080:80
```

## Important Notes

- **Platform Compatibility**: Docker images must be built for `linux/amd64` platform to run on EKS nodes
- **ECR Authentication**: EKS nodes need `AmazonEC2ContainerRegistryReadOnly` IAM policy to pull images
- **Service Discovery**: Other services can reach this service using `http://post-service` (Kubernetes DNS)
- **Health Endpoints**: All services should implement `/health` endpoint for Kubernetes probes
- **Resource Management**: Resource limits prevent pods from consuming excessive cluster resources

## Future Enhancements

- Add Ingress for external access
- Implement ConfigMaps for configuration management
- Use Secrets for sensitive data (JWT keys, database passwords)
- Add Horizontal Pod Autoscaler for automatic scaling
- Implement Network Policies for network security
- Add monitoring and logging integration

