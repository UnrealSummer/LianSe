import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

/**
 * 金币系统 - 管理金币获取和消费
 */
@ccclass('CoinSystem')
export class CoinSystem extends Component {
    private totalCoins: number = 0;
    private stageCoins: number = 0;

    start() {
        console.log('[CoinSystem] Initialized');
    }

    /**
     * 获取金币
     */
    addCoins(amount: number): void {
        this.totalCoins += amount;
        this.stageCoins += amount;
        console.log(`[CoinSystem] +${amount} coins (Total: ${this.totalCoins})`);
    }

    /**
     * 消费金币
     */
    spendCoins(amount: number): boolean {
        if (this.totalCoins >= amount) {
            this.totalCoins -= amount;
            console.log(`[CoinSystem] -${amount} coins (Total: ${this.totalCoins})`);
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
    }
}
