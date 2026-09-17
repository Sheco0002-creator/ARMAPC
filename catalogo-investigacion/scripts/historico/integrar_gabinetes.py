"""Integra los gabinetes en catalogo-final.json como categoría "Gabinetes".

Lee GABINETES_fabricante_2026-09-11/fichas_gabinetes.json del USB JORGE (24 = 6 marcas × entrada/media/alta/extrema)
+ fichas_tematicos.json (4 diseños extravagantes: HYTE, Montech, ROG; campo 'tematico';
la gama la da la selección por diseño, no el precio: las "extrema" son las torres grandes/peceras de cada marca).
Specs: resumen en español centrado en IA + GPU grande (espacio GPU, radiadores, ventiladores, flujo de aire) +
ficha completa traducida (alternate.de en alemán; Phanteks en inglés, de phanteks.com).
Fotos: lado mayor >= 900 px y sin diagramas de medidas / vistas despiezadas (EXCLUIR), a
catalogo/imagenes/gabinetes/<gama>/high/<MARCA>_<MPN>_CDN_<k>.<ext>.

Uso: python integrar_gabinetes.py <carpeta catalogo> <carpeta GABINETES_fabricante en JORGE> [--escribir]
"""
import json, re, shutil, sys
from pathlib import Path
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')
CAT, SRC = Path(sys.argv[1]), Path(sys.argv[2])
ESCRIBIR = '--escribir' in sys.argv
CATEGORIA = 'Gabinetes'
MIN_PX = 900
# fotos que no son del producto en sí (diagramas con medidas, despieces, bolsa de tornillos) — revisadas en hoja de contactos
EXCLUIR = {17: {6, 7, 8}, 18: {7, 8}, 19: {2, 4, 7}, 20: {3, 6}}
# Precio de referencia SIN verificar: alternate.de en € tomado ~igual en $; Phanteks (no está en alternate): estimación
PRECIO_PH = {9: 90, 10: 120, 11: 200, 12: 300}
# 'Hinweis' de alternate.de: frases libres, traducidas a mano
NOTAS = {
    2: 'La segunda jaula de discos solo se puede instalar con la fuente montada girada; con las dos jaulas en la disposición estándar choca con la fuente.',
    6: 'Versión de vidrio templado: panel lateral de vidrio templado, hasta 6 × 120 mm o 4 × 140 mm ventiladores (2 ya incluidos).',
    8: 'Ventiladores e iluminación LED controlables por completo desde placas base con RGB de 5 V.',
    14: 'Diseñado desde cero para una integración sencilla con iCUE LINK.',
    15: 'Compatible con ASUS BTF, MSI Project Zero y Gigabyte Project Stealth.',
    16: 'Ranuras: 8 horizontales (o 4 verticales) + 2 verticales (para placa ITX).',
    18: 'Bahías máx.: 3 × 3,5" y 7 × 2,5".',
    19: 'Bahías: 3,5" máx. 2 (1 incluida), 2,5" máx. 6 (4 incluidas).',
    24: 'Dos ventiladores RGB Core F420 de marco único, un ventilador RGB Core F120 trasero y un Control Hub (requiere NZXT CAM).',
}

