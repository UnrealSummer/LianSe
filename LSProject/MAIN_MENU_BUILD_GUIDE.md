# 主菜单搭建指南

## 🎯 目标

创建游戏的主菜单场景，包括标题、开始按钮、设置按钮等。

---

## 📋 搭建步骤（20分钟）

### 第一步：创建场景（2分钟）

1. **在Cocos Creator中**
   - 右键 `assets` 文件夹
   - 创建 → Scene
   - 命名为 `MainMenu`

2. **打开MainMenu场景**
   - 双击MainMenu.scene

---

### 第二步：设置Canvas（2分钟）

1. **选中Canvas节点**
   - 确认设计分辨率：750x1334

2. **添加背景**
   - 在Canvas下创建节点，命名为 `Background`
   - 添加Sprite组件
   - 拖入 `assets/textures/ui/background.png`
   - 设置Size为750x1334（或使用Widget填满）

---

### 第三步：创建UI根节点（1分钟）

1. **在Canvas下创建节点**
   - 命名为 `MainMenuUI`
   - 添加MainMenuUI.ts脚本

---

### 第四步：创建标题（3分钟）

1. **在MainMenuUI下创建节点**
   - 命名为 `Title`
   - Position: (0, 400)

2. **添加Label组件**
   - 文字：炼色
   - 字号：80
   - 颜色：白色或金色
   - 字体：粗体

3. **可选：添加阴影效果**
   - 添加LabelOutline组件
   - 颜色：深色
   - 宽度：3

---

### 第五步：创建按钮容器（2分钟）

1. **在MainMenuUI下创建节点**
   - 命名为 `ButtonContainer`
   - Position: (0, 0)

2. **添加Layout组件**
   - Type: Vertical
   - Spacing: 30
   - Resize Mode: Container

---

### 第六步：创建开始按钮（4分钟）

1. **在ButtonContainer下创建节点**
   - 命名为 `StartButton`
   - Size: (300, 100)

2. **添加Sprite组件**
   - 拖入 `button_primary.png`
   - Type: Sliced

3. **添加Button组件**
   - Target: 自身
   - Transition: Scale
   - Duration: 0.1

4. **添加Label子节点**
   - 命名为 `Label`
   - 文字：开始游戏
   - 字号：40
   - 颜色：白色
   - Position: (0, 0)

---

### 第七步：创建设置按钮（3分钟）

1. **复制StartButton**
   - Ctrl+D 或右键复制
   - 命名为 `SettingsButton`

2. **修改Sprite**
   - 改为 `button_secondary.png`

3. **修改Label**
   - 文字改为：设置

---

### 第八步：创建退出按钮（可选）（2分钟）

1. **复制SettingsButton**
   - 命名为 `ExitButton`

2. **修改Label**
   - 文字改为：退出游戏

---

### 第九步：连接脚本（3分钟）

1. **选中MainMenuUI节点**

2. **在MainMenuUI (Script)组件中配置引用**
   - Start Button → ButtonContainer/StartButton
   - Settings Button → ButtonContainer/SettingsButton
   - Exit Button → ButtonContainer/ExitButton
   - Title Node → Title

3. **保存场景**（Ctrl+S）

---

## 🎨 节点结构

```
MainMenu (Scene)
└── Canvas
    ├── Background (Sprite - background.png)
    └── MainMenuUI (MainMenuUI.ts)
        ├── Title (Label - "炼色")
        └── ButtonContainer (Layout - Vertical)
            ├── StartButton (Button)
            │   ├── Sprite (button_primary.png)
            │   └── Label ("开始游戏")
            ├── SettingsButton (Button)
            │   ├── Sprite (button_secondary.png)
            │   └── Label ("设置")
            └── ExitButton (Button)
                ├── Sprite (button_secondary.png)
                └── Label ("退出游戏")
```

---

## 🎯 详细配置

### Background节点
- **Sprite组件：**
  - SpriteFrame: background.png
  - Type: Simple
  - Size Mode: Custom
  - Width: 750
  - Height: 1334

### Title节点
- **Position:** (0, 400)
- **Label组件：**
  - String: 炼色
  - Font Size: 80
  - Color: #FFFFFF 或 #FFD700
  - Horizontal Align: Center
  - Vertical Align: Center
- **LabelOutline组件（可选）：**
  - Color: #000000
  - Width: 3

### ButtonContainer节点
- **Position:** (0, 0)
- **Layout组件：**
  - Type: Vertical
  - Resize Mode: Container
  - Spacing Y: 30
  - Padding Top: 0
  - Padding Bottom: 0

### StartButton节点
- **Size:** (300, 100)
- **Sprite组件：**
  - SpriteFrame: button_primary.png
  - Type: Sliced
- **Button组件：**
  - Transition: Scale
  - Duration: 0.1
  - Zoom Scale: 0.95
- **Label子节点：**
  - String: 开始游戏
  - Font Size: 40
  - Color: #FFFFFF

### SettingsButton节点
- **Size:** (300, 100)
- **Sprite组件：**
  - SpriteFrame: button_secondary.png
  - Type: Sliced
- **Button组件：**
  - Transition: Scale
  - Duration: 0.1
  - Zoom Scale: 0.95
- **Label子节点：**
  - String: 设置
  - Font Size: 40
  - Color: #333333

---

## ✅ 完成检查清单

- [ ] MainMenu场景已创建
- [ ] 背景显示正常
- [ ] 标题显示"炼色"
- [ ] 开始按钮显示正常
- [ ] 设置按钮显示正常
- [ ] 退出按钮显示正常（可选）
- [ ] MainMenuUI脚本已添加
- [ ] 所有按钮引用已配置
- [ ] 场景已保存

---

## 🎮 测试

### 运行MainMenu场景

1. **在场景列表中右键MainMenu**
   - 设为启动场景（临时测试）

2. **点击运行**

3. **检查：**
   - 背景显示正常
   - 标题显示正常
   - 按钮可以点击
   - 点击开始按钮切换到Main场景
   - 控制台有日志输出

---

## 🐛 常见问题

### Q: 点击开始按钮没反应？
A: 检查Button组件的Target是否正确，MainMenuUI脚本的引用是否配置

### Q: 场景切换失败？
A: 确保Main场景在Build Settings中已添加

### Q: 按钮文字看不清？
A: 调整Label的颜色，或添加LabelOutline组件

### Q: 布局不对？
A: 检查Layout组件的设置，确保Spacing和Padding正确

---

## 🎨 美化建议（可选）

### 添加动画
1. **标题淡入动画**
   - 使用Tween或Animation组件
   - 从透明到不透明

2. **按钮弹出动画**
   - 从小到大
   - 依次弹出

### 添加粒子效果
1. **背景粒子**
   - 飘落的星星或光点
   - 增加氛围

### 添加音效
1. **背景音乐**
   - 循环播放
   - 音量适中

2. **按钮音效**
   - 点击时播放

---

## 🚀 下一步

主菜单完成后：
1. **测试场景切换**
2. **实现游戏流程控制**
3. **添加暂停菜单**
4. **实现游戏结束界面**

---

**现在开始搭建吧！预计20分钟完成！**

**搭建完成后告诉我，我们继续下一个功能！**
