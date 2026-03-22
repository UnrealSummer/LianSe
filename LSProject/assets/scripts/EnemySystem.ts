import { _decorator, Component, Node, Sprite, Label, tween, Vec3, Color } from 'cc';
import { EnemyType, EnemyConfig, ENEMY_CONFIGS, getEnemyTypeForStage } from './EnemyTypes';
import { EnemyData, EnemyAbilityType } from './EnemyData';
const { ccclass, property } = _decorator;

/**
 * 敌人系统（支持多种敌人类型和特殊能力）
 */
@ccclass('EnemySystem')
export class EnemySystem extends Component {
    @property(Sprite)
    enemySprite: Sprite = null;

    @property(Label)
    hpLabel: Label = null;

    @property(Node)
    hpBarFill: Node = null;
    
    @property(Label)
    enemyNameLabel: Label = null;
    
    @property(Label)
    armorLabel: Label = null;

    private currentHp: number = 0;
    private maxHp: number = 0;
    private enemyType: EnemyType = EnemyType.NORMAL;
    private enemyConfig: EnemyConfig = null;
    private enemyData: EnemyData = null;  // 新增：敌人数据
    private abilityTurnCounter: number = 0;  // 新增：能力触发计数器
    private armor: number = 0;
    private stolenTime: number = 0;
    private regenerateTimer: number = 0;
    private gravityTimer: number = 0;
    private chaosTimer: number = 0;
    private berserkerTimer: number = 0;
    private timeThiefTimer: number = 0;
    private gravityActive: boolean = false;
    private currentStage: number = 1;

    /**
     * 初始化敌人（根据关卡）
     */
    initEnemyForStage(stage: number, baseHp: number): void {
        this.currentStage = stage;
        const enemyType = getEnemyTypeForStage(stage);
        this.initEnemy(enemyType, baseHp);
    }

    /**
     * 初始化敌人（指定类型）
     */
    initEnemy(type: EnemyType, baseHp: number): void {
        this.reset();
        
        this.enemyType = type;
        this.enemyConfig = ENEMY_CONFIGS[type];
        
        // 计算血量
        this.maxHp = Math.floor(baseHp * this.enemyConfig.hpMultiplier);
        this.currentHp = this.maxHp;
        
        // 初始化护甲
        if (this.enemyConfig.armor) {
            this.armor = this.enemyConfig.armor;
        }
        
        this.updateUI();
        console.log(`[Enemy] Spawned: ${this.enemyConfig.name} (HP: ${this.maxHp}, Type: ${type})`);
    }

    /**
     * 设置敌人数据（新系统）
     */
    setEnemyData(enemyData: EnemyData): void {
        this.enemyData = enemyData;
        this.abilityTurnCounter = 0;
        
        if (enemyData.ability) {
            console.log(`[Enemy] ${enemyData.name} has ability: ${enemyData.ability.type}`);
        }
    }

    /**
     * 每回合触发敌人能力
     */
    triggerEnemyAbility(): void {
        if (!this.enemyData || !this.enemyData.ability) {
            return;
        }

        this.abilityTurnCounter++;
        
        const ability = this.enemyData.ability;
        
        // 检查是否到达触发间隔
        if (this.abilityTurnCounter % ability.triggerInterval !== 0) {
            return;
        }

        console.log(`[Enemy] Triggering ability: ${ability.type}`);
        
        // 触发对应的能力
        this.node.emit('enemy-ability-trigger', {
            type: ability.type,
            param1: ability.param1,
            param2: ability.param2
        });
    }

    /**
     * 受到伤害
     */
    takeDamage(damage: number): void {
        if (this.currentHp <= 0) return;

        let actualDamage = damage;
        
        // 装甲敌人：护甲吸收
        if (this.enemyType === EnemyType.ARMORED && this.armor > 0) {
            const armorAbsorb = Math.min(this.armor, actualDamage);
            this.armor -= armorAbsorb;
            actualDamage -= armorAbsorb;
            console.log(`[Enemy] Armor absorbed ${armorAbsorb} damage, ${this.armor} armor remaining`);
        }
        
        // 装甲敌人：伤害减免
        if (this.enemyType === EnemyType.ARMORED && this.enemyConfig.damageReduction) {
            actualDamage *= (1 - this.enemyConfig.damageReduction);
        }
        
        actualDamage = Math.floor(actualDamage);
        this.currentHp = Math.max(0, this.currentHp - actualDamage);
        
        // 反击敌人：30%概率反击
        if (this.enemyType === EnemyType.COUNTER && Math.random() < 0.3) {
            console.log('[Enemy] 💥 Counter attack!');
            this.node.emit('enemy-counter-attack');
        }
        
        this.playHitAnimation();
        this.updateUI();
        
        console.log(`[Enemy] Took ${actualDamage} damage (${damage} -> ${actualDamage}), HP: ${this.currentHp}/${this.maxHp}`);
    }

