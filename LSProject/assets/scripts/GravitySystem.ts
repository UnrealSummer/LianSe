/**
 * 重力方向枚举
 */
export enum GravityDirection {
    DOWN = 0,   // 向下（默认）
    UP = 1,     // 向上
    LEFT = 2,   // 向左
    RIGHT = 3   // 向右
}

/**
 * 重力系统
 */
export class GravitySystem {
    private currentDirection: GravityDirection = GravityDirection.DOWN;
    
    /**
     * 获取当前重力方向
     */
    getCurrentDirection(): GravityDirection {
        return this.currentDirection;
    }
    
    /**
     * 设置重力方向
     */
    setDirection(direction: GravityDirection): void {
        console.log(`[GravitySystem] Gravity changed: ${this.getDirectionName(this.currentDirection)} -> ${this.getDirectionName(direction)}`);
        this.currentDirection = direction;
    }
    
    /**
     * 获取方向名称
     */
    getDirectionName(direction: GravityDirection): string {
        switch (direction) {
            case GravityDirection.DOWN: return '↓ 向下';
            case GravityDirection.UP: return '↑ 向上';
            case GravityDirection.LEFT: return '← 向左';
            case GravityDirection.RIGHT: return '→ 向右';
            default: return '未知';
        }
    }
    
    /**
     * 获取方向箭头
     */
    getDirectionArrow(direction: GravityDirection): string {
        switch (direction) {
            case GravityDirection.DOWN: return '↓';
            case GravityDirection.UP: return '↑';
            case GravityDirection.LEFT: return '←';
            case GravityDirection.RIGHT: return '→';
            default: return '?';
        }
    }
    
    /**
     * 重置为默认方向
     */
    reset(): void {
        this.currentDirection = GravityDirection.DOWN;
    }
}
