# Docker Compose - BlogHub Services

This Docker Compose file runs all BlogHub microservices in containers.

## Quick Start

### Build and Start All Services
```bash
cd apps
docker-compose up --build
```

### Start in Detached Mode (Background)
```bash
docker-compose up -d --build
```

### Stop All Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f post-service
docker-compose logs -f frontend
```

### Restart a Specific Service
```bash
docker-compose restart post-service
```

### Rebuild a Specific Service
```bash
docker-compose up -d --build post-service
```

## Services

- **Frontend**: http://localhost:3000
- **Post Service**: http://localhost:3001
- **Comment Service**: http://localhost:3002
- **User Service**: http://localhost:3003
- **Notification Service**: http://localhost:3004

## Network

All services run on the `bloghub-network` bridge network, allowing them to communicate using service names:
- `post-service` (instead of `localhost`)
- `comment-service`
- `user-service`
- `notification-service`

## Environment Variables

Services use environment variables for configuration:
- `POST_SERVICE_URL`: Comment service uses this to call post service
- `NOTIFICATION_SERVICE_URL`: Comment service uses this to send notifications
- `JWT_SECRET`: Secret key for JWT tokens (user service)

## Health Checks

All backend services have health checks that verify they're running correctly.

## Troubleshooting

### Check Service Status
```bash
docker-compose ps
```

### View Service Logs
```bash
docker-compose logs [service-name]
```

### Rebuild Everything
```bash
docker-compose down
docker-compose up --build
```

### Clean Up (Remove containers, networks, volumes)
```bash
docker-compose down -v
```

