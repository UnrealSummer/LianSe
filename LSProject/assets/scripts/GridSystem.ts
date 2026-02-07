import { _decorator, Component, Node, Prefab, instantiate, Vec3, view, screen } from 'cc';
import { Block, ColorType } from './Block';
const { ccclass, property } = _decorator;

/**
 * Grid System
 * Manages 8x8 grid and match-3 logic
 */
@ccclass('GridSystem')
export class GridSystem extends Component {
    @property({ type: Prefab, tooltip: '方块预制体' })
    blockPrefab: Prefab = null;

    @property({ tooltip: '网格大小（8表示8×8）' })
    gridSize: number = 8;
    
    @property({ tooltip: '屏幕宽度占比（0-1），推荐0.9' })
    screenWidthRatio: number = 0.9;
    
    @property({ tooltip: '屏幕高度占比（0-1），推荐0.45-0.55' })
    screenHeightRatio: number = 0.55;
    
    @property({ tooltip: '方块间隔比例（0-1），推荐0.15-0.25' })
    spacingRatio: number = 0.2;

    private blockSize: number = 60;
    private spacing: number = 8;
    private blocks: Node[][] = [];
    private isProcessing: boolean = false;

    start() {
        this.calculateAdaptiveSize();
    }
    
    /**
     * Calculate adaptive block size and spacing based on screen size
     */
    private calculateAdaptiveSize(): void {
        // Get actual screen size
        const screenSize = screen.windowSize;
        const designWidth = view.getVisibleSize().width;
        const designHeight = view.getVisibleSize().height;
        
        // Calculate available space (use design resolution)
        const availableWidth = designWidth * this.screenWidthRatio;
        const availableHeight = designHeight * this.screenHeightRatio;
        
        // Calculate block size
        const widthBlockSize = availableWidth / (this.gridSize + (this.gridSize - 1) * this.spacingRatio);
        const heightBlockSize = availableHeight / (this.gridSize + (this.gridSize - 1) * this.spacingRatio);
        
        this.blockSize = Math.floor(Math.min(widthBlockSize, heightBlockSize));
        this.spacing = Math.floor(this.blockSize * this.spacingRatio);
        
        console.log(`[GridSystem] Screen: ${screenSize.width}x${screenSize.height}, Design: ${designWidth.toFixed(0)}x${designHeight.toFixed(0)}`);
        console.log(`[GridSystem] Available: ${availableWidth.toFixed(0)}x${availableHeight.toFixed(0)}`);
        console.log(`[GridSystem] Block: ${this.blockSize}px, Spacing: ${this.spacing}px (ratio=${this.spacingRatio})`);
    }

    /**
     * Generate grid
     * @param colorCount Number of colors to use
     * @param obstacles Obstacle configurations (empty for now)
     */
    generateGrid(colorCount: number, obstacles: any[]): void {
        this.calculateAdaptiveSize();
        this.clearGrid();
        
        const startX = -((this.gridSize - 1) * (this.blockSize + this.spacing)) / 2;
        const startY = ((this.gridSize - 1) * (this.blockSize + this.spacing)) / 2;

        for (let row = 0; row < this.gridSize; row++) {
            this.blocks[row] = [];
            for (let col = 0; col < this.gridSize; col++) {
                const block = instantiate(this.blockPrefab);
                block.setParent(this.node);
                
                // Set block size
                block.setScale(this.blockSize / 60, this.blockSize / 60, 1);
                
                const x = startX + col * (this.blockSize + this.spacing);
                const y = startY - row * (this.blockSize + this.spacing);
                block.setPosition(new Vec3(x, y, 0));

                const blockScript = block.getComponent(Block);
                if (blockScript) {
                    const color = Math.floor(Math.random() * colorCount);
                    blockScript.init(row, col, color);
                }

                this.blocks[row][col] = block;
            }
        }
        
        this.removeInitialMatches();
        console.log(`[GridSystem] Grid generated: ${this.gridSize}x${this.gridSize}, ${colorCount} colors`);
    }

    /**
     * Remove initial matches
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
     * Clear grid
     */
    private clearGrid(): void {
        this.node.removeAllChildren();
        this.blocks = [];
    }

    /**
     * Find all matches
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
     * Find matches at position
     */
    private findMatchesAt(row: number, col: number): Node[] {
        const block = this.blocks[row]?.[col];
        if (!block || !block.isValid) return [];

        const blockScript = block.getComponent(Block);
        if (!blockScript) return [];

        const color = blockScript.getColorType();
        const matches: Node[] = [block];

        const horizontal = this.findMatchesInDirection(row, col, color, 0, 1)
            .concat(this.findMatchesInDirection(row, col, color, 0, -1));
        
        const vertical = this.findMatchesInDirection(row, col, color, 1, 0)
            .concat(this.findMatchesInDirection(row, col, color, -1, 0));

        if (horizontal.length >= 2) {
            matches.push(...horizontal);
        }
        if (vertical.length >= 2) {
            matches.push(...vertical);
        }

        return Array.from(new Set(matches));
    }

