import { _decorator, Component, Node, instantiate, Prefab, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 网格管理器 - 负责生成和管理游戏网格
 */
@ccclass('GridManager')
export class GridManager extends Component {
    @property({ type: Prefab })
    blockPrefab: Prefab = null;  // 方块预制体

    @property
    gridSize: number = 8;  // 网格大小 8x8

    @property
    blockSize: number = 80;  // 方块大小（像素）

    @property
    spacing: number = 10;  // 方块间距

    private blocks: Node[][] = [];  // 二维数组存储方块

    start() {
        this.generateGrid();
    }

    /**
     * 生成网格
     */
    generateGrid() {
        const startX = -((this.gridSize - 1) * (this.blockSize + this.spacing)) / 2;
        const startY = ((this.gridSize - 1) * (this.blockSize + this.spacing)) / 2;

        for (let row = 0; row < this.gridSize; row++) {
            this.blocks[row] = [];
            for (let col = 0; col < this.gridSize; col++) {
                const block = instantiate(this.blockPrefab);
                block.setParent(this.node);
                
                const x = startX + col * (this.blockSize + this.spacing);
                const y = startY - row * (this.blockSize + this.spacing);
                block.setPosition(new Vec3(x, y, 0));

                // 设置方块的行列信息
                const blockScript = block.getComponent('Block');
                if (blockScript) {
                    blockScript.init(row, col);
                }

                this.blocks[row][col] = block;
            }
        }
    }

    /**
     * 获取指定位置的方块
     */
    getBlock(row: number, col: number): Node {
        if (row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize) {
            return this.blocks[row][col];
        }
        return null;
    }

    /**
     * 清除指定位置的方块引用
     */
    clearBlock(row: number, col: number) {
        if (row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize) {
            this.blocks[row][col] = null;
        }
    }

    /**
     * 移动方块（更新数组引用）
     */
    moveBlock(fromRow: number, fromCol: number, toRow: number, toCol: number) {
        if (fromRow >= 0 && fromRow < this.gridSize && fromCol >= 0 && fromCol < this.gridSize &&
            toRow >= 0 && toRow < this.gridSize && toCol >= 0 && toCol < this.gridSize) {
            this.blocks[toRow][toCol] = this.blocks[fromRow][fromCol];
            this.blocks[fromRow][fromCol] = null;
        }
    }

    /**
     * 在指定位置生成新方块
     */
    generateNewBlock(row: number, col: number) {
        const block = instantiate(this.blockPrefab);
        block.setParent(this.node);
        
        const startX = -((this.gridSize - 1) * (this.blockSize + this.spacing)) / 2;
        const startY = ((this.gridSize - 1) * (this.blockSize + this.spacing)) / 2;
        
        const x = startX + col * (this.blockSize + this.spacing);
        const y = startY - row * (this.blockSize + this.spacing);
        
        // 从更上方开始（顶部外）
        const spawnY = startY + (this.blockSize + this.spacing) * 2;
        block.setPosition(new Vec3(x, spawnY, 0));

        // 设置方块的行列信息
        const blockScript = block.getComponent('Block');
        if (blockScript) {
            blockScript.init(row, col);
            // 播放掉落到目标位置的动画
            blockScript.playDropAnimation(row, col);
        }

        this.blocks[row][col] = block;
        return block;
    }
}
