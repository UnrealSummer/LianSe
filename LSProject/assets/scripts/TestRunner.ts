import { _decorator, Component, Label, Color } from 'cc';
import { GameManager } from './GameManager';
import { GridManager } from './GridManager';
import { Block, ColorType } from './Block';

const { ccclass, property } = _decorator;

/**
 * 测试运行器 - 自动化测试关键场景
 * 使用方法：在场景中挂载此组件，运行游戏即可自动测试
 */
@ccclass('TestRunner')
export class TestRunner extends Component {
    @property(GameManager)
    gameManager: GameManager = null;

    @property(GridManager)
    gridManager: GridManager = null;

    @property(Label)
    resultLabel: Label = null;

    private testResults: string[] = [];
    private passCount: number = 0;
    private failCount: number = 0;

    start() {
        console.log('🧪 开始自动化测试...\n');
        this.runAllTests();
    }

    /**
     * 运行所有测试
     */
    runAllTests() {
        // 测试1：关卡初始化
        this.testLevelInitialization();
        
        // 测试2：网格完整性
        this.testGridIntegrity();
        
        // 测试3：方块混合逻辑
        this.testColorMixing();
        
        // 测试4：版本1新功能
        this.testEnhancedColors();
        this.testSpecialBlocks();
        
        // 显示结果
        this.showResults();
    }

    /**
     * 测试：关卡初始化
     */
    testLevelInitialization() {
        console.log('\n=== 测试：关卡初始化 ===');
        
        const levelConfigs = [
            { level: 1, expectedSize: 5 },
            { level: 2, expectedSize: 6 },
            { level: 3, expectedSize: 6 },
            { level: 4, expectedSize: 7 },
            { level: 5, expectedSize: 8 },
        ];

        for (const config of levelConfigs) {
            this.gameManager.initLevel(config.level);
            
            const actualSize = this.gridManager.gridSize;
            const testName = `第${config.level}关 - 网格大小应为${config.expectedSize}x${config.expectedSize}`;
            
            this.assert(
                actualSize === config.expectedSize,
                testName,
                `预期: ${config.expectedSize}, 实际: ${actualSize}`
            );
        }
    }

    /**
     * 测试：网格完整性（无僵尸方块）
     */
    testGridIntegrity() {
        console.log('\n=== 测试：网格完整性 ===');
        
        const levelConfigs = [
            { level: 1, expectedSize: 5 },
            { level: 2, expectedSize: 6 },
            { level: 3, expectedSize: 6 },
            { level: 4, expectedSize: 7 },
            { level: 5, expectedSize: 8 },
        ];

        for (const config of levelConfigs) {
            this.gameManager.initLevel(config.level);
            
            // 验证节点数量
            const actualNodeCount = this.gridManager.node.children.length;
            const expectedNodeCount = config.expectedSize * config.expectedSize;
            
            this.assert(
                actualNodeCount === expectedNodeCount,
                `第${config.level}关 - 无僵尸方块`,
                `预期节点数: ${expectedNodeCount}, 实际: ${actualNodeCount}`
            );
            
            // 验证blocks数组一致性
            let validBlockCount = 0;
            for (let row = 0; row < config.expectedSize; row++) {
                for (let col = 0; col < config.expectedSize; col++) {
                    const block = this.gridManager.getBlock(row, col);
                    if (block && block.isValid) {
                        validBlockCount++;
                    }
                }
            }
            
            this.assert(
                validBlockCount === expectedNodeCount,
                `第${config.level}关 - blocks数组完整性`,
                `预期: ${expectedNodeCount}, 实际: ${validBlockCount}`
            );
        }
    }

    /**
     * 测试：颜色混合逻辑
     */
    testColorMixing() {
        console.log('\n=== 测试：颜色混合逻辑 ===');
        
        const mixTests = [
            { color1: ColorType.RED, color2: ColorType.YELLOW, expected: ColorType.ORANGE, name: '红+黄=橙' },
            { color1: ColorType.YELLOW, color2: ColorType.RED, expected: ColorType.ORANGE, name: '黄+红=橙' },
            { color1: ColorType.RED, color2: ColorType.BLUE, expected: ColorType.PURPLE, name: '红+蓝=紫' },
            { color1: ColorType.BLUE, color2: ColorType.RED, expected: ColorType.PURPLE, name: '蓝+红=紫' },
            { color1: ColorType.YELLOW, color2: ColorType.BLUE, expected: ColorType.GREEN, name: '黄+蓝=绿' },
            { color1: ColorType.BLUE, color2: ColorType.YELLOW, expected: ColorType.GREEN, name: '蓝+黄=绿' },
            { color1: ColorType.RED, color2: ColorType.RED, expected: null, name: '红+红=无法混合' },
            { color1: ColorType.ORANGE, color2: ColorType.PURPLE, expected: null, name: '橙+紫=无法混合' },
        ];

        for (const test of mixTests) {
            const result = Block.mixColors(test.color1, test.color2);
            
            this.assert(
                result === test.expected,
                test.name,
                `预期: ${test.expected}, 实际: ${result}`
            );
        }
    }

