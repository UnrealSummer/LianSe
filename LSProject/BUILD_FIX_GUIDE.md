# 构建后修复指南

每次在Cocos Creator中构建微信小游戏后，需要手动修复两个问题：

## 方法1：使用我（AI助手）

直接告诉我"修复构建"，我会自动执行修复。

## 方法2：手动复制文件

### 步骤1：复制cloudfunctions

在文件资源管理器中：
1. 打开 `E:\Project\LianSe\LSProject\cloudfunctions`
2. 复制整个cloudfunctions文件夹
3. 粘贴到 `E:\Project\LianSe\LSProject\build\wechatgame-001\`

### 步骤2：修复project.config.json

用文本编辑器打开：
`E:\Project\LianSe\LSProject\build\wechatgame-001\project.config.json`

找到这一行：
```json
"libVersion": "game",
```

改为：
```json
"libVersion": "3.14.2",
```

在 `"miniprogramRoot": "./",` 后面添加：
```json
"cloudfunctionRoot": "cloudfunctions/",
"cloudbaseRoot": "cloudfunctions/",
"cloudbaseEnv": "cloud1-1gmq4aiz75a438a0",
```

保存文件。

## 方法3：PowerShell命令（两条）

打开PowerShell，执行：

```powershell
cd E:\Project\LianSe\LSProject
Copy-Item -Recurse -Force cloudfunctions build\wechatgame-001\
```

然后用记事本手动修改project.config.json（见方法2）。

---

## 完成后

在微信开发者工具中打开项目：
`E:\Project\LianSe\LSProject\build\wechatgame-001`

应该不会再报错了！
