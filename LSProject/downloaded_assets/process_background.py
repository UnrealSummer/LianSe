#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
处理Bing生成的背景图
调整到游戏尺寸并优化
"""

import os
import sys
from PIL import Image

# 设置UTF-8输出
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def process_background():
    """处理背景图"""
    
    input_path = "bing_generated_menu.png"
    output_dir = "processed_assets"
    os.makedirs(output_dir, exist_ok=True)
    
    print("="*60)
    print("[Processing Background Image]")
    print("="*60)
    
    print("\n[Step 1] Loading image...")
    img = Image.open(input_path)
    print(f"  Original: {img.width} x {img.height}")
    
    # 目标尺寸（微信小游戏标准）
    target_width = 750
    target_height = 1334
    
    print(f"\n[Step 2] Resizing to {target_width} x {target_height}...")
    img_resized = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    # 保存高质量版本
    output_hq = os.path.join(output_dir, "main_menu_background_hq.png")
    img_resized.save(output_hq, 'PNG', quality=95, optimize=False)
    size_hq = os.path.getsize(output_hq) / 1024
    print(f"  Saved HQ: {output_hq} ({size_hq:.2f} KB)")
    
    # 保存优化版本（压缩）
    output_optimized = os.path.join(output_dir, "main_menu_background.png")
    img_resized.save(output_optimized, 'PNG', quality=85, optimize=True)
    size_opt = os.path.getsize(output_optimized) / 1024
    print(f"  Saved Optimized: {output_optimized} ({size_opt:.2f} KB)")
    
    # 如果还是太大，转换为JPEG
    if size_opt > 300:
        print(f"\n[Step 3] File too large, creating JPEG version...")
        output_jpg = os.path.join(output_dir, "main_menu_background.jpg")
        img_resized.convert('RGB').save(output_jpg, 'JPEG', quality=85, optimize=True)
        size_jpg = os.path.getsize(output_jpg) / 1024
        print(f"  Saved JPEG: {output_jpg} ({size_jpg:.2f} KB)")
    
    print("\n" + "="*60)
    print("[Complete!]")
    print("="*60)
    print(f"\n生成的文件：")
    print(f"  1. main_menu_background_hq.png - 高质量版本")
    print(f"  2. main_menu_background.png - 优化版本（推荐）")
    if size_opt > 300:
        print(f"  3. main_menu_background.jpg - JPEG版本（更小）")
    print(f"\n尺寸：{target_width} x {target_height}")
    print(f"位置：{output_dir}/")
    print("="*60)

if __name__ == "__main__":
    process_background()
