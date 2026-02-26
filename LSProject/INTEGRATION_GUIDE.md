# 《炼色》新资源集成指南

## 📋 概述

本指南提供所有新资源的详细使用方法，包括代码示例和配置步骤。

---

## 🎯 集成优先级

### 第一阶段：基础视觉替换（不改逻辑）
1. 替换方块图片
2. 替换UI背景
3. 替换按钮

### 第二阶段：添加动画效果
1. 方块消除动画
2. 粒子特效

### 第三阶段：新功能
1. 特殊方块（炸弹、彩虹）
2. 连击系统
3. 结算面板

---

## 📦 第一阶段：基础视觉替换

### 1. 替换方块图片

**位置：** `assets/prefabs/Block.prefab`

**操作步骤：**
1. 在Cocos Creator中打开Block预制体
2. 找到Block脚本组件
3. 将以下Sprite Frame拖入对应属性：

```
redSprite → textures/blocks_prototype/block_red.png
blueSprite → textures/blocks_prototype/block_blue.png
yellowSprite → textures/blocks_prototype/block_yellow.png
purpleSprite → textures/blocks_prototype/block_purple.png
orangeSprite → textures/blocks_prototype/block_orange.png
greenSprite → textures/blocks_prototype/block_green.png
```

**不需要修改代码**，只需要在编辑器中替换Sprite Frame引用。

---

### 2. 替换UI背景

**位置：** `assets/scenes/Game.fire`

**操作步骤：**

#### 2.1 游戏背景
1. 在场景中找到背景节点（通常叫Background或bg）
2. 选中节点，在属性检查器中找到Sprite组件
3. 将 `textures/ui/background.png` 拖入SpriteFrame属性

#### 2.2 棋盘背景
1. 找到棋盘背景节点（Board或BoardBg）
2. 替换SpriteFrame为 `textures/ui/board_bg.png`

#### 2.3 敌人区域背景
1. 找到敌人区域节点（EnemyArea）
2. 替换SpriteFrame为 `textures/ui/enemy_area_bg.png`

#### 2.4 重力面板背景
1. 找到重力控制面板节点（GravityPanel）
2. 替换SpriteFrame为 `textures/ui/gravity_panel_bg.png`

**不需要修改代码**，纯视觉替换。

---

### 3. 替换按钮

**位置：** `assets/scenes/Game.fire`

**操作步骤：**

#### 3.1 重力方向按钮（4个）
1. 找到4个重力方向按钮节点
2. 选中按钮，找到Button组件
3. 设置Transition为SPRITE
4. 配置：
   - Normal Sprite → `textures/buttons/gravity_btn.png`
   - Pressed Sprite → `textures/buttons/gravity_btn_active.png`
   - Hover Sprite → `textures/buttons/gravity_btn_active.png`

#### 3.2 时间显示
1. 找到时间显示节点
2. 替换背景Sprite为 `textures/buttons/time_display.png`

#### 3.3 金币显示
1. 找到金币显示节点
2. 替换背景Sprite为 `textures/buttons/coin_display.png`

**不需要修改代码**，纯视觉替换。

---

### 4. 替换敌人血条

**位置：** 敌人预制体或场景中的敌人节点

**操作步骤：**
1. 找到血条背景节点（HPBarBg）
2. 替换Sprite为 `textures/ui/hp_bar_bg.png`
3. 找到血条填充节点（HPBarFill）
4. 替换Sprite为 `textures/ui/hp_bar_fill.png`
5. 确保HPBarFill的Sprite组件设置为：
   - Type: FILLED
   - Fill Type: HORIZONTAL
   - Fill Range: 0-1（通过代码控制）

**不需要修改代码**，血条逻辑应该已经存在。

---

## 🎬 第二阶段：添加动画效果

### 1. 方块消除动画

**需要修改的文件：** `assets/scripts/Block.ts`（或Block.js）

**步骤1：在Block脚本中添加动画帧属性**

