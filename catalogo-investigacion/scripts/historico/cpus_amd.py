"""Descarga ficha (dt/dd) e imágenes de los 14 Ryzen desde amd.com al USB JORGE.

amd.com responde a peticiones directas (no hace falta el navegador). Las cajas de AMD sólo
llevan el número de gama (5/7/9) y la serie, así que modelos de la misma serie y gama
comparten foto: el propio amd.com usa la del 9950X en la página del 9900X.
Imágenes 1200x1200 en /content/dam/amd/en/images/products/processors/ryzen/.

Uso: python cpus_amd.py <carpeta destino en JORGE>
"""
import html, json, re, sys, urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
DEST = Path(sys.argv[1]); DEST.mkdir(parents=True, exist_ok=True)
BASE = 'https://www.amd.com'
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128 Safari/537.36'}

# n -> (página de la ficha, página de la que se toman las fotos). El 5600 y el 5700X3D ya no
# tienen página en amd.com: sus specs vienen de la investigación y la foto de su hermano
# de caja (5600X = misma caja "Ryzen 5 5000" con Wraith Stealth; 5800X3D = caja 3D V-Cache).
# El 7600 no trae foto en su página: usa la del 7600X (caja "Ryzen 5 7000").
P = 'processors/desktops/ryzen/'
PAG = {
    1: (None, '5000-series/amd-ryzen-5-5600x'), 2: ('5000-series/amd-ryzen-5-5600x', None),
    3: (None, '5000-series/amd-ryzen-7-5800x3d'), 4: ('7000-series/amd-ryzen-5-7600', '7000-series/amd-ryzen-5-7600x'),
    5: ('7000-series/amd-ryzen-5-7600x', None), 6: ('9000-series/amd-ryzen-5-9600x', None),
    7: ('7000-series/amd-ryzen-7-7700x', None), 8: ('9000-series/amd-ryzen-7-9700x', None),
    9: ('7000-series/amd-ryzen-7-7800x3d', None), 10: ('9000-series/amd-ryzen-7-9800x3d', None),
    11: ('9000-series/amd-ryzen-7-9850x3d', None), 12: ('9000-series/amd-ryzen-9-9900x', None),
    13: ('9000-series/amd-ryzen-9-9950x', None), 14: ('9000-series/amd-ryzen-9-9950x3d', None),
}

# Fotos añadidas a mano: la caja del 5800X3D (sólo existe como tarjeta -og, 1200x675 fondo
# oscuro) es la misma que la del 5700X3D; el chip "Ryzen 9000 Series" vale para toda la serie.
IMG = '/content/dam/amd/en/images/products/processors/ryzen/'
CHIP_9000 = IMG + '3764700-ryzen-9000-product.jpg'
EXTRA = {3: [IMG + '2505503-ryzen-7-5800x3d-og.jpg'],
         **{n: [CHIP_9000] for n, (f, _) in PAG.items() if f and f.startswith('9000')}}


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read()


def texto(s):
    return html.unescape(re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', s))).strip()


def pagina(ruta):
    h = get(f'{BASE}/en/products/{P}{ruta}.html').decode('utf-8', 'replace')
    specs = {}
    for k, v in re.findall(r'<dt[^>]*>(.*?)</dt>\s*<dd[^>]*>(.*?)</dd>', h, re.S):
        k, v = texto(k), texto(v)
        if k and v and k not in specs:
            specs[k] = v
    imgs = []
    for u in re.findall(r'/content/dam/amd/en/images/products/processors/ryzen/[^"\' ?)]+\.(?:jpg|png|webp)', h):
        n = u.rsplit('/', 1)[1]
        # fuera: tarjetas de redes (-og), vídeos, teasers y miniaturas
        if u not in imgs and not re.search(r'-og\.|video|teaser|thumbnail|anniversary', n):
            imgs.append(u)
    titulo = texto((re.search(r'<title>(.*?)</title>', h, re.S) or [None, ''])[1])
    resumen = html.unescape((re.search(r'<meta name="description" content="([^"]*)"', h) or [None, ''])[1])
    return dict(url=f'{BASE}/en/products/{P}{ruta}.html', titulo=titulo, resumen=resumen, specs=specs, imgs=imgs)


codigos = {c['n']: c for c in json.loads((DEST / 'cpu_codigos.json').read_text(encoding='utf-8'))}
salida = []
for n, (ficha, fotos) in PAG.items():
    d = pagina(ficha) if ficha else dict(url='', titulo='', resumen='', specs={}, imgs=[])
    if fotos:
        d['imgs'] = pagina(fotos)['imgs']
        d['fotos_de'] = fotos.rsplit('/', 1)[1]
    d['imgs'] += [u for u in EXTRA.get(n, []) if u not in d['imgs']]
    carpeta = DEST / 'AMD' / codigos[n]['mpn']
    carpeta.mkdir(parents=True, exist_ok=True)
    for k, u in enumerate(d['imgs'], 1):
        destino = carpeta / f'{k:02d}{Path(u).suffix.lower()}'
        if not destino.exists():
            destino.write_bytes(get(BASE + u))
    salida.append({**codigos[n], **d})
    print(n, codigos[n]['modelo'], 'specs', len(d['specs']), 'imgs', [u.rsplit('/', 1)[1] for u in d['imgs']])
(DEST / 'amd_fichas.json').write_text(json.dumps(salida, indent=1, ensure_ascii=False), encoding='utf-8')
