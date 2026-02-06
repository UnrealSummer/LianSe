# 《炼色》完整开发计划

## 🎯 项目目标

### 游戏类型
**传统三消 + Roguelike + 关卡深度**

### 核心玩法
1. **8×8网格，传统三消**
   - 三原色（红、黄、蓝）
   - 点击选择两个相邻方块交换
   - 3个及以上相邻同色可消除
   - 自动连锁消除

2. **战斗系统**
   - 消除造成伤害
   - 击败敌人进入下一关
   - 60秒时间限制

3. **Roguelike元素**
   - 过关后选择词条
   - 敌人血量递增
   - 金币系统

4. **关卡深度系统（今天新增）**
   - 障碍方块系统
   - 渐进式颜色增加
   - 特殊关卡

---

## 📊 今天新增的设计

### 1. 障碍方块系统

#### 冰冻方块 ❄️（第6关开始）
- 被冰冻的方块无法移动
- 旁边消除2次才能解冻
- 视觉：蓝色冰晶覆盖，呼吸动画
- 数量：6-10关1-2个，11-15关2-3个，16+关3-5个

#### 石头方块 🪨（第11关开始）
- 无法移动，无法消除
- 占据棋盘位置
- 视觉：灰色石头纹理
- 数量：11-15关2-3个，16-20关3-4个，21+关4-6个

#### 锁链方块 ⛓️（第13关开始）
- 可以移动
- 第一次消除解锁，第二次消除才消失
- 视觉：金色锁链缠绕，闪烁动画
- 数量：13-15关1-2个，16-20关2-3个，21+关3-4个

#### 毒雾方块 ☠️（第16关开始）
- 每5秒扩散到相邻方块
- 被毒雾覆盖的方块无法消除
- 旁边消除可清除毒雾
- 视觉：绿色毒雾效果，持续扩散动画
- 数量：初始1个，最多扩散到5个

#### 时间炸弹 💣（第18关开始）
- 10秒倒计时
- 必须在倒计时结束前消除
- 否则游戏直接失败
- 视觉：红色炸弹图标，倒计时数字，最后3秒闪烁
- 数量：18-20关1个，21+关1-2个

#### 彩虹方块 🌈（第21关开始，奖励）
- 可以和任何颜色匹配
- 消除时清除整行或整列
- 视觉：七彩渐变效果，闪烁动画
- 数量：每10关出现1次

---

### 2. 渐进式颜色系统

| 关卡范围 | 颜色数量 | 颜色组合 | 匹配难度 |
|---------|---------|----------|----------|
| 1-5关 | 3种 | 红、黄、蓝 | 简单（11%） |
| 6-10关 | 4种 | 红、黄、蓝、橙 | 适中（6.25%） |
| 11-15关 | 5种 | 红、黄、蓝、橙、紫 | 有挑战（4%） |
| 16-20关 | 6种 | 红、黄、蓝、橙、紫、绿 | 困难（2.8%） |
| 21+关 | 5-6种 | 随机 | 极难 |

**效果：**
- 前期友好，容易上手
- 后期有挑战，需要策略
- 配合障碍系统，难度曲线平滑

---

### 3. 完整关卡配置

| 关卡 | 颜色 | 冰冻 | 石头 | 锁链 | 毒雾 | 炸弹 | 彩虹 | 血量 | 难度 |
|------|------|------|------|------|------|------|------|------|------|
| 1-5 | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 50-130 | ⭐ |
| 6-10 | 4 | 1-2 | 0 | 0 | 0 | 0 | 0 | 155-255 | ⭐⭐ |
| 11-12 | 5 | 2 | 2 | 0 | 0 | 0 | 0 | 280-330 | ⭐⭐⭐ |
| 13-15 | 5 | 2-3 | 2-3 | 1-2 | 0 | 0 | 0 | 355-405 | ⭐⭐⭐ |
| 16-17 | 6 | 3 | 3 | 2 | 1 | 0 | 0 | 430-480 | ⭐⭐⭐⭐ |
| 18-20 | 6 | 3-4 | 3-4 | 2-3 | 1 | 1 | 0 | 505-555 | ⭐⭐⭐⭐ |
| 21+ | 5-6 | 随机组合 | | | | | 每10关1个 | 585+ | ⭐⭐⭐⭐⭐ |

