# 方块图片配置指南

## 🎯 新方案：在编辑器中手动配置

由于Cocos Creator的资源加载路径问题，改为在编辑器中手动配置方块图片。

---

## 📋 配置步骤

### 第一步：找到Block预制体

1. 打开Cocos Creator
2. 在资源管理器中找到Block预制体（通常在 `assets/prefabs/` 或场景中）
3. 双击打开或在层级管理器中选中

---

### 第二步：配置Block Sprites属性

1. 选中Block节点
2. 在属性检查器中找到 **Block (Script)** 组件
3. 找到 **Block Sprites** 属性（数组）
4. 设置数组大小为 **6**

---

### 第三步：拖入图片资源

按照以下顺序拖入图片：

| 索引 | 颜色类型 | 文件名 | 说明 |
|------|---------|--------|------|
| 0 | RED | red.png | 红色方块 |
| 1 | YELLOW | yellow.png | 黄色方块 |
| 2 | BLUE | blue.png | 蓝色方块 |
| 3 | ORANGE | orange.png | 橙色方块 |
| 4 | PURPLE | purple.png | 紫色方块 |
| 5 | GREEN | green.png | 绿色方块 |

**操作方法：**
1. 在资源管理器中找到 `assets/textures/blocks/red.png`
2. 拖到 Block Sprites 数组的第0个位置
3. 重复操作，按顺序拖入其他5个图片

---

### 第四步：保存并测试

1. 保存预制体（Ctrl+S）
2. 运行游戏
3. 方块应该显示图片了！

---

## 🎨 工作原理

### 代码逻辑

```typescript
@property({ type: [SpriteFrame], tooltip: '方块图片资源（按顺序：红、黄、蓝、橙、紫、绿）' })
blockSprites: SpriteFrame[] = [];

updateColor() {
    // 如果有预设的图片，使用图片
    if (this.blockSprites && this.blockSprites[this.colorType]) {
        this.sprite.spriteFrame = this.blockSprites[this.colorType];
        this.sprite.color = Color.WHITE;
    } else {
        // 否则使用纯色
        this.sprite.color = COLOR_MAP[this.colorType];
    }
}
```

### 颜色类型枚举

```typescript
export enum ColorType {
    RED = 0,      // 索引0
    YELLOW = 1,   // 索引1
    BLUE = 2,     // 索引2
    ORANGE = 3,   // 索引3
    PURPLE = 4,   // 索引4
    GREEN = 5,    // 索引5
    RAINBOW = 9   // 特殊，不使用图片
}
```

---

## 🔧 配置示意图

```
Block (Script)
├── Sprite: [Sprite组件引用]
├── Selected Scale: 1.1
└── Block Sprites: (6个元素)
    ├── [0] red.png
    ├── [1] yellow.png
    ├── [2] blue.png
    ├── [3] orange.png
    ├── [4] purple.png
    └── [5] green.png
```

---

## 🐛 故障排除

### 问题1：找不到Block Sprites属性

**原因：** 脚本没有重新编译

**解决：**
1. 保存Block.ts
2. 等待Cocos Creator编译完成
3. 刷新编辑器

---

### 问题2：拖入图片后显示为空

**原因：** 拖入的不是SpriteFrame

**解决：**
1. 确保拖入的是PNG文件本身
2. 不是文件夹
3. Cocos Creator会自动识别为SpriteFrame

---

### 问题3：方块还是显示纯色

**原因：** 图片没有正确配置

**解决：**
1. 检查Block Sprites数组是否有6个元素
2. 检查每个位置是否都有图片
3. 检查顺序是否正确（红黄蓝橙紫绿）

---

### 问题4：只有部分方块显示图片

**原因：** 某些颜色的图片没有配置

**解决：**
1. 检查对应索引的图片是否存在
2. 确保所有6个位置都有图片

---

## 💡 提示

### 如果想临时禁用图片

1. 清空Block Sprites数组
2. 或者设置数组大小为0
3. 游戏会自动回退到纯色显示

### 如果想更换图片

1. 直接拖入新图片替换
2. 保存预制体
3. 重新运行游戏

### 如果有多个Block预制体

需要为每个预制体都配置Block Sprites数组

---

## 🎯 配置检查清单

- [ ] Block.ts已保存并编译
- [ ] 找到Block预制体
- [ ] Block Sprites数组大小设为6
- [ ] 索引0：red.png
- [ ] 索引1：yellow.png
- [ ] 索引2：blue.png
- [ ] 索引3：orange.png
- [ ] 索引4：purple.png
- [ ] 索引5：green.png
- [ ] 保存预制体
- [ ] 运行游戏测试

---

## 🚀 完成后

方块应该显示你生成的图片了！

如果还有问题：
1. 检查控制台是否有错误
2. 确认图片文件存在
3. 确认配置顺序正确

---

**现在去Cocos Creator配置Block Sprites吧！**

**记住顺序：红、黄、蓝、橙、紫、绿（0-5）**
