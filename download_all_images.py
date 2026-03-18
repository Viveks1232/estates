import re
import os
import urllib.request

properties_file = r'C:\Users\sahab\Downloads\eviv\components\Properties.tsx'
public_dir = r'C:\Users\sahab\Downloads\eviv\public\properties'

if not os.path.exists(public_dir):
    os.makedirs(public_dir)

with open(properties_file, 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r'/properties/([a-zA-Z0-9_-]+)\.jpg'
matches = re.findall(pattern, content)
unique_ids = list(set(matches))
print(f"Found {len(unique_ids)} unique images to download.")

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

for i, gid in enumerate(unique_ids):
    out_path = os.path.join(public_dir, f"{gid}.jpg")
    if os.path.exists(out_path):
        print(f"[{i+1}/{len(unique_ids)}] Already exists: {gid}")
        continue
    
    url = f"https://lh3.googleusercontent.com/d/{gid}"
    print(f"[{i+1}/{len(unique_ids)}] Downloading: {gid}")
    
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as response:
            with open(out_path, 'wb') as f:
                f.write(response.read())
        print(f"  Saved to {out_path}")
    except Exception as e:
        print(f"  Error: {e}")

print("Done!")
