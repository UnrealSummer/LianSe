from PIL import Image

img = Image.open(r"C:\Users\yu.zhang01\.clawdbot\media\inbound\838134bc-03e1-46ab-a4b2-ab96ad9d5784.png")
pixels = img.load()
w, h = img.size

print(f"Image size: {w}x{h}")
print(f"Mode: {img.mode}")

# 检查边缘的颜色分布
print("\nTop edge (y=0):")
for x in [0, 50, 100, 200, 400, 600, w-1]:
    print(f"  x={x}: {pixels[x, 0]}")

print("\nLeft edge (x=0):")
for y in [0, 50, 100, 200, 400, h-1]:
    print(f"  y={y}: {pixels[0, y]}")

print("\nCenter area:")
for pos in [(w//4, h//4), (w//2, h//2), (3*w//4, 3*h//4)]:
    print(f"  {pos}: {pixels[pos]}")

# 找白色区域
print("\nSearching for white pixels (>240)...")
white_found = False
for y in range(min(50, h)):
    for x in range(min(50, w)):
        r, g, b = pixels[x, y]
        if r > 240 and g > 240 and b > 240:
            print(f"  Found white at ({x}, {y}): {pixels[x, y]}")
            white_found = True
            break
    if white_found:
        break

if not white_found:
    print("  No white pixels found in top-left 50x50 area")
