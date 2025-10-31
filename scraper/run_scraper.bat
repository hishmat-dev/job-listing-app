@echo off
echo Setting up environment for ActuaryList scraper...

REM Navigate to scraper directory
cd /d %~dp0

REM Check if virtual environment exists
IF NOT EXIST "..\backend\venv" (
    echo Creating virtual environment...
    cd ..\backend
    python -m venv venv
    cd ..\scraper
)

REM Activate virtual environment
echo Activating virtual environment...
call ..\backend\venv\Scripts\activate.bat

REM Install requirements
echo Installing requirements...
pip install -r ..\backend\requirements.txt

REM Run scraper
echo Running scraper...
python run_scrapper.py

echo Scraper completed!
pause
