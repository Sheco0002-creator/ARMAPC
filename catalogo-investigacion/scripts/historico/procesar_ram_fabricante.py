"""Procesa las RAM sacadas de la web del fabricante (2026-09-11) y bajadas al USB JORGE.

TeamGroup (teamgroupinc.com), XPG (xpg.com + alternate/upcitemdb para MPN y EAN) y
Kingston (kingston.com). Además cambia la foto de la #12 G.Skill, que pasó a ser la Neo RGB.

Uso: python procesar_ram_fabricante.py <carpeta catalogo> <carpeta catalogo-investigacion-ARCHIVO en JORGE>
Copia las imágenes a catalogo/imagenes/ram/<gama>/high/ram-NN-<slug>_K.<ext> y escribe
fuentes/ram/RAM_fabricante_FICHAS.json, que lee integrar_gpu_ram.py.
Las imágenes que se sustituyen (#3, #7, #12) se mueven a JORGE, no se borran.
"""
import json, re, shutil, sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
CAT, ARCH = Path(sys.argv[1]), Path(sys.argv[2])
SUPERADOS = ARCH / 'pruebas-y-superados' / 'RAM-imagenes-sustituidas_2026-09-11'
TG = ARCH / 'RAM-TEAMGROUP_fabricante_2026-09-11'
XPG = ARCH / 'RAM-XPG_fabricante_2026-09-11'
KG = ARCH / 'RAM-KINGSTON_fabricante_2026-09-11'
NEO48 = ARCH / 'RAM-GSKILL-neo-rgb-48_2026-09-11'

# MPN -> número en el catálogo. 3 y 7 sustituyen a las TeamGroup de la investigación.
NUM = {
    'FLBD516G5200HC40CDC01': 3, 'FF3D532G6000HC30DC01': 7, 'FLBD532G6000HC38ADC01': 19,
    'TF3D432G3600HC18JDC01': 20, 'FF3D548G6400HC32ADC01': 21, 'FFXD532G7200HC34ADC01': 22,
    'AX5U5600C468G-DTLABWH': 23, 'AX5U6000C3016G-DTLABBK': 24, 'AX4U360016G18I-DTBKD35G': 25,
    'AX5U6000C3016G-DTLABRBK': 26, 'AX5U6000C3624G-DTLABRWH': 27, 'AX5U8000C3816G-DCLARBK': 28,
    'KF560C30BBEAK2-32': 29, 'KF572C38RSAK2-32': 30,
}
TG_FAMILIA = {'vulcan-ddr5-black': 'T-Force Vulcan', 'delta-rgb-ddr5-black': 'T-Force Delta RGB',
              'delta-rgb-ddr4-black': 'T-Force Delta RGB', 'xtreem-ddr5-black': 'T-Force Xtreem'}
XPG_FAMILIA = {'lancer-blade-ddr5': 'Lancer Blade', 'lancer-blade-rgb-ddr5': 'Lancer Blade RGB',
               'lancer-rgb-ddr5': 'Lancer RGB', 'spectrix-d35g-rgb-ddr4': 'Spectrix D35G RGB'}


def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def apartar(n):
    """Mueve a JORGE las imágenes actuales de la entrada n (no se borran)."""
    for p in (CAT / 'imagenes' / 'ram').rglob(f'ram-{n:02d}-*'):
        destino = SUPERADOS / p.parent.parent.name / p.parent.name
        destino.mkdir(parents=True, exist_ok=True)
        shutil.move(str(p), destino / p.name)
        print(f'   apartada {p.name}')


def copiar(n, marca, modelo, gama, origenes):
    carpeta = CAT / 'imagenes' / 'ram' / gama / 'high'
    carpeta.mkdir(parents=True, exist_ok=True)
    base = f'ram-{n:02d}-{slug(marca + " " + modelo)}'
    for k, p in enumerate(origenes, 1):
        shutil.copy2(p, carpeta / f'{base}_{k}{p.suffix.lower()}')
    return len(origenes)


def capacidad(c):
    """'16GB(2x8GB)' o '16GB (2x8GB)' -> '16GB (2x8GB)'"""
    m = re.match(r'(\d+)GB\s*\((\d)x(\d+)GB\)', c.replace(' ', ''))
    return f'{m.group(1)}GB ({m.group(2)}x{m.group(3)}GB)'


def numerico(p):
    m = re.search(r'(\d+)', p.stem)
    return (0 if p.stem.startswith('dual') else 1, int(m.group(1)) if m else 0)


fichas = []

# ---------------------------------------------------------------- TeamGroup
tg = []
for nombre in ('teamgroup_fichas.json', 'teamgroup_fichas_hermanas.json'):
    tg += json.loads((TG / nombre).read_text(encoding='utf-8-sig'))
