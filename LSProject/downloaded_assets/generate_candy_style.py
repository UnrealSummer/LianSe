#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
按照UI_DESIGN_SPEC_V2.md生成主菜单
风格：活泼、多彩、游戏化（类似Candy Crush）
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
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

def create_gradient_background(width, height):
    """创建渐变背景：浅蓝到浅紫"""
    img = Image.new('RGB', (width, height))
    
    color1 = hex_to_rgb('#E3F2FD')  # 浅蓝
    color2 = hex_to_rgb('#F3E5F5')  # 浅紫
    
    for y in range(height):
        ratio = y / height
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
        
        for x in range(width):
            img.putpixel((x, y), (r, g, b))
    
    return img

def add_cute_decorations(img):
    """添加可爱的装饰（星星、云朵）"""
    overlay = Image.new('RGBA', img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    width, height = img.size
    
    # 添加星星
    random.seed(123)
    star_colors = [
        hex_to_rgb('#FFD700'),  # 金色
        hex_to_rgb('#FF69B4'),  # 粉红
        hex_to_rgb('#00CED1'),  # 青色
        hex_to_rgb('#FFB6C1'),  # 浅粉
    ]
    
    for i in range(30):
        x = random.randint(50, width - 50)
        y = random.randint(50, height - 50)
        size = random.randint(15, 35)
        color = random.choice(star_colors)
        
        # 绘制五角星
        points = []
        for j in range(5):
            angle = math.pi * 2 * j / 5 - math.pi / 2
            px = x + size * math.cos(angle)
            py = y + size * math.sin(angle)
            points.append((px, py))
            
            # 内角
            angle2 = angle + math.pi / 5
            px2 = x + size * 0.4 * math.cos(angle2)
            py2 = y + size * 0.4 * math.sin(angle2)
            points.append((px2, py2))
        
        draw.polygon(points, fill=(*color, 150))
        
        # 星星发光
        for k in range(3):
            offset = k * 3
            draw.polygon(points, outline=(*color, 100 - k * 30), width=2)
    
    # 添加云朵
    cloud_color = (255, 255, 255, 100)
    for i in range(10):
        x = random.randint(0, width)
        y = random.randint(0, height // 2)
        
        # 云朵由多个圆组成
        draw.ellipse([x, y, x + 80, y + 40], fill=cloud_color)
        draw.ellipse([x + 30, y - 10, x + 90, y + 30], fill=cloud_color)
        draw.ellipse([x + 50, y, x + 110, y + 40], fill=cloud_color)
    
    return Image.alpha_composite(img.convert('RGBA'), overlay)

def draw_glossy_button(draw, x, y, width, height, color1, color2, text, text_color=(255, 255, 255)):
    """绘制有光泽的渐变按钮"""
    
    # 阴影
    shadow_offset = 8
    draw.rounded_rectangle(
        [x + shadow_offset, y + shadow_offset, x + width + shadow_offset, y + height + shadow_offset],
        radius=25,
        fill=(0, 0, 0, 80)
    )
    
    # 按钮主体渐变
    for i in range(height):
        ratio = i / height
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
        
        draw.rectangle([x, y + i, x + width, y + i + 1], fill=(r, g, b))
    
    # 圆角遮罩（简化处理）
    draw.rounded_rectangle([x, y, x + width, y + height], radius=25, outline=None)
    
    # 高光
    highlight_height = height // 3
    for i in range(highlight_height):
        alpha = int(100 * (1 - i / highlight_height))
        draw.rectangle([x + 10, y + 10 + i, x + width - 10, y + 10 + i + 1],
                      fill=(255, 255, 255, alpha))
    
    # 边框
    draw.rounded_rectangle([x, y, x + width, y + height],
                          radius=25,
                          outline=(255, 255, 255, 200),
                          width=4)
    
    # 文字
    try:
        font = ImageFont.truetype("arial.ttf", 36)
    except:
        font = ImageFont.load_default()
    
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    text_x = x + (width - text_width) // 2
    text_y = y + (height - text_height) // 2
    
    # 文字阴影
    draw.text((text_x + 3, text_y + 3), text, fill=(0, 0, 0, 150), font=font)
    # 文字描边
    for dx, dy in [(-1, -1), (-1, 1), (1, -1), (1, 1)]:
        draw.text((text_x + dx, text_y + dy), text, fill=(0, 0, 0, 100), font=font)
    # 文字主体
    draw.text((text_x, text_y), text, fill=text_color, font=font)

def draw_gem_decoration(draw, x, y, size, color):
    """绘制宝石装饰"""
    
    # 宝石形状（六边形）
    points = []
    for i in range(6):
        angle = math.pi * 2 * i / 6
        px = x + size * math.cos(angle)
        py = y + size * math.sin(angle)
        points.append((px, py))
    
    # 宝石主体
    draw.polygon(points, fill=color)
    
    # 宝石高光
    highlight_points = []
    for i in range(3):
        angle = math.pi * 2 * i / 6 - math.pi / 6
        px = x + size * 0.5 * math.cos(angle)
        py = y + size * 0.5 * math.sin(angle)
        highlight_points.append((px, py))
    
    draw.polygon(highlight_points, fill=(255, 255, 255, 150))
    
    # 宝石边框
    draw.polygon(points, outline=(255, 255, 255, 200), width=2)

def create_candy_crush_style_menu():
    """创建Candy Crush风格的主菜单"""
    
    width, height = 750, 1334
    
    print("[Step 1] Creating gradient background...")
    img = create_gradient_background(width, height)
    
    print("[Step 2] Adding decorations...")
    img = add_cute_decorations(img)
    
    # 转换为RGB用于绘制
    img = img.convert('RGB')
    
    # 创建新的RGBA层用于绘制按钮等
    overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    print("[Step 3] Drawing title...")
    # 游戏标题
    try:
        title_font = ImageFont.truetype("arial.ttf", 80)
    except:
        title_font = ImageFont.load_default()
    
    title_text = "炼色"
    bbox = draw.textbbox((0, 0), title_text, font=title_font)
    title_width = bbox[2] - bbox[0]
    title_x = (width - title_width) // 2
    title_y = 200
    
    # 标题阴影
    draw.text((title_x + 5, title_y + 5), title_text,
             fill=(0, 0, 0, 100), font=title_font)
    
    # 标题描边（彩虹色）
    rainbow_colors = [
        hex_to_rgb('#FF0000'),  # 红
        hex_to_rgb('#FF7F00'),  # 橙
        hex_to_rgb('#FFFF00'),  # 黄
        hex_to_rgb('#00FF00'),  # 绿
        hex_to_rgb('#0000FF'),  # 蓝
        hex_to_rgb('#8B00FF'),  # 紫
    ]
    
    for i, color in enumerate(rainbow_colors):
        offset = i * 2
        draw.text((title_x - offset, title_y - offset), title_text,
                 fill=(*color, 150), font=title_font)
    
    # 标题主体（白色）
    draw.text((title_x, title_y), title_text, fill=(255, 255, 255), font=title_font)
    
    print("[Step 4] Drawing gem decorations around title...")
    # 标题周围的宝石装饰
    gem_colors = [
        hex_to_rgb('#F44336'),  # 红
        hex_to_rgb('#FF9800'),  # 橙
        hex_to_rgb('#FFEB3B'),  # 黄
        hex_to_rgb('#4CAF50'),  # 绿
        hex_to_rgb('#2196F3'),  # 蓝
        hex_to_rgb('#9C27B0'),  # 紫
    ]
    
    for i, color in enumerate(gem_colors):
        angle = math.pi * 2 * i / 6
        x = width // 2 + 200 * math.cos(angle)
        y = title_y + 40 + 100 * math.sin(angle)
        draw_gem_decoration(draw, x, y, 25, color)
    
    print("[Step 5] Drawing buttons...")
    # 按钮
    button_width = 500
    button_height = 110
    button_x = (width - button_width) // 2
    button_spacing = 25
    button_start_y = 750
    
    buttons = [
        ("开始游戏", hex_to_rgb('#4CAF50'), hex_to_rgb('#2E7D32')),    # 绿色
        ("继续游戏", hex_to_rgb('#00BCD4'), hex_to_rgb('#0097A7')),    # 青色
        ("设置", hex_to_rgb('#FF9800'), hex_to_rgb('#F57C00')),        # 橙色
        ("退出", hex_to_rgb('#E91E63'), hex_to_rgb('#C2185B')),        # 粉红
    ]
    
    for i, (text, color1, color2) in enumerate(buttons):
        y = button_start_y + i * (button_height + button_spacing)
        draw_glossy_button(draw, button_x, y, button_width, button_height,
                          color1, color2, text)
    
    print("[Step 6] Adding sparkles...")
    # 添加闪光粒子
    random.seed(789)
    for i in range(50):
        x = random.randint(0, width)
        y = random.randint(0, height)
        size = random.randint(3, 8)
        
        # 十字闪光
        draw.line([(x - size, y), (x + size, y)],
                 fill=(255, 255, 255, random.randint(150, 255)), width=2)
        draw.line([(x, y - size), (x, y + size)],
                 fill=(255, 255, 255, random.randint(150, 255)), width=2)
    
    # 合并图层
    img = img.convert('RGBA')
    img = Image.alpha_composite(img, overlay)
    
    # 应用轻微模糊使背景更柔和
    # img = img.filter(ImageFilter.GaussianBlur(radius=0.5))
    
    img = img.convert('RGB')
    
    return img

def generate_candy_style_prototype():
    """生成Candy Crush风格原型"""
    
    output_dir = "candy_style_prototype"
    os.makedirs(output_dir, exist_ok=True)
    
    print("="*60)
    print("[Generating Candy Crush Style Main Menu]")
    print("="*60)
    print()
    
    img = create_candy_crush_style_menu()
    
    print("\n[Step 7] Saving...")
    output_path = os.path.join(output_dir, "main_menu_candy_style.png")
    img.save(output_path, 'PNG', quality=95)
    
    print("\n" + "="*60)
    print("[Complete!]")
    print(f"\nSaved: {output_path}")
    print(f"Size: 750 x 1334")
    print("\n风格特点:")
    print("  ✓ 浅蓝到浅紫渐变背景")
    print("  ✓ 可爱的星星和云朵装饰")
    print("  ✓ 彩虹色标题「炼色」")
    print("  ✓ 6颗彩色宝石装饰")
    print("  ✓ 4个光泽渐变按钮（绿/青/橙/粉）")
    print("  ✓ 闪光粒子效果")
    print("  ✓ 活泼、多彩、游戏化")
    print("="*60)

if __name__ == "__main__":
    generate_candy_style_prototype()
