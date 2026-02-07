import { _decorator, Component, Node, Label, tween, Vec3, Color, UIOpacity, instantiate, Prefab } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 战斗表现层管理器 - Roguelike专用
 * 负责伤害数字、金币飞出、屏幕震动等视觉反馈
 */
@ccclass('CombatFeedback')
export class CombatFeedback extends Component {
    @property({ type: Node })
    damageNumberContainer: Node = null; // 伤害数字容器
    
    @property({ type: Node })
    coinContainer: Node = null; // 金币容器
    
    @property({ type: Node })
    enemyNode: Node = null; // 敌人节点（用于定位）
    
    @property({ type: Node })
    cameraNode: Node = null; // 摄像机节点（用于震动）
    
    private originalCameraPos: Vec3 = new Vec3();
    
    start() {
        if (this.cameraNode) {
            this.originalCameraPos = this.cameraNode.position.clone();
        }
    }
    
    /**
     * 显示伤害数字
     * @param damage 伤害值
     * @param position 显示位置（世界坐标）
     * @param isCritical 是否暴击
     * @param isEpic 是否Epic效果（翻倍、暴击等）
     */
    showDamage(damage: number, position: Vec3, isCritical: boolean = false, isEpic: boolean = false): void {
        const damageNode = new Node('Damage');
        const label = damageNode.addComponent(Label);
        const uiOpacity = damageNode.addComponent(UIOpacity);
        
        // 设置文字
        label.string = `-${damage}`;
        
        // Epic效果：更大、更醒目
        if (isEpic) {
            label.fontSize = 100;
            label.color = new Color(255, 215, 0); // 金色
            label.string = `💥 ${label.string} 💥`;
        } else if (isCritical) {
            label.fontSize = 80;
            label.color = new Color(255, 50, 50); // 红色
        } else {
            label.fontSize = 60;
            label.color = new Color(255, 255, 255); // 白色
        }
        
        label.lineHeight = label.fontSize;
        
        // 添加到容器
        damageNode.setParent(this.damageNumberContainer || this.node);
        damageNode.setPosition(position);
        
        // 动画：向上飘 + 放大 + 渐隐
        const targetY = position.y + (isEpic ? 200 : isCritical ? 150 : 100);
        const scale = isEpic ? 2.0 : isCritical ? 1.5 : 1.2;
        
        tween(damageNode)
            .to(0.1, { scale: new Vec3(scale, scale, 1) })
            .to(0.7, { position: new Vec3(position.x, targetY, position.z) })
            .start();
        
        tween(uiOpacity)
            .delay(0.3)
            .to(0.5, { opacity: 0 })
            .call(() => {
                damageNode.destroy();
            })
            .start();
    }
    
    /**
     * 显示金币飞出
     * @param amount 金币数量
     * @param fromPosition 起始位置
     * @param toPosition 目标位置（金币UI位置）
     */
    showCoinFly(amount: number, fromPosition: Vec3, toPosition: Vec3): void {
        // 创建多个金币节点（根据数量）
        const coinCount = Math.min(amount, 10); // 最多10个金币
        
        for (let i = 0; i < coinCount; i++) {
            this.createCoin(fromPosition, toPosition, i * 0.05);
        }
        
        // 显示金币数字
        this.showCoinNumber(amount, fromPosition);
    }
    
    /**
     * 创建单个金币
     */
    private createCoin(from: Vec3, to: Vec3, delay: number): void {
        const coinNode = new Node('Coin');
        const label = coinNode.addComponent(Label);
        
        label.string = '💰';
        label.fontSize = 40;
        
        coinNode.setParent(this.coinContainer || this.node);
        coinNode.setPosition(from);
        
        // 随机偏移
        const offsetX = (Math.random() - 0.5) * 100;
        const offsetY = (Math.random() - 0.5) * 100;
        const midPoint = new Vec3(
            (from.x + to.x) / 2 + offsetX,
            (from.y + to.y) / 2 + offsetY + 100,
            0
        );
        
        // 贝塞尔曲线飞行
        tween(coinNode)
            .delay(delay)
            .to(0.3, { position: midPoint })
            .to(0.3, { position: to, scale: new Vec3(0.5, 0.5, 1) })
            .call(() => {
                coinNode.destroy();
            })
            .start();
    }
    
