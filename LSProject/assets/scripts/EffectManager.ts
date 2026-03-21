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
        
        // Use Label as particle (simple and visible)
        const label = particle.addComponent(Label);
        label.string = '●';  // 圆点
        label.fontSize = 30;
        label.color = new cc.Color(255, 200, 50);  // 金黄色
        
        // Set initial position
        particle.setPosition(fromPos);
        particle.setScale(1, 1, 1);
        
        console.log(`[EffectManager] Attack particle: ${fromPos.x.toFixed(0)},${fromPos.y.toFixed(0)} -> ${toPos.x.toFixed(0)},${toPos.y.toFixed(0)}`);
        
        // Animate to target
        import('cc').then(({ tween, Vec3 }) => {
            tween(particle)
                .to(0.3, { position: toPos }, { easing: 'sineIn' })
                .call(() => {
                    particle.destroy();
                })
                .start();
        });
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
    
    /**
     * 爆炸特效
     */
    playExplosion(position: Vec3): void {
        console.log('[EffectManager] Playing explosion at', position);
        
        // 简单版本：红色圆圈扩散 + 震动
        const explosion = new Node('Explosion');
        this.effectRoot.addChild(explosion);
        explosion.setPosition(position);
        
        // 创建红色圆圈（使用Label临时替代）
        const circle = explosion.addComponent(Label);
        circle.string = '💥';
        circle.fontSize = 60;
        
        explosion.setScale(0.5, 0.5, 1);
        
        // 动画：放大 + 淡出
        tween(explosion)
            .to(0.3, { scale: new Vec3(2, 2, 1) }, { easing: 'sineOut' })
            .call(() => explosion.destroy())
            .start();
        
        // 屏幕震动
        this.shakeScreen(10, 0.2);
    }
    
    /**
     * 十字清除特效
     */
    playCrossClear(position: Vec3, row: number, col: number): void {
        console.log('[EffectManager] Playing cross clear at', position);
        
        // 简单版本：金色十字 + 闪光
        const cross = new Node('CrossClear');
        this.effectRoot.addChild(cross);
        cross.setPosition(position);
        
        // 创建十字符号（使用Label临时替代）
        const symbol = cross.addComponent(Label);
        symbol.string = '✨';
        symbol.fontSize = 80;
        symbol.color = new cc.Color(255, 215, 0); // 金色
        
        cross.setScale(0.5, 0.5, 1);
        
        // 动画：放大 + 旋转 + 淡出
        tween(cross)
            .to(0.4, { 
                scale: new Vec3(2.5, 2.5, 1),
                angle: 360 
            }, { easing: 'sineOut' })
            .call(() => cross.destroy())
            .start();
        
        // 轻微震动
        this.shakeScreen(5, 0.2);
    }
    
    /**
     * 屏幕震动
     */
    private shakeScreen(amplitude: number, duration: number): void {
        if (!this.camera) return;
        
        const cameraNode = this.camera.node;
        const originalPos = cameraNode.position.clone();
        
        const shakeCount = 10;
        const interval = duration / shakeCount;
        
        let count = 0;
        const shakeInterval = setInterval(() => {
            if (count >= shakeCount) {
                cameraNode.setPosition(originalPos);
                clearInterval(shakeInterval);
                return;
            }
            
            const offsetX = (Math.random() - 0.5) * amplitude * 2;
            const offsetY = (Math.random() - 0.5) * amplitude * 2;
            cameraNode.setPosition(
                originalPos.x + offsetX, 
                originalPos.y + offsetY, 
                originalPos.z
            );
            
            count++;
        }, interval * 1000);
    }
    
    /**
     * 流派锁定提示
     */
    showBuildLock(buildType: string): void {
        console.log('[EffectManager] Build locked:', buildType);
        
        const notification = new Node('BuildLock');
        this.effectRoot.addChild(notification);
        notification.setPosition(0, 200, 0);
        
        const label = notification.addComponent(Label);
        label.string = '🔒 流派锁定！+3秒';
        label.fontSize = 48;
        label.color = new cc.Color(255, 215, 0); // 金色
        
        notification.setScale(0, 0, 1);
        
        // 动画：放大 → 停留 → 淡出
        tween(notification)
            .to(0.3, { scale: new Vec3(1.2, 1.2, 1) }, { easing: 'backOut' })
            .to(0.2, { scale: new Vec3(1, 1, 1) })
            .delay(1.5)
            .to(0.3, { scale: new Vec3(0, 0, 1) })
            .call(() => notification.destroy())
            .start();
    }
    
    /**
     * 流派共鸣特效
     */
    showBuildResonance(buildType: string): void {
        console.log('[EffectManager] Build resonance:', buildType);
        
        const notification = new Node('BuildResonance');
        this.effectRoot.addChild(notification);
        notification.setPosition(0, 100, 0);
        
        const label = notification.addComponent(Label);
        label.string = '✨ 流派共鸣！';
        label.fontSize = 64;
        label.color = new cc.Color(255, 100, 255); // 紫色
        
        notification.setScale(0, 0, 1);
        
        // 动画：爆炸式放大 + 震动
        tween(notification)
            .to(0.5, { scale: new Vec3(1.5, 1.5, 1) }, { easing: 'backOut' })
            .delay(1.0)
            .to(0.3, { scale: new Vec3(0, 0, 1) })
            .call(() => notification.destroy())
            .start();
        
        // 强烈震动
        this.shakeScreen(15, 0.5);
    }
}
