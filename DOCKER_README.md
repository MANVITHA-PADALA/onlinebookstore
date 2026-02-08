# Docker Setup Guide - Online Book Store Project

This guide explains how to containerize and run the Online Book Store application using Docker and Docker Compose.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running
- Docker CE version 20.10 or higher
- Docker Compose version 1.29 or higher

## Project Architecture

The application consists of three containerized services:

1. **Frontend (Angular)** - Nginx-based container serving the Angular SPA
2. **Backend (Spring Boot)** - Java-based container running the Spring Boot API
3. **Database (MySQL)** - MySQL database container for data persistence

These services communicate through a Docker bridge network named `bookstore-network`.

## File Structure

```
online-book-store-project/
├── Backend/
│   └── online-book-store/
│       ├── Dockerfile          # Backend container definition
│       ├── .dockerignore        # Files to exclude from Docker build
│       └── src/
├── frontend/
│   ├── Dockerfile              # Frontend container definition
│   ├── nginx.conf              # Nginx configuration
│   ├── .dockerignore           # Files to exclude from Docker build
│   └── src/
├── docker-compose.yml          # Orchestration file for all services
├── .env                        # Environment variables
└── DOCKER_README.md           # This file
```

## Getting Started

### 1. Start All Services

Navigate to the project root directory and run:

```bash
docker-compose up -d
```

This command will:
- Build the frontend Docker image
- Build the backend Docker image
- Pull the MySQL image
- Start all three containers
- Create a bridge network for inter-container communication
- Create a persistent volume for MySQL data

### 2. Verify Services are Running

```bash
docker-compose ps
```

Expected output should show three running containers:
- `online-book-store-frontend` (port 80)
- `online-book-store-backend` (port 8080)
- `online-book-store-db` (port 3306)

### 3. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **API Endpoint Example**: http://localhost:8080/api/books

## Common Docker Commands

### View Logs

View logs for all services:
```bash
docker-compose logs -f
```

View logs for a specific service:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Stop Services

Stop all services without removing containers:
```bash
docker-compose stop
```

### Restart Services

Restart all services:
```bash
docker-compose restart
```

### Remove All Services

Remove all containers, networks, and start fresh:
```bash
docker-compose down
```

Remove everything including volumes (WARNING: This deletes database data):
```bash
docker-compose down -v
```

### Rebuild Services

Rebuild images without using cache:
```bash
docker-compose up -d --build --no-cache
```

### Execute Commands Inside Containers

Open a shell in the backend container:
```bash
docker exec -it online-book-store-backend /bin/sh
```

Open a MySQL shell:
```bash
docker exec -it online-book-store-db mysql -u root -p
```

### View Container Details

Get detailed information about a container:
```bash
docker inspect online-book-store-backend
```

## Configuration

### Environment Variables

Modify `.env` file to change configuration:

```
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=bookstoredb
MYSQL_USER=bookstore_user
MYSQL_PASSWORD=bookstore_password
SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/bookstoredb
API_URL=http://localhost:8080/api
```

### Port Configuration

Modify ports in `docker-compose.yml`:
- Frontend port: Change `"80:80"` to `"3000:80"` (example)
- Backend port: Change `"8080:8080"` to `"8081:8080"` (example)
- Database port: Change `"3306:3306"` to `"3307:3306"` (example)

## Service Communication

Services communicate using Docker's DNS:
- Frontend → Backend: `http://backend:8080`
- Backend → Database: `mysql://db:3306`
- Frontend → Database: Not directly (through backend API)

## Health Checks

The docker-compose.yml includes health checks for:
- **Backend**: HTTP GET request to `/actuator/health`
- **Database**: MySQL connection ping

Check service health:
```bash
docker-compose ps
```

Status indicators:
- `Up` - Service is running
- `Up (healthy)` - Service passed health check
- `Up (unhealthy)` - Service failed health check

## Troubleshooting

### Ports Already in Use

If ports are already in use, modify `docker-compose.yml`:
```yaml
ports:
  - "8000:80"    # Use port 8000 instead of 80
  - "8081:8080"  # Use port 8081 instead of 8080
```

### Database Connection Issues

Check if database is running:
```bash
docker-compose ps db
```

View database logs:
```bash
docker-compose logs db
```

### Frontend Cannot Connect to Backend

Ensure the API URL in the frontend matches your setup. Check nginx.conf:
```
proxy_pass http://backend:8080;
```

### Out of Disk Space

Clean up Docker resources:
```bash
docker system prune -a
```

## Performance Optimization

### Memory Limits

Modify `docker-compose.yml` to limit container resources:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### Volume optimization for Windows

Consider using named volumes instead of bind mounts for better performance:
```yaml
volumes:
  mysql_data:
    driver: local
```

## Production Deployment

For production deployment:

1. Update `.env` with production values
2. Use Docker images with specific version tags instead of `latest`
3. Implement proper logging and monitoring
4. Set up persistent volumes on external storage
5. Configure proper health checks and restart policies
6. Use environment-specific docker-compose files:
   - `docker-compose.yml` - Development
   - `docker-compose.prod.yml` - Production

Example:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Docker Desktop Integration

### Enable Docker Desktop Features

1. Open Docker Desktop
2. Go to Settings → General
3. Enable "Start Docker Desktop when you log in"
4. Enable "Use the WSL 2 based engine" (for Windows)

### Resource Allocation

1. Go to Settings → Resources
2. Set appropriate CPU and Memory limits:
   - CPUs: 2-4 cores
   - Memory: 2-4 GB
   - Swap: 512 MB

## Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Spring Boot Docker Guide](https://spring.io/guides/gs/spring-boot-docker/)
- [Angular Docker Guide](https://angular.io/guide/dependency-injection)

## Support

For issues or questions:
1. Check Docker Desktop logs
2. Review container logs: `docker-compose logs service_name`
3. Verify network connectivity: `docker network inspect bookstore-network`
4. Ensure all required ports are available
