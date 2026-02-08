# 游戏流程控制系统使用指南

## ✅ 已完成

### 1. GameFlowController.ts - 游戏流程控制器
**功能：**
- ✅ 游戏状态管理（7种状态）
- ✅ 状态切换逻辑
- ✅ 分数和金币追踪
- ✅ 关卡进度管理
- ✅ 事件系统

**游戏状态：**
- `MENU` - 主菜单
- `READY` - 准备开始
- `PLAYING` - 游戏中
- `PAUSED` - 暂停
- `WIN` - 胜利
- `LOSE` - 失败
- `MODIFIER_SELECT` - 选择词条

### 2. PauseMenuUI.ts - 暂停菜单
**功能：**
- ✅ 继续游戏
- ✅ 重新开始
- ✅ 返回主菜单
- ✅ 设置（占位符）

### 3. GameUI.ts - 已更新
**功能：**
- ✅ 暂停按钮连接到GameFlowController
- ✅ 导入GameFlowController和GameState

---

## 🎮 在Cocos Creator中配置

### 第一步：在Main场景中添加GameFlowController（5分钟）

1. **打开Main场景**

2. **在Canvas下创建节点**
   - 命名为 `GameFlowController`
   - 添加GameFlowController.ts脚本

3. **创建暂停面板**
   - 在Canvas下创建节点，命名为 `PausePanel`
   - 设置为不可见（Active: false）

---

### 第二步：搭建暂停面板（15分钟）

#### 1. 创建面板背景
```
PausePanel
├── Background (半透明黑色遮罩)
└── Panel (panel_main.png)
    ├── Title (Label - "暂停")
    └── ButtonContainer (Layout - Vertical)
        ├── ResumeButton ("继续游戏")
        ├── RestartButton ("重新开始")
        ├── SettingsButton ("设置")
        └── MainMenuButton ("返回主菜单")
```

#### 2. 配置Background
- **Size:** 750x1334（填满屏幕）
- **Color:** 黑色，Alpha: 180
- **添加Button组件** - 阻止点击穿透

#### 3. 配置Panel
- **Position:** (0, 0)
- **Size:** (600, 500)
- **Sprite:** panel_main.png
- **Type:** Sliced

#### 4. 配置Title
- **Position:** (0, 180)
- **Label:** "暂停"
- **Font Size:** 60
- **Color:** #333333

#### 5. 配置ButtonContainer
- **Position:** (0, 0)
- **Layout组件：**
  - Type: Vertical
  - Spacing: 20

#### 6. 配置按钮（4个）
每个按钮：
- **Size:** (400, 80)
- **Sprite:** button_primary.png 或 button_secondary.png
- **Button组件**
- **Label子节点** - 对应文字

#### 7. 添加PauseMenuUI脚本
- 在PausePanel节点添加PauseMenuUI.ts
- 配置按钮引用

---

### 第三步：连接GameFlowController（3分钟）

1. **选中GameFlowController节点**

2. **在GameFlowController (Script)组件中配置**
   - Pause Panel → PausePanel节点
   - Game Over Panel → 暂时留空
   - Modifier Select Panel → 暂时留空

3. **保存场景**

---

## 🎯 节点结构

```
Main (Scene)
└── Canvas
    ├── GameFlowController (GameFlowController.ts)
    │   └── [配置面板引用]
    │
    ├── PausePanel (Active: false)
    │   ├── Background (半透明遮罩)
    │   └── Panel (PauseMenuUI.ts)
    │       ├── Title
    │       └── ButtonContainer
    │           ├── ResumeButton
    │           ├── RestartButton
    │           ├── SettingsButton
    │           └── MainMenuButton
    │
    ├── GameUI (已存在)
    └── ... (其他游戏节点)
```

---

## 🔧 使用方法

### 在代码中使用GameFlowController

```typescript
import { GameFlowController, GameState } from './GameFlowController';

// 获取实例
const flowController = GameFlowController.instance;

// 改变状态
flowController.changeState(GameState.PLAYING);

// 暂停游戏
flowController.changeState(GameState.PAUSED);

// 继续游戏
flowController.resumeGame();

// 重新开始
flowController.restartGame();

// 检查状态
if (flowController.isPlaying()) {
    // 游戏进行中
}

// 添加分数
flowController.addScore(100);

// 添加金币
flowController.addCoins(10);

// 监听状态改变
flowController.node.on('state-changed', (newState, oldState) => {
    console.log(`State: ${oldState} -> ${newState}`);
});

// 监听游戏开始
flowController.node.on('game-started', () => {
    console.log('Game started!');
});

// 监听游戏暂停
flowController.node.on('game-paused', () => {
    console.log('Game paused!');
});

// 监听游戏胜利
flowController.node.on('game-win', (data) => {
    console.log('Win!', data);
});
```

---

## 🎮 游戏流程

### 正常流程
```
MENU (主菜单)
  ↓ 点击开始
READY (准备)
  ↓ 倒计时
PLAYING (游戏中)
  ↓ 敌人死亡
WIN (胜利)
  ↓ 选择词条
MODIFIER_SELECT (词条选择)
  ↓ 选择完成
READY (下一关)
```

### 暂停流程
```
PLAYING (游戏中)
  ↓ 点击暂停
PAUSED (暂停)
  ↓ 点击继续
PLAYING (游戏中)
```

### 失败流程
```
PLAYING (游戏中)
  ↓ 时间耗尽
LOSE (失败)
  ↓ 重新开始
READY (准备)
```

---

## ✅ 测试清单

### 基础功能
- [ ] GameFlowController节点已创建
- [ ] PausePanel已创建并隐藏
- [ ] 暂停面板UI搭建完成
- [ ] PauseMenuUI脚本已添加
- [ ] 按钮引用已配置

### 功能测试
- [ ] 点击暂停按钮，显示暂停面板
- [ ] 点击继续，隐藏暂停面板，游戏继续
- [ ] 点击重新开始，游戏重新开始
- [ ] 点击返回主菜单，切换到MainMenu场景
- [ ] 控制台有正确的日志输出

---

## 🐛 常见问题

### Q: 点击暂停没反应？
A: 检查GameUI的pauseButton是否正确连接，GameFlowController实例是否存在

### Q: 暂停面板不显示？
A: 检查PausePanel的Active是否为false，GameFlowController的pausePanel引用是否正确

### Q: 点击继续没反应？
A: 检查PauseMenuUI的resumeButton引用是否正确

### Q: 返回主菜单失败？
A: 确保MainMenu场景存在，场景名称正确

---

## 🚀 下一步

完成游戏流程控制后，继续实现：

1. **游戏结束界面** - 胜利/失败显示
2. **词条选择界面** - Roguelike核心
3. **连接现有系统** - 让EnemySystem、GridSystem等使用GameFlowController

---

**现在去Cocos Creator配置吧！预计20分钟完成！**

**完成后告诉我，我们继续下一个功能！**
