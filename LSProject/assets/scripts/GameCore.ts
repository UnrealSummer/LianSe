import { _decorator, Component, Label, Node } from 'cc';
import { GridSystem } from './GridSystem';
import { EnemySystem } from './EnemySystem';
import { DamageSystem } from './DamageSystem';
import { ModifierSystem, MatchData } from './ModifierSystem';
import { ProgressionManager } from './ProgressionManager';
import { ModifierSelectionUI } from './ModifierSelectionUI';
import { EffectManager } from './EffectManager';
import { CoinSystem } from './CoinSystem';
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
    private modifierSelectionUI: ModifierSelectionUI = null;
    private effectManager: EffectManager = null;
    private coinSystem: CoinSystem = null;
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
        if (!this.coinSystem) {
            const coinNode = this.node.getChildByName('CoinSystem');
            console.log('[GameCore] CoinSystem node:', coinNode?.name);
            this.coinSystem = coinNode?.getComponent(CoinSystem);
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
        
        // Auto-find ModifierSelectionUI
        const modifierUINode = this.node.parent.getChildByName('ModifierSelectionUI');
        if (modifierUINode) {
            this.modifierSelectionUI = modifierUINode.getComponent(ModifierSelectionUI);
        }
        
        // Auto-find EffectManager
        const effectManagerNode = this.node.parent.getChildByName('EffectManager');
        if (effectManagerNode) {
            this.effectManager = effectManagerNode.getComponent(EffectManager);
        }
        
        console.log('[GameCore] Components found:', {
            gridSystem: !!this.gridSystem,
            enemySystem: !!this.enemySystem,
            damageSystem: !!this.damageSystem,
            modifierSystem: !!this.modifierSystem,
            progressionManager: !!this.progressionManager,
            modifierSelectionUI: !!this.modifierSelectionUI,
            effectManager: !!this.effectManager,
            coinSystem: !!this.coinSystem
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
        
        // Listen for block events
        this.node.on('block-clicked', this.onBlockClicked, this);
        this.node.on('block-swipe', this.onBlockSwipe, this);
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

    /**
     * 滑动交换
     */
    private onBlockSwipe(event: any): void {
        if (!this.isGameRunning || this.gridSystem.getProcessing()) {
            return;
        }

        const { row1, col1, row2, col2 } = event;
        
        // 检查目标位置是否有效
        if (row2 < 0 || row2 >= 8 || col2 < 0 || col2 >= 8) {
            console.log(`[GameCore] Swipe out of bounds: [${row2}, ${col2}]`);
            return;
        }
        
        console.log(`[GameCore] Swipe: [${row1}, ${col1}] -> [${row2}, ${col2}]`);
        
        // 清除选中状态
        if (this.selectedBlock) {
            const oldBlock = this.gridSystem.getBlockAt(this.selectedBlock.row, this.selectedBlock.col);
            if (oldBlock) oldBlock.setSelected(false);
            this.selectedBlock = null;
        }
        
        // 尝试交换
        this.trySwap(row1, col1, row2, col2);
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
        
        // Apply rainbow blessing modifier (add rainbow block after grid generation)
        if (this.modifierSystem.hasModifier('rainbow_blessing')) {
            this.scheduleOnce(() => {
                this.addRandomRainbowBlock();
            }, 0.5);  // Wait for grid to settle
        }
        
        // Generate enemy
        const enemyData = this.progressionManager.getCurrentEnemy();
        this.enemySystem.initEnemy(enemyData);
        
        // Reset time (use level config + modifiers)
        let timeLimit = levelConfig.timeLimit;
        
        // Apply time extension modifier
        if (this.modifierSystem.hasModifier('time_extension')) {
            timeLimit += 10;
            console.log('[GameCore] ⏰ Time Extension: +10s');
        }
        
        this.timeLeft = timeLimit;
        this.isGameRunning = true;
        
        // Reset stage stats
        this.totalMoves = 0;
        this.maxCombo = 0;
        
        // Reset chain
        this.resetChain();
        
        // Reset stage coins
        if (this.coinSystem) {
            this.coinSystem.resetStageCoins();
        }
        
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
        
        // Reset chain level for new operation
        this.resetChain();
        
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
        let hasCritical = false;

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

        // Calculate damage for each match
        for (const match of matches) {
            let matchData: MatchData = {
                blocks: match,
                chainLevel: this.chainLevel,
                count: match.length,
                matchType: 'normal',
                baseDamage: 0,
                isCritical: false
            };
            
            // Apply modifier onMatch hooks
            matchData = this.modifierSystem.triggerMatch(matchData);
            
            const damage = this.damageSystem.calculateMatchDamage(matchData);
            
            // Check if critical
            if (matchData.isCritical) {
                hasCritical = true;
            }
            
            totalDamage += damage;
            
            // Show attack effect from blocks to enemy
            if (this.effectManager && this.enemySystem && match.length > 0) {
                const firstBlock = match[0];
                const blockPos = firstBlock.getPosition();
                const enemyPos = this.enemySystem.node.getPosition();
                
                // Show particles flying from blocks to enemy
                this.effectManager.showAttackEffect(blockPos, enemyPos, match.length);
            }
        }

        console.log(`[GameCore] Chain ${this.chainLevel}: ${totalDamage} damage${hasCritical ? ' 💥 CRITICAL!' : ''}`);
        
        // Show damage number at enemy position
        if (this.effectManager && totalDamage > 0 && this.enemySystem) {
            const enemyPos = this.enemySystem.node.getPosition();
            // Add random offset to avoid overlap
            const offsetX = (Math.random() - 0.5) * 50;
            const offsetY = (Math.random() - 0.5) * 30;
            const damagePos = enemyPos.clone();
            damagePos.x += offsetX;
            damagePos.y += offsetY;
            
            this.effectManager.showDamage(totalDamage, damagePos, hasCritical);
        }
        
        // Show chain combo
        if (this.chainLevel > 1) {
            console.log(`[GameCore] 🔥 COMBO x${this.chainLevel}!`);
            
            // Show combo effect
            if (this.effectManager && this.enemySystem) {
                const enemyPos = this.enemySystem.node.getPosition();
                this.effectManager.showCombo(this.chainLevel, enemyPos);
            }
        }
        
        // Apply damage to enemy
        this.enemySystem.takeDamage(totalDamage);
        
        // Check if enemy died from this damage
        if (this.enemySystem.isDead()) {
            console.log('[GameCore] 💀 Enemy defeated! Stopping chain...');
            
            // Record max combo
            if (this.chainLevel > this.maxCombo) {
                this.maxCombo = this.chainLevel;
            }
            
            // Reset chain
            this.chainLevel = 0;
            
            // Remove blocks but don't continue chain
            this.gridSystem.removeBlocks(allBlocks).then(() => {
                this.gridSystem.setProcessing(false);
                this.onVictory();
            });
            
            return;  // Stop processing
        }
        
        // Enemy drops coins on hit (small amount)
        if (this.coinSystem && totalDamage > 0) {
            let coinDrop = Math.floor(totalDamage / 5);  // 每5点伤害掉1金币
            
            // Apply gold collector modifier
            if (this.modifierSystem.hasModifier('gold_collector')) {
                coinDrop = Math.floor(coinDrop * 1.5);
            }
            
            if (coinDrop > 0) {
                this.coinSystem.addCoins(coinDrop);
                console.log(`[GameCore] 💰 Enemy dropped ${coinDrop} coins`);
            }
        }
        
        // Screen shake on hit
        if (this.effectManager && totalDamage > 0) {
            const shakeIntensity = Math.min(totalDamage / 5, 20);
            this.effectManager.screenShake(shakeIntensity, 0.2);
            
            // Enemy hit flash
            this.effectManager.enemyHitFlash(this.enemySystem.node);
        }
        
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
                    // Chain ended for this operation
                    if (this.chainLevel > 1) {
                        console.log(`[GameCore] ⭐ Chain ended! Total combo: x${this.chainLevel}`);
                        if (this.chainLevel > this.maxCombo) {
                            this.maxCombo = this.chainLevel;
                        }
                    }
                    
                    // Reset chain for next operation
                    this.chainLevel = 0;
                    this.gridSystem.setProcessing(false);
                }
            });
        });
    }

    /**
     * 重置连击
     */
    private resetChain(): void {
        if (this.chainLevel > 0) {
            console.log(`[GameCore] Chain reset (was x${this.chainLevel})`);
        }
        this.chainLevel = 0;
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

    /**
     * 添加随机彩虹方块（彩虹祝福词条）
     */
    private addRandomRainbowBlock(): void {
        // Get random position
        const row = Math.floor(Math.random() * 8);
        const col = Math.floor(Math.random() * 8);
        
        const block = this.gridSystem.getBlockAt(row, col);
        if (block) {
            block.setRainbow();
            console.log(`[GameCore] 🌈 Rainbow Blessing: Added rainbow block at [${row}, ${col}]`);
        }
    }

    private onVictory(): void {
        this.isGameRunning = false;
        
        // Reset chain on victory
        this.resetChain();
        
        console.log('[GameCore] Victory! Stage completed!');
        console.log(`[GameCore] Stats: ${this.totalMoves} moves, max combo x${this.maxCombo}`);
        
        // Big coin drop on kill
        if (this.coinSystem) {
            const currentStage = this.progressionManager.getCurrentStage();
            let killReward = 50 + (currentStage * 10);  // 基础50 + 关卡*10
            
            // Bonus for time remaining
            const timeBonus = Math.floor(this.timeLeft * 2);
            killReward += timeBonus;
            
            // Apply gold collector modifier
            if (this.modifierSystem.hasModifier('gold_collector')) {
                killReward = Math.floor(killReward * 1.5);
            }
            
            this.coinSystem.addCoins(killReward);
            console.log(`[GameCore] 💰💰💰 KILL REWARD: ${killReward} coins! (Time bonus: ${timeBonus})`);
        }
        
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
            
            // Show UI if available
            if (this.modifierSelectionUI) {
                this.modifierSelectionUI.show(options, (selected) => {
                    this.onModifierSelected(selected);
                });
            } else {
                // Fallback: auto-select first one
                console.warn('[GameCore] ModifierSelectionUI not found, auto-selecting');
                setTimeout(() => {
                    this.onModifierSelected(options[0]);
                }, 2000);
            }
        });
    }

    /**
     * 词条被选择
     */
    private onModifierSelected(modifier: any): void {
        this.modifierSystem.addModifier(modifier);
        console.log(`[GameCore] ✅ Selected: ${modifier.name}`);
        
        // Immediately clear old grid
        this.gridSystem.clearGrid();
        
        // Next stage
        this.progressionManager.nextStage();
        
        // Start new stage immediately
        console.log('[GameCore] Starting next stage...');
        this.startStage();
    }

    private onTimeUp(): void {
        this.isGameRunning = false;
        
        // Reset chain on time up
        this.resetChain();
        
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
            if (this.coinSystem) {
                this.goldLabel.string = `金币: ${this.coinSystem.getTotalCoins()}`;
            } else {
                this.goldLabel.string = `金币: ${this.progressionManager.getTotalGold()}`;
            }
        }
        if (this.stageLabel) {
            this.stageLabel.string = `第${currentStage}关 (${levelConfig.colorCount}色)`;
        }
    }
}
