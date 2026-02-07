/**
 * 敌人类型枚举
 */
export enum EnemyType {
    NORMAL = 0,         // 普通敌人
    ARMORED = 1,        // 装甲敌人
    BERSERKER = 2,      // 狂暴敌人
    REGENERATOR = 3,    // 再生敌人
    COUNTER = 4,        // 反击敌人
    SPLITTER = 5,       // 分裂敌人
    TIME_THIEF = 6,     // 时间窃贼
    CHAOS = 7,          // 混乱敌人
    GRAVITY = 8,        // 重力敌人 ⭐
    BOSS = 9            // Boss敌人
}

/**
 * 敌人配置
 */
export interface EnemyConfig {
    type: EnemyType;
    name: string;
    color: { r: number, g: number, b: number };
    icon: string;
    hpMultiplier: number;       // 血量倍率
    damageReduction?: number;   // 伤害减免
    armor?: number;             // 护甲值
    description: string;
}

/**
 * 敌人类型配置表
 */
export const ENEMY_CONFIGS: { [key: number]: EnemyConfig } = {
    [EnemyType.NORMAL]: {
        type: EnemyType.NORMAL,
        name: '普通敌人',
        color: { r: 150, g: 150, b: 150 },
        icon: '👾',
        hpMultiplier: 1.0,
        description: '无特殊能力'
    },
    
    [EnemyType.ARMORED]: {
        type: EnemyType.ARMORED,
        name: '装甲敌人',
        color: { r: 100, g: 150, b: 255 },
        icon: '🛡️',
        hpMultiplier: 1.0,
        damageReduction: 0.3,
        armor: 50,
        description: '受到伤害减少30%，拥有50点护甲'
    },
    
    [EnemyType.BERSERKER]: {
        type: EnemyType.BERSERKER,
        name: '狂暴敌人',
        color: { r: 255, g: 100, b: 100 },
        icon: '🔥',
        hpMultiplier: 1.2,
        description: '血量<50%时每回合冻结1个方块，<30%时冻结2个'
    },
    
    [EnemyType.REGENERATOR]: {
        type: EnemyType.REGENERATOR,
        name: '再生敌人',
        color: { r: 100, g: 255, b: 100 },
        icon: '💚',
        hpMultiplier: 0.9,
        description: '每3秒回复最大血量的5%'
    },
    
    [EnemyType.COUNTER]: {
        type: EnemyType.COUNTER,
        name: '反击敌人',
        color: { r: 200, g: 100, b: 255 },
        icon: '⚡',
        hpMultiplier: 1.1,
        description: '受到伤害时30%概率反击，随机1个方块变石头'
    },
    
    [EnemyType.SPLITTER]: {
        type: EnemyType.SPLITTER,
        name: '分裂敌人',
        color: { r: 255, g: 200, b: 50 },
        icon: '💥',
        hpMultiplier: 1.3,
        description: '死亡时分裂成2个小敌人（30%血量）'
    },
    
    [EnemyType.TIME_THIEF]: {
        type: EnemyType.TIME_THIEF,
        name: '时间窃贼',
        color: { r: 150, g: 100, b: 255 },
        icon: '⏰',
        hpMultiplier: 1.0,
        description: '每5秒偷取5秒时间，击败后返还'
    },
    
    [EnemyType.CHAOS]: {
        type: EnemyType.CHAOS,
        name: '混乱敌人',
        color: { r: 255, g: 150, b: 200 },
        icon: '🌀',
        hpMultiplier: 1.1,
        description: '每10秒随机打乱3个方块颜色'
    },
    
    [EnemyType.GRAVITY]: {
        type: EnemyType.GRAVITY,
        name: '重力敌人',
        color: { r: 100, g: 200, b: 255 },
        icon: '🔄',
        hpMultiplier: 1.2,
        description: '每20秒改变重力方向10秒'
    },
    
    [EnemyType.BOSS]: {
        type: EnemyType.BOSS,
        name: 'Boss',
        color: { r: 255, g: 215, b: 0 },
        icon: '👑',
        hpMultiplier: 3.0,
        description: '多阶段Boss，每33%血量触发特殊技能'
    }
};

/**
 * 根据关卡获取敌人类型
 */
export function getEnemyTypeForStage(stage: number): EnemyType {
    // Boss关卡
    if (stage % 10 === 0) {
        return EnemyType.BOSS;
    }
    
    // 根据关卡范围返回敌人类型
    if (stage <= 5) {
        return EnemyType.NORMAL;
    } else if (stage <= 10) {
        return Math.random() < 0.5 ? EnemyType.NORMAL : EnemyType.ARMORED;
    } else if (stage <= 15) {
        return Math.random() < 0.5 ? EnemyType.ARMORED : EnemyType.BERSERKER;
    } else if (stage <= 20) {
        return Math.random() < 0.5 ? EnemyType.BERSERKER : EnemyType.REGENERATOR;
    } else if (stage <= 25) {
        return Math.random() < 0.5 ? EnemyType.REGENERATOR : EnemyType.COUNTER;
    } else if (stage <= 30) {
        return Math.random() < 0.5 ? EnemyType.COUNTER : EnemyType.SPLITTER;
    } else if (stage <= 35) {
        return Math.random() < 0.5 ? EnemyType.SPLITTER : EnemyType.TIME_THIEF;
    } else if (stage <= 40) {
        return Math.random() < 0.5 ? EnemyType.TIME_THIEF : EnemyType.CHAOS;
    } else if (stage <= 45) {
        return Math.random() < 0.5 ? EnemyType.CHAOS : EnemyType.GRAVITY;
    } else {
        // 随机混合
        const types = [
            EnemyType.ARMORED,
            EnemyType.BERSERKER,
            EnemyType.REGENERATOR,
            EnemyType.COUNTER,
            EnemyType.SPLITTER,
            EnemyType.TIME_THIEF,
            EnemyType.CHAOS,
            EnemyType.GRAVITY
        ];
        return types[Math.floor(Math.random() * types.length)];
    }
}
