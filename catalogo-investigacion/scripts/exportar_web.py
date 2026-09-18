r"""Exporta el catálogo real a la forma que ya consume la web (2026-09-13).

Sólo esta fase escribe fuera de catalogo-investigacion/. Hasta aquí todo era lectura.
Genera en una carpeta de preparación (catalogo/export/, dentro de catalogo-investigacion,
NO en la web) para poder revisar antes de copiar a mano a src/data/ y public/:
  - components.json  (mismo esquema que src/data/components.json hoy: categories + tiers,
    con las claves que YA lee configurador/page.tsx -- socket, ramType, tdp, length,
    powerDraw, wattage, maxGpuLength, socketSupport... -- más las nuevas que hacían falta
    para completar la compatibilidad: maxCoolerHeight ya existía pero no se usaba,
    radiatorMax/radiatorSize/tdpCapacity son nuevas)
  - images/<slug>.jpg  (1 sola foto por producto, la principal, max 900 px, calidad 82)

ALCANCE (decisión del usuario, 2026-09-13): SÓLO los productos disponibles en EE.UU.
(importacion_us; `local` ya no existe desde el 15-09-2026) que además tienen con qué combinar. Fuera de esto
(no se borran, se archivan aparte con el motivo):
  - los 64 importacion_global (europeos/asiáticos y marcas sin venta en EE.UU., sin precio americano)
  - 4 kits DDR4 sin ninguna placa DDR4 disponible aquí
  - 2 Ryzen 5 AM4 (5600 / 5600X) sin ninguna placa AM4 disponible aquí
  - los 13 con precio_usd_sin_stock: SÍ entran (tienen precio real), pero con `sinStock: true`
    y NUNCA como opción por defecto en un tier/build.
Total: 204 productos americanos exportados (210 - 6 huérfanos) + 63 globales = 267.

AMPLIACIÓN (decisión del usuario, 2026-09-13, más tarde): los europeos/asiáticos (importacion_global)
SÍ entran al configurador -- no a los presupuestos --, con su compatibilidad normal (verde/rojo)
y además un aviso naranja: "No disponible en EE.UU." (o "No se vende en EE.UU." / "Sin precio
verificado en EE.UU.", según el motivo real del catálogo) y en qué país se vende y a qué precio.
  - Precio: sólo si viene de una fuente de la tabla PAIS (de./uk.pcpartpicker, geizhals.de y
    asus.com/es: Alemania, Reino Unido y España). Se muestra el precio de la tienda de ese país
    (con IVA: 19 % en Alemania, 21 % en España) y, para sumar al total en dólares, el mismo precio
    SIN IVA convertido con los tipos de cambio que ya usa precio_referencia_eu (12-09). Sin precio
    fiable -> `sinPrecio: true`, price 0, y el total no lo suma.
  - El kit XPG Spectrix D35G DDR4 queda fuera, igual que los otros 4 DDR4: no hay ninguna placa
    DDR4 en todo el catálogo.
  - `importacionGlobal: true` para que la página lo distinga (la calculadora de la portada, que
    es de presupuesto, los excluye).
Total: 267 productos (204 americanos + 63 globales).

Precio: sólo dólares (currency: "USD"). Desde el 15-09-2026 la web se dirige a EE.UU.: no se
exporta ningún dato en soles -- ni `disponibleLocalPen` por producto ni el `tipoCambioReferencial`
con el que las páginas pintaban una línea "≈ S/ ... referencial" bajo el total.

ESTILO PECERA (16-09-2026, decisión del usuario): categoría nueva "fans" (Ventiladores, OPCIONAL: no
cuenta en las 8 piezas), campo `color` en cada producto ("blanco", "negro", "mixto"), `pecera` y
`fanSlots` (huecos de abajo y del lateral) en los gabinetes, y builds con `estilo` ("pecera",
"pecera-blanca"; las de siempre, "estandar"). Ver compatibilidad.py (ESTILOS).

python exportar_web.py
"""
import hashlib, io, json, os, re, shutil, sys
import warnings
warnings.filterwarnings("ignore")
from PIL import Image

sys.stdout.reconfigure(encoding="utf-8")
RAIZ = r"C:\Users\USUARIO\Desktop\Primera Pagina Web"
CATD = os.path.join(RAIZ, "catalogo-investigacion", "catalogo")
CAT = os.path.join(CATD, "catalogo-final.json")
COMPAT = os.path.join(CATD, "compatibilidad.json")
EXPORT = os.path.join(CATD, "export")
IMG_OUT = os.path.join(EXPORT, "images")

HUERFANOS_MPN = {
    "CMK32GX4M2E3200C16", "F4-3600C18D-32GVK", "KF432C16BBK2/16", "TF3D432G3600HC18JDC01",  # DDR4 sin placa
    "100-100000927BOX", "100-100000065BOX",  # Ryzen 5 5600 / 5600X, AM4 sin placa
    "AX4U360016G18I-DTBKD35G",  # XPG Spectrix D35G DDR4 (global): tampoco hay placa DDR4
}
# tipos de cambio de precio_referencia_eu (catálogo, 12-09): el mismo cálculo que ya se usó
FX_USD = {"EUR": 1.1592, "GBP": 1.3508}
PAIS = {"de.pcpartpicker": ("DE", "Alemania"), "uk.pcpartpicker": ("UK", "Reino Unido"),
        "geizhals.de": ("DE", "Alemania"), "asus.com/es": ("ES", "España")}
