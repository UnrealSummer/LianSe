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
    private row: number;
    private col: number;
    private isSelected: boolean = false;

    /**
     * Initialize block
     */
    init(row: number, col: number, forceColor?: ColorType) {
        this.row = row;
        this.col = col;
        
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
            this.node.setScale(this.selectedScale, this.selectedScale, 1);
        } else {
            this.node.setScale(1, 1, 1);
        }
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
}
