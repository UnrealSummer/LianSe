import { _decorator, Component } from 'cc';
import { DataManager } from './DataManager';
import { GameUI } from './GameUI';
import { TopBar } from './TopBar';
const { ccclass } = _decorator;

/**
 * 金币系统 - 管理金币获取和消费
 */
@ccclass('CoinSystem')
export class CoinSystem extends Component {
    private totalCoins: number = 0;
    private stageCoins: number = 0;
    private gameUI: GameUI = null;

    start() {
        // 每局独立，不从存档加载金币
        this.totalCoins = 0;
        this.stageCoins = 0;
        
        // Find GameUI - try multiple ways
        this.gameUI = this.node.parent?.getComponentInChildren(GameUI);
        if (!this.gameUI) {
            // Try finding in Canvas
            const canvas = this.node.scene.getChildByName('Canvas');
            if (canvas) {
                this.gameUI = canvas.getComponentInChildren(GameUI);
            }
        }
        
        if (!this.gameUI) {
            console.error('[CoinSystem] GameUI not found! UI will not update.');
        } else {
            console.log('[CoinSystem] GameUI found, will update UI');
            // 初始化显示
            this.gameUI.updateCoins(this.totalCoins);
        }
        
        console.log('[CoinSystem] Initialized');
    }

    /**
     * 获取金币
     */
    addCoins(amount: number): void {
        this.totalCoins += amount;
        this.stageCoins += amount;
        console.log(`[CoinSystem] +${amount} coins (Total: ${this.totalCoins})`);
        
        // 更新UI
        if (this.gameUI) {
            console.log(`[CoinSystem] Updating UI to ${this.totalCoins} coins`);
            this.gameUI.updateCoins(this.totalCoins);
        } else {
            console.warn('[CoinSystem] Cannot update UI - GameUI not found');
        }
    }

    /**
     * 消费金币
     */
    spendCoins(amount: number): boolean {
        if (this.totalCoins >= amount) {
            this.totalCoins -= amount;
            console.log(`[CoinSystem] -${amount} coins (Total: ${this.totalCoins})`);
            
            // 更新UI
            if (this.gameUI) {
                this.gameUI.updateCoins(this.totalCoins);
            }
            
            return true;
        }
        console.warn(`[CoinSystem] Not enough coins! Need ${amount}, have ${this.totalCoins}`);
        return false;
    }

    /**
     * 获取总金币
     */
    getTotalCoins(): number {
        return this.totalCoins;
    }

    /**
     * 获取本关金币
     */
    getStageCoins(): number {
        return this.stageCoins;
    }

    /**
     * 重置本关金币
     */
    resetStageCoins(): void {
        this.stageCoins = 0;
    }

    /**
     * 清空所有金币（重新开始游戏）
     */
    reset(): void {
        this.totalCoins = 0;
        this.stageCoins = 0;
        console.log('[CoinSystem] Reset all coins');
        if (this.gameUI) {
            this.gameUI.updateCoins(0);
        }
        const topBar = TopBar.getInstance();
        if (topBar) {
            topBar.updateCoins(0);
        }
    }
}