```typescript
// 在Block类的属性声明区域添加
@property([cc.SpriteFrame])
eliminateFrames: cc.SpriteFrame[] = [];
```

**步骤2：在编辑器中配置**
1. 打开Block预制体
2. 找到Block脚本组件
3. 展开eliminateFrames数组，设置Size为8
4. 依次拖入8个动画帧：
   - Element 0 → `textures/animations/eliminate_frame_1.png`
   - Element 1 → `textures/animations/eliminate_frame_2.png`
   - ...
   - Element 7 → `textures/animations/eliminate_frame_8.png`

**步骤3：修改消除方法**

找到Block类中的消除方法（可能叫`eliminate()`、`destroy()`或`onMatched()`），修改为：

```typescript
// 原来的代码可能是：
// this.node.destroy();

// 改为：
playEliminateAnimation() {
    // 如果没有动画帧，直接销毁
    if (this.eliminateFrames.length === 0) {
        this.node.destroy();
        return;
    }
    
    // 创建动画
    let animation = this.node.getComponent(cc.Animation);
    if (!animation) {
        animation = this.node.addComponent(cc.Animation);
    }
    
    // 创建动画剪辑
    let clip = cc.AnimationClip.createWithSpriteFrames(this.eliminateFrames, 10); // 10帧/秒
    clip.name = 'eliminate';
    clip.wrapMode = cc.WrapMode.Normal;
    
    animation.addClip(clip);
    animation.play('eliminate');
    
    // 动画结束后销毁节点
    animation.on('finished', () => {
        this.node.destroy();
    }, this);
}

// 在你的消除逻辑中调用
onEliminate() {
    // 你原有的消除逻辑...
    
    // 播放动画
    this.playEliminateAnimation();
}
```

---

### 2. 粒子特效系统

**步骤1：创建粒子预制体**

1. 在Cocos Creator中创建新节点，命名为`StarParticle`
2. 添加Sprite组件
3. 添加以下脚本（新建文件 `assets/scripts/Particle.ts`）：

```typescript
const {ccclass, property} = cc._decorator;

@ccclass
export default class Particle extends cc.Component {
    
    @property(cc.Float)
    lifetime: number = 1.0; // 粒子生命周期（秒）
    
    @property(cc.Vec2)
    velocity: cc.Vec2 = cc.v2(0, 100); // 初始速度
    
    @property(cc.Float)
    gravity: number = -200; // 重力加速度
    
    private age: number = 0;
    
    onLoad() {
        this.age = 0;
    }
    
    update(dt: number) {
        this.age += dt;
        
        // 超过生命周期，销毁
        if (this.age >= this.lifetime) {
            this.node.destroy();
            return;
        }
        
        // 更新位置
        this.velocity.y += this.gravity * dt;
        this.node.x += this.velocity.x * dt;
        this.node.y += this.velocity.y * dt;
        
        // 淡出效果
        let alpha = 255 * (1 - this.age / this.lifetime);
        this.node.opacity = alpha;
        
        // 缩放效果
        let scale = 1 - 0.5 * (this.age / this.lifetime);
        this.node.scale = scale;
    }
}
```

4. 将脚本添加到StarParticle节点
5. 保存为预制体：`assets/prefabs/StarParticle.prefab`

**步骤2：创建粒子管理器**

新建文件 `assets/scripts/ParticleManager.ts`：

