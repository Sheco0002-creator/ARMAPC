"""Análisis sólo de fotos 'high' (las 'medium' son copias de 500 px con el mismo nombre)."""
import json, os, sys, collections
from PIL import Image
sys.stdout.reconfigure(encoding="utf-8")
BASE = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo"
OUT = os.path.dirname(os.path.abspath(__file__))
cat = json.load(open(os.path.join(BASE, "catalogo-final.json"), encoding="utf-8"))
U = 900

def viva(r): return os.path.isfile(os.path.join(BASE, r))
def lado(r):
    with Image.open(os.path.join(BASE, r)) as im: return max(im.size), im.size

res = []
for i, p in enumerate(cat):
    il = p.get("imagenes_local", {})
    high = [r for r in il.get("high", []) if viva(r)]
    med = [r for r in il.get("medium", []) if viva(r)]
    stem = lambda r: os.path.splitext(os.path.basename(r))[0]
    hn = {stem(r) for r in high}
    med_sin_high = [r for r in med if stem(r) not in hn]
    fotos = []
    for r in high + med_sin_high:
        l, s = lado(r)
        fotos.append(dict(ruta=r, lado=l, w=s[0], h=s[1], medium=r in med_sin_high))
    princ = p.get("imagen_principal", "")
    res.append(dict(i=i, cat=p["categoria"], marca=p["marca"], modelo=p["modelo"], gama=p.get("gama"),
                    principal=princ, princ_es_medium="/medium/" in princ, fotos=fotos,
                    n=len(fotos), n_buenas=sum(1 for f in fotos if f["lado"] >= U and not f["medium"]),
                    med_sin_high=len(med_sin_high)))
json.dump(res, open(os.path.join(OUT, "medidas2.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

por = collections.OrderedDict()
for r in res: por.setdefault(r["cat"], []).append(r)
print("=== POR CATEGORIA (sólo fotos reales) ===")
for c, rs in por.items():
    nf = sum(r["n"] for r in rs); ch = sum(1 for r in rs for f in r["fotos"] if f["lado"] < U)
    print(f"{c:20} prod={len(rs):3} fotos={nf:4} <900={ch:3} princ_medium={sum(r['princ_es_medium'] for r in rs):3} "
          f"medium_huerfanas={sum(r['med_sin_high'] for r in rs):3} prod<3buenas={sum(1 for r in rs if r['n_buenas']<3):3}")
print("\n=== MEDIUM SIN SU HIGH (foto que borraste en high pero sigue en medium) ===")
for r in res:
    for f in r["fotos"]:
        if f["medium"]: print(f"[{r['i']:3}] {r['marca']} {r['modelo'][:40]} -> {os.path.basename(f['ruta'])}")
print("\n=== PRODUCTOS CON FOTOS < 900 o < 3 BUENAS ===")
for r in res:
    ch = [f["lado"] for f in r["fotos"] if f["lado"] < U]
    if ch or r["n_buenas"] < 3:
        print(f"[{r['i']:3}] {r['cat'][:12]:12} | {r['marca'][:10]:10} | {r['modelo'][:40]:40} | n={r['n']:2} buenas={r['n_buenas']:2} chicas={ch}")
