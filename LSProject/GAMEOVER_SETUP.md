# 游戏结束结算界面配置说明

## 已完成

1. ✅ 创建了 `GameOverUI.ts` 组件
2. ✅ 在 `GameCore.ts` 中集成
3. ✅ 添加了分数计算系统
4. ✅ 添加了总伤害统计
5. ✅ 时间耗尽时显示结算界面

## 需要在场景中配置

### 步骤1：创建结算界面节点

1. 在 Cocos Creator 的**层级管理器**中
2. 右键点击 `Canvas`
3. 选择 `创建 → 创建空节点`
4. 命名为 `GameOverUI`
5. 添加 `GameOverUI` 组件

### 步骤2：创建UI元素

在 `GameOverUI` 节点下创建以下子节点：

```
GameOverUI
├── Panel (Sprite - 半透明黑色背景)
│   ├── Title (Label - "游戏结束")
│   ├── CurrentScore (Node - 本次成绩)
│   │   ├── StageLabel (Label - "第 X 关")
│   │   ├── ScoreLabel (Label - "分数: XXX")
│   │   └── GoldLabel (Label - "金币: XXX")
│   ├── BestScore (Node - 历史最佳)
│   │   ├── BestStageLabel (Label - "最高关卡: 第 X 关")
│   │   └── BestScoreLabel (Label - "最高分数: XXX")
│   ├── NewRecord (Label - "🎉 新纪录！" - 默认隐藏)
│   └── Buttons (Node)
│       ├── RestartButton (Button - "重新开始")
│       └── MenuButton (Button - "返回主菜单" - 可选)
```

### 步骤3：配置 GameOverUI 组件

选中 `GameOverUI` 节点，在属性检查器中配置：

- **Panel:** 拖入 Panel 节点
- **Stage Label:** 拖入 StageLabel
- **Score Label:** 拖入 ScoreLabel
- **Gold Label:** 拖入 GoldLabel
- **Best Stage Label:** 拖入 BestStageLabel
- **Best Score Label:** 拖入 BestScoreLabel
- **New Record Node:** 拖入 NewRecord 节点
- **Restart Button:** 拖入 RestartButton
- **Menu Button:** 拖入 MenuButton（可选）

### 步骤4：配置 GameCore

选中 `GameCore` 节点，在属性检查器中：

- **Game Over UI:** 拖入 `GameOverUI` 节点

## 测试

1. 运行游戏
2. 等待时间耗尽（60秒）
3. 应该显示结算界面
4. 显示本次成绩和历史最佳
5. 点击"重新开始"应该重新开始游戏

## 分数计算规则

```
总分 = 关卡 × 1000 + 总伤害 × 10 + 金币 × 1
```

例如：
- 第 5 关，造成 1000 伤害，获得 50 金币
- 总分 = 5 × 1000 + 1000 × 10 + 50 = 15,050

## 新纪录判定

满足以下任一条件即为新纪录：
- 本次关卡 > 历史最高关卡
- 本次分数 > 历史最高分数

## 下一步

- [ ] 美化结算界面UI
- [ ] 添加新纪录动画
- [ ] 添加金币系统（消除获得金币）
- [ ] 添加主菜单界面
