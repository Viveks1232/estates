import re
import os
import sys
import subprocess

properties_file = r'c:\Users\sahab\Downloads\eviv\components\Properties.tsx'
public_dir = r'c:\Users\sahab\Downloads\eviv\public\properties'

if not os.path.exists(public_dir):
    os.makedirs(public_dir)

with open(properties_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Find all Google Drive image IDs
pattern = r'https://lh3\.googleusercontent\.com/d/([a-zA-Z0-9_-]+)'
matches = re.findall(pattern, content)

unique_ids = set(matches)
print(f"Found {len(unique_ids)} unique images to download.")

for gid in unique_ids:
    out_path = os.path.join(public_dir, f"{gid}.jpg")
    if not os.path.exists(out_path):
        subprocess.run([sys.executable, '-m', 'gdown', f'https://drive.google.com/uc?id={gid}', '-O', out_path])
    
    # Replace in content
    content = content.replace(f'https://lh3.googleusercontent.com/d/{gid}', f'/properties/{gid}.jpg')

# Write back the modified content
with open(properties_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done replacing URLs and downloading!")
