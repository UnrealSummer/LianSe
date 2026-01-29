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
            
            // 播放混合动画
            block1.playMixAnimation(newColor, () => {
                // 动画完成后的回调
                this.checkWinCondition();
            });
            
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
     * 检查胜利条件
     */
    checkWinCondition() {
        // 统计目标颜色的数量
        let count = 0;
        for (let row = 0; row < this.gridManager.gridSize; row++) {
            for (let col = 0; col < this.gridManager.gridSize; col++) {
                const block = this.gridManager.getBlock(row, col);
                if (block) {
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
