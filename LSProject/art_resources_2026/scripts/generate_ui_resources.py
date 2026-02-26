# -*- coding: utf-8 -*-
"""
Auto-generate UI resources for LianSe project
"""

import os
import time
from pathlib import Path
from PIL import Image

# Project paths
PROJECT_ROOT = Path("E:/Project/LianSe/LSProject")
ART_ROOT = PROJECT_ROOT / "art_resources_2026"
DOWNLOAD_DIR = Path("C:/Users/yu.zhang01/Downloads")
OUTPUT_DIR = ART_ROOT / "ui"

# Ensure directories exist
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def remove_white_background(image_path, output_path, threshold=240):
    """Remove white background and generate transparent PNG"""
    img = Image.open(image_path)
    img = img.convert("RGBA")
    
    datas = img.getdata()
    new_data = []
    
    for item in datas:
        # If RGB all > threshold, set to transparent
        if item[0] > threshold and item[1] > threshold and item[2] > threshold:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Processed: {output_path.name}")
    return output_path

def resize_and_center(image_path, output_path, target_size=(400, 100)):
    """Resize and center image"""
    img = Image.open(image_path)
    
    # Create transparent background
    new_img = Image.new("RGBA", target_size, (255, 255, 255, 0))
    
    # Calculate scale
    img.thumbnail(target_size, Image.Resampling.LANCZOS)
    
    # Center paste
    x = (target_size[0] - img.width) // 2
    y = (target_size[1] - img.height) // 2
    new_img.paste(img, (x, y), img if img.mode == 'RGBA' else None)
    
    new_img.save(output_path, "PNG")
    print(f"Resized: {output_path.name}")
    return output_path

def process_button(raw_file, output_name, size=(256, 80)):
    """Process button image: remove background + resize"""
    # Step 1: Remove white background
    temp_path = OUTPUT_DIR / f"temp_{output_name}"
    remove_white_background(raw_file, temp_path)
    
    # Step 2: Resize and center
    final_path = OUTPUT_DIR / "main_menu" / output_name
    final_path.parent.mkdir(parents=True, exist_ok=True)
    resize_and_center(temp_path, final_path, size)
    
    # Cleanup temp file
    temp_path.unlink()
    
    return final_path

def find_latest_download(pattern="*.jpg", max_age_seconds=300):
    """Find latest downloaded file"""
    files = list(DOWNLOAD_DIR.glob(pattern))
    if not files:
        return None
    
    # Sort by modification time
    files.sort(key=lambda f: f.stat().st_mtime, reverse=True)
    latest = files[0]
    
    # Check if file is recent
    age = time.time() - latest.stat().st_mtime
    if age > max_age_seconds:
        return None
    
    return latest

# Main process
if __name__ == "__main__":
    print("Starting UI resource generation...")
    
    # Find latest download
    print("Looking for downloaded file...")
    downloaded_file = find_latest_download()
    
    if downloaded_file:
        print(f"Found: {downloaded_file.name}")
        
        # Process button
        result = process_button(downloaded_file, "btn_start.png", (256, 80))
        
        print(f"Done! Output: {result}")
    else:
        print("No recent download found in Downloads folder")
