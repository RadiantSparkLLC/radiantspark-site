"""Fetch public RSS headlines; never execute or render publisher HTML."""
import datetime as dt
import email.utils
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import urllib.request
from urllib.parse import urlparse
import xml.etree.ElementTree as ET

SOURCE = 'https://slickdeals.net/newsearch.php?mode=frontpage&searcharea=deals&searchin=first&rss=1'
ROOT = Path(__file__).resolve().parents[1]

class Metadata(HTMLParser):
    def __init__(self):
        super().__init__(); self.image = ''; self.asin = ''; self.stores = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'img' and not self.image:
            u = a.get('src', '')
            if urlparse(u).scheme == 'https' and urlparse(u).hostname == 'static.slickdealscdn.com':
                self.image = u
        if tag == 'a':
            asin = a.get('data-aps-asin', '')
            if re.fullmatch(r'[A-Z0-9]{10}', asin): self.asin = asin
            name = a.get('data-store-slug', '')
            if re.fullmatch(r'[a-z0-9-]{1,50}', name) and name not in self.stores:
                self.stores.append(name)

def parse_feed(raw, now):
    if len(raw) > 5_000_000: raise ValueError('Feed exceeds size limit')
    if b'<!ENTITY' in raw or b'<!DOCTYPE' in raw: raise ValueError('Unsupported XML declaration')
    root = ET.fromstring(raw)
    results = []; seen = set()
    for item in root.findall('./channel/item')[:100]:
        title = html.unescape(item.findtext('title', '')).strip()[:300]
        url = item.findtext('link', '').strip()
        parsed = urlparse(url)
        if not title or parsed.scheme != 'https' or parsed.hostname != 'slickdeals.net' or not parsed.path.startswith('/f/') or url in seen:
            continue
        if re.search(r'\b(expired|dead deal)\b', title, re.I): continue
        try:
            published = email.utils.parsedate_to_datetime(item.findtext('pubDate', ''))
            if published.tzinfo is None: published = published.replace(tzinfo=dt.timezone.utc)
            if not dt.timedelta(minutes=-15) <= now-published <= dt.timedelta(hours=48): continue
        except (ValueError,TypeError,OverflowError): continue
        meta = Metadata(); meta.feed(item.findtext('{http://purl.org/rss/1.0/modules/content/}encoded', ''))
        lower = title.lower()
        category = 'More deals'
        if re.search(r'\b(christmas|ornament|holiday|wreath|stocking|santa)\b',lower): category='Christmas'
        elif re.search(r'\b(shirt|shoes?|sneakers?|hoodie|jacket|jeans|pants|socks|adidas|nike|clothing|coat|polo|dress|fleece|apparel)\b',lower): category='Clothing'
        elif re.search(r'\b(tv|oled|monitor|laptop|headphones?|earbuds|airpods?|ipad|iphone|galaxy|ssd|usb|charger|blu-ray|4k|computer|gaming|tablet|speaker|rtx|ryzen|intel|pixel)\b',lower): category='Electronics'
        elif re.search(r'\b(lego|toy|doll|game|puzzle|disney|playset)\b',lower): category='Toys & gifts'
        store = ', '.join(s.replace('-', ' ').title() for s in meta.stores[:3]) or 'See source'
        results.append(dict(id=item.findtext('guid', url),title=title,url=url,image=meta.image,store=store,category=category,publishedAt=published.isoformat(),merchantUrl=('https://www.amazon.com/dp/'+meta.asin if meta.asin else None)))
        seen.add(url)
    if not results: raise ValueError('No valid recent items; preserve last successful feed')
    return dict(source='Slickdeals Frontpage RSS',sourceUrl=SOURCE,fetchedAt=now.isoformat(),refreshMinutes=15,deals=results)

def main():
    req=urllib.request.Request(SOURCE,headers={'User-Agent':'SparkDeals-RSS/1.0 (+https://radiantsparkllc.com/sparkdeals.html)'})
    with urllib.request.urlopen(req,timeout=30) as response:
        raw=response.read(5_000_001)
    data=parse_feed(raw,dt.datetime.now(dt.timezone.utc))
    output=ROOT/'data/sparkdeals.json';output.parent.mkdir(exist_ok=True)
    temp=output.with_suffix('.tmp');temp.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n');temp.replace(output)
    print('Fetched',len(data['deals']),'RSS listings at',data['fetchedAt'])

if __name__=='__main__': main()
