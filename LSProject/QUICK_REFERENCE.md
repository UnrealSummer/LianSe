# 快速参考 - 《炼色》开发

## 🚀 常用命令

### 构建后修复
```bash
cd E:\Project\LianSe\LSProject
python fix-build.py
```

或者告诉AI助手："修复构建"

### Git操作
```bash
# 查看状态
git status

# 提交更改
git add -A
git commit -m "描述"

# 推送到远程
git push origin main

# 查看标签
git tag -l

# 创建标签
git tag -a v0.x.0 -m "描述"
```

### 查看日志
```bash
# 查看提交历史
git log --oneline -10

# 查看文件改动
git diff
```

---

## 📁 重要文件位置

### 项目文件
- **项目根目录：** `E:\Project\LianSe\LSProject`
- **构建目录：** `E:\Project\LianSe\LSProject\build\wechatgame-001`
- **脚本目录：** `E:\Project\LianSe\LSProject\assets\scripts`

### 文档文件
- **开发计划：** `DEVELOPMENT_PLAN.md`
- **今日总结：** `SUMMARY_2026-02-10.md`
- **开发日志：** `DEV_LOG_2026-02-10.md`
- **构建指南：** `BUILD_FIX_GUIDE.md`

### 配置文件
- **云函数：** `cloudfunctions/login/`
- **项目配置：** `build/wechatgame-001/project.config.json`

---

## 🎮 核心组件

### 游戏逻辑
- **GameCore.ts** - 游戏核心逻辑
- **GridSystem.ts** - 方块网格系统
- **EnemySystem.ts** - 敌人系统
- **ModifierSystem.ts** - 词条系统

### UI组件
- **GameUI.ts** - 游戏主界面
- **MainMenuUI.ts** - 主菜单
- **LeaderboardUI.ts** - 排行榜界面

### 云开发
- **CloudManager.ts** - 云开发管理
- **UserManager.ts** - 用户管理
- **LeaderboardManager.ts** - 排行榜数据管理

---

## 🔧 常见问题

### Q: 构建后报错 libVersion
**A:** 运行 `python fix-build.py` 或告诉AI"修复构建"

### Q: 金币/关卡数不更新
**A:** 检查GameUI组件是否正确关联，查看控制台日志

### Q: 排行榜按钮不工作
**A:** 确保按钮命名为 CloseButton 和 RefreshButton

### Q: 云函数上传失败
**A:** 检查云环境配置，确保在微信开发者工具中选择了正确的环境

---

## 📊 版本历史

- **v0.1.0** - 初始版本，基础玩法
- **v0.2.0** - 云开发集成
- **v0.3.0** - 排行榜UI
- **v0.4.0** - UI更新修复和自动化

---

## 🎯 下一步

1. 验证UI更新功能
2. 游戏平衡调整
3. 添加新内容
4. 美术音效优化

---

## 💡 快速提示

- 每次构建后记得运行修复脚本
- 提交代码前先测试
- 遇到问题先查看控制台日志
- 定期备份和推送代码

---

**保持这个文件在手边，随时参考！** 📖
