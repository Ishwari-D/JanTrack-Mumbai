import json
import shutil
import os
import re

# Define paths
FILE_PATH = r"c:\Users\ACER\OneDrive\Desktop\JanTrack Mumbai\JanTrack Mumbai\data_stream.json"
BACKUP_PATH = r"c:\Users\ACER\OneDrive\Desktop\JanTrack Mumbai\JanTrack Mumbai\data_stream_backup_assets.json"

def backup_file(src, dest):
    try:
        shutil.copy(src, dest)
        print(f"Backup created at {dest}")
        return True
    except Exception as e:
        print(f"Error creating backup: {e}")
        return False

def update_assets():
    if not os.path.exists(FILE_PATH):
        print(f"File not found: {FILE_PATH}")
        return

    if not backup_file(FILE_PATH, BACKUP_PATH):
        return

    try:
        with open(FILE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error reading JSON: {e}")
        return

    updated_count = 0
    
    # Check if data is a list
    if isinstance(data, list):
        candidates = data
    elif isinstance(data, dict) and 'candidates' in data:
        candidates = data['candidates']
    else:
        print("Unknown JSON structure")
        return

    for candidate in candidates:
        if 'assets' not in candidate:
            continue
        
        assets_str = candidate['assets']
        # Regex to match "₹<number> Lakhs"
        match = re.search(r'₹(\d+)\s*Lakhs', assets_str, re.IGNORECASE)
        
        if match:
            try:
                lakhs_value = int(match.group(1))
                if lakhs_value > 100:
                    crores_value = lakhs_value / 100
                    # Format to 2 decimal places, e.g. 1.37
                    new_assets_str = f"₹{crores_value:.2f} Cr"
                    
                    print(f"Updating {candidate.get('name', 'Unknown')}: {assets_str} -> {new_assets_str}")
                    candidate['assets'] = new_assets_str
                    updated_count += 1
            except ValueError:
                continue

    if updated_count > 0:
        try:
            with open(FILE_PATH, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=4)
            print(f"\nSuccessfully updated {updated_count} candidates.")
        except Exception as e:
            print(f"Error saving JSON: {e}")
    else:
        print("\nNo changes needed.")

if __name__ == "__main__":
    update_assets()