CLAVES_DE = {
    'Farbe': 'Color', 'Serie': 'Serie', 'Bauform': 'Formato', 'Mainboard Formfaktor': 'Placa base',
    'Material': 'Material', 'Window Kit': 'Ventana lateral', 'Mesh-Front': 'Frontal de malla',
    'Interne Maße · Steckkartenlänge': 'Longitud máx. de GPU', 'Interne Maße · CPU-Kühlerhöhe': 'Altura máx. de disipador CPU',
    'Interne Maße · Netzteil-Formfaktor': 'Formato de fuente', 'Interne Maße · Netzteillänge': 'Longitud máx. de fuente',
    'Laufwerksschächte': 'Bahías combinadas', 'Laufwerksschächte · 2,5 Zoll': 'Bahías 2,5"', 'Laufwerksschächte · 3,5 Zoll': 'Bahías 3,5"',
    'Laufwerksschächte · 5,25 Zoll': 'Bahías 5,25"', 'Slots · Full-Size': 'Ranuras de expansión',
    'Slots · Slots Werkzeugfrei': 'Ranuras sin herramientas', 'Slots · zusätzliche Full-Size': 'Ranuras adicionales (vertical)',
    'Frontanschlüsse': 'Puertos frontales', 'Vorderseite': 'Ventiladores frontales', 'Rückseite': 'Ventilador trasero',
    'Anmerkungen': 'Notas', 'Beleuchtung': 'Iluminación', 'RGB-Anschlüsse': 'Conectores RGB', 'RGB-Standard': 'Estándar RGB',
    'Wasserkühlung möglich': 'Refrigeración líquida', 'Wasserkühlung möglich · Unterstützte Radiatoren': 'Radiadores compatibles',
    'Rückseitiger Anschluss des Mainboards': 'Placas con conectores traseros (BTF/Project Zero)', 'Gehäuse gedämmt': 'Aislamiento acústico',
    'Zubehör · vorhanden': 'Accesorios incluidos', 'Zubehör · optional': 'Accesorios opcionales', 'Volumen': 'Volumen',
    'Abmessungen': 'Dimensiones', 'Gewicht': 'Peso', 'Hergestellt in': 'Fabricado en', 'Hinweis': 'Nota',
}
CLAVES_EN = {
    'Case Dimensions': 'Dimensiones', 'Form Factor': 'Formato', 'From Factor': 'Formato', 'Mainboard Support': 'Placa base',
    'Rear ATX Mainboard Support': 'Placas con conectores traseros (BTF/Project Zero)', 'Materials': 'Material', 'Color': 'Color',
    'Side Window': 'Ventana lateral', 'PCI Slots': 'Ranuras de expansión', 'Expansion Slots': 'Ranuras de expansión',
    'Vertical GPU Support': 'GPU vertical', 'Internal 2.5″ Bay': 'Bahías 2,5"', 'Internal 2.5″ Positions': 'Bahías 2,5"',
    'Internal 3.5″ Bay': 'Bahías 3,5"', 'Internal 3.5″ Positions': 'Bahías 3,5"', 'Front I/O': 'Puertos frontales',
    'Total Fans': 'Posiciones de ventilador (120 | 140 mm)', 'Top': 'Ventiladores superiores (120 | 140 mm)',
    'Front': 'Ventiladores frontales (120 | 140 mm)', 'Side': 'Ventiladores laterales (120 | 140 mm)',
    'Rear': 'Ventiladores traseros (120 | 140 mm)', 'Bottom': 'Ventiladores inferiores (120 | 140 mm)',
    'Midplate': 'Ventiladores placa central (120 | 140 mm)', 'CPU Cooler': 'Altura máx. de disipador CPU',
    'GPU': 'Longitud máx. de GPU', 'Power Supply': 'Longitud máx. de fuente', 'Top Radiator': 'Radiador superior',
    'Top 360 Radiator': 'Radiador superior (360)', 'Front Radiator': 'Radiador frontal', 'Side Radiator': 'Radiador lateral',
    'Side 480 Radiator': 'Radiador lateral (480)', 'Rear Radiator': 'Radiador trasero', 'Rear 240 Radiator': 'Radiador trasero (240)',
    'Midplate Radiator': 'Radiador placa central', 'Net Weight': 'Peso', 'Gross Weight': 'Peso con caja', 'Warranty': 'Garantía',
    'Scope of Delivery': 'Contenido', 'Accessory Box': 'Accesorios incluidos', 'Accessory': 'Accesorios incluidos',
}
FUERA = {'Typ', 'EAN', 'Hersteller-Nr.', 'Weitere Informationen', 'Feature', 'Model No.', 'UPC Code', 'Screws',
         'What is Digital-RGB?', 'Phanteks D-RGB products'}
