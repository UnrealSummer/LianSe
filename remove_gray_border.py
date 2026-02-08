from PIL import Image

img = Image.open(r"C:\Users\yu.zhang01\.clawdbot\media\inbound\838134bc-03e1-46ab-a4b2-ab96ad9d5784.png")
pixels = img.load()
w, h = img.size

print(f"Original size: {w}x{h}")

# 找到非深灰色区域的边界（深灰色是48,48,48）
left, top, right, bottom = w, h, 0, 0
threshold = 100  # 大于100的认为是内容

for y in range(h):
    for x in range(w):
        r, g, b = pixels[x, y]
        # 如果不是深色边框
        if r > threshold or g > threshold or b > threshold:
            left = min(left, x)
            top = min(top, y)
            right = max(right, x)
            bottom = max(bottom, y)

print(f"Content bounds: left={left}, top={top}, right={right}, bottom={bottom}")
print(f"Border size: left={left}px, top={top}px, right={w-right-1}px, bottom={h-bottom-1}px")

# 裁剪
if left < right and top < bottom:
    cropped = img.crop((left, top, right + 1, bottom + 1))
    output_path = r"E:\Project\LianSe\ui_design_no_border.png"
    cropped.save(output_path)
    print(f"\nCropped size: {cropped.size[0]}x{cropped.size[1]}")
    print(f"Saved to: {output_path}")
else:
    print("No content found!")
