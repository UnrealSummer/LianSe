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
        // 【测试】只生成一个方块
        console.log(`只生成一个测试方块`);
        this.generateTestBlock();
        
        // 原来的网格生成（暂时禁用）
        // this.generateGrid(this.gridSize);
    }
    
    /**
     * 生成一个测试方块（屏幕中央）
     */
    generateTestBlock() {
        const block = instantiate(this.blockPrefab);
        block.setParent(this.node);
        block.setPosition(new Vec3(0, 0, 0));  // 屏幕中央
        
        const blockScript = block.getComponent('Block');
        if (blockScript) {
            blockScript.init(0, 0);
        }
        
        console.log(`测试方块已生成，UUID: ${block.uuid}`);
    }

    /**
     * 重新生成网格（用于关卡切换）
     */
    regenerateGrid(newSize: number) {
        // 清空旧网格
        this.clearGrid();
        // 生成新网格
        this.gridSize = newSize;
        this.generateGrid(newSize);
    }

    /**
     * 清空网格
     */
    clearGrid() {
        // 销毁所有子节点（包括可能残留的方块）
        this.node.removeAllChildren();
        
        // 清空数组
        this.blocks = [];
    }

    /**
     * 生成网格
     */
    generateGrid(size: number) {
        const startX = -((size - 1) * (this.blockSize + this.spacing)) / 2;
        const startY = ((size - 1) * (this.blockSize + this.spacing)) / 2;

        for (let row = 0; row < size; row++) {
            this.blocks[row] = [];
            for (let col = 0; col < size; col++) {
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
     * 设置指定位置的方块
     */
    setBlock(row: number, col: number, block: Node) {
        if (row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize) {
            this.blocks[row][col] = block;
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
