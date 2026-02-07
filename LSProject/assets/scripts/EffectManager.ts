import { _decorator, Component, Node, Label, Vec3, Prefab, instantiate, tween, Camera } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 特效管理器 - 管理所有视觉反馈
 */
@ccclass('EffectManager')
export class EffectManager extends Component {
    @property(Prefab)
    damageNumberPrefab: Prefab = null;

    private camera: Camera = null;
    private effectRoot: Node = null;

    start() {
        // Find camera
        this.camera = this.node.scene.getComponentInChildren(Camera);
        
        // Create effect root
        this.effectRoot = new Node('EffectRoot');
        this.node.parent.addChild(this.effectRoot);
        
        console.log('[EffectManager] Initialized');
    }

    /**
     * 显示伤害数字
     */
    showDamage(damage: number, worldPos: Vec3, isCritical: boolean = false): void {
        if (!this.damageNumberPrefab) {
            console.warn('[EffectManager] Damage number prefab not set');
            return;
        }

        const damageNode = instantiate(this.damageNumberPrefab);
        this.effectRoot.addChild(damageNode);
        
        // Set position
        damageNode.setPosition(worldPos);
        
        // Get label and set text
        const label = damageNode.getComponent(Label);
        if (label) {
            label.string = `-${damage}`;
            
            if (isCritical) {
                label.color = new cc.Color(255, 100, 100);
                damageNode.setScale(1.5, 1.5, 1);
            }
        }
        
        // Animate
        this.animateDamageNumber(damageNode);
    }

    /**
     * 显示攻击特效（从方块飞向敌人）
     */
    showAttackEffect(fromPos: Vec3, toPos: Vec3, count: number = 1): void {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.createAttackParticle(fromPos, toPos);
            }, i * 50);  // 每个粒子延迟50ms
        }
    }

    /**
     * 创建攻击粒子
     */
    private createAttackParticle(fromPos: Vec3, toPos: Vec3): void {
        const particle = new Node('AttackParticle');
        this.effectRoot.addChild(particle);
        
        // Add sprite
        const sprite = particle.addComponent(cc.Sprite);
        sprite.color = new cc.Color(255, 200, 50);  // 金黄色
        
        // Set initial position
        particle.setPosition(fromPos);
        particle.setScale(0.3, 0.3, 1);
        
        // Animate to target
        tween(particle)
            .to(0.3, { position: toPos }, { easing: 'sineIn' })
            .call(() => {
                particle.destroy();
            })
            .start();
        
        // Fade out
        tween(sprite)
            .to(0.3, { color: new cc.Color(255, 200, 50, 0) })
            .start();
    }

    /**
     * 伤害数字动画
     */
    private animateDamageNumber(node: Node): void {
        const startPos = node.getPosition();
        const endPos = new Vec3(startPos.x, startPos.y + 100, startPos.z);
        
        tween(node)
            .to(0.5, { position: endPos }, { easing: 'sineOut' })
            .start();
        
        tween(node)
            .delay(0.3)
            .to(0.2, { scale: new Vec3(0, 0, 1) })
            .call(() => {
                node.destroy();
            })
            .start();
    }

    /**
     * 屏幕震动
     */
    screenShake(intensity: number = 10, duration: number = 0.2): void {
        if (!this.camera) return;
        
        const cameraNode = this.camera.node;
        const originalPos = cameraNode.getPosition().clone();
        
        const shakeCount = 10;
        const shakeInterval = duration / shakeCount;
        
        let currentShake = 0;
        const shake = () => {
            if (currentShake >= shakeCount) {
                cameraNode.setPosition(originalPos);
                return;
            }
            
            const offsetX = (Math.random() - 0.5) * intensity;
            const offsetY = (Math.random() - 0.5) * intensity;
            cameraNode.setPosition(originalPos.x + offsetX, originalPos.y + offsetY, originalPos.z);
            
            currentShake++;
            setTimeout(shake, shakeInterval * 1000);
        };
        
        shake();
    }

    /**
     * 连击文字
     */
    showCombo(comboLevel: number, worldPos: Vec3): void {
        const comboNode = new Node('Combo');
        this.effectRoot.addChild(comboNode);
        
        const label = comboNode.addComponent(Label);
        label.string = `COMBO x${comboLevel}!`;
        label.fontSize = 40 + (comboLevel * 5);  // 连击越高字越大
        label.color = new cc.Color(255, 200, 0);
        
        // 根据连击数偏移位置，避免重叠
        const offsetY = (comboLevel - 1) * 60;  // 每次连击向上偏移60像素
        const offsetX = (Math.random() - 0.5) * 100;  // 随机左右偏移
        comboNode.setPosition(worldPos.x + offsetX, worldPos.y + offsetY, worldPos.z);
        comboNode.setScale(0, 0, 1);
        
        // Animate
        tween(comboNode)
            .to(0.2, { scale: new Vec3(1.5, 1.5, 1) }, { easing: 'backOut' })
            .to(0.1, { scale: new Vec3(1.2, 1.2, 1) })
            .delay(0.5)
            .to(0.2, { scale: new Vec3(0, 0, 1) })
            .call(() => {
                comboNode.destroy();
            })
            .start();
    }

    /**
     * 敌人受击闪烁
     */
    enemyHitFlash(enemyNode: Node): void {
        if (!enemyNode) return;
        
        const sprite = enemyNode.getComponent('cc.Sprite');
        if (!sprite) return;
        
        const originalColor = sprite.color.clone();
        
        // Flash white
        tween(sprite)
            .to(0.1, { color: new cc.Color(255, 255, 255) })
            .to(0.1, { color: originalColor })
            .start();
    }
}
