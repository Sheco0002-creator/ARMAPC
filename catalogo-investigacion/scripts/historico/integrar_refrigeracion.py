"""Integra la refrigeración en catalogo-final.json como categoría "Refrigeración".

Lee REFRIGERACION_fabricante_2026-09-11/ del USB JORGE: fichas_refrigeracion.json (38 = 10 marcas del ranking ×
entrada/media/alta/extrema, menos RETIRADAS.json) y EXCLUIR_fotos.json (fotos que no son sólo el producto: cajas,
accesorios, despieces, diagramas, escenas con texto — revisadas a ojo en hoja de contactos).
La gama la da la selección (4 por marca), no el precio. Campo `tipo`: aire | liquida.
Specs: resumen en español (tipo, altura/radiador, TDP, ventiladores, sockets AM5/LGA1851) + ficha completa traducida
(alternate.de en alemán; Thermalright en inglés, de thermalright.com, con UPC de Micro Center).
Fotos: lado mayor >= 900 px, a catalogo/imagenes/refrigeracion/<gama>/high/<MARCA>_<MPN>_CDN_<k>.<ext>.

Uso: python integrar_refrigeracion.py <carpeta catalogo> <carpeta REFRIGERACION_fabricante en JORGE> [--escribir]
"""
import json, re, shutil, sys
from pathlib import Path
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')
CAT, SRC = Path(sys.argv[1]), Path(sys.argv[2])
ESCRIBIR = '--escribir' in sys.argv
CATEGORIA = 'Refrigeración'
MIN_PX = 900
EXCLUIR = {int(k): set(v) for k, v in json.loads((SRC / 'EXCLUIR_fotos.json').read_text(encoding='utf-8')).items()}
RETIRADAS = {int(k) for k in json.loads((SRC / 'RETIRADAS.json').read_text(encoding='utf-8'))}
# Precio de referencia SIN verificar: alternate.de en € ≈ $; Thermalright: precio de Micro Center (USD) redondeado
PRECIO_TR = {13: 35, 14: 50, 15: 60, 16: 150}

CLAVES_DE = {
    'Art': 'Tipo de producto', 'CPU-Kühler Bauart': 'Formato', 'Serie': 'Serie', 'Farbe': 'Color', 'Verwendung': 'Uso',
    'Geeignete Sockel': 'Sockets compatibles', 'CPU · bis max. TDP': 'TDP máx.', 'System': 'Sistema',
    'Radiatorengröße': 'Tamaño del radiador', 'Material Kühlkörper': 'Material del disipador', 'Heatpipeverbindungen': 'Heatpipes',
    'Abmessungen · Gesamt': 'Dimensiones totales', 'Abmessungen · Kühlkörper': 'Dimensiones del disipador',
    'Abmessungen · Fan1': 'Ventilador', 'Abmessungen · Fan2': 'Ventilador 2', 'Drehzahl': 'Velocidad del ventilador',
    'Volumenstrom': 'Flujo de aire', 'Luftdruck': 'Presión estática', 'Lautstärke': 'Ruido', 'Lüfterlagerung': 'Rodamiento',
    'Stromanschluss': 'Conector', 'Spannungsbereich': 'Tensión', 'Leistungsaufnahme': 'Consumo', 'Kabellänge': 'Longitud del cable',
    'Pumpe · Anschluss': 'Bomba · conector', 'Pumpe · Eingangsspannung': 'Bomba · tensión', 'Pumpe · Geschwindigkeiten': 'Bomba · velocidad',
    'Pumpe · Leistungsaufnahme': 'Bomba · consumo', 'LED-Beleuchtung': 'Iluminación', 'LED-Beleuchtung · Farbe': 'Color de iluminación',
    'RGB-Standard': 'Estándar RGB', 'Befestigung': 'Montaje', 'Ausstattung': 'Incluye', 'Zubehör · vorhanden': 'Accesorios incluidos',
    'Gewicht · CPU-Kühler': 'Peso del disipador', 'Gewicht · Gesamt': 'Peso', 'Hergestellt in': 'Fabricado en', 'Feature': 'Características',
}
CLAVES_EN = {  # thermalright.com
    'Heatsink · Dimension': 'Dimensiones del disipador', 'Heatsink · Weight': 'Peso del disipador', 'Heatsink · Heat pipes': 'Heatpipes',
    'Heatsink · Copper Base': 'Base', 'Heatsink · Digital Connector': 'Conector de la pantalla', 'Pump Dimensions': 'Dimensiones de la bomba',
    'Radiator Fimensions': 'Dimensiones del radiador', 'Pump Rated Speed': 'Bomba · velocidad', 'Screen Size': 'Pantalla',
    'Screen Resolution': 'Resolución de pantalla', 'Pump Rated Voltage': 'Bomba · tensión', 'Connector': 'Bomba · conector',
    'Radiator': 'Material del radiador', 'Warranty': 'Garantía',
}
CLAVES_EN_FAN = {'Dimension': 'dimensiones', 'Weight': 'peso', 'Rated Speed': 'velocidad', 'Noise Level': 'ruido', 'Air Flow': 'flujo de aire',
                 'Air Pressure': 'presión estática', 'Ampere': 'corriente', 'Connector': 'conector', 'ARGB Connector': 'conector ARGB',
                 'Bearing Type': 'rodamiento'}
