# 障碍方块实现方案

## 🎯 技术实现

### 方案1：扩展Block类（推荐）⭐

```typescript
// Block.ts
export enum BlockType {
    NORMAL = 0,      // 普通方块
    FROZEN = 1,      // 冰冻方块
    STONE = 2,       // 石头方块
    CHAINED = 3,     // 锁链方块
    POISON = 4,      // 毒雾方块
    TIME_BOMB = 5,   // 时间炸弹
    RAINBOW = 6      // 彩虹方块
}

export class Block extends Component {
    // 现有属性
    colorType: ColorType = ColorType.RED;
    
    // 新增属性
    blockType: BlockType = BlockType.NORMAL;
    frozenLevel: number = 0;      // 冰冻层数
    isChained: boolean = false;   // 是否被锁链
    poisonLevel: number = 0;      // 毒雾等级
    bombCountdown: number = 0;    // 炸弹倒计时
    
    // 判断是否可以移动
    canMove(): boolean {
        if (this.blockType === BlockType.FROZEN && this.frozenLevel > 0) {
            return false;
        }
        if (this.blockType === BlockType.STONE) {
            return false;
        }
        return true;
    }
    
    // 判断是否可以匹配
    canMatch(): boolean {
        if (this.blockType === BlockType.STONE) {
            return false;
        }
        if (this.poisonLevel > 0) {
            return false;
        }
        return true;
    }
    
    // 消除时的处理
    onMatch(): boolean {
        // 冰冻方块：减少冰冻层数
        if (this.blockType === BlockType.FROZEN && this.frozenLevel > 0) {
            this.frozenLevel--;
            if (this.frozenLevel === 0) {
                this.blockType = BlockType.NORMAL;
            }
            return false; // 不消除
        }
        
        // 锁链方块：第一次解锁，第二次消除
        if (this.isChained) {
            this.isChained = false;
            return false; // 不消除
        }
        
        // 时间炸弹：拆除
        if (this.blockType === BlockType.TIME_BOMB) {
            this.defuseBomb();
            return true;
        }
        
        // 彩虹方块：清除整行/列
        if (this.blockType === BlockType.RAINBOW) {
            this.clearLineOrColumn();
            return true;
        }
        
        return true; // 正常消除
    }
    
    // 旁边消除时的处理
    onNearbyMatch(): void {
        // 冰冻方块：减少冰冻层数
        if (this.frozenLevel > 0) {
            this.frozenLevel--;
            if (this.frozenLevel === 0) {
                this.blockType = BlockType.NORMAL;
            }
        }
        
        // 毒雾方块：清除毒雾
        if (this.poisonLevel > 0) {
            this.poisonLevel--;
        }
    }
    
    // 更新（用于毒雾扩散、炸弹倒计时）
    update(dt: number): void {
        // 毒雾扩散
        if (this.blockType === BlockType.POISON) {
            this.updatePoison(dt);
        }
        
        // 炸弹倒计时
        if (this.blockType === BlockType.TIME_BOMB) {
            this.updateBomb(dt);
        }
    }
}
```

---

### 方案2：组件化设计

```typescript
// ObstacleComponent.ts
export abstract class ObstacleComponent extends Component {
    abstract canMove(): boolean;
    abstract canMatch(): boolean;
    abstract onMatch(): boolean;
    abstract onNearbyMatch(): void;
}

// FrozenObstacle.ts
export class FrozenObstacle extends ObstacleComponent {
    frozenLevel: number = 2;
    
    canMove(): boolean {
        return false;
    }
    
    canMatch(): boolean {
        return false;
    }
    
    onMatch(): boolean {
        return false;
    }
    
    onNearbyMatch(): void {
        this.frozenLevel--;
        if (this.frozenLevel === 0) {
            this.node.removeComponent(FrozenObstacle);
        }
    }
}

// 使用
const block = this.node.getComponent(Block);
const frozen = this.node.addComponent(FrozenObstacle);
```

---

## 🎨 视觉实现

### 冰冻方块

```typescript
// FrozenEffect.ts
export class FrozenEffect extends Component {
    private iceSprite: Sprite = null;
    private crackSprite: Sprite = null;
    
    start() {
        // 添加冰晶覆盖层
        this.iceSprite = this.addIceLayer();
        this.iceSprite.color = new Color(150, 200, 255, 180);
        
        // 添加冰裂纹
        this.crackSprite = this.addCrackLayer();
        
        // 播放冰冻动画
        this.playFreezeAnimation();
    }
    
    playFreezeAnimation() {
        tween(this.iceSprite)
            .to(0.5, { color: new Color(200, 230, 255, 200) })
            .to(0.5, { color: new Color(150, 200, 255, 180) })
            .union()
            .repeatForever()
            .start();
    }
    
    playUnfreezeAnimation() {
        tween(this.iceSprite)
            .to(0.3, { color: new Color(255, 255, 255, 0) })
            .call(() => {
                this.node.destroy();
            })
            .start();
    }
}
```

