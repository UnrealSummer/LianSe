"""
生成游戏UI所需的图标
包括设置、暂停、技能等图标
"""

from PIL import Image, ImageDraw
import os
import math

def create_settings_icon(size=64):
    """创建设置图标（齿轮）"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    center = size // 2
    outer_r = size // 2 - 5
    inner_r = outer_r // 2
    
    # 齿轮外圈（8个齿）
    for i in range(8):
        angle = i * math.pi / 4
        # 齿的外点
        x1 = center + outer_r * math.cos(angle)
        y1 = center + outer_r * math.sin(angle)
        # 齿的内点
        x2 = center + (outer_r - 8) * math.cos(angle + math.pi / 8)
        y2 = center + (outer_r - 8) * math.sin(angle + math.pi / 8)
        x3 = center + (outer_r - 8) * math.cos(angle - math.pi / 8)
        y3 = center + (outer_r - 8) * math.sin(angle - math.pi / 8)
        
        draw.polygon([(x1, y1), (x2, y2), (x3, y3)], fill=(100, 100, 100, 255))
    
    # 中心圆环
    draw.ellipse([(center - outer_r + 8, center - outer_r + 8),
                 (center + outer_r - 8, center + outer_r - 8)],
                fill=(120, 120, 120, 255))
    
    # 中心孔
    draw.ellipse([(center - inner_r, center - inner_r),
                 (center + inner_r, center + inner_r)],
                fill=(0, 0, 0, 0))
    
    # 高光
    draw.ellipse([(center - outer_r + 12, center - outer_r + 12),
                 (center + outer_r - 20, center + outer_r - 20)],
                fill=(180, 180, 180, 100))
    
    return img

def create_pause_icon(size=64):
    """创建暂停图标（两条竖线）"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    center = size // 2
    bar_width = size // 5
    bar_height = size // 2
    gap = size // 8
    
    # 左竖线
    draw.rounded_rectangle([
        (center - gap - bar_width, center - bar_height // 2),
        (center - gap, center + bar_height // 2)
    ], radius=5, fill=(100, 100, 100, 255))
    
    # 右竖线
    draw.rounded_rectangle([
        (center + gap, center - bar_height // 2),
        (center + gap + bar_width, center + bar_height // 2)
    ], radius=5, fill=(100, 100, 100, 255))
    
    # 高光
    draw.rounded_rectangle([
        (center - gap - bar_width + 3, center - bar_height // 2 + 3),
        (center - gap - 3, center - bar_height // 2 + bar_height // 3)
    ], radius=3, fill=(180, 180, 180, 150))
    
    draw.rounded_rectangle([
        (center + gap + 3, center - bar_height // 2 + 3),
        (center + gap + bar_width - 3, center - bar_height // 2 + bar_height // 3)
    ], radius=3, fill=(180, 180, 180, 150))
    
    return img

def create_skill_icon(size=64, color=(255, 100, 100)):
    """创建技能图标（魔法球）"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    center = size // 2
    r = size // 2 - 5
    
    # 外圈光晕
    for i in range(5):
        alpha = int(100 * (1 - i / 5))
        draw.ellipse([
            (center - r - i * 2, center - r - i * 2),
            (center + r + i * 2, center + r + i * 2)
        ], fill=(*color, alpha))
    
    # 主球体（渐变）
    for i in range(r, 0, -1):
        ratio = i / r
        c_r = int(color[0] * ratio + 255 * (1 - ratio))
        c_g = int(color[1] * ratio + 255 * (1 - ratio))
        c_b = int(color[2] * ratio + 255 * (1 - ratio))
        draw.ellipse([
            (center - i, center - i),
            (center + i, center + i)
        ], fill=(c_r, c_g, c_b, 255))
    
    # 高光
    highlight_r = r // 2
    draw.ellipse([
        (center - highlight_r, center - r + 5),
        (center + highlight_r, center - r + 5 + highlight_r * 2)
    ], fill=(255, 255, 255, 200))
    
    return img

def create_play_icon(size=64):
    """创建播放图标（三角形）"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    center = size // 2
    triangle_size = size // 2
    
    # 三角形
    points = [
        (center - triangle_size // 2, center - triangle_size),
        (center - triangle_size // 2, center + triangle_size),
        (center + triangle_size, center)
    ]
    
    draw.polygon(points, fill=(100, 200, 100, 255))
    
    # 高光
    highlight_points = [
        (center - triangle_size // 2 + 5, center - triangle_size + 10),
        (center - triangle_size // 2 + 5, center),
        (center + triangle_size - 10, center - 5)
    ]
    draw.polygon(highlight_points, fill=(180, 255, 180, 150))
    
    return img

def create_home_icon(size=64):
    """创建主页图标（房子）"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    center = size // 2
    house_size = size // 2
    
    # 屋顶（三角形）
    roof_points = [
        (center, center - house_size),
        (center - house_size, center),
        (center + house_size, center)
    ]
    draw.polygon(roof_points, fill=(200, 100, 100, 255))
    
    # 房子主体
    draw.rectangle([
        (center - house_size + 5, center),
        (center + house_size - 5, center + house_size)
    ], fill=(150, 150, 150, 255))
    
    # 门
    door_width = house_size // 2
    draw.rectangle([
        (center - door_width // 2, center + house_size // 3),
        (center + door_width // 2, center + house_size)
    ], fill=(100, 100, 100, 255))
    
    return img

def generate_ui_icons():
    """生成所有UI图标"""
    output_dir = "E:/Project/LianSe/LSProject/assets/textures/icons"
    os.makedirs(output_dir, exist_ok=True)
    
    print("=== 生成UI图标 ===\n")
    
    # 1. 设置图标
    print("1. 生成设置图标...")
    settings = create_settings_icon(64)
    settings.save(f"{output_dir}/settings.png", "PNG")
    print("  OK settings.png")
    
    # 2. 暂停图标
    print("\n2. 生成暂停图标...")
    pause = create_pause_icon(64)
    pause.save(f"{output_dir}/pause.png", "PNG")
    print("  OK pause.png")
    
    # 3. 播放图标
    print("\n3. 生成播放图标...")
    play = create_play_icon(64)
    play.save(f"{output_dir}/play.png", "PNG")
    print("  OK play.png")
    
    # 4. 主页图标
    print("\n4. 生成主页图标...")
    home = create_home_icon(64)
    home.save(f"{output_dir}/home.png", "PNG")
    print("  OK home.png")
    
    # 5. 技能图标（3个不同颜色）
    print("\n5. 生成技能图标...")
    
    skill1 = create_skill_icon(64, (255, 100, 100))  # 红色
    skill1.save(f"{output_dir}/skill_1.png", "PNG")
    print("  OK skill_1.png (红色)")
    
    skill2 = create_skill_icon(64, (100, 100, 255))  # 蓝色
    skill2.save(f"{output_dir}/skill_2.png", "PNG")
    print("  OK skill_2.png (蓝色)")
    
    skill3 = create_skill_icon(64, (100, 255, 100))  # 绿色
    skill3.save(f"{output_dir}/skill_3.png", "PNG")
    print("  OK skill_3.png (绿色)")
    
    print(f"\n=== 完成！所有图标已保存到: {output_dir} ===")
    print("\n图标清单:")
    print("  - settings.png (设置)")
    print("  - pause.png (暂停)")
    print("  - play.png (播放/继续)")
    print("  - home.png (主页)")
    print("  - skill_1.png (技能1 - 红色)")
    print("  - skill_2.png (技能2 - 蓝色)")
    print("  - skill_3.png (技能3 - 绿色)")
    print("  总计: 7个图标")

if __name__ == "__main__":
    generate_ui_icons()
