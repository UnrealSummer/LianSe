# 《炼色》主界面资源 - 使用说明

## ✅ 已生成资源

**位置：** `E:\Project\LianSe\LSProject\art_generation\main_menu_assets\`

**资源清单：**
1. `main_menu_background.jpg` (750x1334, 18.5KB) - 主界面背景
2. `game_logo.png` (512x256, 3.1KB) - 游戏Logo
3. `btn_start.png` (450x100, 3.1KB) - 开始游戏按钮
4. `btn_secondary.png` (350x80, 1.3KB) - 次要按钮（排行榜/设置）
5. `gem_decoration.png` (256x256, 4.8KB) - 装饰宝石

**总大小：** 30.8KB

---

## 🎨 资源特点

### 1. 主界面背景
- **尺寸：** 750x1334（微信小游戏竖屏标准）
- **风格：** 深色太空渐变（#1a1a2e → #16213e → #0f3460）
- **装饰：** 150颗随机分布的白色星星
- **格式：** JPG（不需要透明）

### 2. 游戏Logo
- **尺寸：** 512x256
- **风格：** 彩虹渐变（红→橙→黄→蓝绿→紫）
- **效果：** 圆角矩形 + 发光边框 + 白色描边
- **格式：** PNG（透明背景）

### 3. 开始按钮
- **尺寸：** 450x100
- **风格：** 紫色渐变（#667eea → #764ba2）
- **效果：** 圆角 + 发光效果 + 白色边框
- **格式：** PNG（透明背景）

### 4. 次要按钮
- **尺寸：** 350x80
- **风格：** 蓝绿渐变（#4ECDC4 → #44A08D）
- **效果：** 圆角 + 白色边框
- **格式：** PNG（透明背景）

### 5. 装饰宝石
- **尺寸：** 256x256
- **风格：** 红橙渐变（#FF6B6B → #FF8E53）
- **效果：** 圆角 + 顶部高光 + 发光边框
- **格式：** PNG（透明背景）

---

## 🔧 在Cocos Creator中使用

### 步骤1：导入资源
1. 打开Cocos Creator
2. 在资源管理器中找到 `art_generation/main_menu_assets/`
3. 按F5刷新资源

### 步骤2：创建主菜单场景
1. 创建新场景 `MainMenu.scene`
2. 添加Canvas节点

### 步骤3：应用背景
```
Canvas
└── Background (Sprite)
    - SpriteFrame: main_menu_background.jpg
    - Type: SIMPLE
    - Size: 750x1334
```

### 步骤4：添加Logo
```
Canvas
└── Logo (Sprite)
    - SpriteFrame: game_logo.png
    - Position: (0, 400)
    - Size: 512x256
```

### 步骤5：添加按钮
```
Canvas
├── BtnStart (Button)
│   - Normal: btn_start.png
│   - Size: 450x100
│   - Position: (0, 100)
│
├── BtnLeaderboard (Button)
│   - Normal: btn_secondary.png
│   - Size: 350x80
│   - Position: (0, -50)
│
└── BtnSettings (Button)
    - Normal: btn_secondary.png
    - Size: 350x80
    - Position: (0, -180)
```

### 步骤6：添加装饰
```
Canvas
├── GemDecoration1 (Sprite)
│   - SpriteFrame: gem_decoration.png
│   - Position: (-300, 600)
│   - Size: 128x128
│   - Rotation: 15°
│
└── GemDecoration2 (Sprite)
    - SpriteFrame: gem_decoration.png
    - Position: (300, -500)
    - Size: 96x96
    - Rotation: -20°
