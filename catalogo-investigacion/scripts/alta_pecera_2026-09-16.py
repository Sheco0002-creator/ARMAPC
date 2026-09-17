r"""Estilo pecera (16-09-2026, decisión del usuario: "Impleméntalos"). Da de alta en catalogo-final.json:

  1. Campo `color` en TODOS los productos: "blanco", "negro" o "mixto" (None = la ficha no lo dice
     y el nombre tampoco). Sale de "Color"/"Color del producto" de la ficha, del nombre (White, ICE,
     Snow) y de COLOR_A_MANO (placas blancas por diseño cuya ficha no lo dice).
  2. `estilo_pecera` en los gabinetes de cristal panorámico (frontal + lateral, cámara doble), a mano:
     no hay un campo de ficha que lo diga.
  3. Piezas blancas de la investigación investigacion/05_PECERA_REVERSE_Y_BLANCOS.md, con precio y
     stock de una tienda americana (PCPartPicker, 16-09-2026; datos en bruto en JORGE,
     PECERA_pcpartpicker_2026-09-16/):
       - Si el catálogo ya tiene la versión negra del MISMO modelo, la ficha se copia de ella (misma
         caja y mismas medidas; cambia el color) y queda `specs_de_hermano` con su MPN.
       - Si no, la ficha lleva lo que dio PCPartPicker (largo y cables de la GPU, formato y chipset de
         la placa, radiador y sockets de la AIO...), suficiente para las reglas de compatibilidad.
       - Fuera: gabinetes sin hermano (O11 Vision Compact, O11D Mini V2, Y60, Montech XR, Vector
         V100R: falta hueco de fuente, altura de disipador y radiadores), las fuentes blancas (dudas de
         color en las Corsair RMe y sin datos de cables en el resto; en una pecera la fuente va tapada),
         RTX 5070 / 5070 Ti blancas (sin stock) y lo que sólo vende MemoryC.
  4. Categoría nueva "Ventiladores": packs de ventiladores reverse para la parte de abajo y el lateral
     de una pecera. Fuera: los de sólo MemoryC, los agotados, el ARCTIC P12 Pro Reverse a US$ 12,79 y
     el P14 Pro Reverse A-RGB a US$ 25,19 (precios sospechosos de ser por unidad) y el Thermalright
     TL-C12RB-S V2 (se vende suelto).

Precio: el menor con stock en tienda americana, sin MemoryC y sin el marketplace de Newegg cuando hay
otra tienda. Foto: la de PCPartPicker si pasa el estándar (>= 900 px, revisada a ojo, lista
FOTOS_OK); si no, la genérica de la categoría.

python alta_pecera_2026-09-16.py   (idempotente: si un MPN ya está, no lo vuelve a añadir)
"""
import json, os, re, shutil, sys
from PIL import Image

sys.stdout.reconfigure(encoding="utf-8")
BASE = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo"
CAT = os.path.join(BASE, "catalogo-final.json")
JORGE = r"D:\catalogo-investigacion-ARCHIVO\PECERA_pcpartpicker_2026-09-16"
FOTOS = os.path.join(JORGE, "fotos")
FECHA = "2026-09-16"
FUENTE = "pcpartpicker.com (EE.UU.), revisado tienda por tienda en la ficha"

cat = json.load(open(CAT, encoding="utf-8"))
por_mpn = {p["mpn"]: p for p in cat}
blancas = json.load(open(os.path.join(JORGE, "PECERA_versiones-blancas_pcpartpicker_2026-09-16.json"), encoding="utf-8"))["productos"]
fans = json.load(open(os.path.join(JORGE, "PECERA_ventiladores-reverse_pcpartpicker_2026-09-16.json"), encoding="utf-8"))["fichas"]
NOTA_US = next(p["disponibilidad_nota"] for p in cat if p["disponibilidad"] == "importacion_us")

# ---------------- 1. color ----------------
COLOR_A_MANO = {  # blancas/plateadas por diseño; su ficha no lo dice ("Aluminio" o nada)
    "90-MXBPJ0-A0UAYZ": "blanco",   # ASRock X870 Steel Legend WiFi
    "90MB1IF0-M0EAY0": "blanco",    # ASUS ROG Strix X870-A Gaming WiFi
    "Z890 AORUS PRO ICE": "blanco",
}


