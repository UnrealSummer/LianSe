#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成完整的主菜单原型图
包括背景、标题、按钮、装饰等所有元素
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFont
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

def draw_magic_circle(draw, cx, cy, max_radius, color):
    """绘制魔法阵"""
    
    # 外圈
    for i in range(5):
        radius = max_radius - 50 + i * 20
        draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius],
                    outline=color, width=2)
    
    # 中圈
    for i in range(3):
        radius = max_radius - 150 + i * 15
        draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius],
                    outline=color, width=3)
    
    # 内圈
    radius = max_radius - 220
    draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius],
                outline=color, width=4)
    
    # 符文线条
    for i in range(12):
        angle = 2 * math.pi * i / 12
        
        x1 = cx + (max_radius - 30) * math.cos(angle)
        y1 = cy + (max_radius - 30) * math.sin(angle)
        x2 = cx + (max_radius - 120) * math.cos(angle)
        y2 = cy + (max_radius - 120) * math.sin(angle)
        
        draw.line([(x1, y1), (x2, y2)], fill=color, width=2)
        
        x3 = cx + (max_radius - 135) * math.cos(angle + math.pi / 12)
        y3 = cy + (max_radius - 135) * math.sin(angle + math.pi / 12)
        x4 = cx + (max_radius - 205) * math.cos(angle + math.pi / 12)
        y4 = cy + (max_radius - 205) * math.sin(angle + math.pi / 12)
        
        draw.line([(x3, y3), (x4, y4)], fill=color, width=2)
    
    # 符文符号
    for i in range(8):
        angle = 2 * math.pi * i / 8
        x = cx + (max_radius - 90) * math.cos(angle)
        y = cy + (max_radius - 90) * math.sin(angle)
        size = 15
        
        draw.polygon([
            (x, y - size),
            (x + size, y + size),
            (x - size, y + size)
        ], outline=color, width=2)

