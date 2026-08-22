import httpx
from bs4 import BeautifulSoup

def print_clean_text():
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    }
    url = "https://www.chittorgarh.com/report/ipo-in-india-list-mainboard-sme/82/"
    with httpx.Client(follow_redirects=True, headers=headers, timeout=12.0) as client:
        res = client.get(url)
        soup = BeautifulSoup(res.text, "html.parser")
        
        # Extract text lines
        lines = [line.strip() for line in soup.get_text().split("\n") if line.strip()]
        print(f"Total lines: {len(lines)}")
        
        # Look for IPO names or headers
        ipo_lines = [line for line in lines if "IPO" in line or "Ltd" in line or "Limited" in line]
        print(f"Lines containing IPO/Ltd: {len(ipo_lines)}")
        for l in ipo_lines[:20]:
            print(" ->", l[:100])

if __name__ == "__main__":
    print_clean_text()
