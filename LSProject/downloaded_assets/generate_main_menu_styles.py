#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
代码生成主菜单原画图 - 多种风格
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFont
import math

# 设置UTF-8输出
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def create_gradient(width, height, color1, color2, direction='vertical'):
    """创建渐变背景"""
    base = Image.new('RGB', (width, height), color1)
    top = Image.new('RGB', (width, height), color2)
    mask = Image.new('L', (width, height))
    mask_data = []
    
    for y in range(height):
        for x in range(width):
            if direction == 'vertical':
                mask_data.append(int(255 * (y / height)))
            elif direction == 'horizontal':
                mask_data.append(int(255 * (x / width)))
            elif direction == 'diagonal':
                mask_data.append(int(255 * ((x + y) / (width + height))))
    
    mask.putdata(mask_data)
    base.paste(top, (0, 0), mask)
    return base

def hex_to_rgb(hex_color):
    """十六进制颜色转RGB"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def draw_rounded_rectangle(draw, xy, radius, fill, outline=None, width=1):
    """绘制圆角矩形"""
    x1, y1, x2, y2 = xy
    
    # 绘制四个角的圆
    draw.ellipse([x1, y1, x1 + radius * 2, y1 + radius * 2], fill=fill, outline=outline, width=width)
    draw.ellipse([x2 - radius * 2, y1, x2, y1 + radius * 2], fill=fill, outline=outline, width=width)
    draw.ellipse([x1, y2 - radius * 2, x1 + radius * 2, y2], fill=fill, outline=outline, width=width)
    draw.ellipse([x2 - radius * 2, y2 - radius * 2, x2, y2], fill=fill, outline=outline, width=width)
    
    # 绘制矩形主体
    draw.rectangle([x1 + radius, y1, x2 - radius, y2], fill=fill, outline=outline, width=width)
    draw.rectangle([x1, y1 + radius, x2, y2 - radius], fill=fill, outline=outline, width=width)

def create_button(width, height, color, text="", radius=15):
    """创建按钮"""
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 阴影
    shadow_offset = 5
    draw_rounded_rectangle(draw, 
                          [shadow_offset, shadow_offset, width, height], 
                          radius, 
                          fill=(0, 0, 0, 100))
    
    # 按钮主体
    draw_rounded_rectangle(draw, 
                          [0, 0, width - shadow_offset, height - shadow_offset], 
                          radius, 
                          fill=color,
                          outline=(255, 255, 255, 200),
                          width=3)
    
    # 高光
    highlight_height = (height - shadow_offset) // 3
    draw_rounded_rectangle(draw,
                          [5, 5, width - shadow_offset - 5, highlight_height],
                          radius - 5,
                          fill=(255, 255, 255, 80))
    
    return img

def style_1_purple_dream(output_dir):
    """风格1：紫色梦幻"""
    print("\n[Style 1] Purple Dream - 紫色梦幻")
    
    width, height = 750, 1334
    
    # 渐变背景：深紫到浅紫
    img = create_gradient(width, height, 
                         hex_to_rgb('#4A148C'), 
                         hex_to_rgb('#9C27B0'))
    
    draw = ImageDraw.Draw(img)
    
    # 添加装饰圆圈
    for i in range(20):
        x = (i * 123) % width
        y = (i * 234) % height
        size = 50 + (i * 17) % 100
        alpha = 30 + (i * 13) % 50
        
        overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        overlay_draw = ImageDraw.Draw(overlay)
        overlay_draw.ellipse([x, y, x + size, y + size], 
                            fill=(255, 255, 255, alpha))
        img = Image.alpha_composite(img.convert('RGBA'), overlay)
    
    img = img.convert('RGB')
    
    # 保存
    path = os.path.join(output_dir, "style_1_purple_dream.png")
    img.save(path, 'PNG', quality=95)
    print(f"Saved: {path}")
    
    return img

def style_2_blue_ocean(output_dir):
    """风格2：蓝色海洋"""
    print("\n[Style 2] Blue Ocean - 蓝色海洋")
    
    width, height = 750, 1334
    
    # 渐变背景：深蓝到浅蓝
    img = create_gradient(width, height,
                         hex_to_rgb('#0D47A1'),
                         hex_to_rgb('#42A5F5'))
    
    draw = ImageDraw.Draw(img)
    
    # 添加波浪效果
    overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    
    for wave in range(5):
        y_offset = wave * 250
        for x in range(0, width, 10):
            y = y_offset + int(30 * math.sin(x / 50 + wave))
            overlay_draw.ellipse([x, y, x + 40, y + 40],
                                fill=(255, 255, 255, 20))
    
    img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')
    
    path = os.path.join(output_dir, "style_2_blue_ocean.png")
    img.save(path, 'PNG', quality=95)
    print(f"Saved: {path}")
    
    return img

def style_3_sunset_gradient(output_dir):
    """风格3：日落渐变"""
    print("\n[Style 3] Sunset Gradient - 日落渐变")
    
    width, height = 750, 1334
    
    # 多层渐变：橙红到粉紫
    img = Image.new('RGB', (width, height))
    
    for y in range(height):
        # 计算当前行的颜色
        ratio = y / height
        
        if ratio < 0.3:
            # 顶部：深橙
            r = int(255 * (1 - ratio / 0.3) + 230 * (ratio / 0.3))
            g = int(100 * (1 - ratio / 0.3) + 126 * (ratio / 0.3))
            b = int(0 * (1 - ratio / 0.3) + 34 * (ratio / 0.3))
        elif ratio < 0.7:
            # 中部：粉红
            local_ratio = (ratio - 0.3) / 0.4
            r = int(230 * (1 - local_ratio) + 233 * local_ratio)
            g = int(126 * (1 - local_ratio) + 69 * local_ratio)
            b = int(34 * (1 - local_ratio) + 96 * local_ratio)
        else:
            # 底部：深紫
            local_ratio = (ratio - 0.7) / 0.3
            r = int(233 * (1 - local_ratio) + 156 * local_ratio)
            g = int(69 * (1 - local_ratio) + 39 * local_ratio)
            b = int(96 * (1 - local_ratio) + 176 * local_ratio)
        
        for x in range(width):
            img.putpixel((x, y), (r, g, b))
    
    # 添加星星
    overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    
    for i in range(100):
        x = (i * 137) % width
        y = (i * 211) % (height // 2)  # 只在上半部分
        size = 2 + (i * 7) % 4
        overlay_draw.ellipse([x, y, x + size, y + size],
                            fill=(255, 255, 255, 150 + (i * 11) % 100))
    
    img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')
    
    path = os.path.join(output_dir, "style_3_sunset_gradient.png")
    img.save(path, 'PNG', quality=95)
    print(f"Saved: {path}")
    
    return img

def style_4_geometric(output_dir):
    """风格4：几何图案"""
    print("\n[Style 4] Geometric - 几何图案")
    
    width, height = 750, 1334
    
    # 基础渐变
    img = create_gradient(width, height,
                         hex_to_rgb('#1A237E'),
                         hex_to_rgb('#3F51B5'))
    
    # 添加几何图案
    overlay = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    
    # 三角形网格
    triangle_size = 100
    for row in range(0, height // triangle_size + 1):
        for col in range(0, width // triangle_size + 1):
            x = col * triangle_size
            y = row * triangle_size
            
            # 随机颜色和透明度
            alpha = 20 + ((row + col) * 13) % 40
            
            # 上三角
            overlay_draw.polygon([(x, y), (x + triangle_size, y), 
                                 (x + triangle_size // 2, y + triangle_size)],
                                fill=(255, 255, 255, alpha))
            
            # 下三角
            overlay_draw.polygon([(x, y + triangle_size), 
                                 (x + triangle_size, y + triangle_size),
                                 (x + triangle_size // 2, y)],
                                fill=(100, 100, 255, alpha))
    
    img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')
    
    path = os.path.join(output_dir, "style_4_geometric.png")
    img.save(path, 'PNG', quality=95)
    print(f"Saved: {path}")
    
    return img

def style_5_minimalist(output_dir):
    """风格5：极简主义"""
    print("\n[Style 5] Minimalist - 极简主义")
    
    width, height = 750, 1334
    
    # 纯色背景
    img = Image.new('RGB', (width, height), hex_to_rgb('#ECEFF1'))
    draw = ImageDraw.Draw(img)
    
    # 添加简单的色块装饰
    colors = ['#FF5252', '#448AFF', '#69F0AE', '#FFD740']
    
    for i, color in enumerate(colors):
        x = 50 + i * 150
        y = 200 + i * 50
        size = 100 + i * 20
        
        draw.rectangle([x, y, x + size, y + size],
                      fill=hex_to_rgb(color))
    
    # 添加细线装饰
    for i in range(10):
        y = 100 + i * 120
        draw.line([(100, y), (650, y)], fill='#90A4AE', width=2)
    
    path = os.path.join(output_dir, "style_5_minimalist.png")
    img.save(path, 'PNG', quality=95)
    print(f"Saved: {path}")
    
    return img

def generate_all_styles():
    """生成所有风格"""
    
    output_dir = "main_menu_generated"
    os.makedirs(output_dir, exist_ok=True)
    
    print("="*60)
    print("[Generating Main Menu Backgrounds]")
    print("="*60)
    
    style_1_purple_dream(output_dir)
    style_2_blue_ocean(output_dir)
    style_3_sunset_gradient(output_dir)
    style_4_geometric(output_dir)
    style_5_minimalist(output_dir)
    
    print("\n" + "="*60)
    print("[Complete!]")
    print(f"Generated 5 styles in: {output_dir}")
    print("\nStyles:")
    print("  1. Purple Dream - 紫色梦幻（渐变+装饰圆）")
    print("  2. Blue Ocean - 蓝色海洋（渐变+波浪）")
    print("  3. Sunset Gradient - 日落渐变（多层渐变+星星）")
    print("  4. Geometric - 几何图案（三角形网格）")
    print("  5. Minimalist - 极简主义（纯色+色块）")
    print("="*60)

if __name__ == "__main__":
    generate_all_styles()
