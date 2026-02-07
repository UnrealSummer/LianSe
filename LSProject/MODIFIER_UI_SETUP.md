# 词条选择UI配置文档

## 🎨 UI结构

```
Canvas
└── ModifierSelectionUI (Node)
    ├── Background (Sprite) - 半透明黑色背景
    ├── Title (Label) - "选择一个词条"
    ├── ModifierOption1 (Node)
    │   ├── Background (Sprite) - 词条背景
    │   ├── Name (Label) - 词条名称
    │   └── Description (Label) - 词条描述
    ├── ModifierOption2 (Node)
    └── ModifierOption3 (Node)
```

---

## 📋 快速配置步骤

### 1. 创建ModifierSelectionUI节点

1. 在Canvas下创建空节点，命名为 `ModifierSelectionUI`
2. 位置：(0, 0, 0)
3. 添加组件：`ModifierSelectionUI`
4. 默认隐藏：active = false

### 2. 创建背景

1. 在ModifierSelectionUI下创建Sprite节点
2. 命名为 `Background`
3. 大小：(750, 1334) - 全屏
4. 颜色：黑色，Alpha = 180（半透明）

### 3. 创建标题

1. 在ModifierSelectionUI下创建Label节点
2. 命名为 `Title`
3. 位置：(0, 400, 0)
4. Label配置：
   - String: "选择一个词条"
   - Font Size: 48
   - Color: 白色

### 4. 创建词条选项（3个）

对于每个选项（Option1, Option2, Option3）：

1. 创建空节点，命名为 `ModifierOption1`
2. 位置：
   - Option1: (0, 150, 0)
   - Option2: (0, 0, 0)
   - Option3: (0, -150, 0)
3. 大小：(600, 120)

#### 4.1 选项背景
1. 在Option下创建Sprite节点，命名为 `Background`
2. 大小：(600, 120)
3. 颜色：深灰色 (60, 60, 60)

#### 4.2 选项名称
1. 在Option下创建Label节点，命名为 `Name`
2. 位置：(0, 30, 0)
3. Label配置：
   - String: "词条名称"
   - Font Size: 32
   - Color: 白色

#### 4.3 选项描述
1. 在Option下创建Label节点，命名为 `Description`
2. 位置：(0, -20, 0)
3. Label配置：
   - String: "词条描述"
   - Font Size: 24
   - Color: 灰色 (180, 180, 180)

### 5. 连接ModifierSelectionUI引用

选中ModifierSelectionUI节点，在属性检查器中：
- **Option1**: 拖拽 ModifierOption1 节点
- **Option2**: 拖拽 ModifierOption2 节点
- **Option3**: 拖拽 ModifierOption3 节点

---

## 💡 快速创建提示

最简配置：
1. 创建3个按钮（Button组件）
2. 每个按钮包含名称和描述Label
3. 添加点击事件

---

*配置完成后，击败敌人会显示词条选择UI*
