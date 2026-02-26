import { _decorator, Component, Node, Sprite, SpriteFrame, Label, Button, director, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 结算类型
 */
export enum ResultType {
    VICTORY = 0,
    DEFEAT = 1
}

/**
 * 结算面板 - 显示游戏胜利/失败界面
 */
@ccclass('ResultPanel')
export class ResultPanel extends Component {
    
    @property(Sprite)
    background: Sprite = null;
    
    @property(SpriteFrame)
    victorySprite: SpriteFrame = null;
    
    @property(SpriteFrame)
    defeatSprite: SpriteFrame = null;
    
    @property(Label)
    titleLabel: Label = null;
    
    @property(Label)
    scoreLabel: Label = null;
    
    @property(Label)
    highScoreLabel: Label = null;
    
    @property(Button)
    restartButton: Button = null;
    
    @property(Button)
    menuButton: Button = null;
    
    private static instance: ResultPanel = null;
    
    onLoad() {
        ResultPanel.instance = this;
        
        // 绑定按钮事件
        if (this.restartButton) {
            this.restartButton.node.on('click', this.onRestartClicked, this);
        }
        if (this.menuButton) {
            this.menuButton.node.on('click', this.onMenuClicked, this);
        }
        
        // 初始隐藏
        this.node.active = false;
    }
    
    onDestroy() {
        if (ResultPanel.instance === this) {
            ResultPanel.instance = null;
        }
    }
    
    /**
     * 获取单例
     */
    static getInstance(): ResultPanel {
        return ResultPanel.instance;
    }
    
    /**
     * 显示结算面板
     * @param type 结算类型（胜利/失败）
     * @param score 当前分数
     * @param highScore 最高分数（可选）
     */
    show(type: ResultType, score: number, highScore?: number) {
        this.node.active = true;
        
        // 设置背景
        if (this.background) {
            if (type === ResultType.VICTORY) {
                this.background.spriteFrame = this.victorySprite;
            } else {
                this.background.spriteFrame = this.defeatSprite;
            }
        }
        
        // 设置标题
        if (this.titleLabel) {
            this.titleLabel.string = type === ResultType.VICTORY ? 'VICTORY!' : 'DEFEAT';
        }
        
        // 设置分数
        if (this.scoreLabel) {
            this.scoreLabel.string = `Score: ${score}`;
        }
        
        // 设置最高分
        if (this.highScoreLabel && highScore !== undefined) {
            this.highScoreLabel.string = `Best: ${highScore}`;
            this.highScoreLabel.node.active = true;
        } else if (this.highScoreLabel) {
            this.highScoreLabel.node.active = false;
        }
        
        // 播放弹出动画
        this.node.setScale(0, 0, 1);
        
        tween(this.node)
            .to(0.3, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
            .start();
    }
    
    /**
     * 隐藏面板
     */
    hide() {
        tween(this.node)
            .to(0.2, { scale: new Vec3(0, 0, 1) })
            .call(() => {
                this.node.active = false;
            })
            .start();
    }
    
    /**
     * 重新开始按钮点击
     */
    private onRestartClicked() {
        console.log('ResultPanel: 重新开始游戏');
        
        // 重新加载当前场景
        let sceneName = director.getScene().name;
        director.loadScene(sceneName);
    }
    
    /**
     * 返回菜单按钮点击
     */
    private onMenuClicked() {
        console.log('ResultPanel: 返回主菜单');
        
        // 加载主菜单场景
        director.loadScene('MainMenu');
    }
}