def color_de(p):
    if p["mpn"] in COLOR_A_MANO:
        return COLOR_A_MANO[p["mpn"]]
    nombre = f"{p['modelo']} {p['mpn']}"
    if re.search(r"\bwhite\b|\bICE\b|\bsnow\b|blanc", nombre, re.I):
        return "blanco"
    s = p["specs"]
    v = str(s.get("Color") or s.get("Color del producto") or s.get("Colour") or "").lower()
    if not v:
        return "negro" if re.search(r"\bblack\b|chromax\.black", nombre, re.I) else None
    if "/" in v and "blanc" in v:
        return "mixto"
    if re.search(r"blanc|white", v):
        return "blanco"
    if re.search(r"negr|black|gris|gray|grey", v):
        return "negro"
    return None


# ---------------- 2. peceras ----------------
PECERA = {  # cristal frontal + lateral (panorámico) y ventiladores de entrada abajo o al lateral
    "O11DERGBX", "O11DEXL-X", "CC-H61FB-01", "CM-H92FB-P1", "PH-NV523TG_DBK02", "PH-NV723TG_DBK01",
    "PH-NV923TG_DBK02", "CC-9011276-WW", "BGW71", "CS-HYTE-Y70TTI-GWING", "KING95PROB", "90DC00T0-B09030",
}


# ---------------- 3 y 4. altas ----------------
def precio(tiendas):
    """(precio, tienda, nota) con la regla de arriba; None si no hay tienda americana con stock."""
    ok = [(float(t[1].strip("$").replace(",", "")), t[0]) for t in tiendas
          if "in stock" in t[3].lower() and t[0] != "MemoryC"]
    sin_marketplace = [x for x in ok if x[1] != "Newegg Sellers"]
    ok = sin_marketplace or ok
    if not ok:
        return None
    v, tienda = min(ok)
    otras = sorted({t for _, t in ok} - {tienda})
    nota = f"revisado en ficha: {tienda} (con stock)" + (f" | también: {', '.join(otras)}" if otras else "")
    return v, tienda, nota


def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


CARPETA = {"Tarjetas gráficas": "gpus", "Gabinetes": "gabinetes", "Refrigeración": "refrigeracion",
           "Placas base": "placas", "Módulos de memoria": "ram", "Ventiladores": "ventiladores"}
# fotos de PCPartPicker que pasan el estándar (>= 900 px y revisadas a ojo el 16-09-2026: sin sellos,
# producto entero y del color correcto). El resto usa la genérica.
FOTOS_OK = set()
_fotos_ok = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fotos_pecera_ok.txt")
if os.path.exists(_fotos_ok):
    FOTOS_OK = {l.split("#")[0].strip() for l in open(_fotos_ok, encoding="utf-8") if l.split("#")[0].strip()}


def foto(p, archivo):
    carpeta = CARPETA[p["categoria"]]
    if archivo in FOTOS_OK:
        dst_rel = f"imagenes/{carpeta}/{p['gama']}/high/{slugify(p['marca'])}_{archivo}_PCPP_1.jpg"
        dst = os.path.join(BASE, dst_rel)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(os.path.join(FOTOS, archivo + ".jpg"), dst)
        p.update(imagenes_local={"medium": [], "high": [dst_rel]}, imagen_principal=dst_rel, n_imagenes=1,
                 n_fotos=1, imagen_generica=False, fotos_fuente="PCPartPicker (foto grande de la ficha)")
    else:
        p.update(imagenes_local={"medium": [], "high": []}, imagen_principal=f"imagenes/_generica/{carpeta}.png",
                 n_imagenes=0, n_fotos=0, imagen_generica=True,
                 fotos_fuente="sin foto válida (PCPartPicker < 900 px): genérica")


