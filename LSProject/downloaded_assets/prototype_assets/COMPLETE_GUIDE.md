# 《炼色》完整美术资源包 - 使用指南

## 📦 资源总览

**总计：44个PNG文件**

位置：`E:\Project\LianSe\LSProject\downloaded_assets\prototype_assets\`

---

## 🎨 资源分类

### 1. 基础宝石方块 (6个) - `blocks/`
- `block_red.png` (512x512) - 红色宝石
- `block_blue.png` (512x512) - 蓝色宝石
- `block_yellow.png` (512x512) - 黄色宝石
- `block_purple.png` (512x512) - 紫色宝石
- `block_orange.png` (512x512) - 橙色宝石
- `block_green.png` (512x512) - 绿色宝石

**用途：** 游戏主要消除方块

---

### 2. 特殊方块 (2个) - `special_blocks/`
- `bomb_block.png` (512x512) - 炸弹方块（黑色+红色警告条纹）
- `rainbow_block.png` (512x512) - 彩虹方块（七彩渐变+闪光）

**用途：**
- 炸弹方块：消除周围3x3区域的方块
- 彩虹方块：可以匹配任意颜色

---

### 3. 基础UI元素 (6个) - `ui/`
- `background.png` (1500x2668) - 游戏背景（深色渐变+星星）
- `board_bg.png` (680x680) - 游戏棋盘背景
- `enemy_area_bg.png` (690x280) - 敌人区域背景
- `gravity_panel_bg.png` (690x220) - 重力控制面板背景
- `hp_bar_bg.png` (600x40) - 血条背景
- `hp_bar_fill.png` (600x40) - 血条填充（红色渐变）

**用途：** 游戏主界面布局

---

### 4. 扩展UI元素 (7个) - `ui_extended/`
- `combo_panel.png` (300x120) - 连击显示面板（橙色渐变）
- `progress_bar_bg.png` (500x50) - 进度条背景
- `progress_bar_fill.png` (500x50) - 进度条填充（蓝绿渐变）
- `pause_button.png` (80x80) - 暂停按钮
- `settings_button.png` (80x80) - 设置按钮（齿轮图标）
- `victory_panel.png` (600x400) - 胜利面板（金色+三颗星）
- `defeat_panel.png` (600x400) - 失败面板（暗红色）

**用途：** 游戏辅助UI和结算界面

---

### 5. 按钮 (4个) - `buttons/`
- `gravity_btn.png` (120x120) - 重力方向按钮（紫色）
- `gravity_btn_active.png` (120x120) - 激活状态（红色+发光）
- `time_display.png` (160x60) - 时间显示按钮（红色渐变）
- `coin_display.png` (160x60) - 金币显示按钮（黄色渐变）

**用途：** 游戏控制和信息显示

---

### 6. 图标 (2个) - `icons/`
- `enemy_placeholder.png` (160x160) - 敌人占位符（紫色渐变）
- `empty_cell.png` (80x80) - 空白方块格子

**用途：** 敌人显示和棋盘格子

---

### 7. 粒子特效 (9个) - `effects/`
- `star_particle_1.png` ~ `star_particle_5.png` (64x64) - 五角星粒子（5种颜色）
- `circle_particle_1.png` ~ `circle_particle_3.png` (48x48) - 圆形粒子（3种大小）
- `lightning.png` (256x256) - 闪电特效

**用途：**
- 星星粒子：方块消除时的爆炸效果
- 圆形粒子：连击特效
- 闪电：特殊攻击特效

---

### 8. 动画帧 (8个) - `animations/`
- `eliminate_frame_1.png` ~ `eliminate_frame_8.png` (512x512) - 消除动画序列帧

**用途：** 方块消除时的动画效果（缩小+旋转+淡出）

---

## 🔧 在Cocos Creator中使用

### 步骤1：导入资源
1. 打开Cocos Creator
2. 在资源管理器中右键点击 `downloaded_assets/prototype_assets/`
3. 选择"刷新"或按F5

### 步骤2：应用基础方块
在Block预制体的Block脚本组件中：
```
redSprite → blocks/block_red.png
blueSprite → blocks/block_blue.png
yellowSprite → blocks/block_yellow.png
purpleSprite → blocks/block_purple.png
orangeSprite → blocks/block_orange.png
greenSprite → blocks/block_green.png
```

### 步骤3：应用特殊方块
创建新的Block类型：
```
bombSprite → special_blocks/bomb_block.png
rainbowSprite → special_blocks/rainbow_block.png
```

### 步骤4：应用UI背景
```
场景背景 → ui/background.png
棋盘背景 → ui/board_bg.png
敌人区域 → ui/enemy_area_bg.png
重力面板 → ui/gravity_panel_bg.png
```

### 步骤5：应用血条
```
血条背景 → ui/hp_bar_bg.png
血条填充 → ui/hp_bar_fill.png (使用Sprite的Filled模式)
```

### 步骤6：应用按钮
重力方向按钮（4个）：
```
Normal Sprite → buttons/gravity_btn.png
Pressed Sprite → buttons/gravity_btn_active.png
Hover Sprite → buttons/gravity_btn_active.png
```

信息显示：
```
时间显示 → buttons/time_display.png
金币显示 → buttons/coin_display.png
```

### 步骤7：应用扩展UI
```
连击面板 → ui_extended/combo_panel.png
进度条背景 → ui_extended/progress_bar_bg.png
进度条填充 → ui_extended/progress_bar_fill.png
暂停按钮 → ui_extended/pause_button.png
设置按钮 → ui_extended/settings_button.png
胜利面板 → ui_extended/victory_panel.png
失败面板 → ui_extended/defeat_panel.png
```

### 步骤8：设置粒子系统
创建粒子系统节点，使用星星粒子：
```javascript
// 在Block消除时
let particle = cc.instantiate(this.starParticlePrefab);
particle.parent = this.node.parent;
particle.position = this.node.position;

