import { _decorator, Component, Node, Button } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 暂停界面
 */
@ccclass('PauseUI')
export class PauseUI extends Component {
    @property({ type: Node })
    panel: Node = null; // 暂停面板
    
    @property({ type: Button })
    resumeButton: Button = null; // 继续游戏
    
    @property({ type: Button })
    restartButton: Button = null; // 重新开始
    
    @property({ type: Button })
    settingsButton: Button = null; // 设置（可选）
    
    @property({ type: Button })
    quitButton: Button = null; // 退出游戏（可选）
    
    private onResumeCallback: (() => void) | null = null;
    private onRestartCallback: (() => void) | null = null;
    private onQuitCallback: (() => void) | null = null;
    
    start() {
        this.hide();
        
        // 绑定按钮事件
        if (this.resumeButton) {
            this.resumeButton.node.on(Button.EventType.CLICK, this.onResumeClicked, this);
        }
        
        if (this.restartButton) {
            this.restartButton.node.on(Button.EventType.CLICK, this.onRestartClicked, this);
        }
        
        if (this.settingsButton) {
            this.settingsButton.node.on(Button.EventType.CLICK, this.onSettingsClicked, this);
        }
        
        if (this.quitButton) {
            this.quitButton.node.on(Button.EventType.CLICK, this.onQuitClicked, this);
        }
    }
    
    /**
     * 显示暂停界面
     */
    show(onResume?: () => void, onRestart?: () => void, onQuit?: () => void): void {
        this.onResumeCallback = onResume || null;
        this.onRestartCallback = onRestart || null;
        this.onQuitCallback = onQuit || null;
        
        if (this.panel) {
            this.panel.active = true;
        }
        
        console.log('[PauseUI] 暂停界面已显示');
    }
    
    /**
     * 隐藏暂停界面
     */
    hide(): void {
        if (this.panel) {
            this.panel.active = false;
        }
    }
    
    /**
     * 继续游戏
     */
    private onResumeClicked(): void {
        console.log('[PauseUI] 继续游戏');
        this.hide();
        
        if (this.onResumeCallback) {
            this.onResumeCallback();
        }
    }
    
    /**
     * 重新开始
     */
    private onRestartClicked(): void {
        console.log('[PauseUI] 重新开始');
        this.hide();
        
        if (this.onRestartCallback) {
            this.onRestartCallback();
        }
    }
    
    /**
     * 设置
     */
    private onSettingsClicked(): void {
        console.log('[PauseUI] 打开设置');
        // TODO: 打开设置界面
    }
    
    /**
     * 退出游戏
     */
    private onQuitClicked(): void {
        console.log('[PauseUI] 退出游戏');
        this.hide();
        
        if (this.onQuitCallback) {
            this.onQuitCallback();
        }
    }
}
