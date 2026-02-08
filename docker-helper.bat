@echo off
REM Docker Commands Helper for Online Book Store Project

if "%1"=="" goto help
if "%1"=="start" goto start
if "%1"=="stop" goto stop
if "%1"=="restart" goto restart
if "%1"=="logs" goto logs
if "%1"=="build" goto build
if "%1"=="kill" goto kill
if "%1"=="ps" goto ps
if "%1"=="help" goto help

:help
echo Docker Helper Commands
echo.
echo Usage: docker-helper.bat [command]
echo.
echo Commands:
echo   start      Start all containers
echo   stop       Stop all containers
echo   restart    Restart all containers
echo   build      Build all images
echo   logs       View logs from all services
echo   ps         List running containers
echo   kill       Remove all containers and networks (data preserved)
echo   help       Show this help message
echo.
pause
exit /b 0

:start
echo Starting Online Book Store containers...
docker-compose up -d
echo.
echo Containers started! Access the application:
echo   Frontend: http://localhost
echo   Backend: http://localhost:8080
echo   Database: localhost:3306
echo.
pause
exit /b 0

:stop
echo Stopping Online Book Store containers...
docker-compose stop
echo Containers stopped.
pause
exit /b 0

:restart
echo Restarting Online Book Store containers...
docker-compose restart
echo Containers restarted.
pause
exit /b 0

:logs
docker-compose logs -f
pause
exit /b 0

:build
echo Building Online Book Store images...
docker-compose build
echo Build complete.
pause
exit /b 0

:kill
echo WARNING: This will remove all containers and networks.
set /p confirm="Are you sure? (y/n): "
if /i "%confirm%"=="y" (
    docker-compose down
    echo Containers removed.
) else (
    echo Cancelled.
)
pause
exit /b 0

:ps
docker-compose ps
pause
exit /b 0
