from PIL import Image
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# 打开原始图片
img = Image.open('ice_cracks_64x64.png')
img = img.convert('RGBA')

print(f"Original mode: {img.mode}")
print(f"Original size: {img.size}")

# 获取像素数据
pixels = img.load()

# 将深色背景转换为透明
# 策略：如果RGB都比较暗（<100），就设为透明
# 如果RGB都比较亮（>200），保持白色
transparent_count = 0
white_count = 0

for y in range(img.height):
    for x in range(img.width):
        r, g, b, a = pixels[x, y]
        
        # 计算亮度
        brightness = (r + g + b) / 3
        
        if brightness < 100:
            # 深色 -> 透明
            pixels[x, y] = (0, 0, 0, 0)
            transparent_count += 1
        elif brightness > 200:
            # 亮色 -> 纯白色
            pixels[x, y] = (255, 255, 255, 255)
            white_count += 1
        else:
            # 中间色 -> 根据亮度调整alpha
            # 亮度越低，越透明
            alpha = int((brightness - 100) / 100 * 255)
            pixels[x, y] = (255, 255, 255, alpha)

print(f"Transparent pixels: {transparent_count}")
print(f"White pixels: {white_count}")
print(f"Semi-transparent pixels: {img.width * img.height - transparent_count - white_count}")

# 保存
output_file = 'ice_cracks_64x64_transparent.png'
img.save(output_file, 'PNG')
print(f"Saved to: {output_file}")

# 验证
img_check = Image.open(output_file)
extrema = img_check.getextrema()
print(f"New A range: {extrema[3]}")
