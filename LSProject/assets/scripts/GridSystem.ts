import { _decorator, Component, Node, Prefab, instantiate, Vec3 } from 'cc';
import { Block, ColorType } from './Block';
const { ccclass, property } = _decorator;

/**
 * 网格系统 - 8×8传统三消
 */
@ccclass('GridSystem')
export class GridSystem extends Component {
    @property(Prefab)
    blockPrefab: Prefab = null;

    @property
    gridSize: number = 8;

    @property
    blockSize: number = 60;

    @property
    spacing: number = 8;

    private blocks: Node[][] = [];
    private isProcessing: boolean = false;

    start() {
        // 不自动生成，等GameCore调用
    }

    /**
     * 生成网格
     */
    generateGrid(): void {
        this.clearGrid();
        
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

                const blockScript = block.getComponent(Block);
                if (blockScript) {
                    // 只生成三原色（传统消除）
                    const color = Math.floor(Math.random() * 3); // 0,1,2
                    blockScript.init(row, col, color);
                }

                this.blocks[row][col] = block;
            }
        }
        
        // 确保初始没有可消除的
        this.removeInitialMatches();
    }

    /**
     * 移除初始可消除的组合
     */
    private removeInitialMatches(): void {
        let hasMatches = true;
        let iterations = 0;
        const maxIterations = 10;
        
        while (hasMatches && iterations < maxIterations) {
            hasMatches = false;
            
            for (let row = 0; row < this.gridSize; row++) {
                for (let col = 0; col < this.gridSize; col++) {
                    const matches = this.findMatchesAt(row, col);
                    if (matches.length >= 3) {
                        // 重新随机这个方块的颜色
                        const block = this.blocks[row][col];
                        const blockScript = block?.getComponent(Block);
                        if (blockScript) {
                            const newColor = Math.floor(Math.random() * 3);
                            blockScript.setColorType(newColor);
                        }
                        hasMatches = true;
                    }
                }
            }
            iterations++;
        }
    }

    /**
     * 检测所有可消除的方块
     */
    findAllMatches(): Node[][] {
        const allMatches: Node[][] = [];
        const processed = new Set<string>();

        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const key = `${row},${col}`;
                if (processed.has(key)) continue;

                const matches = this.findMatchesAt(row, col);
                if (matches.length >= 3) {
                    allMatches.push(matches);
                    matches.forEach(node => {
                        const block = node.getComponent(Block);
                        if (block) {
                            const pos = block.getPosition();
                            processed.add(`${pos.row},${pos.col}`);
                        }
                    });
                }
            }
        }

        return allMatches;
    }

    /**
     * 查找指定位置的匹配
     */
    private findMatchesAt(row: number, col: number): Node[] {
        const block = this.blocks[row]?.[col];
        if (!block || !block.isValid) return [];

        const blockScript = block.getComponent(Block);
        if (!blockScript) return [];

        const color = blockScript.getColorType();
        const matches: Node[] = [block];

        // 横向检测
        const horizontal = this.findMatchesInDirection(row, col, color, 0, 1)
            .concat(this.findMatchesInDirection(row, col, color, 0, -1));
        
        // 纵向检测
        const vertical = this.findMatchesInDirection(row, col, color, 1, 0)
            .concat(this.findMatchesInDirection(row, col, color, -1, 0));

        // 取最长的匹配
        if (horizontal.length >= 2) {
            matches.push(...horizontal);
        }
        if (vertical.length >= 2) {
            matches.push(...vertical);
        }

        // 去重
        return Array.from(new Set(matches));
    }

    /**
     * 在指定方向查找匹配
     */
    private findMatchesInDirection(row: number, col: number, color: ColorType, 
                                   dRow: number, dCol: number): Node[] {
        const matches: Node[] = [];
        let r = row + dRow;
        let c = col + dCol;

        while (r >= 0 && r < this.gridSize && c >= 0 && c < this.gridSize) {
            const block = this.blocks[r][c];
            if (!block || !block.isValid) break;

            const blockScript = block.getComponent(Block);
            if (!blockScript || blockScript.getColorType() !== color) break;

            matches.push(block);
            r += dRow;
            c += dCol;
        }

        return matches;
    }

    /**
     * 消除方块
     */
    removeBlocks(blocks: Node[]): void {
        blocks.forEach(block => {
            const blockScript = block.getComponent(Block);
            if (blockScript) {
                const pos = blockScript.getPosition();
                this.blocks[pos.row][pos.col] = null;
                blockScript.disappear();
            }
        });
    }

    /**
     * 处理掉落
     */
    handleGravity(): void {
        for (let col = 0; col < this.gridSize; col++) {
            let emptyRow = this.gridSize - 1;
            
            // 从下往上扫描
            for (let row = this.gridSize - 1; row >= 0; row--) {
                if (this.blocks[row][col] && this.blocks[row][col].isValid) {
                    if (row !== emptyRow) {
                        // 移动方块
                        this.blocks[emptyRow][col] = this.blocks[row][col];
                        this.blocks[row][col] = null;
                        
                        const blockScript = this.blocks[emptyRow][col].getComponent(Block);
                        if (blockScript) {
                            blockScript.updateRowCol(emptyRow, col);
                            blockScript.playDropAnimation(emptyRow, col);
                        }
                    }
                    emptyRow--;
                }
            }
            
            // 填充空位
            for (let row = emptyRow; row >= 0; row--) {
                this.generateNewBlock(row, col);
            }
        }
    }

    /**
     * 生成新方块
     */
    generateNewBlock(row: number, col: number): void {
        const block = instantiate(this.blockPrefab);
        block.setParent(this.node);
        
        const startX = -((this.gridSize - 1) * (this.blockSize + this.spacing)) / 2;
        const startY = ((this.gridSize - 1) * (this.blockSize + this.spacing)) / 2;
        
        const x = startX + col * (this.blockSize + this.spacing);
        const spawnY = startY + (this.blockSize + this.spacing) * 2;
        block.setPosition(new Vec3(x, spawnY, 0));

        const blockScript = block.getComponent(Block);
        if (blockScript) {
            const color = Math.floor(Math.random() * 3);
            blockScript.init(row, col, color);
            blockScript.playDropAnimation(row, col);
        }

        this.blocks[row][col] = block;
    }

    /**
     * 清空网格
     */
    clearGrid(): void {
        this.node.removeAllChildren();
        this.blocks = [];
    }

    /**
     * 获取方块
     */
    getBlock(row: number, col: number): Node {
        return this.blocks[row]?.[col];
    }

    /**
     * 设置处理状态
     */
    setProcessing(processing: boolean): void {
        this.isProcessing = processing;
    }

    /**
     * 是否正在处理
     */
    getProcessing(): boolean {
        return this.isProcessing;
    }
}