```typescript
const {ccclass, property} = cc._decorator;

@ccclass
export default class ParticleManager extends cc.Component {
    
    @property(cc.Prefab)
    starParticlePrefab: cc.Prefab = null;
    
    @property([cc.SpriteFrame])
    starParticleFrames: cc.SpriteFrame[] = []; // 5种颜色的星星
    
    /**
     * 在指定位置生成粒子爆炸效果
     * @param worldPos 世界坐标位置
     * @param count 粒子数量
     */
    spawnStarBurst(worldPos: cc.Vec2, count: number = 8) {
        if (!this.starParticlePrefab || this.starParticleFrames.length === 0) {
            return;
        }
        
        for (let i = 0; i < count; i++) {
            let particle = cc.instantiate(this.starParticlePrefab);
            particle.parent = this.node;
            particle.position = worldPos;
            
            // 随机选择颜色
            let frameIndex = Math.floor(Math.random() * this.starParticleFrames.length);
            let sprite = particle.getComponent(cc.Sprite);
            if (sprite) {
                sprite.spriteFrame = this.starParticleFrames[frameIndex];
            }
            
            // 随机速度方向
            let angle = Math.PI * 2 * i / count + Math.random() * 0.5;
            let speed = 100 + Math.random() * 100;
            let velocityX = Math.cos(angle) * speed;
            let velocityY = Math.sin(angle) * speed;
            
            let particleScript = particle.getComponent('Particle');
            if (particleScript) {
                particleScript.velocity = cc.v2(velocityX, velocityY);
                particleScript.lifetime = 0.8 + Math.random() * 0.4;
            }
        }
    }
}
```

**步骤3：在场景中配置**

1. 在Game场景中创建空节点，命名为`ParticleManager`
2. 添加ParticleManager脚本
3. 配置属性：
   - Star Particle Prefab → 拖入StarParticle预制体
   - Star Particle Frames → Size设为5，拖入5个星星图片：
     - `textures/effects/star_particle_1.png`
     - `textures/effects/star_particle_2.png`
     - `textures/effects/star_particle_3.png`
     - `textures/effects/star_particle_4.png`
     - `textures/effects/star_particle_5.png`

**步骤4：在Block消除时调用**

修改Block的消除方法：

```typescript
onEliminate() {
    // 获取粒子管理器
    let particleManager = cc.find('ParticleManager').getComponent('ParticleManager');
    if (particleManager) {
        // 生成粒子效果
        let worldPos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        particleManager.spawnStarBurst(worldPos, 8);
    }
    
    // 播放消除动画
    this.playEliminateAnimation();
}
```

---

## 🚀 第三阶段：新功能

### 1. 特殊方块 - 炸弹方块

**步骤1：在Block类中添加类型**

```typescript
// 在Block类顶部添加枚举
export enum BlockType {
    NORMAL = 0,
    BOMB = 1,
    RAINBOW = 2
}

// 在Block类中添加属性
@property(cc.SpriteFrame)
bombSprite: cc.SpriteFrame = null;

@property({type: cc.Enum(BlockType)})
blockType: BlockType = BlockType.NORMAL;
```

**步骤2：在编辑器中配置**
1. 打开Block预制体
2. 将 `textures/special_blocks/bomb_block.png` 拖入bombSprite属性

**步骤3：添加炸弹逻辑**

```typescript
// 在Block类中添加方法
eliminateBomb() {
    if (this.blockType !== BlockType.BOMB) {
        return;
    }
    
    // 获取棋盘管理器
    let board = cc.find('Board').getComponent('Board'); // 根据你的实际节点名修改
    
    // 获取当前方块的行列位置
    let row = this.row; // 假设你有这个属性
    let col = this.col;
    
    // 消除周围3x3区域
    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r >= 0 && r < board.rows && c >= 0 && c < board.cols) {
                let block = board.getBlock(r, c);
                if (block) {
                    block.onEliminate();
                }
            }
        }
    }
}

// 修改消除方法
onEliminate() {
    // 如果是炸弹，触发炸弹效果
    if (this.blockType === BlockType.BOMB) {
        this.eliminateBomb();
        return;
    }
    
    // 普通方块的消除逻辑...
    let particleManager = cc.find('ParticleManager').getComponent('ParticleManager');
    if (particleManager) {
        let worldPos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        particleManager.spawnStarBurst(worldPos, 8);
    }
    
    this.playEliminateAnimation();
}
```

**步骤4：生成炸弹方块**

在你的方块生成逻辑中（通常在Board或GameManager中）：

