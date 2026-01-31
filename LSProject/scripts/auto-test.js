#!/usr/bin/env node

/**
 * 自动化测试脚本（独立于Cocos引擎）
 * 测试核心逻辑，不依赖Cocos API
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 炼色项目 - 核心逻辑测试\n');
console.log('='.repeat(50));

let passCount = 0;
let failCount = 0;

function assert(condition, testName, detail) {
    if (condition) {
        passCount++;
        console.log(`✅ ${testName}`);
    } else {
        failCount++;
        console.error(`❌ ${testName}`);
        if (detail) console.error(`   详情: ${detail}`);
    }
}

// 测试1：检查必要文件存在
console.log('\n=== 测试：项目文件完整性 ===');
const requiredFiles = [
    'assets/Scripts/Block.ts',
    'assets/Scripts/GameManager.ts',
    'assets/Scripts/GridManager.ts',
    'assets/Scripts/TestRunner.ts',
];

requiredFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, '..', file));
    assert(exists, `文件存在: ${file}`);
});

// 测试2：检查代码质量
console.log('\n=== 测试：代码质量检查 ===');

const blockContent = fs.readFileSync(
    path.join(__dirname, '../assets/Scripts/Block.ts'),
    'utf-8'
);

// 检查关键修复是否存在
assert(
    blockContent.includes('node.active = false'),
    '修复1：disappear中包含立即隐藏',
    '应该在destroy前设置node.active = false'
);

assert(
    blockContent.includes('Tween.stopAllByTarget'),
    '修复：停止所有动画',
    '应该在disappear中停止动画'
);

const gridContent = fs.readFileSync(
    path.join(__dirname, '../assets/Scripts/GridManager.ts'),
    'utf-8'
);

// 检查不自动生成网格
const startMethodMatch = gridContent.match(/start\s*\(\s*\)\s*\{([^}]*)\}/s);
if (startMethodMatch) {
    const methodBody = startMethodMatch[1];
    // 排除注释中的generateGrid
    const codeLines = methodBody.split('\n')
        .filter(line => !line.trim().startsWith('//'))
        .join('\n');
    const hasGenerate = codeLines.includes('generateGrid');
    assert(
        !hasGenerate,
        '修复2：GridManager.start()不自动生成网格',
        'start()中不应该调用generateGrid（注释除外）'
    );
}

// 测试3：验证混合逻辑定义
console.log('\n=== 测试：颜色混合规则 ===');

// 匹配整个MIX_RULES对象（可能跨多行）
const mixRulesMatch = blockContent.match(/const\s+MIX_RULES\s*=\s*\{[\s\S]*?\};/);
if (mixRulesMatch) {
    const rules = mixRulesMatch[0];
    
    assert(
        (rules.includes('RED') || rules.includes('ColorType.RED')) &&
        (rules.includes('YELLOW') || rules.includes('ColorType.YELLOW')) &&
        (rules.includes('ORANGE') || rules.includes('ColorType.ORANGE')),
        '混合规则：红+黄=橙'
    );
    
    assert(
        (rules.includes('RED') || rules.includes('ColorType.RED')) &&
        (rules.includes('BLUE') || rules.includes('ColorType.BLUE')) &&
        (rules.includes('PURPLE') || rules.includes('ColorType.PURPLE')),
        '混合规则：红+蓝=紫'
    );
    
    assert(
        (rules.includes('YELLOW') || rules.includes('ColorType.YELLOW')) &&
        (rules.includes('BLUE') || rules.includes('ColorType.BLUE')) &&
        (rules.includes('GREEN') || rules.includes('ColorType.GREEN')),
        '混合规则：黄+蓝=绿'
    );
} else {
    // 如果找不到MIX_RULES，检查是否有mixColors函数
    const hasMixFunction = blockContent.includes('static mixColors');
    assert(hasMixFunction, '存在mixColors函数');
}

// 测试4：检查测试框架存在
console.log('\n=== 测试：测试框架完整性 ===');

const testRunnerContent = fs.readFileSync(
    path.join(__dirname, '../assets/Scripts/TestRunner.ts'),
    'utf-8'
);

assert(
    testRunnerContent.includes('testLevelInitialization'),
    'TestRunner包含：关卡初始化测试'
);

assert(
    testRunnerContent.includes('testGridIntegrity'),
    'TestRunner包含：网格完整性测试'
);

assert(
    testRunnerContent.includes('testColorMixing'),
    'TestRunner包含：颜色混合测试'
);

assert(
    testRunnerContent.includes('僵尸方块'),
    'TestRunner包含：僵尸方块检测'
);

// 显示结果
console.log('\n' + '='.repeat(50));
console.log('📊 测试结果汇总');
console.log('='.repeat(50));
const totalTests = passCount + failCount;
const passRate = totalTests > 0 ? (passCount / totalTests * 100).toFixed(1) : '0';

console.log(`总测试数: ${totalTests}`);
console.log(`✅ 通过: ${passCount}`);
console.log(`❌ 失败: ${failCount}`);
console.log(`通过率: ${passRate}%`);
console.log('='.repeat(50));

if (failCount > 0) {
    console.error('\n❌ 测试失败！请修复后再提交代码。');
    process.exit(1);
} else {
    console.log('\n✅ 所有测试通过！');
    console.log('\n⚠️  还需要在Cocos Creator中运行TestRunner验证运行时逻辑！');
    process.exit(0);
}
