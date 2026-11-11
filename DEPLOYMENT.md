# RoadGuard AI — Production Deployment Guide

This guide details how to deploy **RoadGuard AI** to production with:
- **Frontend:** [Vercel](https://vercel.com) (Vite + React SPA)
- **Backend:** [Render](https://render.com) (FastAPI + YOLOv8n AI Engine)
- **Source Control:** [GitHub](https://github.com)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────┐           ┌──────────────────────────────────┐
│         Vercel (Frontend)       │           │          Render (Backend)        │
│   https://your-app.vercel.app   │──CORS───▶ │ https://your-backend.onrender.com│
│                                 │           │   FastAPI + YOLOv8n Neural Net   │
└─────────────────────────────────┘           └──────────────────────────────────┘
```

---

## 📋 Step 1: Push Code to GitHub

1. Install **Git** if not already installed:
   ```powershell
   winget install Git.Git --accept-package-agreements --accept-source-agreements
   ```
2. In `c:\Users\prath\Downloads\roadguard-ai`:
   ```powershell
   git init
   git add .
   git commit -m "feat: complete RoadGuard AI with real YOLOv8 detection"
   ```
3. Create a new repository on [GitHub](https://github.com/new) named `roadguard-ai`.
4. Link and push your local branch:
   ```powershell
   git remote add origin https://github.com/<your-username>/roadguard-ai.git
   git branch -M main
   git push -u origin main
   ```

> **Note:** The `.gitignore` is already preconfigured to exclude `node_modules/`, `backend/venv/`, and `.env` files.

---

## 🚀 Step 2: Deploy Backend to Render

1. Log into [Render Dashboard](https://dashboard.render.com).
2. Click **New +** → **Web Service**.
3. Select **Build and deploy from a Git repository** and connect your `roadguard-ai` repository.
4. Configure the service settings:
   - **Name:** `roadguard-ai-api`
   - **Region:** Any (e.g. `Oregon (US West)` or closest to your users)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:**
     ```bash
     pip install --upgrade pip && pip install -r requirements.txt
     ```
   - **Start Command:**
     ```bash
     uvicorn main:app --host 0.0.0.0 --port $PORT
     ```
   - **Instance Type:** `Free`

5. **Environment Variables** (under *Advanced*):
   | Key | Recommended Value | Note |
   |---|---|---|
   | `PYTHON_VERSION` | `3.11.9` | Matches tested production Python |
   | `ALLOWED_ORIGINS` | `https://your-app.vercel.app` | Add your Vercel URL once generated |
   | `ALLOW_ORIGIN_REGEX` | `^https:\/\/.*\.vercel\.app$` | Automatically permits all Vercel preview/production domains |
   | `MAX_IMAGE_SIZE_BYTES` | `15728640` | 15 MB upload limit |
   | `MAX_VIDEO_SIZE_BYTES` | `52428800` | 50 MB upload limit |

6. Click **Create Web Service**.
7. Once deployed, verify your backend:
   ```bash
   curl https://<your-render-service>.onrender.com/health
   ```
   Expected response:
   ```json
   {
     "status": "online",
     "uptime_seconds": 12.4,
     "model_loaded": true,
     "model_name": "YOLOv8n",
     "vehicle_classes": ["car", "motorcycle", "bus", "truck"]
   }
   ```
   Copy your Render backend URL (e.g., `https://roadguard-ai-api.onrender.com`).

> **Tip:** Render free tier instances go to sleep after 15 minutes of inactivity and take ~30-50 seconds to wake up on the first request. The backend code includes an automatic warm-up step on startup to ensure inference is fast as soon as the container boots.

---

## ⚡ Step 3: Deploy Frontend to Vercel

1. Log into [Vercel](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import your `roadguard-ai` GitHub repository.
4. Configure the project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `./` (Leave as root)
   - **Build Command:** `pnpm build` or `npm run build`
   - **Output Directory:** `dist`
5. **Environment Variables**:
   Add the following environment variable:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** `https://<your-render-service>.onrender.com` (your Render URL from Step 2, without a trailing slash)
6. Click **Deploy**.
7. Vercel will build the production bundle and assign a public URL (e.g. `https://roadguard-ai-xxx.vercel.app`).

---

## 🔗 Step 4: Final Linkage & CORS Verification

1. In your **Render Dashboard** for `roadguard-ai-api`:
   - Go to **Environment**.
   - Set `ALLOWED_ORIGINS` to include your exact production Vercel domain:
     ```
     https://your-app.vercel.app
     ```
   - *Note: Any `*.vercel.app` subdomain is also automatically accepted by the default `ALLOW_ORIGIN_REGEX`.*
2. Save changes (Render will trigger a zero-downtime redeploy).

---

## ✅ Step 5: Post-Deployment Verification Checklist

Once both services are deployed, test your production URLs:

- [ ] **Frontend Health:** Open `https://<your-vercel-domain>.vercel.app` in your browser. Dashboard KPIs, OpenStreetMap, and charts render cleanly.
- [ ] **Backend Health:** Navigate to `https://<your-render-domain>.onrender.com/health`. Verify `"model_loaded": true`.
- [ ] **AI Detection Connection:** Click **AI Detection** on the sidebar. Verify the status pill in the top-right shows a green **"Backend Online"** badge.
- [ ] **Image Inference Test:** Upload a traffic photo (`.jpg` or `.png`) and click **Run Detection**. Verify:
  - Bounding boxes are drawn on vehicles (cars, motorcycles, buses, trucks).
  - Vehicle count cards update with detected totals.
  - Confidence percentage list is displayed.
- [ ] **Video Inference Test:** Upload a short `.mp4` clip and click **Analyze Video**. Verify:
  - First frame thumbnail appears.
  - Vehicle count time-series AreaChart renders.
  - Frame-by-frame data table is populated.
- [ ] **Error Handling:** Attempt uploading a non-image file (e.g. `.txt`) or file exceeding size limit. Verify clean error alert is shown without crashing either service.

---

## 🛠️ Local Testing with Production Build

To preview the exact production build locally before pushing:

```powershell
# 1. Build frontend bundle
pnpm run build

# 2. Preview frontend production server
pnpm run preview --port 4173

# 3. In another terminal, start production-configured backend
cd backend
uvicorn main:app --host 127.0.0.1 --port 8000
```
Visit **http://localhost:4173** to test the production build locally.
