from PIL import Image
import os

# 创建输出目录
os.makedirs("main_menu_assets", exist_ok=True)

print("《炼色》主界面资源处理脚本")
print("=" * 50)

# 1. 处理背景图
if os.path.exists("main_menu_bg_raw.jpg"):
    print("\n[1/5] 处理背景图...")
    bg = Image.open("main_menu_bg_raw.jpg")
    bg_resized = bg.resize((750, 1334), Image.Resampling.LANCZOS)
    bg_resized.save("main_menu_assets/main_menu_background.jpg", 'JPEG', quality=85, optimize=True)
    size = os.path.getsize("main_menu_assets/main_menu_background.jpg") / 1024
    print(f"  ✓ 背景图完成 (750x1334, {size:.1f}KB)")
else:
    print("\n[1/5] ⚠ 未找到 main_menu_bg_raw.jpg，跳过")

# 2. 处理Logo
if os.path.exists("game_logo_raw.png"):
    print("\n[2/5] 处理Logo...")
    logo = Image.open("game_logo_raw.png")
    logo_resized = logo.resize((512, 256), Image.Resampling.LANCZOS)
    logo_resized.save("main_menu_assets/game_logo.png", 'PNG', optimize=True)
    size = os.path.getsize("main_menu_assets/game_logo.png") / 1024
    print(f"  ✓ Logo完成 (512x256, {size:.1f}KB)")
else:
    print("\n[2/5] ⚠ 未找到 game_logo_raw.png，跳过")

# 3. 处理开始按钮
if os.path.exists("button_start_raw.png"):
    print("\n[3/5] 处理开始按钮...")
    btn = Image.open("button_start_raw.png")
    btn_resized = btn.resize((450, 100), Image.Resampling.LANCZOS)
    btn_resized.save("main_menu_assets/btn_start.png", 'PNG', optimize=True)
    size = os.path.getsize("main_menu_assets/btn_start.png") / 1024
    print(f"  ✓ 开始按钮完成 (450x100, {size:.1f}KB)")
else:
    print("\n[3/5] ⚠ 未找到 button_start_raw.png，跳过")

# 4. 处理次要按钮
if os.path.exists("button_secondary_raw.png"):
    print("\n[4/5] 处理次要按钮...")
    btn2 = Image.open("button_secondary_raw.png")
    btn2_resized = btn2.resize((350, 80), Image.Resampling.LANCZOS)
    btn2_resized.save("main_menu_assets/btn_secondary.png", 'PNG', optimize=True)
    size = os.path.getsize("main_menu_assets/btn_secondary.png") / 1024
    print(f"  ✓ 次要按钮完成 (350x80, {size:.1f}KB)")
else:
    print("\n[4/5] ⚠ 未找到 button_secondary_raw.png，跳过")

# 5. 处理装饰元素
if os.path.exists("gem_decoration_raw.png"):
    print("\n[5/5] 处理装饰元素...")
    gem = Image.open("gem_decoration_raw.png")
    gem_resized = gem.resize((256, 256), Image.Resampling.LANCZOS)
    gem_resized.save("main_menu_assets/gem_decoration.png", 'PNG', optimize=True)
    size = os.path.getsize("main_menu_assets/gem_decoration.png") / 1024
    print(f"  ✓ 装饰元素完成 (256x256, {size:.1f}KB)")
else:
    print("\n[5/5] ⚠ 未找到 gem_decoration_raw.png，跳过")

print("\n" + "=" * 50)
print("处理完成！")
print("输出目录：main_menu_assets/")
print("\n生成的资源：")

# 列出生成的文件
if os.path.exists("main_menu_assets"):
    for file in os.listdir("main_menu_assets"):
        filepath = os.path.join("main_menu_assets", file)
        size = os.path.getsize(filepath) / 1024
        print(f"  - {file} ({size:.1f}KB)")
