"""
方块颜色生成脚本
基于红色方块生成其他颜色版本
"""

from PIL import Image
import numpy as np

def rgb_to_hsv(rgb):
    """RGB转HSV"""
    r, g, b = rgb[0]/255.0, rgb[1]/255.0, rgb[2]/255.0
    max_c = max(r, g, b)
    min_c = min(r, g, b)
    diff = max_c - min_c
    
    if max_c == min_c:
        h = 0
    elif max_c == r:
        h = (60 * ((g - b) / diff) + 360) % 360
    elif max_c == g:
        h = (60 * ((b - r) / diff) + 120) % 360
    else:
        h = (60 * ((r - g) / diff) + 240) % 360
    
    s = 0 if max_c == 0 else (diff / max_c)
    v = max_c
    
    return h, s, v

def hsv_to_rgb(hsv):
    """HSV转RGB"""
    h, s, v = hsv
    c = v * s
    x = c * (1 - abs((h / 60) % 2 - 1))
    m = v - c
    
    if 0 <= h < 60:
        r, g, b = c, x, 0
    elif 60 <= h < 120:
        r, g, b = x, c, 0
    elif 120 <= h < 180:
        r, g, b = 0, c, x
    elif 180 <= h < 240:
        r, g, b = 0, x, c
    elif 240 <= h < 300:
        r, g, b = x, 0, c
    else:
        r, g, b = c, 0, x
    
    return int((r + m) * 255), int((g + m) * 255), int((b + m) * 255)

def shift_hue(image, hue_shift):
    """调整图片色相"""
    img_array = np.array(image)
    result = np.zeros_like(img_array)
    
    for i in range(img_array.shape[0]):
        for j in range(img_array.shape[1]):
            pixel = img_array[i, j]
            
            # 保持透明度和白色背景
            if len(pixel) == 4:
                r, g, b, a = pixel
                if a == 0 or (r > 250 and g > 250 and b > 250):
                    result[i, j] = pixel
                    continue
            else:
                r, g, b = pixel
                if r > 250 and g > 250 and b > 250:
                    result[i, j] = pixel
                    continue
            
            # 转换色相
            h, s, v = rgb_to_hsv((r, g, b))
            h = (h + hue_shift) % 360
            new_r, new_g, new_b = hsv_to_rgb((h, s, v))
            
            if len(pixel) == 4:
                result[i, j] = [new_r, new_g, new_b, a]
            else:
                result[i, j] = [new_r, new_g, new_b]
    
    return Image.fromarray(result)

def generate_color_blocks(input_path, output_dir):
    """生成所有颜色的方块"""
    # 读取红色方块
    red_block = Image.open(input_path)
    
    # 色相偏移量（度数）
    colors = {
        'red': 0,      # 原始红色
        'orange': 30,  # 橙色
        'yellow': 60,  # 黄色
        'green': 120,  # 绿色
        'cyan': 180,   # 青色（蓝色）
        'blue': 200,   # 深蓝色
        'purple': 280  # 紫色
    }
    
    print("开始生成方块...")
    
    for color_name, hue_shift in colors.items():
        if hue_shift == 0:
            # 红色直接复制
            output_path = f"{output_dir}/{color_name}.png"
            red_block.save(output_path)
            print(f"✓ {color_name}.png (原始)")
        else:
            # 生成其他颜色
            new_block = shift_hue(red_block, hue_shift)
            output_path = f"{output_dir}/{color_name}.png"
            new_block.save(output_path)
            print(f"✓ {color_name}.png (色相偏移 {hue_shift}°)")
    
    print("\n所有方块生成完成！")
    print(f"输出目录: {output_dir}")

if __name__ == "__main__":
    import os
    
    # 输入文件路径
    input_file = "C:/Users/yu.zhang01/.clawdbot/media/inbound/e6f40ddc-66a9-4b49-bf29-0f22e7965d44.png"
    
    # 输出目录
    output_dir = "E:/Project/LianSe/LSProject/assets/textures/blocks"
    
    # 创建输出目录
    os.makedirs(output_dir, exist_ok=True)
    
    # 生成方块
    generate_color_blocks(input_file, output_dir)
