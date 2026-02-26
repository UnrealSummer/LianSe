# 《炼色》美术资源库
**创建时间：2026-02-13**
**资源收集期：2026-02-14 至 2026-02-22**

---

## 目录结构

```
art_resources_2026/
├── sounds/                    # 音效资源
│   ├── ui/                    # UI音效
│   ├── game/                  # 游戏音效
│   └── music/                 # 背景音乐
│
├── ui/                        # UI资源
│   ├── main_menu/             # 主菜单
│   ├── common/                # 通用UI元素
│   ├── settings/              # 设置界面
│   ├── leaderboard/           # 排行榜
│   ├── modifier/              # 词条选择
│   └── game/                  # 游戏内UI
│
├── effects/                   # 特效资源
│   ├── eliminate/             # 消除特效
│   ├── blocks/                # 方块特效
│   └── special/               # 特殊特效
│
├── icons/                     # 应用图标
│
├── backgrounds/               # 背景图（如果有）
│
├── originals/                 # 原始文件（未处理）
│   ├── sounds/
│   ├── images/
│   └── downloads/
│
└── docs/                      # 文档
    ├── INDEX.md               # 资源索引（本文件）
    ├── CHANGELOG.md           # 更新日志
    ├── LICENSE.md             # 版权信息
    └── INTEGRATION.md         # 集成指南
```

---

## 资源索引

### 音效资源（sounds/）

#### UI音效（ui/）
| 文件名 | 描述 | 时长 | 格式 | 来源 | 许可 | 状态 |
|--------|------|------|------|------|------|------|
| button_click.mp3 | 按钮点击音效 | 0.2s | MP3 | - | - | ⏳ 待收集 |
| button_hover.mp3 | 按钮悬停音效 | 0.1s | MP3 | - | - | ⏳ 待收集 |
| panel_open.mp3 | 面板打开音效 | 0.3s | MP3 | - | - | ⏳ 待收集 |
| panel_close.mp3 | 面板关闭音效 | 0.3s | MP3 | - | - | ⏳ 待收集 |
| victory.mp3 | 胜利音效 | 1-2s | MP3 | - | - | ⏳ 待收集 |
| defeat.mp3 | 失败音效 | 1-2s | MP3 | - | - | ⏳ 待收集 |
| toggle_on.mp3 | 开关打开 | 0.2s | MP3 | - | - | ⏳ 待收集 |
| toggle_off.mp3 | 开关关闭 | 0.2s | MP3 | - | - | ⏳ 待收集 |

#### 游戏音效（game/）
| 文件名 | 描述 | 时长 | 格式 | 来源 | 许可 | 状态 |
|--------|------|------|------|------|------|------|
| block_select.mp3 | 方块选中 | 0.1s | MP3 | - | - | ⏳ 待收集 |
| block_swap.mp3 | 方块交换 | 0.2s | MP3 | - | - | ⏳ 待收集 |
| block_eliminate_1.mp3 | 消除音效（3个） | 0.3s | MP3 | - | - | ⏳ 待收集 |
| block_eliminate_2.mp3 | 消除音效（4个） | 0.3s | MP3 | - | - | ⏳ 待收集 |
| block_eliminate_3.mp3 | 消除音效（5+个） | 0.4s | MP3 | - | - | ⏳ 待收集 |
| combo_2x.mp3 | 2倍连击 | 0.5s | MP3 | - | - | ⏳ 待收集 |
| combo_4x.mp3 | 4倍连击 | 0.6s | MP3 | - | - | ⏳ 待收集 |
| combo_8x.mp3 | 8倍连击 | 0.8s | MP3 | - | - | ⏳ 待收集 |
| block_drop.mp3 | 方块掉落 | 0.2s | MP3 | - | - | ⏳ 待收集 |
| special_trigger.mp3 | 特殊方块触发 | 0.5s | MP3 | - | - | ⏳ 待收集 |
| attack.mp3 | 攻击敌人 | 0.4s | MP3 | - | - | ⏳ 待收集 |
| damage.mp3 | 受到伤害 | 0.3s | MP3 | - | - | ⏳ 待收集 |

