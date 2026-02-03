import { _decorator, Component, Node, Sprite, Label, tween, Vec3, Color } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 敌人数据
 */
export interface EnemyData {
    id: string;
    name: string;
    maxHp: number;
    sprite?: string; // 精灵资源路径
}

/**
 * 敌人系统
 */
@ccclass('EnemySystem')
export class EnemySystem extends Component {
    @property(Sprite)
    enemySprite: Sprite = null;

    @property(Label)
    hpLabel: Label = null;

    @property(Node)
    hpBarFill: Node = null;

    private currentHp: number = 0;
    private maxHp: number = 0;
    private enemyData: EnemyData = null;

    /**
     * 初始化敌人
     */
    initEnemy(data: EnemyData): void {
        this.enemyData = data;
        this.maxHp = data.maxHp;
        this.currentHp = data.maxHp;
        
        this.updateUI();
        console.log(`[Enemy] Spawned: ${data.name} (HP: ${data.maxHp})`);
    }

    /**
     * 受到伤害
     */
    takeDamage(damage: number): void {
        if (this.currentHp <= 0) return;

        this.currentHp = Math.max(0, this.currentHp - damage);
        
        // 受伤动画
        this.playHitAnimation();
        
        // 更新UI
        this.updateUI();
        
        console.log(`[Enemy] Took ${damage} damage (${this.currentHp}/${this.maxHp})`);
        
        // 检查死亡
        if (this.currentHp <= 0) {
            this.onDeath();
        }
    }

    /**
     * 受伤动画
     */
    private playHitAnimation(): void {
        if (!this.node) return;

        // 红色闪烁
        const originalColor = this.enemySprite?.color.clone() || new Color(255, 255, 255);
        
        if (this.enemySprite) {
            tween(this.enemySprite)
                .to(0.1, { color: new Color(255, 100, 100) })
                .to(0.1, { color: originalColor })
                .start();
        }

        // 震动
        const originalPos = this.node.position.clone();
        tween(this.node)
            .by(0.05, { position: new Vec3(10, 0, 0) })
            .by(0.05, { position: new Vec3(-20, 0, 0) })
            .by(0.05, { position: new Vec3(10, 0, 0) })
            .to(0.05, { position: originalPos })
            .start();
    }

    /**
     * 死亡
     */
    private onDeath(): void {
        console.log(`[Enemy] Defeated: ${this.enemyData.name}`);
        
        // 死亡动画
        tween(this.node)
            .to(0.3, { scale: new Vec3(0, 0, 1) })
            .call(() => {
                this.node.active = false;
            })
            .start();
    }

    /**
     * 更新UI
     */
    private updateUI(): void {
        // 更新血量文字
        if (this.hpLabel) {
            this.hpLabel.string = `${this.currentHp} / ${this.maxHp}`;
        }

        // 更新血条
        if (this.hpBarFill) {
            const hpPercent = this.currentHp / this.maxHp;
            this.hpBarFill.setScale(hpPercent, 1, 1);
        }
    }

    /**
     * 是否存活
     */
    isAlive(): boolean {
        return this.currentHp > 0;
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
     * 获取敌人数据
     */
    getEnemyData(): EnemyData {
        return this.enemyData;
    }

    /**
     * 重置敌人
     */
    reset(): void {
        this.node.active = true;
        this.node.setScale(1, 1, 1);
        this.currentHp = 0;
        this.maxHp = 0;
        this.enemyData = null;
    }
}
