#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
代码生成主菜单原画图 - 高级版本
更复杂的视觉效果
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

def add_glow_effect(img, glow_color, intensity=50):
    """添加发光效果"""
    overlay = Image.new('RGBA', img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    width, height = img.size
    
    # 中心发光
    for i in range(10):
        radius = 200 + i * 50
        alpha = intensity - i * 5
        draw.ellipse([width//2 - radius, height//2 - radius,
                     width//2 + radius, height//2 + radius],
                    fill=(*glow_color, alpha))
    
    return Image.alpha_composite(img.convert('RGBA'), overlay)

def style_advanced_1_cosmic(output_dir):
    """高级风格1：宇宙星空"""
    print("\n[Advanced Style 1] Cosmic Space - 宇宙星空")
    
    width, height = 750, 1334
    
    # 深空背景
    img = create_radial_gradient(width, height,
                                 hex_to_rgb('#0A0E27'),
                                 hex_to_rgb('#1A1F3A'),
                                 width // 2, height // 3)
    
    overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    # 添加星星（多层，不同大小和亮度）
    random.seed(42)
    for i in range(300):
        x = random.randint(0, width)
        y = random.randint(0, height)
        size = random.choice([1, 1, 1, 2, 2, 3])
        brightness = random.randint(150, 255)
        
        draw.ellipse([x, y, x + size, y + size],
                    fill=(brightness, brightness, brightness, random.randint(150, 255)))
    
    # 添加星云效果
    for i in range(5):
        x = random.randint(0, width)
        y = random.randint(0, height)
        size = random.randint(100, 300)
        
        colors = [
            (138, 43, 226, 30),   # 紫色
            (75, 0, 130, 30),     # 靛蓝
            (255, 20, 147, 30),   # 粉红
        ]
        color = random.choice(colors)
        
        draw.ellipse([x - size, y - size, x + size, y + size],
                    fill=color)
    
    img = Image.alpha_composite(img.convert('RGBA'), overlay)
    
    # 模糊星云
    img = img.filter(ImageFilter.GaussianBlur(radius=3))
    
    # 添加清晰的星星
    overlay2 = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw2 = ImageDraw.Draw(overlay2)
    
    random.seed(42)
    for i in range(200):
        x = random.randint(0, width)
        y = random.randint(0, height)
        size = random.choice([2, 2, 3, 4])
        brightness = random.randint(200, 255)
        
        # 十字星光
        draw2.ellipse([x, y, x + size, y + size],
                     fill=(brightness, brightness, brightness, 255))
        
        if size > 2:
            # 添加光芒
            draw2.line([(x - 5, y + size//2), (x + size + 5, y + size//2)],
                      fill=(brightness, brightness, brightness, 150), width=1)
            draw2.line([(x + size//2, y - 5), (x + size//2, y + size + 5)],
                      fill=(brightness, brightness, brightness, 150), width=1)
    
    img = Image.alpha_composite(img, overlay2).convert('RGB')
    
    path = os.path.join(output_dir, "advanced_1_cosmic.png")
    img.save(path, 'PNG', quality=95)
    print(f"Saved: {path}")

def style_advanced_2_crystal(output_dir):
    """高级风格2：水晶折射"""
    print("\n[Advanced Style 2] Crystal Refraction - 水晶折射")
    
    width, height = 750, 1334
    
    # 渐变背景
    img = Image.new('RGB', (width, height))
    
    for y in range(height):
        ratio = y / height
        r = int(100 + 155 * ratio)
        g = int(50 + 200 * ratio)
        b = int(200 + 55 * ratio)
        
        for x in range(width):
            img.putpixel((x, y), (r, g, b))
    
    overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    # 绘制多边形水晶
    random.seed(123)
    for i in range(15):
        cx = random.randint(0, width)
        cy = random.randint(0, height)
        size = random.randint(80, 200)
        sides = random.choice([5, 6, 7, 8])
        
        # 计算多边形顶点
        points = []
        for j in range(sides):
            angle = 2 * math.pi * j / sides + random.uniform(-0.2, 0.2)
            x = cx + size * math.cos(angle)
            y = cy + size * math.sin(angle)
            points.append((x, y))
        
        # 半透明填充
        alpha = random.randint(20, 60)
        color = random.choice([
            (255, 255, 255, alpha),
            (200, 220, 255, alpha),
            (255, 200, 255, alpha),
        ])
        
        draw.polygon(points, fill=color, outline=(255, 255, 255, 100), width=2)
    
    img = Image.alpha_composite(img.convert('RGBA'), overlay)
    
    # 添加光线效果
    overlay2 = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw2 = ImageDraw.Draw(overlay2)
    
    for i in range(30):
        x1 = random.randint(0, width)
        y1 = random.randint(0, height // 2)
        x2 = x1 + random.randint(-200, 200)
        y2 = y1 + random.randint(200, 400)
        
        draw2.line([(x1, y1), (x2, y2)],
                  fill=(255, 255, 255, random.randint(20, 60)),
                  width=random.choice([1, 2, 3]))
    
    img = Image.alpha_composite(img, overlay2).convert('RGB')
    
    path = os.path.join(output_dir, "advanced_2_crystal.png")
    img.save(path, 'PNG', quality=95)
    print(f"Saved: {path}")

def style_advanced_3_neon(output_dir):
    """高级风格3：霓虹赛博"""
    print("\n[Advanced Style 3] Neon Cyber - 霓虹赛博")
    
    width, height = 750, 1334
    
    # 深色背景
    img = Image.new('RGB', (width, height), hex_to_rgb('#0D0221'))
    
    overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    # 霓虹网格
    grid_size = 50
    neon_colors = [
        (255, 0, 255, 150),   # 品红
        (0, 255, 255, 150),   # 青色
        (255, 255, 0, 150),   # 黄色
    ]
    
    # 水平线
    for y in range(0, height, grid_size):
        color = random.choice(neon_colors)
        # 添加透视效果
        width_factor = 1 - (y / height) * 0.5
        line_width = max(1, int(3 * width_factor))
        
        draw.line([(0, y), (width, y)], fill=color, width=line_width)
    
    # 垂直线（带透视）
    for x in range(0, width, grid_size):
        color = random.choice(neon_colors)
        # 从上到下变宽
        points = []
        for y in range(0, height, 50):
            offset = (y / height) * 20
            points.append((x + offset, y))
        
        if len(points) > 1:
            draw.line(points, fill=color, width=2)
    
    # 添加发光圆圈
    for i in range(10):
        x = random.randint(100, width - 100)
        y = random.randint(100, height - 100)
        size = random.randint(30, 80)
        color = random.choice(neon_colors)
        
        # 多层发光
        for j in range(5):
            alpha = color[3] - j * 20
            draw.ellipse([x - size - j*5, y - size - j*5,
                         x + size + j*5, y + size + j*5],
                        outline=(*color[:3], alpha), width=2)
    
    img = Image.alpha_composite(img.convert('RGBA'), overlay)
    
    # 模糊处理增强发光效果
    img = img.filter(ImageFilter.GaussianBlur(radius=2))
    
    img = img.convert('RGB')
    
    path = os.path.join(output_dir, "advanced_3_neon.png")
    img.save(path, 'PNG', quality=95)
    print(f"Saved: {path}")

def style_advanced_4_aurora(output_dir):
    """高级风格4：极光"""
    print("\n[Advanced Style 4] Aurora - 极光")
    
    width, height = 750, 1334
    
    # 深色夜空背景
    img = create_radial_gradient(width, height,
                                 hex_to_rgb('#0A1128'),
                                 hex_to_rgb('#001F54'))
    
    overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    # 绘制极光波浪
    aurora_colors = [
        (0, 255, 127),    # 春绿
        (127, 255, 212),  # 碧绿
        (64, 224, 208),   # 青绿
        (138, 43, 226),   # 紫罗兰
    ]
    
    for wave_idx in range(4):
        y_offset = 200 + wave_idx * 150
        
        for x in range(0, width, 5):
            # 多层正弦波
            y1 = y_offset + int(80 * math.sin(x / 80 + wave_idx))
            y2 = y1 + int(40 * math.sin(x / 50 + wave_idx * 2))
            
            # 渐变透明度
            alpha = int(100 + 50 * math.sin(x / 100))
            
            color = aurora_colors[wave_idx % len(aurora_colors)]
            
            # 绘制垂直渐变条
            for dy in range(100):
                y = y2 + dy
                if 0 <= y < height:
                    local_alpha = int(alpha * (1 - dy / 100))
                    draw.line([(x, y), (x + 5, y)],
                             fill=(*color, local_alpha), width=1)
    
    img = Image.alpha_composite(img.convert('RGBA'), overlay)
    
    # 模糊处理
    img = img.filter(ImageFilter.GaussianBlur(radius=5))
    
    # 添加星星
    overlay2 = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw2 = ImageDraw.Draw(overlay2)
    
    random.seed(789)
    for i in range(150):
        x = random.randint(0, width)
        y = random.randint(0, height // 2)
        size = random.choice([1, 2, 2, 3])
        
        draw2.ellipse([x, y, x + size, y + size],
                     fill=(255, 255, 255, random.randint(150, 255)))
    
    img = Image.alpha_composite(img, overlay2).convert('RGB')
    
    path = os.path.join(output_dir, "advanced_4_aurora.png")
    img.save(path, 'PNG', quality=95)
    print(f"Saved: {path}")

def style_advanced_5_magic_circle(output_dir):
    """高级风格5：魔法阵"""
    print("\n[Advanced Style 5] Magic Circle - 魔法阵")
    
    width, height = 750, 1334
    
    # 深紫色背景
    img = create_radial_gradient(width, height,
                                 hex_to_rgb('#2D1B69'),
                                 hex_to_rgb('#0F0326'))
    
    overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    cx, cy = width // 2, height // 2
    
    # 绘制多层魔法阵
    magic_color = (255, 215, 0, 150)  # 金色
    
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
    
    # 绘制符文线条
    for i in range(12):
        angle = 2 * math.pi * i / 12
        
        # 外圈到中圈的线
        x1 = cx + 270 * math.cos(angle)
        y1 = cy + 270 * math.sin(angle)
        x2 = cx + 180 * math.cos(angle)
        y2 = cy + 180 * math.sin(angle)
        
        draw.line([(x1, y1), (x2, y2)], fill=magic_color, width=2)
        
        # 中圈到内圈的线
        x3 = cx + 165 * math.cos(angle + math.pi / 12)
        y3 = cy + 165 * math.sin(angle + math.pi / 12)
        x4 = cx + 95 * math.cos(angle + math.pi / 12)
        y4 = cy + 95 * math.sin(angle + math.pi / 12)
        
        draw.line([(x3, y3), (x4, y4)], fill=magic_color, width=2)
    
    # 绘制符文符号
    for i in range(8):
        angle = 2 * math.pi * i / 8
        x = cx + 210 * math.cos(angle)
        y = cy + 210 * math.sin(angle)
        size = 15
        
        # 简单的符文形状
        draw.polygon([
            (x, y - size),
            (x + size, y + size),
            (x - size, y + size)
        ], outline=magic_color, width=2)
    
    # 添加粒子效果
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
    
    # 添加发光效果
    img = img.filter(ImageFilter.GaussianBlur(radius=1))
    
    img = img.convert('RGB')
    
    path = os.path.join(output_dir, "advanced_5_magic_circle.png")
    img.save(path, 'PNG', quality=95)
    print(f"Saved: {path}")

def generate_advanced_styles():
    """生成所有高级风格"""
    
    output_dir = "main_menu_advanced"
    os.makedirs(output_dir, exist_ok=True)
    
    print("="*60)
    print("[Generating Advanced Main Menu Backgrounds]")
    print("="*60)
    
    style_advanced_1_cosmic(output_dir)
    style_advanced_2_crystal(output_dir)
    style_advanced_3_neon(output_dir)
    style_advanced_4_aurora(output_dir)
    style_advanced_5_magic_circle(output_dir)
    
    print("\n" + "="*60)
    print("[Complete!]")
    print(f"Generated 5 advanced styles in: {output_dir}")
    print("\nAdvanced Styles:")
    print("  1. Cosmic Space - 宇宙星空（星云+星星+光芒）")
    print("  2. Crystal Refraction - 水晶折射（多边形+光线）")
    print("  3. Neon Cyber - 霓虹赛博（网格+发光圆）")
    print("  4. Aurora - 极光（波浪渐变+星空）")
    print("  5. Magic Circle - 魔法阵（符文+粒子）")
    print("="*60)

if __name__ == "__main__":
    generate_advanced_styles()