VALORES = [  # (original, español) sobre los valores; frases largas primero
    ('Die Bezeichnung USB 3.2 Gen 2 entspricht der früheren Bezeichnung USB 3.1 Gen 2 / USB 3.1.', ''),
    ('Die Bezeichnung USB 3.2 Gen 1 entspricht der früheren Bezeichnung USB 3.1 Gen 1 / USB 3.0.', ''),
    ('Die Bezeichnung USB 3.2 Gen 2x2 entspricht der früheren Bezeichnung USB 3.2 Gen 2x2.', ''),
    ('Präzises Design: Premium-Mesh-Einsatz im Lieferumfang enthalten', 'panel de malla premium incluido'),
    ('mm dick', 'mm de grosor'), ('an der', 'en la parte'), ('am', 'en'), ('herausnehmbare', 'extraíbles'),
    ('Side Bracket', 'soporte lateral'), ('Klettbänder', 'cintas de velcro'), ('unten', 'inferior'),
    ('Max. Einbauschächte', 'Bahías máx.'), ('Einbauschächte', 'Bahías'), ('Low-Profile-RAM', 'RAM de perfil bajo'), ('mur', 'solo'), ('//', '/'),
    ('Midi-Tower', 'Media torre'), ('Big-Tower', 'Torre grande'), ('Mid-Tower', 'Media torre'), ('Full Tower', 'Torre completa'),
    ('Vorderseite rechts', 'Frontal derecha'), ('Vorderseite', 'Frontal'), ('Oberseite', 'Superior'), ('Unterseite', 'Inferior'),
    ('Deckel', 'Superior'), ('Front', 'Frontal'), ('Top', 'Superior'), ('Side', 'Lateral'), ('PSU', 'Fuente'), ('Rechts', 'Derecha'),
    ('rechts', 'derecha'), ('rechte Seite', 'lateral derecho'), ('Rechte Seite', 'Lateral derecho'), ('linke Seite', 'lateral izquierdo'),
    ('linkes Seitenteil', 'panel izquierdo'), ('rechtes Seitenteil', 'panel derecho'), ('Seitenteil', 'panel lateral'), ('seitlich', 'lateral'),
    ('Frontpanel', 'panel frontal'), ('Top-Filter', 'filtro superior'), ('PSU-Filter', 'filtro de fuente'),
    ('Bis zu', 'hasta'), ('bis zu', 'hasta'), ('Bis', 'hasta'), ('bis', 'hasta'), ('nur', 'solo'),
    ('vorinstalliert', 'preinstalado(s)'), ('enthalten', 'incluido(s)'), ('Lieferumfang', 'contenido'), ('sind im', 'en el'),
    ('ein weiterer', 'otro'), ('ein weitere', 'otro'), ('zwei weitere', 'otros dos'), ('am Gehäuseboden', 'en la base'),
    ('Gehäuseboden', 'base'), ('Gehäuse', 'chasis'), ('breit', 'de ancho'), ('lang', 'de largo'), ('hohem', 'de alto'),
    ('RAM-Höhe', 'altura de RAM'), ('an unterer Position', 'en posición inferior'), ('Side Bracket', 'soporte lateral'),
    ('Halterungen', 'soportes'), ('Halterung', 'soporte'), ('Zusätzliche', 'adicional'), ('zusätzliche', 'adicionales'),
    ('zusätzlicher', 'adicional'), ('Abstandshalter', 'separadores'), ('Schrauben-Set', 'juego de tornillos'), ('Zubehör-Set', 'juego de accesorios'),
    ('Zubehör-Kit', 'kit de accesorios'), ('Zubehör Box', 'caja de accesorios'), ('Zubehör', 'accesorios'), ('Accessory Box', 'caja de accesorios'),
    ('Bedienungsanleitung', 'manual'), ('Montagezubehör', 'accesorios de montaje'), ('Support-Zettel', 'hoja de soporte'),
    ('Kabelausrichter', 'organizadores de cables'), ('Einfaches', 'sencilla'),
    ('Hochleistungsnetz', 'malla de alto rendimiento'), ('Nylon-Feinstaubfilterschale', 'bandeja de filtro de nylon'),
    ('magnetisch', 'magnético'), ('Anpassbares', 'ajustable'), ('über der', 'sobre la'), ('unter der', 'bajo la'),
    ('Einbau', 'montaje'), ('invertiertes Layout', 'disposición invertida'), ('VGA-Halterung', 'soporte de GPU'),
    ('VGA -Halterung', 'soporte de GPU'), ('Gehäuseversion', 'versión de chasis'), ('Daisy-Chain-Anschlüssen', 'conexión en cadena'),
    ('Vier', 'Cuatro'), ('Industriestahl', 'acero industrial'), ('Walnussholz', 'madera de nogal'), ('holz', 'madera'),
    ('Getöntes', 'tintado'), ('gehärtetes', 'templado'), ('ABS-Kunststoff', 'plástico ABS'), ('SGCC-Stahl', 'acero SGCC'),
    ('SGCC Steel', 'acero SGCC'), ('matt', 'mate'), ('ein', 'un'), ('Vertical PCI Bracket', 'soporte PCI vertical'),
    ('Lüfter-Steuerung', 'control de ventiladores'), ('Lüftersteuerung', 'control de ventiladores'), ('Staubfilter vorhanden', 'filtros de polvo'),
    ('-Lüfter vorhanden', ' ventilador(es) incluido(s)'), ('-Lüfter einbaubar', ' ventilador(es) opcional(es)'),
    ('Lüfter vorhanden', 'ventilador(es) incluido(s)'), ('Lüfter einbaubar', 'ventilador(es) opcional(es)'),
    ('-Lüfter', ' ventilador'), ('Lüfter', 'ventilador'), ('vorhanden', 'incluido'), ('einbaubar', 'opcional'),
    ('alternativ', 'o'), ('oder', 'o'), ('und', 'y'), ('Ja', 'Sí'), ('Nein', 'No'), ('schwarz', 'negro'), ('weiß', 'blanco'),
    ('maximal', 'máx.'), ('Stück', 'uds.'), ('Breite', 'Ancho'), ('Höhe', 'Alto'), ('Tiefe/Länge', 'Profundidad'),
    ('Vorne', 'Frontal'), ('Oben', 'Superior'), ('Seite', 'Lateral'), ('Rückseite', 'Trasera'), ('Hinten', 'Trasera'),
    ('Boden', 'Inferior'), ('Unten', 'Inferior'), ('Netzteilabdeckung', 'Cubierta de la fuente'), ('Staubfilter', 'Filtros de polvo'),
    ('Kabelmanagement', 'Gestión de cables'), ('Stahl', 'acero'), ('Aluminium', 'aluminio'), ('Kunststoff', 'plástico'),
    ('Glas', 'vidrio'), ('Tempered Glass', 'vidrio templado'), ('Gehärtetes vidrio', 'vidrio templado'),
    ('Zubehör-Box', 'caja de accesorios'), ('Kabelbinder', 'bridas'), ('Schrauben', 'tornillos'), ('Handbuch', 'manual'),
    ('Grafikkartenhalterung', 'soporte de GPU'), ('Grafikkarte', 'tarjeta gráfica'), ('Grafikkarten', 'tarjetas gráficas'),
    ('Mainboard', 'placa base'), ('Netzteil', 'fuente'), ('Kopfhörer', 'auriculares'), ('Mikrofon', 'micrófono'),
    ('Ein-/Ausschalter', 'botón de encendido'), ('Reset-Taster', 'botón reset'), ('Beleuchtungssteuerung', 'control de iluminación'),
    ('Taiwan', 'Taiwán'), ('China', 'China'), ('mit', 'con'), ('ohne', 'sin'), ('für', 'para'), ('bei', 'con'), ('inkl.', 'incl.'),
    ('Years limited', 'años limitada'), ('Years Limited', 'años limitada'), ('Learn more', ''), ('Height', ''), ('Length x Width x Height', ''),
    ('Length x Width', ''), ('Length', ''), ('Riser Cable sold separately', 'cable riser se vende aparte'),
    ('Riser cable & bracket sold separately', 'cable riser y soporte se venden aparte'), ('Yes', 'Sí'), ('No', 'No'),
    ('Steel chassis', 'chasis de acero'), ('Tempered glass window', 'ventana de vidrio templado'), ('Tempered glass', 'vidrio templado'),
    ('Aluminum panels', 'paneles de aluminio'), ('ABS plastic', 'plástico ABS'), ('Black', 'negro'),
    ('Up to', 'hasta'), ('wide', 'de ancho'), ('without GPU Support Bracket', 'sin soporte de GPU'), ('with LED Cover', 'con cubierta LED'),
    ('chassis', 'chasis'), ('fans', 'ventiladores'), ('Zip ties', 'bridas'), ('GPU support bracket', 'soporte de GPU'),
    ('Airflow covers', 'cubiertas de flujo de aire'), ('Microfiber cloth', 'paño de microfibra'), ('Storage bracket', 'soporte de almacenamiento'),
    ('Pre-installed', 'preinstalado'), ('mainboard adapter', 'adaptador para placa base'), ('HDD', 'HDD'), ('SSD', 'SSD'),
    ('Microphone', 'micrófono'), ('Headphone', 'auriculares'), ('combo', 'combinado'), ('Combo', 'combinado'),
    ('Power Button', 'botón de encendido'), ('Power button', 'botón de encendido'), ('Reset Button', 'botón reset'),
    ('Reset button', 'botón reset'), ('Mode Button', 'botón modo'), ('Color Button', 'botón color'), ('Speed Button', 'botón velocidad'),
    ('Channel Button', 'botón canal'), ('mode', 'modo'), ('color', 'color'),
]


