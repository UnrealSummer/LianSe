import { _decorator, Component, AudioSource, AudioClip } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 音效管理器 - 使用程序化音效生成
 * 无需外部音效文件，通过Web Audio API生成
 */
@ccclass('AudioManager')
export class AudioManager extends Component {
    private audioContext: AudioContext | null = null;
    private masterGain: GainNode | null = null;

    start() {
        // 初始化Web Audio Context
        if (typeof AudioContext !== 'undefined') {
            this.audioContext = new AudioContext();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = 0.3;  // 主音量30%
            this.masterGain.connect(this.audioContext.destination);
        }
    }

    /**
     * 播放点击音效
     */
    playClick() {
        this.playBeep(400, 0.05, 'sine');
    }

    /**
     * 播放混合音效
     * @param chainLevel 连锁层数，影响音调
     */
    playMix(chainLevel: number = 0) {
        const baseFreq = 600;
        const freq = baseFreq + chainLevel * 200;  // 连锁越高音调越高
        this.playBeep(freq, 0.1, 'triangle', 0.3);
        
        // 连锁音效叠加
        if (chainLevel > 0) {
            setTimeout(() => {
                this.playBeep(freq * 1.5, 0.08, 'sine', 0.2);
            }, 50);
        }
    }

    /**
     * 播放掉落音效
     */
    playDrop() {
        // 短促的下降音
        if (!this.audioContext || !this.masterGain) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
            150, 
            this.audioContext.currentTime + 0.1
        );

        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
            0.01, 
            this.audioContext.currentTime + 0.1
        );

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    /**
     * 播放胜利音效
     */
    playWin() {
        // 上升的和弦
        const notes = [523, 659, 784];  // C, E, G
        notes.forEach((freq, index) => {
            setTimeout(() => {
                this.playBeep(freq, 0.2, 'sine', 0.3);
            }, index * 100);
        });

        // 最后的长音
        setTimeout(() => {
            this.playBeep(1047, 0.5, 'sine', 0.4);
        }, 300);
    }

    /**
     * 播放失败音效
     */
    playFail() {
        // 下降音
        if (!this.audioContext || !this.masterGain) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
            100, 
            this.audioContext.currentTime + 0.5
        );

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
            0.01, 
            this.audioContext.currentTime + 0.5
        );

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }

    /**
     * 播放连锁音效
     * @param chainLevel 连锁层数
     */
    playChain(chainLevel: number) {
        // 快速上升的音符序列
        for (let i = 0; i <= chainLevel; i++) {
            setTimeout(() => {
                const freq = 400 + i * 150;
                this.playBeep(freq, 0.08, 'square', 0.25);
            }, i * 60);
        }
    }

    /**
     * 播放强化色混合音效
     */
    playEnhanced() {
        // 特殊的和音
        this.playBeep(800, 0.15, 'sine', 0.3);
        setTimeout(() => {
            this.playBeep(1200, 0.15, 'sine', 0.2);
        }, 50);
    }

    /**
     * 播放彩虹方块出现音效
     */
    playRainbow() {
        // 神秘的闪烁音
        const freqs = [800, 1000, 1200, 1000, 800];
        freqs.forEach((freq, index) => {
            setTimeout(() => {
                this.playBeep(freq, 0.05, 'sine', 0.15);
            }, index * 40);
        });
    }

    /**
     * 通用音效播放函数
     * @param frequency 频率（Hz）
     * @param duration 持续时间（秒）
     * @param type 波形类型
     * @param volume 音量（0-1）
     */
    private playBeep(
        frequency: number, 
        duration: number, 
        type: OscillatorType = 'sine',
        volume: number = 0.3
    ) {
        if (!this.audioContext || !this.masterGain) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.type = type;
        oscillator.frequency.value = frequency;

        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
            0.01, 
            this.audioContext.currentTime + duration
        );

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }
}
