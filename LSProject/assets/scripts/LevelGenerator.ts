import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

/**
 * 关卡配置接口
 */
export interface LevelConfig {
    stage: number;
    colorCount: number;
    enemyHp: number;
    timeLimit: number;
    obstacles?: any[];
}

/**
 * 关卡生成器 - 管理棋盘布局和强化池
 */
@ccclass('LevelGenerator')
export class LevelGenerator extends Component {
    /**
     * 第一关固定棋盘布局
     * 设计目标：
     * - 第一行有3个连续红色，玩家第一步就能消除
     * - 消除后容易触发2-3层连锁
     * - 红色分布较多，配合"红色精通"效果明显
     */
    private static FIRST_LEVEL_LAYOUT: number[][] = [
        [0, 0, 0, 2, 1, 5],  // R R R B Y G
        [2, 1, 5, 0, 2, 1],  // B Y G R B Y
        [1, 5, 0, 2, 1, 5],  // Y G R B Y G
        [5, 0, 2, 1, 5, 0],  // G R B Y G R
        [0, 2, 1, 5, 0, 2],  // R B Y G R B
        [2, 1, 5, 0, 2, 1]   // B Y G R B Y
    ];

    /**
     * 第一关强化池（固定3个）
     * 精心设计，给玩家明显的爽感
     */
    private static FIRST_LEVEL_MODIFIERS: string[] = [
        'chain_master',       // 🔗 连锁流 - 连锁伤害+50%，让玩家感受到连锁的威力
        'explosion_master',   // ⚡ 速杀流 - 4连爆炸，视觉效果明显
        'chain_slowdown'      // ⏰ 控时流 - 连锁减速，让玩家有更多时间思考
    ];

    private currentLevel: number = 1;

    start() {
        this.reset();
    }

    /**
     * 重置关卡
     */
    reset(): void {
        this.currentLevel = 1;
    }

    /**
     * 获取当前关卡
     */
    getCurrentLevel(): number {
        return this.currentLevel;
    }

    /**
     * 进入下一关
     */
    nextLevel(): void {
        this.currentLevel++;
        console.log(`[LevelGenerator] Level ${this.currentLevel}`);
    }

    /**
     * 生成棋盘布局
     * @param rows 行数
     * @param cols 列数
     * @returns 棋盘布局（二维数组，值为颜色类型 0-5）
     */
    generateBoard(rows: number = 6, cols: number = 6): number[][] {
        // 根据关卡数决定颜色数量（难度曲线）
        const colorCount = this.getColorCount(this.currentLevel);
        console.log(`[LevelGenerator] Generating board for level ${this.currentLevel} with ${colorCount} colors`);
        return this.generateRandomBoard(rows, cols, colorCount);
    }

    /**
     * 生成随机棋盘
     * 确保初始状态没有3连消
     */
    private generateRandomBoard(rows: number, cols: number, colorCount: number = 6): number[][] {
        const board: number[][] = [];
        const maxAttempts = 100;  // 最大尝试次数

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            // 生成随机棋盘
            for (let r = 0; r < rows; r++) {
                board[r] = [];
                for (let c = 0; c < cols; c++) {
                    board[r][c] = Math.floor(Math.random() * colorCount);  // 使用指定的颜色数量
                }
            }

            // 检查是否有初始3连消
            if (!this.hasInitialMatches(board, rows, cols)) {
                console.log(`[LevelGenerator] Generated valid random board with ${colorCount} colors`);
                return board;
            }
        }

        // 如果尝试多次仍有3连消，强制修复
        console.warn('[LevelGenerator] Max attempts reached, fixing board');
        this.fixInitialMatches(board, rows, cols, colorCount);
        return board;
    }

    /**
     * 检查棋盘是否有初始3连消
     */
    private hasInitialMatches(board: number[][], rows: number, cols: number): boolean {
        // 检查横向3连消
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols - 2; c++) {
                if (board[r][c] === board[r][c + 1] && board[r][c] === board[r][c + 2]) {
                    return true;
                }
            }
        }

        // 检查纵向3连消
        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows - 2; r++) {
                if (board[r][c] === board[r + 1][c] && board[r][c] === board[r + 2][c]) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * 修复初始3连消
     */
    private fixInitialMatches(board: number[][], rows: number, cols: number, colorCount: number = 6): void {
        // 检查横向3连消并修复
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols - 2; c++) {
                if (board[r][c] === board[r][c + 1] && board[r][c] === board[r][c + 2]) {
                    // 修改第三个方块的颜色
                    board[r][c + 2] = (board[r][c] + 1) % colorCount;
                }
            }
        }

        // 检查纵向3连消并修复
        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows - 2; r++) {
                if (board[r][c] === board[r + 1][c] && board[r][c] === board[r + 2][c]) {
                    // 修改第三个方块的颜色
                    board[r + 2][c] = (board[r][c] + 1) % colorCount;
                }
            }
        }
    }

    /**
     * 复制布局（避免修改原始数据）
     */
    private copyLayout(layout: number[][]): number[][] {
        return layout.map(row => [...row]);
    }

    /**
     * 获取强化池
     * @param count 需要的强化数量
     * @returns 强化ID数组
     */
    getModifierPool(count: number = 3): string[] {
        // 第一关使用固定强化池（6选3）
        if (this.currentLevel === 1) {
            return this.getFirstLevelModifiers(count);
        }

        // 第二关及以后使用随机强化池
        return this.getRandomModifiers(count);
    }

    /**
     * 第一关强化池（固定3个）
     * 精心设计，给玩家明显的爽感
     */
    private getFirstLevelModifiers(count: number): string[] {
        // 第一关固定返回这3个词条
        const result = [...LevelGenerator.FIRST_LEVEL_MODIFIERS];
        console.log(`[LevelGenerator] First level modifiers (fixed): ${result.join(', ')}`);
        return result;
    }

    /**
     * 随机强化池（第二关及以后）
     * 使用稀有度权重
     */
    private getRandomModifiers(count: number): string[] {
        // TODO: 从 Modifiers.ts 的 getWeightedRandomModifiers 获取
        // 这里先返回空数组，实际实现需要调用 ModifierSystem
        console.log(`[LevelGenerator] Random modifiers for level ${this.currentLevel}`);
        return [];
    }

    /**
     * 获取敌人血量
     * 公式：100 + (关卡-1) × 50
     */
    getEnemyHp(): number {
        return 100 + (this.currentLevel - 1) * 50;
    }

    /**
     * 获取初始时间
     * 第一关及以后都是30秒
     */
    getInitialTime(): number {
        return 60;
    }

    /**
     * 是否是第一关
     */
    isFirstLevel(): boolean {
        return this.currentLevel === 1;
    }

    /**
     * 生成关卡配置（供ProgressionManager使用）
     * @param stage 关卡数
     * @returns 关卡配置
     */
    generateLevel(stage: number): LevelConfig {
        // 同步currentLevel，确保generateBoard等方法使用正确的关卡数
        this.currentLevel = stage;
        
        return {
            stage: stage,
            colorCount: this.getColorCount(stage),
            enemyHp: this.getEnemyHp(),
            timeLimit: this.getInitialTime(),
            obstacles: []
        };
    }

    /**
     * 获取颜色数量（根据关卡）
     * @param stage 关卡数
     */
    private getColorCount(stage: number): number {
        if (stage <= 5) return 3;
        if (stage <= 10) return 4;
        if (stage <= 15) return 5;
        return 6;
    }
}
