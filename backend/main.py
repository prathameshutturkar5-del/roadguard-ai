"""
RoadGuard AI — Vehicle Detection API (Production Ready)
FastAPI + YOLOv8n real-time vehicle detection
"""

import os
import io
import time
import base64
import logging
import tempfile
import traceback
from pathlib import Path
from typing import Optional, List, Dict, Any
from contextlib import asynccontextmanager

# Configure safe temp directory for Ultralytics settings & caches in containerized environments
os.environ.setdefault("YOLO_CONFIG_DIR", tempfile.gettempdir())

import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from ultralytics import YOLO

# ── Logging Configuration ─────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("roadguard-api")

# ── Environment & Limits ──────────────────────────────────────────────────────
MAX_IMAGE_SIZE_BYTES = int(os.getenv("MAX_IMAGE_SIZE_BYTES", 15 * 1024 * 1024))  # 15 MB
MAX_VIDEO_SIZE_BYTES = int(os.getenv("MAX_VIDEO_SIZE_BYTES", 50 * 1024 * 1024))  # 50 MB
MAX_VIDEO_SAMPLED_FRAMES = int(os.getenv("MAX_VIDEO_SAMPLED_FRAMES", 60))
MAX_INFERENCE_IMAGE_DIM = int(os.getenv("MAX_INFERENCE_IMAGE_DIM", 1920))

# ── Vehicle Classes (COCO IDs: 2:car, 3:motorcycle, 5:bus, 7:truck) ───────────
VEHICLE_CLASSES: Dict[int, str] = {
    2: "car",
    3: "motorcycle",
    5: "bus",
    7: "truck",
}

# BGR colors for OpenCV bounding boxes
CLASS_COLORS: Dict[str, tuple] = {
    "car":        (59, 130, 246),   # blue
    "motorcycle": (16, 185, 129),   # green
    "bus":        (245, 158, 11),   # amber
    "truck":      (239, 68, 68),    # red
}

