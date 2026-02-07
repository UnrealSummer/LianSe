import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

/**
 * 障碍配置
 */
export interface ObstacleConfig {
    type: 'frozen' | 'stone' | 'chained';
    row: number;
    col: number;
    level?: number;  // 冰冻层数
}

/**
 * 关卡配置
 */
export interface LevelConfig {
    stage: number;
    colorCount: number;
    enemyHp: number;
    timeLimit: number;
    obstacles: ObstacleConfig[];
}

/**
 * 关卡生成器
 * 根据关卡数生成配置
 */
@ccclass('LevelGenerator')
export class LevelGenerator extends Component {
    
    /**
     * 生成关卡配置
     */
    generateLevel(stage: number): LevelConfig {
        return {
            stage: stage,
            colorCount: this.getColorCount(stage),
            enemyHp: this.getEnemyHp(stage),
            timeLimit: this.getTimeLimit(stage),
            obstacles: this.generateObstacles(stage)
        };
    }

    /**
     * 生成障碍配置
     */
    private generateObstacles(stage: number): ObstacleConfig[] {
        const obstacles: ObstacleConfig[] = [];
        
        // 第6关开始：冰冻方块
        if (stage >= 6) {
            const frozenCount = this.getFrozenCount(stage);
            obstacles.push(...this.createFrozenObstacles(frozenCount));
        }
        
        // 第11关开始：石头方块
        if (stage >= 11) {
            const stoneCount = this.getStoneCount(stage);
            obstacles.push(...this.createStoneObstacles(stoneCount));
        }
        
        // TODO: 第13关开始：锁链方块
        
        return obstacles;
    }

    /**
     * 获取冰冻方块数量
     */
    private getFrozenCount(stage: number): number {
        if (stage < 6) return 0;
        if (stage < 11) return 1 + Math.floor((stage - 6) / 2);  // 6-10关：1-3个
        if (stage < 16) return 2 + Math.floor((stage - 11) / 2); // 11-15关：2-4个
        return 3 + Math.floor((stage - 16) / 3);  // 16+关：3-5个
    }

    /**
     * 获取石头方块数量
     */
    private getStoneCount(stage: number): number {
        if (stage < 11) return 0;
        if (stage < 16) return 2 + Math.floor((stage - 11) / 2);  // 11-15关：2-4个
        return 3 + Math.floor((stage - 16) / 2);  // 16+关：3-5个
    }

    /**
     * 创建冰冻障碍
     */
    private createFrozenObstacles(count: number): ObstacleConfig[] {
        const obstacles: ObstacleConfig[] = [];
        const positions = this.getRandomPositions(count);
        
        for (const pos of positions) {
            obstacles.push({
                type: 'frozen',
                row: pos.row,
                col: pos.col,
                level: 2  // 需要解冻2次
            });
        }
        
        return obstacles;
    }

    /**
     * 创建石头障碍
     */
    private createStoneObstacles(count: number): ObstacleConfig[] {
        const obstacles: ObstacleConfig[] = [];
        const positions = this.getRandomPositions(count);
        
        for (const pos of positions) {
            obstacles.push({
                type: 'stone',
                row: pos.row,
                col: pos.col
            });
        }
        
        return obstacles;
    }

    /**
     * 获取随机位置（不重复）
     */
    private getRandomPositions(count: number): Array<{ row: number, col: number }> {
        const positions: Array<{ row: number, col: number }> = [];
        const gridSize = 8;
        
        while (positions.length < count) {
            const row = Math.floor(Math.random() * gridSize);
            const col = Math.floor(Math.random() * gridSize);
            
            // 避免重复位置
            if (!positions.some(p => p.row === row && p.col === col)) {
                positions.push({ row, col });
            }
        }
        
        return positions;
    }

    /**
     * 获取颜色数量（渐进式）
     * 1-5关：3种颜色（红、黄、蓝）
     * 6-10关：4种颜色（+橙）
     * 11-15关：5种颜色（+紫）
     * 16+关：6种颜色（+绿）
     */
    private getColorCount(stage: number): number {
        if (stage <= 5) return 3;
        if (stage <= 10) return 4;
        if (stage <= 15) return 5;
        return 6;
    }

    /**
     * 获取敌人血量
     * 基础血量50，每关+30
     */
    private getEnemyHp(stage: number): number {
        const baseHp = 50;
        const hpGrowth = 30;
        return baseHp + (stage - 1) * hpGrowth;
    }

    /**
     * 获取时间限制
     * 固定60秒（后续可以根据关卡调整）
     */
    private getTimeLimit(stage: number): number {
        return 60;
    }

    /**
     * 获取关卡描述
     */
    getLevelDescription(stage: number): string {
        const config = this.generateLevel(stage);
        return `Stage ${stage}: ${config.colorCount} colors, ${config.enemyHp} HP, ${config.timeLimit}s`;
    }
}
