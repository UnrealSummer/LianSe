import { _decorator, Component, Label } from 'cc';
import { GameCore } from './GameCore';
import { GridSystem } from './GridSystem';
import { EnemySystem } from './EnemySystem';
import { ModifierSystem } from './ModifierSystem';
const { ccclass, property } = _decorator;

/**
 * 游戏功能测试 - 测试三消+Roguelike流程
 */
@ccclass('GameTest')
export class GameTest extends Component {
    @property({ type: GameCore })
    gameCore: GameCore = null;

    @property({ type: GridSystem })
    gridSystem: GridSystem = null;

    @property({ type: EnemySystem })
    enemySystem: EnemySystem = null;

    @property({ type: ModifierSystem })
    modifierSystem: ModifierSystem = null;

    @property({ type: Label })
    testLog: Label = null;

    private logs: string[] = [];

    start() {
        this.log('🧪 开始游戏功能测试...\n');
        this.scheduleOnce(() => {
            this.runTests();
        }, 1.0);
    }

    /**
     * 运行所有测试
     */
    async runTests() {
        this.log('=== 测试1：网格生成 ===');
        this.testGridGeneration();

        this.scheduleOnce(() => {
            this.log('\n=== 测试2：消除检测 ===');
            this.testMatchDetection();
        }, 2.0);

        this.scheduleOnce(() => {
            this.log('\n=== 测试3：伤害计算 ===');
            this.testDamageCalculation();
        }, 4.0);

        this.scheduleOnce(() => {
            this.log('\n=== 测试4：过关流程 ===');
            this.testVictoryFlow();
        }, 6.0);
    }

    /**
     * 测试1：网格生成
     */
    testGridGeneration() {
        const gridSize = this.gridSystem.gridSize;
        const blockCount = this.gridSystem.node.children.length;
        const expectedCount = gridSize * gridSize;

        this.log(`网格大小: ${gridSize}x${gridSize}`);
        this.log(`方块数量: ${blockCount} (预期: ${expectedCount})`);

        if (blockCount === expectedCount) {
            this.log('✅ 网格生成正常');
        } else {
            this.log(`❌ 网格生成异常！实际${blockCount}个，预期${expectedCount}个`);
        }
    }

    /**
     * 测试2：消除检测
     */
    testMatchDetection() {
        const matches = this.gridSystem.findAllMatches();
        
        this.log(`检测到 ${matches.length} 组可消除`);
        
        matches.forEach((match, index) => {
            this.log(`  第${index + 1}组: ${match.length}个方块`);
        });

        if (matches.length > 0) {
            this.log('✅ 消除检测正常');
        } else {
            this.log('⚠️ 当前没有可消除的方块（正常情况）');
        }
    }

    /**
     * 测试3：伤害计算
     */
    testDamageCalculation() {
        // 模拟不同的消除情况
        const testCases = [
            { count: 3, chain: 0, expected: 10 },
            { count: 4, chain: 0, expected: 15 },
            { count: 5, chain: 0, expected: 20 },
            { count: 3, chain: 1, expected: 13 }, // 10 * 1.3
            { count: 5, chain: 2, expected: 34 }, // 20 * 1.69
        ];

        this.log('伤害计算测试:');
        testCases.forEach(test => {
            const matchData = {
                count: test.count,
                color: 0,
                chainLevel: test.chain,
                matchType: 'line' as any,
                baseDamage: 10
            };

            const damage = this.gameCore['damageSystem'].calculateMatchDamage(matchData);
            const pass = Math.abs(damage - test.expected) <= 1; // 允许1点误差

            if (pass) {
                this.log(`  ✅ ${test.count}消除 连锁${test.chain}: ${damage}伤害`);
            } else {
                this.log(`  ❌ ${test.count}消除 连锁${test.chain}: ${damage}伤害 (预期${test.expected})`);
            }
        });
    }

    /**
     * 测试4：过关流程
     */
    testVictoryFlow() {
        const enemyHp = this.enemySystem.getCurrentHp();
        const enemyMaxHp = this.enemySystem.getMaxHp();
        const enemyAlive = this.enemySystem.isAlive();

        this.log('敌人状态:');
        this.log(`  血量: ${enemyHp}/${enemyMaxHp}`);
        this.log(`  存活: ${enemyAlive ? '是' : '否'}`);

        if (enemyAlive) {
            this.log('\n💡 提示: 继续消除方块来击败敌人！');
            this.log('   - 3个方块 = 10伤害');
            this.log('   - 4个方块 = 15伤害');
            this.log('   - 5个方块 = 20伤害');
            this.log('   - 连锁会增加伤害倍率（1.3^连锁层数）');
        } else {
            this.log('✅ 敌人已被击败！');
            this.log('   应该会显示词条选择界面');
        }

        // 计算需要多少次消除
        if (enemyAlive) {
            const avgDamage = 15; // 平均伤害
            const estimatedMatches = Math.ceil(enemyHp / avgDamage);
            this.log(`\n📊 预计需要 ${estimatedMatches} 次消除来击败敌人`);
        }
    }

    /**
     * 记录日志
     */
    log(message: string) {
        console.log(message);
        this.logs.push(message);

        if (this.testLog) {
            // 只显示最后20行
            const displayLogs = this.logs.slice(-20);
            this.testLog.string = displayLogs.join('\n');
        }
    }
}