def txt_es(v):
    for a, b in VALORES:
        v = re.sub(rf'(?<![\wäöüß]){re.escape(a)}(?![\wäöüß])', b, v) if re.fullmatch(r"[\wäöüß' .&/\-]+", a) else v.replace(a, b)
    return re.sub(r'\s+', ' ', re.sub(r'^\s*/\s*|\s*/\s*$', '', v)).strip(' ,/')


def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def seguro(mpn):
    return re.sub(r'[^A-Za-z0-9\-]+', '-', mpn).strip('-')


def mm(v):
    m = re.search(r'(\d{3})\s*mm', v or '')
    return f'{m.group(1)} mm' if m else ''


def resumen_de(s):
    """alternate.de: los ventiladores incluidos van en Vorderseite/Rückseite/Anmerkungen como 'N x 120 mm ...-Lüfter vorhanden'."""
    todo = ', '.join(s.get(k, '') for k in ('Vorderseite', 'Rückseite', 'Anmerkungen'))
    por_mm = {}
    for c in re.split(r',|\.\s|alternativ', todo):
        if re.search(r'Lüfter[^,]*?(vorinstalliert|enthalten|vorhanden)', c) and 'Staubfilter' not in c:
            m = re.search(r'(\d+)\s*x', c)
            cant = int(m.group(1)) if m else 1
            m = re.search(r'(\d{3})\s*-?\s*mm|F(\d{3})|AL-(\d{2})\b', c)
            tam = (int(m.group(3)) * 10 if m.group(3) else int(m.group(1) or m.group(2))) if m else 0
            por_mm[tam] = por_mm.get(tam, 0) + cant
    ventiladores = ' + '.join(f'{c} × {t} mm' if t else f'{c}' for t, c in sorted(por_mm.items(), reverse=True)) or 'No incluye'
    rads = s.get('Wasserkühlung möglich · Unterstützte Radiatoren', '')
    return [('Formato', txt_es(s.get('Bauform', ''))), ('Placa base', s.get('Mainboard Formfaktor', '')),
            ('GPU máx.', mm(s.get('Interne Maße · Steckkartenlänge'))),
            ('Disipador CPU máx.', mm(s.get('Interne Maße · CPU-Kühlerhöhe'))),
            ('Radiadores', txt_es(rads).rstrip('.')), ('Ventiladores incluidos', ventiladores),
            ('Frontal de malla', txt_es(s.get('Mesh-Front', ''))),
            ('Dimensiones', txt_es(s.get('Abmessungen', ''))), ('Peso', s.get('Gewicht', ''))]


