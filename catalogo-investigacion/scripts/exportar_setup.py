"""Exporta setup/setup-perifericos.json → src/data/setupProducts.json (lo que lee /setup-completo).

Uso (desde catalogo-investigacion/scripts/): python exportar_setup.py
Las fotos ya están en public/images/setup/ (una por producto, 900 px); aquí sólo se comprueba que existan.
Dentro de un módulo y gama, los productos del mismo `tipo` son ALTERNATIVAS (cuenta el más barato: dos
monitores, dos sillas) y los de tipo distinto se COMPLEMENTAN y se suman (ratón + alfombrilla…)."""
import json, os, re, sys
sys.stdout.reconfigure(encoding="utf-8")
AQUI = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.dirname(AQUI)
WEB = os.path.dirname(BASE)
SRC = os.path.join(BASE, "setup", "setup-perifericos.json")
SRC_EN = os.path.join(BASE, "setup", "setup-perifericos-en.json")  # traducción al inglés (15-09-2026)
DST = os.path.join(WEB, "src", "data", "setupProducts.json")

d = json.load(open(SRC, encoding="utf-8"))
EN = json.load(open(SRC_EN, encoding="utf-8"))
sin_traducir = set()


def numeros_en(s):
    """24,5 -> 24.5 y 35.000 -> 35,000 (decimales y miles a la inglesa)."""
    s = re.sub(r"(\d)\.(\d{3})(?!\d)", "\\1\u0000\\2", s)
    s = re.sub(r"(\d),(\d)", r"\1.\2", s)
    return s.replace("\u0000", ",")


def en(tabla, texto, contexto=None):
    """Texto en inglés: el de la tabla o, si no está, el mismo con los números a la inglesa. Si aún
    le quedan palabras en español (tildes, eñes o palabras típicas), se avisa al final."""
    if texto is None:
        return None
    if contexto and texto in EN.get("etiquetas_por_tipo", {}).get(contexto, {}):
        return EN["etiquetas_por_tipo"][contexto][texto]
    if texto in EN[tabla]:
        return EN[tabla][texto]
    out = numeros_en(texto)
    if re.search(r"[áéíóúñ¿¡]|\b(de|con|sin|y|o|hasta|para|el|la|los|las)\b", out, re.I):
        sin_traducir.add(f"{tabla}: {texto}")
    return out


items, faltan = [], []
for n, p in enumerate(d["productos"]):
    img = p.get("imagen")
    if not img or not os.path.exists(os.path.join(WEB, "public", img.lstrip("/").replace("/", os.sep))):
        faltan.append(p["modelo"]); img = None
    specs = [{"label": k, "value": v} for k, v in p.get("specs", {}).items()]
    items.append({
        "id": f"setup-{n}",
        "module": p["modulo"], "tier": p["gama"], "kind": p.get("tipo"),
        "brand": p["marca"], "model": p["modelo"], "mpn": p.get("mpn"),
        "price": p["precio_usd"], "store": p["tienda"], "url": p["url"],
        "stock": p.get("stock"), "specs": specs,
        "note": p.get("nota"), "image": img,
        # la versión inglesa de la web (/full-setup) lee estos campos; la española, los de arriba
        "kindEn": en("tipos", p.get("tipo")),
        "specsEn": [{"label": en("etiquetas", s["label"], p.get("tipo")), "value": en("valores", s["value"])} for s in specs],
        "noteEn": en("notas", p.get("nota")),
        "stockEn": en("stock", p.get("stock")),
        "storeEn": re.sub(r"\(vendedor ([^)]+)\)", r"(sold by \1)", p["tienda"]),
    })
fechas = sorted(p["fecha"] for p in d["productos"])
out = {"preciosDesde": fechas[0], "preciosHasta": fechas[-1], "items": items}
json.dump(out, open(DST, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

tot = {}
for t in ("entrada", "media", "alta", "extrema"):
    s = 0
    for m in ("monitor", "keyboard", "mouse", "audio", "ergonomics", "accessories"):  # streaming y coolant (líquidos para pecera) son opcionales, van aparte
        por_tipo = {}
        for i in items:
            if i["tier"] == t and i["module"] == m:
                por_tipo.setdefault(i["kind"], []).append(i["price"])
        s += sum(min(v) for v in por_tipo.values())
    tot[t] = round(s, 2)
print(f"{len(items)} productos → {DST}")
print("total del setup por gama (US$):", tot)
st = {t: round(sum(i["price"] for i in items if i["module"] == "streaming" and i["tier"] == t), 2) for t in tot}
print("kit de streaming opcional (US$):", st)
lq = {t: round(sum(min(p for k2, p in [(i["kind"], i["price"]) for i in items if i["module"] == "coolant" and i["tier"] == t] if k2 == k) for k in {i["kind"] for i in items if i["module"] == "coolant" and i["tier"] == t}), 2) for t in tot}
print("líquidos para pecera, opcional (US$):", lq)
if faltan:
    print("SIN FOTO:", faltan)
if sin_traducir:
    print("SIN TRADUCIR AL INGLÉS (añadir a setup/setup-perifericos-en.json):")
    for t in sorted(sin_traducir):
        print("  ", t)
