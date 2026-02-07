// 测试脚本：验证敌人血量
import { getEnemyInfo } from './EnemyData';

console.log('=== 敌人血量验证 ===\n');

// 测试关卡
const testStages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20];

console.log('关卡 | 敌人 | 血量 | 增长');
console.log('-----|------|------|------');

let prevHp = 0;
for (const stage of testStages) {
    const info = getEnemyInfo(stage);
    const growth = stage === 1 ? '-' : `+${info.hp - prevHp}`;
    console.log(`${stage.toString().padStart(2)} | ${info.name.padEnd(10)} | ${info.hp.toString().padStart(3)} | ${growth}`);
    prevHp = info.hp;
}

console.log('\n=== 验证完成 ===');

// 预期结果：
// 1  | 敌人 Lv.1   | 50  | -
// 2  | 敌人 Lv.2   | 70  | +20
// 3  | 敌人 Lv.3   | 90  | +20
// 4  | 敌人 Lv.4   | 110 | +20
// 5  | 敌人 Lv.5   | 130 | +20
// 6  | 强敌 Lv.6   | 155 | +25
// 7  | 强敌 Lv.7   | 180 | +25
// 8  | 强敌 Lv.8   | 205 | +25
// 9  | 强敌 Lv.9   | 230 | +25
// 10 | 强敌 Lv.10  | 255 | +25
// 11 | 精英 Lv.11  | 280 | +25
// 12 | 精英 Lv.12  | 305 | +25
// 13 | 精英 Lv.13  | 330 | +25
// 14 | 精英 Lv.14  | 355 | +25
// 15 | 精英 Lv.15  | 380 | +25
// 20 | 精英 Lv.20  | 505 | +125
