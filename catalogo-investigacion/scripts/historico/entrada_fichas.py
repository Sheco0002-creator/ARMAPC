"""Fichas del tramo de entrada: 8 GPUs que SÍ se venden en Perú (2026-09-12).

El catálogo no tenía ninguna GPU por debajo de US$ 300. Estas 8 salen de lo que Infotec vende hoy,
con precio real en soles (ver entrada_candidatos.json, hecho por entrada_peru.py).

Dos fuentes de ficha:
  - Open Icecat (sin clave): 5 productos. Pedir SIN el parámetro `content` para que devuelva
    FeaturesGroups; MSI se indexa por NOMBRE de modelo, no por el SKU de tienda.
  - Infotec: ZOTAC, Palit y XFX están en el Icecat de PAGO y sus webs bloquean
    (zotac.com pide verificación anti-bot, palit.com devuelve cuerpo vacío). La ficha de Infotec
    sirve: su foto mayor es de 1100x1422, por encima del estándar de 900 px.

python entrada_fichas.py [--escribir]
"""
import io, json, os, re, sys, time, urllib.parse, urllib.request
from PIL import Image

sys.stdout.reconfigure(encoding="utf-8")
ESCRIBIR = "--escribir" in sys.argv
AQUI = os.path.dirname(os.path.abspath(__file__))
MIN_LADO = 900
TC, IGV = 3.373, 0.18

_src = open(os.path.join(AQUI, "precios", "precios_peru.py"), encoding="utf-8").read()
sys.argv = ["precios_peru.py", "no-se-usa.json"]
ns = {"__name__": "importado"}
exec(_src[:_src.index("cat = json.load")], ns)          # get() con el apaño del certificado, norm(), UA

ICECAT = [("ASUS", "DUAL-RTX3050-O6G"), ("MSI", "GeForce RTX 3050 VENTUS 2X 6G OC"),
          ("GIGABYTE", "GV-N5050WF2OCV2-8GD"), ("MSI", "GeForce RTX 5050 8G GAMING OC"),
          ("ASUS", "DUAL-RTX5050-O8G")]
DE_TIENDA = ["ZOTAC", "PALIT", "XFX"]          # marcas cuya ficha sale de Infotec


def icecat(marca, mpn):
    u = ("https://live.icecat.biz/api?shopname=openicecat-live&lang=es&Brand="
         + urllib.parse.quote(marca) + "&ProductCode=" + urllib.parse.quote(mpn))
    d = json.loads(ns["get"](u)).get("data") or {}
    g = d.get("GeneralInfo") or {}
    specs = {}
    for grupo in d.get("FeaturesGroups") or []:
        gn = (grupo.get("FeatureGroup") or {}).get("Name", {}).get("Value", "")
        for f in grupo.get("Features") or []:
            nombre = (f.get("Feature") or {}).get("Name", {}).get("Value")
            if nombre:
                specs[f"{gn} · {nombre}" if gn else nombre] = str(f.get("PresentationValue", ""))
    fotos = [(im.get("Pic"), int(im.get("PicWidth") or 0), int(im.get("PicHeight") or 0))
             for im in (d.get("Gallery") or []) if im.get("Pic")]
    return {"titulo": g.get("Title", ""), "gtin": g.get("GTIN") or [],
            "resumen": ((g.get("SummaryDescription") or {}).get("ShortSummaryDescription") or ""),
            "specs": specs, "fotos": fotos, "fuente": "icecat"}


