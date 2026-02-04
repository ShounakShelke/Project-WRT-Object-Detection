# Run Guide: Project WRT Object Detection

A real-time object detection system for retail items using YOLOv8 and React.

---

## 1. Setup Python Virtual Environment

### Windows (PowerShell)
```powershell
# Navigate to project folder
cd skipq-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# If you get an execution policy error, run this first:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Install dependencies
pip install -r requirements.txt
```

### Windows (Command Prompt)
```cmd
cd skipq-backend
python -m venv venv
venv\Scripts\activate.bat
pip install -r requirements.txt
```

### Linux/macOS
```bash
cd skipq-backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## 2. Start ML Backend

```powershell
# Make sure venv is activated
cd skipq-backend
.\venv\Scripts\Activate.ps1

# Run the backend server
python main.py
```

> **Note:** First run will download the YOLOv8 model (~6MB).

Backend runs on: `http://localhost:8000`

---

## 3. Start Frontend App

```powershell
# Open a new terminal
cd skipq-frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

Frontend runs on: `http://localhost:5173`

- Open the URL in your browser
- Allow camera permissions when prompted

---

## 4. Custom Model Training (Optional)

To train the model on your own dataset:

### Step 1: Prepare Dataset
```powershell
# Activate venv
cd skipq-backend
.\venv\Scripts\Activate.ps1

# Run dataset preparation
python ml/prepare_dataset.py
```

### Step 2: Train Model
```powershell
python ml/train_yolo.py
```

Training will create a model at: `skipq-backend/ml/runs/skipq_retail/weights/best.pt`

### Step 3: Validate Model
```powershell
python ml/train_yolo.py validate
```

### Step 4: Export Model (Optional)
```powershell
python ml/train_yolo.py export
```

---

## Dataset Structure

Place your training data in `skipq-backend/ml/dataset/`:

```
dataset/
├── images/
│   ├── train/    # Training images (80-90%)
│   └── val/      # Validation images (10-20%)
├── labels/
│   ├── train/    # YOLO format .txt labels
│   └── val/      # YOLO format .txt labels
└── data.yaml     # Dataset configuration
```

### Label Format (YOLO)
Each `.txt` file should have one line per object:
```
class_id x_center y_center width height
```
All values are normalized (0-1).

---

## Current Classes

| ID | Class Name    |
|----|---------------|
| 0  | eraser        |
| 1  | scale         |
| 2  | pencil        |
| 3  | sharpener     |
| 4  | grocery_item  |

---

## Troubleshooting

### Virtual Environment Issues
```powershell
# If venv activation fails on Windows
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port Already in Use
```powershell
# Kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### CUDA/GPU Issues
```powershell
# Install CUDA-enabled PyTorch (optional, for faster training)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `python -m venv venv` | Create virtual environment |
| `.\venv\Scripts\Activate.ps1` | Activate venv (PowerShell) |
| `deactivate` | Deactivate venv |
| `python main.py` | Start backend |
| `npm run dev` | Start frontend |
| `python ml/train_yolo.py` | Train model |