#### 背景音乐（music/）
| 文件名 | 描述 | 时长 | 格式 | 来源 | 许可 | 状态 |
|--------|------|------|------|------|------|------|
| menu_bgm.mp3 | 主菜单BGM | 2-3min | MP3 | - | - | ⏳ 待收集 |
| game_bgm_1.mp3 | 游戏BGM | 2-3min | MP3 | - | - | ⏳ 待收集 |
| game_bgm_2.mp3 | 游戏BGM变体 | 2-3min | MP3 | - | - | ⏳ 待收集 |

---

### UI资源（ui/）

#### 主菜单（main_menu/）
| 文件名 | 描述 | 尺寸 | 格式 | 来源 | 状态 |
|--------|------|------|------|------|------|
| title_logo.png | 游戏标题Logo | 512x256 | PNG | - | ⏳ 待生成 |
| btn_start.png | 开始游戏按钮 | 256x80 | PNG | - | ⏳ 待生成 |
| btn_leaderboard.png | 排行榜按钮 | 256x80 | PNG | - | ⏳ 待生成 |
| btn_settings.png | 设置按钮 | 256x80 | PNG | - | ⏳ 待生成 |
| btn_exit.png | 退出按钮 | 256x80 | PNG | - | ⏳ 待生成 |

#### 通用UI元素（common/）
| 文件名 | 描述 | 尺寸 | 格式 | 来源 | 状态 |
|--------|------|------|------|------|------|
| btn_close.png | 关闭按钮 | 64x64 | PNG | - | ⏳ 待生成 |
| btn_confirm.png | 确认按钮 | 128x64 | PNG | - | ⏳ 待生成 |
| btn_cancel.png | 取消按钮 | 128x64 | PNG | - | ⏳ 待生成 |
| btn_small.png | 小按钮通用 | 64x64 | PNG | - | ⏳ 待生成 |
| btn_medium.png | 中按钮通用 | 128x64 | PNG | - | ⏳ 待生成 |
| btn_large.png | 大按钮通用 | 256x80 | PNG | - | ⏳ 待生成 |
| panel_border.png | 通用面板边框 | 九宫格 | PNG | - | ⏳ 待生成 |
| panel_bg.png | 通用面板背景 | 九宫格 | PNG | - | ⏳ 待生成 |

#### 设置界面（settings/）
| 文件名 | 描述 | 尺寸 | 格式 | 来源 | 状态 |
|--------|------|------|------|------|------|
| settings_panel_bg.png | 设置面板背景 | 512x512 | PNG | - | ⏳ 待生成 |
| toggle_on.png | 开关-开启 | 64x32 | PNG | - | ⏳ 待生成 |
| toggle_off.png | 开关-关闭 | 64x32 | PNG | - | ⏳ 待生成 |
| icon_sound.png | 音效图标 | 48x48 | PNG | - | ⏳ 待生成 |
| icon_music.png | 音乐图标 | 48x48 | PNG | - | ⏳ 待生成 |
| icon_clear_data.png | 清空数据图标 | 48x48 | PNG | - | ⏳ 待生成 |

#### 排行榜（leaderboard/）
| 文件名 | 描述 | 尺寸 | 格式 | 来源 | 状态 |
|--------|------|------|------|------|------|
| leaderboard_panel_bg.png | 排行榜背景 | 512x640 | PNG | - | ⏳ 待生成 |
| leaderboard_entry_normal.png | 条目背景-普通 | 480x64 | PNG | - | ⏳ 待生成 |
| leaderboard_entry_highlight.png | 条目背景-高亮 | 480x64 | PNG | - | ⏳ 待生成 |
| icon_refresh.png | 刷新图标 | 48x48 | PNG | - | ⏳ 待生成 |

#### 词条选择（modifier/）
| 文件名 | 描述 | 尺寸 | 格式 | 来源 | 状态 |
|--------|------|------|------|------|------|
| modifier_panel_bg.png | 词条选择背景 | 640x480 | PNG | - | ⏳ 待生成 |
| modifier_option_common.png | 词条背景-普通 | 192x256 | PNG | - | ⏳ 待生成 |
| modifier_option_rare.png | 词条背景-稀有 | 192x256 | PNG | - | ⏳ 待生成 |
| modifier_option_epic.png | 词条背景-史诗 | 192x256 | PNG | - | ⏳ 待生成 |

