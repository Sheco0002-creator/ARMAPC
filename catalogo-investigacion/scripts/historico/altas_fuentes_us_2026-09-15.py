# -*- coding: utf-8 -*-
"""Alta de las cuatro fuentes americanas que sustituyen a las europeas sin venta en EE.UU.

Quinta ronda del 15-09-2026. Las europeas NO se tocan (el usuario quiere conservarlas con su aviso
naranja y su precio alemán); esto añade, al lado de cada una, el modelo que sí se vende en EE.UU.:

  Seasonic CORE BC 650 ATX 3.1   →  Seasonic CORE GX-650 ATX 3.1  (SRP-CGX651-A5A32SF, US$ 113.99)
  Seasonic CORE GC 750 ATX 3.1   →  Seasonic CORE GX-750 ATX 3.1  (SRP-CGX751-A5A32SF, US$ 124.99)
  XPG Core Reactor II 650W       →  XPG Core Reactor II VE 650W   (COREREACTORIIVE650G-BKCUS, US$ 92.99)
  FSP MEGA GM 1200W              →  FSP Hydro G Pro 1200W         (PPA12A1407, US$ 124.99)

Fotos (todas ≥ 900 px, producto limpio, sin banner ni sellos):
  - Seasonic: seasonic.com, galería oficial de la serie CORE GX ATX 3.1, 1462x1080 con fondo
    transparente. La GX-650 y la GX-750 comparten foto: Seasonic publica el mismo cuerpo para ambas
    (el estándar de fotos del proyecto admite compartir entre hermanos del mismo diseño).
  - XPG y FSP: foto de producto del fabricante alojada en Newegg, 1280 px. La de la web de XPG se
    descartó: es un montaje con fondo de fantasía.
Los originales sin procesar quedan en JORGE (FUENTES-PODER_fabricante_2026-09-15/).

Specs: ficha de alternate.de/geizhals (Seasonic), Icecat (XPG) y la tabla de Newegg + FSP (Hydro G
Pro). No se inventa ningún dato: lo que no se pudo verificar, no se escribe.

Respaldo previo: catalogo/catalogo-final.BACKUP-2026-09-15-1400-antes-altas-fuentes.json
"""
import json
import os
import shutil

from PIL import Image

BASE = os.path.join(os.path.dirname(__file__), "..", "catalogo")
CAT = os.path.join(BASE, "catalogo-final.json")
FOTOS = (r"C:\Users\USUARIO\AppData\Local\Temp\claude"
         r"\C--Users-USUARIO-Desktop-Primera-Pagina-Web-catalogo-investigacion"
         r"\5e10201d-eaa7-4354-b0b1-9392d7426865\scratchpad\fotos")
HOY = "2026-09-15"
NOTA_US = ("No hay stock local. Este producto se vende en EE.UU. y puedes importarlo por tu cuenta "
           "(Amazon, Newegg y similares). El envío, los impuestos de importación y la garantía corren "
           "por cuenta del comprador: no hay garantía local.")

COMUNES = dict(categoria="Fuentes de poder", icecat_id="", imagen_alta="", imagen_alta_res="",
               imagen_500="", galeria=[], fuente="cdn", completo=True, faltante=[],
               precio_verificado=True, n_fotos=1, n_imagenes=1, imagen_generica=False,
               precio_usd_fecha=HOY, precio_usd_revisar=False, precio_pais="US",
               precio_pen=None, precio_pen_sin_igv=None, precio_pen_tc=3.373,
               precio_pen_tc_fecha="2026-09-10", precio_pen_igv=0.18,
               precio_pen_fuente="precio_usd × TC BCRP (sistema bancario SBS, venta) + IGV 18 %; "
                                 "sin envío ni aranceles",
               gama_criterio="modelo", disponibilidad="importacion_us", disponibilidad_nota=NOTA_US)