def resumen_en(s):
    rads = []
    for k, zona in (('Top', 'Superior'), ('Front', 'Frontal'), ('Side', 'Lateral'), ('Rear', 'Trasera'), ('Midplate', 'Placa central')):
        for kk, v in s.items():
            m = re.match(rf'{k}(?: (\d{{3}}))? Radiator$', kk)
            if m and re.search(r'\d', v):
                largo = max(map(int, re.findall(r'(\d{3})\s*x\s*(\d{3})', v)[0])) if re.search(r'\d{3}\s*x\s*\d{3}', v) else 0
                nominal = m.group(1) or next((str(n) for n in (480, 420, 360, 280, 240, 140, 120) if largo >= n + 30), '')
                rads.append(f'{zona}: hasta {nominal} mm' if nominal else zona)
    incl = re.findall(r'(\d+)x ([A-Z]+\d*)-(\d{3}) ((?:D-RGB |PWM )?)fans', s.get('Scope of Delivery', ''))
    pos = s.get('Total Fans', '').split(' / ')[-1]
    return [('Formato', txt_es(s.get('Form Factor') or s.get('From Factor', ''))),
            ('Placa base', s.get('Mainboard Support', '').split(' / ')[0].replace('*', '').replace(' | ', ', ')),
            ('GPU máx.', mm(s.get('GPU'))), ('Disipador CPU máx.', mm(s.get('CPU Cooler'))),
            ('Radiadores', ', '.join(rads)), ('Ventiladores incluidos', ' + '.join(f'{a} × {c} mm ({b} {d.strip()})'.replace(' )', ')') for a, b, c, d in incl) or 'No incluye'),
            ('Posiciones de ventilador', ' / '.join(f"{x.strip().rstrip('x')} × {y} mm" for x, y in zip(pos.split('|'), (120, 140)) if re.search(r'\d', x))),
            ('Dimensiones', s.get('Case Dimensions', '').split(' | ')[0]), ('Peso', s.get('Net Weight', '').split(' | ')[0])]


