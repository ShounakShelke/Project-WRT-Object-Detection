# Run Guide: Project WRT Pro Dashboard

Deploying the BMW M-Performance inspired object detection suite.

---

## 1. Engine Initialization (Backend)

The backend server manages the YOLOv8-Pro inference engine and provides real-time detection telemetry.

### Windows (PowerShell)
```powershell
# Navigate to backend folder
cd backend

# Create virtual environment (if not already created)
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies (If you see timeout errors, use the --default-timeout flag)
pip install --default-timeout=1000 -r requirements.txt
```

**Network Access:**
The server starts on http://localhost:5000. 
*Note: The first run may download the model weights (YOLOv8 Medium/Nano) if not present.*

---

## 2. Cockpit Deployment (Frontend)

The frontend is a premium React dashboard utilizing the Project WRT Drive architecture.

```powershell
# Open a new terminal
cd frontend

# Install Node dependencies (First time only)
npm install

# Deploy the Dashboard
npm run dev
```

**Accessing the Suite:**
The dashboard will be available at http://localhost:8080 (or similar, check terminal output).
- Ensure your browser has Camera Permissions enabled.
- Click ENGINE START to begin real-time sector scanning.

---

## 3. Operational Telemetry

### Detection Logic
- Sector Identification Log: Displays detected objects with probability percentage.
- HUD (Live Scan): Overlays bounding boxes with M-Performance Cyan accents.
- Entity Counter: Real-time count of active signatures in view.

### Engine Priorities
The system automatically selects the best available engine:
1. ml/runs/skipq_pro_plus/best.pt (Custom Pro Accuracy)
2. yolov8m.pt (Global High Precision)
3. yolov8n.pt (Emergency Fallback)

---

## Troubleshooting

### Server Port Conflicts:
If port 5000 or 8080 is blocked:
```powershell
# Kill existing processes (Windows)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force
```

### Camera Access:
Ensure no other application (Zoom, Teams, etc.) is using your webcam.

---

**Project WRT Pro** | Engineering Performance into Vision
Made by Shounak Shelke @2026