#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
《技能消消消》主菜单 - B套升级版
卡通魔法风格 + 更多细节和层次
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

def create_radial_gradient(width, height, center_color, edge_color):
    """创建径向渐变"""
    img = Image.new('RGB', (width, height))
    cx, cy = width // 2, height // 2
    max_distance = math.sqrt(cx**2 + cy**2)
    
    for y in range(height):
        for x in range(width):
            distance = math.sqrt((x - cx)**2 + (y - cy)**2)
            ratio = min(distance / max_distance, 1.0)
            
            r = int(center_color[0] * (1 - ratio) + edge_color[0] * ratio)
            g = int(center_color[1] * (1 - ratio) + edge_color[1] * ratio)
            b = int(center_color[2] * (1 - ratio) + edge_color[2] * ratio)
            
            img.putpixel((x, y), (r, g, b))
    
    return img

def draw_glowing_gem(draw, x, y, size, color, glow_color):
    """绘制发光宝石（更炫）"""
    
    # 外发光（多层）
    for i in range(8):
        radius = size + i * 5
        alpha = 150 - i * 15
        
        points = []
        for j in range(6):
            angle = math.pi * 2 * j / 6
            px = x + radius * math.cos(angle)
            py = y + radius * math.sin(angle)
            points.append((px, py))
        
        # 简化处理：直接用颜色
        glow = tuple(int(glow_color[k] * alpha / 255) for k in range(3))
        draw.polygon(points, fill=glow)
    
    # 宝石主体
    points = []
    for i in range(6):
        angle = math.pi * 2 * i / 6
        px = x + size * math.cos(angle)
        py = y + size * math.sin(angle)
        points.append((px, py))
    
    draw.polygon(points, fill=color)
    
    # 内部切面（增加立体感）
    inner_points = []
    for i in range(6):
        angle = math.pi * 2 * i / 6
        px = x + size * 0.6 * math.cos(angle)
        py = y + size * 0.6 * math.sin(angle)
        inner_points.append((px, py))
    
    darker = tuple(max(c - 40, 0) for c in color)
    draw.polygon(inner_points, fill=darker)
    
    # 高光
    highlight_points = [
        (x - size * 0.3, y - size * 0.6),
        (x + size * 0.3, y - size * 0.6),
        (x, y - size * 0.1)
    ]
    draw.polygon(highlight_points, fill=(255, 255, 255))
    
    # 边框
    draw.polygon(points, outline=(255, 255, 255), width=4)

def draw_super_button(draw, x, y, width, height, color1, color2, text):
    """绘制超炫按钮"""
    
    # 外发光
    for i in range(6):
        offset = i * 4
        alpha = 120 - i * 20
        glow = tuple(int(color1[k] * alpha / 255) for k in range(3))
        draw.rounded_rectangle(
            [x - offset, y - offset, x + width + offset, y + height + offset],
            radius=30 + i * 2,
            fill=glow
        )
    
    # 阴影
    draw.rounded_rectangle(
        [x + 8, y + 8, x + width + 8, y + height + 8],
        radius=30,
        fill=(0, 0, 0, 100)
    )
    
    # 按钮主体渐变
    for i in range(height):
        ratio = i / height
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
        
        # 圆角处理（简化）
        if i < 30 or i > height - 30:
            continue
        draw.rectangle([x, y + i, x + width, y + i + 1], fill=(r, g, b))
    
    # 重新绘制圆角
    draw.rounded_rectangle([x, y, x + width, y + height], radius=30, fill=None, outline=None)
    
    # 顶部高光
    highlight_height = height // 2
    for i in range(highlight_height):
        alpha = int(120 * (1 - i / highlight_height))
        if alpha > 0:
            draw.rectangle([x + 15, y + 15 + i, x + width - 15, y + 15 + i + 1],
                          fill=(255, 255, 255, alpha))
    
    # 边框（双层）
    draw.rounded_rectangle([x, y, x + width, y + height],
                          radius=30, outline=(255, 255, 255), width=5)
    draw.rounded_rectangle([x + 3, y + 3, x + width - 3, y + height - 3],
                          radius=27, outline=color1, width=2)
    
    # 文字
    try:
        font = ImageFont.truetype("arial.ttf", 40)
    except:
        font = ImageFont.load_default()
    
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    text_x = x + (width - text_width) // 2
    text_y = y + (height - text_height) // 2
    
    # 文字多层阴影
    for i in range(4):
        offset = i + 1
        alpha = 200 - i * 50
        draw.text((text_x + offset, text_y + offset), text,
                 fill=(0, 0, 0, alpha), font=font)
    
    # 文字描边
    for dx in [-2, -1, 0, 1, 2]:
        for dy in [-2, -1, 0, 1, 2]:
            if dx != 0 or dy != 0:
                draw.text((text_x + dx, text_y + dy), text,
                         fill=(0, 0, 0, 150), font=font)
    
    # 文字主体
    draw.text((text_x, text_y), text, fill=(255, 255, 255), font=font)

