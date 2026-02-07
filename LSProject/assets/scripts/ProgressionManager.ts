import { _decorator, Component, Node } from 'cc';
import { EnemyData } from './EnemySystem';
import { LevelGenerator, LevelConfig } from './LevelGenerator';
const { ccclass } = _decorator;

/**
 * 关卡进度管理
 */
@ccclass('ProgressionManager')
export class ProgressionManager extends Component {
    private currentStage: number = 1;
    private totalGold: number = 0;
    private totalScore: number = 0;
    private levelGenerator: LevelGenerator = null;

    start() {
        // Auto-find LevelGenerator
        this.levelGenerator = this.node.parent.getChildByName('LevelGenerator')?.getComponent(LevelGenerator);
        if (!this.levelGenerator) {
            console.warn('[ProgressionManager] LevelGenerator not found, creating one');
            this.levelGenerator = new LevelGenerator();
        }
    }

    /**
     * 获取当前关卡配置
     */
    getCurrentLevelConfig(): LevelConfig {
        // Lazy init if not found
        if (!this.levelGenerator) {
            this.levelGenerator = this.node.parent.getChildByName('LevelGenerator')?.getComponent(LevelGenerator);
            if (!this.levelGenerator) {
                console.warn('[ProgressionManager] LevelGenerator not found, creating inline instance');
                // Create inline instance as fallback
                const tempNode = new Node('TempLevelGenerator');
                this.levelGenerator = tempNode.addComponent(LevelGenerator);
            }
        }
        return this.levelGenerator.generateLevel(this.currentStage);
    }

    /**
     * 获取当前关卡的敌人数据
     */
    getCurrentEnemy(): EnemyData {
        const config = this.getCurrentLevelConfig();
        
        return {
            id: `enemy_${this.currentStage}`,
            name: `敌人 Lv.${this.currentStage}`,
            maxHp: config.enemyHp
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
