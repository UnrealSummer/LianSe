import json

# 读取场景
with open('assets/Main.scene', 'r', encoding='utf-8') as f:
    scene = json.load(f)

print(f"Current scene objects: {len(scene)}")

# 备份
with open('assets/Main.scene.backup2', 'w', encoding='utf-8') as f:
    json.dump(scene, f, ensure_ascii=False, indent=2)

# 找到Canvas (通常是index 2)
canvas = scene[2]
print(f"Canvas: {canvas['_name']}")

# 添加GameCore节点
max_id = len(scene) - 1
gamecore_id = max_id + 1

gamecore_node = {
    "__type__": "cc.Node",
    "_name": "GameCore",
    "_parent": {"__id__": 2},
    "_children": [],
    "_active": True,
    "_components": [{"__id__": gamecore_id + 1}],
    "_lpos": {"__type__": "cc.Vec3", "x": 0, "y": 0, "z": 0},
    "_lrot": {"__type__": "cc.Quat", "x": 0, "y": 0, "z": 0, "w": 1},
    "_lscale": {"__type__": "cc.Vec3", "x": 1, "y": 1, "z": 1},
    "_id": "gamecore-node-id"
}

gamecore_comp = {
    "__type__": "custom",
    "_name": "GameCore",
    "node": {"__id__": gamecore_id},
    "_enabled": True,
    "_id": "gamecore-comp-id"
}

scene.append(gamecore_node)
scene.append(gamecore_comp)
canvas["_children"].append({"__id__": gamecore_id})

# 保存
with open('assets/Main.scene', 'w', encoding='utf-8') as f:
    json.dump(scene, f, ensure_ascii=False, indent=2)

print(f"✅ Added GameCore node (ID: {gamecore_id})")
print("Refresh Cocos Creator to see changes")