```typescript
createBlock(row: number, col: number): cc.Node {
    let block = cc.instantiate(this.blockPrefab);
    let blockScript = block.getComponent('Block');
    
    // 5%概率生成炸弹
    if (Math.random() < 0.05) {
        blockScript.blockType = BlockType.BOMB;
        let sprite = block.getComponent(cc.Sprite);
        sprite.spriteFrame = blockScript.bombSprite;
    } else {
        // 普通方块逻辑
        blockScript.blockType = BlockType.NORMAL;
        // 设置颜色...
    }
    
    return block;
}
```

---

### 2. 特殊方块 - 彩虹方块

**步骤1：在Block类中添加属性**

```typescript
@property(cc.SpriteFrame)
rainbowSprite: cc.SpriteFrame = null;
```

**步骤2：在编辑器中配置**
1. 打开Block预制体
2. 将 `textures/special_blocks/rainbow_block.png` 拖入rainbowSprite属性

**步骤3：添加彩虹方块逻辑**

```typescript
// 在Block类中添加方法
canMatchWith(otherBlock: Block): boolean {
    // 彩虹方块可以匹配任意颜色
    if (this.blockType === BlockType.RAINBOW || otherBlock.blockType === BlockType.RAINBOW) {
        return true;
    }
    
    // 普通方块只能匹配相同颜色
    return this.color === otherBlock.color;
}

// 修改你的匹配检测逻辑，使用canMatchWith方法
```

**步骤4：生成彩虹方块**

```typescript
createBlock(row: number, col: number): cc.Node {
    let block = cc.instantiate(this.blockPrefab);
    let blockScript = block.getComponent('Block');
    
    let rand = Math.random();
    
    if (rand < 0.02) { // 2%概率生成彩虹
        blockScript.blockType = BlockType.RAINBOW;
        let sprite = block.getComponent(cc.Sprite);
        sprite.spriteFrame = blockScript.rainbowSprite;
    } else if (rand < 0.07) { // 5%概率生成炸弹
        blockScript.blockType = BlockType.BOMB;
        let sprite = block.getComponent(cc.Sprite);
        sprite.spriteFrame = blockScript.bombSprite;
    } else {
        // 普通方块
        blockScript.blockType = BlockType.NORMAL;
        // 设置颜色...
    }
    
    return block;
}
```

---

### 3. 连击系统

**步骤1：创建连击UI**

1. 在Game场景中创建节点，命名为`ComboPanel`
2. 添加Sprite组件，设置SpriteFrame为 `textures/ui_extended/combo_panel.png`
3. 添加Label子节点，用于显示连击数
4. 初始时设置ComboPanel为不可见（opacity = 0）

**步骤2：创建连击管理器脚本**

新建文件 `assets/scripts/ComboManager.ts`：

```typescript
const {ccclass, property} = cc._decorator;

@ccclass
export default class ComboManager extends cc.Component {
    
    @property(cc.Node)
    comboPanel: cc.Node = null;
    
    @property(cc.Label)
    comboLabel: cc.Label = null;
    
    private comboCount: number = 0;
    private comboTimer: number = 0;
    private comboTimeout: number = 2.0; // 2秒内没有消除，连击重置
    
    onLoad() {
        this.resetCombo();
    }
    
    update(dt: number) {
        if (this.comboCount > 0) {
            this.comboTimer += dt;
            if (this.comboTimer >= this.comboTimeout) {
                this.resetCombo();
            }
        }
    }
    
    /**
     * 增加连击
     */
    addCombo() {
        this.comboCount++;
        this.comboTimer = 0;
        
        if (this.comboCount >= 2) {
            this.showCombo();
        }
    }
    
    /**
     * 显示连击UI
     */
    showCombo() {
        if (!this.comboPanel || !this.comboLabel) return;
        
        this.comboLabel.string = `COMBO x${this.comboCount}`;
        
        // 显示动画
        this.comboPanel.stopAllActions();
        this.comboPanel.opacity = 255;
        this.comboPanel.scale = 0.5;
        
        cc.tween(this.comboPanel)
            .to(0.2, { scale: 1.2 }, { easing: 'backOut' })
            .to(0.1, { scale: 1.0 })
            .start();
    }
    
    /**
     * 重置连击
     */
    resetCombo() {
        this.comboCount = 0;
        this.comboTimer = 0;
        
        if (this.comboPanel) {
            cc.tween(this.comboPanel)
                .to(0.3, { opacity: 0 })
                .start();
        }
    }
    
    /**
     * 获取当前连击数
     */
    getCombo(): number {
        return this.comboCount;
    }
}
```

