# 粒子特效不显示 - 完整排查指南

## 🔍 问题排查步骤

### 第一步：检查控制台日志

运行游戏，消除方块时，查看控制台输出：

#### 应该看到的日志：
```
[ParticleManager] 生成8个星星粒子，位置: (x, y, z)
```

#### 如果看到警告：
```
ParticleManager: 星星粒子预制体或图片未配置
```
→ 说明ParticleManager配置不完整，继续下一步

---

### 第二步：检查ParticleManager配置

1. 在场景中找到 **ParticleManager** 节点
2. 选中后查看属性检查器

#### 必须配置的属性：

**Star Particle Prefab:**
- ✅ 应该显示为 `StarParticle` 预制体图标
- ❌ 如果是空的，需要拖入 `assets/prefabs/StarParticle.prefab`

**Star Particle Frames:**
- ✅ Size应该是5
- ✅ 每个Element都应该有图片（显示为小图标）
- ❌ 如果是文件夹图标，说明配置错误
- ❌ 如果是空的，需要配置5个PNG文件

---

### 第三步：检查StarParticle预制体

1. 在资源管理器中找到 `assets/prefabs/StarParticle.prefab`
2. 双击打开预制体

#### 必须包含的组件：

**Sprite组件:**
- ✅ 必须存在
- SpriteFrame可以为空（运行时设置）

**Particle脚本:**
- ✅ 必须存在
- Lifetime: 1.0
- Velocity X: 0
- Velocity Y: 100
- Gravity: -200
- Enable Rotation: true
- Rotation Speed: 360

---

### 第四步：使用调试工具测试

我创建了一个调试脚本 `ParticleDebugger.ts`

#### 使用方法：
1. 在场景中任意节点添加 **ParticleDebugger** 脚本
2. 运行游戏
3. 按 **空格键** 测试粒子效果
4. 查看控制台输出

#### 调试输出示例：
```
=== 开始测试粒子效果 ===
✅ ParticleManager已找到
✅ StarParticle预制体已配置
✅ 粒子图片已配置（5个）
🎆 在屏幕中心生成测试粒子...
=== 测试完成 ===
```

如果看到 ❌ 错误，按照提示修复。

---

### 第五步：检查ParticleManager位置

ParticleManager节点必须在正确的位置：

**正确的层级结构：**
```
Canvas
├── ParticleManager  ← 应该在这里
├── GridSystem
├── EnemySystem
└── ...
```

**ParticleManager节点设置：**
- Position: (0, 0, 0)
- zIndex: 100（确保在方块层之上）

---

### 第六步：检查方块消除代码

确认GridSystem.ts已经修改：

打开 `assets/scripts/GridSystem.ts`，搜索 `removeBlocks`，应该看到：

```typescript
const blockScript = block.getComponent('Block');
if (blockScript && blockScript.triggerEliminate) {
    blockScript.playEliminateAnimation(() => {
        resolve();
    });
}
```

如果没有这段代码，说明GridSystem.ts没有正确修改。

---

## 🛠️ 快速修复方案

### 方案A：重新创建StarParticle预制体

1. 删除现有的 `StarParticle.prefab`
2. 在场景中创建新节点 `StarParticle`
3. 添加 **Sprite** 组件
4. 添加 **Particle** 脚本
5. 配置Particle参数（见上面第三步）
6. 拖到prefabs文件夹保存
7. 重新配置ParticleManager的Star Particle Prefab

### 方案B：检查Particle脚本是否正确

1. 打开 `assets/scripts/Particle.ts`
2. 确认文件存在且没有编译错误
3. 在Cocos Creator中按F5刷新资源

### 方案C：简化测试

在控制台直接运行测试代码：

```javascript
// 测试ParticleManager是否存在
const PM = require('./ParticleManager').ParticleManager;
const pm = PM.getInstance();
console.log('ParticleManager:', pm);

// 测试生成粒子
if (pm) {
    pm.spawnStarBurst(cc.v3(0, 0, 0), 10);
}
```

---

## 📋 完整检查清单

- [ ] ParticleManager节点存在于Canvas下
- [ ] ParticleManager脚本已添加
- [ ] Star Particle Prefab已配置（不是空的）
- [ ] Star Particle Frames已配置（5个PNG文件，不是文件夹）
- [ ] StarParticle.prefab存在于assets/prefabs/
- [ ] StarParticle预制体包含Sprite组件
- [ ] StarParticle预制体包含Particle脚本
- [ ] Particle脚本参数已正确设置
- [ ] GridSystem.ts已修改（调用playEliminateAnimation）
- [ ] 控制台没有错误信息

---

## 🎯 预期效果

配置正确后，消除方块时应该看到：
1. 方块播放8帧消除动画（缩小+旋转）
2. 同时8个彩色星星粒子向四周飞散
3. 粒子边飞边旋转
4. 粒子逐渐淡出并缩小
5. 约1秒后粒子消失

---

## 🆘 还是不行？

如果按照上面所有步骤检查后还是不显示，请提供：
1. 控制台的完整日志（特别是错误信息）
2. ParticleManager组件的截图
3. StarParticle预制体的截图

我会帮你进一步排查！
