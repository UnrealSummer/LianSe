#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成魔法阵主题的完整主菜单资源
包括：背景、按钮、装饰元素
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFilter
import math
import random

# 设置UTF-8输出
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def hex_to_rgb(hex_color):
    """十六进制颜色转RGB"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def create_radial_gradient(width, height, center_color, edge_color, center_x=None, center_y=None):
    """创建径向渐变"""
    if center_x is None:
        center_x = width // 2
    if center_y is None:
        center_y = height // 2
    
    img = Image.new('RGB', (width, height))
    
    max_distance = math.sqrt(center_x**2 + center_y**2)
    
    for y in range(height):
        for x in range(width):
            distance = math.sqrt((x - center_x)**2 + (y - center_y)**2)
            ratio = min(distance / max_distance, 1.0)
            
            r = int(center_color[0] * (1 - ratio) + edge_color[0] * ratio)
            g = int(center_color[1] * (1 - ratio) + edge_color[1] * ratio)
            b = int(center_color[2] * (1 - ratio) + edge_color[2] * ratio)
            
            img.putpixel((x, y), (r, g, b))
    
    return img

def create_magic_background(width, height):
    """创建魔法阵背景"""
    
    # 深紫色背景
    img = create_radial_gradient(width, height,
                                 hex_to_rgb('#2D1B69'),
                                 hex_to_rgb('#0F0326'))
    
    overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    cx, cy = width // 2, height // 2
    
    # 魔法阵颜色
    magic_color = (255, 215, 0, 120)  # 金色，稍微透明
    
    # 外圈
    for i in range(5):
        radius = 250 + i * 20
        draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius],
                    outline=magic_color, width=2)
    
    # 中圈
    for i in range(3):
        radius = 150 + i * 15
        draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius],
                    outline=magic_color, width=3)
    
    # 内圈
    radius = 80
    draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius],
                outline=magic_color, width=4)
    
    # 符文线条
    for i in range(12):
        angle = 2 * math.pi * i / 12
        
        x1 = cx + 270 * math.cos(angle)
        y1 = cy + 270 * math.sin(angle)
        x2 = cx + 180 * math.cos(angle)
        y2 = cy + 180 * math.sin(angle)
        
        draw.line([(x1, y1), (x2, y2)], fill=magic_color, width=2)
        
        x3 = cx + 165 * math.cos(angle + math.pi / 12)
        y3 = cy + 165 * math.sin(angle + math.pi / 12)
        x4 = cx + 95 * math.cos(angle + math.pi / 12)
        y4 = cy + 95 * math.sin(angle + math.pi / 12)
        
        draw.line([(x3, y3), (x4, y4)], fill=magic_color, width=2)
    
    # 符文符号
    for i in range(8):
        angle = 2 * math.pi * i / 8
        x = cx + 210 * math.cos(angle)
        y = cy + 210 * math.sin(angle)
        size = 15
        
        draw.polygon([
            (x, y - size),
            (x + size, y + size),
            (x - size, y + size)
        ], outline=magic_color, width=2)
    
    # 粒子效果
    random.seed(456)
    for i in range(100):
        angle = random.uniform(0, 2 * math.pi)
        distance = random.randint(80, 300)
        x = cx + distance * math.cos(angle)
        y = cy + distance * math.sin(angle)
        size = random.choice([1, 2, 3])
        
        draw.ellipse([x, y, x + size, y + size],
                    fill=(255, 215, 0, random.randint(100, 200)))
    
    img = Image.alpha_composite(img.convert('RGBA'), overlay)
    img = img.filter(ImageFilter.GaussianBlur(radius=1))
    
    return img.convert('RGB')

def create_magic_button(width, height, style='normal'):
    """创建魔法主题按钮"""
    
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 按钮颜色方案
    if style == 'primary':
        # 主按钮 - 金色
        base_color = (139, 90, 0, 200)
        border_color = (255, 215, 0, 255)
        glow_color = (255, 215, 0, 100)
    elif style == 'secondary':
        # 次按钮 - 紫色
        base_color = (75, 0, 130, 200)
        border_color = (138, 43, 226, 255)
        glow_color = (138, 43, 226, 100)
    else:
        # 普通按钮 - 深蓝
        base_color = (25, 25, 112, 200)
        border_color = (65, 105, 225, 255)
        glow_color = (65, 105, 225, 100)
    
    # 圆角半径
    radius = 20
    
    # 绘制外发光
    for i in range(5):
        offset = i * 3
        alpha = glow_color[3] - i * 15
        draw.rounded_rectangle(
            [offset, offset, width - offset, height - offset],
            radius=radius + i * 2,
            outline=(*glow_color[:3], alpha),
            width=2
        )
    
    # 绘制按钮主体
    draw.rounded_rectangle(
        [5, 5, width - 5, height - 5],
        radius=radius,
        fill=base_color,
        outline=border_color,
        width=3
    )
    
    # 添加内部高光
    draw.rounded_rectangle(
        [10, 10, width - 10, height // 3],
        radius=radius - 5,
        fill=(255, 255, 255, 40)
    )
    
    # 添加符文装饰
    cx, cy = width // 2, height // 2
    
    # 左侧符文
    for i in range(3):
        x = 20 + i * 5
        y = cy - 10 + i * 7
        draw.line([(x, y), (x + 8, y + 8)], fill=border_color, width=2)
    
    # 右侧符文
    for i in range(3):
        x = width - 20 - i * 5
        y = cy - 10 + i * 7
        draw.line([(x, y), (x - 8, y + 8)], fill=border_color, width=2)
    
    return img

def create_title_decoration(width, height):
    """创建标题装饰"""
    
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    cx, cy = width // 2, height // 2
    
    # 金色装饰
    color = (255, 215, 0, 200)
    
    # 中心菱形
    size = 30
    draw.polygon([
        (cx, cy - size),
        (cx + size, cy),
        (cx, cy + size),
        (cx - size, cy)
    ], fill=color, outline=(255, 255, 255, 255), width=2)
    
    # 左右装饰线
    for side in [-1, 1]:
        x_start = cx + side * 50
        x_end = cx + side * (width // 2 - 20)
        
        # 主线
        draw.line([(x_start, cy), (x_end, cy)], fill=color, width=3)
        
        # 装饰点
        for i in range(3):
            x = x_start + side * (i + 1) * 30
            draw.ellipse([x - 5, cy - 5, x + 5, cy + 5], fill=color)
    
    return img

def generate_magic_theme_assets():
    """生成魔法主题的所有资源"""
    
    output_dir = "magic_theme_assets"
    os.makedirs(output_dir, exist_ok=True)
    
    print("="*60)
    print("[Generating Magic Theme Assets]")
    print("="*60)
    
    # 1. 背景图
    print("\n[1/6] Generating background...")
    bg = create_magic_background(750, 1334)
    bg_path = os.path.join(output_dir, "main_menu_background.png")
    bg.save(bg_path, 'PNG', quality=95)
    print(f"Saved: {bg_path}")
    
    # 2. 主按钮（开始游戏）
    print("\n[2/6] Generating primary button...")
    btn_primary = create_magic_button(450, 100, 'primary')
    btn_primary_path = os.path.join(output_dir, "button_primary.png")
    btn_primary.save(btn_primary_path, 'PNG')
    print(f"Saved: {btn_primary_path} (450x100)")
    
    # 3. 次按钮（继续游戏）
    print("\n[3/6] Generating secondary button...")
    btn_secondary = create_magic_button(450, 100, 'secondary')
    btn_secondary_path = os.path.join(output_dir, "button_secondary.png")
    btn_secondary.save(btn_secondary_path, 'PNG')
    print(f"Saved: {btn_secondary_path} (450x100)")
    
    # 4. 普通按钮（设置、退出）
    print("\n[4/6] Generating normal button...")
    btn_normal = create_magic_button(450, 100, 'normal')
    btn_normal_path = os.path.join(output_dir, "button_normal.png")
    btn_normal.save(btn_normal_path, 'PNG')
    print(f"Saved: {btn_normal_path} (450x100)")
    
    # 5. 小按钮（用于设置等）
    print("\n[5/6] Generating small button...")
    btn_small = create_magic_button(200, 80, 'normal')
    btn_small_path = os.path.join(output_dir, "button_small.png")
    btn_small.save(btn_small_path, 'PNG')
    print(f"Saved: {btn_small_path} (200x80)")
    
    # 6. 标题装饰
    print("\n[6/6] Generating title decoration...")
    title_deco = create_title_decoration(600, 80)
    title_deco_path = os.path.join(output_dir, "title_decoration.png")
    title_deco.save(title_deco_path, 'PNG')
    print(f"Saved: {title_deco_path} (600x80)")
    
    print("\n" + "="*60)
    print("[Complete!]")
    print(f"\nGenerated magic theme assets in: {output_dir}")
    print("\nAssets:")
    print("  1. main_menu_background.png (750x1334) - 魔法阵背景")
    print("  2. button_primary.png (450x100) - 主按钮（金色）")
    print("  3. button_secondary.png (450x100) - 次按钮（紫色）")
    print("  4. button_normal.png (450x100) - 普通按钮（蓝色）")
    print("  5. button_small.png (200x80) - 小按钮")
    print("  6. title_decoration.png (600x80) - 标题装饰")
    print("\n使用建议:")
    print("  - button_primary: 开始游戏")
    print("  - button_secondary: 继续游戏")
    print("  - button_normal: 设置、退出等")
    print("  - button_small: 小图标按钮")
    print("="*60)

if __name__ == "__main__":
    generate_magic_theme_assets()
