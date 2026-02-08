"""
切割方块图片 - 3行2列布局
"""

from PIL import Image
import os

def split_blocks_3x2(input_path, output_dir, target_size=128):
    """
    切割3行2列的方块布局
    """
    img = Image.open(input_path)
    width, height = img.size
    
    print(f"图片尺寸: {width}x{height}")
    
    # 创建输出目录
    os.makedirs(output_dir, exist_ok=True)
    
    # 3行2列布局
    rows = 3
    cols = 2
    
    # 计算每个方块的尺寸
    block_width = width // cols
    block_height = height // rows
    
    print(f"单个方块尺寸: {block_width}x{block_height}")
    
    # 方块位置和名称 (列, 行, 名称)
    # 从左到右，从上到下
    blocks = [
        (0, 0, "red"),      # 第1行左
        (1, 0, "blue"),     # 第1行右
        (0, 1, "green"),    # 第2行左
        (1, 1, "yellow"),   # 第2行右
        (0, 2, "purple"),   # 第3行左
        (1, 2, "orange"),   # 第3行右
    ]
    
    print("\n开始切割...")
    
    for col, row, name in blocks:
        # 计算裁剪区域
        left = col * block_width
        top = row * block_height
        right = left + block_width
        bottom = top + block_height
        
        print(f"{name}: 区域 ({left}, {top}) -> ({right}, {bottom})")
        
        # 裁剪方块
        block = img.crop((left, top, right, bottom))
        
        # 调整尺寸到128x128
        block_resized = block.resize((target_size, target_size), Image.Resampling.LANCZOS)
        
        # 保存
        output_path = os.path.join(output_dir, f"{name}.png")
        block_resized.save(output_path, "PNG")
        
        print(f"  -> 已保存 {name}.png ({target_size}x{target_size})")
    
    print(f"\n完成！所有方块已保存到: {output_dir}")

if __name__ == "__main__":
    # 输入文件
    input_file = "C:/Users/yu.zhang01/.clawdbot/media/inbound/72dd6e81-d87b-4436-ac2b-abc8ff7f6ec2.png"
    
    # 输出目录
    output_dir = "E:/Project/LianSe/LSProject/assets/textures/blocks"
    
    # 切割
    split_blocks_3x2(input_file, output_dir, target_size=128)
