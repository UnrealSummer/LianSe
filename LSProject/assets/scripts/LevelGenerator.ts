import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

/**
 * 关卡配置
 */
export interface LevelConfig {
    stage: number;
    colorCount: number;
    enemyHp: number;
    timeLimit: number;
    obstacles: any[];
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
            obstacles: [] // 暂时为空，后续添加障碍系统
        };
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
