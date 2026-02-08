# 方块资源应用指南

## ✅ 已完成

Block.ts已修改为从资源文件夹加载图片，不再使用纯色。

---

## 📋 在Cocos Creator中配置

### 第一步：刷新资源

1. 打开Cocos Creator
2. 在资源管理器中右键 → **刷新**
3. 确认 `assets/textures/blocks/` 文件夹中有6个PNG文件

---

### 第二步：检查资源路径

确保资源结构如下：
```
assets/
  textures/
    blocks/
      red.png
      yellow.png
      blue.png
      orange.png
      purple.png
      green.png
```

---

### 第三步：运行游戏

1. 点击运行按钮
2. 方块应该自动显示图片
3. 如果看不到图片，检查控制台错误信息

---

## 🔧 工作原理

### 代码逻辑

```typescript
updateColor() {
    // 根据颜色类型加载对应的图片
    const colorNames = ['red', 'yellow', 'blue', 'orange', 'purple', 'green'];
    const colorName = colorNames[this.colorType];
    
    // 加载资源
    resources.load(`textures/blocks/${colorName}/spriteFrame`, SpriteFrame, (err, spriteFrame) => {
        if (!err) {
            this.sprite.spriteFrame = spriteFrame;
            this.sprite.color = Color.WHITE; // 显示原色
        } else {
            // 失败时使用纯色备用
            this.sprite.color = COLOR_MAP[this.colorType];
        }
    });
}
```

### 颜色映射

| ColorType | 文件名 | 说明 |
|-----------|--------|------|
| RED (0) | red.png | 红色方块 |
| YELLOW (1) | yellow.png | 黄色方块 |
| BLUE (2) | blue.png | 蓝色方块 |
| ORANGE (3) | orange.png | 橙色方块 |
| PURPLE (4) | purple.png | 紫色方块 |
| GREEN (5) | green.png | 绿色方块 |
| RAINBOW (9) | - | 保持白色 |

---

## 🐛 故障排除

### 问题1：方块显示纯色而不是图片

**可能原因：**
- 资源路径不对
- 图片没有导入
- 图片格式不对

**解决方法：**
1. 检查控制台错误信息
2. 确认资源路径：`assets/textures/blocks/red.png`
3. 在资源管理器中右键图片 → 查看属性
4. 确保Type设为Sprite Frame

---

### 问题2：控制台报错 "Failed to load"

**可能原因：**
- 资源路径写错了
- 图片文件不存在

**解决方法：**
1. 检查路径：`textures/blocks/${colorName}/spriteFrame`
2. 确认文件存在
3. 尝试手动拖拽图片到Sprite组件测试

---

### 问题3：图片显示但颜色不对

**可能原因：**
- Sprite的color属性不是白色

**解决方法：**
- 代码已设置为Color.WHITE，应该正常

---

## 🎯 测试步骤

### 1. 运行游戏
点击Cocos Creator的运行按钮

### 2. 观察方块
- 方块应该显示你生成的图片
- 不同颜色应该有不同的图片

### 3. 测试消除
- 点击或滑动方块
- 消除时应该正常工作

### 4. 检查控制台
- 不应该有"Failed to load"错误
- 如果有错误，按照上面的故障排除

---

## 💡 提示

### 如果想临时禁用图片加载

注释掉updateColor中的资源加载代码：
```typescript
updateColor() {
    if (this.sprite) {
        // 临时使用纯色
        this.sprite.color = COLOR_MAP[this.colorType];
    }
}
```

### 如果想预加载所有方块图片

在GridSystem的start方法中：
```typescript
start() {
    // 预加载所有方块图片
    const colors = ['red', 'yellow', 'blue', 'orange', 'purple', 'green'];
    colors.forEach(color => {
        resources.preload(`textures/blocks/${color}/spriteFrame`, SpriteFrame);
    });
}
```

---

## 🚀 下一步

方块资源已应用！接下来可以：

1. **测试游戏效果** - 看看方块显示是否正常
2. **调整方块大小** - 如果需要的话
3. **应用其他UI资源** - 背景、血条等
4. **优化性能** - 预加载资源

---

**现在刷新Cocos Creator并运行游戏，方块应该显示你生成的图片了！**

**如果有任何问题，查看控制台错误信息并告诉我！**
