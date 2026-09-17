"""Integra GPUs y RAM en catalogo-final.json con el mismo esquema que las placas.

Uso: python integrar_gpu_ram.py <carpeta catalogo> [--escribir]
Sin --escribir sólo muestra el resumen.
"""
import csv, json, re, sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from xlsx import read_xlsx

sys.stdout.reconfigure(encoding='utf-8')
CAT = Path(sys.argv[1])
ESCRIBIR = '--escribir' in sys.argv
GAMAS = ['entrada', 'media', 'alta', 'extrema']

# ---------------------------------------------------------------- utilidades

def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def elegir_ean(lista):
    """Prefiere el EAN-13 internacional; si sólo hay UPC, lo da en 13 dígitos."""
    codes = [c.strip() for c in lista.split('|') if c.strip().isdigit()]
    for c in codes:
        if len(c) == 13 and not c.startswith('0'):
            return c
    for c in codes:
        if len(c) == 13:
            return c
    for c in codes:
        if len(c) == 12:
            return '0' + c
    return ''


def fichas(xlsx_path):
    rows = read_xlsx(xlsx_path)
    head = rows[0]
    corte = head.index('Your product ID')
    out = {}
    for r in rows[1:]:
        r = r + [''] * (len(head) - len(r))
        d = dict(zip(head, r))
        specs = {}
        if d.get('Video/mp4'):
            specs['Video/mp4'] = d['Video/mp4']
        for k, v in zip(head[corte + 1:], r[corte + 1:]):
            if v:
                specs[k] = v
        d['_specs'] = specs
        out[d['Prod_id']] = d
    return out


def imagenes(cat, prefijo):
    """Busca las imágenes de un producto en imagenes/<cat>/<gama>/<medium|high>/."""
    res = {'medium': [], 'high': []}
    gama = None
    for g in GAMAS:
        for tam in ('medium', 'high'):
            carpeta = CAT / 'imagenes' / cat / g / tam
            if not carpeta.exists():
                continue
            hall = [p for p in carpeta.iterdir() if p.name.startswith(prefijo)]
            if hall:
                gama = g
                num = lambda p: int(m.group(1)) if (m := re.search(r'_(\d+)\.\w+$', p.name)) else 0
                res[tam] = [f'imagenes/{cat}/{g}/{tam}/{p.name}' for p in sorted(hall, key=num)]
    return res, gama


def entrada(**kw):
    """Arma el registro con el orden de campos de las placas."""
    specs = kw.get('specs') or {}
    imgs = kw['imagenes_local']
    principal = (imgs['medium'] or imgs['high'] or [''])[0]
    faltante = []
    if not kw.get('mpn'):
        faltante.append('mpn')
    if not kw.get('ean'):
        faltante.append('ean')
    if not specs:
        faltante.append('specs')
    if not principal:
        faltante.append('imagen')
    if not kw.get('ean') and kw.get('mpn') in EAN_MANUAL:
        kw['ean'] = EAN_MANUAL[kw['mpn']]
        faltante = [f for f in faltante if f != 'ean']
    reg = {
        'marca': kw['marca'],
        'modelo': kw['modelo'],
        'mpn': kw.get('mpn', ''),
        'ean': kw.get('ean', ''),
        'icecat_id': kw.get('icecat_id', ''),
        'categoria': kw['categoria'],
        'titulo': kw.get('titulo', ''),
        'resumen': kw.get('resumen', ''),
        'imagen_alta': kw.get('imagen_alta', ''),
        'imagen_alta_res': kw.get('imagen_alta_res', ''),
        'imagen_500': kw.get('imagen_500', ''),
        'galeria': kw.get('galeria', []),
        'n_specs': len(specs),
        'specs': specs,
        'slug': slug(f"{kw['marca']} {kw['modelo']}"),
        'imagenes_local': imgs,
        'imagen_principal': principal,
        'n_imagenes': max(len(imgs['medium']), len(imgs['high'])),
        'fuente': kw['fuente'],
        'completo': not faltante,
        'faltante': faltante,
        'url_oficial': kw.get('url_oficial', ''),
        'gama': kw['gama'],
        'precio_referencia': kw.get('precio_referencia', ''),
        'precio_verificado': kw.get('precio_verificado', False),
    }
    if 'chip' in kw:
        reg = {**{k: reg[k] for k in ('marca', 'modelo')}, 'chip': kw['chip'],
               **{k: v for k, v in reg.items() if k not in ('marca', 'modelo')}}
    return reg


