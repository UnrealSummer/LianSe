#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
分析Bing生成的图片并处理
"""

import os
import sys
from PIL import Image

# 设置UTF-8输出
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def analyze_and_process():
    """分析并处理Bing生成的图片"""
    
    input_path = "bing_generated_menu.jpg"
    
    if not os.path.exists(input_path):
        print(f"[Error] File not found: {input_path}")
        return
    
    print("="*60)
    print("[Analyzing Bing Generated Image]")
    print("="*60)
    
    img = Image.open(input_path)
    
    print(f"\n[Original Image Info]")
    print(f"  Size: {os.path.getsize(input_path) / 1024:.2f} KB")
    print(f"  Dimensions: {img.width} x {img.height}")
    print(f"  Aspect Ratio: {img.width / img.height:.2f}")
    print(f"  Mode: {img.mode}")
    print(f"  Format: {img.format}")
    
    # 显示图片内容（简单描述）
    print(f"\n[Image Content]")
    print(f"  This appears to be a game menu design")
    print(f"  Let me save it as PNG for better quality...")
    
    # 转换为PNG
    png_path = "bing_generated_menu.png"
    img.save(png_path, 'PNG', quality=95)
    print(f"\n[Converted to PNG]")
    print(f"  Saved: {png_path}")
    print(f"  Size: {os.path.getsize(png_path) / 1024:.2f} KB")
    
    print("\n" + "="*60)
    print("[Next Steps]")
    print("="*60)
    print("\n请告诉我这张图包含什么内容：")
    print("  1. 是完整的主菜单（背景+按钮）？")
    print("  2. 只是背景？")
    print("  3. 只是按钮？")
    print("  4. 需要拆分成多个部分？")
    print("\n然后我会根据内容进行相应处理")
    print("="*60)

if __name__ == "__main__":
    analyze_and_process()