---

### 石头方块

```typescript
// StoneBlock.ts
export class StoneBlock extends Component {
    start() {
        // 替换为石头纹理
        const sprite = this.node.getComponent(Sprite);
        sprite.spriteFrame = this.stoneTexture;
        
        // 禁用交互
        this.node.getComponent(UITransform).hitTest = false;
        
        // 添加阴影效果
        this.addShadow();
    }
}
```

---

### 锁链方块

```typescript
// ChainedEffect.ts
export class ChainedEffect extends Component {
    private chainSprite: Sprite = null;
    
    start() {
        // 添加锁链覆盖层
        this.chainSprite = this.addChainLayer();
        
        // 播放锁链闪烁动画
        this.playChainAnimation();
    }
    
    playChainAnimation() {
        tween(this.chainSprite)
            .to(0.3, { color: new Color(255, 215, 0, 255) })
            .to(0.3, { color: new Color(255, 215, 0, 150) })
            .union()
            .repeatForever()
            .start();
    }
    
    playUnlockAnimation() {
        tween(this.chainSprite)
            .to(0.2, { scale: new Vec3(1.2, 1.2, 1) })
            .to(0.2, { scale: new Vec3(0, 0, 1) })
            .call(() => {
                this.node.destroy();
            })
            .start();
    }
}
```

---

### 毒雾方块

```typescript
// PoisonEffect.ts
export class PoisonEffect extends Component {
    private poisonSprite: Sprite = null;
    private spreadTimer: number = 5;
    
    start() {
        // 添加毒雾效果
        this.poisonSprite = this.addPoisonLayer();
        this.poisonSprite.color = new Color(0, 255, 0, 100);
        
        // 播放毒雾动画
        this.playPoisonAnimation();
    }
    
    update(dt: number) {
        this.spreadTimer -= dt;
        if (this.spreadTimer <= 0) {
            this.spread();
            this.spreadTimer = 5;
        }
    }
    
    playPoisonAnimation() {
        tween(this.poisonSprite)
            .to(1, { color: new Color(0, 255, 0, 150) })
            .to(1, { color: new Color(0, 255, 0, 100) })
            .union()
            .repeatForever()
            .start();
    }
    
    spread() {
        // 扩散到相邻方块
        const neighbors = this.getNeighbors();
        if (neighbors.length > 0) {
            const target = neighbors[Math.floor(Math.random() * neighbors.length)];
            target.addComponent(PoisonEffect);
        }
    }
}
```

---

### 时间炸弹

```typescript
// TimeBombEffect.ts
export class TimeBombEffect extends Component {
    private countdown: number = 10;
    private countdownLabel: Label = null;
    
    start() {
        // 添加炸弹图标
        this.addBombSprite();
        
        // 添加倒计时文字
        this.countdownLabel = this.addCountdownLabel();
        
        // 播放炸弹动画
        this.playBombAnimation();
    }
    
    update(dt: number) {
        this.countdown -= dt;
        this.countdownLabel.string = Math.ceil(this.countdown).toString();
        
        if (this.countdown <= 3) {
            // 最后3秒闪烁警告
            this.playWarningAnimation();
        }
        
        if (this.countdown <= 0) {
            this.explode();
        }
    }
    
    playBombAnimation() {
        tween(this.node)
            .to(0.5, { scale: new Vec3(1.1, 1.1, 1) })
            .to(0.5, { scale: new Vec3(1, 1, 1) })
            .union()
            .repeatForever()
            .start();
    }
    
    playWarningAnimation() {
        tween(this.node)
            .to(0.2, { color: new Color(255, 0, 0, 255) })
            .to(0.2, { color: new Color(255, 255, 255, 255) })
            .union()
            .repeatForever()
            .start();
    }
    
    explode() {
        // 游戏失败
        this.gameCore.gameOver(false);
    }
    
    defuse() {
        // 拆除炸弹
        this.playDefuseAnimation();
    }
}
```

---

## 📊 关卡生成系统

