#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
改进的按钮检测 - 分析颜色和亮度变化
"""

import os
import sys
from PIL import Image, ImageDraw
import numpy as np

# 设置UTF-8输出
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def analyze_image_structure(image_path):
    """分析图像结构，找出按钮区域"""
    
    print("[Analyzing image structure...]")
    img = Image.open(image_path)
    img_array = np.array(img)
    
    height, width = img_array.shape[:2]
    print(f"Image size: {width} x {height}")
    
    # 转换为灰度
    if len(img_array.shape) == 3:
        gray = np.mean(img_array, axis=2)
    else:
        gray = img_array
    
    # 分析每一行的标准差（检测内容变化）
    print("\n[Analyzing row variance...]")
    row_std = np.std(gray, axis=1)
    
    # 分析下半部分（按钮通常在这里）
    start_y = height // 2
    bottom_half_std = row_std[start_y:]
    
    # 找到标准差较高的区域（有内容的区域）
    threshold = np.percentile(bottom_half_std, 60)
    content_rows = np.where(bottom_half_std > threshold)[0] + start_y
    
    print(f"Found {len(content_rows)} rows with content in bottom half")
    
    # 将连续的行分组
    if len(content_rows) == 0:
        print("[Warning] No content detected, using default layout")
        return None
    
    # 分组：相邻行（距离<20）归为一组
    groups = []
    current_group = [content_rows[0]]
    
    for i in range(1, len(content_rows)):
        if content_rows[i] - content_rows[i-1] < 20:
            current_group.append(content_rows[i])
        else:
            if len(current_group) > 10:  # 至少10行才算一个按钮
                groups.append(current_group)
            current_group = [content_rows[i]]
    
    if len(current_group) > 10:
        groups.append(current_group)
    
    print(f"Found {len(groups)} content groups")
    
    # 为每个组创建按钮区域
    buttons = []
    for i, group in enumerate(groups):
        y_min = min(group)
        y_max = max(group)
        
        # 分析这个区域的水平范围
        region = gray[y_min:y_max+1, :]
        col_std = np.std(region, axis=0)
        
        # 找到有内容的列
        col_threshold = np.percentile(col_std, 50)
        content_cols = np.where(col_std > col_threshold)[0]
        
        if len(content_cols) > 0:
            x_min = max(0, content_cols[0] - 10)
            x_max = min(width, content_cols[-1] + 10)
        else:
            # 默认居中
            button_width = int(width * 0.6)
            x_min = (width - button_width) // 2
            x_max = x_min + button_width
        
        buttons.append({
            'x': int(x_min),
            'y': int(y_min),
            'width': int(x_max - x_min),
            'height': int(y_max - y_min),
            'name': f'button_{i+1}'
        })
    
    return buttons

def create_default_layout(width, height, num_buttons=4):
    """创建默认布局"""
    print("\n[Using default button layout]")
    
    buttons = []
    button_height = 80
    button_width = int(width * 0.6)
    x = (width - button_width) // 2
    spacing = 20
    
    # 从底部往上排列
    total_height = num_buttons * button_height + (num_buttons - 1) * spacing
    start_y = height - total_height - 100
    
    for i in range(num_buttons):
        y = start_y + i * (button_height + spacing)
        buttons.append({
            'x': x,
            'y': y,
            'width': button_width,
            'height': button_height,
            'name': f'button_{i+1}'
        })
    
    return buttons

def process_with_detection(input_path, output_dir):
    """使用检测结果处理图片"""
    
    img = Image.open(input_path)
    
    # 尝试自动检测
    buttons = analyze_image_structure(input_path)
    
    # 如果检测失败或结果不合理，使用默认布局
    if buttons is None or len(buttons) == 0:
        buttons = create_default_layout(img.width, img.height, 4)
    elif len(buttons) == 1:
        # 只检测到1个大区域，可能是所有按钮在一起
        # 将这个区域平均分成4个按钮
        print("\n[Detected 1 large region, splitting into 4 buttons...]")
        large_region = buttons[0]
        x, y, w, h = large_region['x'], large_region['y'], large_region['width'], large_region['height']
        
        button_height = h // 4
        buttons = []
        for i in range(4):
            buttons.append({
                'x': x,
                'y': y + i * button_height,
                'width': w,
                'height': button_height,
                'name': f'button_{i+1}'
            })
    
    print(f"\n[Final button layout - {len(buttons)} buttons:]")
    for btn in buttons:
        print(f"  {btn['name']}: x={btn['x']}, y={btn['y']}, "
              f"w={btn['width']}, h={btn['height']}")
    
    # 创建标记图
    img_marked = img.copy()
    draw = ImageDraw.Draw(img_marked)
    
    colors = ['red', 'green', 'blue', 'yellow']
    for i, btn in enumerate(buttons):
        x, y, w, h = btn['x'], btn['y'], btn['width'], btn['height']
        color = colors[i % len(colors)]
        draw.rectangle([x, y, x+w, y+h], outline=color, width=5)
        draw.text((x+10, y+10), f"{i+1}: {btn['name']}", fill=color)
    
    marked_path = os.path.join(output_dir, "main_menu_marked_final.png")
    img_marked.save(marked_path, 'PNG')
    print(f"\n[Saved marked image]: {marked_path}")
    
    # 提取按钮
    print(f"\n[Extracting buttons...]")
    for btn in buttons:
        x, y, w, h = btn['x'], btn['y'], btn['width'], btn['height']
        button_img = img.crop((x, y, x+w, y+h))
        button_path = os.path.join(output_dir, f"{btn['name']}_final.png")
        button_img.save(button_path, 'PNG', quality=95)
        print(f"  Saved: {btn['name']}_final.png ({w}x{h})")
    
    # 创建背景
    print(f"\n[Creating background...]")
    img_bg = img.copy()
    draw_bg = ImageDraw.Draw(img_bg)
    
    for btn in buttons:
        x, y, w, h = btn['x'], btn['y'], btn['width'], btn['height']
        if y > 10:
            sample_region = img.crop((x, y-10, x+w, y))
            avg_color = sample_region.resize((1, 1), Image.Resampling.LANCZOS).getpixel((0, 0))
            draw_bg.rectangle([x, y, x+w, y+h], fill=avg_color)
    
    bg_path = os.path.join(output_dir, "main_menu_background_final.png")
    img_bg.save(bg_path, 'PNG', quality=95)
    print(f"Saved: main_menu_background_final.png")
    
    print("\n" + "="*60)
    print("[Complete!]")
    print("Check main_menu_marked_final.png to verify button positions")
    print("="*60)

if __name__ == "__main__":
    input_path = "main_menu_processed/main_menu_full_resized.png"
    output_dir = "main_menu_processed"
    
    process_with_detection(input_path, output_dir)
