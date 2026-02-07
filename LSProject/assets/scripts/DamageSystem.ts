import { _decorator, Component } from 'cc';
import { ModifierSystem, MatchData } from './ModifierSystem';
const { ccclass, property } = _decorator;

/**
 * 伤害系统 - 消除到伤害的转换管道
 */
@ccclass('DamageSystem')
export class DamageSystem extends Component {
    private modifierSystem: ModifierSystem = null;

    start() {
        // Auto-find ModifierSystem
        this.modifierSystem = this.node.parent.getChildByName('ModifierSystem')?.getComponent(ModifierSystem);
        console.log('[DamageSystem] ModifierSystem found:', !!this.modifierSystem);
    }

    /**
     * 计算消除伤害
     * 消除 → 基础伤害 → 词条修改 → 连锁倍率 → 最终伤害
     */
    calculateMatchDamage(matchData: MatchData): number {
        // 1. 基础伤害（根据消除数量）
        let baseDamage = this.getBaseDamage(matchData.count, matchData.matchType);
        matchData.baseDamage = baseDamage;
        matchData.isCritical = false;

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

        // 4. 词条最终修改伤害（包括暴击）
        if (this.modifierSystem) {
            const originalDamage = damage;
            damage = this.modifierSystem.calculateDamage(damage);
            
            // 如果伤害翻倍，判定为暴击
            if (damage >= originalDamage * 1.8) {
                matchData.isCritical = true;
            }
        }

        return Math.floor(damage);
    }

    /**
     * 获取基础伤害
     */
    private getBaseDamage(count: number, matchType: string): number {
        // 固定基础伤害10，不受消除数量影响
        // 让词条的效果更明显
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