def desde_icecat(d):
    return dict(
        mpn=d['Prod_id'], ean=elegir_ean(d.get('GTIN(EAN/UPC)', '')), icecat_id=d['Icecat_id'],
        titulo=d['ProductTitle'], resumen=d['ShortSummaryDescription'],
        imagen_alta=d['HighPic'], imagen_alta_res=d['HighPic Resolution'], imagen_500=d['Pic500x500'],
        galeria=[u for u in d['ProductGallery'].split('|') if u], specs=d['_specs'],
    )

# ---------------------------------------------------------------- GPUs
# Precio de mercado por chip, de investigacion/02_TARJETAS_GRAFICAS.md (no es precio del SKU).
PRECIO_CHIP = {
    'RTX 5060': '$310-330', 'RTX 5060 Ti 8GB': '$400-430', 'RTX 5060 Ti 16GB': '$440-470',
    'RTX 5070': '$570-620', 'RTX 5070 Ti': '$770-820', 'RTX 5080': '$1040-1100',
    'RTX 5090': '$2000-2800', 'RTX 4060': '~$280', 'RTX 4060 Ti': '~$370', 'RTX 4070': '~$500',
    'RTX 4070 Ti Super': '~$750', 'RTX 4080 Super': '~$950', 'RTX 4090': '~$1600-2000',
    'RX 9060 XT 8GB': '$310-340', 'RX 9060 XT 16GB': '$340-370', 'RX 9070': '$560-600',
    'RX 9070 XT': '$580-650', 'RX 7600': '~$250', 'RX 7700 XT': '~$400', 'RX 7800 XT': '~$470',
    'RX 7900 XT': '~$700', 'RX 7900 XTX': '~$850',
}
CHIP = {
    'GV-N5060EAGLE OC-8GD': 'RTX 5060',
    'GV-N506TEAGLE OC-8GD': 'RTX 5060 Ti 8GB',
    'GV-N506TWF2OC-16GD': 'RTX 5060 Ti 16GB',
    'GEFORCE RTX 5060 TI 16G VENTUS 3X OC': 'RTX 5060 Ti 16GB',
    'GV-N5070EAGLE OC-12GD': 'RTX 5070',
    'GEFORCE RTX 5070 12G VENTUS 3X OC': 'RTX 5070',
    'TUF-RTX5070-O12G-GAMING': 'RTX 5070',
    'GEFORCE RTX 5070 TI 16G VENTUS 3X OC': 'RTX 5070 Ti',
    'GEFORCE RTX 5080 16G VENTUS 3X OC': 'RTX 5080',
    'GV-N5090GAMING OC-32GD': 'RTX 5090',
    'GV-N4060EAGLE OC-8GD': 'RTX 4060',
    'GEFORCE RTX 4060 TI VENTUS 3X 8G OC': 'RTX 4060 Ti',
    'GV-N4070GAMING OCV2-12GD': 'RTX 4070',
    'GEFORCE RTX 4070 TI SUPER 16G VENTUS 3X OC': 'RTX 4070 Ti Super',
    'GEFORCE RTX 4080 SUPER 16G VENTUS 3X OC': 'RTX 4080 Super',
    'GV-N4080GAMING OC-16GD': 'RTX 4080',  # no es la Super del catálogo
    'GV-N4090GAMING OC-24GD': 'RTX 4090',
    'GV-R9060XTGAMING OC-8GD': 'RX 9060 XT 8GB',
    'GV-R9060XTGAMING OC-16GD': 'RX 9060 XT 16GB',
    'GV-R9070GAMING OC-16GD': 'RX 9070',
    'GV-R9070XTGAMING OC-16GD': 'RX 9070 XT',
    'GV-R76GAMING OC-8GD': 'RX 7600',
    'GV-R77XTGAMING OC-12GD': 'RX 7700 XT',
    'GV-R78XTGAMING OC-16GD': 'RX 7800 XT',
    'RADEON RX 7900 XT GAMING TRIO CLASSIC 20G': 'RX 7900 XT',
    'GV-R79XTXGAMING OC-24GD': 'RX 7900 XTX',
}

