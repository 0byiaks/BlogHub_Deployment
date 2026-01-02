#!/bin/bash

# Script to get the frontend LoadBalancer URL
# Usage: ./scripts/get-frontend-url.sh [staging|production]

set -e

ENVIRONMENT=${1:-staging}
CLUSTER_NAME="devops-deployment-${ENVIRONMENT}"
REGION="eu-north-1"
NAMESPACE="bloghub"
SERVICE_NAME="frontend"

echo "🔍 Getting frontend URL for ${ENVIRONMENT} environment..."
echo ""

# Configure kubectl
echo "📡 Configuring kubectl for EKS cluster: ${CLUSTER_NAME}"
aws eks update-kubeconfig --name ${CLUSTER_NAME} --region ${REGION} > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "❌ Failed to configure kubectl. Make sure:"
    echo "   1. AWS CLI is configured"
    echo "   2. You have access to the EKS cluster"
    echo "   3. The cluster exists: ${CLUSTER_NAME}"
    exit 1
fi

echo "✅ kubectl configured"
echo ""

# Check if service exists
echo "🔍 Checking if service exists..."
if ! kubectl get service ${SERVICE_NAME} -n ${NAMESPACE} > /dev/null 2>&1; then
    echo "❌ Service '${SERVICE_NAME}' not found in namespace '${NAMESPACE}'"
    echo "   Make sure the service is deployed"
    exit 1
fi

# Check service type
SERVICE_TYPE=$(kubectl get service ${SERVICE_NAME} -n ${NAMESPACE} -o jsonpath='{.spec.type}')

if [ "${SERVICE_TYPE}" != "LoadBalancer" ]; then
    echo "⚠️  Service type is '${SERVICE_TYPE}', not 'LoadBalancer'"
    echo "   The service needs to be LoadBalancer type to get an external URL"
    echo ""
    echo "   To fix, update k8s/services/frontend-service.yaml:"
    echo "   Change 'type: ClusterIP' to 'type: LoadBalancer'"
    exit 1
fi

echo "✅ Service found (type: ${SERVICE_TYPE})"
echo ""

# Wait for LoadBalancer to be ready
echo "⏳ Waiting for LoadBalancer to be provisioned..."
echo "   (This may take 1-2 minutes)"
echo ""

TIMEOUT=300  # 5 minutes
ELAPSED=0
INTERVAL=5

while [ ${ELAPSED} -lt ${TIMEOUT} ]; do
    EXTERNAL_IP=$(kubectl get service ${SERVICE_NAME} -n ${NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || echo "")
    EXTERNAL_IP_ALT=$(kubectl get service ${SERVICE_NAME} -n ${NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
    
    if [ -n "${EXTERNAL_IP}" ] || [ -n "${EXTERNAL_IP_ALT}" ]; then
        break
    fi
    
    echo "   Still waiting... (${ELAPSED}s elapsed)"
    sleep ${INTERVAL}
    ELAPSED=$((ELAPSED + INTERVAL))
done

# Get the URL
EXTERNAL_IP=$(kubectl get service ${SERVICE_NAME} -n ${NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || kubectl get service ${SERVICE_NAME} -n ${NAMESPACE} -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")

if [ -z "${EXTERNAL_IP}" ]; then
    echo "❌ LoadBalancer not ready after ${TIMEOUT} seconds"
    echo ""
    echo "   Check the service status:"
    echo "   kubectl get service ${SERVICE_NAME} -n ${NAMESPACE}"
    echo ""
    echo "   Check for events:"
    echo "   kubectl describe service ${SERVICE_NAME} -n ${NAMESPACE}"
    exit 1
fi

# Determine if it's a hostname or IP
if [[ "${EXTERNAL_IP}" == *".elb."* ]] || [[ "${EXTERNAL_IP}" == *".amazonaws.com"* ]]; then
    URL="http://${EXTERNAL_IP}"
else
    URL="http://${EXTERNAL_IP}"
fi

echo "✅ LoadBalancer ready!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Frontend URL:"
echo "   ${URL}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Try to open in browser (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    read -p "Open in browser? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open "${URL}"
    fi
fi

# Display service details
echo "📊 Service Details:"
kubectl get service ${SERVICE_NAME} -n ${NAMESPACE}
echo ""

# Display pod status
echo "📊 Pod Status:"
kubectl get pods -n ${NAMESPACE} -l app=frontend
echo ""

echo "✅ Done! Access your application at: ${URL}"


