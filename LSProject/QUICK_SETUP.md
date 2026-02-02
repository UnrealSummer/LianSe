# ⚡ 快速配置指南（2分钟）

## 🎯 目标
在Cocos Creator中添加UIManager和AudioManager组件

---

## 📋 配置步骤

### Step 1: 添加UIManager（30秒）

1. 在**层级管理器**中，选中 `Canvas` 节点
2. 在**属性检查器**中，点击「添加组件」
3. 选择「自定义组件」→ 找到 `UIManager`
4. ✅ 完成！

### Step 2: 添加AudioManager（30秒）

1. 仍然选中 `Canvas` 节点
2. 在**属性检查器**中，点击「添加组件」
3. 选择「自定义组件」→ 找到 `AudioManager`
4. ✅ 完成！

### Step 3: 创建ComboNode（30秒）

1. 在 `Canvas` 节点上**右键** → 「创建」→ 「创建空节点」
2. 重命名为 `ComboNode`
3. 选中 `ComboNode`，添加组件 `Label`
4. 设置Label属性：
   - Font Size: `60`
   - Horizontal Align: `Center`
   - Vertical Align: `Center`
5. ✅ 完成！

### Step 4: 配置GameManager引用（30秒）

1. 选中 `GameManager` 节点
2. 在**属性检查器**中找到 `GameManager` 组件
3. 找到属性：
   - `Ui Manager`: 拖入 `Canvas` 节点上的 `UIManager` 组件
   - `Audio Manager`: 拖入 `Canvas` 节点上的 `AudioManager` 组件
4. ✅ 完成！

### Step 5: 配置UIManager引用（30秒）

1. 选中 `Canvas` 节点
2. 找到 `UIManager` 组件
3. 配置属性：
   - `Combo Node`: 拖入刚创建的 `ComboNode` 节点
   - `Combo Label`: 拖入 `ComboNode` 上的 `Label` 组件
4. ✅ 完成！

---

## ✅ 验证

配置完成后，检查：
- [ ] Canvas有UIManager组件
- [ ] Canvas有AudioManager组件
- [ ] ComboNode存在且有Label组件
- [ ] GameManager的uiManager和audioManager已配置
- [ ] UIManager的comboNode和comboLabel已配置

---

## 🎮 运行测试

1. 点击Cocos Creator的「运行」按钮
2. 玩游戏，观察：
   - ✨ 混合成功时有分数弹出
   - 🔊 所有操作都有音效
   - 💥 连锁时屏幕中央显示「×2 连锁！」
   - 📊 目标进度条实时更新

---

## 🐛 如果有问题

检查控制台是否有错误信息，常见问题：
- 组件未找到：确保UIManager.ts和AudioManager.ts已编译
- 引用为空：检查拖拽的组件是否正确

---

**配置时间：<3分钟** ⚡

配置完成后告诉我，我来验证效果！✌️