**步骤3：在场景中配置**

1. 在Game场景中创建空节点，命名为`ComboManager`
2. 添加ComboManager脚本
3. 配置属性：
   - Combo Panel → 拖入ComboPanel节点
   - Combo Label → 拖入ComboPanel下的Label节点

**步骤4：在消除逻辑中调用**

```typescript
// 在你的消除逻辑中（通常在Board或GameManager中）
onBlocksEliminated(blocks: Block[]) {
    // 原有的消除逻辑...
    
    // 增加连击
    let comboManager = cc.find('ComboManager').getComponent('ComboManager');
    if (comboManager) {
        comboManager.addCombo();
        
        // 根据连击数增加分数倍率
        let comboMultiplier = 1 + (comboManager.getCombo() - 1) * 0.5;
        let score = blocks.length * 10 * comboMultiplier;
        this.addScore(score);
    }
}
```

---

### 4. 胜利/失败面板

**步骤1：创建结算面板预制体**

1. 创建新节点，命名为`ResultPanel`
2. 添加Sprite组件（先不设置图片）
3. 添加子节点：
   - Title（Label）：显示"Victory"或"Defeat"
   - Score（Label）：显示分数
   - RestartButton（Button）：重新开始按钮
   - MenuButton（Button）：返回菜单按钮
4. 保存为预制体：`assets/prefabs/ResultPanel.prefab`

**步骤2：创建结算面板脚本**

新建文件 `assets/scripts/ResultPanel.ts`：

```typescript
const {ccclass, property} = cc._decorator;

export enum ResultType {
    VICTORY,
    DEFEAT
}

@ccclass
export default class ResultPanel extends cc.Component {
    
    @property(cc.Sprite)
    background: cc.Sprite = null;
    
    @property(cc.SpriteFrame)
    victorySprite: cc.SpriteFrame = null;
    
    @property(cc.SpriteFrame)
    defeatSprite: cc.SpriteFrame = null;
    
    @property(cc.Label)
    titleLabel: cc.Label = null;
    
    @property(cc.Label)
    scoreLabel: cc.Label = null;
    
    @property(cc.Button)
    restartButton: cc.Button = null;
    
    @property(cc.Button)
    menuButton: cc.Button = null;
    
    onLoad() {
        // 绑定按钮事件
        if (this.restartButton) {
            this.restartButton.node.on('click', this.onRestartClicked, this);
        }
        if (this.menuButton) {
            this.menuButton.node.on('click', this.onMenuClicked, this);
        }
        
        // 初始隐藏
        this.node.active = false;
    }
    
    /**
     * 显示结算面板
     * @param type 结算类型（胜利/失败）
     * @param score 分数
     */
    show(type: ResultType, score: number) {
        this.node.active = true;
        
        // 设置背景
        if (type === ResultType.VICTORY) {
            this.background.spriteFrame = this.victorySprite;
            this.titleLabel.string = 'VICTORY!';
        } else {
            this.background.spriteFrame = this.defeatSprite;
            this.titleLabel.string = 'DEFEAT';
        }
        
        // 设置分数
        this.scoreLabel.string = `Score: ${score}`;
        
        // 播放弹出动画
        this.node.scale = 0;
        this.node.opacity = 0;
        
        cc.tween(this.node)
            .to(0.3, { scale: 1, opacity: 255 }, { easing: 'backOut' })
            .start();
    }
    
    /**
     * 隐藏面板
     */
    hide() {
        cc.tween(this.node)
            .to(0.2, { scale: 0, opacity: 0 })
            .call(() => {
                this.node.active = false;
            })
            .start();
    }
    
    /**
     * 重新开始按钮点击
     */
    onRestartClicked() {
        // 重新加载当前场景
        cc.director.loadScene(cc.director.getScene().name);
    }
    
    /**
     * 返回菜单按钮点击
     */
    onMenuClicked() {
        // 加载菜单场景
        cc.director.loadScene('Menu'); // 根据你的菜单场景名修改
    }
}
```