def de_infotec(url):
    h = ns["get"](url)
    fotos = []
    for u in sorted(set(re.findall(r'src="(https://infotec\.com\.pe/\d+[^"]+\.jpg)"', h))):
        try:
            b = urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": ns["UA"]}),
                                       timeout=25, context=ns["SIN_VERIFICAR"]).read()
            im = Image.open(io.BytesIO(b))
            if min(im.size) >= MIN_LADO:
                fotos.append((u, im.size[0], im.size[1]))
        except Exception:
            pass
        time.sleep(0.5)
    # PrestaShop pone la ficha técnica en <dl class="data-sheet"> con pares <dt class="name">/<dd class="value">.
    # El único <table> de la página es el banner de cambios y devoluciones: no son specs.
    specs = {}
    hoja = re.search(r'class="data-sheet"(.*?)</dl>', h, re.S)
    if hoja:
        pares = re.findall(r'<dt[^>]*class="name"[^>]*>(.*?)</dt>\s*<dd[^>]*class="value"[^>]*>(.*?)</dd>',
                           hoja.group(1), re.S)
        for k, v in pares:
            k = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", k)).strip()
            v = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", v)).strip()
            if k and v:
                specs[k] = v[:120]
    desc = re.search(r'class="product-description"[^>]*>(.*?)</div>', h, re.S)
    return {"titulo": "", "gtin": [], "specs": specs, "fotos": fotos, "fuente": "infotec",
            "resumen": re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", desc.group(1)))[:400] if desc else ""}


precios = json.load(open(os.path.join(AQUI, "entrada_candidatos.json"), encoding="utf-8"))
fichas = []

for marca, mpn in ICECAT:
    f = icecat(marca, mpn)
    pe = next((c for c in precios if c["mpn"] and ns["norm"](c["mpn"]) == ns["norm"](mpn)), None)
    if not pe:
        # MSI figura en la tienda con su SKU (912-...), no con el nombre de modelo. Se empareja por
        # tokens del nombre, pero EXIGIENDO la marca: sin eso, "rtx 5050 8g gaming" casaba con la
        # ZOTAC "RTX 5050 TWIN EDGE OC 8GB GAMING" y le asignaba su precio.
        # Se quitan los tokens de capacidad ("6g", "8g"): la tienda escribe "6GB" y con límite de
        # palabra no casarían. Marca + línea de producto (VENTUS 2X, GAMING) ya identifican de sobra.
        clave = [t for t in ns["norm"](mpn).replace("geforce ", "").split()
                 if t != "oc" and not re.fullmatch(r"\d+gb?", t)]
        pe = next((c for c in precios
                   if ns["norm"](marca) in ns["norm"](c["titulo"])
                   and all(re.search(rf"\b{re.escape(t)}\b", ns["norm"](c["titulo"])) for t in clave)), None)
    fichas.append({"marca": marca, "mpn": mpn, "pen": pe["pen"] if pe else None,
                   "usd_derivado": pe["usd_derivado"] if pe else None,
                   "mpn_tienda": pe["mpn"] if pe else None, "url_tienda": pe["url"] if pe else None, **f})
    print(f"{marca:9} {mpn[:34]:34} specs={len(f['specs']):3} fotos={len(f['fotos']):2} "
          f"gtin={(f['gtin'] or [''])[0]:14} S/{pe['pen'] if pe else '-'}")
    time.sleep(1)

for marca in DE_TIENDA:
    pe = next((c for c in precios if marca in c["titulo"].upper()), None)
    if not pe:
        print(f"{marca}: no está en entrada_candidatos.json"); continue
    f = de_infotec(pe["url"])
    fichas.append({"marca": marca, "mpn": pe["mpn"], "pen": pe["pen"], "usd_derivado": pe["usd_derivado"],
                   "mpn_tienda": pe["mpn"], "url_tienda": pe["url"], **f, "titulo": pe["titulo"]})
    print(f"{marca:9} {str(pe['mpn'])[:34]:34} specs={len(f['specs']):3} fotos={len(f['fotos']):2} "
          f"(de Infotec)          S/{pe['pen']}")

print(f"\n{len(fichas)} fichas | fotos >= {MIN_LADO} px: {sum(len(f['fotos']) for f in fichas)}")
if ESCRIBIR:
    import subprocess
    L = subprocess.run(["powershell", "-NoProfile", "-Command",
                        "(Get-Volume | Where-Object FileSystemLabel -eq 'JORGE').DriveLetter"],
                       capture_output=True, text=True).stdout.strip()
    if not L:
        sys.exit("USB JORGE no conectado.")
    destino = os.path.join(f"{L}:\\", "catalogo-investigacion-ARCHIVO", "ENTRADA_gpus_2026-09-12")
    os.makedirs(destino, exist_ok=True)
    for f in fichas:
        carp = os.path.join(destino, f"{f['marca']}_{re.sub(r'[^A-Za-z0-9]+', '-', str(f['mpn']))[:34]}")
        os.makedirs(carp, exist_ok=True)
        for n, (u, w, hh) in enumerate(f["fotos"], 1):
            try:
                b = urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": ns["UA"]}),
                                           timeout=30, context=ns["SIN_VERIFICAR"]).read()
                open(os.path.join(carp, f"{n:02d}.jpg"), "wb").write(b)
            except Exception as e:
                print("  foto no descargada:", e)
            time.sleep(0.4)
    json.dump(fichas, open(os.path.join(destino, "fichas_entrada.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    print("Escrito en", destino)
else:
    print("(simulación: no se ha descargado nada; añade --escribir)")