# EAN que ni Icecat ni el fabricante publican. Hallados en upcitemdb (2026-09-10) por MPN
# y verificados por dígito de control. Los UPC de 12 dígitos van con un 0 delante.
EAN_MANUAL = {
    'TUF-RTX5070-O12G-GAMING': '0197105870352',
    'DUAL-RTX5060-O8G': '0199291057906',
    'PRIME-RTX5060TI-O16G': '0199291014756',
    'TUF-RTX5080-O16G-GAMING': '0197105868335',
    'PRIME-RX9070-O16G': '0197105860834',      # ojo: 0197105860810 es la versión XT
    'TUF-RX9070XT-O16G-GAMING': '0197105860803',
    'CMK48GX5M2B5600C40': '0840006665021',
    'CMK32GX4M2E3200C16': '0840006608547',
    'F5-6400J3239G16GX2-TZ5RS': '0848354041351',
    'F4-3600C18D-32GVK': '0848354033103',
    # Palit: fichas de tiendas alemanas con el MPN exacto (2026-09-10)
    'NE7506T019T1-GB2061S': '4710562245189',   # alternate.de
    'NE7506T019P1-GB2062D': '4710562245264',   # alternate.de
    'NE75080S19T2-GB2031A': '4710562244922',   # caseking.de
    'NE75090S19R5-GB2020G': '4710562244847',   # caseking.de
    'NE75070S19K9-GB2050S': '4710562245080',   # alternate.de — 5070 Infinity 3 OC
    'NE7507TS19T2-GB2031U': '4710562245516',   # caseking.de — 5070 Ti GamingPro-S OC
    'CMK32GX5M2B6000C30': '0840006671350',     # bestbuy.com y upcitemdb coinciden
    'CMK64GX5M2B6000C30': '0840006672456',     # upcitemdb
    # ZOTAC (versión europea -10P/-10M; Best Buy vende la americana -10A, otro SKU)
    'ZT-B50900J-10P': '8886307700001',         # caseking.de
    'ZT-B50700J-10P': '8886307700605',         # alternate.de y caseking.de coinciden
    'ZT-B50620H-10M': '8886307700629',         # alternate.de
    'ZT-B50610H-10M': '8886307700643',         # caseking.de
    # ASRock: caseking.de (por nombre) y upcitemdb (por código de modelo) coinciden
    'RX9070XT SL 16G': '4711581490451',
    'RX9070 CL 16G': '4711581490475',
    'RX9060XT SL 16GO': '4711581490857',
    'RX7900XTX TC 24GO': '4710483941771',      # sólo upcitemdb
    # Hermanas que sustituyen a las 4 sin EAN (2026-09-10)
    'ZT-B50800J2-10P': '8886307700568',        # caseking.de y alternate.de — 5080 Solid Core OC
    'ZT-B50710J3-10P': '8886307700803',        # caseking.de y alternate.de — 5070 Ti Solid SFF OC
    'RX9060XT CL 16GO': '4711581491205',       # caseking.de y upcitemdb
    'RX9070 SL 16GO': '4711581490468',         # sólo caseking.de (nombre exacto)
    # RAM G.Skill y Corsair (2026-09-11) — ver RAM-GSKILL-CORSAIR_ean_2026-09-11.json en JORGE
    'F5-6000J3038F16GX2-TZ5N': '0848354040453',   # upcitemdb
    'F5-6400J3039G16GX2-TR5NS': '4713294236852',  # alternate.de
    'F5-6000J2636H24GX2-TZ5NR': '0848354049371',  # upcitemdb
    'F5-6000J3040G32GX2-TZ5RK': '4713294231949',  # alternate.de (UPC EE.UU. 0848354041948)
    'CMK16GX5M2B5200C40': '0840006666745',        # alternate.de y upcitemdb coinciden
    'CMP32GX5M2B6400C32': '0840006674351',        # alternate.de y upcitemdb coinciden
}

gpu_fichas = {}
for f in ('GPUS_22-principales_FICHAS-especificaciones.xlsx', 'GPUS_7-faltantes_FICHAS-especificaciones.xlsx'):
    gpu_fichas.update(fichas(CAT / 'fuentes' / 'gpus' / f))

gpus, avisos = [], []
for mpn, chip in CHIP.items():
    d = gpu_fichas.get(mpn)
    if d is None:
        avisos.append(f'GPU sin ficha: {mpn}')
        continue
    marca = d['Supplier'].upper()
    imgs, gama = imagenes('gpus', f'{marca}_{mpn}_')
    if gama is None:
        avisos.append(f'GPU sin imágenes: {mpn}')
        continue
    modelo = d['Model'] if d['Model'] and d['Model'] != mpn else 'TUF Gaming GeForce RTX 5070 OC 12G'
    gpus.append(entrada(
        marca=marca, modelo=modelo, chip=chip, categoria='Tarjetas gráficas',
        imagenes_local=imgs, fuente='icecat', gama=gama,
        precio_referencia=PRECIO_CHIP.get(chip, ''), precio_verificado=False,
        **desde_icecat(d)))

