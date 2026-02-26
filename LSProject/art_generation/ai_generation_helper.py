"""
《炼色》主界面 - AI生成助手
自动复制提示词到剪贴板，方便快速生成
"""

import pyperclip
import time
import os

# 提示词列表
prompts = {
    "1_background": {
        "name": "主界面背景",
        "size": "750x1334",
        "save_as": "main_menu_bg_raw.jpg",
        "prompt": """Mobile game main menu background, vertical portrait orientation,
deep space theme with dark blue purple gradient background,
scattered glowing white stars and nebula clouds,
sci-fi cartoon style, dreamy atmosphere,
color palette: dark navy blue (#1a1a2e) to deep blue (#0f3460),
professional game art, high quality,
no UI elements, no text, no buttons, no characters,
clean and simple composition, suitable for puzzle match-3 game"""
    },
    "2_logo": {
        "name": "游戏Logo",
        "size": "512x256",
        "save_as": "game_logo_raw.png",
        "prompt": """Game logo design for "LianSe" (炼色),
colorful gradient text effect with rainbow colors,
glowing neon edges, holographic style,
vibrant colors: red, orange, yellow, cyan, blue, purple gradient,
sci-fi cartoon style, modern game title design,
transparent background, PNG format,
professional game logo, high quality,
no background elements, only the logo text,
suitable for mobile puzzle game"""
    },
    "3_button_start": {
        "name": "开始按钮",
        "size": "450x100",
        "save_as": "button_start_raw.png",
        "prompt": """Game UI button, single button design,
rounded rectangle shape with smooth corners,
purple to dark purple gradient (#667eea to #764ba2),
glowing effect with soft light, white border outline,
sci-fi cartoon style, modern game UI design,
glossy surface with subtle highlights,
transparent or solid color background,
no text, no icons, just the button shape,
professional game UI asset, high quality,
suitable for mobile game interface"""
    },
    "4_button_secondary": {
        "name": "次要按钮",
        "size": "350x80",
        "save_as": "button_secondary_raw.png",
        "prompt": """Game UI button, secondary button style,
rounded rectangle shape, smaller size,
cyan to teal gradient (#4ECDC4 to #44A08D),
subtle glow effect, white border outline,
sci-fi cartoon style, modern game UI design,
glossy surface, transparent background,
no text, no icons, just the button shape,
professional game UI asset, high quality"""
    },
    "5_gem": {
        "name": "装饰宝石",
        "size": "256x256",
        "save_as": "gem_decoration_raw.png",
        "prompt": """Glowing gem icon for game decoration,
rounded square shape with smooth corners,
red to orange gradient (#FF6B6B to #FF8E53),
glossy crystal surface with white highlight on top,
glowing edges with soft light effect,
sci-fi cartoon style, vibrant colors,
transparent background, PNG format,
professional game icon, high quality,
no text, no background elements,
suitable for mobile puzzle game decoration"""
    }
}

def main():
    print("=" * 70)
    print("《炼色》主界面 - AI生成助手")
    print("=" * 70)
    print("\n这个工具会帮你快速复制提示词到剪贴板")
    print("然后你可以直接粘贴到Bing Image Creator\n")
    
    print("📋 需要生成的资源：")
    for key, info in prompts.items():
        print(f"  {key}. {info['name']} ({info['size']})")
    
    print("\n" + "=" * 70)
    print("开始生成流程...")
    print("=" * 70)
    
    for key, info in prompts.items():
        print(f"\n\n{'='*70}")
        print(f"[{key}] {info['name']}")
        print(f"目标尺寸: {info['size']}")
        print(f"保存为: {info['save_as']}")
        print("=" * 70)
        
        print("\n提示词：")
        print("-" * 70)
        print(info['prompt'])
        print("-" * 70)
        
        # 复制到剪贴板
        try:
            pyperclip.copy(info['prompt'])
            print("\n✅ 提示词已复制到剪贴板！")
        except:
            print("\n⚠️  无法自动复制，请手动复制上面的提示词")
        
        print("\n📝 操作步骤：")
        print("  1. 打开 https://www.bing.com/images/create")
        print("  2. 粘贴提示词（Ctrl+V）")
        print("  3. 点击'创建'按钮")
        print("  4. 等待生成（约30-60秒）")
        print("  5. 选择最满意的一张")
        if ".png" in info['save_as']:
            print("  6. 点击'编辑' → 使用'擦除'去背景 → 使用'裁剪'")
        print(f"  7. 下载保存为: {info['save_as']}")
        
        print("\n" + "=" * 70)
        input("按回车继续下一个资源...")
    
    print("\n\n" + "=" * 70)
    print("✅ 所有提示词已准备完成！")
    print("=" * 70)
    
    print("\n📥 下载完成后，运行处理脚本：")
    print("  cd E:\\Project\\LianSe\\LSProject\\art_generation")
    print("  python process_main_menu.py")
    
    print("\n" + "=" * 70)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n已取消")
    except Exception as e:
        print(f"\n错误: {e}")
