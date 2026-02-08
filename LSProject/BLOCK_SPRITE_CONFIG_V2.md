# 方块图片配置指南（修正版）

## 🎯 使用单独的属性配置

由于Cocos Creator数组属性的限制，改为使用6个独立的SpriteFrame属性。

---

## 📋 配置步骤

### 第一步：刷新Cocos Creator

1. 保存所有文件
2. 等待Cocos Creator自动编译
3. 如果没有自动刷新，手动刷新资源管理器

---

### 第二步：找到Block预制体

1. 在资源管理器中找到Block预制体
2. 或者在场景的层级管理器中选中Block节点
3. 查看属性检查器

---

### 第三步：配置6个Sprite属性

在Block (Script)组件中，你会看到6个独立的属性：

| 属性名 | 拖入的文件 | 说明 |
|--------|-----------|------|
| Red Sprite | red.png | 红色方块 |
| Yellow Sprite | yellow.png | 黄色方块 |
| Blue Sprite | blue.png | 蓝色方块 |
| Orange Sprite | orange.png | 橙色方块 |
| Purple Sprite | purple.png | 紫色方块 |
| Green Sprite | green.png | 绿色方块 |

**操作方法：**
1. 在资源管理器中找到 `assets/textures/blocks/red.png`
2. 拖到 **Red Sprite** 属性框中
3. 重复操作，将其他5个图片拖到对应的属性中

---

### 第四步：保存并测试

1. 保存预制体（Ctrl+S）
2. 如果是在场景中配置的，保存场景
3. 运行游戏
4. 方块应该显示图片了！

---

## 🎨 属性面板示意

```
Block (Script)
├── Sprite: [Sprite组件引用]
├── Selected Scale: 1.1
├── Red Sprite: [拖入 red.png]
├── Yellow Sprite: [拖入 yellow.png]
├── Blue Sprite: [拖入 blue.png]
├── Orange Sprite: [拖入 orange.png]
├── Purple Sprite: [拖入 purple.png]
└── Green Sprite: [拖入 green.png]
```

---

## 🔧 工作原理

### 代码逻辑

```typescript
// 6个独立的属性
@property(SpriteFrame)
redSprite: SpriteFrame = null;

@property(SpriteFrame)
yellowSprite: SpriteFrame = null;

// ... 其他4个

updateColor() {
    // 根据颜色类型选择对应的图片
    let spriteFrame: SpriteFrame = null;
    switch (this.colorType) {
        case ColorType.RED:
            spriteFrame = this.redSprite;
            break;
        case ColorType.YELLOW:
            spriteFrame = this.yellowSprite;
            break;
        // ... 其他颜色
    }
    
    // 如果有图片，使用图片；否则使用纯色
    if (spriteFrame) {
        this.sprite.spriteFrame = spriteFrame;
        this.sprite.color = Color.WHITE;
    } else {
        this.sprite.color = COLOR_MAP[this.colorType];
    }
}
```

---

## 🐛 故障排除

### 问题1：看不到这6个属性

**原因：** 脚本没有编译或刷新

**解决：**
1. 检查控制台是否有编译错误
2. 手动刷新资源管理器
3. 重启Cocos Creator

---

### 问题2：拖入图片后显示为空

**原因：** 拖入的不是正确的资源

**解决：**
1. 确保拖入的是PNG文件
2. 不是文件夹
3. 图片应该在 `assets/textures/blocks/` 下

---

### 问题3：方块还是显示纯色

**原因：** 图片没有正确配置

**解决：**
1. 检查所有6个属性是否都有图片
2. 检查图片是否正确（红色对应Red Sprite等）
3. 保存预制体后重新运行

---

### 问题4：只有部分方块显示图片

**原因：** 某些颜色的图片没有配置

**解决：**
1. 检查对应颜色的属性是否有图片
2. 确保所有6个属性都配置了

---

## 💡 提示

### 快速配置技巧

1. 一次性选中所有6个PNG文件
2. 按住Ctrl依次拖到对应的属性中
3. 注意顺序和对应关系

### 如果想临时禁用图片

1. 清空对应的Sprite属性
2. 游戏会自动回退到纯色显示

### 如果想更换图片

1. 直接拖入新图片替换
2. 保存预制体
3. 重新运行游戏

---

## 🎯 配置检查清单

- [ ] Block.ts已保存并编译
- [ ] 找到Block预制体或场景中的Block节点
- [ ] 看到6个独立的Sprite属性
- [ ] Red Sprite: red.png ✓
- [ ] Yellow Sprite: yellow.png ✓
- [ ] Blue Sprite: blue.png ✓
- [ ] Orange Sprite: orange.png ✓
- [ ] Purple Sprite: purple.png ✓
- [ ] Green Sprite: green.png ✓
- [ ] 保存预制体/场景
- [ ] 运行游戏测试

---

## 📸 配置示例

正确的配置应该是这样的：

```
Block (Script)
├── Sprite: cc.Sprite
├── Selected Scale: 1.1
├── Red Sprite: red (cc.SpriteFrame)
├── Yellow Sprite: yellow (cc.SpriteFrame)
├── Blue Sprite: blue (cc.SpriteFrame)
├── Orange Sprite: orange (cc.SpriteFrame)
├── Purple Sprite: purple (cc.SpriteFrame)
└── Green Sprite: green (cc.SpriteFrame)
```

每个属性后面应该显示图片的名称和类型。

---

## 🚀 完成后

方块应该显示你生成的图片了！

如果还有问题：
1. 检查控制台是否有错误
2. 确认图片文件存在于 `assets/textures/blocks/`
3. 确认每个属性都配置了对应的图片
4. 截图发给我，我帮你看看

---

**现在去Cocos Creator配置这6个属性吧！**

**记住：每个颜色对应一个独立的属性！**
