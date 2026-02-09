# 文档清理建议

## 📊 当前状态

**总计：75个Markdown文档**

---

## 🗑️ 建议删除的文档（过期/重复）

### 1. 旧的开发日志（已完成，可归档）
```
DEV_SUMMARY_2026-02-07.md
DEV_LOG_2026-02-06.md
DEV_LOG_2026-02-07.md (如果存在)
```
**原因：** 开发日志已完成，可以移到archive目录

---

### 2. 重复的UI配置指南（已被新版本替代）
```
UI_DESIGN_SPEC.md              # 被 UI_DESIGN_SPEC_V2.md 替代
BLOCK_SPRITE_CONFIG.md         # 被 BLOCK_SPRITE_CONFIG_V2.md 替代
GAMEOVER_SETUP.md              # 被 GAME_OVER_UI_GUIDE.md 替代
GAMEOVER_UI_SETUP.md           # 被 GAME_OVER_UI_GUIDE.md 替代
UI_SETUP.md                    # 被 UI_BUILD_GUIDE.md 替代
```
**原因：** 有更新的版本

---

### 3. 已完成的临时指南（功能已实现）
```
SCENE_SETUP.md                 # 场景已搭建完成
QUICK_SETUP.md                 # 快速设置已完成
MOBILE_PORTRAIT_SETUP.md       # 移动端已配置
ENEMY_UI_SETUP.md              # 敌人UI已完成
MODIFIER_UI_SETUP.md           # 词条UI待完善，但这个文档过期
EFFECT_SETUP.md                # 特效已设置
COIN_SYSTEM_SETUP.md           # 金币系统已完成
DATA_PERSISTENCE_SETUP.md      # 数据持久化已完成
AUDIO_SETUP.md                 # 音频系统待实现，但文档过期
```
**原因：** 功能已实现，配置指南不再需要

---

### 4. 过期的测试文档
```
AUTOTEST_SETUP.md              # 自动测试未实现
QUICK_TEST.md                  # 快速测试已过期
TEST_CHECKLIST.md              # 测试清单已过期
UNIT_TESTS.md                  # 单元测试未实现
MODIFIER_TEST.md               # 词条测试已过期
TESTING.md                     # 通用测试文档过期
```
**原因：** 测试方案已改变或未实现

---

### 5. 过期的开发计划
```
DEVELOPMENT_PLAN.md            # 被 DEVELOPMENT_PLAN_COMPLETE.md 替代
ROADMAP.md                     # 路线图已过期
NEXT_STEPS.md                  # 下一步已过期
TODO.md                        # 被 TODO_2026-02-09.md 替代
POLISH_PLAN.md                 # 优化计划已过期
UPDATE_PHASE1.md               # 更新阶段1已完成
POLISH_UPDATE_V1.md            # 优化更新已过期
```
**原因：** 计划已过期或被新版本替代

---

### 6. 过期的分析文档
```
GAME_ANALYSIS.md               # 游戏分析已过期
BALANCE_ANALYSIS.md            # 平衡分析已过期
UI_FEEDBACK.md                 # UI反馈已过期
BUG_FIX_REPORT.md              # Bug修复报告已过期
```
**原因：** 分析结果已过期

---

### 7. 已完成的功能文档（可归档）
```
MODIFIER_UPDATE.md             # 词条更新已完成
MODIFIERS_COMPLETE.md          # 词条完成文档
MODIFIER_RARITY_DESIGN.md      # 稀有度设计已实现
MODIFIER_VERIFICATION.md       # 词条验证已完成
OBSTACLE_IMPLEMENTATION.md     # 障碍物实现已完成
LEVEL_DEPTH_DESIGN.md          # 关卡深度设计已实现
ENEMY_DESIGN.md                # 敌人设计已实现
```
**原因：** 功能已完成，文档可归档

---

### 8. 临时文档
```
GOOD_MORNING.md                # 临时问候文档
WHATS_NEW.md                   # 更新日志已过期
VERSION1_RELEASE.md            # V1发布文档已过期
GM_GRAVITY_TEST.md             # GM重力测试已完成
```
**原因：** 临时性文档

