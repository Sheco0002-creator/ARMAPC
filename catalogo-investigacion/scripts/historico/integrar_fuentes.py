"""Integra las fuentes de poder en catalogo-final.json como categoría "Fuentes de poder".

Lee de FUENTES-PODER_fabricante_2026-09-11/ en el USB JORGE: fichas_lote1.json + fichas_lote2.json y
RETIRADAS.json (números que no entran: fotos insuficientes o de baja calidad, decisión del usuario).
Specs: resumen en español + ficha de alternate.de traducida del alemán; si no hay (XPG), la de Icecat.
Fotos: sólo las de lado mayor >= 900 px (mínimo 1 por producto), a
catalogo/imagenes/fuentes-poder/<gama>/high/<MARCA>_<MPN>_CDN_<k>.<ext>.

Uso: python integrar_fuentes.py <carpeta catalogo> <carpeta FUENTES-PODER_fabricante en JORGE> [--escribir]
"""
import json, re, shutil, sys
from pathlib import Path
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')
CAT, SRC = Path(sys.argv[1]), Path(sys.argv[2])
ESCRIBIR = '--escribir' in sys.argv
CATEGORIA = 'Fuentes de poder'
MIN_PX = 900
# Precio de referencia SIN verificar: precio de alternate.de en € tomado ~igual en $ (orientativo);
# XPG no está en alternate: estimación. Gama: entrada < $80 · media $80-130 · alta $130-200 · extrema > $200.
PRECIO_XPG = {33: 85, 34: 115, 35: 150, 36: 190}

CLAVES = {  # alternate.de (alemán) -> español
    'Farbe': 'Color', 'Serie': 'Serie', 'Leistung · Gesamt': 'Potencia total', 'Leistung · +12V Gesamt': 'Potencia +12V',
    'Leistung · +3,3V/+5V Gesamt': 'Potencia +3,3V/+5V', 'Leistung · Effizienz': 'Eficiencia',
    'Leistung · Eingangsspannungsbereich': 'Tensión de entrada', 'Leistung · Eingangsstromstärke': 'Corriente de entrada',
    'Standard': 'Estándar', 'PCIe': 'PCIe', 'Bauform': 'Formato', 'Zertifizierung': 'Certificación',
    'Stromstärken · +3,3 V': 'Corriente +3,3 V', 'Stromstärken · +5 V': 'Corriente +5 V', 'Stromstärken · +5 Vsb': 'Corriente +5 Vsb',
    'Stromstärken · +12 V Gesamt': 'Corriente +12 V total', 'Stromstärken · +12 V1': 'Corriente +12 V1',
    'Stromstärken · +12 V2': 'Corriente +12 V2', 'Stromstärken · +12 V3': 'Corriente +12 V3', 'Stromstärken · +12 V4': 'Corriente +12 V4',
    'Stromstärken · -12 V': 'Corriente -12 V', 'Leistungsfaktor-Korrektur': 'Corrección del factor de potencia',
    'Schalter': 'Interruptor', 'Anschlüsse': 'Conectores', 'Kabel · Kabel-Management': 'Cableado modular',
    'Kabel · Längen': 'Longitud de cables', 'Kühlung · Anzahl Lüfter': 'Ventilador', 'Kühlung · Regelung': 'Control del ventilador',
    'Kühlung · Art': 'Refrigeración', 'Lautstärke': 'Ruido', 'Schutzfunktionen': 'Protecciones', 'Zubehör · vorhanden': 'Accesorios',
    'Abmessungen': 'Dimensiones', 'Gewicht': 'Peso', 'RGB-Standard': 'Estándar RGB', 'RGB-Anschlüsse': 'Conectores RGB',
    'Beleuchtung': 'Iluminación', 'Hergestellt in': 'Fabricado en', 'Feature': 'Características', 'Weitere Informationen': 'Otros',
}
# el código europeo de alternate no vale donde usamos el de EE. UU.; los dos últimos son frases de marketing en alemán
FUERA = {'Typ', 'EAN', 'Hersteller-Nr.', 'Weitere Informationen', 'Feature'}
VALORES = [  # (alemán, español) sobre los valores
    ('Ja', 'Sí'), ('Nein', 'No'), ('schwarz', 'negro'), ('weiß', 'blanco'), ('Volt', 'V'), (' bei ', ' a '),
    ('Bis zu', 'Hasta'), ('Aktiv-PFC', 'PFC activo'), ('Netzschalter', 'interruptor de encendido'),
    ('Lüfter', 'ventilador'), ('Breite', 'Ancho'), ('Höhe', 'Alto'), ('Tiefe/Länge', 'Profundidad'),
    ('Überspannungsschutz', 'Sobretensión'), ('Unterspannungsschutz', 'Subtensión'), ('Überlastschutz', 'Sobrecarga'),
    ('Kurzschlussschutz', 'Cortocircuito'), ('Überhitzungsschutz', 'Sobretemperatura'), ('Schutz vor Stromspitzen', 'Sobrecorriente'),
    ('Überstromschutz', 'Sobrecorriente'), ('Schutz vor Einschaltstrom', 'Corriente de arranque'),
    ('Semi-passive Kühlung', 'semipasiva'), ('Aktive Kühlung', 'activa'), ('Passive Kühlung', 'pasiva'),
    ('temperaturgesteuert', 'según temperatura'), ('Grafik', 'gráfica'), ('Floppy-Adapter', 'adaptador floppy'),
    ('Kabelbinder', 'bridas'), ('Schrauben', 'tornillos'), ('Netzkabel', 'cable de corriente'), ('Klettverschluss', 'velcro'),
    ('Klettbänder', 'cintas de velcro'), ('Handbuch', 'manual'), ('Kabeltasche', 'bolsa de cables'), ('und', 'y'),
    ('Last', 'carga'), ('Schutz vor Stromstößen', 'Picos de corriente'), ('Befestigungsschrauben', 'tornillos de montaje'),
    ('Benutzerhandbuch', 'manual de usuario'), ('Temperaturgeregelt', 'según temperatura'),
    ('Laufwerksanschlüsse', 'conectores de unidades'), ('Grafikanschlüsse', 'conectores gráficos'),
    ('Zusatzanschlüsse', 'conectores adicionales'), ('Hauptanschluss', 'conector principal'), ('Anschlüsse', 'conectores'),
    ('Anschluss', 'conector'), ('Mainboard', 'placa base'), ('Zoll', 'pulgadas'), ('Kabelsatz', 'juego de cables'),
    ('Stromkabel', 'cable de corriente'), ('Montageschrauben', 'tornillos de montaje'), ('Kabel', 'cable'),
    ('Netzteil', 'fuente'), ('Wattzahl', 'potencia'), ('Kompatibel', 'Compatible'), ('Leistung', 'potencia'),
    ('oder', 'o'), ('flüssigkeitsgelagerter', 'de rodamiento fluido'), ('Lager', 'rodamiento'), ('Grafikkarten', 'tarjetas gráficas'),
]


