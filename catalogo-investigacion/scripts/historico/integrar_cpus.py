"""Integra los 22 CPUs (14 Ryzen + 8 Core) en catalogo-final.json con el esquema de las placas.

Lee lo que dejaron cpus_amd.py y cpus_intel.py en el USB JORGE (CPUS_fabricante_2026-09-11/),
copia las fotos a catalogo/imagenes/procesadores/<gama>/high/<MARCA>_<MPN>_CDN_<k>.<ext> y
sustituye la categoría "Procesadores" del catálogo (el resto no se toca).

Uso: python integrar_cpus.py <carpeta catalogo> <carpeta CPUS_fabricante en JORGE> [--escribir]
"""
import json, re, shutil, sys
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
CAT, SRC = Path(sys.argv[1]), Path(sys.argv[2])
ESCRIBIR = '--escribir' in sys.argv
CATEGORIA = 'Procesadores'

# Precio de investigacion/01_PROCESADORES.md (MSRP o mercado, sin verificar por SKU).
# Gama por precio: entrada < $200 · media $200-350 · alta $350-500 · extrema > $500.
PRECIO_GAMA = {
    1: ('~$105', 'entrada'), 2: ('~$120', 'entrada'), 3: ('~$190', 'entrada'), 4: ('~$165', 'entrada'),
    5: ('~$180', 'entrada'), 6: ('~$190', 'entrada'), 7: ('~$245', 'media'), 8: ('~$320', 'media'),
    9: ('~$370', 'alta'), 10: ('~$450', 'alta'), 11: ('~$520', 'extrema'), 12: ('~$430', 'alta'),
    13: ('~$600', 'extrema'), 14: ('~$740', 'extrema'), 15: ('~$270', 'media'), 16: ('~$280', 'media'),
    17: ('~$390', 'alta'), 18: ('~$420', 'alta'), 19: ('~$580', 'extrema'), 20: ('~$240', 'media'),
    21: ('~$340', 'media'), 22: ('~$460', 'alta'),
}
# amd.com ya no tiene página del 5600 ni del 5700X3D: specs de la investigación.
INVESTIGACION = {
    1: {'Arquitectura': 'Zen 3 (Vermeer)', 'Socket': 'AM4', 'Núcleos / Hilos': '6 / 12',
        'Frecuencia base': '3.5 GHz', 'Frecuencia boost': '4.4 GHz', 'Caché L3': '32 MB', 'TDP': '65 W',
        'Memoria': 'DDR4', 'Gráficos integrados': 'No', 'Disipador incluido': 'AMD Wraith Stealth'},
    3: {'Arquitectura': 'Zen 3 + 3D V-Cache', 'Socket': 'AM4', 'Núcleos / Hilos': '8 / 16',
        'Frecuencia base': '3.0 GHz', 'Frecuencia boost': '4.1 GHz', 'Caché L3': '96 MB (3D V-Cache)',
        'TDP': '105 W', 'Memoria': 'DDR4', 'Gráficos integrados': 'No', 'Disipador incluido': 'No'},
}
# Nombres de dt de amd.com que arrastran el texto del botón de ayuda
LIMPIAR = ('Max. Boost Clock', 'Base Clock', 'Unlocked for Overclocking')


def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def seguro(mpn):
    return re.sub(r'[^A-Za-z0-9\-]+', '-', mpn).strip('-')


def limpio(k):
    return next((p for p in LIMPIAR if k.startswith(p + ' ')), k).replace('™', '').replace('®', '')


def resumen_amd(s):
    """Campos principales en español, delante de la ficha completa de amd.com."""
    g = s.get('Graphics Model', '')
    return {k: v for k, v in [
        ('Arquitectura', s.get('Processor Architecture', '')), ('Socket', s.get('CPU Socket', '')),
        ('Núcleos / Hilos', f"{s.get('# of CPU Cores', '')} / {s.get('# of Threads', '')}"),
        ('Frecuencia base', s.get('Base Clock', '')), ('Frecuencia boost', s.get('Max. Boost Clock', '').replace('Up to ', '')),
        ('Caché L3', s.get('L3 Cache', '')), ('TDP', s.get('Default TDP', '').replace('W', ' W')),
        ('Memoria', s.get('System Memory Type', '')),
        ('Gráficos integrados', g.replace('™', '') if g and g != 'Discrete Graphics Card Required' else 'No'),
        ('Disipador incluido', s.get('Thermal Solution (PIB)', '').replace('Not Included', 'No')),
    ] if v and v != ' / '}


