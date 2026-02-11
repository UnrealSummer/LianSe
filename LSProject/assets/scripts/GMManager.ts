import { _decorator, Component, sys } from 'cc';
import { EnemyPool } from './EnemyData';
const { ccclass } = _decorator;

/**
 * GM指令管理器
 * 用于测试和调试
 */
@ccclass('GMManager')
export class GMManager extends Component {
    private static instance: GMManager = null;
    
    // GM设置
    private forceEnemyId: string = null;  // 强制指定敌人ID
    private godMode: boolean = false;      // 无敌模式
    private unlimitedTime: boolean = false; // 无限时间
    
    onLoad() {
        if (GMManager.instance) {
            this.destroy();
            return;
        }
        GMManager.instance = this;
        
        // 监听键盘输入（仅在开发环境）
        if (sys.isBrowser) {
            this.setupKeyboardListener();
        }
        
        console.log('[GMManager] GM system initialized');
        console.log('[GMManager] Press G to open GM console');
    }

    static getInstance(): GMManager {
        return GMManager.instance;
    }

    /**
     * 设置键盘监听
     */
    private setupKeyboardListener(): void {
        if (typeof window === 'undefined') return;
        
        window.addEventListener('keydown', (event: KeyboardEvent) => {
            // 按 G 键打开GM控制台
            if (event.key === 'g' || event.key === 'G') {
                this.showGMConsole();
            }
        });
    }

    /**
     * 显示GM控制台
     */
    private showGMConsole(): void {
        const command = prompt(
            '=== GM指令 ===\n\n' +
            '敌人指令：\n' +
            '  enemy:weak - 普通敌人\n' +
            '  enemy:normal - 强力敌人\n' +
            '  enemy:elite - 精英敌人\n' +
            '  enemy:chaos - 混沌画师\n' +
            '  enemy:clear - 清除强制敌人\n\n' +
            '其他指令：\n' +
            '  god - 切换无敌模式\n' +
            '  time - 切换无限时间\n' +
            '  list - 列出所有敌人\n\n' +
            '输入指令：'
        );

        if (command) {
            this.executeCommand(command.trim().toLowerCase());
        }
    }

    /**
     * 执行GM指令
     */
    private executeCommand(command: string): void {
        console.log(`[GMManager] Executing command: ${command}`);

        // 敌人指令
        if (command.startsWith('enemy:')) {
            const enemyType = command.substring(6);
            this.handleEnemyCommand(enemyType);
            return;
        }

        // 其他指令
        switch (command) {
            case 'god':
                this.godMode = !this.godMode;
                alert(`无敌模式: ${this.godMode ? '开启' : '关闭'}`);
                console.log(`[GMManager] God mode: ${this.godMode}`);
                break;

            case 'time':
                this.unlimitedTime = !this.unlimitedTime;
                alert(`无限时间: ${this.unlimitedTime ? '开启' : '关闭'}`);
                console.log(`[GMManager] Unlimited time: ${this.unlimitedTime}`);
                break;

            case 'list':
                this.listEnemies();
                break;

            default:
                alert(`未知指令: ${command}`);
                console.warn(`[GMManager] Unknown command: ${command}`);
        }
    }

    /**
     * 处理敌人指令
     */
    private handleEnemyCommand(enemyType: string): void {
        const enemyMap: { [key: string]: string } = {
            'weak': 'enemy_weak',
            'normal': 'enemy_normal',
            'elite': 'enemy_elite',
            'chaos': 'chaos_painter',
            'clear': null
        };

        if (enemyType === 'clear') {
            this.forceEnemyId = null;
            alert('已清除强制敌人设置');
            console.log('[GMManager] Cleared forced enemy');
            return;
        }

        const enemyId = enemyMap[enemyType];
        if (enemyId) {
            this.forceEnemyId = enemyId;
            const enemy = EnemyPool.find(e => e.id === enemyId);
            alert(`已设置强制敌人: ${enemy?.name || enemyId}\n下一关将出现此敌人`);
            console.log(`[GMManager] Forced enemy: ${enemyId}`);
        } else {
            alert(`未知敌人类型: ${enemyType}`);
            console.warn(`[GMManager] Unknown enemy type: ${enemyType}`);
        }
    }

    /**
     * 列出所有敌人
     */
    private listEnemies(): void {
        let list = '=== 敌人列表 ===\n\n';
        EnemyPool.forEach(enemy => {
            list += `${enemy.id}\n`;
            list += `  名称: ${enemy.name}\n`;
            list += `  血量: ${enemy.baseHp} + ${enemy.hpGrowth}/关\n`;
            if (enemy.ability) {
                list += `  能力: ${enemy.ability.type}\n`;
            }
            list += '\n';
        });
        alert(list);
        console.log('[GMManager] Enemy list:', EnemyPool);
    }

    /**
     * 获取强制敌人ID
     */
    getForceEnemyId(): string | null {
        return this.forceEnemyId;
    }

    /**
     * 清除强制敌人（用完一次后自动清除）
     */
    clearForceEnemyId(): void {
        this.forceEnemyId = null;
    }

    /**
     * 是否开启无敌模式
     */
    isGodMode(): boolean {
        return this.godMode;
    }

    /**
     * 是否开启无限时间
     */
    isUnlimitedTime(): boolean {
        return this.unlimitedTime;
    }
}
