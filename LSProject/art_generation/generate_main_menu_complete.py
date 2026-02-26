from PIL import Image, ImageDraw, ImageFont
import random
import os
import sys

# 设置UTF-8编码
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

print("《炼色》主界面资源自动生成")
print("=" * 60)

# 创建输出目录
output_dir = "main_menu_assets"
os.makedirs(output_dir, exist_ok=True)

# ============================================================
# 1. 生成主界面背景图 (750x1334)
# ============================================================
print("\n[1/5] 生成主界面背景图...")

width, height = 750, 1334
bg = Image.new('RGB', (width, height))
draw = ImageDraw.Draw(bg)

# 三段式渐变背景
color_top = (26, 26, 46)      # #1a1a2e
color_mid = (22, 33, 62)      # #16213e
color_bottom = (15, 52, 96)   # #0f3460

# 上半部分渐变 (0-50%)
for y in range(height // 2):
    progress = y / (height // 2)
    r = int(color_top[0] + (color_mid[0] - color_top[0]) * progress)
    g = int(color_top[1] + (color_mid[1] - color_top[1]) * progress)
    b = int(color_top[2] + (color_mid[2] - color_top[2]) * progress)
    draw.rectangle([0, y, width, y + 1], fill=(r, g, b))

# 下半部分渐变 (50-100%)
for y in range(height // 2, height):
    progress = (y - height // 2) / (height // 2)
    r = int(color_mid[0] + (color_bottom[0] - color_mid[0]) * progress)
    g = int(color_mid[1] + (color_bottom[1] - color_mid[1]) * progress)
    b = int(color_mid[2] + (color_bottom[2] - color_mid[2]) * progress)
    draw.rectangle([0, y, width, y + 1], fill=(r, g, b))

# 添加星星装饰
random.seed(42)  # 固定随机种子，保证一致性
for _ in range(150):
    x = random.randint(0, width)
    y = random.randint(0, height)
    size = random.randint(1, 4)
    alpha = random.randint(100, 255)
    # 绘制星星（小圆点）
    color = (255, 255, 255)
    draw.ellipse([x, y, x + size, y + size], fill=color)

bg.save(f"{output_dir}/main_menu_background.jpg", 'JPEG', quality=85, optimize=True)
size_kb = os.path.getsize(f"{output_dir}/main_menu_background.jpg") / 1024
print(f"  ✓ 背景图完成 (750x1334, {size_kb:.1f}KB)")

# ============================================================
# 2. 生成游戏Logo (512x256)
# ============================================================
print("\n[2/5] 生成游戏Logo...")

logo_width, logo_height = 512, 256
logo = Image.new('RGBA', (logo_width, logo_height), (0, 0, 0, 0))
logo_draw = ImageDraw.Draw(logo)

# 绘制"炼色"文字背景板
# 使用彩色渐变矩形作为Logo底板
logo_bg_width = 400
logo_bg_height = 150
logo_x = (logo_width - logo_bg_width) // 2
logo_y = (logo_height - logo_bg_height) // 2

# 彩虹渐变效果
colors = [
    (255, 107, 107),  # 红
    (255, 142, 83),   # 橙
    (255, 217, 61),   # 黄
    (78, 205, 196),   # 蓝绿
    (102, 126, 234),  # 紫
]

# 水平渐变
for x in range(logo_bg_width):
    progress = x / logo_bg_width
    color_index = progress * (len(colors) - 1)
    idx = int(color_index)
    if idx >= len(colors) - 1:
        color = colors[-1]
    else:
        local_progress = color_index - idx
        c1 = colors[idx]
        c2 = colors[idx + 1]
        r = int(c1[0] + (c2[0] - c1[0]) * local_progress)
        g = int(c1[1] + (c2[1] - c1[1]) * local_progress)
        b = int(c1[2] + (c2[2] - c1[2]) * local_progress)
        color = (r, g, b)
    
    logo_draw.rectangle([logo_x + x, logo_y, logo_x + x + 1, logo_y + logo_bg_height], 
                       fill=color + (255,))

# 添加圆角遮罩
mask = Image.new('L', (logo_width, logo_height), 0)
mask_draw = ImageDraw.Draw(mask)
mask_draw.rounded_rectangle([logo_x, logo_y, logo_x + logo_bg_width, logo_y + logo_bg_height], 
                            radius=30, fill=255)

result = Image.new('RGBA', (logo_width, logo_height), (0, 0, 0, 0))
result.paste(logo, (0, 0), mask)

# 添加发光边框
glow = Image.new('RGBA', (logo_width, logo_height), (0, 0, 0, 0))
glow_draw = ImageDraw.Draw(glow)
for i in range(8):
    alpha = int(120 * (1 - i / 8))
    glow_draw.rounded_rectangle([logo_x - i, logo_y - i, 
                                 logo_x + logo_bg_width + i, logo_y + logo_bg_height + i],
                                radius=30 + i, outline=(255, 255, 255, alpha), width=2)

result = Image.alpha_composite(result, glow)

# 添加白色边框
border = Image.new('RGBA', (logo_width, logo_height), (0, 0, 0, 0))
border_draw = ImageDraw.Draw(border)
border_draw.rounded_rectangle([logo_x, logo_y, logo_x + logo_bg_width, logo_y + logo_bg_height],
                             radius=30, outline=(255, 255, 255, 200), width=4)
result = Image.alpha_composite(result, border)

result.save(f"{output_dir}/game_logo.png", 'PNG', optimize=True)
size_kb = os.path.getsize(f"{output_dir}/game_logo.png") / 1024
print(f"  ✓ Logo完成 (512x256, {size_kb:.1f}KB)")

# ============================================================
# 3. 生成开始按钮 (450x100)
# ============================================================
print("\n[3/5] 生成开始按钮...")

btn_width, btn_height = 450, 100
btn = Image.new('RGBA', (btn_width, btn_height), (0, 0, 0, 0))
btn_draw = ImageDraw.Draw(btn)

# 紫色渐变
color1 = (102, 126, 234)  # #667eea
color2 = (118, 75, 162)   # #764ba2

for y in range(btn_height):
    progress = y / btn_height
    r = int(color1[0] + (color2[0] - color1[0]) * progress)
    g = int(color1[1] + (color2[1] - color1[1]) * progress)
    b = int(color1[2] + (color2[2] - color1[2]) * progress)
    btn_draw.rectangle([0, y, btn_width, y + 1], fill=(r, g, b, 255))

# 圆角遮罩
mask = Image.new('L', (btn_width, btn_height), 0)
mask_draw = ImageDraw.Draw(mask)
mask_draw.rounded_rectangle([0, 0, btn_width, btn_height], radius=50, fill=255)

result = Image.new('RGBA', (btn_width, btn_height), (0, 0, 0, 0))
result.paste(btn, (0, 0), mask)

# 发光效果
glow = Image.new('RGBA', (btn_width, btn_height), (0, 0, 0, 0))
glow_draw = ImageDraw.Draw(glow)
for i in range(6):
    alpha = int(100 * (1 - i / 6))
    glow_draw.rounded_rectangle([i, i, btn_width - i, btn_height - i],
                                radius=50 - i // 2, outline=(255, 255, 255, alpha), width=2)

result = Image.alpha_composite(result, glow)

# 白色边框
border = Image.new('RGBA', (btn_width, btn_height), (0, 0, 0, 0))
border_draw = ImageDraw.Draw(border)
border_draw.rounded_rectangle([0, 0, btn_width, btn_height], radius=50, 
                             outline=(255, 255, 255, 150), width=3)
result = Image.alpha_composite(result, border)

result.save(f"{output_dir}/btn_start.png", 'PNG', optimize=True)
size_kb = os.path.getsize(f"{output_dir}/btn_start.png") / 1024
print(f"  ✓ 开始按钮完成 (450x100, {size_kb:.1f}KB)")

# ============================================================
# 4. 生成次要按钮 (350x80)
# ============================================================
print("\n[4/5] 生成次要按钮...")

btn2_width, btn2_height = 350, 80
btn2 = Image.new('RGBA', (btn2_width, btn2_height), (0, 0, 0, 0))
btn2_draw = ImageDraw.Draw(btn2)

# 蓝绿渐变
color1 = (78, 205, 196)   # #4ECDC4
color2 = (68, 160, 141)   # #44A08D

for y in range(btn2_height):
    progress = y / btn2_height
    r = int(color1[0] + (color2[0] - color1[0]) * progress)
    g = int(color1[1] + (color2[1] - color1[1]) * progress)
    b = int(color1[2] + (color2[2] - color1[2]) * progress)
    btn2_draw.rectangle([0, y, btn2_width, y + 1], fill=(r, g, b, 255))

# 圆角遮罩
mask = Image.new('L', (btn2_width, btn2_height), 0)
mask_draw = ImageDraw.Draw(mask)
mask_draw.rounded_rectangle([0, 0, btn2_width, btn2_height], radius=40, fill=255)

result = Image.new('RGBA', (btn2_width, btn2_height), (0, 0, 0, 0))
result.paste(btn2, (0, 0), mask)

# 白色边框
border = Image.new('RGBA', (btn2_width, btn2_height), (0, 0, 0, 0))
border_draw = ImageDraw.Draw(border)
border_draw.rounded_rectangle([0, 0, btn2_width, btn2_height], radius=40, 
                             outline=(255, 255, 255, 120), width=3)
result = Image.alpha_composite(result, border)

result.save(f"{output_dir}/btn_secondary.png", 'PNG', optimize=True)
size_kb = os.path.getsize(f"{output_dir}/btn_secondary.png") / 1024
print(f"  ✓ 次要按钮完成 (350x80, {size_kb:.1f}KB)")

# ============================================================
# 5. 生成装饰宝石 (256x256)
# ============================================================
print("\n[5/5] 生成装饰宝石...")

gem_size = 256
gem = Image.new('RGBA', (gem_size, gem_size), (0, 0, 0, 0))
gem_draw = ImageDraw.Draw(gem)

margin = 30
inner_size = gem_size - 2 * margin

# 红橙渐变
color1 = (255, 107, 107)  # #FF6B6B
color2 = (255, 142, 83)   # #FF8E53

for y in range(inner_size):
    progress = y / inner_size
    r = int(color1[0] + (color2[0] - color1[0]) * progress)
    g = int(color1[1] + (color2[1] - color1[1]) * progress)
    b = int(color1[2] + (color2[2] - color1[2]) * progress)
    gem_draw.rectangle([margin, margin + y, gem_size - margin, margin + y + 1], 
                      fill=(r, g, b, 255))

# 高光效果
highlight = Image.new('RGBA', (gem_size, gem_size), (0, 0, 0, 0))
highlight_draw = ImageDraw.Draw(highlight)
for i in range(60):
    alpha = int(100 * (1 - i / 60))
    highlight_draw.ellipse([margin + 40, margin + 20 + i, 
                           gem_size - margin - 40, margin + 80 + i], 
                          fill=(255, 255, 255, alpha))

gem = Image.alpha_composite(gem, highlight)

# 圆角遮罩
mask = Image.new('L', (gem_size, gem_size), 0)
mask_draw = ImageDraw.Draw(mask)
mask_draw.rounded_rectangle([margin, margin, gem_size - margin, gem_size - margin], 
                           radius=50, fill=255)

result = Image.new('RGBA', (gem_size, gem_size), (0, 0, 0, 0))
result.paste(gem, (0, 0), mask)

# 发光边框
glow = Image.new('RGBA', (gem_size, gem_size), (0, 0, 0, 0))
glow_draw = ImageDraw.Draw(glow)
for i in range(8):
    alpha = int(120 * (1 - i / 8))
    glow_draw.rounded_rectangle([margin - i, margin - i, 
                                gem_size - margin + i, gem_size - margin + i],
                               radius=50 + i, outline=(255, 142, 83, alpha), width=2)

result = Image.alpha_composite(result, glow)

# 白色边框
border = Image.new('RGBA', (gem_size, gem_size), (0, 0, 0, 0))
border_draw = ImageDraw.Draw(border)
border_draw.rounded_rectangle([margin, margin, gem_size - margin, gem_size - margin],
                             radius=50, outline=(255, 255, 255, 150), width=4)
result = Image.alpha_composite(result, border)

result.save(f"{output_dir}/gem_decoration.png", 'PNG', optimize=True)
size_kb = os.path.getsize(f"{output_dir}/gem_decoration.png") / 1024
print(f"  ✓ 装饰宝石完成 (256x256, {size_kb:.1f}KB)")

# ============================================================
# 总结
# ============================================================
print("\n" + "=" * 60)
print("✅ 所有主界面资源生成完成！")
print(f"\n输出目录：{output_dir}/")
print("\n生成的资源：")

total_size = 0
for file in sorted(os.listdir(output_dir)):
    filepath = os.path.join(output_dir, file)
    size = os.path.getsize(filepath) / 1024
    total_size += size
    print(f"  - {file:<30} ({size:>6.1f}KB)")

print(f"\n总大小：{total_size:.1f}KB")
print("\n可以直接导入到Cocos Creator使用！")
