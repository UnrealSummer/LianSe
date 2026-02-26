#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
分析AI生成的原画图
"""

import os
import sys
from PIL import Image

# 设置UTF-8输出
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def analyze_image(image_path):
    """分析图片信息"""
    
    if not os.path.exists(image_path):
        print(f"[Error] File not found: {image_path}")
        return
    
    try:
        img = Image.open(image_path)
        
        print("=" * 60)
        print("[Image Analysis]")
        print("=" * 60)
        print(f"File: {os.path.basename(image_path)}")
        print(f"Size: {os.path.getsize(image_path) / 1024:.2f} KB")
        print(f"Dimensions: {img.width} x {img.height} pixels")
        print(f"Aspect Ratio: {img.width / img.height:.2f}")
        print(f"Mode: {img.mode}")
        print(f"Format: {img.format}")
        
        # 判断是否有透明通道
        has_alpha = img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info)
        print(f"Has Alpha: {has_alpha}")
        
        # 建议用途
        print("\n[Suggested Usage]")
        
        # 根据尺寸判断
        if img.width > 1920 or img.height > 1080:
            print("- High resolution, suitable for: Background, Splash Screen")
        elif img.width > 750 and img.height > 1334:
            print("- Medium-high resolution, suitable for: Game Background, Main Menu")
        elif img.width > 512:
            print("- Medium resolution, suitable for: UI Panel, Character Art")
        else:
            print("- Low resolution, suitable for: Icon, Small UI Element")
        
        # 根据宽高比判断
        aspect = img.width / img.height
        if 0.5 < aspect < 0.7:
            print("- Portrait orientation (9:16 ~ 3:4), suitable for: Mobile Game Background")
        elif 1.3 < aspect < 1.9:
            print("- Landscape orientation (16:9 ~ 4:3), suitable for: Desktop Game Background")
        elif 0.9 < aspect < 1.1:
            print("- Square, suitable for: Icon, Avatar, Card")
        
        print("\n[Processing Suggestions]")
        
        # 文件大小建议
        file_size_kb = os.path.getsize(image_path) / 1024
        if file_size_kb > 500:
            print(f"- File size is large ({file_size_kb:.0f}KB), consider compressing")
            target_size = min(1920, img.width), min(1080, img.height)
            print(f"- Suggested resize to: {target_size[0]} x {target_size[1]}")
        
        # 透明度建议
        if not has_alpha and img.mode == 'RGB':
            print("- No alpha channel, consider adding transparency if needed")
        
        # 格式建议
        if img.format != 'PNG':
            print("- Not PNG format, consider converting for better quality")
        
        print("=" * 60)
        
    except Exception as e:
        print(f"[Error] Failed to analyze image: {e}")

if __name__ == "__main__":
    image_path = "main_menu_original.png"
    analyze_image(image_path)
