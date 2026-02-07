import { _decorator, Component, Node, Label, Button } from 'cc';
import { DataManager } from './DataManager';
const { ccclass, property } = _decorator;

/**
 * 游戏结束结算界面
 */
@ccclass('GameOverUI')
export class GameOverUI extends Component {
    @property({ type: Node })
    panel: Node = null; // 结算面板
    
    // 本次成绩
    @property({ type: Label })
    stageLabel: Label = null; // 关卡进度
    
    @property({ type: Label })
    scoreLabel: Label = null; // 总分数
    
    @property({ type: Label })
    goldLabel: Label = null; // 总金币
    
    // 历史最佳
    @property({ type: Label })
    bestStageLabel: Label = null; // 最高关卡
    
    @property({ type: Label })
    bestScoreLabel: Label = null; // 最高分数
    
    // 新纪录提示
    @property({ type: Node })
    newRecordNode: Node = null; // "新纪录！"提示
    
    // 按钮
    @property({ type: Button })
    restartButton: Button = null; // 重新开始
    
    @property({ type: Button })
    menuButton: Button = null; // 返回主菜单（可选）
    
    private onRestartCallback: (() => void) | null = null;
    
    start() {
        this.hide();
        
        // 绑定按钮事件
        if (this.restartButton) {
            this.restartButton.node.on(Button.EventType.CLICK, this.onRestartClicked, this);
        }
        
        if (this.menuButton) {
            this.menuButton.node.on(Button.EventType.CLICK, this.onMenuClicked, this);
        }
    }
    
    /**
     * 显示结算界面
     * @param stage 本次关卡
     * @param score 本次分数
     * @param gold 本次金币
     * @param onRestart 重新开始回调
     */
    show(stage: number, score: number, gold: number, onRestart?: () => void): void {
        this.onRestartCallback = onRestart || null;
        
        // 获取历史最佳
        const dataManager = DataManager.getInstance();
        const playerData = dataManager ? dataManager.getPlayerData() : null;
        
        // 显示本次成绩
        if (this.stageLabel) {
            this.stageLabel.string = `第 ${stage} 关`;
        }
        
        if (this.scoreLabel) {
            this.scoreLabel.string = score.toString();
        }
        
        if (this.goldLabel) {
            this.goldLabel.string = gold.toString();
        }
        
        // 显示历史最佳
        if (playerData) {
            if (this.bestStageLabel) {
                this.bestStageLabel.string = `第 ${playerData.highestStage} 关`;
            }
            
            if (this.bestScoreLabel) {
                this.bestScoreLabel.string = playerData.highestScore.toString();
            }
            
            // 检查是否新纪录
            const isNewRecord = stage > playerData.highestStage || score > playerData.highestScore;
            if (this.newRecordNode) {
                this.newRecordNode.active = isNewRecord;
            }
            
            if (isNewRecord) {
                console.log('🎉 新纪录！');
            }
        }
        
        // 显示面板
        if (this.panel) {
            this.panel.active = true;
        }
        
        console.log('[GameOverUI] 结算界面已显示');
    }
    
    /**
     * 隐藏结算界面
     */
    hide(): void {
        if (this.panel) {
            this.panel.active = false;
        }
        
        if (this.newRecordNode) {
            this.newRecordNode.active = false;
        }
    }
    
    /**
     * 重新开始按钮点击
     */
    private onRestartClicked(): void {
        console.log('[GameOverUI] 重新开始');
        this.hide();
        
        if (this.onRestartCallback) {
            this.onRestartCallback();
        }
    }
    
    /**
     * 返回主菜单按钮点击
     */
    private onMenuClicked(): void {
        console.log('[GameOverUI] 返回主菜单');
        // TODO: 实现返回主菜单
        this.hide();
    }
}
