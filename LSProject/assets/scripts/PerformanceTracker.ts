import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

/**
 * 表现评级
 */
export type PerformanceRank = 'S' | 'A' | 'B' | 'C';

/**
 * 表现数据
 */
export interface PerformanceData {
    maxChain: number;           // 最大连锁层数
    totalMatches: number;       // 总消除次数
    totalDamage: number;        // 总伤害
    timeLeft: number;           // 剩余时间
    timeUsed: number;           // 使用时间
    rank: PerformanceRank;      // 评级
    bonusModifiers: number;     // 奖励词条数量
}

/**
 * 表现追踪器 - 追踪玩家表现并给予奖励
 */
@ccclass('PerformanceTracker')
export class PerformanceTracker extends Component {
    // 当前关卡数据
    private maxChain: number = 0;
    private totalMatches: number = 0;
    private totalDamage: number = 0;
    private initialTime: number = 30;
    private timeLeft: number = 30;

    // 评级阈值
    private static RANK_THRESHOLDS = {
        S: { maxChain: 5, totalMatches: 15, timeLeft: 15 },
        A: { maxChain: 4, totalMatches: 12, timeLeft: 10 },
        B: { maxChain: 3, totalMatches: 8, timeLeft: 5 },
        C: { maxChain: 0, totalMatches: 0, timeLeft: 0 }
    };

    // 奖励词条数量
    private static RANK_REWARDS = {
        S: 2,  // S级：额外2个词条选择（3选1 → 5选1）
        A: 1,  // A级：额外1个词条选择（3选1 → 4选1）
        B: 0,  // B级：无奖励（3选1）
        C: 0   // C级：无奖励（3选1）
    };

    start() {
        this.reset();
    }

    /**
     * 重置追踪器
     */
    reset(initialTime: number = 30): void {
        this.maxChain = 0;
        this.totalMatches = 0;
        this.totalDamage = 0;
        this.initialTime = initialTime;
        this.timeLeft = initialTime;
        console.log('[PerformanceTracker] Reset');
    }

    /**
     * 记录消除
     */
    recordMatch(chainLevel: number, damage: number): void {
        this.totalMatches++;
        this.totalDamage += damage;
        
        if (chainLevel > this.maxChain) {
            this.maxChain = chainLevel;
            console.log(`[PerformanceTracker] New max chain: ${this.maxChain}`);
        }
    }

    /**
     * 更新剩余时间
     */
    updateTimeLeft(timeLeft: number): void {
        this.timeLeft = timeLeft;
    }

    /**
     * 计算评级
     */
    calculateRank(): PerformanceRank {
        const thresholds = PerformanceTracker.RANK_THRESHOLDS;
        
        // S级：所有指标都达到S级阈值
        if (this.maxChain >= thresholds.S.maxChain &&
            this.totalMatches >= thresholds.S.totalMatches &&
            this.timeLeft >= thresholds.S.timeLeft) {
            return 'S';
        }
        
        // A级：至少2个指标达到A级阈值
        let aCount = 0;
        if (this.maxChain >= thresholds.A.maxChain) aCount++;
        if (this.totalMatches >= thresholds.A.totalMatches) aCount++;
        if (this.timeLeft >= thresholds.A.timeLeft) aCount++;
        
        if (aCount >= 2) {
            return 'A';
        }
        
        // B级：至少1个指标达到B级阈值
        if (this.maxChain >= thresholds.B.maxChain ||
            this.totalMatches >= thresholds.B.totalMatches ||
            this.timeLeft >= thresholds.B.timeLeft) {
            return 'B';
        }
        
        // C级：其他情况
        return 'C';
    }

    /**
     * 获取奖励词条数量
     */
    getBonusModifiers(rank: PerformanceRank): number {
        return PerformanceTracker.RANK_REWARDS[rank];
    }

