# 本地存储实现说明

## 已完成

1. ✅ 创建了 `DataManager.ts` - 数据管理器
2. ✅ 在 `GameCore.ts` 中集成了数据保存和加载
3. ✅ 游戏结束时自动保存数据
4. ✅ 游戏开始时显示历史记录

## 需要在场景中配置

### 步骤1：添加 DataManager 节点

1. 在 Cocos Creator 的**层级管理器**中
2. 右键点击 `Canvas` 或根节点
3. 选择 `创建 → 创建空节点`
4. 命名为 `DataManager`
5. 选中 `DataManager` 节点
6. 在**属性检查器**中点击 `添加组件`
7. 搜索并添加 `DataManager` 组件

### 步骤2：测试

运行游戏，控制台会显示：

```
━━━━━━━━━━━━━━━━━━━━
      历史记录
━━━━━━━━━━━━━━━━━━━━
最高关卡: 第 0 关
最高分数: 0
总游戏次数: 0
累计金币: 0
━━━━━━━━━━━━━━━━━━━━
```

### 步骤3：验证保存

1. 玩游戏直到时间耗尽
2. 控制台会显示：`[GameCore] 游戏数据已保存`
3. 刷新页面重新运行
4. 历史记录应该更新了

## 数据存储位置

- **浏览器：** `localStorage` (F12 → Application → Local Storage)
- **微信小游戏：** `wx.setStorageSync()`
- **抖音小游戏：** `tt.setStorageSync()`

## 存储的数据

```json
{
  "highestStage": 5,
  "highestScore": 12000,
  "totalGames": 10,
  "totalGold": 500,
  "lastPlayTime": 1738742400000
}
```

## 调试命令

在控制台输入：

```javascript
// 查看存储的数据
localStorage.getItem('lianse_player_data')

// 清空数据
localStorage.removeItem('lianse_player_data')
```

## 下一步

- [ ] 添加分数计算系统
- [ ] 添加金币系统
- [ ] 在结算界面显示历史记录对比
- [ ] 添加"新纪录"提示动画
