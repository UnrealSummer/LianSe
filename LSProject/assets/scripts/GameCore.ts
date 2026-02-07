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
    @property({ tooltip: '每关时间限制（秒）' })
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
    private selectedBlock: { row: number, col: number } = null;

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
        
        // Listen for block click events
        this.node.on('block-clicked', this.onBlockClicked, this);
    }

    private onBlockClicked(event: any): void {
        if (!this.isGameRunning || this.gridSystem.getProcessing()) {
            return;
        }

        const { row, col, block } = event;
        console.log(`[GameCore] Block clicked: [${row}, ${col}]`);

        // First selection
        if (!this.selectedBlock) {
            this.selectedBlock = { row, col };
            block.setSelected(true);
            console.log(`[GameCore] Selected first block: [${row}, ${col}]`);
            return;
        }

        // Second selection - check if adjacent
        const dr = Math.abs(this.selectedBlock.row - row);
        const dc = Math.abs(this.selectedBlock.col - col);
        const isAdjacent = (dr === 1 && dc === 0) || (dr === 0 && dc === 1);

        if (!isAdjacent) {
            // Not adjacent, deselect first and select new
            this.gridSystem.getBlockAt(this.selectedBlock.row, this.selectedBlock.col)?.setSelected(false);
            this.selectedBlock = { row, col };
            block.setSelected(true);
            console.log(`[GameCore] Not adjacent, reselected: [${row}, ${col}]`);
            return;
        }

        // Adjacent, try to swap
        console.log(`[GameCore] Swapping [${this.selectedBlock.row}, ${this.selectedBlock.col}] <-> [${row}, ${col}]`);
        this.gridSystem.getBlockAt(this.selectedBlock.row, this.selectedBlock.col)?.setSelected(false);
        this.trySwap(this.selectedBlock.row, this.selectedBlock.col, row, col);
        this.selectedBlock = null;
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
    }

    private trySwap(row1: number, col1: number, row2: number, col2: number): void {
        this.gridSystem.setProcessing(true);
        
        // Swap blocks with animation
        this.gridSystem.swapBlocks(row1, col1, row2, col2, () => {
            // Check if there are matches after swap
            const matches = this.gridSystem.findAllMatches();
            
            if (matches.length > 0) {
                // Valid swap, process matches
                console.log(`[GameCore] Valid swap! Found ${matches.length} matches`);
                this.processMatches(matches);
            } else {
                // Invalid swap, swap back
                console.log(`[GameCore] Invalid swap, swapping back`);
                this.gridSystem.swapBlocks(row2, col2, row1, col1, () => {
                    this.gridSystem.setProcessing(false);
                });
            }
        });
    }

    private processMatches(matches: Node[][]): void {
        this.chainLevel++;
        let totalDamage = 0;

        for (const match of matches) {
            const matchData: MatchData = {
                blocks: match,
                chainLevel: this.chainLevel,
                count: match.length,
                matchType: 'normal',
                baseDamage: 0
            };
            const damage = this.damageSystem.calculateMatchDamage(matchData);
            totalDamage += damage;
        }

        console.log(`[GameCore] Chain ${this.chainLevel}: ${totalDamage} damage`);
        this.enemySystem.takeDamage(totalDamage);
        
        const allBlocks = matches.flat();
        this.gridSystem.removeBlocks(allBlocks);

        setTimeout(() => {
            this.gridSystem.dropBlocks(() => {
                // Check for chain matches
                const chainMatches = this.gridSystem.findAllMatches();
                if (chainMatches.length > 0) {
                    console.log(`[GameCore] Chain continues! Found ${chainMatches.length} more matches`);
                    this.processMatches(chainMatches);
                } else {
                    this.gridSystem.setProcessing(false);
                    this.chainLevel = 0;
                    if (this.enemySystem.isDead()) {
                        this.onVictory();
                    }
                }
            });
        }, 300);
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
