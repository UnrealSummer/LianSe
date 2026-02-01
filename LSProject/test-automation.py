#!/usr/bin/env python3
"""
《炼色》自动化测试脚本
通过截图识别和鼠标点击来玩游戏
"""

import time
import json
from PIL import Image
import numpy as np

# 游戏配置
GAME_URL = "http://localhost:7456/"
GRID_SIZE = 5
BLOCK_SIZE = 80
SPACING = 10

# 颜色识别阈值（RGB）
COLORS = {
    'red': (255, 59, 48),
    'yellow': (255, 204, 0),
    'blue': (0, 122, 255),
    'orange': (255, 149, 0),
    'purple': (175, 82, 222),
    'green': (52, 199, 89),
    'deep_red': (180, 0, 0),
    'deep_yellow': (200, 160, 0),
    'deep_blue': (0, 50, 150),
    'rainbow': (255, 255, 255),
}

class GameTester:
    def __init__(self):
        self.test_results = []
        self.bugs_found = []
        self.total_games = 0
        
    def analyze_screenshot(self, image_path):
        """分析截图，识别方块布局"""
        img = Image.open(image_path)
        img_array = np.array(img)
        
        # 计算游戏区域（中心位置）
        height, width = img_array.shape[:2]
        center_x = width // 2
        center_y = height // 2
        
        # 计算网格起始位置
        grid_start_x = center_x - (GRID_SIZE * (BLOCK_SIZE + SPACING)) // 2
        grid_start_y = center_y - (GRID_SIZE * (BLOCK_SIZE + SPACING)) // 2
        
        grid = []
        for row in range(GRID_SIZE):
            grid_row = []
            for col in range(GRID_SIZE):
                # 计算方块中心位置
                x = grid_start_x + col * (BLOCK_SIZE + SPACING) + BLOCK_SIZE // 2
                y = grid_start_y + row * (BLOCK_SIZE + SPACING) + BLOCK_SIZE // 2
                
                # 采样颜色（取方块中心的颜色）
                if 0 <= y < height and 0 <= x < width:
                    pixel_color = tuple(img_array[y, x, :3])
                    color_name = self.identify_color(pixel_color)
                    grid_row.append({
                        'color': color_name,
                        'position': (x, y),
                        'row': row,
                        'col': col
                    })
                else:
                    grid_row.append(None)
            grid.append(grid_row)
        
        return grid
    
    def identify_color(self, rgb):
        """识别RGB颜色最接近的游戏颜色"""
        min_dist = float('inf')
        closest_color = 'unknown'
        
        for color_name, color_rgb in COLORS.items():
            # 计算欧氏距离
            dist = sum((a - b) ** 2 for a, b in zip(rgb, color_rgb)) ** 0.5
            if dist < min_dist:
                min_dist = dist
                closest_color = color_name
        
        # 如果距离太远，认为是未知颜色
        if min_dist > 100:
            return 'unknown'
        
        return closest_color
    
    def find_best_move(self, grid):
        """找到最佳的混合策略"""
        moves = []
        
        for row in range(GRID_SIZE):
            for col in range(GRID_SIZE):
                if grid[row][col] is None:
                    continue
                    
                color1 = grid[row][col]['color']
                
                # 检查右边
                if col < GRID_SIZE - 1 and grid[row][col + 1] is not None:
                    color2 = grid[row][col + 1]['color']
                    result = self.can_mix(color1, color2)
                    if result:
                        priority = self.calculate_priority(color1, color2, result)
                        moves.append({
                            'from': grid[row][col],
                            'to': grid[row][col + 1],
                            'result': result,
                            'priority': priority
                        })
                
                # 检查下边
                if row < GRID_SIZE - 1 and grid[row + 1][col] is not None:
                    color2 = grid[row + 1][col]['color']
                    result = self.can_mix(color1, color2)
                    if result:
                        priority = self.calculate_priority(color1, color2, result)
                        moves.append({
                            'from': grid[row][col],
                            'to': grid[row + 1][col],
                            'result': result,
                            'priority': priority
                        })
        
        # 按优先级排序
        moves.sort(key=lambda m: m['priority'], reverse=True)
        return moves[0] if moves else None
    
    def can_mix(self, color1, color2):
        """判断两个颜色能否混合"""
        mix_rules = {
            ('red', 'yellow'): 'orange',
            ('yellow', 'red'): 'orange',
            ('red', 'blue'): 'purple',
            ('blue', 'red'): 'purple',
            ('yellow', 'blue'): 'green',
            ('blue', 'yellow'): 'green',
            ('red', 'red'): 'deep_red',
            ('yellow', 'yellow'): 'deep_yellow',
            ('blue', 'blue'): 'deep_blue',
            ('rainbow', 'red'): 'deep_red',
            ('red', 'rainbow'): 'deep_red',
            ('rainbow', 'yellow'): 'deep_yellow',
            ('yellow', 'rainbow'): 'deep_yellow',
            ('rainbow', 'blue'): 'deep_blue',
            ('blue', 'rainbow'): 'deep_blue',
        }
        return mix_rules.get((color1, color2))
    
    def calculate_priority(self, color1, color2, result):
        """计算优先级"""
        priority = 10
        
        # 彩虹方块优先
        if 'rainbow' in (color1, color2):
            priority += 20
        
        # 强化色优先
        if result.startswith('deep_'):
            priority += 15
        
        # 目标颜色（橙色）优先
        if result == 'orange':
            priority += 30
        
        return priority
    
    def run_test_round(self, round_num):
        """运行一轮测试"""
        print(f"\n{'='*50}")
        print(f"第{round_num}轮测试开始")
        print(f"{'='*50}")
        
        test_log = {
            'round': round_num,
            'actions': [],
            'bugs': [],
            'final_score': 0,
            'steps_used': 0
        }
        
        # TODO: 实际实现需要调用Desktop-Node的截图和点击功能
        # 这里先返回模拟结果
        
        print(f"第{round_num}轮测试完成")
        return test_log
    
    def generate_report(self):
        """生成测试报告"""
        report = {
            'total_games': self.total_games,
            'bugs_found': self.bugs_found,
            'test_results': self.test_results,
            'summary': {
                'average_score': sum(r.get('final_score', 0) for r in self.test_results) / max(len(self.test_results), 1),
                'bugs_count': len(self.bugs_found),
                'success_rate': sum(1 for r in self.test_results if r.get('final_score', 0) > 0) / max(len(self.test_results), 1)
            }
        }
        
        return report

if __name__ == '__main__':
    print("《炼色》自动化测试 - 启动")
    print("=" * 50)
    
    tester = GameTester()
    
    # 运行10轮测试
    for i in range(1, 11):
        result = tester.run_test_round(i)
        tester.test_results.append(result)
        tester.total_games += 1
        time.sleep(2)  # 每轮之间休息2秒
    
    # 生成报告
    report = tester.generate_report()
    
    # 保存报告
    with open('E:/Project/LianSe/LSProject/test-report.json', 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    print("\n" + "=" * 50)
    print("测试完成！")
    print(f"总游戏数: {report['total_games']}")
    print(f"发现Bug数: {report['summary']['bugs_count']}")
    print(f"平均分数: {report['summary']['average_score']:.1f}")
    print("详细报告已保存到: test-report.json")
