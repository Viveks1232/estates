import urllib.request
import re
import json
import sys

url = "https://drive.google.com/drive/folders/1u3_ade0pU4ULhFYbkoSwb56lcDAhbvp6?usp=drive_link"

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        print("Fetched HTML successfully. Length:", len(html))
        # Google Drive public folders contain data in window._DRIVE_contextData or window._DRIVE_INIT_DATA
        match = re.search(r'window\._DRIVE_INIT_DATA = (.*?);</script>', html)
        if match:
            print("Found DRIVE_INIT_DATA")
        else:
            print("No INIT_DATA found.")
            # write html to file for inspection
            with open("drive_html.html", "w", encoding="utf-8") as f:
                f.write(html)
except Exception as e:
    print(e)
