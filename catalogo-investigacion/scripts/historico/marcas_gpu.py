"""Descarga fichas e imágenes de GPUs de Palit, Gainward y PNY desde la web del fabricante.

Crudo -> USB JORGE. Procesado -> catalogo/. Uso:
    python marcas_gpu.py <carpeta catalogo> <carpeta cruda en JORGE> [--descargar]
Sin --descargar sólo consulta las páginas y muestra lo que encontraría.
"""
import html, json, re, sys, time, urllib.parse, urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
CAT = Path(sys.argv[1])
CRUDO = Path(sys.argv[2])
DESCARGAR = '--descargar' in sys.argv
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0 Safari/537.36'}
MAX_IMG = 8

# marca, id/slug, chip, gama
PRODUCTOS = [
    ('PALIT', '5495', 'RTX 5060 Ti 16GB', 'media'),
    ('PALIT', '5545', 'RTX 5060 Ti 8GB', 'media'),
    # 5070 Infinity 3 OC y 5070 Ti GamingPro-S OC sustituyen a GamingPro OC (5445) y
    # GameRock OC (5385): éstas no las vende ninguna tienda con EAN visible.
    ('PALIT', '5465', 'RTX 5070', 'media'),
    ('PALIT', '5615', 'RTX 5070 Ti', 'alta'),
    ('PALIT', '5405', 'RTX 5080', 'alta'),
    ('PALIT', '5335', 'RTX 5090', 'extrema'),
    ('GAINWARD', '1263', 'RTX 5060 Ti 16GB', 'media'),
    ('GAINWARD', '1248', 'RTX 5060 Ti 8GB', 'media'),
    ('GAINWARD', '1236', 'RTX 5070', 'media'),
    ('GAINWARD', '1232', 'RTX 5070 Ti', 'alta'),
    ('GAINWARD', '1230', 'RTX 5080', 'alta'),
    ('GAINWARD', '1226', 'RTX 5090', 'extrema'),
    ('PNY', 'geforce-rtx-5060-ti-16gb-models', 'RTX 5060 Ti 16GB', 'media'),
    ('PNY', 'geforce-rtx-5060-ti-8gb-models', 'RTX 5060 Ti 8GB', 'media'),
    ('PNY', 'geforce-rtx-5070-models', 'RTX 5070', 'media'),
    ('PNY', 'geforce-rtx-5070-ti-models', 'RTX 5070 Ti', 'alta'),
    ('PNY', 'geforce-rtx-5080-models', 'RTX 5080', 'alta'),
    ('PNY', 'geforce-rtx-5090-models', 'RTX 5090', 'extrema'),
    ('ASUS', 'dual-rtx5060-o8g', 'RTX 5060', 'entrada'),
    ('ASUS', 'prime-rtx5060ti-o16g', 'RTX 5060 Ti 16GB', 'media'),
    ('ASUS', 'tuf-rtx5080-o16g-gaming', 'RTX 5080', 'alta'),
    ('ASUS', 'prime-rx9070-o16g', 'RX 9070', 'alta'),
    ('ASUS', 'tuf-rx9070xt-o16g-gaming', 'RX 9070 XT', 'alta'),
]
SOLO = sys.argv[sys.argv.index('--solo') + 1].split(',') if '--solo' in sys.argv else None
IDS = sys.argv[sys.argv.index('--ids') + 1].split(',') if '--ids' in sys.argv else None


def get(url, binario=False):
    for intento in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40) as r:
                d = r.read()
            return d if binario else d.decode('utf-8', 'replace')
        except Exception as e:
            if intento == 2:
                raise
            time.sleep(2)


def texto(s):
    return html.unescape(re.sub(r'<[^>]+>', '', s)).replace('\xa0', ' ').strip()


def lineas(h):
    h = re.sub(r'(?s)<(script|style).*?</\1>', ' ', h)
    out = [texto(x) for x in re.split(r'<[^>]+>', h)]
    return [x for x in out if x]


def pares(seq, fin=()):
    d = {}
    for k, v in zip(seq[::2], seq[1::2]):
        if k in fin:
            break
        if k and v and len(k) < 60 and len(v) < 200 and k != v:
            d.setdefault(k, v)
    return d

# ------------------------------------------------------------------ por marca