NUEVAS = [
    dict(marca="SEASONIC", modelo="CORE GX-650 ATX 3.1", mpn="SRP-CGX651-A5A32SF",
         ean="4711173878452", gama="media", precio_usd=113.99, precio_referencia="~$114",
         url_oficial="https://seasonic.com/core-gx-atx-3-2024/",
         foto="seasonic-650-angled.webp", foto_ext="png",
         sustituye="Seasonic CORE BC 650 ATX 3.1 (SRP-CBC651-A5A51JF), que sólo se vende en Europa",
         nota_precio="revisado en ficha: Newegg, CORE ATX 3 (2024) GX-650, con stock",
         specs={"Potencia": "650 W", "Certificación": "80 PLUS Gold",
                "Estándar": "ATX12V 3.1, EPS12V 2.9x", "PCIe": "5.1", "Formato": "ATX",
                "Cableado modular": "Sí", "Conector 12V-2x6 / 12VHPWR": "Sí",
                "Ventilador": "1x 120 mm ventilador (rodamiento hidrodinámico)",
                "Control del ventilador": "Smart and Silent Fan Control",
                "Dimensiones": "Ancho: 150 mm x Alto: 86 mm x Profundidad: 140 mm",
                "Potencia total": "650 W", "Potencia +12V": "648 W",
                "Potencia +3,3V/+5V": "100 W", "Eficiencia": "Hasta 90 % al 50 % de carga",
                "Tensión de entrada": "100-240 V",
                "Corriente de entrada": "4,5 A a 230 V / 50 Hz, 9 A a 110 V / 60 Hz",
                "Corrección del factor de potencia": "PFC activo",
                "Garantía": "7 años", "Color": "negro", "Serie": "CORE GX"}),
    dict(marca="SEASONIC", modelo="CORE GX-750 ATX 3.1", mpn="SRP-CGX751-A5A32SF",
         ean="", gama="media", precio_usd=124.99, precio_referencia="~$125",
         url_oficial="https://seasonic.com/core-gx-atx-3-2024/",
         foto="seasonic-650-angled.webp", foto_ext="png",
         foto_compartida="Misma foto que la CORE GX-650: Seasonic publica el mismo cuerpo para toda "
                         "la serie CORE GX ATX 3.1 de 650 W y 750 W.",
         sustituye="Seasonic CORE GC 750 ATX 3.1 (SRP-CGC751-A5A32SF), que sólo se vende en Europa",
         nota_precio="revisado en ficha: Newegg, CORE ATX 3 (2024) GX-750, con stock",
         specs={"Potencia": "750 W", "Certificación": "80 PLUS Gold",
                "Estándar": "ATX12V 3.1, EPS12V 2.9x", "PCIe": "5.1", "Formato": "ATX",
                "Cableado modular": "Sí", "Conector 12V-2x6 / 12VHPWR": "Sí",
                "Ventilador": "1x 120 mm ventilador (rodamiento hidrodinámico)",
                "Control del ventilador": "Smart and Silent Fan Control",
                "Dimensiones": "Ancho: 150 mm x Alto: 86 mm x Profundidad: 140 mm",
                "Potencia total": "750 W", "Eficiencia": "Hasta 90 % al 50 % de carga",
                "Tensión de entrada": "100-240 V",
                "Corrección del factor de potencia": "PFC activo",
                "Garantía": "7 años", "Color": "negro", "Serie": "CORE GX"}),
    dict(marca="XPG", modelo="Core Reactor II VE 650W", mpn="COREREACTORIIVE650G-BKCUS",
         ean="", gama="media", precio_usd=92.99, precio_referencia="~$93",
         url_oficial="https://www.xpg.com/us/xpg/pc-components-core-reactor-ii-ve",
         foto="xpg-newegg.jpg", foto_ext="jpg",
         sustituye="XPG Core Reactor II 650W (COREREACTORII650G), descatalogada: sin ofertas ni en "
                   "EE.UU. ni en Europa",
         nota_precio="revisado en ficha: Newegg, COREREACTORIIVE650G, con stock",
         specs={"Potencia": "650 W", "Certificación": "80 PLUS Gold",
                "Estándar": "ATX12V 3.1, EPS12V 2.92", "Formato": "ATX",
                "Cableado modular": "Sí", "Conector 12V-2x6 / 12VHPWR": "Sí",
                "Ventilador": "1x 120 mm ventilador (rodamiento FDB), 0-2400 RPM",
                "Dimensiones": "Ancho: 150 mm x Alto: 86 mm x Profundidad: 140 mm",
                "Potencia total": "650 W", "Tensión de entrada": "100-240 V",
                "Frecuencia de entrada": "47-63 Hz", "Corriente de entrada": "10 A",
                "Corriente +3,3 V": "20 A", "Corriente +5 V": "20 A",
                "Corriente +12 V total": "54,1 A",
                "Corrección del factor de potencia": "PFC activo",
                "Color": "negro", "Serie": "CORE REACTOR II VE"}),
    dict(marca="FSP", modelo="Hydro G Pro 1200W", mpn="PPA12A1407",
         ean="", gama="alta", precio_usd=124.99, precio_referencia="~$125",
         url_oficial="https://www.fsplifestyle.com/",
         foto="fsp-hydro-g-pro-1200.jpg", foto_ext="jpg",
         sustituye="FSP MEGA GM 1200W (PPA12A1502), que sólo se vende en Europa",
         nota_precio="revisado en ficha: Newegg, HG2-1200-G5T, con stock",
         specs={"Potencia": "1200 W", "Certificación": "80 PLUS Gold",
                "Estándar": "ATX12V 3.0", "PCIe": "5.0", "Formato": "ATX",
                "Cableado modular": "Sí", "Conector 12V-2x6 / 12VHPWR": "Sí",
                "Potencia total": "1200 W", "Eficiencia": "Hasta 90 %",
                "Tensión de entrada": "100-240 V", "Corriente de entrada": "11-5,5 A",
                "Frecuencia de entrada": "50-60 Hz",
                "Corrección del factor de potencia": "PFC activo",
                "Ruido": "Cybenetics A-", "Color": "negro", "Serie": "Hydro G PRO",
                "Conectores": "1x 24-Pin-ATX12V-2.x, 2x 4+4-Pin-12V, 12+4 Pin, 6+2-Pin-gráfica, SATA"}),
]


