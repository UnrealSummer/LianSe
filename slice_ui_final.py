"""
切割UI设计稿 - 炼色游戏
"""

from PIL import Image
import os

def slice_ui_design(input_path, output_dir):
    """
    切割UI设计稿
    """
    img = Image.open(input_path)
    width, height = img.size
    
    print(f"设计稿尺寸: {width}x{height}")
    
    # 创建输出目录
    os.makedirs(f"{output_dir}/ui", exist_ok=True)
    os.makedirs(f"{output_dir}/blocks", exist_ok=True)
    
    # 根据实际设计稿定义切割区域
    # 需要先分析图片来确定精确位置
    
    # 顶部信息栏 (估计高度约120px)
    top_bar_height = int(height * 0.08)  # 约8%
    
    # 敌人区域 (估计从顶部栏到棋盘之间)
    enemy_start = top_bar_height
    enemy_height = int(height * 0.20)  # 约20%
    
    # 棋盘区域 (中间的正方形区域)
    board_size = int(width * 0.85)  # 约85%宽度
    board_left = (width - board_size) // 2
    board_top = enemy_start + enemy_height
    
    # 底部信息栏
    bottom_bar_height = int(height * 0.10)  # 约10%
    bottom_bar_top = height - bottom_bar_height
    
    regions = {
        'top_bar': (0, 0, width, top_bar_height),
        'enemy_area': (0, enemy_start, width, enemy_start + enemy_height),
        'game_board': (board_left, board_top, board_left + board_size, board_top + board_size),
        'bottom_bar': (0, bottom_bar_top, width, height),
    }
    
    print("\n切割UI元素...")
    
    for name, (left, top, right, bottom) in regions.items():
        region = img.crop((left, top, right, bottom))
        output_path = f"{output_dir}/ui/{name}.png"
        region.save(output_path, "PNG")
        print(f"OK {name}.png ({right-left}x{bottom-top})")
    
    # 提取方块
    print("\n提取方块...")
    board_img = img.crop(regions['game_board'])
    extract_blocks(board_img, f"{output_dir}/blocks")
    
    print(f"\n完成！所有资源已保存到: {output_dir}")

def extract_blocks(board_img, output_dir):
    """
    从棋盘中提取单个方块
    """
    width, height = board_img.size
    
    # 8x8网格
    rows = 8
    cols = 8
    
    # 估算方块尺寸和间距
    # 假设有边距和间距
    margin = int(width * 0.05)  # 5%边距
    spacing = int(width * 0.01)  # 1%间距
    
    available_width = width - 2 * margin - (cols - 1) * spacing
    block_size = available_width // cols
    
    print(f"棋盘尺寸: {width}x{height}")
    print(f"方块尺寸: {block_size}x{block_size}")
    
    # 提取第一行的6个不同颜色方块
    colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']
    
    os.makedirs(output_dir, exist_ok=True)
    
    for i, color in enumerate(colors):
        if i >= cols:
            break
        
        col = i
        row = 0
        
        left = margin + col * (block_size + spacing)
        top = margin + row * (block_size + spacing)
        right = left + block_size
        bottom = top + block_size
        
        block = board_img.crop((left, top, right, bottom))
        
        # 调整到标准尺寸128x128
        block_resized = block.resize((128, 128), Image.Resampling.LANCZOS)
        
        output_path = f"{output_dir}/{color}.png"
        block_resized.save(output_path, "PNG")
        print(f"  {color}.png (128x128)")

if __name__ == "__main__":
    # 输入文件
    input_file = "C:/Users/yu.zhang01/.clawdbot/media/inbound/b5cedfa3-b56a-4d23-b9f1-fc6630934925.png"
    
    # 输出目录
    output_dir = "E:/Project/LianSe/LSProject/assets/textures"
    
    # 切割
    slice_ui_design(input_file, output_dir)
