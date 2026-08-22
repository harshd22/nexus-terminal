import httpx
import json
import re

url = "https://mtf.trading"
r = httpx.get(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}, follow_redirects=True)

# Find all JSON URLs in page or JS
json_urls = re.findall(r'href=["\']([^"\']+\.json)["\']', r.text) + re.findall(r'src=["\']([^"\']+\.json)["\']', r.text) + re.findall(r'["\'](/data/[^"\']+)["\']', r.text) + re.findall(r'["\'](/api/v1/[^"\']+)["\']', r.text)

print("Found URLs:", set(json_urls))

# Test data files if any
data_files = [
    "/data/summary.json",
    "/data/stocks.json",
    "/data/top.json",
    "/data/brokers.json",
    "/data/sectors.json",
    "/api/v1/summary",
    "/api/v1/brokers",
    "/api/v1/global",
]

for df in data_files:
    try:
        resp = httpx.get("https://mtf.trading" + df, timeout=5)
        print(f"File {df} -> Status {resp.status_code}")
        if resp.status_code == 200:
            content = resp.json()
            if isinstance(content, dict):
                print(f"  Keys: {list(content.keys())}")
            elif isinstance(content, list):
                print(f"  Array len: {len(content)}")
    except Exception as e:
        print(f"File {df} -> Error: {e}")
