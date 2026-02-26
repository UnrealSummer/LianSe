# AI生成任务清单 - 《炼色》特殊方块

## 风格参考
- **基准：** 项目现有gems资源（OpenGameArt Gem Match 3 Set）
- **特征：** 圆润宝石形状、明亮饱和色彩、清晰高光、卡通风格
- **尺寸：** 64x64px，透明背景PNG

---

## 任务1：彩虹方块 (Rainbow Gem)

### 提示词（英文）
```
A magical rainbow gemstone for match-3 puzzle game, iridescent multicolor gradient with red orange yellow green blue purple colors, glossy cartoon style with bright highlights, rounded gem shape similar to existing game gems, sparkling prismatic effect, soft glow around edges, PNG transparent background, 64x64 pixels, centered, top-left lighting, professional game asset quality, consistent with casual mobile game style
```

### 提示词（中文翻译）
```
三消益智游戏的魔法彩虹宝石，红橙黄绿蓝紫的彩虹渐变色，卡通风格带明亮高光，圆润的宝石形状（与现有游戏宝石风格一致），闪烁的棱镜效果，边缘柔和光晕，PNG透明背景，64x64像素，居中，左上光源，专业游戏资产质量，符合休闲手游风格
```

### 负面提示词
```
realistic, photorealistic, 3D render, blurry, low quality, pixelated, dark, dull colors, complex details, text, watermark
```

### 生成数量
3-5个变体，选择最佳

---

## 任务2：冰冻覆盖层 (Frozen Overlay)

### 提示词（英文）
```
Frozen ice overlay effect for match-3 game gem, translucent blue ice crystals covering a gem, frost texture with small ice shards, semi-transparent (70% opacity), cartoon style, soft edges, sparkle effect, PNG transparent background, 64x64 pixels, centered, designed to overlay on top of existing gems, light blue color (#88CCFF), professional game asset
```

### 提示词（中文翻译）
```
三消游戏宝石的冰冻覆盖效果，半透明蓝色冰晶覆盖宝石，霜冻纹理带小冰碎片，半透明（70%不透明度），卡通风格，柔和边缘，闪光效果，PNG透明背景，64x64像素，居中，设计用于叠加在现有宝石上，浅蓝色(#88CCFF)，专业游戏资产
```

### 负面提示词
```
opaque, solid, dark blue, realistic ice, complex texture, 3D render, blurry
```

### 生成数量
3-5个变体

---

## 任务3：石头方块 (Stone Block)

### 提示词（英文）
```
Stone block obstacle for match-3 puzzle game, gray rock texture with cracks, cartoon style, rough surface, immovable appearance, darker and heavier looking than normal gems, rounded square shape, subtle shadows, PNG transparent background, 64x64 pixels, centered, consistent with casual mobile game gem style, professional quality
```

### 提示词（中文翻译）
```
三消益智游戏的石头障碍方块，灰色岩石纹理带裂纹，卡通风格，粗糙表面，不可移动的外观，比普通宝石更暗更重，圆角方形，细微阴影，PNG透明背景，64x64像素，居中，符合休闲手游宝石风格，专业质量
```

### 负面提示词
```
shiny, glossy, colorful, realistic, 3D render, too detailed, blurry
```

### 生成数量
3-5个变体

---

## 任务4：冰冻破裂特效 (Frozen Break Effect)

### 提示词（英文）
```
Ice shattering particle effect for match-3 game, blue ice crystal shards exploding outward, cartoon style, motion blur, sparkle particles, light blue color (#88CCFF), PNG transparent background, 64x64 pixels, animation frame for ice breaking effect, professional game VFX asset
```

### 提示词（中文翻译）
```
三消游戏的冰块破碎粒子特效，蓝色冰晶碎片向外爆炸，卡通风格，动态模糊，闪光粒子，浅蓝色(#88CCFF)，PNG透明背景，64x64像素，冰块破碎效果的动画帧，专业游戏VFX资产
```

### 生成数量
3帧序列

---

## 任务5：石头破碎特效 (Stone Break Effect)

### 提示词（英文）
```
Stone breaking particle effect for match-3 game, gray rock debris exploding outward, cartoon style, motion blur, dust particles, gray color (#666666), PNG transparent background, 64x64 pixels, animation frame for stone breaking effect, professional game VFX asset
```

### 提示词（中文翻译）
```
三消游戏的石头破碎粒子特效，灰色石块碎片向外爆炸，卡通风格，动态模糊，尘埃粒子，灰色(#666666)，PNG透明背景，64x64像素，石头破碎效果的动画帧，专业游戏VFX资产
```

### 生成数量
3-4帧序列

---

## 任务6：彩虹爆炸特效 (Rainbow Explosion Effect)

### 提示词（英文）
```
Rainbow explosion particle effect for match-3 game, multicolor sparkles and light rays bursting outward, rainbow gradient colors (red orange yellow green blue purple), cartoon style, motion blur, magical glow, PNG transparent background, 64x64 pixels, animation frame for rainbow gem activation, professional game VFX asset
```

### 提示词（中文翻译）
```
三消游戏的彩虹爆炸粒子特效，多彩闪光和光线向外爆发，彩虹渐变色（红橙黄绿蓝紫），卡通风格，动态模糊，魔法光晕，PNG透明背景，64x64像素，彩虹宝石激活的动画帧，专业游戏VFX资产
```

### 生成数量
3帧序列

---

## 生成平台
- **Leonardo.ai** - https://app.leonardo.ai/image-generation
- 模型推荐：Leonardo Diffusion XL 或 DreamShaper
- 尺寸：1024x1024（生成后裁剪到64x64）
- 步数：30-50
- CFG Scale：7-9

---

## 生成后处理
1. 下载所有变体
2. 使用Photoshop/GIMP裁剪到64x64px
3. 确保透明背景干净
4. 优化文件大小（TinyPNG）
5. 保存到 `art_resources/generated/leonardo/`

---

*创建时间：2026-02-12 23:06*
*执行人：Eleven*