SIMBOLO = {"EUR": "€", "GBP": "£"}
TITULO_AVISO = {
    "marca_europea": "No disponible en EE.UU.",
    "version_europea": "No disponible en EE.UU.",
    "sin_canal_america": "No disponible en EE.UU.",
    "modelo_no_en_peru": "No disponible en EE.UU.",
    "sancion_eeuu": "No se vende en EE.UU.",
    "sin_precio_verificado": "Sin precio verificado en EE.UU.",
    "en_peru_pendiente_confirmar": "Sin precio verificado en EE.UU.",
}
CAT_ID = {"Procesadores": "cpu", "Placas base": "motherboard", "Módulos de memoria": "ram",
          "Tarjetas gráficas": "gpu", "Almacenamiento": "storage", "Fuentes de poder": "psu",
          "Gabinetes": "case", "Refrigeración": "cooling", "Ventiladores": "fans"}
CAT_LABEL = {"cpu": "Procesador", "motherboard": "Placa madre", "ram": "Memoria RAM",
             "gpu": "Tarjeta gráfica", "storage": "Almacenamiento", "psu": "Fuente de poder",
             "case": "Gabinete", "cooling": "Refrigeración", "fans": "Ventiladores (opcional)"}
CAT_ORDER = {"cpu": 1, "motherboard": 2, "ram": 3, "gpu": 4, "storage": 5, "psu": 6, "case": 7, "cooling": 8,
             "fans": 9}
CAT_OPCIONAL = {"fans"}  # no cuenta en "8 de 8 piezas" ni hace falta para que la build esté completa

# ---- Versión inglesa de la web (15-09-2026): /configurator y /budgets leen los campos *En; la
# española, los de siempre (que no cambian). Sólo se escribe *En cuando difiere del español. ----
CAT_LABEL_EN = {"cpu": "Processor", "motherboard": "Motherboard", "ram": "Memory (RAM)",
                "gpu": "Graphics card", "storage": "Storage", "psu": "Power supply",
                "case": "Case", "cooling": "Cooling", "fans": "Fans (optional)"}
PAIS_EN = {"Alemania": "Germany", "Reino Unido": "United Kingdom", "España": "Spain"}
TITULO_AVISO_EN = {"No disponible en EE.UU.": "Not available in the US",
                   "No se vende en EE.UU.": "Not sold in the US",
                   "Sin precio verificado en EE.UU.": "No verified US price"}
# frases sueltas de las fichas (specs, grupo) y avisos: en orden, de la más larga a la más corta
FRASES_EN = [
    (r"No incluye \(radiador sin ventiladores\)", "Not included (radiator without fans)"),
    (r"Aire, (\d+) mm de alto", r"Air, \1 mm tall"),
    (r"(\d+) núcleos", r"\1 cores"), (r"(\d+) hilos", r"\1 threads"),
    (r"\blee (\d+) MB/s", r"\1 MB/s read"),
    (r"\bsin Wi-Fi\b", "no Wi-Fi"), (r"\bNo modular\b", "Non-modular"),
    (r"\bcable 12V-2x6\b", "12V-2x6 cable"),
    (r"\bMedia torre\b", "Mid tower"), (r"\bTorre completa\b", "Full tower"), (r"\bTorre grande\b", "Large tower"),
    (r"\b1 ventilador\b", "1 fan"), (r"(\d+) ventiladores", r"\1 fans"),
    (r"\bDisipador por aire\b", "Air cooler"), (r"\bLíquida\b", "Liquid"), (r"\bAire\b", "Air"),
    (r"\bhasta\b", "up to"),
    (r"\bpecera\b", "fishbowl"),
    (r"^Sin stock en EE\.UU\. · precio de lista$", "Out of stock in the US · list price"),
    (r"DeepCool está sancionada por EE\.UU\.: las tiendas estadounidenses no la venden",
     "DeepCool is under US sanctions: US stores don't sell it"),
    (r"Sólo funciona a 200-240 V: no sirve en los enchufes de EE\.UU\. \(120 V\)",
     "Only works at 200-240 V: not usable with US outlets (120 V)"),
]


def al_ingles(texto):
    if not texto:
        return texto
    for patron, cambio in FRASES_EN:
        texto = re.sub(patron, cambio, texto)
    return texto


def con_ingles(obj, campo, valor_en):
    """Añade campo+En sólo si el inglés difiere (la web cae al español cuando no está)."""
    if valor_en and valor_en != obj.get(campo):
        obj[campo + "En"] = valor_en
# (aquí vivía TC_PEN, el tipo de cambio del sol: la web dejó de mostrar soles el 15-09-2026)

os.makedirs(IMG_OUT, exist_ok=True)
cat = json.load(open(CAT, encoding="utf-8"))
compat = json.load(open(COMPAT, encoding="utf-8"))
productos_compat = {(v["idx"]): v for grupo in ("productos", "productos_globales")
                    for cat_ in compat.get(grupo, {}).values() for v in cat_}

# Retirados de la web a mano (duplicados de algo que ya está con precio americano, 15-09-2026):
# siguen en el catálogo, con el motivo dentro de `fuera_de_web`.
RETIRADOS = {p["mpn"] for p in cat if p.get("fuera_de_web")}
if RETIRADOS:
    print(f"{len(RETIRADOS)} productos retirados de la web a mano (ver `fuera_de_web` en el catálogo)")
america = [p for p in cat if p["disponibilidad"] in ("local", "importacion_us")]
excluidos = [p for p in america if p["mpn"] in HUERFANOS_MPN | RETIRADOS]
incluidos = [p for p in america if p["mpn"] not in HUERFANOS_MPN | RETIRADOS]
globales = [p for p in cat if p["disponibilidad"] == "importacion_global"]
globales_inc = [p for p in globales if p["mpn"] not in HUERFANOS_MPN | RETIRADOS]
print(f"{len(incluidos)} americanos ({len(america)} - {len(excluidos)} huérfanos sin pareja compatible: "
      f"{[p['modelo'] for p in excluidos]})")
