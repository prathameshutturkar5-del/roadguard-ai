# RoadGuard AI — Vehicle Detection Backend

FastAPI backend with YOLOv8n real-time vehicle detection.

## Setup

```bash
# 1. Navigate to backend folder
cd c:\Users\prath\Downloads\roadguard-ai\backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate it (Windows)
venv\Scripts\activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Start the server
uvicorn main:app --reload --port 8000
```

The server will start at http://localhost:8000  
API docs available at http://localhost:8000/docs

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check + model status |
| POST | /detect/image | Detect vehicles in image |
| POST | /detect/video | Detect vehicles in video |

## Notes

- YOLOv8n model downloads automatically on first run (~6MB)
- Detects: cars, motorcycles, buses, trucks (COCO classes 2, 3, 5, 7)
- Minimum confidence: 25%
- Video processing samples up to 60 frames for speed
- CORS is configured for `http://localhost:5173` and `http://localhost:3000`

## Example Usage

### Health Check
```bash
curl http://localhost:8000/health
```

### Image Detection
```bash
curl -X POST http://localhost:8000/detect/image \
  -F "file=@/path/to/your/image.jpg"
```

### Video Detection
```bash
curl -X POST http://localhost:8000/detect/video \
  -F "file=@/path/to/your/video.mp4"
```

## Response Format — Image Detection

```json
{
  "status": "success",
  "filename": "road.jpg",
  "image_width": 1280,
  "image_height": 720,
  "total_vehicles": 5,
  "counts_by_class": {
    "car": 3,
    "motorcycle": 1,
    "bus": 0,
    "truck": 1
  },
  "detections": [
    {
      "class": "car",
      "confidence": 0.9231,
      "bbox": [120, 200, 340, 380]
    }
  ],
  "annotated_image": "<base64-encoded-PNG>"
}
```

## Response Format — Video Detection

```json
{
  "status": "success",
  "filename": "traffic.mp4",
  "video_width": 1920,
  "video_height": 1080,
  "total_frames": 300,
  "fps": 30.0,
  "frames_analyzed": 60,
  "total_vehicles_detected": 142,
  "counts_by_class": { "car": 100, "motorcycle": 20, "bus": 5, "truck": 17 },
  "frame_data": [
    { "frame": 0, "time_sec": 0.0, "vehicle_count": 3, "counts": { "car": 2, "motorcycle": 1, "bus": 0, "truck": 0 } }
  ],
  "thumbnail": "<base64-encoded-PNG>"
}
```
