# -*- coding: utf-8 -*-
"""
Complete UI Resource Generation Pipeline
Downloads from Bing and processes automatically
"""

import os
import time
from pathlib import Path
from PIL import Image
import urllib.request

# Configuration
PROJECT_ROOT = Path("E:/Project/LianSe/LSProject")
ART_ROOT = PROJECT_ROOT / "art_resources_2026"
OUTPUT_DIR = ART_ROOT / "ui" / "main_menu"

# Ensure output directory exists
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Button configuration
BUTTONS = [
    ("btn_start.png", "开始游戏", (256, 80)),
    ("btn_leaderboard.png", "排行榜", (256, 80)),
    ("btn_settings.png", "设置", (256, 80)),
    ("btn_exit.png", "退出", (256, 80)),
]

def remove_white_background(img, threshold=240):
    """Remove white background from image"""
    img = img.convert("RGBA")
    datas = img.getdata()
    new_data = []
    
    for item in datas:
        if item[0] > threshold and item[1] > threshold and item[2] > threshold:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    
    img.putdata(new_data)
    return img

def split_vertical_buttons(img, num_buttons=4):
    """Split vertically arranged buttons"""
    width, height = img.size
    button_height = height // num_buttons
    buttons = []
    
    for i in range(num_buttons):
        top = i * button_height
        bottom = (i + 1) * button_height
        button = img.crop((0, top, width, bottom))
        buttons.append(button)
    
    return buttons

def resize_and_center(img, target_size):
    """Resize and center on transparent background"""
    new_img = Image.new("RGBA", target_size, (255, 255, 255, 0))
    img.thumbnail(target_size, Image.Resampling.LANCZOS)
    
    x = (target_size[0] - img.width) // 2
    y = (target_size[1] - img.height) // 2
    new_img.paste(img, (x, y), img if img.mode == 'RGBA' else None)
    
    return new_img

def process_from_downloads():
    """Process latest downloaded image"""
    downloads = Path("C:/Users/yu.zhang01/Downloads")
    
    # Find latest jpg
    jpg_files = list(downloads.glob("*.jpg"))
    if not jpg_files:
        print("No JPG files found in Downloads")
        return False
    
    latest = max(jpg_files, key=lambda f: f.stat().st_mtime)
    
    # Check if it's recent (within last 5 minutes)
    age = time.time() - latest.stat().st_mtime
    if age > 300:
        print(f"Latest file is {age:.0f}s old, might not be the right one")
        print(f"Using: {latest.name}")
    
    print(f"Processing: {latest.name}")
    
    # Load image
    img = Image.open(latest)
    print(f"Image size: {img.size}")
    
    # Remove white background
    img = remove_white_background(img)
    
    # Split into 4 buttons
    button_images = split_vertical_buttons(img, 4)
    
    # Process each button
    for (filename, label, size), button_img in zip(BUTTONS, button_images):
        # Remove background from individual button
        button_img = remove_white_background(button_img)
        
        # Resize and center
        final_img = resize_and_center(button_img, size)
        
        # Save
        output_path = OUTPUT_DIR / filename
        final_img.save(output_path, "PNG")
        print(f"  Saved: {filename} ({label})")
    
    return True

if __name__ == "__main__":
    print("=" * 60)
    print("LianSe UI Resource Generator")
    print("=" * 60)
    print()
    
    success = process_from_downloads()
    
    if success:
        print()
        print("=" * 60)
        print("SUCCESS! All buttons generated:")
        print(f"Output: {OUTPUT_DIR}")
        print("=" * 60)
        
        # List generated files
        for filename, label, size in BUTTONS:
            path = OUTPUT_DIR / filename
            if path.exists():
                print(f"  {filename} - {size[0]}x{size[1]} - {label}")
    else:
        print()
        print("FAILED: Could not process image")