def resumen_intel(s):
    mem = s.get('Memory Types', '')
    return {k: v for k, v in [
        ('Arquitectura', s.get('Code Name', '')), ('Socket', s.get('Sockets Supported', '').replace('FC', '')),
        ('Núcleos / Hilos', f"{s['Total Cores']} ({s['# of Performance-cores']}P + {s['# of Efficient-cores']}E) / {s['Total Threads']}"),
        ('Frecuencia base', s.get('Performance-core Base Frequency', '') + ' (P-core)'),
        ('Frecuencia boost', s.get('Max Turbo Frequency', '')), ('Caché L3', s.get('Cache', '')),
        ('TDP', f"{s.get('Processor Base Power', '')} (turbo {s.get('Maximum Turbo Power', '')})"),
        ('Memoria', ' + '.join(t for t in ('DDR5', 'DDR4') if t in mem)),
        ('Gráficos integrados', s.get('GPU Name', '').replace('®', '') or 'No'), ('Disipador incluido', 'No'),
        ('NPU', f"{s['NPU Name'].replace('®', '')} ({s['Overall Peak TOPS (Int8)']} TOPS)" if s.get('NPU Name') else ''),
    ] if v}


fichas = json.loads((SRC / 'amd_fichas.json').read_text(encoding='utf-8')) + \
         json.loads((SRC / 'intel_fichas.json').read_text(encoding='utf-8'))
cpus, rotas = [], []
for d in sorted(fichas, key=lambda d: d['n']):
    n, marca, mpn = d['n'], d['marca'], d['mpn']
    precio, gama = PRECIO_GAMA[n]
    if marca == 'AMD':
        crudo = {limpio(k): v for k, v in d['specs'].items()}
        specs = {**(INVESTIGACION.get(n) or resumen_amd(crudo)), **crudo}
        titulo = (d['titulo'] or f"AMD {d['modelo']} Desktop Processor").replace('™', '')
        resumen = d['resumen'].replace('™', '')
    else:
        specs = {**resumen_intel(d['specs']), **d['specs']}
        titulo = f"Intel {d['modelo']} Desktop Processor"
        resumen = ''
    if not resumen:
        s = specs
        resumen = f"{marca.title() if marca == 'INTEL' else marca} {d['modelo']}, {s['Socket']}, {s['Núcleos / Hilos']} núcleos/hilos, hasta {s['Frecuencia boost']}"
    # fotos: JORGE -> imagenes/procesadores/<gama>/high/
    origen = sorted((SRC / marca / mpn).iterdir())
    carpeta = CAT / 'imagenes' / 'procesadores' / gama / 'high'
    carpeta.mkdir(parents=True, exist_ok=True)
    high = []
    for k, p in enumerate(origen, 1):
        nombre = f'{marca}_{seguro(mpn)}_CDN_{k}{p.suffix.lower()}'
        if ESCRIBIR:
            shutil.copy2(p, carpeta / nombre)
        high.append(f'imagenes/procesadores/{gama}/high/{nombre}')
    faltante = [f for f, v in (('mpn', mpn), ('ean', d['ean']), ('specs', specs), ('imagen', high)) if not v]
    cpus.append({
        'marca': marca, 'modelo': d['modelo'], 'mpn': mpn, 'ean': d['ean'], 'icecat_id': '',
        'categoria': CATEGORIA, 'titulo': titulo, 'resumen': resumen,
        'imagen_alta': '', 'imagen_alta_res': '', 'imagen_500': '', 'galeria': [],
        'n_specs': len(specs), 'specs': specs, 'slug': slug(f"{marca} {d['modelo']}"),
        'imagenes_local': {'medium': [], 'high': high}, 'imagen_principal': high[0] if high else '',
        'n_imagenes': len(high), 'fuente': 'cdn', 'completo': not faltante, 'faltante': faltante,
        'url_oficial': d['url'], 'gama': gama, 'precio_referencia': precio, 'precio_verificado': False,
    })
    print(f"#{n:2} {gama:8} {marca:5} {d['modelo']:24} {mpn:17} {d['ean']} img={len(high)} specs={len(specs):2} {precio:6} "
          f"{'OK' if not faltante else 'falta ' + ','.join(faltante)}")

if ESCRIBIR:
    rotas = [p for c in cpus for p in c['imagenes_local']['high'] if not (CAT / p).exists()]
    p = CAT / 'catalogo-final.json'
    datos = [r for r in json.loads(p.read_text(encoding='utf-8')) if r['categoria'] != CATEGORIA] + cpus
    p.write_text(json.dumps(datos, indent=1, ensure_ascii=False), encoding='utf-8')
    print(f'\nEscrito: {len(datos)} productos en {p.name} · rutas de CPU rotas: {len(rotas)}')