    /**
     * 测试：强化色混合
     */
    testEnhancedColors() {
        console.log('\n=== 测试：强化色混合 ===');
        
        const enhancedTests = [
            { color1: ColorType.RED, color2: ColorType.RED, expected: ColorType.DEEP_RED, name: '红+红=深红' },
            { color1: ColorType.YELLOW, color2: ColorType.YELLOW, expected: ColorType.DEEP_YELLOW, name: '黄+黄=深黄' },
            { color1: ColorType.BLUE, color2: ColorType.BLUE, expected: ColorType.DEEP_BLUE, name: '蓝+蓝=深蓝' },
        ];

        for (const test of enhancedTests) {
            const result = Block.mixColors(test.color1, test.color2);
            
            this.assert(
                result === test.expected,
                test.name,
                `预期: ${test.expected}, 实际: ${result}`
            );
        }
        
        // 测试辅助方法
        this.assert(
            Block.isEnhancedColor(ColorType.DEEP_RED),
            '深红应该被识别为强化色'
        );
        
        this.assert(
            !Block.isEnhancedColor(ColorType.RED),
            '红色不应该被识别为强化色'
        );
    }

    /**
     * 测试：特殊方块
     */
    testSpecialBlocks() {
        console.log('\n=== 测试：特殊方块 ===');
        
        // 测试彩虹方块混合规则
        const rainbowTests = [
            { color1: ColorType.RAINBOW, color2: ColorType.RED, expected: ColorType.DEEP_RED, name: '彩虹+红=深红' },
            { color1: ColorType.RED, color2: ColorType.RAINBOW, expected: ColorType.DEEP_RED, name: '红+彩虹=深红' },
            { color1: ColorType.RAINBOW, color2: ColorType.ORANGE, expected: ColorType.ORANGE, name: '彩虹+橙=橙' },
        ];

        for (const test of rainbowTests) {
            const result = Block.mixColors(test.color1, test.color2);
            
            this.assert(
                result === test.expected,
                test.name,
                `预期: ${test.expected}, 实际: ${result}`
            );
        }
        
        // 测试特殊方块识别
        this.assert(
            Block.isSpecialBlock(ColorType.RAINBOW),
            '彩虹应该被识别为特殊方块'
        );
        
        this.assert(
            !Block.isSpecialBlock(ColorType.RED),
            '红色不应该被识别为特殊方块'
        );
    }

    /**
     * 断言辅助函数
     */
    assert(condition: boolean, testName: string, detail?: string) {
        if (condition) {
            this.passCount++;
            const msg = `✅ ${testName}`;
            console.log(msg);
            this.testResults.push(msg);
        } else {
            this.failCount++;
            const msg = `❌ ${testName}`;
            const detailMsg = detail ? `   详情: ${detail}` : '';
            console.error(msg);
            if (detail) console.error(detailMsg);
            this.testResults.push(msg);
            if (detail) this.testResults.push(detailMsg);
        }
    }

    /**
     * 显示测试结果
     */
    showResults() {
        const totalTests = this.passCount + this.failCount;
        const passRate = totalTests > 0 ? (this.passCount / totalTests * 100).toFixed(1) : '0';
        
        console.log('\n' + '='.repeat(50));
        console.log('📊 测试结果汇总');
        console.log('='.repeat(50));
        console.log(`总测试数: ${totalTests}`);
        console.log(`✅ 通过: ${this.passCount}`);
        console.log(`❌ 失败: ${this.failCount}`);
        console.log(`通过率: ${passRate}%`);
        console.log('='.repeat(50));

        if (this.resultLabel) {
            const resultText = [
                '📊 测试结果',
                `总计: ${totalTests}`,
                `✅ 通过: ${this.passCount}`,
                `❌ 失败: ${this.failCount}`,
                `通过率: ${passRate}%`,
                '',
                ...this.testResults.slice(-10) // 只显示最后10条
            ].join('\n');
            
            this.resultLabel.string = resultText;
            
            // 根据结果设置颜色
            if (this.failCount === 0) {
                this.resultLabel.color = new Color(52, 199, 89); // 绿色
            } else {
                this.resultLabel.color = new Color(255, 59, 48); // 红色
            }
        }
    }
}
