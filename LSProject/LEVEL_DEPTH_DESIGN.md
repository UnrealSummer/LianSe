# 《炼色》关卡深度设计方案

## 🎯 设计理念

**问题：** 20关之后只是血量增加，缺少新鲜感

**解决方案：** 引入关卡机制，让每个阶段有不同的玩法

---

## 📊 关卡阶段划分

### 阶段1：新手村（1-5关）
**主题：** 学习基础
- ✅ 纯净棋盘，无障碍
- ✅ 敌人血量低（50-130）
- ✅ 时间充裕（60秒）
- **目标：** 让玩家熟悉玩法

---

### 阶段2：进阶期（6-10关）
**主题：** 引入变化
- 🆕 **冰冻方块**（第6关开始）
  - 被冰冻的方块无法移动
  - 需要在旁边消除2次才能解冻
  - 每关随机1-2个冰冻方块
- ✅ 敌人血量中等（155-255）
- ✅ 时间正常（60秒）
- **目标：** 增加策略性

---

### 阶段3：挑战期（11-15关）
**主题：** 多重障碍
- 🆕 **石头方块**（第11关开始）
  - 无法移动，无法消除
  - 占据棋盘位置
  - 每关随机2-3个石头方块
- 🆕 **锁链方块**（第13关开始）
  - 被锁链的方块可以移动
  - 但消除后不会消失，只会解锁
  - 解锁后才能正常消除
  - 每关随机1-2个锁链方块
- ✅ 敌人血量高（280-380）
- ✅ 时间紧张（60秒）
- **目标：** 考验玩家应变能力

---

### 阶段4：精英期（16-20关）
**主题：** 极限挑战
- 🆕 **毒雾方块**（第16关开始）
  - 每5秒扩散一次
  - 被毒雾覆盖的方块无法消除
  - 需要在旁边消除才能清除毒雾
  - 初始1个，最多扩散到5个
- 🆕 **时间炸弹**（第18关开始）
  - 显示倒计时（10秒）
  - 必须在倒计时结束前消除
  - 否则游戏直接失败
  - 每关1个时间炸弹
- ✅ 敌人血量极高（405-505）
- ✅ 时间极紧（60秒）
- **目标：** 终极考验

---

### 阶段5：无尽模式（21关+）
**主题：** 随机组合，无限挑战

**机制：**
- 🆕 **随机障碍组合**
  - 每关随机2-4种障碍
  - 障碍数量随关卡增加
  - 例如：第25关可能有5个冰冻+3个石头+2个锁链

- 🆕 **特殊关卡**（每5关）
  - Boss关：血量×2，奖励×2
  - 速通关：时间30秒，血量×0.5
  - 生存关：无时间限制，但每10秒+1个障碍

- 🆕 **难度递增**
  - 血量：+30/关
  - 障碍：+1个/5关
  - 时间：-1秒/10关（最低40秒）

---

## 🎨 障碍方块详细设计

### 1. 冰冻方块 ❄️

**外观：**
- 方块被冰晶覆盖
- 半透明蓝色光晕
- 冰裂纹动画

**机制：**
```typescript
class FrozenBlock {
    frozenLevel: number = 2; // 需要解冻2次
    
    onNearbyMatch() {
        this.frozenLevel--;
        if (this.frozenLevel === 0) {
            this.unfreeze(); // 解冻
        }
    }
    
    canMove(): boolean {
        return false; // 无法移动
    }
}
```

**策略：**
- 优先消除冰冻方块周围
- 解冻后可以正常使用
- 冰冻方块不参与匹配

**生成规则：**
- 第6-10关：1-2个
- 第11-15关：2-3个
- 第16+关：3-5个

---

### 2. 石头方块 🪨

**外观：**
- 灰色石头纹理
- 无法选中高亮
- 静态，无动画

**机制：**
```typescript
class StoneBlock {
    canMove(): boolean {
        return false; // 无法移动
    }
    
    canMatch(): boolean {
        return false; // 无法消除
    }
    
    isObstacle(): boolean {
        return true; // 是障碍
    }
}
```

**策略：**
- 石头占据位置，减少可用空间
- 需要绕过石头进行消除
- 考验玩家的空间规划能力

**生成规则：**
- 第11-15关：2-3个
- 第16-20关：3-4个
- 第21+关：4-6个
- 位置：随机，但不会阻断所有路径

---

### 3. 锁链方块 ⛓️

**外观：**
- 方块被金色锁链缠绕
- 锁链闪烁动画
- 可以看到方块颜色

