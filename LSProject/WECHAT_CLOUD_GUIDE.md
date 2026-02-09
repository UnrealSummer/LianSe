# 微信云开发集成指南 - 排行榜系统

## 🎯 目标

使用微信云开发实现好友排行榜和全球排行榜功能

---

## 📚 什么是微信云开发？

**微信云开发（CloudBase）** 是微信提供的后端服务：
- **云数据库：** 存储用户数据、分数等
- **云存储：** 存储图片、音频等文件
- **云函数：** 运行后端逻辑

**优势：**
- 免费额度充足（个人开发够用）
- 不需要自己搭建服务器
- 自动扩容
- 安全可靠

---

## 🚀 第一步：开通云开发（10分钟）

### 1. 在微信开发者工具中开通

1. **打开微信开发者工具**
2. **打开你的小游戏项目**
   - 路径：build/wechat-game/
3. **点击"云开发"按钮**
   - 位置：工具栏右上角
4. **开通云开发**
   - 点击"开通"
   - 选择"按量付费"（免费额度）
   - 创建环境名称：lianSe-prod
   - 等待开通完成（1-2分钟）

### 2. 获取环境ID

开通后会显示环境ID，类似：
```
lianSe-prod-xxxxx
```

**记下这个ID，后面会用到！**

---

## 📦 第二步：初始化云开发（5分钟）

### 1. 在game.js中初始化

**位置：** build/wechat-game/game.js

**在游戏启动时添加：**

```javascript
// 初始化云开发
if (typeof wx !== 'undefined' && wx.cloud) {
    wx.cloud.init({
        env: 'lianSe-prod-xxxxx', // 替换为你的环境ID
        traceUser: true
    });
    console.log('[CloudBase] Initialized');
}
```

### 2. 在Cocos Creator中集成

**创建CloudManager.ts：**

```typescript
import { _decorator, Component, sys } from 'cc';
const { ccclass } = _decorator;

/**
 * 云开发管理器
 */
@ccclass('CloudManager')
export class CloudManager extends Component {
    private static instance: CloudManager = null;
    private isInitialized: boolean = false;
    private envId: string = 'lianSe-prod-xxxxx'; // 替换为你的环境ID

    onLoad() {
        if (CloudManager.instance) {
            this.destroy();
            return;
        }
        CloudManager.instance = this;

        this.initCloud();
    }

    static getInstance(): CloudManager {
        return CloudManager.instance;
    }

    /**
     * 初始化云开发
     */
    private initCloud(): void {
        if (typeof wx === 'undefined' || !wx.cloud) {
            console.warn('[CloudManager] Not in WeChat environment');
            return;
        }

        try {
            wx.cloud.init({
                env: this.envId,
                traceUser: true
            });
            this.isInitialized = true;
            console.log('[CloudManager] Cloud initialized');
        } catch (error) {
            console.error('[CloudManager] Init failed:', error);
        }
    }

    /**
     * 检查是否已初始化
     */
    isReady(): boolean {
        return this.isInitialized;
    }
}
```

---

## 👤 第三步：实现用户登录（15分钟）

### 1. 创建UserManager.ts

```typescript
import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

/**
 * 用户信息
 */
export interface UserInfo {
    openid: string;      // 用户唯一ID
    nickname: string;    // 昵称
    avatarUrl: string;   // 头像URL
}

/**
 * 用户管理器
 */
@ccclass('UserManager')
export class UserManager extends Component {
    private static instance: UserManager = null;
    private userInfo: UserInfo = null;

    onLoad() {
        if (UserManager.instance) {
            this.destroy();
            return;
        }
        UserManager.instance = this;
    }

    static getInstance(): UserManager {
        return UserManager.instance;
    }

    /**
     * 微信登录
     */
    async login(): Promise<boolean> {
        if (typeof wx === 'undefined') {
            console.warn('[UserManager] Not in WeChat');
            return false;
        }

        try {
            // 1. 调用wx.login获取code
            const loginRes = await this.wxLogin();
            console.log('[UserManager] Login code:', loginRes.code);

            // 2. 调用云函数获取openid
            const openid = await this.getOpenId(loginRes.code);
            console.log('[UserManager] OpenID:', openid);

            // 3. 保存用户信息
            this.userInfo = {
                openid: openid,
                nickname: '玩家' + openid.substring(0, 6),
                avatarUrl: ''
            };

            return true;
        } catch (error) {
            console.error('[UserManager] Login failed:', error);
            return false;
        }
    }

    /**
     * 获取用户信息（需要授权）
     */
    async getUserProfile(): Promise<boolean> {
        if (typeof wx === 'undefined') {
            return false;
        }

        return new Promise((resolve) => {
            wx.getUserProfile({
                desc: '用于显示昵称和头像',
                success: (res) => {
                    this.userInfo.nickname = res.userInfo.nickName;
                    this.userInfo.avatarUrl = res.userInfo.avatarUrl;
                    console.log('[UserManager] User profile:', this.userInfo);
                    resolve(true);
                },
                fail: (err) => {
                    console.error('[UserManager] Get profile failed:', err);
                    resolve(false);
                }
            });
        });
    }

    /**
     * 获取当前用户信息
     */
    getUserInfo(): UserInfo {
        return this.userInfo;
    }

    /**
     * 微信登录（Promise封装）
     */
    private wxLogin(): Promise<any> {
        return new Promise((resolve, reject) => {
            wx.login({
                success: resolve,
                fail: reject
            });
        });
    }

    /**
     * 获取OpenID（调用云函数）
     */
    private async getOpenId(code: string): Promise<string> {
        try {
            const res = await wx.cloud.callFunction({
                name: 'login',
                data: { code }
            });
            return res.result.openid;
        } catch (error) {
            console.error('[UserManager] Get OpenID failed:', error);
            throw error;
        }
    }
}
```

