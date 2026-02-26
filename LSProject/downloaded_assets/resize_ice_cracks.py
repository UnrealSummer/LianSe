from PIL import Image
import sys

# 打开图片
img = Image.open('ice_cracks_bing_v4_3.png')

print(f"原始尺寸: {img.size}")
print(f"原始模式: {img.mode}")

# 确保有alpha通道
if img.mode != 'RGBA':
    img = img.convert('RGBA')

# 缩放到64x64，使用高质量重采样
img_resized = img.resize((64, 64), Image.Resampling.LANCZOS)

# 保存
output_file = 'ice_cracks_64x64.png'
img_resized.save(output_file, 'PNG')

print(f"已缩放到: {img_resized.size}")
print(f"保存为: {output_file}")

# 显示文件大小
import os
size = os.path.getsize(output_file)
print(f"文件大小: {size} bytes ({size/1024:.1f} KB)")
