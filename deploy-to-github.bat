@echo off
echo ===================================================
echo   GitHub Pages Deployment Script for Calendar
echo ===================================================
echo.

REM Check if Git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Git is not installed or not in your PATH.
    echo Please install Git from https://git-scm.com/downloads
    echo and try again.
    pause
    exit /b 1
)

REM Initialize Git repository if not already initialized
if not exist .git (
    echo Initializing Git repository...
    git init
    if %ERRORLEVEL% NEQ 0 (
        echo Failed to initialize Git repository.
        pause
        exit /b 1
    )
)

REM Prompt for GitHub username and repository name
set /p GITHUB_USERNAME=Enter your GitHub username: 
set /p REPO_NAME=Enter repository name (e.g., historical-events-calendar): 

REM Add all files to Git
echo Adding files to Git...
git add .

REM Commit changes
echo Committing changes...
git commit -m "Initial commit for GitHub Pages deployment"

REM Add GitHub remote if not already added
git remote -v | findstr origin >nul
if %ERRORLEVEL% NEQ 0 (
    echo Adding GitHub remote...
    git remote add origin https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git
) else (
    echo Updating GitHub remote...
    git remote set-url origin https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git
)

REM Push to GitHub
echo Pushing to GitHub...
git push -u origin master

echo.
echo ===================================================
echo Deployment process completed!
echo.
echo Your website should be available at:
echo https://%GITHUB_USERNAME%.github.io/%REPO_NAME%/
echo.
echo You may need to enable GitHub Pages in your repository settings:
echo 1. Go to https://github.com/%GITHUB_USERNAME%/%REPO_NAME%/settings
echo 2. Scroll down to "GitHub Pages" section
echo 3. Select "master branch" as the source
echo ===================================================
echo.

pause