sin_uso = sorted(set(gpu_fichas) - set(CHIP))

# GPUs sacadas de la web del fabricante (Palit, Gainward, PNY) — las genera marcas_gpu.py
fab = CAT / 'fuentes' / 'gpus' / 'GPUS_palit-gainward-pny_FICHAS-fabricante.json'
if fab.exists():
    for d in json.loads(fab.read_text(encoding='utf-8')):
        mpn_seguro = re.sub(r'[^A-Za-z0-9\-]+', '-', d['mpn'] or d['ident'])
        imgs, gama = imagenes('gpus', f"{d['marca']}_{mpn_seguro}_CDN_")
        if gama is None:
            avisos.append(f"GPU sin imágenes: {d['marca']} {mpn_seguro}")
            continue
        modelo = re.sub(r'^(Palit|Gainward|PNY|ASUS|ZOTAC)\s+', '', d['titulo']).replace('™', '')
        gpus.append(entrada(
            marca=d['marca'], modelo=modelo, chip=d['chip'], categoria='Tarjetas gráficas',
            mpn=d['mpn'], ean=d['ean'], specs=d['specs'], url_oficial=d['url'],
            imagenes_local=imgs, fuente='cdn', gama=gama,
            precio_referencia=PRECIO_CHIP.get(d['chip'], ''), precio_verificado=False))

