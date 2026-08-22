import feedparser
from bs4 import BeautifulSoup
import re

def parse_ipowatch_feed():
    feed_url = "https://ipowatch.in/feed/"
    d = feedparser.parse(feed_url)
    print(f"Total entries: {len(d.entries)}")
    
    ipos = []
    for entry in d.entries:
        title = entry.get("title", "")
        link = entry.get("link", "")
        summary = entry.get("summary", "")
        soup = BeautifulSoup(summary, "html.parser")
        text = soup.get_text()
        
        # Check if title contains IPO or GMP
        if "IPO" in title:
            print(f"\nTitle: {title}")
            print(f"Link: {link}")
            # Try parsing GMP if mentioned in text
            gmp_match = re.search(r"GMP[^\d]*?(\d+)", text, re.IGNORECASE)
            gmp_val = int(gmp_match.group(1)) if gmp_match else 0
            print(f"Extracted GMP: ₹{gmp_val}")

if __name__ == "__main__":
    parse_ipowatch_feed()
