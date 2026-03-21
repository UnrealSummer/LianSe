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
    buildType?: 'burst' | 'time' | 'chain' | 'berserk';  // 流派类型
    
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
    blocks: any[];          // 消除的方块
    count: number;          // 消除数量
    color?: string;         // 消除的颜色
    chainLevel: number;     // 连锁层数
    matchType: string;      // 消除类型
    baseDamage: number;     // 基础伤害
    isCritical?: boolean;   // 是否暴击
}

/**
 * 词条系统 - 管理所有Roguelike效果
 */
@ccclass('ModifierSystem')
export class ModifierSystem extends Component {
    private activeModifiers: Map<string, IModifier> = new Map();
    private enemySystem: any = null;  // 敌人系统引用
    private gameCore: any = null;  // GameCore 引用
    private buildSystem: any = null;  // BuildSystem 引用
    private effectManager: any = null;  // EffectManager 引用
    
    start() {
        // Auto-find EnemySystem
        const enemyNode = this.node.parent.getChildByName('EnemySystem');
        if (enemyNode) {
            this.enemySystem = enemyNode.getComponent('EnemySystem');
            console.log('[ModifierSystem] EnemySystem found:', !!this.enemySystem);
        }
        
        // Auto-find GameCore
        const gameCoreNode = this.node.parent.getChildByName('GameCore');
        if (gameCoreNode) {
            this.gameCore = gameCoreNode.getComponent('GameCore');
            console.log('[ModifierSystem] GameCore found:', !!this.gameCore);
        }
        
        // Auto-find BuildSystem
        const buildSystemNode = this.node.parent.getChildByName('BuildSystem');
        if (buildSystemNode) {
            this.buildSystem = buildSystemNode.getComponent('BuildSystem');
            console.log('[ModifierSystem] BuildSystem found:', !!this.buildSystem);
        }
        
        // Auto-find EffectManager
        const effectManagerNode = this.node.parent.parent?.getChildByName('EffectManager');
        if (effectManagerNode) {
            this.effectManager = effectManagerNode.getComponent('EffectManager');
            console.log('[ModifierSystem] EffectManager found:', !!this.effectManager);
        }
    }
    
    /**
     * 添加词条
     */
    addModifier(modifier: IModifier): void {
        // Allow stacking for certain modifiers (like rainbow_blessing)
        const stackableModifiers = ['rainbow_blessing'];
        
        if (this.activeModifiers.has(modifier.id) && !stackableModifiers.includes(modifier.id)) {
            console.warn(`Modifier ${modifier.id} already exists and cannot stack`);
            return;
        }
        
        // For stackable modifiers, create unique key
        let key = modifier.id;
        if (stackableModifiers.includes(modifier.id)) {
            let index = 1;
            while (this.activeModifiers.has(`${modifier.id}_${index}`)) {
                index++;
            }
            key = `${modifier.id}_${index}`;
            console.log(`[ModifierSystem] Stacking modifier: ${modifier.id} (${index})`);
        }
        
        this.activeModifiers.set(key, modifier);
        
        // Inject enemySystem for modifiers that need it
        if (modifier.id === 'berserk' && this.enemySystem) {
            (modifier as any).enemySystem = this.enemySystem;
        }
        
        // Inject gameCore for modifiers that need it
        if (modifier.id === 'time_rage' && this.gameCore) {
            (modifier as any).gameCore = this.gameCore;
        }
        
        // 通知 BuildSystem
        if (this.buildSystem && modifier.buildType) {
            const result = this.buildSystem.addModifier(modifier.buildType);
            
            // 触发流派锁定
            if (result.locked) {
                console.log(`[ModifierSystem] 🔒 Build Locked: ${modifier.buildType}`);
                
                // 播放流派锁定特效
                if (this.effectManager) {
                    this.effectManager.showBuildLock(modifier.buildType);
                }
                
                // TODO: 给予+3秒奖励（需要在 GameCore 中实现）
            }
            
            // 触发流派共鸣
            if (result.resonance) {
                console.log(`[ModifierSystem] ✨ Build Resonance Activated!`);
                
                // 播放流派共鸣特效
                if (this.effectManager) {
                    this.effectManager.showBuildResonance(modifier.buildType);
                }
            }
        }
        
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
        console.log('[ModifierSystem] Cleared all modifiers');
    }

    /**
     * 获取所有激活的词条
     */
    getActiveModifiers(): IModifier[] {
        return Array.from(this.activeModifiers.values());
    }

    /**
     * 获取词条数量
     */
    getModifierCount(): number {
        return this.activeModifiers.size;
    }

    /**
     * 是否有指定词条
     */
    hasModifier(id: string): boolean {
        return this.activeModifiers.has(id);
    }
    
    /**
     * 触发消除事件
     */
    triggerMatch(data: MatchData): MatchData {
        let result = { ...data };
        
        // 应用词条效果
        this.activeModifiers.forEach(modifier => {
            if (modifier.onMatch) {
                const oldDamage = result.baseDamage;
                result = modifier.onMatch(result);
                
                // 应用流派加成
                if (this.buildSystem && modifier.buildType && result.baseDamage !== oldDamage) {
                    const multiplier = this.buildSystem.calculateBuildMultiplier(modifier.buildType);
                    if (multiplier !== 1.0) {
                        const boostedDamage = Math.floor(result.baseDamage * multiplier);
                        console.log(`[ModifierSystem] Build bonus: ${result.baseDamage} × ${multiplier} = ${boostedDamage}`);
                        result.baseDamage = boostedDamage;
                    }
                }
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
        // 降低基础连锁倍率，让"连锁大师"词条更有价值
        // 旧：1.3倍 (1连=1.3, 2连=1.69, 3连=2.2)
        // 新：1.1倍 (1连=1.1, 2连=1.21, 3连=1.33)
        let multiplier = Math.pow(1.1, chainLevel);
        
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
