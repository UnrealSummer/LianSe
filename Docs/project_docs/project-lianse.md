# 《炼色》项目完整记忆

## 📋 项目基本信息

- **项目名称：** 炼色 (LianSe)
- **类型：** 传统三消 + Roguelike
- **技术栈：** Cocos Creator 3.8.1 + TypeScript
- **目标平台：** 微信小游戏 + 抖音小游戏
- **项目路径：** E:\Project\LianSe\LSProject
- **启动时间：** 2026-01-28

---

## 🎮 核心玩法

### 消除机制
- **8×8网格，传统三消**
- 同颜色三个及以上相邻可消除
- 只有三原色（0,1,2）
- **玩家滑动交换方块触发消除**（不是自动消除）
- 消除后上方方块下落，顶部生成新方块

### 伤害系统
**伤害计算流程：**
```
消除 → 基础伤害 → 词条修改 → 连锁倍率 → 最终伤害
```

**基础伤害：**
- 3个：10伤害
- 4个：15伤害
- 5个：20伤害
- L/T形：25伤害
- 方形：30伤害
- 超过5个：每多一个+5伤害

**连锁倍率：**
- 默认：1.3^连锁层数
- 词条可修改（如"连锁爆发"提升到1.5）

### Roguelike元素
- **过关后选择词条**（类似《杀戮尖塔》）
- 敌人血量随关卡增长：50 + (关卡-1) × 30
- 60秒时间限制
- 金币系统

---

## 📁 代码架构（ACB架构）

### 核心文件
```
assets/scripts/
├── GameCore.ts          - 游戏核心控制器（ACB架构）
├── GridSystem.ts        - 8×8网格系统（三消逻辑）
├── Block.ts             - 方块组件
├── DamageSystem.ts      - 伤害计算管道
├── EnemySystem.ts       - 敌人系统
├── ModifierSystem.ts    - 词条系统核心
├── Modifiers.ts         - 词条库（7个词条）
├── ModifierSelectionUI.ts - 词条选择界面
├── ProgressionManager.ts  - 关卡进度管理
├── CombatFeedback.ts    - 战斗反馈
├── UIManager.ts         - UI管理器
├── AudioManager.ts      - 音效管理器
└── TestRunner.ts        - 测试运行器
```

### 系统关系
```
GameCore (总控)
├── GridSystem (网格)
├── DamageSystem (伤害)
│   └── ModifierSystem (词条)
├── EnemySystem (敌人)
├── ProgressionManager (进度)
│   ├── ModifierSelectionUI (词条UI)
│   └── ModifierSystem (词条)
├── CombatFeedback (反馈)
└── AudioManager (音效)
```

---

## 🎯 词条系统（已实现）

### 接口设计
```typescript
interface IModifier {
    id: string;
    name: string;
    description: string;
    rarity: 'common' | 'rare' | 'epic';
    
    // 生命周期钩子
    onAcquire?(): void;
    onRemove?(): void;
    
    // 游戏事件钩子
    onMatch?(data: MatchData): MatchData;
    onDamageCalculate?(damage: number): number;
    onDamageDealt?(damage: number, target: any): void;
    onEnemyKill?(enemy: any): void;
    onChain?(chainLevel: number): number;
    onCoinCollect?(amount: number): number;
    onTimeUpdate?(timeLeft: number): void;
}
```

### 已实现的7个词条

1. **溢出转化** (common)
   - 过量伤害的50%转化为金币

2. **连锁爆发** (common)
   - 连锁倍率从1.3提升到1.5

3. **大丰收** (common)
   - 单次消除5个以上时，额外+10伤害

4. **连环爆破** (rare)
   - 击杀敌人时，造成其最大生命值20%的额外伤害

5. **点金术** (common)
   - 所有金币收益+50%

6. **先发制人** (rare)
   - 每回合第一次消除伤害翻倍

7. **物以稀为贵** (部分实现)
   - 颜色稀缺加成

### 词条系统功能
- ✅ 添加/移除词条
- ✅ 清空所有词条
- ✅ 触发消除事件
- ✅ 计算最终伤害
- ✅ 连锁倍率修改
- ✅ 击杀事件
- ✅ 金币收集修改
- ✅ 词条选择UI（ModifierSelectionUI.ts）

---

## ✅ 已完成功能

### 核心系统
- ✅ 8×8网格生成（自适应大小）
- ✅ 三消检测（横向、纵向）
- ✅ 玩家滑动交换方块
- ✅ 自动消除和掉落
- ✅ 连锁检测
- ✅ 伤害计算管道
- ✅ 敌人系统
- ✅ 词条系统（完整）
- ✅ 关卡进度管理
- ✅ 词条选择界面

### UI/反馈系统
- ✅ 进度条显示
- ✅ 分数弹出动画
- ✅ 连锁倍数显示
- ✅ 目标UI优化
- ✅ 战斗反馈（CombatFeedback.ts）

### 音效系统
- ✅ 程序化音效生成（Web Audio API）
- ✅ 8种音效
- ✅ 连锁层数影响音调

---

## 🐛 已修复的重大问题

