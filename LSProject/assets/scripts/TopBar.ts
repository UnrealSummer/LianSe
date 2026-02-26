import { _decorator, Component, Node, Label, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 顶部UI栏 - 显示时间、金币、关卡等信息
 */
@ccclass('TopBar')
export class TopBar extends Component {
    
    @property(Node)
    timeDisplay: Node = null;
    
    @property(Label)
    timeLabel: Label = null;
    
    @property(Node)
    coinDisplay: Node = null;
    
    @property(Label)
    coinLabel: Label = null;
    
    @property(Node)
    stageDisplay: Node = null;
    
    @property(Label)
    stageLabel: Label = null;
    
    @property(Sprite)
    background: Sprite = null;
    
    @property(SpriteFrame)
    topBarBg: SpriteFrame = null;
    
    private static instance: TopBar = null;
    
    onLoad() {
        TopBar.instance = this;
        
        // 设置背景
        if (this.background && this.topBarBg) {
            this.background.spriteFrame = this.topBarBg;
        }
    }
    
    onDestroy() {
        if (TopBar.instance === this) {
            TopBar.instance = null;
        }
    }
    
    /**
     * 获取单例
     */
    static getInstance(): TopBar {
        return TopBar.instance;
    }
    
    /**
     * 更新时间显示
     * @param seconds 剩余秒数
     */
    updateTime(seconds: number) {
        if (!this.timeLabel) return;
        
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        this.timeLabel.string = `${minutes}:${secs.toString().padStart(2, '0')}`;
        
        // 时间不足10秒时变红
        if (seconds <= 10) {
            this.timeLabel.node.getComponent(Label).color.fromHEX('#FF0000');
        } else {
            this.timeLabel.node.getComponent(Label).color.fromHEX('#FFFFFF');
        }
    }
    
    /**
     * 更新金币显示
     * @param coins 金币数量
     */
    updateCoins(coins: number) {
        if (!this.coinLabel) return;
        this.coinLabel.string = coins.toString();
    }
    
    /**
     * 更新关卡显示
     * @param stage 当前关卡
     */
    updateStage(stage: number) {
        if (!this.stageLabel) return;
        this.stageLabel.string = `Stage ${stage}`;
    }
    
    /**
     * 显示顶部栏
     */
    show() {
        this.node.active = true;
    }
    
    /**
     * 隐藏顶部栏
     */
    hide() {
        this.node.active = false;
    }
}
