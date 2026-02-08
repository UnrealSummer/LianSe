# 游戏UI快速搭建指南

## 🎯 目标

根据设计图搭建完整的游戏主界面UI

---

## 📦 已准备的资源

### 图标（10个）
- ✅ coin.png - 金币
- ✅ heart.png - 爱心
- ✅ star.png - 星星
- ✅ settings.png - 设置
- ✅ pause.png - 暂停
- ✅ play.png - 播放
- ✅ home.png - 主页
- ✅ skill_1.png - 技能1（红色）
- ✅ skill_2.png - 技能2（蓝色）
- ✅ skill_3.png - 技能3（绿色）

### UI面板（8个）
- ✅ background.png - 背景
- ✅ top_bar.png - 顶部栏
- ✅ bottom_bar.png - 底部栏
- ✅ panel_small.png - 小面板
- ✅ hp_bar.png - 血条
- ✅ time_bar.png - 时间条
- ✅ button_primary.png - 主按钮
- ✅ button_small.png - 小按钮

### 脚本
- ✅ GameUI.ts - UI管理脚本

---

## 🚀 搭建步骤（30分钟）

### 第一步：创建基础节点（5分钟）

1. **打开Main场景**

2. **创建UI根节点**
   - 在Canvas下创建节点，命名为 `GameUI`
   - 添加GameUI.ts脚本

3. **创建4个主要区域**
   - TopBar（顶部栏）
   - EnemyArea（敌人区域）
   - GameBoard（游戏棋盘）- 已存在
   - BottomBar（底部栏）

---

### 第二步：搭建顶部栏（10分钟）

#### 1. 创建TopBar节点
```
TopBar
├── Panel (Sprite)
├── CoinDisplay
│   ├── Icon (Sprite)
│   └── Label
├── LevelInfo (Label)
└── SettingsButton (Button)
    └── Icon (Sprite)
```

#### 2. 配置TopBar
- Position: (0, 607)
- Size: (750, 120)
- 添加Widget组件：
  - Top: 0
  - Left: 0
  - Right: 0

#### 3. 配置Panel
- 添加Sprite组件
- 拖入 `top_bar.png`
- Type: Sliced
- Size: (750, 120)

#### 4. 配置CoinDisplay
- Position: (-300, 0)
- 添加Layout组件（Horizontal）
- Spacing: 10

**Icon节点：**
- 添加Sprite组件
- 拖入 `coin.png`
- Size: (48, 48)

**Label节点：**
- 添加Label组件
- 字号：32
- 颜色：#FFD700（金黄色）
- 内容："0"

#### 5. 配置LevelInfo
- Position: (0, 0)
- 添加Label组件
- 字号：36
- 颜色：#333333
- 内容："关卡 1-1"

#### 6. 配置SettingsButton
- Position: (300, 0)
- 添加Button组件
- Size: (64, 64)

**Icon子节点：**
- 添加Sprite组件
- 拖入 `settings.png`
- Size: (48, 48)

---

### 第三步：搭建敌人区域（8分钟）

#### 1. 创建EnemyArea节点
```
EnemyArea
├── Panel (Sprite)
├── EnemySprite (Sprite)
├── HPBar (Sprite)
└── EnemyInfo
    ├── NameLabel
    └── TypeLabel
```

#### 2. 配置EnemyArea
- Position: (0, 447)
- Size: (750, 200)

#### 3. 配置Panel
- 添加Sprite组件
- 拖入 `panel_small.png`
- Type: Sliced
- Size: (700, 180)

#### 4. 配置EnemySprite
- Position: (0, 30)
- 添加Sprite组件
- Size: (120, 120)
- 颜色：灰色（占位符）

#### 5. 配置HPBar
- Position: (0, -50)
- 添加Sprite组件
- 拖入 `hp_bar.png`
- Type: Filled
- Fill Type: Horizontal
- Fill Range: 1.0
- Size: (300, 30)

#### 6. 配置EnemyInfo
- Position: (0, -80)

**NameLabel：**
- 字号：28
- 颜色：#333333
- 内容："普通敌人"

**TypeLabel：**
- Position: (0, -25)
- 字号：20
- 颜色：#666666
- 内容："类型：普通"

---

### 第四步：搭建底部栏（7分钟）

#### 1. 创建BottomBar节点
```
BottomBar
├── Panel (Sprite)
├── SkillButtons
│   ├── Skill1 (Button)
│   ├── Skill2 (Button)
│   └── Skill3 (Button)
└── PauseButton (Button)
```

