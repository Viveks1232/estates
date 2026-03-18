import re

properties_file = r'c:\Users\sahab\Downloads\eviv\components\Properties.tsx'

with open(properties_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all https://drive.google.com/uc?export=view&id=[ID]
# with /gdrive/[ID]
new_content = re.sub(
    r'https://drive\.google\.com/uc\?export=view&id=([a-zA-Z0-9_-]+)',
    r'/gdrive/\1',
    content
)

with open(properties_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Replaced all Google Drive URLs with /gdrive/ proxy URLs")
