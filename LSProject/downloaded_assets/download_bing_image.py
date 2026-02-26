import urllib.request
import sys

# 设置UTF-8编码
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Bing生成的图片ID（从URL中提取）
image_ids = [
    "LxoMxHtYAS28zZIg15so",  # 第1张 (从thId提取)
    "Hhn9Be3ylRjHUeKEibPl",  # 第2张
    "HP5MI2W7OMvat4DLf_M2",  # 第3张
    "cX_xwWfudZUhtmWfDSSw"   # 第4张
]

# 尝试不同的URL模式
def try_download(image_id, index):
    # 使用thId构建URL
    patterns = [
        f"https://th.bing.com/th/id/OIG1.{image_id}?pid=ImgGn",
        f"https://tse1.mm.bing.net/th/id/OIG1.{image_id}?pid=ImgGn",
    ]
    
    for pattern in patterns:
        try:
            print(f"Trying to download image {index+1}, URL: {pattern}")
            req = urllib.request.Request(pattern, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=10) as response:
                data = response.read()
                if len(data) > 1000:
                    filename = f"ice_cracks_bing_v4_{index+1}.png"
                    with open(filename, 'wb') as f:
                        f.write(data)
                    print(f"SUCCESS: {filename} ({len(data)} bytes)")
                    return True
        except Exception as e:
            print(f"FAILED: {e}")
    
    return False

# 下载所有图片
print("开始下载Bing生成的冰裂纹图片...")
success_count = 0
for i, img_id in enumerate(image_ids):
    if try_download(img_id, i):
        success_count += 1

print(f"\n完成！成功下载 {success_count}/{len(image_ids)} 张图片")