**机制：**
```typescript
class ChainedBlock {
    isChained: boolean = true;
    
    onMatch() {
        if (this.isChained) {
            this.unlock(); // 解锁
            return false; // 不消除
        } else {
            return true; // 正常消除
        }
    }
    
    canMove(): boolean {
        return true; // 可以移动
    }
}
```

**策略：**
- 第一次消除：解锁
- 第二次消除：正常消除
- 需要两次操作才能清除

**生成规则：**
- 第13-15关：1-2个
- 第16-20关：2-3个
- 第21+关：3-4个

---

### 4. 毒雾方块 ☠️

**外观：**
- 绿色毒雾效果
- 持续扩散动画
- 覆盖的方块变暗

**机制：**
```typescript
class PoisonBlock {
    spreadTimer: number = 5; // 5秒扩散一次
    
    update(dt: number) {
        this.spreadTimer -= dt;
        if (this.spreadTimer <= 0) {
            this.spread(); // 扩散到相邻方块
            this.spreadTimer = 5;
        }
    }
    
    spread() {
        // 扩散到上下左右相邻方块
        const neighbors = this.getNeighbors();
        const target = neighbors[Math.floor(Math.random() * neighbors.length)];
        target.addPoison();
    }
}
```

**策略：**
- 必须尽快清除，否则会扩散
- 在旁边消除可以清除毒雾
- 增加时间压力

**生成规则：**
- 第16-20关：1个（最多扩散到5个）
- 第21+关：1-2个（最多扩散到8个）

---

### 5. 时间炸弹 💣

**外观：**
- 红色炸弹图标
- 倒计时数字（10→9→8...）
- 最后3秒闪烁警告

**机制：**
```typescript
class TimeBomb {
    countdown: number = 10; // 10秒倒计时
    
    update(dt: number) {
        this.countdown -= dt;
        if (this.countdown <= 0) {
            this.explode(); // 爆炸，游戏失败
        }
    }
    
    onMatch() {
        this.defuse(); // 拆除炸弹
        return true;
    }
}
```

**策略：**
- 必须优先消除
- 增加紧迫感
- 打乱玩家节奏

**生成规则：**
- 第18-20关：1个
- 第21+关：1-2个

---

### 6. 彩虹方块 🌈（正面障碍）

**外观：**
- 七彩渐变效果
- 闪烁动画
- 非常显眼

**机制：**
```typescript
class RainbowBlock {
    onMatch() {
        // 消除整行或整列
        this.clearLineOrColumn();
        return true;
    }
    
    canMatchAnyColor(): boolean {
        return true; // 可以和任何颜色匹配
    }
}
```

**策略：**
- 正面效果，帮助玩家
- 可以和任何颜色匹配
- 消除时清除整行/列

**生成规则：**
- 第21+关：每10关出现1次
- 作为奖励机制

---

## 🎮 关卡生成算法

### 基础算法

```typescript
class LevelGenerator {
    generateLevel(stage: number): LevelConfig {
        const config: LevelConfig = {
            gridSize: this.getGridSize(stage),
            obstacles: [],
            enemyHp: this.getEnemyHp(stage),
            timeLimit: this.getTimeLimit(stage)
        };
        
        // 根据关卡添加障碍
        if (stage >= 6) {
            config.obstacles.push(...this.generateFrozen(stage));
        }
        if (stage >= 11) {
            config.obstacles.push(...this.generateStone(stage));
        }
        if (stage >= 13) {
            config.obstacles.push(...this.generateChained(stage));
        }
        if (stage >= 16) {
            config.obstacles.push(...this.generatePoison(stage));
        }
        if (stage >= 18) {
            config.obstacles.push(...this.generateTimeBomb(stage));
        }
        
        // 21关后随机组合
        if (stage >= 21) {
            config.obstacles = this.generateRandomObstacles(stage);
        }
        
        return config;
    }
    
    generateFrozen(stage: number): Obstacle[] {
        const count = Math.min(Math.floor((stage - 5) / 2) + 1, 5);
        return this.createObstacles('frozen', count);
    }
    
    generateStone(stage: number): Obstacle[] {
        const count = Math.min(Math.floor((stage - 10) / 2) + 2, 6);
        return this.createObstacles('stone', count);
    }
    
    // ... 其他生成方法
}
```

---

## 📊 难度曲线（完整版）

