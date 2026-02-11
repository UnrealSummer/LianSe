/**
 * 敌人数据配置
 */

/**
 * 敌人特殊能力类型
 */
export enum EnemyAbilityType {
    NONE = 'none',                    // 无特殊能力
    COLOR_CHANGE = 'color_change',    // 改变方块颜色（混沌画师）
    FORCE_CLEAR = 'force_clear',      // 强制消除（雷电法师）
    BLOCK_HIDE = 'block_hide',        // 遮挡方块（迷雾幽灵）
    FREEZE_BLOCK = 'freeze_block',    // 冻结方块（冰霜巨人）
    RESTRICT_SWAP = 'restrict_swap',  // 限制交换（蛛网编织者）
}

/**
 * 敌人特殊能力配置
 */
export interface EnemyAbility {
    type: EnemyAbilityType;
    triggerInterval: number;  // 触发间隔（回合数）
    param1?: number;          // 参数1（如：改变方块数量）
    param2?: number;          // 参数2（如：最大数量）
}

export interface EnemyData {
    id: string;
    name: string;
    baseHp: number;           // 基础血量
    hpGrowth: number;         // 每关血量增长
    ability?: EnemyAbility;   // 特殊能力
    description?: string;     // 描述
}

/**
 * 敌人池（平衡调整版 v3 - 添加特殊能力）
 * 
 * 调整策略：
 * - 1-5关：普通敌人
 * - 6-10关：强力敌人 + 混沌画师
 * - 11+关：精英敌人
 */
export const EnemyPool: EnemyData[] = [
    // 1. 普通敌人（1-5关）
    {
        id: 'enemy_weak',
        name: '敌人',
        baseHp: 50,
        hpGrowth: 20,
        description: '普通的敌人'
    },
    
    // 2. 强力敌人（6-10关）
    {
        id: 'enemy_normal',
        name: '强敌',
        baseHp: 155,
        hpGrowth: 25,
        description: '更强大的敌人'
    },
    
    // 3. 精英敌人（11关以上）
    {
        id: 'enemy_elite',
        name: '精英',
        baseHp: 280,
        hpGrowth: 25,
        description: '精英级别的敌人'
    },
    
    // 4. 混沌画师（6-14关）
    {
        id: 'chaos_painter',
        name: '混沌画师',
        baseHp: 45,
        hpGrowth: 20,
        ability: {
            type: EnemyAbilityType.COLOR_CHANGE,
            triggerInterval: 1,  // 每回合触发
            param1: 1,           // 最少改变1个方块
            param2: 2            // 最多改变2个方块
        },
        description: '每回合随机改变1-2个方块的颜色'
    }
];

/**
 * 根据关卡获取敌人
 */
export function getEnemyByStage(stage: number, forceEnemyId?: string): EnemyData {
    // GM强制指定敌人
    if (forceEnemyId) {
        const forcedEnemy = EnemyPool.find(e => e.id === forceEnemyId);
        if (forcedEnemy) {
            console.log(`[EnemyData] GM: Forced enemy ${forceEnemyId}`);
            return forcedEnemy;
        }
    }
    
    // 6-14关有30%概率遇到混沌画师
    if (stage >= 6 && stage <= 14) {
        const random = Math.random();
        if (random < 0.3) {
            return EnemyPool[3]; // 混沌画师
        }
    }
    
    // 正常敌人选择
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
    } else if (enemyData.id === 'chaos_painter') {
        // 混沌画师：从第6关开始
        stageOffset = stage - 6;
    }
    
    return enemyData.baseHp + stageOffset * enemyData.hpGrowth;
}

/**
 * 获取敌人完整信息
 */
export function getEnemyInfo(stage: number, forceEnemyId?: string): { name: string; hp: number; enemy: EnemyData } {
    const enemyData = getEnemyByStage(stage, forceEnemyId);
    const hp = calculateEnemyHp(enemyData, stage);
    
    return {
        name: `${enemyData.name} Lv.${stage}`,
        hp: hp,
        enemy: enemyData
    };
}
