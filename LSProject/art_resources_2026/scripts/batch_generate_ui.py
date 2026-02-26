# -*- coding: utf-8 -*-
"""
Batch UI Resource Generator for LianSe Project
Automatically processes downloaded Bing images and generates game-ready UI assets
"""

import os
import time
from pathlib import Path
from PIL import Image, ImageDraw

# Paths
PROJECT_ROOT = Path("E:/Project/LianSe/LSProject")
ART_ROOT = PROJECT_ROOT / "art_resources_2026"
DOWNLOAD_DIR = Path("C:/Users/yu.zhang01/Downloads")
OUTPUT_DIR = ART_ROOT / "ui"

# Button configurations
BUTTON_CONFIGS = {
    "main_menu": {
        "btn_start.png": (256, 80),
        "btn_leaderboard.png": (256, 80),
        "btn_settings.png": (256, 80),
        "btn_exit.png": (256, 80),
    },
    "common": {
        "btn_close.png": (64, 64),
        "btn_confirm.png": (128, 64),
        "btn_cancel.png": (128, 64),
    },
    "settings": {
        "toggle_on.png": (64, 32),
        "toggle_off.png": (64, 32),
        "icon_sound.png": (48, 48),
        "icon_music.png": (48, 48),
    }
}

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

def split_vertical_buttons(image_path, num_buttons=4):
    """Split vertically arranged buttons into individual images"""
    img = Image.open(image_path)
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
    """Resize image and center it on transparent background"""
    # Create transparent background
    new_img = Image.new("RGBA", target_size, (255, 255, 255, 0))
    
    # Calculate scale to fit
    img.thumbnail(target_size, Image.Resampling.LANCZOS)
    
    # Center paste
    x = (target_size[0] - img.width) // 2
    y = (target_size[1] - img.height) // 2
    new_img.paste(img, (x, y), img if img.mode == 'RGBA' else None)
    
    return new_img

def process_button_set(source_image, button_names, output_dir, sizes):
    """Process a set of buttons from a single source image"""
    print(f"Processing button set from: {source_image.name}")
    
    # Remove white background
    img = remove_white_background(Image.open(source_image))
    
    # Split into individual buttons
    buttons = split_vertical_buttons(source_image, len(button_names))
    
    # Process each button
    for button_img, button_name in zip(buttons, button_names):
        # Remove background from individual button
        button_img = remove_white_background(button_img)
        
        # Resize to target size
        target_size = sizes[button_name]
        final_img = resize_and_center(button_img, target_size)
        
        # Save
        output_path = output_dir / button_name
        output_path.parent.mkdir(parents=True, exist_ok=True)
        final_img.save(output_path, "PNG")
        print(f"  Saved: {button_name}")

def find_latest_download(pattern="*.jpg", max_age_seconds=300):
    """Find latest downloaded file"""
    files = list(DOWNLOAD_DIR.glob(pattern))
    if not files:
        return None
    
    files.sort(key=lambda f: f.stat().st_mtime, reverse=True)
    latest = files[0]
    
    age = time.time() - latest.stat().st_mtime
    if age > max_age_seconds:
        return None
    
    return latest

def main():
    print("=" * 60)
    print("LianSe UI Resource Generator")
    print("=" * 60)
    
    # Phase 1: Main Menu Buttons
    print("\nPhase 1: Main Menu Buttons")
    print("Waiting for Bing download...")
    
    latest = find_latest_download()
    if latest:
        button_names = list(BUTTON_CONFIGS["main_menu"].keys())
        process_button_set(
            latest,
            button_names,
            OUTPUT_DIR / "main_menu",
            BUTTON_CONFIGS["main_menu"]
        )
        print("Phase 1 complete!")
    else:
        print("No recent download found. Please generate and download from Bing first.")
    
    print("\n" + "=" * 60)
    print("Generation complete!")
    print(f"Output directory: {OUTPUT_DIR}")
    print("=" * 60)

if __name__ == "__main__":
    main()
