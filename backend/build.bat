@echo off
echo ===================================================
echo   RoadGuard AI Backend - Build & Setup Verification
echo ===================================================

if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Upgrading pip...
python -m pip install --upgrade pip

echo Installing dependencies from requirements.txt...
pip install -r requirements.txt

echo Verifying YOLOv8 model...
python -c "from ultralytics import YOLO; model = YOLO('yolov8n.pt'); print('>>> YOLOv8n verified successfully! <<<')"

echo ===================================================
echo   Backend build completed successfully!
echo   To start the server, run: run.bat
echo ===================================================
pause
