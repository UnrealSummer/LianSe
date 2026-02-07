import { _decorator, Component, Node, Button, Toggle, sys } from 'cc';
import { DataManager } from './DataManager';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

/**
 * 设置界面
 */
@ccclass('SettingsUI')
export class SettingsUI extends Component {
    @property({ type: Node })
    panel: Node = null; // 设置面板
    
    @property({ type: Toggle })
    soundToggle: Toggle = null; // 音效开关
    
    @property({ type: Toggle })
    musicToggle: Toggle = null; // 音乐开关
    
    @property({ type: Button })
    clearDataButton: Button = null; // 清空数据
    
    @property({ type: Button })
    closeButton: Button = null; // 关闭按钮
    
    @property({ type: AudioManager })
    audioManager: AudioManager = null; // 音效管理器
    
    private soundEnabled: boolean = true;
    private musicEnabled: boolean = true;
    
    start() {
        this.hide();
        
        // 加载设置
        this.loadSettings();
        
        // 绑定按钮事件
        if (this.soundToggle) {
            this.soundToggle.node.on('toggle', this.onSoundToggle, this);
        }
        
        if (this.musicToggle) {
            this.musicToggle.node.on('toggle', this.onMusicToggle, this);
        }
        
        if (this.clearDataButton) {
            this.clearDataButton.node.on(Button.EventType.CLICK, this.onClearDataClicked, this);
        }
        
        if (this.closeButton) {
            this.closeButton.node.on(Button.EventType.CLICK, this.onCloseClicked, this);
        }
    }
    
    /**
     * 显示设置界面
     */
    show(): void {
        if (this.panel) {
            this.panel.active = true;
        }
        
        console.log('[SettingsUI] 设置界面已显示');
    }
    
    /**
     * 隐藏设置界面
     */
    hide(): void {
        if (this.panel) {
            this.panel.active = false;
        }
    }
    
    /**
     * 加载设置
     */
    private loadSettings(): void {
        const soundStr = sys.localStorage.getItem('sound_enabled');
        const musicStr = sys.localStorage.getItem('music_enabled');
        
        this.soundEnabled = soundStr !== 'false'; // 默认开启
        this.musicEnabled = musicStr !== 'false'; // 默认开启
        
        // 更新 Toggle 状态
        if (this.soundToggle) {
            this.soundToggle.isChecked = this.soundEnabled;
        }
        
        if (this.musicToggle) {
            this.musicToggle.isChecked = this.musicEnabled;
        }
        
        console.log(`[SettingsUI] 设置已加载: 音效=${this.soundEnabled}, 音乐=${this.musicEnabled}`);
    }
    
    /**
     * 保存设置
     */
    private saveSettings(): void {
        sys.localStorage.setItem('sound_enabled', this.soundEnabled.toString());
        sys.localStorage.setItem('music_enabled', this.musicEnabled.toString());
        
        console.log(`[SettingsUI] 设置已保存: 音效=${this.soundEnabled}, 音乐=${this.musicEnabled}`);
    }
    
    /**
     * 音效开关
     */
    private onSoundToggle(toggle: Toggle): void {
        this.soundEnabled = toggle.isChecked;
        this.saveSettings();
        
        console.log(`[SettingsUI] 音效: ${this.soundEnabled ? '开启' : '关闭'}`);
        
        // 通知 AudioManager
        if (this.audioManager) {
            this.audioManager.setSFXEnabled(this.soundEnabled);
        }
    }
    
    /**
     * 音乐开关
     */
    private onMusicToggle(toggle: Toggle): void {
        this.musicEnabled = toggle.isChecked;
        this.saveSettings();
        
        console.log(`[SettingsUI] 音乐: ${this.musicEnabled ? '开启' : '关闭'}`);
        
        // 通知 AudioManager
        if (this.audioManager) {
            this.audioManager.setMusicEnabled(this.musicEnabled);
        }
    }
    
    /**
     * 清空数据
     */
    private onClearDataClicked(): void {
        console.log('[SettingsUI] 清空数据');
        
        // 确认对话框
        const confirmed = confirm('确定要清空所有游戏数据吗？此操作不可恢复！');
        if (!confirmed) {
            return;
        }
        
        // 清空数据
        const dataManager = DataManager.getInstance();
        if (dataManager) {
            dataManager.clearData();
            console.log('[SettingsUI] 数据已清空');
            alert('数据已清空！');
        }
    }
    
    /**
     * 关闭按钮
     */
    private onCloseClicked(): void {
        console.log('[SettingsUI] 关闭设置');
        this.hide();
    }
    
    /**
     * 获取音效开关状态
     */
    isSoundEnabled(): boolean {
        return this.soundEnabled;
    }
    
    /**
     * 获取音乐开关状态
     */
    isMusicEnabled(): boolean {
        return this.musicEnabled;
    }
}
