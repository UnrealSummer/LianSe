import json

with open('assets/Main.scene', 'r', encoding='utf-8') as f:
    scene = json.load(f)

print(f"Current scene objects: {len(scene)}")

# 备份
with open('assets/Main.scene.bak4', 'w', encoding='utf-8') as f:
    json.dump(scene, f, ensure_ascii=False, indent=2)

# 找到GameCore节点（ID 39）
gamecore_node = scene[39]
max_id = len(scene) - 1

# 创建组件ID
comp_start = max_id + 1
grid_id = comp_start
enemy_id = comp_start + 1
damage_id = comp_start + 2
modifier_id = comp_start + 3
progression_id = comp_start + 4
gamecore_comp_id = comp_start + 5

# GridSystem组件
grid_comp = {
    "__type__": "cc.Component",
    "_name": "",
    "_objFlags": 0,
    "node": {"__id__": 39},
    "_enabled": True,
    "_id": "grid-system-001",
    "__scriptAsset": None,
    "gridWidth": 5,
    "gridHeight": 5,
    "cellSize": 100
}

# EnemySystem组件
enemy_comp = {
    "__type__": "cc.Component",
    "_name": "",
    "_objFlags": 0,
    "node": {"__id__": 39},
    "_enabled": True,
    "_id": "enemy-system-001",
    "__scriptAsset": None,
    "gridSystem": {"__id__": grid_id},
    "spawnInterval": 2.0
}

# DamageSystem组件
damage_comp = {
    "__type__": "cc.Component",
    "_name": "",
    "_objFlags": 0,
    "node": {"__id__": 39},
    "_enabled": True,
    "_id": "damage-system-001",
    "__scriptAsset": None
}

# ModifierSystem组件
modifier_comp = {
    "__type__": "cc.Component",
    "_name": "",
    "_objFlags": 0,
    "node": {"__id__": 39},
    "_enabled": True,
    "_id": "modifier-system-001",
    "__scriptAsset": None
}

# ProgressionManager组件
progression_comp = {
    "__type__": "cc.Component",
    "_name": "",
    "_objFlags": 0,
    "node": {"__id__": 39},
    "_enabled": True,
    "_id": "progression-mgr-001",
    "__scriptAsset": None,
    "initialLevel": 1
}

# GameCore主组件
gamecore_comp = {
    "__type__": "cc.Component",
    "_name": "",
    "_objFlags": 0,
    "node": {"__id__": 39},
    "_enabled": True,
    "_id": "gamecore-comp-001",
    "__scriptAsset": None,
    "gridSystem": {"__id__": grid_id},
    "enemySystem": {"__id__": enemy_id},
    "damageSystem": {"__id__": damage_id},
    "modifierSystem": {"__id__": modifier_id},
    "progressionManager": {"__id__": progression_id}
}

# 添加所有组件到场景
scene.extend([
    grid_comp,
    enemy_comp,
    damage_comp,
    modifier_comp,
    progression_comp,
    gamecore_comp
])

# 更新GameCore节点的_components数组
gamecore_node["_components"] = [
    {"__id__": grid_id},
    {"__id__": enemy_id},
    {"__id__": damage_id},
    {"__id__": modifier_id},
    {"__id__": progression_id},
    {"__id__": gamecore_comp_id}
]

# 保存
with open('assets/Main.scene', 'w', encoding='utf-8') as f:
    json.dump(scene, f, ensure_ascii=False, indent=2)

print(f"Added 6 components (IDs {comp_start}-{comp_start+5})")
print("Components configured with cross-references")
print("Done")
