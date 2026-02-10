import { _decorator, Component, Node, Label, ScrollView, Prefab, instantiate, Color } from 'cc';
import { LeaderboardManager, LeaderboardEntry } from './LeaderboardManager';
import { UserManager } from './UserManager';
const { ccclass, property } = _decorator;

/**
 * 排行榜UI
 */
@ccclass('LeaderboardUI')
export class LeaderboardUI extends Component {
    @property(Node)
    leaderboardPanel: Node = null;

    @property(ScrollView)
    scrollView: ScrollView = null;

    @property(Node)
    contentNode: Node = null;

    @property(Prefab)
    entryPrefab: Prefab = null;

    @property(Label)
    myRankLabel: Label = null;

    @property(Label)
    myScoreLabel: Label = null;

    @property(Node)
    loadingNode: Node = null;

    @property(Node)
    emptyNode: Node = null;

    private leaderboardData: LeaderboardEntry[] = [];
    private myOpenId: string = '';

    start() {
        this.hideLeaderboard();
    }

    /**
     * 显示排行榜
     */
    async showLeaderboard(): Promise<void> {
        if (!this.leaderboardPanel) {
            console.error('[LeaderboardUI] Leaderboard panel not set');
            return;
        }

        this.leaderboardPanel.active = true;
        
        // 显示加载中
        if (this.loadingNode) {
            this.loadingNode.active = true;
        }
        if (this.emptyNode) {
            this.emptyNode.active = false;
        }

        // 获取当前用户OpenID
        const userManager = UserManager.getInstance();
        if (userManager) {
            const userInfo = userManager.getUserInfo();
            if (userInfo) {
                this.myOpenId = userInfo.openid;
            }
        }

        // 加载排行榜数据
        await this.loadLeaderboardData();

        // 隐藏加载中
        if (this.loadingNode) {
            this.loadingNode.active = false;
        }

        // 显示数据
        this.displayLeaderboard();
    }

    /**
     * 隐藏排行榜
     */
    hideLeaderboard(): void {
        if (this.leaderboardPanel) {
            this.leaderboardPanel.active = false;
        }
    }

    /**
     * 加载排行榜数据
     */
    private async loadLeaderboardData(): Promise<void> {
        const leaderboardManager = LeaderboardManager.getInstance();
        if (!leaderboardManager) {
            console.error('[LeaderboardUI] LeaderboardManager not found');
            return;
        }

        try {
            this.leaderboardData = await leaderboardManager.getGlobalLeaderboard(100);
            console.log('[LeaderboardUI] Loaded', this.leaderboardData.length, 'entries');
        } catch (error) {
            console.error('[LeaderboardUI] Load failed:', error);
            this.leaderboardData = [];
        }
    }

    /**
     * 显示排行榜数据
     */
    private displayLeaderboard(): void {
        if (!this.contentNode) {
            console.error('[LeaderboardUI] Content node not set');
            return;
        }

        // 清空现有内容
        this.contentNode.removeAllChildren();

        // 如果没有数据
        if (this.leaderboardData.length === 0) {
            if (this.emptyNode) {
                this.emptyNode.active = true;
            }
            return;
        }

        // 显示排行榜条目
        let myRank = -1;
        let myScore = 0;

        this.leaderboardData.forEach((entry, index) => {
            const rank = index + 1;
            const entryNode = this.createEntryNode(entry, rank);
            
            if (entryNode) {
                this.contentNode.addChild(entryNode);
            }

            // 记录自己的排名
            if (entry.openid === this.myOpenId) {
                myRank = rank;
                myScore = entry.score;
            }
        });

        // 更新自己的排名显示
        this.updateMyRank(myRank, myScore);
    }

    /**
     * 创建排行榜条目节点
     */
    private createEntryNode(entry: LeaderboardEntry, rank: number): Node {
        if (!this.entryPrefab) {
            // 如果没有预制体，创建简单的文本节点
            const node = new Node('Entry_' + rank);
            const label = node.addComponent(Label);
            label.string = `${rank}. ${entry.nickname} - ${entry.score}分 (关卡${entry.stage})`;
            label.fontSize = 24;
            
            // 如果是自己，高亮显示
            if (entry.openid === this.myOpenId) {
                label.color = new Color(255, 215, 0); // 金色
            }
            
            return node;
        }

        // 使用预制体
        const node = instantiate(this.entryPrefab);
        
        // 设置排名
        const rankLabel = node.getChildByName('RankLabel')?.getComponent(Label);
        if (rankLabel) {
            rankLabel.string = rank.toString();
        }

        // 设置昵称
        const nameLabel = node.getChildByName('NameLabel')?.getComponent(Label);
        if (nameLabel) {
            nameLabel.string = entry.nickname;
        }

        // 设置分数
        const scoreLabel = node.getChildByName('ScoreLabel')?.getComponent(Label);
        if (scoreLabel) {
            scoreLabel.string = entry.score.toString();
        }

        // 设置关卡
        const stageLabel = node.getChildByName('StageLabel')?.getComponent(Label);
        if (stageLabel) {
            stageLabel.string = '关卡' + entry.stage;
        }

        // 如果是自己，高亮显示
        if (entry.openid === this.myOpenId) {
            const bg = node.getChildByName('Background');
            if (bg) {
                // 可以改变背景颜色或添加特效
            }
        }

        return node;
    }

    /**
     * 更新自己的排名显示
     */
    private updateMyRank(rank: number, score: number): void {
        if (this.myRankLabel) {
            if (rank > 0) {
                this.myRankLabel.string = `我的排名: ${rank}`;
            } else {
                this.myRankLabel.string = '我的排名: 未上榜';
            }
        }

        if (this.myScoreLabel) {
            this.myScoreLabel.string = `我的分数: ${score}`;
        }
    }

    /**
     * 关闭按钮点击
     */
    onCloseButtonClick(): void {
        this.hideLeaderboard();
    }

    /**
     * 刷新按钮点击
     */
    async onRefreshButtonClick(): Promise<void> {
        await this.showLeaderboard();
    }
}
