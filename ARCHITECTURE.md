# Docker Architecture - Online Book Store

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Desktop                       │
│  ┌──────────────────────────────────────┐              │
│  │    bookstore-network (bridge)        │              │
│  │  ┌────────────────────────────────┐  │              │
│  │  │  Frontend Container            │  │              │
│  │  │  ┌──────────────────────────┐  │  │              │
│  │  │  │  Nginx (Port 80)         │  │  │              │
│  │  │  │  - Angular SPA           │  │  │              │
│  │  │  │  - Static Assets         │  │  │              │
│  │  │  │  - API Proxy             │  │  │              │
│  │  │  └──────────────────────────┘  │  │              │
│  │  │   Container: online-book-     │  │              │
│  │  │             store-frontend    │  │              │
│  │  └──────────────────────────────┘  │              │
│  │             ↓                       │              │
│  │  ┌────────────────────────────────┐  │              │
│  │  │  Backend Container             │  │              │
│  │  │  ┌──────────────────────────┐  │  │              │
│  │  │  │  Java/Spring Boot        │  │  │              │
│  │  │  │  (Port 8080)             │  │  │              │
│  │  │  │  - REST API              │  │  │              │
│  │  │  │  - Business Logic        │  │  │              │
│  │  │  │  - Authentication        │  │  │              │
│  │  │  │  - Actuator Health Check │  │  │              │
│  │  │  └──────────────────────────┘  │  │              │
│  │  │   Container: online-book-     │  │              │
│  │  │             store-backend     │  │              │
│  │  └──────────────────────────────┘  │              │
│  │             ↓                       │              │
│  │  ┌────────────────────────────────┐  │              │
│  │  │  Database Container            │  │              │
│  │  │  ┌──────────────────────────┐  │  │              │
│  │  │  │  MySQL (Port 3306)       │  │  │              │
│  │  │  │  - bookstoredb Database  │  │  │              │
│  │  │  │  - Data Persistence      │  │  │              │
│  │  │  │  Volume: mysql_data      │  │  │              │
│  │  │  │  - Health Check Ping     │  │  │              │
│  │  │  └──────────────────────────┘  │  │              │
│  │  │   Container: online-book-     │  │              │
│  │  │             store-db          │  │              │
│  │  └──────────────────────────────┘  │              │
│  │                                    │              │
│  │  Volumes:                          │              │
│  │  - mysql_data: /var/lib/mysql     │              │
│  └──────────────────────────────────┘              │
└─────────────────────────────────────────────────────────┘
                      ↑
          Windows Host Machine
       (Localhost / 127.0.0.1)
       - 80:80 (Frontend)
       - 8080:8080 (Backend)
       - 3306:3306 (Database)
```

## Network Communication

### Inter-Container Communication (Inside Docker Network)
```
Frontend → Backend
  URL: http://backend:8080/api
  
Backend → Database
  URL: jdbc:mysql://db:3306/bookstoredb
  
Frontend → Database
  Not direct (through Backend API)
```

### External Access (From Host Machine)
```
Browser → http://localhost
  ↓
Nginx (container) serves Angular SPA
  ↓
User clicks API → http://localhost:8080/api
  ↓
Spring Boot Backend processes request
  ↓
Returns JSON response
```

## Container Specifications

### Frontend Container
- **Image**: Node 18 Alpine → Nginx Alpine (Multi-stage build)
- **Port**: 80
- **Size**: ~50-100 MB
- **Working Dir**: /usr/share/nginx/html
- **Key Files**:
  - nginx.conf (custom configuration)
  - .dockerignore (excludes unwanted files)

### Backend Container
- **Image**: Maven 3.8.4 → OpenJDK 11 JRE (Multi-stage build)
- **Port**: 8080
- **Size**: ~200-300 MB
- **Working Dir**: /app
- **Health Check**: HTTP GET /actuator/health (every 30s)
- **Key Files**:
  - pom.xml (Maven dependencies)
  - .dockerignore (excludes build artifacts)

### Database Container
- **Image**: MySQL 8.0 Official
- **Port**: 3306
- **Size**: ~400-500 MB
- **Volume**: mysql_data (/var/lib/mysql)
- **Health Check**: MySQL ping (every 10s)
- **Default Credentials**:
  - Username: root
  - Password: rootpassword
  - Database: bookstoredb

## Environment Variables

Variables are defined in `.env` file:

```env
# Database
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=bookstoredb
MYSQL_USER=bookstore_user
MYSQL_PASSWORD=bookstore_password

