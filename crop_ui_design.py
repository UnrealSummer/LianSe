from PIL import Image

# 打开图片
img = Image.open(r"C:\Users\yu.zhang01\.clawdbot\media\inbound\068a5cf1-629a-4f65-8fc4-4376a7029b01.png")

print(f"Original size: {img.size}")

# 转换为RGB
if img.mode == 'RGBA':
    bg = Image.new('RGB', img.size, (255, 255, 255))
    bg.paste(img, mask=img.split()[3])
    img = bg

pixels = img.load()
w, h = img.size

# 找边界（阈值230，因为边缘是239-241）
left, top, right, bottom = w, h, 0, 0
threshold = 230

for y in range(h):
    for x in range(w):
        r, g, b = pixels[x, y]
        # 如果不是浅色
        if r < threshold or g < threshold or b < threshold:
            left = min(left, x)
            top = min(top, y)
            right = max(right, x)
            bottom = max(bottom, y)

print(f"Content bounds: left={left}, top={top}, right={right}, bottom={bottom}")
print(f"Removed: left={left}px, top={top}px, right={w-right-1}px, bottom={h-bottom-1}px")

# 裁剪
if left < right and top < bottom:
    cropped = img.crop((left, top, right + 1, bottom + 1))
    output_path = r"E:\Project\LianSe\LSProject\assets\textures\ui\game_ui_design.png"
    cropped.save(output_path, quality=95)
    print(f"\nCropped size: {cropped.size[0]}x{cropped.size[1]}")
    print(f"Saved to: {output_path}")
    print("\nDone! White border removed!")
else:
    print("Error: No content found!")