def ficha(categoria, marca, modelo, mpn, gama, specs, tiendas, url, archivo, hermano=None, extra=None):
    pr = precio(tiendas)
    if pr is None:
        print(f"  - sin tienda americana con stock, fuera: {marca} {modelo}")
        return None
    if mpn in por_mpn:
        return None
    p = {"marca": marca, "modelo": modelo, "mpn": mpn, "ean": "", "categoria": categoria,
         "titulo": f"{marca} {modelo}", "resumen": f"{marca} {modelo}",
         "n_specs": len(specs), "specs": specs, "slug": slugify(f"{marca} {modelo}"),
         "fuente": "pcpartpicker", "completo": True, "faltante": [], "url_oficial": url, "gama": gama,
         "precio_verificado": True, "precio_usd": pr[0], "precio_usd_fecha": FECHA, "precio_usd_fuente": FUENTE,
         "precio_usd_nota": pr[2], "precio_usd_revisar": False, "precio_pen": None, "precio_pen_sin_igv": None,
         "precio_pais": "US", "disponibilidad": "importacion_us", "disponibilidad_nota": NOTA_US,
         "alta_2026_09_16": "estilo pecera (investigacion/05_PECERA_REVERSE_Y_BLANCOS.md)"}
    if hermano:
        p["specs_de_hermano"] = hermano
    p.update(extra or {})
    foto(p, archivo)
    p["n_specs"] = len(p["specs"])
    p["color"] = color_de(p)
    return p


def archivo_de(mpn):
    return re.sub(r"[^A-Za-z0-9]+", "-", mpn.split(" (")[0]).strip("-")


def hermano(mpn, **cambios):
    s = dict(por_mpn[mpn]["specs"])
    for k in [k for k in s if k.lower() in ("color", "color del producto", "colour")]:
        del s[k]
    s["Color"] = "blanco"
    s.update(cambios)
    return s


nuevos = []
pp = {b["mpn"]: b for b in blancas}


def b(mpn_pp):
    return pp[mpn_pp]


# ---- tarjetas gráficas ----
GPUS = [
    # (mpn PCPartPicker, marca, modelo, gama, hermano del catálogo)
    ("DUAL-RTX5060-O8G-WHITE (90YV0N15-M0NA00)", "ASUS", "Dual GeForce RTX 5060 8GB GDDR7 OC Edition White", "entrada", "DUAL-RTX5060-O8G"),
    ("DUAL-RX9060XT-16G-WHITE (90YV0LG3-M0NA00)", "ASUS", "Dual Radeon RX 9060 XT 16GB White", "media", None),
    ("RX-96TS316W7", "XFX", "Swift OC Radeon RX 9060 XT 16GB White", "media", None),
    ("RX-96TMERCW9", "XFX", "Mercury OC Radeon RX 9060 XT 16GB White", "media", None),
    ("RX-97SWFB3W9", "XFX", "Swift OC Radeon RX 9070 16GB White", "alta", None),
    ("GV-R907XGAMINGOCICE-16GD", "GIGABYTE", "Radeon RX 9070 XT GAMING OC ICE 16G", "alta", "GV-R9070XTGAMING OC-16GD"),
    ("RX-97TSWF3W9", "XFX", "Swift Radeon RX 9070 XT 16GB White", "alta", None),
    ("PRIME-RX9070XT-O16G-WHITE (90YV0L75-MVAA00)", "ASUS", "Prime Radeon RX 9070 XT OC Edition 16GB White", "alta", None),
    ("G5080-16V3CW", "MSI", "GeForce RTX 5080 16G VENTUS 3X OC White", "alta", "GEFORCE RTX 5080 16G VENTUS 3X OC"),
]
for mpn_pp, marca, modelo, gama, her in GPUS:
    r = b(mpn_pp)
    k = r["k"]
    potencia = k["Power"].replace("8-pin", "8-pines").replace("12V-2x6", "12V-2x6 (16-pin)")
    specs = hermano(her) if her else {"Color": "blanco"}
    specs.update({"Longitud": k["Length"], "Conectores de energia suplementario": potencia,
                  "Ranuras que ocupa": k["Slots"]})
    if not her:
        vram = re.search(r"(\d+)\s?GB", modelo)
        specs["Capacidad memoria de adaptador gráfico"] = f"{vram.group(1)} GB"
        specs["Tipo de memoria de adaptador gráfico"] = "GDDR7" if "RTX" in modelo else "GDDR6"
    mpn = mpn_pp.split(" (")[0]
    extra = {"chip": re.search(r"(RTX \d{4}(?: Ti)?|RX \d{4}(?: XT)?)", modelo).group(1)}
    if "(" in mpn_pp:
        extra["version_codigo"] = mpn_pp.split("(")[1].rstrip(")")
    p = ficha("Tarjetas gráficas", marca, modelo, mpn, gama, specs, r["st"],
              f"https://pcpartpicker.com/product/{r['id']}/", archivo_de(mpn_pp), her, extra)
    if p:
        nuevos.append(p)

