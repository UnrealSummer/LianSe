# 敌人UI配置文档

## 🎨 EnemySystem UI结构

```
EnemySystem (0, 380, 0)
├── EnemySprite (Sprite) - 敌人图标
├── HpBar (Node) - 血条背景
│   └── HpBarFill (Node) - 血条填充
└── HpLabel (Label) - 血量文字
```

---

## 📋 配置步骤

### 1. 创建EnemySprite（敌人图标）

1. 在EnemySystem节点下创建Sprite节点
2. 命名为 `EnemySprite`
3. 位置：(0, 50, 0)
4. 大小：(100, 100)
5. 颜色：红色（临时，代表敌人）

### 2. 创建血条背景

1. 在EnemySystem节点下创建Sprite节点
2. 命名为 `HpBar`
3. 位置：(0, -20, 0)
4. 大小：(200, 20)
5. 颜色：深灰色 (80, 80, 80)

### 3. 创建血条填充

1. 在HpBar节点下创建Sprite节点
2. 命名为 `HpBarFill`
3. 位置：(-100, 0, 0)（左对齐）
4. 锚点：(0, 0.5)（左中）
5. 大小：(200, 16)
6. 颜色：红色 (255, 59, 48)

### 4. 创建血量文字

1. 在EnemySystem节点下创建Label节点
2. 命名为 `HpLabel`
3. 位置：(0, -20, 0)
4. Label配置：
   - String: "50 / 50"
   - Font Size: 20
   - Color: 白色
   - Horizontal Align: CENTER

### 5. 连接EnemySystem引用

选中EnemySystem节点，在属性检查器中：
- **Enemy Sprite**: 拖拽 EnemySprite 节点
- **Hp Label**: 拖拽 HpLabel 节点
- **Hp Bar Fill**: 拖拽 HpBarFill 节点

---

## 🎨 视觉效果

```
     ┌─────┐
     │     │  ← 敌人图标（红色方块）
     │  👹 │
     └─────┘
     
  ████████░░  ← 血条（红色填充+灰色背景）
    50 / 50   ← 血量文字
```

---

## 💡 快速创建（可选）

如果你想快速创建，可以：

1. 创建一个简单的红色方块作为敌人
2. 创建两个Sprite作为血条
3. 创建一个Label显示血量

最简配置：
- 敌人：红色Sprite (100×100)
- 血条背景：灰色Sprite (200×20)
- 血条填充：红色Sprite (200×16)，锚点(0, 0.5)
- 血量文字：Label

---

*配置完成后运行游戏，应该能看到敌人和血条了！*
