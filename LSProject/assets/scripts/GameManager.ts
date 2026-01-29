import { _decorator, Component, Label } from 'cc';
import { Block, ColorType } from './Block';
import { GridManager } from './GridManager';
const { ccclass, property } = _decorator;

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

    private selectedBlock: Block = null;  // 当前选中的方块
    private remainingSteps: number = 15;  // 剩余步数
    private targetColor: ColorType;  // 目标颜色
    private targetCount: number = 3;  // 需要合成的数量

    start() {
        this.initLevel();
    }

    /**
     * 初始化关卡
     */
    initLevel() {
        // 第一关：合成3个橙色
        this.targetColor = ColorType.ORANGE;
        this.targetCount = 3;
        this.remainingSteps = 15;

        this.updateUI();
    }

    /**
     * 更新UI显示
     */
    updateUI() {
        if (this.stepsLabel) {
            this.stepsLabel.string = `剩余步数: ${this.remainingSteps}`;
        }
        if (this.targetLabel) {
            const colorName = this.getColorName(this.targetColor);
            this.targetLabel.string = `目标: 合成 ${this.targetCount} 个${colorName}`;
        }
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
            // 混合成功
            console.log(`混合成功: ${this.getColorName(color1)} + ${this.getColorName(color2)} = ${this.getColorName(newColor)}`);
            
            // 获取block2的位置（掉落前记录）
            const block2Pos = block2.getPosition();
            
            // 播放混合动画
            block1.playMixAnimation(newColor, () => {
                // 动画完成后触发掉落
                this.handleDrop(block2Pos.col);
                // 检查胜利条件
                this.scheduleOnce(() => {
                    this.checkWinCondition();
                }, 0.5);  // 等掉落动画结束
            });
            
            // 从数组中清除引用
            this.gridManager.clearBlock(block2Pos.row, block2Pos.col);
            // 移除第二个方块
            block2.node.destroy();

            // 消耗步数
            this.remainingSteps--;
            this.updateUI();

            // 取消选中
            block1.setSelected(false);
            this.selectedBlock = null;
        } else {
            console.log('这两种颜色无法混合');
            block1.setSelected(false);
            this.selectedBlock = null;
        }
    }

    /**
     * 处理指定列的方块掉落和填充
     */
    handleDrop(col: number) {
        const gridSize = this.gridManager.gridSize;
        
        // 从下往上扫描这一列
        for (let row = gridSize - 1; row >= 0; row--) {
            const block = this.gridManager.getBlock(row, col);
            
            if (!block || !block.isValid) {
                // 发现空位，让上方所有方块掉落一格
                for (let aboveRow = row - 1; aboveRow >= 0; aboveRow--) {
                    const aboveBlock = this.gridManager.getBlock(aboveRow, col);
                    if (aboveBlock && aboveBlock.isValid) {
                        // 移动到下一行
                        this.gridManager.moveBlock(aboveRow, col, aboveRow + 1, col);
                        const blockScript = aboveBlock.getComponent(Block);
                        if (blockScript) {
                            blockScript.updateRowCol(aboveRow + 1, col);
                            blockScript.playDropAnimation(aboveRow + 1, col);
                        }
                    }
                }
                
                // 在顶部生成新方块
                this.gridManager.generateNewBlock(0, col);
                
                // 重新从这一行开始检查（因为上方方块已下落）
                row++;
            }
        }
    }

    /**
     * 检查胜利条件
     */
    checkWinCondition() {
        // 统计目标颜色的数量
        let count = 0;
        for (let row = 0; row < this.gridManager.gridSize; row++) {
            for (let col = 0; col < this.gridManager.gridSize; col++) {
                const block = this.gridManager.getBlock(row, col);
                // 检查节点是否有效（可能已被销毁）
                if (block && block.isValid) {
                    const blockScript = block.getComponent(Block);
                    if (blockScript && blockScript.getColorType() === this.targetColor) {
                        count++;
                    }
                }
            }
        }

        console.log(`当前${this.getColorName(this.targetColor)}数量: ${count}/${this.targetCount}`);

        // 达到目标
        if (count >= this.targetCount) {
            this.onLevelComplete();
        } else if (this.remainingSteps <= 0) {
            // 步数用完但未达成目标
            this.onLevelFailed();
        }
    }

    /**
     * 关卡完成
     */
    onLevelComplete() {
        console.log('🎉 关卡完成！');
        // TODO: 显示胜利界面，进入下一关
        if (this.targetLabel) {
            this.targetLabel.string = '🎉 恭喜过关！';
        }
    }

    /**
     * 关卡失败
     */
    onLevelFailed() {
        console.log('😢 挑战失败！');
        if (this.targetLabel) {
            this.targetLabel.string = '😢 步数用完了，再试一次？';
        }
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
