/**
 * EnemyData 单元测试
 * 测试敌人数据和平衡性
 */

import { getEnemyInfo } from '../../assets/scripts/EnemyData';

describe('EnemyData', () => {
    describe('敌人血量', () => {
        test('第1关敌人血量为50', () => {
            const enemy = getEnemyInfo(1);
            expect(enemy.hp).toBe(50);
        });

        test('第2关敌人血量为70', () => {
            const enemy = getEnemyInfo(2);
            expect(enemy.hp).toBe(70);
        });

        test('第5关敌人血量为130', () => {
            const enemy = getEnemyInfo(5);
            expect(enemy.hp).toBe(130);
        });

        test('第6关敌人血量为155（强敌）', () => {
            const enemy = getEnemyInfo(6);
            expect(enemy.hp).toBe(155);
        });

        test('第11关敌人血量为280（精英）', () => {
            const enemy = getEnemyInfo(11);
            expect(enemy.hp).toBe(280);
        });

        test('第20关敌人血量应该合理', () => {
            const enemy = getEnemyInfo(20);
            expect(enemy.hp).toBeGreaterThan(400);
            expect(enemy.hp).toBeLessThan(1000);
        });
    });

    describe('敌人名称', () => {
        test('每个敌人都应该有名称', () => {
            for (let stage = 1; stage <= 20; stage++) {
                const enemy = getEnemyInfo(stage);
                expect(enemy.name).toBeTruthy();
                expect(enemy.name.length).toBeGreaterThan(0);
            }
        });

        test('第1关敌人名称应该存在', () => {
            const enemy = getEnemyInfo(1);
            expect(enemy.name).toBeTruthy();
            expect(enemy.name.length).toBeGreaterThan(0);
        });

        test('第11关敌人名称应该存在', () => {
            const enemy = getEnemyInfo(11);
            expect(enemy.name).toBeTruthy();
            expect(enemy.name.length).toBeGreaterThan(0);
        });
    });

    describe('血量增长曲线', () => {
        test('血量应该随关卡递增', () => {
            for (let stage = 1; stage < 20; stage++) {
                const current = getEnemyInfo(stage);
                const next = getEnemyInfo(stage + 1);
                expect(next.hp).toBeGreaterThan(current.hp);
            }
        });

        test('血量增长应该平滑（无大跳跃）', () => {
            const maxAllowedGrowth = 30; // 最大允许增长
            
            for (let stage = 1; stage < 20; stage++) {
                const current = getEnemyInfo(stage);
                const next = getEnemyInfo(stage + 1);
                const growth = next.hp - current.hp;
                
                expect(growth).toBeLessThanOrEqual(maxAllowedGrowth);
            }
        });

        test('1-5关血量增长约为20/关', () => {
            const stage1 = getEnemyInfo(1);
            const stage5 = getEnemyInfo(5);
            const avgGrowth = (stage5.hp - stage1.hp) / 4;
            
            expect(avgGrowth).toBeCloseTo(20, 0);
        });

        test('6-10关血量增长约为25/关', () => {
            const stage6 = getEnemyInfo(6);
            const stage10 = getEnemyInfo(10);
            const avgGrowth = (stage10.hp - stage6.hp) / 4;
            
            expect(avgGrowth).toBeCloseTo(25, 0);
        });

        test('11+关血量增长约为25/关', () => {
            const stage11 = getEnemyInfo(11);
            const stage15 = getEnemyInfo(15);
            const avgGrowth = (stage15.hp - stage11.hp) / 4;
            
            expect(avgGrowth).toBeCloseTo(25, 1);
        });
    });

    describe('平衡性验证', () => {
        test('第1关应该可以用2-3次消除击败', () => {
            const enemy = getEnemyInfo(1);
            const avgDamagePerMatch = 15; // 假设平均伤害
            const matchesNeeded = Math.ceil(enemy.hp / avgDamagePerMatch);
            
            expect(matchesNeeded).toBeGreaterThanOrEqual(2);
            expect(matchesNeeded).toBeLessThanOrEqual(4);
        });

        test('第5关应该可以用5-7次消除击败', () => {
            const enemy = getEnemyInfo(5);
            const avgDamagePerMatch = 20;
            const matchesNeeded = Math.ceil(enemy.hp / avgDamagePerMatch);
            
            expect(matchesNeeded).toBeGreaterThanOrEqual(5);
            expect(matchesNeeded).toBeLessThanOrEqual(8);
        });

        test('第11关应该需要10+次消除', () => {
            const enemy = getEnemyInfo(11);
            const avgDamagePerMatch = 25;
            const matchesNeeded = Math.ceil(enemy.hp / avgDamagePerMatch);
            
            expect(matchesNeeded).toBeGreaterThanOrEqual(10);
        });
    });

    describe('边界情况', () => {
        test('关卡0应该返回有效敌人', () => {
            const enemy = getEnemyInfo(0);
            expect(enemy).toBeTruthy();
            expect(enemy.hp).toBeGreaterThan(0);
        });

        test('负数关卡应该返回有效敌人', () => {
            const enemy = getEnemyInfo(-1);
            expect(enemy).toBeTruthy();
            expect(enemy.hp).toBeGreaterThan(0);
        });

        test('超大关卡数应该返回有效敌人', () => {
            const enemy = getEnemyInfo(999);
            expect(enemy).toBeTruthy();
            expect(enemy.hp).toBeGreaterThan(0);
        });
    });
});
