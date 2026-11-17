#!/usr/bin/env bash
# RoadGuard AI — Backend Production Start Script
PORT="${PORT:-8000}"
echo "Starting RoadGuard AI API on port ${PORT}..."
exec uvicorn main:app --host 0.0.0.0 --port "${PORT}"