def txt_es(v):
    for de, es in VALORES:
        v = re.sub(rf'(?<![\wäöüß]){re.escape(de)}(?![\wäöüß])', es, v) if de.isalpha() else v.replace(de, es)
    return v


def gama_de(p):
    return 'entrada' if p < 80 else 'media' if p <= 130 else 'alta' if p <= 200 else 'extrema'


def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def seguro(mpn):
    return re.sub(r'[^A-Za-z0-9\-]+', '-', mpn).strip('-')


def resumen_es(f, alt, ice):
    anschl = alt.get('Anschlüsse', '') + ' ' + ice.get('Ports & interfaces · ATX power connector (12+4 pin)', '')
    modular = ice.get('Ports & interfaces · Cabling type') or {'Ja': 'Sí', 'Nein': 'No'}.get(alt.get('Kabel · Kabel-Management', ''), '')
    estandar = alt.get('Standard') or ' '.join(x for x in (ice.get('Performance · ATX version', ''), ice.get('Performance · EPS version', '')) if x)
    dims = alt.get('Abmessungen') or ' x '.join(ice.get(f'Weight & dimensions · {k}', '') for k in ('Width', 'Depth', 'Height')).strip(' x')
    return {k: v for k, v in [
        ('Potencia', f"{f['potencia_w']} W"),
        ('Certificación', alt.get('Zertifizierung') or ice.get('Performance · 80 PLUS certification', '')),
        ('Estándar', estandar + (f" · PCIe {alt['PCIe']}" if alt.get('PCIe') else '')),
        ('Formato', alt.get('Bauform') or ice.get('Performance · Power supply unit (PSU) form factor', '')),
        ('Cableado modular', modular),
        ('Conector 12V-2x6 / 12VHPWR', 'Sí' if re.search(r'12V-2x6|12VHPWR|12\+4|16-?Pin', anschl) else ''),
        ('Ventilador', txt_es(alt.get('Kühlung · Anzahl Lüfter', '')) or ice.get('Design · Fan diameter', '')),
        ('Dimensiones', txt_es(dims)), ('Peso', alt.get('Gewicht') or ice.get('Weight & dimensions · Weight', '')),
    ] if v and v.strip()}


