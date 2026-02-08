# 游戏主界面布局方案

## 📐 整体布局

基于设计图的UI布局方案（750x1334设计分辨率）

---

## 🎨 区域划分

### 1. 顶部栏（Top Bar）- 高度：120px
位置：屏幕顶部
背景：半透明白色面板

#### 左侧：金币显示
- 金币图标（48x48）
- 金币数量文字（字号：32，颜色：金黄色）
- 位置：左上角，边距20px

#### 中间：关卡信息
- 关卡文字（如"关卡 1-1"）
- 字号：36，颜色：深色
- 位置：居中

#### 右侧：设置按钮
- 设置图标按钮（64x64）
- 位置：右上角，边距20px

---

### 2. 敌人区域（Enemy Area）- 高度：200px
位置：顶部栏下方
背景：半透明面板

#### 敌人显示
- 敌人图片/占位符（120x120）
- 位置：居中

#### 血条
- 宽度：300px，高度：30px
- 位置：敌人下方
- 使用：hp_bar.png（Filled类型）

#### 敌人信息
- 敌人名称（字号：28）
- 敌人类型标签
- 位置：血条下方

---

### 3. 游戏棋盘区域（Game Board）- 高度：600px
位置：敌人区域下方
背景：可选边框

#### 棋盘
- 8x8网格
- 方块大小：根据可用空间自动计算
- 间距：10-15px
- 居中显示

---

### 4. 底部栏（Bottom Bar）- 高度：180px
位置：屏幕底部
背景：半透明白色面板

#### 技能按钮区域（左侧）
- 3个技能按钮
- 按钮大小：80x80
- 横向排列，间距：15px
- 位置：左侧，边距20px

#### 暂停按钮（右侧）
- 暂停按钮（80x80）
- 位置：右下角，边距20px

---

## 📊 详细尺寸规格

### 设计分辨率：750x1334

```
┌─────────────────────────────────────┐
│  Top Bar (750x120)                  │ ← 金币、关卡、设置
├─────────────────────────────────────┤
│  Enemy Area (750x200)               │ ← 敌人、血条
├─────────────────────────────────────┤
│                                     │
│  Game Board (750x600)               │ ← 8x8棋盘
│                                     │
├─────────────────────────────────────┤
│  Bottom Bar (750x180)               │ ← 技能、暂停
└─────────────────────────────────────┘
```

---

## 🎯 Cocos Creator节点结构

```
Canvas (750x1334)
├── Background (背景)
│   └── Sprite (background.png)
│
├── TopBar (顶部栏)
│   ├── Panel (top_bar.png)
│   ├── CoinDisplay (金币显示)
│   │   ├── Icon (coin.png)
│   │   └── Label (金币数量)
│   ├── LevelInfo (关卡信息)
│   │   └── Label ("关卡 1-1")
│   └── SettingsButton (设置按钮)
│       └── Button (button_small.png)
│
├── EnemyArea (敌人区域)
│   ├── Panel (panel_small.png)
│   ├── EnemySprite (敌人图片)
│   ├── HPBar (血条)
│   │   └── Sprite (hp_bar.png, Filled)
│   └── EnemyInfo (敌人信息)
│       ├── NameLabel (敌人名称)
│       └── TypeLabel (敌人类型)
│
├── GameBoard (游戏棋盘)
│   ├── BoardFrame (可选边框)
│   └── GridSystem (网格系统)
│       └── Blocks (方块们)
│
└── BottomBar (底部栏)
    ├── Panel (bottom_bar.png)
    ├── SkillButtons (技能按钮)
    │   ├── Skill1 (button_primary.png)
    │   ├── Skill2 (button_primary.png)
    │   └── Skill3 (button_primary.png)
    └── PauseButton (暂停按钮)
        └── Button (button_secondary.png)
```

---

## 🎨 颜色方案

### 背景
- 渐变：浅蓝 → 浅紫
- 使用：background.png

### 面板
- 半透明白色（alpha: 0.9）
- 圆角：20px
- 使用：top_bar.png, bottom_bar.png

### 按钮
- 主按钮：蓝色（button_primary.png）
- 次按钮：白色（button_secondary.png）
- 小按钮：蓝色（button_small.png）

### 文字
- 标题：深灰色 #333333
- 数值：金黄色 #FFD700
- 普通文字：深灰色 #666666

---

## 📏 具体坐标（以Canvas中心为原点）

### TopBar
- Position: (0, 607)
- Size: (750, 120)

### EnemyArea
- Position: (0, 447)
- Size: (750, 200)

### GameBoard
- Position: (0, 47)
- Size: (750, 600)

### BottomBar
- Position: (0, -577)
- Size: (750, 180)

---

## 🔧 Widget组件设置

### TopBar
- Top: 0
- Left: 0
- Right: 0
- Height: 120

### BottomBar
- Bottom: 0
- Left: 0
- Right: 0
- Height: 180

### GameBoard
- 居中对齐
- 根据剩余空间自动调整

---

## 💡 实现步骤

### 第一步：创建基础结构（15分钟）
1. 创建Canvas节点
2. 添加Background节点
3. 创建TopBar、EnemyArea、GameBoard、BottomBar节点

### 第二步：应用资源（15分钟）
1. TopBar使用top_bar.png
2. BottomBar使用bottom_bar.png
3. 按钮使用对应的button图片
4. 图标使用coin.png等

### 第三步：添加组件（20分钟）
1. 添加Label组件显示文字
2. 添加Button组件
3. 添加Sprite组件显示图片
4. 配置Widget组件自适应

### 第四步：连接脚本（20分钟）
1. 创建GameUI.ts脚本
2. 引用各个UI节点
3. 更新金币、关卡等信息
4. 绑定按钮事件

---

## 🎯 关键点

### 自适应
- 使用Widget组件
- TopBar和BottomBar固定在顶部和底部
- GameBoard居中，根据剩余空间调整

### 性能
- 使用图集（Atlas）
- 预加载常用资源
- 对象池管理方块

### 交互
- 按钮点击反馈
- 技能冷却显示
- 血条平滑变化

---

## 📝 需要的新资源

### 图标
- ✅ coin.png（已有）
- ❌ settings_icon.png（设置图标）
- ❌ pause_icon.png（暂停图标）
- ❌ skill_icon_1.png（技能1图标）
- ❌ skill_icon_2.png（技能2图标）
- ❌ skill_icon_3.png（技能3图标）

### 面板
- ✅ top_bar.png（已有）
- ✅ bottom_bar.png（已有）
- ✅ panel_small.png（已有，用于敌人区域）

### 按钮
- ✅ button_primary.png（已有）
- ✅ button_secondary.png（已有）
- ✅ button_small.png（已有）

---

## 🚀 下一步

1. **生成缺失的图标资源**
2. **创建GameUI.ts脚本**
3. **在Cocos Creator中搭建UI**
4. **连接现有系统**

**要我先生成缺失的图标资源吗？**
