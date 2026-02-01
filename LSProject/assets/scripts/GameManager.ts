import { _decorator, Component, Label, Tween, Color } from 'cc';
import { Block, ColorType } from './Block';
import { GridManager } from './GridManager';
const { ccclass, property } = _decorator;

/**
 * 关卡配置
 */
interface LevelConfig {
    level: number;
    steps: number;
    targetScore: number;  // 目标分数
    gridSize: number;     // 网格大小
    targets: {            // 多重目标
        color: ColorType;
        count: number;
    }[];
}

/**
 * 混合分数配置
 */
const MIX_SCORES = {
    PRIMARY: 10,      // 三原色混合（红+黄、红+蓝、黄+蓝）
    SECONDARY: 30,    // 混合色再混合（橙+紫、绿+橙等）- 暂未实现二次混合
    COMBO_MULTIPLIER: 1.5,  // 连续混合倍数
};

/**
 * 游戏管理器 - 核心逻辑控制
 */
@ccclass('GameManager')
export class GameManager extends Component {
    @property(GridManager)
    gridManager: GridManager = null;

    @property(Label)
    stepsLabel: Label = null;  // 剩余步数显示

    @property(Label)
    targetLabel: Label = null;  // 目标显示

    @property(Label)
    scoreLabel: Label = null;  // 分数显示

    private selectedBlock: Block = null;  // 当前选中的方块
    private remainingSteps: number = 15;  // 剩余步数
    private currentScore: number = 0;     // 当前分数
    private currentLevel: number = 1;     // 当前关卡
    private levelConfig: LevelConfig;     // 关卡配置
    private comboCount: number = 0;       // 连击计数

    start() {
        this.initLevel(1);
    }

    /**
     * 初始化关卡
     */
    initLevel(level: number) {
        this.currentLevel = level;
        this.currentScore = 0;
        this.comboCount = 0;
        
        // 关卡配置
        this.levelConfig = this.getLevelConfig(level);
        this.remainingSteps = this.levelConfig.steps;

        // 重新生成网格（根据关卡配置的大小）
        if (this.gridManager) {
            this.gridManager.regenerateGrid(this.levelConfig.gridSize);
        }

        this.updateUI();
    }

    /**
     * 获取关卡配置
     */
    getLevelConfig(level: number): LevelConfig {
        const configs: LevelConfig[] = [
            // 第1关：基础混合教学
            {
                level: 1,
                steps: 12,
                targetScore: 40,
                gridSize: 5,  // 5×5网格
                targets: [
                    { color: ColorType.ORANGE, count: 2 },
                ]
            },
            // 第2关：连锁系统入门（分数目标鼓励连锁）
            {
                level: 2,
                steps: 15,
                targetScore: 100,  // 提高分数要求，鼓励触发连锁
                gridSize: 6,  // 6×6网格
                targets: [
                    { color: ColorType.ORANGE, count: 2 },
                    { color: ColorType.PURPLE, count: 1 },
                ]
            },
            // 第3关：强化色教学
            {
                level: 3,
                steps: 18,
                targetScore: 150,
                gridSize: 6,  // 6×6网格
                targets: [
                    { color: ColorType.DEEP_RED, count: 1 },  // 需要红+红
                    { color: ColorType.GREEN, count: 2 },
                ]
            },
            // 第4关：综合挑战（多种颜色+高分）
            {
                level: 4,
                steps: 25,
                targetScore: 250,
                gridSize: 7,  // 7×7网格
                targets: [
                    { color: ColorType.DEEP_YELLOW, count: 1 },  // 强化色
                    { color: ColorType.ORANGE, count: 3 },
                    { color: ColorType.PURPLE, count: 2 },
                ]
            },
            // 第5关：终极挑战（利用彩虹+连锁）
            {
                level: 5,
                steps: 30,
                targetScore: 400,
                gridSize: 8,  // 8×8网格
                targets: [
                    { color: ColorType.DEEP_RED, count: 2 },
                    { color: ColorType.DEEP_BLUE, count: 2 },
                    { color: ColorType.GREEN, count: 3 },
                ]
            },
        ];

        return configs[level - 1] || configs[0];
    }

    /**
     * 更新UI显示
     */
    updateUI() {
        // 更新步数
        if (this.stepsLabel) {
            this.stepsLabel.string = `步数: ${this.remainingSteps}`;
        }

        // 更新分数
        if (this.scoreLabel) {
            this.scoreLabel.string = `分数: ${this.currentScore}/${this.levelConfig.targetScore}`;
        }

        // 更新多重目标
        if (this.targetLabel) {
            let targetText = `第${this.currentLevel}关 目标:\n`;
            
            // 统计当前各颜色数量
            const colorCounts = this.countColors();
            
            for (const target of this.levelConfig.targets) {
                const colorName = Block.getColorName(target.color);
                const current = colorCounts[target.color] || 0;
                const icon = current >= target.count ? '✅' : '⭕';
                targetText += `${icon} ${colorName} ${current}/${target.count}\n`;
            }
            
            this.targetLabel.string = targetText;
        }
    }

