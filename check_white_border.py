from PIL import Image

# 打开第一张图
img = Image.open(r"C:\Users\yu.zhang01\.clawdbot\media\inbound\068a5cf1-629a-4f65-8fc4-4376a7029b01.png")

print(f"Size: {img.size}")
print(f"Mode: {img.mode}")

# 转换为RGB
if img.mode == 'RGBA':
    bg = Image.new('RGB', img.size, (255, 255, 255))
    bg.paste(img, mask=img.split()[3])
    img = bg

pixels = img.load()
w, h = img.size

# 检查四条边的颜色
print("\n=== 检查边缘颜色 ===")

# 顶边
top_colors = [pixels[x, 0] for x in range(0, w, w//10)]
print(f"Top edge: {top_colors[:3]}...")

# 底边
bottom_colors = [pixels[x, h-1] for x in range(0, w, w//10)]
print(f"Bottom edge: {bottom_colors[:3]}...")

# 左边
left_colors = [pixels[0, y] for y in range(0, h, h//10)]
print(f"Left edge: {left_colors[:3]}...")

# 右边
right_colors = [pixels[w-1, y] for y in range(0, h, h//10)]
print(f"Right edge: {right_colors[:3]}...")

# 检查是否有白边（>240）
print("\n=== 检查白色像素 ===")
white_pixels = 0
edge_pixels = 0

# 检查外围20像素
border_width = 20
for y in range(h):
    for x in range(w):
        if x < border_width or x >= w - border_width or y < border_width or y >= h - border_width:
            edge_pixels += 1
            r, g, b = pixels[x, y]
            if r > 240 and g > 240 and b > 240:
                white_pixels += 1

print(f"Edge pixels: {edge_pixels}")
print(f"White pixels (>240): {white_pixels}")
print(f"White percentage: {white_pixels/edge_pixels*100:.1f}%")

if white_pixels / edge_pixels > 0.5:
    print("\n✓ 图片确实有白边！")
else:
    print("\n✗ 图片没有明显白边")
