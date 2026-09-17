"""Integra los 41 productos de almacenamiento (SSD + HDD) en catalogo-final.json como categoría nueva.

Lee de ALMACENAMIENTO_fabricante_2026-09-11/ en el USB JORGE: ssd_codigos.json (MPN/EAN) y las fichas
de cada lote (si un número aparece en varios lotes manda el último de LOTES). Copia las fotos a
catalogo/imagenes/almacenamiento/<gama>/high/<MARCA>_<MPN>_CDN_<k>.<ext> y sustituye la categoría
"Almacenamiento" del catálogo (el resto no se toca).

Uso: python integrar_almacenamiento.py <carpeta catalogo> <carpeta ALMACENAMIENTO_fabricante> [--escribir]
"""
import json, re, shutil, sys
from pathlib import Path
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')
CAT, SRC = Path(sys.argv[1]), Path(sys.argv[2])
ESCRIBIR = '--escribir' in sys.argv
CATEGORIA = 'Almacenamiento'
LOTES = ['fichas_bestbuy_lote1.json', 'fichas_skhynix_lexar.json', 'fichas_sustitutos_solidigm.json',
         'fichas_fabricante_lote2.json', 'fichas_sustitutos_descatalogados.json', 'fichas_seagate.json']

# Precio de referencia SIN verificar: los "$xx.99" son el precio de crucial.com visto al bajar la ficha;
# el resto, estimación de mercado. Gama por precio: entrada < $80 · media $80-150 · alta $150-250 · extrema > $250.
PRECIO = {
    1: 90, 2: 90, 3: 145, 4: 180, 5: 320, 6: 280, 7: 65, 8: 70, 9: 85, 10: 140, 11: 160, 12: 260,
    13: 75, 14: 100, 15: 170, 16: 130, 17: 106.99, 18: 61.99, 19: 165.99, 20: 264.99, 21: 303.99,
    22: 60, 23: 70, 24: 250, 25: 300, 26: 230, 27: 280, 28: 95, 29: 130, 30: 364.99, 31: 110,
    32: 180, 33: 350, 34: 250, 35: 85, 36: 140, 37: 270, 38: 110, 39: 65, 40: 90, 41: 60,
}
PRINCIPAL = {27: 2, 38: 5}  # nº de foto que va primero (la 1ª de Samsung es el reverso o la caja)
MARCA_TXT = {'SAMSUNG': 'Samsung', 'WD': 'WD', 'SK HYNIX': 'SK hynix', 'CRUCIAL': 'Crucial',
             'KINGSTON': 'Kingston', 'SEAGATE': 'Seagate', 'LEXAR': 'Lexar'}
FORMATO = {'SATA': '2.5"', 'HDD SATA': '3.5"'}  # si la ficha no lo dice; NVMe = M.2 2280


def gama_de(p):
    return 'entrada' if p < 80 else 'media' if p <= 150 else 'alta' if p <= 250 else 'extrema'


def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def seguro(mpn):
    return re.sub(r'[^A-Za-z0-9\-]+', '-', mpn).strip('-')


def primero(s, *claves):
    return next((s[k] for k in claves if s.get(k)), '')


def mbs(v):
    """'560 megabytes per second' / 'Up to 7,250 MB/s' / '7300MB/s' -> '7,250 MB/s'."""
    m = re.search(r'([\d.,]+)\s*(?:MB/s|megabytes per second)', v or '')
    if not m:
        return ''
    return f"{int(re.sub(r'[.,]', '', m.group(1))):,} MB/s"  # en las fichas no hay decimales en MB/s


