#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成标记图，帮助定位按钮位置
"""

import os
import sys
from PIL import Image, ImageDraw

# 设置UTF-8输出
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def create_marked_image():
    """创建标记图"""
    
    input_path = "bing_button_base.png"
    output_path = "button_position_marked.png"
    
    print("[Creating marked image to help locate button...]")
    
    img = Image.open(input_path)
    img_marked = img.copy()
    draw = ImageDraw.Draw(img_marked)
    
    width = img.width
    height = img.height
    
    # 绘制多个可能的按钮区域
    regions = [
        # (x, y, w, h, name)
        (int(width * 0.1), int(height * 0.3), int(width * 0.8), int(height * 0.15), "Region 1 - Upper"),
        (int(width * 0.1), int(height * 0.45), int(width * 0.8), int(height * 0.15), "Region 2 - Middle"),
        (int(width * 0.1), int(height * 0.6), int(width * 0.8), int(height * 0.15), "Region 3 - Lower"),
        (int(width * 0.15), int(height * 0.4), int(width * 0.7), int(height * 0.2), "Region 4 - Center Large"),
    ]
    
    colors = ['red', 'green', 'blue', 'yellow']
    
    for i, (x, y, w, h, name) in enumerate(regions):
        color = colors[i % len(colors)]
        
        # 绘制矩形框
        draw.rectangle([x, y, x + w, y + h], outline=color, width=5)
        
        # 绘制标签
        draw.text((x + 10, y + 10), f"{i+1}: {name}", fill=color)
    
    img_marked.save(output_path, 'PNG')
    
    print(f"\n[Saved marked image]: {output_path}")
    print(f"\n请查看这张图，告诉我：")
    print("  - 哪个区域（1-4）包含了完整的按钮？")
    print("  - 或者告诉我按钮的大概位置（上/中/下，左/中/右）")
    print("\n然后我会精确裁剪")

if __name__ == "__main__":
    create_marked_image()