#### 2. 配置BottomBar
- Position: (0, -577)
- Size: (750, 180)
- 添加Widget组件：
  - Bottom: 0
  - Left: 0
  - Right: 0

#### 3. 配置Panel
- 添加Sprite组件
- 拖入 `bottom_bar.png`
- Type: Sliced
- Size: (750, 180)

#### 4. 配置SkillButtons
- Position: (-200, 0)
- 添加Layout组件（Horizontal）
- Spacing: 20

**Skill1/2/3按钮（相同配置）：**
- 添加Button组件
- Size: (80, 80)
- Normal Sprite: `button_primary.png`

**每个按钮的Icon子节点：**
- Skill1: `skill_1.png`
- Skill2: `skill_2.png`
- Skill3: `skill_3.png`
- Size: (64, 64)

#### 5. 配置PauseButton
- Position: (300, 0)
- 添加Button组件
- Size: (80, 80)
- Normal Sprite: `button_secondary.png`

**Icon子节点：**
- 拖入 `pause.png`
- Size: (48, 48)

---

### 第五步：连接脚本（5分钟）

#### 1. 选中GameUI节点

#### 2. 在GameUI (Script)组件中配置引用

**顶部栏：**
- Coin Label → TopBar/CoinDisplay/Label
- Level Label → TopBar/LevelInfo
- Settings Button → TopBar/SettingsButton

**敌人区域：**
- Enemy Sprite → EnemyArea/EnemySprite
- Hp Bar Sprite → EnemyArea/HPBar
- Enemy Name Label → EnemyArea/EnemyInfo/NameLabel
- Enemy Type Label → EnemyArea/EnemyInfo/TypeLabel

**底部栏：**
- Skill1 Button → BottomBar/SkillButtons/Skill1
- Skill2 Button → BottomBar/SkillButtons/Skill2
- Skill3 Button → BottomBar/SkillButtons/Skill3
- Pause Button → BottomBar/PauseButton

#### 3. 保存场景

---

## ✅ 完成检查清单

### 顶部栏
- [ ] TopBar节点已创建
- [ ] Panel显示正常
- [ ] 金币图标和数字显示
- [ ] 关卡信息显示
- [ ] 设置按钮可点击

### 敌人区域
- [ ] EnemyArea节点已创建
- [ ] Panel显示正常
- [ ] 敌人占位符显示
- [ ] 血条显示（红色）
- [ ] 敌人信息显示

### 底部栏
- [ ] BottomBar节点已创建
- [ ] Panel显示正常
- [ ] 3个技能按钮显示
- [ ] 技能图标显示
- [ ] 暂停按钮显示

### 脚本连接
- [ ] GameUI脚本已添加
- [ ] 所有引用已配置
- [ ] 场景已保存

---

## 🎮 测试

### 运行游戏后检查：

1. **顶部栏**
   - 金币数字显示"0"
   - 关卡显示"关卡 1-1"
   - 设置按钮可点击

2. **敌人区域**
   - 血条显示满血（红色）
   - 敌人信息显示

3. **底部栏**
   - 3个技能按钮显示
   - 暂停按钮可点击

4. **控制台**
   - 点击按钮时有日志输出
   - 无错误信息

---

## 🐛 常见问题

### Q: 图标不显示？
A: 检查Sprite组件的SpriteFrame是否正确拖入

### Q: 按钮点击无反应？
A: 检查Button组件是否添加，Target是否正确

### Q: 血条不显示？
A: 检查Sprite的Type是否为Filled，Fill Range是否为1.0

### Q: 布局错乱？
A: 检查Widget组件设置，确保Top/Bottom/Left/Right正确

---

## 💡 提示

### 快速复制
- 可以复制粘贴相似的节点（如3个技能按钮）
- 只需修改图标即可

### 对齐工具
- 使用Cocos Creator的对齐工具
- Ctrl+Shift+方向键快速对齐

### 预览
- 随时点击运行查看效果
- 边搭建边测试

---

## 🚀 完成后

UI搭建完成后，你将拥有：
- ✅ 完整的游戏主界面
- ✅ 所有按钮可点击
- ✅ 信息显示正常
- ✅ 布局自适应

**下一步：连接游戏逻辑，让UI真正工作起来！**

---

**现在开始搭建吧！预计30分钟完成！**
