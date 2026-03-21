import { _decorator, Component, Node, Vec3, tween, UIOpacity, Sprite, Color } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 特效管理器扩展 - 爆炸和十字清除特效
 * 添加到 EffectManager.ts 中
 */

/**
 * 爆炸特效
 * @param position 爆炸中心位置
 */
export function playExplosionEffect(position: Vec3, parentNode: Node): void {
    console.log('[Effect] Playing explosion at', position);
    
    // 阶段1：预警圆圈（0.2秒）
    const warningCircle = new Node('ExplosionWarning');
    warningCircle.setParent(parentNode);
    warningCircle.setPosition(position);
    
    const warningSprite = warningCircle.addComponent(Sprite);
    // TODO: 设置圆形精灵帧
    warningSprite.color = new Color(255, 68, 68, 76); // #FF4444, 30% opacity
    
    tween(warningCircle)
        .to(0.2, { scale: new Vec3(2, 2, 1) }, { easing: 'sineOut' })
        .call(() => {
            // 阶段2：爆炸波纹（0.3秒）
            playExplosionWaves(position, parentNode);
            
            // 屏幕震动
            shakeScreen(parentNode, 10, 0.2);
            
            // 销毁预警圆圈
            warningCircle.destroy();
        })
        .start();
}

/**
 * 爆炸波纹
 */
function playExplosionWaves(position: Vec3, parentNode: Node): void {
    // 创建3层波纹
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const wave = new Node('ExplosionWave');
            wave.setParent(parentNode);
            wave.setPosition(position);
            
            const waveSprite = wave.addComponent(Sprite);
            // TODO: 设置圆形精灵帧
            waveSprite.color = new Color(255, 68, 68, 204); // #FF4444, 80% opacity
            
            const waveOpacity = wave.addComponent(UIOpacity);
            waveOpacity.opacity = 204;
            
            tween(wave)
                .to(0.3, { scale: new Vec3(3, 3, 1) }, { easing: 'sineOut' })
                .start();
            
            tween(waveOpacity)
                .to(0.3, { opacity: 0 })
                .call(() => wave.destroy())
                .start();
        }, i * 100);
    }
}

/**
 * 十字清除特效
 * @param position 中心位置
 * @param row 行索引
 * @param col 列索引
 */
export function playCrossClearEffect(position: Vec3, row: number, col: number, parentNode: Node): void {
    console.log('[Effect] Playing cross clear at', position);
    
    // 阶段1：预警十字（0.2秒）
    const warningCross = createCrossLines(position, parentNode, new Color(255, 215, 0, 76), 1);
    
    tween(warningCross)
        .to(0.2, { scale: new Vec3(1.5, 1.5, 1) }, { easing: 'sineOut' })
        .call(() => {
            warningCross.destroy();
            
            // 阶段2：横向清除（0.2秒）
            playHorizontalClear(position, parentNode);
            
            // 阶段3：纵向清除（0.2秒，延迟0.2秒）
            setTimeout(() => {
                playVerticalClear(position, parentNode);
            }, 200);
        })
        .start();
}

/**
 * 创建十字线条
 */
function createCrossLines(position: Vec3, parentNode: Node, color: Color, scale: number): Node {
    const cross = new Node('Cross');
    cross.setParent(parentNode);
    cross.setPosition(position);
    cross.setScale(scale, scale, 1);
    
    // 横线
    const hLine = new Node('HorizontalLine');
    hLine.setParent(cross);
    const hSprite = hLine.addComponent(Sprite);
    // TODO: 设置矩形精灵帧
    hSprite.color = color;
    hLine.setScale(10, 0.1, 1); // 宽度10倍，高度0.1倍
    
    // 竖线
    const vLine = new Node('VerticalLine');
    vLine.setParent(cross);
    const vSprite = vLine.addComponent(Sprite);
    // TODO: 设置矩形精灵帧
    vSprite.color = color;
    vLine.setScale(0.1, 10, 1); // 宽度0.1倍，高度10倍
    
    return cross;
}

/**
 * 横向清除能量波
 */
function playHorizontalClear(position: Vec3, parentNode: Node): void {
    // 左侧能量波
    const leftWave = createEnergyWave(position, parentNode, 'left');
    tween(leftWave)
        .to(0.2, { position: new Vec3(position.x - 500, position.y, 0) }, { easing: 'sineOut' })
        .call(() => leftWave.destroy())
        .start();
    
    // 右侧能量波
    const rightWave = createEnergyWave(position, parentNode, 'right');
    tween(rightWave)
        .to(0.2, { position: new Vec3(position.x + 500, position.y, 0) }, { easing: 'sineOut' })
        .call(() => rightWave.destroy())
        .start();
}

/**
 * 纵向清除能量波
 */