print(f"{len(globales_inc)} globales ({len(globales)} - {len(globales) - len(globales_inc)} fuera: "
      f"huérfano DDR4 y retirados por duplicados)")


def aviso_global(p):
    """Campos de la tarjeta naranja: título según el motivo real del catálogo, país y precio
    de la tienda de ese país (con IVA), y el precio sin IVA en dólares para sumar al total."""
    fuente = str(p.get("precio_usd_fuente") or "")
    pais = next((v for k, v in PAIS.items() if k in fuente), None)
    orig = p.get("precio_original") or {}
    out = {"importacionGlobal": True,
           "avisoTitulo": TITULO_AVISO.get(p.get("disponibilidad_motivo"), "No disponible en EE.UU.")}
    # sólo se toma precio de un país si de verdad viene de ese país (el P310 4TB, por ejemplo,
    # trae un precio_original derivado de un marketplace peruano ya descartado: no vale)
    if pais and orig.get("moneda") in FX_USD and orig.get("valor"):
        sin_iva = orig["valor"] / (1 + (orig.get("iva_incluido") or 0))
        out.update(price=round(sin_iva * FX_USD[orig["moneda"]]), paisPrecio=pais[0], paisNombre=pais[1],
                   precioLocal=f"{SIMBOLO[orig['moneda']]}{orig['valor']:,.2f}")
        out["avisoDetalle"] = f"Se vende en {pais[1]}: {out['precioLocal']} con IVA"
    elif p.get("pais_venta"):
        out.update(price=0, sinPrecio=True)
        out["avisoDetalle"] = f"Se vende en {p['pais_venta']}, precio por confirmar"
    else:
        out.update(price=0, sinPrecio=True)
        out["avisoDetalle"] = ("Sólo importándolo desde Europa o Asia, sin precio de referencia"
                               if p.get("disponibilidad_motivo") == "sin_canal_america"
                               else "Sin precio de referencia")
    entrada = str(especie_psu(p) or "")
    if p["categoria"] == "Fuentes de poder" and entrada.replace(" ", "").startswith("200"):
        out["avisoExtra"] = "Sólo funciona a 200-240 V: no sirve en los enchufes de EE.UU. (120 V)"
    elif p.get("aviso_extra"):  # motivo concreto de la ficha (p. ej. marca sancionada en EE.UU.)
        out["avisoExtra"] = p["aviso_extra"]
    # decisión del usuario (15-09-2026): estas piezas se quedan, pero dejando claro que traerlas
    # a EE.UU. es cosa del comprador
    out["avisoImportacion"] = ("Importarlo corre por tu cuenta: envío, aduana e impuestos, "
                               "y sin garantía en EE.UU.")
    # los mismos avisos en inglés (versión inglesa de la web)
    out["avisoTituloEn"] = TITULO_AVISO_EN.get(out["avisoTitulo"], "Not available in the US")
    if out.get("paisNombre"):
        out["paisNombreEn"] = PAIS_EN.get(out["paisNombre"], out["paisNombre"])
        out["avisoDetalleEn"] = f"Sold in {out['paisNombreEn']}: {out['precioLocal']} incl. VAT"
    elif p.get("pais_venta"):
        out["avisoDetalleEn"] = f"Sold in {PAIS_EN.get(p['pais_venta'], p['pais_venta'])}, price to be confirmed"
    else:
        out["avisoDetalleEn"] = ("Only by importing it from Europe or Asia, no reference price"
                                 if p.get("disponibilidad_motivo") == "sin_canal_america"
                                 else "No reference price")
    if out.get("avisoExtra"):
        out["avisoExtraEn"] = al_ingles(out["avisoExtra"])
    out["avisoImportacionEn"] = "Importing it is on you: shipping, customs and taxes, and no US warranty."
    return out


def especie_psu(p):
    return next((v for k, v in p["specs"].items() if re.search(r"tensión de entrada|input voltage", k, re.I)), None)


def slugify(mpn):
    return re.sub(r"[^a-z0-9]+", "-", mpn.lower()).strip("-")


# Una sola copia por foto (15-09-2026, decisión del usuario): hermanos del mismo diseño (los 7
# Ryzen 9000, las 6 PNY, los kits Vengeance...) comparten foto, y antes cada uno la escribía con su
# nombre: 30 archivos idénticos en public/. Ahora el primero que la usa le da nombre y los demás
# apuntan a ese archivo. IMAGENES_ESCRITAS = lo que produce esta exportación (para ver sobrantes).
FOTO_POR_HASH, IMAGENES_ESCRITAS = {}, set()


def imagen(p, idx):
    src = os.path.join(CATD, p["imagen_principal"])
    slug = p["slug"]
    dst_rel = f"{slug}.jpg"
    dst = os.path.join(IMG_OUT, dst_rel)
    try:
        im = Image.open(src)
        if im.mode in ("RGBA", "LA", "P"):
            im = im.convert("RGBA")
            fondo = Image.new("RGB", im.size, "white")
            fondo.paste(im, mask=im.split()[3])
            im = fondo
        else:
            im = im.convert("RGB")
        im.thumbnail((900, 900))
        buf = io.BytesIO()
        im.save(buf, format="JPEG", quality=82, optimize=True)
        datos = buf.getvalue()
    except Exception as e:
        return None, str(e)
    h = hashlib.sha256(datos).hexdigest()
    if h in FOTO_POR_HASH:  # misma foto que un hermano ya exportado: se reutiliza su archivo
        return f"/images/catalogo/{FOTO_POR_HASH[h]}", None
    FOTO_POR_HASH[h] = dst_rel
    IMAGENES_ESCRITAS.add(dst_rel)
    with open(dst, "wb") as f:
        f.write(datos)
    return f"/images/catalogo/{dst_rel}", None


