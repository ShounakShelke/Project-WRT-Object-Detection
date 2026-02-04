# Project Structure: SkipQ

This document outlines the file architecture for the **SkipQ** Smart Checkout System.

```text
Project CO1 FlashCart/
├── README.md               # Main project documentation
├── PROJECT_STRUCTURE.md    # This file
├── RUN_GUIDE.md            # Setup and execution instructions
│
├── skipq-backend/          # Python Flask ML Server
│   ├── main.py             # Entry point: Flask App & API Routes
│   ├── requirements.txt    # Python dependencies
│   ├── uploads/            # Temporary storage for uploaded frames (auto-generated)
│   └── ml/                 # Machine Learning resources
│       ├── train_yolo.py   # Script to train custom YOLOv8 model
│       ├── dataset/        # (User Created) Training images & labels
│       └── models/         # Directory for saving trained .pt weights
│
└── skipq-frontend/         # React TypeScript Client
    ├── index.html          # HTML entry point
    ├── package.json        # Node dependencies & scripts
    ├── vite.config.ts      # Vite configuration
    ├── tailwind.config.ts  # Tailwind CSS configuration
    ├── public/             # Static assets (favicons, etc.)
    └── src/
        ├── main.tsx        # React entry point
        ├── App.tsx         # Main Routing component
        ├── index.css       # Global styles & Tailwind imports
        │
        ├── components/     # Reusable UI Components
        │   ├── layout/     # Layout wrappers (RoleLayout)
        │   ├── ui/         # Shadcn/UI primitive components
        │   ├── guard/      # Guard-specific components (Camera, Lists)
        │   └── customer/   # Customer-specific components (Cart, Scanner)
        │
        ├── pages/          # Major Route Views
        │   ├── Index.tsx           # Landing Page
        │   ├── CustomerPortal.tsx  # Shopper Interface
        │   ├── GuardPortal.tsx     # Security Interface
        │   └── AdminDashboard.tsx  # Manager Interface
        │
        ├── services/       # API & Logic Layers
        │   ├── api.ts              # Axios HTTP client for Backend
        │   └── mockData.ts         # fallback/demo data
        │
        └── types/          # TypeScript interfaces
```
