import { _decorator, Component, Node, Button, director } from 'cc';
import { GameFlowController } from './GameFlowController';
const { ccclass, property } = _decorator;

/**
 * 暂停菜单UI
 */
@ccclass('PauseMenuUI')
export class PauseMenuUI extends Component {
    @property(Button)
    resumeButton: Button = null;

    @property(Button)
    restartButton: Button = null;

    @property(Button)
    mainMenuButton: Button = null;

    @property(Button)
    settingsButton: Button = null;

    start() {
        this.bindEvents();
    }

    /**
     * 绑定事件
     */
    private bindEvents() {
        if (this.resumeButton) {
            this.resumeButton.node.on(Button.EventType.CLICK, this.onResume, this);
        }

        if (this.restartButton) {
            this.restartButton.node.on(Button.EventType.CLICK, this.onRestart, this);
        }

        if (this.mainMenuButton) {
            this.mainMenuButton.node.on(Button.EventType.CLICK, this.onMainMenu, this);
        }

        if (this.settingsButton) {
            this.settingsButton.node.on(Button.EventType.CLICK, this.onSettings, this);
        }
    }

    /**
     * 继续游戏
     */
    private onResume() {
        console.log('[PauseMenuUI] Resume clicked');
        
        const flowController = GameFlowController.instance;
        if (flowController) {
            flowController.resumeGame();
        }
    }

    /**
     * 重新开始
     */
    private onRestart() {
        console.log('[PauseMenuUI] Restart clicked');
        
        const flowController = GameFlowController.instance;
        if (flowController) {
            flowController.restartGame();
        }
    }

    /**
     * 返回主菜单
     */
    private onMainMenu() {
        console.log('[PauseMenuUI] Main menu clicked');
        
        // 切换到主菜单场景
        director.loadScene('MainMenu', (err) => {
            if (err) {
                console.error('[PauseMenuUI] Failed to load MainMenu:', err);
            }
        });
    }

    /**
     * 设置
     */
    private onSettings() {
        console.log('[PauseMenuUI] Settings clicked');
        
        // TODO: 打开设置面板
    }
}
