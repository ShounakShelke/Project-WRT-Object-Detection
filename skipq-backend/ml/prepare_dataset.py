"""
Dataset Preparation Script for WRT Object Detection
Combines Stationery and Grocery Store datasets for YOLOv8 training
"""

import os
import shutil
import random
import yaml
from pathlib import Path

# Configuration
PROJECT_ROOT = Path(__file__).parent
DATASET_DIR = PROJECT_ROOT / "dataset"
SOURCE_STATIONERY = Path("c:/Users/HP/Desktop/Project CO1 FlashCart/8w0ol3d7d1wsqbmn1l1odk/Stationery dataset/Stationery dataset")
SOURCE_GROCERY_TRAIN = Path("c:/Users/HP/Desktop/Project CO1 FlashCart/8w0ol3d7d1wsqbmn1l1odk/images.cv_8w0ol3d7d1wsqbmn1l1odk/data/train/grocery_store")
SOURCE_GROCERY_VAL = Path("c:/Users/HP/Desktop/Project CO1 FlashCart/8w0ol3d7d1wsqbmn1l1odk/images.cv_8w0ol3d7d1wsqbmn1l1odk/data/val/grocery_store")

# Train/Val split ratio
TRAIN_RATIO = 0.85

# Class mapping for stationery dataset
# Original: 0: Eraser, 1: Scale, 2: Pencil, 3: Sharpener
# We'll add grocery_item as class 4
STATIONERY_CLASSES = {
    0: "eraser",
    1: "scale",
    2: "pencil",
    3: "sharpener"
}

# Combined classes for the final model
COMBINED_CLASSES = {
    0: "eraser",
    1: "scale",
    2: "pencil",
    3: "sharpener",
    4: "grocery_item"  # General grocery class for unannotated images
}

def create_directory_structure():
    """Create the required directory structure"""
    dirs = [
        DATASET_DIR / "images" / "train",
        DATASET_DIR / "images" / "val",
        DATASET_DIR / "labels" / "train",
        DATASET_DIR / "labels" / "val"
    ]
    for d in dirs:
        d.mkdir(parents=True, exist_ok=True)
    print("Directory structure created.")

def copy_stationery_dataset():
    """Copy and split stationery dataset into train/val"""
    print("\nProcessing Stationery Dataset...")
    
    # Get all image files
    image_files = []
    for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp']:
        image_files.extend(list(SOURCE_STATIONERY.glob(ext)))
    
    print(f"  Found {len(image_files)} stationery images")
    
    # Shuffle and split
    random.seed(42)
    random.shuffle(image_files)
    
    split_idx = int(len(image_files) * TRAIN_RATIO)
    train_files = image_files[:split_idx]
    val_files = image_files[split_idx:]
    
    print(f"  Train: {len(train_files)}, Val: {len(val_files)}")
    
    # Copy files
    copied_train = 0
    copied_val = 0
    
    for img_path in train_files:
        label_path = img_path.with_suffix('.txt')
        if label_path.exists():
            # Copy image
            dest_img = DATASET_DIR / "images" / "train" / f"stat_{img_path.name}"
            shutil.copy2(img_path, dest_img)
            
            # Copy label
            dest_label = DATASET_DIR / "labels" / "train" / f"stat_{label_path.name}"
            shutil.copy2(label_path, dest_label)
            copied_train += 1
    
    for img_path in val_files:
        label_path = img_path.with_suffix('.txt')
        if label_path.exists():
            # Copy image
            dest_img = DATASET_DIR / "images" / "val" / f"stat_{img_path.name}"
            shutil.copy2(img_path, dest_img)
            
            # Copy label
            dest_label = DATASET_DIR / "labels" / "val" / f"stat_{label_path.name}"
            shutil.copy2(label_path, dest_label)
            copied_val += 1
    
    print(f"  Copied {copied_train} training pairs, {copied_val} validation pairs")
    return copied_train, copied_val

def create_pseudo_labels_for_grocery(image_path, output_label_path):
    """
    Create a pseudo label for grocery images.
    Since these don't have annotations, we create a full-image bounding box.
    This is a placeholder approach - for production, proper annotation is recommended.
    """
    # Full image as grocery_item (class 4)
    # Format: class_id x_center y_center width height (normalized 0-1)
    # Full image: 0.5 0.5 1.0 1.0
    with open(output_label_path, 'w') as f:
        f.write("4 0.5 0.5 0.9 0.9\n")  # Slightly smaller than full image

