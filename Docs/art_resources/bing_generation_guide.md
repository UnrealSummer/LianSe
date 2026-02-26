# Bing Image Creator 生成指南

## 访问地址
https://www.bing.com/images/create

或者：https://copilot.microsoft.com （选择图片生成）

---

## 需要生成的资源

### 1. 冰裂纹覆盖层（优先）

**提示词（英文）：**
```
Ice crack texture overlay for match-3 puzzle game, white cracked ice pattern on transparent background, radial cracks spreading from center like shattered glass, realistic ice fracture lines, sharp white cracks, PNG with alpha transparency, 64x64 pixels, designed to overlay on frozen gems, clear visible cracks, game asset, flat 2D texture
```

**提示词（中文）：**
```
三消益智游戏的冰裂纹纹理覆盖层，透明背景上的白色裂纹图案，从中心向外辐射的裂纹像破碎的玻璃，真实的冰裂纹线条，清晰的白色裂纹，PNG透明背景，64x64像素，设计用于叠加在冰冻宝石上，清晰可见的裂纹，游戏资源，扁平2D纹理
```

**关键词：**
- ice crack texture
- transparent background
- radial cracks
- game asset
- 64x64 pixels
- overlay texture

---

### 2. 彩虹宝石（如果需要重新生成）

**提示词：**
```
Hexagonal gemstone for match-3 game, rainbow gradient from red to purple, flat cartoon style, simple clean design, bright colors, clear outline, glossy surface with single highlight, PNG transparent background, 64x64 pixels, game asset, similar to casual mobile game gems
```

---

### 3. 石头方块（如果需要重新生成）

**提示词：**
```
Stone block obstacle for match-3 game, gray rock texture with cracks, hexagonal shape, flat cartoon style, rough surface, immovable appearance, darker gray color, simple design, clear outline, PNG transparent background, 64x64 pixels, game asset
```

---

## 生成步骤

### 1. 打开Bing Image Creator
访问：https://www.bing.com/images/create

### 2. 登录微软账号
如果没有登录，点击右上角登录（免费）

### 3. 输入提示词
- 复制上面的英文提示词
- 粘贴到输入框
- 点击"创建"按钮

### 4. 等待生成
- 通常需要1-2分钟
- 会生成4张图片

### 5. 选择最佳图片
- 查看4张图片
- 选择裂纹最清晰、最适合的一张
- 点击图片放大

### 6. 下载图片
- 点击"下载"按钮
- 保存到本地

### 7. 处理图片
- 使用Python或在线工具缩放到64x64px
- 确保透明背景
- 保存为PNG格式

---

## 图片处理命令

下载后，用这个命令缩放：

```bash
python -c "from PIL import Image; img = Image.open('下载的图片.jpg'); img = img.resize((64, 64), Image.Resampling.LANCZOS); img.save('ice_cracks_bing.png'); print('Done')"
```

---

## 预期效果

**冰裂纹应该：**
- ✅ 白色裂纹，透明背景
- ✅ 从中心向外辐射
- ✅ 清晰可见
- ✅ 适合叠加在彩色宝石上

**不应该：**
- ❌ 有背景色
- ❌ 太复杂
- ❌ 太模糊
- ❌ 颜色太深

---

## 如果效果不好

### 调整提示词：

**更清晰的裂纹：**
```
add "high contrast, sharp edges, bold white lines"
```

**更简单的图案：**
```
add "minimalist, simple pattern, clean design"
```

**更适合游戏：**
```
add "pixel art style, retro game aesthetic"
```

---

## 对比测试

生成后，对比三个版本：
1. **手工Python绘制** - 已完成
2. **Bing AI生成** - 待测试
3. **代码Graphics绘制** - 已完成

选择效果最好的使用。

---

## Bing的优势

如果Bing效果好，以后可以用它生成：
- ✅ 所有特效资源
- ✅ 消除粒子效果
- ✅ UI元素
- ✅ 背景装饰
- ✅ 角色/道具图标

**成本：** 完全免费
**质量：** 接近专业级（DALL-E 3）
**速度：** 1-2分钟/张

---

*创建时间：2026-02-13 00:38*
*推荐使用Bing Image Creator作为主要美术资源生成工具*