# EAN/MPN van en campos propios; "Weitere Informationen"/"Hinweis" = textos de marketing en alemán; "Typ" redundante
# 'Zubehör · vorhanden' = listas libres de accesorios en alemán (sin valor para la tienda) → fuera
FUERA = {'Typ', 'EAN', 'Hersteller-Nr.', 'Weitere Informationen', 'Hinweis', 'Zubehör · vorhanden', 'Feature'}
# 'Feature' de alternate.de: traducido a mano; PANTALLA = dato para el resumen
FEATURE = {
    11: 'Pantalla IPS de 3,4" (480 × 480)',
    12: 'Pantalla IPS LCD de 4,5" (480 × 854)',
    24: 'Pantalla IPS LCD de 5"',
    26: 'Pantalla LCD de 1,54" (39,1 mm), 240 × 240 px, 300 cd/m², 30 Hz',
    27: 'Pantalla LCD IPS de 2,72" (69 mm), 16,7 millones de colores, 640 × 640 px, 690 cd/m², 60 Hz',
    28: 'Pantalla LCD IPS de 2,72" (69 mm), 16,7 millones de colores, 640 × 640 px, 690 cd/m², 60 Hz',
    29: 'Cubierta superior negra gun-metal anodizada con acabado de aluminio cepillado, tecnología Direct Contact, tecnología Silent',
    34: 'Pantalla IPS LCD de 3,4"',
    35: 'Pantalla OLED curva de 6,67", 3 ventiladores UNI FAN P28 V2',
    36: 'Pantalla OLED curva de 6,67", 3 ventiladores UNI FAN TL FLEX',
    40: 'Pantalla LCD de 3,5", ventilador integrado en la bomba para refrigerar los VRM de la placa base',
}
PANTALLA = {11: '3,4" IPS', 12: '4,5" IPS', 24: '5" IPS', 26: '1,54" LCD', 27: '2,72" IPS', 28: '2,72" IPS', 32: 'LCD en la bomba',
            34: '3,4" IPS', 35: '6,67" OLED curva', 36: '6,67" OLED curva', 39: 'LCD en la bomba', 40: '3,5" LCD'}