# ---------------------------------------------------------------- RAM
# n, marca, modelo, mpn (de la URL oficial), tipo, capacidad, velocidad, latencia, voltaje, rgb, perfil, url
RAM = [
    # 1, 5, 9, 10, 12 y 14 corregidos el 2026-09-11: la investigación traía SKU inexistentes,
    # descatalogados o sin EAN publicado; se usa la hermana más cercana con EAN.
    # 3 y 7 (TeamGroup) salen de RAM_fabricante_FICHAS.json, igual que 19-30.
    (1, 'CORSAIR', 'Vengeance DDR5-5200 16GB (2x8GB) CL40', 'CMK16GX5M2B5200C40', 'DDR5', '16GB (2x8GB)', '5200 MHz', 'CL40', '1.25V', 'No', 'Sí (Intel XMP 3.0)', 'https://www.corsair.com/us/en/search?query=CMK16GX5M2B5200C40'),
    (2, 'KINGSTON', 'FURY Beast DDR5-5600 16GB (2x8GB) CL36', 'KF556C36BBEK2-16', None, None, None, None, None, None, None, 'https://www.kingston.com/en/memory/gaming/kingston-fury-beast-ddr5-memory'),
    # 4 y 13: la investigación decía "…M2D…"; ese SKU no existe en corsair.com, el real es "…M2B…"
    (4, 'CORSAIR', 'Vengeance DDR5-6000 32GB (2x16GB) CL30', 'CMK32GX5M2B6000C30', 'DDR5', '32GB (2x16GB)', '6000 MHz', 'CL30', '1.35V', 'No', 'Sí (AMD EXPO)', 'https://www.corsair.com/us/en/p/memory/cmk32gx5m2b6000c30/vengeance-32gb-2x16gb-ddr5-dram-6000mt-s-c30-memory-kit-black-cmk32gx5m2b6000c30'),
    (5, 'G.SKILL', 'Trident Z5 Neo DDR5-6000 32GB (2x16GB) CL30', 'F5-6000J3038F16GX2-TZ5N', 'DDR5', '32GB (2x16GB)', '6000 MHz', 'CL30-38-38', '1.35V', 'No', 'Sí (AMD EXPO)', 'https://www.gskill.com/search/F5-6000J3038F16GX2-TZ5N'),
    (6, 'KINGSTON', 'FURY Beast DDR5-6000 32GB (2x16GB) CL36', 'KF560C36BBEK2-32', None, None, None, None, None, None, None, 'https://www.kingston.com/en/memory/gaming/kingston-fury-beast-ddr5-memory'),
    (8, 'G.SKILL', 'Trident Z5 RGB DDR5-6400 32GB (2x16GB) CL32', 'F5-6400J3239G16GX2-TZ5RS', 'DDR5', '32GB (2x16GB)', '6400 MHz', 'CL32', '1.40V', 'Sí', 'Sí', 'https://www.gskill.com/product/165/388/1661838857/F5-6400J3239G16GX2-TZ5RS'),
    (9, 'CORSAIR', 'Dominator Titanium DDR5-6400 32GB (2x16GB) CL32', 'CMP32GX5M2B6400C32', 'DDR5', '32GB (2x16GB)', '6400 MHz', 'CL32', '1.40V', 'Sí (iCUE)', 'Sí (Intel XMP 3.0)', 'https://www.corsair.com/us/en/search?query=CMP32GX5M2B6400C32'),
    (10, 'G.SKILL', 'Trident Z5 Royal Neo DDR5-6400 32GB (2x16GB) CL30', 'F5-6400J3039G16GX2-TR5NS', 'DDR5', '32GB (2x16GB)', '6400 MHz', 'CL30-39-39', '1.40V', 'Sí', 'Sí', 'https://www.gskill.com/search/F5-6400J3039G16GX2-TR5NS'),
    (11, 'CORSAIR', 'Vengeance DDR5-5600 48GB (2x24GB) CL40', 'CMK48GX5M2B5600C40', 'DDR5', '48GB (2x24GB)', '5600 MHz', 'CL40', '1.25V', 'No', 'Sí', 'https://www.corsair.com/us/en/p/memory/cmk48gx5m2b5600c40/vengeance-48gb-2x24gb-ddr5-dram-5600mhz-c40-memory-kit-black-cmk48gx5m2b5600c40/'),
    (12, 'G.SKILL', 'Trident Z5 Neo RGB DDR5-6000 48GB (2x24GB) CL26', 'F5-6000J2636H24GX2-TZ5NR', 'DDR5', '48GB (2x24GB)', '6000 MHz', 'CL26-36-36', '1.40V', 'Sí', 'Sí (AMD EXPO)', 'https://www.gskill.com/product/165/390/1741936977/F5-6000J2636H24GX2-TZ5NR'),
    (13, 'CORSAIR', 'Vengeance DDR5-6000 64GB (2x32GB) CL30', 'CMK64GX5M2B6000C30', 'DDR5', '64GB (2x32GB)', '6000 MHz', 'CL30', '1.35V', 'No', 'Sí', 'https://www.corsair.com/us/en/p/memory/cmk64gx5m2b6000c30/vengeance-64gb-2x32gb-ddr5-dram-6000mt-s-cl30-memory-kit-black-cmk64gx5m2b6000c30'),
    (14, 'G.SKILL', 'Trident Z5 RGB DDR5-6000 64GB (2x32GB) CL30', 'F5-6000J3040G32GX2-TZ5RK', 'DDR5', '64GB (2x32GB)', '6000 MHz', 'CL30-40-40', '1.40V', 'Sí', 'Sí', 'https://www.gskill.com/search/F5-6000J3040G32GX2-TZ5RK'),
    (15, 'KINGSTON', 'FURY Beast DDR5-5600 64GB (2x32GB) CL40', 'KF556C40BBK2-64', None, None, None, None, None, None, None, 'https://www.kingston.com/en/memory/gaming/kingston-fury-beast-ddr5-memory'),
    (16, 'CORSAIR', 'Vengeance LPX DDR4-3200 32GB (2x16GB) CL16', 'CMK32GX4M2E3200C16', 'DDR4', '32GB (2x16GB)', '3200 MHz', 'CL16', '', 'No', '', 'https://www.corsair.com/us/en/p/memory/cmk32gx4m2e3200c16/vengeance-lpx-32gb-2x16gb-ddr4-dram-3200mhz-c16-memory-kit-black-cmk32gx4m2e3200c16/'),
    (17, 'G.SKILL', 'Ripjaws V DDR4-3600 32GB (2x16GB) CL18', 'F4-3600C18D-32GVK', 'DDR4', '32GB (2x16GB)', '3600 MHz', 'CL18', '', 'No', '', 'https://www.gskill.com/product/165/184/'),
    (18, 'KINGSTON', 'FURY Beast DDR4-3200 16GB (2x8GB) CL16', 'KF432C16BBK2/16', None, None, None, None, None, None, None, 'https://www.kingston.com/en/memory/gaming/kingston-fury-beast-ddr4-memory'),
]
# Rangos de documentacion/RANGOS-PRECIO-RAM.md (verificados 2026-09-08), por tipo y capacidad.
RANGO = {('DDR5', 16): '$105-140', ('DDR5', 32): '$490-620', ('DDR5', 48): '$675-870',
         ('DDR5', 64): '$1000-1300', ('DDR4', 16): '$150-185', ('DDR4', 32): '$240-300'}
