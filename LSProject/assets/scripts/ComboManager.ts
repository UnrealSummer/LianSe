import { _decorator, Component, Node, Label, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 连击管理器 - 管理连击系统
 */
@ccclass('ComboManager')
export class ComboManager extends Component {
    
    @property(Node)
    comboPanel: Node = null;
    
    @property(Label)
    comboLabel: Label = null;
    
    @property({ tooltip: '连击超时时间（秒）' })
    comboTimeout: number = 2.0;
    
    @property({ tooltip: '连击分数倍率（每次连击增加）' })
    comboMultiplier: number = 0.5;
    
    private comboCount: number = 0;
    private comboTimer: number = 0;
    private static instance: ComboManager = null;
    
    onLoad() {
        ComboManager.instance = this;
        this.resetCombo();
    }
    
    onDestroy() {
        if (ComboManager.instance === this) {
            ComboManager.instance = null;
        }
    }
    
    /**
     * 获取单例
     */
    static getInstance(): ComboManager {
        return ComboManager.instance;
    }
    
    update(dt: number) {
        if (this.comboCount > 0) {
            this.comboTimer += dt;
            if (this.comboTimer >= this.comboTimeout) {
                this.resetCombo();
            }
        }
    }
    
    /**
     * 增加连击
     */
    addCombo() {
        this.comboCount++;
        this.comboTimer = 0;
        
        // 连击数>=2时才显示
        if (this.comboCount >= 2) {
            this.showCombo();
        }
    }
    
    /**
     * 显示连击UI
     */
    private showCombo() {
        if (!this.comboPanel || !this.comboLabel) {
            return;
        }
        
        // 更新文本
        this.comboLabel.string = `COMBO x${this.comboCount}`;
        
        // 停止之前的动画
        this.comboPanel.stopAllActions();
        
        // 显示并播放弹出动画
        this.comboPanel.active = true;
        this.comboPanel.setScale(0.5, 0.5, 1);
        
        tween(this.comboPanel)
            .to(0.2, { scale: new Vec3(1.2, 1.2, 1) }, { easing: 'backOut' })
            .to(0.1, { scale: new Vec3(1.0, 1.0, 1) })
            .start();
    }
    
    /**
     * 重置连击
     */
    resetCombo() {
        this.comboCount = 0;
        this.comboTimer = 0;
        
        if (this.comboPanel) {
            this.comboPanel.stopAllActions();
            tween(this.comboPanel)
                .to(0.3, { scale: new Vec3(0, 0, 1) })
                .call(() => {
                    this.comboPanel.active = false;
                })
                .start();
        }
    }
    
    /**
     * 获取当前连击数
     */
    getCombo(): number {
        return this.comboCount;
    }
    
    /**
     * 获取当前连击分数倍率
     */
    getScoreMultiplier(): number {
        if (this.comboCount <= 1) {
            return 1.0;
        }
        return 1.0 + (this.comboCount - 1) * this.comboMultiplier;
    }
}
