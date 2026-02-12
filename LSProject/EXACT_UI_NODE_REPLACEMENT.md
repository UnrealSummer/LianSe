# 具体UI节点替换清单

## 🎯 Main.scene 场景

### 场景路径
`assets/Main.scene`

---

### 需要替换的节点（按层级顺序）

#### 1. 技能按钮区域 (SkillButtons)

**路径：** Canvas → UI → BottomBar → SkillButtons

**节点1：Skill1Button**
- 组件：Button
- 当前Sprite Frame：可能使用了旧按钮资源
- **替换为：** `kenney/Blue/Default/button_square_gradient.png`

**节点2：Skill2Button**
- 组件：Button
- 当前Sprite Frame：可能使用了旧按钮资源
- **替换为：** `kenney/Green/Default/button_square_gradient.png`

**节点3：Skill3Button**
- 组件：Button
- 当前Sprite Frame：可能使用了旧按钮资源
- **替换为：** `kenney/Red/Default/button_square_gradient.png`

---

#### 2. 暂停/设置按钮

**路径：** Canvas → UI → TopBar

**节点：PauseButton 或 SettingsButton**
- 组件：Button
- **替换为：** `kenney/Blue/Default/button_round_flat.png`

---

#### 3. 敌人血条

**路径：** Canvas → UI → EnemyArea → HPBar

**节点：HPBarFill**
- 组件：Sprite
- **替换为：** `kenney/Red/Default/slide_horizontal_color.png`

---

## 🎯 MainMenu.scene 场景

### 场景路径
`assets/MainMenu.scene`

---

### 需要替换的节点

#### 1. 开始游戏按钮

**路径：** Canvas → MainMenu → StartButton

**节点：StartButton**
- 组件：Button
- **替换为：** `kenney/Green/Default/button_square_gradient.png`

---

#### 2. 设置按钮

**路径：** Canvas → MainMenu → SettingsButton

**节点：SettingsButton**
- 组件：Button
- **替换为：** `kenney/Blue/Default/button_square_flat.png`

---

#### 3. 退出按钮

**路径：** Canvas → MainMenu → ExitButton

**节点：ExitButton**
- 组件：Button
- **替换为：** `kenney/Red/Default/button_square_gradient.png`

---

## 📋 通用替换步骤

### 对于每个按钮：

1. **打开场景**
   - 双击 `Main.scene` 或 `MainMenu.scene`

2. **在层级管理器中找到节点**
   - 按照上面的路径展开节点树
   - 或者直接搜索节点名称（如 "StartButton"）

3. **选择节点**
   - 点击节点

4. **在属性检查器中找到Button组件**
   - 展开 `Button` 组件
   - 找到 `Normal Sprite` 或 `Sprite Frame`

5. **点击选择器**
   - 点击Sprite Frame右边的圆形选择器图标

6. **导航到Kenney资源**
   - 在弹出的资源选择器中
   - 导航到：`assets/textures/ui/kenney/`
   - 选择对应颜色文件夹（Blue/Green/Red/Yellow）
   - 选择 `Default` 文件夹
   - 选择对应的PNG文件

7. **保存场景**
   - `Ctrl+S` 保存

---

## 🔍 如果找不到节点

### 方法1：全局搜索

1. 在层级管理器顶部的搜索框输入：
   - `button` - 找所有按钮
   - `skill` - 找技能按钮
   - `bar` - 找进度条

### 方法2：查看所有Button组件

1. 在层级管理器中
2. 点击右上角的过滤器图标
3. 选择 `Button` 组件
4. 会显示所有包含Button组件的节点

---

## 📊 快速参考

### 按钮颜色对应

| 按钮类型 | 颜色 | 文件路径 |
|---------|------|---------|
| 主要操作（开始、确认） | 绿色 | kenney/Green/Default/button_square_gradient.png |
| 次要操作（设置、帮助） | 蓝色 | kenney/Blue/Default/button_square_flat.png |
| 危险操作（退出、取消） | 红色 | kenney/Red/Default/button_square_gradient.png |
| 小图标按钮（暂停） | 蓝色 | kenney/Blue/Default/button_round_flat.png |

### 进度条颜色对应

| 进度条类型 | 颜色 | 文件路径 |
|-----------|------|---------|
| 血条 | 红色 | kenney/Red/Default/slide_horizontal_color.png |
| 能量条 | 蓝色 | kenney/Blue/Default/slide_horizontal_color.png |
| 时间条 | 黄色 | kenney/Yellow/Default/slide_horizontal_color.png |

---

## ⚠️ 重要提示

1. **不要删除旧资源** - 先替换，确认没问题后再删除
2. **每替换几个就保存** - 避免丢失进度
3. **测试功能** - 替换后点击按钮测试是否正常
4. **检查尺寸** - 新按钮可能需要调整节点大小

---

## 💡 如果还是找不到

**最简单的方法：**

1. 打开 `Main.scene`
2. 按 `Ctrl+F` 打开搜索
3. 输入 `Button`
4. 逐个检查每个Button节点
5. 看哪个的Sprite Frame是空的或者显示错误
6. 那就是需要替换的

---

**如果这个清单还不够具体，告诉我你在Cocos Creator中看到的具体节点名称，我再给你精确的路径！**
