# 《炼色》单元测试文档

## 📋 概述

完整的单元测试套件，覆盖游戏核心系统的各个方面。

## 🎯 测试覆盖

### 1. **DamageSystem.test.ts** - 伤害系统测试
- ✅ 基础伤害计算（3-7个方块）
- ✅ 连锁倍率计算（0-5层）
- ✅ 总伤害计算（基础×连锁）
- ✅ 边界情况（负数、0、超大值）

**测试数量：** 15个测试用例

---

### 2. **EnemyData.test.ts** - 敌人数据测试
- ✅ 敌人血量验证（1-20关）
- ✅ 敌人名称验证
- ✅ 血量增长曲线（平滑性）
- ✅ 平衡性验证（消除次数）
- ✅ 边界情况（0、负数、超大关卡）

**测试数量：** 18个测试用例

---

### 3. **ModifierSystem.test.ts** - 词条系统测试
- ✅ 词条池验证（17个词条）
- ✅ 稀有度分布（Common 5, Rare 6, Epic 6）
- ✅ 词条添加和去重
- ✅ 伤害修改（稳扎稳打、连锁大师等）
- ✅ 金币修改（点金术、贪婪）
- ✅ 词条选择（随机、权重）
- ✅ 特殊词条效果（暴击、物以稀为贵）

**测试数量：** 25个测试用例

---

### 4. **DataManager.test.ts** - 数据管理测试
- ✅ 单例模式验证
- ✅ 最高关卡保存/读取
- ✅ 最高分数保存/读取
- ✅ 游戏次数统计
- ✅ 累计金币统计
- ✅ 数据清空
- ✅ 数据持久化
- ✅ 边界情况（0、负数、超大值）

**测试数量：** 22个测试用例

---

### 5. **GridSystem.test.ts** - 网格系统测试
- ✅ 网格初始化（大小、类型）
- ✅ 方块获取（有效/无效位置）
- ✅ 方块交换（相邻/不相邻）
- ✅ 匹配检测（横向、纵向、3连、4连）
- ✅ 方块下落和填充
- ✅ 颜色统计
- ✅ 网格重置
- ✅ 边界情况（1×1、超大网格）

**测试数量：** 20个测试用例

---

## 📊 测试统计

| 测试文件 | 测试用例数 | 覆盖功能 |
|---------|----------|---------|
| DamageSystem.test.ts | 15 | 伤害计算 |
| EnemyData.test.ts | 18 | 敌人数据 |
| ModifierSystem.test.ts | 25 | 词条系统 |
| DataManager.test.ts | 22 | 数据管理 |
| GridSystem.test.ts | 20 | 网格系统 |
| **总计** | **100** | **5个核心系统** |

---

## 🚀 快速开始

### 1. 安装依赖

```bash
cd E:\Project\LianSe\LSProject\tests
npm install
```

### 2. 运行所有测试

```bash
npm test
```

### 3. 运行特定测试

```bash
# 只运行伤害系统测试
npm test DamageSystem

# 只运行敌人数据测试
npm test EnemyData

# 只运行词条系统测试
npm test ModifierSystem
```

### 4. 监听模式（开发时使用）

```bash
npm run test:watch
```

### 5. 生成覆盖率报告

```bash
npm run test:coverage
```

---

## 📁 文件结构

```
E:\Project\LianSe\LSProject\
├── tests/
│   ├── unit/                      # 单元测试
│   │   ├── DamageSystem.test.ts
│   │   ├── EnemyData.test.ts
│   │   ├── ModifierSystem.test.ts
│   │   ├── DataManager.test.ts
│   │   └── GridSystem.test.ts
│   ├── mocks/                     # Mock文件
│   │   └── cocos.mock.ts
│   ├── setup.ts                   # 测试环境设置
│   ├── package.json               # 测试依赖
│   └── tsconfig.json              # TypeScript配置
├── jest.config.js                 # Jest配置
└── assets/scripts/                # 源代码
```

---

## 🎨 测试示例

