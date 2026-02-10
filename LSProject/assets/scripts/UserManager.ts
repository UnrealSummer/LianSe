import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

/**
 * 用户信息
 */
export interface UserInfo {
    openid: string;
    nickname: string;
    avatarUrl: string;
}

/**
 * 用户管理器
 */
@ccclass('UserManager')
export class UserManager extends Component {
    private static instance: UserManager = null;
    private userInfo: UserInfo = null;

    onLoad() {
        if (UserManager.instance) {
            console.warn('[UserManager] Instance already exists');
            this.destroy();
            return;
        }
        UserManager.instance = this;

        // 自动登录
        this.scheduleOnce(() => {
            this.login();
        }, 0.5);
    }

    static getInstance(): UserManager {
        return UserManager.instance;
    }

    /**
     * 微信登录
     */
    async login(): Promise<boolean> {
        if (typeof wx === 'undefined') {
            console.warn('[UserManager] Not in WeChat, using test user');
            this.userInfo = {
                openid: 'test_user_' + Date.now(),
                nickname: '测试玩家',
                avatarUrl: ''
            };
            return true;
        }

        try {
            const loginRes = await this.wxLogin();
            console.log('[UserManager] Login success');

            const openid = await this.getOpenId(loginRes.code);
            console.log('[UserManager] OpenID:', openid);

            this.userInfo = {
                openid: openid,
                nickname: '玩家' + openid.substring(0, 6),
                avatarUrl: ''
            };

            return true;
        } catch (error) {
            console.error('[UserManager] Login failed:', error);
            return false;
        }
    }

    getUserInfo(): UserInfo {
        return this.userInfo;
    }

    private wxLogin(): Promise<any> {
        return new Promise((resolve, reject) => {
            wx.login({
                success: resolve,
                fail: reject
            });
        });
    }

    private async getOpenId(code: string): Promise<string> {
        try {
            const res = await wx.cloud.callFunction({
                name: 'login',
                data: { code }
            });
            return res.result.openid;
        } catch (error) {
            console.error('[UserManager] Get OpenID failed:', error);
            throw error;
        }
    }
}
