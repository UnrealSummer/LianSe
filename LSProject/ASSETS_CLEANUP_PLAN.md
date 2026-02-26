# 《炼色》资源整理方案

## 当前资源情况分析

### assets/textures/ 目录下的资源：

**需要保留的资源：**
1. `blocks/` - 6个方块（红蓝黄橙紫绿）- 当前使用中
2. `gems/` - OpenGameArt的宝石资源 - 当前使用中  
3. `special_blocks/` - 特殊方块（彩虹、冰冻、石头）- 当前使用中
4. `enemies/` - 敌人图片（5个）- 当前使用中
5. `icons/` - 图标（10个）- 部分使用中
6. `particles/` - 粒子效果（9个）- 当前使用中

**可以删除的资源（不再使用）：**
1. `blocks_test/` - 测试用方块，已有正式版本
2. `buttons/` 和 `buttons_Old/` - 旧按钮资源，将被原型图资源替代
3. `ui/kenney/` - **Kenney UI资源包（约800个文件）** - 未使用，占用大量空间
4. `ui/buttons/` - 旧UI按钮
5. `ui/background.png`, `ui/board_frame.png` 等旧UI元素

**需要添加的新资源（从原型图资源包）：**
- `downloaded_assets/prototype_assets/blocks/` - 6个新宝石方块
- `downloaded_assets/prototype_assets/ui/` - 6个UI元素
- `downloaded_assets/prototype_assets/buttons/` - 4个按钮
- `downloaded_assets/prototype_assets/icons/` - 2个图标

---

## 整理方案

### 步骤1：备份当前资源
```powershell
# 创建备份目录
New-Item -ItemType Directory -Force -Path "E:\Project\LianSe\LSProject\assets_backup_$(Get-Date -Format 'yyyyMMdd')"

# 备份整个textures目录
Copy-Item "E:\Project\LianSe\LSProject\assets\textures" -Destination "E:\Project\LianSe\LSProject\assets_backup_$(Get-Date -Format 'yyyyMMdd')\textures" -Recurse
```

### 步骤2：删除不用的资源
```powershell
# 删除测试资源
Remove-Item "E:\Project\LianSe\LSProject\assets\textures\blocks_test" -Recurse -Force

# 删除旧按钮
Remove-Item "E:\Project\LianSe\LSProject\assets\textures\buttons" -Recurse -Force
Remove-Item "E:\Project\LianSe\LSProject\assets\textures\buttons_Old" -Recurse -Force

# 删除Kenney UI资源包（约800个文件）
Remove-Item "E:\Project\LianSe\LSProject\assets\textures\ui\kenney" -Recurse -Force

# 删除旧UI元素
Remove-Item "E:\Project\LianSe\LSProject\assets\textures\ui\buttons" -Recurse -Force
Remove-Item "E:\Project\LianSe\LSProject\assets\textures\ui\background.png" -Force
Remove-Item "E:\Project\LianSe\LSProject\assets\textures\ui\board_frame.png" -Force
Remove-Item "E:\Project\LianSe\LSProject\assets\textures\ui\bottom_bar.png" -Force
Remove-Item "E:\Project\LianSe\LSProject\assets\textures\ui\energy_bar.png" -Force
Remove-Item "E:\Project\LianSe\LSProject\assets\textures\ui\hp_bar.png" -Force
Remove-Item "E:\Project\LianSe\LSProject\assets\textures\ui\panel_main.png" -Force
Remove-Item "E:\Project\LianSe\LSProject\assets\textures\ui\panel_small.png" -Force
Remove-Item "E:\Project\LianSe\LSProject\assets\textures\ui\time_bar.png" -Force
Remove-Item "E:\Project\LianSe\LSProject\assets\textures\ui\top_bar.png" -Force
```

### 步骤3：复制新资源到assets
```powershell
# 复制原型图宝石方块
Copy-Item "E:\Project\LianSe\LSProject\downloaded_assets\prototype_assets\blocks\*" -Destination "E:\Project\LianSe\LSProject\assets\textures\blocks_prototype" -Force

# 复制原型图UI元素
Copy-Item "E:\Project\LianSe\LSProject\downloaded_assets\prototype_assets\ui\*" -Destination "E:\Project\LianSe\LSProject\assets\textures\ui" -Force

# 复制原型图按钮
Copy-Item "E:\Project\LianSe\LSProject\downloaded_assets\prototype_assets\buttons\*" -Destination "E:\Project\LianSe\LSProject\assets\textures\buttons" -Force

# 复制原型图图标
Copy-Item "E:\Project\LianSe\LSProject\downloaded_assets\prototype_assets\icons\*" -Destination "E:\Project\LianSe\LSProject\assets\textures\icons" -Force
```

---

## 整理后的目录结构

```
assets/textures/
├── blocks/                    # 当前使用的6个方块（保留）
├── blocks_prototype/          # 原型图的6个新方块（新增）
├── gems/                      # OpenGameArt宝石（保留）
├── special_blocks/            # 特殊方块（保留）
├── enemies/                   # 敌人图片（保留）
├── icons/                     # 图标（保留+新增）
├── particles/                 # 粒子效果（保留）
├── buttons/                   # 原型图按钮（新增）
└── ui/                        # 原型图UI元素（新增）
```

---

## 预计效果

**删除的文件数量：** 约850个文件
**删除的空间：** 约50-100MB
**新增的文件数量：** 18个文件
**新增的空间：** 约2-3MB

**净效果：** 减少约830个文件，节省约50-100MB空间

---

## 执行方式

我已经创建了自动化脚本：`E:\Project\LianSe\LSProject\CLEANUP_ASSETS.ps1`

**执行步骤：**
1. 在PowerShell中运行脚本
2. 脚本会自动备份、删除、复制
3. 完成后在Cocos Creator中刷新资源

**如果出问题：**
- 备份在 `assets_backup_yyyyMMdd/` 目录
- 可以随时恢复

---

**是否执行这个整理方案？**
