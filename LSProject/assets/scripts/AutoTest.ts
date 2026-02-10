import { _decorator, Component, Node } from 'cc';
import { GridSystem } from './GridSystem';
import { EnemySystem } from './EnemySystem';
import { DamageSystem } from './DamageSystem';
import { ModifierSystem } from './ModifierSystem';
import { DataManager } from './DataManager';
import { getEnemyInfo } from './EnemyData';
import { getAllModifiers } from './Modifiers';
const { ccclass, property } = _decorator;

/**
 * 自动化测试组�?
 * 用于测试游戏核心功能
 */
@ccclass('AutoTest')
export class AutoTest extends Component {
    @property({ type: GridSystem })
    gridSystem: GridSystem = null;

    @property({ type: EnemySystem })
    enemySystem: EnemySystem = null;

    @property({ type: DamageSystem })
    damageSystem: DamageSystem = null;

    @property({ type: ModifierSystem })
    modifierSystem: ModifierSystem = null;

    private testResults: { name: string; passed: boolean; message: string }[] = [];
    private totalTests: number = 0;
    private passedTests: number = 0;

    start() {
        console.log('='.repeat(60));
        console.log('🧪 自动化测试开�?);
        console.log('='.repeat(60));
        
        this.runAllTests();
    }

    /**
     * 运行所有测�?
     */
    private runAllTests(): void {
        // 1. 基础组件测试
        this.testComponents();
        
        // 2. 敌人系统测试
        this.testEnemySystem();
        
        // 3. 伤害系统测试
        this.testDamageSystem();
        
        // 4. 词条系统测试
        this.testModifierSystem();
        
        // 5. 数据管理测试
        this.testDataManager();
        
        // 6. 网格系统测试
        this.testGridSystem();
        
        // 输出测试结果
        this.printTestResults();
    }

    /**
     * 测试基础组件
     */
    private testComponents(): void {
        console.log('\n📦 测试1：基础组件');
        
        this.test('GridSystem 存在', () => {
            return this.gridSystem !== null;
        });
        
        this.test('EnemySystem 存在', () => {
            return this.enemySystem !== null;
        });
        
        this.test('DamageSystem 存在', () => {
            return this.damageSystem !== null;
        });
        
        this.test('ModifierSystem 存在', () => {
            return this.modifierSystem !== null;
        });
    }

    /**
     * 测试敌人系统
     */
    private testEnemySystem(): void {
        console.log('\n⚔️ 测试2：敌人系�?);
        
        // 测试�?关敌�?
        this.test('�?关敌人血量为50', () => {
            const enemy = getEnemyInfo(1);
            console.log(`  �?�? ${enemy.name}, ${enemy.hp}血`);
            return enemy.hp === 50;
        });
        
        // 测试�?关敌�?
        this.test('�?关敌人血量为130', () => {
            const enemy = getEnemyInfo(5);
            console.log(`  �?�? ${enemy.name}, ${enemy.hp}血`);
            return enemy.hp === 130;
        });
        
        // 测试�?关敌人（强敌�?
        this.test('�?关敌人血量为155', () => {
            const enemy = getEnemyInfo(6);
            console.log(`  �?�? ${enemy.name}, ${enemy.hp}血`);
            return enemy.hp === 155;
        });
        
        // 测试�?1关敌人（精英�?
        this.test('�?1关敌人血量为280', () => {
            const enemy = getEnemyInfo(11);
            console.log(`  �?1�? ${enemy.name}, ${enemy.hp}血`);
            return enemy.hp === 280;
        });
        
        // 测试血量增�?
        this.test('血量增长平滑（无跳跃）', () => {
            const stages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            let prevHp = 0;
            let maxGrowth = 0;
            
            for (const stage of stages) {
                const enemy = getEnemyInfo(stage);
                if (prevHp > 0) {
                    const growth = enemy.hp - prevHp;
                    maxGrowth = Math.max(maxGrowth, growth);
                }
                prevHp = enemy.hp;
            }
            
            console.log(`  最大增�? ${maxGrowth}`);
            return maxGrowth <= 25; // 增长不超�?5
        });
    }

    /**
     * 测试伤害系统
     */
    private testDamageSystem(): void {
        console.log('\n💥 测试3：伤害系�?);
        
        // 测试基础伤害
        this.test('3个方块基础伤害�?0', () => {
            const damage = this.damageSystem.calculateBaseDamage(3);
            console.log(`  3个方�? ${damage}伤害`);
            return damage === 10;
        });
        
        this.test('4个方块基础伤害�?5', () => {
            const damage = this.damageSystem.calculateBaseDamage(4);
            console.log(`  4个方�? ${damage}伤害`);
            return damage === 15;
        });
        
        this.test('5个方块基础伤害�?0', () => {
            const damage = this.damageSystem.calculateBaseDamage(5);
            console.log(`  5个方�? ${damage}伤害`);
            return damage === 20;
        });
        
        this.test('6个方块基础伤害�?5', () => {
            const damage = this.damageSystem.calculateBaseDamage(6);
            console.log(`  6个方�? ${damage}伤害`);
            return damage === 25;
        });
        
        // 测试连锁倍率
        this.test('连锁1层倍率�?.3', () => {
            const multiplier = this.damageSystem.getChainMultiplier(1);
            console.log(`  连锁1�? ×${multiplier.toFixed(2)}`);
            return Math.abs(multiplier - 1.3) < 0.01;
        });
        
        this.test('连锁2层倍率�?.69', () => {
            const multiplier = this.damageSystem.getChainMultiplier(2);
            console.log(`  连锁2�? ×${multiplier.toFixed(2)}`);
            return Math.abs(multiplier - 1.69) < 0.01;
        });
    }

    /**
     * 测试词条系统
     */
    private testModifierSystem(): void {
        console.log('\n🎲 测试4：词条系�?);
        
        // 测试词条�?
        this.test('词条池包�?7个词�?, () => {
            console.log(`  词条总数: ${getAllModifiers().length}`);
            return getAllModifiers().length === 17;
        });
        
        // 测试稀有度分布
        this.test('Common词条5�?, () => {
            const count = getAllModifiers().filter(m => m.rarity === 'common').length;
            console.log(`  Common: ${count}个`);
            return count === 5;
        });
        
        this.test('Rare词条6�?, () => {
            const count = getAllModifiers().filter(m => m.rarity === 'rare').length;
            console.log(`  Rare: ${count}个`);
            return count === 6;
        });
        
        this.test('Epic词条6�?, () => {
            const count = getAllModifiers().filter(m => m.rarity === 'epic').length;
            console.log(`  Epic: ${count}个`);
            return count === 6;
        });
        
        // 测试词条效果
        this.test('稳扎稳打词条存在', () => {
            const modifier = getAllModifiers().find(m => m.id === 'steady');
            if (modifier) {
                console.log(`  ${modifier.name}: ${modifier.description}`);
            }
            return modifier !== undefined;
        });
        
        this.test('暴击词条存在', () => {
            const modifier = getAllModifiers().find(m => m.id === 'critical');
            if (modifier) {
                console.log(`  ${modifier.name}: ${modifier.description}`);
            }
            return modifier !== undefined;
        });
    }

