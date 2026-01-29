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
}
