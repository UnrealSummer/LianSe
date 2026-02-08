import { _decorator, Component, Node, input, Input, KeyCode, EventKeyboard } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 游戏状态枚举
 */
export enum GameState {
    MENU = 'menu',           // 主菜单
    READY = 'ready',         // 准备开始（显示关卡信息）
    PLAYING = 'playing',     // 游戏进行中
    PAUSED = 'paused',       // 暂停
    WIN = 'win',             // 胜利
    LOSE = 'lose',           // 失败
    MODIFIER_SELECT = 'modifier_select'  // 选择词条
}

/**
 * 游戏流程控制器
 * 管理游戏状态、场景切换、暂停等
 */
@ccclass('GameFlowController')
export class GameFlowController extends Component {
    private static _instance: GameFlowController = null;

    @property(Node)
    pausePanel: Node = null;

    @property(Node)
    gameOverPanel: Node = null;

    @property(Node)
    modifierSelectPanel: Node = null;

    private currentState: GameState = GameState.MENU;
    private previousState: GameState = GameState.MENU;
    private gameOverUI: any = null;  // GameOverUI component

    // 游戏数据
    private currentLevel: number = 1;
    private currentStage: number = 1;
    private score: number = 0;
    private coins: number = 0;
    private maxCombo: number = 0;

    /**
     * 单例
     */
    public static get instance(): GameFlowController {
        return this._instance;
    }

    onLoad() {
        if (GameFlowController._instance) {
            console.warn('[GameFlowController] Instance already exists, destroying duplicate');
            this.node.destroy();
            return;
        }

        GameFlowController._instance = this;
        console.log('[GameFlowController] Instance created');
    }

    start() {
        this.initPanels();
        this.initGameOverUI();
        this.registerKeyboardEvents();
        console.log('[GameFlowController] Initialized');
    }

    onDestroy() {
        if (GameFlowController._instance === this) {
            GameFlowController._instance = null;
        }
        
        // 移除键盘监听
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    /**
     * 初始化面板
     */
    private initPanels() {
        // 隐藏所有面板
        if (this.pausePanel) {
            this.pausePanel.active = false;
        }
        if (this.gameOverPanel) {
            this.gameOverPanel.active = false;
        }
        if (this.modifierSelectPanel) {
            this.modifierSelectPanel.active = false;
        }
    }

    /**
     * 初始化GameOverUI
     */
    private initGameOverUI() {
        if (this.gameOverPanel) {
            this.gameOverUI = this.gameOverPanel.getComponent('GameOverUI');
            if (this.gameOverUI) {
                this.gameOverUI.setCallbacks({
                    onContinue: this.onVictoryContinue.bind(this),
                    onRetry: this.onDefeatRetry.bind(this),
                    onMenu: this.returnToMenu.bind(this)
                });
                console.log('[GameFlowController] GameOverUI initialized');
            }
        }
    }

    /**
     * 注册键盘事件
     */
    private registerKeyboardEvents() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        console.log('[GameFlowController] Keyboard events registered (ESC to pause)');
    }