---

### 4. 特殊关卡（21关后）

#### Boss关（每10关）
- 敌人血量×2
- 奖励金币×2
- 奖励词条稀有度+1
- 特殊背景音乐

#### 速通关（每15关）
- 时间限制30秒
- 敌人血量×0.5
- 奖励：额外时间道具

#### 生存关（每20关）
- 无时间限制
- 每10秒增加1个障碍
- 敌人血量×1.5

---

## 🏗️ 技术架构（从0开始）

### 核心系统

```
GameCore (游戏核心)
├── GridSystem (网格系统)
│   ├── Block (方块组件)
│   │   ├── BlockType (障碍类型)
│   │   ├── ColorType (颜色类型)
│   │   └── ObstacleEffects (障碍效果)
│   └── LevelGenerator (关卡生成器)
├── EnemySystem (敌人系统)
├── DamageSystem (伤害系统)
├── ModifierSystem (词条系统)
├── ProgressionManager (进度管理)
└── UIManager (UI管理)
```

### 关键类设计

#### Block.ts（方块组件）
```typescript
export enum ColorType {
    RED = 0, YELLOW = 1, BLUE = 2,
    ORANGE = 3, PURPLE = 4, GREEN = 5,
    RAINBOW = 9
}

export enum BlockType {
    NORMAL = 0,
    FROZEN = 1,
    STONE = 2,
    CHAINED = 3,
    POISON = 4,
    TIME_BOMB = 5
}

export class Block extends Component {
    colorType: ColorType;
    blockType: BlockType;
    frozenLevel: number = 0;
    isChained: boolean = false;
    poisonLevel: number = 0;
    bombCountdown: number = 0;
    
    canMove(): boolean;
    canMatch(): boolean;
    onMatch(): boolean;
    onNearbyMatch(): void;
}
```

#### GridSystem.ts（网格系统）
```typescript
export class GridSystem extends Component {
    gridSize: number = 8;
    blockSize: number;
    spacing: number;
    blocks: Node[][];
    
    calculateAdaptiveSize(): void;
    generateGrid(colorCount: number, obstacles: ObstacleConfig[]): void;
    swapBlocks(row1, col1, row2, col2): void;
    findAllMatches(): Node[][];
    removeBlocks(blocks: Node[]): void;
    dropBlocks(callback): void;
}
```

#### LevelGenerator.ts（关卡生成器）
```typescript
export class LevelGenerator {
    generateLevel(stage: number): LevelConfig;
    generateObstacles(stage: number): ObstacleConfig[];
    getColorCount(stage: number): number;
    getEnemyHp(stage: number): number;
}
```

---

## 📋 开发步骤（从0开始）

### 阶段1：基础框架（2小时）

#### 1.1 创建核心类（30分钟）
- [ ] GameCore.ts - 游戏核心控制器
- [ ] GridSystem.ts - 网格系统
- [ ] Block.ts - 方块组件（基础版）
- [ ] 场景配置

#### 1.2 实现基础三消（1小时）
- [ ] 网格生成（8×8）
- [ ] 自适应大小计算
- [ ] 点击选择交换
- [ ] 三连检测
- [ ] 消除和掉落

#### 1.3 测试基础功能（30分钟）
- [ ] 能否正常生成网格
- [ ] 方块间隔是否合适
- [ ] 能否点击交换
- [ ] 能否正常消除
- [ ] 掉落是否正常

**提交：** `feat: Basic match-3 system`

---

### 阶段2：战斗系统（1小时）

#### 2.1 敌人系统（30分钟）
- [ ] EnemySystem.ts
- [ ] 敌人血条显示
- [ ] 受伤动画
- [ ] 击败检测

#### 2.2 伤害系统（30分钟）
- [ ] DamageSystem.ts
- [ ] 伤害计算
- [ ] 连锁倍率
- [ ] 伤害反馈

**提交：** `feat: Combat system`

---

### 阶段3：关卡生成器（1小时）

