import { _decorator, Component, Node, Label, Vec3, Color, tween } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 伤害数字飘字效果
 */
@ccclass('DamageNumber')
export class DamageNumber extends Component {
    private label: Label = null;
    
    start() {
        this.label = this.getComponent(Label);
    }

    /**
     * 显示伤害数字
     */
    show(damage: number, isCritical: boolean = false, position: Vec3 = new Vec3(0, 0, 0)): void {
        if (!this.label) {
            this.label = this.getComponent(Label);
        }
        
        // Set text
        this.label.string = `-${damage}`;
        
        // Set color and size based on critical
        if (isCritical) {
            this.label.color = new Color(255, 100, 100);  // 红色
            this.node.setScale(1.5, 1.5, 1);
        } else {
            this.label.color = new Color(255, 255, 255);  // 白色
            this.node.setScale(1, 1, 1);
        }
        
        // Set position
        this.node.setPosition(position);
        
        // Animate
        this.animate();
    }

    /**
     * 飘字动画
     */
    private animate(): void {
        const startPos = this.node.getPosition();
        const endPos = new Vec3(startPos.x, startPos.y + 100, startPos.z);
        
        tween(this.node)
            .to(0.5, { position: endPos }, { easing: 'sineOut' })
            .start();
        
        tween(this.node)
            .delay(0.3)
            .to(0.2, { scale: new Vec3(0, 0, 1) })
            .call(() => {
                this.node.destroy();
            })
            .start();
    }
}
