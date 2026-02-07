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
    timeLimit: number = 60;

    private timeLeft: number = 0;
    private isGameRunning: boolean = false;
    private chainLevel: number = 0;

    start() {
        console.log('[GameCore] Starting game...');
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
