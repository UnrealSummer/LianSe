# 微信小游戏构建后处理

每次在Cocos Creator中构建微信小游戏后，需要运行此脚本。

## 使用方法

在PowerShell中运行：

```powershell
cd E:\Project\LianSe\LSProject
.\post-build.ps1
```

## 脚本功能

1. **复制cloudfunctions目录**
   - 从项目根目录复制到构建目录
   - 包含login云函数

2. **修复project.config.json**
   - 添加cloudfunctionRoot配置
   - 添加cloudbaseEnv配置
   - 修复libVersion字段

## 为什么需要这个脚本？

Cocos Creator每次构建都会重新生成project.config.json，
会丢失云开发相关的配置。这个脚本自动修复这些问题。

## 下次构建流程

1. 在Cocos Creator中构建
2. 运行 `.\post-build.ps1`
3. 在微信开发者工具中打开项目
4. 测试游戏
