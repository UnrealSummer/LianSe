"""
生成完整的游戏UI资源
基于Stitch HTML设计
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_gradient_block(color_start, color_end, size=128, radius=15):
    """创建渐变方块"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 绘制渐变
    for y in range(size):
        ratio = y / size
        r = int(color_start[0] * (1 - ratio) + color_end[0] * ratio)
        g = int(color_start[1] * (1 - ratio) + color_end[1] * ratio)
        b = int(color_start[2] * (1 - ratio) + color_end[2] * ratio)
        draw.line([(4, y), (size-4, y)], fill=(r, g, b, 255))
    
    # 圆角
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([(0, 0), (size, size)], radius=radius, fill=255)
    img.putalpha(mask)
    
    # 高光
    highlight = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    hl_draw = ImageDraw.Draw(highlight)
    for y in range(size // 3):
        alpha = int(180 * (1 - y / (size // 3)))
        hl_draw.line([(8, y), (size-8, y)], fill=(255, 255, 255, alpha))
    
    img = Image.alpha_composite(img, highlight)
    return img

def create_background(width, height):
    """创建渐变背景"""
    img = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(img)
    
    # 从浅蓝到浅紫的渐变
    for y in range(height):
        ratio = y / height
        r = int(146 * (1 - ratio) + 212 * ratio)  # #92d0ff -> #d4b5ff
        g = int(208 * (1 - ratio) + 181 * ratio)
        b = int(255 * (1 - ratio) + 255 * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    return img

def create_hp_bar(width, height):
    """创建血条"""
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 外框
    draw.rounded_rectangle([(0, 0), (width, height)], radius=height//2, 
                          fill=(0, 0, 0, 50), outline=(255, 255, 255, 128), width=2)
    
    # 血条填充（红色渐变）
    for y in range(height-4):
        ratio = y / (height-4)
        r = int(255 * (1 - ratio) + 183 * ratio)  # #ff5252 -> #b71c1c
        g = int(82 * (1 - ratio) + 28 * ratio)
        b = int(82 * (1 - ratio) + 28 * ratio)
        draw.line([(2, y+2), (width-2, y+2)], fill=(r, g, b, 255))
    
    # 高光
    for y in range((height-4)//2):
        alpha = int(200 * (1 - y / ((height-4)//2)))
        draw.line([(4, y+2), (width-4, y+2)], fill=(255, 255, 255, alpha))
    
    return img

def create_time_bar(width, height):
    """创建时间进度条"""
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 外框
    draw.rounded_rectangle([(0, 0), (width, height)], radius=12, 
                          fill=(0, 0, 0, 50), outline=(255, 255, 255, 76), width=1)
    
    # 填充（青色渐变）
    for y in range(height-4):
        ratio = y / (height-4)
        r = int(0 * (1 - ratio) + 1 * ratio)  # #00d2d3 -> #01a3a4
        g = int(210 * (1 - ratio) + 163 * ratio)
        b = int(211 * (1 - ratio) + 164 * ratio)
        draw.line([(2, y+2), (width-2, y+2)], fill=(r, g, b, 255))
    
    # 高光
    for y in range((height-4)//2):
        alpha = int(200 * (1 - y / ((height-4)//2)))
        draw.line([(4, y+2), (width-4, y+2)], fill=(255, 255, 255, alpha))
    
    return img

def create_button(width, height, color_start, color_end):
    """创建按钮"""
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 渐变背景
    for y in range(height-4):
        ratio = y / (height-4)
        r = int(color_start[0] * (1 - ratio) + color_end[0] * ratio)
        g = int(color_start[1] * (1 - ratio) + color_end[1] * ratio)
        b = int(color_start[2] * (1 - ratio) + color_end[2] * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b, 255))
    
    # 圆角
    mask = Image.new('L', (width, height), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([(0, 0), (width, height-4)], radius=15, fill=255)
    img.putalpha(mask)
    
    # 高光
    highlight = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    hl_draw = ImageDraw.Draw(highlight)
    for y in range(height//3):
        alpha = int(150 * (1 - y / (height//3)))
        hl_draw.line([(10, y), (width-10, y)], fill=(255, 255, 255, alpha))
    
    img = Image.alpha_composite(img, highlight)
    return img

def create_board_frame(width, height):
    """创建棋盘边框"""
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 金色边框
    draw.rounded_rectangle([(0, 0), (width, height)], radius=20,
                          fill=(92, 60, 16, 100), outline=(154, 125, 10), width=3)
    
    return img

def generate_all_resources():
    """生成所有资源"""
    base_dir = "E:/Project/LianSe/LSProject/assets/textures"
    
    # 创建目录
    os.makedirs(f"{base_dir}/blocks", exist_ok=True)
    os.makedirs(f"{base_dir}/ui", exist_ok=True)
    os.makedirs(f"{base_dir}/buttons", exist_ok=True)
    
    print("=== 生成游戏资源 ===\n")
    
    # 1. 方块
    print("1. 生成方块...")
    blocks = {
        'red': ((255, 107, 107), (192, 57, 43)),
        'blue': ((84, 160, 255), (46, 134, 222)),
        'green': ((29, 209, 161), (16, 172, 132)),
        'yellow': ((254, 202, 87), (255, 159, 67)),
        'purple': ((162, 155, 254), (108, 92, 231)),
        'orange': ((255, 159, 67), (238, 82, 83)),
    }
    
    for name, (start, end) in blocks.items():
        block = create_gradient_block(start, end, size=128, radius=15)
        block.save(f"{base_dir}/blocks/{name}.png", "PNG")
        print(f"  OK {name}.png")
    
    # 2. 背景
    print("\n2. 生成背景...")
    bg = create_background(1080, 1920)
    bg.save(f"{base_dir}/ui/background.png", "PNG")
    print("  OK background.png")
    
    # 3. 血条
    print("\n3. 生成血条...")
    hp_bar = create_hp_bar(400, 30)
    hp_bar.save(f"{base_dir}/ui/hp_bar.png", "PNG")
    print("  OK hp_bar.png")
    
    # 4. 时间条
    print("\n4. 生成时间条...")
    time_bar = create_time_bar(400, 25)
    time_bar.save(f"{base_dir}/ui/time_bar.png", "PNG")
    print("  OK time_bar.png")
    
    # 5. 按钮
    print("\n5. 生成按钮...")
    # 主按钮（蓝色）
    btn_primary = create_button(200, 60, (96, 165, 250), (37, 99, 235))
    btn_primary.save(f"{base_dir}/buttons/button_primary.png", "PNG")
    print("  OK button_primary.png")
    
    # 次按钮（白色）
    btn_secondary = create_button(200, 60, (255, 255, 255), (226, 232, 240))
    btn_secondary.save(f"{base_dir}/buttons/button_secondary.png", "PNG")
    print("  OK button_secondary.png")
    
    # 6. 棋盘边框
    print("\n6. 生成棋盘边框...")
    board_frame = create_board_frame(800, 800)
    board_frame.save(f"{base_dir}/ui/board_frame.png", "PNG")
    print("  OK board_frame.png")
    
    print(f"\n=== 完成！所有资源已保存到: {base_dir} ===")

if __name__ == "__main__":
    generate_all_resources()
