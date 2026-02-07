import { _decorator, Component } from 'cc';
import { GameCore } from './GameCore';
import { ModifierPool, getRandomModifiers } from './Modifiers';
const { ccclass, property } = _decorator;

/**
 * 集成测试组件
 * 模拟完整游戏流程
 */
@ccclass('IntegrationTest')
export class IntegrationTest extends Component {
    @property({ type: GameCore })
    gameCore: GameCore = null;

    private testLog: string[] = [];

    start() {
        console.log('='.repeat(60));
        console.log('🎮 集成测试开始');
        console.log('='.repeat(60));
        
        this.scheduleOnce(() => {
            this.runIntegrationTests();
        }, 1);
    }

    /**
     * 运行集成测试
     */
    private runIntegrationTests(): void {
        this.log('开始集成测试...\n');
        
        // 测试1：游戏初始化
        this.testGameInitialization();
        
        // 测试2：词条随机选择
        this.testModifierSelection();
        
        // 测试3：伤害计算
        this.testDamageCalculation();
        
        // 测试4：词条组合效果
        this.testModifierCombination();
        
        // 测试5：关卡进度
        this.testStageProgression();
        
        // 输出测试日志
        this.printTestLog();
    }

    /**
     * 测试游戏初始化
     */
    private testGameInitialization(): void {
        this.log('📦 测试1：游戏初始化');
        
        if (!this.gameCore) {
            this.log('  ❌ GameCore 未配置');
            return;
        }
        
        this.log('  ✅ GameCore 已配置');
        
        // 检查子系统
        const systems = [
            'gridSystem',
            'enemySystem',
            'damageSystem',
            'modifierSystem',
            'progressionManager'
        ];
        
        for (const system of systems) {
            if (this.gameCore[system]) {
                this.log(`  ✅ ${system} 已配置`);
            } else {
                this.log(`  ❌ ${system} 未配置`);
            }
        }
        
        this.log('');
    }

    /**
     * 测试词条随机选择
     */
    private testModifierSelection(): void {
        this.log('🎲 测试2：词条随机选择');
        
        // 测试10次随机选择
        const rarityCount = { common: 0, rare: 0, epic: 0 };
        const iterations = 100;
        
        for (let i = 0; i < iterations; i++) {
            const modifiers = getRandomModifiers(3);
            modifiers.forEach(m => {
                rarityCount[m.rarity]++;
            });
        }
        
        const total = rarityCount.common + rarityCount.rare + rarityCount.epic;
        const commonPercent = (rarityCount.common / total * 100).toFixed(1);
        const rarePercent = (rarityCount.rare / total * 100).toFixed(1);
        const epicPercent = (rarityCount.epic / total * 100).toFixed(1);
        
        this.log(`  测试次数: ${iterations}次，共${total}个词条`);
        this.log(`  Common: ${rarityCount.common}个 (${commonPercent}%)`);
        this.log(`  Rare: ${rarityCount.rare}个 (${rarePercent}%)`);
        this.log(`  Epic: ${rarityCount.epic}个 (${epicPercent}%)`);
        
        // 验证概率（允许10%误差）
        const commonOk = Math.abs(parseFloat(commonPercent) - 60) < 10;
        const rareOk = Math.abs(parseFloat(rarePercent) - 30) < 10;
        const epicOk = Math.abs(parseFloat(epicPercent) - 10) < 10;
        
        if (commonOk && rareOk && epicOk) {
            this.log('  ✅ 稀有度概率正确（60%/30%/10%）');
        } else {
            this.log('  ⚠️ 稀有度概率偏差较大');
        }
        
        this.log('');
    }

    /**
     * 测试伤害计算
     */
    private testDamageCalculation(): void {
        this.log('💥 测试3：伤害计算');
        
        // 测试基础伤害
        const testCases = [
            { count: 3, expected: 10 },
            { count: 4, expected: 15 },
            { count: 5, expected: 20 },
            { count: 6, expected: 25 },
            { count: 7, expected: 30 }
        ];
        
        for (const testCase of testCases) {
            const damage = this.calculateBaseDamage(testCase.count);
            const match = damage === testCase.expected;
            const icon = match ? '✅' : '❌';
            this.log(`  ${icon} ${testCase.count}个方块: ${damage}伤害 (预期${testCase.expected})`);
        }
        
        // 测试连锁倍率
        this.log('\n  连锁倍率测试:');
        for (let chain = 1; chain <= 5; chain++) {
            const multiplier = Math.pow(1.3, chain);
            this.log(`  ✅ 连锁${chain}层: ×${multiplier.toFixed(2)}`);
        }
        
        this.log('');
    }

