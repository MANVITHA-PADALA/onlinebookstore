# Docker Commands Helper for Online Book Store Project

param(
    [Parameter(Position=0)]
    [string]$Command = ""
)

function Show-Help {
    Write-Host "Docker Helper Commands for Online Book Store Project" -ForegroundColor Green
    Write-Host ""
    Write-Host "Usage: .\docker-helper.ps1 [command]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Cyan
    Write-Host "  start          Start all containers"
    Write-Host "  stop           Stop all containers"
    Write-Host "  restart        Restart all containers"
    Write-Host "  build          Build all images"
    Write-Host "  logs           View logs from all services"
    Write-Host "  ps             List running containers"
    Write-Host "  kill           Remove all containers and networks (data preserved)"
    Write-Host "  backend-logs   View backend service logs"
    Write-Host "  frontend-logs  View frontend service logs"
    Write-Host "  db-logs        View database service logs"
    Write-Host "  shell-backend  Open shell in backend container"
    Write-Host "  shell-db       Open MySQL shell in database container"
    Write-Host "  help           Show this help message"
    Write-Host ""
}

function Start-Services {
    Write-Host "Starting Online Book Store containers..." -ForegroundColor Green
    docker-compose up -d
    Write-Host ""
    Write-Host "Containers started! Access the application:" -ForegroundColor Green
    Write-Host "  Frontend: http://localhost" -ForegroundColor Yellow
    Write-Host "  Backend: http://localhost:8080" -ForegroundColor Yellow
    Write-Host "  Database: localhost:3306" -ForegroundColor Yellow
    Write-Host ""
}

function Stop-Services {
    Write-Host "Stopping Online Book Store containers..." -ForegroundColor Green
    docker-compose stop
    Write-Host "Containers stopped." -ForegroundColor Green
}

function Restart-Services {
    Write-Host "Restarting Online Book Store containers..." -ForegroundColor Green
    docker-compose restart
    Write-Host "Containers restarted." -ForegroundColor Green
}

function View-Logs {
    docker-compose logs -f
}

function Build-Services {
    Write-Host "Building Online Book Store images..." -ForegroundColor Green
    docker-compose build
    Write-Host "Build complete." -ForegroundColor Green
}

function Kill-Services {
    Write-Host "WARNING: This will remove all containers and networks (data preserved)." -ForegroundColor Red
    $confirm = Read-Host "Are you sure? (y/n)"
    if ($confirm -eq "y" -or $confirm -eq "Y") {
        docker-compose down
        Write-Host "Containers removed." -ForegroundColor Green
    } else {
        Write-Host "Cancelled." -ForegroundColor Yellow
    }
}

function Show-PS {
    docker-compose ps
}

function View-BackendLogs {
    docker-compose logs -f backend
}

function View-FrontendLogs {
    docker-compose logs -f frontend
}

function View-DBLogs {
    docker-compose logs -f db
}

function Open-BackendShell {
    Write-Host "Opening shell in backend container..." -ForegroundColor Green
    docker exec -it online-book-store-backend /bin/sh
}

function Open-DBShell {
    Write-Host "Opening MySQL shell in database container..." -ForegroundColor Green
    docker exec -it online-book-store-db mysql -u root -p
}

# Main switch
switch ($Command.ToLower()) {
    "start" { Start-Services }
    "stop" { Stop-Services }
    "restart" { Restart-Services }
    "logs" { View-Logs }
    "build" { Build-Services }
    "kill" { Kill-Services }
    "ps" { Show-PS }
    "backend-logs" { View-BackendLogs }
    "frontend-logs" { View-FrontendLogs }
    "db-logs" { View-DBLogs }
    "shell-backend" { Open-BackendShell }
    "shell-db" { Open-DBShell }
    "help" { Show-Help }
    "" { Show-Help }
    default {
        Write-Host "Unknown command: $Command" -ForegroundColor Red
        Write-Host ""
        Show-Help
    }
}
