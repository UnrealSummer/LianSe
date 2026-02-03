import { _decorator, Component } from 'cc';
import { ModifierSystem, MatchData } from './ModifierSystem';
const { ccclass, property } = _decorator;

/**
 * 伤害系统 - 消除到伤害的转换管道
 */
@ccclass('DamageSystem')
export class DamageSystem extends Component {
    @property(ModifierSystem)
    modifierSystem: ModifierSystem = null;

    /**
     * 计算消除伤害
     * 消除 → 基础伤害 → 词条修改 → 连锁倍率 → 最终伤害
     */
    calculateMatchDamage(matchData: MatchData): number {
        // 1. 基础伤害（根据消除数量）
        let baseDamage = this.getBaseDamage(matchData.count, matchData.matchType);
        matchData.baseDamage = baseDamage;

        // 2. 词条修改消除数据
        if (this.modifierSystem) {
            matchData = this.modifierSystem.triggerMatch(matchData);
            baseDamage = matchData.baseDamage;
        }

        // 3. 连锁倍率（乘法）
        let chainMultiplier = 1;
        if (matchData.chainLevel > 0) {
            if (this.modifierSystem) {
                chainMultiplier = this.modifierSystem.calculateChainMultiplier(matchData.chainLevel);
            } else {
                chainMultiplier = Math.pow(1.3, matchData.chainLevel);
            }
        }

        let damage = baseDamage * chainMultiplier;

        // 4. 词条最终修改伤害
        if (this.modifierSystem) {
            damage = this.modifierSystem.calculateDamage(damage);
        }

        return Math.floor(damage);
    }

    /**
     * 获取基础伤害
     */
    private getBaseDamage(count: number, matchType: string): number {
        // 消除3个：基础伤害
        if (count === 3) {
            return 10;
        }
        
        // 消除4个：1.5倍
        if (count === 4) {
            return 15;
        }
        
        // 消除5个：2倍
        if (count === 5) {
            return 20;
        }
        
        // L/T形：范围伤害
        if (matchType === 'L' || matchType === 'T') {
            return 25;
        }
        
        // 方形：爆炸伤害
        if (matchType === 'square') {
            return 30;
        }
        
        // 超过5个：每多一个+5伤害
        if (count > 5) {
            return 20 + (count - 5) * 5;
        }

        return 10;
    }

    /**
     * 造成伤害（触发词条效果）
     */
    dealDamage(damage: number, target: any): void {
        if (this.modifierSystem) {
            this.modifierSystem.triggerDamageDealt(damage, target);
        }
    }

    /**
     * 触发击杀
     */
    triggerKill(enemy: any): void {
        if (this.modifierSystem) {
            this.modifierSystem.triggerKill(enemy);
        }
    }
}
