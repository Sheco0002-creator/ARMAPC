"""Procesa las GPUs de ZOTAC y ASRock bajadas del navegador del usuario al USB JORGE.

zotac.com (SafeLine WAF) y asrock.com (Incapsula) bloquean cualquier descarga que no
salga del navegador del usuario. Por eso las fichas e imágenes se sacaron con la
extensión de Claude en Chrome, pasándolas por el portapapeles (ver PATRONES-CDN.md).

Uso: python procesar_zotac_asrock.py <carpeta catalogo> <carpeta cruda en JORGE>
Copia las imágenes a catalogo/imagenes/gpus/<gama>/ y añade las fichas a
fuentes/gpus/GPUS_palit-gainward-pny_FICHAS-fabricante.json, que lee integrar_gpu_ram.py.
"""
import json, re, shutil, sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
CAT, CRUDO = Path(sys.argv[1]), Path(sys.argv[2])

# ident (nombre en la web de ASRock) -> chip y gama, igual que el resto del catálogo
ASROCK = {
    'Radeon RX 9070 XT Steel Legend 16GB': ('RX 9070 XT', 'alta'),
    'Radeon RX 9070 Challenger 16GB': ('RX 9070', 'alta'),
    'Radeon RX 9060 XT Steel Legend 16GB OC': ('RX 9060 XT 16GB', 'media'),
    'Radeon RX 7900 XTX Taichi 24GB OC': ('RX 7900 XTX', 'extrema'),
    # hermanas que sustituyen a la 9060 XT SL 8GB y la 7800 XT PG (sin EAN en tiendas)
    'Radeon RX 9060 XT Challenger 16GB OC': ('RX 9060 XT 16GB', 'media'),
    'Radeon RX 9070 Steel Legend 16GB OC': ('RX 9070', 'alta'),
}
# Sustituidas el 2026-09-10 porque ninguna tienda accesible publicaba su EAN.
# Sus imágenes se mueven a JORGE -> pruebas-y-superados/GPUS-zotac-asrock-sustituidas_2026-09-10/
RETIRADAS = {'ZT-B50800J-10P', 'ZT-B50710J-10P', 'RX9060XT SL 8GO', 'RX7800XT PG 16GO'}
SUPERADOS = CRUDO.parent / 'pruebas-y-superados' / 'GPUS-zotac-asrock-sustituidas_2026-09-10'


def seguro(mpn):
    return re.sub(r'[^A-Za-z0-9\-]+', '-', mpn).strip('-')


def copiar(origenes, marca, mpn, gama, tam):
    carpeta = CAT / 'imagenes' / 'gpus' / gama / tam
    carpeta.mkdir(parents=True, exist_ok=True)
    for n, p in enumerate(origenes, 1):
        shutil.copy2(p, carpeta / f'{marca}_{seguro(mpn)}_CDN_{n}{p.suffix.lower()}')
    return len(origenes)


def leer(*nombres):
    datos = []
    for n in nombres:
        datos += json.loads((CRUDO / n).read_text(encoding='utf-8'))
    return [d for d in datos if d['mpn'] not in RETIRADAS]


# Imágenes de las sustituidas: fuera del catálogo, al USB (no se borran)
for mpn in RETIRADAS:
    marca = 'ZOTAC' if mpn.startswith('ZT-') else 'ASROCK'
    for p in (CAT / 'imagenes' / 'gpus').rglob(f'{marca}_{seguro(mpn)}_CDN_*'):
        destino = SUPERADOS / p.parent.parent.name / p.parent.name
        destino.mkdir(parents=True, exist_ok=True)
        shutil.move(str(p), destino / p.name)

fichas = []
# ZOTAC: una sola resolución (original, ~2000 px) -> sólo high, como PNY
for d in leer('zotac_fichas.json', 'zotac_fichas_hermanas.json'):
    imgs = sorted((CRUDO / 'ZOTAC' / d['mpn']).glob('*.jpg'),
                  key=lambda p: int(re.search(r'image(\d+)', p.name).group(1)))
    n = copiar(imgs, 'ZOTAC', d['mpn'], d['gama'], 'high')
    fichas.append({k: d[k] for k in ('marca', 'ident', 'chip', 'gama', 'titulo', 'mpn', 'ean', 'url', 'specs')})
    print(f"ZOTAC   {d['mpn']:18} {d['chip']:17} {d['gama']:8} high={n}")

# ASROCK: L = 1200x1000 (high) · M = 600x500 (medium)
asrock = leer('asrock_fichas_www.json', 'asrock_fichas_pg.json',
              'asrock_ficha_9060xt_cl.json', 'asrock_ficha_9070_sl.json')
for d in asrock:
    chip, gama = ASROCK[d['ident']]
    carpeta = CRUDO / 'ASROCK' / seguro(d['mpn'])
    num = lambda p: int(p.stem[1:])
    alta = copiar(sorted(carpeta.glob('L*.png'), key=num), 'ASROCK', d['mpn'], gama, 'high')
    media = copiar(sorted(carpeta.glob('M*.png'), key=num), 'ASROCK', d['mpn'], gama, 'medium')
    fichas.append(dict(marca='ASROCK', ident=d['ident'], chip=chip, gama=gama,
                       titulo=d['titulo'], mpn=d['mpn'], ean='', url=d['url'], specs=d['specs']))
    print(f"ASROCK  {d['mpn']:18} {chip:17} {gama:8} high={alta} medium={media}")

salida = CAT / 'fuentes' / 'gpus' / 'GPUS_palit-gainward-pny_FICHAS-fabricante.json'
previas = json.loads(salida.read_text(encoding='utf-8'))
claves = {(f['marca'], f['ident']) for f in fichas}
combinado = [p for p in previas
             if (p['marca'], p['ident']) not in claves and p['mpn'] not in RETIRADAS] + fichas
salida.write_text(json.dumps(combinado, indent=1, ensure_ascii=False), encoding='utf-8')
print(f'\nFichas de fabricante: {len(previas)} -> {len(combinado)}')