    /**
     * 统计各颜色方块数量
     */
    countColors(): Record<ColorType, number> {
        const counts: Record<ColorType, number> = {};
        
        for (let row = 0; row < this.gridManager.gridSize; row++) {
            for (let col = 0; col < this.gridManager.gridSize; col++) {
                const block = this.gridManager.getBlock(row, col);
                if (block && block.isValid) {
                    const blockScript = block.getComponent(Block);
                    if (blockScript) {
                        const color = blockScript.getColorType();
                        counts[color] = (counts[color] || 0) + 1;
                    }
                }
            }
        }
        
        return counts;
    }

    /**
     * 处理方块点击
     */
    onBlockClick(block: Block) {
        if (this.remainingSteps <= 0) {
            console.log('步数已用完！');
            return;
        }

        if (!this.selectedBlock) {
            // 第一次点击，选中方块
            this.selectedBlock = block;
            block.setSelected(true);
            console.log('选中方块');
        } else {
            // 第二次点击，尝试混合
            if (this.selectedBlock === block) {
                // 点击同一个方块，取消选中
                block.setSelected(false);
                this.selectedBlock = null;
                console.log('取消选中');
            } else if (this.selectedBlock.isAdjacent(block)) {
                // 相邻方块，尝试混合
                this.tryMix(this.selectedBlock, block);
            } else {
                // 不相邻，切换选中
                this.selectedBlock.setSelected(false);
                this.selectedBlock = block;
                block.setSelected(true);
                console.log('切换选中');
            }
        }
    }

    /**
     * 尝试混合两个方块（版本1：连锁系统）
     * @param block1 第一次点击的方块（将被消除）
     * @param block2 第二次点击的方块（将变色）
     * @param chainCount 连锁层数（默认0，表示玩家主动操作）
     */
    tryMix(block1: Block, block2: Block, chainCount: number = 0) {
        const color1 = block1.getColorType();
        const color2 = block2.getColorType();
        const newColor = Block.mixColors(color1, color2);

        if (newColor !== null) {
            // 计算分数（连锁加倍）
            const baseScore = Block.isEnhancedColor(newColor) ? 30 : MIX_SCORES.PRIMARY;
            const chainMultiplier = Math.pow(2, chainCount); // 连锁翻倍：1x, 2x, 4x, 8x...
            const earnedScore = Math.floor(baseScore * chainMultiplier);
            this.currentScore += earnedScore;

            const chainText = chainCount > 0 ? ` [连锁×${chainCount + 1}]` : '';
            console.log(`${chainText} 混合: ${Block.getColorName(color1)} + ${Block.getColorName(color2)} = ${Block.getColorName(newColor)} +${earnedScore}分`);
            
            // 获取位置
            const block1Pos = block1.getPosition();
            const block2Pos = block2.getPosition();
            
            // 从数组清除block1
            this.gridManager.clearBlock(block1Pos.row, block1Pos.col);
            
            // 让block1消失
            block1.disappear();
            
            // block2变色
            block2.playMixAnimation(newColor, () => {
                
                // 变色完成后触发掉落
                this.scheduleOnce(() => {
                    this.handleDrop(block1Pos.col, block1Pos.row);
                    
                    // 掉落完成后，检查是否可以触发连锁（增加延迟确保掉落动画完成）
                    this.scheduleOnce(() => {
                        this.checkAndTriggerChain(block2Pos.row, block2Pos.col, chainCount + 1);
                    }, 0.5);  // 从0.3增加到0.5秒
                }, 0.2);
                
                // 检查胜利条件
                this.scheduleOnce(() => {
                    this.checkWinCondition();
                }, 1.5);  // 也相应增加
            });

            // 只有玩家主动操作才消耗步数
            if (chainCount === 0) {
                this.remainingSteps--;
                this.updateUI();
                this.selectedBlock = null;
            }
        } else {
            if (chainCount === 0) {
                console.log('无法混合');
                this.comboCount = 0;
                block1.setSelected(false);
                this.selectedBlock = null;
            }
        }
    }

    /**
     * 检查并触发连锁混合
     * @param row 刚变色的方块行号
     * @param col 刚变色的方块列号
     * @param chainCount 当前连锁层数
     */
    checkAndTriggerChain(row: number, col: number, chainCount: number) {
        // 获取刚变色的方块
        const centerBlock = this.gridManager.getBlock(row, col);
        if (!centerBlock || !centerBlock.isValid) {
            return;
        }

        const centerScript = centerBlock.getComponent(Block);
        if (!centerScript) {
            return;
        }

        const centerColor = centerScript.getColorType();

        // 检查四个方向的相邻方块
        const directions = [
            { dr: -1, dc: 0 },  // 上
            { dr: 1, dc: 0 },   // 下
            { dr: 0, dc: -1 },  // 左
            { dr: 0, dc: 1 },   // 右
        ];

        for (const dir of directions) {
            const newRow = row + dir.dr;
            const newCol = col + dir.dc;

            const adjacentBlock = this.gridManager.getBlock(newRow, newCol);
            if (adjacentBlock && adjacentBlock.isValid) {
                const adjacentScript = adjacentBlock.getComponent(Block);
                if (adjacentScript) {
                    const adjacentColor = adjacentScript.getColorType();
                    const mixResult = Block.mixColors(centerColor, adjacentColor);

                    // 如果可以混合，触发自动连锁
                    if (mixResult !== null) {
                        console.log(`🔗 检测到连锁机会！`);
                        this.scheduleOnce(() => {
                            this.tryMix(adjacentScript, centerScript, chainCount);
                        }, 0.3);
                        return; // 只触发第一个找到的连锁
                    }
                }
            }
        }

        console.log('连锁结束');
    }

