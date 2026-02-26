"""
使用OpenAI DALL-E API自动生成《炼色》主界面资源
需要OpenAI API Key
"""

import os
import requests
from pathlib import Path

# 配置
API_KEY = os.getenv("OPENAI_API_KEY", "")  # 从环境变量读取
OUTPUT_DIR = "main_menu_assets"
RAW_DIR = "."

# 创建目录
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 资源配置
resources = [
    {
        "name": "主界面背景",
        "prompt": """Mobile game main menu background, vertical portrait orientation,
deep space theme with dark blue purple gradient background,
scattered glowing white stars and nebula clouds,
sci-fi cartoon style, dreamy atmosphere,
professional game art, high quality,
no UI elements, no text, no buttons, no characters,
clean and simple composition, suitable for puzzle match-3 game""",
        "size": "1024x1792",  # 接近750x1334的比例
        "filename": "main_menu_bg_raw.png"
    },
    {
        "name": "游戏Logo",
        "prompt": """Game logo design with text "LianSe",
colorful gradient text effect with rainbow colors,
glowing neon edges, holographic style,
vibrant colors: red, orange, yellow, cyan, blue, purple gradient,
sci-fi cartoon style, modern game title design,
transparent background style,
professional game logo, high quality,
suitable for mobile puzzle game""",
        "size": "1024x1024",
        "filename": "game_logo_raw.png"
    },
    {
        "name": "开始按钮",
        "prompt": """Game UI button, single button design,
rounded rectangle shape with smooth corners,
purple to dark purple gradient,
glowing effect with soft light, white border outline,
sci-fi cartoon style, modern game UI design,
glossy surface with subtle highlights,
solid color background,
no text, no icons, just the button shape,
professional game UI asset, high quality""",
        "size": "1024x1024",
        "filename": "button_start_raw.png"
    },
    {
        "name": "次要按钮",
        "prompt": """Game UI button, secondary button style,
rounded rectangle shape, smaller size,
cyan to teal gradient,
subtle glow effect, white border outline,
sci-fi cartoon style, modern game UI design,
glossy surface, solid color background,
no text, no icons, just the button shape,
professional game UI asset, high quality""",
        "size": "1024x1024",
        "filename": "button_secondary_raw.png"
    },
    {
        "name": "装饰宝石",
        "prompt": """Glowing gem icon for game decoration,
rounded square shape with smooth corners,
red to orange gradient,
glossy crystal surface with white highlight on top,
glowing edges with soft light effect,
sci-fi cartoon style, vibrant colors,
solid color background,
professional game icon, high quality,
no text, no background elements""",
        "size": "1024x1024",
        "filename": "gem_decoration_raw.png"
    }
]

def generate_image_dalle(prompt, size, filename):
    """使用DALL-E 3生成图片"""
    if not API_KEY:
        print("  ❌ 未设置OPENAI_API_KEY环境变量")
        return False
    
    print(f"  正在生成...")
    
    try:
        # 调用DALL-E 3 API
        response = requests.post(
            "https://api.openai.com/v1/images/generations",
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "dall-e-3",
                "prompt": prompt,
                "n": 1,
                "size": size,
                "quality": "hd"
            },
            timeout=120
        )
        
        if response.status_code == 200:
            data = response.json()
            image_url = data['data'][0]['url']
            
            # 下载图片
            img_response = requests.get(image_url, timeout=30)
            if img_response.status_code == 200:
                filepath = os.path.join(RAW_DIR, filename)
                with open(filepath, 'wb') as f:
                    f.write(img_response.content)
                
                size_kb = len(img_response.content) / 1024
                print(f"  ✅ 生成成功！({size_kb:.1f}KB)")
                return True
            else:
                print(f"  ❌ 下载失败: {img_response.status_code}")
                return False
        else:
            print(f"  ❌ API调用失败: {response.status_code}")
            print(f"     {response.text}")
            return False
            
    except Exception as e:
        print(f"  ❌ 错误: {e}")
        return False

def main():
    print("=" * 70)
    print("《炼色》主界面资源 - 自动生成（DALL-E 3）")
    print("=" * 70)
    
    if not API_KEY:
        print("\n❌ 错误：未找到OpenAI API Key")
        print("\n请设置环境变量：")
        print("  Windows: set OPENAI_API_KEY=your_api_key")
        print("  Linux/Mac: export OPENAI_API_KEY=your_api_key")
        print("\n或者使用Bing Image Creator手动生成")
        return
    
    print(f"\n将生成 {len(resources)} 个资源...")
    print("=" * 70)
    
    success_count = 0
    
    for i, resource in enumerate(resources, 1):
        print(f"\n[{i}/{len(resources)}] {resource['name']}")
        print(f"  尺寸: {resource['size']}")
        print(f"  文件: {resource['filename']}")
        
        if generate_image_dalle(resource['prompt'], resource['size'], resource['filename']):
            success_count += 1
        
        # 避免API限流
        if i < len(resources):
            print("  等待5秒...")
            import time
            time.sleep(5)
    
    print("\n" + "=" * 70)
    print(f"✅ 完成！成功生成 {success_count}/{len(resources)} 个资源")
    print("=" * 70)
    
    if success_count > 0:
        print("\n下一步：运行处理脚本")
        print("  python process_main_menu.py")

if __name__ == "__main__":
    main()
