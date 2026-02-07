# 金币系统配置文档

## 💰 金币系统

金币系统管理金币获取和消费。

---

## 📋 快速配置步骤

### 1. 创建CoinSystem节点

1. 在 **GameCore节点下** 创建空节点，命名为 `CoinSystem`
2. 添加组件：`CoinSystem`
3. 保存场景

**重要：** CoinSystem必须是GameCore的子节点！

---

## 🎮 金币获取方式

### 1. 攻击掉落（小额）
- 每5点伤害 = 1金币
- 例如：造成30伤害 = 6金币

### 2. 击败敌人（大额）
- 基础奖励：50金币
- 关卡奖励：关卡数×10金币
- 时间奖励：剩余时间×2金币

### 3. 金币收集者词条
- 所有金币+50%

---

## 🎯 测试金币系统

配置完成后：
1. 刷新浏览器
2. 消除攻击敌人
3. 观察控制台：
   ```
   [CoinSystem] +6 coins (Total: 6)
   [GameCore] 💰 Enemy dropped 6 coins
   ```
4. 击败敌人：
   ```
   [CoinSystem] +140 coins (Total: 146)
   [GameCore] 💰💰💰 KILL REWARD: 140 coins!
   ```
5. 金币UI实时更新

---

## ⚠️ 常见问题

### 金币不增长？
1. 检查CoinSystem节点是否创建
2. 检查是否在GameCore节点下
3. 检查控制台是否有 `[GameCore] CoinSystem node: CoinSystem`
4. 如果显示 `CoinSystem node: undefined`，说明节点位置不对

---

*配置完成后，金币系统就能正常工作了！*
