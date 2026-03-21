import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

/**
 * 流派类型
 */
export type BuildType = 'burst' | 'time' | 'chain' | 'berserk';

/**
 * 流派信息
 */
export interface BuildInfo {
    type: BuildType;
    name: string;
    icon: string;
    description: string;
    color: string;
}

/**
 * 流派系统 - 管理玩家的流派选择和加成
 */
@ccclass('BuildSystem')
export class BuildSystem extends Component {
    // 流派信息配置
    private static BUILD_INFO: Record<BuildType, BuildInfo> = {
        'burst': {
            type: 'burst',
            name: '速杀流',
            icon: '⚡',
            description: '高爆发伤害，快速击杀',
            color: '#FF6B6B'
        },
        'time': {
            type: 'time',
            name: '控时流',
            icon: '⏰',
            description: '延长时间，稳定输出',
            color: '#4ECDC4'
        },
        'chain': {
            type: 'chain',
            name: '连锁流',
            icon: '🔗',
            description: '追求最大连锁层数',
            color: '#FFE66D'
        },
        'berserk': {
            type: 'berserk',
            name: '狂暴流',
            icon: '💢',
            description: '低血高伤，高风险高回报',
            color: '#FF6B35'
        }
    };

    private lockedBuild: BuildType | null = null;  // 锁定的流派
    private buildModifiers: Map<BuildType, number> = new Map();  // 各流派的词条数量
    private hasResonance: boolean = false;  // 是否已触发流派共鸣

    start() {
        this.reset();
    }

    /**
     * 重置流派系统
     */
    reset(): void {
        this.lockedBuild = null;
        this.buildModifiers.clear();
        this.hasResonance = false;
        
        // 初始化计数
        this.buildModifiers.set('burst', 0);
        this.buildModifiers.set('time', 0);
        this.buildModifiers.set('chain', 0);
        this.buildModifiers.set('berserk', 0);
    }

    /**
     * 添加词条时调用
     * @param buildType 词条的流派类型
     * @returns 是否触发了流派锁定或共鸣
     */
    addModifier(buildType?: BuildType): { locked: boolean; resonance: boolean } {
        if (!buildType) {
            return { locked: false, resonance: false };
        }

        // 增加该流派的词条数量
        const count = (this.buildModifiers.get(buildType) || 0) + 1;
        this.buildModifiers.set(buildType, count);

        let locked = false;
        let resonance = false;

        // 第一个词条：锁定流派
        if (!this.lockedBuild && count === 1) {
            this.lockedBuild = buildType;
            locked = true;
            console.log(`[BuildSystem] 🔒 Build Locked: ${BuildSystem.BUILD_INFO[buildType].name}`);
        }

        // 第三个同流派词条：触发流派共鸣
        if (buildType === this.lockedBuild && count === 3 && !this.hasResonance) {
            this.hasResonance = true;
            resonance = true;
            console.log(`[BuildSystem] ✨ Build Resonance: ${BuildSystem.BUILD_INFO[buildType].name}`);
        }

        return { locked, resonance };
    }

    /**
     * 获取锁定的流派
     */
    getLockedBuild(): BuildType | null {
        return this.lockedBuild;
    }

    /**
     * 获取流派信息
     */
    getBuildInfo(buildType: BuildType): BuildInfo {
        return BuildSystem.BUILD_INFO[buildType];
    }

    /**
     * 是否已触发流派共鸣
     */
    hasResonanceActive(): boolean {
        return this.hasResonance;
    }

    /**
     * 获取某个流派的词条数量
     */
    getBuildCount(buildType: BuildType): number {
        return this.buildModifiers.get(buildType) || 0;
    }

    /**
     * 计算词条的流派加成倍率
     * @param modifierBuildType 词条的流派类型
     * @returns 加成倍率（1.0 = 无加成，1.3 = +30%，0.9 = -10%）
     */
    calculateBuildMultiplier(modifierBuildType?: BuildType): number {
        if (!modifierBuildType || !this.lockedBuild) {
            return 1.0;  // 无流派或未锁定流派，无加成
        }

        if (modifierBuildType === this.lockedBuild) {
            // 同流派：+30%
            return 1.3;
        } else {
            // 不同流派：-10%
            return 0.9;
        }
    }

    /**
     * 获取流派共鸣效果描述
     */
    getResonanceEffect(buildType: BuildType): string {
        switch (buildType) {
            case 'burst':
                return '首次攻击必定暴击';
            case 'time':
                return '初始时间+10秒';
            case 'chain':
                return '连锁倍率+0.2';
            case 'berserk':
                return '低血阈值提高到50%';
            default:
                return '';
        }
    }

    /**
     * 应用流派共鸣效果
     * 注意：这个方法只返回效果类型，具体实现在各个系统中
     */
    applyResonanceEffect(): { type: BuildType; effect: string } | null {
        if (!this.hasResonance || !this.lockedBuild) {
            return null;
        }

        return {
            type: this.lockedBuild,
            effect: this.getResonanceEffect(this.lockedBuild)
        };
    }

    /**
     * 获取流派统计信息（用于UI显示）
     */
    getBuildStats(): {
        locked: BuildType | null;
        counts: Record<BuildType, number>;
        hasResonance: boolean;
    } {
        return {
            locked: this.lockedBuild,
            counts: {
                burst: this.buildModifiers.get('burst') || 0,
                time: this.buildModifiers.get('time') || 0,
                chain: this.buildModifiers.get('chain') || 0,
                berserk: this.buildModifiers.get('berserk') || 0
            },
            hasResonance: this.hasResonance
        };
    }
}
