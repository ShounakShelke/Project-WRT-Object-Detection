# Project Structure: Project WRT Pro

A streamlined view of the High-Accuracy Detection Suite architecture.

```text
Project CO1 FlashCart/
├── README.md               # Performance Overview
├── RUN_GUIDE.md            # Deployment Instructions
├── PROJECT_STRUCTURE.md    # [THIS FILE]
│
├── frontend/               # BMW M-Performance Dashboard (React/Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   └── Index.tsx   # Core Cockpit Logic & HUD Controller
│   │   ├── components/ui/  # Premium Racing UI Primitives
│   │   └── lib/            # Utilities (Tailwind merge, etc.)
│   ├── tailwind.config.ts  # Design System Tokens
│   └── package.json        # Frontend Dependencies
│
└── backend/                # Pro-Accuracy Inference Server (Flask)
    ├── main.py             # Entry: Multi-Stage Engine Loader & API
    ├── requirements.txt    # Python Production Dependencies
    └── ml/                 # Machine Learning Assets
        └── yolov8n.pt      # Global Detection Weights (Emergency Fallback)
```

### Key Modules:
- **Cockpit (frontend)**: Handles the high-speed telemetry display and camera stream.
- **Inference Engine (backend)**: Real-time neural processing using YOLOv8 models.
- **HUD Layer**: Canvas-based SVG/2D overlays for identifying entities with M-Tech styling.

---
**Shounak Shelke @2026**
