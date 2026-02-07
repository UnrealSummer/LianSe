import { _decorator, Component, Label, Node } from 'cc';
import { GridSystem } from './GridSystem';
import { EnemySystem } from './EnemySystem';
import { DamageSystem } from './DamageSystem';
import { ModifierSystem, MatchData } from './ModifierSystem';
import { ProgressionManager } from './ProgressionManager';
const { ccclass, property } = _decorator;

/**
 * Game Core Controller
 * Main game logic controller
 */
@ccclass('GameCore')
export class GameCore extends Component {
    @property
    timeLimit: number = 60;

    private gridSystem: GridSystem = null;
    private enemySystem: EnemySystem = null;
    private damageSystem: DamageSystem = null;
    private modifierSystem: ModifierSystem = null;
    private progressionManager: ProgressionManager = null;
    private timeLabel: Label = null;
    private goldLabel: Label = null;
    private stageLabel: Label = null;

    private timeLeft: number = 0;
    private isGameRunning: boolean = false;
    private chainLevel: number = 0;

    start() {
        console.log('[GameCore] Starting game...');
        
        // Auto-find components if not set
        if (!this.gridSystem) {
            const gridNode = this.node.getChildByName('GridSystem');
            console.log('[GameCore] GridSystem node:', gridNode?.name);
            this.gridSystem = gridNode?.getComponent(GridSystem);
        }
        if (!this.enemySystem) {
            const enemyNode = this.node.getChildByName('EnemySystem');
            console.log('[GameCore] EnemySystem node:', enemyNode?.name);
            this.enemySystem = enemyNode?.getComponent(EnemySystem);
        }
        if (!this.damageSystem) {
            const damageNode = this.node.getChildByName('DamageSystem');
            console.log('[GameCore] DamageSystem node:', damageNode?.name);
            this.damageSystem = damageNode?.getComponent(DamageSystem);
        }
        if (!this.modifierSystem) {
            const modifierNode = this.node.getChildByName('ModifierSystem');
            console.log('[GameCore] ModifierSystem node:', modifierNode?.name);
            this.modifierSystem = modifierNode?.getComponent(ModifierSystem);
        }
        if (!this.progressionManager) {
            const progressionNode = this.node.getChildByName('ProgressionManager');
            console.log('[GameCore] ProgressionManager node:', progressionNode?.name);
            this.progressionManager = progressionNode?.getComponent(ProgressionManager);
        }
        
        // Auto-find UI labels
        const uiNode = this.node.parent.getChildByName('UI');
        if (uiNode) {
            if (!this.timeLabel) {
                this.timeLabel = uiNode.getChildByName('TimeLabel')?.getComponent(Label);
            }
            if (!this.goldLabel) {
                this.goldLabel = uiNode.getChildByName('GoldLabel')?.getComponent(Label);
            }
            if (!this.stageLabel) {
                this.stageLabel = uiNode.getChildByName('StageLabel')?.getComponent(Label);
            }
        }
        
        console.log('[GameCore] Components found:', {
            gridSystem: !!this.gridSystem,
            enemySystem: !!this.enemySystem,
            damageSystem: !!this.damageSystem,
            modifierSystem: !!this.modifierSystem,
            progressionManager: !!this.progressionManager
        });
        
        // Check if all required components are found
        if (!this.progressionManager) {
            console.error('[GameCore] ProgressionManager not found! Please check node structure.');
            return;
        }
        if (!this.gridSystem) {
            console.error('[GameCore] GridSystem not found! Please check node structure.');
            return;
        }
        if (!this.enemySystem) {
            console.error('[GameCore] EnemySystem not found! Please check node structure.');
            return;
        }
        
        this.startNewGame();
        
        // Listen for block swap events
        this.node.on('block-swapped', this.onBlockSwapped, this);
    }

    startNewGame(): void {
        console.log('[GameCore] New game started');
        this.progressionManager.reset();
        this.modifierSystem.clearAll();
        this.startStage();
    }

    startStage(): void {
        const currentStage = this.progressionManager.getCurrentStage();
        console.log(`[GameCore] Starting stage ${currentStage}`);
        
        // Generate grid (basic 3 colors for now)
        this.gridSystem.generateGrid(3, []);
        
        // Generate enemy
        const enemyData = this.progressionManager.getCurrentEnemy();
        this.enemySystem.initEnemy(enemyData);
        
        // Reset time
        this.timeLeft = this.timeLimit;
        this.isGameRunning = true;
        
        this.updateUI();
    }

    update(dt: number) {
        if (!this.isGameRunning) return;
        
        this.timeLeft -= dt;
        if (this.timeLeft <= 0) {
            this.timeLeft = 0;
            this.onTimeUp();
        }
        
        this.updateUI();
        
        // Auto check matches (will be replaced by player swap later)
        if (!this.gridSystem.getProcessing()) {
            this.checkMatches();
        }
    }

    private checkMatches(): void {
        const matches = this.gridSystem.findAllMatches();
        if (matches.length > 0) {
            this.gridSystem.setProcessing(true);
            this.processMatches(matches);
        }
    }

    private processMatches(matches: Node[][]): void {
        this.chainLevel++;
        let totalDamage = 0;

        for (const match of matches) {
            const matchData: MatchData = {
                blocks: match,
                chainLevel: this.chainLevel
            };
            const damage = this.damageSystem.calculateDamage(matchData);
            totalDamage += damage;
            this.modifierSystem.applyModifiers(matchData);
        }

        this.enemySystem.takeDamage(totalDamage);
        const allBlocks = matches.flat();
        this.gridSystem.removeBlocks(allBlocks);

        setTimeout(() => {
            this.gridSystem.dropBlocks(() => {
                this.gridSystem.setProcessing(false);
                this.chainLevel = 0;
                if (this.enemySystem.isDead()) {
                    this.onVictory();
                }
            });
        }, 300);
    }

    private onBlockSwapped(event: any): void {
        if (!this.isGameRunning || this.gridSystem.getProcessing()) {
            return;
        }

        const { fromRow, fromCol, toRow, toCol } = event;
        console.log(`[GameCore] Block swapped: [${fromRow},${fromCol}] -> [${toRow},${toCol}]`);
        
        // TODO: Implement swap logic
    }

    private onVictory(): void {
        this.isGameRunning = false;
        console.log('[GameCore] Victory!');
        this.progressionManager.nextStage();
        setTimeout(() => this.startStage(), 1000);
    }

    private onTimeUp(): void {
        this.isGameRunning = false;
        console.log('[GameCore] Time up!');
    }

    private updateUI(): void {
        if (this.timeLabel) {
            this.timeLabel.string = `Time: ${Math.ceil(this.timeLeft)}s`;
        }
        if (this.goldLabel) {
            this.goldLabel.string = `Gold: 0`;
        }
        if (this.stageLabel) {
            this.stageLabel.string = `Stage: ${this.progressionManager.getCurrentStage()}`;
        }
    }
}
