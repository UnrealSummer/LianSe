# 数据存储和好友排行实现方案

## 📊 当前状态

### ✅ 已有的数据存储系统

**DataManager.ts** 已经实现：
- ✅ 本地数据存储（localStorage）
- ✅ 最高关卡记录
- ✅ 总金币统计
- ✅ 总移动次数
- ✅ 最大连击记录
- ✅ 总游戏时间
- ✅ 成就系统

**存储的数据：**
```typescript
{
    maxStage: number,        // 最高关卡
    totalCoins: number,      // 总金币
    totalMoves: number,      // 总移动次数
    maxCombo: number,        // 最大连击
    totalPlayTime: number,   // 总游戏时间
    achievements: string[]   // 成就列表
}
```

---

## 🎯 需要添加的功能

### 1. 好友排行系统

**需要实现：**
- 玩家ID/昵称系统
- 分数计算系统
- 排行榜UI
- 好友数据同步（本地或云端）

---

## 💡 实现方案

### 方案A：本地排行榜（简单，30分钟）⭐⭐⭐⭐⭐

**特点：**
- 只在本地设备上记录
- 多个玩家可以在同一设备上比较
- 不需要服务器
- 适合单机游戏

**实现：**
1. 扩展DataManager，添加玩家系统
2. 记录多个玩家的数据
3. 创建排行榜UI
4. 显示本地排行

**优点：**
- 简单快速
- 不需要网络
- 不需要服务器

**缺点：**
- 只能本地排行
- 换设备数据丢失

---

### 方案B：云端排行榜（复杂，2-3小时）⭐⭐⭐

**特点：**
- 全球排行榜
- 真正的好友系统
- 数据云端存储
- 需要后端服务

**实现：**
1. 搭建后端服务（Node.js/Firebase/LeanCloud）
2. 实现用户注册/登录
3. 实现数据上传
4. 实现排行榜查询
5. 创建排行榜UI

**优点：**
- 真正的全球排行
- 数据永久保存
- 可以添加好友

**缺点：**
- 需要服务器
- 需要网络
- 开发时间长

---

### 方案C：混合方案（中等，1小时）⭐⭐⭐⭐

**特点：**
- 本地排行 + 简单的云端同步
- 使用第三方服务（如LeanCloud免费版）
- 不需要自己搭建服务器

**实现：**
1. 使用LeanCloud/Firebase等BaaS服务
2. 简单的数据上传
3. 排行榜查询
4. 本地缓存

**优点：**
- 有云端排行
- 不需要自己搭建服务器
- 开发时间适中

**缺点：**
- 依赖第三方服务
- 可能有使用限制

---

## 🎯 推荐方案

### 推荐：方案A - 本地排行榜（30分钟）

**理由：**
1. 快速实现
2. 不需要服务器
3. 适合当前项目阶段
4. 后期可以升级到云端

---

## 📋 方案A详细实现步骤

### 第一步：扩展数据结构（5分钟）

**添加玩家系统：**

```typescript
// 玩家数据
export interface PlayerData {
    id: string;              // 玩家ID
    name: string;            // 玩家昵称
    maxStage: number;        // 最高关卡
    totalCoins: number;      // 总金币
    maxCombo: number;        // 最大连击
    totalScore: number;      // 总分数
    lastPlayTime: number;    // 最后游戏时间
}

// 排行榜数据
export interface LeaderboardData {
    players: PlayerData[];   // 玩家列表
    currentPlayerId: string; // 当前玩家ID
}
```

---

### 第二步：扩展DataManager（10分钟）

**添加方法：**

```typescript
// 创建/切换玩家
createPlayer(name: string): string

// 获取当前玩家
getCurrentPlayer(): PlayerData

// 获取所有玩家
getAllPlayers(): PlayerData[]

// 获取排行榜（按分数排序）
getLeaderboard(sortBy: 'score' | 'stage' | 'coins'): PlayerData[]

// 更新玩家数据
updatePlayerData(playerId: string, data: Partial<PlayerData>): void
```

---

### 第三步：创建排行榜UI（10分钟）

**LeaderboardUI.ts：**

```typescript
@ccclass('LeaderboardUI')
export class LeaderboardUI extends Component {
    @property(Node)
    itemContainer: Node = null;
    
    @property(Prefab)
    itemPrefab: Prefab = null;
    
    show(sortBy: 'score' | 'stage' | 'coins') {
        // 获取排行榜数据
        const leaderboard = DataManager.getInstance().getLeaderboard(sortBy);
        
        // 显示排行榜
        this.displayLeaderboard(leaderboard);
    }
}
```

---

### 第四步：搭建UI（5分钟）

**节点结构：**

```
Canvas
└── LeaderboardPanel (Node, Active: false)
    ├── Background (半透明遮罩)
    └── Panel
        ├── Title (Label - "排行榜")
        ├── TabButtons (切换排序方式)
        │   ├── ScoreTab ("分数")
        │   ├── StageTab ("关卡")
        │   └── CoinsTab ("金币")
        ├── ItemContainer (ScrollView)
        │   └── Content
        │       └── LeaderboardItem (Prefab)
        │           ├── Rank (Label - "1")
        │           ├── Name (Label - "玩家名")
        │           └── Score (Label - "1000")
        └── CloseButton
```

---

## 🎮 使用流程

### 1. 首次启动

```
游戏启动
  ↓
检查是否有玩家数据
  ↓
如果没有 → 显示输入昵称界面
  ↓
创建玩家
  ↓
进入游戏
```

### 2. 查看排行榜

```
主菜单
  ↓
点击"排行榜"按钮
  ↓
显示排行榜
  ↓
可以切换排序方式（分数/关卡/金币）
```

### 3. 多玩家切换

```
主菜单
  ↓
点击"切换玩家"按钮
  ↓
显示玩家列表
  ↓
选择玩家或创建新玩家
```

---

## 📊 分数计算系统

### 建议的分数公式

```typescript
totalScore = 
    maxStage * 1000 +           // 关卡分
    totalCoins * 1 +             // 金币分
    maxCombo * 100 +             // 连击分
    totalMoves * 0.1             // 移动分
```

**示例：**
- 最高关卡10 → 10,000分
- 总金币5000 → 5,000分
- 最大连击50 → 5,000分
- 总移动1000 → 100分
- **总分：20,100分**

---

## ✅ 实现检查清单

### 代码部分
- [ ] 扩展PlayerData接口
- [ ] 扩展LeaderboardData接口
- [ ] 添加玩家管理方法到DataManager
- [ ] 添加排行榜查询方法
- [ ] 创建LeaderboardUI.ts
- [ ] 创建分数计算方法

### UI部分
- [ ] 创建LeaderboardPanel节点
- [ ] 创建排行榜Item预制体
- [ ] 创建玩家输入界面
- [ ] 在主菜单添加"排行榜"按钮
- [ ] 在主菜单添加"切换玩家"按钮

### 测试
- [ ] 创建多个玩家
- [ ] 游玩并记录数据
- [ ] 查看排行榜
- [ ] 切换排序方式
- [ ] 切换玩家

---

## 🚀 开始实现

### 预计时间：30分钟

1. **扩展DataManager**（10分钟）
2. **创建LeaderboardUI**（10分钟）
3. **搭建UI**（5分钟）
4. **测试**（5分钟）

---

## 💡 后续扩展

### 如果想要云端排行榜

**可以后期添加：**
1. 使用LeanCloud/Firebase
2. 上传玩家数据
3. 查询全球排行
4. 添加好友系统

**本地排行榜的代码可以复用！**

---

**要开始实现本地排行榜吗？**

**还是想直接做云端排行榜？**
