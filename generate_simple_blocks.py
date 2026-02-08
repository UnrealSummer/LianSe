"""
生成简单的纯色方块
"""

from PIL import Image, ImageDraw
import os

def create_simple_block(color, name, size=128, output_dir="blocks"):
    """
    创建简单的圆角方块
    """
    # 创建透明背景
    img = Image.new('RGBA', (size, size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    # 绘制圆角矩形
    margin = 4
    radius = 15
    
    # 主体颜色
    draw.rounded_rectangle(
        [(margin, margin), (size-margin, size-margin)],
        radius=radius,
        fill=color
    )
    
    # 添加高光效果（顶部亮一点）
    highlight_color = tuple(min(c + 30, 255) for c in color[:3]) + (180,)
    draw.rounded_rectangle(
        [(margin+5, margin+5), (size-margin-5, size//3)],
        radius=radius-5,
        fill=highlight_color
    )
    
    # 保存
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, f"{name}.png")
    img.save(output_path, "PNG")
    print(f"OK {name}.png")

def generate_all_blocks():
    """生成所有方块"""
    output_dir = "E:/Project/LianSe/LSProject/assets/textures/blocks"
    
    # 颜色定义 (R, G, B)
    colors = {
        'red': (255, 107, 107),
        'orange': (255, 179, 71),
        'yellow': (255, 230, 109),
        'green': (149, 225, 211),
        'blue': (78, 205, 196),
        'purple': (199, 125, 255),
    }
    
    print("生成简单方块...")
    
    for name, color in colors.items():
        create_simple_block(color, name, size=128, output_dir=output_dir)
    
    print(f"\n完成！保存在: {output_dir}")

if __name__ == "__main__":
    generate_all_blocks()