def dato(s, patron, excluir=None):
    """Primer valor de la ficha cuya clave casa con `patron` (las fichas vienen de Icecat, de
    fabricantes y de tiendas, cada una con sus nombres de campo)."""
    for k, v in s.items():
        if re.search(patron, k, re.I) and not (excluir and re.search(excluir, k, re.I)) and str(v).strip():
            return str(v).strip()
    return None


def entero(v):
    m = re.search(r"\d[\d.,]*", str(v or ""))
    return int(re.sub(r"[.,]", "", m.group())) if m else None


def vram_de(p):
    """(GB, tipo) de la memoria de vídeo: ficha -> nombre del modelo. Lo que falte se completa
    luego con otras fichas del mismo modelo (VRAM_POR_GRUPO)."""
    s = p["specs"]
    v = dato(s, r"capacidad memoria de adaptador|memoria video|^memory size$|^memoria$")
    gb = re.search(r"(\d+)\s?GB", v or "", re.I)
    gb = int(gb.group(1)) if gb else None
    if gb is None:
        m = re.search(r"\b(\d{1,2})\s?GB?\b", p["modelo"])
        gb = int(m.group(1)) if m else None
    tipo = re.search(r"GDDR\d\w?", (v or "") + " " + (dato(s, r"tipo de memoria de adaptador|tipo de memoria$") or ""), re.I)
    return gb, tipo.group().upper() if tipo else None


def specs_str(p, o, catid):
    """La línea de datos de cada producto (13-09: "mejora las fichas"). Antes buscaba campos que
    no existen ("Número de núcleos" en vez de "Núcleos / Hilos") y los 19 procesadores repetían su
    nombre; las placas sólo decían "DDR5 · ATX". Ahora usa lo que traen las fichas de verdad y deja
    fuera lo que ya enseña la fila de abajo de la tarjeta (socket, TDP, consumo, vatios, certificado).
    Los textos que buscan los filtros del configurador (AMD, AM5, ATX, 32 GB, NVMe, 850W, Aire...)
    tienen que seguir apareciendo: lo comprueba la auto-verificación de filtros de más abajo."""
    s = p["specs"]
    partes = []
    if catid == "cpu":
        # AMD: "6 / 12"; Intel: "14 (6P + 8E) / 14" (núcleos de rendimiento + eficientes)
        nh = re.match(r"\s*(\d+)\s*(?:\(([^)]*)\))?\s*/\s*(\d+)", dato(s, r"^núcleos / hilos$") or "")
        if nh:
            reparto = f" ({nh.group(2).replace(' ', '')})" if nh.group(2) else ""
            partes.append(f"{nh.group(1)} núcleos{reparto} / {nh.group(3)} hilos")
        boost = dato(s, r"^frecuencia boost$|max turbo frequency|max\. boost clock", r"efficient")
        if boost:
            partes.append("hasta " + re.sub(r"^up to\s*", "", boost, flags=re.I))
        l3 = dato(s, r"^caché l3$|^l3 cache$")
        if l3:
            partes.append(f"L3 {l3}")
        return " · ".join(partes) or p["modelo"]
    if catid == "motherboard":
        partes = [o.get("ram_tipo", "DDR5"), (o.get("formato") or "ATX").replace("EATX", "E-ATX")]
        # el estándar ("Wi-Fi 6E") antes que el campo "Wifi: Sí", que también existe en Icecat
        estandar = re.search(r"wi-?fi\s?(\d\w?)", dato(s, r"máximo estánda.*wi-?fi") or dato(s, r"^wi-?fi$") or "", re.I)
        tiene = (dato(s, r"^wi-?fi$") or "").lower()
        if estandar:
            partes.append(f"Wi-Fi {estandar.group(1).upper()}")
        elif tiene in ("sí", "si", "yes"):
            partes.append("Wi-Fi")
        elif tiene == "no":
            partes.append("sin Wi-Fi")
        m2 = entero(dato(s, r"número de ranuras m\.2"))
        if m2:
            partes.append(f"{m2}× M.2")
        lan = dato(s, r"tipo de interfaz ethernet|^lan$")  # ASRock (ficha de fabricante) lo llama "LAN"
        velocidad = re.search(r"(\d+(?:\.\d+)?)\s?(gigabit|gbe|g\b)", lan or "", re.I)
        if velocidad:
            partes.append(f"LAN {velocidad.group(1)}G")
        return " · ".join(partes)
    if catid == "ram":
        kit = re.search(r"\((\d+)x(\d+)GB\)", p["modelo"], re.I)
        cap = f"{o.get('capacidad_gb', '?')} GB" + (f" ({kit.group(1)}×{kit.group(2)})" if kit else "")
        vel = re.search(r"DDR\d-(\d+)", p["modelo"])
        cl = re.search(r"CL(\d+)", p["modelo"]) or re.search(r"CL?(\d+)", dato(s, r"^latencia$|latencia cas") or "")
        partes.append(f"{cap} {o.get('ram_tipo', 'DDR5')}{'-' + vel.group(1) if vel else ''}{' CL' + cl.group(1) if cl else ''}")
        perfil = (dato(s, r"perfil xmp/expo|perfiles de overclock|perfil de rendimiento") or "").upper()
        perfiles = [x for x in ("XMP", "EXPO") if x in perfil]
        if perfiles:
            partes.append("/".join(perfiles))
        if "RGB" in p["modelo"].upper() or (dato(s, r"^rgb$") or "").lower() in ("sí", "si", "yes"):
            partes.append("RGB")
        return " · ".join(partes)
    if catid == "gpu":
        partes.append(o.get("chip") or p["modelo"])
        gb, tipo = VRAM_POR_ID.get(p["mpn"], (None, None))
        if gb:
            partes.append(f"{gb} GB{' ' + tipo if tipo else ''}")
        if o.get("longitud_mm"):
            partes.append(f"{o['longitud_mm']:.0f} mm")
        return " · ".join(partes).replace(" TI", " Ti").replace("ARC ", "Arc ")
    if catid == "storage":
        cap = s.get("Capacidad", "")
        if o.get("hdd"):  # un disco mecánico se rotulaba "SATA", igual que un SSD SATA: ahora dice HDD
            rpm = entero(dato(s, r"velocidad de giro|disk speed"))
            return f"{cap} · HDD" + (f" · {rpm} rpm" if rpm else "")
        interfaz = o.get("interfaz", "NVMe")
        gen = re.search(r"(?:gen\s?|pcie\s?)(\d)", (dato(s, r"^interfaz$") or "") + " " + (dato(s, r"^tipo$") or ""), re.I)
        partes.append(f"{cap} · {interfaz}{' Gen' + gen.group(1) if gen and interfaz == 'NVMe' else ''}")
        lectura = entero(dato(s, r"lectura secuencial|sequential read"))
        if lectura:
            partes.append(f"lee {lectura} MB/s")
        return " · ".join(partes)
    if catid == "psu":
        modular = str(s.get("Cableado modular") or "")
        tipo = "Modular" if modular.lower() in ("sí", "fully-modular") else (
            "Semi-modular" if "semi" in modular.lower() else "No modular")
        # el vatiaje se repite aquí (la fila de abajo ya lo muestra) a propósito: es el único
        # campo de texto que el filtro por potencia puede buscar (wattage es numérico, no texto)
        partes.append(f"{int(o.get('vatios') or 0)}W · {tipo}")
        if str(dato(s, r"12v-2x6|12vhpwr") or "").lower() in ("sí", "si", "yes"):
            partes.append("cable 12V-2x6")
        return " · ".join(partes)
    if catid == "case":
        formato = dato(s, r"^formato$")
        if formato:
            partes.append(formato[0].upper() + formato[1:])
        partes.append("/".join(o.get("formatos", [])).replace("EATX", "E-ATX"))
        if o.get("gpu_max_mm"):
            partes.append(f"GPU hasta {int(o['gpu_max_mm'])} mm")
        vent = dato(s, r"^ventiladores incluidos$")
        n = sum(int(x) for x in re.findall(r"(\d+)\s?[×x]", vent or ""))
        if n:
            partes.append(f"{n} ventilador{'es' if n > 1 else ''}")
        return " · ".join(partes)
    if catid == "cooling":
        vent = re.sub(r"\s*[×x]\s*", "×", dato(s, r"^ventiladores$") or "").replace(" mm", "")
        if o.get("tipo") == "liquida":
            partes.append(f"Líquida {o.get('radiador_mm', '?')} mm")
            if vent:
                partes.append(f"{vent} mm")
        else:
            partes.append("Aire" + (f", {int(o['altura_mm'])} mm de alto" if o.get("altura_mm") else ""))
            if vent:
                partes.append(f"{vent} mm")
            if o.get("tdp_max"):
                partes.append(f"hasta {int(o['tdp_max'])} W")
        return " · ".join(partes)
    if catid == "fans":
        v = p["ventilador"]
        partes.append(f"{v['pack']} × {v['tamano_mm']} mm · reverse")
        if v.get("argb"):
            partes.append("ARGB")
        if v.get("grosor_mm"):
            partes.append(f"{v['grosor_mm']} mm")
        return " · ".join(partes)
    return p["modelo"]


