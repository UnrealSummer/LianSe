import { IModifier, MatchData } from './ModifierSystem';

/**
 * 词条库 - 5个基础词条
 */

// 1. 溢出伤害转金币
export const OverflowToGold: IModifier = {
    id: 'overflow_to_gold',
    name: '溢出转化',
    description: '过量伤害的50%转化为金币',
    rarity: 'common',
    
    onDamageDealt(damage: number, target: any): void {
        if (target && target.getCurrentHp) {
            const currentHp = target.getCurrentHp();
            if (damage > currentHp) {
                const overflow = damage - currentHp;
                const goldGain = Math.floor(overflow * 0.5);
                console.log(`[Modifier] Overflow: +${goldGain} gold`);
                // TODO: 触发金币生成
            }
        }
    }
};

// 2. 连锁乘法增强
export const ChainMultiplier: IModifier = {
    id: 'chain_multiplier',
    name: '连锁爆发',
    description: '连锁伤害倍率从1.3提升到1.5',
    rarity: 'common',
    
    onChain(chainLevel: number): number {
        return Math.pow(1.5, chainLevel); // 提升到1.5倍
    }
};

// 3. 大消除额外奖励
export const BigMatchBonus: IModifier = {
    id: 'big_match_bonus',
    name: '大丰收',
    description: '单次消除5个以上时，额外+10伤害',
    rarity: 'common',
    
    onMatch(data: MatchData): MatchData {
        if (data.count >= 5) {
            data.baseDamage += 10;
            console.log(`[Modifier] Big Match: +10 damage`);
        }
        return data;
    }
};

// 4. 击杀爆炸
export const KillExplosion: IModifier = {
    id: 'kill_explosion',
    name: '连环爆破',
    description: '击杀敌人时，造成其最大生命值20%的额外伤害',
    rarity: 'rare',
    
    onEnemyKill(enemy: any): void {
        if (enemy && enemy.getMaxHp) {
            const explosionDamage = Math.floor(enemy.getMaxHp() * 0.2);
            console.log(`[Modifier] Kill Explosion: ${explosionDamage} damage`);
            // TODO: 对下一个敌人造成伤害
        }
    }
};

// 5. 金币倍率
export const GoldMultiplier: IModifier = {
    id: 'gold_multiplier',
    name: '点金术',
    description: '所有金币收益+50%',
    rarity: 'common',
    
    onCoinCollect(amount: number): number {
        return Math.floor(amount * 1.5);
    }
};

// 6. 首消增强
export const FirstMatchBonus: IModifier = {
    id: 'first_match_bonus',
    name: '先发制人',
    description: '每回合第一次消除伤害翻倍',
    rarity: 'rare',
    
    // 需要在GameCore中跟踪是否是首次消除
    onMatch(data: MatchData): MatchData {
        // TODO: 检查是否是首次消除
        return data;
    }
};

// 7. 颜色稀缺加成
export const ColorScarcityBonus: IModifier = {
    id: 'color_scarcity',
    name: '物以稀为贵',
    description: '棋盘颜色≤3种时，所有伤害+50%',
    rarity: 'epic',
    
    onDamageCalculate(damage: number): number {
        // TODO: 检查棋盘颜色数量
        // 暂时返回原值
        return damage;
    }
};

/**
 * 词条池
 */
export const ModifierPool: IModifier[] = [
    OverflowToGold,
    ChainMultiplier,
    BigMatchBonus,
    KillExplosion,
    GoldMultiplier,
];

/**
 * 按稀有度获取词条
 */
export function getModifiersByRarity(rarity: 'common' | 'rare' | 'epic'): IModifier[] {
    return ModifierPool.filter(m => m.rarity === rarity);
}

/**
 * 随机获取N个词条
 */
export function getRandomModifiers(count: number): IModifier[] {
    const shuffled = [...ModifierPool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}
