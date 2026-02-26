#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
处理主菜单原画图
1. 调整尺寸到750x1334
2. 提取4个按钮
3. 生成背景图（去掉按钮区域）
"""

import os
import sys
from PIL import Image, ImageDraw

# 设置UTF-8输出
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def process_main_menu(input_path, output_dir):
    """处理主菜单原画"""
    
    print("[Step 1] Loading image...")
    img = Image.open(input_path)
    print(f"Original size: {img.width} x {img.height}")
    
    # 目标尺寸（微信小游戏竖屏标准）
    target_width = 750
    target_height = 1334
    
    print(f"\n[Step 2] Resizing to {target_width} x {target_height}...")
    # 使用高质量重采样
    img_resized = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    # 保存调整后的完整图（用于参考）
    full_path = os.path.join(output_dir, "main_menu_full_resized.png")
    img_resized.save(full_path, 'PNG', quality=95)
    print(f"Saved: {full_path}")
    
    # 创建一个副本用于标记
    img_marked = img_resized.copy()
    draw = ImageDraw.Draw(img_marked)
    
    print(f"\n[Step 3] Detecting button regions...")
    print("Please manually define button positions in the script.")
    print("Current image size: 750 x 1334")
    print("\nSuggested button regions (you need to adjust):")
    
    # 假设按钮位置（需要根据实际图片调整）
    # 格式：(x, y, width, height, name)
    button_regions = [
        # 示例：假设按钮在底部区域，垂直排列
        (150, 800, 450, 100, "button_1_start"),      # 开始游戏
        (150, 920, 450, 100, "button_2_continue"),   # 继续游戏
        (150, 1040, 450, 100, "button_3_settings"),  # 设置
        (150, 1160, 450, 100, "button_4_exit"),      # 退出
    ]
    
    # 在图上标记按钮区域
    for i, (x, y, w, h, name) in enumerate(button_regions):
        # 绘制矩形框
        draw.rectangle([x, y, x+w, y+h], outline='red', width=3)
        # 绘制标签
        draw.text((x+10, y+10), f"{i+1}: {name}", fill='red')
        print(f"  Button {i+1}: x={x}, y={y}, w={w}, h={h} -> {name}")
    
    # 保存标记图
    marked_path = os.path.join(output_dir, "main_menu_marked.png")
    img_marked.save(marked_path, 'PNG')
    print(f"\nSaved marked image: {marked_path}")
    print("Please check this image and adjust button_regions in the script if needed.")
    
    print(f"\n[Step 4] Extracting buttons...")
    # 提取按钮
    for i, (x, y, w, h, name) in enumerate(button_regions):
        button_img = img_resized.crop((x, y, x+w, y+h))
        button_path = os.path.join(output_dir, f"{name}.png")
        button_img.save(button_path, 'PNG', quality=95)
        print(f"  Extracted: {button_path} ({w}x{h})")
    
    print(f"\n[Step 5] Creating background (without buttons)...")
    # 创建背景图（将按钮区域填充为背景色或模糊）
    img_bg = img_resized.copy()
    draw_bg = ImageDraw.Draw(img_bg)
    
    # 简单方法：用周围颜色填充按钮区域
    # 更好的方法：使用内容感知填充（需要更复杂的算法）
    for x, y, w, h, name in button_regions:
        # 获取按钮周围的平均颜色
        # 这里简单处理：用按钮上方的颜色填充
        if y > 10:
            sample_region = img_resized.crop((x, y-10, x+w, y))
            avg_color = sample_region.resize((1, 1), Image.Resampling.LANCZOS).getpixel((0, 0))
            draw_bg.rectangle([x, y, x+w, y+h], fill=avg_color)
    
    bg_path = os.path.join(output_dir, "main_menu_background.png")
    img_bg.save(bg_path, 'PNG', quality=95)
    print(f"Saved: {bg_path}")
    
    print("\n" + "="*60)
    print("[Complete!]")
    print(f"Output directory: {output_dir}")
    print("\nGenerated files:")
    print("  1. main_menu_full_resized.png - Full image (750x1334)")
    print("  2. main_menu_marked.png - Marked with button regions")
    print("  3. button_1_start.png - Button 1")
    print("  4. button_2_continue.png - Button 2")
    print("  5. button_3_settings.png - Button 3")
    print("  6. button_4_exit.png - Button 4")
    print("  7. main_menu_background.png - Background without buttons")
    print("="*60)

if __name__ == "__main__":
    input_path = "main_menu_original.png"
    output_dir = "main_menu_processed"
    
    # 创建输出目录
    os.makedirs(output_dir, exist_ok=True)
    
    process_main_menu(input_path, output_dir)
