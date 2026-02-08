"""
将白色背景转换为透明背景
适用于AI生成的图片
"""

from PIL import Image

def white_to_transparent(image_path, output_path=None, threshold=240):
    """
    将白色背景转换为透明
    
    Args:
        image_path: 输入图片路径
        output_path: 输出图片路径
        threshold: 白色阈值（0-255，越大越严格）
    """
    print(f"Processing: {image_path}")
    
    # 打开图片
    img = Image.open(image_path)
    print(f"Original size: {img.size}")
    print(f"Original mode: {img.mode}")
    
    # 转换为RGBA
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # 获取像素数据
    pixels = img.load()
    width, height = img.size
    
    # 将白色像素转换为透明
    transparent_count = 0
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            
            # 如果是白色或接近白色
            if r >= threshold and g >= threshold and b >= threshold:
                # 设置为完全透明
                pixels[x, y] = (r, g, b, 0)
                transparent_count += 1
    
    print(f"Converted {transparent_count} pixels to transparent")
    print(f"Percentage: {transparent_count/(width*height)*100:.1f}%")
    
    # 保存
    if output_path is None:
        # 在原文件名后加_transparent
        base = image_path.rsplit('.', 1)[0]
        output_path = f"{base}_transparent.png"
    
    img.save(output_path, "PNG")
    print(f"Saved to: {output_path}")
    print("\nDone! White background removed!")
    
    return output_path

def batch_convert(input_dir, output_dir=None, threshold=240):
    """
    批量转换文件夹中的所有图片
    """
    import os
    
    if output_dir is None:
        output_dir = input_dir
    
    os.makedirs(output_dir, exist_ok=True)
    
    # 支持的格式
    extensions = ['.png', '.jpg', '.jpeg']
    
    files = [f for f in os.listdir(input_dir) 
             if any(f.lower().endswith(ext) for ext in extensions)]
    
    print(f"Found {len(files)} images")
    print("=" * 50)
    
    for i, filename in enumerate(files, 1):
        print(f"\n[{i}/{len(files)}] {filename}")
        input_path = os.path.join(input_dir, filename)
        output_filename = filename.rsplit('.', 1)[0] + '_transparent.png'
        output_path = os.path.join(output_dir, output_filename)
        
        try:
            white_to_transparent(input_path, output_path, threshold)
        except Exception as e:
            print(f"Error: {e}")
    
    print("\n" + "=" * 50)
    print(f"All done! Processed {len(files)} images")

if __name__ == "__main__":
    # 示例：转换单个文件
    # white_to_transparent("input.png", "output.png")
    
    # 示例：批量转换
    # batch_convert("E:/Project/LianSe/ai_generated_images")
    
    print("White to Transparent Converter")
    print("=" * 50)
    print("\nUsage:")
    print("1. Single file:")
    print("   white_to_transparent('input.png', 'output.png')")
    print("\n2. Batch convert:")
    print("   batch_convert('input_folder', 'output_folder')")
    print("\nEdit this file to use!")
