import { _decorator, Component, Node, Label, Button } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 游戏结束UI
 */
@ccclass('GameOverUI')
export class GameOverUI extends Component {
    @property(Node)
    victoryPanel: Node = null;

    @property(Node)
    defeatPanel: Node = null;

    @property(Label)
    victoryStageLabel: Label = null;

    @property(Label)
    victoryStatsLabel: Label = null;

    @property(Label)
    victoryCoinLabel: Label = null;

    @property(Label)
    defeatStageLabel: Label = null;

    @property(Label)
    defeatStatsLabel: Label = null;

    @property(Button)
    victoryNextButton: Button = null;

    @property(Button)
    defeatRestartButton: Button = null;

    private onNextCallback: () => void = null;
    private onRestartCallback: () => void = null;

    start() {
        // Hide by default
        this.hide();

        // Setup button events
        if (this.victoryNextButton) {
            this.victoryNextButton.node.on(Node.EventType.TOUCH_END, () => {
                this.onNextClicked();
            });
        }

        if (this.defeatRestartButton) {
            this.defeatRestartButton.node.on(Node.EventType.TOUCH_END, () => {
                this.onRestartClicked();
            });
        }
    }

    /**
     * 显示胜利界面
     */
    showVictory(stage: number, stats: { moves: number, maxCombo: number, coins: number }, onNext: () => void): void {
        this.onNextCallback = onNext;

        if (this.victoryStageLabel) {
            this.victoryStageLabel.string = `第${stage}关 完成！`;
        }

        if (this.victoryStatsLabel) {
            this.victoryStatsLabel.string = `移动次数: ${stats.moves}\n最大连击: x${stats.maxCombo}`;
        }

        if (this.victoryCoinLabel) {
            this.victoryCoinLabel.string = `获得金币: ${stats.coins}`;
        }

        if (this.victoryPanel) {
            this.victoryPanel.active = true;
        }

        if (this.defeatPanel) {
            this.defeatPanel.active = false;
        }

        this.node.active = true;
        console.log('[GameOverUI] Showing victory');
    }

    /**
     * 显示失败界面
     */
    showDefeat(stage: number, stats: { moves: number, maxCombo: number }, onRestart: () => void): void {
        this.onRestartCallback = onRestart;

        if (this.defeatStageLabel) {
            this.defeatStageLabel.string = `第${stage}关 失败`;
        }

        if (this.defeatStatsLabel) {
            this.defeatStatsLabel.string = `移动次数: ${stats.moves}\n最大连击: x${stats.maxCombo}`;
        }

        if (this.victoryPanel) {
            this.victoryPanel.active = false;
        }

        if (this.defeatPanel) {
            this.defeatPanel.active = true;
        }

        this.node.active = true;
        console.log('[GameOverUI] Showing defeat');
    }

    /**
     * 隐藏UI
     */
    hide(): void {
        this.node.active = false;
    }

    /**
     * 下一关按钮点击
     */
    private onNextClicked(): void {
        console.log('[GameOverUI] Next clicked');
        this.hide();
        if (this.onNextCallback) {
            this.onNextCallback();
        }
    }

    /**
     * 重新开始按钮点击
     */
    private onRestartClicked(): void {
        console.log('[GameOverUI] Restart clicked');
        this.hide();
        if (this.onRestartCallback) {
            this.onRestartCallback();
        }
    }
}
