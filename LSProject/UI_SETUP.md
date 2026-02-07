# 暂停、设置和主菜单配置说明

## 已完成

1. ✅ 创建了 `PauseUI.ts` 组件（暂停界面）
2. ✅ 创建了 `SettingsUI.ts` 组件（设置界面）
3. ✅ 创建了 `MainMenuUI.ts` 组件（主菜单界面）
4. ✅ 在 `GameCore.ts` 中集成暂停功能
5. ✅ 在 `DataManager.ts` 中添加清空数据方法

---

## 📋 需要在场景中配置

### 1. 暂停界面（PauseUI）

#### 创建节点结构
```
Canvas
└── PauseUI
    └── Panel (Sprite - 半透明黑色背景)
        ├── Title (Label - "游戏暂停")
        ├── ResumeButton (Button - "继续游戏")
        ├── RestartButton (Button - "重新开始")
        ├── SettingsButton (Button - "设置" - 可选)
        └── QuitButton (Button - "退出游戏" - 可选)
```

#### 配置 PauseUI 组件
- **Panel:** 拖入 Panel 节点
- **Resume Button:** 拖入 ResumeButton
- **Restart Button:** 拖入 RestartButton
- **Settings Button:** 拖入 SettingsButton（可选）
- **Quit Button:** 拖入 QuitButton（可选）

#### 配置 GameCore
- **Pause UI:** 拖入 PauseUI 节点

#### 添加暂停按钮
在游戏界面添加一个暂停按钮，点击时调用 `GameCore.pauseGame()`

---

### 2. 设置界面（SettingsUI）

#### 创建节点结构
```
Canvas
└── SettingsUI
    └── Panel (Sprite - 半透明黑色背景)
        ├── Title (Label - "设置")
        ├── SoundToggle (Toggle - "音效")
        ├── MusicToggle (Toggle - "音乐")
        ├── ClearDataButton (Button - "清空数据")
        └── CloseButton (Button - "关闭")
```

#### 配置 SettingsUI 组件
- **Panel:** 拖入 Panel 节点
- **Sound Toggle:** 拖入 SoundToggle
- **Music Toggle:** 拖入 MusicToggle
- **Clear Data Button:** 拖入 ClearDataButton
- **Close Button:** 拖入 CloseButton

#### 功能说明
- **音效开关：** 控制游戏音效（保存到 localStorage）
- **音乐开关：** 控制背景音乐（保存到 localStorage）
- **清空数据：** 清空所有游戏数据（需要确认）

---

### 3. 主菜单界面（MainMenuUI）

#### 创建新场景
1. 在 Cocos Creator 中创建新场景：`MainMenu`
2. 设置为启动场景（项目设置 → 启动场景）

#### 创建节点结构
```
Canvas
└── MainMenuUI
    ├── Background (Sprite - 背景图)
    ├── Title (Label - "炼色" - 大字体)
    ├── History (Node - 历史记录)
    │   ├── BestStageLabel (Label - "最高关卡: 第 X 关")
    │   ├── BestScoreLabel (Label - "最高分数: XXX")
    │   └── TotalGamesLabel (Label - "游戏次数: X")
    ├── Buttons (Node)
    │   ├── StartButton (Button - "开始游戏")
    │   ├── SettingsButton (Button - "设置")
    │   └── QuitButton (Button - "退出游戏" - 可选)
    └── SettingsPanel (SettingsUI - 设置面板 - 默认隐藏)
```

#### 配置 MainMenuUI 组件
- **Title Label:** 拖入 Title
- **Best Stage Label:** 拖入 BestStageLabel
- **Best Score Label:** 拖入 BestScoreLabel
- **Total Games Label:** 拖入 TotalGamesLabel
- **Start Button:** 拖入 StartButton
- **Settings Button:** 拖入 SettingsButton
- **Quit Button:** 拖入 QuitButton（可选）
- **Settings Panel:** 拖入 SettingsPanel（可选）

#### 场景切换
- 点击"开始游戏"会加载 `Game` 场景
- 确保游戏场景名称为 `Game`（或修改代码中的场景名）

---

## 🎮 使用方法

### 暂停游戏
1. 在游戏界面添加暂停按钮
2. 按钮点击事件调用：
```typescript
// 获取 GameCore 组件
const gameCore = this.node.getComponent(GameCore);
gameCore.pauseGame();
```

### 打开设置
1. 在主菜单或暂停界面点击"设置"按钮
2. 显示设置面板

### 清空数据
1. 在设置界面点击"清空数据"
2. 确认后清空所有游戏数据
3. 最高关卡、最高分数、游戏次数都会重置

---

## 🧪 测试清单

### 暂停功能
- [ ] 点击暂停按钮，游戏暂停
- [ ] 暂停时倒计时停止
- [ ] 点击"继续游戏"，游戏继续
- [ ] 点击"重新开始"，游戏重新开始
- [ ] 点击"退出游戏"，返回主菜单（待实现）

### 设置界面
- [ ] 音效开关可以切换
- [ ] 音乐开关可以切换
- [ ] 设置保存到 localStorage
- [ ] 刷新页面后设置保持
- [ ] 点击"清空数据"，数据清空
- [ ] 清空数据后历史记录重置

### 主菜单
- [ ] 显示游戏标题
- [ ] 显示历史最佳（最高关卡、最高分数、游戏次数）
- [ ] 点击"开始游戏"，加载游戏场景
- [ ] 点击"设置"，显示设置面板
- [ ] 点击"退出游戏"，关闭窗口（可选）

---

## 📝 注意事项

1. **场景名称：** 确保游戏场景名称为 `Game`，主菜单场景为 `MainMenu`
2. **启动场景：** 设置主菜单为启动场景
3. **暂停按钮：** 需要手动在游戏界面添加暂停按钮
4. **音效控制：** 需要在 AudioManager 中集成音效开关
5. **返回主菜单：** 需要在 GameCore 的 quitGame() 中实现场景切换

---

## 🎯 下一步

- [ ] 配置暂停界面 UI
- [ ] 配置设置界面 UI
- [ ] 创建主菜单场景
- [ ] 配置主菜单 UI
- [ ] 添加暂停按钮到游戏界面
- [ ] 测试所有功能

---

*创建时间：2026-02-05 22:10*  
*所有代码已完成，等待场景配置*
