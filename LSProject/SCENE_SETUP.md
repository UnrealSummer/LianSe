# 场景配置文档 - Main.scene

## 🎯 场景结构

```
Canvas
├── Camera
├── GameCore (空节点)
│   ├── GridSystem (空节点)
│   ├── EnemySystem (空节点)
│   ├── DamageSystem (空节点)
│   ├── ModifierSystem (空节点)
│   └── ProgressionManager (空节点)
└── UI (空节点)
    ├── TimeLabel (Label)
    ├── GoldLabel (Label)
    └── StageLabel (Label)
```

---

## 📋 详细配置步骤

### 1. 创建GameCore节点

1. 在Canvas下创建空节点，命名为 `GameCore`
2. 位置：(0, 0, 0)
3. 添加组件：`GameCore`

---

### 2. 创建GridSystem节点

1. 在GameCore下创建空节点，命名为 `GridSystem`
2. 位置：(0, 0, 0)
3. 添加组件：`GridSystem`
4. 配置属性：
   - **Block Prefab**: 拖拽 `Block.prefab` 到这里
   - **Grid Size**: 8
   - **Block Size**: 60（会自动计算）
   - **Spacing**: 8（会自动计算）
   - **Max Grid Width**: 600
   - **Max Grid Height**: 600

---

### 3. 创建EnemySystem节点

1. 在GameCore下创建空节点，命名为 `EnemySystem`
2. 位置：(0, 300, 0)（在网格上方）
3. 添加组件：`EnemySystem`
4. 配置属性：
   - **Hp Bar**: 创建血条UI并拖拽到这里（稍后配置）

---

### 4. 创建DamageSystem节点

1. 在GameCore下创建空节点，命名为 `DamageSystem`
2. 位置：(0, 0, 0)
3. 添加组件：`DamageSystem`

---

### 5. 创建ModifierSystem节点

1. 在GameCore下创建空节点，命名为 `ModifierSystem`
2. 位置：(0, 0, 0)
3. 添加组件：`ModifierSystem`

---

### 6. 创建ProgressionManager节点

1. 在GameCore下创建空节点，命名为 `ProgressionManager`
2. 位置：(0, 0, 0)
3. 添加组件：`ProgressionManager`

---

### 7. 创建UI节点

1. 在Canvas下创建空节点，命名为 `UI`
2. 位置：(0, 0, 0)

#### 7.1 TimeLabel
1. 在UI下创建Label节点，命名为 `TimeLabel`
2. 位置：(-300, 400, 0)（左上角）
3. Label组件配置：
   - **String**: "Time: 60s"
   - **Font Size**: 32
   - **Color**: 白色

#### 7.2 GoldLabel
1. 在UI下创建Label节点，命名为 `GoldLabel`
2. 位置：(0, 400, 0)（中上）
3. Label组件配置：
   - **String**: "Gold: 0"
   - **Font Size**: 32
   - **Color**: 金色 (255, 215, 0)

#### 7.3 StageLabel
1. 在UI下创建Label节点，命名为 `StageLabel`
2. 位置：(300, 400, 0)（右上角）
3. Label组件配置：
   - **String**: "Stage: 1"
   - **Font Size**: 32
   - **Color**: 白色

---

### 8. 连接GameCore引用

选中 `GameCore` 节点，在属性检查器中：

1. **Grid System**: 拖拽 `GridSystem` 节点到这里
2. **Enemy System**: 拖拽 `EnemySystem` 节点到这里
3. **Damage System**: 拖拽 `DamageSystem` 节点到这里
4. **Modifier System**: 拖拽 `ModifierSystem` 节点到这里
5. **Progression Manager**: 拖拽 `ProgressionManager` 节点到这里
6. **Time Label**: 拖拽 `UI/TimeLabel` 节点到这里
7. **Gold Label**: 拖拽 `UI/GoldLabel` 节点到这里
8. **Stage Label**: 拖拽 `UI/StageLabel` 节点到这里
9. **Time Limit**: 60

---

## 🎨 创建Block预制体

### 1. 创建Block节点

1. 在层级管理器空白处右键 → 创建 → 2D对象 → Sprite
2. 命名为 `Block`
3. 配置Sprite组件：
   - **Type**: SIMPLE
   - **Size Mode**: CUSTOM
   - **Custom Size**: (60, 60)
   - **Color**: 白色（会被脚本覆盖）

