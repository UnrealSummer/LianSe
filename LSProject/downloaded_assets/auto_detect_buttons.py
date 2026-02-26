#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
自动识别主菜单中的按钮位置
使用边缘检测和轮廓识别
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

# 设置UTF-8输出
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def detect_buttons(image_path):
    """自动检测按钮位置"""
    
    print("[Step 1] Loading and analyzing image...")
    img = Image.open(image_path)
    
    # 转换为numpy数组
    img_array = np.array(img)
    
    # 转换为灰度图
    if len(img_array.shape) == 3:
        gray = np.mean(img_array, axis=2).astype(np.uint8)
    else:
        gray = img_array
    
    print(f"Image size: {img.width} x {img.height}")
    
    # 计算每行的亮度变化（检测水平边缘）
    print("\n[Step 2] Detecting horizontal edges...")
    row_diff = np.abs(np.diff(gray.astype(float), axis=0))
    row_edge_strength = np.sum(row_diff, axis=1)
    
    # 计算每列的亮度变化（检测垂直边缘）
    print("[Step 3] Detecting vertical edges...")
    col_diff = np.abs(np.diff(gray.astype(float), axis=1))
    col_edge_strength = np.sum(col_diff, axis=0)
    
    # 找到边缘强度的峰值（可能是按钮边界）
    print("\n[Step 4] Finding button regions...")
    
    # 简化方法：检测图像下半部分的矩形区域
    # 按钮通常在下半部分
    height = img.height
    width = img.width
    
    # 分析下半部分（50%-100%）
    start_y = height // 2
    
    # 寻找水平边缘（按钮的上下边界）
    threshold = np.percentile(row_edge_strength[start_y:], 75)
    edge_rows = np.where(row_edge_strength[start_y:] > threshold)[0] + start_y
    
    print(f"Found {len(edge_rows)} potential horizontal edges")
    
    # 将相邻的边缘分组（找到按钮区域）
    button_regions = []
    
    if len(edge_rows) > 0:
        # 简单分组：相邻的边缘（距离<50像素）归为一组
        groups = []
        current_group = [edge_rows[0]]
        
        for i in range(1, len(edge_rows)):
            if edge_rows[i] - edge_rows[i-1] < 50:
                current_group.append(edge_rows[i])
            else:
                if len(current_group) > 2:  # 至少3个边缘点才算一个区域
                    groups.append(current_group)
                current_group = [edge_rows[i]]
        
        if len(current_group) > 2:
            groups.append(current_group)
        
        print(f"Found {len(groups)} potential button groups")
        
        # 为每个组创建按钮区域
        for i, group in enumerate(groups[:4]):  # 最多4个按钮
            y_min = min(group)
            y_max = max(group)
            
            # 按钮宽度：假设居中，占宽度的60%
            button_width = int(width * 0.6)
            x_min = (width - button_width) // 2
            x_max = x_min + button_width
            
            # 调整高度（给一些边距）
            y_min = max(0, y_min - 10)
            y_max = min(height, y_max + 10)
            
            button_regions.append({
                'x': x_min,
                'y': y_min,
                'width': button_width,
                'height': y_max - y_min,
                'name': f'button_{i+1}'
            })
    
    # 如果自动检测失败，使用默认位置
    if len(button_regions) == 0:
        print("\n[Warning] Auto-detection failed, using default positions...")
        # 默认：4个按钮，垂直排列在底部
        button_height = 100
        button_width = int(width * 0.6)
        x = (width - button_width) // 2
        spacing = 20
        start_y = height - 4 * button_height - 3 * spacing - 50
        
        for i in range(4):
            y = start_y + i * (button_height + spacing)
            button_regions.append({
                'x': x,
                'y': y,
                'width': button_width,
                'height': button_height,
                'name': f'button_{i+1}'
            })
    
    return button_regions

def visualize_and_extract(input_path, output_dir):
    """可视化检测结果并提取按钮"""
    
    # 检测按钮
    button_regions = detect_buttons(input_path)
    
    print(f"\n[Step 5] Detected {len(button_regions)} buttons:")
    for btn in button_regions:
        print(f"  {btn['name']}: x={btn['x']}, y={btn['y']}, "
              f"w={btn['width']}, h={btn['height']}")
    
    # 加载图片
    img = Image.open(input_path)
    
    # 创建标记图
    img_marked = img.copy()
    draw = ImageDraw.Draw(img_marked)
    
    for i, btn in enumerate(button_regions):
        x, y, w, h = btn['x'], btn['y'], btn['width'], btn['height']
        # 绘制矩形框
        draw.rectangle([x, y, x+w, y+h], outline='red', width=5)
        # 绘制标签
        draw.text((x+10, y+10), f"{i+1}: {btn['name']}", fill='red')
    
    # 保存标记图
    marked_path = os.path.join(output_dir, "main_menu_marked_auto.png")
    img_marked.save(marked_path, 'PNG')
    print(f"\n[Step 6] Saved marked image: {marked_path}")
    print("Please check if button positions are correct.")
    
    # 提取按钮
    print(f"\n[Step 7] Extracting buttons...")
    for btn in button_regions:
        x, y, w, h = btn['x'], btn['y'], btn['width'], btn['height']
        button_img = img.crop((x, y, x+w, y+h))
        button_path = os.path.join(output_dir, f"{btn['name']}.png")
        button_img.save(button_path, 'PNG', quality=95)
        print(f"  Extracted: {button_path} ({w}x{h})")
    
    # 创建背景图
    print(f"\n[Step 8] Creating background...")
    img_bg = img.copy()
    draw_bg = ImageDraw.Draw(img_bg)
    
    for btn in button_regions:
        x, y, w, h = btn['x'], btn['y'], btn['width'], btn['height']
        # 用周围颜色填充
        if y > 10:
            sample_region = img.crop((x, y-10, x+w, y))
            avg_color = sample_region.resize((1, 1), Image.Resampling.LANCZOS).getpixel((0, 0))
            draw_bg.rectangle([x, y, x+w, y+h], fill=avg_color)
    
    bg_path = os.path.join(output_dir, "main_menu_background_auto.png")
    img_bg.save(bg_path, 'PNG', quality=95)
    print(f"Saved: {bg_path}")
    
    print("\n" + "="*60)
    print("[Complete!]")
    print("="*60)
    
    return button_regions

if __name__ == "__main__":
    input_path = "main_menu_processed/main_menu_full_resized.png"
    output_dir = "main_menu_processed"
    
    visualize_and_extract(input_path, output_dir)