    /**
     * Find matches in direction
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
     * Remove blocks with animation
     */
    removeBlocks(blocks: Node[]): Promise<void> {
        const removeAnimations: Promise<void>[] = [];
        
        blocks.forEach(block => {
            const blockScript = block.getComponent(Block);
            if (blockScript) {
                const pos = blockScript.getPosition();
                this.blocks[pos.row][pos.col] = null;
                
                // Animate removal
                const promise = new Promise<void>((resolve) => {
                    import('cc').then(({ tween, Vec3 }) => {
                        tween(block)
                            .to(0.2, { scale: new Vec3(0, 0, 1) }, { easing: 'backIn' })
                            .call(() => {
                                block.destroy();
                                resolve();
                            })
                            .start();
                    });
                });
                removeAnimations.push(promise);
            }
        });
        
        return Promise.all(removeAnimations).then(() => {});
    }

    /**
     * Drop blocks and fill empty spaces
     */
    dropBlocks(callback: Function): void {
        let hasDropped = false;
        const dropAnimations: Promise<void>[] = [];

        // Drop existing blocks
        for (let col = 0; col < this.gridSize; col++) {
            let emptyRow = this.gridSize - 1;
            
            for (let row = this.gridSize - 1; row >= 0; row--) {
                if (this.blocks[row][col] !== null) {
                    if (row !== emptyRow) {
                        // Move block down
                        const block = this.blocks[row][col];
                        this.blocks[emptyRow][col] = block;
                        this.blocks[row][col] = null;
                        
                        const blockScript = block.getComponent(Block);
                        if (blockScript) {
                            blockScript.setPosition(emptyRow, col);
                        }
                        
                        // Animate drop
                        const targetY = this.calculateBlockY(emptyRow);
                        dropAnimations.push(this.animateDrop(block, targetY));
                        hasDropped = true;
                    }
                    emptyRow--;
                }
            }
        }

        // Fill empty spaces with new blocks
        for (let col = 0; col < this.gridSize; col++) {
            for (let row = 0; row < this.gridSize; row++) {
                if (this.blocks[row][col] === null) {
                    const block = instantiate(this.blockPrefab);
                    block.setParent(this.node);
                    
                    const baseScale = this.blockSize / 60;
                    block.setScale(baseScale, baseScale, 1);
                    
                    const x = this.calculateBlockX(col);
                    const startY = this.calculateBlockY(-1); // Start above grid
                    const targetY = this.calculateBlockY(row);
                    block.setPosition(new Vec3(x, startY, 0));
                    
                    const blockScript = block.getComponent(Block);
                    if (blockScript) {
                        const color = Math.floor(Math.random() * 3); // TODO: Use colorCount
                        blockScript.init(row, col, color);
                    }
                    
                    this.blocks[row][col] = block;
                    dropAnimations.push(this.animateDrop(block, targetY));
                    hasDropped = true;
                }
            }
        }

        // Wait for all animations to complete
        if (hasDropped) {
            Promise.all(dropAnimations).then(() => {
                callback();
            });
        } else {
            callback();
        }
    }

    private calculateBlockX(col: number): number {
        return -((this.gridSize - 1) * (this.blockSize + this.spacing)) / 2 + 
               col * (this.blockSize + this.spacing);
    }

    private calculateBlockY(row: number): number {
        return ((this.gridSize - 1) * (this.blockSize + this.spacing)) / 2 - 
               row * (this.blockSize + this.spacing);
    }

    private animateDrop(block: Node, targetY: number): Promise<void> {
        return new Promise((resolve) => {
            import('cc').then(({ tween, Vec3 }) => {
                const currentPos = block.getPosition();
                tween(block)
                    .to(0.3, { position: new Vec3(currentPos.x, targetY, 0) }, { easing: 'cubicOut' })
                    .call(() => resolve())
                    .start();
            });
        });
    }

    /**
     * Swap blocks with animation
     */
    swapBlocks(row1: number, col1: number, row2: number, col2: number, callback?: Function): void {
        const block1 = this.blocks[row1][col1];
        const block2 = this.blocks[row2][col2];
        
        if (!block1 || !block2) {
            console.error('[GridSystem] Cannot swap: block not found');
            if (callback) callback();
            return;
        }

        // Swap in array
        this.blocks[row1][col1] = block2;
        this.blocks[row2][col2] = block1;
        
        // Update block scripts
        const block1Script = block1.getComponent(Block);
        const block2Script = block2.getComponent(Block);
        
        if (block1Script) block1Script.setPosition(row2, col2);
        if (block2Script) block2Script.setPosition(row1, col1);
        
        // Reset scale before swap (use base scale, not 1)
        const baseScale = this.blockSize / 60;
        block1.setScale(baseScale, baseScale, 1);
        block2.setScale(baseScale, baseScale, 1);
        
        // Animate swap
        const pos1 = block1.getPosition();
        const pos2 = block2.getPosition();
        
        import('cc').then(({ tween, Vec3 }) => {
            let completed = 0;
            const onComplete = () => {
                completed++;
                if (completed === 2 && callback) {
                    callback();
                }
            };
            
            tween(block1)
                .to(0.2, { position: new Vec3(pos2.x, pos2.y, 0) })
                .call(onComplete)
                .start();
                
            tween(block2)
                .to(0.2, { position: new Vec3(pos1.x, pos1.y, 0) })
                .call(onComplete)
                .start();
        });
    }

    /**
     * Get block at position
     */
    getBlockAt(row: number, col: number): Block {
        const node = this.blocks[row]?.[col];
        return node?.getComponent(Block);
    }

    getProcessing(): boolean {
        return this.isProcessing;
    }

    setProcessing(value: boolean): void {
        this.isProcessing = value;
    }
}
