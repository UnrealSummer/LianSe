# 宝石资源使用说明

## 📦 资源来源

**资源包：** Gem Match 3 Set  
**来源：** OpenGameArt.org  
**许可：** CC0（完全免费，可商用）  
**链接：** https://opengameart.org/content/gem-match-3-set

---

## 📁 文件位置

`assets/textures/gems/`

---

## 🎨 可用资源

### 游戏使用的6种颜色
- `red.png` - 红色宝石
- `orange.png` - 橙色宝石
- `yellow.png` - 黄色宝石
- `green.png` - 绿色宝石
- `blue.png` - 蓝色宝石
- `purple.png` - 紫色宝石

### 其他可选宝石
目录中还包含：
- **Type1-4** - 4种不同形状的宝石
- **6种颜色** - Black, Blue, Green, Purple, Red, Yellow
- **共24个文件** - 可以根据需要选择

---

## 🔧 在Cocos Creator中使用

### 方法1：在编辑器中替换

1. 打开Cocos Creator
2. 找到 `assets/textures/gems/` 目录
3. 选择宝石图片
4. 拖拽到Sprite组件的SpriteFrame属性

### 方法2：在代码中引用

```typescript
// 在GridSystem.ts或相关脚本中
@property(SpriteFrame)
redGem: SpriteFrame = null;

@property(SpriteFrame)
blueGem: SpriteFrame = null;

@property(SpriteFrame)
greenGem: SpriteFrame = null;

@property(SpriteFrame)
yellowGem: SpriteFrame = null;

@property(SpriteFrame)
purpleGem: SpriteFrame = null;

@property(SpriteFrame)
orangeGem: SpriteFrame = null;
```

然后在编辑器中拖拽对应的宝石图片到这些属性上。

---

## 🎯 替换现有方块

### 当前方块位置
`assets/textures/blocks/`

### 替换步骤

1. **备份现有方块**（可选）
   ```
   assets/textures/blocks_old/
   ```

2. **复制新宝石**
   - 从 `gems/` 复制到 `blocks/`
   - 或者直接在代码中改用gems目录

3. **更新引用**
   - 在Cocos Creator中重新关联SpriteFrame
   - 或者保持文件名一致，自动更新

---

## 💡 使用建议

### 选择宝石类型

**Type1（当前使用）：**
- 圆润的宝石形状
- 适合休闲游戏
- 清晰易识别

**Type2：**
- 方形宝石
- 更现代的风格

**Type3：**
- 六边形宝石
- 独特的外观

**Type4：**
- 星形宝石
- 可以作为特殊方块

### 颜色映射

游戏中的颜色 → 宝石文件：
- 红色 → `red.png`
- 橙色 → `orange.png`（使用Type2 Red）
- 黄色 → `yellow.png`
- 绿色 → `green.png`
- 蓝色 → `blue.png`
- 紫色 → `purple.png`

---

## 🎨 自定义修改

### 如果需要调整颜色

资源包中包含矢量格式（SVG），可以：
1. 用Inkscape或Illustrator打开SVG
2. 修改颜色
3. 导出为PNG

### 如果需要不同尺寸

原始资源包包含3种尺寸：
- Small - 小尺寸
- Medium - 中等尺寸（当前使用）
- Large - 大尺寸

可以根据需要切换。

---

## ✅ 下一步

1. **在Cocos Creator中查看**
   - 打开项目
   - 查看 `assets/textures/gems/`
   - 预览宝石效果

2. **替换方块**
   - 更新GridSystem中的SpriteFrame引用
   - 或者直接替换blocks目录中的文件

3. **测试游戏**
   - 运行游戏
   - 查看新宝石效果
   - 确认风格是否满意

---

## 📊 资源优势

✅ **风格统一** - 所有宝石来自同一套资源  
✅ **质量高** - 专业设计，清晰美观  
✅ **多样性** - 4种形状，6种颜色  
✅ **灵活性** - 包含矢量格式，可自由修改  
✅ **免费** - CC0许可，可商用  

---

**现在可以在Cocos Creator中使用这些宝石了！** 🎨