fichas = json.loads((SRC / 'fichas_gabinetes.json').read_text(encoding='utf-8'))
# + 4 temáticos / diseños extravagantes pedidos aparte (HYTE, Montech, ROG), todos 'extrema'
fichas += [{**f, 'tematico': True} for f in json.loads((SRC / 'fichas_tematicos.json').read_text(encoding='utf-8'))]
productos = []
for f in fichas:
    n, marca, mpn, gama, s = f['n'], f['marca'], f['mpn'], f['gama'], f['specs']
    de = f['idioma_specs'] == 'de'
    precio = round(f['precio_eur_alternate']) if f['precio_eur_alternate'] else PRECIO_PH[n]
    claves = CLAVES_DE if de else CLAVES_EN
    crudo = {claves.get(k, k): txt_es(v) for k, v in s.items() if k not in FUERA}
    if n in NOTAS:
        crudo['Nota'] = NOTAS[n]
    crudo = {k: v for k, v in crudo.items() if v and v not in ('–', '– | –', '-')}
    res = {k: v for k, v in (resumen_de(s) if de else resumen_en(s)) if v}
    specs = {**res, **{k: v for k, v in crudo.items() if k not in res}}
    marca_txt = {'BE QUIET!': 'be quiet!', 'NZXT': 'NZXT', 'LIAN LI': 'Lian Li', 'HYTE': 'HYTE', 'ASUS': 'ASUS', 'MONTECH': 'Montech'}.get(marca, marca.title())
    titulo = f"Gabinete {marca_txt} {f['modelo']}"
    resumen = ', '.join(x for x in (f"{marca_txt} {f['modelo']}", specs.get('Formato', ''),
                                     f"GPU hasta {specs['GPU máx.']}" if specs.get('GPU máx.') else '') if x)
    origen = sorted(p for p in (SRC / marca.replace('!', '') / mpn.replace('/', '_').replace(' ', '-')).iterdir() if p.suffix)
    buenas = [p for p in origen if int(p.stem) not in EXCLUIR.get(n, ()) and max(Image.open(p).size) >= MIN_PX]
    carpeta = CAT / 'imagenes' / 'gabinetes' / gama / 'high'
    carpeta.mkdir(parents=True, exist_ok=True)
    high = []
    for k, p in enumerate(buenas, 1):
        nombre = f"{marca.replace(' ', '-').replace('!', '')}_{seguro(mpn)}_CDN_{k}{p.suffix.lower()}"
        if ESCRIBIR:
            shutil.copy2(p, carpeta / nombre)
        high.append(f'imagenes/gabinetes/{gama}/high/{nombre}')
    faltante = [k for k, v in (('mpn', mpn), ('ean', f['ean']), ('specs', specs), ('imagen', high[:3])) if not v]
    productos.append({
        'marca': marca, 'modelo': f['modelo'], 'mpn': mpn, 'ean': f['ean'], 'icecat_id': '',
        'categoria': CATEGORIA, 'titulo': titulo, 'resumen': resumen,
        'imagen_alta': '', 'imagen_alta_res': '', 'imagen_500': '', 'galeria': [],
        'n_specs': len(specs), 'specs': specs, 'slug': slug(f"{marca} {f['modelo']}"),
        'imagenes_local': {'medium': [], 'high': high}, 'imagen_principal': high[0] if high else '',
        'n_imagenes': len(high), 'fuente': 'cdn', 'completo': not faltante, 'faltante': faltante,
        'url_oficial': f['url'], 'gama': gama, 'precio_referencia': f'~${precio}', 'precio_verificado': False,
        'ean_confirmado': f['ean_confirmado'], 'tematico': f.get('tematico', False),
    })
    print(f"#{n:2} {gama:8} {marca:14} {f['modelo'][:28]:28} {mpn:20} {f['ean']} img={len(high)}/{len(origen)} "
          f"specs={len(specs):2} ~${precio:<4} {'OK' if not faltante else 'falta ' + ','.join(faltante)}")
    print('     ', ' · '.join(f'{k}: {v}' for k, v in list(specs.items())[:9]))

if ESCRIBIR:
    rotas = [p for c in productos for p in c['imagenes_local']['high'] if not (CAT / p).exists()]
    p = CAT / 'catalogo-final.json'
    datos = [r for r in json.loads(p.read_text(encoding='utf-8')) if r['categoria'] != CATEGORIA] + productos
    p.write_text(json.dumps(datos, indent=1, ensure_ascii=False), encoding='utf-8')
    print(f'\nEscrito: {len(datos)} productos en {p.name} · rutas de gabinetes rotas: {len(rotas)}')