for d in tg:
    f = d['fila']
    tipo = 'DDR4' if 'ddr4' in d['familia'] else 'DDR5'
    mts = f['Frequency'].replace('MHz', '')
    modelo = f"{TG_FAMILIA[d['familia']]} {tipo}-{mts} {capacidad(f['Capacity'])} {f['Latency']}"
    rgb = 'Sí (RGB)' if 'rgb' in d['familia'] else 'No'
    specs = {'Tipo': tipo, 'Capacidad': capacidad(f['Capacity']), 'Velocidad': f'{mts} MHz',
             'Latencia': f['Latency'], 'Voltaje': f['Voltage'], 'RGB': rgb,
             'Ancho de banda': f['Data Transfer Bandwidth'], 'Compatibilidad': f['Compatibility'],
             'Color': 'Negro', 'Características': d['caracteristicas']}
    fichas.append(dict(n=NUM[d['mpn']], marca='TEAMGROUP', modelo=modelo, mpn=d['mpn'], ean=d['ean'],
                       gama=d['gama'], titulo=d['titulo'].replace(' - TEAMGROUP', ''),
                       resumen=d['resumen'], url=d['url'], specs=specs,
                       imgs=sorted((TG / d['mpn']).glob('*.jpg'), key=numerico)))

# ---------------------------------------------------------------- XPG
for d in json.loads((XPG / 'xpg_fichas.json').read_text(encoding='utf-8')):
    s = d['specs']
    tipo = s['Memory Type']
    mts = s['Speed'].split()[0]
    color = {'Black': 'Negro', 'White': 'Blanco'}[s['Color']]
    modelo = f"{XPG_FAMILIA[d['familia']]} {tipo}-{mts} {capacidad(s['Capacity'])} {s['CAS Latency']} {s['Color']}"
    specs = {'Tipo': tipo, 'Capacidad': capacidad(s['Capacity']), 'Velocidad': f'{mts} MHz',
             'Latencia': s['CAS Latency'], 'Voltaje': s['Operating Voltage'],
             'RGB': 'Sí (RGB)' if 'rgb' in d['familia'] else 'No',
             'Perfil XMP/EXPO': 'Sí (Intel XMP 3.0 y AMD EXPO)' if tipo == 'DDR5' else 'Sí (Intel XMP 2.0)',
             'Color': color,
             **{k: v for k, v in s.items() if k not in ('Capacity', 'Speed', 'CAS Latency', 'Operating Voltage',
                                                       'Color', 'Part Number', 'Memory Type')}}
    fichas.append(dict(n=NUM[d['mpn']], marca='XPG', modelo=modelo, mpn=d['mpn'], ean=d['ean'],
                       gama=d['gama'], titulo=d['titulo'], resumen='', url=d['url'], specs=specs,
                       imgs=sorted((XPG / d['mpn']).glob('*.png'))))

# ---------------------------------------------------------------- Kingston
for d in json.loads((KG / 'kingston_fichas.json').read_text(encoding='utf-8')):
    s = d['specs']
    mts = s['Speed'].replace('MT/s', '')
    lat = s['Latency'].split()[0]
    familia = 'FURY Beast RGB EXPO' if 'BBEA' in d['mpn'] else 'FURY Renegade RGB'
    modelo = f'{familia} DDR5-{mts} 32GB (2x16GB) {lat}'
    specs = {'Tipo': 'DDR5', 'Capacidad': '32GB (2x16GB)', 'Velocidad': f'{mts} MHz', 'Latencia': s['Latency'],
             'Voltaje': s['Voltage'], 'RGB': 'Sí (RGB)',
             'Perfil XMP/EXPO': 'Sí (AMD EXPO)' if 'EXPO' in s['Profile'] else 'Sí (Intel XMP 3.0)',
             **{k: v for k, v in s.items() if k not in ('Capacity', 'Speed', 'Latency', 'Voltage', 'Profile', 'Lighting')}}
    fichas.append(dict(n=NUM[d['mpn']], marca='KINGSTON', modelo=modelo, mpn=d['mpn'], ean=d['ean'],
                       gama=d['gama'], titulo=d['titulo'], resumen='', url=d['url'], specs=specs,
                       imgs=sorted((KG / d['mpn']).glob('*.jpg'))))

# ---------------------------------------------------------------- copia de imágenes
fichas.sort(key=lambda f: f['n'])
for n in (3, 7, 12):
    apartar(n)
for f in fichas:
    k = copiar(f['n'], f['marca'], f['modelo'], f['gama'], f.pop('imgs'))
    print(f"#{f['n']:2} {f['gama']:8} {f['marca']:9} {f['modelo']:52} {f['ean']} imgs={k}")

# #12: la G.Skill de 48GB pasa a ser la Neo RGB (su foto actual es la del Neo sin RGB)
k = copiar(12, 'G.SKILL', 'Trident Z5 Neo RGB DDR5-6000 48GB', 'extrema', sorted(NEO48.glob('*.png')))
print(f'#12 extrema   G.SKILL   Neo RGB 48GB imgs={k}')

salida = CAT / 'fuentes' / 'ram' / 'RAM_fabricante_FICHAS.json'
salida.write_text(json.dumps(fichas, indent=1, ensure_ascii=False), encoding='utf-8')
print(f'\n{len(fichas)} fichas -> {salida}')