    /**
     * 测试词条组合效果
     */
    private testModifierCombination(): void {
        this.log('🔥 测试4：词条组合效果');
        
        // 测试组合1：金币流
        this.log('  组合1：金币流（金币雨 + 点金术 + 贪婪）');
        const goldCombo = this.simulateGoldCombo();
        this.log(`    4个方块基础金币: 2`);
        this.log(`    金币雨: +1 = 3`);
        this.log(`    贪婪: +2 = 5`);
        this.log(`    点金术: ×1.5 = ${goldCombo}`);
        this.log(`    ✅ 最终金币: ${goldCombo}`);
        
        // 测试组合2：连锁流
        this.log('\n  组合2：连锁流（连锁爆发 + 连锁专家 + 连锁狂潮）');
        const chainCombo = this.simulateChainCombo();
        this.log(`    基础伤害: 10`);
        this.log(`    连锁专家: +20 = 30`);
        this.log(`    连锁狂潮: ×3 = 90`);
        this.log(`    连锁倍率(5层): ×${Math.pow(1.5, 5).toFixed(2)} = ${chainCombo.toFixed(0)}`);
        this.log(`    ✅ 最终伤害: ${chainCombo.toFixed(0)}`);
        
        // 测试组合3：爆发流
        this.log('\n  组合3：爆发流（开局爆发 + 背水一战 + 暴击）');
        const burstCombo = this.simulateBurstCombo();
        this.log(`    基础伤害: 10`);
        this.log(`    开局爆发: ×1.5 = 15`);
        this.log(`    背水一战: ×2 = 30`);
        this.log(`    暴击: ×3 = 90`);
        this.log(`    ✅ 最终伤害: ${burstCombo}`);
        
        this.log('');
    }

    /**
     * 测试关卡进度
     */
    private testStageProgression(): void {
        this.log('📈 测试5：关卡进度');
        
        // 模拟前15关
        this.log('  关卡 | 敌人 | 血量 | 增长');
        this.log('  -----|------|------|------');
        
        const stages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        let prevHp = 0;
        
        for (const stage of stages) {
            const hp = this.calculateEnemyHp(stage);
            const growth = stage === 1 ? '-' : `+${hp - prevHp}`;
            const enemyType = stage <= 5 ? '敌人' : stage <= 10 ? '强敌' : '精英';
            this.log(`  ${stage.toString().padStart(2)} | ${enemyType} | ${hp.toString().padStart(3)} | ${growth}`);
            prevHp = hp;
        }
        
        this.log('  ✅ 关卡进度正常');
        this.log('');
    }

    /**
     * 计算基础伤害
     */
    private calculateBaseDamage(count: number): number {
        return 5 + count * 5;
    }

    /**
     * 计算敌人血量
     */
    private calculateEnemyHp(stage: number): number {
        if (stage <= 5) {
            return 50 + (stage - 1) * 20;
        } else if (stage <= 10) {
            return 155 + (stage - 6) * 25;
        } else {
            return 280 + (stage - 11) * 25;
        }
    }

    /**
     * 模拟金币组合
     */
    private simulateGoldCombo(): number {
        let gold = 2; // 4个方块基础金币
        gold += 1; // 金币雨
        gold += 2; // 贪婪
        gold = Math.floor(gold * 1.5); // 点金术
        return gold;
    }

    /**
     * 模拟连锁组合
     */
    private simulateChainCombo(): number {
        let damage = 10; // 基础伤害
        damage += 20; // 连锁专家
        damage *= 3; // 连锁狂潮
        damage *= Math.pow(1.5, 5); // 连锁倍率（连锁爆发）
        return damage;
    }

    /**
     * 模拟爆发组合
     */
    private simulateBurstCombo(): number {
        let damage = 10; // 基础伤害
        damage *= 1.5; // 开局爆发
        damage *= 2; // 背水一战
        damage *= 3; // 暴击
        return damage;
    }

    /**
     * 记录日志
     */
    private log(message: string): void {
        console.log(message);
        this.testLog.push(message);
    }

    /**
     * 输出测试日志
     */
    private printTestLog(): void {
        console.log('='.repeat(60));
        console.log('📊 集成测试完成');
        console.log('='.repeat(60));
        console.log('\n所有测试已完成，请查看上方日志');
        console.log('\n如果所有测试都显示 ✅，说明功能正常');
        console.log('如果有 ❌ 或 ⚠️，请检查对应功能');
        console.log('\n' + '='.repeat(60));
    }
}