# ---- gabinetes (sólo con hermano: misma caja, otro color) ----
CASES = [
    ("CC-H61FW-01", "NZXT", "H6 Flow White", "media", "CC-H61FB-01", {}),
    ("CC-9011323-WW", "CORSAIR", "3500X RS-R ARGB White", "entrada", "CC-9011276-WW",
     # la versión RS-R ARGB trae 3 RS120-R ARGB reverse (corsair.com y Amazon, 16-09-2026); la ficha no
     # dice en qué posición: se dan por puestos en el lateral, que es donde los monta Corsair
     {"Ventiladores incluidos": "3 × 120 mm (RS120-R ARGB, reverse)",
      "Notas": "Filtros de polvo: Superior, Inferior, panel lateral. Superior: 3 x 120 mm-ventilador(es) opcional(es), o 2 x 140 mm-ventilador(es) opcional(es), Lateral: 3 x 120 mm RS120-R ARGB-ventilador(es) incluido(s), Inferior: 3 x 120 mm-ventilador(es) opcional(es), o 1 x 140-mm ventilador(es) opcional(es), Trasera: 1 x 120 mm-ventilador(es) opcional(es)"}),
    ("CC-9011310-WW", "CORSAIR", "FRAME 5000D RS ARGB White", "alta", "CC-9011309-WW", {}),
    ("O11DERGBW", "LIAN LI", "O11 Dynamic EVO RGB White", "alta", "O11DERGBX", {}),
    ("PH-NV723TG_DMW01", "PHANTEKS", "NV7 White", "alta", "PH-NV723TG_DBK01", {}),
    # la ficha negra es la Touch Infinite (con pantalla); PCPartPicker da 390 mm de GPU a la Y70
    # normal: se toma el menor de los dos
    ("CS-HYTE-Y70-WW", "HYTE", "Y70 White", "extrema", "CS-HYTE-Y70TTI-GWING",
     {"GPU máx.": "390 mm", "Longitud máx. de GPU": "máx. 390 mm"}),
    ("CM-H92FW-P1", "NZXT", "H9 Flow RGB+ (2025) White", "extrema", "CM-H92FB-P1", {}),
    ("O11DEXL-W", "LIAN LI", "O11 Dynamic EVO XL White", "extrema", "O11DEXL-X", {}),
]
for mpn, marca, modelo, gama, her, cambios in CASES:
    r = b(mpn)
    p = ficha("Gabinetes", marca, modelo, mpn, gama, hermano(her, **cambios), r["st"],
              f"https://pcpartpicker.com/product/{r['id']}/", archivo_de(mpn), her,
              {"estilo_pecera": her in PECERA})
    if p:
        nuevos.append(p)