def grupo_de(p, o, catid):
    """Modelo al que pertenece el producto, para el configurador sencillo (13-09): la lista enseña
    modelos ("RTX 5070 · desde US$ 840 · 7 versiones") y al elegir uno se escoge la versión.
    CPU, gabinete y refrigeración no tienen versiones de marca: cada producto es su propio modelo."""
    if catid == "gpu":
        chip = (o.get("chip") or "").replace(" TI", " Ti").replace("ARC ", "Arc ")
        if chip in ("RX 9060 XT", "RTX 5060 Ti"):  # mismo chip con 8 o 16 GB: son modelos distintos
            m = re.search(r"\b(8|16)\s?G", p["modelo"])
            chip += f" {m.group(1)} GB" if m else ""
        return chip or None
    if catid == "motherboard":
        m = re.search(r"\b([ABHXZ]\d{3}E?)M?\b", p["modelo"].upper())  # B650M-A -> B650, X870E -> X870E
        return f"{m.group(1)} · {o.get('socket')}" if m else None
    if catid == "ram":
        return f"{o.get('capacidad_gb')} GB {o.get('ram_tipo', 'DDR5')}"
    if catid == "storage":
        return f"{p['specs'].get('Capacidad', '')} {'HDD' if o.get('hdd') else o.get('interfaz', 'NVMe')}".strip()
    if catid == "psu":
        return f"{int(o.get('vatios') or 0)} W" if o.get("vatios") else None
    if catid == "cooling":  # por tipo, como en el plan: la recomendada ya es la más barata compatible
        return f"Líquida {o.get('radiador_mm')} mm" if o.get("tipo") == "liquida" else "Disipador por aire"
    return None


categories = {cid: {"id": cid, "label": CAT_LABEL[cid], "labelEn": CAT_LABEL_EN[cid], "order": CAT_ORDER[cid],
                     **({"optional": True} if cid in CAT_OPCIONAL else {}), "filterOptions": [], "items": []}
              for cid in CAT_ID.values()}


def huecos(o):
    """Huecos de ventilador de abajo (bottom) y del lateral (side), tal como los lee compatibilidad.py."""
    out = {}
    for pos, clave in (("inferior", "bottom"), ("lateral", "side")):
        d = (o.get("posiciones_ventilador") or {}).get(pos)
        if d:
            out[clave] = {"120": d["120"], "140": d["140"], "included": d["incluidos"],
                          **({"maxThickness": d["grosor_max_mm"]} if d.get("grosor_max_mm") else {})}
    return out or None