#### 3.1 LevelGenerator（30分钟）
- [ ] LevelGenerator.ts
- [ ] 关卡配置生成
- [ ] 敌人血量计算
- [ ] 颜色数量计算

#### 3.2 渐进式颜色（30分钟）
- [ ] 1-5关：3种颜色
- [ ] 6-10关：4种颜色
- [ ] 11-15关：5种颜色
- [ ] 16-20关：6种颜色

**提交：** `feat: Level generator with progressive colors`

---

### 阶段4：障碍系统（4小时）

#### 4.1 冰冻方块（1小时）
- [ ] BlockType.FROZEN
- [ ] 冰冻视觉效果
- [ ] 解冻逻辑
- [ ] 测试

**提交：** `feat: Frozen blocks`

#### 4.2 石头方块（30分钟）
- [ ] BlockType.STONE
- [ ] 石头视觉效果
- [ ] 禁用交互
- [ ] 测试

**提交：** `feat: Stone blocks`

#### 4.3 锁链方块（1小时）
- [ ] BlockType.CHAINED
- [ ] 锁链视觉效果
- [ ] 解锁逻辑
- [ ] 测试

**提交：** `feat: Chained blocks`

#### 4.4 毒雾方块（1小时）
- [ ] BlockType.POISON
- [ ] 毒雾视觉效果
- [ ] 扩散逻辑
- [ ] 测试

**提交：** `feat: Poison blocks`

#### 4.5 时间炸弹（30分钟）
- [ ] BlockType.TIME_BOMB
- [ ] 炸弹视觉效果
- [ ] 倒计时逻辑
- [ ] 测试

**提交：** `feat: Time bomb blocks`

---

### 阶段5：彩虹方块（1小时）

#### 5.1 彩虹方块（1小时）
- [ ] ColorType.RAINBOW
- [ ] 彩虹视觉效果（渐变动画）
- [ ] 清除整行/列逻辑
- [ ] 测试

**提交：** `feat: Rainbow blocks (reward)`

---

### 阶段6：UI和完善（2小时）

#### 6.1 UI配置（1小时）
- [ ] 游戏结束界面
- [ ] 暂停界面
- [ ] 金币显示
- [ ] 关卡显示

#### 6.2 测试和优化（1小时）
- [ ] 完整流程测试
- [ ] 平衡性调整
- [ ] Bug修复

**提交：** `feat: UI and polish`

---

## ⏱️ 总时间估算

| 阶段 | 内容 | 时间 |
|------|------|------|
| 阶段1 | 基础框架 | 2小时 |
| 阶段2 | 战斗系统 | 1小时 |
| 阶段3 | 关卡生成器 | 1小时 |
| 阶段4 | 障碍系统 | 4小时 |
| 阶段5 | 彩虹方块 | 1小时 |
| 阶段6 | UI和完善 | 2小时 |
| **总计** | | **11小时** |

---

## 🎯 开发原则

### 1. 小步快跑
- 一次只实现一个功能
- 每个功能完成后立即测试
- 测试通过后立即提交到Git

### 2. 及时提交
- 每完成一个功能立即提交
- 提交信息清晰（feat/fix/docs）
- 不要积累多个修改

### 3. 先测试再修改
- 确保当前版本能运行
- 再添加新功能
- 避免破坏已有功能

### 4. 文档同步
- 代码和文档要一致
- 修改后更新文档
- 记录重要决策

---

## 📝 提交规范

```bash
# 新功能
git commit -m "feat: Add frozen blocks"

# Bug修复
git commit -m "fix: Fix block overlap issue"

# 文档
git commit -m "docs: Update development plan"

# 重构
git commit -m "refactor: Simplify grid generation"

# 测试
git commit -m "test: Add unit tests for damage system"
```

---

## 🚀 开始开发

### 第一步：清理环境
```bash
cd E:\Project\LianSe\LSProject
# 删除旧架构文件（GameManager, GridManager）
# 保留新架构文件（GameCore, GridSystem）
```

### 第二步：创建基础框架
从阶段1开始，按照开发步骤逐步实现

### 第三步：频繁提交
每完成一个小功能就提交

---

*创建时间：2026-02-06 23:52*
*从0开始，重新构建*
*记住：小步快跑，及时提交！*
