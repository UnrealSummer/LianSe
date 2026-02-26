# 资源集成指南

## 概述

本文档说明如何将 `art_resources_2026/` 中的资源集成到《炼色》项目中。

---

## 音效资源集成

### 目标目录
```
LSProject/assets/sounds/
├── ui/
├── game/
└── music/
```

### 集成步骤
1. 将 `art_resources_2026/sounds/` 下的文件复制到 `assets/sounds/` 对应目录
2. 在Cocos Creator中刷新资源
3. 在AudioManager.ts中注册音效
4. 测试音效播放

### 代码示例
```typescript
// AudioManager.ts
this.loadSound('button_click', 'sounds/ui/button_click');
this.loadSound('block_eliminate_1', 'sounds/game/block_eliminate_1');
this.loadMusic('menu_bgm', 'sounds/music/menu_bgm');
```

---

## UI资源集成

### 目标目录
```
LSProject/assets/textures/ui_new/
├── main_menu/
├── common/
├── settings/
├── leaderboard/
├── modifier/
└── game/
```

### 集成步骤
1. 将 `art_resources_2026/ui/` 下的文件复制到 `assets/textures/ui_new/` 对应目录
2. 在Cocos Creator中刷新资源
3. 在对应的UI脚本中引用新资源
4. 在场景编辑器中替换Sprite引用

### 九宫格资源设置
对于 `panel_border.png` 和 `panel_bg.png`：
1. 选中资源
2. 在属性面板中设置Type为Sliced
3. 设置Border值（通常为边缘宽度）

---

## 特效资源集成

### 目标目录
```
LSProject/assets/textures/effects_new/
├── eliminate/
├── blocks/
└── special/
```

### 序列帧动画
对于序列帧资源（如 `ice_shatter_1~4.png`）：
1. 复制所有帧到目标目录
2. 创建Animation组件
3. 添加序列帧到动画轨道
4. 设置帧率（通常10-15fps）

---

## 应用图标集成

### Web平台
- 将 `icon_16.png` 和 `icon_32.png` 设置为favicon
- 在 `index.html` 中引用

### 原生平台
- 将所有尺寸图标复制到对应平台的资源目录
- Android: `res/mipmap-*/`
- iOS: `Assets.xcassets/AppIcon.appiconset/`

---

## 资源路径映射表

### 音效资源
| 资源文件 | 项目路径 | 代码引用 |
|---------|---------|---------|
| button_click.mp3 | assets/sounds/ui/button_click | 'sounds/ui/button_click' |
| block_eliminate_1.mp3 | assets/sounds/game/block_eliminate_1 | 'sounds/game/block_eliminate_1' |
| menu_bgm.mp3 | assets/sounds/music/menu_bgm | 'sounds/music/menu_bgm' |

### UI资源
| 资源文件 | 项目路径 | 使用位置 |
|---------|---------|---------|
| title_logo.png | assets/textures/ui_new/main_menu/title_logo | MainMenuUI.titleNode |
| btn_start.png | assets/textures/ui_new/main_menu/btn_start | MainMenuUI.startButton |
| settings_panel_bg.png | assets/textures/ui_new/settings/settings_panel_bg | SettingsUI.panel |

*（完整映射表待资源完成后补充）*

---

## 注意事项

1. **备份原资源** - 替换前备份原有资源
2. **测试验证** - 每次集成后测试功能
3. **性能优化** - 检查资源文件大小，必要时压缩
4. **命名一致** - 保持资源命名与代码引用一致
5. **版本控制** - 提交前检查资源是否正确添加到git

---

## 批量集成脚本

### Windows PowerShell
```powershell
# 复制音效资源
Copy-Item -Path "E:\Project\LianSe\LSProject\art_resources_2026\sounds\*" -Destination "E:\Project\LianSe\LSProject\assets\sounds\" -Recurse -Force

# 复制UI资源
Copy-Item -Path "E:\Project\LianSe\LSProject\art_resources_2026\ui\*" -Destination "E:\Project\LianSe\LSProject\assets\textures\ui_new\" -Recurse -Force

# 复制特效资源
Copy-Item -Path "E:\Project\LianSe\LSProject\art_resources_2026\effects\*" -Destination "E:\Project\LianSe\LSProject\assets\textures\effects_new\" -Recurse -Force
```

---

## 问题排查

### 音效无法播放
- 检查文件格式（MP3/WAV）
- 检查文件路径是否正确
- 检查AudioManager是否正确加载

### UI资源显示异常
- 检查Sprite引用是否正确
- 检查资源尺寸是否符合预期
- 检查九宫格设置（如果适用）

### 特效不显示
- 检查节点是否激活
- 检查层级顺序
- 检查透明度设置

---

*最后更新：2026-02-13*
*待资源完成后补充完整映射表*
