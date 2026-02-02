#!/usr/bin/env python3
"""
自动配置Cocos Creator场景 - 添加UIManager和AudioManager
"""

import json
import os
import uuid

# 场景文件路径
SCENE_PATH = "E:/Project/LianSe/LSProject/assets/Main.scene"

def generate_uuid():
    """生成Cocos Creator风格的UUID"""
    return str(uuid.uuid4()).replace('-', '')[:22]

def add_ui_audio_managers(scene_data):
    """自动添加UIManager和AudioManager到场景"""
    
    print("[*] Starting scene modification...")
    
    # 找到Canvas节点（通常是index 2）
    canvas_node = scene_data[2]
    if canvas_node.get("_name") != "Canvas":
        print("❌ 未找到Canvas节点")
        return False
    
    print(f"✅ 找到Canvas节点")
    
    # 当前最大ID
    current_max_id = len(scene_data) - 1
    
    # === 1. 创建ComboNode节点 ===
    combo_node_id = current_max_id + 1
    combo_label_id = current_max_id + 2
    combo_uitransform_id = current_max_id + 3
    
    combo_node = {
        "__type__": "cc.Node",
        "_name": "ComboNode",
        "_objFlags": 0,
        "__editorExtras__": {},
        "_parent": {"__id__": 2},  # Canvas
        "_children": [],
        "_active": False,  # 初始隐藏
        "_components": [
            {"__id__": combo_uitransform_id},
            {"__id__": combo_label_id}
        ],
        "_prefab": None,
        "_lpos": {
            "__type__": "cc.Vec3",
            "x": 0,
            "y": 0,
            "z": 0
        },
        "_lrot": {
            "__type__": "cc.Quat",
            "x": 0,
            "y": 0,
            "z": 0,
            "w": 1
        },
        "_lscale": {
            "__type__": "cc.Vec3",
            "x": 1,
            "y": 1,
            "z": 1
        },
        "_mobility": 0,
        "_layer": 33554432,
        "_euler": {
            "__type__": "cc.Vec3",
            "x": 0,
            "y": 0,
            "z": 0
        },
        "_id": generate_uuid()
    }
    
    combo_label = {
        "__type__": "cc.Label",
        "_name": "",
        "_objFlags": 0,
        "__editorExtras__": {},
        "node": {"__id__": combo_node_id},
        "_enabled": True,
        "__prefab": None,
        "_customMaterial": None,
        "_srcBlendFactor": 2,
        "_dstBlendFactor": 4,
        "_color": {
            "__type__": "cc.Color",
            "r": 255,
            "g": 204,
            "b": 0,
            "a": 255
        },
        "_string": "×2 连锁！",
        "_horizontalAlign": 1,
        "_verticalAlign": 1,
        "_actualFontSize": 60,
        "_fontSize": 60,
        "_fontFamily": "Arial",
        "_lineHeight": 60,
        "_overflow": 0,
        "_enableWrapText": True,
        "_font": None,
        "_isSystemFontUsed": True,
        "_spacingX": 0,
        "_isItalic": False,
        "_isBold": False,
        "_isUnderline": False,
        "_underlineHeight": 2,
        "_cacheMode": 0,
        "_id": generate_uuid()
    }
    
    combo_uitransform = {
        "__type__": "cc.UITransform",
        "_name": "",
        "_objFlags": 0,
        "__editorExtras__": {},
        "node": {"__id__": combo_node_id},
        "_enabled": True,
        "__prefab": None,
        "_contentSize": {
            "__type__": "cc.Size",
            "width": 200,
            "height": 100
        },
        "_anchorPoint": {
            "__type__": "cc.Vec2",
            "x": 0.5,
            "y": 0.5
        },
        "_id": generate_uuid()
    }
    
    # === 2. 创建UIManager组件 ===
    ui_manager_id = current_max_id + 4
    ui_manager = {
        "__type__": "e4c3cCDLs1OVYBe/aYmxKSn",  # UIManager的编译后类型ID（可能需要调整）
        "_name": "",
        "_objFlags": 0,
        "__editorExtras__": {},
        "node": {"__id__": 2},  # Canvas
        "_enabled": True,
        "__prefab": None,
        "scorePopupNode": None,
        "comboNode": {"__id__": combo_node_id},
        "comboLabel": {"__id__": combo_label_id},
        "_id": generate_uuid()
    }
    
    # === 3. 创建AudioManager组件 ===
    audio_manager_id = current_max_id + 5
    audio_manager = {
        "__type__": "d0bb1XLcbJNQY+sXmZ8g1Pw",  # AudioManager的编译后类型ID（可能需要调整）
        "_name": "",
        "_objFlags": 0,
        "__editorExtras__": {},
        "node": {"__id__": 2},  # Canvas
        "_enabled": True,
        "__prefab": None,
        "_id": generate_uuid()
    }
    
    # === 4. 添加到场景数据 ===
    scene_data.append(combo_node)
    scene_data.append(combo_label)
    scene_data.append(combo_uitransform)
    scene_data.append(ui_manager)
    scene_data.append(audio_manager)
    
    # === 5. 更新Canvas的children和components ===
    canvas_node["_children"].append({"__id__": combo_node_id})
    canvas_node["_components"].append({"__id__": ui_manager_id})
    canvas_node["_components"].append({"__id__": audio_manager_id})
    
    print(f"✅ 添加了ComboNode (ID: {combo_node_id})")
    print(f"✅ 添加了UIManager (ID: {ui_manager_id})")
    print(f"✅ 添加了AudioManager (ID: {audio_manager_id})")
    
    # === 6. 更新GameManager的引用 ===
    # 找到GameManager组件（通常在index 10左右）
    for i, obj in enumerate(scene_data):
        if obj.get("__type__") == "5edcfmSIXpPZqWKSQDe3mhu":  # GameManager
            obj["uiManager"] = {"__id__": ui_manager_id}
            obj["audioManager"] = {"__id__": audio_manager_id}
            print(f"✅ 更新了GameManager引用 (ID: {i})")
            break
    
    return True

def main():
    print("=" * 50)
    print("Cocos Creator Auto Config Tool")
    print("=" * 50)
    
    # 读取场景文件
    print(f"Reading scene: {SCENE_PATH}")
    with open(SCENE_PATH, 'r', encoding='utf-8') as f:
        scene_data = json.load(f)
    
    print(f"✅ 场景对象数: {len(scene_data)}")
    
    # 备份原文件
    backup_path = SCENE_PATH + ".backup"
    with open(backup_path, 'w', encoding='utf-8') as f:
        json.dump(scene_data, f, ensure_ascii=False)
    print(f"✅ 已备份到: {backup_path}")
    
    # 修改场景
    if add_ui_audio_managers(scene_data):
        # 保存修改后的场景
        with open(SCENE_PATH, 'w', encoding='utf-8') as f:
            json.dump(scene_data, f, ensure_ascii=False, indent=2)
        
        print("=" * 50)
        print("🎉 配置完成！")
        print("=" * 50)
        print("📋 已添加:")
        print("  - UIManager组件")
        print("  - AudioManager组件")
        print("  - ComboNode节点")
        print("  - GameManager引用")
        print()
        print("🎮 下一步:")
        print("  1. 在Cocos Creator中刷新项目")
        print("  2. 运行游戏测试")
        print("=" * 50)
        return 0
    else:
        print("❌ 配置失败")
        return 1

if __name__ == "__main__":
    exit(main())