### 2. 创建云函数：login

**在微信开发者工具中：**

1. **点击"云开发"**
2. **点击"云函数"**
3. **新建云函数：login**
4. **编辑index.js：**

```javascript
// 云函数：login
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    
    return {
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
    };
};
```

5. **右键云函数 → 上传并部署**

---

## 📊 第四步：实现排行榜数据上传（15分钟）

### 1. 创建LeaderboardManager.ts

```typescript
import { _decorator, Component } from 'cc';
import { UserManager } from './UserManager';
const { ccclass } = _decorator;

/**
 * 排行榜数据
 */
export interface LeaderboardEntry {
    openid: string;
    nickname: string;
    avatarUrl: string;
    score: number;
    stage: number;
    maxCombo: number;
    timestamp: number;
}

/**
 * 排行榜管理器
 */
@ccclass('LeaderboardManager')
export class LeaderboardManager extends Component {
    private static instance: LeaderboardManager = null;

    onLoad() {
        if (LeaderboardManager.instance) {
            this.destroy();
            return;
        }
        LeaderboardManager.instance = this;
    }

    static getInstance(): LeaderboardManager {
        return LeaderboardManager.instance;
    }

    /**
     * 上传分数
     */
    async uploadScore(score: number, stage: number, maxCombo: number): Promise<boolean> {
        if (typeof wx === 'undefined' || !wx.cloud) {
            console.warn('[LeaderboardManager] Cloud not available');
            return false;
        }

        const userInfo = UserManager.getInstance().getUserInfo();
        if (!userInfo) {
            console.error('[LeaderboardManager] User not logged in');
            return false;
        }

        try {
            const db = wx.cloud.database();
            const _ = db.command;

            // 查询是否已有记录
            const queryRes = await db.collection('leaderboard')
                .where({
                    openid: userInfo.openid
                })
                .get();

            if (queryRes.data.length > 0) {
                // 更新记录（只在分数更高时）
                const existingScore = queryRes.data[0].score;
                if (score > existingScore) {
                    await db.collection('leaderboard')
                        .doc(queryRes.data[0]._id)
                        .update({
                            data: {
                                score: score,
                                stage: stage,
                                maxCombo: maxCombo,
                                nickname: userInfo.nickname,
                                avatarUrl: userInfo.avatarUrl,
                                timestamp: Date.now()
                            }
                        });
                    console.log('[LeaderboardManager] Score updated');
                }
            } else {
                // 新增记录
                await db.collection('leaderboard').add({
                    data: {
                        openid: userInfo.openid,
                        nickname: userInfo.nickname,
                        avatarUrl: userInfo.avatarUrl,
                        score: score,
                        stage: stage,
                        maxCombo: maxCombo,
                        timestamp: Date.now()
                    }
                });
                console.log('[LeaderboardManager] Score added');
            }

            return true;
        } catch (error) {
            console.error('[LeaderboardManager] Upload failed:', error);
            return false;
        }
    }

    /**
     * 获取全球排行榜
     */
    async getGlobalLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
        if (typeof wx === 'undefined' || !wx.cloud) {
            return [];
        }

        try {
            const db = wx.cloud.database();
            const res = await db.collection('leaderboard')
                .orderBy('score', 'desc')
                .limit(limit)
                .get();

            console.log('[LeaderboardManager] Global leaderboard:', res.data.length);
            return res.data as LeaderboardEntry[];
        } catch (error) {
            console.error('[LeaderboardManager] Get leaderboard failed:', error);
            return [];
        }
    }

    /**
     * 获取好友排行榜（需要云函数）
     */
    async getFriendsLeaderboard(): Promise<LeaderboardEntry[]> {
        if (typeof wx === 'undefined' || !wx.cloud) {
            return [];
        }

        try {
            const res = await wx.cloud.callFunction({
                name: 'getFriendsLeaderboard',
                data: {}
            });

            console.log('[LeaderboardManager] Friends leaderboard:', res.result.data.length);
            return res.result.data as LeaderboardEntry[];
        } catch (error) {
            console.error('[LeaderboardManager] Get friends leaderboard failed:', error);
            return [];
        }
    }

    /**
     * 获取我的排名
     */
    async getMyRank(): Promise<number> {
        if (typeof wx === 'undefined' || !wx.cloud) {
            return -1;
        }

        const userInfo = UserManager.getInstance().getUserInfo();
        if (!userInfo) {
            return -1;
        }

        try {
            const leaderboard = await this.getGlobalLeaderboard(1000);
            const myIndex = leaderboard.findIndex(entry => entry.openid === userInfo.openid);
            return myIndex + 1; // 排名从1开始
        } catch (error) {
            console.error('[LeaderboardManager] Get rank failed:', error);
            return -1;
        }
    }
}
```

