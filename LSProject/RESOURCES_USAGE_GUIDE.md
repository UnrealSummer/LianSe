# 游戏资源使用指南

## 📦 已生成的资源

### 方块（6个）
位置：`assets/textures/blocks/`
- `red.png` - 红色渐变方块
- `blue.png` - 蓝色渐变方块
- `green.png` - 绿色渐变方块
- `yellow.png` - 黄色渐变方块
- `purple.png` - 紫色渐变方块
- `orange.png` - 橙色渐变方块

尺寸：128x128px
特点：渐变色、圆角、高光效果

### UI元素
位置：`assets/textures/ui/`
- `background.png` - 游戏背景（浅蓝到浅紫渐变）
- `hp_bar.png` - 血条（红色渐变，带光泽）
- `time_bar.png` - 时间进度条（青色渐变）
- `board_frame.png` - 棋盘边框（金色）

### 按钮
位置：`assets/textures/buttons/`
- `button_primary.png` - 主按钮（蓝色渐变）
- `button_secondary.png` - 次按钮（白色渐变）

---

## 🎮 在Cocos Creator中使用

### 1. 刷新资源
1. 打开Cocos Creator
2. 在资源管理器中右键 → 刷新
3. 查看 `assets/textures/` 文件夹

### 2. 替换方块资源

#### 方法A：直接替换Sprite
1. 选中Block预制体
2. 找到Sprite组件
3. 将对应颜色的方块图片拖到SpriteFrame
4. 保存预制体

#### 方法B：修改Block脚本
在Block.ts中：
```typescript
// 不再用代码生成颜色，直接使用图片
private updateColor(): void {
    const sprite = this.node.getComponent(Sprite);
    if (!sprite) return;
    
    // 加载对应颜色的图片
    const colorNames = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    const colorName = colorNames[this.colorType];
    
    resources.load(`textures/blocks/${colorName}`, SpriteFrame, (err, spriteFrame) => {
        if (!err) {
            sprite.spriteFrame = spriteFrame;
        }
    });
}
```

### 3. 应用背景

#### 设置Canvas背景
1. 选中Canvas节点
2. 添加Sprite组件
3. 拖入 `background.png`
4. 设置为拉伸模式

### 4. 应用血条

#### 在EnemySystem中
1. 选中血条节点
2. 添加Sprite组件
3. 拖入 `hp_bar.png`
4. 设置Type为Filled
5. Fill Type设为Horizontal
6. Fill Range控制血量

### 5. 应用时间条

#### 在GameCore中
1. 选中时间条节点
2. 添加Sprite组件
3. 拖入 `time_bar.png`
4. 设置Type为Filled
5. Fill Type设为Horizontal
6. Fill Range控制时间

### 6. 应用按钮

#### 在UI界面中
1. 选中按钮节点
2. 添加Sprite组件
3. 主按钮用 `button_primary.png`
4. 次按钮用 `button_secondary.png`

---

## 🎨 资源特点

### 方块
- ✅ 渐变色（从亮到暗）
- ✅ 圆角设计（15px）
- ✅ 顶部高光
- ✅ 透明背景

### 血条
- ✅ 红色渐变
- ✅ 光泽效果
- ✅ 圆角
- ✅ 半透明外框

### 时间条
- ✅ 青色渐变
- ✅ 光泽效果
- ✅ 圆角
- ✅ 半透明外框

### 按钮
- ✅ 渐变背景
- ✅ 圆角
- ✅ 顶部高光
- ✅ 3D效果

---

## 🔧 快速应用脚本

如果想快速替换所有方块，可以运行：

```typescript
// 在Cocos Creator控制台运行
const blocks = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
blocks.forEach((color, index) => {
    resources.load(`textures/blocks/${color}`, SpriteFrame, (err, sf) => {
        if (!err) {
            console.log(`Loaded ${color} block`);
            // 这里可以批量替换
        }
    });
});
```

---

## 📊 资源清单

```
assets/textures/
├── blocks/
│   ├── red.png (128x128)
│   ├── blue.png (128x128)
│   ├── green.png (128x128)
│   ├── yellow.png (128x128)
│   ├── purple.png (128x128)
│   └── orange.png (128x128)
├── ui/
│   ├── background.png (1080x1920)
│   ├── hp_bar.png (400x30)
│   ├── time_bar.png (400x25)
│   └── board_frame.png (800x800)
└── buttons/
    ├── button_primary.png (200x60)
    └── button_secondary.png (200x60)
```

---

## 🎯 下一步

1. **刷新Cocos Creator资源**
2. **替换方块图片**
3. **应用UI元素**
4. **测试游戏效果**
5. **调整细节**

---

## 💡 提示

- 所有资源都是PNG格式，带透明背景
- 方块尺寸统一为128x128，可以直接使用
- UI元素可以根据需要缩放
- 按钮可以配合Button组件使用

---

**所有资源已准备就绪！现在可以在Cocos Creator中使用了！**
