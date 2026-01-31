import { _decorator, Component, Node, Sprite, Color, EventTouch, tween, Vec3, Tween } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 颜色类型枚举
 */
export enum ColorType {
    RED = 0,      // 红
    YELLOW = 1,   // 黄
    BLUE = 2,     // 蓝
    ORANGE = 3,   // 橙（红+黄）
    PURPLE = 4,   // 紫（红+蓝）
    GREEN = 5,    // 绿（黄+蓝）
    // 强化色（版本1新增）
    DEEP_RED = 6,     // 深红（红+红）
    DEEP_YELLOW = 7,  // 深黄（黄+黄）
    DEEP_BLUE = 8,    // 深蓝（蓝+蓝）
    // 特殊方块
    RAINBOW = 9,      // 彩虹（可与任意颜色混合）
}

/**
 * 颜色映射
 */
const COLOR_MAP = {
    [ColorType.RED]: new Color(255, 59, 48),      // 鲜红
    [ColorType.YELLOW]: new Color(255, 204, 0),   // 鲜黄
    [ColorType.BLUE]: new Color(0, 122, 255),     // 鲜蓝
    [ColorType.ORANGE]: new Color(255, 149, 0),   // 橙色
    [ColorType.PURPLE]: new Color(175, 82, 222),  // 紫色
    [ColorType.GREEN]: new Color(52, 199, 89),    // 绿色
    // 强化色（更深、更饱和）
    [ColorType.DEEP_RED]: new Color(180, 0, 0),       // 深红
    [ColorType.DEEP_YELLOW]: new Color(200, 160, 0),  // 深黄（金色）
    [ColorType.DEEP_BLUE]: new Color(0, 50, 150),     // 深蓝
    // 特殊方块
    [ColorType.RAINBOW]: new Color(255, 255, 255),    // 彩虹（白色，后续可加渐变效果）
};

/**
 * 颜色混合规则
 */
const MIX_RULES = {
    // 基础混合（三原色→二次色）
    [`${ColorType.RED}_${ColorType.YELLOW}`]: ColorType.ORANGE,
    [`${ColorType.YELLOW}_${ColorType.RED}`]: ColorType.ORANGE,
    [`${ColorType.RED}_${ColorType.BLUE}`]: ColorType.PURPLE,
    [`${ColorType.BLUE}_${ColorType.RED}`]: ColorType.PURPLE,
    [`${ColorType.YELLOW}_${ColorType.BLUE}`]: ColorType.GREEN,
    [`${ColorType.BLUE}_${ColorType.YELLOW}`]: ColorType.GREEN,
    
    // 强化混合（同色+同色→强化色）
    [`${ColorType.RED}_${ColorType.RED}`]: ColorType.DEEP_RED,
    [`${ColorType.YELLOW}_${ColorType.YELLOW}`]: ColorType.DEEP_YELLOW,
    [`${ColorType.BLUE}_${ColorType.BLUE}`]: ColorType.DEEP_BLUE,
    
    // 彩虹方块规则（可与任意颜色混合，结果为对方颜色的强化版）
    // 彩虹+红→深红
    [`${ColorType.RAINBOW}_${ColorType.RED}`]: ColorType.DEEP_RED,
    [`${ColorType.RED}_${ColorType.RAINBOW}`]: ColorType.DEEP_RED,
    [`${ColorType.RAINBOW}_${ColorType.YELLOW}`]: ColorType.DEEP_YELLOW,
    [`${ColorType.YELLOW}_${ColorType.RAINBOW}`]: ColorType.DEEP_YELLOW,
    [`${ColorType.RAINBOW}_${ColorType.BLUE}`]: ColorType.DEEP_BLUE,
    [`${ColorType.BLUE}_${ColorType.RAINBOW}`]: ColorType.DEEP_BLUE,
    // 彩虹+二次色→保持二次色
    [`${ColorType.RAINBOW}_${ColorType.ORANGE}`]: ColorType.ORANGE,
    [`${ColorType.ORANGE}_${ColorType.RAINBOW}`]: ColorType.ORANGE,
    [`${ColorType.RAINBOW}_${ColorType.PURPLE}`]: ColorType.PURPLE,
    [`${ColorType.PURPLE}_${ColorType.RAINBOW}`]: ColorType.PURPLE,
    [`${ColorType.RAINBOW}_${ColorType.GREEN}`]: ColorType.GREEN,
    [`${ColorType.GREEN}_${ColorType.RAINBOW}`]: ColorType.GREEN,
};

/**
 * 方块组件
 */
@ccclass('Block')
export class Block extends Component {
    @property(Sprite)
    sprite: Sprite = null;

    private colorType: ColorType;
    private row: number;
    private col: number;
    private isSelected: boolean = false;

