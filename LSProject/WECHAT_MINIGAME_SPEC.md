# 项目目标和平台规范

## 🎯 项目目标

**目标平台：微信小游戏**

**最终目的：成功上线微信小游戏平台**

---

## 📱 微信小游戏平台要求

### 1. 技术规范

#### 包体大小限制
- **首包大小：** ≤ 4MB（强制要求）
- **分包大小：** 每个分包 ≤ 4MB
- **总包大小：** ≤ 20MB（所有分包总和）

**策略：**
- 使用分包加载
- 资源动态加载
- 压缩图片和音频

#### 性能要求
- **启动时间：** < 3秒
- **帧率：** ≥ 30 FPS
- **内存占用：** < 200MB

#### 适配要求
- **屏幕方向：** 竖屏（Portrait）
- **安全区域：** 适配刘海屏
- **分辨率：** 750x1334 基准

---

### 2. 功能规范

#### 必须实现的功能
- ✅ 微信登录（wx.login）
- ✅ 用户授权（wx.getUserInfo）
- ✅ 分享功能（wx.shareAppMessage）
- ✅ 转发到群（wx.shareAppMessage）
- ⚠️ 排行榜（开放数据域或云开发）
- ⚠️ 数据存储（云开发或本地存储）

#### 推荐实现的功能
- ⭐ 云开发（数据库、存储、云函数）
- ⭐ 好友排行榜
- ⭐ 群排行榜
- ⭐ 成就系统
- ⭐ 每日任务

#### 禁止的功能
- ❌ 虚拟支付（需要特殊资质）
- ❌ 诱导分享
- ❌ 强制授权
- ❌ 违规内容

---

### 3. 审核要求

#### 必须准备的材料
1. **小游戏信息**
   - 名称：炼色
   - 简介：三消+Roguelike战斗游戏
   - 类目：休闲游戏
   - 标签：三消、Roguelike、策略

2. **资质文件**
   - 软件著作权（可选，但推荐）
   - ICP备案（如果有服务器）

3. **测试账号**
   - 提供测试微信号
   - 提供测试流程说明

4. **隐私政策**
   - 用户数据收集说明
   - 数据使用说明

#### 审核注意事项
- 不能有bug和闪退
- 不能有违规内容
- 不能诱导分享
- 不能强制授权
- 必须有明确的游戏玩法

---

## 🛠️ 开发规范

### 1. Cocos Creator配置

#### 项目设置
```
项目设置 → 构建发布
- 平台：微信小游戏
- AppID：填写微信小游戏AppID
- 启动场景：MainMenu
- 屏幕方向：Portrait（竖屏）
- 设计分辨率：750x1334
```

#### 构建选项
```
- 调试模式：开发时开启，发布时关闭
- Source Maps：开发时开启，发布时关闭
- 内联所有SpriteFrame：关闭（减小包体）
- MD5 Cache：开启（版本更新）
- 分离引擎：开启（减小首包）
```

---

### 2. 资源优化

#### 图片资源
- **格式：** PNG（透明）或 JPG（不透明）
- **压缩：** 使用TinyPNG压缩
- **尺寸：** 尽量使用2的幂次方
- **图集：** 合并小图到图集

#### 音频资源
- **格式：** MP3（推荐）
- **码率：** 128kbps
- **时长：** 背景音乐 < 2分钟，音效 < 5秒

#### 字体资源
- **使用系统字体**（不增加包体）
- 或使用位图字体（只包含需要的字符）

---

### 3. 代码规范

#### 微信API使用
```typescript
// 检查API是否存在
if (typeof wx !== 'undefined') {
    // 使用微信API
    wx.login({...});
} else {
    // 浏览器预览模式
    console.log('Not in WeChat environment');
}
```

#### 错误处理
```typescript
wx.login({
    success: (res) => {
        // 成功处理
    },
    fail: (err) => {
        // 失败处理
        console.error('Login failed:', err);
    }
});
```

#### 性能优化
- 使用对象池
- 及时释放资源
- 避免频繁GC
- 使用节流和防抖

---

## 📦 分包策略

### 主包（< 4MB）
- 启动场景（MainMenu）
- 核心脚本
- 必要的UI资源
- 小的音效

### 分包1：游戏场景（< 4MB）
- Main场景
- 游戏脚本
- 方块资源
- UI资源

### 分包2：音频资源（< 4MB）
- 背景音乐
- 大的音效

### 远程资源
- 大图片
- 视频（如果有）
- 可选资源

---

## 🔐 数据存储方案

### 本地存储
```typescript
// 使用微信的本地存储
wx.setStorageSync('key', value);
const value = wx.getStorageSync('key');
```

**限制：**
- 单个key最大1MB
- 总大小最大10MB

