#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
重新裁剪按钮 - 结合第一次和第二次的位置
第一次：y=676 (下半部分的起点)
第二次：y=460 (上半部分的起点)
结合：从460开始，到676+184结束
"""

import os
import sys
from PIL import Image

# 设置UTF-8输出
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def recrop_button_combined():
    """裁剪按钮 - 结合两次位置"""
    
    input_path = "bing_button_base.png"
    output_dir = "processed_assets"
    
    print("="*60)
    print("[Re-cropping Button - Combined Position]")
    print("="*60)
    
    img = Image.open(input_path)
    width = img.width
    height = img.height
    
    print(f"\n[Image size]: {width} x {height}")
    
    # 第一次：x=154, y=676, h=184
    # 第二次：x=153, y=460, h=307
    # 结合：从y=460开始，到y=676+184=860结束
    
    x = int(width * 0.15)
    y_start = 460  # 第二次的起点（上半部分）
    y_end = 676 + 184  # 第一次的终点（下半部分）
    
    y = y_start
    h = y_end - y_start
    w = int(width * 0.7)
    
    print(f"\n[Cropping region]: x={x}, y={y}, w={w}, h={h}")
    print(f"  From y={y_start} to y={y_end}")
    
    button_img = img.crop((x, y, x + w, y + h))
    
    # 保存裁剪版本检查
    check_path = os.path.join(output_dir, "button_base_cropped_final.png")
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
        output_png = os.path.join(output_dir, f"button_base_{size_name}_final.png")
        resized.save(output_png, 'PNG', quality=95)
        size_kb = os.path.getsize(output_png) / 1024
        print(f"  Saved: button_base_{size_name}_final.png ({target_w}x{target_h}, {size_kb:.2f} KB)")
    
    print("\n" + "="*60)
    print("[Complete!]")
    print("="*60)
    print(f"\n请检查 button_base_cropped_final.png")
    print("这次应该是完整的按钮了（结合了上下两部分）")
    print("="*60)

if __name__ == "__main__":
    recrop_button_combined()
