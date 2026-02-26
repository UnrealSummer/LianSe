#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
使用边缘检测和轮廓查找来识别按钮
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

# 设置UTF-8输出
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def find_rectangles(image_path):
    """使用边缘检测找到矩形区域"""
    
    print("[Step 1] Loading image...")
    img = Image.open(image_path)
    img_array = np.array(img)
    
    height, width = img_array.shape[:2]
    print(f"Image size: {width} x {height}")
    
    # 转换为灰度
    print("\n[Step 2] Converting to grayscale...")
    if len(img_array.shape) == 3:
        gray = np.mean(img_array, axis=2).astype(np.uint8)
    else:
        gray = img_array
    
    # 应用边缘检测
    print("[Step 3] Detecting edges...")
    # 使用Sobel算子
    sobel_x = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]])
    sobel_y = np.array([[-1, -2, -1], [0, 0, 0], [1, 2, 1]])
    
    # 简化的边缘检测
    edges_x = np.abs(np.diff(gray.astype(float), axis=1))
    edges_y = np.abs(np.diff(gray.astype(float), axis=0))
    
    # 保存边缘图用于调试
    edges_x_img = Image.fromarray((edges_x / edges_x.max() * 255).astype(np.uint8))
    edges_y_img = Image.fromarray((edges_y / edges_y.max() * 255).astype(np.uint8))
    
    output_dir = "main_menu_processed"
    edges_x_img.save(os.path.join(output_dir, "edges_vertical.png"))
    edges_y_img.save(os.path.join(output_dir, "edges_horizontal.png"))
    print("Saved edge detection images for debugging")
    
    # 找到强边缘
    print("\n[Step 4] Finding strong edges...")
    threshold_x = np.percentile(edges_x, 95)
    threshold_y = np.percentile(edges_y, 95)
    
    strong_edges_x = edges_x > threshold_x
    strong_edges_y = edges_y > threshold_y
    
    # 找到水平线（按钮的上下边界）
    print("[Step 5] Finding horizontal lines (button boundaries)...")
    horizontal_lines = []
    
    for y in range(height - 1):
        # 计算这一行的边缘强度
        edge_count = np.sum(strong_edges_y[y, :])
        if edge_count > width * 0.3:  # 至少30%的宽度有边缘
            horizontal_lines.append(y)
    
    print(f"Found {len(horizontal_lines)} potential horizontal boundaries")
    
    # 找到垂直线（按钮的左右边界）
    print("[Step 6] Finding vertical lines (button sides)...")
    vertical_lines = []
    
    for x in range(width - 1):
        edge_count = np.sum(strong_edges_x[:, x])
        if edge_count > height * 0.05:  # 至少5%的高度有边缘
            vertical_lines.append(x)
    
    print(f"Found {len(vertical_lines)} potential vertical boundaries")
    
    # 将水平线分组（找到按钮的上下边界对）
    print("\n[Step 7] Grouping lines into rectangles...")
    h_groups = []
    if len(horizontal_lines) > 0:
        current_group = [horizontal_lines[0]]
        for i in range(1, len(horizontal_lines)):
            if horizontal_lines[i] - horizontal_lines[i-1] < 10:
                current_group.append(horizontal_lines[i])
            else:
                if len(current_group) > 0:
                    h_groups.append((min(current_group), max(current_group)))
                current_group = [horizontal_lines[i]]
        if len(current_group) > 0:
            h_groups.append((min(current_group), max(current_group)))
    
    print(f"Found {len(h_groups)} horizontal edge groups")
    
    # 将垂直线分组
    v_groups = []
    if len(vertical_lines) > 0:
        current_group = [vertical_lines[0]]
        for i in range(1, len(vertical_lines)):
            if vertical_lines[i] - vertical_lines[i-1] < 10:
                current_group.append(vertical_lines[i])
            else:
                if len(current_group) > 0:
                    v_groups.append((min(current_group), max(current_group)))
                current_group = [vertical_lines[i]]
        if len(current_group) > 0:
            v_groups.append((min(current_group), max(current_group)))
    
    print(f"Found {len(v_groups)} vertical edge groups")
    
    # 组合成矩形
    rectangles = []
    
    # 只在下半部分查找
    start_y = height // 2
    
    for i in range(len(h_groups) - 1):
        y1 = h_groups[i][1]  # 上边界
        y2 = h_groups[i+1][0]  # 下边界
        
        if y1 < start_y:
            continue
        
        h = y2 - y1
        if 40 < h < 150:  # 按钮高度在40-150之间
            # 找到对应的左右边界
            if len(v_groups) >= 2:
                x1 = v_groups[0][1]
                x2 = v_groups[-1][0]
                w = x2 - x1
                
                if w > width * 0.3:  # 宽度至少是图片的30%
                    rectangles.append({
                        'x': x1,
                        'y': y1,
                        'width': w,
                        'height': h
                    })
    
    print(f"\n[Step 8] Found {len(rectangles)} potential buttons")
    
    return rectangles

def visualize_and_extract(image_path, output_dir):
    """可视化并提取按钮"""
    
    rectangles = find_rectangles(image_path)
    
    img = Image.open(image_path)
    
    # 创建可视化图
    img_vis = img.copy()
    draw = ImageDraw.Draw(img_vis)
    
    colors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple']
    
    print("\n[Detected rectangles]:")
    for i, rect in enumerate(rectangles):
        x, y, w, h = rect['x'], rect['y'], rect['width'], rect['height']
        print(f"  Rectangle {i+1}: x={x}, y={y}, w={w}, h={h}")
        
        color = colors[i % len(colors)]
        draw.rectangle([x, y, x+w, y+h], outline=color, width=5)
        draw.text((x+10, y+10), f"Rect {i+1}", fill=color)
    
    vis_path = os.path.join(output_dir, "rectangles_detected.png")
    img_vis.save(vis_path, 'PNG')
    print(f"\n[Saved visualization]: {vis_path}")
    
    # 如果找到了矩形，提取第一个作为按钮底图
    if len(rectangles) > 0:
        print("\n[Extracting first rectangle as button base...]")
        rect = rectangles[0]
        x, y, w, h = rect['x'], rect['y'], rect['width'], rect['height']
        
        button_img = img.crop((x, y, x+w, y+h))
        button_path = os.path.join(output_dir, "button_base_detected.png")
        button_img.save(button_path, 'PNG', quality=95)
        print(f"[Saved button]: button_base_detected.png ({w}x{h})")
    else:
        print("\n[Warning] No rectangles detected")
    
    print("\n" + "="*60)
    print("[Complete!]")
    print("Check rectangles_detected.png to see all detected regions")
    print("="*60)

if __name__ == "__main__":
    input_path = "main_menu_processed/main_menu_full_resized.png"
    output_dir = "main_menu_processed"
    
    visualize_and_extract(input_path, output_dir)