VALORES = [
    ('LED-Beleuchtung', 'iluminación LED'), ('Für ATX-Mainboards', 'Para placas ATX'), ('Sockel 1151 ready', 'preparado para socket 1151'),
    ('Geschlossenes System', 'Circuito cerrado (AIO)'), ('CPU-Kühler mit Lüfter', 'Disipador de CPU con ventilador'),
    ('Wasserkühlung', 'Refrigeración líquida'), ('Prozessorkühler', 'Refrigerador de CPU'), ('Single Tower', 'Torre simple'),
    ('Dual Tower', 'Doble torre'), ('Top-Blow', 'Flujo descendente'), ('verschraubt', 'atornillado'), ('geklemmt', 'con clip'),
    ('Wärmeleitpaste/pad', 'pasta térmica'), ('Wärmeleitpaste', 'pasta térmica'), ('Anzahl', 'Cantidad'), ('Stück', 'uds.'), ('Stk.', 'uds.'),
    ('Breite', 'Ancho'), ('Höhe', 'Alto'), ('Tiefe', 'Profundidad'), ('Länge', 'Largo'), ('Gramm', 'g'), ('Watt', 'W'), ('Volt', 'V'),
    ('U/min', 'rpm'), ('bis', 'a'), ('Von', 'De'), ('von', 'de'), ('Ja', 'Sí'), ('Nein', 'No'), ('schwarz', 'negro'), ('weiß', 'blanco'),
    ('Aluminium', 'aluminio'), ('Kupfer', 'cobre'), ('vernickelt', 'niquelado'), ('addressable RGB Header', 'conector ARGB (5 V)'),
    ('Lüfter', 'ventilador'), ('Pumpe', 'bomba'), ('und', 'y'), ('oder', 'o'), ('mit', 'con'), ('für', 'para'), ('inkl.', 'incl.'),
    ('Montage-Kit', 'kit de montaje'), ('Montagematerial', 'material de montaje'), ('Schrauben', 'tornillos'), ('Kabel', 'cable'),
    ('Anti-Vibrations Pads', 'almohadillas antivibración'), ('Lüfterklammern', 'clips de ventilador'), ('schwarzes', 'negro'),
    ('schwarze', 'negras'), ('einen', 'un'), ('zweiten', 'segundo'), ('Handbuch', 'manual'), ('Bedienungsanleitung', 'manual'),
    ('Adapter', 'adaptador'), ('Halterung', 'soporte'), ('Backplate', 'placa trasera'), ('China', 'China'), ('Taiwan', 'Taiwán'),
]


def txt_es(v):
    for a, b in VALORES:
        v = re.sub(rf'(?<![\wäöüß]){re.escape(a)}(?![\wäöüß])', b, v)
    return re.sub(r'\s+', ' ', v).strip(' ,')


def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def seguro(mpn):
    return re.sub(r'[^A-Za-z0-9\-]+', '-', mpn).strip('-')


def compat(sockets):
    s = ' '.join(sockets) if isinstance(sockets, list) else sockets
    return ', '.join(x for x, pat in (('AM5', r'AM5'), ('AM4', r'AM4'), ('LGA1851', r'1851'), ('LGA1700', r'1700')) if re.search(pat, s))