    /**
     * 键盘按下事件
     */
    private onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.ESCAPE:
                // ESC键切换暂停
                if (this.currentState === GameState.PLAYING) {
                    this.changeState(GameState.PAUSED);
                } else if (this.currentState === GameState.PAUSED) {
                    this.resumeGame();
                }
                break;
        }
    }

    /**
     * 获取当前状态
     */
    public getState(): GameState {
        return this.currentState;
    }

    /**
     * 改变游戏状态
     */
    public changeState(newState: GameState) {
        if (this.currentState === newState) {
            return;
        }

        console.log(`[GameFlowController] State change: ${this.currentState} -> ${newState}`);

        this.previousState = this.currentState;
        this.currentState = newState;

        // 触发状态改变事件
        this.node.emit('state-changed', newState, this.previousState);

        // 处理状态切换
        this.handleStateChange(newState);
    }

    /**
     * 处理状态切换
     */
    private handleStateChange(newState: GameState) {
        switch (newState) {
            case GameState.READY:
                this.onGameReady();
                break;

            case GameState.PLAYING:
                this.onGameStart();
                break;

            case GameState.PAUSED:
                this.onGamePause();
                break;

            case GameState.WIN:
                this.onGameWin();
                break;

            case GameState.LOSE:
                this.onGameLose();
                break;

            case GameState.MODIFIER_SELECT:
                this.onModifierSelect();
                break;
        }
    }

    /**
     * 游戏准备
     */
    private onGameReady() {
        console.log('[GameFlowController] Game ready');
        
        // 显示关卡信息
        // TODO: 显示"关卡 X-X"，倒计时3秒后开始

        // 自动开始游戏（临时）
        this.scheduleOnce(() => {
            this.changeState(GameState.PLAYING);
        }, 1.0);
    }

    /**
     * 游戏开始
     */
    private onGameStart() {
        console.log('[GameFlowController] Game started');
        
        // 隐藏所有面板
        this.initPanels();

        // 恢复游戏时间
        // director.resume();

        // 通知其他系统游戏开始
        this.node.emit('game-started');
    }

    /**
     * 游戏暂停
     */
    private onGamePause() {
        console.log('[GameFlowController] Game paused');
        
        // 显示暂停面板
        if (this.pausePanel) {
            this.pausePanel.active = true;
        }

        // 暂停游戏时间
        // director.pause();

        // 通知其他系统游戏暂停
        this.node.emit('game-paused');
    }

    /**
     * 游戏胜利
     */
    private onGameWin() {
        console.log('[GameFlowController] Game win!');
        
        // 计算奖励
        const reward = 100 + (this.currentStage * 20);
        this.coins += reward;
        
        // 通知其他系统游戏胜利
        this.node.emit('game-win', {
            level: this.currentLevel,
            stage: this.currentStage,
            score: this.score,
            coins: this.coins,
            reward: reward
        });
        
        // 直接进入词条选择，不显示胜利界面
        console.log('[GameFlowController] Entering modifier selection...');
        this.changeState(GameState.MODIFIER_SELECT);
    }

    /**
     * 游戏失败
     */
    /**
     * 游戏失败
     */
    private onGameLose() {
        console.log('[GameFlowController] Game lose');
        
        // 先激活GameOverPanel
        if (this.gameOverPanel) {
            this.gameOverPanel.active = true;
        }
        
        // 然后显示失败面板
        if (this.gameOverUI && this.gameOverUI.showDefeat) {
            this.gameOverUI.showDefeat({
                score: this.score,
                coins: this.coins,
                maxCombo: this.maxCombo,
                stage: this.currentStage
            });
        }

        // 通知其他系统游戏失败
        this.node.emit('game-lose', {
            level: this.currentLevel,
            stage: this.currentStage,
            score: this.score,
            coins: this.coins
        });
    }

    /**
     * 词条选择
     */
    private onModifierSelect() {
        console.log('[GameFlowController] Modifier select');
        
        // 显示词条选择面板
        if (this.modifierSelectPanel) {
            this.modifierSelectPanel.active = true;
        }

        // 通知GameCore显示词条选择（临时方案）
        // TODO: 将词条选择逻辑完全移到GameFlowController
        this.node.emit('modifier-select-start');
        
        // 临时：直接进入下一关（跳过词条选择）
        console.log('[GameFlowController] Skipping modifier selection for now...');
        setTimeout(() => {
            this.onModifierSelected();
        }, 1000);
    }

    /**
     * 继续游戏（从暂停恢复）
     */
    public resumeGame() {
        if (this.currentState === GameState.PAUSED) {
            this.changeState(this.previousState);
        }
    }

    /**
     * 重新开始游戏
     */
    public restartGame() {
        console.log('[GameFlowController] Restart game');
        
        // 重置数据
        this.score = 0;
        
        // 重新开始
        this.changeState(GameState.READY);
        
        // 通知其他系统重新开始
        this.node.emit('game-restart');
    }

    /**
     * 下一关
     */
    public nextLevel() {
        console.log('[GameFlowController] Next level');
        
        // 增加关卡
        this.currentStage++;
        if (this.currentStage > 10) {
            this.currentStage = 1;
            this.currentLevel++;
        }

        // 显示词条选择
        this.changeState(GameState.MODIFIER_SELECT);
    }

    /**
     * 词条选择完成
     */
    public onModifierSelected() {
        console.log('[GameFlowController] Modifier selected');
        
        // 开始下一关
        this.changeState(GameState.READY);
    }

    /**
     * 设置关卡
     */
    public setLevel(level: number, stage: number) {
        this.currentLevel = level;
        this.currentStage = stage;
    }

    /**
     * 获取关卡信息
     */
    public getLevelInfo() {
        return {
            level: this.currentLevel,
            stage: this.currentStage
        };
    }

    /**
     * 添加分数
     */
    public addScore(points: number) {
        this.score += points;
        this.node.emit('score-changed', this.score);
    }

    /**
     * 添加金币
     */
    public addCoins(amount: number) {
        this.coins += amount;
        this.node.emit('coins-changed', this.coins);
    }

    /**
     * 获取分数
     */
    public getScore(): number {
        return this.score;
    }

    /**
     * 获取金币
     */
    public getCoins(): number {
        return this.coins;
    }

    /**
     * 检查是否在游戏中
     */
    public isPlaying(): boolean {
        return this.currentState === GameState.PLAYING;
    }

    /**
     * 检查是否暂停
     */
    public isPaused(): boolean {
        return this.currentState === GameState.PAUSED;
    }

    /**
     * 检查是否游戏结束
     */
    public isGameOver(): boolean {
        return this.currentState === GameState.WIN || this.currentState === GameState.LOSE;
    }

    /**
     * 胜利后继续（选择词条）
     */
    private onVictoryContinue() {
        console.log('[GameFlowController] Victory continue - selecting modifier');
        this.changeState(GameState.MODIFIER_SELECT);
    }

    /**
     * 失败后重试
     */
    private onDefeatRetry() {
        console.log('[GameFlowController] Defeat retry - restarting game');
        this.restartGame();
    }

    /**
     * 返回主菜单
     */
    private returnToMenu() {
        console.log('[GameFlowController] Returning to main menu');
        this.changeState(GameState.MENU);
        // TODO: 加载主菜单场景
        // director.loadScene('MainMenu');
    }

    /**
     * 更新最高连击
     */
    public updateMaxCombo(combo: number) {
        if (combo > this.maxCombo) {
            this.maxCombo = combo;
        }
    }
}

