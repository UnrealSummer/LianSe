/**
 * 简单的示例测试
 * 用于验证测试框架是否正常工作
 */

describe('测试框架验证', () => {
    test('基础断言应该工作', () => {
        expect(1 + 1).toBe(2);
    });

    test('字符串断言应该工作', () => {
        expect('hello').toBe('hello');
    });

    test('数组断言应该工作', () => {
        const arr = [1, 2, 3];
        expect(arr).toHaveLength(3);
        expect(arr).toContain(2);
    });

    test('对象断言应该工作', () => {
        const obj = { name: '炼色', version: 1 };
        expect(obj.name).toBe('炼色');
        expect(obj).toHaveProperty('version');
    });
});
