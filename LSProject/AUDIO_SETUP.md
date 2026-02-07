# 音效系统配置文档

## 🔊 音效系统

为游戏添加音效和背景音乐。

---

## 📋 快速配置步骤

### 1. 创建AudioManager节点

1. 在Canvas下创建空节点，命名为 `AudioManager`
2. 添加组件：`AudioManager`

### 2. 准备音效资源（可选）

如果有音效文件：
1. 将音效文件放到 `assets/audio/` 文件夹
2. 支持格式：mp3, ogg, wav
3. 建议音效：
   - match.mp3 - 消除音效
   - attack.mp3 - 攻击音效
   - combo.mp3 - 连击音效
   - victory.mp3 - 胜利音效
   - defeat.mp3 - 失败音效
   - click.mp3 - 点击音效
   - bgm.mp3 - 背景音乐

### 3. 连接音效资源

选中AudioManager节点，在属性检查器中：
- **Match Sound**: 拖拽消除音效
- **Attack Sound**: 拖拽攻击音效
- **Combo Sound**: 拖拽连击音效
- **Victory Sound**: 拖拽胜利音效
- **Defeat Sound**: 拖拽失败音效
- **Click Sound**: 拖拽点击音效
- **Bgm**: 拖拽背景音乐

### 4. 调整音量

- **Sfx Volume**: 音效音量（0-1，推荐0.7）
- **Bgm Volume**: 背景音乐音量（0-1，推荐0.3）

---

## 🎵 音效触发时机

### 游戏音效
- **消除音效** - 每次消除时播放
- **攻击音效** - 造成伤害时播放
- **连击音效** - 2连及以上时播放
- **胜利音效** - 击败敌人时播放
- **失败音效** - 时间耗尽时播放

### 背景音乐
- 游戏开始时自动播放
- 循环播放

---

## 💡 临时方案（无音效文件）

如果暂时没有音效文件：
1. 只创建AudioManager节点
2. 不连接音效资源
3. 代码会自动跳过音效播放
4. 游戏正常运行

---

## 🎯 音效建议

### 免费音效资源
- **Freesound.org** - 免费音效库
- **OpenGameArt.org** - 开源游戏资源
- **Zapsplat.com** - 免费音效

### 音效类型建议
- **消除音效** - 清脆的"叮"声
- **攻击音效** - 打击声
- **连击音效** - 上升音调
- **胜利音效** - 欢快的旋律
- **失败音效** - 低沉的音效
- **背景音乐** - 轻快的循环音乐

---

## 🔧 音量控制

AudioManager提供音量控制方法：
```typescript
// 设置音效音量
audioManager.setSFXVolume(0.5);

// 设置背景音乐音量
audioManager.setBGMVolume(0.3);

// 静音/取消静音
audioManager.setMute(true);
```

---

*配置完成后，游戏会有音效反馈！*
