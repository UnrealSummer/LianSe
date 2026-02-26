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
    CHAINED = 3,     // 锁链方块
    BOMB = 4,        // 炸弹方块
    RAINBOW_BLOCK = 5 // 彩虹方块（特殊）
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

    // ========== 特殊方块资源 ==========
    @property(SpriteFrame)
    rainbowSprite: SpriteFrame = null;

    @property(SpriteFrame)
    stoneSprite: SpriteFrame = null;

    @property(SpriteFrame)
    frozenOverlaySprite: SpriteFrame = null;
    
    @property(SpriteFrame)
    iceCracksSprite: SpriteFrame = null;
    
    @property(SpriteFrame)
    bombSprite: SpriteFrame = null;
    
    @property(SpriteFrame)
    rainbowBlockSprite: SpriteFrame = null;
    // ==================================
    
    // ========== 消除动画资源 ==========
    @property([SpriteFrame])
    eliminateFrames: SpriteFrame[] = [];
    // ==================================

    private colorType: ColorType;
    private blockType: BlockType = BlockType.NORMAL;
    private frozenLevel: number = 0;  // 冰冻层数（0=未冰冻）
    private isChained: boolean = false;  // 是否被锁链
    private row: number;
    private col: number;
    private isSelected: boolean = false;
    private frozenOverlay: Node = null;  // 冰冻覆盖层
    private frozenCracks: Node = null;  // 冰裂纹层
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
            case ColorType.RAINBOW:
                spriteFrame = this.rainbowSprite;
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
        
        // 使用石头图片
        if (this.sprite && this.stoneSprite) {
            this.sprite.spriteFrame = this.stoneSprite;
            this.sprite.color = Color.WHITE;  // 显示原色
            console.log(`[Block] Using stone sprite at [${this.row}, ${this.col}]`);
        } else if (this.sprite) {
            // 降级：如果没有图片，使用灰色
            this.sprite.spriteFrame = null;
            this.sprite.color = new Color(100, 100, 100, 255);
            console.log(`[Block] Using gray color (no sprite) at [${this.row}, ${this.col}]`);
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
     * 创建冰冻覆盖层（纯代码实现）
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
        
        // 纯色半透明浅蓝色覆盖层
        sprite.color = new Color(180, 220, 255, 100);  // 浅蓝色，半透明（alpha=100）
        
        // Add UITransform
        import('cc').then(({ UITransform }) => {
            const transform = this.frozenOverlay.getComponent(UITransform) || this.frozenOverlay.addComponent(UITransform);
            transform.setContentSize(64, 64);
            console.log(`[Block] Frozen overlay size set: 64x64`);
        });
        
        this.frozenOverlay.setPosition(0, 0, 1);  // z=1 to be on top
        this.frozenOverlay.setScale(1.0, 1.0, 1);
        
        // 添加白色边框增强冰冻效果
        this.addFrozenBorder();
        
        console.log(`[Block] Frozen overlay created successfully at [${this.row}, ${this.col}]`);
    }

    /**
     * 添加冰冻边框效果
     */
    private addFrozenBorder(): void {
        const border = new Node('FrozenBorder');
        border.setParent(this.frozenOverlay);
        border.layer = this.node.layer;
        
        const sprite = border.addComponent(Sprite);
        sprite.type = Sprite.Type.SIMPLE;
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        
        // 白色边框，半透明
        sprite.color = new Color(255, 255, 255, 120);
        
        import('cc').then(({ UITransform }) => {
            const transform = border.getComponent(UITransform) || border.addComponent(UITransform);
            transform.setContentSize(68, 68);  // 比主体稍大
        });
        
        border.setPosition(0, 0, -1);  // z=-1 在主体后面
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
                
                // 如果还有冰层，显示裂纹
                if (this.frozenLevel === 1) {
                    this.showFrozenCracks();
                }
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
        
        if (this.frozenCracks) {
            this.frozenCracks.destroy();
            this.frozenCracks = null;
        }
        
        console.log(`[Block] Unfrozen at [${this.row}, ${this.col}]`);
    }

    /**
     * 显示冰裂纹效果
     */
    private showFrozenCracks(): void {
        if (this.frozenCracks || !this.frozenOverlay) {
            return;
        }

        console.log(`[Block] Showing frozen cracks at [${this.row}, ${this.col}]`);
        
        this.frozenCracks = new Node('FrozenCracks');
        this.frozenCracks.setParent(this.frozenOverlay);
        this.frozenCracks.layer = this.node.layer;
        
        const sprite = this.frozenCracks.addComponent(Sprite);
        sprite.type = Sprite.Type.SIMPLE;
        sprite.sizeMode = Sprite.SizeMode.CUSTOM;
        
        // 优先使用裂纹图片
        if (this.iceCracksSprite) {
            sprite.spriteFrame = this.iceCracksSprite;
            sprite.color = Color.WHITE;  // 显示原色
            console.log(`[Block] Using ice cracks sprite`);
            
            import('cc').then(({ UITransform }) => {
                const transform = this.frozenCracks.getComponent(UITransform) || this.frozenCracks.addComponent(UITransform);
                transform.setContentSize(64, 64);
            });
            
            this.frozenCracks.setPosition(0, 0, 2);  // z=2 在冰层上方
        } else {
            // 降级：使用代码绘制
            console.log(`[Block] No sprite, using code-drawn cracks`);
            this.drawCodeCracks();
        }
    }

    /**
     * 代码绘制裂纹（降级方案）
     */
    private drawCodeCracks(): void {
        import('cc').then(({ Graphics, UITransform, Color }) => {
            const graphics = this.frozenCracks.addComponent(Graphics);
            const transform = this.frozenCracks.getComponent(UITransform) || this.frozenCracks.addComponent(UITransform);
            transform.setContentSize(64, 64);
            
            graphics.lineWidth = 3;
            graphics.strokeColor = new Color(255, 255, 255, 220);
            
            // 绘制放射状裂纹
            const centerX = 0;
            const centerY = 0;
            const numMainCracks = 4;
            
            for (let i = 0; i < numMainCracks; i++) {
                const angle = (Math.PI * 2 / numMainCracks) * i + (Math.random() - 0.5) * 0.3;
                this.drawRadialCrack(graphics, centerX, centerY, angle);
            }
            
            for (let i = 0; i < 3; i++) {
                this.drawSmallCrack(graphics);
            }
            
            graphics.stroke();
            this.frozenCracks.setPosition(0, 0, 2);
        });
    }

    /**
     * 绘制放射状裂纹
     */
    private drawRadialCrack(graphics: any, centerX: number, centerY: number, angle: number): void {
        graphics.moveTo(centerX, centerY);
        
        // 主裂纹 - 从中心向外
        const length = 25 + Math.random() * 10;
        let currentX = centerX;
        let currentY = centerY;
        
        // 分段绘制，增加曲折感
        const segments = 3;
        for (let i = 0; i < segments; i++) {
            const segmentLength = length / segments;
            const segmentAngle = angle + (Math.random() - 0.5) * 0.2;  // 轻微偏移
            
            currentX += Math.cos(segmentAngle) * segmentLength;
            currentY += Math.sin(segmentAngle) * segmentLength;
            graphics.lineTo(currentX, currentY);
        }
        
        // 添加分支
        const branchX = centerX + Math.cos(angle) * length * 0.6;
        const branchY = centerY + Math.sin(angle) * length * 0.6;
        graphics.moveTo(branchX, branchY);
        
        const branchAngle = angle + (Math.random() > 0.5 ? 0.5 : -0.5);
        const branchLength = length * 0.4;
        graphics.lineTo(
            branchX + Math.cos(branchAngle) * branchLength,
            branchY + Math.sin(branchAngle) * branchLength
        );
    }

    /**
     * 绘制小裂纹
     */
    private drawSmallCrack(graphics: any): void {
        const startX = (Math.random() - 0.5) * 40;
        const startY = (Math.random() - 0.5) * 40;
        
        graphics.moveTo(startX, startY);
        
        const angle = Math.random() * Math.PI * 2;
        const length = 8 + Math.random() * 8;
        
        graphics.lineTo(
            startX + Math.cos(angle) * length,
            startY + Math.sin(angle) * length
        );
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
    
    /**
     * 播放消除动画
     */
    playEliminateAnimation(callback?: Function) {
        // 生成粒子特效
        import('./ParticleManager').then(({ ParticleManager }) => {
            const particleManager = ParticleManager.getInstance();
            if (particleManager) {
                const worldPos = this.node.getWorldPosition();
                particleManager.spawnStarBurst(worldPos, 8);
                console.log('[Block] Spawned star particles at', worldPos);
            } else {
                console.warn('[Block] ParticleManager not found');
            }
        });
        
        // 如果没有动画帧，直接销毁
        if (!this.eliminateFrames || this.eliminateFrames.length === 0) {
            if (callback) callback();
            this.node.destroy();
            return;
        }
        
        // 播放帧动画
        let frameIndex = 0;
        const frameRate = 10; // 10帧/秒
        const frameInterval = 1.0 / frameRate;
        let elapsed = 0;
        
        const updateFrame = (dt: number) => {
            elapsed += dt;
            if (elapsed >= frameInterval) {
                elapsed = 0;
                frameIndex++;
                
                if (frameIndex >= this.eliminateFrames.length) {
                    // 动画播放完毕
                    this.unschedule(updateFrame);
                    if (callback) callback();
                    this.node.destroy();
                } else {
                    // 更新帧
                    if (this.sprite) {
                        this.sprite.spriteFrame = this.eliminateFrames[frameIndex];
                    }
                }
            }
        };
        
        // 设置第一帧
        if (this.sprite) {
            this.sprite.spriteFrame = this.eliminateFrames[0];
        }
        
        // 开始播放
        this.schedule(updateFrame, 0);
    }
    
    /**
     * 触发消除（带粒子特效）
     */
    triggerEliminate() {
        // 生成粒子特效
        const ParticleManager = require('./ParticleManager').ParticleManager;
        const particleManager = ParticleManager.getInstance();
        if (particleManager) {
            const worldPos = this.node.getWorldPosition();
            particleManager.spawnStarBurst(worldPos, 8);
        }
        
        // 播放消除动画
        this.playEliminateAnimation();
    }
    
    /**
     * 设置为炸弹方块
     */
    setAsBomb() {
        this.blockType = BlockType.BOMB;
        if (this.sprite && this.bombSprite) {
            this.sprite.spriteFrame = this.bombSprite;
        }
    }
    
    /**
     * 设置为彩虹方块
     */
    setAsRainbowBlock() {
        this.blockType = BlockType.RAINBOW_BLOCK;
        this.colorType = ColorType.RAINBOW;
        if (this.sprite && this.rainbowBlockSprite) {
            this.sprite.spriteFrame = this.rainbowBlockSprite;
        }
    }
    
    /**
     * 是否是炸弹方块
     */
    isBomb(): boolean {
        return this.blockType === BlockType.BOMB;
    }
    
    /**
     * 是否是彩虹方块（特殊）
     */
    isRainbowBlock(): boolean {
        return this.blockType === BlockType.RAINBOW_BLOCK;
    }
}
