import { _decorator, Component } from 'cc';
import { IModifier, MatchData } from './ModifierSystem';
const { ccclass } = _decorator;

/**
 * 词条库 - 所有可用的词条
 */

// ========== 伤害类词条 ==========

/**
 * 力量强化 - 所有伤害+20%
 */
export class PowerBoost implements IModifier {
    id = 'power_boost';
    name = '力量强化';
    description = '所有伤害+20%';
    rarity: 'common' | 'rare' | 'epic' = 'common';
    
    onDamageCalculate(damage: number): number {
        return damage * 1.2;
    }
}

/**
 * 连锁大师 - 连锁伤害倍率大幅提升
 */
export class ChainMaster implements IModifier {
    id = 'chain_master';
    name = '连锁大师';
    description = '连锁伤害倍率大幅提升';
    rarity: 'common' | 'rare' | 'epic' = 'common';
    
    onChain(chainLevel: number): number {
        // 基础：1.1倍 (1连=1.1, 2连=1.21, 3连=1.33)
        // 连锁大师：1.5倍 (1连=1.5, 2连=2.25, 3连=3.38)
        return Math.pow(1.5, chainLevel);
    }
}

/**
 * 暴击 - 20%概率造成双倍伤害
 */
export class CriticalHit implements IModifier {
    id = 'critical_hit';
    name = '暴击';
    description = '20%概率造成双倍伤害';
    rarity: 'common' | 'rare' | 'epic' = 'rare';
    
    onDamageCalculate(damage: number): number {
        if (Math.random() < 0.2) {
            console.log('[Modifier] 💥 Critical Hit!');
            return damage * 2;
        }
        return damage;
    }
}

/**
 * 长消除 - 消除4个及以上时，额外+50%伤害
 */
export class LongMatch implements IModifier {
    id = 'long_match';
    name = '长消除';
    description = '消除4个及以上时，额外+50%伤害';
    rarity: 'common' | 'rare' | 'epic' = 'common';
    
    onMatch(data: MatchData): MatchData {
        if (data.count >= 4) {
            const oldDamage = data.baseDamage;
            data.baseDamage = Math.floor(data.baseDamage * 1.5);
            console.log(`[Modifier] 🔥 Long Match Bonus! ${oldDamage} -> ${data.baseDamage}`);
        }
        return data;
    }
}

// ========== 辅助类词条 ==========

/**
 * 时间延长 - 每关时间+10秒
 */
export class TimeExtension implements IModifier {
    id = 'time_extension';
    name = '时间延长';
    description = '每关时间+10秒';
    rarity: 'common' | 'rare' | 'epic' = 'common';
    
    // 在GameCore中处理
}

/**
 * 金币收集者 - 金币获取+50%
 */
export class GoldCollector implements IModifier {
    id = 'gold_collector';
    name = '金币收集者';
    description = '金币获取+50%';
    rarity: 'common' | 'rare' | 'epic' = 'common';
    
    onCoinCollect(amount: number): number {
        return amount * 1.5;
    }
}

/**
 * 冰霜解冻 - 冰冻方块只需解冻1次
 */
export class FrostBreaker implements IModifier {
    id = 'frost_breaker';
    name = '冰霜解冻';
    description = '冰冻方块只需解冻1次';
    rarity: 'common' | 'rare' | 'epic' = 'rare';
    
    // 在Block中处理
}

// ========== 史诗词条 ==========

/**
 * 狂暴 - 血量低于30%时，伤害翻倍
 */
export class Berserk implements IModifier {
    id = 'berserk';
    name = '狂暴';
    description = '敌人血量低于30%时，伤害翻倍';
    rarity: 'common' | 'rare' | 'epic' = 'epic';
    
    private enemySystem: any = null;
    
    onAcquire(): void {
        // 需要在ModifierSystem中设置enemySystem引用
    }
    
    onDamageCalculate(damage: number): number {
        if (this.enemySystem) {
            const hpPercent = this.enemySystem.getCurrentHp() / this.enemySystem.getMaxHp();
            if (hpPercent < 0.3) {
                console.log('[Modifier] 💢 Berserk Activated!');
                return damage * 2;
            }
        }
        return damage;
    }
}

/**
 * 彩虹祝福 - 每关开始时，随机生成1个彩虹方块
 */
export class RainbowBlessing implements IModifier {
    id = 'rainbow_blessing';
    name = '彩虹祝福';
    description = '每关开始时，随机生成1个彩虹方块';
    rarity: 'common' | 'rare' | 'epic' = 'epic';
    
    // 在GameCore中处理
}

/**
 * 完美连锁 - 连锁3次及以上时，额外+100%伤害
 */
export class PerfectChain implements IModifier {
    id = 'perfect_chain';
    name = '完美连锁';
    description = '连锁3次及以上时，额外+100%伤害';
    rarity: 'common' | 'rare' | 'epic' = 'epic';
    
    onDamageCalculate(damage: number): number {
        // 需要从MatchData中获取chainLevel
        return damage;
    }
}

// ========== 词条池 ==========

/**
 * 获取所有词条
 */
export function getAllModifiers(): IModifier[] {
    return [
        new PowerBoost(),
        new ChainMaster(),
        new CriticalHit(),
        new LongMatch(),
        new TimeExtension(),
        new GoldCollector(),
        new FrostBreaker(),
        new Berserk(),
        new RainbowBlessing(),
        new PerfectChain()
    ];
}

/**
 * 根据稀有度获取词条
 */
export function getModifiersByRarity(rarity: 'common' | 'rare' | 'epic'): IModifier[] {
    return getAllModifiers().filter(m => m.rarity === rarity);
}

/**
 * 随机获取N个词条
 */
export function getRandomModifiers(count: number): IModifier[] {
    const all = getAllModifiers();
    const result: IModifier[] = [];
    const used = new Set<string>();
    
    while (result.length < count && result.length < all.length) {
        const random = all[Math.floor(Math.random() * all.length)];
        if (!used.has(random.id)) {
            result.push(random);
            used.add(random.id);
        }
    }
    
    return result;
}

/**
 * 根据稀有度权重随机获取词条
 */
export function getWeightedRandomModifiers(count: number): IModifier[] {
    const result: IModifier[] = [];
    const used = new Set<string>();
    
    for (let i = 0; i < count; i++) {
        const rarity = getRandomRarity();
        const pool = getModifiersByRarity(rarity).filter(m => !used.has(m.id));
        
        if (pool.length > 0) {
            const random = pool[Math.floor(Math.random() * pool.length)];
            result.push(random);
            used.add(random.id);
        }
    }
    
    return result;
}

/**
 * 根据权重随机稀有度
 * 普通70%，稀有25%，史诗5%
 */
function getRandomRarity(): 'common' | 'rare' | 'epic' {
    const rand = Math.random();
    if (rand < 0.7) return 'common';
    if (rand < 0.95) return 'rare';
    return 'epic';
}