| 关卡 | 血量 | 障碍 | 时间 | 难度 |
|------|------|------|------|------|
| 1-5 | 50-130 | 无 | 60s | ⭐ |
| 6-10 | 155-255 | 冰冻1-2 | 60s | ⭐⭐ |
| 11-15 | 280-380 | 冰冻2+石头2+锁链1 | 60s | ⭐⭐⭐ |
| 16-20 | 405-505 | 冰冻3+石头3+锁链2+毒雾1+炸弹1 | 60s | ⭐⭐⭐⭐ |
| 21-30 | 535-835 | 随机组合4-6个 | 55s | ⭐⭐⭐⭐⭐ |
| 31-40 | 865-1165 | 随机组合6-8个 | 50s | ⭐⭐⭐⭐⭐ |
| 41-50 | 1195-1495 | 随机组合8-10个 | 45s | ⭐⭐⭐⭐⭐ |
| 51+ | 1525+ | 随机组合10+个 | 40s | ⭐⭐⭐⭐⭐ |

---

## 🎯 特殊关卡设计

### Boss关（每10关）

**特点：**
- 敌人血量×2
- 奖励金币×2
- 奖励词条稀有度+1
- 特殊背景音乐
- 击败后有特殊动画

**例如：**
- 第10关：强敌Boss（血量510）
- 第20关：精英Boss（血量1010）
- 第30关：传奇Boss（血量1670）

---

### 速通关（每15关）

**特点：**
- 时间限制30秒
- 敌人血量×0.5
- 奖励：额外时间道具
- 考验手速和反应

**例如：**
- 第15关：速通挑战（血量190，30秒）
- 第30关：速通挑战（血量418，30秒）

---

### 生存关（每20关）

**特点：**
- 无时间限制
- 每10秒增加1个障碍
- 敌人血量×1.5
- 考验耐心和策略

**例如：**
- 第20关：生存挑战（血量758）
- 第40关：生存挑战（血量1748）

---

## 💡 额外机制建议

### 1. 棋盘大小变化

**当前：** 固定8×8

**建议：**
- 1-10关：8×8
- 11-20关：9×9
- 21-30关：10×10
- 31+关：随机8-10

**效果：**
- 增加复杂度
- 更多消除可能
- 更多障碍空间

---

### 2. 颜色数量变化

**当前：** 固定5种颜色

**建议：**
- 1-5关：4种颜色（更容易匹配）
- 6-15关：5种颜色
- 16-25关：6种颜色（更难匹配）
- 26+关：随机5-7种

**效果：**
- 前期更友好
- 后期更有挑战

---

### 3. 敌人技能

**建议：**
```typescript
// 敌人每20秒释放一次技能
class Enemy {
    skills: EnemySkill[] = [];
    
    // 第11关开始，敌人有技能
    useSkill() {
        const skill = this.skills[Math.floor(Math.random() * this.skills.length)];
        skill.execute();
    }
}

// 技能示例
class FreezeSkill {
    execute() {
        // 随机冰冻2个方块
        const blocks = this.getRandomBlocks(2);
        blocks.forEach(b => b.freeze());
    }
}

class ShuffleSkill {
    execute() {
        // 打乱棋盘
        this.grid.shuffle();
    }
}

class TimeStealSkill {
    execute() {
        // 减少10秒时间
        this.game.time -= 10;
    }
}
```

---

## 📊 实施优先级

### 第一阶段（核心障碍）
1. ✅ 冰冻方块（第6关）
2. ✅ 石头方块（第11关）
3. ✅ 锁链方块（第13关）

**预计时间：** 3小时

---

### 第二阶段（高级障碍）
4. ✅ 毒雾方块（第16关）
5. ✅ 时间炸弹（第18关）
6. ✅ 彩虹方块（第21关）

**预计时间：** 2小时

---

### 第三阶段（特殊关卡）
7. ✅ Boss关（每10关）
8. ✅ 速通关（每15关）
9. ✅ 生存关（每20关）

**预计时间：** 2小时

---

### 第四阶段（额外机制）
10. ✅ 棋盘大小变化
11. ✅ 颜色数量变化
12. ✅ 敌人技能

**预计时间：** 3小时

---

## 🎯 总结

### 核心改进
- ✅ 20关后不再单调
- ✅ 每个阶段有新机制
- ✅ 障碍增加策略性
- ✅ 特殊关卡增加变化

### 预期效果
- 游戏深度：×3
- 可玩性：×5
- 策略性：×4
- 重复可玩性：×10

### 开发成本
- 核心障碍：3小时
- 高级障碍：2小时
- 特殊关卡：2小时
- 额外机制：3小时
- **总计：10小时**

---

你觉得这个设计怎么样？想先实现哪些障碍？

