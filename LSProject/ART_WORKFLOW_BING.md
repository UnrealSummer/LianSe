# 《技能消消消》美术制作核心工作流

## 🎯 Bing AI生成工作流（标准流程）

**最后更新：** 2026-02-20  
**重要性：** ⭐⭐⭐⭐⭐（最核心的工作流程）

---

## 📋 完整步骤

### 1. 打开Bing Image Creator
- **网址：** https://www.bing.com/images/create
- **要求：** 登录Microsoft账号

### 2. 配置生成设置
- **模型选择：** GPT-4o（最新最强模型）
- **纵横比：** 选择"纵"（竖屏，适合手机游戏）
- **质量：** 默认高质量

### 3. 输入提示词
**提示词要求：**
- 使用英文（效果更好）
- 包含风格关键词：`sci-fi cartoon style`, `professional game art`, `high quality`
- 包含色彩要求：参考 ART_STYLE_GUIDE.md 中的色彩系统
- 明确说明不要的元素：`no text`, `no UI elements`, `no characters`

**标准提示词模板：**
```
[元素类型], [形状描述], [颜色渐变], 
[效果描述: glowing/glossy/gradient], 
sci-fi cartoon style, professional game art, high quality,
[背景要求: transparent background / solid color],
no text, no icons, [其他排除项]
```

### 4. 生成图片
- 点击"创建"按钮
- 等待30-60秒
- 会生成4张候选图片
- 选择最满意的一张

### 5. 编辑和元素分离（核心步骤）⭐⭐⭐⭐⭐

**这是最关键的步骤！**

#### 5.1 进入编辑模式
- 点击选中的图片
- 点击"编辑"按钮

#### 5.2 使用"擦除"工具
**用途：** 去除不需要的背景或元素

**操作：**
1. 选择"擦除"工具
2. 调整画笔大小
3. 在不需要的区域涂抹
4. 多次涂抹直到完全去除
5. 可以撤销重做

**技巧：**
- 小画笔处理边缘细节
- 大画笔快速去除大面积区域
- 放大图片处理精细部分

#### 5.3 使用"裁剪"工具
**用途：** 精确裁剪需要的部分

**操作：**
1. 选择"裁剪"工具
2. 拖动裁剪框选择区域
3. 调整裁剪框大小和位置
4. 确认裁剪

**技巧：**
- 留一点边距，避免裁得太紧
- 保持元素完整性
- 注意纵横比

#### 5.4 元素分离策略

**方法A：一图多用（推荐）**
```
生成一张完整的界面原画图（包含背景+按钮+装饰）
↓
编辑1：擦除所有UI元素，保留背景 → 导出背景图
↓
编辑2：裁剪按钮区域 → 擦除背景 → 导出按钮素材
↓
编辑3：裁剪装饰元素 → 擦除背景 → 导出装饰素材
```

**方法B：分别生成**
```
生成背景图（不含UI元素）→ 直接导出
生成按钮图（单独的按钮）→ 编辑去背景 → 导出
生成装饰图（单独的装饰）→ 编辑去背景 → 导出
```

**优势对比：**
- 方法A：风格统一性更好，所有元素来自同一张图
- 方法B：更灵活，每个元素可以单独调整

### 6. 导出保存
- **格式选择：**
  - PNG：需要透明背景的元素（按钮、图标、装饰）
  - JPG：不需要透明的元素（背景图）