### 2. 添加Block组件

1. 选中Block节点
2. 添加组件 → 自定义脚本 → `Block`
3. 配置属性：
   - **Sprite**: 拖拽自己的Sprite组件到这里

### 3. 保存为预制体

1. 在资源管理器中，在 `assets/prefabs` 文件夹下（没有就创建）
2. 将Block节点从层级管理器拖拽到prefabs文件夹
3. 保存为 `Block.prefab`
4. 删除场景中的Block节点（预制体已保存）

---

## 🔧 快速配置脚本（可选）

如果你想用脚本快速创建场景结构，可以在Cocos Creator的开发者工具中运行：

```javascript
// 获取Canvas
const canvas = cc.find('Canvas');

// 创建GameCore
const gameCore = new cc.Node('GameCore');
gameCore.parent = canvas;
gameCore.addComponent('GameCore');

// 创建子系统
const systems = ['GridSystem', 'EnemySystem', 'DamageSystem', 'ModifierSystem', 'ProgressionManager'];
systems.forEach(name => {
    const node = new cc.Node(name);
    node.parent = gameCore;
    node.addComponent(name);
});

// 创建UI
const ui = new cc.Node('UI');
ui.parent = canvas;

const labels = [
    { name: 'TimeLabel', pos: cc.v3(-300, 400, 0), text: 'Time: 60s' },
    { name: 'GoldLabel', pos: cc.v3(0, 400, 0), text: 'Gold: 0' },
    { name: 'StageLabel', pos: cc.v3(300, 400, 0), text: 'Stage: 1' }
];

labels.forEach(config => {
    const label = new cc.Node(config.name);
    label.parent = ui;
    label.setPosition(config.pos);
    const labelComp = label.addComponent(cc.Label);
    labelComp.string = config.text;
    labelComp.fontSize = 32;
});

console.log('Scene structure created!');
```

---

## ✅ 配置检查清单

完成配置后，请检查：

- [ ] GameCore节点存在，且有GameCore组件
- [ ] GridSystem节点存在，且有GridSystem组件
- [ ] GridSystem的Block Prefab已配置
- [ ] EnemySystem节点存在，且有EnemySystem组件
- [ ] DamageSystem节点存在，且有DamageSystem组件
- [ ] ModifierSystem节点存在，且有ModifierSystem组件
- [ ] ProgressionManager节点存在，且有ProgressionManager组件
- [ ] UI节点存在，包含3个Label子节点
- [ ] GameCore的所有引用都已连接
- [ ] Block.prefab已创建并保存

---

## 🎮 测试步骤

配置完成后：

1. **保存场景** (Ctrl+S)
2. **清理缓存**：删除 `temp`, `library`, `local` 文件夹
3. **重启Cocos Creator**
4. **运行游戏** (Ctrl+R)

**预期结果：**
- 看到8×8网格
- 方块颜色随机（红、黄、蓝）
- 方块间隔合适，不重叠
- 右上角显示时间、金币、关卡
- 控制台输出：`[GameCore] Starting game...`

---

## 🐛 常见问题

### 问题1：方块没有显示
**原因：** Block Prefab未配置
**解决：** 检查GridSystem的Block Prefab属性

### 问题2：方块重叠
**原因：** 自适应大小未生效
**解决：** 检查GridSystem的Max Grid Width/Height

### 问题3：控制台报错
**原因：** 引用未连接
**解决：** 检查GameCore的所有引用是否都已拖拽

### 问题4：点击方块无反应
**原因：** Block组件的Sprite未配置
**解决：** 检查Block预制体的Sprite属性

---

## 📸 参考截图位置

配置完成后的场景应该是这样的：

```
层级管理器：
Canvas
├── Camera
├── GameCore ← 有GameCore组件
│   ├── GridSystem ← 有GridSystem组件
│   ├── EnemySystem ← 有EnemySystem组件
│   ├── DamageSystem ← 有DamageSystem组件
│   ├── ModifierSystem ← 有ModifierSystem组件
│   └── ProgressionManager ← 有ProgressionManager组件
└── UI
    ├── TimeLabel ← Label组件
    ├── GoldLabel ← Label组件
    └── StageLabel ← Label组件

资源管理器：
assets
└── prefabs
    └── Block.prefab ← 方块预制体
```

---

*配置完成后告诉我结果！*
