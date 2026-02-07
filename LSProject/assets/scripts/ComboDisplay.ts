import { _decorator, Component, Label, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 连击数显示组件
 */
@ccclass('ComboDisplay')
export class ComboDisplay extends Component {
    @property({ type: Label })
    comboLabel: Label = null;
    
    @property({ type: Node })
    comboNode: Node = null;
    
    private currentCombo: number = 0;
    
    start() {
        this.hide();
    }
    
    /**
     * 更新连击数
     */
    updateCombo(combo: number): void {
        this.currentCombo = combo;
        
        if (combo <= 0) {
            this.hide();
            return;
        }
        
        // 显示连击数
        if (this.comboLabel) {
            this.comboLabel.string = `${combo} COMBO!`;
        }
        
        // 显示节点
        if (this.comboNode) {
            this.comboNode.active = true;
        }
        
        // 播放动画
        this.playComboAnimation();
    }
    
    /**
     * 播放连击动画
     */
    private playComboAnimation(): void {
        if (!this.comboNode) return;
        
        // 停止之前的动画
        tween(this.comboNode).stop();
        
        // 缩放动画
        const originalScale = this.comboNode.scale.clone();
        const targetScale = new Vec3(
            originalScale.x * 1.2,
            originalScale.y * 1.2,
            originalScale.z
        );
        
        tween(this.comboNode)
            .to(0.1, { scale: targetScale })
            .to(0.1, { scale: originalScale })
            .start();
    }
    
    /**
     * 隐藏连击显示
     */
    hide(): void {
        if (this.comboNode) {
            this.comboNode.active = false;
        }
    }
    
    /**
     * 获取当前连击数
     */
    getCurrentCombo(): number {
        return this.currentCombo;
    }
}