    /**
     * 测试数据管理
     */
    private testDataManager(): void {
        console.log('\n💾 测试5：数据管�?);
        
        // 测试数据保存
        this.test('保存最高关�?, () => {
            DataManager.getInstance().saveHighestStage(10);
            const stage = DataManager.getInstance().getHighestStage();
            console.log(`  最高关�? ${stage}`);
            return stage === 10;
        });
        
        this.test('保存最高分�?, () => {
            DataManager.getInstance().saveHighestScore(5000);
            const score = DataManager.getInstance().getHighestScore();
            console.log(`  最高分�? ${score}`);
            return score === 5000;
        });
        
        this.test('增加游戏次数', () => {
            const before = DataManager.getInstance().getGameCount();
            DataManager.getInstance().incrementGameCount();
            const after = DataManager.getInstance().getGameCount();
            console.log(`  游戏次数: ${before} �?${after}`);
            return after === before + 1;
        });
        
        this.test('保存累计金币', () => {
            DataManager.getInstance().addTotalGold(100);
            const gold = DataManager.getInstance().getTotalGold();
            console.log(`  累计金币: ${gold}`);
            return gold >= 100;
        });
        
        // 测试数据清空
        this.test('清空数据', () => {
            DataManager.getInstance().clearAllData();
            const stage = DataManager.getInstance().getHighestStage();
            const score = DataManager.getInstance().getHighestScore();
            console.log(`  清空�? 关卡${stage}, 分数${score}`);
            return stage === 0 && score === 0;
        });
    }

    /**
     * 测试网格系统
     */
    private testGridSystem(): void {
        console.log('\n🎮 测试6：网格系�?);
        
        if (!this.gridSystem) {
            console.log('  ⚠️ GridSystem 未配置，跳过测试');
            return;
        }
        
        this.test('网格大小�?×8', () => {
            const size = this.gridSystem.gridSize;
            console.log(`  网格大小: ${size}×${size}`);
            return size === 8;
        });
        
        this.test('方块类型数量�?', () => {
            const types = this.gridSystem.blockTypes;
            console.log(`  方块类型: ${types}种`);
            return types === 5;
        });
    }

    /**
     * 执行单个测试
     */
    private test(name: string, testFunc: () => boolean): void {
        this.totalTests++;
        
        try {
            const result = testFunc();
            
            if (result) {
                this.passedTests++;
                console.log(`  �?${name}`);
                this.testResults.push({ name, passed: true, message: '通过' });
            } else {
                console.log(`  �?${name}`);
                this.testResults.push({ name, passed: false, message: '失败' });
            }
        } catch (error) {
            console.log(`  �?${name} - 错误: ${error.message}`);
            this.testResults.push({ name, passed: false, message: error.message });
        }
    }

    /**
     * 输出测试结果
     */
    private printTestResults(): void {
        console.log('\n' + '='.repeat(60));
        console.log('📊 测试结果汇�?);
        console.log('='.repeat(60));
        
        console.log(`\n总测试数: ${this.totalTests}`);
        console.log(`通过: ${this.passedTests}`);
        console.log(`失败: ${this.totalTests - this.passedTests}`);
        console.log(`通过�? ${((this.passedTests / this.totalTests) * 100).toFixed(1)}%`);
        
        // 失败的测�?
        const failedTests = this.testResults.filter(t => !t.passed);
        if (failedTests.length > 0) {
            console.log('\n�?失败的测�?');
            failedTests.forEach(t => {
                console.log(`  - ${t.name}: ${t.message}`);
            });
        }
        
        // 总结
        console.log('\n' + '='.repeat(60));
        if (this.passedTests === this.totalTests) {
            console.log('🎉 所有测试通过�?);
        } else {
            console.log('⚠️ 有测试失败，请检查代�?);
        }
        console.log('='.repeat(60));
    }
}
