#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
下载Kenney UI Pack资源
"""

import os
import sys
import urllib.request
import zipfile
import shutil

# 设置UTF-8输出
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def download_kenney_ui():
    """下载并解压Kenney UI Pack"""
    
    # Kenney UI Pack下载链接 (官网直链)
    url = "https://kenney.nl/media/pages/assets/ui-pack/af874291da-1718203990/kenney_ui-pack.zip"
    
    # 目标目录
    base_dir = os.path.dirname(os.path.abspath(__file__))
    zip_path = os.path.join(base_dir, "kenney_ui_pack.zip")
    extract_dir = os.path.join(base_dir, "kenney")
    
    print("[Download] Starting Kenney UI Pack download...")
    print(f"URL: {url}")
    
    try:
        # 下载文件
        print("[Download] Downloading...")
        urllib.request.urlretrieve(url, zip_path)
        print(f"[OK] Downloaded: {zip_path}")
        
        # 解压文件
        print("[Extract] Extracting...")
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_dir)
        print(f"[OK] Extracted: {extract_dir}")
        
        # 删除zip文件
        os.remove(zip_path)
        print("[Clean] Removed temporary file")
        
        # 显示目录结构
        print("\n[Structure] Resource directory:")
        for root, dirs, files in os.walk(extract_dir):
            level = root.replace(extract_dir, '').count(os.sep)
            indent = ' ' * 2 * level
            print(f"{indent}{os.path.basename(root)}/")
            if level < 2:  # 只显示前两层
                subindent = ' ' * 2 * (level + 1)
                for file in files[:5]:  # 每个目录只显示前5个文件
                    print(f"{subindent}{file}")
                if len(files) > 5:
                    print(f"{subindent}... and {len(files) - 5} more files")
        
        print("\n[Success] Kenney UI Pack downloaded!")
        print(f"[Location] {extract_dir}")
        
    except Exception as e:
        print(f"[Error] Download failed: {e}")
        if os.path.exists(zip_path):
            os.remove(zip_path)

if __name__ == "__main__":
    download_kenney_ui()
