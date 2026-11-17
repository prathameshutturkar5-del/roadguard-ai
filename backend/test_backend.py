"""
RoadGuard AI — Backend Automated Build & Verification Suite
Tests the FastAPI application, YOLOv8 model loading, inference engine,
and API route handlers with zero external test dependencies.
"""

import sys
import io
import asyncio
from pathlib import Path
from PIL import Image
import numpy as np
import cv2

# Ensure backend directory is in path
sys.path.insert(0, str(Path(__file__).parent))

import main


async def run_suite():
    print("\n" + "=" * 65)
    print("  RoadGuard AI Backend — Build & System Verification")
    print("=" * 65 + "\n")

    # Step 1: Lifespan Startup & Model Loading
    print("1. Initializing Lifespan & Loading YOLOv8n Model...")
    async with main.lifespan(main.app):
        assert main.MODEL is not None, "Model failed to load!"
        print("   ✓ YOLOv8n model initialized & graph compiled successfully.")

        # Step 2: Test /health endpoint
        print("\n2. Testing /health endpoint...")
        health_resp = await main.health()
        assert health_resp.status_code == 200, f"Expected 200, got {health_resp.status_code}"
        import json
        health_data = json.loads(health_resp.body.decode())
        assert health_data["status"] == "online"
        assert health_data["model_loaded"] is True
        print(f"   ✓ Health check online: {health_data['model_name']} | classes: {health_data['vehicle_classes']}")

        # Step 3: Test / root metadata endpoint
        print("\n3. Testing / root metadata endpoint...")
        root_data = await main.root()
        assert root_data["status"] == "online"
        print(f"   ✓ Root metadata verified: {root_data['service']} v{root_data['version']}")

        # Step 4: Test Neural Inference Engine directly
        print("\n4. Testing Neural Network Inference Engine on synthetic frame...")
        test_frame = np.full((360, 640, 3), 120, dtype=np.uint8)
        detections, counts = main.run_inference(test_frame)
        assert isinstance(detections, list)
        assert isinstance(counts, dict)
        for cat in ["car", "motorcycle", "bus", "truck"]:
            assert cat in counts
        print(f"   ✓ Inference engine executed cleanly. Class bins verified: {list(counts.keys())}")

        # Step 5: Test /detect/image endpoint with a real encoded JPEG
        print("\n5. Testing /detect/image endpoint with multipart upload...")
        img = Image.new("RGB", (400, 300), color=(60, 90, 140))
        buf = io.BytesIO()
        img.save(buf, format="JPEG")
        buf.seek(0)

        upload_file = main.UploadFile(
            filename="traffic_sample.jpg",
            file=buf,
            headers={"content-type": "image/jpeg"},
        )
        detect_resp = await main.detect_image(upload_file)
        assert detect_resp.status_code == 200
        detect_data = json.loads(detect_resp.body.decode())
        assert detect_data["status"] == "success"
        assert detect_data["image_width"] == 400
        assert detect_data["image_height"] == 300
        assert "annotated_image" in detect_data
        assert len(detect_data["annotated_image"]) > 100
        print(f"   ✓ Image detection pipeline passed! Encoded PNG output: {len(detect_data['annotated_image'])} chars")

        # Step 6: Test Error Handling for Invalid Inputs
        print("\n6. Testing Input Validation & Error Handling...")
        txt_buf = io.BytesIO(b"Non-image plaintext content")
        bad_upload = main.UploadFile(
            filename="invalid.txt",
            file=txt_buf,
            headers={"content-type": "text/plain"},
        )
        try:
            await main.detect_image(bad_upload)
            assert False, "Should have raised HTTPException 400"
        except main.HTTPException as exc:
            assert exc.status_code == 400
            print(f"   ✓ Invalid file rejection verified (HTTP {exc.status_code}: {exc.detail})")

    print("\n" + "=" * 65)
    print("  BUILD VERIFICATION COMPLETE: ALL 6/6 SUITES PASSED (100%)")
    print("=" * 65 + "\n")


if __name__ == "__main__":
    asyncio.run(run_suite())
