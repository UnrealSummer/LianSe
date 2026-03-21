import { _decorator, Component } from 'cc';
import { IModifier, MatchData } from './ModifierSystem';
const { ccclass } = _decorator;

/**
 * 词条库 - 所有可用的词条
 */

// ========== 伤害类词条 ==========

/**
 * 红色精通 - 红色块消除伤害+50%
 */
export class RedMastery implements IModifier {
    id = 'red_mastery';
    name = '红色精通';
    description = '红色块消除伤害+50%';
    rarity: 'common' | 'rare' | 'epic' = 'common';
    buildType: 'burst' | 'time' | 'chain' | 'berserk' = 'burst';
    
    onMatch(data: MatchData): MatchData {
        if (data.color === 'red') {
            const oldDamage = data.baseDamage;
            data.baseDamage = Math.floor(data.baseDamage * 1.5);
            console.log(`[Modifier] 🔴 Red Mastery! ${oldDamage} -> ${data.baseDamage}`);
        }
        return data;
    }
}

/**
 * 黄色精通 - 黄色块消除伤害+50%
 */
export class YellowMastery implements IModifier {
    id = 'yellow_mastery';
    name = '黄色精通';
    description = '黄色块消除伤害+50%';
    rarity: 'common' | 'rare' | 'epic' = 'common';
    buildType: 'burst' | 'time' | 'chain' | 'berserk' = 'burst';
    
    onMatch(data: MatchData): MatchData {
        if (data.color === 'yellow') {
            const oldDamage = data.baseDamage;
            data.baseDamage = Math.floor(data.baseDamage * 1.5);
            console.log(`[Modifier] 🟡 Yellow Mastery! ${oldDamage} -> ${data.baseDamage}`);
        }
        return data;
    }
}

/**
 * 蓝色精通 - 蓝色块消除伤害+50%
 */
export class BlueMastery implements IModifier {
    id = 'blue_mastery';
    name = '蓝色精通';
    description = '蓝色块消除伤害+50%';
    rarity: 'common' | 'rare' | 'epic' = 'common';
    buildType: 'burst' | 'time' | 'chain' | 'berserk' = 'burst';
    
    onMatch(data: MatchData): MatchData {
        if (data.color === 'blue') {
            const oldDamage = data.baseDamage;
            data.baseDamage = Math.floor(data.baseDamage * 1.5);
            console.log(`[Modifier] 🔵 Blue Mastery! ${oldDamage} -> ${data.baseDamage}`);
        }
        return data;
    }
}

/**
 * 橙色精通 - 橙色块消除伤害+50%
 */
export class OrangeMastery implements IModifier {
    id = 'orange_mastery';
    name = '橙色精通';
    description = '橙色块消除伤害+50%';
    rarity: 'common' | 'rare' | 'epic' = 'common';
    buildType: 'burst' | 'time' | 'chain' | 'berserk' = 'burst';
    
    onMatch(data: MatchData): MatchData {
        if (data.color === 'orange') {
            const oldDamage = data.baseDamage;
            data.baseDamage = Math.floor(data.baseDamage * 1.5);
            console.log(`[Modifier] 🟠 Orange Mastery! ${oldDamage} -> ${data.baseDamage}`);
        }
        return data;
    }
}

/**
 * 紫色精通 - 紫色块消除伤害+50%
 */
export class PurpleMastery implements IModifier {
    id = 'purple_mastery';
    name = '紫色精通';
    description = '紫色块消除伤害+50%';
    rarity: 'common' | 'rare' | 'epic' = 'common';
    buildType: 'burst' | 'time' | 'chain' | 'berserk' = 'burst';
    
    onMatch(data: MatchData): MatchData {
        if (data.color === 'purple') {
            const oldDamage = data.baseDamage;
            data.baseDamage = Math.floor(data.baseDamage * 1.5);
            console.log(`[Modifier] 🟣 Purple Mastery! ${oldDamage} -> ${data.baseDamage}`);
        }
        return data;
    }
}

/**
 * 绿色精通 - 绿色块消除伤害+50%
 */
