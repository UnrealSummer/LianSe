# 特效系统配置文档

## 🎨 特效系统

特效系统提供视觉反馈，增强游戏打击感。

---

## 📋 快速配置步骤

### 1. 创建EffectManager节点

1. 在Canvas下创建空节点，命名为 `EffectManager`
2. 位置：(0, 0, 0)
3. 添加组件：`EffectManager`

### 2. 创建伤害数字预制体

#### 2.1 创建预制体节点
1. 在场景中创建空节点，命名为 `DamageNumber`
2. 添加Label组件
3. Label配置：
   - String: "-999"
   - Font Size: 48
   - Color: 白色 (255, 255, 255)
   - Horizontal Align: Center
   - Vertical Align: Center

#### 2.2 保存为预制体
1. 将DamageNumber节点拖拽到assets文件夹
2. 创建预制体文件：`DamageNumber.prefab`
3. 删除场景中的DamageNumber节点

#### 2.3 连接引用
1. 选中EffectManager节点
2. 在属性检查器中，找到 `Damage Number Prefab`
3. 拖拽 `DamageNumber.prefab` 到该字段

---

## 🎮 特效效果

### 1. 伤害数字飘字
- 消除时显示伤害数字
- 向上飘动并淡出
- 暴击时显示红色大字

### 2. 屏幕震动
- 造成伤害时震动
- 震动强度与伤害成正比
- 最大震动强度：20

### 3. 连击特效
- 连锁2次及以上显示
- 黄色大字 "COMBO x2!"
- 弹出动画

### 4. 敌人受击闪烁
- 受到伤害时闪白
- 持续0.2秒

---

## 💡 最简配置

如果不想创建预制体，可以：
1. 只创建EffectManager节点
2. 不设置Damage Number Prefab
3. 仍然可以使用屏幕震动、连击特效、受击闪烁

---

## 🎯 测试效果

配置完成后：
1. 刷新浏览器
2. 消除方块
3. 观察：
   - ✅ 伤害数字飘字
   - ✅ 屏幕震动
   - ✅ 连击特效（2连及以上）
   - ✅ 敌人闪白

---

*配置完成后，游戏会更有打击感！*
