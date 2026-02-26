# Kenney UI资源使用指南

## ✅ 已完成

- ✅ 下载Kenney UI Pack
- ✅ 解压资源文件
- ✅ 复制15个核心UI资源到 `assets/textures/ui_kenney/`

---

## 📁 资源清单

### 主菜单按钮
- `start_button.png` - 开始游戏按钮（绿色，长方形，渐变深度）
- `settings_button.png` - 设置按钮（蓝色，方形，扁平深度）
- `exit_button.png` - 退出按钮（红色，长方形，边框深度）

### 游戏内按钮
- `skill_button_red.png` - 技能1按钮（红色，圆形，光泽深度）
- `skill_button_blue.png` - 技能2按钮（蓝色，圆形，光泽深度）
- `skill_button_yellow.png` - 技能3按钮（黄色，圆形，光泽深度）
- `pause_button.png` - 暂停按钮（蓝色，圆形，边框深度）

### 进度条
- `bar_red_fill.png` - 红色进度条填充（血条）
- `bar_blue_fill.png` - 蓝色进度条填充（能量条）
- `bar_yellow_fill.png` - 黄色进度条填充（时间条）
- `bar_grey_bg.png` - 灰色进度条背景

### 图标
- `star_empty.png` - 空心星星（未获得）
- `star_filled.png` - 实心星星（已获得）
- `icon_checkmark.png` - 对勾图标（成功）
- `icon_cross.png` - 叉号图标（失败）

---

## 🎨 在Cocos Creator中使用

### 1. 刷新资源

1. 打开Cocos Creator
2. 在资源管理器中找到 `assets/textures/ui_kenney/`
3. 右键点击文件夹 → 刷新

### 2. 替换按钮资源

#### 主菜单场景 (MainMenu.scene)

**开始游戏按钮：**
1. 选择节点：`Canvas → MainMenu → StartButton`
2. 在属性检查器中找到 `Sprite` 组件
3. 将 `SpriteFrame` 拖拽替换为 `start_button`
4. 调整节点大小（建议：200x60）

**设置按钮：**
1. 选择节点：`Canvas → MainMenu → SettingsButton`
2. 替换为 `settings_button`
3. 调整节点大小（建议：80x80）

**退出按钮：**
1. 选择节点：`Canvas → MainMenu → ExitButton`
2. 替换为 `exit_button`
3. 调整节点大小（建议：150x50）

#### 游戏场景 (Main.scene)

**技能按钮：**
1. Skill1 → 替换为 `skill_button_red`（建议大小：80x80）
2. Skill2 → 替换为 `skill_button_blue`（建议大小：80x80）
3. Skill3 → 替换为 `skill_button_yellow`（建议大小：80x80）

**暂停按钮：**
1. 选择 `PauseButton` 节点
2. 替换为 `pause_button`
3. 调整大小（建议：60x60）

### 3. 设置进度条

#### 血条（敌人血量）

**背景层：**
1. 选择 `HPBar → Background` 节点
2. Sprite组件 → SpriteFrame → `bar_grey_bg`
3. Type → Sliced（九宫格切片）
4. 设置大小（建议：300x20）

**填充层：**
1. 选择 `HPBar → Fill` 节点
2. Sprite组件 → SpriteFrame → `bar_red_fill`
3. Type → Sliced
4. 设置大小（建议：300x20）
5. 使用 `fillRange` 控制血量显示

#### 能量条

1. 背景 → `bar_grey_bg`
2. 填充 → `bar_blue_fill`
3. Type → Sliced

#### 时间条

1. 背景 → `bar_grey_bg`
2. 填充 → `bar_yellow_fill`
3. Type → Sliced

### 4. 设置星星评分

**结果面板中的星星：**

1. 选择 `Star1` 节点
2. 默认状态：`star_empty`（空心）
3. 获得后切换为：`star_filled`（实心）

