#!/usr/bin/env bash
# RoadGuard AI — Backend Production Build Script
set -e

echo "=== [1/3] Upgrading pip ==="
python -m pip install --upgrade pip

echo "=== [2/3] Installing backend dependencies ==="
pip install -r requirements.txt

echo "=== [3/3] Verifying YOLOv8 model loading ==="
python -c "from ultralytics import YOLO; model = YOLO('yolov8n.pt'); print('YOLOv8n build check verified.')"

echo "=== Backend build completed successfully ==="
