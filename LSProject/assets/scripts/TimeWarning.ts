import { _decorator, Component, Label, Node, tween, Color, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 时间警告组件
 */
@ccclass('TimeWarning')
export class TimeWarning extends Component {
    @property({ type: Label })
    timeLabel: Label = null;
    
    @property({ type: Node })
    warningNode: Node = null;
    
    private isWarning: boolean = false;
    private warningThreshold: number = 15; // 15秒开始警告
    
    /**
     * 更新时间显示
     */
    updateTime(timeLeft: number, timeLimit: number): void {
        // 更新时间文本
        if (this.timeLabel) {
            this.timeLabel.string = `时间: ${Math.ceil(timeLeft)}s`;
        }
        
        // 检查是否需要警告
        if (timeLeft <= this.warningThreshold && !this.isWarning) {
            this.startWarning();
        } else if (timeLeft > this.warningThreshold && this.isWarning) {
            this.stopWarning();
        }
    }
    
    /**
     * 开始警告
     */
    private startWarning(): void {
        this.isWarning = true;
        
        if (!this.timeLabel) return;
        
        // 改变颜色为红色
        this.timeLabel.color = new Color(255, 0, 0, 255);
        
        // 闪烁动画
        this.playBlinkAnimation();
    }
    
    /**
     * 停止警告
     */
    private stopWarning(): void {
        this.isWarning = false;
        
        if (!this.timeLabel) return;
        
        // 恢复白色
        this.timeLabel.color = new Color(255, 255, 255, 255);
        
        // 停止动画
        tween(this.timeLabel.node).stop();
    }
    
    /**
     * 播放闪烁动画
     */
    private playBlinkAnimation(): void {
        if (!this.timeLabel) return;
        
        const node = this.timeLabel.node;
        
        tween(node)
            .to(0.5, { scale: new Vec3(1.2, 1.2, 1) })
            .to(0.5, { scale: new Vec3(1, 1, 1) })
            .union()
            .repeatForever()
            .start();
    }
    
    /**
     * 设置警告阈值
     */
    setWarningThreshold(threshold: number): void {
        this.warningThreshold = threshold;
    }
}
