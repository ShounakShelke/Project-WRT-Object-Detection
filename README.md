# Project WRT: Pro Object Detection Suite

A high-performance, real-time object detection cockpit inspired by BMW M-Performance aesthetics. Powered by YOLOv8 (Medium/Pro) and a sleek React-based dashboard.

## Features

- **M-Tech Cockpit UI**: A stunning automotive-inspired dashboard featuring high-contrast BMW M colors (Cyan, Navy, Red).
- **Pro-Accuracy Engine**: Multi-stage model loader prioritizing High-Accuracy custom weights (YOLOv8m) with robust fallbacks.
- **Universal Detection**: Full support for global object detection (80 classes) out of the box.
- **Live Sector Scanning**: Real-time HUD with digital crosshairs, latency tracking, and entity counters.
- **Performance Identification Log**: A dynamic sidebar for tracking detected entities with precision probability scoring.
- **Ultra-Low Latency**: Optimized inference pipeline for smooth 30+ FPS scanning.

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Shadcn/UI, Lucide-Icons.
- **Backend**: Flask (Python), Flask-CORS.
- **Computer Vision**: Ultralytics YOLOv8 (Medium/Nano), OpenCV (Inference Pipeline).

## Project Structure

```text
Project CO1 FlashCart/
├── frontend/             # BMW M-Performance Dashboard (React)
│   ├── src/
│   │   ├── pages/Index.tsx    # Main Cockpit Logic
│   │   └── components/ui/     # Premium UI primitives
│   └── tailwind.config.ts     # Racing Design Tokens
└── backend/              # Pro-Accuracy Flask Server 
    ├── main.py           # Core Execution Engine
    ├── requirements.txt  # Slim dependencies
    └── ml/               # Production Model weights
```

## Quick Execution
Refer **RUN_GUIDE.md**

## Operational Modes

| Mode | Engine | Status |
|------|--------|--------|
| **PRO+** | YOLOv8m (Custom) | Highest Precision |
| **BALANCED** | YOLOv8m (COCO) | Universal Scanner |
| **LITE** | YOLOv8n (COCO) | Maximum Speed |

---

Made by **Shounak Shelke** @2026