### 2. 创建数据库集合

**在微信开发者工具中：**

1. **点击"云开发"**
2. **点击"数据库"**
3. **新建集合：leaderboard**
4. **设置权限：**
   - 所有用户可读
   - 仅创建者可写

---

## 🎨 第五步：创建排行榜UI（10分钟）

### 1. 创建LeaderboardUI.ts

```typescript
import { _decorator, Component, Node, Label, Prefab, instantiate, ScrollView } from 'cc';
import { LeaderboardManager, LeaderboardEntry } from './LeaderboardManager';
const { ccclass, property } = _decorator;

/**
 * 排行榜UI
 */
@ccclass('LeaderboardUI')
export class LeaderboardUI extends Component {
    @property(Node)
    panel: Node = null;

    @property(ScrollView)
    scrollView: ScrollView = null;

    @property(Node)
    content: Node = null;

    @property(Prefab)
    itemPrefab: Prefab = null;

    @property(Label)
    myRankLabel: Label = null;

    @property(Label)
    myScoreLabel: Label = null;

    private currentType: 'global' | 'friends' = 'global';

    start() {
        this.panel.active = false;
    }

    /**
     * 显示排行榜
     */
    async show(type: 'global' | 'friends' = 'global'): Promise<void> {
        this.currentType = type;
        this.panel.active = true;

        // 清空列表
        this.content.removeAllChildren();

        // 显示加载中
        console.log('[LeaderboardUI] Loading...');

        // 获取排行榜数据
        const manager = LeaderboardManager.getInstance();
        let leaderboard: LeaderboardEntry[] = [];

        if (type === 'global') {
            leaderboard = await manager.getGlobalLeaderboard(100);
        } else {
            leaderboard = await manager.getFriendsLeaderboard();
        }

        // 显示排行榜
        this.displayLeaderboard(leaderboard);

        // 显示我的排名
        const myRank = await manager.getMyRank();
        if (this.myRankLabel) {
            this.myRankLabel.string = myRank > 0 ? `第 ${myRank} 名` : '未上榜';
        }
    }

    /**
     * 隐藏排行榜
     */
    hide(): void {
        this.panel.active = false;
    }

    /**
     * 显示排行榜列表
     */
    private displayLeaderboard(leaderboard: LeaderboardEntry[]): void {
        for (let i = 0; i < leaderboard.length; i++) {
            const entry = leaderboard[i];
            const item = instantiate(this.itemPrefab);

            // 设置排名
            const rankLabel = item.getChildByName('Rank')?.getComponent(Label);
            if (rankLabel) {
                rankLabel.string = (i + 1).toString();
            }

            // 设置昵称
            const nameLabel = item.getChildByName('Name')?.getComponent(Label);
            if (nameLabel) {
                nameLabel.string = entry.nickname;
            }

            // 设置分数
            const scoreLabel = item.getChildByName('Score')?.getComponent(Label);
            if (scoreLabel) {
                scoreLabel.string = entry.score.toString();
            }

            // 添加到列表
            this.content.addChild(item);
        }

        console.log('[LeaderboardUI] Displayed', leaderboard.length, 'entries');
    }

    /**
     * 切换到全球排行
     */
    onGlobalTabClicked(): void {
        this.show('global');
    }

    /**
     * 切换到好友排行
     */
    onFriendsTabClicked(): void {
        this.show('friends');
    }

    /**
     * 关闭按钮
     */
    onCloseClicked(): void {
        this.hide();
    }
}
```

