#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
优化和压缩按钮底板
- 去除多余的透明边缘
- 压缩文件大小
- 优化画质
"""

import os
import sys
from PIL import Image, ImageChops

# 设置UTF-8输出
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def trim_transparent(img):
    """去除透明边缘"""
    # 如果是RGB，先转换为RGBA
    if img.mode == 'RGB':
        # 尝试检测背景色并转为透明
        img = img.convert('RGBA')
        datas = img.getdata()
        
        # 假设背景是边角的颜色
        bg_color = img.getpixel((0, 0))[:3]
        
        newData = []
        for item in datas:
            # 如果颜色接近背景色，设为透明
            if abs(item[0] - bg_color[0]) < 10 and \
               abs(item[1] - bg_color[1]) < 10 and \
               abs(item[2] - bg_color[2]) < 10:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)
        
        img.putdata(newData)
    
    # 裁剪透明边缘
    if img.mode == 'RGBA':
        # 获取alpha通道
        alpha = img.split()[3]
        bbox = alpha.getbbox()
        
        if bbox:
            img = img.crop(bbox)
    
    return img

def optimize_button():
    """优化按钮底板"""
    
    input_dir = "processed_assets"
    output_dir = "optimized_assets"
    os.makedirs(output_dir, exist_ok=True)
    
    print("="*60)
    print("[Optimizing Button Base]")
    print("="*60)
    
    # 处理最终版本的按钮
    sizes = ["large", "medium", "small"]
    
    for size in sizes:
        input_path = os.path.join(input_dir, f"button_base_{size}_final.png")
        
        if not os.path.exists(input_path):
            print(f"\n[Skip] {input_path} not found")
            continue
        
        print(f"\n[Processing] button_base_{size}_final.png")
        
        img = Image.open(input_path)
        original_size = os.path.getsize(input_path) / 1024
        
        print(f"  Original: {img.width}x{img.height}, {original_size:.2f} KB")
        
        # 1. 去除透明边缘
        print(f"  [Step 1] Trimming transparent edges...")
        img_trimmed = trim_transparent(img)
        print(f"    After trim: {img_trimmed.width}x{img_trimmed.height}")
        
        # 2. 保存优化版本（PNG）
        output_png = os.path.join(output_dir, f"button_{size}.png")
        img_trimmed.save(output_png, 'PNG', optimize=True, quality=85)
        png_size = os.path.getsize(output_png) / 1024
        print(f"  [Step 2] Saved PNG: {png_size:.2f} KB")
        
        # 3. 如果还是太大，尝试更激进的压缩
        if png_size > 30:
            print(f"  [Step 3] File still large, applying more compression...")
            
            # 降低颜色深度
            img_reduced = img_trimmed.convert('P', palette=Image.ADAPTIVE, colors=256)
            img_reduced = img_reduced.convert('RGBA')
            
            output_compressed = os.path.join(output_dir, f"button_{size}_compressed.png")
            img_reduced.save(output_compressed, 'PNG', optimize=True)
            compressed_size = os.path.getsize(output_compressed) / 1024
            print(f"    Compressed: {compressed_size:.2f} KB")
        
        print(f"  ✓ Optimization complete")
    
    print("\n" + "="*60)
    print("[Complete!]")
    print("="*60)
    print(f"\n优化后的文件在: {output_dir}/")
    print("\n生成的文件:")
    print("  - button_large.png")
    print("  - button_medium.png")
    print("  - button_small.png")
    print("\n如果有 _compressed 版本，说明进行了额外压缩")
    print("="*60)

if __name__ == "__main__":
    optimize_button()