def resumen_de(f, s):
    tipo = f['tipo']
    alto = re.search(r'Höhe:\s*(\d+)\s*mm', s.get('Abmessungen · Gesamt', ''))
    fan = s.get('Abmessungen · Fan1', '')
    cant, lado = re.search(r'Anzahl:\s*(\d+)', fan), re.search(r'Breite:\s*(\d+)\s*mm', fan)
    rad = re.search(r'(\d)\s*x\s*(\d{3})', s.get('Radiatorengröße', '') + ' ' + f['modelo'])
    rad_mm = str(int(rad.group(1)) * int(rad.group(2))) if rad else (re.search(r'\b(240|280|360|420)\b', f['modelo']) or [''])[0]
    if lado and int(lado.group(1)) >= 240 and rad_mm:  # alternate da a veces el conjunto (p. ej. 360 mm) en vez de cada ventilador
        t = 140 if rad_mm in ('280', '420') else 120
        ventiladores = f'{int(rad_mm) // t} × {t} mm'
    elif lado:
        ventiladores = f"{cant.group(1) if cant else 1} × {lado.group(1)} mm"
        f2 = re.search(r'Breite:\s*(\d+)\s*mm', s.get('Abmessungen · Fan2', ''))
        if f2:
            ventiladores += f' + 1 × {f2.group(1)} mm'
    else:
        ventiladores = 'No incluye (radiador sin ventiladores)' if f['tipo'] == 'liquida' and re.search(r'\d{3}N\b', f['modelo']) else ''
    return [('Tipo', 'Refrigeración líquida (AIO)' if tipo == 'liquida' else 'Disipador por aire'),
            ('Formato', txt_es(s.get('CPU-Kühler Bauart', ''))),
            ('Radiador', f'{rad_mm} mm' if tipo == 'liquida' and rad_mm else ''),
            ('Altura', f'{alto.group(1)} mm' if tipo == 'aire' and alto else ''),
            ('TDP máx.', txt_es(s.get('CPU · bis max. TDP', ''))),
            ('Pantalla', PANTALLA.get(f['n'], '')),
            ('Ventiladores', ventiladores),
            ('Compatible con', compat(s.get('Geeignete Sockel', ''))),
            ('Ruido', txt_es(s.get('Lautstärke', ''))), ('Peso', txt_es(s.get('Gewicht · Gesamt') or s.get('Gewicht · CPU-Kühler', '')))]


def resumen_en(f, s):
    tipo = f['tipo']
    alto = re.search(r'H(\d+)\s*mm', s.get('Heatsink · Dimension', ''))
    fans = [k.split(' · ')[0] for k in s if k.endswith('· Dimension') and not k.startswith('Heatsink')]
    fan_dim = s.get(f'{fans[0]} · Dimension', '') if fans else ''
    lado = re.search(r'W(\d+)\s*mm', fan_dim)
    n_fans = 3 if re.search(r'L360', fan_dim) else (2 if 'Dual' in f['modelo'] or re.search(r'Peerless|Phantom', f['modelo']) else 1)
    return [('Tipo', 'Refrigeración líquida (AIO)' if tipo == 'liquida' else 'Disipador por aire'),
            ('Formato', '' if tipo == 'liquida' else ('Doble torre' if re.search(r'Peerless|Phantom', f['modelo']) else 'Torre simple')),
            ('Radiador', '360 mm' if tipo == 'liquida' else ''), ('Altura', f'{alto.group(1)} mm' if tipo == 'aire' and alto else ''),
            ('Pantalla', s.get('Screen Size', '').replace('-Inch', '"') + (f" ({s['Screen Resolution']})" if s.get('Screen Resolution') else '')
             if s.get('Screen Size') else ('Pantalla digital de temperatura' if 'Digital' in f['modelo'] else '')),
            ('Ventiladores', f'{n_fans} × {lado.group(1) if lado else 120} mm'),
            ('Compatible con', compat(f.get('sockets', []))),
            ('Ruido', next((v for k, v in s.items() if k.endswith('Noise Level')), '')),
            ('Garantía', s.get('Warranty', '').replace('Years', 'años'))]


def crudo_en(s):
    out = {}
    for k, v in s.items():
        if k in CLAVES_EN:
            out[CLAVES_EN[k]] = v.replace('Years', 'años').replace('-Inch', '"').replace('(Without Fan)', ' (sin ventilador)')
        elif ' · ' in k:
            sec, sub = k.split(' · ', 1)
            out[f'Ventilador {sec} · {CLAVES_EN_FAN.get(sub, sub)}'] = v.replace('Bearing', 'rodamiento')
    return out


