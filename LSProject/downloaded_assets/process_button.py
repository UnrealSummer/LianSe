#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
处理按钮底板
从1024x1536提取并调整到合适的按钮尺寸
"""

import os
import sys
from PIL import Image

# 设置UTF-8输出
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def process_button():
    """处理按钮底板"""
    
    input_path = "bing_button_base.png"
    output_dir = "processed_assets"
    os.makedirs(output_dir, exist_ok=True)
    
    print("="*60)
    print("[Processing Button Base]")
    print("="*60)
    
    print("\n[Step 1] Loading image...")
    img = Image.open(input_path)
    print(f"  Original: {img.width} x {img.height}")
    
    # 按钮通常在图片中间，我们需要裁剪出按钮部分
    # 假设按钮在中间区域
    
    print("\n[Step 2] Detecting button region...")
    
    # 方案1：假设按钮在中间，占图片的60%宽度，15%高度
    width = img.width
    height = img.height
    
    button_width = int(width * 0.7)
    button_height = int(height * 0.12)
    
    x = (width - button_width) // 2
    y = (height - button_height) // 2
    
    print(f"  Estimated button region: x={x}, y={y}, w={button_width}, h={button_height}")
    
    # 裁剪按钮
    button_img = img.crop((x, y, x + button_width, y + button_height))
    
    print("\n[Step 3] Resizing to standard button size...")
    
    # 调整到标准按钮尺寸
    target_sizes = [
        (450, 100, "large"),      # 大按钮
        (350, 80, "medium"),      # 中按钮
        (250, 60, "small"),       # 小按钮
    ]
    
    for target_w, target_h, size_name in target_sizes:
        resized = button_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
        
        # 保存PNG（带透明通道）
        output_png = os.path.join(output_dir, f"button_base_{size_name}.png")
        
        # 尝试去除背景（如果背景是纯色）
        # 这里简单处理，直接保存
        resized.save(output_png, 'PNG', quality=95)
        size_kb = os.path.getsize(output_png) / 1024
        
        print(f"  Saved: button_base_{size_name}.png ({target_w}x{target_h}, {size_kb:.2f} KB)")
    
    # 保存原始裁剪版本（用于检查）
    check_path = os.path.join(output_dir, "button_base_cropped.png")
    button_img.save(check_path, 'PNG')
    print(f"\n[Step 4] Saved cropped version for checking:")
    print(f"  {check_path}")
    print(f"  Size: {button_img.width} x {button_img.height}")
    
    print("\n" + "="*60)
    print("[Complete!]")
    print("="*60)
    print(f"\n生成的按钮文件：")
    print(f"  1. button_base_large.png (450x100) - 大按钮")
    print(f"  2. button_base_medium.png (350x80) - 中按钮")
    print(f"  3. button_base_small.png (250x60) - 小按钮")
    print(f"  4. button_base_cropped.png - 原始裁剪（用于检查）")
    print(f"\n位置：{output_dir}/")
    print("\n请检查 button_base_cropped.png 看裁剪位置是否正确")
    print("如果不对，告诉我正确的位置，我重新裁剪")
    print("="*60)

if __name__ == "__main__":
    process_button()
