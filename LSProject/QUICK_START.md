# 《炼色》资源集成 - 快速开始

## 🎯 最简单的开始方式

如果你只想快速看到效果，按这个顺序做：

---

## ⚡ 5分钟快速集成（纯视觉，不改代码）

### 1. 替换方块图片（2分钟）

**打开：** `assets/prefabs/Block.prefab`

**找到Block脚本组件，替换这6个属性：**

| 属性名 | 拖入的文件 |
|--------|-----------|
| redSprite | `textures/blocks_prototype/block_red.png` |
| blueSprite | `textures/blocks_prototype/block_blue.png` |
| yellowSprite | `textures/blocks_prototype/block_yellow.png` |
| purpleSprite | `textures/blocks_prototype/block_purple.png` |
| orangeSprite | `textures/blocks_prototype/block_orange.png` |
| greenSprite | `textures/blocks_prototype/block_green.png` |

**保存预制体** → 完成！

---

### 2. 替换UI背景（2分钟）

**打开：** `assets/scenes/Game.fire`

**找到这些节点，替换Sprite组件的SpriteFrame：**

| 节点名（可能的名字） | 替换为 |
|---------------------|--------|
| Background / bg | `textures/ui/background.png` |
| Board / BoardBg | `textures/ui/board_bg.png` |
| EnemyArea | `textures/ui/enemy_area_bg.png` |
| GravityPanel | `textures/ui/gravity_panel_bg.png` |

**保存场景** → 完成！

---

### 3. 替换按钮（1分钟）

**在Game场景中，找到4个重力方向按钮：**

1. 选中按钮节点
2. 找到Button组件
3. 设置Transition为SPRITE
4. 配置：
   - Normal Sprite → `textures/buttons/gravity_btn.png`
   - Pressed Sprite → `textures/buttons/gravity_btn_active.png`

**对4个按钮都做一遍** → 完成！

---

## ✅ 测试

点击运行，你应该能看到：
- ✅ 新的宝石方块样式
- ✅ 新的背景和UI
- ✅ 新的按钮样式

**如果看到了，恭喜！第一阶段完成！**

---

## 🎬 下一步：添加动画效果（可选）

如果你想要消除动画和粒子特效，继续看 `INTEGRATION_GUIDE.md` 的第二阶段。

---

## 📋 文件位置参考

```
assets/
├── prefabs/
│   └── Block.prefab          ← 第1步：替换方块图片
├── scenes/
│   └── Game.fire             ← 第2步：替换UI背景
│                             ← 第3步：替换按钮
└── textures/
    ├── blocks_prototype/     ← 新方块图片在这里
    ├── ui/                   ← UI背景在这里
    └── buttons/              ← 按钮图片在这里
```

---

## 🆘 遇到问题？

### 找不到节点？
在场景层级面板中搜索节点名（Ctrl+F）

### 找不到属性？
确保选中了正确的组件（Block脚本、Sprite组件、Button组件）

### 图片拖不进去？
确保拖的是SpriteFrame（图片文件），不是文件夹

---

**完整的功能集成指南请看：`INTEGRATION_GUIDE.md`**
