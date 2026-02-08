from PIL import Image

# 打开图片
img = Image.open(r"C:\Users\yu.zhang01\.clawdbot\media\inbound\068a5cf1-629a-4f65-8fc4-4376a7029b01.png")

# 转换为RGB
if img.mode == 'RGBA':
    bg = Image.new('RGB', img.size, (255, 255, 255))
    bg.paste(img, mask=img.split()[3])
    img = bg

pixels = img.load()
w, h = img.size

# 找边界（阈值235，因为边缘是239-240）
left, top, right, bottom = w, h, 0, 0
threshold = 235

for y in range(h):
    for x in range(w):
        r, g, b = pixels[x, y]
        if r < threshold or g < threshold or b < threshold:
            left = min(left, x)
            top = min(top, y)
            right = max(right, x)
            bottom = max(bottom, y)

print(f"Original: {w}x{h}")
print(f"Bounds: left={left}, top={top}, right={right}, bottom={bottom}")

# 裁剪
cropped = img.crop((left, top, right + 1, bottom + 1))
cropped.save(r"E:\Project\LianSe\ui_design_cropped.png")

print(f"Cropped: {cropped.size[0]}x{cropped.size[1]}")
print("Saved!")