export class GreenMastery implements IModifier {
    id = 'green_mastery';
    name = '绿色精通';
    description = '绿色块消除伤害+50%';
    rarity: 'common' | 'rare' | 'epic' = 'common';
    buildType: 'burst' | 'time' | 'chain' | 'berserk' = 'burst';
    
    onMatch(data: MatchData): MatchData {
        if (data.color === 'green') {
            const oldDamage = data.baseDamage;
            data.baseDamage = Math.floor(data.baseDamage * 1.5);
            console.log(`[Modifier] 🟢 Green Mastery! ${oldDamage} -> ${data.baseDamage}`);
        }
        return data;
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
    buildType: 'burst' | 'time' | 'chain' | 'berserk' = 'chain';
    
    onChain(chainLevel: number): number {
        // 基础：1.1倍 (1连=1.1, 2连=1.21, 3连=1.33)
        // 连锁大师：1.5倍 (1连=1.5, 2连=2.25, 3连=3.38)
        return Math.pow(1.5, chainLevel);
    }
}

// ========== 时间机制类词条 ==========

/**
 * 连锁减缓 - 连锁3次以上时，时间流速减半（持续1秒）
 */
export class ChainSlowdown implements IModifier {
    id = 'chain_slowdown';
    name = '连锁减缓';
    description = '连锁3次以上时，时间流速减半（持续1秒）';
    rarity: 'common' | 'rare' | 'epic' = 'rare';
    buildType: 'burst' | 'time' | 'chain' | 'berserk' = 'time';
    
    onMatch(data: MatchData): MatchData {
        if (data.chainLevel >= 3) {
            console.log('[Modifier] ⏰ Chain Slowdown! Time slowed for 1s');
            // 在 GameCore 中处理时间减缓
            // 这里只是标记，实际效果由 GameCore 监听
        }
        return data;
    }
}

/**
 * 消除冻结 - 5连消时，时间流速减半（持续2秒）
 */
export class MatchFreeze implements IModifier {
    id = 'match_freeze';
    name = '消除冻结';
    description = '5连消时，时间流速减半（持续2秒）';
    rarity: 'common' | 'rare' | 'epic' = 'rare';
    buildType: 'burst' | 'time' | 'chain' | 'berserk' = 'time';
    
    onMatch(data: MatchData): MatchData {
        if (data.count >= 5) {
            console.log('[Modifier] ❄️ Match Freeze! Time slowed for 2s');
            // 在 GameCore 中处理时间减缓
        }
        return data;
    }
}

/**
 * 时间狂怒 - 时间越少伤害越高（最高2倍）
 */
export class TimeRage implements IModifier {
    id = 'time_rage';
    name = '时间狂怒';
    description = '时间越少伤害越高（最高2倍）';
    rarity: 'common' | 'rare' | 'epic' = 'rare';
    buildType: 'burst' | 'time' | 'chain' | 'berserk' = 'berserk';
    
    private gameCore: any = null;
    
    onAcquire(): void {
        // 需要在 ModifierSystem 中设置 gameCore 引用
    }
    
    onDamageCalculate(damage: number): number {
        if (this.gameCore) {
            const timeLeft = this.gameCore.getTimeLeft();
            const maxTime = this.gameCore.getMaxTime();
            const timePercent = timeLeft / maxTime;
            
            // 时间<5秒时，伤害2倍
            // 时间5-15秒时，线性插值 1.0x - 2.0x
            if (timeLeft < 5) {
                console.log('[Modifier] 💢 Time Rage! 2x damage (time < 5s)');
                return damage * 2;
            } else if (timeLeft < 15) {
                const multiplier = 1 + (15 - timeLeft) / 10;  // 15s=1x, 5s=2x
                console.log(`[Modifier] 💢 Time Rage! ${multiplier.toFixed(2)}x damage`);
                return damage * multiplier;
            }
        }
        return damage;
    }
}

/**
 * 击杀回时 - 击败敌人返还剩余时间的30%
 */
export class KillTimeRefund implements IModifier {
    id = 'kill_time_refund';
    name = '击杀回时';
    description = '击败敌人返还剩余时间的30%';
    rarity: 'common' | 'rare' | 'epic' = 'rare';
    buildType: 'burst' | 'time' | 'chain' | 'berserk' = 'time';
    