def create_enhanced_magic_menu():
    """创建增强版魔法主菜单"""
    
    width, height = 750, 1334
    
    print("[Step 1] Creating radial gradient background...")
    # 径向渐变背景
    img = create_radial_gradient(width, height,
                                 hex_to_rgb('#6A1B9A'),  # 中心紫
                                 hex_to_rgb('#0D1B2A'))  # 边缘深蓝黑
    
    draw = ImageDraw.Draw(img)
    
    print("[Step 2] Adding magic circles...")
    # 大型魔法阵（背景层）
    cx, cy = width // 2, height // 2
    
    for i in range(6):
        radius = 150 + i * 40
        alpha = 60 - i * 8
        color = hex_to_rgb('#FFD700')
        draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius],
                    outline=(*color, alpha), width=2)
    
    # 符文线
    for i in range(12):
        angle = math.pi * 2 * i / 12
        x1 = cx + 350 * math.cos(angle)
        y1 = cy + 350 * math.sin(angle)
        x2 = cx + 200 * math.cos(angle)
        y2 = cy + 200 * math.sin(angle)
        
        draw.line([(x1, y1), (x2, y2)], fill=hex_to_rgb('#FFD700'), width=2)
    
    print("[Step 3] Adding magic particles...")
    # 魔法粒子（更多、更亮）
    random.seed(456)
    particle_colors = [
        hex_to_rgb('#FFD700'),  # 金
        hex_to_rgb('#FF1493'),  # 粉
        hex_to_rgb('#00FFFF'),  # 青
        hex_to_rgb('#DA70D6'),  # 兰花紫
        hex_to_rgb('#FF69B4'),  # 热粉
    ]
    
    for i in range(150):
        x = random.randint(0, width)
        y = random.randint(0, height)
        size = random.randint(2, 6)
        color = random.choice(particle_colors)
        
        # 粒子发光
        for j in range(3):
            r = size + j * 2
            draw.ellipse([x - r, y - r, x + r, y + r], fill=color)
        
        # 十字光芒
        if size > 3:
            length = size * 2
            draw.line([(x - length, y), (x + length, y)], fill=color, width=2)
            draw.line([(x, y - length), (x, y + length)], fill=color, width=2)
    
    print("[Step 4] Drawing title...")
    # 超大标题
    try:
        font = ImageFont.truetype("arial.ttf", 90)
    except:
        font = ImageFont.load_default()
    
    title_text = "技能消消消"
    bbox = draw.textbbox((0, 0), title_text, font=font)
    title_width = bbox[2] - bbox[0]
    title_x = (width - title_width) // 2
    title_y = 120
    
    # 标题外发光（多层）
    for i in range(10):
        offset = i * 3
        alpha = 200 - i * 20
        glow_color = hex_to_rgb('#FFD700')
        draw.text((title_x + offset, title_y + offset), title_text,
                 fill=(*glow_color, alpha), font=font)
    
    # 标题彩虹描边
    rainbow = [
        hex_to_rgb('#FF0000'),
        hex_to_rgb('#FF7F00'),
        hex_to_rgb('#FFFF00'),
        hex_to_rgb('#00FF00'),
        hex_to_rgb('#0000FF'),
        hex_to_rgb('#8B00FF'),
    ]
    
    for i, color in enumerate(rainbow):
        offset = -i * 2
        draw.text((title_x + offset, title_y + offset), title_text,
                 fill=color, font=font)
    
    # 标题主体
    draw.text((title_x, title_y), title_text, fill=(255, 255, 255), font=font)
    
    print("[Step 5] Drawing glowing gems...")
    # 发光宝石（更大、更炫）
    gem_data = [
        (hex_to_rgb('#FF0000'), hex_to_rgb('#FF6B6B')),  # 红
        (hex_to_rgb('#FF7F00'), hex_to_rgb('#FFA500')),  # 橙
        (hex_to_rgb('#FFFF00'), hex_to_rgb('#FFFF99')),  # 黄
        (hex_to_rgb('#00FF00'), hex_to_rgb('#90EE90')),  # 绿
        (hex_to_rgb('#0000FF'), hex_to_rgb('#6495ED')),  # 蓝
        (hex_to_rgb('#8B00FF'), hex_to_rgb('#DA70D6')),  # 紫
    ]
    
    for i, (color, glow) in enumerate(gem_data):
        angle = math.pi * 2 * i / 6 - math.pi / 2
        x = int(width // 2 + 320 * math.cos(angle))
        y = int(title_y + 80 + 180 * math.sin(angle))
        draw_glowing_gem(draw, x, y, 40, color, glow)
    
    print("[Step 6] Drawing super buttons...")
    # 超炫按钮
    button_width = 520
    button_height = 100
    button_x = (width - button_width) // 2
    button_spacing = 30
    button_start_y = 780
    
    buttons = [
        ("开始游戏", hex_to_rgb('#9C27B0'), hex_to_rgb('#6A1B9A')),
        ("继续游戏", hex_to_rgb('#2196F3'), hex_to_rgb('#1565C0')),
        ("设置", hex_to_rgb('#FF9800'), hex_to_rgb('#E65100')),
        ("退出", hex_to_rgb('#E91E63'), hex_to_rgb('#AD1457')),
    ]
    
    for i, (text, color1, color2) in enumerate(buttons):
        y = button_start_y + i * (button_height + button_spacing)
        draw_super_button(draw, button_x, y, button_width, button_height,
                         color1, color2, text)
    
    print("[Step 7] Adding final touches...")
    # 添加闪光效果
    random.seed(999)
    for i in range(30):
        x = random.randint(0, width)
        y = random.randint(0, height)
        size = random.randint(10, 25)
        
        # 四角星光
        draw.line([(x - size, y), (x + size, y)], fill=(255, 255, 255, 200), width=3)
        draw.line([(x, y - size), (x, y + size)], fill=(255, 255, 255, 200), width=3)
        draw.line([(x - size//2, y - size//2), (x + size//2, y + size//2)],
                 fill=(255, 255, 255, 150), width=2)
        draw.line([(x - size//2, y + size//2), (x + size//2, y - size//2)],
                 fill=(255, 255, 255, 150), width=2)
    
    return img

def generate_enhanced():
    """生成增强版"""
    
    output_dir = "skill_match_enhanced"
    os.makedirs(output_dir, exist_ok=True)
    
    print("="*60)
    print("[《技能消消消》主菜单 - 增强版]")
    print("="*60)
    print()
    
    img = create_enhanced_magic_menu()
    
    print("\n[Step 8] Saving...")
    output_path = os.path.join(output_dir, "main_menu_enhanced.png")
    img.save(output_path, 'PNG', quality=95)
    
    print("\n" + "="*60)
    print("[Complete!]")
    print(f"\nSaved: {output_path}")
    print("\n增强特性:")
    print("  ✓ 径向渐变背景（更有深度）")
    print("  ✓ 大型魔法阵（6层圆圈+12条符文线）")
    print("  ✓ 150个魔法粒子（5种颜色+十字光芒）")
    print("  ✓ 超大标题（90号字体+10层发光+彩虹描边）")
    print("  ✓ 6颗发光宝石（8层外发光+立体切面）")
    print("  ✓ 超炫按钮（6层外发光+双层边框+多层阴影）")
    print("  ✓ 30个四角星光效果")
    print("  ✓ 更丰富的色彩和层次")
    print("="*60)

if __name__ == "__main__":
    generate_enhanced()
