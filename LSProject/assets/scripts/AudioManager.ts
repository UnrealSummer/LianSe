import { _decorator, Component, AudioClip, AudioSource } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 音效系统
 */
@ccclass('AudioManager')
export class AudioManager extends Component {
    // 音效资源
    @property(AudioClip)
    matchSound: AudioClip = null;

    @property(AudioClip)
    attackSound: AudioClip = null;

    @property(AudioClip)
    comboSound: AudioClip = null;

    @property(AudioClip)
    victorySound: AudioClip = null;

    @property(AudioClip)
    defeatSound: AudioClip = null;

    @property(AudioClip)
    clickSound: AudioClip = null;

    @property(AudioClip)
    bgm: AudioClip = null;

    // 音量设置
    @property({ tooltip: '音效音量 (0-1)' })
    sfxVolume: number = 0.7;

    @property({ tooltip: '背景音乐音量 (0-1)' })
    bgmVolume: number = 0.3;

    private audioSource: AudioSource = null;
    private bgmSource: AudioSource = null;

    start() {
        // Create audio sources
        this.audioSource = this.node.addComponent(AudioSource);
        this.audioSource.volume = this.sfxVolume;

        this.bgmSource = this.node.addComponent(AudioSource);
        this.bgmSource.volume = this.bgmVolume;
        this.bgmSource.loop = true;

        // Play BGM
        if (this.bgm) {
            this.playBGM();
        }

        console.log('[AudioManager] Initialized');
    }

    /**
     * 播放背景音乐
     */
    playBGM(): void {
        if (this.bgm && this.bgmSource) {
            this.bgmSource.clip = this.bgm;
            this.bgmSource.play();
            console.log('[AudioManager] Playing BGM');
        }
    }

    /**
     * 停止背景音乐
     */
    stopBGM(): void {
        if (this.bgmSource) {
            this.bgmSource.stop();
        }
    }

    /**
     * 播放消除音效
     */
    playMatch(): void {
        this.playSound(this.matchSound);
    }

    /**
     * 播放攻击音效
     */
    playAttack(): void {
        this.playSound(this.attackSound);
    }

    /**
     * 播放连击音效
     */
    playCombo(): void {
        this.playSound(this.comboSound);
    }

    /**
     * 播放胜利音效
     */
    playVictory(): void {
        this.playSound(this.victorySound);
    }

    /**
     * 播放失败音效
     */
    playDefeat(): void {
        this.playSound(this.defeatSound);
    }

    /**
     * 播放点击音效
     */
    playClick(): void {
        this.playSound(this.clickSound);
    }

    /**
     * 播放音效
     */
    private playSound(clip: AudioClip): void {
        if (clip && this.audioSource) {
            this.audioSource.playOneShot(clip, this.sfxVolume);
        }
    }

    /**
     * 设置音效音量
     */
    setSFXVolume(volume: number): void {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        if (this.audioSource) {
            this.audioSource.volume = this.sfxVolume;
        }
    }

    /**
     * 设置背景音乐音量
     */
    setBGMVolume(volume: number): void {
        this.bgmVolume = Math.max(0, Math.min(1, volume));
        if (this.bgmSource) {
            this.bgmSource.volume = this.bgmVolume;
        }
    }

    /**
     * 静音/取消静音
     */
    setMute(mute: boolean): void {
        if (this.audioSource) {
            this.audioSource.volume = mute ? 0 : this.sfxVolume;
        }
        if (this.bgmSource) {
            this.bgmSource.volume = mute ? 0 : this.bgmVolume;
        }
    }
}
