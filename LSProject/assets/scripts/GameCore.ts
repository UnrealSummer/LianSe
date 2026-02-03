import { _decorator, Component, Label } from 'cc';
import { GridSystem } from './GridSystem';
import { EnemySystem } from './EnemySystem';
import { DamageSystem } from './DamageSystem';
import { ModifierSystem, MatchData } from './ModifierSystem';
import { ProgressionManager } from './ProgressionManager';
const { ccclass, property } = _decorator;

/**
 * 游戏核心控制器 - ACB架构
 */
@ccclass('GameCore')
export class GameCore extends Component {
    @property(GridSystem)
    gridSystem: GridSystem = null;

    @property(EnemySystem)
    enemySystem: EnemySystem = null;

    @property(DamageSystem)
    damageSystem: DamageSystem = null;

    @property(ModifierSystem)
    modifierSystem: ModifierSystem = null;

    @property(ProgressionManager)
    progressionManager: ProgressionManager = null;

    @property(Label)
    timeLabel: Label = null;

    @property(Label)
    goldLabel: Label = null;

    @property(Label)
    stageLabel: Label = null;

    @property
    timeLimit: number = 60; // 60秒时间限制

    private timeLeft: number = 0;
    private isGameRunning: boolean = false;
    private chainLevel: number = 0;

    start() {
        this.startNewGame();
    }

    /**
     * 开始新游戏
     */
    startNewGame(): void {
        this.progressionManager.reset();
        this.modifierSystem.clearAll();
        this.startStage();
    }

    /**
     * 开始关卡
     */
    startStage(): void {
        // 生成网格
        this.gridSystem.generateGrid();

        // 生成敌人
        const enemyData = this.progressionManager.getCurrentEnemy();
        this.enemySystem.initEnemy(enemyData);

        // 重置时间
        this.timeLeft = this.timeLimit;
        this.isGameRunning = true;

        // 更新UI
        this.updateUI();

        console.log(`[GameCore] Stage ${this.progressionManager.getCurrentStage()} started`);
    }

    update(dt: number) {
        if (!this.isGameRunning) return;

        // 倒计时
        this.timeLeft -= dt;
        if (this.timeLeft <= 0) {
            this.timeLeft = 0;
            this.onTimeUp();
        }

        this.updateUI();

        // 自动检测消除
        if (!this.gridSystem.getProcessing()) {
            this.checkMatches();
        }
    }

    /**
     * 检测并处理消除
     */
    private checkMatches(): void {
        const matches = this.gridSystem.findAllMatches();
        
        if (matches.length > 0) {
            this.gridSystem.setProcessing(true);
            this.processMatches(matches);
        }
    }

    /**
     * 处理消除
     */
    private processMatches(matches: any[][]): void {
        matches.forEach(matchGroup => {
            // 构建消除数据
            const matchData: MatchData = {
                count: matchGroup.length,
                color: 0, // TODO: 获取实际颜色
                chainLevel: this.chainLevel,
                matchType: 'line',
                baseDamage: 0
            };

            // 计算伤害
            const damage = this.damageSystem.calculateMatchDamage(matchData);

            // 造成伤害
            this.enemySystem.takeDamage(damage);
            this.damageSystem.dealDamage(damage, this.enemySystem);

            // 检查击杀
            if (!this.enemySystem.isAlive()) {
                this.onEnemyDefeated();
            }

            // 消除方块
            this.gridSystem.removeBlocks(matchGroup);

            console.log(`[Match] ${matchData.count} blocks, ${damage} damage`);
        });

        // 处理掉落
        this.scheduleOnce(() => {
            this.gridSystem.handleGravity();
            
            // 增加连锁层数
            this.chainLevel++;
            
            // 继续检测
            this.scheduleOnce(() => {
                this.gridSystem.setProcessing(false);
                this.chainLevel = 0; // 重置连锁
            }, 0.5);
        }, 0.3);
    }

    /**
     * 敌人被击败
     */
    private onEnemyDefeated(): void {
        this.isGameRunning = false;
        this.damageSystem.triggerKill(this.enemySystem);

        console.log(`[GameCore] Enemy defeated!`);

        // 显示词条选择
        this.scheduleOnce(() => {
            this.showModifierSelection();
        }, 1.0);
    }

    /**
     * 显示词条选择
     */
    private showModifierSelection(): void {
        console.log(`[GameCore] Show modifier selection`);
        // TODO: 显示词条选择UI
        
        // 临时：直接进入下一关
        this.scheduleOnce(() => {
            this.progressionManager.nextStage();
            this.startStage();
        }, 2.0);
    }

    /**
     * 时间耗尽
     */
    private onTimeUp(): void {
        this.isGameRunning = false;
        console.log(`[GameCore] Time up! Game Over`);
        // TODO: 显示失败界面
    }

    /**
     * 更新UI
     */
    private updateUI(): void {
        if (this.timeLabel) {
            this.timeLabel.string = `时间: ${Math.ceil(this.timeLeft)}s`;
        }

        if (this.goldLabel) {
            this.goldLabel.string = `金币: ${this.progressionManager.getTotalGold()}`;
        }

        if (this.stageLabel) {
            this.stageLabel.string = `关卡: ${this.progressionManager.getCurrentStage()}`;
        }
    }
}