def lect_escr(s):
    r = mbs(primero(s, 'Sequential Read', 'Sequential Read Performance', 'Maximum Read Speed',
                    'Max Sustained Transfer Rate (OD)', 'Transfer Rate'))
    w = mbs(primero(s, 'Sequential Write', 'Sequential Write Performance', 'Maximum Write Speed'))
    combo = primero(s, 'Sequential Read/Write', 'Sequential read/write')  # Kingston: '6,000/5,000MB/s'
    if combo and not r:
        a, b = re.findall(r'[\d,]+', combo)[:2]
        r, w = f'{a} MB/s', f'{b} MB/s'
    atto = s.get('Data transfer (ATTO)', '')  # A400: 'up to 500MB/s read and 450MB/s write'
    if atto and not r:
        a, b = re.findall(r'(\d+)MB/s', atto)[:2]
        r, w = f'{a} MB/s', f'{b} MB/s'
    return r, w


def tbw(s):
    v = primero(s, 'Endurance (TBW)', 'SSD Endurance (TBW)', 'TBW', 'Total Bytes Written (TBW)', 'SSD Endurance')
    if not v:  # Samsung: '5-year Limited Warranty or 2400TBW Limited Warranty'
        m = re.search(r'([\d,]+)\s*TBW', s.get('Warranty', ''))
        v = m.group(1) if m else ''
    m = re.search(r'([\d.,]+)\s*(PB)?', v)
    if not m:
        return ''
    num = float(m.group(1).replace(',', ''))
    return f"{num * 1000 if m.group(2) else num:,.0f} TB"


def formato_es(v):
    """Formato canónico para el resumen (la variante exacta queda en la ficha completa)."""
    return 'M.2 2280' if 'M.2' in v else '3.5"' if v.startswith('3.5') else '2.5"' if v.startswith('2.5') else v


def garantia_es(v):
    """'5-Year Limited Warranty' / 'Limited 3-year warranty…' / 'Five (5) Year…' / '5 years' -> '5 años'."""
    m = re.search(r'(?i)(\d+)\)?[ -]year', v)
    return f'{m.group(1)} años' if m else v


def resumen_es(c, s):
    r, w = lect_escr(s)
    garantia = primero(s, 'Warranty', 'Limited Warranty', 'Warranty - Parts')
    return {k: v for k, v in [
        ('Tipo', c['tipo'].replace('HDD SATA', 'Disco duro SATA')), ('Capacidad', c['capacidad']),
        ('Formato', formato_es(primero(s, 'Form Factor', 'Form factor') or FORMATO.get(c['tipo'], 'M.2 2280'))),
        ('Interfaz', primero(s, 'Interface', 'Interface(s)')), ('Lectura secuencial', r), ('Escritura secuencial', w),
        ('Velocidad de giro', s.get('Spindle Speed') or s.get('Disk Speed (RPM)', '')),
        ('Resistencia (TBW)', tbw(s)),
        ('Garantía', garantia_es(garantia)),
    ] if v}


def url_de(d):
    if d.get('url'):
        return d['url']
    sku = re.search(r'sku (\d+)', d.get('fuente_ficha', ''))
    return f'https://www.bestbuy.com/site/{sku.group(1)}.p?skuId={sku.group(1)}' if sku else ''


codigos = {c['n']: c for c in json.loads((SRC / 'ssd_codigos.json').read_text(encoding='utf-8'))}
# Regla de calidad del usuario: fuera los productos sin fotos suficientes (RETIRADAS.json) y sólo fotos >= 900 px
_ret = SRC / 'RETIRADAS.json'
RETIRADAS = {int(k) for k in json.loads(_ret.read_text(encoding='utf-8'))} if _ret.exists() else set()
codigos = {n: c for n, c in codigos.items() if n not in RETIRADAS}
MIN_PX = 900
fichas = {}
for lote in LOTES:
    for d in json.loads((SRC / lote).read_text(encoding='utf-8')):
        if d['n'] in codigos and d['mpn'] == codigos[d['n']]['mpn']:  # descarta sustituidos y retirados
            fichas[d['n']] = d
assert sorted(fichas) == sorted(codigos), sorted(set(codigos) - set(fichas))

