#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
复制Kenney UI资源到项目assets目录
根据UI_BEAUTIFY_UPGRADE.md的方案
"""

import os
import sys
import shutil

# 设置UTF-8输出
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# 资源映射：目标文件名 -> (颜色, 源文件名)
UI_RESOURCES = {
    # 主菜单按钮
    'start_button.png': ('Green', 'button_rectangle_depth_gradient.png'),
    'settings_button.png': ('Blue', 'button_square_depth_flat.png'),
    'exit_button.png': ('Red', 'button_rectangle_depth_border.png'),
    
    # 技能按钮
    'skill_button_red.png': ('Red', 'button_round_depth_gloss.png'),
    'skill_button_blue.png': ('Blue', 'button_round_depth_gloss.png'),
    'skill_button_yellow.png': ('Yellow', 'button_round_depth_gloss.png'),
    
    # 暂停按钮
    'pause_button.png': ('Blue', 'button_round_depth_border.png'),
    
    # 进度条
    'bar_red_fill.png': ('Red', 'slide_horizontal_color_section_wide.png'),
    'bar_blue_fill.png': ('Blue', 'slide_horizontal_color_section_wide.png'),
    'bar_yellow_fill.png': ('Yellow', 'slide_horizontal_color_section_wide.png'),
    'bar_grey_bg.png': ('Grey', 'slide_horizontal_grey.png'),
    
    # 星星
    'star_empty.png': ('Yellow', 'star_outline_depth.png'),
    'star_filled.png': ('Yellow', 'star.png'),
    
    # 图标
    'icon_checkmark.png': ('Green', 'icon_checkmark.png'),
    'icon_cross.png': ('Red', 'icon_cross.png'),
}

def copy_ui_resources():
    """复制UI资源到项目"""
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    source_base = os.path.join(base_dir, 'kenney', 'PNG')
    target_dir = os.path.join(os.path.dirname(base_dir), 'assets', 'textures', 'ui_kenney')
    
    # 创建目标目录
    os.makedirs(target_dir, exist_ok=True)
    
    print(f"[Copy] Copying UI resources...")
    print(f"[Source] {source_base}")
    print(f"[Target] {target_dir}")
    print()
    
    success_count = 0
    fail_count = 0
    
    for target_name, (color, source_name) in UI_RESOURCES.items():
        source_path = os.path.join(source_base, color, 'Double', source_name)
        target_path = os.path.join(target_dir, target_name)
        
        try:
            if os.path.exists(source_path):
                shutil.copy2(source_path, target_path)
                print(f"[OK] {target_name} <- {color}/{source_name}")
                success_count += 1
            else:
                print(f"[SKIP] {target_name} (source not found: {source_name})")
                fail_count += 1
        except Exception as e:
            print(f"[ERROR] {target_name}: {e}")
            fail_count += 1
    
    print()
    print(f"[Summary] Success: {success_count}, Failed: {fail_count}")
    print(f"[Location] {target_dir}")
    
    # 删除临时zip文件
    zip_path = os.path.join(base_dir, 'kenney_ui_pack.zip')
    if os.path.exists(zip_path):
        os.remove(zip_path)
        print(f"[Clean] Removed temporary zip file")

if __name__ == "__main__":
    copy_ui_resources()
