# UI资源手动替换清单

## 📋 需要替换的资源（9个）

按照场景中的节点，逐个替换Sprite Frame。

---

## 🎯 按钮类（5个）

### 1. 主要按钮 (Primary Button)

**节点名称：** 找到使用 `button_primary` 的Button节点

**替换步骤：**
1. 选择Button节点
2. 在属性检查器中找到 `Sprite` 组件
3. 点击 `Sprite Frame` 右边的选择器
4. 导航到：`assets/textures/ui/kenney/Green/Default/`
5. 选择：`button_square_gradient.png`

**备选方案：**
- `button_rectangle_gradient.png` （长方形）
- `button_square_gloss.png` （光泽效果）

---

### 2. 次要按钮 (Secondary Button)

**节点名称：** 找到使用 `button_secondary` 的Button节点

**替换步骤：**
1. 选择Button节点
2. 在属性检查器中找到 `Sprite` 组件
3. 点击 `Sprite Frame` 右边的选择器
4. 导航到：`assets/textures/ui/kenney/Blue/Default/`
5. 选择：`button_square_flat.png`

**备选方案：**
- `button_rectangle_flat.png` （长方形）
- `button_square_gradient.png` （渐变效果）

---

### 3. 危险按钮 (Danger Button)

**节点名称：** 找到使用 `button_danger` 的Button节点

**替换步骤：**
1. 选择Button节点
2. 在属性检查器中找到 `Sprite` 组件
3. 点击 `Sprite Frame` 右边的选择器
4. 导航到：`assets/textures/ui/kenney/Red/Default/`
5. 选择：`button_square_gradient.png`

**备选方案：**
- `button_rectangle_gradient.png` （长方形）
- `button_square_gloss.png` （光泽效果）

---

### 4. 成功按钮 (Success Button)

**节点名称：** 找到使用 `button_success` 的Button节点

**替换步骤：**
1. 选择Button节点
2. 在属性检查器中找到 `Sprite` 组件
3. 点击 `Sprite Frame` 右边的选择器
4. 导航到：`assets/textures/ui/kenney/Green/Default/`
5. 选择：`button_square_gloss.png`

**备选方案：**
- `button_round_gradient.png` （圆形）
- `button_square_gradient.png` （渐变效果）

---

### 5. 小按钮 (Small Button)

**节点名称：** 找到使用 `button_small` 的Button节点

**替换步骤：**
1. 选择Button节点
2. 在属性检查器中找到 `Sprite` 组件
3. 点击 `Sprite Frame` 右边的选择器
4. 导航到：`assets/textures/ui/kenney/Blue/Default/`
5. 选择：`button_round_flat.png`

**备选方案：**
- `icon_circle.png` （圆形图标）
- `button_round_gradient.png` （渐变效果）

---

## 📊 进度条类（3个）

### 6. 血条 (HP Bar)

**节点名称：** 找到使用 `hp_bar` 的Sprite节点

**替换步骤：**
1. 选择Sprite节点
2. 在属性检查器中找到 `Sprite` 组件
3. 点击 `Sprite Frame` 右边的选择器
4. 导航到：`assets/textures/ui/kenney/Red/Default/`
5. 选择：`slide_horizontal_color.png`

**备选方案：**
- `slide_horizontal_color_section.png` （分段）
- `slide_horizontal_color_section_wide.png` （宽分段）

---

### 7. 能量条 (Energy Bar)

**节点名称：** 找到使用 `energy_bar` 的Sprite节点

**替换步骤：**
1. 选择Sprite节点
2. 在属性检查器中找到 `Sprite` 组件
3. 点击 `Sprite Frame` 右边的选择器
4. 导航到：`assets/textures/ui/kenney/Blue/Default/`
5. 选择：`slide_horizontal_color.png`

**备选方案：**
- `slide_horizontal_color_section.png` （分段）
- `slide_horizontal_color_section_wide.png` （宽分段）

---

### 8. 时间条 (Time Bar)

**节点名称：** 找到使用 `time_bar` 的Sprite节点

**替换步骤：**
1. 选择Sprite节点
2. 在属性检查器中找到 `Sprite` 组件
3. 点击 `Sprite Frame` 右边的选择器
4. 导航到：`assets/textures/ui/kenney/Yellow/Default/`
5. 选择：`slide_horizontal_color.png`

**备选方案：**
- `slide_horizontal_color_section.png` （分段）
- `slide_horizontal_color_section_wide.png` （宽分段）

---

