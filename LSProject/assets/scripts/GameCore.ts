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
    
    @property({ tooltip: 'GM：起始关卡（1=正常，6=测试冰冻，11=测试石头）' })
    gmStartStage: number = 1;

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
    private totalMoves: number = 0;
    private maxCombo: number = 0;

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

        // Clicked same block - deselect
        if (this.selectedBlock.row === row && this.selectedBlock.col === col) {
            block.setSelected(false);
            this.selectedBlock = null;
            console.log(`[GameCore] Deselected block: [${row}, ${col}]`);
            return;
        }

        // Second selection - check if adjacent
        const dr = Math.abs(this.selectedBlock.row - row);
        const dc = Math.abs(this.selectedBlock.col - col);
        const isAdjacent = (dr === 1 && dc === 0) || (dr === 0 && dc === 1);

        if (!isAdjacent) {
            // Not adjacent, deselect first and select new
            const oldBlock = this.gridSystem.getBlockAt(this.selectedBlock.row, this.selectedBlock.col);
            if (oldBlock) oldBlock.setSelected(false);
            
            this.selectedBlock = { row, col };
            block.setSelected(true);
            console.log(`[GameCore] Not adjacent, reselected: [${row}, ${col}]`);
            return;
        }

        // Adjacent, try to swap
        console.log(`[GameCore] Swapping [${this.selectedBlock.row}, ${this.selectedBlock.col}] <-> [${row}, ${col}]`);
        const oldBlock = this.gridSystem.getBlockAt(this.selectedBlock.row, this.selectedBlock.col);
        if (oldBlock) oldBlock.setSelected(false);
        
        this.trySwap(this.selectedBlock.row, this.selectedBlock.col, row, col);
        this.selectedBlock = null;
    }

    startNewGame(): void {
        console.log('[GameCore] New game started');
        this.progressionManager.reset();
        
        // GM: Set start stage
        if (this.gmStartStage > 1) {
            console.log(`[GameCore] GM: Starting from stage ${this.gmStartStage}`);
            this.progressionManager.setStage(this.gmStartStage);
        }
        
        this.modifierSystem.clearAll();
        this.startStage();
    }

    startStage(): void {
        const currentStage = this.progressionManager.getCurrentStage();
        const levelConfig = this.progressionManager.getCurrentLevelConfig();
        
        console.log(`[GameCore] Starting stage ${currentStage}`);
        console.log(`[GameCore] Config: ${levelConfig.colorCount} colors, ${levelConfig.enemyHp} HP, ${levelConfig.timeLimit}s`);
        
        // Generate grid with progressive colors
        this.gridSystem.generateGrid(levelConfig.colorCount, levelConfig.obstacles);
        
        // Generate enemy
        const enemyData = this.progressionManager.getCurrentEnemy();
        this.enemySystem.initEnemy(enemyData);
        
        // Reset time (use level config)
        this.timeLeft = levelConfig.timeLimit;
        this.isGameRunning = true;
        
        // Reset stage stats
        this.totalMoves = 0;
        this.maxCombo = 0;
        
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
        
        // Check if blocks can move before swapping
        const block1 = this.gridSystem.getBlockAt(row1, col1);
        const block2 = this.gridSystem.getBlockAt(row2, col2);
        
        if (!block1?.canMove() || !block2?.canMove()) {
            console.log('[GameCore] Cannot swap: block is frozen or immovable');
            this.gridSystem.setProcessing(false);
            return;
        }
        
        this.totalMoves++; // Count move
        
        // Swap blocks with animation
        this.gridSystem.swapBlocks(row1, col1, row2, col2, () => {
            // Check if there are matches after swap
            const matches = this.gridSystem.findAllMatches();
            
            if (matches.length > 0) {
                // Valid swap, process matches
                console.log(`[GameCore] Valid swap! Found ${matches.length} matches`);
                this.processMatches(matches);
            } else {
                // Invalid swap, swap back (no need to check canMove again)
                console.log(`[GameCore] Invalid swap, swapping back`);
                this.gridSystem.swapBlocksForce(row2, col2, row1, col1, () => {
                    this.gridSystem.setProcessing(false);
                });
            }
        });
    }

    private processMatches(matches: Node[][]): void {
        this.chainLevel++;
        let totalDamage = 0;
        let allBlocks = matches.flat();

        // Check for rainbow blocks and add line/column clear
        const rainbowBlocks = allBlocks.filter(block => {
            const blockScript = block.getComponent('Block');
            return blockScript?.isRainbow();
        });

        if (rainbowBlocks.length > 0) {
            console.log(`[GameCore] 🌈 Rainbow block activated! Clearing lines/columns`);
            for (const rainbowBlock of rainbowBlocks) {
                const blockScript = rainbowBlock.getComponent('Block');
                const pos = blockScript.getPosition();
                
                // Clear entire row and column
                const lineBlocks = this.gridSystem.getLineBlocks(pos.row, pos.col);
                allBlocks = allBlocks.concat(lineBlocks);
            }
            
            // Remove duplicates
            allBlocks = Array.from(new Set(allBlocks));
        }

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
        
        // Show chain combo
        if (this.chainLevel > 1) {
            console.log(`[GameCore] 🔥 COMBO x${this.chainLevel}!`);
        }
        
        this.enemySystem.takeDamage(totalDamage);
        
        // Trigger nearby match for adjacent blocks (for frozen blocks)
        this.triggerNearbyMatch(allBlocks);
        
        // Remove blocks with animation, then drop
        this.gridSystem.removeBlocks(allBlocks).then(() => {
            this.gridSystem.dropBlocks(() => {
                // Check for chain matches
                const chainMatches = this.gridSystem.findAllMatches();
                if (chainMatches.length > 0) {
                    console.log(`[GameCore] Chain continues! Found ${chainMatches.length} more matches`);
                    this.processMatches(chainMatches);
                } else {
                    // Chain ended
                    if (this.chainLevel > 1) {
                        console.log(`[GameCore] ⭐ Chain ended! Total combo: x${this.chainLevel}`);
                        if (this.chainLevel > this.maxCombo) {
                            this.maxCombo = this.chainLevel;
                        }
                    }
                    this.gridSystem.setProcessing(false);
                    this.chainLevel = 0;
                    if (this.enemySystem.isDead()) {
                        this.onVictory();
                    }
                }
            });
        });
    }

    /**
     * Trigger nearby match for adjacent blocks (解冻冰冻方块)
     */
    private triggerNearbyMatch(matchedBlocks: Node[]): void {
        const affectedPositions = new Set<string>();
        
        // Get all adjacent positions
        for (const block of matchedBlocks) {
            const blockScript = block.getComponent('Block');
            if (!blockScript) continue;
            
            const pos = blockScript.getPosition();
            const adjacents = [
                { row: pos.row - 1, col: pos.col },
                { row: pos.row + 1, col: pos.col },
                { row: pos.row, col: pos.col - 1 },
                { row: pos.row, col: pos.col + 1 }
            ];
            
            for (const adj of adjacents) {
                if (adj.row >= 0 && adj.row < 8 && adj.col >= 0 && adj.col < 8) {
                    affectedPositions.add(`${adj.row},${adj.col}`);
                }
            }
        }
        
        // Trigger onNearbyMatch for affected blocks
        for (const posStr of affectedPositions) {
            const [row, col] = posStr.split(',').map(Number);
            const adjacentBlock = this.gridSystem.getBlockAt(row, col);
            if (adjacentBlock) {
                adjacentBlock.onNearbyMatch();
            }
        }
    }

    private onVictory(): void {
        this.isGameRunning = false;
        console.log('[GameCore] Victory! Stage completed!');
        console.log(`[GameCore] Stats: ${this.totalMoves} moves, max combo x${this.maxCombo}`);
        
        // Show modifier selection
        this.showModifierSelection();
    }

    /**
     * 显示词条选择
     */
    private showModifierSelection(): void {
        import('./Modifiers').then(({ getWeightedRandomModifiers }) => {
            const options = getWeightedRandomModifiers(3);
            
            console.log('[GameCore] 🎲 Choose a modifier:');
            options.forEach((mod, index) => {
                const rarityColor = mod.rarity === 'epic' ? '🟣' : mod.rarity === 'rare' ? '🔵' : '⚪';
                console.log(`  ${index + 1}. ${rarityColor} ${mod.name} - ${mod.description}`);
            });
            
            // TODO: Show UI for selection
            // For now, auto-select first one after delay
            setTimeout(() => {
                const selected = options[0];
                this.modifierSystem.addModifier(selected);
                console.log(`[GameCore] ✅ Selected: ${selected.name}`);
                
                // Next stage
                this.progressionManager.nextStage();
                setTimeout(() => {
                    console.log('[GameCore] Starting next stage...');
                    this.startStage();
                }, 1000);
            }, 2000);
        });
    }

    private onTimeUp(): void {
        this.isGameRunning = false;
        console.log('[GameCore] Time up! Game Over!');
        
        // Check if enemy is dead (victory) or alive (defeat)
        if (this.enemySystem.isDead()) {
            this.onVictory();
        } else {
            this.onDefeat();
        }
    }

    private onDefeat(): void {
        console.log('[GameCore] Defeat! Enemy survived!');
        console.log(`[GameCore] Enemy HP: ${this.enemySystem.getCurrentHp()} / ${this.enemySystem.getMaxHp()}`);
        
        // TODO: Show game over UI
        // For now, restart after delay
        setTimeout(() => {
            console.log('[GameCore] Restarting game...');
            this.startNewGame();
        }, 2000);
    }

    private updateUI(): void {
        const currentStage = this.progressionManager.getCurrentStage();
        const levelConfig = this.progressionManager.getCurrentLevelConfig();
        
        if (this.timeLabel) {
            const timeColor = this.timeLeft <= 10 ? 'red' : 'white';
            this.timeLabel.string = `时间: ${Math.ceil(this.timeLeft)}s`;
            // Warning color when time is low
            if (this.timeLeft <= 10) {
                this.timeLabel.node.setScale(1.2, 1.2, 1);
            } else {
                this.timeLabel.node.setScale(1, 1, 1);
            }
        }
        if (this.goldLabel) {
            this.goldLabel.string = `金币: ${this.progressionManager.getTotalGold()}`;
        }
        if (this.stageLabel) {
            this.stageLabel.string = `第${currentStage}关 (${levelConfig.colorCount}色)`;
        }
    }
}
