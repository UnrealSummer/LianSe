import { _decorator, Component } from 'cc';
import { UserManager } from './UserManager';
const { ccclass } = _decorator;

export interface LeaderboardEntry {
    _id?: string;
    openid: string;
    nickname: string;
    avatarUrl: string;
    score: number;
    stage: number;
    maxCombo: number;
    timestamp: number;
}

@ccclass('LeaderboardManager')
export class LeaderboardManager extends Component {
    private static instance: LeaderboardManager = null;

    onLoad() {
        if (LeaderboardManager.instance) {
            console.warn('[LeaderboardManager] Instance already exists');
            this.destroy();
            return;
        }
        LeaderboardManager.instance = this;
    }

    static getInstance(): LeaderboardManager {
        return LeaderboardManager.instance;
    }

    async uploadScore(score: number, stage: number, maxCombo: number): Promise<boolean> {
        if (typeof wx === 'undefined' || !wx.cloud) {
            console.warn('[LeaderboardManager] Cloud not available');
            return false;
        }

        const userInfo = UserManager.getInstance()?.getUserInfo();
        if (!userInfo) {
            console.error('[LeaderboardManager] User not logged in');
            return false;
        }

        try {
            const db = wx.cloud.database();
            const queryRes = await db.collection('leaderboard')
                .where({ openid: userInfo.openid })
                .get();

            if (queryRes.data.length > 0) {
                const existingScore = queryRes.data[0].score;
                if (score > existingScore) {
                    await db.collection('leaderboard')
                        .doc(queryRes.data[0]._id)
                        .update({
                            data: {
                                score: score,
                                stage: stage,
                                maxCombo: maxCombo,
                                nickname: userInfo.nickname,
                                avatarUrl: userInfo.avatarUrl,
                                timestamp: Date.now()
                            }
                        });
                    console.log('[LeaderboardManager] Score updated:', score);
                }
            } else {
                await db.collection('leaderboard').add({
                    data: {
                        openid: userInfo.openid,
                        nickname: userInfo.nickname,
                        avatarUrl: userInfo.avatarUrl,
                        score: score,
                        stage: stage,
                        maxCombo: maxCombo,
                        timestamp: Date.now()
                    }
                });
                console.log('[LeaderboardManager] Score added:', score);
            }

            return true;
        } catch (error) {
            console.error('[LeaderboardManager] Upload failed:', error);
            return false;
        }
    }

    async getGlobalLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
        if (typeof wx === 'undefined' || !wx.cloud) {
            return [];
        }

        try {
            const db = wx.cloud.database();
            const res = await db.collection('leaderboard')
                .orderBy('score', 'desc')
                .limit(limit)
                .get();

            console.log('[LeaderboardManager] Leaderboard loaded:', res.data.length);
            return res.data as LeaderboardEntry[];
        } catch (error) {
            console.error('[LeaderboardManager] Get leaderboard failed:', error);
            return [];
        }
    }
}