    /**
     * 更新（处理敌人技能）
     */
    update(dt: number): void {
        if (this.currentHp <= 0) return;
        
        // 再生敌人：每3秒回复5%
        if (this.enemyType === EnemyType.REGENERATOR) {
            this.regenerateTimer += dt;
            if (this.regenerateTimer >= 3) {
                this.regenerateTimer = 0;
                const healAmount = Math.floor(this.maxHp * 0.05);
                this.currentHp = Math.min(this.maxHp, this.currentHp + healAmount);
                console.log(`[Enemy] 💚 Regenerated ${healAmount} HP`);
                this.updateUI();
            }
        }
        
        // 狂暴敌人：低血量时冻结方块
        if (this.enemyType === EnemyType.BERSERKER) {
            const hpPercent = this.currentHp / this.maxHp;
            if (hpPercent < 0.5) {
                this.berserkerTimer += dt;
                const freezeInterval = hpPercent < 0.3 ? 5 : 8;
                if (this.berserkerTimer >= freezeInterval) {
                    this.berserkerTimer = 0;
                    const freezeCount = hpPercent < 0.3 ? 2 : 1;
                    console.log(`[Enemy] 🔥 Berserker rage! Freezing ${freezeCount} blocks`);
                    this.node.emit('enemy-freeze-blocks', freezeCount);
                }
            }
        }
        
        // 时间窃贼：每5秒偷5秒
        if (this.enemyType === EnemyType.TIME_THIEF) {
            this.timeThiefTimer += dt;
            if (this.timeThiefTimer >= 5) {
                this.timeThiefTimer = 0;
                this.stolenTime += 5;
                console.log(`[Enemy] ⏰ Stole 5 seconds! Total stolen: ${this.stolenTime}s`);
                this.node.emit('enemy-steal-time', 5);
            }
        }
        
        // 混乱敌人：每10秒打乱方块
        if (this.enemyType === EnemyType.CHAOS) {
            this.chaosTimer += dt;
            if (this.chaosTimer >= 10) {
                this.chaosTimer = 0;
                console.log('[Enemy] 🌀 Chaos! Shuffling 3 blocks');
                this.node.emit('enemy-chaos-shuffle', 3);
            }
        }
        
        // 重力敌人：每20秒改变重力10秒
        if (this.enemyType === EnemyType.GRAVITY) {
            this.gravityTimer += dt;
            
            if (!this.gravityActive && this.gravityTimer >= 20) {
                // 激活重力改变
                this.gravityActive = true;
                this.gravityTimer = 0;
                console.log('[Enemy] 🔄 Gravity shift activated!');
                this.node.emit('enemy-gravity-shift', true);
            } else if (this.gravityActive && this.gravityTimer >= 10) {
                // 恢复正常重力
                this.gravityActive = false;
                this.gravityTimer = 0;
                console.log('[Enemy] 🔄 Gravity restored!');
                this.node.emit('enemy-gravity-shift', false);
            }
        }
    }

    /**
     * 更新UI
     */
    private updateUI(): void {
        // 更新血条
        if (this.hpLabel) {
            this.hpLabel.string = `${this.currentHp}/${this.maxHp}`;
        }
        
        if (this.hpBarFill) {
            const hpPercent = this.currentHp / this.maxHp;
            const sprite = this.hpBarFill.getComponent(Sprite);
            if (sprite) {
                sprite.fillRange = Math.max(0, Math.min(1, hpPercent));
            }
        }
        
        // 更新敌人名称
        if (this.enemyNameLabel && this.enemyConfig) {
            this.enemyNameLabel.string = `${this.enemyConfig.icon} ${this.enemyConfig.name}`;
        }
        
        // 更新护甲显示
        if (this.armorLabel) {
            if (this.armor > 0) {
                this.armorLabel.string = `🛡️ ${this.armor}`;
                this.armorLabel.node.active = true;
            } else {
                this.armorLabel.node.active = false;
            }
        }
        
        // 更新颜色
        if (this.enemySprite && this.enemyConfig) {
            const c = this.enemyConfig.color;
            this.enemySprite.color = new Color(c.r, c.g, c.b);
        }
    }

    /**
     * 受伤动画
     */
    private playHitAnimation(): void {
        if (!this.enemySprite) return;
        
        // 闪白
        const originalColor = this.enemySprite.color.clone();
        this.enemySprite.color = Color.WHITE;
        
        this.scheduleOnce(() => {
            if (this.enemySprite) {
                this.enemySprite.color = originalColor;
            }
        }, 0.1);
        
        // 震动
        const originalPos = this.node.getPosition().clone();
        tween(this.node)
            .to(0.05, { position: new Vec3(originalPos.x + 5, originalPos.y, 0) })
            .to(0.05, { position: new Vec3(originalPos.x - 5, originalPos.y, 0) })
            .to(0.05, { position: originalPos })
            .start();
    }

    /**
     * 重置
     */
    reset(): void {
        this.currentHp = 0;
        this.maxHp = 0;
        this.armor = 0;
        this.stolenTime = 0;
        this.regenerateTimer = 0;
        this.gravityTimer = 0;
        this.chaosTimer = 0;
        this.berserkerTimer = 0;
        this.timeThiefTimer = 0;
        this.gravityActive = false;
    }

    /**
     * 获取当前血量
     */
    getCurrentHp(): number {
        return this.currentHp;
    }

    /**
     * 获取最大血量
     */
    getMaxHp(): number {
        return this.maxHp;
    }

    /**
     * 获取敌人类型
     */
    getEnemyType(): EnemyType {
        return this.enemyType;
    }

    /**
     * 获取被偷的时间
     */
    getStolenTime(): number {
        return this.stolenTime;
    }

    /**
     * 是否存活
     */
    isAlive(): boolean {
        return this.currentHp > 0;
    }
}
