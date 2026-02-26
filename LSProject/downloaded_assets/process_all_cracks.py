from PIL import Image
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def make_transparent(input_file, output_file):
    """将图片的深色背景转换为透明"""
    img = Image.open(input_file)
    img = img.convert('RGBA')
    
    pixels = img.load()
    transparent_count = 0
    
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = pixels[x, y]
            brightness = (r + g + b) / 3
            
            if brightness < 100:
                pixels[x, y] = (0, 0, 0, 0)
                transparent_count += 1
            elif brightness > 200:
                pixels[x, y] = (255, 255, 255, 255)
            else:
                alpha = int((brightness - 100) / 100 * 255)
                pixels[x, y] = (255, 255, 255, alpha)
    
    img.save(output_file, 'PNG')
    print(f"Processed: {input_file} -> {output_file} ({transparent_count} transparent pixels)")
    return img

# 处理所有4张图片
for i in range(1, 5):
    input_file = f'ice_cracks_bing_v4_{i}.png'
    
    # 先缩放到64x64
    img = Image.open(input_file)
    img = img.convert('RGBA')
    img_resized = img.resize((64, 64), Image.Resampling.LANCZOS)
    temp_file = f'ice_cracks_v4_{i}_64x64_temp.png'
    img_resized.save(temp_file, 'PNG')
    
    # 再转换为透明
    output_file = f'ice_cracks_v4_{i}_64x64_transparent.png'
    make_transparent(temp_file, output_file)

print("\nAll done! You can now try different versions:")
print("- ice_cracks_v4_1_64x64_transparent.png")
print("- ice_cracks_v4_2_64x64_transparent.png")
print("- ice_cracks_v4_3_64x64_transparent.png (current)")
print("- ice_cracks_v4_4_64x64_transparent.png")
