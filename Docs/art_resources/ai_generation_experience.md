# AI美术资源生成经验总结

## 核心原则

### 1. 永远不要盲目接受AI生成结果
**错误做法：**
```
AI生成 → 直接下载使用
```

**正确做法：**
```
AI生成 → 查看截图 → 评估质量 → 满意？
                              ↓ 否
                        调整提示词 → 重新生成
                              ↓ 是
                           下载使用
```

### 2. 建立审美判断标准

#### 游戏美术资源评判清单
- [ ] **风格统一** - 与现有资源风格一致？
- [ ] **尺寸适配** - 缩小后是否清晰？
- [ ] **功能适配** - 能否实现预期效果？
- [ ] **技术要求** - 透明背景、文件大小合适？
- [ ] **视觉效果** - 对比度、清晰度、复杂度合适？

#### 具体案例：冰裂纹评估
**第一轮生成（不合格）：**
- ❌ 写实照片风格（项目是卡通风格）
- ❌ 有3D立体感和阴影（需要扁平2D）
- ❌ 背景不够透明（需要纯透明）
- ❌ 太复杂（64x64px下不清晰）

**第二轮生成（改善）：**
- ✅ 更扁平的2D风格
- ✅ 白色线条更清晰
- ✅ 更适合游戏
- ⚠️ 还可以继续优化

### 3. 提示词工程技巧

#### 关键词清单
**风格控制：**
- `flat 2D` / `2D扁平` - 避免3D效果
- `cartoon style` / `卡通风格` - 避免写实
- `minimalist` / `简约` - 避免过于复杂
- `vector-style` / `矢量风格` - 清晰的线条

**排除项：**
- `no shadows` / `无阴影`
- `no 3D effects` / `无3D效果`
- `no gradients` / `无渐变`（如果需要纯色）
- `no realistic` / `非写实`

**技术要求：**
- `transparent background` / `透明背景`
- `PNG with alpha` / `PNG透明通道`
- `64x64 pixels` / `64x64像素`
- `game asset` / `游戏资源`

**参考风格：**
- `similar to [具体游戏/资源]`
- `like mobile game style` / `手游风格`
- `OpenGameArt style` / `OpenGameArt风格`

#### 提示词模板

**游戏UI元素：**
```
[元素描述] for match-3 game, flat 2D cartoon style, 
minimalist design, [颜色] only, no shadows, no 3D effects, 
clean vector-style, PNG transparent background, 64x64 pixels, 
game asset, similar to mobile game style
```

**特效粒子：**
```
[特效描述] particle effect for match-3 game, 
cartoon style, motion blur, glowing effect, 
PNG transparent background, 64x64 pixels, 
game VFX asset, professional quality
```

**方块/宝石：**
```
[形状] gemstone for match-3 game, [颜色] gradient, 
flat cartoon style, simple clean design, bright colors, 
clear outline, glossy surface with single highlight, 
PNG transparent background, 64x64 pixels, game asset
```

---

## 工具选择策略

### Leonardo.ai
**适用场景：**
- 需要专业质量
- 风格要求明确
- 可以接受token消耗

**优化技巧：**
- 使用Lucid Origin模型
- 1024x1024生成后缩放
- 一次生成多个变体

### Bing Image Creator (DALL-E 3)
**适用场景：**
- 需要免费工具
- 可以多次迭代
- 时间充足

**优化技巧：**
- 第一次生成往往不够好
- 必须迭代2-3次
- 对比4张图选最好的
- 提示词要非常具体

### Python手工绘制
**适用场景：**
- 简单几何图案
- 需要完全可控
- 不依赖外部服务

**适合内容：**
- 简单裂纹
- 边框/框线
- 基础形状
- 纯色图案

---

## 迭代优化流程

### 第一轮：快速验证
1. 使用基础提示词生成
2. 查看是否符合大方向
3. 识别主要问题

### 第二轮：风格调整
1. 添加风格关键词（flat 2D, cartoon）
2. 添加排除项（no shadows, no 3D）
3. 重新生成对比

### 第三轮：细节优化
1. 调整复杂度（minimalist / detailed）
2. 调整颜色（pure white / gradient）
3. 调整构图（centered / radial）

### 第四轮：最终打磨
1. 参考具体风格（similar to...）
2. 微调技术参数
3. 生成最终版本

---

## 常见问题与解决

### 问题1：生成结果太写实
**原因：** 提示词缺少风格限定

**解决：** 添加
```
flat 2D cartoon style, no realistic, no photographic
```

### 问题2：有不需要的阴影/3D效果
**原因：** AI默认添加立体感

**解决：** 明确排除
```
no shadows, no 3D effects, flat design
```

### 问题3：背景不透明
**原因：** 没有强调透明背景

**解决：** 强调
```
PNG with alpha transparency, completely transparent background
```

### 问题4：缩小后不清晰
**原因：** 细节太多或线条太细

**解决：** 简化设计
```
minimalist design, bold lines, simple pattern
```

### 问题5：风格不统一
**原因：** 没有参考现有资源

**解决：** 添加参考
```
similar to [现有资源], consistent with [项目风格]
```

---

## 质量检查清单

### 生成后必查项
- [ ] 截图查看整体效果
- [ ] 放大查看细节
- [ ] 想象缩小到64x64px的效果
- [ ] 想象叠加在目标背景上的效果
- [ ] 对比项目现有资源的风格
- [ ] 检查是否有不需要的元素

### 下载前必查项
- [ ] 选择了最好的一张（对比4张）
- [ ] 确认透明背景正确
- [ ] 确认尺寸合适
- [ ] 确认文件格式（PNG）

### 集成前必查项
- [ ] 缩放到目标尺寸测试
- [ ] 在实际背景上测试效果
- [ ] 检查文件大小（<10KB）
- [ ] 备份原始文件

---

## 经验积累

### 成功案例
1. **彩虹方块v2** - 强调hexagonal和flat cartoon后效果好
2. **石头方块** - 使用gray rock texture + cartoon style成功
3. **冰裂纹v2** - 添加no shadows和flat 2D后改善

### 失败案例
1. **冰冻覆盖层** - AI生成实心图案，不适合半透明叠加
2. **冰裂纹v1** - 太写实，有3D效果和阴影
3. **彩虹方块v1** - 圆形写实风格，不符合项目

### 教训总结
1. **第一次生成往往不够好** - 需要迭代
2. **提示词要非常具体** - 不能模糊
3. **必须先评估再使用** - 不能盲目
4. **准备备选方案** - AI不行就用代码/手工

---

## 建议工作流

### 标准流程
```
1. 分析需求
   - 确定风格（卡通/写实）
   - 确定用途（叠加/独立）
   - 确定尺寸（64x64px）

2. 准备提示词
   - 基础描述
   - 风格关键词
   - 排除项
   - 技术要求

3. 第一轮生成
   - 使用Bing/Leonardo
   - 生成4张
   - 截图查看

4. 评估结果
   - 对比评判清单
   - 识别问题
   - 决定是否重新生成

5. 迭代优化
   - 调整提示词
   - 重新生成
   - 再次评估

6. 最终确认
   - 选择最好的
   - 下载原图
   - 缩放测试

7. 集成使用
   - 复制到项目
   - 代码绑定
   - 游戏内测试
```

---

*创建时间：2026-02-13 00:53*
*这是一份活文档，随着经验积累持续更新*
