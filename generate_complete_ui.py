"""
生成完整的游戏UI资源
包括背景、按钮、进度条、边框等
"""

from PIL import Image, ImageDraw, ImageFilter
import os

def create_gradient_background(width, height):
    """创建渐变背景"""
    img = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(img)
    
    # 从浅蓝到浅紫的渐变
    for y in range(height):
        ratio = y / height
        # 顶部：浅蓝 #92d0ff
        # 底部：浅紫 #d4b5ff
        r = int(146 + (212 - 146) * ratio)
        g = int(208 + (181 - 208) * ratio)
        b = int(255 + (255 - 255) * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    return img

def create_glossy_bar(width, height, color_top, color_bottom):
    """创建光泽进度条"""
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    radius = height // 2
    
    # 外框（半透明黑色）
    draw.rounded_rectangle([(0, 0), (width, height)], radius=radius,
                          fill=(0, 0, 0, 80), outline=(255, 255, 255, 100), width=2)
    
    # 内部填充（渐变）
    inner_width = width - 4
    inner_height = height - 4
    for y in range(inner_height):
        ratio = y / inner_height
        r = int(color_top[0] * (1 - ratio) + color_bottom[0] * ratio)
        g = int(color_top[1] * (1 - ratio) + color_bottom[1] * ratio)
        b = int(color_top[2] * (1 - ratio) + color_bottom[2] * ratio)
        draw.line([(2, y + 2), (inner_width + 2, y + 2)], fill=(r, g, b, 255))
    
    # 高光
    highlight_height = inner_height // 2
    for y in range(highlight_height):
        alpha = int(180 * (1 - y / highlight_height))
        draw.line([(radius, y + 2), (inner_width - radius + 2, y + 2)], 
                 fill=(255, 255, 255, alpha))
    
    return img

def create_button(width, height, color_top, color_bottom, text_color=(255, 255, 255)):
    """创建按钮"""
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    radius = 20
    
    # 按钮主体（渐变）
    for y in range(height - 6):
        ratio = y / (height - 6)
        r = int(color_top[0] * (1 - ratio) + color_bottom[0] * ratio)
        g = int(color_top[1] * (1 - ratio) + color_bottom[1] * ratio)
        b = int(color_top[2] * (1 - ratio) + color_bottom[2] * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b, 255))
    
    # 圆角
    mask = Image.new('L', (width, height), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([(0, 0), (width, height - 6)], radius=radius, fill=255)
    img.putalpha(mask)
    
    # 高光
    highlight = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    hl_draw = ImageDraw.Draw(highlight)
    highlight_height = (height - 6) // 3
    for y in range(highlight_height):
        alpha = int(150 * (1 - y / highlight_height))
        hl_draw.line([(radius, y), (width - radius, y)], fill=(255, 255, 255, alpha))
    
    img = Image.alpha_composite(img, highlight)
    
    # 底部阴影
    shadow = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rounded_rectangle([(2, height - 6), (width - 2, height - 2)], 
                                  radius=radius, fill=(0, 0, 0, 100))
    
    # 合成
    result = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    result = Image.alpha_composite(result, shadow)
    result = Image.alpha_composite(result, img)
    
    return result

def create_panel(width, height, bg_color=(255, 255, 255, 230)):
    """创建面板"""
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    radius = 25
    
    # 主体
    draw.rounded_rectangle([(0, 0), (width, height)], radius=radius,
                          fill=bg_color, outline=(255, 255, 255, 150), width=3)
    
    # 内阴影
    shadow = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rounded_rectangle([(3, 3), (width - 3, height - 3)], 
                                  radius=radius - 3, outline=(0, 0, 0, 50), width=2)
    
    img = Image.alpha_composite(img, shadow)
    
    return img

def create_coin_icon(size=64):
    """创建金币图标"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 金币主体（渐变）
    center = size // 2
    for r in range(center, 0, -1):
        ratio = r / center
        # 金色渐变
        color_r = int(255 * ratio + 200 * (1 - ratio))
        color_g = int(215 * ratio + 150 * (1 - ratio))
        color_b = int(0 * ratio + 0 * (1 - ratio))
        draw.ellipse([(center - r, center - r), (center + r, center + r)],
                    fill=(color_r, color_g, color_b, 255))
    
    # 高光
    highlight_r = center // 2
    draw.ellipse([(center - highlight_r, center - highlight_r - 5),
                 (center + highlight_r, center + highlight_r - 5)],
                fill=(255, 255, 200, 150))
    
    # 外圈
    draw.ellipse([(2, 2), (size - 2, size - 2)], outline=(180, 120, 0, 255), width=3)
    
    return img

def create_heart_icon(size=64):
    """创建爱心图标（血量）"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 简化的爱心形状（用圆和三角形组合）
    center = size // 2
    r = size // 3
    
    # 左半圆
    draw.ellipse([(center - r - r//2, center - r), (center, center + r//2)],
                fill=(255, 80, 80, 255))
    
    # 右半圆
    draw.ellipse([(center, center - r), (center + r + r//2, center + r//2)],
                fill=(255, 80, 80, 255))
    
    # 下三角
    draw.polygon([(center - r - r//2, center), 
                 (center + r + r//2, center),
                 (center, size - 5)],
                fill=(255, 80, 80, 255))
    
    # 高光
    draw.ellipse([(center - r//2, center - r + 5), (center + r//2, center)],
                fill=(255, 150, 150, 150))
    
    return img

def create_star_icon(size=64):
    """创建星星图标（分数）"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 五角星（简化版）
    center = size // 2
    outer_r = size // 2 - 5
    inner_r = outer_r // 2
    
    import math
    points = []
    for i in range(10):
        angle = math.pi / 2 + i * math.pi / 5
        r = outer_r if i % 2 == 0 else inner_r
        x = center + r * math.cos(angle)
        y = center - r * math.sin(angle)
        points.append((x, y))
    
    # 星星主体
    draw.polygon(points, fill=(255, 220, 50, 255), outline=(200, 150, 0, 255), width=2)
    
    # 高光
    draw.ellipse([(center - 8, center - 12), (center + 8, center + 4)],
                fill=(255, 255, 200, 150))
    
    return img

def generate_all_ui_resources():
    """生成所有UI资源"""
    base_dir = "E:/Project/LianSe/LSProject/assets/textures"
    
    os.makedirs(f"{base_dir}/ui", exist_ok=True)
    os.makedirs(f"{base_dir}/buttons", exist_ok=True)
    os.makedirs(f"{base_dir}/icons", exist_ok=True)
    
    print("=== 生成UI资源 ===\n")
    
    # 1. 背景
    print("1. 生成背景...")
    bg = create_gradient_background(1080, 1920)
    bg.save(f"{base_dir}/ui/background.png", "PNG")
    print("  OK background.png (1080x1920)")
    
    # 2. 血条
    print("\n2. 生成血条...")
    hp_bar = create_glossy_bar(500, 40, (255, 82, 82), (183, 28, 28))
    hp_bar.save(f"{base_dir}/ui/hp_bar.png", "PNG")
    print("  OK hp_bar.png (500x40)")
    
    # 3. 时间条
    print("\n3. 生成时间条...")
    time_bar = create_glossy_bar(500, 30, (0, 210, 211), (1, 163, 164))
    time_bar.save(f"{base_dir}/ui/time_bar.png", "PNG")
    print("  OK time_bar.png (500x30)")
    
    # 4. 能量条
    print("\n4. 生成能量条...")
    energy_bar = create_glossy_bar(500, 30, (255, 193, 7), (255, 152, 0))
    energy_bar.save(f"{base_dir}/ui/energy_bar.png", "PNG")
    print("  OK energy_bar.png (500x30)")
    
    # 5. 按钮
    print("\n5. 生成按钮...")
    
    # 主按钮（蓝色）
    btn_primary = create_button(250, 80, (96, 165, 250), (37, 99, 235))
    btn_primary.save(f"{base_dir}/buttons/button_primary.png", "PNG")
    print("  OK button_primary.png (250x80)")
    
    # 次按钮（白色）
    btn_secondary = create_button(250, 80, (255, 255, 255), (226, 232, 240))
    btn_secondary.save(f"{base_dir}/buttons/button_secondary.png", "PNG")
    print("  OK button_secondary.png (250x80)")
    
    # 成功按钮（绿色）
    btn_success = create_button(250, 80, (52, 211, 153), (16, 185, 129))
    btn_success.save(f"{base_dir}/buttons/button_success.png", "PNG")
    print("  OK button_success.png (250x80)")
    
    # 危险按钮（红色）
    btn_danger = create_button(250, 80, (248, 113, 113), (239, 68, 68))
    btn_danger.save(f"{base_dir}/buttons/button_danger.png", "PNG")
    print("  OK button_danger.png (250x80)")
    
    # 小按钮
    btn_small = create_button(120, 60, (96, 165, 250), (37, 99, 235))
    btn_small.save(f"{base_dir}/buttons/button_small.png", "PNG")
    print("  OK button_small.png (120x60)")
    
    # 6. 面板
    print("\n6. 生成面板...")
    
    # 主面板
    panel_main = create_panel(700, 500, (255, 255, 255, 240))
    panel_main.save(f"{base_dir}/ui/panel_main.png", "PNG")
    print("  OK panel_main.png (700x500)")
    
    # 小面板
    panel_small = create_panel(400, 300, (255, 255, 255, 230))
    panel_small.save(f"{base_dir}/ui/panel_small.png", "PNG")
    print("  OK panel_small.png (400x300)")
    
    # 顶部栏
    top_bar = create_panel(1080, 150, (255, 255, 255, 200))
    top_bar.save(f"{base_dir}/ui/top_bar.png", "PNG")
    print("  OK top_bar.png (1080x150)")
    
    # 底部栏
    bottom_bar = create_panel(1080, 200, (255, 255, 255, 200))
    bottom_bar.save(f"{base_dir}/ui/bottom_bar.png", "PNG")
    print("  OK bottom_bar.png (1080x200)")
    
    # 7. 图标
    print("\n7. 生成图标...")
    
    coin_icon = create_coin_icon(64)
    coin_icon.save(f"{base_dir}/icons/coin.png", "PNG")
    print("  OK coin.png (64x64)")
    
    heart_icon = create_heart_icon(64)
    heart_icon.save(f"{base_dir}/icons/heart.png", "PNG")
    print("  OK heart.png (64x64)")
    
    star_icon = create_star_icon(64)
    star_icon.save(f"{base_dir}/icons/star.png", "PNG")
    print("  OK star.png (64x64)")
    
    print(f"\n=== 完成！所有UI资源已保存到: {base_dir} ===")
    print("\n资源清单:")
    print("  - 背景: 1个")
    print("  - 进度条: 3个（血条、时间条、能量条）")
    print("  - 按钮: 5个（主、次、成功、危险、小）")
    print("  - 面板: 4个（主、小、顶部栏、底部栏）")
    print("  - 图标: 3个（金币、爱心、星星）")
    print("  总计: 16个UI资源")

if __name__ == "__main__":
    generate_all_ui_resources()