productos = []
for n in sorted(codigos):
    c, d = codigos[n], fichas[n]
    marca, mpn, precio = c['marca'], c['mpn'], PRECIO[n]
    gama = gama_de(precio)
    specs = {**resumen_es(c, d['specs']), **d['specs']}
    marca_txt = MARCA_TXT[marca]
    modelo = c['modelo'].removeprefix('WD ').replace(' (HDD)', '')
    es_hdd = c['tipo'].startswith('HDD')
    titulo = f"{'Disco duro' if es_hdd else 'SSD'} {marca_txt} {modelo} {'SATA 3.5' if es_hdd else c['tipo']}"
    lect = specs.get('Lectura secuencial', '')
    resumen = f"{marca_txt} {modelo}, {specs['Formato']}, {c['tipo']}" + (f", hasta {lect} de lectura" if lect else '')
    # fotos: JORGE -> imagenes/almacenamiento/<gama>/high/
    origen = sorted(p for p in (SRC / marca / mpn.replace('/', '_')).iterdir() if p.suffix)
    if n in PRINCIPAL:
        origen.insert(0, origen.pop(PRINCIPAL[n] - 1))
    origen = [p for p in origen if max(Image.open(p).size) >= MIN_PX] or origen[:1]
    carpeta = CAT / 'imagenes' / 'almacenamiento' / gama / 'high'
    carpeta.mkdir(parents=True, exist_ok=True)
    high = []
    for k, p in enumerate(origen, 1):
        nombre = f'{marca.replace(" ", "-")}_{seguro(mpn)}_CDN_{k}{p.suffix.lower()}'
        if ESCRIBIR:
            shutil.copy2(p, carpeta / nombre)
        high.append(f'imagenes/almacenamiento/{gama}/high/{nombre}')
    faltante = [f for f, v in (('mpn', mpn), ('ean', c['ean']), ('specs', specs), ('imagen', high)) if not v]
    productos.append({
        'marca': marca, 'modelo': modelo, 'mpn': mpn, 'ean': c['ean'], 'icecat_id': '',
        'categoria': CATEGORIA, 'titulo': titulo, 'resumen': resumen,
        'imagen_alta': '', 'imagen_alta_res': '', 'imagen_500': '', 'galeria': [],
        'n_specs': len(specs), 'specs': specs, 'slug': slug(f"{marca} {modelo}"),
        'imagenes_local': {'medium': [], 'high': high}, 'imagen_principal': high[0] if high else '',
        'n_imagenes': len(high), 'fuente': 'cdn', 'completo': not faltante, 'faltante': faltante,
        'url_oficial': url_de(d), 'gama': gama, 'precio_referencia': f"~${precio:,.0f}" if precio % 1 == 0 else f"${precio}",
        'precio_verificado': False, 'ean_confirmado': c['ean_confirmado'],
        **({} if c['ean_confirmado'] else {'nota': 'EAN por nombre, sin confirmar'}),
    })
    print(f"#{n:2} {gama:8} {marca:8} {modelo:24} {mpn:18} {c['ean']} img={len(high)} specs={len(specs):2} "
          f"R={specs.get('Lectura secuencial', '-'):>11} TBW={specs.get('Resistencia (TBW)', '-'):>9} "
          f"{'OK' if not faltante else 'falta ' + ','.join(faltante)}{'' if c['ean_confirmado'] else ' · EAN sin confirmar'}")

if ESCRIBIR:
    rotas = [p for c in productos for p in c['imagenes_local']['high'] if not (CAT / p).exists()]
    p = CAT / 'catalogo-final.json'
    datos = [r for r in json.loads(p.read_text(encoding='utf-8')) if r['categoria'] != CATEGORIA] + productos
    p.write_text(json.dumps(datos, indent=1, ensure_ascii=False), encoding='utf-8')
    print(f'\nEscrito: {len(datos)} productos en {p.name} · rutas de almacenamiento rotas: {len(rotas)}')