item_por_idx = {}

# memoria de vídeo: la de la ficha o el nombre y, si falta, la más repetida entre las fichas del
# mismo modelo (RTX 5070 = 12 GB GDDR7 en todas las marcas; 9060 XT y 5060 Ti ya van por 8/16 GB)
VRAM_POR_ID, _por_grupo = {}, {}
for p in incluidos + globales_inc:
    if CAT_ID[p["categoria"]] == "gpu":
        g = grupo_de(p, productos_compat.get(cat.index(p), {}), "gpu")
        VRAM_POR_ID[p["mpn"]] = vram_de(p)
        _por_grupo.setdefault(g, []).append(VRAM_POR_ID[p["mpn"]])
for p in incluidos + globales_inc:
    if CAT_ID[p["categoria"]] == "gpu":
        g = grupo_de(p, productos_compat.get(cat.index(p), {}), "gpu")
        gb, tipo = VRAM_POR_ID[p["mpn"]]
        mas = lambda xs: max(set(xs), key=xs.count) if xs else None
        gb = gb or mas([x[0] for x in _por_grupo[g] if x[0]])
        tipo = tipo or mas([x[1] for x in _por_grupo[g] if x[1]])
        VRAM_POR_ID[p["mpn"]] = (gb, tipo)

# primero los americanos y detrás los globales: en cada categoría del configurador la lista
# empieza por lo que se compra en América
for p in incluidos + globales_inc:
    idx = cat.index(p)
    catid = CAT_ID[p["categoria"]]
    o = productos_compat.get(idx, {})
    slug = p["slug"]
    img, err = imagen(p, idx)
    if err:
        print(f"  ! sin imagen {p['modelo']}: {err}")
    item = {
        "id": f"{catid}-{slug}", "name": f"{p['marca']} {p['modelo']}".strip(),
        "specs": specs_str(p, o, catid),
        "price": round(p["precio_usd"]) if p.get("precio_usd") is not None else 0,
        "image": img, "brand": p["marca"], "mpn": p["mpn"], "slug": slug,
        "disponibilidad": p["disponibilidad"],
        "color": p.get("color"),
    }
    # (hasta el 15-09-2026 los `local` añadían aquí su precio de tienda peruana en soles; la web
    # se dirige a EE.UU. y no muestra precios en soles, así que ya no se exporta)
    if p["disponibilidad"] == "importacion_global":
        item.update(aviso_global(p))
    item["grupo"] = grupo_de(p, o, catid)
    con_ingles(item, "specs", al_ingles(item["specs"]))
    con_ingles(item, "grupo", al_ingles(item["grupo"]))
    if p.get("precio_usd_sin_stock"):
        item["sinStock"] = True
        item["notaSinStock"] = p.get("precio_usd_aviso", "Sin stock en EE.UU. · precio de lista")
        con_ingles(item, "notaSinStock", al_ingles(item["notaSinStock"]))
    if catid == "cpu":
        item.update(socket=o.get("socket"), tdp=o.get("tdp"))
    elif catid == "motherboard":
        item.update(socket=o.get("socket"), ramType=o.get("ram_tipo"), formFactor=o.get("formato"),
                    # avisos del 15-09-2026: conectores de CPU (EPS) y velocidad máxima de RAM
                    epsConnectors=o.get("eps_cpu"), ramMaxSpeed=o.get("ram_max_mts"))
    elif catid == "ram":
        item.update(ramType=o.get("ram_tipo"), capacity=f"{o.get('capacidad_gb', '?')} GB", modules=2,
                    ramSpeed=o.get("velocidad_mts"))
    elif catid == "gpu":
        item.update(length=o.get("longitud_mm"), powerDraw=o.get("tdp"),
                    recommendedPsu=o.get("fuente_recomendada_w"), chip=o.get("chip"),
                    verificarLongitud=bool(o.get("verificar_longitud")),
                    # cables (15-09-2026): "12V-2x6" o "8-pin" y cuántos; adapter8pin = cables de 8
                    # pines que pide el adaptador de la caja cuando la fuente no trae 12V-2x6
                    powerConnector=o.get("conector"), pcie8pinCount=o.get("conector_8pin"),
                    adapter8pin=o.get("adaptador_8pin"))
    elif catid == "storage":
        item.update(interface=o.get("interfaz"), type=o.get("interfaz"),
                    capacity=p["specs"].get("Capacidad"))
    elif catid == "psu":
        # la tarjeta lo rotula "Certif:": va la certificación 80 PLUS (antes salía "Hasta 90 %",
        # que es la eficiencia, no un certificado)
        # Corsair, be quiet!, FSP y MSI se certifican con Cybenetics (tan válido como 80 PLUS)
        certif = dato(p["specs"], r"^certificación$|80 plus certification")
        if certif and re.search(r"80 plus|cybenetics", certif, re.I):
            certif = re.sub(r"cybenetics", "Cybenetics", certif, flags=re.I)
        else:
            certif = None
        item.update(wattage=o.get("vatios"), efficiency=certif,
                    # reglas de montaje del 15-09-2026: largo frente al gabinete y cables de la gráfica
                    psuLength=o.get("largo_mm"), pcie8pin=o.get("cables_8pin"),
                    connector12v2x6=o.get("conectores_12v2x6"), epsConnectors=o.get("eps_cpu"))
    elif catid == "case":
        item.update(supports=o.get("formatos", []), maxGpuLength=o.get("gpu_max_mm"),
                    maxCoolerHeight=o.get("disipador_max_mm"), radiatorMax=o.get("radiador_max_mm"),
                    maxPsuLength=o.get("fuente_max_mm"),
                    pecera=True if o.get("pecera") else None, fanSlots=huecos(o))
    elif catid == "cooling":
        item.update(type=o.get("tipo"), socketSupport=o.get("sockets", []),
                    height=o.get("altura_mm"), radiatorSize=o.get("radiador_mm"),
                    tdpCapacity=o.get("tdp_max"))
    elif catid == "fans":
        v = p["ventilador"]
        item.update(fanSize=v["tamano_mm"], fanPack=v["pack"], fanThickness=v.get("grosor_mm"),
                    fanEcosystem=v["ecosistema"], reverse=True)
    # se quita cualquier campo en None: el código ya distingue "no lo sé" comprobando
    # si la clave existe (`"powerDraw" in item`), así que dejar la clave con null rompía
    # esa comprobación y mostraba "Consumo: W" vacío en vez de ocultar la línea entera.
    item = {k: v for k, v in item.items() if v is not None}
    categories[catid]["items"].append(item)
    item_por_idx[idx] = item["id"]

