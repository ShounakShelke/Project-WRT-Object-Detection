"""
YOLOv8 Training Script for WRT Object Detection
Trains a custom model on stationery + grocery items
"""

from ultralytics import YOLO
from pathlib import Path
import os

def train():
    """Train YOLOv8 model on custom dataset"""
    
    # Paths
    project_root = Path(__file__).parent
    data_yaml = project_root / "dataset" / "data.yaml"
    
    # Check if dataset exists
    if not data_yaml.exists():
        print("Dataset not found! Run prepare_dataset.py first.")
        print("python prepare_dataset.py")
        return
    
    print("=" * 60)
    print("SkipQ YOLOv8 Training")
    print("=" * 60)
    print(f"\nData YAML: {data_yaml}")
    
    # Load pre-trained YOLOv8 nano model (smallest, fastest)
    model = YOLO("yolov8n.pt")
    
    # Training configuration
    print("\nStarting training...")
    print("This may take 30-60 minutes depending on your hardware.\n")
    
    results = model.train(
        data=str(data_yaml),
        epochs=50,                  # Number of training epochs
        imgsz=640,                  # Image size
        batch=16,                   # Batch size (reduce if GPU memory issues)
        patience=10,                # Early stopping patience
        save=True,                  # Save checkpoints
        project=str(project_root / "runs"),
        name="skipq_retail",
        exist_ok=True,              # Overwrite existing runs
        pretrained=True,            # Use pretrained weights
        optimizer="auto",           # Optimizer selection
        verbose=True,               # Verbose output
        seed=42,                    # Reproducibility
        val=True,                   # Validate during training
        plots=True,                 # Generate training plots
    )
    
    # Get best model path
    best_model = project_root / "runs" / "skipq_retail" / "weights" / "best.pt"
    
    print("\n" + "=" * 60)
    print("Training Complete!")
    print("=" * 60)
    print(f"\nBest model saved to: {best_model}")
    print(f"\nTo use this model:")
    print(f'  model = YOLO("{best_model}")')
    print(f'  results = model.predict("image.jpg")')
    
    # Copy best model to a convenient location
    final_model = project_root / "best_skipq_model.pt"
    if best_model.exists():
        import shutil
        shutil.copy2(best_model, final_model)
        print(f"\nModel also copied to: {final_model}")
    
    return results

def validate():
    """Validate the trained model"""
    project_root = Path(__file__).parent
    model_path = project_root / "runs" / "skipq_retail" / "weights" / "best.pt"
    data_yaml = project_root / "dataset" / "data.yaml"
    
    if not model_path.exists():
        print("Trained model not found! Run training first.")
        return
    
    model = YOLO(str(model_path))
    results = model.val(data=str(data_yaml))
    
    print("\n--- Validation Results ---")
    print(f"mAP50: {results.box.map50:.4f}")
    print(f"mAP50-95: {results.box.map:.4f}")
    
    return results

def export_model():
    """Export model to different formats"""
    project_root = Path(__file__).parent
    model_path = project_root / "runs" / "skipq_retail" / "weights" / "best.pt"
    
    if not model_path.exists():
        print("Trained model not found! Run training first.")
        return
    
    model = YOLO(str(model_path))
    
    # Export to ONNX for web deployment
    model.export(format="onnx", simplify=True)
    print("Exported to ONNX format")
    
    # Export to TorchScript
    model.export(format="torchscript")
    print("Exported to TorchScript format")

if __name__ == '__main__':
    import sys
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "validate":
            validate()
        elif sys.argv[1] == "export":
            export_model()
        else:
            print("Usage: python train_yolo.py [validate|export]")
    else:
        train()
