"""
根据Stitch HTML生成方块
使用HTML中定义的渐变色
"""

from PIL import Image, ImageDraw
import os

def create_gradient_block(color_start, color_end, name, size=128):
    """
    创建渐变方块
    """
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 绘制渐变
    for y in range(size):
        # 计算渐变比例
        ratio = y / size
        
        # 插值计算颜色
        r = int(color_start[0] * (1 - ratio) + color_end[0] * ratio)
        g = int(color_start[1] * (1 - ratio) + color_end[1] * ratio)
        b = int(color_start[2] * (1 - ratio) + color_end[2] * ratio)
        
        # 绘制一行
        draw.line([(4, y), (size-4, y)], fill=(r, g, b, 255))
    
    # 添加圆角（简化版）
    mask = Image.new('L', (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([(0, 0), (size, size)], radius=15, fill=255)
    
    # 应用圆角
    img.putalpha(mask)
    
    # 添加高光（顶部亮）
    highlight = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    hl_draw = ImageDraw.Draw(highlight)
    
    # 顶部高光
    for y in range(size // 3):
        alpha = int(180 * (1 - y / (size // 3)))
        hl_draw.line([(8, y), (size-8, y)], fill=(255, 255, 255, alpha))
    
    # 合成
    img = Image.alpha_composite(img, highlight)
    
    return img

def generate_stitch_blocks():
    """
    生成Stitch风格的方块
    """
    output_dir = "E:/Project/LianSe/LSProject/assets/textures/blocks"
    os.makedirs(output_dir, exist_ok=True)
    
    # 从HTML CSS中提取的颜色
    blocks = {
        'red': ((255, 107, 107), (192, 57, 43)),      # #ff6b6b -> #c0392b
        'blue': ((84, 160, 255), (46, 134, 222)),     # #54a0ff -> #2e86de
        'green': ((29, 209, 161), (16, 172, 132)),    # #1dd1a1 -> #10ac84
        'yellow': ((254, 202, 87), (255, 159, 67)),   # #feca57 -> #ff9f43
        'purple': ((162, 155, 254), (108, 92, 231)),  # #a29bfe -> #6c5ce7
        'orange': ((255, 159, 67), (238, 82, 83)),    # #ff9f43 -> #ee5253
    }
    
    print("生成Stitch风格方块...")
    
    for name, (color_start, color_end) in blocks.items():
        block = create_gradient_block(color_start, color_end, name, size=128)
        output_path = f"{output_dir}/{name}.png"
        block.save(output_path, "PNG")
        print(f"OK {name}.png")
    
    print(f"\n完成！保存在: {output_dir}")

if __name__ == "__main__":
    generate_stitch_blocks()