FILTER_OPTIONS = {
    "cpu": ["Todos", "AMD", "Intel"],
    "motherboard": ["Todos", "AM5", "LGA1851", "LGA1700", "ATX", "mATX"],
    "ram": ["Todos", "16 GB", "32 GB", "48 GB", "64 GB"],
    "gpu": ["Todos", "RTX", "RX", "Arc"],
    "storage": ["Todos", "NVMe", "SATA", "HDD"],
    "psu": ["Todos", "550W", "650W", "750W", "850W", "1000W", "1200W"],
    "case": ["Todos", "ATX", "E-ATX", "mATX"],
    "cooling": ["Todos", "Aire", "Líquida"],
    "fans": ["Todos", "120 mm", "140 mm"],
}
for cid, opts in FILTER_OPTIONS.items():
    categories[cid]["filterOptions"] = opts
item_by_id = {it["id"]: it for c in categories.values() for it in c["items"]}

# auto-verificación: cada filtro (salvo "Todos") debe encontrar al menos 1 producto,
# con la MISMA lógica de substring que usa configurador/page.tsx (brand/socket/specs/
# type/formFactor/capacity/tierRange) -- si no, es un filtro muerto como los que había antes.
def encuentra(item, tag):
    tag = tag.lower()
    for campo in ("brand", "socket", "specs", "type", "formFactor", "capacity", "tierRange"):
        v = item.get(campo)
        if v and tag in str(v).lower():
            return True
    return False

for cid, cdata in categories.items():
    for opt in cdata["filterOptions"]:
        if opt == "Todos":
            continue
        n = sum(encuentra(it, opt) for it in cdata["items"])
        if n == 0:
            print(f"  AVISO filtro muerto: {cid} / '{opt}' no encuentra ningún producto")

# --- tiers: builds verificadas de compatibilidad.json, + campos legacy para páginas que
# sólo leen name/tagline/priceMin/priceMax/target/components (home, breadcrumbs) ---
TAGLINES = {"entrada": ("Tu primer PC gamer serio", "1080p alto/ultra en la mayoría de juegos actuales."),
            "media": ("El punto dulce", "1440p alto/ultra con tasas altas de refresco."),
            "alta": ("1440p sin concesiones", "4K alto/ultra en muchos títulos, alta tasa de refresco."),
            "extrema": ("Sin límites", "4K agresivo con ray tracing y producción.")}
TAGLINES_EN = {"entrada": ("Entry", "Your first serious gaming PC", "1080p high/ultra in most current games."),
               "media": ("Mid", "The sweet spot", "1440p high/ultra at high refresh rates."),
               "alta": ("High", "1440p with no compromises", "4K high/ultra in many titles, high refresh rate."),
               "extrema": ("Extreme", "No limits", "Aggressive 4K with ray tracing and content creation.")}
ENFOQUE_EN = {
    "AMD con NVIDIA": "AMD with NVIDIA",
    "AMD con Radeon": "AMD with Radeon",
    "Intel con NVIDIA": "Intel with NVIDIA",
    "Intel con Radeon": "Intel with Radeon",
    "Intel tope de gama": "Top-of-the-line Intel",
    "Máximo FPS con X3D": "Maximum FPS with X3D",
    "X3D con Radeon": "X3D with Radeon",
    "X3D de 16 núcleos: juego y creación": "16-core X3D: gaming and creation",
    "IA local para empezar: 16 GB de VRAM (Radeon)": "Local AI to get started: 16 GB of VRAM (Radeon)",
    "IA local: 16 GB de VRAM y 64 GB de RAM": "Local AI: 16 GB of VRAM and 64 GB of RAM",
    "IA local: 16 GB rápidos (RTX 5070 Ti)": "Local AI: fast 16 GB (RTX 5070 Ti)",
    "Streaming: 8 núcleos y NVENC": "Streaming: 8 cores and NVENC",
    "Streaming: 12 núcleos y NVENC AV1": "Streaming: 12 cores and NVENC AV1",
    "Streaming: 16 núcleos y NVENC AV1": "Streaming: 16 cores and NVENC AV1",
    "Streaming: 20 núcleos, QuickSync y NVENC": "Streaming: 20 cores, QuickSync and NVENC",
    "Pecera: cristal panorámico y ventiladores reverse": "Fishbowl: panoramic glass and reverse fans",
    "Pecera blanca": "White fishbowl",
    "Pecera": "Fishbowl",
}
def nombre_build(cpu_item, gpu_item):
    """"Ryzen 7 9800X3D + RTX 5070 Ti": desde el 13-09 las builds de un nivel cambian de
    plataforma y de GPU, así que el nombre dice las dos (antes sólo el chip de la GPU)."""
    cpu = cpu_item["name"].replace("AMD ", "").replace("INTEL ", "")
    chip = (gpu_item.get("chip") or gpu_item["name"]).replace(" TI", " Ti")
    if chip in ("RX 9060 XT", "RTX 5060 Ti"):  # mismo chip con 8 o 16 GB: se dice cuál
        vram = re.search(r"\b(8|16)\s?G", gpu_item["name"])
        chip += f" {vram.group(1)} GB" if vram else ""
    return f"{cpu} + {chip}"


