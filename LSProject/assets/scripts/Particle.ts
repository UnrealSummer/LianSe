import { _decorator, Component, Node, Sprite, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 粒子组件 - 用于消除特效
 */
@ccclass('Particle')
export class Particle extends Component {
    
    @property({ tooltip: '粒子生命周期（秒）' })
    lifetime: number = 1.0;
    
    @property({ tooltip: '初始速度X' })
    velocityX: number = 0;
    
    @property({ tooltip: '初始速度Y' })
    velocityY: number = 100;
    
    @property({ tooltip: '重力加速度' })
    gravity: number = -200;
    
    @property({ tooltip: '是否旋转' })
    enableRotation: boolean = true;
    
    @property({ tooltip: '旋转速度（度/秒）' })
    rotationSpeed: number = 360;
    
    private age: number = 0;
    private velocity: Vec2 = new Vec2();
    
    onLoad() {
        this.age = 0;
        this.velocity.set(this.velocityX, this.velocityY);
    }
    
    update(dt: number) {
        this.age += dt;
        
        // 超过生命周期，销毁
        if (this.age >= this.lifetime) {
            this.node.destroy();
            return;
        }
        
        // 更新速度（重力）
        this.velocity.y += this.gravity * dt;
        
        // 更新位置
        let pos = this.node.position;
        this.node.setPosition(
            pos.x + this.velocity.x * dt,
            pos.y + this.velocity.y * dt,
            pos.z
        );
        
        // 淡出效果
        let progress = this.age / this.lifetime;
        let alpha = 255 * (1 - progress);
        this.node.getComponent(Sprite).color.a = alpha;
        
        // 缩放效果
        let scale = 1 - 0.5 * progress;
        this.node.setScale(scale, scale, 1);
        
        // 旋转效果
        if (this.enableRotation) {
            let currentAngle = this.node.angle;
            this.node.angle = currentAngle + this.rotationSpeed * dt;
        }
    }
}
