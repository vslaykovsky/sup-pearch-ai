# Kubernetes Deployment

This directory contains Kubernetes configuration files for deploying the Scrollytelling App.

## Files

- `namespace.yaml` - Kubernetes namespace definition
- `supermarket-app.yaml` - Combined deployment and service configuration
- `deploy.sh` - Automated deployment script

## Quick Start

1. **Build the Docker image:**
   ```bash
   docker build -t scrollytelling-app:latest .
   ```

2. **Deploy to Kubernetes:**
   ```bash
   cd k8s
   ./deploy.sh
   ```

## Manual Deployment

If you prefer to deploy manually:

```bash
# Create namespace
kubectl apply -f namespace.yaml

# Deploy application
kubectl apply -f supermarket-app.yaml

# Check status
kubectl get pods -n scrollytelling
kubectl get service supermarket-service -n scrollytelling
```

## Configuration

The deployment includes:
- **3 replicas** for high availability
- **LoadBalancer service** for external access
- **Health checks** for liveness and readiness
- **Resource limits** for CPU and memory
- **Security context** with non-root user

## Accessing the Application

After deployment, get the external IP:
```bash
kubectl get service supermarket-service -n scrollytelling
```

The application will be available at `http://<EXTERNAL-IP>`.

## Monitoring

Check application logs:
```bash
kubectl logs -f deployment/supermarket-app -n scrollytelling
```

Check pod status:
```bash
kubectl get pods -n scrollytelling
``` 