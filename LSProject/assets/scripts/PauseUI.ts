import { _decorator, Component, Node, Button, Label } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 暂停UI
 */
@ccclass('PauseUI')
export class PauseUI extends Component {
    @property(Button)
    resumeButton: Button = null;

    @property(Button)
    restartButton: Button = null;

    @property(Button)
    quitButton: Button = null;

    private onResumeCallback: () => void = null;
    private onRestartCallback: () => void = null;
    private onQuitCallback: () => void = null;

    start() {
        // Hide by default
        this.hide();

        // Setup button events
        if (this.resumeButton) {
            this.resumeButton.node.on(Node.EventType.TOUCH_END, () => {
                this.onResumeClicked();
            });
        }

        if (this.restartButton) {
            this.restartButton.node.on(Node.EventType.TOUCH_END, () => {
                this.onRestartClicked();
            });
        }

        if (this.quitButton) {
            this.quitButton.node.on(Node.EventType.TOUCH_END, () => {
                this.onQuitClicked();
            });
        }
    }

    /**
     * 显示暂停界面
     */
    show(onResume: () => void, onRestart: () => void, onQuit?: () => void): void {
        this.onResumeCallback = onResume;
        this.onRestartCallback = onRestart;
        this.onQuitCallback = onQuit;

        this.node.active = true;
        console.log('[PauseUI] Showing pause menu');
    }

    /**
     * 隐藏暂停界面
     */
    hide(): void {
        this.node.active = false;
    }

    /**
     * 继续按钮点击
     */
    private onResumeClicked(): void {
        console.log('[PauseUI] Resume clicked');
        this.hide();
        if (this.onResumeCallback) {
            this.onResumeCallback();
        }
    }

    /**
     * 重新开始按钮点击
     */
    private onRestartClicked(): void {
        console.log('[PauseUI] Restart clicked');
        this.hide();
        if (this.onRestartCallback) {
            this.onRestartCallback();
        }
    }

    /**
     * 退出按钮点击
     */
    private onQuitClicked(): void {
        console.log('[PauseUI] Quit clicked');
        this.hide();
        if (this.onQuitCallback) {
            this.onQuitCallback();
        }
    }
}