#### 游戏内UI（game/）
| 文件名 | 描述 | 尺寸 | 格式 | 来源 | 状态 |
|--------|------|------|------|------|------|
| skill_cooldown_mask.png | 技能冷却遮罩 | 64x64 | PNG | - | ⏳ 待生成 |
| target_progress_frame.png | 目标进度框 | 128x32 | PNG | - | ⏳ 待生成 |
| target_complete_check.png | 目标完成勾 | 48x48 | PNG | - | ⏳ 待生成 |

---

### 特效资源（effects/）

#### 消除特效（eliminate/）
| 文件名 | 描述 | 尺寸 | 格式 | 来源 | 状态 |
|--------|------|------|------|------|------|
| glow_effect.png | 光晕特效 | 128x128 | PNG | - | ⏳ 待生成 |
| flash_effect.png | 闪光特效 | 128x128 | PNG | - | ⏳ 待生成 |
| combo_burst.png | 连击爆发特效 | 256x256 | PNG | - | ⏳ 待生成 |

#### 方块特效（blocks/）
| 文件名 | 描述 | 尺寸 | 格式 | 来源 | 状态 |
|--------|------|------|------|------|------|
| block_highlight.png | 方块高亮边框 | 64x64 | PNG | - | ⏳ 待生成 |
| block_trail.png | 掉落拖尾 | 64x128 | PNG | - | ⏳ 待生成 |
| swap_arrow.png | 交换箭头 | 64x64 | PNG | - | ⏳ 待生成 |

#### 特殊特效（special/）
| 文件名 | 描述 | 尺寸 | 格式 | 来源 | 状态 |
|--------|------|------|------|------|------|
| rainbow_aura.png | 彩虹光环 | 80x80 | PNG | - | ⏳ 待生成 |
| ice_shatter_1.png | 冰块破碎-帧1 | 64x64 | PNG | - | ⏳ 待生成 |
| ice_shatter_2.png | 冰块破碎-帧2 | 64x64 | PNG | - | ⏳ 待生成 |
| ice_shatter_3.png | 冰块破碎-帧3 | 64x64 | PNG | - | ⏳ 待生成 |
| ice_shatter_4.png | 冰块破碎-帧4 | 64x64 | PNG | - | ⏳ 待生成 |
| stone_crack_1.png | 石头裂纹-帧1 | 64x64 | PNG | - | ⏳ 待生成 |
| stone_crack_2.png | 石头裂纹-帧2 | 64x64 | PNG | - | ⏳ 待生成 |
| stone_crack_3.png | 石头裂纹-帧3 | 64x64 | PNG | - | ⏳ 待生成 |
| stone_crack_4.png | 石头裂纹-帧4 | 64x64 | PNG | - | ⏳ 待生成 |

---

### 应用图标（icons/）
| 文件名 | 描述 | 尺寸 | 格式 | 来源 | 状态 |
|--------|------|------|------|------|------|
| icon_16.png | 应用图标 | 16x16 | PNG | - | ⏳ 待生成 |
| icon_32.png | 应用图标 | 32x32 | PNG | - | ⏳ 待生成 |
| icon_64.png | 应用图标 | 64x64 | PNG | - | ⏳ 待生成 |
| icon_128.png | 应用图标 | 128x128 | PNG | - | ⏳ 待生成 |
| icon_256.png | 应用图标 | 256x256 | PNG | - | ⏳ 待生成 |

---

## 状态说明

- ⏳ 待收集/待生成
- 🔄 进行中
- ✅ 已完成
- ⚠️ 需要修改
- ❌ 已废弃

---

## 更新日志

### 2026-02-13
- 创建资源库目录结构
- 创建索引文档
- 统计资源需求：音效22个、UI资源30个、特效9个、图标5个

---

## 使用说明

### 查找资源
1. 在本文档中搜索资源名称或描述
2. 查看状态列确认资源是否可用
3. 根据文件路径找到资源文件

### 添加新资源
1. 将文件放入对应目录
2. 更新本文档的索引表格
3. 填写来源、许可、状态等信息
4. 在CHANGELOG.md中记录更新

### 资源命名规范
- 全部小写
- 使用下划线分隔单词
- 描述性命名（如：button_click.mp3）
- 序列帧使用数字后缀（如：ice_shatter_1.png）

---

## 版权信息

所有资源的详细版权信息请查看 `docs/LICENSE.md`

---

*最后更新：2026-02-13 23:20*
*维护者：Eleven*
