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
};

/**
 * 颜色混合规则
 */
const MIX_RULES = {
    [`${ColorType.RED}_${ColorType.YELLOW}`]: ColorType.ORANGE,
    [`${ColorType.YELLOW}_${ColorType.RED}`]: ColorType.ORANGE,
    [`${ColorType.RED}_${ColorType.BLUE}`]: ColorType.PURPLE,
    [`${ColorType.BLUE}_${ColorType.RED}`]: ColorType.PURPLE,
    [`${ColorType.YELLOW}_${ColorType.BLUE}`]: ColorType.GREEN,
    [`${ColorType.BLUE}_${ColorType.YELLOW}`]: ColorType.GREEN,
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
     */
    init(row: number, col: number) {
        console.log(`[Block] init被调用: [${row},${col}], UUID: ${this.node.uuid}`);
        console.log(`[Block] 调用栈:`, new Error().stack);
        
        this.row = row;
        this.col = col;
        
        // 随机生成三原色之一
        this.colorType = Math.floor(Math.random() * 3);  // 0,1,2 对应红黄蓝
        console.log(`[Block] [${row},${col}] 颜色=${this.colorType}`);
        
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
        console.log(`===点击方块 [${this.row}, ${this.col}]===`);
        
        // 先变红色，2秒后再消失
        if (this.sprite) {
            const Color = require('cc').Color;
            this.sprite.color = new Color(255, 0, 0);
            console.log(`[${this.row}, ${this.col}] 已变红色`);
        }
        
        // 2秒后消失
        this.scheduleOnce(() => {
            console.log(`2秒后，让[${this.row}, ${this.col}]消失...`);
            this.disappear();
        }, 2);
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
     * 让这个方块消失（暴力版：先视觉消失，再销毁）
     */
    disappear() {
        console.log(`[Block] disappear开始: [${this.row},${this.col}]`);
        
        try {
            // 【第1步】立刻视觉上消失
            this.node.active = false;
            console.log(`[Block] active=false`);
            
            this.node.setScale(0, 0, 0);
            console.log(`[Block] scale=0`);
            
            this.node.setPosition(-99999, -99999, 0);
            console.log(`[Block] 移到屏幕外`);
            
            if (this.sprite) {
                const Color = require('cc').Color;
                this.sprite.color = new Color(0, 0, 0, 0);
                console.log(`[Block] 透明度=0`);
            }
            
            // 【第2步】停止动画
            Tween.stopAllByTarget(this.node);
            if (this.sprite) {
                Tween.stopAllByTarget(this.sprite);
            }
            
            // 【第3步】从父节点移除
            if (this.node.parent) {
                this.node.parent.removeChild(this.node);
                console.log(`[Block] 已从父节点移除`);
            }
            
            // 【第4步】销毁
            this.node.destroy();
            console.log(`[Block] 节点已销毁`);
            
        } catch (e) {
            console.error(`[Block] disappear出错:`, e);
        }
    }

    /**
     * 播放混合动画
     */
    playMixAnimation(newColor: ColorType, onComplete?: Function) {
        console.log(`[Block动画] 开始变色: [${this.row},${this.col}] → ${newColor}`);
        
        const oldColor = this.sprite.color.clone();
        const targetColor = COLOR_MAP[newColor];

        // 保存新颜色类型
        this.colorType = newColor;

        // 动画序列：放大 -> 颜色渐变 -> 缩小
        console.log(`[Block动画] 开始tween动画，节点: ${this.node.name}`);
        tween(this.node)
            .to(0.1, { scale: new Vec3(1.3, 1.3, 1) })  // 快速放大
            .call(() => {
                console.log(`[Block动画] 开始颜色渐变`);
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