def draw_button(draw, x, y, width, height, text, color, text_color=(255, 255, 255)):
    """绘制按钮"""
    
    radius = 20
    
    # 外发光
    for i in range(3):
        offset = i * 3
        alpha = 100 - i * 30
        glow_color = (*color[:3], alpha)
        
        # 简化的圆角矩形（用多个线段模拟）
        draw.rectangle([x - offset, y - offset, x + width + offset, y + height + offset],
                      outline=glow_color, width=2)
    
    # 按钮主体
    draw.rectangle([x, y, x + width, y + height], fill=color, outline=(255, 215, 0), width=3)
    
    # 高光
    draw.rectangle([x + 5, y + 5, x + width - 5, y + height // 3],
                  fill=(255, 255, 255, 40))
    
    # 文字
    try:
        font = ImageFont.truetype("arial.ttf", 32)
    except:
        font = ImageFont.load_default()
    
    # 计算文字位置（居中）
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    text_x = x + (width - text_width) // 2
    text_y = y + (height - text_height) // 2
    
    # 文字阴影
    draw.text((text_x + 2, text_y + 2), text, fill=(0, 0, 0, 150), font=font)
    # 文字
    draw.text((text_x, text_y), text, fill=text_color, font=font)

def create_complete_main_menu():
    """创建完整的主菜单原型图"""
    
    width, height = 750, 1334
    
    print("[Step 1] Creating background...")
    # 背景
    img = create_radial_gradient(width, height,
                                 hex_to_rgb('#2D1B69'),
                                 hex_to_rgb('#0F0326'))
    
    # 转换为RGBA以支持透明度
    img = img.convert('RGBA')
    
    # 创建绘图对象
    draw = ImageDraw.Draw(img)
    
    print("[Step 2] Drawing magic circle...")
    # 绘制魔法阵
    cx, cy = width // 2, height // 2 - 100
    magic_color = (255, 215, 0, 120)
    draw_magic_circle(draw, cx, cy, 300, magic_color)
    
    print("[Step 3] Adding particles...")
    # 添加粒子
    random.seed(456)
    for i in range(100):
        angle = random.uniform(0, 2 * math.pi)
        distance = random.randint(80, 300)
        x = cx + distance * math.cos(angle)
        y = cy + distance * math.sin(angle)
        size = random.choice([2, 3, 4])
        
        draw.ellipse([x, y, x + size, y + size],
                    fill=(255, 215, 0, random.randint(100, 200)))
    
    print("[Step 4] Drawing title...")
    # 游戏标题
    try:
        title_font = ImageFont.truetype("arial.ttf", 72)
    except:
        title_font = ImageFont.load_default()
    
    title_text = "炼色"
    title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (width - title_width) // 2
    title_y = 150
    
    # 标题发光效果
    for i in range(5):
        offset = i * 2
        alpha = 150 - i * 30
        draw.text((title_x + offset, title_y + offset), title_text,
                 fill=(255, 215, 0, alpha), font=title_font)
    
    # 标题主体
    draw.text((title_x, title_y), title_text, fill=(255, 215, 0), font=title_font)
    
    # 标题装饰
    deco_y = title_y + 80
    deco_size = 30
    
    # 左侧装饰
    draw.polygon([
        (title_x - 50, deco_y),
        (title_x - 50 + deco_size, deco_y - deco_size // 2),
        (title_x - 50 + deco_size, deco_y + deco_size // 2)
    ], fill=(255, 215, 0))
    
    draw.line([(title_x - 80, deco_y), (title_x - 50, deco_y)],
             fill=(255, 215, 0), width=3)
    
    # 右侧装饰
    draw.polygon([
        (title_x + title_width + 50, deco_y),
        (title_x + title_width + 50 - deco_size, deco_y - deco_size // 2),
        (title_x + title_width + 50 - deco_size, deco_y + deco_size // 2)
    ], fill=(255, 215, 0))
    
    draw.line([(title_x + title_width + 50, deco_y), (title_x + title_width + 80, deco_y)],
             fill=(255, 215, 0), width=3)
    
    print("[Step 5] Drawing buttons...")
    # 按钮区域
    button_width = 450
    button_height = 100
    button_x = (width - button_width) // 2
    button_spacing = 30
    button_start_y = 850
    
    buttons = [
        ("开始游戏", (139, 90, 0, 200)),      # 金色
        ("继续游戏", (75, 0, 130, 200)),      # 紫色
        ("设置", (25, 25, 112, 200)),         # 深蓝
        ("退出", (25, 25, 112, 200)),         # 深蓝
    ]
    
    for i, (text, color) in enumerate(buttons):
        y = button_start_y + i * (button_height + button_spacing)
        draw_button(draw, button_x, y, button_width, button_height, text, color)
    
    print("[Step 6] Adding version info...")
    # 版本信息
    try:
        version_font = ImageFont.truetype("arial.ttf", 20)
    except:
        version_font = ImageFont.load_default()
    
    version_text = "v1.0.0"
    draw.text((width - 100, height - 50), version_text,
             fill=(255, 215, 0, 150), font=version_font)
    
    # 转换回RGB
    img = img.convert('RGB')
    
    return img

def generate_prototype():
    """生成原型图"""
    
    output_dir = "main_menu_prototype"
    os.makedirs(output_dir, exist_ok=True)
    
    print("="*60)
    print("[Generating Complete Main Menu Prototype]")
    print("="*60)
    print()
    
    img = create_complete_main_menu()
    
    print("\n[Step 7] Saving...")
    output_path = os.path.join(output_dir, "main_menu_complete.png")
    img.save(output_path, 'PNG', quality=95)
    
    print("\n" + "="*60)
    print("[Complete!]")
    print(f"\nSaved: {output_path}")
    print(f"Size: 750 x 1334")
    print("\nElements:")
    print("  - 魔法阵背景（径向渐变）")
    print("  - 游戏标题「炼色」（金色发光）")
    print("  - 标题装饰（箭头+线条）")
    print("  - 4个按钮（开始游戏、继续游戏、设置、退出）")
    print("  - 粒子效果")
    print("  - 版本信息")
    print("="*60)

if __name__ == "__main__":
    generate_prototype()