## ⭐ 图标类（1个）

### 9. 星星图标 (Star Icon)

**节点名称：** 找到使用 `star` 的Sprite节点

**替换步骤：**
1. 选择Sprite节点
2. 在属性检查器中找到 `Sprite` 组件
3. 点击 `Sprite Frame` 右边的选择器
4. 导航到：`assets/textures/ui/kenney/Yellow/Default/`
5. 选择：`star.png`

**备选方案：**
- `star_outline.png` （空心星星）
- `star_outline_depth.png` （带深度的空心星星）

---

## 🔍 如何快速找到需要替换的节点

### 方法1：通过层级管理器搜索

1. 打开层级管理器（Hierarchy）
2. 在搜索框中输入关键词：
   - `button` - 找到所有按钮
   - `bar` - 找到所有进度条
   - `star` - 找到星星图标

### 方法2：通过Assets面板搜索引用

1. 打开Assets面板
2. 找到旧资源：`assets/textures/buttons/button_primary.png`
3. 右键点击 → `Show in Hierarchy`
4. 会显示所有使用这个资源的节点

### 方法3：全局搜索

1. 按 `Ctrl+Shift+F` 打开全局搜索
2. 搜索资源UUID（从.meta文件中获取）
3. 找到所有引用的场景文件

---

## 📝 替换检查清单

完成后检查：

- [ ] 所有按钮都能正常显示
- [ ] 按钮点击效果正常
- [ ] 进度条显示正常
- [ ] 星星图标显示正常
- [ ] 保存所有场景
- [ ] 运行游戏测试

---

## 🎨 Kenney UI Pack 资源位置

**完整路径：**
```
assets/textures/ui/kenney/
├── Blue/Default/     - 蓝色按钮和UI元素
├── Green/Default/    - 绿色按钮和UI元素
├── Red/Default/      - 红色按钮和UI元素
└── Yellow/Default/   - 黄色按钮和UI元素
```

**常用按钮：**
- `button_square_flat.png` - 方形扁平按钮
- `button_square_gradient.png` - 方形渐变按钮
- `button_square_gloss.png` - 方形光泽按钮
- `button_round_flat.png` - 圆形扁平按钮
- `button_round_gradient.png` - 圆形渐变按钮

**常用进度条：**
- `slide_horizontal_color.png` - 水平彩色滑块
- `slide_horizontal_color_section.png` - 水平彩色分段滑块
- `slide_vertical_color.png` - 垂直彩色滑块

---

## 💡 替换技巧

### 批量替换相同类型的按钮

1. 选择第一个按钮节点
2. 替换Sprite Frame
3. 按住 `Ctrl` 选择其他相同类型的按钮
4. 在属性检查器中，点击Sprite Frame右边的 `...` 按钮
5. 选择 `Copy Component` → `Paste Component Values`

### 使用Prefab

如果有多个场景使用相同的按钮：
1. 创建Button Prefab
2. 在Prefab中替换Sprite Frame
3. 所有引用这个Prefab的地方会自动更新

---

## ⚠️ 注意事项

1. **保存场景** - 每替换几个就保存一次
2. **测试功能** - 替换后测试按钮点击是否正常
3. **备份项目** - 替换前备份整个项目
4. **检查尺寸** - 新按钮尺寸可能不同，需要调整节点大小

---

## 🎯 推荐的替换顺序

1. **主菜单场景** - 先替换最常用的场景
2. **游戏场景** - 替换游戏内的UI
3. **设置场景** - 替换设置界面
4. **其他场景** - 最后替换其他场景

---

## 📊 快速参考表

| 旧资源 | 新资源路径 | 颜色 |
|--------|-----------|------|
| button_primary | kenney/Green/Default/button_square_gradient.png | 绿色 |
| button_secondary | kenney/Blue/Default/button_square_flat.png | 蓝色 |
| button_danger | kenney/Red/Default/button_square_gradient.png | 红色 |
| button_success | kenney/Green/Default/button_square_gloss.png | 绿色 |
| button_small | kenney/Blue/Default/button_round_flat.png | 蓝色 |
| hp_bar | kenney/Red/Default/slide_horizontal_color.png | 红色 |
| energy_bar | kenney/Blue/Default/slide_horizontal_color.png | 蓝色 |
| time_bar | kenney/Yellow/Default/slide_horizontal_color.png | 黄色 |
| star | kenney/Yellow/Default/star.png | 黄色 |

---

**抱歉没能自动修复，手动替换应该很快！** 🙏
