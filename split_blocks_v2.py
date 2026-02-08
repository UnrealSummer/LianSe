"""
分析和分割方块图片 - 改进版
"""

from PIL import Image
import os

def analyze_image(input_path):
    """分析图片布局"""
    img = Image.open(input_path)
    width, height = img.size
    
    print(f"图片尺寸: {width}x{height}")
    
    # 显示图片以便分析
    # img.show()
    
    return img

def split_blocks_manual(input_path, output_dir, target_size=128):
    """
    手动指定每个方块的位置
    """
    img = Image.open(input_path)
    width, height = img.size
    
    print(f"原始图片尺寸: {width}x{height}")
    
    # 创建输出目录
    os.makedirs(output_dir, exist_ok=True)
    
    # 方块布局：2列3行
    # 计算每个方块的实际尺寸（包括间距）
    cols = 2
    rows = 3
    
    # 假设有边距和间距
    margin = 50  # 边距
    spacing = 30  # 方块间距
    
    # 计算单个方块尺寸
    available_width = width - 2 * margin - (cols - 1) * spacing
    available_height = height - 2 * margin - (rows - 1) * spacing
    
    block_width = available_width // cols
    block_height = available_height // rows
    
    print(f"计算的方块尺寸: {block_width}x{block_height}")
    
    # 定义方块位置和名称
    blocks = [
        # (列, 行, 名称)
        (0, 0, "red"),
        (1, 0, "orange"),
        (0, 1, "yellow"),
        (1, 1, "green"),
        (0, 2, "blue"),
        (1, 2, "purple"),
    ]
    
    print("\n开始分割...")
    
    for col, row, name in blocks:
        # 计算裁剪区域
        left = margin + col * (block_width + spacing)
        top = margin + row * (block_height + spacing)
        right = left + block_width
        bottom = top + block_height
        
        print(f"\n{name}: 裁剪区域 ({left}, {top}, {right}, {bottom})")
        
        # 裁剪方块
        block = img.crop((left, top, right, bottom))
        
        # 调整尺寸
        block_resized = block.resize((target_size, target_size), Image.Resampling.LANCZOS)
        
        # 保存
        output_path = os.path.join(output_dir, f"{name}.png")
        block_resized.save(output_path, "PNG")
        
        print(f"OK {name}.png 已保存")
    
    print(f"\n完成！文件保存在: {output_dir}")

if __name__ == "__main__":
    input_file = "C:/Users/yu.zhang01/.clawdbot/media/inbound/68446cae-4bd1-49dd-a539-fb8ee9f2ef05.png"
    output_dir = "E:/Project/LianSe/LSProject/assets/textures/blocks"
    
    # 先分析图片
    print("=== 分析图片 ===")
    img = analyze_image(input_file)
    
    # 显示图片信息
    print(f"\n图片模式: {img.mode}")
    print(f"图片格式: {img.format}")
    
    # 分割方块
    print("\n=== 开始分割 ===")
    split_blocks_manual(input_file, output_dir, target_size=128)
