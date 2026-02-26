import { _decorator, Component, Prefab, instantiate, Vec2, Vec3, SpriteFrame, Sprite, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 粒子管理器 - 管理所有粒子特效
 */
@ccclass('ParticleManager')
export class ParticleManager extends Component {
    
    @property(Prefab)
    starParticlePrefab: Prefab = null;
    
    @property([SpriteFrame])
    starParticleFrames: SpriteFrame[] = [];
    
    @property(Prefab)
    circleParticlePrefab: Prefab = null;
    
    @property([SpriteFrame])
    circleParticleFrames: SpriteFrame[] = [];
    
    private static instance: ParticleManager = null;
    
    onLoad() {
        ParticleManager.instance = this;
    }
    
    onDestroy() {
        if (ParticleManager.instance === this) {
            ParticleManager.instance = null;
        }
    }
    
    /**
     * 获取单例
     */
    static getInstance(): ParticleManager {
        return ParticleManager.instance;
    }
    
    /**
     * 在指定位置生成星星粒子爆炸效果
     * @param worldPos 世界坐标位置
     * @param count 粒子数量
     */
    spawnStarBurst(worldPos: Vec3, count: number = 8) {
        if (!this.starParticlePrefab || this.starParticleFrames.length === 0) {
            console.warn('ParticleManager: 星星粒子预制体或图片未配置');
            return;
        }
        
        console.log(`[ParticleManager] 生成${count}个星星粒子，位置:`, worldPos);
        
        for (let i = 0; i < count; i++) {
            let particle = instantiate(this.starParticlePrefab);
            particle.parent = this.node;
            
            // 直接使用世界坐标（ParticleManager应该在Canvas根节点下）
            particle.setWorldPosition(worldPos);
            
            // 随机选择颜色
            let frameIndex = Math.floor(Math.random() * this.starParticleFrames.length);
            let sprite = particle.getComponent(Sprite);
            if (sprite) {
                sprite.spriteFrame = this.starParticleFrames[frameIndex];
            } else {
                console.warn('[ParticleManager] 粒子节点没有Sprite组件');
            }
            
            // 设置随机速度方向
            let angle = Math.PI * 2 * i / count + (Math.random() - 0.5) * 0.5;
            let speed = 100 + Math.random() * 100;
            let velocityX = Math.cos(angle) * speed;
            let velocityY = Math.sin(angle) * speed;
            
            let particleScript = particle.getComponent('Particle');
            if (particleScript) {
                particleScript.velocityX = velocityX;
                particleScript.velocityY = velocityY;
                particleScript.lifetime = 0.8 + Math.random() * 0.4;
            } else {
                console.warn('[ParticleManager] 粒子节点没有Particle脚本');
            }
        }
    }
    
    /**
     * 生成圆形粒子效果（用于连击）
     * @param worldPos 世界坐标位置
     * @param count 粒子数量
     */
    spawnCircleBurst(worldPos: Vec3, count: number = 5) {
        if (!this.circleParticlePrefab || this.circleParticleFrames.length === 0) {
            console.warn('ParticleManager: 圆形粒子预制体或图片未配置');
            return;
        }
        
        for (let i = 0; i < count; i++) {
            let particle = instantiate(this.circleParticlePrefab);
            particle.parent = this.node;
            
            // 直接使用世界坐标
            particle.setWorldPosition(worldPos);
            
            // 随机选择大小
            let frameIndex = Math.floor(Math.random() * this.circleParticleFrames.length);
            let sprite = particle.getComponent(Sprite);
            if (sprite) {
                sprite.spriteFrame = this.circleParticleFrames[frameIndex];
            }
            
            // 向上飘散
            let velocityX = (Math.random() - 0.5) * 50;
            let velocityY = 150 + Math.random() * 50;
            
            let particleScript = particle.getComponent('Particle');
            if (particleScript) {
                particleScript.velocityX = velocityX;
                particleScript.velocityY = velocityY;
                particleScript.gravity = -50; // 较小的重力
                particleScript.lifetime = 1.0 + Math.random() * 0.5;
                particleScript.enableRotation = false;
            }
        }
    }
}
