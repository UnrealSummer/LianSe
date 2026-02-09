# 词条选择UI搭建指南

## ✅ 代码已完成

ModifierSelectionUI.ts 已经存在，功能完整！

---

## 🎮 在Cocos Creator中搭建（30分钟）

### 节点结构

```
Canvas
└── ModifierSelectPanel (Node, Active: false)
    └── ModifierSelectionUI (Script: ModifierSelectionUI.ts)
        ├── Background (Sprite - 半透明遮罩)
        ├── Title (Label - "选择词条")
        └── OptionsContainer (Node + Layout)
            ├── Option1 (Node)
            │   ├── Panel (Sprite - 卡片背景)
            │   ├── Name (Label - 词条名称)
            │   └── Description (Label - 词条描述)
            ├── Option2 (Node)
            │   ├── Panel (Sprite - 卡片背景)
            │   ├── Name (Label - 词条名称)
            │   └── Description (Label - 词条描述)
            └── Option3 (Node)
                ├── Panel (Sprite - 卡片背景)
                ├── Name (Label - 词条名称)
                └── Description (Label - 词条描述)
```

---

## 📋 详细步骤

### 第一步：创建ModifierSelectPanel（5分钟）

1. **在Canvas下创建节点**
   - 命名为 `ModifierSelectPanel`
   - Active: **false**（默认隐藏）
   - Position: (0, 0)
   - Size: (750, 1334)

2. **添加ModifierSelectionUI脚本**
   - 选中ModifierSelectPanel
   - 添加组件 → 搜索 "ModifierSelectionUI"
   - 添加

---

### 第二步：创建背景遮罩（2分钟）

```
ModifierSelectPanel
└── Background (Sprite)
    ├── Position: (0, 0)
    ├── Size: (750, 1334)
    ├── Color: 黑色, Alpha: 200
    └── 添加Button组件（阻止点击穿透）
```

---

### 第三步：创建标题（2分钟）

```
ModifierSelectPanel
└── Title (Label)
    ├── Position: (0, 500)
    ├── String: "选择词条"
    ├── Font Size: 60
    ├── Color: #FFD700（金色）
    └── Horizontal Align: Center
```

---

### 第四步：创建选项容器（3分钟）

```
ModifierSelectPanel
└── OptionsContainer (Node + Layout)
    ├── Position: (0, 0)
    ├── Layout组件：
    │   ├── Type: Horizontal
    │   ├── Spacing: 30
    │   ├── Resize Mode: Container
    │   └── Horizontal Align: Center
    └── Size: (700, 400)
```

---

### 第五步：创建词条卡片（15分钟）

#### 创建Option1

```
OptionsContainer
└── Option1 (Node)
    ├── Size: (200, 350)
    ├── Panel (Sprite)
    │   ├── Position: (0, 0)
    │   ├── Size: (200, 350)
    │   ├── Sprite: panel_main.png
    │   └── Type: Sliced
    ├── Name (Label)
    │   ├── Position: (0, 120)
    │   ├── String: "词条名称"
    │   ├── Font Size: 32
    │   ├── Color: #FFFFFF
    │   ├── Horizontal Align: Center
    │   └── Overflow: Shrink
    └── Description (Label)
        ├── Position: (0, -50)
        ├── Size: (180, 200)
        ├── String: "词条描述"
        ├── Font Size: 24
        ├── Color: #CCCCCC
        ├── Horizontal Align: Center
        ├── Vertical Align: Top
        └── Overflow: Shrink
```

#### 复制Option2和Option3

1. **复制Option1节点**
2. **重命名为Option2**
3. **再复制一次，重命名为Option3**
4. **Layout会自动排列**

---

### 第六步：连接引用（3分钟）

1. **选中ModifierSelectPanel节点**

2. **在ModifierSelectionUI (Script)组件中配置：**
   - **Option 1** → 拖入 Option1 节点
   - **Option 2** → 拖入 Option2 节点
   - **Option 3** → 拖入 Option3 节点

3. **保存场景**（Ctrl+S）

---

### 第七步：连接到GameFlowController（2分钟）

1. **选中GameFlowController节点**

2. **在GameFlowController (Script)组件中**
   - **Modifier Select Panel** → 拖入 ModifierSelectPanel 节点

3. **保存场景**

---

## 🎨 美化建议（可选）

### 1. 添加卡片悬停效果

在Option节点上添加Button组件：
- Transition: Scale
- Normal Scale: (1, 1, 1)
- Pressed Scale: (0.95, 0.95, 1)
- Hover Scale: (1.05, 1.05, 1)

### 2. 添加稀有度边框

根据稀有度显示不同颜色的边框：
- 普通：白色
- 稀有：蓝色
- 史诗：紫色

### 3. 添加图标

在Name上方添加词条图标（可选）

---

## 🔧 工作原理

### 代码逻辑

```typescript
// GameCore胜利后
GameFlowController.onGameWin()
  ↓
GameFlowController.changeState(MODIFIER_SELECT)
  ↓
GameFlowController.onModifierSelect()
  ↓
发出 'show-modifier-selection' 事件
  ↓
GameCore.showModifierSelection()
  ↓
ModifierSelectionUI.show(modifiers, callback)
  ↓
显示3个词条卡片
  ↓
用户点击选择
  ↓
ModifierSelectionUI.onOptionClicked()
  ↓
调用callback
  ↓
GameCore.onModifierSelected()
  ↓
应用词条效果，进入下一关
```

---

## ✅ 测试清单

- [ ] ModifierSelectPanel节点已创建
- [ ] ModifierSelectionUI脚本已添加
- [ ] 3个Option节点已创建
- [ ] 每个Option有Name和Description子节点
- [ ] ModifierSelectionUI的引用已配置
- [ ] GameFlowController的引用已配置
- [ ] 运行游戏，击败敌人
- [ ] 显示词条选择界面
- [ ] 3个词条正确显示
- [ ] 点击选择有效
- [ ] 选择后进入下一关

---

## 🐛 故障排除

### Q: 词条选择界面不显示？
A: 
1. 检查ModifierSelectPanel的Active初始状态是否为false
2. 检查GameFlowController的Modifier Select Panel引用
3. 查看控制台是否有 "[ModifierSelectionUI] Showing selection"

### Q: 词条信息不显示？
A:
1. 检查Option节点的子节点名称是否为 "Name" 和 "Description"
2. 检查Label组件是否存在
3. 查看控制台日志

### Q: 点击没反应？
A:
1. 检查Option节点是否有Button组件（代码会自动添加）
2. 检查ModifierSelectionUI的Option引用是否正确

---

## 🎯 完成后的效果

- ✅ 击败敌人后显示词条选择界面
- ✅ 显示3个词条卡片
- ✅ 每个卡片显示名称和描述
- ✅ 稀有度用颜色区分（白/蓝/紫）
- ✅ 点击选择词条
- ✅ 选择后应用效果并进入下一关

---

**预计时间：30分钟**

**现在去Cocos Creator搭建吧！完成后告诉我！**