### 1. 方块生成问题（2026-02-04）
- **现象：** 运行后所有东西闪了一下就消失了
- **原因：** 
  1. 游戏启动后自动检测消除（update中每帧检测）
  2. 初始网格有大量可消除的方块
  3. 连锁逻辑错误导致疯狂连锁消除
- **修复：**
  1. ✅ 连锁逻辑修复（GameCore.ts）
  2. ✅ 初始网格调用 removeInitialMatches()（GridSystem.ts）

### 2. 方块位置不一致问题（2026-02-04）⭐
- **现象：** 
  - 初始生成的方块位置正确
  - 消除后新生成的方块位置偏移
  - 方块叠在一起，间隔不够
- **根本原因：** 
  1. **Cocos Creator 的 start() 执行顺序不确定**
  2. GameCore.start() 可能先于 GridSystem.start() 执行
  3. generateGrid() 使用了场景配置的默认值（60, 8）
  4. calculateAdaptiveSize() 计算出新值（64, 11）
  5. 导致初始生成和后续生成使用不同的参数
- **修复方案：**
  ```typescript
  // GridSystem.ts - generateGrid()
  generateGrid(): void {
      // 每次生成前都重新计算自适应大小（确保一致）
      this.calculateAdaptiveSize();
      // ...
  }
  ```
- **关键经验：**
  - ⚠️ **Cocos Creator 的 start() 不保证执行顺序！**
  - ✅ **关键参数计算要在使用前立即执行，不要依赖 start()**
  - ✅ **位置计算要统一使用同一个方法（getBlockPosition）**
  - ✅ **setParent 会影响位置，要在 setParent 后再次 setPosition**
  - ✅ **Widget 组件会强制设置位置，要在 setParent 前禁用**

### 3. 方块大小和间隔自适应（2026-02-04）
- **问题：** 8×8 格子超出屏幕，方块叠在一起
- **解决方案：** 
  ```typescript
  calculateAdaptiveSize(): void {
      const spacingRatio = 0.18; // 间隔占18%
      const blockSize = availableWidth / (gridSize + (gridSize - 1) * spacingRatio);
      this.blockSize = Math.floor(Math.min(widthBlockSize, heightBlockSize));
      this.spacing = Math.floor(this.blockSize * spacingRatio);
  }
  ```
- **效果：** 
  - 5×5 格子 → 方块更大，间隔更大
  - 8×8 格子 → 方块适中，间隔适中
  - 10×10 格子 → 方块更小，间隔更小

---

## 🔧 技术亮点

1. **ACB架构** - 清晰的系统分层
2. **事件驱动的词条系统** - 灵活的钩子机制
3. **伤害计算管道** - 消除→基础→词条→连锁→最终
4. **程序化音效** - 无需外部文件
5. **参数化设计** - 连锁层数影响音调、字体、震动
6. **自适应网格** - 根据屏幕大小动态调整方块大小和间隔

---

## 🎓 经验教训

### Cocos Creator 陷阱
1. **start() 执行顺序不确定** - 不要依赖 start() 的执行顺序
2. **setParent 会重置位置** - 要在 setParent 后再次 setPosition
3. **Widget 组件会强制位置** - 要在 setParent 前禁用
4. **场景配置会覆盖代码** - 要在运行时重新计算关键参数

### 调试技巧
1. **添加详细日志** - 显示计算值和实际值的对比
2. **对比初始和后续** - 找出参数变化的时机
3. **不盲目改参数** - 先找到根本原因再修复
4. **统一位置计算** - 使用同一个方法避免不一致

---

## 📝 下一步计划

1. ⚠️ **第二关问题（紧急）** - 击败敌人后第二关没出现格子
   - **现象：** 第二关只有敌人血条和UI，看不到格子
   - **已添加调试日志：** 容器状态、子节点数
   - **下一步：** 查看日志判断是可见性问题还是生成问题
2. 测试多关卡流程（第三关、第四关...）
3. **完善词条TODO** - 金币生成、连环爆破、首次消除跟踪
4. **测试游戏流程** - 从开始到过关到选词条
5. **美术资源** - 等sansheng有空下载
6. **Phase 3** - 粒子特效（如果需要）

---

*最后更新：2026-02-04 22:25*
*第一关核心功能已完成，第二关格子不显示问题待解决*

---

## ?? 2026-02-05 ����

### ��������
- ? ��Ϸ����������棨GameOverUI.ts��
- ? ��������ϵͳ
- ? ���ϵͳ
- ? ��ͣ���ܣ�PauseUI.ts��
- ? ���ý��棨SettingsUI.ts��
- ? ���˵����棨MainMenuUI.ts��
- ? ���ش洢ϵͳ��DataManager.ts��

### ��������
- ? �������ƣ���ɱ����һ����ɶ����˺�
- ? �ȷ����ˣ�ÿ���״������˺�����
- ? ����ϡΪ����ɫ��3��ʱ�˺�+50%

### ����
- **v0.4 ���ȣ�95%**
- ���к��Ĺ��ܴ������
- �ȴ��������ã�Լ60���ӣ�

