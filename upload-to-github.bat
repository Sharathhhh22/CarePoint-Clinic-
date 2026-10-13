@echo off
title SlotUrSelf - Upload to GitHub
echo ========================================================
echo   SlotUrSelf - Automated Git Upload & Sync
echo ========================================================
echo.

echo 1. Checking git status...
git status
echo.

echo 2. Staging all files...
git add .
echo.

set /p commit_msg="Enter commit message (or press ENTER for default): "
if "%commit_msg%"=="" set commit_msg=update: sync changes from File Explorer

echo.
echo 3. Committing changes: "%commit_msg%"...
git commit -m "%commit_msg%"
echo.

echo 4. Pushing to GitHub (origin main)...
git push origin main
echo.

echo ========================================================
echo   Done! Changes pushed to GitHub successfully.
echo   Vercel will automatically redeploy the site.
echo ========================================================
echo.
pause
