"""
切割UI设计稿
将完整的UI设计图切割成各个可用的资源
"""

from PIL import Image
import os

def slice_ui_design(input_path, output_dir):
    """
    切割UI设计稿
    假设设计稿是1080x1920的竖屏布局
    """
    img = Image.open(input_path)
    width, height = img.size
    
    print(f"设计稿尺寸: {width}x{height}")
    
    # 创建输出目录
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(f"{output_dir}/ui", exist_ok=True)
    os.makedirs(f"{output_dir}/blocks", exist_ok=True)
    
    # 定义切割区域（需要根据实际设计调整）
    regions = {
        # 顶部信息栏 (假设高度120px)
        'top_bar': (0, 0, width, 120),
        
        # 敌人区域 (假设从120到420)
        'enemy_area': (0, 120, width, 420),
        
        # 棋盘区域 (假设800x800，居中)
        'game_board': ((width-800)//2, 450, (width+800)//2, 1250),
        
        # 底部信息栏 (假设高度150px)
        'bottom_bar': (0, height-150, width, height),
    }
    
    print("\n开始切割...")
    
    for name, (left, top, right, bottom) in regions.items():
        region = img.crop((left, top, right, bottom))
        output_path = f"{output_dir}/ui/{name}.png"
        region.save(output_path, "PNG")
        print(f"OK {name}.png ({right-left}x{bottom-top})")
    
    print(f"\n完成！文件保存在: {output_dir}")

def extract_single_block(board_image_path, output_dir, block_size=90, spacing=8):
    """
    从棋盘中提取单个方块
    """
    img = Image.open(board_image_path)
    width, height = img.size
    
    print(f"棋盘尺寸: {width}x{height}")
    
    # 创建输出目录
    os.makedirs(output_dir, exist_ok=True)
    
    # 计算边距
    margin_x = (width - (block_size + spacing) * 8 + spacing) // 2
    margin_y = (height - (block_size + spacing) * 8 + spacing) // 2
    
    print(f"边距: x={margin_x}, y={margin_y}")
    print(f"方块尺寸: {block_size}x{block_size}")
    
    # 提取第一行的6个不同颜色方块
    colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']
    
    print("\n提取方块...")
    
    for i, color in enumerate(colors):
        if i >= 8:  # 最多8列
            break
            
        left = margin_x + i * (block_size + spacing)
        top = margin_y
        right = left + block_size
        bottom = top + block_size
        
        block = img.crop((left, top, right, bottom))
        output_path = f"{output_dir}/{color}.png"
        block.save(output_path, "PNG")
        print(f"OK {color}.png")
    
    print(f"\n完成！方块保存在: {output_dir}")

if __name__ == "__main__":
    print("=== UI设计稿切割工具 ===\n")
    
    # 输入文件路径（需要替换成实际路径）
    input_file = "path/to/your/ui_design.png"
    
    # 输出目录
    output_dir = "E:/Project/LianSe/LSProject/assets/textures"
    
    print("请将UI设计稿保存后，修改input_file路径，然后运行此脚本。")
    print(f"\n当前输入文件: {input_file}")
    print(f"输出目录: {output_dir}")
