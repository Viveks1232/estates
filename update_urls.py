import re

properties_file = r'c:\Users\sahab\Downloads\eviv\components\Properties.tsx'

with open(properties_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all https://lh3.googleusercontent.com/d/[ID]
# with https://drive.google.com/uc?export=view&id=[ID]
new_content = re.sub(
    r'https://lh3\.googleusercontent\.com/d/([a-zA-Z0-9_-]+)',
    r'https://drive.google.com/uc?export=view&id=\1',
    content
)

with open(properties_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Replaced all lh3 URLs with drive.google.com/uc URLs")
