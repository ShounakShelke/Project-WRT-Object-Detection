# Project WRT Object Detection

A real-time object detection system for retail/stationery items using YOLOv8 and React.

## Features

- **Real-time Detection**: Identifies objects (Pencil, Eraser, Scale, Sharpener, Grocery Items) instantly
- **Live Camera Feed**: Simple interface with camera integration
- **Live HUD**: Displays detected object names and confidence scores
- **Custom Training**: Train on your own dataset for specific items

## Tech Stack

- **Backend**: Python, FastAPI, YOLOv8 (Ultralytics)
- **Frontend**: React, TypeScript, Vite
- **ML Framework**: PyTorch, Ultralytics

## Quick Start
Refer **RUN_GUIDE.md**

## Project Structure

```
Project WRT Object Detection/
├── skipq-backend/
│   ├── main.py              # FastAPI server
│   ├── requirements.txt     # Python dependencies
│   └── ml/
│       ├── prepare_dataset.py   # Dataset preparation
│       ├── train_yolo.py        # Model training
│       └── dataset/             # Training data
├── skipq-frontend/
│   ├── src/
│   │   └── components/
│   │       └── SimpleDetector.tsx
│   └── package.json
├── README.md
└── RUN_GUIDE.md             # Detailed setup instructions
```

## Custom Training

See [RUN_GUIDE.md](./RUN_GUIDE.md) for detailed training instructions.

```powershell
# Quick training steps
cd skipq-backend
.\venv\Scripts\Activate.ps1
python ml/prepare_dataset.py
python ml/train_yolo.py
```

## Supported Classes

| ID | Class        |
|----|--------------|
| 0  | Eraser       |
| 1  | Scale        |
| 2  | Pencil       |
| 3  | Sharpener    |
| 4  | Grocery Item |

## License

Apache 2.0 License


Made By Shounak Shelke @2026 