fichas = [f for f in json.loads((SRC / 'fichas_refrigeracion.json').read_text(encoding='utf-8')) if f['n'] not in RETIRADAS]
productos = []
for f in fichas:
    n, marca, mpn, gama, s = f['n'], f['marca'], f['mpn'], f['gama'], f['specs']
    de = f['idioma_specs'] == 'de'
    precio = round(f['precio_eur_alternate']) if f['precio_eur_alternate'] else PRECIO_TR[n]
    crudo = {CLAVES_DE.get(k, k): txt_es(v) for k, v in s.items() if k not in FUERA} if de else crudo_en(s)
    if n in FEATURE:
        crudo['Características'] = FEATURE[n]
    res = {k: v for k, v in (resumen_de(f, s) if de else resumen_en(f, s)) if v}
    specs = {**res, **{k: v for k, v in crudo.items() if k not in res and v}}
    marca_txt = {'BE QUIET!': 'be quiet!', 'NZXT': 'NZXT', 'ASUS': 'ASUS', 'ARCTIC': 'Arctic', 'DEEPCOOL': 'DeepCool',
                 'LIAN LI': 'Lian Li'}.get(marca, marca.title())
    titulo = f"{'Refrigeración líquida' if f['tipo'] == 'liquida' else 'Disipador'} {marca_txt} {f['modelo']}"
    resumen = ', '.join(x for x in (f"{marca_txt} {f['modelo']}", specs['Tipo'],
                                     f"radiador {specs['Radiador']}" if specs.get('Radiador') else
                                     (f"altura {specs['Altura']}" if specs.get('Altura') else '')) if x)
    origen = sorted(p for p in (SRC / marca.replace('!', '') / mpn.replace('/', '_').replace(' ', '-')).iterdir() if p.suffix)
    buenas = [p for p in origen if int(p.stem) not in EXCLUIR.get(n, ()) and max(Image.open(p).size) >= MIN_PX]
    carpeta = CAT / 'imagenes' / 'refrigeracion' / gama / 'high'
    carpeta.mkdir(parents=True, exist_ok=True)
    high = []
    for k, p in enumerate(buenas, 1):
        nombre = f"{marca.replace(' ', '-').replace('!', '')}_{seguro(mpn)}_CDN_{k}{p.suffix.lower()}"
        if ESCRIBIR:
            shutil.copy2(p, carpeta / nombre)
        high.append(f'imagenes/refrigeracion/{gama}/high/{nombre}')
    faltante = [k for k, v in (('mpn', mpn), ('ean', f['ean']), ('specs', specs), ('imagen', high[:3])) if not v]
    if len(high) < 3:
        faltante.append('fotos<3')
    productos.append({
        'marca': marca, 'modelo': f['modelo'], 'mpn': mpn, 'ean': f['ean'], 'icecat_id': '',
        'categoria': CATEGORIA, 'titulo': titulo, 'resumen': resumen,
        'imagen_alta': '', 'imagen_alta_res': '', 'imagen_500': '', 'galeria': [],
        'n_specs': len(specs), 'specs': specs, 'slug': slug(f"{marca} {f['modelo']}"),
        'imagenes_local': {'medium': [], 'high': high}, 'imagen_principal': high[0] if high else '',
        'n_imagenes': len(high), 'fuente': 'cdn', 'completo': not faltante, 'faltante': faltante,
        'url_oficial': f['url'], 'gama': gama, 'precio_referencia': f'~${precio}', 'precio_verificado': False,
        'ean_confirmado': f['ean_confirmado'], 'tipo': f['tipo'],
    })
    print(f"#{n:2} {gama:8} {f['tipo']:7} {marca:13} {f['modelo'][:30]:30} {f['ean']} img={len(high)}/{len(origen)} "
          f"specs={len(specs):2} ~${precio:<4} {'OK' if not faltante else 'falta ' + ','.join(faltante)}")
    print('     ', ' · '.join(f'{k}: {v}' for k, v in list(res.items())))

if ESCRIBIR:
    rotas = [p for c in productos for p in c['imagenes_local']['high'] if not (CAT / p).exists()]
    p = CAT / 'catalogo-final.json'
    datos = [r for r in json.loads(p.read_text(encoding='utf-8')) if r['categoria'] != CATEGORIA] + productos
    p.write_text(json.dumps(datos, indent=1, ensure_ascii=False), encoding='utf-8')
    print(f'\nEscrito: {len(datos)} productos en {p.name} · rutas de refrigeración rotas: {len(rotas)}')
