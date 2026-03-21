import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

/**
 * 事件类型定义
 */
export enum GameEvent {
    // 游戏流程事件
    GAME_START = 'game_start',
    GAME_PAUSE = 'game_pause',
    GAME_RESUME = 'game_resume',
    GAME_OVER = 'game_over',
    LEVEL_COMPLETE = 'level_complete',
    LEVEL_START = 'level_start',
    
    // 消除事件
    MATCH_FOUND = 'match_found',
    MATCH_PROCESSED = 'match_processed',
    BLOCKS_REMOVED = 'blocks_removed',
    BLOCKS_DROPPED = 'blocks_dropped',
    
    // 连锁事件
    CHAIN_START = 'chain_start',
    CHAIN_CONTINUE = 'chain_continue',
    CHAIN_END = 'chain_end',
    
    // 伤害事件
    DAMAGE_CALCULATED = 'damage_calculated',
    DAMAGE_DEALT = 'damage_dealt',
    
    // 敌人事件
    ENEMY_DAMAGED = 'enemy_damaged',
    ENEMY_KILLED = 'enemy_killed',
    ENEMY_SPAWNED = 'enemy_spawned',
    
    // 词条事件
    MODIFIER_ACQUIRED = 'modifier_acquired',
    MODIFIER_REMOVED = 'modifier_removed',
    MODIFIER_TRIGGERED = 'modifier_triggered',
    
    // 流派事件
    BUILD_LOCKED = 'build_locked',
    BUILD_RESONANCE = 'build_resonance',
    
    // 时间事件
    TIME_UPDATE = 'time_update',
    TIME_WARNING = 'time_warning',
    TIME_SLOWDOWN = 'time_slowdown',
    TIME_SPEEDUP = 'time_speedup',
    
    // UI事件
    SHOW_MODIFIER_SELECTION = 'show_modifier_selection',
    HIDE_MODIFIER_SELECTION = 'hide_modifier_selection',
    SHOW_PERFORMANCE_REPORT = 'show_performance_report',
    SHOW_DAMAGE_NUMBER = 'show_damage_number',
    
    // 特效事件
    PLAY_EXPLOSION = 'play_explosion',
    PLAY_CROSS_CLEAR = 'play_cross_clear',
    PLAY_CRITICAL_HIT = 'play_critical_hit',
    PLAY_CHAIN_EFFECT = 'play_chain_effect'
}

/**
 * 事件数据接口
 */
export interface EventData {
    [key: string]: any;
}

/**
 * 事件监听器类型
 */
type EventListener = (data?: EventData) => void;

/**
 * 事件总线 - 解耦系统间通信
 */
@ccclass('EventBus')
export class EventBus extends Component {
    private static instance: EventBus | null = null;
    private listeners: Map<GameEvent, EventListener[]> = new Map();
    private eventHistory: Array<{ event: GameEvent; data?: EventData; timestamp: number }> = [];
    private maxHistorySize: number = 100;

    onLoad() {
        if (EventBus.instance) {
            console.warn('[EventBus] Instance already exists, destroying duplicate');
            this.node.destroy();
            return;
        }
        EventBus.instance = this;
        console.log('[EventBus] Initialized');
    }

    onDestroy() {
        if (EventBus.instance === this) {
            EventBus.instance = null;
        }
    }

    /**
     * 获取单例
     */
    static getInstance(): EventBus | null {
        return EventBus.instance;
    }

    /**
     * 订阅事件
     */
    on(event: GameEvent, listener: EventListener): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push(listener);
        console.log(`[EventBus] Subscribed to ${event}`);
    }

    /**
     * 取消订阅事件
     */
    off(event: GameEvent, listener: EventListener): void {
        const listeners = this.listeners.get(event);
        if (listeners) {
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
                console.log(`[EventBus] Unsubscribed from ${event}`);
            }
        }
    }

    /**
     * 订阅一次性事件
     */
    once(event: GameEvent, listener: EventListener): void {
        const onceListener: EventListener = (data?: EventData) => {
            listener(data);
            this.off(event, onceListener);
        };
        this.on(event, onceListener);
    }

    /**
     * 发送事件
     */
    emit(event: GameEvent, data?: EventData): void {
        // 记录事件历史
        this.eventHistory.push({
            event,
            data,
            timestamp: Date.now()
        });

        // 限制历史记录大小
        if (this.eventHistory.length > this.maxHistorySize) {
            this.eventHistory.shift();
        }

        // 触发监听器
        const listeners = this.listeners.get(event);
        if (listeners && listeners.length > 0) {
            console.log(`[EventBus] Emit ${event}`, data || '');
            listeners.forEach(listener => {
                try {
                    listener(data);
                } catch (error) {
                    console.error(`[EventBus] Error in listener for ${event}:`, error);
                }
            });
        }
    }

    /**
     * 清空所有监听器
     */
    clear(): void {
        this.listeners.clear();
        console.log('[EventBus] Cleared all listeners');
    }

    /**
     * 清空指定事件的监听器
     */
    clearEvent(event: GameEvent): void {
        this.listeners.delete(event);
        console.log(`[EventBus] Cleared listeners for ${event}`);
    }

    /**
     * 获取事件历史
     */
    getEventHistory(event?: GameEvent, limit: number = 10): Array<{ event: GameEvent; data?: EventData; timestamp: number }> {
        let history = this.eventHistory;
        
        if (event) {
            history = history.filter(h => h.event === event);
        }
        
        return history.slice(-limit);
    }

    /**
     * 打印事件统计
     */
    printStats(): void {
        console.log('========== EventBus Stats ==========');
        console.log(`Total Events: ${Object.keys(GameEvent).length}`);
        console.log(`Active Listeners: ${this.listeners.size}`);
        
        this.listeners.forEach((listeners, event) => {
            console.log(`  ${event}: ${listeners.length} listener(s)`);
        });
        
        console.log(`Event History: ${this.eventHistory.length} events`);
        console.log('====================================');
    }

    /**
     * 获取监听器数量
     */
    getListenerCount(event?: GameEvent): number {
        if (event) {
            return this.listeners.get(event)?.length || 0;
        }
        
        let total = 0;
        this.listeners.forEach(listeners => {
            total += listeners.length;
        });
        return total;
    }
}

/**
 * 便捷的全局事件发送函数
 */
export function emitEvent(event: GameEvent, data?: EventData): void {
    const bus = EventBus.getInstance();
    if (bus) {
        bus.emit(event, data);
    } else {
        console.warn('[EventBus] Instance not found, cannot emit event:', event);
    }
}

/**
 * 便捷的全局事件订阅函数
 */
export function onEvent(event: GameEvent, listener: EventListener): void {
    const bus = EventBus.getInstance();
    if (bus) {
        bus.on(event, listener);
    } else {
        console.warn('[EventBus] Instance not found, cannot subscribe to event:', event);
    }
}

/**
 * 便捷的全局事件取消订阅函数
 */
export function offEvent(event: GameEvent, listener: EventListener): void {
    const bus = EventBus.getInstance();
    if (bus) {
        bus.off(event, listener);
    } else {
        console.warn('[EventBus] Instance not found, cannot unsubscribe from event:', event);
    }
}
