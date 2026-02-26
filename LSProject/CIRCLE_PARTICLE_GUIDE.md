# CircleParticle 预制体创建指南

## 📦 创建步骤

### 第一步：创建节点
1. 在场景层级面板中，右键点击空白处
2. 选择 **创建 → 创建空节点**
3. 命名为 `CircleParticle`

### 第二步：添加Sprite组件
1. 选中CircleParticle节点
2. 在属性检查器中点击 **添加组件**
3. 搜索并添加 **Sprite** 组件
4. 暂时不设置SpriteFrame（运行时会动态设置）

### 第三步：添加Particle脚本
1. 继续在属性检查器中点击 **添加组件**
2. 搜索 **Particle**
3. 选择添加Particle脚本组件

### 第四步：配置Particle组件属性

在Particle组件中设置以下参数：

| 属性名 | 值 | 说明 |
|--------|-----|------|
| **Lifetime** | 1.0 | 粒子生命周期1秒 |
| **Velocity X** | 0 | 初始水平速度为0 |
| **Velocity Y** | 150 | 初始向上速度150 |
| **Gravity** | -50 | 较小的重力（向下） |
| **Enable Rotation** | false | 不旋转 |
| **Rotation Speed** | 0 | 旋转速度（不用设置，因为不旋转） |

### 第五步：保存为预制体
1. 在资源管理器中找到 `assets/prefabs/` 文件夹
2. 将场景中的CircleParticle节点拖入prefabs文件夹
3. 会自动创建 `CircleParticle.prefab`
4. 删除场景中的CircleParticle节点（预制体已保存）

---

## 📋 完整配置清单

### CircleParticle 预制体结构：
```
CircleParticle (Node)
├── Sprite (Component)
│   └── SpriteFrame: (空，运行时设置)
└── Particle (Component)
    ├── Lifetime: 1.0
    ├── Velocity X: 0
    ├── Velocity Y: 150
    ├── Gravity: -50
    ├── Enable Rotation: false
    └── Rotation Speed: 0
```

---

## 🎯 与StarParticle的区别

| 属性 | StarParticle | CircleParticle |
|------|--------------|----------------|
| Velocity Y | 100 | 150（更快向上） |
| Gravity | -200 | -50（更轻柔） |
| Enable Rotation | true | false（不旋转） |
| 用途 | 消除爆炸效果 | 连击飘散效果 |

---

## ✅ 验证配置

创建完成后，检查：
- [ ] CircleParticle.prefab 存在于 `assets/prefabs/` 目录
- [ ] 预制体包含Sprite组件
- [ ] 预制体包含Particle组件
- [ ] Particle组件的参数已正确设置
- [ ] Enable Rotation 设置为 false

---

## 🔗 配置到ParticleManager

创建完预制体后：
1. 选中ParticleManager节点
2. 找到 **Circle Particle Prefab** 属性
3. 将 `CircleParticle.prefab` 拖入该属性
4. 配置 **Circle Particle Frames**（3个PNG文件）

---

## 💡 提示

如果你只想要消除粒子效果，可以暂时不创建CircleParticle预制体。CircleParticle主要用于连击特效，是可选的。

StarParticle是必需的，用于方块消除时的爆炸效果。
