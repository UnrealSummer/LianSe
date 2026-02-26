# 配置新美术资源指南

## 概述

需要配置3个新资源：
1. **彩虹方块** (`rainbow.png`) - 万能匹配方块
2. **石头方块** (`stone.png`) - 不可移动障碍
3. **冰冻覆盖层** (`frozen_overlay.png`) - 冰冻状态效果

---

## 步骤1：在Cocos Creator中导入资源

### 1.1 刷新资源目录

1. 打开Cocos Creator
2. 在**资源管理器**中，找到 `assets/textures/special_blocks/`
3. 如果看不到新文件，右键点击 `textures` 文件夹 → **刷新**
4. 确认看到3个新文件：
   - `rainbow.png`
   - `stone.png`
   - `frozen_overlay.png`

### 1.2 检查导入设置

1. 选中 `rainbow.png`
2. 在**属性检查器**中确认：
   - **类型**：sprite-frame
   - **过滤模式**：bilinear（双线性）
   - **包装模式**：clamp（钳位）
3. 对 `stone.png` 和 `frozen_overlay.png` 重复相同操作

---

## 步骤2：修改Block.ts代码

### 2.1 添加SpriteFrame属性

在Block.ts中，找到现有的SpriteFrame属性（约第45行），添加3个新属性：

```typescript
@property(SpriteFrame)
greenSprite: SpriteFrame = null;

// ========== 新增：特殊方块 ==========
@property(SpriteFrame)
rainbowSprite: SpriteFrame = null;

@property(SpriteFrame)
stoneSprite: SpriteFrame = null;

@property(SpriteFrame)
frozenOverlaySprite: SpriteFrame = null;
// ===================================
```

**位置：** 在 `greenSprite` 后面添加

### 2.2 修改updateColor()方法

找到 `updateColor()` 方法（约第90行），在switch语句中添加彩虹方块的处理：

```typescript
updateColor() {
    if (!this.sprite) {
        console.error('[Block] updateColor: sprite is null!');
        return;
    }
    
    // 根据颜色类型选择对应的图片
    let spriteFrame: SpriteFrame = null;
    switch (this.colorType) {
        case ColorType.RED:
            spriteFrame = this.redSprite;
            break;
        case ColorType.YELLOW:
            spriteFrame = this.yellowSprite;
            break;
        case ColorType.BLUE:
            spriteFrame = this.blueSprite;
            break;
        case ColorType.ORANGE:
            spriteFrame = this.orangeSprite;
            break;
        case ColorType.PURPLE:
            spriteFrame = this.purpleSprite;
            break;
        case ColorType.GREEN:
            spriteFrame = this.greenSprite;
            break;
        // ========== 新增 ==========
        case ColorType.RAINBOW:
            spriteFrame = this.rainbowSprite;
            break;
        // ==========================
    }
    
    // 如果有图片，使用图片；否则使用纯色
    if (spriteFrame) {
        this.sprite.spriteFrame = spriteFrame;
        this.sprite.color = Color.WHITE; // 显示原色
        console.log(`[Block] Using sprite for color ${this.colorType}`);
    } else {
        this.sprite.spriteFrame = null;
        this.sprite.color = COLOR_MAP[this.colorType];
        console.log(`[Block] Using solid color for color ${this.colorType}`);
    }
}
```

### 2.3 修改setStone()方法

找到 `setStone()` 方法（约第350行），修改为使用石头图片：

```typescript
/**
 * 设置为石头方块
 */
setStone(): void {
    this.blockType = BlockType.STONE;
    
    console.log(`[Block] Setting stone at [${this.row}, ${this.col}]`);
    
    // ========== 修改：使用石头图片 ==========
    if (this.sprite && this.stoneSprite) {
        this.sprite.spriteFrame = this.stoneSprite;
        this.sprite.color = Color.WHITE;  // 显示原色
        console.log(`[Block] Using stone sprite at [${this.row}, ${this.col}]`);
    } else if (this.sprite) {
        // 降级：如果没有图片，使用灰色
        this.sprite.color = new Color(100, 100, 100, 255);
        console.log(`[Block] Using gray color (no sprite) at [${this.row}, ${this.col}]`);
    }
    // ========================================
}
```

### 2.4 修改createFrozenOverlay()方法

找到 `createFrozenOverlay()` 方法（约第400行），修改为使用冰冻覆盖层图片：

```typescript
/**
 * 创建冰冻覆盖层
 */
private createFrozenOverlay(): void {
    if (this.frozenOverlay) {
        console.log(`[Block] Frozen overlay already exists at [${this.row}, ${this.col}]`);
        return;
    }

    console.log(`[Block] Creating frozen overlay at [${this.row}, ${this.col}]`);
    
    this.frozenOverlay = new Node('FrozenOverlay');
    this.frozenOverlay.setParent(this.node);
    this.frozenOverlay.layer = this.node.layer;
    
    const sprite = this.frozenOverlay.addComponent(Sprite);
    sprite.type = Sprite.Type.SIMPLE;
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    
    // ========== 修改：使用冰冻覆盖层图片 ==========
    if (this.frozenOverlaySprite) {
        sprite.spriteFrame = this.frozenOverlaySprite;
        sprite.color = Color.WHITE;  // 显示原色
        console.log(`[Block] Using frozen overlay sprite at [${this.row}, ${this.col}]`);
    } else {
        // 降级：如果没有图片，使用蓝色半透明
        sprite.color = new Color(0, 150, 255, 220);
        console.log(`[Block] Using blue color (no sprite) at [${this.row}, ${this.col}]`);
    }
    // =============================================
    
    // Add UITransform
    import('cc').then(({ UITransform }) => {
        const transform = this.frozenOverlay.getComponent(UITransform) || this.frozenOverlay.addComponent(UITransform);
        transform.setContentSize(60, 60);
        console.log(`[Block] Frozen overlay size set: 60x60`);
    });
    
    this.frozenOverlay.setPosition(0, 0, 1);  // z=1 to be on top
    this.frozenOverlay.setScale(1.1, 1.1, 1);
    
    console.log(`[Block] Frozen overlay created successfully at [${this.row}, ${this.col}]`);
}
```

