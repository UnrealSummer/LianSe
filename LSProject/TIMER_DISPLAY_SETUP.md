# 倒计时显示配置指南

## ✅ 代码已完成

- ✅ GameUI.ts 已有 timeLabel 属性和 updateTime() 方法
- ✅ GameCore.ts 会自动查找并调用 GameUI.updateTime()
- ✅ 每帧自动更新时间显示
- ✅ 剩余10秒时文字放大警告

---

## 🎮 在Cocos Creator中配置（3分钟）

### 第一步：创建时间显示Label（1分钟）

1. **在Canvas下创建节点**
   - 命名为 `TimeDisplay`
   - Position: (-250, 600)（左上角）

2. **添加Label组件**
   - String: "时间: 60s"
   - Font Size: 48
   - Color: 白色 #FFFFFF

---

### 第二步：连接到GameUI（2分钟）

1. **找到GameUI节点**
   - 在层级管理器中搜索 "GameUI"
   - 或者在Canvas下查找

2. **选中GameUI节点**

3. **在GameUI (Script)组件中**
   - 找到 **Time Label** 属性
   - 拖入刚才创建的 **TimeDisplay** 节点

4. **保存场景**（Ctrl+S）

---

### 第三步：测试（1分钟）

1. **刷新编译**（Ctrl+Shift+F5）
2. **运行游戏**
3. **应该看到倒计时显示**
4. **时间每秒减少**
5. **剩余10秒时文字放大**

---

## 🎯 完整UI布局建议

```
Canvas
├── GameUI (GameUI.ts)
│   └── [配置 Time Label 引用]
│
└── TimeDisplay (Label)
    ├── Position: (-250, 600)
    ├── String: "时间: 60s"
    ├── Font Size: 48
    └── Color: #FFFFFF
```

---

## 🔧 工作原理

### 自动查找和调用

```typescript
// GameCore.start() 中
const uiNode = this.node.parent.getChildByName('UI');
this.gameUI = uiNode.getComponent('GameUI');

// GameCore.updateUI() 中（每帧调用）
if (this.gameUI && this.gameUI.updateTime) {
    this.gameUI.updateTime(this.timeLeft);
}
```

### GameUI.updateTime()

```typescript
updateTime(timeLeft: number) {
    if (this.timeLabel) {
        this.timeLabel.string = `时间: ${Math.ceil(timeLeft)}s`;
        
        // 时间警告效果（剩余10秒）
        if (timeLeft <= 10) {
            this.timeLabel.node.setScale(1.2, 1.2, 1);
        } else {
            this.timeLabel.node.setScale(1, 1, 1);
        }
    }
}
```

---

## ✅ 检查清单

- [ ] 刷新编译（Ctrl+Shift+F5）
- [ ] 创建TimeDisplay节点
- [ ] 添加Label组件
- [ ] 找到GameUI节点
- [ ] 配置Time Label引用
- [ ] 保存场景
- [ ] 运行测试
- [ ] 倒计时正常显示

---

## 🐛 故障排除

### Q: 时间不显示？
A: 检查GameUI的Time Label引用是否配置

### Q: 时间不更新？
A: 
1. 检查控制台是否有 "[GameCore] Found GameUI component"
2. 确认GameUI节点名称是 "UI" 或者在Canvas下

### Q: 找不到GameUI节点？
A: 
1. 在Canvas下创建节点，命名为 "UI"
2. 添加GameUI.ts脚本
3. 配置Time Label引用

---

## 💡 提示

### 节点命名很重要！

GameCore会查找名为 "UI" 的节点：
```typescript
const uiNode = this.node.parent.getChildByName('UI');
```

所以GameUI节点必须命名为 **"UI"**！

---

**现在去Cocos Creator配置吧！只需要3分钟！**