- **命名规范：** 参考 ART_STYLE_GUIDE.md 的命名规范
- **保存位置：** `E:\Project\LianSe\LSProject\art_generation\`

---

## 🎨 风格要求

### 核心风格关键词
- **magic theme** - 魔法主题
- **fantasy style** - 奇幻风格
- **magical glow** - 魔法发光
- **mystical atmosphere** - 神秘氛围
- **enchanted** - 魔法的
- **gradient colors** - 渐变色彩
- **rounded corners** - 圆角设计
- **glossy surface** - 光泽表面

### 色彩系统
**背景：**
- 深蓝紫色渐变：#1a1a2e → #16213e → #0f3460
- 星星点缀：白色

**UI元素：**
- 紫色渐变：#667eea → #764ba2（主按钮）
- 蓝绿渐变：#4ECDC4 → #44A08D（次要按钮）
- 红橙渐变：#FF6B6B → #FF8E53（装饰/警告）
- 黄色渐变：#FFD93D → #FFA500（金币/奖励）

### 效果要求
- **渐变：** 所有元素都有渐变效果
- **发光：** 激活状态有发光边缘
- **圆角：** 统一的圆角设计
- **高光：** 顶部有白色高光
- **边框：** 白色半透明边框

---

## 📝 标准提示词库

### 主界面背景
```
Mobile game main menu background, vertical portrait orientation,
dark magical background with deep blue purple gradient,
scattered glowing magical particles and mystical sparkles,
magic theme, fantasy style, mystical atmosphere,
color palette: dark navy blue (#1a1a2e) to deep blue (#0f3460),
professional game art, high quality,
no UI elements, no text, no buttons, no characters,
clean and simple composition, suitable for puzzle match-3 game
```

### 游戏按钮
```
Game UI button, rounded rectangle shape with smooth corners,
[purple/cyan/red] gradient, magical glowing effect with soft light,
white border outline, magic theme, fantasy style,
modern game UI design, glossy surface with subtle highlights,
transparent background, no text, no icons,
professional game UI asset, high quality
```

### 装饰图标
```
Glowing magical [gem/star/coin] icon for game decoration,
rounded [square/circle] shape with smooth corners,
[color] gradient, glossy crystal surface,
white highlight on top, magical glowing edges with soft light effect,
magic theme, fantasy style, vibrant colors,
transparent background, PNG format,
professional game icon, high quality, no text
```

### Logo/标题
```
Game logo design for "技能消消消",
colorful gradient text effect with rainbow colors,
magical glowing neon edges, holographic style,
vibrant colors: red, orange, yellow, cyan, blue, purple gradient,
magic theme, fantasy style, modern game title design,
transparent background, professional game logo, high quality,
no background elements, only the logo text
```

---

## ⚠️ 常见问题和解决方案

### 问题1：生成的图片风格不对
**解决：**
- 检查是否选择了GPT-4o模型
- 强化风格关键词：`sci-fi cartoon style, professional game art`
- 添加参考色彩代码
- 多生成几次，选择最好的

### 问题2：背景去除不干净
**解决：**
- 使用小画笔仔细处理边缘
- 放大图片处理细节
- 多次涂抹擦除
- 或者重新生成，要求`transparent background`

### 问题3：元素太小或太大
**解决：**
- 使用"裁剪"工具调整
- 或者在提示词中明确尺寸要求
- 后期用Python脚本调整尺寸

### 问题4：风格不统一
**解决：**
- 使用"一图多用"方法，从同一张原画图分离元素
- 在所有提示词中使用相同的风格关键词
- 保持色彩描述一致

### 问题5：生成次数用完
**解决：**
- 等待第二天重置
- 使用其他Microsoft账号
- 或使用付费API（DALL-E 3）

---

## 🔄 后期处理流程

### 下载后的处理
1. **检查文件：** 确认格式和透明度正确
2. **调整尺寸：** 使用Python脚本或图像编辑软件
3. **优化压缩：** 使用TinyPNG或ImageOptim
4. **导入项目：** 复制到Cocos Creator资源目录
5. **测试显示：** 在游戏中测试效果

### Python处理脚本
```bash
cd E:\Project\LianSe\LSProject\art_generation
python process_main_menu.py
```

**脚本功能：**
- 自动调整到目标尺寸
- 优化文件大小
- 转换格式（如需要）
- 输出到指定目录

---

## 📊 质量检查清单

### 生成阶段
- [ ] 选择了GPT-4o模型
- [ ] 纵横比设置为"纵"
- [ ] 提示词包含风格关键词
- [ ] 提示词包含色彩要求
- [ ] 生成了4张候选图

### 编辑阶段
- [ ] 背景去除干净（PNG元素）
- [ ] 裁剪位置准确
- [ ] 边缘清晰无锯齿
- [ ] 保留了必要的效果（发光、高光）
- [ ] 元素完整无缺失

### 导出阶段
- [ ] 格式正确（PNG/JPG）
- [ ] 透明度正确（PNG）
- [ ] 文件大小合理
- [ ] 命名规范
- [ ] 保存位置正确

### 最终检查
- [ ] 在Cocos Creator中显示正常
- [ ] 风格与现有资源统一
- [ ] 色彩符合规范
- [ ] 尺寸适配正确
- [ ] 性能表现良好

---

## 🎯 工作流程总结

```
1. 打开Bing → 选择GPT-4o + 纵向
         ↓
2. 输入提示词 → 点击创建
         ↓
3. 等待生成 → 选择最好的一张
         ↓
4. 点击编辑 → 使用擦除/裁剪工具
         ↓
5. 分离元素 → 导出PNG/JPG
         ↓
6. 后期处理 → 调整尺寸/优化
         ↓
7. 导入项目 → 测试效果
```

**核心要点：**
- ⭐ 选择GPT-4o模型
- ⭐ 纵横比选"纵"
- ⭐ 使用编辑工具分离元素
- ⭐ 保持风格统一

---

**这是《炼色》项目最核心的美术制作工作流程！**  
**所有美术资源都应该按照这个流程生成！**

---

*文档版本：v2.0*  
*最后更新：2026-02-20*  
*维护者：Eleven*
