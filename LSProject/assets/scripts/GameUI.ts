import { _decorator, Component, Node, Label, Sprite, Button } from 'cc';
import { GameFlowController, GameState } from './GameFlowController';
const { ccclass, property } = _decorator;

/**
 * 游戏主界面UI管理器
 * 管理顶部栏、敌人区域、底部栏等UI元素
 */
@ccclass('GameUI')
export class GameUI extends Component {
    // ===== 顶部栏 =====
    @property(Label)
    coinLabel: Label = null;

    @property(Label)
    levelLabel: Label = null;

    @property(Label)
    timeLabel: Label = null;

    @property(Button)
    settingsButton: Button = null;

    // ===== 敌人区域 =====
    @property(Node)
    enemySprite: Node = null;

    @property(Sprite)
    hpBarSprite: Sprite = null;

    @property(Label)
    enemyNameLabel: Label = null;

    @property(Label)
    enemyTypeLabel: Label = null;

    // ===== 底部栏 =====
    @property(Button)
    skill1Button: Button = null;

    @property(Button)
    skill2Button: Button = null;

    @property(Button)
    skill3Button: Button = null;

    @property(Button)
    pauseButton: Button = null;

    // ===== 私有变量 =====
    private currentCoins: number = 0;
    private currentLevel: string = "1-1";
    private maxHP: number = 100;
    private currentHP: number = 100;

    start() {
        this.initUI();
        this.bindEvents();
    }

    /**
     * 初始化UI
     */
    initUI() {
        // 初始化金币显示
        this.updateCoins(this.currentCoins);

        // 初始化关卡显示
        this.updateLevel(this.currentLevel);

        // 初始化血条
        this.updateHP(this.currentHP, this.maxHP);

        console.log('[GameUI] UI initialized');
    }

    /**
     * 绑定按钮事件
     */
    bindEvents() {
        // 设置按钮
        if (this.settingsButton) {
            this.settingsButton.node.on(Button.EventType.CLICK, this.onSettingsClick, this);
        }

        // 技能按钮
        if (this.skill1Button) {
            this.skill1Button.node.on(Button.EventType.CLICK, () => this.onSkillClick(1), this);
        }
        if (this.skill2Button) {
            this.skill2Button.node.on(Button.EventType.CLICK, () => this.onSkillClick(2), this);
        }
        if (this.skill3Button) {
            this.skill3Button.node.on(Button.EventType.CLICK, () => this.onSkillClick(3), this);
        }

        // 暂停按钮
        if (this.pauseButton) {
            this.pauseButton.node.on(Button.EventType.CLICK, this.onPauseClick, this);
        }

        console.log('[GameUI] Events bound');
    }

    /**
     * 更新金币显示
     */
    updateCoins(coins: number) {
        this.currentCoins = coins;
        if (this.coinLabel) {
            this.coinLabel.string = coins.toString();
        }
    }

    /**
     * 更新关卡显示
     */
    updateLevel(level: string) {
        this.currentLevel = level;
        if (this.levelLabel) {
            this.levelLabel.string = `关卡 ${level}`;
        }
    }

    /**
     * 更新时间显示
     */
    updateTime(timeLeft: number) {
        if (this.timeLabel) {
            const totalSecs = Math.ceil(timeLeft);
            const minutes = Math.floor(totalSecs / 60);
            const secs = totalSecs % 60;
            this.timeLabel.string = `${minutes}:${secs.toString().padStart(2, '0')}`;
            
            // 时间警告效果（剩余10秒）
            if (timeLeft <= 10) {
                this.timeLabel.node.setScale(1.2, 1.2, 1);
                // this.timeLabel.color = new Color(255, 0, 0);
            } else {
                this.timeLabel.node.setScale(1, 1, 1);
                // this.timeLabel.color = new Color(255, 255, 255);
            }
        }
    }

    /**
     * 更新血条
     */
    updateHP(current: number, max: number) {
        this.currentHP = current;
        this.maxHP = max;

        if (this.hpBarSprite) {
            const ratio = Math.max(0, Math.min(1, current / max));
            this.hpBarSprite.fillRange = ratio;
        }
    }

    /**
     * 更新敌人信息
     */
    updateEnemyInfo(name: string, type: string) {
        if (this.enemyNameLabel) {
            this.enemyNameLabel.string = name;
        }
        if (this.enemyTypeLabel) {
            this.enemyTypeLabel.string = type;
        }
    }

    /**
     * 设置按钮点击
     */
    onSettingsClick() {
        console.log('[GameUI] Settings clicked');
        // TODO: 打开设置界面
        this.node.emit('settings-clicked');
    }

    /**
     * 技能按钮点击
     */
    onSkillClick(skillIndex: number) {
        console.log(`[GameUI] Skill ${skillIndex} clicked`);
        // TODO: 使用技能
        this.node.emit('skill-clicked', skillIndex);
    }

    /**
     * 暂停按钮点击
     */
    onPauseClick() {
        console.log('[GameUI] Pause clicked');
        
        // 切换到暂停状态
        const flowController = GameFlowController.instance;
        if (flowController) {
            flowController.changeState(GameState.PAUSED);
        }
    }

    /**
     * 设置技能冷却
     */
    setSkillCooldown(skillIndex: number, cooldown: number) {
        let button: Button = null;
        switch (skillIndex) {
            case 1: button = this.skill1Button; break;
            case 2: button = this.skill2Button; break;
            case 3: button = this.skill3Button; break;
        }

        if (button) {
            button.interactable = cooldown <= 0;
            // TODO: 显示冷却时间
        }
    }

    /**
     * 显示/隐藏敌人区域
     */
    setEnemyVisible(visible: boolean) {
        if (this.enemySprite) {
            this.enemySprite.active = visible;
        }
    }
}