### 云开发（推荐）
```typescript
// 云数据库
wx.cloud.database().collection('users').add({...});

// 云存储
wx.cloud.uploadFile({...});

// 云函数
wx.cloud.callFunction({...});
```

**优势：**
- 免费额度充足
- 自动扩容
- 安全可靠

---

## 🎮 社交功能实现

### 1. 用户登录
```typescript
// 静默登录
wx.login({
    success: (res) => {
        // 获取code
        // 发送到云函数换取openid
    }
});
```

### 2. 获取用户信息
```typescript
// 需要用户授权
wx.getUserProfile({
    desc: '用于显示昵称和头像',
    success: (res) => {
        // 获取昵称、头像
    }
});
```

### 3. 分享功能
```typescript
// 主动分享
wx.shareAppMessage({
    title: '炼色 - 三消Roguelike',
    imageUrl: 'share.jpg',
    query: 'from=share'
});

// 监听分享按钮
wx.showShareMenu({
    withShareTicket: true
});

wx.onShareAppMessage(() => {
    return {
        title: '炼色 - 三消Roguelike',
        imageUrl: 'share.jpg'
    };
});
```

### 4. 排行榜
```typescript
// 使用云开发实现
// 上传分数
wx.cloud.callFunction({
    name: 'updateScore',
    data: {
        score: 1000,
        stage: 10
    }
});

// 获取排行榜
wx.cloud.callFunction({
    name: 'getLeaderboard',
    data: {
        type: 'friends' // 或 'global'
    }
});
```

---

## 🚀 发布流程

### 1. 开发阶段
1. 在Cocos Creator中开发
2. 使用微信开发者工具预览
3. 真机调试测试

### 2. 测试阶段
1. 完整测试所有功能
2. 测试不同机型
3. 测试网络异常情况
4. 性能测试

### 3. 构建阶段
1. Cocos Creator构建微信小游戏
2. 优化资源（压缩、分包）
3. 检查包体大小
4. 生成正式版本

### 4. 上传阶段
1. 在微信开发者工具中上传
2. 填写版本号和更新说明
3. 提交审核

### 5. 审核阶段
1. 等待审核（1-7天）
2. 如果被拒，根据反馈修改
3. 重新提交

### 6. 发布阶段
1. 审核通过后发布
2. 监控数据
3. 收集反馈

---

## ✅ 开发检查清单

### 功能完成度
- [ ] 游戏核心玩法完整
- [ ] 微信登录集成
- [ ] 用户信息获取
- [ ] 分享功能
- [ ] 排行榜功能
- [ ] 数据存储
- [ ] 音效音乐

### 性能优化
- [ ] 首包 < 4MB
- [ ] 启动时间 < 3秒
- [ ] 帧率 ≥ 30 FPS
- [ ] 内存 < 200MB
- [ ] 资源压缩优化

### 适配测试
- [ ] 竖屏适配
- [ ] 刘海屏适配
- [ ] 不同分辨率测试
- [ ] 不同机型测试

### 审核准备
- [ ] 无bug和闪退
- [ ] 无违规内容
- [ ] 不诱导分享
- [ ] 不强制授权
- [ ] 隐私政策完整
- [ ] 测试账号准备

---

## 📚 参考资源

### 官方文档
- [微信小游戏开发文档](https://developers.weixin.qq.com/minigame/dev/guide/)
- [Cocos Creator微信小游戏](https://docs.cocos.com/creator/manual/zh/publish/publish-wechatgame.html)
- [微信云开发](https://developers.weixin.qq.com/minigame/dev/wxcloud/basis/getting-started.html)

### 工具
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- [TinyPNG](https://tinypng.com/) - 图片压缩
- [MP3压缩](https://www.mp3smaller.com/) - 音频压缩

---

## 🎯 当前项目状态

### 已完成
- ✅ 游戏核心玩法
- ✅ 三消系统
- ✅ 战斗系统
- ✅ 词条系统
- ✅ 本地数据存储

### 待完成（微信小游戏相关）
- ⚠️ 微信登录集成
- ⚠️ 用户信息获取
- ⚠️ 分享功能
- ⚠️ 排行榜（云开发）
- ⚠️ 包体优化（< 4MB）
- ⚠️ 性能优化
- ⚠️ 适配测试

---

## 🚀 下一步行动

### 优先级1：微信小游戏基础集成
1. 配置微信小游戏构建
2. 集成微信登录
3. 集成分享功能
4. 测试基础功能

### 优先级2：云开发集成
1. 开通云开发
2. 实现数据上传
3. 实现排行榜
4. 测试云功能

### 优先级3：优化和适配
1. 资源压缩
2. 分包配置
3. 性能优化
4. 适配测试

### 优先级4：审核准备
1. 完善隐私政策
2. 准备测试账号
3. 完整测试
4. 提交审核

---

**所有开发都要以成功上线微信小游戏为目标！**