# Spring Boot
SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/bookstoredb
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=rootpassword
SERVER_PORT=8080
```

## Build and Runtime Flow

### Build Time (Initial)
```
docker-compose build
  ├── Frontend
  │   ├── Base: node:18-alpine
  │   ├── npm install
  │   ├── npm run build
  │   └── Copy dist to nginx image
  │
  ├── Backend
  │   ├── Base: maven:3.8.4
  │   ├── mvn dependency:go-offline
  │   ├── mvn clean package
  │   └── Copy JAR to JRE image
  │
  └── Database
      └── Pull mysql:8.0 image
```

### Runtime (When running)
```
docker-compose up
  ├── Create bookstore-network
  ├── Create mysql_data volume
  ├── Start DB (wait for health check)
  ├── Start Backend (wait for DB health check)
  ├── Start Frontend (wait for Backend health check)
  └── Services ready for traffic
```

## Port Mapping

```
Host Machine          Docker Container
═════════════════════════════════════════
localhost:80    ──→  nginx:80 (Frontend)
localhost:8080  ──→  java:8080 (Backend)
localhost:3306  ──→  mysql:3306 (Database)
```

## Data Persistence

### MySQL Volume
- **Host Path**: Docker managed volume (mysql_data)
- **Container Path**: /var/lib/mysql
- **Persistence**: Data survives container restart
- **Removal**: Deleted when running `docker-compose down -v`

### Application Logs
- Streamed to Docker stdout/stderr
- View with: `docker-compose logs`
- Not persisted (consider mounting for production)

## Multi-Stage Build Benefits

### Frontend Multi-Stage Build
```
Stage 1: Build (Node 18 Alpine)
  ✓ Compiles TypeScript/Angular
  ✓ Optimizes production build
  ✓ Creates dist/ folder

Stage 2: Runtime (Nginx Alpine)
  ✓ Only includes compiled files
  ✓ Minimal image size (~50 MB)
  ✓ Fast startup
```

### Backend Multi-Stage Build
```
Stage 1: Build (Maven + Java)
  ✓ Downloads dependencies
  ✓ Compiles source code
  ✓ Packages JAR application

Stage 2: Runtime (JRE only)
  ✓ Only runs compiled JAR
  ✓ Smaller image size (~200 MB)
  ✓ Faster deployment
```

## Service Dependencies

```
startup order:
1. Database (db)
   - Mandatory for Backend
   - Health check: MySQL ping

2. Backend
   - Depends on: Database
   - Waits for: DB health check
   - Health check: /actuator/health

3. Frontend
   - Depends on: Backend
   - Waits for: Backend health check
   - No health check in docker-compose
```

## Resource Limits (Default)

Currently unlimited. To add limits, update docker-compose.yml:

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

## Debugging Network Issues

```bash
# List all networks
docker network ls

# Inspect docker network
docker network inspect bookstore-network

# Test connectivity between containers
docker exec online-book-store-frontend curl http://backend:8080/actuator/health

# Check exposed ports
docker port online-book-store-backend
```

## Related Files

- [docker-compose.yml](docker-compose.yml) - Service definitions
- [.env](.env) - Environment variables
- [DOCKER_README.md](DOCKER_README.md) - Detailed documentation
- [QUICK_START.md](QUICK_START.md) - Quick start guide
- [frontend/Dockerfile](frontend/Dockerfile) - Frontend container
- [frontend/nginx.conf](frontend/nginx.conf) - Nginx configuration
- [Backend/online-book-store/Dockerfile](Backend/online-book-store/Dockerfile) - Backend container
