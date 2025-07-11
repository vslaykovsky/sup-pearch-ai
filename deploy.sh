#!/bin/bash

# Scrollytelling App Kubernetes Deployment Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="supermarket-app"
IMAGE_NAME="us-central1-docker.pkg.dev/b4-app-632c7/psa/sup"
IMAGE_TAG="latest"

echo -e "${GREEN}Starting deployment of Scrollytelling App...${NC}"

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: docker is not installed${NC}"
    exit 1
fi

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}Error: kubectl is not installed${NC}"
    exit 1
fi

# Build Docker image
echo -e "${YELLOW}Building Docker image...${NC}"
docker build -t $IMAGE_NAME:$IMAGE_TAG .

# Push Docker image to registry
echo -e "${YELLOW}Pushing Docker image to registry...${NC}"
docker push $IMAGE_NAME:$IMAGE_TAG


# Delete existing deployment if it exists
echo -e "${YELLOW}Deleting existing deployment if it exists...${NC}"
kubectl delete deployment $APP_NAME --ignore-not-found=true


# Apply Deployment and Service
echo -e "${YELLOW}Applying Deployment and Service...${NC}"
kubectl apply -f k8s/supermarket-app.yaml

# Wait for deployment to be ready
echo -e "${YELLOW}Waiting for deployment to be ready...${NC}"
kubectl wait --for=condition=available --timeout=300s deployment/$APP_NAME

# Get service information
echo -e "${YELLOW}Getting service information...${NC}"
kubectl get service supermarket-service

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${YELLOW}To check the status:${NC}"
echo "kubectl get pods"
echo "kubectl get service supermarket-service"
echo "kubectl logs -f deployment/$APP_NAME" 