---

## 🎮 第六步：集成到游戏流程（10分钟）

### 1. 在游戏启动时登录

**在MainMenu.ts中：**

```typescript
import { UserManager } from './UserManager';
import { CloudManager } from './CloudManager';

async onLoad() {
    // 初始化云开发
    const cloudManager = this.node.addComponent(CloudManager);
    
    // 等待云开发初始化
    await this.waitForCloud(cloudManager);
    
    // 用户登录
    const userManager = this.node.addComponent(UserManager);
    const loginSuccess = await userManager.login();
    
    if (loginSuccess) {
        console.log('[MainMenu] Login success');
    } else {
        console.warn('[MainMenu] Login failed');
    }
}

private async waitForCloud(cloudManager: CloudManager): Promise<void> {
    return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
            if (cloudManager.isReady()) {
                clearInterval(checkInterval);
                resolve();
            }
        }, 100);
    });
}
```

### 2. 在游戏结束时上传分数

**在GameCore.ts中：**

```typescript
import { LeaderboardManager } from './LeaderboardManager';

onVictory() {
    // ... 现有代码 ...
    
    // 上传分数
    const leaderboardManager = LeaderboardManager.getInstance();
    if (leaderboardManager) {
        leaderboardManager.uploadScore(
            this.score,
            this.currentStage,
            this.maxCombo
        );
    }
}
```

### 3. 在主菜单添加排行榜按钮

**在MainMenu场景中：**

```typescript
onLeaderboardClicked() {
    // 显示排行榜
    const leaderboardUI = this.node.getComponentInChildren(LeaderboardUI);
    if (leaderboardUI) {
        leaderboardUI.show('global');
    }
}
```

---

## ✅ 集成检查清单

### 云开发配置
- [ ] 开通云开发
- [ ] 获取环境ID
- [ ] 初始化云开发

### 用户系统
- [ ] 创建UserManager.ts
- [ ] 创建login云函数
- [ ] 实现微信登录
- [ ] 实现获取用户信息

### 排行榜系统
- [ ] 创建LeaderboardManager.ts
- [ ] 创建leaderboard数据库集合
- [ ] 实现分数上传
- [ ] 实现排行榜查询

### UI集成
- [ ] 创建LeaderboardUI.ts
- [ ] 搭建排行榜UI
- [ ] 创建排行榜Item预制体
- [ ] 添加排行榜按钮

### 游戏集成
- [ ] 启动时登录
- [ ] 游戏结束上传分数
- [ ] 主菜单显示排行榜

---

## 🐛 常见问题

### Q1: 云开发初始化失败？
**A:**
1. 检查环境ID是否正确
2. 检查是否在微信环境中
3. 检查网络连接

### Q2: 登录失败？
**A:**
1. 检查login云函数是否上传
2. 检查云函数权限
3. 查看控制台错误信息

### Q3: 数据上传失败？
**A:**
1. 检查数据库集合是否创建
2. 检查数据库权限
3. 检查数据格式

### Q4: 排行榜显示为空？
**A:**
1. 检查是否有数据
2. 检查查询权限
3. 查看控制台日志

---

## 📊 数据库设计

### leaderboard集合

```json
{
    "_id": "自动生成",
    "openid": "用户唯一ID",
    "nickname": "玩家昵称",
    "avatarUrl": "头像URL",
    "score": 1000,
    "stage": 10,
    "maxCombo": 50,
    "timestamp": 1234567890
}
```

### 索引建议

```
score: 降序索引（用于排行榜查询）
openid: 唯一索引（用于查询用户数据）
```

---

## 🚀 下一步优化

### 1. 好友排行榜
- 创建getFriendsLeaderboard云函数
- 获取好友openid列表
- 查询好友数据

### 2. 分享功能
- 分享到好友
- 分享到群
- 带参数分享

### 3. 成就系统
- 创建achievements集合
- 记录成就进度
- 显示成就列表

### 4. 每日任务
- 创建dailyTasks集合
- 记录任务进度
- 发放奖励

---

## 📚 参考资源

### 官方文档
- [微信云开发文档](https://developers.weixin.qq.com/minigame/dev/wxcloud/basis/getting-started.html)
- [云数据库](https://developers.weixin.qq.com/minigame/dev/wxcloud/guide/database.html)
- [云函数](https://developers.weixin.qq.com/minigame/dev/wxcloud/guide/functions.html)

### 示例代码
- [微信小游戏示例](https://github.com/wechat-miniprogram/minigame-demo)

---

**按照这个文档集成，应该能完整实现排行榜功能！**

**有问题随时问我！**
