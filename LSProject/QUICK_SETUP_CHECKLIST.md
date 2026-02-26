# 《炼色》原型图资源配置步骤清单

## 📋 配置前准备

### 1. 确认资源已导入
1. 打开Cocos Creator
2. 在资源管理器中找到 `downloaded_assets/prototype_assets/`
3. 如果看不到，点击刷新按钮
4. 确认看到以下目录：
   - `blocks/` (6个PNG)
   - `ui/` (6个PNG)
   - `buttons/` (4个PNG)
   - `icons/` (2个PNG)

---

## 🎨 步骤1：配置宝石方块（最重要）

### 找到Block预制体
1. 在资源管理器中搜索 "Block"
2. 找到Block预制体文件
3. 双击打开

### 配置6个Sprite属性
在Block (Script)组件中，找到以下6个Sprite属性，依次配置：

| 属性名 | 拖入的资源 |
|--------|-----------|
| redSprite | `prototype_assets/blocks/block_red.png` |
| blueSprite | `prototype_assets/blocks/block_blue.png` |
| yellowSprite | `prototype_assets/blocks/block_yellow.png` |
| purpleSprite | `prototype_assets/blocks/block_purple.png` |
| orangeSprite | `prototype_assets/blocks/block_orange.png` |
| greenSprite | `prototype_assets/blocks/block_green.png` |

**操作方法：**
- 从资源管理器拖拽PNG文件到对应的Sprite属性框
- 或者点击属性框右边的圆点，在弹出窗口中选择

### 保存
- Ctrl+S 保存预制体
- 关闭预制体编辑窗口

---

## 🎮 步骤2：配置游戏场景UI（可选）

### 2.1 配置游戏背景
1. 在场景层级中找到背景节点（可能叫 "Background" 或 "BG"）
2. 选中节点
3. 在属性检查器中找到 Sprite 组件
4. 将 `prototype_assets/ui/background.png` 拖入 SpriteFrame 属性

---

### 2.2 配置游戏棋盘背景
1. 找到棋盘背景节点（可能叫 "BoardBG" 或 "GridBG"）
2. 选中节点
3. 将 `prototype_assets/ui/board_bg.png` 拖入 SpriteFrame 属性

---

### 2.3 配置敌人血条

#### 血条背景
1. 找到血条背景节点（可能叫 "HPBarBG" 或 "EnemyHPBG"）
2. 选中节点
3. 将 `prototype_assets/ui/hp_bar_bg.png` 拖入 SpriteFrame 属性

#### 血条填充
1. 找到血条填充节点（可能叫 "HPBarFill" 或 "EnemyHPFill"）
2. 选中节点
3. 将 `prototype_assets/ui/hp_bar_fill.png` 拖入 SpriteFrame 属性
4. **重要：** 在 Sprite 组件中：
   - Type 改为 `FILLED`
   - Fill Type 改为 `HORIZONTAL`
   - Fill Start 设为 `0`
   - Fill Range 设为 `1`（或根据当前血量百分比）

---

### 2.4 配置敌人区域背景
1. 找到敌人区域背景节点（可能叫 "EnemyAreaBG"）
2. 选中节点
3. 将 `prototype_assets/ui/enemy_area_bg.png` 拖入 SpriteFrame 属性

---

### 2.5 配置敌人占位符
1. 找到敌人精灵节点（可能叫 "EnemySprite" 或 "Enemy"）
2. 选中节点
3. 将 `prototype_assets/icons/enemy_placeholder.png` 拖入 SpriteFrame 属性

---

### 2.6 配置重力控制面板

#### 面板背景
1. 找到重力面板背景节点（可能叫 "GravityPanelBG"）
2. 选中节点
3. 将 `prototype_assets/ui/gravity_panel_bg.png` 拖入 SpriteFrame 属性

#### 重力方向按钮（4个）
找到4个重力方向按钮（上、下、左、右），对每个按钮：

1. 选中按钮节点
2. 在属性检查器中找到 Button 组件
3. 确认 Transition 设为 `SPRITE`
4. 配置3个状态：
   - **Normal Sprite:** `prototype_assets/buttons/gravity_btn.png`
   - **Pressed Sprite:** `prototype_assets/buttons/gravity_btn_active.png`
   - **Hover Sprite:** `prototype_assets/buttons/gravity_btn_active.png`

---

### 2.7 配置时间/金币显示

#### 时间显示
1. 找到时间显示节点（可能叫 "TimeDisplay" 或 "Timer"）
2. 选中节点
3. 将 `prototype_assets/buttons/time_display.png` 拖入 SpriteFrame 属性

#### 金币显示
1. 找到金币显示节点（可能叫 "CoinDisplay" 或 "Gold"）
2. 选中节点
3. 将 `prototype_assets/buttons/coin_display.png` 拖入 SpriteFrame 属性

---

## ✅ 步骤3：测试

### 运行游戏
1. 点击运行按钮（或按 Ctrl+P）
2. 检查以下内容：
   - ✅ 宝石方块显示正常（6种颜色）
   - ✅ 背景显示正常
   - ✅ 棋盘背景显示正常
   - ✅ 敌人血条显示正常
   - ✅ 按钮显示正常

### 如果有问题
- 检查资源是否正确拖入
- 检查Sprite组件的Type设置
- 检查节点的尺寸和位置

---

## 🎯 最小配置（只配置核心）

如果你只想快速看到效果，**只需要配置宝石方块**：

1. 打开Block预制体
2. 配置6个Sprite属性（拖入6个block_xxx.png）
3. 保存
4. 运行游戏

其他UI元素可以后续慢慢配置。

---

## 📝 配置检查清单

### 必须配置（核心）
- [ ] Block预制体的6个Sprite属性

### 可选配置（美化）
- [ ] 游戏背景
- [ ] 棋盘背景
- [ ] 敌人血条（背景+填充）
- [ ] 敌人区域背景
- [ ] 敌人占位符
- [ ] 重力面板背景
- [ ] 重力方向按钮（4个）
- [ ] 时间显示
- [ ] 金币显示

---

## ⚠️ 注意事项

1. **不要修改场景文件的代码**
   - 只在编辑器中拖拽资源
   - 不要手动编辑.scene文件

2. **保存工作**
   - 每配置完一个节点，按 Ctrl+S 保存
   - 配置完成后，保存场景

3. **测试频繁**
   - 配置几个节点后就运行测试
   - 及时发现问题

4. **备份场景**
   - 配置前先备份场景文件
   - 如果出问题可以恢复

---

## 🆘 如果遇到问题

### 资源看不到
- 点击资源管理器的刷新按钮
- 检查文件路径是否正确

### 拖拽无效
- 确认选中了正确的节点
- 确认拖拽到了正确的属性框

### 显示不正常
- 检查节点的尺寸
- 检查Sprite组件的Type设置
- 检查资源的尺寸是否合适

### 编译错误
- 不要修改代码，只拖拽资源
- 如果出现错误，撤销操作（Ctrl+Z）

---

**按照这个清单一步步操作，应该不会出现编译错误。有问题随时告诉我！**