retiradas = {int(k) for k in json.loads((SRC / 'RETIRADAS.json').read_text(encoding='utf-8'))}
fichas = [f for lote in ('fichas_lote1.json', 'fichas_lote2.json')
          for f in json.loads((SRC / lote).read_text(encoding='utf-8')) if f['n'] not in retiradas]
productos = []
for f in sorted(fichas, key=lambda f: f['n']):
    n, marca, mpn = f['n'], f['marca'], f['mpn']
    alt, ice = f.get('specs_alternate', {}), f.get('specs_icecat', {})
    precio = PRECIO_XPG.get(n) or round(f['precio_eur_alternate'])
    gama = gama_de(precio)
    crudo = {CLAVES.get(k, k): txt_es(v) for k, v in alt.items() if k not in FUERA} if alt else ice
    specs = {**resumen_es(f, alt, ice), **crudo}
    marca_txt = {'BE QUIET!': 'be quiet!'}.get(marca, marca.title() if marca not in ('MSI', 'ASUS', 'FSP', 'XPG') else marca)
    titulo = f"Fuente de poder {marca_txt} {f['modelo']}"
    resumen = ', '.join(x for x in (f"{marca_txt} {f['modelo']}", specs.get('Certificación', ''), specs.get('Formato', ''),
                                     'modular' if specs.get('Cableado modular', '').lower() not in ('', 'no') else '') if x)
    origen = sorted(p for p in (SRC / marca.replace('!', '') / mpn.replace('/', '_').replace(' ', '-')).iterdir() if p.suffix)
    buenas = [p for p in origen if max(Image.open(p).size) >= MIN_PX] or origen[:1]
    carpeta = CAT / 'imagenes' / 'fuentes-poder' / gama / 'high'
    carpeta.mkdir(parents=True, exist_ok=True)
    high = []
    for k, p in enumerate(buenas, 1):
        nombre = f"{marca.replace(' ', '-').replace('!', '')}_{seguro(mpn)}_CDN_{k}{p.suffix.lower()}"
        if ESCRIBIR:
            shutil.copy2(p, carpeta / nombre)
        high.append(f'imagenes/fuentes-poder/{gama}/high/{nombre}')
    faltante = [k for k, v in (('mpn', mpn), ('ean', f['ean']), ('specs', specs), ('imagen', high)) if not v]
    productos.append({
        'marca': marca, 'modelo': f['modelo'], 'mpn': mpn, 'ean': f['ean'], 'icecat_id': str(f.get('icecat_id') or ''),
        'categoria': CATEGORIA, 'titulo': titulo, 'resumen': resumen,
        'imagen_alta': '', 'imagen_alta_res': '', 'imagen_500': '', 'galeria': [],
        'n_specs': len(specs), 'specs': specs, 'slug': slug(f"{marca} {f['modelo']}"),
        'imagenes_local': {'medium': [], 'high': high}, 'imagen_principal': high[0] if high else '',
        'n_imagenes': len(high), 'fuente': 'cdn', 'completo': not faltante, 'faltante': faltante,
        'url_oficial': f['url'], 'gama': gama, 'precio_referencia': f'~${precio}', 'precio_verificado': False,
        'ean_confirmado': f['ean_confirmado'], 'version_codigo': f['version'],
    })
    print(f"#{n:2} {gama:8} {marca:13} {f['modelo'][:30]:30} {mpn:22} {f['ean']} {f['version']:6} "
          f"img={len(high)}/{len(origen)} specs={len(specs):2} ~${precio:<4} {'OK' if not faltante else 'falta ' + ','.join(faltante)}")

if ESCRIBIR:
    rotas = [p for c in productos for p in c['imagenes_local']['high'] if not (CAT / p).exists()]
    p = CAT / 'catalogo-final.json'
    datos = [r for r in json.loads(p.read_text(encoding='utf-8')) if r['categoria'] != CATEGORIA] + productos
    p.write_text(json.dumps(datos, indent=1, ensure_ascii=False), encoding='utf-8')
    print(f'\nEscrito: {len(datos)} productos en {p.name} · rutas de fuentes rotas: {len(rotas)}')
