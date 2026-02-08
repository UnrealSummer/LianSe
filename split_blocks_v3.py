"""
精确分割方块 - 自动检测布局
"""

from PIL import Image
import os

def auto_detect_and_split(input_path, output_dir, target_size=128):
    """
    自动检测方块位置并分割
    """
    img = Image.open(input_path)
    width, height = img.size
    
    print(f"图片尺寸: {width}x{height}")
    
    # 创建输出目录
    os.makedirs(output_dir, exist_ok=True)
    
    # 简单的2x3均分（无边距）
    block_width = width // 2
    block_height = height // 3
    
    print(f"方块尺寸: {block_width}x{block_height}")
    
    # 方块位置
    positions = [
        (0, 0, "red"),      # 左上
        (1, 0, "orange"),   # 右上
        (0, 1, "yellow"),   # 左中
        (1, 1, "green"),    # 右中
        (0, 2, "blue"),     # 左下
        (1, 2, "purple"),   # 右下
    ]
    
    print("\n开始分割...")
    
    for col, row, name in positions:
        left = col * block_width
        top = row * block_height
        right = left + block_width
        bottom = top + block_height
        
        # 裁剪
        block = img.crop((left, top, right, bottom))
        
        # 调整尺寸
        block_resized = block.resize((target_size, target_size), Image.Resampling.LANCZOS)
        
        # 保存
        output_path = os.path.join(output_dir, f"{name}.png")
        block_resized.save(output_path, "PNG")
        
        print(f"OK {name}.png")
    
    print(f"\n完成！保存在: {output_dir}")

if __name__ == "__main__":
    input_file = "C:/Users/yu.zhang01/.clawdbot/media/inbound/68446cae-4bd1-49dd-a539-fb8ee9f2ef05.png"
    output_dir = "E:/Project/LianSe/LSProject/assets/textures/blocks_test"
    
    auto_detect_and_split(input_file, output_dir, target_size=128)
    
    print("\n请检查 blocks_test 文件夹中的结果")
    print("如果正确，我会覆盖到 blocks 文件夹")
