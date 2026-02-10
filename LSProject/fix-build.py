#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
WeChat Mini Game Post-Build Fix Script
微信小游戏构建后修复脚本
"""

import os
import json
import shutil

def main():
    print("=" * 50)
    print("  WeChat Mini Game Post-Build Fix")
    print("=" * 50)
    print()
    
    # Step 1: Copy cloudfunctions
    print("[1/2] Copying cloudfunctions...")
    src = "cloudfunctions"
    dst = "build/wechatgame-001/cloudfunctions"
    
    if os.path.exists(dst):
        shutil.rmtree(dst)
    
    shutil.copytree(src, dst)
    print("[OK] cloudfunctions copied")
    print()
    
    # Step 2: Fix project.config.json
    print("[2/2] Fixing project.config.json...")
    config_path = "build/wechatgame-001/project.config.json"
    
    with open(config_path, 'r', encoding='utf-8') as f:
        config = json.load(f)
    
    # Fix libVersion
    config['libVersion'] = '3.14.2'
    
    # Add cloud configs
    config['cloudfunctionRoot'] = 'cloudfunctions/'
    config['cloudbaseRoot'] = 'cloudfunctions/'
    config['cloudfunctionTemplateRoot'] = 'cloudfunctionTemplate/'
    config['cloudbaseEnv'] = 'cloud1-1gmq4aiz75a438a0'
    
    with open(config_path, 'w', encoding='utf-8') as f:
        json.dump(config, f, indent=4, ensure_ascii=False)
    
    print("[OK] project.config.json fixed")
    print()
    
    print("=" * 50)
    print("  Post-Build Fix Complete!")
    print("=" * 50)
    print()
    print("You can now open the project in WeChat DevTools:")
    print("  build/wechatgame-001")
    print()

if __name__ == '__main__':
    main()
