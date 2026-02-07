import { _decorator, Component, sys } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 玩家数据
 */
export interface PlayerData {
    highestStage: number;      // 历史最高关卡
    highestScore: number;      // 历史最高分数
    totalGames: number;        // 总游戏次数
    totalGold: number;         // 累计金币
    lastPlayTime: number;      // 最后游戏时间
}

/**
 * 数据管理器 - 负责本地存储
 */
@ccclass('DataManager')
export class DataManager extends Component {
    private static readonly STORAGE_KEY = 'lianse_player_data';
    private static instance: DataManager = null;
    
    private playerData: PlayerData = {
        highestStage: 0,
        highestScore: 0,
        totalGames: 0,
        totalGold: 0,
        lastPlayTime: 0
    };
    
    onLoad() {
        if (DataManager.instance) {
            this.destroy();
            return;
        }
        DataManager.instance = this;
        
        // 加载数据
        this.loadData();
        console.log('[DataManager] 数据已加载:', this.playerData);
    }
    
    /**
     * 获取单例
     */
    static getInstance(): DataManager {
        return DataManager.instance;
    }
    
    /**
     * 加载数据
     */
    private loadData(): void {
        try {
            const dataStr = sys.localStorage.getItem(DataManager.STORAGE_KEY);
            if (dataStr) {
                this.playerData = JSON.parse(dataStr);
                console.log('[DataManager] 从本地加载数据成功');
            } else {
                console.log('[DataManager] 没有本地数据，使用默认值');
            }
        } catch (error) {
            console.error('[DataManager] 加载数据失败:', error);
        }
    }
    
    /**
     * 保存数据
     */
    private saveData(): void {
        try {
            const dataStr = JSON.stringify(this.playerData);
            sys.localStorage.setItem(DataManager.STORAGE_KEY, dataStr);
            console.log('[DataManager] 数据已保存');
        } catch (error) {
            console.error('[DataManager] 保存数据失败:', error);
        }
    }
    
    /**
     * 获取玩家数据
     */
    getPlayerData(): PlayerData {
        return { ...this.playerData };
    }
    
    /**
     * 游戏结束，更新数据
     */
    onGameEnd(stage: number, score: number, gold: number): void {
        // 更新最高记录
        if (stage > this.playerData.highestStage) {
            this.playerData.highestStage = stage;
            console.log(`[DataManager] 新纪录！最高关卡: ${stage}`);
        }
        
        if (score > this.playerData.highestScore) {
            this.playerData.highestScore = score;
            console.log(`[DataManager] 新纪录！最高分数: ${score}`);
        }
        
        // 累计数据
        this.playerData.totalGames++;
        this.playerData.totalGold += gold;
        this.playerData.lastPlayTime = Date.now();
        
        // 保存
        this.saveData();
    }
    
    /**
     * 清空数据（调试用）
     */
    clearData(): void {
        this.playerData = {
            highestStage: 0,
            highestScore: 0,
            totalGames: 0,
            totalGold: 0,
            lastPlayTime: 0
        };
        this.saveData();
        console.log('[DataManager] 数据已清空');
    }
}