# Productos con precio real propio en la tabla de evidencia de ese documento.
CON_EVIDENCIA = {4, 5, 6, 7, 14, 16, 17, 18}

ram_fichas = fichas(CAT / 'fuentes' / 'ram' / 'RAM_5-kingston-fury_FICHAS-especificaciones.xlsx')
ram = []
for n, marca, modelo, mpn, tipo, cap, vel, lat, volt, rgb, perfil, url in RAM:
    imgs, gama = imagenes('ram', f'ram-{n:02d}-')
    tipo_k = 'DDR4' if 'DDR4' in modelo else 'DDR5'
    gb = int(re.search(r'(\d+)GB \(', modelo).group(1))
    comun = dict(marca=marca, modelo=modelo, categoria='Módulos de memoria', imagenes_local=imgs,
                 gama=gama, url_oficial=url, precio_referencia=RANGO[(tipo_k, gb)],
                 precio_verificado=n in CON_EVIDENCIA)
    if mpn in ram_fichas:
        ram.append(entrada(fuente='icecat', **comun, **desde_icecat(ram_fichas[mpn])))
    else:
        specs = {k: v for k, v in [('Tipo', tipo), ('Capacidad', cap), ('Velocidad', vel),
                                   ('Latencia', lat), ('Voltaje', volt), ('RGB', rgb),
                                   ('Perfil XMP/EXPO', perfil)] if v}
        ram.append(entrada(fuente='cdn', mpn=mpn, specs=specs, **comun))
    ram[-1]['_n'] = n
    if gama is None:
        avisos.append(f'RAM sin imagen: {n}')

# RAM sacadas de la web del fabricante (TeamGroup, XPG, Kingston) — las genera procesar_ram_fabricante.py
fab_ram = CAT / 'fuentes' / 'ram' / 'RAM_fabricante_FICHAS.json'
if fab_ram.exists():
    for d in json.loads(fab_ram.read_text(encoding='utf-8')):
        n = d['n']
        imgs, gama = imagenes('ram', f'ram-{n:02d}-')
        if gama is None:
            avisos.append(f'RAM sin imagen: {n}')
            continue
        gb = int(re.search(r'(\d+)GB \(', d['modelo']).group(1))
        ram.append(entrada(fuente='cdn', marca=d['marca'], modelo=d['modelo'], mpn=d['mpn'], ean=d['ean'],
                           titulo=d['titulo'], resumen=d['resumen'], specs=d['specs'],
                           categoria='Módulos de memoria', imagenes_local=imgs, gama=gama,
                           url_oficial=d['url'], precio_referencia=RANGO[(d['specs']['Tipo'], gb)],
                           precio_verificado=n in CON_EVIDENCIA))
        ram[-1]['_n'] = n
ram.sort(key=lambda r: r['_n'])
for r in ram:
    del r['_n']

ram_sin_uso = sorted(set(ram_fichas) - {r[3] for r in RAM})

# ---------------------------------------------------------------- resumen / escritura
for titulo, lista in (('GPUs', gpus), ('RAM', ram)):
    print(f'\n== {titulo}: {len(lista)} ==')
    for r in lista:
        extra = r.get('chip', '')
        print(f"  {r['gama']:8} {r['marca']:9} {r['modelo'][:48]:48} {extra:17} ean={r['ean'] or '-':13} "
              f"img={r['n_imagenes']:2} specs={r['n_specs']:2} {r['precio_referencia']:11} "
              f"{'OK' if r['completo'] else 'falta ' + ','.join(r['faltante'])}")
print('\nFichas GPU sin usar (sin imágenes o fuera de catálogo):', sin_uso)
print('Fichas RAM sin usar:', ram_sin_uso)
for a in avisos:
    print('AVISO:', a)

# Rutas rotas
rotas = [p for r in gpus + ram for t in ('medium', 'high') for p in r['imagenes_local'][t]
         if not (CAT / p).exists()]
print('Rutas de imagen:', sum(len(r['imagenes_local'][t]) for r in gpus + ram for t in ('medium', 'high')),
      '· rotas:', len(rotas))

if ESCRIBIR:
    p = CAT / 'catalogo-final.json'
    datos = json.loads(p.read_text(encoding='utf-8'))
    datos = [r for r in datos if r['categoria'] not in ('Tarjetas gráficas', 'Módulos de memoria')]
    datos += gpus + ram
    p.write_text(json.dumps(datos, indent=1, ensure_ascii=False), encoding='utf-8')
    print(f'\nEscrito: {len(datos)} productos en {p.name}')