# ---- refrigeración líquida blanca ----
AIOS = [
    ("MLW-D36M-A18PZ-RW", "COOLER MASTER", "MasterLiquid 360L Core ARGB White", "entrada", None),
    ("ACFRE00188A", "ARCTIC", "Liquid Freezer III Pro 360 A-RGB White", "media", "ACFRE00180A"),
    ("CW-9060095-WW", "CORSAIR", "NAUTILUS 360 RS ARGB White", "media", "CW-9060089-WW"),
    ("HSLCD36SW", "LIAN LI", "HydroShift LCD 360S White", "media", None),
    ("RL-KR360-W2", "NZXT", "Kraken Plus 360 RGB White", "media", "RL-KN360-B2"),
    ("CW-9061021-WW", "CORSAIR", "iCUE LINK TITAN 360 RX RGB White", "alta", "CW-9061018-WW"),
    ("RL-KR36E-W2", "NZXT", "Kraken Elite 360 RGB White", "alta", "RL-KR36E-B2"),
    ("GHS2OLDC36TW", "LIAN LI", "HydroShift II OLED Curved 360TL White", "extrema", "G89.GHS2OLDC36TB.00"),
    ("90RC0132-M0AAY0", "ASUS", "ROG Ryujin III 360 ARGB Extreme White", "extrema", "90RC0131-M0EAY0"),
    ("Frozen Infinity 360 WHITE", "THERMALRIGHT", "Frozen Infinity 360 ARGB White", "entrada", None),
]
for mpn, marca, modelo, gama, her in AIOS:
    r = b(mpn)
    if her:
        specs = hermano(her)
    else:
        specs = {"Tipo": "Refrigeración líquida (AIO)", "Radiador": r["k"]["Radiador"], "Ventiladores": "3 × 120 mm",
                 "Color": "blanco", "Sockets compatibles": r["k"]["Sockets"].replace("/", ", ")}
        if r["k"].get("Ruido"):
            specs["Ruido"] = r["k"]["Ruido"]
    p = ficha("Refrigeración", marca, modelo, mpn, gama, specs, r["st"],
              f"https://pcpartpicker.com/product/{r['id']}/", archivo_de(mpn), her, {"tipo": "liquida"})
    if p:
        nuevos.append(p)

# ---- placas base blancas ----
PLACAS = [
    ("90-MXBT30-A0UAYAZ", "ASROCK", "B850M Pro RS WiFi White", "entrada", None),
    ("B850M EAGLE WIFI6E ICE", "GIGABYTE", "B850M EAGLE WIFI6E ICE", "entrada", None),
    ("B850 EAGLE WIFI7 ICE", "GIGABYTE", "B850 EAGLE WIFI7 ICE", "entrada", None),
    ("90MB1J50-M0AAY0", "ASUS", "ROG STRIX B850-A GAMING WIFI", "media", None),
    ("X870 AORUS ELITE WIFI7 ICE", "GIGABYTE", "X870 AORUS ELITE WIFI7 ICE", "media", "X870 A ELITE WIFI7"),
    ("90-MXBUB0-A0UAYZ", "ASROCK", "B860 Challenger WiFi White", "entrada", None),
    ("PRO Z890-S WIFI WHITE", "MSI", "PRO Z890-S WIFI WHITE", "media", None),
    ("90MB1I60-M0AAY0", "ASUS", "Z890 AYW GAMING WIFI W", "media", None),
]
for mpn, marca, modelo, gama, her in PLACAS:
    r = b(mpn)
    k = r["k"]
    if her:
        specs = hermano(her)
    else:
        vendor = "AMD" if k["Socket"] == "AM5" else "Intel"
        specs = {"Chipset de tarjeta madre": f"{vendor} {k['Chipset']}",
                 "Factor de forma de la tarjeta madre": "Micro ATX" if k["Formato"] == "mATX" else "ATX",
                 "Socket de procesador": k["Socket"], "tipos de memoria compatibles": "DDR5-SDRAM",
                 "Wi-Fi": k["WiFi"], "Color": "blanco"}
    extra = {}
    if mpn == "90MB1J50-M0AAY0":
        # blanca por diseño; Amazon la tenía a US$ 202,99 sin saber el vendedor: se toma Best Buy/Newegg
        r = dict(r, st=[s for s in r["st"] if s[0] != "Amazon"])
        extra["precio_usd_aviso_interno"] = "Amazon US$ 202,99 (16-09-2026) sin vendedor confirmado: no se usa"
    p = ficha("Placas base", marca, modelo, mpn, gama, specs, r["st"],
              f"https://pcpartpicker.com/product/{r['id']}/", archivo_de(mpn), her, extra)
    if p:
        if not her:
            p["color"] = "blanco"
        nuevos.append(p)

