import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

/**
 * 词条接口 - 所有Roguelike效果的基础
 */
export interface IModifier {
    id: string;
    name: string;
    description: string;
    rarity: 'common' | 'rare' | 'epic';
    
    // 生命周期钩子
    onAcquire?(): void;
    onRemove?(): void;
    
    // 游戏事件钩子
    onMatch?(data: MatchData): MatchData;           // 消除时
    onDamageCalculate?(damage: number): number;     // 伤害计算时
    onDamageDealt?(damage: number, target: any): void; // 伤害造成后
    onEnemyKill?(enemy: any): void;                 // 击杀敌人时
    onChain?(chainLevel: number): number;           // 连锁时
    onCoinCollect?(amount: number): number;         // 收集金币时
    onTimeUpdate?(timeLeft: number): void;          // 时间更新时
}

/**
 * 消除数据
 */
export interface MatchData {
    count: number;          // 消除数量
    color: number;          // 颜色类型
    chainLevel: number;     // 连锁层数
    matchType: 'line' | 'L' | 'T' | 'square'; // 消除类型
    baseDamage: number;     // 基础伤害
}

/**
 * 词条系统 - 管理所有Roguelike效果
 */
@ccclass('ModifierSystem')
export class ModifierSystem extends Component {
    private activeModifiers: Map<string, IModifier> = new Map();
    
    /**
     * 添加词条
     */
    addModifier(modifier: IModifier): void {
        if (this.activeModifiers.has(modifier.id)) {
            console.warn(`Modifier ${modifier.id} already exists`);
            return;
        }
        
        this.activeModifiers.set(modifier.id, modifier);
        modifier.onAcquire?.();
        console.log(`[Modifier] Added: ${modifier.name}`);
    }
    
    /**
     * 移除词条
     */
    removeModifier(id: string): void {
        const modifier = this.activeModifiers.get(id);
        if (modifier) {
            modifier.onRemove?.();
            this.activeModifiers.delete(id);
            console.log(`[Modifier] Removed: ${modifier.name}`);
        }
    }
    
    /**
     * 清空所有词条
     */
    clearAll(): void {
        this.activeModifiers.forEach(m => m.onRemove?.());
        this.activeModifiers.clear();
    }
    
    /**
     * 触发消除事件
     */
    triggerMatch(data: MatchData): MatchData {
        let result = { ...data };
        this.activeModifiers.forEach(modifier => {
            if (modifier.onMatch) {
                result = modifier.onMatch(result);
            }
        });
        return result;
    }
    
    /**
     * 计算最终伤害
     */
    calculateDamage(baseDamage: number): number {
        let damage = baseDamage;
        this.activeModifiers.forEach(modifier => {
            if (modifier.onDamageCalculate) {
                damage = modifier.onDamageCalculate(damage);
            }
        });
        return Math.floor(damage);
    }
    
    /**
     * 触发伤害造成事件
     */
    triggerDamageDealt(damage: number, target: any): void {
        this.activeModifiers.forEach(modifier => {
            modifier.onDamageDealt?.(damage, target);
        });
    }
    
    /**
     * 触发击杀事件
     */
    triggerKill(enemy: any): void {
        this.activeModifiers.forEach(modifier => {
            modifier.onEnemyKill?.(enemy);
        });
    }
    
    /**
     * 计算连锁倍率
     */
    calculateChainMultiplier(chainLevel: number): number {
        let multiplier = Math.pow(1.3, chainLevel); // 默认1.3倍
        this.activeModifiers.forEach(modifier => {
            if (modifier.onChain) {
                multiplier = modifier.onChain(chainLevel);
            }
        });
        return multiplier;
    }
    
    /**
     * 触发金币收集
     */
    triggerCoinCollect(amount: number): number {
        let finalAmount = amount;
        this.activeModifiers.forEach(modifier => {
            if (modifier.onCoinCollect) {
                finalAmount = modifier.onCoinCollect(finalAmount);
            }
        });
        return finalAmount;
    }
    
    /**
     * 获取所有激活的词条
     */
    getActiveModifiers(): IModifier[] {
        return Array.from(this.activeModifiers.values());
    }
}
