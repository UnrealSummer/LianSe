"""
自动去除图片白边
"""

from PIL import Image
import os

def remove_white_border(image_path, output_path=None, threshold=250):
    """
    自动去除图片白边
    
    Args:
        image_path: 输入图片路径
        output_path: 输出图片路径（如果为None，则覆盖原图）
        threshold: 白色阈值（0-255，越大越严格）
    """
    print(f"正在处理: {image_path}")
    
    # 打开图片
    img = Image.open(image_path)
    original_size = img.size
    print(f"原始尺寸: {original_size[0]}x{original_size[1]}")
    
    # 转换为RGB（如果是RGBA）
    if img.mode == 'RGBA':
        # 创建白色背景
        bg = Image.new('RGB', img.size, (255, 255, 255))
        bg.paste(img, mask=img.split()[3])
        img = bg
    elif img.mode != 'RGB':
        img = img.convert('RGB')
    
    # 获取图片数据
    pixels = img.load()
    width, height = img.size
    
    # 找到非白色区域的边界
    left = width
    top = height
    right = 0
    bottom = 0
    
    found_content = False
    
    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y]
            # 如果不是纯白色（允许一点误差）
            if r < threshold or g < threshold or b < threshold:
                found_content = True
                left = min(left, x)
                top = min(top, y)
                right = max(right, x)
                bottom = max(bottom, y)
    
    if not found_content:
        print("警告: 未检测到非白色内容！")
        return False
    
    # 裁剪（添加1像素边距避免切得太紧）
    left = max(0, left - 1)
    top = max(0, top - 1)
    right = min(width - 1, right + 1)
    bottom = min(height - 1, bottom + 1)
    
    cropped = img.crop((left, top, right + 1, bottom + 1))
    
    # 保存
    if output_path is None:
        output_path = image_path
    
    cropped.save(output_path, quality=95)
    
    new_size = cropped.size
    print(f"裁剪后尺寸: {new_size[0]}x{new_size[1]}")
    print(f"去除边距: 左{left}px, 上{top}px, 右{width-right-1}px, 下{height-bottom-1}px")
    print(f"已保存到: {output_path}")
    
    return True

if __name__ == "__main__":
    # 处理图片
    input_path = r"C:\Users\yu.zhang01\.clawdbot\media\inbound\068a5cf1-629a-4f65-8fc4-4376a7029b01.png"
    output_path = r"E:\Project\LianSe\ui_design_cropped.png"
    
    if os.path.exists(input_path):
        remove_white_border(input_path, output_path)
        print("\n✅ 完成！")
    else:
        print(f"错误: 找不到文件 {input_path}")