### 基础测试
```typescript
test('3个方块应该造成10点伤害', () => {
    const damage = damageSystem.calculateBaseDamage(3);
    expect(damage).toBe(10);
});
```

### 边界测试
```typescript
test('负数方块应该造成0点伤害', () => {
    const damage = damageSystem.calculateBaseDamage(-5);
    expect(damage).toBe(0);
});
```

### 概率测试
```typescript
test('暴击词条应该有概率触发', () => {
    const critModifier = ModifierPool.find(m => m.id === 'critical');
    modifierSystem.addModifier(critModifier);
    
    let hasCrit = false;
    for (let i = 0; i < 100; i++) {
        const damage = modifierSystem.modifyDamage(100, 3, 0);
        if (damage > 100) {
            hasCrit = true;
            break;
        }
    }
    
    expect(hasCrit).toBe(true);
});
```

---

## ✅ 测试覆盖目标

| 指标 | 目标 | 当前 |
|-----|------|------|
| 分支覆盖率 | 70% | - |
| 函数覆盖率 | 70% | - |
| 行覆盖率 | 70% | - |
| 语句覆盖率 | 70% | - |

---

## 🔧 配置说明

### Jest配置 (jest.config.js)
- **测试环境：** Node.js
- **测试匹配：** `**/*.test.ts`
- **覆盖率收集：** `assets/scripts/**/*.ts`
- **Mock映射：** Cocos Creator API

### TypeScript配置 (tsconfig.json)
- **目标：** ES2020
- **模块：** CommonJS
- **严格模式：** 启用

---

## 📝 编写新测试

### 1. 创建测试文件
```bash
# 在 tests/unit/ 目录下创建
touch tests/unit/YourSystem.test.ts
```

### 2. 基础模板
```typescript
import { YourSystem } from '../../assets/scripts/YourSystem';

describe('YourSystem', () => {
    let system: YourSystem;

    beforeEach(() => {
        system = new YourSystem();
    });

    describe('功能分组', () => {
        test('测试用例描述', () => {
            // 准备
            const input = 10;
            
            // 执行
            const result = system.someMethod(input);
            
            // 断言
            expect(result).toBe(20);
        });
    });
});
```

### 3. 运行测试
```bash
npm test YourSystem
```

---

## 🐛 常见问题

### Q: 测试运行失败，提示找不到模块？
**A:** 确保已安装依赖：
```bash
cd tests
npm install
```

### Q: Cocos API报错？
**A:** 检查 `tests/mocks/cocos.mock.ts` 是否包含所需的API。

### Q: 如何跳过某个测试？
**A:** 使用 `test.skip` 或 `describe.skip`：
```typescript
test.skip('暂时跳过的测试', () => {
    // ...
});
```

### Q: 如何只运行某个测试？
**A:** 使用 `test.only` 或 `describe.only`：
```typescript
test.only('只运行这个测试', () => {
    // ...
});
```

---

## 📈 持续集成

### GitHub Actions 示例
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd tests && npm install
      - run: cd tests && npm test
      - run: cd tests && npm run test:coverage
```

---

## 🎯 下一步

### 待添加的测试
- [ ] **GoldSystem.test.ts** - 金币系统测试
- [ ] **GameCore.test.ts** - 游戏核心逻辑测试
- [ ] **AudioManager.test.ts** - 音频管理测试
- [ ] **UI组件测试** - GameOverUI、PauseUI等

### 集成测试
- [ ] 完整游戏流程测试
- [ ] 多关卡连续测试
- [ ] 词条组合效果测试

### 性能测试
- [ ] 大规模消除性能测试
- [ ] 内存泄漏检测
- [ ] 帧率稳定性测试

---

## 📚 参考资料

- [Jest官方文档](https://jestjs.io/)
- [TypeScript Jest配置](https://kulshekhar.github.io/ts-jest/)
- [测试最佳实践](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

*最后更新：2026-02-06*  
*测试框架版本：Jest 29.5.0*
