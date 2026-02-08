import { _decorator, Component, Node, Label, Button } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 游戏结束界面
 * 显示胜利/失败结算信息
 */
@ccclass('GameOverUI')
export class GameOverUI extends Component {
    // ===== 面板引用 =====
    @property(Node)
    victoryPanel: Node = null;

    @property(Node)
    defeatPanel: Node = null;

    // ===== 胜利面板元素 =====
    @property(Label)
    victoryScoreLabel: Label = null;

    @property(Label)
    victoryCoinsLabel: Label = null;

    @property(Label)
    victoryComboLabel: Label = null;

    @property(Label)
    victoryRewardLabel: Label = null;

    @property(Button)
    continueButton: Button = null;

    @property(Button)
    victoryMenuButton: Button = null;

    // ===== 失败面板元素 =====
    @property(Label)
    defeatScoreLabel: Label = null;

    @property(Label)
    defeatCoinsLabel: Label = null;

    @property(Label)
    defeatComboLabel: Label = null;

    @property(Button)
    retryButton: Button = null;

    @property(Button)
    defeatMenuButton: Button = null;

    // ===== 私有变量 =====
    private onContinueCallback: Function = null;
    private onRetryCallback: Function = null;
    private onMenuCallback: Function = null;

    start() {
        this.initPanels();
        this.bindEvents();
        
        // Debug: Check node hierarchy
        console.log('[GameOverUI] Node name:', this.node.name);
        console.log('[GameOverUI] Node active:', this.node.active);
        console.log('[GameOverUI] Parent:', this.node.parent?.name);
        console.log('[GameOverUI] Sibling count:', this.node.parent?.children.length);
    }

    /**
     * 初始化面板
     */
    private initPanels() {
        if (this.victoryPanel) {
            this.victoryPanel.active = false;
        }
        if (this.defeatPanel) {
            this.defeatPanel.active = false;
        }
        console.log('[GameOverUI] Panels initialized');
    }

    /**
     * 绑定按钮事件
     */
    private bindEvents() {
        // 胜利面板按钮
        if (this.continueButton) {
            this.continueButton.node.on(Button.EventType.CLICK, this.onContinue, this);
        }
        if (this.victoryMenuButton) {
            this.victoryMenuButton.node.on(Button.EventType.CLICK, this.onMenu, this);
        }

        // 失败面板按钮
        if (this.retryButton) {
            this.retryButton.node.on(Button.EventType.CLICK, this.onRetry, this);
        }
        if (this.defeatMenuButton) {
            this.defeatMenuButton.node.on(Button.EventType.CLICK, this.onMenu, this);
        }

        console.log('[GameOverUI] Events bound');
    }

    /**
     * 显示胜利界面
     */
    showVictory(data: {
        score: number,
        coins: number,
        maxCombo: number,
        reward: number,
        stage: number
    }) {
        console.log('[GameOverUI] Showing victory', data);

        // 隐藏失败面板
        if (this.defeatPanel) {
            this.defeatPanel.active = false;
        }

        // 更新胜利信息
        if (this.victoryScoreLabel) {
            this.victoryScoreLabel.string = `分数: ${data.score}`;
        }
        if (this.victoryCoinsLabel) {
            this.victoryCoinsLabel.string = `金币: ${data.coins}`;
        }
        if (this.victoryComboLabel) {
            this.victoryComboLabel.string = `最高连击: ${data.maxCombo}`;
        }
        if (this.victoryRewardLabel) {
            this.victoryRewardLabel.string = `奖励: +${data.reward} 金币`;
        }

        // 显示胜利面板
        if (this.victoryPanel) {
            this.victoryPanel.active = true;
            console.log('[GameOverUI] VictoryPanel activated:', this.victoryPanel.active);
            console.log('[GameOverUI] VictoryPanel position:', this.victoryPanel.position);
            console.log('[GameOverUI] VictoryPanel scale:', this.victoryPanel.scale);
            console.log('[GameOverUI] VictoryPanel parent:', this.victoryPanel.parent?.name);
            console.log('[GameOverUI] VictoryPanel siblingIndex:', this.victoryPanel.getSiblingIndex());
            
            // Check if parent node is active
            console.log('[GameOverUI] Parent node (this.node) active:', this.node.active);
            
            // Try to bring to front
            this.node.setSiblingIndex(999);
            console.log('[GameOverUI] Moved parent to front, new index:', this.node.getSiblingIndex());
        } else {
            console.warn('[GameOverUI] VictoryPanel is null!');
        }
    }

    /**
     * 显示失败界面
     */
    showDefeat(data: {
        score: number,
        coins: number,
        maxCombo: number,
        stage: number
    }) {
        console.log('[GameOverUI] Showing defeat', data);

        // 隐藏胜利面板
        if (this.victoryPanel) {
            this.victoryPanel.active = false;
        }

        // 更新失败信息
        if (this.defeatScoreLabel) {
            this.defeatScoreLabel.string = `分数: ${data.score}`;
        }
        if (this.defeatCoinsLabel) {
            this.defeatCoinsLabel.string = `金币: ${data.coins}`;
        }
        if (this.defeatComboLabel) {
            this.defeatComboLabel.string = `最高连击: ${data.maxCombo}`;
        }

        // 显示失败面板
        if (this.defeatPanel) {
            this.defeatPanel.active = true;
        }
    }

    /**
     * 隐藏所有面板
     */
    hide() {
        if (this.victoryPanel) {
            this.victoryPanel.active = false;
        }
        if (this.defeatPanel) {
            this.defeatPanel.active = false;
        }
        console.log('[GameOverUI] Hidden');
    }

    /**
     * 设置回调函数
     */
    setCallbacks(callbacks: {
        onContinue?: Function,
        onRetry?: Function,
        onMenu?: Function
    }) {
        this.onContinueCallback = callbacks.onContinue || null;
        this.onRetryCallback = callbacks.onRetry || null;
        this.onMenuCallback = callbacks.onMenu || null;
        console.log('[GameOverUI] Callbacks set');
    }

    /**
     * 继续按钮点击（胜利后选择词条）
     */
    private onContinue() {
        console.log('[GameOverUI] Continue clicked');
        if (this.onContinueCallback) {
            this.onContinueCallback();
        }
    }

    /**
     * 重试按钮点击（失败后重新开始）
     */
    private onRetry() {
        console.log('[GameOverUI] Retry clicked');
        if (this.onRetryCallback) {
            this.onRetryCallback();
        }
    }

    /**
     * 返回主菜单按钮点击
     */
    private onMenu() {
        console.log('[GameOverUI] Menu clicked');
        if (this.onMenuCallback) {
            this.onMenuCallback();
        }
    }
}
