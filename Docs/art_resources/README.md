# 美术资源工作目录

## 目录结构

```
art_resources/
├── downloaded/     # 从网上下载的原始资源
├── generated/      # AI生成的资源
├── selected/       # 筛选后准备使用的资源
└── README.md       # 本文件
```

## 工作流程

1. **下载资源** → `downloaded/`
2. **AI生成资源** → `generated/`
3. **筛选整理** → `selected/`
4. **集成到项目** → `E:\Project\LianSe\LSProject\assets\textures\`

## 命名规范

### 方块资源
- `block_[color].png` - 基础方块（red/yellow/blue/orange/purple/green）
- `block_rainbow.png` - 彩虹方块
- `block_frozen_overlay.png` - 冰冻覆盖层
- `block_stone.png` - 石头方块

### 特效资源
- `effect_frozen_break_[01-03].png` - 冰冻破裂序列帧
- `effect_stone_break_[01-04].png` - 石头破碎序列帧
- `effect_rainbow_explosion_[01-03].png` - 彩虹爆炸序列帧
- `particle_[color]_[01-03].png` - 粒子效果

### 敌人资源
- `enemy_[type].png` - 敌人图片（normal/armored/berserker/regenerator/boss）

## 资源来源

### 免费资源站
- **Kenney.nl** - https://kenney.nl/assets
- **OpenGameArt.org** - https://opengameart.org/
- **itch.io** - https://itch.io/game-assets/free
- **Freepik** - https://www.freepik.com/

### AI生成工具
- **Leonardo.ai** - https://app.leonardo.ai/image-generation
- **Midjourney** - https://www.midjourney.com/
- **DALL-E 3** - https://openai.com/dall-e-3
- **Stable Diffusion** - 本地部署

## AI生成提示词模板

### 基础方块
```
Style: Cute cartoon match-3 game gem, bright [COLOR], glossy finish, rounded square shape, soft shadows, mobile game asset
Format: PNG transparent background, 64x64 pixels, centered
Lighting: Top-left light source, subtle highlight, soft shadow
```

### 彩虹方块
```
Style: Magical rainbow gem for match-3 game, iridescent multicolor gradient, sparkling effect, glossy cartoon style
Format: PNG transparent background, 64x64 pixels
Effect: Subtle glow, prismatic colors (red/orange/yellow/green/blue/purple)
```

### 冰冻覆盖层
```
Style: Frozen ice overlay for match-3 game, translucent blue ice crystals, frost effect, cartoon style
Format: PNG transparent background, 64x64 pixels
Details: Semi-transparent (70% opacity), icy texture, small ice shards
```

### 石头方块
```
Style: Stone block obstacle for match-3 game, gray rock texture, cartoon style, immovable appearance
Format: PNG transparent background, 64x64 pixels
Details: Rough surface, cracks, darker than normal blocks
```

### 特效粒子
```
Style: [EFFECT] particle effect for match-3 game, [COLOR], cartoon style, explosion/burst animation frame
Format: PNG transparent background, 32x32 or 64x64 pixels
Animation: Frame [X] of [Y], motion blur, energy trails
```

## 风格参考

### 色彩方案
- **饱和度：** 高（80-100%）
- **亮度：** 明亮（60-80%）
- **对比度：** 清晰但柔和

### 视觉特征
- **形状：** 圆角矩形或圆形
- **光泽：** 明显高光（左上角）
- **阴影：** 柔和投影（右下角）
- **边缘：** 清晰但不锐利

### 尺寸规范
- **方块：** 64x64px（标准）
- **图标：** 32x32px 或 64x64px
- **粒子：** 32x32px 或 64x64px
- **UI元素：** 根据需求，支持9-slice

## 质量检查清单

- [ ] 尺寸正确（64x64px）
- [ ] 透明背景（PNG格式）
- [ ] 风格统一（卡通、明亮）
- [ ] 颜色准确（符合项目色彩方案）
- [ ] 边缘清晰（无锯齿）
- [ ] 文件大小合理（<50KB）
- [ ] 命名规范（符合约定）

---

*创建时间：2026-02-12 23:03*
