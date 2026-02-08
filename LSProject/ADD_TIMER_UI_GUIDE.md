# 添加倒计时UI显示

## ✅ 代码已修改

GameCore.ts中的UI Label已经改为可配置的属性：
- ✅ Time Label - 时间显示
- ✅ Gold Label - 金币显示  
- ✅ Stage Label - 关卡显示

---

## 🎨 在Cocos Creator中添加UI（5分钟）

### 第一步：创建时间显示（2分钟）

1. **在Canvas下创建节点**
   - 命名为 `TimeDisplay`
   - Position: (0, 600)（屏幕顶部）

2. **添加Label组件**
   - String: "时间: 60s"
   - Font Size: 48
   - Color: 白色 #FFFFFF
   - Horizontal Align: Center

3. **可选：添加背景**
   - 在TimeDisplay下创建Sprite子节点
   - 使用半透明黑色背景
   - 让文字更清晰

---

### 第二步：连接到GameCore（2分钟）

1. **选中GameCore节点**
   - 通常在Canvas下

2. **在GameCore (Script)组件中**
   - 找到 **Time Label** 属性
   - 拖入刚才创建的 TimeDisplay 节点

3. **保存场景**（Ctrl+S）

---

### 第三步：测试（1分钟）

1. **运行游戏**
2. **应该看到倒计时显示**
3. **时间会每秒减少**
4. **剩余10秒时，文字会变大（警告效果）**

---

## 🎯 完整UI布局建议

### 推荐布局：

```
Canvas
├── TopBar (顶部信息栏)
│   ├── TimeDisplay (Label - 左侧)
│   │   └── "时间: 60s"
│   ├── StageDisplay (Label - 中间)
│   │   └── "关卡 1-1"
│   └── GoldDisplay (Label - 右侧)
│       └── "金币: 0"
│
└── ... (其他游戏元素)
```

### 详细配置：

#### TimeDisplay
- **Position:** (-250, 600)（左上角）
- **Font Size:** 40
- **Color:** #FFFFFF

#### StageDisplay
- **Position:** (0, 600)（顶部中间）
- **Font Size:** 36
- **Color:** #FFD700（金色）

#### GoldDisplay
- **Position:** (250, 600)（右上角）
- **Font Size:** 40
- **Color:** #FFD700（金色）

---

## 🎨 美化建议

### 1. 添加图标
在Label旁边添加小图标：
- 时间：时钟图标
- 金币：coin.png
- 关卡：星星图标

### 2. 添加背景面板
```
TopBar (Node)
├── Background (Sprite - 半透明黑色)
├── TimeDisplay
├── StageDisplay
└── GoldDisplay
```

### 3. 时间警告效果
代码已实现：
- 剩余10秒时文字放大
- 可以添加红色闪烁效果

---

## 🔧 已实现的功能

### updateUI() 方法会自动更新：

#### 时间显示
```typescript
if (this.timeLabel) {
    this.timeLabel.string = `时间: ${Math.ceil(this.timeLeft)}s`;
    
    // 剩余10秒时放大警告
    if (this.timeLeft <= 10) {
        this.timeLabel.node.setScale(1.2, 1.2, 1);
    } else {
        this.timeLabel.node.setScale(1, 1, 1);
    }
}
```

#### 金币显示
```typescript
if (this.goldLabel) {
    this.goldLabel.string = `金币: ${this.coinSystem.getTotalCoins()}`;
}
```

#### 关卡显示
```typescript
if (this.stageLabel) {
    this.stageLabel.string = `关卡 ${currentStage}`;
}
```

---

## ✅ 快速检查清单

- [ ] 创建TimeDisplay节点
- [ ] 添加Label组件
- [ ] 设置字体大小和颜色
- [ ] 选中GameCore节点
- [ ] 配置Time Label引用
- [ ] 保存场景
- [ ] 运行测试
- [ ] 倒计时正常显示

---

## 🐛 故障排除

### Q: 时间不显示？
A: 检查GameCore的Time Label引用是否正确配置

### Q: 时间不更新？
A: 确认游戏正在运行（isGameRunning = true）

### Q: 时间显示为0？
A: 检查timeLimit是否设置（默认60秒）

---

## 💡 提示

### 最简单的方法
1. 创建一个Label节点
2. 拖到GameCore的Time Label属性
3. 运行游戏
4. 完成！

### 如果想要完整UI
参考 `UI_BUILD_GUIDE.md` 搭建完整的游戏界面

---

**现在去Cocos Creator添加TimeDisplay节点吧！**

**只需要5分钟！**