def copy_grocery_dataset():
    """Copy grocery images with pseudo-labels"""
    print("\nProcessing Grocery Store Dataset...")
    
    # Get training images
    train_images = list(SOURCE_GROCERY_TRAIN.glob('*.jpg'))
    print(f"  Found {len(train_images)} grocery training images")
    
    # Limit to a reasonable number for balanced training
    random.seed(42)
    random.shuffle(train_images)
    max_grocery_train = min(200, len(train_images))  # Limit for balance
    selected_train = train_images[:max_grocery_train]
    
    copied_train = 0
    for img_path in selected_train:
        # Copy image
        dest_img = DATASET_DIR / "images" / "train" / f"groc_{img_path.name}"
        shutil.copy2(img_path, dest_img)
        
        # Create pseudo-label
        dest_label = DATASET_DIR / "labels" / "train" / f"groc_{img_path.stem}.txt"
        create_pseudo_labels_for_grocery(img_path, dest_label)
        copied_train += 1
    
    # Get validation images
    if SOURCE_GROCERY_VAL.exists():
        val_images = list(SOURCE_GROCERY_VAL.glob('*.jpg'))
    else:
        # Use some training images for validation
        val_images = train_images[max_grocery_train:max_grocery_train + 50]
    
    max_grocery_val = min(50, len(val_images))
    selected_val = val_images[:max_grocery_val]
    
    copied_val = 0
    for img_path in selected_val:
        # Copy image
        dest_img = DATASET_DIR / "images" / "val" / f"groc_{img_path.name}"
        shutil.copy2(img_path, dest_img)
        
        # Create pseudo-label
        dest_label = DATASET_DIR / "labels" / "val" / f"groc_{img_path.stem}.txt"
        create_pseudo_labels_for_grocery(img_path, dest_label)
        copied_val += 1
    
    print(f"  Copied {copied_train} training images, {copied_val} validation images (with pseudo-labels)")
    return copied_train, copied_val

def create_data_yaml():
    """Create the data.yaml configuration file for YOLOv8"""
    data_config = {
        'path': str(DATASET_DIR.absolute()),
        'train': 'images/train',
        'val': 'images/val',
        'names': COMBINED_CLASSES,
        'nc': len(COMBINED_CLASSES)
    }
    
    yaml_path = DATASET_DIR / "data.yaml"
    with open(yaml_path, 'w') as f:
        yaml.dump(data_config, f, default_flow_style=False, sort_keys=False)
    
    print(f"\nCreated data.yaml at: {yaml_path}")
    print(f"Classes: {COMBINED_CLASSES}")
    return yaml_path

def verify_dataset():
    """Verify the dataset structure"""
    print("\n--- Dataset Verification ---")
    
    train_images = list((DATASET_DIR / "images" / "train").glob('*'))
    train_labels = list((DATASET_DIR / "labels" / "train").glob('*.txt'))
    val_images = list((DATASET_DIR / "images" / "val").glob('*'))
    val_labels = list((DATASET_DIR / "labels" / "val").glob('*.txt'))
    
    print(f"Training images: {len(train_images)}")
    print(f"Training labels: {len(train_labels)}")
    print(f"Validation images: {len(val_images)}")
    print(f"Validation labels: {len(val_labels)}")
    
    # Check for missing labels
    train_img_names = {f.stem for f in train_images}
    train_lbl_names = {f.stem for f in train_labels}
    missing_train = train_img_names - train_lbl_names
    
    if missing_train:
        print(f"Warning: {len(missing_train)} training images missing labels")
    else:
        print("All training images have corresponding labels.")
    
    return len(train_images), len(val_images)

def main():
    print("=" * 60)
    print("SkipQ Dataset Preparation")
    print("=" * 60)
    
    # Create directory structure
    create_directory_structure()
    
    # Process stationery dataset
    stat_train, stat_val = copy_stationery_dataset()
    
    # Process grocery dataset
    groc_train, groc_val = copy_grocery_dataset()
    
    # Create data.yaml
    yaml_path = create_data_yaml()
    
    # Verify
    total_train, total_val = verify_dataset()
    
    print("\n" + "=" * 60)
    print("Dataset Preparation Complete!")
    print("=" * 60)
    print(f"\nTotal Training Samples: {total_train}")
    print(f"Total Validation Samples: {total_val}")
    print(f"\nData YAML: {yaml_path}")
    print("\nNext step: Run training with:")
    print("  python train_yolo.py")

if __name__ == "__main__":
    main()
