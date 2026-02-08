# 方块不显示问题排查

## 🔍 可能的原因

### 1. Sprite组件未正确引用
Block节点上必须有Sprite组件，并且在Block脚本中正确引用。

### 2. 图片配置问题
6个Sprite属性可能没有正确配置。

### 3. 预制体未保存
配置后没有保存预制体。

---

## 🛠️ 排查步骤

### 步骤1：检查控制台日志

运行游戏后，查看控制台：

**如果看到：**
- `[Block] Using sprite for color X` - 说明图片加载成功
- `[Block] Using solid color for color X` - 说明图片未配置，使用纯色
- `[Block] updateColor: sprite is null!` - 说明Sprite组件未引用

---

### 步骤2：检查Block预制体结构

1. 找到Block预制体
2. 确认节点结构：
```
Block (Node)
├── Sprite (Component) ← 必须有这个
└── Block (Script)
    ├── Sprite: [引用上面的Sprite组件]
    ├── Red Sprite: [red.png]
    ├── Yellow Sprite: [yellow.png]
    └── ... 其他4个
```

---

### 步骤3：检查Sprite组件引用

1. 选中Block节点
2. 查看Block (Script)组件
3. 找到 **Sprite** 属性（第一个）
4. 确认它引用了同节点上的Sprite组件
5. 如果是空的，拖入Sprite组件

---

### 步骤4：检查6个图片属性

确认每个属性都有对应的图片：
- Red Sprite: red (cc.SpriteFrame)
- Yellow Sprite: yellow (cc.SpriteFrame)
- Blue Sprite: blue (cc.SpriteFrame)
- Orange Sprite: orange (cc.SpriteFrame)
- Purple Sprite: purple (cc.SpriteFrame)
- Green Sprite: green (cc.SpriteFrame)

---

### 步骤5：保存并重新运行

1. 保存预制体（Ctrl+S）
2. 关闭预制体编辑器
3. 重新运行游戏
4. 查看控制台日志

---

## 🐛 常见问题

### 问题1：控制台显示 "sprite is null"

**原因：** Block脚本的Sprite属性没有引用Sprite组件

**解决：**
1. 选中Block节点
2. 在Block (Script)组件中
3. 将Sprite组件拖到Sprite属性框中

---

### 问题2：控制台显示 "Using solid color"

**原因：** 对应颜色的Sprite属性没有配置

**解决：**
1. 检查是哪个颜色（日志中的数字）
   - 0 = RED
   - 1 = YELLOW
   - 2 = BLUE
   - 3 = ORANGE
   - 4 = PURPLE
   - 5 = GREEN
2. 配置对应的Sprite属性

---

### 问题3：配置了但还是不显示

**原因：** 可能是预制体实例没有更新

**解决：**
1. 删除场景中的所有Block
2. 重新运行游戏（让GridSystem重新生成）
3. 或者在层级管理器中右键Block → Revert to Prefab

---

### 问题4：格子生成不出来

**原因：** 可能是GridSystem出错了

**解决：**
1. 查看控制台是否有错误
2. 检查GridSystem的Block Prefab属性是否正确
3. 尝试注释掉updateColor中的图片加载代码，看是否能生成

---

## 🔧 临时解决方案

如果图片一直有问题，可以先禁用图片加载：

在Block.ts的updateColor方法中：
```typescript
updateColor() {
    if (!this.sprite) return;
    
    // 临时禁用图片，只用纯色
    this.sprite.spriteFrame = null;
    this.sprite.color = COLOR_MAP[this.colorType];
}
```

这样至少能让游戏正常运行，之后再慢慢调试图片问题。

---

## 📊 调试清单

- [ ] 运行游戏
- [ ] 查看控制台日志
- [ ] 记录日志内容（sprite is null? solid color? using sprite?）
- [ ] 检查Block预制体结构
- [ ] 检查Sprite组件引用
- [ ] 检查6个图片属性
- [ ] 保存预制体
- [ ] 重新运行测试

---

**请运行游戏并告诉我控制台显示什么日志！**

**特别是 `[Block]` 开头的日志！**
