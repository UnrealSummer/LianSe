/**
 * 敌人数据配置
 */

export interface EnemyData {
    id: string;
    name: string;
    baseHp: number; // 基础血量
    hpGrowth: number; // 每关血量增长
}

/**
 * 敌人池（平衡调整版 v2）
 * 
 * 调整策略：
 * - 1-5关：50 + (stage-1) * 20 = 50, 70, 90, 110, 130
 * - 6-10关：155 + (stage-6) * 25 = 155, 180, 205, 230, 255
 * - 11+关：280 + (stage-11) * 25 = 280, 305, 330, 355, 380...
 */
export const EnemyPool: EnemyData[] = [
    // 1. 普通敌人（1-5关）
    {
        id: 'enemy_weak',
        name: '敌人',
        baseHp: 50,
        hpGrowth: 20
    },
    
    // 2. 强力敌人（6-10关）
    {
        id: 'enemy_normal',
        name: '强敌',
        baseHp: 155,
        hpGrowth: 25
    },
    
    // 3. 精英敌人（11关以上）
    {
        id: 'enemy_elite',
        name: '精英',
        baseHp: 280,
        hpGrowth: 25
    }
];

/**
 * 根据关卡获取敌人
 */
export function getEnemyByStage(stage: number): EnemyData {
    if (stage <= 5) {
        return EnemyPool[0]; // 普通敌人
    } else if (stage <= 10) {
        return EnemyPool[1]; // 强力敌人
    } else {
        return EnemyPool[2]; // 精英敌人
    }
}

/**
 * 计算敌人血量
 */
export function calculateEnemyHp(enemyData: EnemyData, stage: number): number {
    // 根据敌人类型调整起始关卡
    let stageOffset = 0;
    
    if (enemyData.id === 'enemy_weak') {
        // 1-5关：从第1关开始
        stageOffset = stage - 1;
    } else if (enemyData.id === 'enemy_normal') {
        // 6-10关：从第6关开始
        stageOffset = stage - 6;
    } else if (enemyData.id === 'enemy_elite') {
        // 11+关：从第11关开始
        stageOffset = stage - 11;
    }
    
    return enemyData.baseHp + stageOffset * enemyData.hpGrowth;
}

/**
 * 获取敌人完整信息
 */
export function getEnemyInfo(stage: number): { name: string; hp: number } {
    const enemyData = getEnemyByStage(stage);
    const hp = calculateEnemyHp(enemyData, stage);
    
    return {
        name: `${enemyData.name} Lv.${stage}`,
        hp: hp
    };
}
