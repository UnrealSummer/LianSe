import { _decorator, Component, Node, Button, director, sys } from 'cc';
import { LeaderboardUI } from './LeaderboardUI';
const { ccclass, property } = _decorator;

/**
 * 主菜单UI管理器
 */
@ccclass('MainMenuUI')
export class MainMenuUI extends Component {
    @property(Button)
    startButton: Button = null;

    @property(Button)
    leaderboardButton: Button = null;

    @property(Button)
    settingsButton: Button = null;

    @property(Button)
    exitButton: Button = null;

    @property(Node)
    titleNode: Node = null;

    @property(LeaderboardUI)
    leaderboardUI: LeaderboardUI = null;

    start() {
        this.initUI();
        this.bindEvents();
        console.log('[MainMenuUI] Main menu initialized');
    }

    /**
     * 初始化UI
     */
    initUI() {
        // 可以在这里添加动画效果
        // 比如标题淡入、按钮弹出等
    }

    /**
     * 绑定按钮事件
     */
    bindEvents() {
        if (this.startButton) {
            this.startButton.node.on(Button.EventType.CLICK, this.onStartGame, this);
        }

        if (this.leaderboardButton) {
            this.leaderboardButton.node.on(Button.EventType.CLICK, this.onLeaderboard, this);
        }

        if (this.settingsButton) {
            this.settingsButton.node.on(Button.EventType.CLICK, this.onSettings, this);
        }

        if (this.exitButton) {
            this.exitButton.node.on(Button.EventType.CLICK, this.onExit, this);
        }
    }

    /**
     * 开始游戏
     */
    onStartGame() {
        console.log('[MainMenuUI] Start game clicked');
        
        // 播放点击音效
        // AudioManager.instance?.playSound('button_click');
        
        // 切换到游戏场景
        director.loadScene('Main', (err) => {
            if (err) {
                console.error('[MainMenuUI] Failed to load Main scene:', err);
            } else {
                console.log('[MainMenuUI] Main scene loaded');
            }
        });
    }

    /**
     * 打开排行榜
     */
    onLeaderboard() {
        console.log('[MainMenuUI] Leaderboard clicked');
        
        if (this.leaderboardUI) {
            this.leaderboardUI.showLeaderboard();
        } else {
            console.error('[MainMenuUI] LeaderboardUI not set');
        }
    }

    /**
     * 打开设置
     */
    onSettings() {
        console.log('[MainMenuUI] Settings clicked');
        
        // TODO: 打开设置界面
        // 可以是弹出面板或切换场景
        
        // 临时提示
        console.log('[MainMenuUI] Settings not implemented yet');
    }

    /**
     * 退出游戏
     */
    onExit() {
        console.log('[MainMenuUI] Exit clicked');
        
        // 在浏览器中无法真正退出，只能关闭标签页
        // 在原生平台可以退出
        if (sys.isNative) {
            director.end();
        } else {
            console.log('[MainMenuUI] Cannot exit in browser');
            // 可以显示提示："请关闭浏览器标签页"
        }
    }

    /**
     * 显示关于信息
     */
    showAbout() {
        console.log('[MainMenuUI] About clicked');
        // TODO: 显示关于信息
    }

    /**
     * 显示教程
     */
    showTutorial() {
        console.log('[MainMenuUI] Tutorial clicked');
        // TODO: 显示教程
    }
}
