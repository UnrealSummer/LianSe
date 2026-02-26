from PIL import Image, ImageDraw, ImageFont
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# 创建画布 (手机竖屏 9:16)
width = 720
height = 1280
img = Image.new('RGB', (width, height), color='#F0F4F8')
draw = ImageDraw.Draw(img)

# 尝试加载字体，如果失败使用默认字体
try:
    font_large = ImageFont.truetype("arial.ttf", 32)
    font_medium = ImageFont.truetype("arial.ttf", 24)
    font_small = ImageFont.truetype("arial.ttf", 18)
except:
    font_large = ImageFont.load_default()
    font_medium = ImageFont.load_default()
    font_small = ImageFont.load_default()

# 颜色定义
colors = {
    'red': '#FF3B30',
    'yellow': '#FFCC00',
    'blue': '#007AFF',
    'orange': '#FF9500',
    'purple': '#AF52DE',
    'green': '#34C759',
    'white': '#FFFFFF',
    'gray': '#646464',
    'light_blue': '#B4DCFF',
    'bg': '#F0F4F8',
    'text': '#333333'
}

# 1. 标题栏 (0-80)
draw.rectangle([0, 0, width, 80], fill='#007AFF')
draw.text((width//2, 40), "《炼色》LianSe", fill='white', font=font_large, anchor='mm')

# 2. 信息栏 (80-180)
draw.rectangle([20, 90, width-20, 170], fill='white', outline='#CCCCCC', width=2)
# 分数
draw.text((60, 110), "⭐ 分数:", fill=colors['text'], font=font_medium, anchor='lt')
draw.text((60, 140), "1250", fill='#FF9500', font=font_medium, anchor='lt')
# 目标
draw.text((width//2, 110), "🎯 目标:", fill=colors['text'], font=font_medium, anchor='mt')
draw.text((width//2, 140), "3000", fill='#34C759', font=font_medium, anchor='mt')
# 步数
draw.text((width-60, 110), "💎 步数:", fill=colors['text'], font=font_medium, anchor='rt')
draw.text((width-60, 140), "15", fill='#FF3B30', font=font_medium, anchor='rt')

# 3. 敌人区域 (180-280)
draw.rectangle([20, 190, width-20, 270], fill='#FFE5E5', outline='#FF3B30', width=3)
draw.text((width//2, 200), "👾 敌人 HP: 100/150", fill='#FF3B30', font=font_medium, anchor='mt')
# 血条
draw.rectangle([60, 235, width-60, 255], fill='#CCCCCC')
draw.rectangle([60, 235, 60 + (width-120)*0.67, 255], fill='#FF3B30')

# 4. 棋盘 (300-940) - 8x8网格
board_top = 300
board_size = 640
cell_size = 80
board_left = (width - board_size) // 2

# 棋盘背景
draw.rectangle([board_left-10, board_top-10, board_left+board_size+10, board_top+board_size+10], 
               fill='white', outline='#CCCCCC', width=3)

# 绘制方块
block_colors = ['red', 'yellow', 'blue', 'orange', 'purple', 'green']
special_blocks = {
    (2, 2): 'rainbow',  # 彩虹方块
    (5, 5): 'stone',    # 石头方块
    (1, 6): 'frozen',   # 冰冻方块
    (6, 1): 'frozen'    # 冰冻方块
}

for row in range(8):
    for col in range(8):
        x = board_left + col * cell_size
        y = board_top + row * cell_size
        
        # 检查是否是特殊方块
        if (row, col) in special_blocks:
            block_type = special_blocks[(row, col)]
            if block_type == 'rainbow':
                # 彩虹方块 - 渐变效果（简化为多色）
                draw.rectangle([x+5, y+5, x+cell_size-5, y+cell_size-5], 
                             fill='#FF00FF', outline='white', width=2)
                draw.text((x+cell_size//2, y+cell_size//2), "🌈", 
                         fill='white', font=font_medium, anchor='mm')
            elif block_type == 'stone':
                # 石头方块
                draw.rectangle([x+5, y+5, x+cell_size-5, y+cell_size-5], 
                             fill=colors['gray'], outline='#333333', width=2)
                draw.text((x+cell_size//2, y+cell_size//2), "🪨", 
                         fill='white', font=font_medium, anchor='mm')
            elif block_type == 'frozen':
                # 冰冻方块 - 蓝色底 + 冰层
                color = colors[block_colors[(row + col) % 6]]
                draw.rectangle([x+5, y+5, x+cell_size-5, y+cell_size-5], 
                             fill=color, outline='white', width=2)
                # 冰层覆盖
                draw.rectangle([x+5, y+5, x+cell_size-5, y+cell_size-5], 
                             fill=colors['light_blue'] + '80', outline='#B4DCFF', width=2)
                draw.text((x+cell_size//2, y+cell_size//2), "❄️", 
                         fill='white', font=font_small, anchor='mm')
        else:
            # 普通方块
            color = colors[block_colors[(row + col) % 6]]
            draw.rectangle([x+5, y+5, x+cell_size-5, y+cell_size-5], 
                         fill=color, outline='white', width=2)

# 5. 道具栏 (960-1060)
draw.rectangle([20, 970, width-20, 1050], fill='white', outline='#007AFF', width=2)
draw.text((width//2, 980), "道具", fill=colors['text'], font=font_medium, anchor='mt')

# 道具按钮
tools = [
    ("🌈", "彩虹", 60),
    ("💣", "炸弹", 240),
    ("🔄", "刷新", 420),
    ("⚡", "提示", 600)
]

for emoji, name, x in tools:
    draw.rectangle([x, 1010, x+100, 1040], fill='#007AFF', outline='white', width=2)
    draw.text((x+50, 1025), f"{emoji} {name}", fill='white', font=font_small, anchor='mm')

# 6. 说明文字 (1070-1280)
draw.text((width//2, 1090), "游戏元素说明:", fill=colors['text'], font=font_medium, anchor='mt')
draw.text((40, 1120), "🟥🟨🟦🟧🟪🟩 - 6种颜色方块", fill=colors['text'], font=font_small, anchor='lt')
draw.text((40, 1150), "🌈 彩虹方块 - 万能匹配", fill=colors['text'], font=font_small, anchor='lt')
draw.text((40, 1180), "🪨 石头方块 - 不可移动", fill=colors['text'], font=font_small, anchor='lt')
draw.text((40, 1210), "❄️ 冰冻方块 - 需要2次消除", fill=colors['text'], font=font_small, anchor='lt')
draw.text((40, 1240), "👾 敌人 - 每回合攻击", fill=colors['text'], font=font_small, anchor='lt')

# 保存
output_file = 'game_prototype_complete.png'
img.save(output_file, 'PNG')
print(f"游戏原型图已生成: {output_file}")
print(f"尺寸: {width}x{height}")
print(f"包含元素: 标题、信息栏、敌人、8x8棋盘、特殊方块、道具栏、说明")
