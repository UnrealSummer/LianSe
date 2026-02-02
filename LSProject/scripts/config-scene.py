# -*- coding: utf-8 -*-
import json
import sys

SCENE_FILE = "E:/Project/LianSe/LSProject/assets/Main.scene"

print("Loading scene...")
with open(SCENE_FILE, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Scene has {len(data)} objects")

# Backup
with open(SCENE_FILE + ".backup", 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print("Backup created")

# Find Canvas (should be index 2)
canvas = data[2]
print(f"Canvas found: {canvas['_name']}")

# Current max ID
max_id = len(data) - 1
print(f"Max ID: {max_id}")

# Add UIManager component to Canvas
ui_mgr_id = max_id + 1
ui_mgr = {
    "__type__": "custom",
    "_name": "UIManager",
    "__prefab": None,
    "node": {"__id__": 2},
    "_enabled": True,
    "_id": "ui-manager-001"
}
data.append(ui_mgr)
canvas["_components"].append({"__id__": ui_mgr_id})
print(f"Added UIManager at ID {ui_mgr_id}")

# Add AudioManager
audio_mgr_id = max_id + 2  
audio_mgr = {
    "__type__": "custom",
    "_name": "AudioManager",
    "__prefab": None,
    "node": {"__id__": 2},
    "_enabled": True,
    "_id": "audio-manager-001"
}
data.append(audio_mgr)
canvas["_components"].append({"__id__": audio_mgr_id})
print(f"Added AudioManager at ID {audio_mgr_id}")

# Save
with open(SCENE_FILE, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("="*50)
print("DONE! Scene configured successfully")
print("Please refresh Cocos Creator and test")
print("="*50)