# ---- memoria blanca ----
RAMS = [
    ("FF4D532G6000HC38ADC01", "TEAMGROUP", "T-Force Delta RGB DDR5-6000 32GB (2x16GB) CL38 White", "media", True),
    ("PVER532G60C30KW", "PATRIOT", "Viper Elite 5 RGB DDR5-6000 32GB (2x16GB) CL30 White", "alta", True),
    ("SP032GXLWU60AFDH", "SILICON POWER", "XPOWER Zenith RGB DDR5-6000 32GB (2x16GB) CL30 White", "alta", True),
    ("CP2K16G60C36U5W", "CRUCIAL", "Pro Overclocking DDR5-6000 32GB (2x16GB) CL36 White", "media", False),
    ("F5-6000J3636F16GX2-RM5RW", "G.SKILL", "Ripjaws M5 RGB DDR5-6000 32GB (2x16GB) CL36 White", "media", True),
    ("CMH32GX5M2B6000Z30W", "CORSAIR", "Vengeance RGB DDR5-6000 32GB (2x16GB) CL30 White", "alta", True),
    ("FF4D564G6000HC38ADC01", "TEAMGROUP", "T-Force Delta RGB DDR5-6000 64GB (2x32GB) CL38 White", "extrema", True),
    ("KF560C36BWEK2-64", "KINGSTON", "FURY Beast DDR5-6000 64GB (2x32GB) CL36 White", "extrema", False),
]
for mpn, marca, modelo, gama, rgb in RAMS:
    r = b(mpn)
    specs = {"Tipo de memoria": "DDR5", "Latencia": re.search(r"CL\d+", modelo).group(), "RGB": "Sí" if rgb else "No",
             "Color": "blanco"}
    if r["k"].get("Timing"):
        specs["Tiempos"] = r["k"]["Timing"]
    if r["k"].get("V"):
        specs["Voltaje"] = r["k"]["V"]
    p = ficha("Módulos de memoria", marca, modelo, mpn, gama, specs, r["st"],
              f"https://pcpartpicker.com/product/{r['id']}/", archivo_de(mpn))
    if p:
        nuevos.append(p)

# ---- ventiladores reverse ----
# ecosistema: estandar (4 pines PWM + 3 pines ARGB a la placa), lian-li-flex, lian-li-wireless,
# icue-link (necesita el System Hub, que no viene en el pack) y eurux (controlador USB propio)
FANS = [
    # (mpn, modelo para la web, gama, ecosistema, grosor mm o None)
    ("CO-9050196-WW", "RS120-R ARGB (3 pack)", "entrada", "estandar", None),
    ("CO-9050197-WW", "RS120-R ARGB White (3 pack)", "entrada", "estandar", None),
    ("PH-F120M25R_G2_DBK01_3P", "M25 G2 120 D-RGB Reverse (3 pack)", "entrada", "estandar", None),
    ("PH-F140M25R_G2_DBK01_3P", "M25 G2 140 D-RGB Reverse (3 pack)", "entrada", "estandar", None),
    ("TL-S12RW X3", "TL-S12RW White (3 pack)", "entrada", "estandar", None),
    ("TL-M12QRW-S X3", "TL-M12QRW-S White (3 pack)", "entrada", "estandar", None),
    ("CL-F175-PL12SW-A", "CT120 Reverse ARGB Sync White (2 pack)", "entrada", "estandar", None),
    ("12RCL1F3B", "UNI FAN CL FLEX Reverse (3 pack)", "media", "lian-li-flex", None),
    ("12RSL1F3W", "UNI FAN SL FLEX Reverse White (3 pack)", "media", "lian-li-flex", None),
    ("PH-F120D30R_DRGB_PWM_BK01_3P", "D30-120 Reversed D-RGB (3 pack)", "media", "estandar", 30),
    ("PH-F120D30R_DRGB_PWM_WT01_3P", "D30-120 Reversed D-RGB White (3 pack)", "media", "estandar", 30),
    ("CL-F195-PL14SW-A", "CT140 EX Reverse ARGB Sync White (3 pack)", "media", "estandar", None),
    ("CL-F174-PL14SW-A", "CT140 Reverse ARGB Sync (2 pack)", "media", "estandar", None),
    ("CL-F176-PL14SW-A", "CT140 Reverse ARGB Sync White (2 pack)", "media", "estandar", None),
    ("CO-9051050-WW", "iCUE LINK LX120-R RGB (3 pack)", "media", "icue-link", None),
    ("12RTL1F3B", "UNI FAN TL FLEX Reverse (3 pack)", "alta", "lian-li-flex", None),
    ("12RTL1F3W", "UNI FAN TL FLEX Reverse White (3 pack)", "alta", "lian-li-flex", None),
    ("12RSLIN1F3B", "UNI FAN SL-INF FLEX Reverse (3 pack)", "alta", "lian-li-flex", None),
    ("12RSLIN1F3W", "UNI FAN SL-INF FLEX Reverse White (3 pack)", "alta", "lian-li-flex", None),
    ("12RSLIN1W3B", "UNI FAN SL-INF Wireless Reverse (3 pack)", "alta", "lian-li-wireless", None),
    ("CO-9051052-WW", "iCUE LINK LX140-R RGB (2 pack)", "extrema", "icue-link", None),
    ("90DA00K0-B08020", "ROG Eurux GR120 ARGB Reverse (3 pack)", "extrema", "eurux", None),
    ("12RTLLCD1F3B", "UNI FAN TL LCD FLEX Reverse (3 pack)", "extrema", "lian-li-flex", None),
]
ECOSISTEMA_TXT = {"estandar": "Estándar: 4 pines PWM + 3 pines ARGB a la placa",
                  "lian-li-flex": "Lian Li FLEX: en cadena, cable estándar a la placa (control USB opcional)",
                  "lian-li-wireless": "Lian Li Wireless: controlador inalámbrico incluido (USB 2.0 interno)",
                  "icue-link": "Corsair iCUE LINK: necesita el iCUE LINK System Hub (no viene en el pack)",
                  "eurux": "ASUS ROG Eurux: controlador USB propio (USB 2.0 interno)"}