function playVerticalClear(position: Vec3, parentNode: Node): void {
    // 上方能量波
    const upWave = createEnergyWave(position, parentNode, 'up');
    tween(upWave)
        .to(0.2, { position: new Vec3(position.x, position.y + 500, 0) }, { easing: 'sineOut' })
        .call(() => upWave.destroy())
        .start();
    
    // 下方能量波
    const downWave = createEnergyWave(position, parentNode, 'down');
    tween(downWave)
        .to(0.2, { position: new Vec3(position.x, position.y - 500, 0) }, { easing: 'sineOut' })
        .call(() => downWave.destroy())
        .start();
}

/**
 * 创建能量波
 */
function createEnergyWave(position: Vec3, parentNode: Node, direction: string): Node {
    const wave = new Node('EnergyWave_' + direction);
    wave.setParent(parentNode);
    wave.setPosition(position);
    
    const sprite = wave.addComponent(Sprite);
    // TODO: 设置矩形精灵帧
    sprite.color = new Color(255, 215, 0, 255); // #FFD700
    
    // 根据方向设置形状
    if (direction === 'left' || direction === 'right') {
        wave.setScale(0.2, 0.05, 1); // 横向窄条
    } else {
        wave.setScale(0.05, 0.2, 1); // 纵向窄条
    }
    
    const opacity = wave.addComponent(UIOpacity);
    tween(opacity)
        .to(0.2, { opacity: 0 })
        .start();
    
    return wave;
}

/**
 * 屏幕震动
 */
function shakeScreen(node: Node, amplitude: number, duration: number): void {
    const originalPos = node.position.clone();
    const shakeCount = 10;
    const interval = duration / shakeCount;
    
    let count = 0;
    const shakeInterval = setInterval(() => {
        if (count >= shakeCount) {
            node.setPosition(originalPos);
            clearInterval(shakeInterval);
            return;
        }
        
        const offsetX = (Math.random() - 0.5) * amplitude * 2;
        const offsetY = (Math.random() - 0.5) * amplitude * 2;
        node.setPosition(originalPos.x + offsetX, originalPos.y + offsetY, originalPos.z);
        
        count++;
    }, interval * 1000);
}

/**
 * 流派锁定提示
 */
export function showBuildLockNotification(buildType: string, parentNode: Node): void {
    console.log('[Effect] Showing build lock:', buildType);
    
    const notification = new Node('BuildLockNotification');
    notification.setParent(parentNode);
    notification.setPosition(0, 200, 0);
    
    // TODO: 添加文字组件显示 "流派锁定！+3秒"
    
    // 动画：放大 → 停留 → 淡出
    notification.setScale(0, 0, 1);
    const opacity = notification.addComponent(UIOpacity);
    
    tween(notification)
        .to(0.3, { scale: new Vec3(1.2, 1.2, 1) }, { easing: 'backOut' })
        .to(0.2, { scale: new Vec3(1, 1, 1) }, { easing: 'sineOut' })
        .delay(1.0)
        .call(() => {
            tween(opacity)
                .to(0.3, { opacity: 0 })
                .call(() => notification.destroy())
                .start();
        })
        .start();
}

/**
 * 流派共鸣特效
 */
export function showBuildResonanceEffect(buildType: string, parentNode: Node): void {
    console.log('[Effect] Showing build resonance:', buildType);
    
    // 创建共鸣容器
    const resonance = new Node('BuildResonance');
    resonance.setParent(parentNode);
    resonance.setPosition(0, 0, 0);
    
    // 阶段1：能量汇聚（0.5秒）
    // TODO: 创建3个词条图标向中心移动
    
    // 阶段2：爆发（0.5秒）
    setTimeout(() => {
        // 创建爆发波纹
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const wave = new Node('ResonanceWave');
                wave.setParent(resonance);
                
                const sprite = wave.addComponent(Sprite);
                // TODO: 设置圆形精灵帧，使用流派颜色
                
                const opacity = wave.addComponent(UIOpacity);
                opacity.opacity = 204;
                
                tween(wave)
                    .to(0.5, { scale: new Vec3(5, 5, 1) }, { easing: 'sineOut' })
                    .start();
                
                tween(opacity)
                    .to(0.5, { opacity: 0 })
                    .start();
            }, i * 150);
        }
        
        // 屏幕震动
        shakeScreen(parentNode, 15, 0.5);
        
        // 全屏闪白
        flashScreen(parentNode, 0.3);
    }, 500);
    
    // 阶段3：效果展示（1.0秒）
    setTimeout(() => {
        // TODO: 显示流派名称和效果描述
        
        // 清理
        setTimeout(() => {
            resonance.destroy();
        }, 1000);
    }, 1000);
}

/**
 * 全屏闪白
 */
function flashScreen(parentNode: Node, duration: number): void {
    const flash = new Node('ScreenFlash');
    flash.setParent(parentNode);
    flash.setPosition(0, 0, 0);
    
    const sprite = flash.addComponent(Sprite);
    // TODO: 设置全屏白色精灵
    sprite.color = new Color(255, 255, 255, 128);
    
    const opacity = flash.addComponent(UIOpacity);
    opacity.opacity = 128;
    
    tween(opacity)
        .to(duration / 2, { opacity: 0 })
        .call(() => flash.destroy())
        .start();
}
