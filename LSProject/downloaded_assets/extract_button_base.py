#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
提取单个按钮底图
通过颜色聚类找到按钮区域
"""

import os
import sys
from PIL import Image, ImageDraw
import numpy as np

# 设置UTF-8输出
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def find_button_by_color(image_path):
    """通过颜色特征找到按钮"""
    
    print("[Loading image...]")
    img = Image.open(image_path)
    img_array = np.array(img)
    
    height, width = img_array.shape[:2]
    print(f"Image size: {width} x {height}")
    
    # 分析下半部分的颜色分布
    print("\n[Analyzing color distribution in bottom half...]")
    start_y = height // 2
    bottom_half = img_array[start_y:, :, :]
    
    # 将图像分成小块，找出颜色相似的矩形区域
    # 按钮通常有统一的背景色
    
    # 简化方法：扫描每一行，找出颜色变化较小的区域
    print("\n[Scanning for uniform color regions...]")
    
    # 计算每行的颜色标准差
    row_color_std = []
    for y in range(start_y, height):
        row = img_array[y, :, :]
        std = np.std(row, axis=0).mean()
        row_color_std.append(std)
    
    row_color_std = np.array(row_color_std)
    
    # 找到标准差较低的区域（颜色均匀，可能是按钮背景）
    threshold = np.percentile(row_color_std, 30)
    uniform_rows = np.where(row_color_std < threshold)[0] + start_y
    
    print(f"Found {len(uniform_rows)} rows with uniform color")
    
    if len(uniform_rows) == 0:
        print("[Warning] No uniform regions found")
        return None
    
    # 找到最大的连续区域
    groups = []
    current_group = [uniform_rows[0]]
    
    for i in range(1, len(uniform_rows)):
        if uniform_rows[i] - uniform_rows[i-1] < 5:
            current_group.append(uniform_rows[i])
        else:
            if len(current_group) > 30:  # 至少30行高
                groups.append(current_group)
            current_group = [uniform_rows[i]]
    
    if len(current_group) > 30:
        groups.append(current_group)
    
    print(f"Found {len(groups)} potential button regions")
    
    if len(groups) == 0:
        return None
    
    # 选择第一个区域作为按钮
    button_group = groups[0]
    y_min = min(button_group)
    y_max = max(button_group)
    
    # 分析这个区域的水平范围
    region = img_array[y_min:y_max+1, :, :]
    
    # 找到按钮的左右边界（颜色变化大的地方）
    col_std = np.std(region, axis=(0, 2))
    
    # 找到标准差较高的列（边界）
    col_threshold = np.percentile(col_std, 70)
    edge_cols = np.where(col_std > col_threshold)[0]
    
    if len(edge_cols) > 0:
        x_min = max(0, edge_cols[0] - 5)
        x_max = min(width, edge_cols[-1] + 5)
    else:
        # 默认居中
        button_width = int(width * 0.6)
        x_min = (width - button_width) // 2
        x_max = x_min + button_width
    
    button = {
        'x': int(x_min),
        'y': int(y_min),
        'width': int(x_max - x_min),
        'height': int(y_max - y_min)
    }
    
    return button

def extract_single_button(input_path, output_dir):
    """提取单个按钮底图"""
    
    img = Image.open(input_path)
    
    # 尝试自动检测
    button = find_button_by_color(input_path)
    
    if button is None:
        print("\n[Using manual position...]")
        # 手动指定一个按钮位置（需要你提供）
        # 假设按钮在底部，居中
        width, height = img.size
        button = {
            'x': int(width * 0.15),
            'y': int(height * 0.7),
            'width': int(width * 0.7),
            'height': 80
        }
    
    print(f"\n[Button detected]:")
    print(f"  Position: x={button['x']}, y={button['y']}")
    print(f"  Size: {button['width']} x {button['height']}")
    
    # 创建标记图
    img_marked = img.copy()
    draw = ImageDraw.Draw(img_marked)
    
    x, y, w, h = button['x'], button['y'], button['width'], button['height']
    draw.rectangle([x, y, x+w, y+h], outline='red', width=5)
    draw.text((x+10, y+10), "Button Base", fill='red')
    
    marked_path = os.path.join(output_dir, "button_detection.png")
    img_marked.save(marked_path, 'PNG')
    print(f"\n[Saved marked image]: {marked_path}")
    
    # 提取按钮
    button_img = img.crop((x, y, x+w, y+h))
    button_path = os.path.join(output_dir, "button_base.png")
    button_img.save(button_path, 'PNG', quality=95)
    print(f"[Saved button]: button_base.png ({w}x{h})")
    
    # 创建背景（去掉所有按钮位置）
    print(f"\n[Creating background without buttons...]")
    img_bg = img.copy()
    draw_bg = ImageDraw.Draw(img_bg)
    
    # 假设4个按钮垂直排列，间距相似
    spacing = 20
    for i in range(4):
        btn_y = y + i * (h + spacing)
        if btn_y + h <= img.height:
            # 用上方颜色填充
            if btn_y > 10:
                sample_region = img.crop((x, btn_y-10, x+w, btn_y))
                avg_color = sample_region.resize((1, 1), Image.Resampling.LANCZOS).getpixel((0, 0))
                draw_bg.rectangle([x, btn_y, x+w, btn_y+h], fill=avg_color)
    
    bg_path = os.path.join(output_dir, "main_menu_background_clean.png")
    img_bg.save(bg_path, 'PNG', quality=95)
    print(f"[Saved background]: main_menu_background_clean.png")
    
    print("\n" + "="*60)
    print("[Complete!]")
    print("\nGenerated files:")
    print("  1. button_detection.png - Shows detected button position")
    print("  2. button_base.png - Single button base (no text)")
    print("  3. main_menu_background_clean.png - Background without buttons")
    print("\nYou can add text to button_base.png in Cocos Creator")
    print("="*60)

if __name__ == "__main__":
    input_path = "main_menu_processed/main_menu_full_resized.png"
    output_dir = "main_menu_processed"
    
    extract_single_button(input_path, output_dir)