def palit(pid):
    base = 'https://www.palit.com'
    h = get(f'{base}/palit/vgapro.php?id={pid}&lang=en')
    titulo = re.sub(r'^::?\s*Palit Products?\s*-\s*', '',
                    texto(re.search(r'<title>(.*?)</title>', h, re.S).group(1))).strip(': ')
    pn = re.search(r'pn=([A-Za-z0-9\-/]+)&', h).group(1)
    sp = get(f'{base}/palit/vgapro.php?id={pid}&lang=en&pn={pn}&tab=sp')
    celdas = []
    for t in re.findall(r'(?s)<table.*?</table>', re.sub(r'(?s)<(script|style).*?</\1>', ' ', sp)):
        c = [texto(x) for x in re.findall(r'(?s)<t[dh][^>]*>(.*?)</t[dh]>', t)]
        c = [x for x in c if x]
        if any('Memory Amount' in x or 'Bus Support' in x for x in c):
            celdas += [x for x in c if x != 'Specifications']
    if 'Memory Amount' in celdas:            # la tabla puede traer una celda suelta delante
        celdas = celdas[celdas.index('Memory Amount'):]
    ga = get(f'{base}/palit/vgapro.php?id={pid}&lang=en&pn={pn}&tab=ga')
    grandes = sorted(set(re.findall(r'"(/product/vga/picture/p\d+/p\d+_bigimage_[^"]+\.(?:png|jpg))"', ga)))
    return dict(titulo=f'Palit {titulo}', mpn=pn, ean='', specs=pares(celdas),
                imgs=[(base + g, base + g.replace('/p0', '/m_p0', 1) if False else
                       base + re.sub(r'/(p\d+_bigimage_)', r'/m_\1', g)) for g in grandes[:MAX_IMG]],
                url=f'{base}/palit/vgapro.php?id={pid}&lang=en')


def gainward(pid):
    base = 'https://www.gainward.com/main/'
    h = get(f'{base}vgapro.php?id={pid}&lang=en')
    ls = lineas(h)
    i = ls.index('Product Name') if 'Product Name' in ls else 0
    sp = pares(ls[i:i + 40], fin=('Award / Review', 'Overview', 'Download'))
    titulo = sp.pop('Product Name', '')
    ean = sp.pop('Barcode', '')
    if 'P/N' in sp:                          # tras el P/N sólo viene texto de marketing
        sp = dict(list(sp.items())[:list(sp).index('P/N') + 1])
    gy = get(f'{base}vgapro.php?id={pid}&tab=gy&lang=en')
    grandes = sorted(set(re.findall(r'(product/vga/pro/p\d+/p\d+_pic_[^"\']+\.(?:png|jpg))', gy)))
    m = re.search(r'\b(NE[A-Z0-9]{8,}-[A-Z0-9]+)\b', h)
    return dict(titulo=titulo or f'Gainward {pid}', mpn=sp.pop('Part Number', '') or (m.group(1) if m else ''),
                ean=re.sub(r'\D', '', ean), specs=sp,
                imgs=[(base + g, base + re.sub(r'/(p\d+_pic_)', r'/m_\1', g)) for g in grandes[:MAX_IMG]],
                url=f'{base}vgapro.php?id={pid}&lang=en')


def pny(slug):
    url = f'https://www.pny.com/{slug}'
    h = get(url)
    titulo = texto(re.search(r'<title>(.*?)</title>', h, re.S).group(1)).split('|')[0].strip()
    titulo = re.sub(r'\s*Models?\s*GPUs?$', '', titulo).strip()
    skus = sorted(set(re.findall(r'\bVCG[0-9A-Z]{6,}\b', h)))
    specs = {}
    for bloque in re.findall(r'(?s)<div class="[^"]*productTools-specification[^"]*">(.*?)</div>\s*</div>', h):
        c = [x for x in lineas(bloque) if x]
        if len(c) >= 2:
            specs.setdefault(c[0], ' · '.join(c[1:])[:200])
    imgs = sorted(set(re.findall(r'(https://d2vfia6k6wrouk\.cloudfront\.net/productimages/[^"\' ]+\.(?:png|jpg|webp))', h)))
    specs.pop('Specifications', None)
    upc = re.sub(r'\D', '', specs.get('UPC Code', ''))
    return dict(titulo=f'PNY {titulo}' if not titulo.upper().startswith('PNY') else titulo,
                mpn=specs.get('PNY Part Number', skus[0] if skus else ''),
                ean='0' + upc if len(upc) == 12 else upc, specs=specs, skus=skus,
                imgs=[(u, u) for u in imgs[:MAX_IMG]], url=url)


def asus(slug):
    """ASUS expone dos APIs abiertas: PDGallery (fotos) y PDTechSpec (ficha)."""
    api = ('https://odinapi.asus.com/recent-data/apiv2/{ep}?SystemCode=asus&WebsiteCode=us'
           '&siteID=www&sitelang=&ProductWebPath=' + slug)
    ficha = json.loads(get(api.format(ep='PDTechSpec')))['Result'] or {}
    gal = json.loads(get(api.format(ep='PDGallery')))['Result'] or {}
    specs = {}

    def recorrer(x):
        if isinstance(x, dict):
            if 'Title' in x and ('Content' in x or 'Value' in x):
                v = x.get('Content', x.get('Value'))
                v = ' · '.join(str(i) for i in v) if isinstance(v, list) else str(v)
                v = texto(v)
                if x['Title'] and v:
                    specs.setdefault(texto(x['Title']), v[:200])
            for i in x.values():
                recorrer(i)
        elif isinstance(x, list):
            for i in x:
                recorrer(i)
    recorrer(ficha.get('SpecList') or ficha)
    bases = []
    for grupo in gal.get('GalleryList') or []:
        for img in grupo.get('ImageList') or []:
            b = (img.get('ImgPath') or '').rstrip('/')
            if b and b not in bases:
                bases.append(b)
    mpn = (gal.get('ProductCard') or {}).get('ProductName') or ficha.get('Name') or slug
    # la URL pública lleva el segmento de la serie; sin él ASUS redirige a su portada
    serie = {'tuf': 'tuf-gaming', 'rog': 'rog-strix'}.get(slug.split('-')[0], slug.split('-')[0])
    url = f'https://www.asus.com/us/motherboards-components/graphics-cards/{serie}/{slug}/'
    try:   # el nombre comercial sólo está en el <title> de la página
        nombre = texto(re.search(r'<title>(.*?)</title>', get(url + 'techspec/'), re.S).group(1)).split('|')[0]
        nombre = re.sub(r'\s*-\s*Tech Specs$', '', nombre).replace('™', '').strip()
    except Exception:
        nombre = mpn
    return dict(titulo=nombre if nombre.upper().startswith('ASUS') else f'ASUS {nombre}',
                mpn=mpn, ean='', specs=specs,
                imgs=[(f'{b}/w2000', f'{b}/w800') for b in bases[:MAX_IMG]], url=url)