# ── Global Model Reference & App State ────────────────────────────────────────
MODEL: Optional[YOLO] = None
START_TIME: float = time.time()
MODEL_LOAD_ERROR: Optional[str] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup & shutdown lifespan handler."""
    global MODEL, MODEL_LOAD_ERROR
    logger.info("Initializing RoadGuard AI Backend...")

    # Resolve model file path
    local_model_path = Path(__file__).parent / "yolov8n.pt"

    try:
        if local_model_path.exists():
            logger.info(f"Loading local YOLOv8n weights from: {local_model_path}")
            MODEL = YOLO(str(local_model_path))
        else:
            logger.info("Local yolov8n.pt not found. Ultralytics will fetch weights...")
            MODEL = YOLO("yolov8n.pt")

        # Warm-up inference with a 1x1 black image to compile graph and initialize torch runtime
        dummy_img = np.zeros((64, 64, 3), dtype=np.uint8)
        MODEL.predict(dummy_img, verbose=False)
        logger.info("YOLOv8n model initialized and warmed up successfully ✓")
    except Exception as exc:
        MODEL_LOAD_ERROR = str(exc)
        logger.error(f"Failed to initialize YOLO model: {exc}")
        logger.error(traceback.format_exc())
        MODEL = None

    yield

    logger.info("Shutting down RoadGuard AI Backend.")


# ── App Initialization ────────────────────────────────────────────────────────
app = FastAPI(
    title="RoadGuard AI — Vehicle Detection API",
    description="Production-ready YOLOv8n real-time vehicle detection service for road safety monitoring",
    version="1.0.0",
    lifespan=lifespan,
)

# ── Dynamic CORS Configuration ────────────────────────────────────────────────
# Supports:
# 1. Localhost development ports
# 2. Vercel deployment domains (via regex https://*.vercel.app)
# 3. Custom production domains via ALLOWED_ORIGINS env var (comma-separated)
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
custom_origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]

default_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Allow all origins if wildcard is explicitly given, otherwise merge defaults + custom
origins_list: List[str] = ["*"] if "*" in custom_origins else list(dict.fromkeys(default_origins + custom_origins))

# Regex allowing any *.vercel.app preview or production URL by default
origin_regex = os.getenv("ALLOW_ORIGIN_REGEX", r"^https:\/\/.*\.vercel\.app$")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins_list,
    allow_origin_regex=origin_regex if "*" not in origins_list else None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Helper Utilities ──────────────────────────────────────────────────────────

async def read_file_safely(file: UploadFile, max_bytes: int) -> bytes:
    """Stream and validate file size to prevent memory exhaustion attacks."""
    content = bytearray()
    chunk_size = 1024 * 1024  # 1 MB chunks

    while True:
        chunk = await file.read(chunk_size)
        if not chunk:
            break
        content.extend(chunk)
        if len(content) > max_bytes:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File exceeds maximum allowed size of {max_bytes // (1024 * 1024)} MB.",
            )

    if len(content) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty.",
        )

    return bytes(content)


def downsample_if_needed(image_bgr: np.ndarray, max_dim: int = MAX_INFERENCE_IMAGE_DIM) -> np.ndarray:
    """Proportionally downsample oversized images to save memory on 512MB RAM instances."""
    h, w = image_bgr.shape[:2]
    if max(h, w) > max_dim:
        scale = max_dim / float(max(h, w))
        new_w, new_h = int(w * scale), int(h * scale)
        return cv2.resize(image_bgr, (new_w, new_h), interpolation=cv2.INTER_AREA)
    return image_bgr


def draw_boxes(image_bgr: np.ndarray, detections: list) -> np.ndarray:
    """Draw bounding boxes with labels and confidence tags on an OpenCV image."""
    for det in detections:
        x1, y1, x2, y2 = det["bbox"]
        label = det["class"]
        conf = det["confidence"]
        color = CLASS_COLORS.get(label, (200, 200, 200))

        # Bounding box
        cv2.rectangle(image_bgr, (x1, y1), (x2, y2), color, 2)

        # Label background
        label_text = f"{label} {conf:.0%}"
        (tw, th), _ = cv2.getTextSize(label_text, cv2.FONT_HERSHEY_SIMPLEX, 0.52, 1)
        y_label_top = max(0, y1 - th - 8)
        cv2.rectangle(image_bgr, (x1, y_label_top), (x1 + tw + 6, y1), color, -1)

        # Label text
        cv2.putText(
            image_bgr,
            label_text,
            (x1 + 3, max(th + 2, y1 - 4)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.52,
            (255, 255, 255),
            1,
            cv2.LINE_AA,
        )
    return image_bgr


def encode_image_base64(image_bgr: np.ndarray) -> str:
    """Encode an OpenCV BGR image to a base64 PNG string."""
    success, buf = cv2.imencode(".png", image_bgr)
    if not success:
        raise ValueError("Failed to encode processed image to PNG format.")
    return base64.b64encode(buf.tobytes()).decode("utf-8")


def run_inference(image_bgr: np.ndarray) -> tuple[list, dict]:
    """Run YOLOv8 inference and return detections + category counts."""
    if MODEL is None:
        raise RuntimeError("Model is not initialized.")

    results = MODEL.predict(image_bgr, conf=0.25, iou=0.45, verbose=False)[0]

    detections = []
    counts = {v: 0 for v in VEHICLE_CLASSES.values()}

    for box in results.boxes:
        cls_id = int(box.cls[0].item())
        if cls_id not in VEHICLE_CLASSES:
            continue

        label = VEHICLE_CLASSES[cls_id]
        conf = float(box.conf[0].item())
        x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())

        detections.append({
            "class": label,
            "confidence": round(conf, 4),
            "bbox": [x1, y1, x2, y2],
        })
        counts[label] += 1

    return detections, counts


# ── API Endpoints ─────────────────────────────────────────────────────────────

@app.get("/", summary="Root metadata")
async def root():
    """Service status and documentation entry point."""
    return {
        "service": "RoadGuard AI — Vehicle Detection API",
        "version": "1.0.0",
        "status": "online",
        "docs_url": "/docs",
        "health_check": "/health",
    }


@app.get("/health", summary="Health check endpoint")
async def health():
    """Production health-check endpoint for Render / monitoring services."""
    uptime_sec = round(time.time() - START_TIME, 1)
    is_healthy = MODEL is not None

    payload = {
        "status": "online" if is_healthy else "degraded",
        "uptime_seconds": uptime_sec,
        "model_loaded": is_healthy,
        "model_name": "YOLOv8n",
        "vehicle_classes": list(VEHICLE_CLASSES.values()),
    }

    if not is_healthy and MODEL_LOAD_ERROR:
        payload["error"] = MODEL_LOAD_ERROR

    status_code = status.HTTP_200_OK if is_healthy else status.HTTP_503_SERVICE_UNAVAILABLE
    return JSONResponse(status_code=status_code, content=payload)


@app.post("/detect/image", summary="Detect vehicles in an uploaded image")
async def detect_image(file: UploadFile = File(...)):
    """Accepts image upload, runs YOLOv8n vehicle detection, returns annotated base64 and metrics."""
    if MODEL is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Model not loaded. {MODEL_LOAD_ERROR or 'Please try again shortly.'}",
        )

    # Validate content type or filename extension
    valid_exts = (".jpg", ".jpeg", ".png", ".bmp", ".webp")
    content_type = file.content_type or ""
    filename = (file.filename or "").lower()

    if not (content_type.startswith("image/") or filename.endswith(valid_exts)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type '{content_type}'. Supported image formats: JPG, PNG, WEBP, BMP.",
        )

    try:
        # Read file with size check
        raw_bytes = await read_file_safely(file, MAX_IMAGE_SIZE_BYTES)

        # Decode image
        arr = np.frombuffer(raw_bytes, np.uint8)
        image_bgr = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        if image_bgr is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unable to decode image. Ensure file is a valid, uncorrupted image.",
            )

        # Downsample if image is extremely large to prevent OOM
        image_bgr = downsample_if_needed(image_bgr)
        h, w = image_bgr.shape[:2]

        # Run inference
        detections, counts = run_inference(image_bgr)

        # Annotate image
        annotated = draw_boxes(image_bgr.copy(), detections)
        img_b64 = encode_image_base64(annotated)

        return JSONResponse({
            "status": "success",
            "filename": file.filename,
            "image_width": w,
            "image_height": h,
            "total_vehicles": sum(counts.values()),
            "counts_by_class": counts,
            "detections": detections,
            "annotated_image": img_b64,
        })

    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Image detection error: {exc}\n{traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Detection processing failed: {exc}",
        )


@app.post("/detect/video", summary="Detect vehicles in an uploaded video")
async def detect_video(file: UploadFile = File(...)):
    """Accepts video upload, samples frames at intervals, runs YOLOv8n, and returns time-series analytics."""
    if MODEL is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Model not loaded. {MODEL_LOAD_ERROR or 'Please try again shortly.'}",
        )

    valid_video_exts = (".mp4", ".avi", ".mov", ".mkv", ".webm")
    content_type = file.content_type or ""
    filename = (file.filename or "").lower()

    if not (content_type.startswith("video/") or filename.endswith(valid_video_exts)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type '{content_type}'. Supported video formats: MP4, AVI, MOV, MKV, WEBM.",
        )

    tmp_path: Optional[str] = None
    cap: Optional[cv2.VideoCapture] = None

    try:
        raw_bytes = await read_file_safely(file, MAX_VIDEO_SIZE_BYTES)

        # Write to temporary file with auto cleanup
        suffix = Path(filename).suffix or ".mp4"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(raw_bytes)
            tmp_path = tmp.name

        cap = cv2.VideoCapture(tmp_path)
        if not cap.isOpened():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unable to open video stream. Codec may be unsupported.",
            )

        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

        if total_frames <= 0 or width <= 0 or height <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Corrupted or zero-frame video file provided.",
            )

        # Calculate sampling step to cap analyzed frames at MAX_VIDEO_SAMPLED_FRAMES
        step = max(1, total_frames // MAX_VIDEO_SAMPLED_FRAMES)

        cumulative_counts = {"car": 0, "motorcycle": 0, "bus": 0, "truck": 0}
        frame_data: List[Dict[str, Any]] = []
        thumbnail_b64: Optional[str] = None

        frame_idx = 0
        sampled_count = 0

        while True:
            ret, frame = cap.read()
            if not ret or sampled_count >= MAX_VIDEO_SAMPLED_FRAMES:
                break

            if frame_idx % step == 0:
                # Downsample frame if oversized
                frame_for_infer = downsample_if_needed(frame)
                detections, counts = run_inference(frame_for_infer)

                for det in detections:
                    cumulative_counts[det["class"]] += 1

                frame_data.append({
                    "frame": frame_idx,
                    "time_sec": round(frame_idx / fps, 2),
                    "vehicle_count": sum(counts.values()),
                    "counts": dict(counts),
                })

                if sampled_count == 0:
                    annotated = draw_boxes(frame_for_infer.copy(), detections)
                    thumbnail_b64 = encode_image_base64(annotated)

                sampled_count += 1

            frame_idx += 1

        return JSONResponse({
            "status": "success",
            "filename": file.filename,
            "video_width": width,
            "video_height": height,
            "total_frames": total_frames,
            "fps": round(fps, 2),
            "frames_analyzed": sampled_count,
            "total_vehicles_detected": sum(cumulative_counts.values()),
            "counts_by_class": cumulative_counts,
            "frame_data": frame_data,
            "thumbnail": thumbnail_b64,
        })

    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Video detection error: {exc}\n{traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Video detection processing failed: {exc}",
        )
    finally:
        # Guarantee resource release and disk cleanup
        if cap is not None:
            cap.release()
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.unlink(tmp_path)
            except OSError:
                pass
