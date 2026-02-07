import { _decorator, Component, Node, Button, Label, director } from 'cc';
import { DataManager } from './DataManager';
const { ccclass, property } = _decorator;

/**
 * 主菜单界面
 */
@ccclass('MainMenuUI')
export class MainMenuUI extends Component {
    @property({ type: Label })
    titleLabel: Label = null; // 游戏标题
    
    @property({ type: Label })
    bestStageLabel: Label = null; // 最高关卡
    
    @property({ type: Label })
    bestScoreLabel: Label = null; // 最高分数
    
    @property({ type: Label })
    totalGamesLabel: Label = null; // 总游戏次数
    
    @property({ type: Button })
    startButton: Button = null; // 开始游戏
    
    @property({ type: Button })
    settingsButton: Button = null; // 设置
    
    @property({ type: Button })
    quitButton: Button = null; // 退出游戏（可选）
    
    @property({ type: Node })
    settingsPanel: Node = null; // 设置面板（可选）
    
    start() {
        // 显示历史最佳
        this.showHistory();
        
        // 绑定按钮事件
        if (this.startButton) {
            this.startButton.node.on(Button.EventType.CLICK, this.onStartClicked, this);
        }
        
        if (this.settingsButton) {
            this.settingsButton.node.on(Button.EventType.CLICK, this.onSettingsClicked, this);
        }
        
        if (this.quitButton) {
            this.quitButton.node.on(Button.EventType.CLICK, this.onQuitClicked, this);
        }
    }
    
    /**
     * 显示历史记录
     */
    private showHistory(): void {
        const dataManager = DataManager.getInstance();
        if (!dataManager) {
            console.warn('[MainMenuUI] DataManager 未找到');
            return;
        }
        
        const data = dataManager.getPlayerData();
        
        // 显示标题
        if (this.titleLabel) {
            this.titleLabel.string = '炼色';
        }
        
        // 显示最高关卡
        if (this.bestStageLabel) {
            if (data.highestStage > 0) {
                this.bestStageLabel.string = `最高关卡: 第 ${data.highestStage} 关`;
            } else {
                this.bestStageLabel.string = '最高关卡: --';
            }
        }
        
        // 显示最高分数
        if (this.bestScoreLabel) {
            if (data.highestScore > 0) {
                this.bestScoreLabel.string = `最高分数: ${data.highestScore}`;
            } else {
                this.bestScoreLabel.string = '最高分数: --';
            }
        }
        
        // 显示总游戏次数
        if (this.totalGamesLabel) {
            this.totalGamesLabel.string = `游戏次数: ${data.totalGames}`;
        }
        
        console.log('[MainMenuUI] 历史记录已显示');
    }
    
    /**
     * 开始游戏
     */
    private onStartClicked(): void {
        console.log('[MainMenuUI] 开始游戏');
        
        // 加载游戏场景
        director.loadScene('Game', (err) => {
            if (err) {
                console.error('[MainMenuUI] 加载游戏场景失败:', err);
            } else {
                console.log('[MainMenuUI] 游戏场景已加载');
            }
        });
    }
    
    /**
     * 设置
     */
    private onSettingsClicked(): void {
        console.log('[MainMenuUI] 打开设置');
        
        // 显示设置面板
        if (this.settingsPanel) {
            this.settingsPanel.active = true;
        }
    }
    
    /**
     * 退出游戏
     */
    private onQuitClicked(): void {
        console.log('[MainMenuUI] 退出游戏');
        
        // 在浏览器中无法真正退出，只能关闭窗口
        // 在原生平台可以调用 game.end()
        if (confirm('确定要退出游戏吗？')) {
            // game.end(); // 原生平台
            window.close(); // 浏览器
        }
    }
}
