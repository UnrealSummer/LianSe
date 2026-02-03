import { _decorator, Component } from 'cc';
import { EnemyData } from './EnemySystem';
const { ccclass } = _decorator;

/**
 * 关卡进度管理
 */
@ccclass('ProgressionManager')
export class ProgressionManager extends Component {
    private currentStage: number = 1;
    private totalGold: number = 0;
    private totalScore: number = 0;

    /**
     * 获取当前关卡的敌人数据
     */
    getCurrentEnemy(): EnemyData {
        // 敌人血量随关卡增长
        const baseHp = 50;
        const hpGrowth = 30; // 每关+30血
        const maxHp = baseHp + (this.currentStage - 1) * hpGrowth;

        return {
            id: `enemy_${this.currentStage}`,
            name: `敌人 Lv.${this.currentStage}`,
            maxHp: maxHp
        };
    }

    /**
     * 进入下一关
     */
    nextStage(): void {
        this.currentStage++;
        console.log(`[Progression] Stage ${this.currentStage}`);
    }

    /**
     * 重置进度
     */
    reset(): void {
        this.currentStage = 1;
        this.totalGold = 0;
        this.totalScore = 0;
    }

    /**
     * 添加金币
     */
    addGold(amount: number): void {
        this.totalGold += amount;
    }

    /**
     * 添加分数
     */
    addScore(amount: number): void {
        this.totalScore += amount;
    }

    /**
     * 获取当前关卡
     */
    getCurrentStage(): number {
        return this.currentStage;
    }

    /**
     * 获取总金币
     */
    getTotalGold(): number {
        return this.totalGold;
    }

    /**
     * 获取总分数
     */
    getTotalScore(): number {
        return this.totalScore;
    }
}