// 随机选择5种颜色之一
let randomIndex = Math.floor(Math.random() * 5) + 1;
particle.getComponent(cc.Sprite).spriteFrame = 
    this.starParticles[randomIndex];
```

### 步骤9：播放消除动画
使用动画帧序列：
```javascript
// 创建动画
let animation = this.node.addComponent(cc.Animation);
let clip = cc.AnimationClip.createWithSpriteFrames(
    this.eliminateFrames, // 8个动画帧
    8 // 8帧/秒
);
animation.addClip(clip, 'eliminate');
animation.play('eliminate');

// 动画结束后销毁
animation.on('finished', () => {
    this.node.destroy();
});
```

---

## 🎯 使用建议

### 性能优化
1. **图集打包：** 将同类资源打包成图集
   - `blocks/` → blocks_atlas
   - `effects/` → effects_atlas
   - `ui/` → ui_atlas

2. **压缩设置：**
   - 方块/UI：PNG压缩，保持透明度
   - 背景：JPEG压缩，减小文件大小
   - 粒子：PNG压缩，启用Mipmap

### 动画建议
1. **消除动画：** 8帧，播放速度8fps，总时长1秒
2. **粒子特效：** 使用粒子系统，设置生命周期0.5-1秒
3. **按钮动画：** 使用Tween动画，按下时缩放0.9倍

### 颜色调整
所有资源都支持通过Sprite组件的Color属性调整：
- 调整亮度：修改RGB值
- 调整透明度：修改Alpha值
- 添加色调：叠加颜色

---

## 📐 尺寸参考

### 微信小游戏标准
- **设计分辨率：** 750x1334（竖屏）
- **实际显示：** 375x667（CSS像素）

### 元素显示尺寸
| 资源 | 原始尺寸 | 显示尺寸 | 用途 |
|------|---------|---------|------|
| 宝石方块 | 512x512 | 40x40 | 棋盘方块 |
| 特殊方块 | 512x512 | 40x40 | 特殊方块 |
| 游戏棋盘 | 680x680 | 340x340 | 棋盘背景 |
| 重力按钮 | 120x120 | 60x60 | 控制按钮 |
| 血条 | 600x40 | 300x20 | 敌人血条 |
| 粒子 | 64x64 | 20x20 | 特效粒子 |
| 结算面板 | 600x400 | 300x200 | 胜利/失败 |

---

## 🎨 设计风格

### 色彩方案
- **主色调：** 深色科幻背景（#1a1a2e → #0f3460）
- **宝石颜色：** 6种鲜艳渐变色
- **UI元素：** 半透明深色 + 白色边框
- **特效：** 明亮的粒子和发光效果

### 视觉特点
1. **渐变效果** - 所有元素都有渐变填充
2. **圆角设计** - 统一的圆角风格
3. **半透明** - UI元素半透明，适合叠加
4. **发光效果** - 激活状态有发光边框
5. **高光** - 宝石有顶部高光

---

## 🔄 资源生成脚本

### 基础资源
脚本：`C:\Users\yu.zhang01\clawd\lianse_prototype\generate_assets_clean.py`

生成：18个基础资源（方块、UI、按钮、图标）

### 扩展资源
脚本：`C:\Users\yu.zhang01\clawd\lianse_prototype\generate_extended_assets.py`

生成：26个扩展资源（特效、动画、特殊方块、扩展UI）

### 重新生成
如果需要修改资源：
1. 编辑对应的Python脚本
2. 运行脚本重新生成
3. 复制到项目目录

---

## ✅ 集成检查清单

### 基础功能
- [ ] 导入所有44个资源到Cocos Creator
- [ ] 应用6个基础宝石方块
- [ ] 应用游戏背景和棋盘
- [ ] 应用敌人区域和血条
- [ ] 应用重力控制面板和按钮
- [ ] 应用时间/金币显示

### 扩展功能
- [ ] 添加2个特殊方块（炸弹、彩虹）
- [ ] 设置消除动画（8帧序列）
- [ ] 添加粒子特效系统
- [ ] 添加连击显示面板
- [ ] 添加进度条
- [ ] 添加暂停/设置按钮
- [ ] 添加胜利/失败面板

### 优化
- [ ] 打包图集
- [ ] 设置压缩
- [ ] 测试性能
- [ ] 调整动画速度
- [ ] 优化粒子效果

---

## 📝 后续优化方向

### 可以改进的地方
1. **宝石方块** - 添加更多细节（宝石切面、反光、动态光效）
2. **敌人图片** - 替换占位符为实际敌人美术资源
3. **音效** - 添加消除音效、按钮音效、背景音乐
4. **动画** - 添加更多过渡动画（方块掉落、连击提示）
5. **特效** - 添加更多粒子特效（爆炸、闪光、拖尾）

### 如果需要新资源
1. 参考现有脚本的代码结构
2. 使用PIL库生成新的PNG资源
3. 保持统一的设计风格（渐变、圆角、半透明）
4. 测试在游戏中的显示效果

---

## 🎮 完整资源清单

```
prototype_assets/
├── blocks/                    # 6个基础宝石方块
│   ├── block_red.png
│   ├── block_blue.png
│   ├── block_yellow.png
│   ├── block_purple.png
│   ├── block_orange.png
│   └── block_green.png
├── special_blocks/            # 2个特殊方块
│   ├── bomb_block.png
│   └── rainbow_block.png
├── ui/                        # 6个基础UI元素
│   ├── background.png
│   ├── board_bg.png
│   ├── enemy_area_bg.png
│   ├── gravity_panel_bg.png
│   ├── hp_bar_bg.png
│   └── hp_bar_fill.png
├── ui_extended/               # 7个扩展UI元素
│   ├── combo_panel.png
│   ├── progress_bar_bg.png
│   ├── progress_bar_fill.png
│   ├── pause_button.png
│   ├── settings_button.png
│   ├── victory_panel.png
│   └── defeat_panel.png
├── buttons/                   # 4个按钮
│   ├── gravity_btn.png
│   ├── gravity_btn_active.png
│   ├── time_display.png
│   └── coin_display.png
├── icons/                     # 2个图标
│   ├── enemy_placeholder.png
│   └── empty_cell.png
├── effects/                   # 9个粒子特效
│   ├── star_particle_1.png
│   ├── star_particle_2.png
│   ├── star_particle_3.png
│   ├── star_particle_4.png
│   ├── star_particle_5.png
│   ├── circle_particle_1.png
│   ├── circle_particle_2.png
│   ├── circle_particle_3.png
│   └── lightning.png
└── animations/                # 8个动画帧
    ├── eliminate_frame_1.png
    ├── eliminate_frame_2.png
    ├── eliminate_frame_3.png
    ├── eliminate_frame_4.png
    ├── eliminate_frame_5.png
    ├── eliminate_frame_6.png
    ├── eliminate_frame_7.png
    └── eliminate_frame_8.png
```

---

**所有44个资源已准备就绪，可以直接在Cocos Creator中使用！**

**生成时间：** 2026-02-13  
**版本：** v1.0  
**作者：** Eleven