def slugify(t):
    import re
    return re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")


cat = json.load(open(CAT, encoding="utf-8"))
existentes = {p["mpn"] for p in cat}
altas = []

for n in NUEVAS:
    if n["mpn"] in existentes:
        print("ya existe, se salta:", n["mpn"])
        continue
    # foto: se copia al catálogo con el nombre de siempre, <MARCA>_<MPN>_CDN_1.<ext>
    destino_rel = (f"imagenes/fuentes-poder/{n['gama']}/high/"
                   f"{n['marca'].replace(' ', '-')}_{n['mpn']}_CDN_1.{n['foto_ext']}")
    destino = os.path.join(BASE, destino_rel)
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    origen = os.path.join(FOTOS, n["foto"])
    im = Image.open(origen)
    assert min(im.size) >= 900 or max(im.size) >= 900, f"{n['mpn']}: foto pequeña {im.size}"
    if n["foto_ext"] == "png":
        im.save(destino)          # conserva la transparencia; el exportador la aplana sobre blanco
    else:
        shutil.copy2(origen, destino)
    slug = slugify(f"{n['marca']} {n['modelo']}")
    p = dict(COMUNES)
    p.update(marca=n["marca"], modelo=n["modelo"], mpn=n["mpn"], ean=n["ean"],
             titulo=f"Fuente de poder {n['marca'].title()} {n['modelo']}",
             resumen=f"{n['marca'].title()} {n['modelo']}, {n['specs']['Certificación']}, ATX, modular",
             slug=slug, imagenes_local={"medium": [], "high": [destino_rel]},
             imagen_principal=destino_rel, n_specs=len(n["specs"]), specs=n["specs"],
             url_oficial=n["url_oficial"], gama=n["gama"], precio_referencia=n["precio_referencia"],
             precio_usd=n["precio_usd"], precio_usd_fuente="newegg.com (EE.UU.)",
             precio_usd_nota=n["nota_precio"],
             alta_2026_09_15={"motivo": "equivalente americano de un producto que sólo se vende en "
                                        "Europa", "sustituye_en_la_practica_a": n["sustituye"]})
    if n.get("foto_compartida"):
        p["foto_compartida"] = n["foto_compartida"]
    cat.append(p)
    altas.append((f"{n['marca']} {n['modelo']}", n["precio_usd"], im.size, destino_rel))

json.dump(cat, open(CAT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("%d fuentes dadas de alta:" % len(altas))
for nombre, precio, size, ruta in altas:
    print("  %-34s US$ %-8s foto %sx%s  %s" % (nombre, precio, size[0], size[1], os.path.basename(ruta)))
