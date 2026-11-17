@echo off
echo Starting RoadGuard AI Backend on http://localhost:8000 ...
call venv\Scripts\activate.bat
uvicorn main:app --reload --port 8000
