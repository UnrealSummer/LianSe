import { _decorator, Component, Node, Label, tween, Vec3, Color, Sprite, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

/**
 * UI管理器 - 负责所有UI视觉反馈和动画
 */
@ccclass('UIManager')
export class UIManager extends Component {
    @property(Node)
    scorePopupNode: Node = null;  // 分数弹出节点

    @property(Node)
    comboNode: Node = null;  // 连锁提示节点

    @property(Label)
    comboLabel: Label = null;  // 连锁文字

    /**
     * 显示分数弹出动画
     * @param score 获得的分数
     * @param position 弹出位置（世界坐标）
     * @param isChain 是否为连锁
     */
    showScorePopup(score: number, position: Vec3, isChain: boolean = false) {
        // 创建分数标签节点
        const popupNode = new Node('ScorePopup');
        const label = popupNode.addComponent(Label);
        const uiOpacity = popupNode.addComponent(UIOpacity);
        
        // 设置文字
        label.string = `+${score}`;
        label.fontSize = isChain ? 60 : 40;
        label.lineHeight = isChain ? 60 : 40;
        
        // 根据分数设置颜色
        if (score >= 40) {
            label.color = new Color(255, 100, 100);  // 红色（高分）
        } else if (score >= 20) {
            label.color = new Color(255, 200, 0);    // 黄色（中分）
        } else {
            label.color = new Color(255, 255, 255);  // 白色（低分）
        }
        
        // 添加到场景
        popupNode.setParent(this.node);
        popupNode.setPosition(position);
        
        // 动画：向上飘 + 渐隐
        tween(popupNode)
            .by(0.8, { position: new Vec3(0, 100, 0) })
            .start();
        
        tween(uiOpacity)
            .delay(0.3)
            .to(0.5, { opacity: 0 })
            .call(() => {
                popupNode.destroy();
            })
            .start();
    }

    /**
     * 显示连锁倍数提示
     * @param chainLevel 连锁层数（1, 2, 3...）
     */
    showComboPopup(chainLevel: number) {
        if (!this.comboNode || !this.comboLabel) {
            console.warn('Combo节点未配置');
            return;
        }

        // 设置文字
        const multiplier = Math.pow(2, chainLevel);
        this.comboLabel.string = `×${multiplier} 连锁！`;
        
        // 根据倍数设置字体大小和颜色
        if (chainLevel >= 3) {
            this.comboLabel.fontSize = 80;
            this.comboLabel.color = new Color(255, 50, 50);  // 红色（超高倍）
        } else if (chainLevel === 2) {
            this.comboLabel.fontSize = 70;
            this.comboLabel.color = new Color(255, 149, 0);  // 橙色（高倍）
        } else {
            this.comboLabel.fontSize = 60;
            this.comboLabel.color = new Color(255, 204, 0);  // 黄色（普通）
        }

        // 显示节点
        this.comboNode.active = true;
        this.comboNode.setScale(0.5, 0.5, 1);
        
        const uiOpacity = this.comboNode.getComponent(UIOpacity);
        if (!uiOpacity) {
            this.comboNode.addComponent(UIOpacity);
        }
        
        // 动画：放大 + 弹跳 + 渐隐
        tween(this.comboNode)
            .to(0.2, { scale: new Vec3(1.2, 1.2, 1) }, { easing: 'backOut' })
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .delay(0.5)
            .to(0.3, { scale: new Vec3(0.8, 0.8, 1) })
            .call(() => {
                this.comboNode.active = false;
            })
            .start();
        
        tween(uiOpacity)
            .delay(0.8)
            .to(0.2, { opacity: 0 })
            .call(() => {
                uiOpacity.opacity = 255;
            })
            .start();
    }

    /**
     * 更新进度条显示
     * @param colorType 颜色类型
     * @param current 当前数量
     * @param target 目标数量
     */
    updateProgressBar(colorType: number, current: number, target: number) {
        // TODO: 实现进度条UI
        // 可以通过Sprite的fillRange属性实现填充效果
        const progress = Math.min(current / target, 1);
        console.log(`[进度] ${colorType}: ${current}/${target} (${(progress * 100).toFixed(0)}%)`);
    }

    /**
     * 显示目标达成动画
     * @param colorType 达成的目标颜色
     */
    showTargetComplete(colorType: number) {
        console.log(`[目标达成] ${colorType}`);
        // TODO: 实现目标达成特效
        // 可以添加打勾动画、闪光效果等
    }

    /**
     * 屏幕震动效果
     * @param intensity 震动强度（0-1）
     */
    screenShake(intensity: number = 0.5) {
        const camera = this.node.parent;
        if (!camera) return;

        const originalPos = camera.position.clone();
        const shakeAmount = 10 * intensity;

        // 随机震动
        const shakeTween = tween(camera);
        for (let i = 0; i < 5; i++) {
            const randomX = (Math.random() - 0.5) * shakeAmount;
            const randomY = (Math.random() - 0.5) * shakeAmount;
            shakeTween.to(0.05, { 
                position: new Vec3(
                    originalPos.x + randomX, 
                    originalPos.y + randomY, 
                    originalPos.z
                ) 
            });
        }
        
        shakeTween
            .to(0.05, { position: originalPos })
            .start();
    }
}
