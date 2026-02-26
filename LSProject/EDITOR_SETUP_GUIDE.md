# 《炼色》新功能集成 - 编辑器配置指南

## ✅ 代码已完成

我已经创建了以下脚本文件：
- ✅ `Particle.ts` - 粒子组件
- ✅ `ParticleManager.ts` - 粒子管理器
- ✅ `ComboManager.ts` - 连击管理器
- ✅ `ResultPanel.ts` - 结算面板
- ✅ 修改了 `Block.ts` - 添加消除动画和特殊方块支持

---

## 📋 你需要在Cocos Creator中做的事情

### 第一步：刷新资源（必须）
1. 打开Cocos Creator
2. 按 **F5** 刷新资源管理器
3. 确认 `assets/scripts/` 下出现新脚本

---

### 第二步：配置Block预制体（5分钟）

**打开：** `assets/prefabs/Block.prefab`

#### 2.1 替换方块图片
在Block脚本组件中，找到这些属性并拖入对应图片：

| 属性名 | 拖入文件 |
|--------|---------|
| Red Sprite | `textures/blocks_prototype/block_red.png` |
| Blue Sprite | `textures/blocks_prototype/block_blue.png` |
| Yellow Sprite | `textures/blocks_prototype/block_yellow.png` |
| Purple Sprite | `textures/blocks_prototype/block_purple.png` |
| Orange Sprite | `textures/blocks_prototype/block_orange.png` |
| Green Sprite | `textures/blocks_prototype/block_green.png` |

#### 2.2 配置特殊方块图片
| 属性名 | 拖入文件 |
|--------|---------|
| Bomb Sprite | `textures/special_blocks/bomb_block.png` |
| Rainbow Block Sprite | `textures/special_blocks/rainbow_block.png` |

#### 2.3 配置消除动画帧
1. 找到 **Eliminate Frames** 属性
2. 设置 **Size = 8**
3. 依次拖入8个动画帧：
   - Element 0 → `textures/animations/eliminate_frame_1.png`
   - Element 1 → `textures/animations/eliminate_frame_2.png`
   - Element 2 → `textures/animations/eliminate_frame_3.png`
   - Element 3 → `textures/animations/eliminate_frame_4.png`
   - Element 4 → `textures/animations/eliminate_frame_5.png`
   - Element 5 → `textures/animations/eliminate_frame_6.png`
   - Element 6 → `textures/animations/eliminate_frame_7.png`
   - Element 7 → `textures/animations/eliminate_frame_8.png`

**保存预制体** → 完成！

---

### 第三步：创建粒子预制体（3分钟）

#### 3.1 创建StarParticle预制体
1. 在场景中创建新节点，命名为 `StarParticle`
2. 添加 **Sprite** 组件
3. 添加 **Particle** 脚本组件
4. 配置Particle组件：
   - Lifetime: 1.0
   - Velocity X: 0
   - Velocity Y: 100
   - Gravity: -200
   - Enable Rotation: true
   - Rotation Speed: 360
5. 保存为预制体：`assets/prefabs/StarParticle.prefab`

#### 3.2 创建CircleParticle预制体（可选）
1. 创建新节点，命名为 `CircleParticle`
2. 添加 **Sprite** 组件
3. 添加 **Particle** 脚本组件
4. 配置Particle组件：
   - Lifetime: 1.0
   - Velocity X: 0
   - Velocity Y: 150
   - Gravity: -50
   - Enable Rotation: false
5. 保存为预制体：`assets/prefabs/CircleParticle.prefab`

---

### 第四步：在Game场景中添加管理器（5分钟）

**打开：** `assets/scenes/Game.fire`

#### 4.1 添加ParticleManager
1. 在Canvas下创建空节点，命名为 `ParticleManager`
2. 添加 **ParticleManager** 脚本组件
3. 配置属性：
   - **Star Particle Prefab** → 拖入 `StarParticle.prefab`
   - **Star Particle Frames** → Size设为5，拖入：
     - `textures/effects/star_particle_1.png`
     - `textures/effects/star_particle_2.png`
     - `textures/effects/star_particle_3.png`
     - `textures/effects/star_particle_4.png`
     - `textures/effects/star_particle_5.png`
   - **Circle Particle Prefab** → 拖入 `CircleParticle.prefab`（可选）
   - **Circle Particle Frames** → Size设为3，拖入：
     - `textures/effects/circle_particle_1.png`
     - `textures/effects/circle_particle_2.png`
     - `textures/effects/circle_particle_3.png`

#### 4.2 添加ComboManager
1. 在Canvas下创建空节点，命名为 `ComboManager`
2. 添加 **ComboManager** 脚本组件
3. 创建连击UI：
   - 在Canvas下创建节点 `ComboPanel`
   - 添加Sprite组件，设置SpriteFrame为 `textures/ui_extended/combo_panel.png`
   - 在ComboPanel下创建Label节点，命名为 `ComboLabel`
   - 设置Label字体大小为48，颜色为白色