    onEnemyKill(enemy: any): void {
        console.log('[Modifier] ⏱️ Kill Time Refund! +30% time');
        // 在 GameCore 中处理时间返还
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
    buildType: 'burst' | 'time' | 'chain' | 'berserk' = 'burst';
    
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
    buildType: 'burst' | 'time' | 'chain' | 'berserk' = 'burst';
    
    onMatch(data: MatchData): MatchData {
        if (data.count >= 4) {
            const oldDamage = data.baseDamage;
            data.baseDamage = Math.floor(data.baseDamage * 1.5);
            console.log(`[Modifier] 🔥 Long Match Bonus! ${oldDamage} -> ${data.baseDamage}`);
        }
        return data;
    }
}

// ========== 特殊效果类词条 ==========

/**
 * 爆炸大师 - 4连消触发爆炸，消除周围8格
 */
export class ExplosionMaster implements IModifier {
    id = 'explosion_master';
    name = '爆炸大师';
    description = '4连消触发爆炸，消除周围8格';
    rarity: 'common' | 'rare' | 'epic' = 'rare';
    buildType: 'burst' | 'time' | 'chain' | 'berserk' = 'burst';
    
    onMatch(data: MatchData): MatchData {
        if (data.count >= 4) {
            console.log('[Modifier] 💣 Explosion Master! Triggering explosion');
            // 标记需要触发爆炸效果
            // 实际爆炸逻辑在 GridManager 中处理
            (data as any).triggerExplosion = true;
        }
        return data;
    }
}

/**
 * 十字清除 - 5连消清除整行+整列
 */
export class CrossClear implements IModifier {
    id = 'cross_clear';
    name = '十字清除';
    description = '5连消清除整行+整列';
    rarity: 'common' | 'rare' | 'epic' = 'epic';
    buildType: 'burst' | 'time' | 'chain' | 'berserk' = 'burst';
    
    onMatch(data: MatchData): MatchData {
        if (data.count >= 5) {
            console.log('[Modifier] ✨ Cross Clear! Clearing row and column');
            // 标记需要触发十字清除效果
            // 实际清除逻辑在 GridManager 中处理
            (data as any).triggerCrossClear = true;
        }
        return data;
    }
}

// ========== 辅助类词条 ==========

// ========== 史诗词条 ==========

/**
 * 狂暴 - 血量低于30%时，伤害翻倍
 */
export class Berserk implements IModifier {
    id = 'berserk';
    name = '狂暴';
    description = '敌人血量低于30%时，伤害翻倍';
    rarity: 'common' | 'rare' | 'epic' = 'epic';
    buildType: 'burst' | 'time' | 'chain' | 'berserk' = 'berserk';
    
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
    buildType: 'burst' | 'time' | 'chain' | 'berserk' = 'burst';
    
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
    buildType: 'burst' | 'time' | 'chain' | 'berserk' = 'chain';
    
    onMatch(data: MatchData): MatchData {
        if (data.chainLevel >= 3) {
            const oldDamage = data.baseDamage;
            data.baseDamage = Math.floor(data.baseDamage * 2);
            console.log(`[Modifier] ⚡ Perfect Chain! ${oldDamage} -> ${data.baseDamage}`);
        }
        return data;
    }
}

// ========== 词条池 ==========

/**
 * 获取所有词条
 */
export function getAllModifiers(): IModifier[] {
    return [
        // 颜色精通（6个）
        new RedMastery(),
        new YellowMastery(),
        new BlueMastery(),
        new OrangeMastery(),
        new PurpleMastery(),
        new GreenMastery(),
        // 连锁类
        new ChainMaster(),
        new PerfectChain(),
        // 时间机制（4个）
        new ChainSlowdown(),
        new MatchFreeze(),
        new TimeRage(),
        new KillTimeRefund(),
        // 特殊效果（3个）
        new ExplosionMaster(),
        new CrossClear(),
        new RainbowBlessing(),
        // 其他
        new CriticalHit(),
        new LongMatch(),
        // new GoldCollector(),  // TODO: 未实现
        new Berserk()
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
