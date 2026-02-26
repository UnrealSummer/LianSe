#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
重新裁剪按钮 - 黄色区域往上移
"""

import os
import sys
from PIL import Image

# 设置UTF-8输出
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def recrop_button():
    """重新裁剪按钮"""
    
    input_path = "bing_button_base.png"
    output_dir = "processed_assets"
    
    print("="*60)
    print("[Re-cropping Button - Adjusted Position]")
    print("="*60)
    
    img = Image.open(input_path)
    width = img.width
    height = img.height
    
    print(f"\n[Image size]: {width} x {height}")
    
    # 黄色区域原本是：x=15%, y=40%, w=70%, h=20%
    # 往上移：y改为30%
    
    x = int(width * 0.15)
    y = int(height * 0.30)  # 往上移了10%
    w = int(width * 0.7)
    h = int(height * 0.2)
    
    print(f"\n[Cropping region]: x={x}, y={y}, w={w}, h={h}")
    
    button_img = img.crop((x, y, x + w, y + h))
    
    # 保存裁剪版本检查
    check_path = os.path.join(output_dir, "button_base_cropped_v2.png")
    button_img.save(check_path, 'PNG')
    print(f"\n[Saved for checking]: {check_path}")
    print(f"  Size: {button_img.width} x {button_img.height}")
    
    # 生成不同尺寸
    print(f"\n[Generating different sizes...]")
    
    target_sizes = [
        (450, 100, "large"),
        (350, 80, "medium"),
        (250, 60, "small"),
    ]
    
    for target_w, target_h, size_name in target_sizes:
        resized = button_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
        output_png = os.path.join(output_dir, f"button_base_{size_name}_v2.png")
        resized.save(output_png, 'PNG', quality=95)
        size_kb = os.path.getsize(output_png) / 1024
        print(f"  Saved: button_base_{size_name}_v2.png ({target_w}x{target_h}, {size_kb:.2f} KB)")
    
    print("\n" + "="*60)
    print("[Complete!]")
    print("="*60)
    print(f"\n请检查 button_base_cropped_v2.png")
    print("如果还不对，告诉我需要：")
    print("  - 再往上移？")
    print("  - 往下移？")
    print("  - 调整宽度/高度？")
    print("="*60)

if __name__ == "__main__":
    recrop_button()
