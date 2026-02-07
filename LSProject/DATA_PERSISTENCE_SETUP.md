# 数据持久化配置文档

## 💾 数据持久化系统

保存玩家进度、金币和统计数据。

---

## 📋 快速配置步骤

### 1. 创建DataManager节点

1. 在Canvas下创建空节点，命名为 `DataManager`
2. 添加组件：`DataManager`
3. **重要：** 勾选 `Don't Destroy On Load`（如果需要跨场景保存）

---

## 💾 保存的数据

### 游戏进度
- **最高关卡** - 玩家达到的最高关卡
- **总金币** - 累积的金币数量

### 统计数据
- **总移动次数** - 所有游戏的移动总数
- **最大连击** - 历史最高连击
- **总游戏时间** - 累计游戏时长（秒）

### 成就系统（预留）
- **成就列表** - 已解锁的成就ID

---

## 🎮 数据保存时机

### 自动保存
- **通关时** - 保存最高关卡、移动次数、连击
- **获得金币时** - 保存金币数量
- **游戏结束时** - 保存所有统计数据

### 数据加载
- **游戏启动时** - 自动加载存档
- **CoinSystem启动时** - 加载金币数量

---

## 🔧 数据存储

### 存储位置
- **浏览器：** LocalStorage
- **手机：** 本地文件系统
- **存储Key：** `LianSeGameData`

### 数据格式
```json
{
  "maxStage": 10,
  "totalCoins": 5000,
  "totalMoves": 1234,
  "maxCombo": 8,
  "totalPlayTime": 3600,
  "achievements": []
}
```

---

## 📊 使用DataManager

### 获取实例
```typescript
const dataManager = DataManager.getInstance();
```

### 常用方法
```typescript
// 获取数据
dataManager.getMaxStage();
dataManager.getTotalCoins();
dataManager.getMaxCombo();

// 更新数据
dataManager.updateMaxStage(10);
dataManager.addCoins(100);
dataManager.updateMaxCombo(5);

// 清空数据（重置游戏）
dataManager.clearData();
```

---

## 🎯 测试数据持久化

1. **玩几关游戏**
2. **获得一些金币**
3. **刷新浏览器**
4. **观察：**
   - 金币数量保留
   - 最高关卡记录保留
   - 控制台显示：`[CoinSystem] Loaded XXX coins from save`

---

## 🔍 查看存档数据

### 浏览器控制台
```javascript
// 查看存档
localStorage.getItem('LianSeGameData')

// 清空存档
localStorage.removeItem('LianSeGameData')
```

---

## ⚠️ 注意事项

1. **数据自动保存** - 无需手动保存
2. **跨场景保存** - 需要勾选 `Don't Destroy On Load`
3. **数据安全** - LocalStorage可能被清除，建议添加云存档

---

*配置完成后，游戏进度会自动保存！*