---

### 9. 资源生成文档（已完成）
```
DALLE_GENERATION_LIST.md       # DALL-E生成列表
DALLE_SINGLE_BLOCK_PROMPTS.md  # DALL-E提示词
ART_ASSETS_LIST.md             # 美术资源列表
```
**原因：** 资源已生成完成

---

## ✅ 建议保留的文档（核心/最新）

### 当前开发文档
```
DEV_LOG_2026-02-08.md          # 最新开发日志
TODO_2026-02-09.md             # 今天的计划
SUMMARY_2026-02-08.md          # 昨天的总结
CLEANUP_CHECKLIST.md           # 清理清单
```

### 项目核心文档
```
README.md                      # 项目说明
PROJECT_SUMMARY.md             # 项目总结
MISSING_FEATURES.md            # 缺失功能分析
DEVELOPMENT_PLAN_COMPLETE.md   # 完整开发计划
```

### 最新配置指南
```
GAME_FLOW_GUIDE.md             # 游戏流程指南
MAIN_MENU_BUILD_GUIDE.md       # 主菜单指南
GAME_OVER_UI_GUIDE.md          # 游戏结束UI指南
TIMER_DISPLAY_SETUP.md         # 倒计时设置
ADD_TIMER_UI_GUIDE.md          # 添加倒计时指南
UI_BUILD_GUIDE.md              # UI搭建指南
GAME_UI_LAYOUT.md              # 游戏UI布局
```

### 资源文档
```
RESOURCES_OVERVIEW.md          # 资源概览
RESOURCES_USAGE_GUIDE.md       # 资源使用指南
BLOCK_SPRITE_CONFIG_V2.md      # 方块配置V2
BLOCK_DEBUG_GUIDE.md           # 方块调试指南
BLOCK_TEXTURE_GUIDE.md         # 方块纹理指南
UI_DESIGN_SPEC_V2.md           # UI设计规范V2
```

### UI指南
```
UI_QUICK_START.md              # UI快速开始
UI_BEAUTIFY_GUIDE.md           # UI美化指南
MAIN_MENU_SUMMARY.md           # 主菜单总结
```

### 系统文档
```
AUDIO_SYSTEM.md                # 音频系统（待实现）
LOCAL_STORAGE.md               # 本地存储
DEV_DOC.md                     # 开发文档
```

---

## 📋 清理统计

### 建议删除：约45个文档
- 旧开发日志：3个
- 重复UI指南：5个
- 已完成临时指南：9个
- 过期测试文档：6个
- 过期开发计划：7个
- 过期分析文档：4个
- 已完成功能文档：7个
- 临时文档：4个
- 资源生成文档：3个

### 建议保留：约30个文档
- 当前开发文档：4个
- 项目核心文档：4个
- 最新配置指南：7个
- 资源文档：6个
- UI指南：3个
- 系统文档：3个

---

## 🎯 清理方案

### 方案A：删除过期文档（推荐）⭐⭐⭐⭐⭐
**直接删除不需要的文档**
- 优点：项目更清爽
- 缺点：历史信息丢失（但有Git历史）

### 方案B：归档旧文档
**创建archive目录，移动旧文档**
```
LSProject/
├── docs/              # 当前文档
└── archive/           # 归档文档
    ├── dev-logs/      # 开发日志
    ├── old-guides/    # 旧指南
    └── completed/     # 已完成功能
```
- 优点：保留历史
- 缺点：目录更复杂

### 方案C：只保留核心文档
**只保留10-15个最重要的文档**
- 优点：极简
- 缺点：可能删除有用信息

---

## 💡 我的建议

**使用方案A：直接删除过期文档**

理由：
1. Git历史保留所有内容
2. 项目更清爽易维护
3. 减少混淆
4. 需要时可以从Git恢复

---

**要我帮你清理这些过期文档吗？**