    /**
     * 处理整列的方块掉落（完整版）
     * @param col 列号
     * @param emptyRow 被消除方块的行号
     */
    handleDrop(col: number, emptyRow: number) {
        console.log(`[掉落] 开始处理列${col}，空位行${emptyRow}`);
        
        // 从空位开始，向上查找所有方块并依次下落
        for (let row = emptyRow; row >= 0; row--) {
            if (row === 0) {
                // 最上面一行，生成新方块
                console.log(`[掉落] 生成新方块: [${row}, ${col}]`);
                this.gridManager.generateNewBlock(row, col);
            } else {
                // 获取上方方块
                const aboveBlock = this.gridManager.getBlock(row - 1, col);
                
                if (aboveBlock && aboveBlock.isValid) {
                    // 上方有方块，移动下来
                    const blockScript = aboveBlock.getComponent(Block);
                    if (blockScript) {
                        console.log(`[掉落] 移动方块: [${row - 1}, ${col}] -> [${row}, ${col}]`);
                        this.gridManager.setBlock(row, col, aboveBlock);
                        this.gridManager.clearBlock(row - 1, col);
                        blockScript.updateRowCol(row, col);
                        blockScript.playDropAnimation(row, col);
                    }
                } else {
                    // 上方是空的，直接生成新方块
                    console.log(`[掉落] 上方为空，生成新方块: [${row}, ${col}]`);
                    this.gridManager.generateNewBlock(row, col);
                    break;  // 上方都是空的，不需要继续
                }
            }
        }
    }

    /**
     * 检查胜利条件
     */
    checkWinCondition() {
        // 统计各颜色数量
        const colorCounts = this.countColors();
        
        // 检查是否所有目标都达成
        let allTargetsReached = true;
        for (const target of this.levelConfig.targets) {
            const current = colorCounts[target.color] || 0;
            if (current < target.count) {
                allTargetsReached = false;
                break;
            }
        }

        // 检查分数是否达标
        const scoreReached = this.currentScore >= this.levelConfig.targetScore;

        // 胜利条件：分数达标 且 所有目标颜色数量达标
        if (scoreReached && allTargetsReached) {
            this.onLevelComplete();
        } else if (this.remainingSteps <= 0) {
            // 步数用完但未达成目标
            this.onLevelFailed();
        }
        
        // 更新UI显示进度
        this.updateUI();
    }

    /**
     * 关卡完成
     */
    onLevelComplete() {
        console.log('🎉 关卡完成！');
        
        // 取消当前选中
        if (this.selectedBlock) {
            this.selectedBlock.setSelected(false);
            this.selectedBlock = null;
        }
        
        const nextLevel = this.currentLevel + 1;
        
        if (this.targetLabel) {
            if (nextLevel <= 5) {
                this.targetLabel.string = `🎉 第${this.currentLevel}关完成！\n得分: ${this.currentScore}\n\n1.5秒后进入下一关...`;
            } else {
                this.targetLabel.string = `🎉 第${this.currentLevel}关完成！\n得分: ${this.currentScore}\n\n🏆 全部通关！`;
            }
        }

        // 1.5秒后自动进入下一关
        this.scheduleOnce(() => {
            if (nextLevel <= 5) {
                console.log(`进入第${nextLevel}关...`);
                this.initLevel(nextLevel);
            } else {
                console.log('全部关卡通关！');
            }
        }, 1.5);
    }

    /**
     * 关卡失败
     */
    onLevelFailed() {
        console.log('😢 挑战失败！');
        
        const colorCounts = this.countColors();
        let failReason = '';
        
        // 分析失败原因
        if (this.currentScore < this.levelConfig.targetScore) {
            failReason += `分数不足 (${this.currentScore}/${this.levelConfig.targetScore})\n`;
        }
        
        for (const target of this.levelConfig.targets) {
            const current = colorCounts[target.color] || 0;
            if (current < target.count) {
                const colorName = Block.getColorName(target.color);
                failReason += `${colorName}不足 (${current}/${target.count})\n`;
            }
        }
        
        if (this.targetLabel) {
            this.targetLabel.string = `😢 挑战失败！\n${failReason}`;
        }
        
        // TODO: 显示重试按钮
    }

}
