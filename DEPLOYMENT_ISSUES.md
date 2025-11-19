# Critical Deployment Issues & Resolution

This document tracks the most serious issues encountered during the BlogHub DevOps deployment project.

---

## Issue #1: NAT Instance Routing Failure - EKS Nodes Unable to Join Cluster

### Problem
EKS worker nodes in private subnets completely failed to join the Kubernetes cluster. Nodes would initialize but fail during cluster registration, blocking all deployments.

### Root Cause
The NAT Instance (self-managed EC2 instance) wasn't properly routing traffic for EKS node initialization. NAT Instances require manual iptables configuration, IP forwarding setup, and don't provide reliable routing for the complex network requirements of EKS nodes. The route table was also using network interface ID instead of NAT gateway ID, creating unreliable routing paths.

### Diagnostic Process
Moved EKS nodes to public subnets temporarily - nodes joined immediately, confirming the issue was networking-related, not IAM or cluster configuration.

### Solution
Replaced NAT Instance with AWS NAT Gateway (managed service). NAT Gateway provides automatic failover, better performance, and no manual configuration. Updated route tables to use NAT Gateway ID instead of network interface ID.

**Impact**: Nodes successfully joined cluster within 2 minutes. Cost increased slightly but reliability improved significantly.

---

## Issue #2: Docker Image Platform Architecture Mismatch

### Problem
Kubernetes pods were unable to pull and run Docker images from ECR, resulting in all deployments failing with ImagePullBackOff errors. Images existed in ECR but Kubernetes couldn't execute them.

### Root Cause
Images were built on Apple Silicon Mac (ARM64 architecture) but EKS nodes run on x86_64/amd64 architecture. Docker builds images for the host architecture by default, so the image manifest only contained ARM64 platform specification. When EKS nodes tried to pull the image, they found no matching platform in the manifest.

### Diagnostic Process
Pod events showed "no match for platform in manifest: not found". Verified image existed in ECR but manifest only contained ARM64 platform. Confirmed local machine was ARM64 (Apple Silicon).

### Solution
Deleted the incompatible ARM64 image from ECR. Rebuilt the image specifying linux/amd64 platform using docker buildx. Restarted pods to pull the new correctly-architected image.

**Impact**: Pods started successfully within 30 seconds. All future builds must specify --platform linux/amd64 flag.

---

## Issue #3: EKS Custom Security Group Blocking Cluster-Node Communication

### Problem
EKS worker nodes were unable to establish communication with the EKS control plane. Nodes would register but fail during bootstrap process, even though cluster was created successfully.

### Root Cause
A custom security group was manually attached to the EKS cluster, which interfered with EKS's automatic security group management. EKS requires specific ingress/egress rules between cluster and nodes that are dynamically managed. The custom security group had general rules but not the specific ephemeral port ranges and protocols EKS uses for node registration.

### Solution
Removed the custom security group entirely and let EKS manage security groups automatically. EKS automatically creates security groups with correct rules for control plane to node communication, node to control plane communication, and cluster endpoint access. EKS updates these rules automatically as nodes join and leave.

**Impact**: Nodes successfully joined cluster within 2 minutes. Security maintained through EKS-managed groups following AWS best practices.

---

## Issue #4: EKS Node Group Instance Type Resource Constraints

### Problem
EKS node groups failed to create nodes or nodes failed to join cluster due to insufficient compute resources.

### Root Cause
EKS worker nodes have minimum resource requirements. Each node runs kubelet, kube-proxy, container runtime, VPC CNI plugin, and system processes. t3.nano (0.5GB RAM) and t2.micro (1GB RAM) don't meet these requirements. Minimum viable is t3.small (2GB RAM).

### Solution
Changed instance type to t3.small which provides sufficient resources for Kubernetes components and container workloads.

**Impact**: Nodes successfully created and joined cluster. Slight cost increase but much more stable performance.

---

## Summary

| Issue | Severity | Resolution | Impact |
|-------|----------|------------|--------|
| NAT Instance Routing | Critical | Replaced with NAT Gateway | Complete deployment blockage resolved |
| Platform Architecture Mismatch | Critical | Rebuild for linux/amd64 | All pods unable to start resolved |
| Custom Security Group | High | Use EKS-managed groups | Nodes unable to join resolved |
| Instance Type Constraints | Medium | Use t3.small minimum | Node creation failures resolved |

### Key Lessons

1. Use managed services (NAT Gateway) over self-managed instances for critical infrastructure
2. Always build Docker images for target platform (linux/amd64 for EKS)
3. Let AWS managed services (EKS) handle security groups automatically
4. Ensure instance types meet minimum requirements, not just cost constraints
5. Test incrementally - isolate issues by testing in public subnets first

---

**Last Updated**: November 2024  
**Project**: BlogHub DevOps Deployment  
**Environment**: Development (dev)