tiers = []
for tid in ("entrada", "media", "alta", "extrema"):
    builds_src = compat["combos_por_tramo"][tid]
    builds = []
    for b in builds_src:
        comps = {k: item_por_idx[i] for k, i in b["componentes"].items() if i in item_por_idx}
        label = nombre_build(item_by_id[comps["cpu"]], item_by_id[comps["gpu"]])
        # se recalcula sobre los precios YA redondeados de cada pieza exportada, para que sume
        # exactamente lo mismo que el desglose muestra (si no, la build decía "$1069" pero sumar
        # sus 8 piezas de a un dólar daba "$1070" -- un desajuste tonto pero visible)
        total = sum(item_by_id[iid]["price"] for iid in comps.values())
        # uso (15-09-2026): gaming, streaming o ia. Las de gaming conservan su id de siempre (enlaces
        # ya compartidos); las otras lo llevan en el id, porque pueden repetir CPU + GPU con una de gaming
        uso = b.get("uso", "gaming")
        estilo = b.get("estilo", "estandar")
        bid = f"{tid}-{slugify(label)}" if uso == "gaming" else f"{tid}-{uso}-{slugify(label)}"
        if estilo != "estandar":  # "media-pecera-blanca-ryzen-7-7700x-rx-9070", "alta-pecera-ia-..."
            bid = f"{tid}-{estilo}-{slugify(label)}" if uso == "gaming" else f"{tid}-{estilo}-{uso}-{slugify(label)}"
        enfoque = b.get("enfoque")
        # peceras de streaming e IA: "Pecera blanca · Streaming: ..." = prefijo + enfoque ya traducido
        m = re.match(r"^(Pecera blanca|Pecera) · (.+)$", enfoque or "")
        if m and m.group(2) in ENFOQUE_EN:
            ENFOQUE_EN[enfoque] = f"{ENFOQUE_EN[m.group(1)] if m.group(1) in ENFOQUE_EN else 'Fishbowl'} · {ENFOQUE_EN[m.group(2)]}"
        if enfoque and enfoque not in ENFOQUE_EN:
            print(f"  AVISO enfoque sin traducir al inglés (añadir a ENFOQUE_EN): {enfoque!r}")
        builds.append({"id": bid, "uso": uso, "estilo": estilo, "label": label, "enfoque": enfoque,
                       "enfoqueEn": ENFOQUE_EN.get(enfoque, enfoque),
                       "components": comps, "priceUSD": total, "fueraDeGama": b.get("fuera_de_gama", {})})
    builds.sort(key=lambda b: b["priceUSD"])
    # los campos legacy (portada, presets del configurador) son de gaming: streaming e IA van aparte
    gaming = [b for b in builds if b["uso"] == "gaming" and b["estilo"] == "estandar"]
    tagline, target = TAGLINES[tid]
    nombre_en, tagline_en, target_en = TAGLINES_EN[tid]
    tiers.append({
        "id": tid, "name": tid.capitalize(), "tagline": tagline, "target": target,
        "nameEn": nombre_en, "taglineEn": tagline_en, "targetEn": target_en,
        "priceMin": gaming[0]["priceUSD"] if gaming else None,
        "priceMax": gaming[-1]["priceUSD"] if gaming else None,
        "components": gaming[0]["components"] if gaming else {},  # legacy: la de gaming más barata
        "builds": builds,
    })

# La web se dirige a EE.UU. (15-09-2026): dólar y nada más. Antes salía aquí un
# "tipoCambioReferencial" con el que las dos páginas pintaban una línea "≈ S/ ... referencial"
# bajo el total; se retiró junto con los precios peruanos.
# Fechas de revisión de los precios (15-09-2026, decisión del usuario): la web avisa de que los
# precios son referencias "vistas en los últimos 15 días" mientras preciosDesde tenga 15 días o
# menos, y si no, da este rango de fechas (componente AvisoPrecios).
fechas = sorted(str(p["precio_usd_fecha"])[:10] for p in incluidos + globales_inc if p.get("precio_usd_fecha"))
data = {"updated": "2026-09-18", "currency": "USD",
        "preciosDesde": fechas[0], "preciosHasta": fechas[-1],
        "categories": list(categories.values()), "tiers": tiers}
os.makedirs(EXPORT, exist_ok=True)
json.dump(data, open(os.path.join(EXPORT, "components.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"\n{sum(len(c['items']) for c in categories.values())} items en {len(categories)} categorías")
print(f"{sum(len(t['builds']) for t in tiers)} builds en {len(tiers)} tiers")
print(f"Escrito: {os.path.join(EXPORT, 'components.json')}")
print(f"Imágenes: {os.path.join(IMG_OUT)} ({len(IMAGENES_ESCRITAS)} archivos para "
      f"{sum(len(c['items']) for c in categories.values())} productos: los hermanos comparten foto)")
# Lo que quede en export/images de exportaciones anteriores ya no lo usa nadie: no se borra aquí;
# se avisa, para moverlo a JORGE y no copiarlo a public/ por error.
sobrantes = sorted(set(os.listdir(IMG_OUT)) - IMAGENES_ESCRITAS)
if sobrantes:
    print(f"AVISO: {len(sobrantes)} imágenes de exportaciones anteriores en export/images que ya no "
          f"se usan (no copiarlas a public/): {sobrantes[:5]}{' ...' if len(sobrantes) > 5 else ''}")
