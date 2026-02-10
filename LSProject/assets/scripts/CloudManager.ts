import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

/**
 * 云开发管理器
 */
@ccclass('CloudManager')
export class CloudManager extends Component {
    private static instance: CloudManager = null;
    private isInitialized: boolean = false;
    private envId: string = 'cloud1-1gmq4aiz75a438a0';

    onLoad() {
        if (CloudManager.instance) {
            console.warn('[CloudManager] Instance already exists');
            this.destroy();
            return;
        }
        CloudManager.instance = this;

        this.initCloud();
    }

    static getInstance(): CloudManager {
        return CloudManager.instance;
    }

    /**
     * 初始化云开发
     */
    private initCloud(): void {
        if (typeof wx === 'undefined' || !wx.cloud) {
            console.warn('[CloudManager] Not in WeChat environment');
            return;
        }

        try {
            wx.cloud.init({
                env: this.envId,
                traceUser: true
            });
            this.isInitialized = true;
            console.log('[CloudManager] Cloud initialized with env:', this.envId);
        } catch (error) {
            console.error('[CloudManager] Init failed:', error);
        }
    }

    /**
     * 检查是否已初始化
     */
    isReady(): boolean {
        return this.isInitialized;
    }
}
