from PIL import Image

# 打开图片
img = Image.open(r"C:\Users\yu.zhang01\.clawdbot\media\inbound\068a5cf1-629a-4f65-8fc4-4376a7029b01.png")

print(f"Original size: {img.size}")

# 转换为RGB
if img.mode == 'RGBA':
    bg = Image.new('RGB', img.size, (255, 255, 255))
    bg.paste(img, mask=img.split()[3])
    img = bg

# 手动裁剪：去掉外围20像素
crop_margin = 20
w, h = img.size

cropped = img.crop((crop_margin, crop_margin, w - crop_margin, h - crop_margin))

output_path = r"E:\Project\LianSe\LSProject\assets\textures\ui\game_ui_design.png"
cropped.save(output_path, quality=95)

print(f"Cropped size: {cropped.size[0]}x{cropped.size[1]}")
print(f"Removed {crop_margin}px from each side")
print(f"Saved to: {output_path}")
print("\nDone!")