    /**
     * 初始化方块
     * @param row 行号
     * @param col 列号
     * @param forceColor 强制指定颜色（可选），用于生成特殊方块
     */
    init(row: number, col: number, forceColor?: ColorType) {
        this.row = row;
        this.col = col;
        
        if (forceColor !== undefined) {
            // 强制指定颜色（特殊方块）
            this.colorType = forceColor;
        } else {
            // 5%概率生成彩虹方块
            const random = Math.random();
            if (random < 0.05) {
                this.colorType = ColorType.RAINBOW;
            } else {
                // 随机生成三原色之一
                this.colorType = Math.floor(Math.random() * 3);  // 0,1,2 对应红黄蓝
            }
        }
        
        this.updateColor();

        // 添加触摸事件
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    /**
     * 更新方块颜色
     */
    updateColor() {
        if (this.sprite) {
            this.sprite.color = COLOR_MAP[this.colorType];
        }
    }

    /**
     * 触摸事件
     */
    onTouchEnd(event: EventTouch) {
        console.log(`点击方块 [${this.row}, ${this.col}]`);
        
        // 通知GameManager处理点击
        const gameManager = this.node.parent.parent.getComponent('GameManager');
        if (gameManager) {
            gameManager.onBlockClick(this);
        }
    }

    /**
     * 设置选中状态
     */
    setSelected(selected: boolean) {
        this.isSelected = selected;
        
        // 选中时放大，未选中时恢复
        if (selected) {
            this.node.setScale(1.15, 1.15, 1);
        } else {
            this.node.setScale(1, 1, 1);
        }
    }

    /**
     * 获取颜色类型
     */
    getColorType(): ColorType {
        return this.colorType;
    }

    /**
     * 设置颜色类型
     */
    setColorType(type: ColorType) {
        this.colorType = type;
        this.updateColor();
    }

    /**
     * 获取行列位置
     */
    getPosition(): { row: number, col: number } {
        return { row: this.row, col: this.col };
    }

    /**
     * 判断是否相邻
     */
    isAdjacent(other: Block): boolean {
        const rowDiff = Math.abs(this.row - other.row);
        const colDiff = Math.abs(this.col - other.col);
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }

    /**
     * 尝试混合颜色
     */
    static mixColors(color1: ColorType, color2: ColorType): ColorType | null {
        const key = `${color1}_${color2}`;
        return MIX_RULES[key] || null;
    }

    /**
     * 判断是否为基础三原色
     */
    static isPrimaryColor(color: ColorType): boolean {
        return color === ColorType.RED || color === ColorType.YELLOW || color === ColorType.BLUE;
    }

    /**
     * 判断是否为强化色
     */
    static isEnhancedColor(color: ColorType): boolean {
        return color === ColorType.DEEP_RED || color === ColorType.DEEP_YELLOW || color === ColorType.DEEP_BLUE;
    }

    /**
     * 判断是否为特殊方块
     */
    static isSpecialBlock(color: ColorType): boolean {
        return color === ColorType.RAINBOW;
    }

    /**
     * 获取颜色名称
     */
    static getColorName(color: ColorType): string {
        const names = {
            [ColorType.RED]: '红色',
            [ColorType.YELLOW]: '黄色',
            [ColorType.BLUE]: '蓝色',
            [ColorType.ORANGE]: '橙色',
            [ColorType.PURPLE]: '紫色',
            [ColorType.GREEN]: '绿色',
            [ColorType.DEEP_RED]: '深红',
            [ColorType.DEEP_YELLOW]: '深黄',
            [ColorType.DEEP_BLUE]: '深蓝',
            [ColorType.RAINBOW]: '彩虹',
        };
        return names[color] || '未知';
    }

    /**
     * 让这个方块消失
     */
    disappear() {
        try {
            // 停止动画
            Tween.stopAllByTarget(this.node);
            if (this.sprite) {
                Tween.stopAllByTarget(this.sprite);
            }
            
            // 立即隐藏（重要！destroy是延迟的）
            this.node.active = false;
            
            // 从父节点移除
            if (this.node.parent) {
                this.node.parent.removeChild(this.node);
            }
            
            // 销毁
            this.node.destroy();
            
        } catch (e) {
            console.error(`[Block] disappear出错:`, e);
        }
    }

    /**
     * 播放混合动画
     */
    playMixAnimation(newColor: ColorType, onComplete?: Function) {
        const oldColor = this.sprite.color.clone();
        const targetColor = COLOR_MAP[newColor];

        // 保存新颜色类型
        this.colorType = newColor;

        // 动画序列：放大 -> 颜色渐变 -> 缩小
        tween(this.node)
            .to(0.1, { scale: new Vec3(1.3, 1.3, 1) })  // 快速放大
            .call(() => {
                // 颜色渐变
                tween(this.sprite)
                    .to(0.3, { color: targetColor }, {
                        onUpdate: (target: Sprite, ratio: number) => {
                            // 手动插值颜色
                            const r = oldColor.r + (targetColor.r - oldColor.r) * ratio;
                            const g = oldColor.g + (targetColor.g - oldColor.g) * ratio;
                            const b = oldColor.b + (targetColor.b - oldColor.b) * ratio;
                            target.color = new Color(r, g, b);
                        }
                    })
                    .start();
            })
            .to(0.15, { scale: new Vec3(1, 1, 1) })  // 恢复大小
            .call(() => {
                if (onComplete) {
                    onComplete();
                }
            })
            .start();
    }

    /**
     * 更新行列位置（用于掉落）
     */
    updateRowCol(row: number, col: number) {
        this.row = row;
        this.col = col;
    }

    /**
     * 播放掉落动画
     */
    playDropAnimation(targetRow: number, targetCol: number) {
        // 计算目标位置
        const gridManager = this.node.parent.getComponent('GridManager');
        if (!gridManager) return;

        const blockSize = gridManager.blockSize;
        const spacing = gridManager.spacing;
        const gridSize = gridManager.gridSize;

        const startX = -((gridSize - 1) * (blockSize + spacing)) / 2;
        const startY = ((gridSize - 1) * (blockSize + spacing)) / 2;

        const targetX = startX + targetCol * (blockSize + spacing);
        const targetY = startY - targetRow * (blockSize + spacing);

        // 掉落动画（带缓动）
        tween(this.node)
            .to(0.3, { position: new Vec3(targetX, targetY, 0) }, {
                easing: 'cubicOut'  // 重力感的缓动
            })
            .start();
    }
}
