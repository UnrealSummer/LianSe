# 《炼色》项目文档总索引

## 📚 文档说明

本项目的所有指引类文档统一存放在 `E:\Project\LianSe\Docs\` 目录下，按类型分类管理。

---

## 📁 目录结构

```
E:\Project\LianSe\Docs\
├── art/                    # 美术风格规范（新）⭐
│   ├── ART_STYLE_GUIDE.md           # 美术风格规范 ⭐⭐⭐⭐⭐
│   ├── ART_DOCS_INDEX.md            # 美术文档索引
│   └── PROTOTYPE_ASSETS_USAGE.md    # 原型图资源使用指南
│
├── art_resources/          # 美术资源工作流（旧）
│   ├── ART_WORKFLOW.md              # 美术资源工作流程
│   ├── lianse_art_requirements.md   # 美术需求清单
│   ├── generation_tasks.md          # AI生成任务
│   ├── bing_generation_guide.md     # Bing生成指南
│   └── (其他历史文档)
│
├── project_docs/           # 项目文档
│   ├── DEV_DOC.md                   # 开发文档
│   └── project-lianse.md            # 项目说明
│
├── memory/                 # 开发日志
│   ├── 2026-02-13.md                # 今天的工作日志
│   └── (历史日志)
│
├── development/            # 开发相关文档（待整理）
├── design/                 # 设计相关文档（待整理）
└── README.md              # 本文档（总索引）
```

---

## 🎨 美术文档

### 📂 art/ - 美术风格规范（最新）⭐

#### 1. ART_STYLE_GUIDE.md ⭐⭐⭐⭐⭐
**最重要的文档 - 美术风格规范**

**包含内容：**
- 完整的色彩系统（RGB值、渐变方向）
- 形状与尺寸规范（圆角、边距、间距）
- 视觉效果规范（渐变、高光、发光、阴影）
- 元素设计规范（宝石、UI、按钮、血条、图标）
- 背景设计规范
- 技术实现代码模板（Python）
- Cocos Creator适配规范
- 新资源创建流程
- 资源命名规范
- 质量检查清单

**用途：** 创建任何新美术资源前必读

**位置：** `E:\Project\LianSe\Docs\art\ART_STYLE_GUIDE.md`

**创建日期：** 2026-02-13（今天）

---

#### 2. ART_DOCS_INDEX.md
**美术文档索引和快速参考**

**包含内容：**
- 美术文档导航
- 已生成资源清单
- 工具和脚本说明
- 工作流程指引
- 资源类型对照表
- 快速参考（色彩、圆角、透明度）

**位置：** `E:\Project\LianSe\Docs\art\ART_DOCS_INDEX.md`

---

#### 3. PROTOTYPE_ASSETS_USAGE.md
**原型图资源使用指南**

**包含内容：**
- 18个原型图资源清单
- 资源特点说明
- Cocos Creator集成步骤
- 尺寸参考
- 使用建议

**位置：** `E:\Project\LianSe\Docs\art\PROTOTYPE_ASSETS_USAGE.md`

---

### 📂 art_resources/ - 美术资源工作流（历史）

这个目录包含之前的美术资源工作流程文档，主要记录了使用AI生成美术资源的过程。

**主要文档：**
- `ART_WORKFLOW.md` - 美术资源工作流程
- `lianse_art_requirements.md` - 美术需求清单
- `generation_tasks.md` - AI生成任务
- `bing_generation_guide.md` - Bing生成指南
- `FINAL_REPORT.md` - 最终报告

**注意：** 这些是历史文档，记录了之前的工作过程。**最新的美术规范请查看 `art/` 目录。**

---

## 📖 项目文档

### 📂 project_docs/

#### 1. DEV_DOC.md
**开发文档**

**包含内容：**
- 项目技术栈
- 开发环境配置
- 代码结构说明
- 开发规范

**位置：** `E:\Project\LianSe\Docs\project_docs\DEV_DOC.md`

---

#### 2. project-lianse.md
**项目说明**

**包含内容：**
- 项目概述
- 游戏玩法
- 技术选型
- 开发计划

**位置：** `E:\Project\LianSe\Docs\project_docs\project-lianse.md`

---

## 📝 开发日志

### 📂 memory/

记录每天的开发工作日志。

**最新日志：**
- `2026-02-13.md` - 今天的工作（原型图设计、美术资源生成、文档整理）
- `2026-02-12.md` - 昨天的工作
- `2026-02-06.md` - 之前的工作

**位置：** `E:\Project\LianSe\Docs\memory\`

---

## 🔗 相关资源位置

### 项目代码
```
E:\Project\LianSe\LSProject\
├── assets/              # 游戏资源和脚本
├── downloaded_assets/   # 下载的美术资源
│   └── prototype_assets/    # 原型图资源包（18个PNG）⭐
└── (其他项目文件)
```

### 原型图资源包（今天生成）⭐
```
E:\Project\LianSe\LSProject\downloaded_assets\prototype_assets\
├── blocks/          # 宝石方块（6个）
├── ui/              # UI元素（6个）
├── buttons/         # 按钮（4个）
└── icons/           # 图标（2个）
```

### 生成工具
```
C:\Users\yu.zhang01\clawd\lianse_prototype\
├── generate_assets_clean.py      # 资源生成脚本
├── game_main_screen_v2.html      # 原型图
└── game_assets/                  # 生成的资源（临时）
```

---

## 📖 快速开始

### 🎨 创建新美术资源
1. 阅读 `art/ART_STYLE_GUIDE.md` ⭐
2. 查找对应的资源类型章节
3. 按照规范创建资源
4. 使用质量检查清单验证
5. 导入到项目中

### 🖼️ 使用原型图资源
1. 阅读 `art/PROTOTYPE_ASSETS_USAGE.md`
2. 在Cocos Creator中刷新资源
3. 按照指南应用到场景中
4. 测试显示效果

### 📚 查找文档
1. 查看本总索引
2. 根据类型找到对应目录
3. 阅读具体文档

---

## 🆕 今天的更新（2026-02-13）

### 新增文档
- ✅ `art/ART_STYLE_GUIDE.md` - 完整的美术风格规范
- ✅ `art/ART_DOCS_INDEX.md` - 美术文档索引
- ✅ `art/PROTOTYPE_ASSETS_USAGE.md` - 原型图资源使用指南
- ✅ `README.md` - 项目文档总索引（本文档）

### 新增资源
- ✅ 18个原型图美术资源（PNG）
- ✅ 原型图HTML（game_main_screen_v2.html）
- ✅ 资源生成脚本（generate_assets_clean.py）

### 工作内容
1. 设计游戏主界面原型图（三消+Roguelike风格）
2. 根据原型图生成18个美术资源
3. 创建完整的美术风格规范文档
4. 整理项目文档结构

---

## 📊 文档状态

### 已完成
- ✅ 美术风格规范体系（art/）
- ✅ 原型图资源包（18个PNG）
- ✅ 项目文档总索引（本文档）
- ✅ 开发日志（memory/）

### 待整理
- ⏳ 开发相关文档（development/）
- ⏳ 设计相关文档（design/）
- ⏳ 项目根目录下的其他文档

---

## 🎯 文档使用指南

### 对于美术人员
**必读文档：**
1. `art/ART_STYLE_GUIDE.md` ⭐⭐⭐⭐⭐
2. `art/PROTOTYPE_ASSETS_USAGE.md`

**工作流程：**
1. 查阅风格规范
2. 创建/修改资源
3. 质量检查
4. 导入项目

---

### 对于开发人员
**必读文档：**
1. `project_docs/DEV_DOC.md`
2. `project_docs/project-lianse.md`

**工作流程：**
1. 查阅开发文档
2. 了解项目结构
3. 编写代码
4. 记录日志

---

### 对于策划人员
**必读文档：**
1. `project_docs/project-lianse.md`
2. `design/`（待整理）

**工作流程：**
1. 查阅项目说明
2. 设计游戏内容
3. 编写设计文档
4. 与团队沟通

---

## 🔍 快速查找

### 我想创建新的宝石方块
→ `art/ART_STYLE_GUIDE.md` § 元素设计规范 → 宝石方块设计规范

### 我想了解色彩规范
→ `art/ART_STYLE_GUIDE.md` § 色彩系统

### 我想使用原型图资源
→ `art/PROTOTYPE_ASSETS_USAGE.md`

### 我想了解项目整体情况
→ `project_docs/project-lianse.md`

### 我想查看今天的工作
→ `memory/2026-02-13.md`

---

## 📝 文档维护规范

### 添加新文档
1. 确定文档类型（美术/开发/设计/日志）
2. 放入对应目录
3. 更新本总索引
4. 更新对应的子索引

### 更新现有文档
1. 修改文档内容
2. 更新文档版本号和日期
3. 如有重大变更，更新索引说明
4. 记录到开发日志

### 文档命名规范
- 使用大写字母和下划线
- 清晰描述文档内容
- 例如：`ART_STYLE_GUIDE.md`、`DEV_DOC.md`

---

## 📚 总结

### 文档体系
```
总索引（本文档）
├── 美术文档（art/）⭐ 最新
│   ├── 风格规范
│   ├── 文档索引
│   └── 使用指南
├── 美术资源工作流（art_resources/）历史
├── 项目文档（project_docs/）
└── 开发日志（memory/）
```

### 核心文档
1. **ART_STYLE_GUIDE.md** - 美术风格规范 ⭐⭐⭐⭐⭐
2. **DEV_DOC.md** - 开发文档
3. **project-lianse.md** - 项目说明

### 使用原则
- 分类清晰
- 易于查找
- 持续维护
- 保持更新

---

**所有项目指引类文档现已统一管理在 `E:\Project\LianSe\Docs\` 目录下！**

---

*文档版本：v1.0*  
*创建日期：2026-02-13*  
*最后更新：2026-02-13*  
*维护者：Eleven*