    /**
     * 显示金币数字
     */
    private showCoinNumber(amount: number, position: Vec3): void {
        const numberNode = new Node('CoinNumber');
        const label = numberNode.addComponent(Label);
        const uiOpacity = numberNode.addComponent(UIOpacity);
        
        label.string = `+${amount} 💰`;
        label.fontSize = 50;
        label.color = new Color(255, 215, 0); // 金色
        
        numberNode.setParent(this.coinContainer || this.node);
        numberNode.setPosition(position);
        
        // 向上飘 + 渐隐
        tween(numberNode)
            .by(0.8, { position: new Vec3(0, 80, 0) })
            .start();
        
        tween(uiOpacity)
            .delay(0.3)
            .to(0.5, { opacity: 0 })
            .call(() => {
                numberNode.destroy();
            })
            .start();
    }
    
    /**
     * 屏幕震动
     * @param intensity 强度（0-1）
     */
    screenShake(intensity: number = 0.5): void {
        if (!this.cameraNode) return;
        
        const shakeAmount = intensity * 20;
        const duration = 0.3;
        
        // 随机震动
        const shake1 = new Vec3(
            this.originalCameraPos.x + (Math.random() - 0.5) * shakeAmount,
            this.originalCameraPos.y + (Math.random() - 0.5) * shakeAmount,
            this.originalCameraPos.z
        );
        
        const shake2 = new Vec3(
            this.originalCameraPos.x + (Math.random() - 0.5) * shakeAmount * 0.5,
            this.originalCameraPos.y + (Math.random() - 0.5) * shakeAmount * 0.5,
            this.originalCameraPos.z
        );
        
        tween(this.cameraNode)
            .to(duration * 0.3, { position: shake1 })
            .to(duration * 0.3, { position: shake2 })
            .to(duration * 0.4, { position: this.originalCameraPos })
            .start();
    }
    
    /**
     * 显示连锁提示
     * @param chainLevel 连锁层数
     */
    showChainCombo(chainLevel: number): void {
        const comboNode = new Node('Combo');
        const label = comboNode.addComponent(Label);
        const uiOpacity = comboNode.addComponent(UIOpacity);
        
        label.string = `${chainLevel}x COMBO!`;
        label.fontSize = 60 + chainLevel * 10;
        label.lineHeight = label.fontSize;
        
        // 颜色随连锁层数变化
        if (chainLevel >= 5) {
            label.color = new Color(255, 50, 50); // 红色
        } else if (chainLevel >= 3) {
            label.color = new Color(255, 150, 0); // 橙色
        } else {
            label.color = new Color(255, 255, 0); // 黄色
        }
        
        comboNode.setParent(this.node);
        comboNode.setPosition(0, 200, 0);
        
        // 弹跳动画
        tween(comboNode)
            .to(0.2, { scale: new Vec3(1.3, 1.3, 1) }, { easing: 'backOut' })
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .start();
        
        tween(uiOpacity)
            .delay(0.5)
            .to(0.3, { opacity: 0 })
            .call(() => {
                comboNode.destroy();
            })
            .start();
    }
    
    /**
     * 显示词条触发效果
     * @param modifierName 词条名称
     */
    showModifierTrigger(modifierName: string): void {
        const triggerNode = new Node('ModifierTrigger');
        const label = triggerNode.addComponent(Label);
        const uiOpacity = triggerNode.addComponent(UIOpacity);
        
        label.string = `【${modifierName}】触发！`;
        label.fontSize = 40;
        label.color = new Color(150, 255, 150); // 绿色
        
        triggerNode.setParent(this.node);
        triggerNode.setPosition(0, -150, 0);
        
        tween(triggerNode)
            .by(0.6, { position: new Vec3(0, 50, 0) })
            .start();
        
        tween(uiOpacity)
            .delay(0.3)
            .to(0.3, { opacity: 0 })
            .call(() => {
                triggerNode.destroy();
            })
            .start();
    }
}
