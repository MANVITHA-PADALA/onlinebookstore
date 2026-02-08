# Quick Start Guide - Docker

## Prerequisites
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Ensure Docker is running

## Quick Start (3 Steps)

### 1. Start Containers
```powershell
docker-compose up -d
```

or use the helper script:
```powershell
.\docker-helper.ps1 start
```

### 2. Wait for Services to Be Ready
Check status:
```powershell
docker-compose ps
```

All three services should show "Up" status.

### 3. Access Your Application
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **API Health**: http://localhost:8080/actuator/health

## Common Tasks

### View Logs
```powershell
.\docker-helper.ps1 logs
```

### Stop Services
```powershell
.\docker-helper.ps1 stop
```

### Restart Services
```powershell
.\docker-helper.ps1 restart
```

### Rebuild Images
```powershell
docker-compose build
```

### Complete Cleanup
```powershell
.\docker-helper.ps1 kill
```

## Troubleshooting

### Services won't start
Check logs:
```powershell
docker-compose logs
```

### Port already in use
Edit `docker-compose.yml` and change ports:
```yaml
ports:
  - "8000:80"      # frontend
  - "8081:8080"    # backend
  - "3307:3306"    # database
```

### Database connection error
Wait a few seconds for MySQL to initialize:
```powershell
docker-compose logs db
```

## File Structure Created

```
├── docker-compose.yml      # Main orchestration file
├── .env                    # Environment variables
├── docker-helper.ps1       # PowerShell helper
├── docker-helper.bat       # Batch helper
├── DOCKER_README.md        # Detailed documentation
├── frontend/
│   ├── Dockerfile          # Frontend container
│   ├── nginx.conf          # Nginx config
│   └── .dockerignore
└── Backend/online-book-store/
    ├── Dockerfile          # Backend container
    └── .dockerignore
```

For detailed information, see [DOCKER_README.md](DOCKER_README.md)