4. 配置ComboManager属性：
   - **Combo Panel** → 拖入 `ComboPanel` 节点
   - **Combo Label** → 拖入 `ComboLabel` 节点
   - **Combo Timeout** → 2.0
   - **Combo Multiplier** → 0.5
5. 设置ComboPanel初始状态：
   - Active: false（初始隐藏）
   - Position: 屏幕上方合适位置

---

### 第五步：创建结算面板预制体（5分钟）

#### 5.1 创建ResultPanel预制体
1. 在场景中创建节点，命名为 `ResultPanel`
2. 设置大小：600x400
3. 添加 **Sprite** 组件（背景）
4. 添加 **ResultPanel** 脚本组件

#### 5.2 添加子节点
在ResultPanel下创建以下子节点：

**Title（标题）：**
- 类型：Label
- 文本："VICTORY!"
- 字体大小：72
- 颜色：白色
- 位置：(0, 100)

**ScoreLabel（分数）：**
- 类型：Label
- 文本："Score: 0"
- 字体大小：48
- 颜色：白色
- 位置：(0, 20)

**HighScoreLabel（最高分）：**
- 类型：Label
- 文本："Best: 0"
- 字体大小：36
- 颜色：黄色
- 位置：(0, -30)

**RestartButton（重新开始按钮）：**
- 类型：Button
- 大小：200x80
- 位置：(-120, -120)
- 添加Label子节点，文本："Restart"

**MenuButton（返回菜单按钮）：**
- 类型：Button
- 大小：200x80
- 位置：(120, -120)
- 添加Label子节点，文本："Menu"

#### 5.3 配置ResultPanel脚本
- **Background** → 拖入ResultPanel的Sprite组件
- **Victory Sprite** → `textures/ui_extended/victory_panel.png`
- **Defeat Sprite** → `textures/ui_extended/defeat_panel.png`
- **Title Label** → 拖入Title节点
- **Score Label** → 拖入ScoreLabel节点
- **High Score Label** → 拖入HighScoreLabel节点
- **Restart Button** → 拖入RestartButton节点
- **Menu Button** → 拖入MenuButton节点

#### 5.4 保存为预制体
保存为：`assets/prefabs/ResultPanel.prefab`

---

### 第六步：在Game场景中实例化ResultPanel

1. 在Canvas下实例化 `ResultPanel.prefab`
2. 设置：
   - Active: false（初始隐藏）
   - Position: (0, 0)
   - zIndex: 999（确保在最上层）

---

## 🎮 如何使用这些功能

### 在你的游戏逻辑中调用

#### 1. 方块消除时播放动画和粒子
在你的消除逻辑中（GridSystem或GameCore），替换原来的 `block.node.destroy()` 为：

```typescript
// 原来：
// block.node.destroy();

// 改为：
block.triggerEliminate();
```

#### 2. 增加连击
在消除逻辑中：

```typescript
import { ComboManager } from './ComboManager';

// 每次消除时
const comboManager = ComboManager.getInstance();
if (comboManager) {
    comboManager.addCombo();
    
    // 获取连击倍率计算分数
    const multiplier = comboManager.getScoreMultiplier();
    const score = blocksCount * 10 * multiplier;
    this.addScore(score);
}
```

#### 3. 显示结算面板
在游戏胜利/失败时：

```typescript
import { ResultPanel, ResultType } from './ResultPanel';

// 游戏胜利
const resultPanel = ResultPanel.getInstance();
if (resultPanel) {
    resultPanel.show(ResultType.VICTORY, this.currentScore, this.highScore);
}

// 游戏失败
if (resultPanel) {
    resultPanel.show(ResultType.DEFEAT, this.currentScore, this.highScore);
}
```

#### 4. 生成特殊方块
在你的方块生成逻辑中：

```typescript
// 5%概率生成炸弹
if (Math.random() < 0.05) {
    block.setAsBomb();
}

// 2%概率生成彩虹方块
if (Math.random() < 0.02) {
    block.setAsRainbowBlock();
}
```

---

## ✅ 完成检查清单

- [ ] 刷新Cocos Creator资源（F5）
- [ ] 配置Block预制体（方块图片+动画帧）
- [ ] 创建StarParticle预制体
- [ ] 创建CircleParticle预制体（可选）
- [ ] 在Game场景添加ParticleManager
- [ ] 在Game场景添加ComboManager
- [ ] 创建ResultPanel预制体
- [ ] 在Game场景实例化ResultPanel
- [ ] 在游戏逻辑中调用新功能

---

## 🐛 如果遇到问题

### 粒子不显示
- 检查ParticleManager的zIndex是否足够高
- 检查粒子预制体是否正确配置
- 检查是否调用了 `triggerEliminate()`

### 连击不显示
- 检查ComboPanel是否正确配置
- 检查ComboManager是否添加到场景
- 检查是否调用了 `addCombo()`

### 结算面板不显示
- 检查ResultPanel的zIndex是否为999
- 检查是否调用了 `show()` 方法
- 检查面板是否在Canvas下

---

**所有代码都已经写好，你只需要在编辑器中配置即可！**