**代码示例：**
```typescript
// 显示星星评分
showStars(count: number) {
    for (let i = 1; i <= 3; i++) {
        const star = this.node.getChildByName(`Star${i}`);
        const sprite = star.getComponent(cc.Sprite);
        
        if (i <= count) {
            // 获得的星星
            cc.resources.load('textures/ui_kenney/star_filled', cc.SpriteFrame, (err, spriteFrame) => {
                sprite.spriteFrame = spriteFrame;
            });
        } else {
            // 未获得的星星
            cc.resources.load('textures/ui_kenney/star_empty', cc.SpriteFrame, (err, spriteFrame) => {
                sprite.spriteFrame = spriteFrame;
            });
        }
    }
}
```

---

## 🎯 九宫格切片设置

对于需要拉伸的UI元素（按钮、进度条），建议设置九宫格切片：

### 长方形按钮
1. 选择资源 `start_button` 或 `exit_button`
2. 在属性检查器中设置：
   - Type: `Sliced`
   - Border: Left=20, Right=20, Top=20, Bottom=20

### 进度条
1. 选择资源 `bar_red_fill` 等
2. 设置：
   - Type: `Sliced`
   - Border: Left=10, Right=10, Top=5, Bottom=5

### 方形/圆形按钮
- 不需要九宫格切片
- 保持 Type: `Simple`
- 直接缩放即可

---

## 💡 使用技巧

### 1. 按钮状态

**Normal（正常）：**
- 使用原始资源
- Color: (255, 255, 255)

**Pressed（按下）：**
- 同一资源
- Color: (200, 200, 200) - 变暗
- Scale: 0.95 - 缩小

**Disabled（禁用）：**
- 同一资源
- Color: (128, 128, 128) - 变灰

### 2. 进度条动画

```typescript
// 平滑更新血条
updateHP(current: number, max: number) {
    const fillBar = this.hpBar.getChildByName('Fill');
    const targetWidth = (current / max) * 300; // 300是血条总宽度
    
    cc.tween(fillBar)
        .to(0.3, { width: targetWidth })
        .start();
}
```

### 3. 星星动画

```typescript
// 获得星星时的动画
showStarAnimation(starNode: cc.Node) {
    const sprite = starNode.getComponent(cc.Sprite);
    
    // 1. 缩放动画
    cc.tween(starNode)
        .to(0.2, { scale: 1.2 })
        .to(0.1, { scale: 1.0 })
        .start();
    
    // 2. 切换为实心星星
    cc.resources.load('textures/ui_kenney/star_filled', cc.SpriteFrame, (err, spriteFrame) => {
        sprite.spriteFrame = spriteFrame;
    });
}
```

---

## 📊 资源尺寸参考

| 资源 | 原始尺寸 | 建议使用尺寸 |
|------|---------|-------------|
| start_button | 190x49 | 200x60 |
| settings_button | 49x49 | 80x80 |
| exit_button | 190x49 | 150x50 |
| skill_button_* | 49x49 | 80x80 |
| pause_button | 49x49 | 60x60 |
| bar_*_fill | 200x40 | 300x20 (拉伸) |
| star_* | 49x49 | 50x50 |
| icon_* | 49x49 | 40x40 |

**注意：** 这些是Double版本（2倍分辨率），可以放心缩小使用，不会失真。

---

## 🎨 颜色含义

- **绿色** - 主要操作（开始、确认、成功）
- **蓝色** - 次要操作（设置、信息、防御）
- **红色** - 危险操作（退出、攻击、血量）
- **黄色** - 特殊/警告（时间、奖励、稀有）

---

## 🔄 下一步

1. ✅ 在Cocos Creator中刷新资源
2. ⬜ 替换主菜单按钮
3. ⬜ 替换游戏内按钮
4. ⬜ 更新进度条
5. ⬜ 设置星星评分
6. ⬜ 测试所有UI交互

---

## 📦 完整资源包位置

- **下载的完整包：** `downloaded_assets/kenney/`
- **项目使用的资源：** `assets/textures/ui_kenney/`
- **完整资源包含：** 430+ UI元素（按钮、面板、滑块、图标等）

如果需要更多UI元素，可以从 `downloaded_assets/kenney/PNG/` 中复制。

---

**UI资源生成完成！现在可以在Cocos Creator中使用这些专业的UI资源了。** ✨
