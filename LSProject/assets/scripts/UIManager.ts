import { _decorator, Component, Button } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

/**
 * UI管理器 - 处理按钮点击等UI交互
 */
@ccclass('UIManager')
export class UIManager extends Component {
    @property(GameManager)
    gameManager: GameManager = null;

    @property(Button)
    restartButton: Button = null;

    start() {
        // 绑定重新开始按钮
        if (this.restartButton) {
            this.restartButton.node.on(Button.EventType.CLICK, this.onRestartClick, this);
        }
    }

    /**
     * 重新开始按钮点击
     */
    onRestartClick() {
        console.log('重新开始游戏');
        // TODO: 重新加载场景或重置游戏状态
        if (this.gameManager) {
            // 暂时简单重置
            this.gameManager.initLevel();
        }
    }
}
