import json

with open('assets/Main.scene', 'r', encoding='utf-8') as f:
    scene = json.load(f)

print(f"Scene objects: {len(scene)}")

# 备份
with open('assets/Main.scene.bak3', 'w', encoding='utf-8') as f:
    json.dump(scene, f, ensure_ascii=False, indent=2)

canvas = scene[2]
max_id = len(scene) - 1
gc_id = max_id + 1

# GameCore node
gc_node = {
    "__type__": "cc.Node",
    "_name": "GameCore",
    "_parent": {"__id__": 2},
    "_children": [],
    "_active": True,
    "_components": [],
    "_lpos": {"__type__": "cc.Vec3", "x": 0, "y": 0, "z": 0},
    "_lrot": {"__type__": "cc.Quat", "x": 0, "y": 0, "z": 0, "w": 1},
    "_lscale": {"__type__": "cc.Vec3", "x": 1, "y": 1, "z": 1},
    "_id": "gc-node-001"
}

scene.append(gc_node)
canvas["_children"].append({"__id__": gc_id})

with open('assets/Main.scene', 'w', encoding='utf-8') as f:
    json.dump(scene, f, ensure_ascii=False, indent=2)

print(f"Added GameCore at ID {gc_id}")
print("Done")
