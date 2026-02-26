"""
《炼色》主界面 - 半自动生成助手
自动打开Bing链接，你只需点击"创建"和下载
"""

import webbrowser
import time
import os

# 资源配置
resources = [
    {
        "name": "1. 主界面背景",
        "url": "https://www.bing.com/images/create?q=Mobile+game+main+menu+background%2C+vertical+portrait+orientation%2C+deep+space+theme+with+dark+blue+purple+gradient+background%2C+scattered+glowing+white+stars+and+nebula+clouds%2C+sci-fi+cartoon+style%2C+dreamy+atmosphere%2C+professional+game+art%2C+high+quality%2C+no+UI+elements%2C+no+text%2C+no+buttons%2C+clean+composition",
        "save_as": "main_menu_bg_raw.jpg",
        "tips": "选择最深色、最有太空感的一张"
    },
    {
        "name": "2. 游戏Logo",
        "url": "https://www.bing.com/images/create?q=Game+logo+design+LianSe%2C+colorful+gradient+rainbow+text%2C+glowing+neon+edges%2C+holographic+style%2C+sci-fi+cartoon%2C+modern+game+title%2C+transparent+background%2C+professional+game+logo%2C+high+quality%2C+no+background+elements",
        "save_as": "game_logo_raw.png",
        "tips": "生成后点击'编辑' → 使用'擦除'去背景"
    },
    {
        "name": "3. 开始按钮",
        "url": "https://www.bing.com/images/create?q=Game+UI+button%2C+rounded+rectangle%2C+purple+gradient%2C+glowing+effect%2C+white+border%2C+sci-fi+cartoon%2C+glossy+surface%2C+no+text%2C+no+icons%2C+professional+game+UI%2C+high+quality",
        "save_as": "button_start_raw.png",
        "tips": "选择最圆润、最有光泽的按钮"
    },
    {
        "name": "4. 次要按钮",
        "url": "https://www.bing.com/images/create?q=Game+UI+button%2C+rounded+rectangle%2C+cyan+teal+gradient%2C+subtle+glow%2C+white+border%2C+sci-fi+cartoon%2C+glossy%2C+no+text%2C+no+icons%2C+professional+game+UI",
        "save_as": "button_secondary_raw.png",
        "tips": "选择蓝绿色渐变的按钮"
    },
    {
        "name": "5. 装饰宝石",
        "url": "https://www.bing.com/images/create?q=Glowing+gem+icon%2C+rounded+square%2C+red+orange+gradient%2C+glossy+crystal%2C+white+highlight%2C+glowing+edges%2C+sci-fi+cartoon%2C+vibrant+colors%2C+transparent+background%2C+professional+game+icon%2C+no+text",
        "save_as": "gem_decoration_raw.png",
        "tips": "选择最有光泽、最发光的宝石"
    }
]

def main():
    print("=" * 80)
    print("《炼色》主界面 - 半自动生成助手")
    print("=" * 80)
    print("\n这个工具会自动打开Bing生成页面（提示词已填充）")
    print("你只需要：")
    print("  1. 点击'创建'按钮")
    print("  2. 等待生成（30-60秒）")
    print("  3. 选择最满意的一张")
    print("  4. 下载保存")
    print("\n" + "=" * 80)
    
    input("\n按回车开始...")
    
    for i, resource in enumerate(resources):
        print("\n" + "=" * 80)
        print(f"{resource['name']}")
        print("=" * 80)
        print(f"保存为: {resource['save_as']}")
        print(f"提示: {resource['tips']}")
        print("\n正在打开Bing...")
        
        # 打开浏览器
        webbrowser.open(resource['url'])
        
        print("\n✅ 浏览器已打开！")
        print("\n📝 操作步骤：")
        print("  1. 在打开的页面中点击'创建'按钮")
        print("  2. 等待生成完成（约30-60秒）")
        print("  3. 选择最满意的一张图片")
        if ".png" in resource['save_as']:
            print("  4. 点击'编辑' → 使用'擦除'工具去除背景")
            print("  5. 使用'裁剪'工具裁剪到合适大小")
        print(f"  6. 点击下载，保存为: {resource['save_as']}")
        print(f"     保存到: E:\\Project\\LianSe\\LSProject\\art_generation\\")
        
        if i < len(resources) - 1:
            print("\n" + "=" * 80)
            input("完成后按回车继续下一个...")
        else:
            print("\n" + "=" * 80)
            print("这是最后一个资源！")
            input("完成后按回车...")
    
    print("\n" + "=" * 80)
    print("✅ 所有资源生成完成！")
    print("=" * 80)
    
    print("\n📥 下一步：运行处理脚本")
    print("  cd E:\\Project\\LianSe\\LSProject\\art_generation")
    print("  python process_main_menu.py")
    print("\n这会自动调整尺寸和优化所有资源")
    
    print("\n" + "=" * 80)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n已取消")
    except Exception as e:
        print(f"\n错误: {e}")
