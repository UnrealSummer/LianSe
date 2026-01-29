import { _decorator, Component, Label } from 'cc';
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
            // 第1关：简单，单一目标，小网格
            {
                level: 1,
                steps: 10,
                targetScore: 30,
                gridSize: 5,  // 5×5网格
                targets: [
                    { color: ColorType.ORANGE, count: 2 },
                ]
            },
            // 第2关：双重目标，中等网格
            {
                level: 2,
                steps: 15,
                targetScore: 60,
                gridSize: 6,  // 6×6网格
                targets: [
                    { color: ColorType.ORANGE, count: 2 },
                    { color: ColorType.PURPLE, count: 2 },
                ]
            },
            // 第3关：三重目标，较大网格
            {
                level: 3,
                steps: 20,
                targetScore: 100,
                gridSize: 7,  // 7×7网格
                targets: [
                    { color: ColorType.ORANGE, count: 2 },
                    { color: ColorType.PURPLE, count: 2 },
                    { color: ColorType.GREEN, count: 2 },
                ]
            },
            // 第4关：高分挑战，大网格
            {
                level: 4,
                steps: 25,
                targetScore: 150,
                gridSize: 8,  // 8×8网格
                targets: [
                    { color: ColorType.ORANGE, count: 3 },
                    { color: ColorType.PURPLE, count: 2 },
                    { color: ColorType.GREEN, count: 2 },
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
                const colorName = this.getColorName(target.color);
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
     * 尝试混合两个方块
     */
    tryMix(block1: Block, block2: Block) {
        const color1 = block1.getColorType();
        const color2 = block2.getColorType();
        const newColor = Block.mixColors(color1, color2);

        if (newColor !== null) {
            // 计算分数
            const baseScore = MIX_SCORES.PRIMARY;
            this.comboCount++;
            const comboMultiplier = 1 + (this.comboCount - 1) * (MIX_SCORES.COMBO_MULTIPLIER - 1);
            const earnedScore = Math.floor(baseScore * comboMultiplier);
            this.currentScore += earnedScore;

            // 混合成功
            console.log(`混合成功: ${this.getColorName(color1)} + ${this.getColorName(color2)} = ${this.getColorName(newColor)}`);
            console.log(`+${earnedScore}分 ${this.comboCount > 1 ? `(Combo x${this.comboCount})` : ''}`);
            
            // 获取block2的位置（掉落前记录）
            const block2Pos = block2.getPosition();
            
            // 立即从数组中清除引用
            this.gridManager.clearBlock(block2Pos.row, block2Pos.col);
            // 立即销毁第二个方块
            block2.node.destroy();
            
            // 播放混合动画
            block1.playMixAnimation(newColor, () => {
                // 动画完成后触发掉落
                this.handleDrop(block2Pos.col);
                // 检查胜利条件
                this.scheduleOnce(() => {
                    this.checkWinCondition();
                }, 0.5);  // 等掉落动画结束
            });

            // 消耗步数
            this.remainingSteps--;
            this.updateUI();

            // 取消选中
            block1.setSelected(false);
            this.selectedBlock = null;
        } else {
            console.log('这两种颜色无法混合');
            // 重置连击
            this.comboCount = 0;
            block1.setSelected(false);
            this.selectedBlock = null;
        }
    }

    /**
     * 处理指定列的方块掉落和填充
     */
    handleDrop(col: number) {
        const gridSize = this.gridManager.gridSize;
        
        // 从下往上扫描这一列，找出所有空位
        const emptySlots: number[] = [];
        for (let row = gridSize - 1; row >= 0; row--) {
            const block = this.gridManager.getBlock(row, col);
            if (!block || !block.isValid) {
                emptySlots.push(row);
            }
        }
        
        // 如果没有空位，直接返回
        if (emptySlots.length === 0) return;
        
        // 收集所有有效的方块（从上到下）
        const validBlocks: { block: Node, blockScript: Block }[] = [];
        for (let row = 0; row < gridSize; row++) {
            const block = this.gridManager.getBlock(row, col);
            if (block && block.isValid) {
                const blockScript = block.getComponent(Block);
                if (blockScript) {
                    validBlocks.push({ block, blockScript });
                }
            }
        }
        
        // 清空这一列的引用
        for (let row = 0; row < gridSize; row++) {
            this.gridManager.clearBlock(row, col);
        }
        
        // 将有效方块从下往上填充
        let targetRow = gridSize - 1;
        for (let i = validBlocks.length - 1; i >= 0; i--) {
            const { block, blockScript } = validBlocks[i];
            this.gridManager.setBlock(targetRow, col, block);
            blockScript.updateRowCol(targetRow, col);
            blockScript.playDropAnimation(targetRow, col);
            targetRow--;
        }
        
        // 在顶部生成新方块填补空位
        const newBlockCount = emptySlots.length;
        for (let i = 0; i < newBlockCount; i++) {
            this.gridManager.generateNewBlock(i, col);
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

        console.log(`进度: 分数 ${this.currentScore}/${this.levelConfig.targetScore}, 目标 ${allTargetsReached ? '✅' : '❌'}`);

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
            if (nextLevel <= 4) {
                this.targetLabel.string = `🎉 第${this.currentLevel}关完成！\n得分: ${this.currentScore}\n\n1.5秒后进入下一关...`;
            } else {
                this.targetLabel.string = `🎉 第${this.currentLevel}关完成！\n得分: ${this.currentScore}\n\n🏆 全部通关！`;
            }
        }

        // 1.5秒后自动进入下一关
        this.scheduleOnce(() => {
            if (nextLevel <= 4) {
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
                const colorName = this.getColorName(target.color);
                failReason += `${colorName}不足 (${current}/${target.count})\n`;
            }
        }
        
        if (this.targetLabel) {
            this.targetLabel.string = `😢 挑战失败！\n${failReason}`;
        }
        
        // TODO: 显示重试按钮
    }

    /**
     * 获取颜色名称
     */
    getColorName(colorType: ColorType): string {
        const names = {
            [ColorType.RED]: '红色',
            [ColorType.YELLOW]: '黄色',
            [ColorType.BLUE]: '蓝色',
            [ColorType.ORANGE]: '橙色',
            [ColorType.PURPLE]: '紫色',
            [ColorType.GREEN]: '绿色',
        };
        return names[colorType];
    }
}
