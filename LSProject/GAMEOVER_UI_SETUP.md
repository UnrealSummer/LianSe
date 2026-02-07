# 游戏结束UI配置文档

## 🎮 游戏结束UI

游戏结束时显示胜利或失败界面。

---

## 📋 快速配置步骤

### 1. 创建GameOverUI节点

1. 在Canvas下创建空节点，命名为 `GameOverUI`
2. 位置：(0, 0, 0)
3. 添加组件：`GameOverUI`
4. 默认隐藏：active = false

### 2. 创建胜利面板

#### 2.1 创建VictoryPanel
1. 在GameOverUI下创建空节点，命名为 `VictoryPanel`
2. 位置：(0, 0, 0)
3. 大小：(600, 400)

#### 2.2 添加背景
1. 在VictoryPanel下创建Sprite节点，命名为 `Background`
2. 大小：(600, 400)
3. 颜色：深绿色 (50, 150, 50, 200)

#### 2.3 添加标题
1. 在VictoryPanel下创建Label节点，命名为 `Title`
2. 位置：(0, 150, 0)
3. Label配置：
   - String: "胜利！"
   - Font Size: 60
   - Color: 黄色 (255, 255, 0)

#### 2.4 添加关卡信息
1. 在VictoryPanel下创建Label节点，命名为 `StageLabel`
2. 位置：(0, 80, 0)
3. Label配置：
   - String: "第1关 完成！"
   - Font Size: 36
   - Color: 白色

#### 2.5 添加统计信息
1. 在VictoryPanel下创建Label节点，命名为 `StatsLabel`
2. 位置：(0, 20, 0)
3. Label配置：
   - String: "移动次数: 10\n最大连击: x3"
   - Font Size: 28
   - Color: 白色

#### 2.6 添加金币信息
1. 在VictoryPanel下创建Label节点，命名为 `CoinLabel`
2. 位置：(0, -40, 0)
3. Label配置：
   - String: "获得金币: 150"
   - Font Size: 32
   - Color: 金色 (255, 200, 0)

#### 2.7 添加下一关按钮
1. 在VictoryPanel下创建Button节点，命名为 `NextButton`
2. 位置：(0, -120, 0)
3. 大小：(200, 60)
4. Button配置：
   - Label: "下一关"
   - Font Size: 36
   - Color: 白色
   - Background: 绿色 (0, 200, 0)

---

### 3. 创建失败面板

#### 3.1 创建DefeatPanel
1. 在GameOverUI下创建空节点，命名为 `DefeatPanel`
2. 位置：(0, 0, 0)
3. 大小：(600, 400)

#### 3.2 添加背景
1. 在DefeatPanel下创建Sprite节点，命名为 `Background`
2. 大小：(600, 400)
3. 颜色：深红色 (150, 50, 50, 200)

#### 3.3 添加标题
1. 在DefeatPanel下创建Label节点，命名为 `Title`
2. 位置：(0, 150, 0)
3. Label配置：
   - String: "失败"
   - Font Size: 60
   - Color: 红色 (255, 100, 100)

#### 3.4 添加关卡信息
1. 在DefeatPanel下创建Label节点，命名为 `StageLabel`
2. 位置：(0, 80, 0)
3. Label配置：
   - String: "第1关 失败"
   - Font Size: 36
   - Color: 白色

#### 3.5 添加统计信息
1. 在DefeatPanel下创建Label节点，命名为 `StatsLabel`
2. 位置：(0, 20, 0)
3. Label配置：
   - String: "移动次数: 10\n最大连击: x3"
   - Font Size: 28
   - Color: 白色

#### 3.6 添加重新开始按钮
1. 在DefeatPanel下创建Button节点，命名为 `RestartButton`
2. 位置：(0, -120, 0)
3. 大小：(200, 60)
4. Button配置：
   - Label: "重新开始"
   - Font Size: 36
   - Color: 白色
   - Background: 红色 (200, 0, 0)

---

### 4. 连接GameOverUI引用

选中GameOverUI节点，在属性检查器中：
- **Victory Panel**: 拖拽 VictoryPanel 节点
- **Defeat Panel**: 拖拽 DefeatPanel 节点
- **Victory Stage Label**: 拖拽 VictoryPanel/StageLabel
- **Victory Stats Label**: 拖拽 VictoryPanel/StatsLabel
- **Victory Coin Label**: 拖拽 VictoryPanel/CoinLabel
- **Defeat Stage Label**: 拖拽 DefeatPanel/StageLabel
- **Defeat Stats Label**: 拖拽 DefeatPanel/StatsLabel
- **Victory Next Button**: 拖拽 VictoryPanel/NextButton
- **Defeat Restart Button**: 拖拽 DefeatPanel/RestartButton

---

## 💡 最简配置

如果时间紧张，可以：
1. 只创建一个面板
2. 只显示"胜利"或"失败"文字
3. 一个"继续"按钮

---

## 🎯 测试效果

配置完成后：
1. 击败敌人 → 显示胜利界面
2. 时间耗尽 → 显示失败界面
3. 点击按钮 → 继续游戏

---

*配置完成后，游戏结束会显示UI，可以继续或重新开始！*