```

---

## 🎯 布局建议

### 主菜单布局（竖屏 750x1334）

```
┌─────────────────────┐
│                     │  ← 背景（深色太空渐变）
│    [装饰宝石]        │
│                     │
│    ┌─────────┐      │  ← Logo（彩虹渐变）
│    │ 炼 色   │      │    Y: 400
│    └─────────┘      │
│                     │
│   ┌───────────┐     │  ← 开始游戏（紫色）
│   │ 开始游戏  │     │    Y: 100
│   └───────────┘     │
│                     │
│   ┌─────────┐       │  ← 排行榜（蓝绿）
│   │ 排行榜  │       │    Y: -50
│   └─────────┘       │
│                     │
│   ┌─────────┐       │  ← 设置（蓝绿）
│   │  设置   │       │    Y: -180
│   └─────────┘       │
│                     │
│        [装饰宝石]    │
└─────────────────────┘
```

---

## ✨ 动画建议

### Logo动画
```javascript
// 淡入 + 缩放
cc.tween(logoNode)
    .to(0.8, { scale: 1, opacity: 255 }, { easing: 'backOut' })
    .start();
```

### 按钮动画
```javascript
// 按下效果
cc.tween(buttonNode)
    .to(0.1, { scale: 0.95 })
    .to(0.1, { scale: 1.0 })
    .start();
```

### 装饰宝石动画
```javascript
// 旋转 + 浮动
cc.tween(gemNode)
    .repeatForever(
        cc.tween()
            .to(2, { angle: 360 })
            .to(0, { angle: 0 })
    )
    .start();

cc.tween(gemNode)
    .repeatForever(
        cc.tween()
            .to(1.5, { y: gemNode.y + 20 }, { easing: 'sineInOut' })
            .to(1.5, { y: gemNode.y - 20 }, { easing: 'sineInOut' })
    )
    .start();
```

---

## 🎨 颜色调整

如果需要调整颜色，可以使用Sprite组件的Color属性：

### 按钮变体
```javascript
// 红色按钮（危险操作）
button.color = cc.color(255, 107, 107);

// 黄色按钮（警告）
button.color = cc.color(255, 217, 61);

// 绿色按钮（确认）
button.color = cc.color(78, 205, 196);
```

---

## 📝 添加文字

### 按钮文字
```
Button
└── Label
    - String: "开始游戏"
    - Font Size: 36
    - Color: #FFFFFF
    - Outline: 2px, #000000
```

### Logo文字
如果需要在Logo上添加"炼色"文字：
```
Logo
└── Label
    - String: "炼色"
    - Font Size: 80
    - Color: #FFFFFF
    - Outline: 4px, #000000
    - Bold: true
```

---

## 🔄 重新生成

如果需要修改资源：

1. 编辑 `generate_main_menu_complete.py`
2. 修改颜色、尺寸等参数
3. 运行脚本重新生成：
```bash
cd E:\Project\LianSe\LSProject\art_generation
python generate_main_menu_complete.py
```

---

## 📊 性能优化

### 图集打包
将所有PNG资源打包成图集：
1. 在Cocos Creator中选中 `main_menu_assets` 目录
2. 右键 → 创建 → Auto Atlas
3. 命名为 `main_menu_atlas`

### 压缩设置
- **背景图：** JPEG，质量85%
- **PNG资源：** PNG压缩，保持透明度
- **不需要Mipmap**（2D游戏）

---

## ✅ 检查清单

- [ ] 所有资源已导入到Cocos Creator
- [ ] 背景图显示正常
- [ ] Logo显示正常，透明背景正确
- [ ] 按钮显示正常，透明背景正确
- [ ] 装饰宝石显示正常
- [ ] 布局合理，适配竖屏
- [ ] 添加了按钮文字
- [ ] 添加了按钮点击事件
- [ ] 测试了按钮动画效果

---

## 🎉 完成！

所有主界面资源已准备就绪，可以直接在Cocos Creator中使用。

**生成时间：** 2026-02-20  
**生成方式：** Python自动生成  
**符合规范：** ART_STYLE_GUIDE.md

---

**下一步：**
- 添加按钮点击音效
- 实现场景跳转逻辑
- 添加更多装饰元素
- 优化动画效果