EXTRACTOR = {'PALIT': palit, 'GAINWARD': gainward, 'PNY': pny, 'ASUS': asus}

# ------------------------------------------------------------------ ejecución
fichas, avisos = [], []
for marca, ident, chip, gama in PRODUCTOS:
    if (SOLO and marca not in SOLO) or (IDS and ident not in IDS):
        continue
    try:
        d = EXTRACTOR[marca](ident)
    except Exception as e:
        avisos.append(f'{marca} {ident}: {type(e).__name__} {e}')
        continue
    d.update(marca=marca, ident=ident, chip=chip, gama=gama)
    print(f"{marca:9} {ident:32} {d['titulo'][:52]:52} mpn={d['mpn'] or '-':22} "
          f"ean={d['ean'] or '-':13} specs={len(d['specs']):2} imgs={len(d['imgs'])}")
    if not d['imgs']:
        avisos.append(f'{marca} {ident}: sin imágenes')
    if not d['specs']:
        avisos.append(f'{marca} {ident}: sin specs')
    fichas.append(d)

if DESCARGAR:
    raiz_crudo = CRUDO / 'GPUS-PALIT-GAINWARD-PNY_fabricante_2026-09-10'
    for d in fichas:
        mpn_seguro = re.sub(r'[^A-Za-z0-9\-]+', '-', d['mpn'] or d['ident'])
        destino_crudo = raiz_crudo / d['marca'] / mpn_seguro
        destino_crudo.mkdir(parents=True, exist_ok=True)
        alta = CAT / 'imagenes' / 'gpus' / d['gama'] / 'high'
        media = CAT / 'imagenes' / 'gpus' / d['gama'] / 'medium'
        alta.mkdir(parents=True, exist_ok=True); media.mkdir(parents=True, exist_ok=True)
        locales = {'high': [], 'medium': []}
        for n, (u_alta, u_media) in enumerate(d['imgs'], 1):
            tamanos = [(u_alta, alta, 'high')]
            if u_media != u_alta:            # PNY sirve un solo tamaño: no se inventa un medium
                tamanos.append((u_media, media, 'medium'))
            for url_img, carpeta, clave in tamanos:
                m_ext = re.search(r'\.(png|jpg|webp)$', url_img)   # ASUS sirve sin extensión
                ext = m_ext.group(1) if m_ext else 'png'
                nombre = f"{d['marca']}_{mpn_seguro}_CDN_{n}.{ext}"
                try:
                    datos = get(url_img, binario=True)
                except Exception as e:
                    avisos.append(f"{d['marca']} {mpn_seguro} img{n} {clave}: {e}")
                    continue
                if len(datos) < 1000:
                    avisos.append(f"{d['marca']} {mpn_seguro} img{n} {clave}: {len(datos)} bytes, descartada")
                    continue
                (destino_crudo / f'{clave}_{nombre}').write_bytes(datos)   # respaldo crudo en JORGE
                (carpeta / nombre).write_bytes(datos)                      # procesado en C:
                locales[clave].append(f"imagenes/gpus/{d['gama']}/{clave}/{nombre}")
            time.sleep(0.3)
        d['imagenes_local'] = locales
        (destino_crudo / 'ficha.json').write_text(
            json.dumps({k: v for k, v in d.items() if k != 'imgs'}, indent=1, ensure_ascii=False), encoding='utf-8')
        print(f"  {d['marca']:9} {mpn_seguro:24} alta={len(locales['high'])} media={len(locales['medium'])}")

    salida = CAT / 'fuentes' / 'gpus' / 'GPUS_palit-gainward-pny_FICHAS-fabricante.json'
    previas = json.loads(salida.read_text(encoding='utf-8')) if salida.exists() else []
    nuevas = {(d['marca'], d['ident']): {k: v for k, v in d.items() if k != 'imgs'} for d in fichas}
    combinado = [nuevas.pop((d['marca'], d['ident']), d) for d in previas] + list(nuevas.values())
    salida.write_text(json.dumps(combinado, indent=1, ensure_ascii=False), encoding='utf-8')
    print('\nFichas escritas en', salida)

for a in avisos:
    print('AVISO:', a)
