from PIL import Image
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# 打开图片
img = Image.open('ice_cracks_64x64.png')

print(f"Mode: {img.mode}")
print(f"Size: {img.size}")

if img.mode == 'RGBA':
    print("HAS alpha channel")
    
    # 获取极值
    extrema = img.getextrema()
    print(f"R range: {extrema[0]}")
    print(f"G range: {extrema[1]}")
    print(f"B range: {extrema[2]}")
    print(f"A range: {extrema[3]}")
    
    # 检查是否有透明像素
    pixels = list(img.getdata())
    transparent_count = sum(1 for p in pixels if p[3] == 0)
    total = len(pixels)
    print(f"Transparent pixels: {transparent_count}/{total} ({transparent_count/total*100:.1f}%)")
    
    # 检查背景颜色
    print(f"Top-left pixel: {img.getpixel((0, 0))}")
    print(f"Center pixel: {img.getpixel((32, 32))}")
    
elif img.mode == 'RGB':
    print("NO alpha channel!")
    print(f"Top-left pixel: {img.getpixel((0, 0))}")
    print(f"Center pixel: {img.getpixel((32, 32))}")
    
    # 检查是否是黑色背景
    bg_color = img.getpixel((0, 0))
    if bg_color[0] < 50 and bg_color[1] < 50 and bg_color[2] < 50:
        print("WARNING: Black background detected!")