```typescript
// LevelGenerator.ts
export class LevelGenerator {
    generateLevel(stage: number): LevelConfig {
        const config: LevelConfig = {
            gridSize: this.getGridSize(stage),
            colorCount: this.getColorCount(stage),
            obstacles: [],
            enemyHp: this.getEnemyHp(stage),
            timeLimit: this.getTimeLimit(stage),
            isSpecial: this.isSpecialLevel(stage)
        };
        
        // 生成障碍
        config.obstacles = this.generateObstacles(stage);
        
        return config;
    }
    
    generateObstacles(stage: number): ObstacleConfig[] {
        const obstacles: ObstacleConfig[] = [];
        
        // 第6关开始：冰冻方块
        if (stage >= 6) {
            const count = this.getFrozenCount(stage);
            obstacles.push(...this.createFrozenObstacles(count));
        }
        
        // 第11关开始：石头方块
        if (stage >= 11) {
            const count = this.getStoneCount(stage);
            obstacles.push(...this.createStoneObstacles(count));
        }
        
        // 第13关开始：锁链方块
        if (stage >= 13) {
            const count = this.getChainedCount(stage);
            obstacles.push(...this.createChainedObstacles(count));
        }
        
        // 第16关开始：毒雾方块
        if (stage >= 16) {
            obstacles.push(this.createPoisonObstacle());
        }
        
        // 第18关开始：时间炸弹
        if (stage >= 18) {
            obstacles.push(this.createTimeBombObstacle());
        }
        
        // 第21关开始：随机组合
        if (stage >= 21) {
            obstacles.push(...this.generateRandomObstacles(stage));
        }
        
        return obstacles;
    }
    
    getFrozenCount(stage: number): number {
        if (stage < 6) return 0;
        if (stage < 11) return 1 + Math.floor((stage - 6) / 2);
        if (stage < 16) return 2 + Math.floor((stage - 11) / 2);
        return 3 + Math.floor((stage - 16) / 3);
    }
    
    getStoneCount(stage: number): number {
        if (stage < 11) return 0;
        if (stage < 16) return 2 + Math.floor((stage - 11) / 2);
        return 3 + Math.floor((stage - 16) / 2);
    }
    
    createFrozenObstacles(count: number): ObstacleConfig[] {
        const obstacles: ObstacleConfig[] = [];
        const positions = this.getRandomPositions(count);
        
        for (const pos of positions) {
            obstacles.push({
                type: BlockType.FROZEN,
                row: pos.row,
                col: pos.col,
                level: 2 // 需要解冻2次
            });
        }
        
        return obstacles;
    }
    
    getRandomPositions(count: number): Position[] {
        const positions: Position[] = [];
        const gridSize = 8;
        
        while (positions.length < count) {
            const row = Math.floor(Math.random() * gridSize);
            const col = Math.floor(Math.random() * gridSize);
            
            // 避免重复位置
            if (!positions.some(p => p.row === row && p.col === col)) {
                positions.push({ row, col });
            }
        }
        
        return positions;
    }
}
```

---

## 🎯 实施步骤

### 第一步：扩展Block类（1小时）
```typescript
// 1. 添加BlockType枚举
// 2. 添加障碍相关属性
// 3. 实现canMove()、canMatch()
// 4. 实现onMatch()、onNearbyMatch()
```

### 第二步：实现冰冻方块（1小时）
```typescript
// 1. 创建FrozenEffect组件
// 2. 实现冰冻视觉效果
// 3. 实现解冻逻辑
// 4. 测试
```

### 第三步：实现石头方块（30分钟）
```typescript
// 1. 创建StoneBlock组件
// 2. 替换纹理
// 3. 禁用交互
// 4. 测试
```

### 第四步：实现锁链方块（1小时）
```typescript
// 1. 创建ChainedEffect组件
// 2. 实现锁链视觉效果
// 3. 实现解锁逻辑
// 4. 测试
```

### 第五步：实现关卡生成器（1小时）
```typescript
// 1. 创建LevelGenerator类
// 2. 实现障碍生成逻辑
// 3. 集成到GameCore
// 4. 测试
```

### 第六步：实现毒雾和炸弹（2小时）
```typescript
// 1. 创建PoisonEffect组件
// 2. 创建TimeBombEffect组件
// 3. 实现扩散和倒计时逻辑
// 4. 测试
```

---

## 📝 测试清单

### 冰冻方块测试
- [ ] 冰冻方块无法移动
- [ ] 旁边消除2次后解冻
- [ ] 解冻动画正常播放
- [ ] 解冻后可以正常使用

### 石头方块测试
- [ ] 石头方块无法移动
- [ ] 石头方块无法消除
- [ ] 石头方块不参与匹配
- [ ] 视觉效果正确

### 锁链方块测试
- [ ] 锁链方块可以移动
- [ ] 第一次消除解锁
- [ ] 第二次消除正常消除
- [ ] 解锁动画正常播放

### 毒雾方块测试
- [ ] 毒雾每5秒扩散一次
- [ ] 旁边消除可以清除毒雾
- [ ] 最多扩散到指定数量
- [ ] 视觉效果正确

### 时间炸弹测试
- [ ] 倒计时正常显示
- [ ] 最后3秒闪烁警告
- [ ] 倒计时结束游戏失败
- [ ] 消除后拆除炸弹

---

你觉得这个实现方案怎么样？想先实现哪个障碍？

