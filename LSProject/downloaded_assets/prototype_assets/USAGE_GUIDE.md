# 《炼色》原型图美术资源使用指南

## 📦 资源清单

已生成18个PNG文件，位置：`E:\Project\LianSe\LSProject\downloaded_assets\prototype_assets\`

### 1. 宝石方块 (6个) - `blocks/`
- `block_red.png` (512x512) - 红色宝石，渐变效果
- `block_blue.png` (512x512) - 蓝色宝石
- `block_yellow.png` (512x512) - 黄色宝石
- `block_purple.png` (512x512) - 紫色宝石（绿色调）
- `block_orange.png` (512x512) - 橙色宝石（粉色调）
- `block_green.png` (512x512) - 绿色宝石（蓝紫色调）

**特点：**
- 圆角矩形设计
- 渐变色填充
- 顶部高光效果
- 半透明边框

### 2. UI元素 (6个) - `ui/`
- `hp_bar_bg.png` (600x40) - 敌人血条背景（深色半透明）
- `hp_bar_fill.png` (600x40) - 敌人血条填充（红色渐变+发光）
- `board_bg.png` (680x680) - 游戏棋盘背景（半透明深色）
- `enemy_area_bg.png` (690x280) - 敌人区域背景
- `gravity_panel_bg.png` (690x220) - 重力控制面板背景
- `background.png` (1500x2668) - 游戏背景（深色渐变+星星装饰）

**特点：**
- 半透明设计，适合叠加
- 圆角矩形
- 微妙边框
- 科幻风格

### 3. 按钮 (4个) - `buttons/`
- `gravity_btn.png` (120x120) - 重力方向按钮（紫色渐变）
- `gravity_btn_active.png` (120x120) - 激活状态（红色渐变+发光）
- `time_display.png` (160x60) - 时间显示按钮（红色渐变）
- `coin_display.png` (160x60) - 金币显示按钮（黄色渐变）

**特点：**
- 圆角设计
- 渐变填充
- 激活状态有发光效果
- 半透明边框

### 4. 图标 (2个) - `icons/`
- `enemy_placeholder.png` (160x160) - 敌人占位符（紫色渐变）
- `empty_cell.png` (80x80) - 空白方块格子（半透明白色）

---

## 🎨 设计风格

### 色彩方案
- **主色调：** 深色科幻背景（#1a1a2e → #0f3460）
- **宝石颜色：** 6种鲜艳渐变色
- **UI元素：** 半透明深色 + 白色边框
- **按钮：** 紫色/红色/黄色渐变

### 视觉特点
1. **渐变效果** - 所有元素都有渐变填充
2. **圆角设计** - 统一的圆角风格
3. **半透明** - UI元素半透明，适合叠加
4. **发光效果** - 激活状态有发光边框
5. **高光** - 宝石有顶部高光

---

## 🔧 在Cocos Creator中使用

### 步骤1：导入资源
1. 打开Cocos Creator
2. 在资源管理器中刷新
3. 资源会自动出现在 `downloaded_assets/prototype_assets/`

### 步骤2：应用宝石方块
1. 选中Block预制体
2. 在Block (Script)组件中：
   - `redSprite` → `block_red.png`
   - `blueSprite` → `block_blue.png`
   - `yellowSprite` → `block_yellow.png`
   - `purpleSprite` → `block_purple.png`
   - `orangeSprite` → `block_orange.png`
   - `greenSprite` → `block_green.png`

### 步骤3：应用UI元素

#### 敌人血条
1. 找到敌人血条节点
2. 背景Sprite → `hp_bar_bg.png`
3. 填充Sprite → `hp_bar_fill.png`（使用Filled类型，Fill Type: HORIZONTAL）

#### 游戏棋盘
1. 找到棋盘背景节点
2. Sprite → `board_bg.png`

#### 敌人区域
1. 找到敌人区域背景节点
2. Sprite → `enemy_area_bg.png`

#### 重力控制面板
1. 找到重力面板背景节点
2. Sprite → `gravity_panel_bg.png`

#### 游戏背景
1. 找到场景背景节点
2. Sprite → `background.png`

### 步骤4：应用按钮

#### 重力方向按钮
1. 找到4个重力方向按钮
2. Normal Sprite → `gravity_btn.png`
3. Pressed Sprite → `gravity_btn_active.png`
4. Hover Sprite → `gravity_btn_active.png`

#### 时间/金币显示
1. 找到时间显示节点
2. Sprite → `time_display.png`
3. 找到金币显示节点
4. Sprite → `coin_display.png`

### 步骤5：应用图标

#### 敌人占位符
1. 找到敌人精灵节点
2. Sprite → `enemy_placeholder.png`

#### 空白格子
1. 找到方块格子背景节点
2. Sprite → `empty_cell.png`

---

## 📐 尺寸参考

### 微信小游戏标准分辨率
- **设计分辨率：** 750x1334（竖屏）
- **实际显示：** 375x667（CSS像素）

### 元素尺寸对应
- **宝石方块：** 512x512 → 显示约40x40
- **游戏棋盘：** 680x680 → 显示约340x340
- **重力按钮：** 120x120 → 显示约60x60
- **血条：** 600x40 → 显示约300x20

---

## 🎯 使用建议

### 1. 宝石方块
- 已经包含高光和边框，直接使用即可
- 如果觉得太亮，可以调整节点的Opacity

### 2. UI背景
- 半透明设计，适合叠加在游戏背景上
- 可以调整Color属性改变色调

### 3. 按钮
- 使用Button组件的Transition: SPRITE模式
- Normal/Pressed/Hover分别设置不同状态

### 4. 血条
- 使用Sprite的Filled模式
- Fill Type: HORIZONTAL
- Fill Range: 0-1（根据血量百分比）

---

## 🔄 后续优化

### 可以改进的地方
1. **宝石方块** - 可以添加更多细节（宝石切面、反光）
2. **敌人图片** - 替换占位符为实际敌人图片
3. **特效** - 添加粒子特效（消除、爆炸）
4. **动画** - 添加按钮按下动画、宝石闪烁动画

### 如果需要调整
- 所有资源都是用Python脚本生成的
- 修改 `generate_assets_clean.py` 中的参数
- 重新运行脚本即可生成新资源

---

## 📝 资源文件位置

**原型图：**
- `C:\Users\yu.zhang01\clawd\lianse_prototype\game_main_screen_v2.html`

**生成脚本：**
- `C:\Users\yu.zhang01\clawd\lianse_prototype\generate_assets_clean.py`

**美术资源：**
- `E:\Project\LianSe\LSProject\downloaded_assets\prototype_assets\`

---

## ✅ 完成检查清单

- [ ] 导入所有资源到Cocos Creator
- [ ] 应用6个宝石方块到Block预制体
- [ ] 应用游戏背景
- [ ] 应用棋盘背景
- [ ] 应用敌人区域背景
- [ ] 应用敌人血条（背景+填充）
- [ ] 应用重力控制面板背景
- [ ] 应用4个重力方向按钮
- [ ] 应用时间/金币显示按钮
- [ ] 应用敌人占位符
- [ ] 测试游戏运行效果

---

**所有资源已准备就绪，可以直接在Cocos Creator中使用！**
