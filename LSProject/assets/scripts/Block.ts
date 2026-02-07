import { _decorator, Component, Sprite, Color, EventTouch, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Color Type Enum
 */
export enum ColorType {
    RED = 0,
    YELLOW = 1,
    BLUE = 2,
    ORANGE = 3,
    PURPLE = 4,
    GREEN = 5,
    RAINBOW = 9
}

/**
 * Block Type Enum (障碍类型)
 */
export enum BlockType {
    NORMAL = 0,      // 普通方块
    FROZEN = 1,      // 冰冻方块
    STONE = 2,       // 石头方块
    CHAINED = 3      // 锁链方块
}

/**
 * Color Map
 */
const COLOR_MAP = {
    [ColorType.RED]: new Color(255, 59, 48),
    [ColorType.YELLOW]: new Color(255, 204, 0),
    [ColorType.BLUE]: new Color(0, 122, 255),
    [ColorType.ORANGE]: new Color(255, 149, 0),
    [ColorType.PURPLE]: new Color(175, 82, 222),
    [ColorType.GREEN]: new Color(52, 199, 89),
    [ColorType.RAINBOW]: new Color(255, 255, 255)
};

/**
 * Block Component
 */
@ccclass('Block')
export class Block extends Component {
    @property(Sprite)
    sprite: Sprite = null;

    @property({ tooltip: '选中时的缩放倍数（推荐1.05-1.15）' })
    selectedScale: number = 1.1;

    private colorType: ColorType;
    private blockType: BlockType = BlockType.NORMAL;
    private frozenLevel: number = 0;  // 冰冻层数（0=未冰冻）
    private isChained: boolean = false;  // 是否被锁链
    private row: number;
    private col: number;
    private isSelected: boolean = false;
    private frozenOverlay: Node = null;  // 冰冻覆盖层
    private baseScale: number = 1;  // 基础缩放（由GridSystem设置）

    /**
     * Initialize block
     */
    init(row: number, col: number, forceColor?: ColorType) {
        this.row = row;
        this.col = col;
        
        // Save base scale
        this.baseScale = this.node.scale.x;
        
        if (forceColor !== undefined) {
            this.colorType = forceColor;
        } else {
            this.colorType = Math.floor(Math.random() * 3);
        }
        
        this.updateColor();

        // Add touch event
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    /**
     * Update color
     */
    updateColor() {
        if (this.sprite) {
            this.sprite.color = COLOR_MAP[this.colorType];
        }
    }

    /**
     * Touch end
     */
    onTouchEnd(event: EventTouch) {
        console.log(`[Block] Clicked: [${this.row}, ${this.col}]`);
        
        // Emit event to parent
        this.node.parent.parent.emit('block-clicked', {
            row: this.row,
            col: this.col,
            block: this
        });
    }

    /**
     * Set selected state
     */
    setSelected(selected: boolean) {
        this.isSelected = selected;
        
        if (selected) {
            this.node.setScale(this.baseScale * this.selectedScale, this.baseScale * this.selectedScale, 1);
        } else {
            this.node.setScale(this.baseScale, this.baseScale, 1);
        }
        
        console.log(`[Block] Set selected=${selected} at [${this.row}, ${this.col}], scale=${this.node.scale.x.toFixed(2)}, base=${this.baseScale.toFixed(2)}`);
    }

    /**
     * Get color type
     */
    getColorType(): ColorType {
        return this.colorType;
    }

    /**
     * Set color type
     */
    setColorType(type: ColorType) {
        this.colorType = type;
        this.updateColor();
    }

    /**
     * Get position
     */
    getPosition(): { row: number, col: number } {
        return { row: this.row, col: this.col };
    }

    /**
     * Set position
     */
    setPosition(row: number, col: number) {
        this.row = row;
        this.col = col;
    }

    // ========== 障碍系统 ==========

    /**
     * 设置为冰冻方块
     */
    setFrozen(level: number = 2): void {
        this.blockType = BlockType.FROZEN;
        this.frozenLevel = level;
        this.createFrozenOverlay();
    }

    /**
     * 创建冰冻覆盖层
     */
    private createFrozenOverlay(): void {
        if (this.frozenOverlay) return;

        this.frozenOverlay = new Node('FrozenOverlay');
        this.frozenOverlay.setParent(this.node);
        
        const sprite = this.frozenOverlay.addComponent(Sprite);
        sprite.type = Sprite.Type.SIMPLE;
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        
        // Use UITransform to set size
        import('cc').then(({ UITransform }) => {
            const transform = this.frozenOverlay.addComponent(UITransform);
            transform.setContentSize(60, 60);
        });
        
        sprite.color = new Color(100, 180, 255, 180);  // 半透明蓝色
        
        this.frozenOverlay.setPosition(0, 0, 0);
        this.frozenOverlay.setScale(1.05, 1.05, 1);  // 稍微大一点
        
        console.log(`[Block] Created frozen overlay at [${this.row}, ${this.col}]`);
    }

    /**
     * 旁边消除时触发（解冻）
     */
    onNearbyMatch(): void {
        if (this.blockType === BlockType.FROZEN && this.frozenLevel > 0) {
            this.frozenLevel--;
            console.log(`[Block] Frozen level decreased: ${this.frozenLevel}`);
            
            if (this.frozenLevel === 0) {
                this.unfreeze();
            }
        }
    }

    /**
     * 解冻
     */
    private unfreeze(): void {
        this.blockType = BlockType.NORMAL;
        if (this.frozenOverlay) {
            this.frozenOverlay.destroy();
            this.frozenOverlay = null;
        }
        console.log(`[Block] Unfrozen at [${this.row}, ${this.col}]`);
    }

    /**
     * 是否可以移动
     */
    canMove(): boolean {
        if (this.blockType === BlockType.FROZEN) return false;
        if (this.blockType === BlockType.STONE) return false;
        return true;
    }

    /**
     * 是否可以匹配
     */
    canMatch(): boolean {
        if (this.blockType === BlockType.STONE) return false;
        return true;
    }

    /**
     * 获取方块类型
     */
    getBlockType(): BlockType {
        return this.blockType;
    }

    /**
     * 是否被冰冻
     */
    isFrozen(): boolean {
        return this.blockType === BlockType.FROZEN && this.frozenLevel > 0;
    }
}
