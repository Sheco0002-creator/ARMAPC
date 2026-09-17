"""Busca precio en fuentes AMERICANAS para los productos sin precio americano (2026-09-12).

Fuentes (las dos responden a curl sin bloqueo):
  - Cyberpuerta.mx (México): ld+json ItemList -> name / offers.price MXN / availability
  - KaBuM! (Brasil):        __NEXT_DATA__      -> name / price / priceWithDiscount / available

Normalización, igual que se hizo con Alemania: precio local CON impuesto -> sin impuesto -> USD (BCE).
  MX: IVA 16 %   ·   BR: ICMS 18 % (el II/IPI ya va dentro del coste, como pasaba con el precio alemán)
Tipos del BCE 11-09-2026: USD por MXN 0.05890 · USD por BRL 0.19567

NO escribe en el catálogo: deja un borrador con los candidatos para revisarlos antes de decidir.
python precios_americanos.py <salida.json>
"""
import json, os, re, sys, time, unicodedata, urllib.request, urllib.error, urllib.parse

sys.stdout.reconfigure(encoding="utf-8")
CAT = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo\catalogo-final.json"
OUT = sys.argv[1]
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/128.0 Safari/537.36")
USD_MXN, USD_BRL = 0.05890, 0.19567
IVA_MX, ICMS_BR = 0.16, 0.18
GENERICAS = {"gaming", "oc", "edition", "rgb", "argb", "black", "negro", "white", "blanco",
             "gb", "atx", "pc", "de", "para", "con", "the"}


def norm(s):
    s = unicodedata.normalize("NFKD", str(s)).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", " ", s).strip()


def tokens(s):
    return [t for t in norm(s).split() if t not in GENERICAS and len(t) > 1]


FALLOS = {"MX": 0, "BR": 0}          # fallos seguidos por fuente; a 5 se deja de consultar
MUERTAS = set()


def get(url, fuente, intentos=2):
    """Timeout corto y pocos reintentos: un host lento no puede bloquear la pasada entera."""
    if fuente in MUERTAS:
        return ""
    for n in range(intentos):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "es-MX,es,pt-BR;q=0.8"})
            with urllib.request.urlopen(req, timeout=15) as r:
                h = r.read().decode("utf-8", "replace")
            FALLOS[fuente] = 0
            return h
        except urllib.error.HTTPError as e:
            if e.code in (429, 503):
                time.sleep(20); continue
            break
        except Exception:
            time.sleep(3)
    FALLOS[fuente] += 1
    if FALLOS[fuente] >= 5:
        MUERTAS.add(fuente)
        print(f"  !! {fuente} no responde 5 veces seguidas: se deja de consultar", flush=True)
    return ""


def cyberpuerta(q):
    h = get("https://www.cyberpuerta.mx/index.php?cl=search&searchparam=" +
            urllib.parse.quote_plus(q), "MX")
    out = []
    for m in re.finditer(r"<script[^>]*ld\+json[^>]*>(.*?)</script>", h, re.S | re.I):
        try:
            d = json.loads(m.group(1).strip())
        except Exception:
            continue

        def walk(o):
            if isinstance(o, dict):
                if o.get("@type") == "Product":
                    yield o
                for v in o.values():
                    yield from walk(v)
            elif isinstance(o, list):
                for v in o:
                    yield from walk(v)
        for p in walk(d):
            off = p.get("offers") or {}
            if isinstance(off, list):
                off = off[0] if off else {}
            if off.get("price"):
                out.append({"titulo": p.get("name", ""), "local": float(off["price"]),
                            "stock": "InStock" in str(off.get("availability", ""))})
    return out


def kabum(q):
    h = get("https://www.kabum.com.br/busca/" + urllib.parse.quote(norm(q).replace(" ", "-")), "BR")
    m = re.search(r'id="__NEXT_DATA__"[^>]*>(.*?)</script>', h, re.S)
    if not m:
        return []
    try:
        d = json.loads(m.group(1))
    except Exception:
        return []
    out = []

    def walk(o):
        if isinstance(o, dict):
            if o.get("name") and (o.get("priceWithDiscount") or o.get("price")):
                yield o
            for v in o.values():
                yield from walk(v)
        elif isinstance(o, list):
            for v in o:
                yield from walk(v)
    for p in walk(d):
        if str(p.get("name", "")).upper().startswith("OFERTAS"):
            continue
        out.append({"titulo": p.get("name", ""), "local": float(p.get("priceWithDiscount") or p["price"]),
                    "stock": bool(p.get("available"))})
    return out


def puntuar(prod, titulo):
    t = norm(titulo)
    if norm(prod["marca"]).split()[0] not in t:
        return 0.0
    mod = tokens(prod["modelo"])
    if not mod:
        return 0.0
    return sum(1 for x in mod if x in t) / len(mod)


cat = json.load(open(CAT, encoding="utf-8"))
objetivo = [i for i, p in enumerate(cat)
            if (p.get("precio_usd") is None and not p.get("disponibilidad_region"))
            or (p.get("precio_pais") in ("DE", "UK"))]
print(f"{len(objetivo)} productos a buscar en Cyberpuerta (MX) y KaBuM (BR)\n")

res = {}
for n, i in enumerate(objetivo, 1):
    p = cat[i]
    consultas = [f"{p['marca']} {p['modelo']}"]
    if p.get("mpn") and len(p["mpn"]) > 4:
        consultas.insert(0, p["mpn"])
    r = {"producto": f"{p['marca']} {p['modelo']}", "mpn": p.get("mpn"), "categoria": p["categoria"],
         "precio_eu_actual": p.get("precio_usd"), "candidatos": []}
    for fuente, fn, moneda, imp, tc in (("MX", cyberpuerta, "MXN", IVA_MX, USD_MXN),
                                        ("BR", kabum, "BRL", ICMS_BR, USD_BRL)):
        vistos = set()
        for q in consultas:
            for c in fn(q):
                if c["titulo"] in vistos:
                    continue
                vistos.add(c["titulo"])
                s = puntuar(p, c["titulo"])
                if s >= 0.6:
                    r["candidatos"].append({"fuente": fuente, "moneda": moneda, "titulo": c["titulo"][:110],
                                            "local": c["local"], "stock": c["stock"], "score": round(s, 2),
                                            "usd": round(c["local"] / (1 + imp) * tc, 2)})
            time.sleep(1.5)
    r["candidatos"].sort(key=lambda c: (-c["score"], c["usd"]))
    r["candidatos"] = r["candidatos"][:5]
    res[i] = r
    mejor = r["candidatos"][0] if r["candidatos"] else None
    print(f"#{i:3} {r['producto'][:44]:44} -> " +
          (f"{mejor['fuente']} {mejor['moneda']} {mejor['local']:>9.2f} = US$ {mejor['usd']:>8.2f} "
           f"score {mejor['score']} {'stock' if mejor['stock'] else 'AGOTADO'}" if mejor else "SIN CANDIDATO"), flush=True)
    json.dump(res, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

con = sum(1 for r in res.values() if r["candidatos"])
print(f"\nFIN. {con}/{len(res)} con al menos un candidato. Borrador: {OUT}")