---

## 步骤3：在编辑器中绑定资源

### 3.1 找到Block预制体

1. 在**资源管理器**中，找到 `assets/prefabs/Block.prefab`
2. 双击打开预制体编辑器

### 3.2 绑定SpriteFrame

1. 选中Block节点
2. 在**属性检查器**中，找到 **Block (Script)** 组件
3. 向下滚动，找到新添加的3个属性：
   - **Rainbow Sprite**
   - **Stone Sprite**
   - **Frozen Overlay Sprite**

4. 分别拖拽对应的资源到属性框：
   - 从 `assets/textures/special_blocks/rainbow` 拖到 **Rainbow Sprite**
   - 从 `assets/textures/special_blocks/stone` 拖到 **Stone Sprite**
   - 从 `assets/textures/special_blocks/frozen_overlay` 拖到 **Frozen Overlay Sprite**

5. 保存预制体（Ctrl+S）

### 3.3 验证绑定

确认每个属性框中都显示了对应的资源名称：
- ✅ Rainbow Sprite: `rainbow`
- ✅ Stone Sprite: `stone`
- ✅ Frozen Overlay Sprite: `frozen_overlay`

---

## 步骤4：测试资源

### 4.1 测试彩虹方块

1. 运行游戏
2. 在控制台输入（如果有调试功能）：
   ```javascript
   // 将某个方块设置为彩虹
   block.setRainbow();
   ```
3. 检查：
   - ✅ 显示彩虹图片
   - ✅ 可以与任意颜色匹配
   - ✅ 有彩虹动画效果（可选）

### 4.2 测试石头方块

1. 在LevelGenerator中生成石头方块
2. 检查：
   - ✅ 显示石头图片
   - ✅ 不能移动
   - ✅ 不能匹配消除

### 4.3 测试冰冻覆盖层

1. 在LevelGenerator中生成冰冻方块
2. 检查：
   - ✅ 显示冰冻覆盖层图片
   - ✅ 覆盖在方块上方
   - ✅ 旁边消除时解冻

---

## 步骤5：在LevelGenerator中使用

### 5.1 生成彩虹方块

在 `LevelGenerator.ts` 中添加彩虹方块生成逻辑：

```typescript
// 随机生成彩虹方块（5%概率）
if (Math.random() < 0.05) {
    block.setRainbow();
}
```

### 5.2 生成石头方块

```typescript
// 在特定位置生成石头
if (row === 3 && col === 3) {
    block.setStone();
}
```

### 5.3 生成冰冻方块

```typescript
// 在特定位置生成冰冻方块
if (row === 2 && col === 4) {
    block.setFrozen(2);  // 2层冰冻
}
```

---

## 常见问题

### Q1: 图片不显示，只显示纯色？

**原因：** SpriteFrame未正确绑定

**解决：**
1. 检查预制体中的属性是否绑定
2. 确认资源已正确导入
3. 重新保存预制体

### Q2: 冰冻覆盖层位置不对？

**原因：** UITransform尺寸或位置设置不当

**解决：**
1. 调整 `setContentSize(60, 60)` 的尺寸
2. 调整 `setPosition(0, 0, 1)` 的位置
3. 调整 `setScale(1.1, 1.1, 1)` 的缩放

### Q3: 石头方块还能移动？

**原因：** `canMove()` 方法未正确判断

**解决：**
检查 `canMove()` 方法是否返回false：
```typescript
canMove(): boolean {
    if (this.blockType === BlockType.STONE) return false;
    return true;
}
```

---

## 完成检查清单

- [ ] 资源已导入到 `special_blocks/` 目录
- [ ] Block.ts添加了3个SpriteFrame属性
- [ ] updateColor()方法支持彩虹方块
- [ ] setStone()方法使用石头图片
- [ ] createFrozenOverlay()方法使用冰冻图片
- [ ] 预制体中绑定了3个SpriteFrame
- [ ] 测试彩虹方块显示正常
- [ ] 测试石头方块显示正常
- [ ] 测试冰冻覆盖层显示正常
- [ ] LevelGenerator可以生成特殊方块

---

## 下一步

配置完成后，可以：
1. 调整特殊方块的生成概率
2. 添加特殊方块的消除特效
3. 设计包含特殊方块的关卡
4. 优化特殊方块的视觉效果

---

*创建时间：2026-02-13 00:11*
*文档版本：1.0*
