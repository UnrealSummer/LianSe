# 音效系统优化文档

## 🎵 功能说明

### 核心功能
1. ✅ 音效开关
2. ✅ 音乐开关
3. ✅ 音量控制
4. ✅ 特殊音效（Epic、暴击、击杀）
5. ✅ 本地存储设置

---

## 📊 音效列表

### 1. 背景音乐（BGM）
- **文件：** bgmClip
- **循环：** 是
- **音量：** 0.5（默认）
- **控制：** 音乐开关

### 2. 消除音效
- **文件：** matchSound
- **触发：** 方块消除时
- **音量：** 1.0

### 3. 连锁音效
- **文件：** chainSound
- **触发：** 连锁消除时
- **音量：** 0.5 + 连锁层数 × 0.1
- **特点：** 连锁越高，音量越大

### 4. 伤害音效
- **文件：** damageSound
- **触发：** 造成伤害时
- **音量：** 1.0

### 5. 暴击音效 ⭐
- **文件：** criticalSound
- **触发：** 暴击时
- **音量：** 1.2
- **特点：** 比普通伤害更响亮

### 6. Epic音效 ⭐⭐
- **文件：** epicSound
- **触发：** Epic词条效果时
- **音量：** 1.5
- **特点：** 最响亮的音效

### 7. 击杀音效
- **文件：** killSound
- **触发：** 击败敌人时
- **音量：** 1.3

### 8. 按钮音效
- **文件：** buttonSound
- **触发：** 点击按钮时
- **音量：** 0.8

### 9. 警告音效
- **文件：** warningSound
- **触发：** 时间<15秒时
- **音量：** 1.0

---

## 🎮 使用方法

### 在 GameCore 中调用

```typescript
// 消除音效
this.audioManager.playMatchSound();

// 连锁音效
this.audioManager.playChainSound(chainLevel);

// 伤害音效
this.audioManager.playDamageSound();

// 暴击音效
this.audioManager.playCriticalSound();

// Epic音效
this.audioManager.playEpicSound();

// 击杀音效
this.audioManager.playKillSound();

// 警告音效
this.audioManager.playWarningSound();
```

---

## 🔧 配置步骤

### 步骤1：配置 AudioManager

1. 在场景中找到 AudioManager 节点
2. 添加 AudioManager 组件
3. 添加2个 AudioSource 组件：
   - BGM Source（背景音乐）
   - SFX Source（音效）

### 步骤2：配置音频片段

在 AudioManager 组件中配置：
- **BGM Clip：** 背景音乐文件
- **Match Sound：** 消除音效
- **Chain Sound：** 连锁音效
- **Damage Sound：** 伤害音效
- **Critical Sound：** 暴击音效
- **Epic Sound：** Epic音效
- **Kill Sound：** 击杀音效
- **Button Sound：** 按钮音效
- **Warning Sound：** 警告音效

### 步骤3：配置 SettingsUI

在 SettingsUI 组件中配置：
- **Audio Manager：** 拖入 AudioManager 节点

---

## 🎯 触发时机

### 游戏流程中的音效

| 事件 | 音效 | 优先级 |
|------|------|--------|
| 方块消除 | matchSound | 普通 |
| 连锁消除 | chainSound | 普通 |
| 造成伤害 | damageSound | 普通 |
| 暴击 | criticalSound | 高 |
| Epic效果 | epicSound | 最高 |
| 击败敌人 | killSound | 高 |
| 时间警告 | warningSound | 中 |
| 点击按钮 | buttonSound | 低 |

---

## 💡 音效优化建议

### 1. Epic音效触发条件

**以下词条触发Epic音效：**
- 完美消除（6个以上×2）
- 背水一战（低血×2）
- 暴击（30%×3）
- 狂暴（低时间×2）
- 连锁狂潮（5层×3）

**代码示例：**
```typescript
// 在 GameCore 中
if (isEpicEffect) {
    this.audioManager.playEpicSound();
} else if (isCritical) {
    this.audioManager.playCriticalSound();
} else {
    this.audioManager.playDamageSound();
}
```

---

### 2. 连锁音效优化

**音量随连锁层数增加：**
- 连锁1层：音量0.6
- 连锁2层：音量0.7
- 连锁3层：音量0.8
- 连锁4层：音量0.9
- 连锁5层：音量1.0

**代码：**
```typescript
this.audioManager.playChainSound(chainLevel);
```

---

### 3. 时间警告音效

**触发时机：**
- 时间<15秒时，每5秒播放一次
- 时间<5秒时，每秒播放一次

**代码示例：**
```typescript
if (timeLeft < 15 && timeLeft % 5 === 0) {
    this.audioManager.playWarningSound();
} else if (timeLeft < 5) {
    this.audioManager.playWarningSound();
}
```

---

## 🧪 测试清单

### 基础测试
- [ ] 音效开关正常
- [ ] 音乐开关正常
- [ ] 设置保存和读取
- [ ] 背景音乐循环播放

### 音效测试
- [ ] 消除音效
- [ ] 连锁音效（音量递增）
- [ ] 伤害音效
- [ ] 暴击音效（更响）
- [ ] Epic音效（最响）
- [ ] 击杀音效
- [ ] 按钮音效
- [ ] 警告音效

### 集成测试
- [ ] 关闭音效后无声音
- [ ] 关闭音乐后BGM停止
- [ ] 重启后设置保留
- [ ] 多个音效同时播放不冲突

---

## 📝 音频资源需求

### 必需音效（9个）
1. ✅ 背景音乐（循环）
2. ✅ 消除音效
3. ✅ 连锁音效
4. ✅ 伤害音效
5. ✅ 暴击音效
6. ✅ Epic音效
7. ✅ 击杀音效
8. ✅ 按钮音效
9. ✅ 警告音效

### 可选音效
10. ⏳ 词条选择音效
11. ⏳ 关卡完成音效
12. ⏳ 游戏结束音效
13. ⏳ 新纪录音效

---

## 🎵 音频格式建议

### 格式
- **BGM：** MP3 或 OGG（循环）
- **音效：** WAV 或 MP3（短音效）

### 规格
- **采样率：** 44100 Hz
- **比特率：** 128-192 kbps
- **声道：** 立体声
- **时长：**
  - BGM：2-3分钟
  - 音效：0.1-1秒

---

## 🔊 音量平衡

### 推荐音量
- **BGM：** 0.5（背景，不抢戏）
- **消除：** 1.0（标准）
- **连锁：** 0.5-1.0（递增）
- **伤害：** 1.0（标准）
- **暴击：** 1.2（突出）
- **Epic：** 1.5（最突出）
- **击杀：** 1.3（重要）
- **按钮：** 0.8（轻微）
- **警告：** 1.0（提醒）

---

## 💡 实现建议

### 如果没有音频资源

**方案1：使用占位音效**
- 使用简单的"哔"声
- 不同音调代表不同音效
- 先实现功能，后期替换

**方案2：暂时禁用**
- 音效开关默认关闭
- 等有资源后再开启

**方案3：使用免费资源**
- Freesound.org
- OpenGameArt.org
- 搜索"match 3 sound effects"

---

## 📊 优化效果

### 优化前
- ❌ 无音效
- ❌ 无音乐
- ❌ 游戏体验单调

### 优化后
- ✅ 完整音效系统
- ✅ 音效开关
- ✅ 特殊音效（Epic、暴击）
- ✅ 游戏体验提升

---

*创建时间：2026-02-06 11:30*  
*版本：v1.0*  
*音效数量：9个*
