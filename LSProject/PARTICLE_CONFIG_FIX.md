# ParticleManager 正确配置指南

## ❌ 错误配置

你当前配置的是：
- Star Particle Frames → `effects` 文件夹

这是错误的！不能拖入文件夹。

---

## ✅ 正确配置

### Star Particle Frames 应该配置5个单独的图片：

1. 在ParticleManager组件中找到 **Star Particle Frames**
2. 设置 **Size = 5**
3. 依次拖入5个PNG文件（不是文件夹！）：

| Element | 拖入的文件 |
|---------|-----------|
| Element 0 | `textures/effects/star_particle_1.png` |
| Element 1 | `textures/effects/star_particle_2.png` |
| Element 2 | `textures/effects/star_particle_3.png` |
| Element 3 | `textures/effects/star_particle_4.png` |
| Element 4 | `textures/effects/star_particle_5.png` |

### Circle Particle Frames 应该配置3个单独的图片：

1. 找到 **Circle Particle Frames**
2. 设置 **Size = 3**
3. 依次拖入3个PNG文件：

| Element | 拖入的文件 |
|---------|-----------|
| Element 0 | `textures/effects/circle_particle_1.png` |
| Element 1 | `textures/effects/circle_particle_2.png` |
| Element 2 | `textures/effects/circle_particle_3.png` |

---

## 📝 操作步骤

1. 选中ParticleManager节点
2. 在属性检查器中找到ParticleManager脚本
3. 展开 **Star Particle Frames** 数组
4. 点击 **Size** 输入框，输入 `5`，按回车
5. 会出现5个Element槽位
6. 在资源管理器中找到 `assets/textures/effects/`
7. **一个一个地**拖入5个star_particle_X.png文件到对应的Element槽位
8. 同样的方式配置Circle Particle Frames（3个文件）

---

## 🎯 配置完成后应该看到

**Star Particle Frames:**
```
Size: 5
Element 0: [star_particle_1 图标]
Element 1: [star_particle_2 图标]
Element 2: [star_particle_3 图标]
Element 3: [star_particle_4 图标]
Element 4: [star_particle_5 图标]
```

**Circle Particle Frames:**
```
Size: 3
Element 0: [circle_particle_1 图标]
Element 1: [circle_particle_2 图标]
Element 2: [circle_particle_3 图标]
```

---

## ⚠️ 注意事项

- ❌ 不要拖入文件夹
- ❌ 不要拖入.meta文件
- ✅ 只拖入.png图片文件
- ✅ 确保每个Element都有图片
- ✅ 图片应该显示为小图标，不是文件夹图标

---

配置完成后保存场景，运行游戏测试粒子效果！
