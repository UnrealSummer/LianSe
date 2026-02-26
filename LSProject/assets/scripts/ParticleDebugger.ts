import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 粒子效果调试工具
 * 添加到场景中任意节点，按空格键测试粒子效果
 */
@ccclass('ParticleDebugger')
export class ParticleDebugger extends Component {
    
    @property({ tooltip: '是否启用调试（运行时按空格测试）' })
    enableDebug: boolean = true;
    
    onLoad() {
        console.log('[ParticleDebugger] 已加载，按空格键测试粒子效果');
    }
    
    update(dt: number) {
        if (!this.enableDebug) return;
        
        // 监听空格键
        if (cc.systemEvent) {
            // Cocos Creator 3.x
        }
    }
    
    onEnable() {
        if (this.enableDebug) {
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        }
    }
    
    onDisable() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }
    
    private onKeyDown(event: any) {
        if (event.keyCode === cc.KeyCode.SPACE) {
            this.testParticles();
        }
    }
    
    /**
     * 测试粒子效果
     */
    testParticles() {
        console.log('=== 开始测试粒子效果 ===');
        
        // 1. 检查ParticleManager是否存在
        const ParticleManager = require('./ParticleManager').ParticleManager;
        const particleManager = ParticleManager.getInstance();
        
        if (!particleManager) {
            console.error('❌ ParticleManager未找到！');
            console.log('请确认：');
            console.log('1. 场景中是否有ParticleManager节点');
            console.log('2. ParticleManager节点是否添加了ParticleManager脚本');
            return;
        }
        
        console.log('✅ ParticleManager已找到');
        
        // 2. 检查预制体
        if (!particleManager.starParticlePrefab) {
            console.error('❌ StarParticle预制体未配置！');
            console.log('请在ParticleManager组件中配置Star Particle Prefab');
            return;
        }
        console.log('✅ StarParticle预制体已配置');
        
        // 3. 检查粒子图片
        if (!particleManager.starParticleFrames || particleManager.starParticleFrames.length === 0) {
            console.error('❌ 粒子图片未配置！');
            console.log('请在ParticleManager组件中配置Star Particle Frames（5个PNG文件）');
            return;
        }
        console.log(`✅ 粒子图片已配置（${particleManager.starParticleFrames.length}个）`);
        
        // 4. 测试生成粒子
        const testPos = new Vec3(0, 0, 0);
        console.log('🎆 在屏幕中心生成测试粒子...');
        particleManager.spawnStarBurst(testPos, 10);
        
        console.log('=== 测试完成 ===');
        console.log('如果看到粒子，说明配置正确！');
        console.log('如果没看到，检查控制台错误信息');
    }
}
