"""Busca en alternate.de por EAN los productos sin precio y lee precio (€ con IVA), disponibilidad y MPN
del JSON-LD de la ficha. Pausa de 12 s entre peticiones (alternate pone Cloudflare 429 si se va rápido).
python alternate_ean.py <salida.json>"""
import json, re, sys, time, urllib.request, urllib.error
sys.stdout.reconfigure(encoding="utf-8")
CAT = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo\catalogo-final.json"
OUT = sys.argv[1]
H = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36",
     "Accept-Language": "de-DE,de;q=0.9"}
def get(url):
    for intento in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=H), timeout=40) as r:
                return r.read().decode("utf-8", "replace")
        except urllib.error.HTTPError as e:
            if e.code == 429: print("  429, espero 120 s", flush=True); time.sleep(120); continue
            return ""
        except Exception as e:
            print("  error", e, flush=True); time.sleep(20)
    return ""
cat = json.load(open(CAT, encoding="utf-8"))
res = {}
for i, p in enumerate(cat):
    if p["precio_usd"] is not None or not p.get("ean"): continue
    html = get(f"https://www.alternate.de/listing.xhtml?q={p['ean']}"); time.sleep(12)
    links = list(dict.fromkeys(re.findall(r'href="(https://www\.alternate\.de/[^"]+/html/product/\d+)"', html)))
    r = {"producto": f"{p['marca']} {p['modelo']}", "mpn_cat": p["mpn"], "enlaces": len(links)}
    if links:
        f = get(links[0]); time.sleep(12)
        precio = re.search(r'"price"\s*:\s*"?([\d.]+)"?', f)
        disp = re.search(r'"availability"\s*:\s*"([^"]+)"', f)
        mpn = re.search(r'"mpn"\s*:\s*"([^"]+)"', f)
        gtin = re.search(r'"gtin1?3?"\s*:\s*"(\d+)"', f)
        r.update(url=links[0], eur=float(precio.group(1)) if precio else None, disp=disp.group(1).split("/")[-1] if disp else None,
                 mpn=mpn.group(1) if mpn else None, gtin=gtin.group(1) if gtin else None)
    res[i] = r
    print(f"#{i:3} {r['producto'][:40]:40} enlaces={r['enlaces']} eur={r.get('eur')} {r.get('disp')} mpn={r.get('mpn')}", flush=True)
    json.dump(res, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("FIN", len(res))