**步骤3：在编辑器中配置**

1. 打开ResultPanel预制体
2. 添加ResultPanel脚本
3. 配置属性：
   - Background → 拖入背景Sprite组件
   - Victory Sprite → `textures/ui_extended/victory_panel.png`
   - Defeat Sprite → `textures/ui_extended/defeat_panel.png`
   - Title Label → 拖入Title节点
   - Score Label → 拖入Score节点
   - Restart Button → 拖入RestartButton节点
   - Menu Button → 拖入MenuButton节点

**步骤4：在游戏逻辑中调用**

```typescript
// 在GameManager或类似的游戏控制脚本中

@property(cc.Prefab)
resultPanelPrefab: cc.Prefab = null;

private resultPanel: cc.Node = null;

onLoad() {
    // 实例化结算面板
    this.resultPanel = cc.instantiate(this.resultPanelPrefab);
    this.resultPanel.parent = cc.find('Canvas');
    this.resultPanel.zIndex = 999; // 确保在最上层
}

// 游戏胜利时调用
onGameVictory() {
    let panel = this.resultPanel.getComponent('ResultPanel');
    if (panel) {
        panel.show(ResultType.VICTORY, this.currentScore);
    }
}

// 游戏失败时调用
onGameDefeat() {
    let panel = this.resultPanel.getComponent('ResultPanel');
    if (panel) {
        panel.show(ResultType.DEFEAT, this.currentScore);
    }
}
```

---

## 📋 完整集成检查清单

### 第一阶段：基础视觉（不改代码）
- [ ] 替换6个方块图片（blocks_prototype）
- [ ] 替换游戏背景（ui/background.png）
- [ ] 替换棋盘背景（ui/board_bg.png）
- [ ] 替换敌人区域背景（ui/enemy_area_bg.png）
- [ ] 替换重力面板背景（ui/gravity_panel_bg.png）
- [ ] 替换4个重力按钮（buttons/gravity_btn）
- [ ] 替换时间显示（buttons/time_display.png）
- [ ] 替换金币显示（buttons/coin_display.png）
- [ ] 替换血条（ui/hp_bar_bg + hp_bar_fill）

### 第二阶段：动画效果
- [ ] 添加消除动画（8帧序列）
- [ ] 创建粒子预制体（StarParticle）
- [ ] 创建粒子管理器（ParticleManager）
- [ ] 在Block消除时调用粒子效果

### 第三阶段：新功能
- [ ] 添加炸弹方块类型和逻辑
- [ ] 添加彩虹方块类型和逻辑
- [ ] 创建连击系统（ComboManager）
- [ ] 创建结算面板（ResultPanel）
- [ ] 在游戏胜利/失败时显示结算面板

---

## 🐛 常见问题

### Q1: 动画播放不流畅
A: 调整动画帧率，在`createWithSpriteFrames`的第二个参数中修改（建议8-12）

### Q2: 粒子效果看不见
A: 检查ParticleManager节点的zIndex，确保在方块层之上

### Q3: 特殊方块不生成
A: 检查概率设置，可以临时提高概率测试（如0.5 = 50%）

### Q4: 结算面板显示不正确
A: 确保ResultPanel的zIndex足够高（999），且parent是Canvas

---

## 📞 需要帮助？

如果遇到问题，提供以下信息：
1. 具体的错误信息（控制台输出）
2. 你修改的代码片段
3. 在哪个步骤遇到问题

我会帮你解决！
