import { _decorator, Component, Node } from 'cc';
import { EnemyData } from './EnemySystem';
import { LevelGenerator, LevelConfig } from './LevelGenerator';
import { GameUI } from './GameUI';
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
    private gameUI: GameUI = null;

    start() {
        // Auto-find LevelGenerator
        this.levelGenerator = this.node.parent.getChildByName('LevelGenerator')?.getComponent(LevelGenerator);
        if (!this.levelGenerator) {
            console.warn('[ProgressionManager] LevelGenerator not found, creating one');
            this.levelGenerator = new LevelGenerator();
        }
        
        // Find GameUI - try multiple ways
        this.gameUI = this.node.parent?.getComponentInChildren(GameUI);
        if (!this.gameUI) {
            // Try finding in Canvas
            const canvas = this.node.scene.getChildByName('Canvas');
            if (canvas) {
                this.gameUI = canvas.getComponentInChildren(GameUI);
            }
        }
        
        if (!this.gameUI) {
            console.error('[ProgressionManager] GameUI not found! UI will not update.');
        } else {
            console.log('[ProgressionManager] GameUI found, will update UI');
            // 初始化关卡显示
            this.updateLevelUI();
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
        this.updateLevelUI();
    }

    /**
     * 设置关卡（GM用）
     */
    setStage(stage: number): void {
        this.currentStage = stage;
        console.log(`[Progression] GM: Set stage to ${this.currentStage}`);
        this.updateLevelUI();
    }

    /**
     * 更新关卡UI显示
     */
    private updateLevelUI(): void {
        if (this.gameUI) {
            console.log(`[ProgressionManager] Updating UI to stage ${this.currentStage}`);
            this.gameUI.updateLevel(this.currentStage.toString());
        } else {
            console.warn('[ProgressionManager] Cannot update UI - GameUI not found');
        }
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
