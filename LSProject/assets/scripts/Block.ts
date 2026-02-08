import { _decorator, Component, Sprite, Color, EventTouch, Node, Vec3, UITransform, SpriteFrame } from 'cc';
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

    @property(SpriteFrame)
    redSprite: SpriteFrame = null;
    
    @property(SpriteFrame)
    yellowSprite: SpriteFrame = null;
    
    @property(SpriteFrame)
    blueSprite: SpriteFrame = null;
    
    @property(SpriteFrame)
    orangeSprite: SpriteFrame = null;
    
    @property(SpriteFrame)
    purpleSprite: SpriteFrame = null;
    
    @property(SpriteFrame)
    greenSprite: SpriteFrame = null;

    private colorType: ColorType;
    private blockType: BlockType = BlockType.NORMAL;
    private frozenLevel: number = 0;  // 冰冻层数（0=未冰冻）
    private isChained: boolean = false;  // 是否被锁链
    private row: number;
    private col: number;
    private isSelected: boolean = false;
    private frozenOverlay: Node = null;  // 冰冻覆盖层
    private baseScale: number = 1;  // 基础缩放（由GridSystem设置）
    private touchStartPos: Vec3 = null;  // 触摸开始位置
    private isDragging: boolean = false;  // 是否正在拖拽

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

        // Add touch events
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    /**
     * Update color
     */
    updateColor() {
        if (!this.sprite) {
            console.error('[Block] updateColor: sprite is null!');
            return;
        }
        
        // 彩虹方块保持白色
        if (this.colorType === ColorType.RAINBOW) {
            this.sprite.color = COLOR_MAP[this.colorType];
            this.sprite.spriteFrame = null;
            return;
        }
        
        // 根据颜色类型选择对应的图片
        let spriteFrame: SpriteFrame = null;
        switch (this.colorType) {
            case ColorType.RED:
                spriteFrame = this.redSprite;
                break;
            case ColorType.YELLOW:
                spriteFrame = this.yellowSprite;
                break;
            case ColorType.BLUE:
                spriteFrame = this.blueSprite;
                break;
            case ColorType.ORANGE:
                spriteFrame = this.orangeSprite;
                break;
            case ColorType.PURPLE:
                spriteFrame = this.purpleSprite;
                break;
            case ColorType.GREEN:
                spriteFrame = this.greenSprite;
                break;
        }
        
        // 如果有图片，使用图片；否则使用纯色
        if (spriteFrame) {
            this.sprite.spriteFrame = spriteFrame;
            this.sprite.color = Color.WHITE; // 显示原色
            console.log(`[Block] Using sprite for color ${this.colorType}`);
        } else {
            this.sprite.spriteFrame = null;
            this.sprite.color = COLOR_MAP[this.colorType];
            console.log(`[Block] Using solid color for color ${this.colorType}`);
        }
    }

    /**
     * Touch end
     */
    /**
     * Touch start
     */
    onTouchStart(event: EventTouch): void {
        const touchPos = event.getUILocation();
        this.touchStartPos = new Vec3(touchPos.x, touchPos.y, 0);
        this.isDragging = false;
    }

    /**
     * Touch move - detect swipe
     */
    onTouchMove(event: EventTouch): void {
        if (!this.touchStartPos) return;
        
        const touchPos = event.getUILocation();
        const currentPos = new Vec3(touchPos.x, touchPos.y, 0);
        
        const deltaX = currentPos.x - this.touchStartPos.x;
        const deltaY = currentPos.y - this.touchStartPos.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // 滑动距离超过30像素，判定为拖拽
        if (distance > 30 && !this.isDragging) {
            this.isDragging = true;
            
            // 判断滑动方向
            const absX = Math.abs(deltaX);
            const absY = Math.abs(deltaY);
            
            let targetRow = this.row;
            let targetCol = this.col;
            
            if (absX > absY) {
                // 横向滑动
                if (deltaX > 0) {
                    targetCol = this.col + 1;  // 向右
                } else {
                    targetCol = this.col - 1;  // 向左
                }
            } else {
                // 纵向滑动
                if (deltaY > 0) {
                    targetRow = this.row - 1;  // 向上（Y轴向上为正，但row向下增加）
                } else {
                    targetRow = this.row + 1;  // 向下
                }
            }
            
            // 触发交换
            console.log(`[Block] Swipe detected: [${this.row}, ${this.col}] -> [${targetRow}, ${targetCol}]`);
            this.node.parent.parent.emit('block-swipe', {
                row1: this.row,
                col1: this.col,
                row2: targetRow,
                col2: targetCol,
                block: this
            });
        }
    }

    /**
     * Touch end - click or swipe complete
     */
    onTouchEnd(event: EventTouch) {
        if (!this.isDragging && this.touchStartPos) {
            // 没有拖拽，判定为点击
            console.log(`[Block] Clicked: [${this.row}, ${this.col}]`);
            
            // Emit event to parent
            this.node.parent.parent.emit('block-clicked', {
                row: this.row,
                col: this.col,
                block: this
            });
        }
        
        this.touchStartPos = null;
        this.isDragging = false;
    }

    /**
     * Touch cancel
     */
    onTouchCancel(event: EventTouch): void {
        this.touchStartPos = null;
        this.isDragging = false;
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
        
        console.log(`[Block] Setting frozen at [${this.row}, ${this.col}], level=${level}`);
        
        // Method 1: Change block color to blue (more obvious)
        if (this.sprite) {
            const originalColor = this.sprite.color.clone();
            this.sprite.color = new Color(
                Math.floor(originalColor.r * 0.5),
                Math.floor(originalColor.g * 0.5),
                255,  // Full blue
                255
            );
            console.log(`[Block] Changed color to blue at [${this.row}, ${this.col}]`);
        }
        
        // Method 2: Also create overlay
        this.createFrozenOverlay();
    }

    /**
     * 设置为石头方块
     */
    setStone(): void {
        this.blockType = BlockType.STONE;
        
        console.log(`[Block] Setting stone at [${this.row}, ${this.col}]`);
        
        // Change to gray color
        if (this.sprite) {
            this.sprite.color = new Color(100, 100, 100, 255);  // 深灰色
            console.log(`[Block] Changed color to gray at [${this.row}, ${this.col}]`);
        }
    }

    /**
     * 设置为彩虹方块
     */
    setRainbow(): void {
        this.colorType = ColorType.RAINBOW;
        
        console.log(`[Block] Setting rainbow at [${this.row}, ${this.col}]`);
        
        // Rainbow gradient effect
        if (this.sprite) {
            this.sprite.color = new Color(255, 255, 255, 255);  // 白色基础
            console.log(`[Block] Changed to rainbow at [${this.row}, ${this.col}]`);
            
            // Add rainbow animation
            this.startRainbowAnimation();
        }
    }

    /**
     * 彩虹动画
     */
    private startRainbowAnimation(): void {
        if (!this.sprite) return;
        
        import('cc').then(({ tween, Color }) => {
            const colors = [
                new Color(255, 0, 0),      // 红
                new Color(255, 127, 0),    // 橙
                new Color(255, 255, 0),    // 黄
                new Color(0, 255, 0),      // 绿
                new Color(0, 127, 255),    // 蓝
                new Color(139, 0, 255)     // 紫
            ];
            
            let colorIndex = 0;
            const animateColor = () => {
                if (!this.sprite || !this.node.isValid) return;
                
                tween(this.sprite)
                    .to(0.5, { color: colors[colorIndex] })
                    .call(() => {
                        colorIndex = (colorIndex + 1) % colors.length;
                        animateColor();
                    })
                    .start();
            };
            
            animateColor();
        });
    }

    /**
     * 创建冰冻覆盖层
     */
    private createFrozenOverlay(): void {
        if (this.frozenOverlay) {
            console.log(`[Block] Frozen overlay already exists at [${this.row}, ${this.col}]`);
            return;
        }

        console.log(`[Block] Creating frozen overlay at [${this.row}, ${this.col}]`);
        
        this.frozenOverlay = new Node('FrozenOverlay');
        this.frozenOverlay.setParent(this.node);
        this.frozenOverlay.layer = this.node.layer;
        
        const sprite = this.frozenOverlay.addComponent(Sprite);
        sprite.type = Sprite.Type.SIMPLE;
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        
        // Set bright blue color with high alpha
        sprite.color = new Color(0, 150, 255, 220);  // 明亮的蓝色，高不透明度
        
        // Add UITransform
        import('cc').then(({ UITransform }) => {
            const transform = this.frozenOverlay.getComponent(UITransform) || this.frozenOverlay.addComponent(UITransform);
            transform.setContentSize(60, 60);
            console.log(`[Block] Frozen overlay size set: 60x60`);
        });
        
        this.frozenOverlay.setPosition(0, 0, 1);  // z=1 to be on top
        this.frozenOverlay.setScale(1.1, 1.1, 1);
        
        console.log(`[Block] Frozen overlay created successfully at [${this.row}, ${this.col}]`);
    }

    /**
     * 旁边消除时触发（解冻）
     */
    onNearbyMatch(): void {
        if (this.blockType === BlockType.FROZEN && this.frozenLevel > 0) {
            // Check for frost breaker modifier
            const gameCore = this.node.parent.parent.getComponent('GameCore');
            const modifierSystem = gameCore?.modifierSystem;
            const hasFrostBreaker = modifierSystem?.hasModifier('frost_breaker');
            
            if (hasFrostBreaker) {
                // Frost breaker: instant unfreeze
                this.frozenLevel = 0;
                console.log(`[Block] ❄️ Frost Breaker: Instant unfreeze!`);
            } else {
                // Normal: decrease level
                this.frozenLevel--;
                console.log(`[Block] Frozen level decreased: ${this.frozenLevel}`);
            }
            
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
        
        // Restore original color
        this.updateColor();
        
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
     * 是否可以和指定颜色匹配
     */
    canMatchWithColor(color: ColorType): boolean {
        if (this.colorType === ColorType.RAINBOW) return true;  // 彩虹可以和任意颜色匹配
        if (color === ColorType.RAINBOW) return true;  // 任意颜色可以和彩虹匹配
        return this.colorType === color;
    }

    /**
     * 是否是彩虹方块
     */
    isRainbow(): boolean {
        return this.colorType === ColorType.RAINBOW;
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
