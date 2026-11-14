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

DEALNEWS = 'https://www.dealnews.com/rss/todays-edition'
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
        elif re.search(r'\b(shirt|shoes?|sneakers?|shorts|tights|beanie|leggings|hoodie|jacket|jeans|pants|socks|adidas|nike|clothing|coat|polo|dress|fleece|apparel)\b',lower): category='Clothing'
        elif not re.search(r'\b(wrench|drill|impact|saw)\b',lower) and re.search(r'\b(tv|oled|monitor|laptop|headphones?|earbuds|airpods?|ipad|iphone|galaxy|ssd|usb|charger|blu-ray|4k|computer|gaming|tablet|speaker|soundbar|ps5|xbox|rtx|ryzen|intel|pixel)\b',lower): category='Electronics'
        elif re.search(r'\b(lego|toy|doll|game|puzzle|disney|playset)\b',lower): category='Toys & gifts'
        store = ', '.join(s.replace('-', ' ').title() for s in meta.stores[:3]) or 'See source'
        results.append(dict(source='Slickdeals',fetchedAt=now.isoformat(),id=item.findtext('guid', url),title=title,url=url,image=meta.image,store=store,category=category,publishedAt=published.isoformat(),merchantUrl=('https://www.amazon.com/dp/'+meta.asin if meta.asin else None)))
        seen.add(url)
    if not results: raise ValueError('No valid recent items; preserve last successful feed')
    return dict(source='Slickdeals Frontpage RSS',sourceUrl=SOURCE,fetchedAt=now.isoformat(),refreshMinutes=15,deals=results)

def parse_dealnews(raw, now):
    if len(raw)>5_000_000 or b'<!ENTITY' in raw or b'<!DOCTYPE' in raw: raise ValueError('Unsupported feed')
    root=ET.fromstring(raw);results=[];ns='{https://www.dealnews.com/ns/rss/1.0.htm}'
    for item in root.findall('./channel/item')[:100]:
        title=item.findtext('title','').strip();url=item.findtext('link','').strip()
        if urlparse(url).scheme!='https' or urlparse(url).hostname not in ('www.dealnews.com','dealnews.com'): continue
        if not title or re.search(r'\b(expired|dead deal)\b',title,re.I): continue
        try:
            published=email.utils.parsedate_to_datetime(item.findtext('pubDate',''))
            if published.tzinfo is None:published=published.replace(tzinfo=dt.timezone.utc)
            if not dt.timedelta(minutes=-15)<=now-published<=dt.timedelta(hours=48): continue
        except (ValueError,TypeError,OverflowError): continue
        expires=item.findtext(ns+'expires','')
        if expires:
            try:
                expiry=dt.datetime.fromisoformat(expires.replace('Z','+00:00'))
                if expiry.tzinfo and expiry<=now: continue
            except ValueError: expires=''
        price=item.find(ns+'price');amount=None
        if price is not None and price.get('currency')=='USD':
            try:
                value=float(price.text)
                if 0<value<1000000: amount=value
            except (TypeError,ValueError):pass
        img=item.find('{http://search.yahoo.com/mrss/}content');image=img.get('url','') if img is not None else ''
        if urlparse(image).scheme!='https' or urlparse(image).hostname!='d.dlnws.com': image=''
        cat=item.findtext(ns+'category','');lower=(title+' '+cat).lower();category='More deals'
        if re.search(r'\b(christmas|ornament|holiday|wreath|stocking|santa)\b',lower):category='Christmas'
        elif re.search(r'\b(clothing|apparel|intimates|shoes?|sneakers?|pants|shorts|tights|beanie|leggings|hoodie|fleece|shirt|dress|coat|jeans|socks)\b',lower):category='Clothing'
        elif re.search(r'\b(tv|oled|monitor|laptop|headphones?|earbuds|airpods?|ipad|iphone|ssd|usb|computer|tablet|speaker|soundbar|ps5|xbox|electronics|computers)\b',lower):category='Electronics'
        elif re.search(r'\b(toys?|lego|games?|doll|puzzle|playset)\b',lower):category='Toys & gifts'
        results.append(dict(id=item.findtext('guid',url),title=title,url=url,image=image,store=item.findtext(ns+'retailer','See source'),category=category,publishedAt=published.isoformat(),expiresAt=expires or None,price=amount,currency='USD' if amount else None,source='DealNews',fetchedAt=now.isoformat(),descriptionHtml=item.findtext('description',''),merchantUrl=None))
    if not results:raise ValueError('No recent DealNews listings')
    return results

def fetch(url):
    req=urllib.request.Request(url,headers={'User-Agent':'SparkDeals-RSS/1.0 (+https://radiantsparkllc.com/sparkdeals.html)'})
    with urllib.request.urlopen(req,timeout=30) as response:return response.read(5_000_001)

def main():
    now=dt.datetime.now(dt.timezone.utc);output=ROOT/'data/sparkdeals.json'
    try:previous=json.loads(output.read_text())
    except (OSError,ValueError):previous={}
    sources=[];deals=[];success=0
    for name,url,parser in [('Slickdeals',SOURCE,lambda raw:parse_feed(raw,now)['deals']),('DealNews',DEALNEWS,lambda raw:parse_dealnews(raw,now))]:
        try:
            items=parser(fetch(url));success+=1
            sources.append(dict(name=name,url=url,status='ok',fetchedAt=now.isoformat(),count=len(items)))
        except Exception as exc:
            print(name,'refresh failed:',type(exc).__name__)
            items=[d for d in previous.get('deals',[]) if d.get('source')==name and now-dt.datetime.fromisoformat(d.get('fetchedAt',previous.get('fetchedAt'))) < dt.timedelta(hours=6)]
            sources.append(dict(name=name,url=url,status='delayed',fetchedAt=items[0].get('fetchedAt') if items else None,count=len(items)))
        deals.extend(items)
    if not success:raise RuntimeError('All feeds failed; preserve last successful file')
    # Preserve publisher titles, descriptions, links and referral codes intact.
    unique={}
    for d in deals:
        if d['url'] not in unique:unique[d['url']]=d
    data=dict(source='DealNews + Slickdeals RSS',fetchedAt=now.isoformat(),refreshMinutes=15,sources=sources,deals=sorted(unique.values(),key=lambda d:d['publishedAt'],reverse=True))
    output.parent.mkdir(exist_ok=True);temp=output.with_suffix('.tmp');temp.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n');temp.replace(output)
    print('Fetched',len(data['deals']),'RSS listings from',success,'sources at',data['fetchedAt'])

if __name__=='__main__': main()
