import { _decorator, Component, sys } from 'cc';
const { ccclass } = _decorator;

/**
 * 游戏数据
 */
export interface GameData {
    maxStage: number;           // 最高关卡
    totalCoins: number;         // 总金币
    totalMoves: number;         // 总移动次数
    maxCombo: number;           // 最大连击
    totalPlayTime: number;      // 总游戏时间（秒）
    achievements: string[];     // 成就列表
}

/**
 * 数据管理器 - 负责数据持久化
 */
@ccclass('DataManager')
export class DataManager extends Component {
    private static instance: DataManager = null;
    private static readonly SAVE_KEY = 'LianSeGameData';
    
    private gameData: GameData = {
        maxStage: 1,
        totalCoins: 0,
        totalMoves: 0,
        maxCombo: 0,
        totalPlayTime: 0,
        achievements: []
    };

    onLoad() {
        // Singleton
        if (DataManager.instance) {
            this.destroy();
            return;
        }
        DataManager.instance = this;
        
        // Load data
        this.loadData();
        
        console.log('[DataManager] Initialized');
    }

    /**
     * 获取实例
     */
    static getInstance(): DataManager {
        return DataManager.instance;
    }

    /**
     * 加载数据
     */
    loadData(): void {
        try {
            const dataStr = sys.localStorage.getItem(DataManager.SAVE_KEY);
            if (dataStr) {
                this.gameData = JSON.parse(dataStr);
                console.log('[DataManager] Data loaded:', this.gameData);
            } else {
                console.log('[DataManager] No save data found, using defaults');
            }
        } catch (error) {
            console.error('[DataManager] Failed to load data:', error);
        }
    }

    /**
     * 保存数据
     */
    saveData(): void {
        try {
            const dataStr = JSON.stringify(this.gameData);
            sys.localStorage.setItem(DataManager.SAVE_KEY, dataStr);
            console.log('[DataManager] Data saved:', this.gameData);
        } catch (error) {
            console.error('[DataManager] Failed to save data:', error);
        }
    }

    /**
     * 清空数据
     */
    clearData(): void {
        this.gameData = {
            maxStage: 1,
            totalCoins: 0,
            totalMoves: 0,
            maxCombo: 0,
            totalPlayTime: 0,
            achievements: []
        };
        sys.localStorage.removeItem(DataManager.SAVE_KEY);
        console.log('[DataManager] Data cleared');
    }

    // ========== Getters ==========

    getMaxStage(): number {
        return this.gameData.maxStage;
    }

    getTotalCoins(): number {
        return this.gameData.totalCoins;
    }

    getTotalMoves(): number {
        return this.gameData.totalMoves;
    }

    getMaxCombo(): number {
        return this.gameData.maxCombo;
    }

    getTotalPlayTime(): number {
        return this.gameData.totalPlayTime;
    }

    getAchievements(): string[] {
        return this.gameData.achievements;
    }

    // ========== Setters ==========

    /**
     * 更新最高关卡
     */
    updateMaxStage(stage: number): void {
        if (stage > this.gameData.maxStage) {
            this.gameData.maxStage = stage;
            this.saveData();
            console.log(`[DataManager] Max stage updated: ${stage}`);
        }
    }

    /**
     * 添加金币
     */
    addCoins(amount: number): void {
        this.gameData.totalCoins += amount;
        this.saveData();
    }

    /**
     * 消费金币
     */
    spendCoins(amount: number): boolean {
        if (this.gameData.totalCoins >= amount) {
            this.gameData.totalCoins -= amount;
            this.saveData();
            return true;
        }
        return false;
    }

    /**
     * 添加移动次数
     */
    addMoves(count: number): void {
        this.gameData.totalMoves += count;
        this.saveData();
    }

    /**
     * 更新最大连击
     */
    updateMaxCombo(combo: number): void {
        if (combo > this.gameData.maxCombo) {
            this.gameData.maxCombo = combo;
            this.saveData();
            console.log(`[DataManager] Max combo updated: ${combo}`);
        }
    }

    /**
     * 添加游戏时间
     */
    addPlayTime(seconds: number): void {
        this.gameData.totalPlayTime += seconds;
        this.saveData();
    }

    /**
     * 解锁成就
     */
    unlockAchievement(achievementId: string): void {
        if (!this.gameData.achievements.includes(achievementId)) {
            this.gameData.achievements.push(achievementId);
            this.saveData();
            console.log(`[DataManager] Achievement unlocked: ${achievementId}`);
        }
    }

    /**
     * 检查成就是否解锁
     */
    hasAchievement(achievementId: string): boolean {
        return this.gameData.achievements.includes(achievementId);
    }
}
