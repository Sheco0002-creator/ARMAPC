"""Fotos de RAM desde las webs de los fabricantes (2026-09-13).

13 módulos tenían 1-2 fotos y 3 la imagen genérica. Fuentes (por curl, SKU/MPN exacto):
  - Corsair: __NEXT_DATA__ de la ficha (URL del sitemap). La página trae TODAS las variantes: se toma
    SÓLO la galería (`media_gallery`) del producto cuyo `sku` coincide con nuestro MPN. Son URLs de
    Cloudinary a 96 px: se piden a 2000 px de ancho y en JPG cambiando la transformación.
  - G.Skill: galería `rel="example_group"` de /product/... cuyo title es nuestro MPN exacto (1100x590,
    el tamaño que publica G.Skill; vale porque el estándar mira el lado mayor).
  - Kingston: kingston.com da 403 por curl -> aparte, con el navegador.

Descarga a JORGE y arma una hoja de contactos `idx.foto` para revisar a ojo. NO toca el catálogo.
python ram_fotos.py
"""
import io, ssl, urllib.error, json, os, re, subprocess, sys, time, urllib.request
from PIL import Image, ImageDraw

sys.stdout.reconfigure(encoding="utf-8")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36"
CAT = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo\catalogo-final.json"
CORSAIR = [80, 83, 88, 90, 92, 95]
GSKILL = [84, 87, 89, 91, 93, 96]


def get(u):
    try:
        return urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": UA}), timeout=40).read()
    except urllib.error.URLError as e:                # Cloudinary dio a ratos "certificate has expired"
        if "CERTIFICATE" not in str(e):
            raise
        return urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": UA}), timeout=40,
                                      context=ssl._create_unverified_context()).read()


def corsair(mpn, locs):
    url = next((l for l in locs if f"/{mpn.lower()}/" in l.lower()), None)
    if not url:
        return []
    d = json.loads(re.search(r'id="__NEXT_DATA__"[^>]*>(.*?)</script>', get(url).decode("utf-8", "replace"), re.S).group(1))
    galerias = []

    def walk(o):
        if isinstance(o, dict):
            if str(o.get("sku", "")).upper() == mpn.upper() and isinstance(o.get("media_gallery"), list):
                galerias.append(o["media_gallery"])
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)
    walk(d)
    # la galería más larga del SKU exacto (el item raíz a veces sólo trae la primera)
    gal = max(galerias, key=len) if galerias else []
    out = []
    for x in gal:
        u = x.get("url", "")
        if not u or x.get("disabled"):
            continue
        u = re.sub(r"/upload/[^/]*w_\d+/", "/upload/c_limit,w_2000,q_95/", u)
        u = re.sub(r"\.(webp|png)$", ".jpg", u)
        if u not in out:
            out.append(u)
    return out


def gskill(mpn, locs):
    url = next((l for l in locs if "/product/" in l and "/tw/" not in l and "/cn/" not in l
                and re.search(re.escape(mpn) + r"(-F\d|$)", l, re.I)), None)   # a veces "<MPN>-<MPN variante GA2>"
    if not url:
        return []
    h = get(url).decode("utf-8", "replace")
    fotos = re.findall(r'rel="example_group" title="[^"]*' + re.escape(mpn) + r'[^"]*" href="([^"]+)"', h)
    return ["https://www.gskill.com" + f for f in dict.fromkeys(fotos)]


L = subprocess.run(["powershell", "-NoProfile", "-Command",
                    "(Get-Volume | Where-Object FileSystemLabel -eq 'JORGE').DriveLetter"],
                   capture_output=True, text=True).stdout.strip()
if not L:
    sys.exit("USB JORGE no conectado: no se descarga nada.")
DEST = os.path.join(f"{L}:\\", "catalogo-investigacion-ARCHIVO", "RAM_fotos-fabricante_2026-09-13")
cat = json.load(open(CAT, encoding="utf-8"))

c_locs = re.findall(r"<loc>([^<]+)</loc>", get("https://www.corsair.com/us-sitemap-products-1.xml").decode())
g_locs = re.findall(r"<loc>([^<]+)</loc>", get("https://www.gskill.com/sitemap.xml").decode())

registro, miniaturas = {}, []
for idx in CORSAIR + GSKILL:
    p = cat[idx]
    urls = corsair(p["mpn"], c_locs) if idx in CORSAIR else gskill(p["mpn"], g_locs)
    carp = os.path.join(DEST, p["mpn"].replace("/", "_"))
    os.makedirs(carp, exist_ok=True)
    registro[idx] = {"mpn": p["mpn"], "modelo": p["modelo"], "fotos": []}
    print(f"#{idx} {p['modelo'][:45]}: {len(urls)} en galería")
    for n, u in enumerate(urls, 1):
        ruta = os.path.join(carp, f"{n:02d}.jpg")
        try:
            if os.path.exists(ruta):                  # re-ejecución: lo ya descargado no se repite
                im = Image.open(ruta).convert("RGB")
                registro[idx]["fotos"].append({"n": n, "origen": u, "w": im.size[0], "h": im.size[1], "archivo": ruta})
                miniaturas.append((f"{idx}.{n}", im, max(im.size) >= 900))
                continue
            b = get(u)
            im = Image.open(io.BytesIO(b))
            if im.mode in ("RGBA", "LA", "P"):         # PNG transparente de G.Skill: sobre blanco, no convert() a pelo
                im = im.convert("RGBA"); fondo = Image.new("RGB", im.size, "white")
                fondo.paste(im, mask=im.split()[3]); im = fondo
            im = im.convert("RGB")
            im.save(ruta, quality=92)
            registro[idx]["fotos"].append({"n": n, "origen": u, "w": im.size[0], "h": im.size[1], "archivo": ruta})
            miniaturas.append((f"{idx}.{n}", im, max(im.size) >= 900))
            print(f"   {n}: {im.size[0]}x{im.size[1]}")
        except Exception as e:
            print(f"   {n}: ERROR {e}")
        time.sleep(0.6)

json.dump(registro, open(os.path.join(DEST, "fotos_ram.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

COL, T = 6, 260
filas = (len(miniaturas) + COL - 1) // COL
hoja = Image.new("RGB", (COL * T, filas * (T + 28)), "white")
d = ImageDraw.Draw(hoja)
for k, (etq, im, ok) in enumerate(miniaturas):
    im = im.copy(); im.thumbnail((T - 10, T - 10))
    x, y = (k % COL) * T, (k // COL) * (T + 28)
    hoja.paste(im, (x + (T - im.size[0]) // 2, y + 5))
    d.text((x + 8, y + T + 4), f"{etq}  {'ok' if ok else '<900'}", fill="black" if ok else "red")
salida = os.path.join(DEST, "HOJA_ram_fabricante.jpg")
hoja.save(salida, quality=85)
print(f"\n{len(miniaturas)} fotos | hoja: {salida}")
