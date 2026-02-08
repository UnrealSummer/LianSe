"""
重新生成高质量的方块图片
使用更鲜艳的颜色和更好的渐变
"""

from PIL import Image, ImageDraw
import os

def create_vibrant_block(color_top, color_bottom, name, size=512):
    """
    创建鲜艳的渐变方块
    """
    img = Image.new('RGB', (size, size), (255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    # 绘制垂直渐变
    for y in range(size):
        ratio = y / size
        r = int(color_top[0] * (1 - ratio) + color_bottom[0] * ratio)
        g = int(color_top[1] * (1 - ratio) + color_bottom[1] * ratio)
        b = int(color_top[2] * (1 - ratio) + color_bottom[2] * ratio)
        draw.line([(0, y), (size, y)], fill=(r, g, b))
    
    # 添加圆角
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    radius = size // 8
    mask_draw.rounded_rectangle([(0, 0), (size, size)], radius=radius, fill=255)
    
    # 转换为RGBA并应用圆角
    img = img.convert('RGBA')
    img.putalpha(mask)
    
    # 添加高光
    highlight = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    hl_draw = ImageDraw.Draw(highlight)
    
    # 顶部高光
    highlight_height = size // 3
    for y in range(highlight_height):
        alpha = int(120 * (1 - y / highlight_height))
        hl_draw.line([(radius, y), (size - radius, y)], fill=(255, 255, 255, alpha))
    
    # 合成
    img = Image.alpha_composite(img, highlight)
    
    return img

def generate_vibrant_blocks():
    """
    生成鲜艳的方块
    """
    output_dir = "E:/Project/LianSe/LSProject/assets/textures/blocks"
    
    # 使用更鲜艳的颜色
    blocks = {
        'red': ((255, 80, 80), (200, 30, 30)),        # 鲜红色
        'yellow': ((255, 220, 50), (255, 180, 0)),    # 鲜黄色
        'blue': ((80, 160, 255), (30, 100, 220)),     # 鲜蓝色
        'orange': ((255, 160, 50), (240, 100, 20)),   # 鲜橙色
        'purple': ((180, 120, 255), (130, 70, 220)),  # 鲜紫色
        'green': ((80, 220, 120), (30, 180, 80)),     # 鲜绿色
    }
    
    print("生成鲜艳方块...")
    
    for name, (color_top, color_bottom) in blocks.items():
        block = create_vibrant_block(color_top, color_bottom, name, size=512)
        output_path = f"{output_dir}/{name}.png"
        block.save(output_path, "PNG")
        print(f"OK {name}.png")
    
    print(f"\n完成！保存在: {output_dir}")

if __name__ == "__main__":
    generate_vibrant_blocks()