pf = {f["mpn"]: f for f in fans}
for mpn, modelo, gama, eco, grosor in FANS:
    f = pf[mpn]
    tam = int(re.search(r"\d+", f["tam"]).group())
    pack = int(re.search(r"\d+", f["pack"]).group())
    marca = {"Corsair": "CORSAIR", "Phanteks": "PHANTEKS", "Thermalright": "THERMALRIGHT",
             "Thermaltake": "THERMALTAKE", "Lian": "LIAN LI", "ASUS": "ASUS"}[f["marca"].split()[0]]
    color = "blanco" if f["color"] == "White" else "negro"
    specs = {"Tamaño": f"{tam} mm", "Ventiladores en el pack": str(pack),
             "Sentido": "Reverse: se ve la cara con luz desde el cristal cuando mete aire",
             "Iluminación": "ARGB" if "RGB" in f["led"] else "No", "Conector": f["conector"],
             "Control": ECOSISTEMA_TXT[eco], "Color": color}
    for clave, campo in (("Velocidad", "rpm"), ("Flujo de aire", "cfm"), ("Presión estática", "presion"), ("Ruido", "ruido")):
        if f.get(campo):
            specs[clave] = f[campo]
    if grosor:
        specs["Grosor"] = f"{grosor} mm"
    p = ficha("Ventiladores", marca, modelo, mpn, gama, specs, f["tiendas"], f["url"], archivo_de(mpn), None,
              {"ventilador": {"tamano_mm": tam, "pack": pack, "reverse": True, "ecosistema": eco,
                              "grosor_mm": grosor or 25 if eco == "estandar" and not grosor else grosor,
                              "argb": "RGB" in f["led"]}})
    if p:
        p["color"] = color
        # grosor: sólo se sabe de verdad el de las D30 (30 mm); el resto va de 25 a 28 mm
        p["ventilador"]["grosor_mm"] = grosor
        nuevos.append(p)

# ---------------- aplicar ----------------
for p in cat:
    p["color"] = color_de(p)
    if p["categoria"] == "Gabinetes":
        p["estilo_pecera"] = p["mpn"] in PECERA
cat.extend(nuevos)
slugs = [p["slug"] for p in cat]
dup = {s for s in slugs if slugs.count(s) > 1}
assert not dup, f"slugs repetidos: {dup}"
json.dump(cat, open(CAT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
from collections import Counter
print(f"{len(nuevos)} altas: {dict(Counter(p['categoria'] for p in nuevos))}")
print(f"con foto: {sum(not p['imagen_generica'] for p in nuevos)}, genérica: {sum(p['imagen_generica'] for p in nuevos)}")
print("color:", dict(Counter((p["categoria"], p["color"]) for p in cat if p["color"] == "blanco")))
print(f"catálogo: {len(cat)} productos")
