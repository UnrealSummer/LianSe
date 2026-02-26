#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
处理Bing生成的按钮底板
"""

import os
import sys
from PIL import Image

# 设置UTF-8输出
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def analyze_button():
    """分析按钮图片"""
    
    input_path = "bing_button_base.jpg"
    
    print("="*60)
    print("[Analyzing Button Base Image]")
    print("="*60)
    
    img = Image.open(input_path)
    
    print(f"\n[Image Info]")
    print(f"  Size: {os.path.getsize(input_path) / 1024:.2f} KB")
    print(f"  Dimensions: {img.width} x {img.height}")
    print(f"  Aspect Ratio: {img.width / img.height:.2f}")
    print(f"  Mode: {img.mode}")
    
    # 转换为PNG
    png_path = "bing_button_base.png"
    img.save(png_path, 'PNG')
    print(f"\n[Converted to PNG]")
    print(f"  Saved: {png_path}")
    
    print("\n" + "="*60)
    print("[Questions]")
    print("="*60)
    print("\n这张图包含：")
    print("  1. 一个按钮？")
    print("  2. 多个按钮（需要拆分）？")
    print("  3. 按钮的不同状态（normal/pressed/disabled）？")
    print("\n请告诉我，然后我会相应处理")
    print("="*60)

if __name__ == "__main__":
    analyze_button()
