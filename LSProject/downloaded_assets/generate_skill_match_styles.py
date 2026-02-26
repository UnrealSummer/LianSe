#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
《技能消消消》主菜单设计
A套：像素风格 + 太空科幻
B套：卡通风格 + 魔法主题
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

# ============================================================
# A套：像素风格 + 太空科幻
# ============================================================

def draw_pixel_star(draw, x, y, size, color):
    """绘制像素风格的星星"""
    # 简单的十字形
    draw.rectangle([x - size, y - 1, x + size, y + 1], fill=color)
    draw.rectangle([x - 1, y - size, x + 1, y + size], fill=color)

def draw_pixel_block(draw, x, y, size, color):
    """绘制像素风格的方块"""
    # 主体
    draw.rectangle([x, y, x + size, y + size], fill=color)
    
    # 高光（左上）
    highlight = tuple(min(c + 50, 255) for c in color)
    draw.rectangle([x + 2, y + 2, x + size - 2, y + size // 3], fill=highlight)
    
    # 阴影（右下）
    shadow = tuple(max(c - 50, 0) for c in color)
    draw.line([(x + size, y), (x + size, y + size)], fill=shadow, width=2)
    draw.line([(x, y + size), (x + size, y + size)], fill=shadow, width=2)

def create_style_a_space_pixel():
    """A套：像素风格 + 太空科幻"""
    
    width, height = 750, 1334
    
    print("\n[A套] 像素风格 + 太空科幻")
    print("[Step 1] Creating space background...")
    
    # 深色太空背景
    img = Image.new('RGB', (width, height), hex_to_rgb('#0A0E27'))
    draw = ImageDraw.Draw(img)
    
    # 添加星星
    print("[Step 2] Adding pixel stars...")
    random.seed(42)
    for i in range(200):
        x = random.randint(0, width)
        y = random.randint(0, height)
        size = random.choice([1, 2, 3])
        brightness = random.randint(150, 255)
        color = (brightness, brightness, brightness)
        
        draw_pixel_star(draw, x, y, size, color)
    
    # 添加彩色星云（像素化）
    print("[Step 3] Adding pixel nebula...")
    nebula_colors = [
        hex_to_rgb('#8B00FF'),  # 紫
        hex_to_rgb('#FF1493'),  # 粉
        hex_to_rgb('#00CED1'),  # 青
    ]
    
    for i in range(30):
        x = random.randint(0, width)
        y = random.randint(0, height)
        size = random.randint(20, 60)
        color = random.choice(nebula_colors)
        
        # 像素化的圆形
        for dy in range(-size, size, 4):
            for dx in range(-size, size, 4):
                if dx*dx + dy*dy < size*size:
                    alpha = int(100 * (1 - math.sqrt(dx*dx + dy*dy) / size))
                    if alpha > 0:
                        px, py = x + dx, y + dy
                        if 0 <= px < width and 0 <= py < height:
                            current = img.getpixel((px, py))
                            new_color = tuple(min(current[j] + color[j] * alpha // 255, 255) for j in range(3))
                            draw.point((px, py), fill=new_color)
    
    print("[Step 4] Drawing title...")
    # 游戏标题（像素字体风格）
    try:
        font = ImageFont.truetype("arial.ttf", 60)
    except:
        font = ImageFont.load_default()
    
    title_text = "技能消消消"
    bbox = draw.textbbox((0, 0), title_text, font=font)
    title_width = bbox[2] - bbox[0]
    title_x = (width - title_width) // 2
    title_y = 150
    
    # 标题发光效果（科幻感）
    glow_colors = [
        hex_to_rgb('#00FFFF'),  # 青色
        hex_to_rgb('#FF00FF'),  # 品红
    ]
    
    for i in range(5):
        offset = i * 2
        color = glow_colors[i % 2]
        alpha = 150 - i * 30
        # 简化：直接绘制，不处理alpha
        draw.text((title_x + offset, title_y + offset), title_text,
                 fill=color, font=font)
    
    # 标题主体（白色）
    draw.text((title_x, title_y), title_text, fill=(255, 255, 255), font=font)
    
    print("[Step 5] Drawing pixel blocks...")
    # 标题周围的像素方块
    block_colors = [
        hex_to_rgb('#FF0000'),  # 红
        hex_to_rgb('#00FF00'),  # 绿
        hex_to_rgb('#0000FF'),  # 蓝
        hex_to_rgb('#FFFF00'),  # 黄
        hex_to_rgb('#FF00FF'),  # 品红
        hex_to_rgb('#00FFFF'),  # 青
    ]
    
    for i in range(8):
        angle = math.pi * 2 * i / 8
        x = int(width // 2 + 250 * math.cos(angle))
        y = int(title_y + 50 + 120 * math.sin(angle))
        color = block_colors[i % len(block_colors)]
        draw_pixel_block(draw, x - 20, y - 20, 40, color)
    
    print("[Step 6] Drawing buttons...")
    # 按钮（像素风格）
    button_width = 450
    button_height = 80
    button_x = (width - button_width) // 2
    button_spacing = 20
    button_start_y = 800
    
    buttons = [
        ("开始游戏", hex_to_rgb('#00FF00')),    # 绿
        ("继续游戏", hex_to_rgb('#00FFFF')),    # 青
        ("设置", hex_to_rgb('#FFFF00')),        # 黄
        ("退出", hex_to_rgb('#FF0000')),        # 红
    ]
    
    for i, (text, color) in enumerate(buttons):
        y = button_start_y + i * (button_height + button_spacing)
        
        # 按钮阴影
        draw.rectangle([button_x + 4, y + 4, button_x + button_width + 4, y + button_height + 4],
                      fill=(0, 0, 0))
        
        # 按钮主体
        draw.rectangle([button_x, y, button_x + button_width, y + button_height],
                      fill=color)
        
        # 按钮高光
        highlight = tuple(min(c + 80, 255) for c in color)
        draw.rectangle([button_x + 4, y + 4, button_x + button_width - 4, y + button_height // 3],
                      fill=highlight)
        
        # 按钮边框
        draw.rectangle([button_x, y, button_x + button_width, y + button_height],
                      outline=(255, 255, 255), width=3)
        
        # 文字
        try:
            btn_font = ImageFont.truetype("arial.ttf", 32)
        except:
            btn_font = ImageFont.load_default()
        
        bbox = draw.textbbox((0, 0), text, font=btn_font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        text_x = button_x + (button_width - text_width) // 2
        text_y = y + (button_height - text_height) // 2
        
        # 文字阴影
        draw.text((text_x + 2, text_y + 2), text, fill=(0, 0, 0), font=btn_font)
        # 文字主体
        draw.text((text_x, text_y), text, fill=(255, 255, 255), font=btn_font)
    
    return img

# ============================================================
# B套：卡通风格 + 魔法主题
# ============================================================

def draw_magic_particle(draw, x, y, size, color):
    """绘制魔法粒子"""
    # 发光的圆形粒子
    for i in range(3):
        radius = size + i * 2
        alpha = 200 - i * 60
        # 简化：直接绘制
        draw.ellipse([x - radius, y - radius, x + radius, y + radius],
                    fill=color)

def draw_cartoon_gem(draw, x, y, size, color):
    """绘制卡通宝石"""
    # 六边形宝石
    points = []
    for i in range(6):
        angle = math.pi * 2 * i / 6
        px = x + size * math.cos(angle)
        py = y + size * math.sin(angle)
        points.append((px, py))
    
    # 宝石主体
    draw.polygon(points, fill=color)
    
    # 宝石高光
    highlight = tuple(min(c + 100, 255) for c in color)
    highlight_points = [
        (x - size * 0.3, y - size * 0.5),
        (x + size * 0.3, y - size * 0.5),
        (x, y)
    ]
    draw.polygon(highlight_points, fill=highlight)
    
    # 宝石边框
    draw.polygon(points, outline=(255, 255, 255), width=3)

def create_style_b_cartoon_magic():
    """B套：卡通风格 + 魔法主题"""
    
    width, height = 750, 1334
    
    print("\n[B套] 卡通风格 + 魔法主题")
    print("[Step 1] Creating magic background...")
    
    # 魔法渐变背景（紫色到蓝色）
    img = Image.new('RGB', (width, height))
    
    color1 = hex_to_rgb('#4A148C')  # 深紫
    color2 = hex_to_rgb('#1A237E')  # 深蓝
    
    for y in range(height):
        ratio = y / height
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
        
        for x in range(width):
            img.putpixel((x, y), (r, g, b))
    
    draw = ImageDraw.Draw(img)
    
    print("[Step 2] Adding magic particles...")
    # 添加魔法粒子
    random.seed(123)
    particle_colors = [
        hex_to_rgb('#FFD700'),  # 金
        hex_to_rgb('#FF69B4'),  # 粉
        hex_to_rgb('#00CED1'),  # 青
        hex_to_rgb('#9370DB'),  # 紫
    ]
    
    for i in range(80):
        x = random.randint(0, width)
        y = random.randint(0, height)
        size = random.randint(3, 8)
        color = random.choice(particle_colors)
        
        draw_magic_particle(draw, x, y, size, color)
    
    print("[Step 3] Drawing magic circle...")
    # 魔法阵（简化版）
    cx, cy = width // 2, height // 2 - 100
    
    for i in range(3):
        radius = 200 + i * 30
        draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius],
                    outline=hex_to_rgb('#FFD700'), width=2)
    
    # 魔法阵符文线
    for i in range(8):
        angle = math.pi * 2 * i / 8
        x1 = cx + 230 * math.cos(angle)
        y1 = cy + 230 * math.sin(angle)
        x2 = cx + 170 * math.cos(angle)
        y2 = cy + 170 * math.sin(angle)
        
        draw.line([(x1, y1), (x2, y2)], fill=hex_to_rgb('#FFD700'), width=3)
    
    print("[Step 4] Drawing title...")
    # 游戏标题
    try:
        font = ImageFont.truetype("arial.ttf", 70)
    except:
        font = ImageFont.load_default()
    
    title_text = "技能消消消"
    bbox = draw.textbbox((0, 0), title_text, font=font)
    title_width = bbox[2] - bbox[0]
    title_x = (width - title_width) // 2
    title_y = 150
    
    # 标题发光
    for i in range(5):
        offset = i * 3
        alpha = 200 - i * 40
        draw.text((title_x + offset, title_y + offset), title_text,
                 fill=hex_to_rgb('#FFD700'), font=font)
    
    # 标题主体
    draw.text((title_x, title_y), title_text, fill=(255, 255, 255), font=font)
    
    print("[Step 5] Drawing cartoon gems...")
    # 卡通宝石装饰
    gem_colors = [
        hex_to_rgb('#FF0000'),  # 红
        hex_to_rgb('#FF7F00'),  # 橙
        hex_to_rgb('#FFFF00'),  # 黄
        hex_to_rgb('#00FF00'),  # 绿
        hex_to_rgb('#0000FF'),  # 蓝
        hex_to_rgb('#8B00FF'),  # 紫
    ]
    
    for i in range(6):
        angle = math.pi * 2 * i / 6
        x = int(width // 2 + 280 * math.cos(angle))
        y = int(title_y + 50 + 150 * math.sin(angle))
        color = gem_colors[i]
        draw_cartoon_gem(draw, x, y, 30, color)
    
    print("[Step 6] Drawing buttons...")
    # 按钮（卡通风格，圆润）
    button_width = 480
    button_height = 90
    button_x = (width - button_width) // 2
    button_spacing = 25
    button_start_y = 800
    
    buttons = [
        ("开始游戏", hex_to_rgb('#9C27B0'), hex_to_rgb('#7B1FA2')),    # 紫
        ("继续游戏", hex_to_rgb('#2196F3'), hex_to_rgb('#1976D2')),    # 蓝
        ("设置", hex_to_rgb('#FF9800'), hex_to_rgb('#F57C00')),        # 橙
        ("退出", hex_to_rgb('#E91E63'), hex_to_rgb('#C2185B')),        # 粉
    ]
    
    for i, (text, color1, color2) in enumerate(buttons):
        y = button_start_y + i * (button_height + button_spacing)
        
        # 按钮阴影
        draw.rounded_rectangle([button_x + 6, y + 6, button_x + button_width + 6, y + button_height + 6],
                              radius=25, fill=(0, 0, 0, 100))
        
        # 按钮渐变（简化：用两层）
        draw.rounded_rectangle([button_x, y, button_x + button_width, y + button_height],
                              radius=25, fill=color2)
        
        draw.rounded_rectangle([button_x, y, button_x + button_width, y + button_height // 2],
                              radius=25, fill=color1)
        
        # 按钮高光
        draw.rounded_rectangle([button_x + 10, y + 10, button_x + button_width - 10, y + button_height // 3],
                              radius=15, fill=(255, 255, 255, 80))
        
        # 按钮边框
        draw.rounded_rectangle([button_x, y, button_x + button_width, y + button_height],
                              radius=25, outline=(255, 255, 255), width=4)
        
        # 文字
        try:
            btn_font = ImageFont.truetype("arial.ttf", 36)
        except:
            btn_font = ImageFont.load_default()
        
        bbox = draw.textbbox((0, 0), text, font=btn_font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        text_x = button_x + (button_width - text_width) // 2
        text_y = y + (button_height - text_height) // 2
        
        # 文字阴影
        draw.text((text_x + 3, text_y + 3), text, fill=(0, 0, 0), font=btn_font)
        # 文字主体
        draw.text((text_x, text_y), text, fill=(255, 255, 255), font=btn_font)
    
    return img

def generate_both_styles():
    """生成两套风格"""
    
    output_dir = "skill_match_prototypes"
    os.makedirs(output_dir, exist_ok=True)
    
    print("="*60)
    print("[《技能消消消》主菜单设计]")
    print("="*60)
    
    # A套
    img_a = create_style_a_space_pixel()
    path_a = os.path.join(output_dir, "style_a_space_pixel.png")
    img_a.save(path_a, 'PNG', quality=95)
    print(f"\n[A套完成] {path_a}")
    
    # B套
    img_b = create_style_b_cartoon_magic()
    path_b = os.path.join(output_dir, "style_b_cartoon_magic.png")
    img_b.save(path_b, 'PNG', quality=95)
    print(f"\n[B套完成] {path_b}")
    
    print("\n" + "="*60)
    print("[Complete!]")
    print(f"\n生成了2套设计在: {output_dir}")
    print("\nA套：像素风格 + 太空科幻")
    print("  - 深色太空背景")
    print("  - 像素星星和星云")
    print("  - 像素方块装饰")
    print("  - 科幻发光标题")
    print("  - 像素风格按钮")
    print("\nB套：卡通风格 + 魔法主题")
    print("  - 紫蓝渐变背景")
    print("  - 魔法粒子效果")
    print("  - 魔法阵装饰")
    print("  - 卡通宝石装饰")
    print("  - 圆润渐变按钮")
    print("="*60)

if __name__ == "__main__":
    generate_both_styles()