    /**
     * 获取表现数据
     */
    getPerformanceData(): PerformanceData {
        const rank = this.calculateRank();
        const bonusModifiers = this.getBonusModifiers(rank);
        const timeUsed = this.initialTime - this.timeLeft;
        
        return {
            maxChain: this.maxChain,
            totalMatches: this.totalMatches,
            totalDamage: this.totalDamage,
            timeLeft: this.timeLeft,
            timeUsed: timeUsed,
            rank: rank,
            bonusModifiers: bonusModifiers
        };
    }

    /**
     * 获取评级颜色（用于UI显示）
     */
    getRankColor(rank: PerformanceRank): string {
        switch (rank) {
            case 'S': return '#FFD700';  // 金色
            case 'A': return '#C0C0C0';  // 银色
            case 'B': return '#CD7F32';  // 铜色
            case 'C': return '#808080';  // 灰色
            default: return '#FFFFFF';
        }
    }

    /**
     * 获取评级描述
     */
    getRankDescription(rank: PerformanceRank): string {
        switch (rank) {
            case 'S': return '完美表现！';
            case 'A': return '优秀表现！';
            case 'B': return '良好表现';
            case 'C': return '继续努力';
            default: return '';
        }
    }

    /**
     * 获取详细评价
     */
    getDetailedFeedback(): string[] {
        const feedback: string[] = [];
        const thresholds = PerformanceTracker.RANK_THRESHOLDS;
        
        // 连锁评价
        if (this.maxChain >= thresholds.S.maxChain) {
            feedback.push(`🔗 连锁大师！最大${this.maxChain}连锁`);
        } else if (this.maxChain >= thresholds.A.maxChain) {
            feedback.push(`🔗 连锁不错！最大${this.maxChain}连锁`);
        } else if (this.maxChain >= thresholds.B.maxChain) {
            feedback.push(`🔗 连锁${this.maxChain}层`);
        } else {
            feedback.push(`🔗 尝试更多连锁`);
        }
        
        // 消除评价
        if (this.totalMatches >= thresholds.S.totalMatches) {
            feedback.push(`💥 消除专家！共${this.totalMatches}次消除`);
        } else if (this.totalMatches >= thresholds.A.totalMatches) {
            feedback.push(`💥 消除不错！共${this.totalMatches}次消除`);
        } else if (this.totalMatches >= thresholds.B.totalMatches) {
            feedback.push(`💥 消除${this.totalMatches}次`);
        } else {
            feedback.push(`💥 提高消除效率`);
        }
        
        // 时间评价
        if (this.timeLeft >= thresholds.S.timeLeft) {
            feedback.push(`⏱️ 时间充裕！剩余${this.timeLeft.toFixed(1)}秒`);
        } else if (this.timeLeft >= thresholds.A.timeLeft) {
            feedback.push(`⏱️ 时间不错！剩余${this.timeLeft.toFixed(1)}秒`);
        } else if (this.timeLeft >= thresholds.B.timeLeft) {
            feedback.push(`⏱️ 剩余${this.timeLeft.toFixed(1)}秒`);
        } else {
            feedback.push(`⏱️ 注意时间管理`);
        }
        
        return feedback;
    }

    /**
     * 打印表现报告
     */
    printReport(): void {
        const data = this.getPerformanceData();
        console.log('========== Performance Report ==========');
        console.log(`Rank: ${data.rank} (${this.getRankDescription(data.rank)})`);
        console.log(`Max Chain: ${data.maxChain}`);
        console.log(`Total Matches: ${data.totalMatches}`);
        console.log(`Total Damage: ${data.totalDamage}`);
        console.log(`Time Left: ${data.timeLeft.toFixed(1)}s / ${this.initialTime}s`);
        console.log(`Bonus Modifiers: +${data.bonusModifiers}`);
        console.log('Feedback:');
        this.getDetailedFeedback().forEach(line => console.log(`  ${line}`));
        console.log('========================================');
    }

    /**
     * 获取当前统计数据（用于实时显示）
     */
    getCurrentStats(): {
        maxChain: number;
        totalMatches: number;
        totalDamage: number;
    } {
        return {
            maxChain: this.maxChain,
            totalMatches: this.totalMatches,
            totalDamage: this.totalDamage
        };
    }
}
