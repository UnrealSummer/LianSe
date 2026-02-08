from PIL import Image

img = Image.open(r"C:\Users\yu.zhang01\.clawdbot\media\inbound\068a5cf1-629a-4f65-8fc4-4376a7029b01.png")

if img.mode == 'RGBA':
    bg = Image.new('RGB', img.size, (255, 255, 255))
    bg.paste(img, mask=img.split()[3])
    img = bg

pixels = img.load()

# 采样多个点
samples = [
    (50, 50), (512, 50), (974, 50),
    (50, 512), (512, 512), (974, 512),
    (50, 974), (512, 974), (974, 974)
]

print("Sample pixels:")
for pos in samples:
    print(f"  {pos}: RGB{pixels[pos]}")
