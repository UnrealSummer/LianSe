# UI Resource Generation Plan

## Phase 1: Main Menu (Priority 1)

### 资源列表
- title_logo.png (512x256) - 游戏标题Logo "炼色"
- btn_start.png (256x80) - "开始游戏"
- btn_leaderboard.png (256x80) - "排行榜"
- btn_settings.png (256x80) - "设置"
- btn_exit.png (256x80) - "退出"

**Bing Image Creator Prompt:**
```
Match-3 puzzle game main menu UI with Chinese theme. Wooden ornate frame containing colorful gem blocks arranged vertically. Top: elegant Chinese title "炼色" with magical glow. Below: 4 wooden buttons with Chinese text "开始游戏", "排行榜", "设置", "退出". Rich colors, golden decorative elements, Chinese traditional patterns, gem-matching game aesthetic. Detailed ornamental design.
```

**生成设置（2026-02-20更新）：**
- 平台：Bing Image Creator
- 模型：GPT-4o（一致的角色和风格）
- 长宽比：1:1（方形/Square）
- 图像数量：1
- 风格：中国风木质框架 + 彩色宝石元素 + 金色装饰 + 传统图案

## Phase 2: Common UI Elements (Priority 2)

### 资源列表
- btn_close.png (64x64) - 关闭按钮 (X icon)
- btn_confirm.png (128x64) - "确认"
- btn_cancel.png (128x64) - "取消"

**Bing Image Creator Prompt:**
```
Game UI button set, wooden fantasy style. Three buttons: close button with X icon, confirm button with Chinese text "确认", cancel button with Chinese text "取消". Warm wood texture, golden borders, magical glow. Hand-drawn indie game style. Arranged horizontally with spacing. White or transparent background.
```

**生成设置：**
- 平台：Bing Image Creator
- 长宽比：横向 (Landscape/Wide)
- 风格：与主菜单保持一致

## Phase 3: Settings UI (Priority 3)

### 资源列表
- toggle_on.png (64x32) - 开关-开启状态
- toggle_off.png (64x32) - 开关-关闭状态
- icon_sound.png (48x48) - 音效图标
- icon_music.png (48x48) - 音乐图标

**Bing Image Creator Prompt:**
```
Game UI elements set, wooden fantasy style. Four icons: toggle switch ON state (glowing), toggle switch OFF state (dim), sound icon (speaker), music icon (note). Warm colors, magical glow, golden accents. Hand-drawn indie game style. Arranged in a grid with spacing. White or transparent background.
```

**生成设置：**
- 平台：Bing Image Creator
- 长宽比：方形 (Square)
- 风格：与主菜单保持一致

## Workflow (Updated 2026-02-20)

### 生成设置
- **平台：** Bing Image Creator
- **访问：** https://www.bing.com/images/create
- **模型：** GPT-4o（一致的角色和风格）
- **长宽比：** 1:1（方形/Square）
- **图像数量：** 1张/次
- **风格：** 中国风木质框架 + 彩色宝石元素 + 金色装饰 + 传统图案

### 操作流程
1. **AI生成** - 在Bing Image Creator中使用上述Prompt生成
2. **下载原图** - 下载生成的方形图像（通常1024x1024）
3. **裁剪分离** - 使用图像编辑工具分离各元素：
   - 标识Logo区域 → 裁剪为 512x256
   - 各按钮区域 → 裁剪为 256x80
4. **去背景** - 如需要，使用remove.bg或Photoshop去除背景
5. **保存到目录** - 按照INDEX.md中的路径保存：
   ```
   art_resources_2026/ui/main_menu/
   art_resources_2026/ui/common/
   art_resources_2026/ui/settings/
   ```
6. **备份原图** - 保存原始生成图到 `originals/images/` 目录

### 优势
- ✅ GPT-4o模型保证风格一致性
- ✅ 方形布局便于元素排列和裁剪
- ✅ 中国风主题符合游戏"炼色"定位
- ✅ 一次生成完整UI界面，风格统一

### 注意事项
- 必须使用GPT-4o模型（不是DALL-E 3）
- 必须选择1:1方形比例（不是纵向）
- 生成时确保元素清晰可辨，便于后期裁剪
- 保留原始生成图到 `originals/` 目录备份
- 裁剪时保持透明背景（PNG格式）
- 检查尺寸是否符合游戏标准

### 推荐工具
- **去背景：** remove.bg, Photopea (在线PS)
- **批量裁剪：** IrfanView, XnConvert
- **图像编辑：** GIMP, Paint.NET, Photopea
