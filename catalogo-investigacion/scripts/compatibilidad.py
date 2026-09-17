"""Matriz de compatibilidad de los productos disponibles en América (2026-09-13).

Sólo lectura: no toca catalogo-final.json ni la web. Genera
catalogo/compatibilidad.json con:
  - "productos": cada producto local/importacion_us con sus campos normalizados
    de compatibilidad (socket, tipo de RAM, formato, longitud de GPU, vatios...)
  - "reglas": qué compara con qué y por qué (para dejarlo por escrito)
  - "combos_por_tramo": 5 builds completas (CPU+placa+RAM+GPU+fuente+gabinete+disipador+
    almacenamiento) 100% compatibles por nivel, para los presupuestos: 3 de gaming, 1 de streaming
    y 1 de IA local (campo "uso", desde el 15-09-2026). No es fuerza bruta: cruzar
    los 215 productos da miles de millones de combinaciones (probado, tardaba minutos). En su
    lugar, PERFILES: cada nivel es una clase de GPU por chip y cada build un enfoque distinto
    (AMD/Intel, NVIDIA/Radeon, X3D, creación), armada con armar() -- ver el comentario de PERFILES.
  - Estos mismos pares (socket, tipo de RAM, longitud vs. gabinete...) son los que debe
    usar el configurador para filtrar EN VIVO, como ya hace `checkItemCompatibility` en
    configurador/page.tsx -- no hace falta guardar todas las combinaciones posibles.

Alcance: los combos (presupuestos) usan SÓLO `disponibilidad` local o importacion_us.
Los 12 con `precio_usd_sin_stock` entran a la matriz pero nunca como opción por
defecto en un combo (se marcan `sin_stock` y se excluyen de generar_combos).
Desde el 13-09 los 59 importacion_global (europeos/asiáticos) también se normalizan, en
"productos_globales": el usuario los quiere en el configurador, marcados en naranja como "no
disponibles en América", pero NUNCA en un presupuesto -- así que no entran en ningún combo.

Corrección 13-09 (largo y consumo de GPU):
  - El largo se tomaba a veces del "Largo del paquete" (la caja): 90 mm la MSI RTX 5080, 488 mm
    las RX 9070 de Gigabyte. Ahora sólo vale "Longitud"/"Largo de tarjeta", y si la ficha no la
    trae, "Board Size"/"Product Size"/"Dimension(s)" (Palit, Gainward, ASRock, Sparkle), cuyo
    primer número es el largo.
  - Regla por chip: si una GPU no trae consumo o fuente recomendada, se toma la mediana de las
    otras fichas del catálogo con el mismo chip (queda marcado en *_origen). Sin esto el
    configurador suponía 150 W y daba por buena una RTX 5080 con una fuente de 550 W.

Compatibilidad que se aplica:
  CPU <-> Placa       mismo socket
  Placa <-> RAM       mismo tipo de memoria (DDR4/DDR5) -- HOY: 0 placas DDR4 en catálogo,
                       así que los 4 kits DDR4 no tienen ninguna placa compatible (se avisa)
  GPU <-> Gabinete     longitud de GPU <= GPU máx. del gabinete
  GPU <-> Fuente       vatios de la fuente >= fuente recomendada por el fabricante de la GPU
                       (si no la da, se estima: TDP x 1.6 + 150, redondeado a 50 W, marcado "estimado")
  Disipador <-> CPU    todos los disipadores del catálogo soportan AM5/AM4/LGA1851/LGA1700 (verificado
                       specs), así que el socket nunca descarta un disipador hoy; si el disipador trae
                       "TDP máx." se compara con el TDP de la CPU
  Disipador(aire) <-> Gabinete   altura del disipador <= disipador CPU máx. del gabinete
  Disipador(líquido) <-> Gabinete  tamaño de radiador (240/280/360/420, del nombre del modelo) <=
                       el mayor radiador que admite el gabinete (de "Radiadores compatibles")
  Placa <-> Gabinete   formato de la placa (ATX/Micro ATX/E-ATX) dentro de lo que admite el gabinete
  Fuente <-> Gabinete  (15-09-2026) largo de la fuente ("Profundidad") <= "Longitud máx. de fuente"
  GPU <-> Fuente       (15-09-2026) cables: una gráfica de N cables de 8 pines necesita una fuente con
                       al menos N; una de 12V-2x6 (16 pines) va directa si la fuente trae ese conector y,
                       si no, con el adaptador de su caja, que pide 2 (RTX 5070), 3 (5070 Ti, 5080) o 4
                       (5090) cables de 8 pines. Faltan cables -> incompatible; adaptador -> aviso, y las
                       builds prefieren una fuente con 12V-2x6 nativo.
  Avisos (15-09-2026, no descartan nada: la pieza se monta y funciona)
  Fuente <-> Placa     la placa trae 2 conectores de 8 pines para la CPU (EPS) y la fuente 1: el 2.º
                       queda libre (sólo hace falta para overclock o CPU de mucho consumo)
  RAM <-> Placa        kit más rápido que la velocidad máxima de la placa: va a la de la placa
  Como cualquier aviso le quita a una build el "100% Garantizada" del configurador, las builds
  eligen fuente sin aviso de EPS (si la hay) y no eligen una RAM que la placa frene.

python compatibilidad.py
"""
import collections, json, math, os, re, sys

sys.stdout.reconfigure(encoding="utf-8")
BASE = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo"
CAT = os.path.join(BASE, "catalogo-final.json")
OUT = os.path.join(BASE, "compatibilidad.json")

cat = json.load(open(CAT, encoding="utf-8"))
america = [p for p in cat if p["disponibilidad"] in ("local", "importacion_us")]
globales = [p for p in cat if p["disponibilidad"] == "importacion_global"]
print(f"{len(america)} productos disponibles en América (de {len(cat)}); "
      f"{len(globales)} europeos/asiáticos se normalizan aparte (configurador sí, presupuestos no).")


def num(s):
    m = re.search(r"[\d.,]+", str(s or ""))
    return float(m.group().replace(",", "")) if m else None


def especie(specs, *claves):
    for k, v in specs.items():
        if any(re.search(c, k, re.I) for c in claves):
            return v
    return None


def especie_sin(specs, clave, excluir):
    """Como especie(), pero salta las claves que casan con `excluir` (p. ej. "Largo del paquete")."""
    for k, v in specs.items():
        if re.search(clave, k, re.I) and not re.search(excluir, k, re.I):
            return v
    return None


SOCKET_POR_CHIPSET = {  # el chipset es más fiable que "Familia del chipset" (hay un error en la
    "B650": "AM5", "B850": "AM5", "X870": "AM5", "X870E": "AM5",           # MSI B860M Mortar, ver abajo)
    "B860": "LGA1851", "Z890": "LGA1851",
    "Z790": "LGA1700", "B760": "LGA1700",
}


def socket_placa(p):
    chip = (especie(p["specs"], "chipset") or "").upper()
    for pat, sk in SOCKET_POR_CHIPSET.items():
        if pat in chip:
            return sk
    txt = (especie(p["specs"], "socket de procesador", "socket$") or "")
    if "AM5" in txt.upper():
        return "AM5"
    if "1851" in txt:
        return "LGA1851"
    if "1700" in txt:
        return "LGA1700"
    return None


def socket_cpu(p):
    s = (especie(p["specs"], "socket") or "").upper()
    if "AM5" in s:
        return "AM5"
    if "AM4" in s:
        return "AM4"
    if "1851" in s:
        return "LGA1851"
    if "1700" in s:
        return "LGA1700"
    return None


def formato_placa(p):
    f = (especie(p["specs"], "factor de forma|^formato") or "").upper()
    if "MICRO" in f or "MATX" in f:
        return "mATX"
    if "EATX" in f or "E-ATX" in f:
        return "EATX"
    if "ATX" in f:
        return "ATX"
    return None


FORMATOS_QUE_ADMITE = {"EATX": ["EATX", "ATX", "mATX"], "ATX": ["ATX", "mATX"], "mATX": ["mATX"]}


def formatos_gabinete(p):
    txt = (especie(p["specs"], "^placa base$") or "").upper()
    out = set()
    if "E-ATX" in txt or "EATX" in txt:
        out |= {"EATX", "ATX", "mATX"}
    if "ATX" in txt and "MICRO" not in txt:
        out |= {"ATX", "mATX"}
    if "MICRO" in txt or "MATX" in txt:
        out.add("mATX")
    return out or {"ATX", "mATX"}   # si no dice nada, se asume ATX estándar


CHIP_GPU = re.compile(r"(RTX\s?\d{4}\s?Ti|RTX\s?\d{4}|RX\s?\d{4}\s?XT|RX\s?\d{4}|Arc\s?B\d{3})", re.I)


def mm(s):
    """'máx. 160 mm' -> 160. (num() no sirve aquí: tomaría el punto de 'máx.')"""
    m = re.search(r"(\d+)\s*mm", str(s or ""))
    return int(m.group(1)) if m else None


def largo_fuente(p):
    """Profundidad de la fuente, la medida que choca con el hueco del gabinete. Casi todas las
    fichas dicen 'Ancho: 150 mm x Alto: 86 mm x Profundidad: 140 mm'; las de XPG, '160 mm x 150 mm
    x 86 mm' (ahí el largo es el mayor)."""
    d = str(especie(p["specs"], "^dimensiones$") or "")
    m = re.search(r"Profundidad:\s*(\d+)", d)
    if m:
        return int(m.group(1))
    nums = [int(x) for x in re.findall(r"(\d+)\s*mm", d)]
    return max(nums) if nums else None


def cables_fuente(p):
    """(cables de 8 pines para la gráfica, conectores 12V-2x6 nativos). None = la ficha no lo dice.
    Fuente de los datos: 'Conectores' (geizhals: '3x 6+2-Pin-gráfica, 1x 12+4 Pin (12V-2x6)'), los
    campos de Icecat de XPG y 'Conector 12V-2x6 / 12VHPWR'. Un conector nombrado sin cantidad
    (FSP Hydro G Pro: '12+4 Pin, 6+2-Pin-gráfica') no da número: sin dato."""
    s = p["specs"]
    c = str(s.get("Conectores") or "")
    ocho = doce = None
    if re.search(r"\d+x ", c):
        ocho = sum(int(n) for n in re.findall(r"(\d+)x (?:6\+2|8)-Pin-gráfica", c))
        doce = sum(int(n) for n in re.findall(r"(\d+)x 12\+4 Pin", c))
        if re.search(r"(^|, )(6\+2|8)-Pin-gráfica", c):
            ocho = None
        if re.search(r"(^|, )12\+4 Pin", c):
            doce = max(doce, 1)
    x = s.get("Ports & interfaces · PCI Express power connectors (6+2 pin)")
    if x:
        ocho = int(x)
    if s.get("Ports & interfaces · ATX power connector (12+4 pin)") == "Yes" or s.get("Conector 12V-2x6 / 12VHPWR") == "Sí":
        doce = max(doce or 0, 1)
    return ocho, doce


def eps_fuente(p):
    """Conectores de 8 pines para la CPU (EPS) que trae la fuente: '2x 4+4-Pin-12V' + '1x 8-Pin-12V';
    '2x 4-Pin-12V' (MSI A650GL) cuenta como uno. None si la ficha no da el número (XPG dice 'Yes')."""
    c = str(p["specs"].get("Conectores") or "")
    if not re.search(r"\d+x ", c):
        return None
    n = sum(int(x) for x in re.findall(r"(\d+)x 4\+4-Pin-12V", c)) + \
        sum(int(x) for x in re.findall(r"(\d+)x 8-Pin-12V", c))
    if not n:
        m = re.search(r"(\d+)x 4-Pin-12V", c)
        n = max(int(m.group(1)) // 2, 1) if m else 0
    return n or None


def eps_placa(p):
    """Conectores de 8 pines para la CPU que trae la placa (Icecat de Gigabyte/ASUS o texto de ASRock)."""
    s = p["specs"]
    if s.get("Number of EPS power connectors (8-pin)"):
        return int(num(s["Number of EPS power connectors (8-pin)"]))
    m = re.search(r"(\d+) x 8 pin 12V Power Connector", " ".join(str(v) for v in s.values()))
    return int(m.group(1)) if m else None


def ram_max_placa(p):
    """Velocidad máxima de RAM que admite la placa (MT/s), de la ficha."""
    s = p["specs"]
    if s.get("Supported memory clock speed (max)"):
        return int(num(s["Supported memory clock speed (max)"]))
    v = s.get("Velocidades de reloj de memoria soportadas")
    if v:
        return max(int(x) for x in re.findall(r"\d{4}", str(v)))
    m = re.search(r"up to (\d{4})", str(s.get("Memoria") or ""))
    return int(m.group(1)) if m else None


def conector_gpu(p):
    """('12V-2x6', None) o ('8-pin', n); None si la ficha no lo dice. También devuelve cuántos cables de
    8 pines pide el adaptador que trae la caja, si la ficha lo dice ('One 16-pin to Three 8-pin')."""
    txt = " ".join(str(v) for k, v in p["specs"].items()
                   if re.search(r"conector|power (input|connector)|entrada de energ|supplementary", k, re.I))
    if re.search(r"16-pin|12v-2x6|12vhpwr", txt, re.I):
        m = re.search(r"to (One|Two|Three|Four) 8-pin", txt, re.I)
        adapt = {"one": 1, "two": 2, "three": 3, "four": 4}[m.group(1).lower()] if m else None
        return "12V-2x6", None, adapt
    m = re.search(r"(\d+)\s*x\s*8-pin|8-pin(?:es)?\s*x\s*(\d+)", txt, re.I)
    if m:
        return "8-pin", int(next(g for g in m.groups() if g)), None
    return None, None, None


# Huecos de ventilador del gabinete (estilo pecera, 16-09-2026). Los ventiladores reverse van donde
# se ven a través del cristal: ABAJO y en el LATERAL. Se leen de "Notas" (Icecat: "Inferior: 3 x 120
# mm-ventilador(es) opcional(es), o 3 x 140 mm...") y de las fichas de Phanteks ("Ventiladores
# inferiores (120 | 140 mm) : 3x | 3x"). "incluidos" = ya trae ventiladores ahí (no hace falta comprar).
# Lo que va debajo de la cubierta de la fuente no se ve: no cuenta.
POSICION = re.compile(r"(Inferior(?: \((?:sobre|bajo)[^)]*\))?|Lateral(?: derecho| izquierdo)?|Superior|Trasera|"
                      r"Cubierta de la fuente|Frontal(?: derecha)?)\s*:", re.I)


def posiciones_ventilador(p):
    s = p["specs"]
    out = {}
    for clave, pos in (("inferiores", "inferior"), ("laterales", "lateral")):
        v = next((v for k, v in s.items() if k.lower().startswith(f"ventiladores {clave} (120 | 140 mm)")), None)
        if v:
            n = [int(x.strip()) if x.strip().isdigit() else 0 for x in re.sub(r"x", "", str(v)).split("|")]
            n += [0] * (2 - len(n))
            if n[0] or n[1]:
                out[pos] = {"120": n[0], "140": n[1], "incluidos": False}
    notas = str(s.get("Notas") or "")
    marcas = list(POSICION.finditer(notas))
    for i, m in enumerate(marcas):
        nombre = m.group(1).lower()
        if "bajo" in nombre or "cubierta" in nombre:
            continue
        pos = "inferior" if nombre.startswith("inferior") else "lateral" if nombre.startswith("lateral") else None
        if not pos or pos in out:
            continue
        tramo = notas[m.end(): marcas[i + 1].start() if i + 1 < len(marcas) else len(notas)]
        cuenta = {"120": 0, "140": 0}
        for n, tam in re.findall(r"(\d+)\s*x\s*(?:[A-Za-z!.\- ]*?)(120|140)[\s-]*mm", tramo):
            cuenta[tam] = max(cuenta[tam], int(n))
        if cuenta["120"] or cuenta["140"]:
            grosor = re.search(r"\((\d+) mm de grosor\)", tramo)
            out[pos] = dict(cuenta, incluidos=bool(re.search(r"incluido|preinstalado", tramo, re.I)),
                            **({"grosor_max_mm": int(grosor.group(1))} if grosor else {}))
    return out


def procesar_producto(p):
    cat_ = p["categoria"]
    o = {"idx": cat.index(p), "marca": p["marca"], "modelo": p["modelo"], "mpn": p["mpn"],
         "categoria": cat_, "gama": p["gama"], "precio_usd": p.get("precio_usd"),
         "sin_stock": bool(p.get("precio_usd_sin_stock")),
         "imagen": p["imagen_principal"], "slug": p["slug"], "color": p.get("color")}
    if cat_ == "Procesadores":
        o["socket"] = socket_cpu(p)
        o["tdp"] = num(especie(p["specs"], "^tdp$|potencia de diseño"))
    elif cat_ == "Placas base":
        o["socket"] = socket_placa(p)
        o["ram_tipo"] = "DDR4" if "DDR4" in (especie(p["specs"], "tipo.*memoria") or "") else "DDR5"
        o["formato"] = formato_placa(p)
        o["eps_cpu"] = eps_placa(p)          # avisos del 15-09-2026 (no descartan, sólo avisan)
        o["ram_max_mts"] = ram_max_placa(p)
    elif cat_ == "Módulos de memoria":
        o["ram_tipo"] = "DDR4" if "DDR4" in p["modelo"].upper() else "DDR5"
        m = re.search(r"(\d+)\s?GB", p["modelo"])
        o["capacidad_gb"] = int(m.group(1)) if m else None
        v = re.search(r"DDR\d-(\d{4})", p["modelo"])
        o["velocidad_mts"] = int(v.group(1)) if v else None
    elif cat_ == "Tarjetas gráficas":
        m = CHIP_GPU.search(p["modelo"])
        o["chip"] = re.sub(r"\s+", " ", m.group(1).upper()) if m else None
        lon = especie_sin(p["specs"], "longitud|largo de tarjeta", "paquete|máx")
        if lon is None:
            lon = especie_sin(p["specs"], r"board size|product size|^dimensions?$", "paquete")
        o["longitud_mm"] = num(lon)
        o["verificar_longitud"] = o["longitud_mm"] is None
        o["tdp"] = num(especie(p["specs"], "^tdp$|potencia de diseño|consumo|graphics card power|board power|tbp"))
        o["tdp_origen"] = "ficha" if o["tdp"] else None
        # la fuente recomendada se completa después (completar_gpus): primero la ficha, luego las
        # otras fichas del mismo chip, y sólo al final una estimación a partir del consumo
        o["fuente_recomendada_w"] = num(especie(p["specs"], "recommended psu|recommended system power|fuente.*recomend"))
        o["fuente_recomendada_origen"] = "ficha" if o["fuente_recomendada_w"] else None
        # cables de alimentación (15-09-2026): el adaptador de 16 pines que falte se completa por
        # chip en completar_gpus, con lo que dicen las otras fichas del mismo chip (las de PNY)
        o["conector"], o["conector_8pin"], o["adaptador_8pin"] = conector_gpu(p)
    elif cat_ == "Almacenamiento":
        o["interfaz"] = "NVMe" if re.search("nvme|pcie", especie(p["specs"], "interfaz") or "", re.I) else "SATA"
        # disco mecánico (Seagate BarraCuda, WD Blue 2TB): nunca como único disco de una build
        o["hdd"] = ("disco duro" in str(especie(p["specs"], "^tipo$") or "").lower()
                    or especie(p["specs"], "velocidad de giro|disk speed") is not None)
    elif cat_ == "Fuentes de poder":
        o["vatios"] = num(especie(p["specs"], "^potencia$"))
        o["largo_mm"] = largo_fuente(p)
        o["cables_8pin"], o["conectores_12v2x6"] = cables_fuente(p)
        o["eps_cpu"] = eps_fuente(p)
    elif cat_ == "Gabinetes":
        o["gpu_max_mm"] = num(especie(p["specs"], "gpu máx"))
        o["fuente_max_mm"] = mm(especie(p["specs"], "longitud máx. de fuente"))
        o["disipador_max_mm"] = num(especie(p["specs"], "disipador cpu máx"))
        o["formatos"] = sorted(formatos_gabinete(p))
        rad = especie(p["specs"], "radiadores compatibles|^radiadores$") or ""
        tam = [int(x) for x in re.findall(r"\b(120|140|240|280|360|420|480)\b", rad)]
        o["radiador_max_mm"] = max(tam) if tam else None
        o["pecera"] = bool(p.get("estilo_pecera"))
        o["posiciones_ventilador"] = posiciones_ventilador(p)
    elif cat_ == "Refrigeración":
        o["tipo"] = p.get("tipo")
        o["altura_mm"] = num(especie(p["specs"], "^altura$")) if p.get("tipo") == "aire" else None
        if p.get("tipo") == "liquida":
            m = re.search(r"(240|280|360|420)", p["modelo"])
            o["radiador_mm"] = int(m.group(1)) if m else 240
        o["tdp_max"] = num(especie(p["specs"], "tdp máx"))
        sk = str(especie(p["specs"], "sockets compatibles|compatible con") or "")
        leidos = [s for s, pat in (("AM5", "AM5"), ("AM4", "AM4"), ("LGA1851", "1851"), ("LGA1700", "1700")) if pat in sk]
        # LGA1851 conserva el anclaje de LGA1700 (mismos agujeros): fichas anteriores a Arrow Lake
        # sólo dicen 1700 (Hyper 212 Black, ROG Strix LC III). Se añade y se deja marcado.
        o["sockets_inferidos"] = ["LGA1851"] if "LGA1700" in leidos and "LGA1851" not in leidos else []
        # si la ficha no dice nada se asumen los 4 (todas las revisadas hasta hoy los traen)
        o["sockets"] = (leidos + o["sockets_inferidos"]) or ["AM5", "AM4", "LGA1851", "LGA1700"]
        o["sockets_de_ficha"] = bool(leidos)
    elif cat_ == "Ventiladores":  # packs de ventiladores reverse (16-09-2026)
        o.update(p["ventilador"])
    return o


def completar_gpus(gpus):
    """Regla por chip: consumo y fuente recomendada que falten salen de las otras fichas del
    catálogo con el mismo chip (mediana). Si ni así, la fuente se estima del consumo."""
    tdps, fuentes, adaptadores = {}, {}, {}
    for g in gpus:
        if g["chip"] and g["tdp_origen"] == "ficha":
            tdps.setdefault(g["chip"], []).append(g["tdp"])
        if g["chip"] and g["fuente_recomendada_origen"] == "ficha":
            fuentes.setdefault(g["chip"], []).append(g["fuente_recomendada_w"])
        if g["chip"] and g["adaptador_8pin"]:
            adaptadores.setdefault(g["chip"], []).append(g["adaptador_8pin"])
    mediana = lambda v: sorted(v)[len(v) // 2]
    for g in gpus:
        # el adaptador de 16 pines a 8 pines lo fija NVIDIA por chip (RTX 5070: 2, 5070 Ti y 5080:
        # 3, 5090: 4); sólo lo escriben las fichas de PNY, así que se hereda por chip
        if g["conector"] == "12V-2x6" and g["adaptador_8pin"] is None and g["chip"] in adaptadores:
            g["adaptador_8pin"] = max(adaptadores[g["chip"]])
        if g["tdp"] is None and g["chip"] in tdps:
            g["tdp"], g["tdp_origen"] = mediana(tdps[g["chip"]]), f"por chip ({len(tdps[g['chip']])} fichas)"
        if g["fuente_recomendada_w"] is None:
            if g["chip"] in fuentes:
                g["fuente_recomendada_w"] = mediana(fuentes[g["chip"]])
                g["fuente_recomendada_origen"] = f"por chip ({len(fuentes[g['chip']])} fichas)"
            elif g["tdp"]:
                g["fuente_recomendada_w"] = round((g["tdp"] * 1.6 + 150) / 50) * 50
                g["fuente_recomendada_origen"] = "estimada del consumo"
        g["fuente_recomendada_estimada"] = g["fuente_recomendada_origen"] not in (None, "ficha")


productos = {p["categoria"]: [] for p in america}
for p in america:
    productos[p["categoria"]].append(procesar_producto(p))
productos_globales = {p["categoria"]: [] for p in globales}
for p in globales:
    productos_globales[p["categoria"]].append(procesar_producto(p))
# la regla por chip usa las fichas de ambos grupos (una Palit europea también dice cuánto
# consume una RTX 5080), pero cada producto sigue en su grupo
completar_gpus(productos["Tarjetas gráficas"] + productos_globales.get("Tarjetas gráficas", []))

# --- avisos de calidad de datos ---
avisos = []
sin_socket_mb = [p["modelo"] for p in productos["Placas base"] if not p["socket"]]
if sin_socket_mb:
    avisos.append(f"Placas sin socket detectado: {sin_socket_mb}")
sin_chip_gpu = [p["modelo"] for p in productos["Tarjetas gráficas"] if not p["chip"]]
if sin_chip_gpu:
    avisos.append(f"GPUs sin chip detectado (no entran en combos): {sin_chip_gpu}")
sin_long_gpu = [p["modelo"] for p in productos["Tarjetas gráficas"] + productos_globales.get("Tarjetas gráficas", [])
                if p["verificar_longitud"]]
if sin_long_gpu:
    avisos.append(f"GPUs sin longitud verificada (se asumen compatibles, revisar a mano): {sin_long_gpu}")
ddr4_mb = [p["modelo"] for grupo in (productos, productos_globales)
           for p in grupo.get("Placas base", []) if p["ram_tipo"] == "DDR4"]
ddr4_ram = [p["modelo"] for grupo in (productos, productos_globales)
            for p in grupo.get("Módulos de memoria", []) if p["ram_tipo"] == "DDR4"]
if ddr4_ram and not ddr4_mb:
    avisos.append(f"{len(ddr4_ram)} kits DDR4 sin NINGUNA placa DDR4 en todo el catálogo (americano ni global): "
                  f"{ddr4_ram} (fuera del configurador hasta conseguir una placa DDR4)")
gpus_todas = productos["Tarjetas gráficas"] + productos_globales.get("Tarjetas gráficas", [])
por_chip = [p["modelo"] for p in gpus_todas if str(p.get("tdp_origen") or "").startswith("por chip")
            or str(p.get("fuente_recomendada_origen") or "").startswith("por chip")]
if por_chip:
    avisos.append(f"GPUs con consumo o fuente tomados de otras fichas del mismo chip: {por_chip}")
cool_sin_socket = [p["modelo"] for grupo in (productos, productos_globales)
                   for p in grupo.get("Refrigeración", []) if not p["sockets_de_ficha"]]
if cool_sin_socket:
    avisos.append(f"Refrigeración sin sockets en la ficha (se asumen AM5/AM4/LGA1851/LGA1700): {cool_sin_socket}")
am4_cpu = [p["modelo"] for p in productos["Procesadores"] if p["socket"] == "AM4"]
am4_mb = [p["modelo"] for p in productos["Placas base"] if p["socket"] == "AM4"]
if am4_cpu and not am4_mb:
    avisos.append(f"{len(am4_cpu)} CPU AM4 sin NINGUNA placa AM4 en el catálogo americano: {am4_cpu} "
                  f"(quedan fuera de los combos)")
todos = lambda categoria: productos.get(categoria, []) + productos_globales.get(categoria, [])
sin_largo_psu = [p["modelo"] for p in todos("Fuentes de poder") if p["largo_mm"] is None]
sin_cables_psu = [p["modelo"] for p in todos("Fuentes de poder") if p["cables_8pin"] is None]
sin_hueco_psu = [p["modelo"] for p in todos("Gabinetes") if p["fuente_max_mm"] is None]
sin_conector_gpu = [p["modelo"] for p in todos("Tarjetas gráficas") if p["conector"] is None]
sin_adaptador = [p["modelo"] for p in todos("Tarjetas gráficas") if p["conector"] == "12V-2x6" and not p["adaptador_8pin"]]
for texto, lista in (("Fuentes sin largo (la regla fuente/gabinete no las juzga)", sin_largo_psu),
                     ("Fuentes sin número de cables de 8 pines (la regla de cables no las juzga)", sin_cables_psu),
                     ("Gabinetes sin largo máximo de fuente", sin_hueco_psu),
                     ("GPUs sin conector de alimentación en la ficha", sin_conector_gpu),
                     ("GPUs de 16 pines sin dato de adaptador (con fuentes sin 12V-2x6 no se juzgan)", sin_adaptador)):
    if lista:
        avisos.append(f"{texto}: {lista}")
for a in avisos:
    print("AVISO:", a)


# --- generación de combos 100% compatibles ---
def compatible_cpu_mb(cpu, mb):
    return cpu["socket"] and cpu["socket"] == mb["socket"]


def compatible_mb_ram(mb, ram):
    return mb["ram_tipo"] == ram["ram_tipo"]


def compatible_mb_case(mb, case):
    return mb["formato"] in case["formatos"] if mb["formato"] else True


def compatible_gpu_case(gpu, case):
    return gpu["longitud_mm"] is None or case["gpu_max_mm"] is None or gpu["longitud_mm"] <= case["gpu_max_mm"]


def compatible_gpu_psu(gpu, psu):
    return gpu["fuente_recomendada_w"] is None or psu["vatios"] >= gpu["fuente_recomendada_w"]


def compatible_psu_case(psu, case):
    """Largo de la fuente <= el hueco que deja el gabinete (15-09-2026). Sin dato, no se juzga."""
    return psu["largo_mm"] is None or case["fuente_max_mm"] is None or psu["largo_mm"] <= case["fuente_max_mm"]


def cables_gpu_psu(gpu, psu):
    """'ok', 'adaptador' (la fuente no trae 12V-2x6 y la gráfica usa el adaptador de su caja) o
    'faltan' (no hay cables de 8 pines suficientes). None si alguna ficha no lo dice: no se juzga.
    Es la misma lógica que `cablesGpuFuente` en configurador/page.tsx."""
    ocho = psu["cables_8pin"]
    if gpu["conector"] == "8-pin":
        if ocho is None or not gpu["conector_8pin"]:
            return None
        return "ok" if ocho >= gpu["conector_8pin"] else "faltan"
    if gpu["conector"] == "12V-2x6":
        if psu["conectores_12v2x6"] is None:
            return None
        if psu["conectores_12v2x6"] >= 1:
            return "ok"
        if ocho is None or not gpu["adaptador_8pin"]:
            return None
        return "adaptador" if ocho >= gpu["adaptador_8pin"] else "faltan"
    return None


def aviso_eps(psu, mb):
    """La placa trae más conectores de CPU que la fuente (el 2.º suele ser opcional): aviso."""
    return bool(psu["eps_cpu"] and mb["eps_cpu"] and psu["eps_cpu"] < mb["eps_cpu"])


def aviso_ram_lenta(ram, mb):
    """El kit es más rápido que lo que admite la placa: funciona, a la velocidad de la placa."""
    return bool(ram.get("velocidad_mts") and mb["ram_max_mts"] and ram["velocidad_mts"] > mb["ram_max_mts"])


def compatible_cool_cpu(cool, cpu):
    # el socket también: antes todos los disipadores traían los 4 sockets a mano y no hacía falta;
    # desde que salen de la ficha, el V8 ACE 3DHP (sólo AMD) no puede acabar en una build Intel
    if cpu["socket"] not in cool["sockets"]:
        return False
    return cool["tdp_max"] is None or cpu["tdp"] is None or cool["tdp_max"] >= cpu["tdp"]


def huecos_visibles(case, tam):
    """Posiciones de abajo y del lateral que admiten ventiladores de `tam` mm, con cuántos caben y si
    ya vienen puestos. Vacío = el gabinete no los admite ahí (o la ficha no lo dice)."""
    return {pos: d for pos, d in (case.get("posiciones_ventilador") or {}).items() if d.get(str(tam))}


def compatible_fan_case(fan, case):
    """El pack cabe si el gabinete tiene hueco de su tamaño abajo o al lateral (y, si la ficha da un
    grosor máximo, no lo pasa). Sin datos de posiciones no se juzga. Misma regla que el configurador."""
    if not case.get("posiciones_ventilador"):
        return True
    huecos = huecos_visibles(case, fan["tamano_mm"])
    return any(not (fan.get("grosor_mm") and d.get("grosor_max_mm") and fan["grosor_mm"] > d["grosor_max_mm"])
               for d in huecos.values())


def compatible_cool_case(cool, case):
    if cool["tipo"] == "aire":
        return cool["altura_mm"] is None or case["disipador_max_mm"] is None or cool["altura_mm"] <= case["disipador_max_mm"]
    return case["radiador_max_mm"] is None or cool["radiador_mm"] <= case["radiador_max_mm"]


usables = {k: [p for p in v if not p["sin_stock"]] for k, v in productos.items()}

# Cruzar los 215 productos entero (CPU x placa x RAM x GPU x fuente x gabinete x disipador)
# probado: pasa de mil millones de combinaciones y no cabe en memoria ni aporta nada que 3
# builds por nivel no den ya. En vez de fuerza bruta, perfiles (13-09, "builds más variadas"):
#  - Cada nivel es una CLASE de GPU, por chip y no por precio (con los precios de 2026 una
#    RTX 5060 Ti 16G cuesta lo mismo que una RX 9070 XT) y sin solaparse: antes Alta y Extrema
#    llevaban las dos una RTX 5080. Las RTX 5090 están sin stock en EE.UU. -> Extrema = RTX 5080.
#  - 3 builds por nivel con enfoques distintos: plataforma AMD o Intel, GPU NVIDIA o Radeon, y el
#    resto de piezas cambia gracias a `usados` (cada build prefiere placa, RAM, gabinete,
#    disipador, fuente y disco que no use otra build del mismo nivel). Antes sólo cambiaba la GPU.
#  - Nunca un disco mecánico como único disco (sólo NVMe).
#  - La fuente cumple las dos reglas de la web (margen x1,35 y lo que pide el fabricante de la GPU)
#    y la GPU pesa al menos el 30 % del total (si no, el configurador enseña su "Tip Gamer" de
#    build descompensada): así cada build sale "100% compatible" también en la página.
# En "gpu" cada opción es {chip, modelo (regex opcional)}; si una no cuadra se prueba la siguiente.
# "cpu" fija el procesador por nombre cuando el enfoque lo exige (X3D, Intel de cada escalón).
# "uso" (15-09-2026, pedido del usuario): además de las 3 de gaming, cada nivel tiene 1 build de
# streaming y 1 de IA local; la web las separa con un selector "Uso". Sin "uso" = gaming.
#  - Streaming: más núcleos (codificar con la CPU o jugar mientras OBS trabaja), NVIDIA por NVENC
#    (AV1 desde la serie 40) y 32 GB; de Alto para arriba, disco de 2 TB para las grabaciones.
#  - IA local: NVIDIA de 16 GB (CUDA es lo que mejor soportan Ollama, LM Studio y ComfyUI). 16 GB es
#    el techo con stock en EE.UU.: la RTX 5090 de 32 GB está agotada y no hay de 24 GB. RAM: 32 GB en
#    Entrada y Medio, 64 GB en Alto y Extremo (decisión del usuario: los kits de 64 GB pasan de
#    US$ 1.180); de Medio para arriba, disco de 2 TB para los modelos.
# "disco_tb": capacidad mínima del NVMe, leída del nombre ("990 PRO 2TB").
PERFILES = {
    "entrada": [
        {"enfoque": "AMD con NVIDIA", "socket": "AM5", "gpu": [{"chip": "RTX 5060"}]},
        {"enfoque": "Intel con Radeon", "socket": "LGA1851", "cpu": ["245K"],
         "gpu": [{"chip": "RX 9060 XT", "modelo": r"\b8\s?G"}]},
        {"enfoque": "AMD con Radeon", "socket": "AM5", "gpu": [{"chip": "RX 9060 XT", "modelo": r"\b8\s?G"}]},
        {"uso": "streaming", "enfoque": "Streaming: 8 núcleos y NVENC", "socket": "AM5",
         "cpu": ["7700X", "9700X"], "ram_gb": 32, "gpu": [{"chip": "RTX 5060"}]},
        # la única NVIDIA de 16 GB con stock en este escalón es una RTX 5060 Ti 16G de US$ 800 (la build
        # salía en US$ 2.037, más que una de gaming Media): para empezar, 16 GB de Radeon por la mitad
        # (LM Studio y Ollama van bien con Radeon; la generación de imágenes, mejor en NVIDIA)
        {"uso": "ia", "enfoque": "IA local para empezar: 16 GB de VRAM (Radeon)", "socket": "AM5", "ram_gb": 32,
         "gpu": [{"chip": "RX 9060 XT", "modelo": r"\b16\s?G"}, {"chip": "RTX 5060 TI", "modelo": r"\b16\s?G"}]},
    ],
    "media": [
        {"enfoque": "AMD con NVIDIA", "socket": "AM5", "gpu": [{"chip": "RTX 5070"}]},
        {"enfoque": "Intel con Radeon", "socket": "LGA1851", "cpu": ["265K"], "gpu": [{"chip": "RX 9070"}]},
        # (probado 13-09: "16 GB de VRAM" con RX 9060 XT 16G no llega al 30 % y cae en una RTX 5060 Ti
        # de US$ 800, casi el precio de la 5070: mala compra. Mejor completar AMD/Intel x NVIDIA/Radeon)
        {"enfoque": "Intel con NVIDIA", "socket": "LGA1851", "cpu": ["250K Plus", "245K"],
         "gpu": [{"chip": "RTX 5070"}]},
        {"uso": "streaming", "enfoque": "Streaming: 20 núcleos, QuickSync y NVENC", "socket": "LGA1851",
         "cpu": ["265K", "270K Plus"], "ram_gb": 32, "gpu": [{"chip": "RTX 5070"}]},
        # la RTX 5070 tiene 12 GB: para IA vale más la 5070 Ti de 16 GB (y el doble de ancho de banda
        # que una 5060 Ti 16G), aunque salga por encima del resto del nivel
        {"uso": "ia", "enfoque": "IA local: 16 GB rápidos (RTX 5070 Ti)", "socket": "AM5", "cpu": ["9700X"],
         "ram_gb": 32, "disco_tb": 2, "gpu": [{"chip": "RTX 5070 TI"}]},
    ],
    "alta": [
        {"enfoque": "Máximo FPS con X3D", "socket": "AM5", "cpu": ["9800X3D", "9850X3D"],
         "gpu": [{"chip": "RTX 5070 TI"}]},
        {"enfoque": "Intel con Radeon", "socket": "LGA1851", "cpu": ["270K Plus", "265K"],
         "gpu": [{"chip": "RX 9070 XT"}]},
        {"enfoque": "X3D con Radeon", "socket": "AM5", "cpu": ["7800X3D"], "gpu": [{"chip": "RX 9070 XT"}]},
        {"uso": "streaming", "enfoque": "Streaming: 12 núcleos y NVENC AV1", "socket": "AM5",
         "cpu": ["9900X"], "ram_gb": 32, "disco_tb": 2, "gpu": [{"chip": "RTX 5070 TI"}]},
        {"uso": "ia", "enfoque": "IA local: 16 GB de VRAM y 64 GB de RAM", "socket": "AM5", "cpu": ["9900X"],
         "ram_gb": 64, "disco_tb": 2, "gpu": [{"chip": "RTX 5070 TI"}]},
    ],
    "extrema": [
        {"enfoque": "Máximo FPS con X3D", "socket": "AM5", "cpu": ["9850X3D", "9800X3D"],
         "gpu": [{"chip": "RTX 5080"}]},
        {"enfoque": "Intel tope de gama", "socket": "LGA1851", "cpu": ["285K"], "refrigeracion": "liquida",
         "gpu": [{"chip": "RTX 5080"}]},
        # hasta el 15-09 la 3.ª de gaming era "Creación e IA local, 64 GB": ahora es la de IA (abajo)
        {"enfoque": "X3D de 16 núcleos: juego y creación", "socket": "AM5", "cpu": ["9950X3D"],
         "refrigeracion": "liquida", "gpu": [{"chip": "RTX 5080"}]},
        {"uso": "streaming", "enfoque": "Streaming: 16 núcleos y NVENC AV1", "socket": "AM5", "cpu": ["9950X"],
         "ram_gb": 32, "disco_tb": 2, "gpu": [{"chip": "RTX 5080"}]},
        {"uso": "ia", "enfoque": "IA local: 16 GB de VRAM y 64 GB de RAM", "socket": "AM5",
         "cpu": ["9950X3D", "9950X"], "ram_gb": 64, "refrigeracion": "liquida", "disco_tb": 2,
         "gpu": [{"chip": "RTX 5080"}]},
    ],
}

# Estilo pecera (16-09-2026, pedido del usuario): en cada nivel, 1 build pecera y 1 pecera blanca, de
# gaming. La GPU sigue la clase del nivel; en la blanca va primero el chip con versión blanca con stock
# (no hay RTX 5070 ni 5070 Ti blancas con stock en EE.UU.).
ESTILOS = {
    "entrada": [
        {"estilo": "pecera", "enfoque": "Pecera: cristal panorámico y ventiladores reverse", "socket": "AM5",
         "gpu": [{"chip": "RTX 5060"}]},
        {"estilo": "pecera-blanca", "enfoque": "Pecera blanca", "socket": "AM5", "gpu": [{"chip": "RTX 5060"}]},
    ],
    "media": [
        {"estilo": "pecera", "enfoque": "Pecera: cristal panorámico y ventiladores reverse", "socket": "AM5",
         "gpu": [{"chip": "RTX 5070"}]},
        {"estilo": "pecera-blanca", "enfoque": "Pecera blanca", "socket": "AM5",
         "gpu": [{"chip": "RX 9070"}, {"chip": "RTX 5070"}]},
    ],
    "alta": [
        {"estilo": "pecera", "enfoque": "Pecera: cristal panorámico y ventiladores reverse", "socket": "AM5",
         "cpu": ["9800X3D", "9850X3D"], "gpu": [{"chip": "RTX 5070 TI"}, {"chip": "RX 9070 XT"}]},
        {"estilo": "pecera-blanca", "enfoque": "Pecera blanca", "socket": "AM5", "cpu": ["9800X3D", "9850X3D"],
         "gpu": [{"chip": "RX 9070 XT"}]},
    ],
    "extrema": [
        {"estilo": "pecera", "enfoque": "Pecera: cristal panorámico y ventiladores reverse", "socket": "AM5",
         "cpu": ["9850X3D", "9800X3D"], "gpu": [{"chip": "RTX 5080"}]},
        {"estilo": "pecera-blanca", "enfoque": "Pecera blanca", "socket": "AM5", "cpu": ["9850X3D", "9800X3D"],
         "gpu": [{"chip": "RTX 5080"}]},
    ],
}
# (16-09-2026, pedido del usuario: "te faltó para streaming y IA") las de streaming e IA local también
# tienen su pecera y su pecera blanca: el mismo perfil de su uso (CPU, RAM, disco y GPU) con el estilo encima
for _nivel, _perfiles in PERFILES.items():
    for _p in [p for p in _perfiles if p.get("uso") in ("streaming", "ia")]:
        for _estilo, _nombre in (("pecera", "Pecera"), ("pecera-blanca", "Pecera blanca")):
            ESTILOS[_nivel].append(dict(_p, estilo=_estilo, enfoque=f"{_nombre} · {_p['enfoque']}"))
for _nivel, _perfiles in ESTILOS.items():
    PERFILES[_nivel] += _perfiles

ORDEN_GAMA = ["entrada", "media", "alta", "extrema"]
RAM_MINIMA_GB = {"entrada": 16, "media": 32, "alta": 32, "extrema": 32}  # también al abaratar
RAM_MINIMA_MTS = {"alta": 6000, "extrema": 6000}  # un equipo tope no lleva un kit DDR5-5600 CL40


def dist_gama(p, objetivo):
    if not objetivo:
        return 0
    return abs(ORDEN_GAMA.index(p["gama"]) - ORDEN_GAMA.index(objetivo)) if p.get("gama") in ORDEN_GAMA else 9


def mejor(cands, objetivo=None, usados=(), barata=False, antes=lambda p: 0, duro=False):
    """La pieza para una build: primero `antes` (p. ej. largo verificado), luego la gama del nivel
    (así una build 'alta' no acaba con el gabinete más barato del catálogo), luego una que no use
    otra build del nivel (variedad) y, al final, la más barata. Con `barata` (2.º intento, cuando
    la GPU no llega al 30 % del total) se ignora la gama, pero se sigue prefiriendo lo no usado.

    Con `duro` (placa, gabinete y disipador) la variedad deja de ser desempate y pasa a filtro: se
    descarta lo que ya lleva otra build del nivel mientras quede alternativa. Hacía falta porque la
    gama va delante y dos builds de Media acabaron con la misma placa (15-09-2026). En la GPU sigue
    siendo desempate: el chip lo fija el perfil y forzar otra marca sólo encarece la build."""
    if not cands:
        return None
    if duro and usados:
        cands = [p for p in cands if p["idx"] not in usados] or cands
    if barata:
        return min(cands, key=lambda p: (antes(p), p["idx"] in usados, p["precio_usd"]))
    return min(cands, key=lambda p: (antes(p), dist_gama(p, objetivo), p["idx"] in usados, p["precio_usd"]))


def disco_tb(s):
    """Capacidad del NVMe en TB, leída del nombre ("990 PRO 2TB" -> 2; "NV3 1TB" -> 1)."""
    m = re.search(r"(\d+)\s?TB", s["modelo"], re.I)
    return int(m.group(1)) if m else 0


def fuente_minima(cpu, gpu):
    """Las dos reglas de la web: margen x1,35 sobre CPU + GPU + 85 W (redondeado a 50) y la
    fuente que pide el fabricante de la GPU."""
    margen = math.ceil(((cpu["tdp"] or 65) + (gpu["tdp"] or 150) + 85) * 1.35 / 50) * 50
    return max(margen, gpu["fuente_recomendada_w"] or 0)


def armar(perfil, objetivo, usados, rechazos):
    # estilo (16-09-2026): "pecera" = gabinete de cristal panorámico + AIO + ventiladores reverse;
    # "pecera-blanca" = además, todo lo que tenga versión blanca en blanco (el gabinete, obligatorio)
    estilo = perfil.get("estilo")
    blanco = estilo == "pecera-blanca"
    # color que desentona: en la blanca, lo que no es blanco; en la pecera normal, lo blanco (si no, por
    # un centavo acababa con un gabinete blanco y el resto negro)
    no_blanco = lambda p: (p.get("color") != "blanco") if blanco else (estilo == "pecera" and p.get("color") == "blanco")
    intentos = [(o, barata) for o in perfil["gpu"] for barata in (False, True)]
    for opcion, barata in intentos:
        gpus = [g for g in usables["Tarjetas gráficas"] if g["chip"] == opcion["chip"]
                and re.search(opcion.get("modelo", ""), g["modelo"], re.I)]
        gpu = mejor(gpus, None, usados, False, antes=lambda g: (g["longitud_mm"] is None, no_blanco(g)))
        cpus = [c for c in usables["Procesadores"] if c["socket"] == perfil["socket"]]
        if perfil.get("cpu"):
            cpu = next((c for nombre in perfil["cpu"] for c in cpus if nombre.lower() in c["modelo"].lower()), None)
        else:
            cpu = mejor(cpus, objetivo, usados)  # el procesador no se abarata: define el nivel
        if not (gpu and cpu):
            rechazos.append(f"{objetivo}/{perfil['enfoque']}: sin {'GPU ' + opcion['chip'] if not gpu else 'CPU'} con stock")
            continue
        # la variedad (`usados`) sólo cuenta donde el comprador la nota: placa, gabinete y disipador
        # (CPU y GPU ya cambian por perfil). En RAM, disco y fuente manda el mejor precio aunque se
        # repitan: probado 13-09, forzar otra RAM subía una build US$ 100 por un kit equivalente.
        mb = mejor([m for m in usables["Placas base"] if compatible_cpu_mb(cpu, m)], objetivo, usados, barata,
                   duro=True, antes=no_blanco)
        if not mb:
            continue
        ram_min = max(perfil.get("ram_gb", 0), RAM_MINIMA_GB[objetivo])
        # la gama de la RAM va por capacidad (64 GB = "extrema"): para jugar no pasa de 48 GB salvo
        # que el perfil pida más (el de creación e IA pide 64)
        ram_max = 999 if perfil.get("ram_gb", 0) > 48 else 48
        # en AM5 el punto óptimo es DDR5-6000/6400 (AMD); más rápido va en modo 2:1 y rinde menos
        rams = [r for r in usables["Módulos de memoria"] if compatible_mb_ram(mb, r)
                and ram_min <= (r.get("capacidad_gb") or 0) <= ram_max
                and (r.get("velocidad_mts") or 0) >= RAM_MINIMA_MTS.get(objetivo, 0)
                and not (perfil["socket"] == "AM5" and (r.get("velocidad_mts") or 0) > 6400)
                and not aviso_ram_lenta(r, mb)]  # un presupuesto no paga una RAM que la placa frena
        ram = mejor(rams, objetivo, (), barata, antes=no_blanco)
        case = mejor([k for k in usables["Gabinetes"] if compatible_gpu_case(gpu, k) and compatible_mb_case(mb, k)
                      and (not estilo or k["pecera"]) and not no_blanco(k)],
                     objetivo, usados, barata, duro=True)
        # la fuente también tiene que caber en el gabinete y traer los cables de la gráfica; entre las
        # que valen, antes una sin avisos: con 12V-2x6 nativo (no obliga al adaptador) y con tantos
        # conectores de CPU como la placa (cualquier aviso le quita a la build el "100% Garantizada")
        psu = mejor([f for f in usables["Fuentes de poder"] if (f["vatios"] or 0) >= fuente_minima(cpu, gpu)
                     and (case is None or compatible_psu_case(f, case)) and cables_gpu_psu(gpu, f) != "faltan"],
                    objetivo, (), barata,
                    antes=lambda f: (cables_gpu_psu(gpu, f) == "adaptador") + aviso_eps(f, mb))
        cools = [k for k in usables["Refrigeración"]
                 if case and compatible_cool_cpu(k, cpu) and compatible_cool_case(k, case)]
        tipo = perfil.get("refrigeracion") or ("liquida" if estilo else None)  # una pecera luce la AIO
        cool = mejor([k for k in cools if k["tipo"] == tipo] or cools, objetivo, usados, barata, duro=True,
                     antes=no_blanco)
        # ventiladores reverse (sólo estilo pecera): un pack para la posición de abajo o del lateral que
        # esté libre y tenga más huecos; ninguno si el gabinete ya los trae puestos en las dos
        fans = None
        if estilo and case:
            libres = {tam: max((d[str(tam)] for d in huecos_visibles(case, tam).values() if not d["incluidos"]),
                               default=0) for tam in (120, 140)}
            candidatos = [f for f in usables.get("Ventiladores", []) if libres.get(f["tamano_mm"])
                          and compatible_fan_case(f, case) and (not blanco or f.get("color") == "blanco")]
            fans = mejor(candidatos, objetivo, (), barata,
                         antes=lambda f: (f["ecosistema"] not in ("estandar", "lian-li-flex"),  # sin hub aparte
                                          bool(f.get("grosor_mm") and f["grosor_mm"] >= 30),  # sin aviso de grosor
                                          f.get("color") != ("blanco" if blanco else "negro"),
                                          -min(f["pack"], libres[f["tamano_mm"]])))  # que llene más huecos
        disco = mejor([s for s in usables["Almacenamiento"] if s["interfaz"] == "NVMe" and not s["hdd"]
                       and disco_tb(s) >= perfil.get("disco_tb", 0)],
                      objetivo, (), barata)
        if not all((ram, case, psu, cool, disco)):
            rechazos.append(f"{objetivo}/{perfil['enfoque']}/{opcion['chip']}: falta pieza compatible")
            continue
        partes = {"cpu": cpu, "motherboard": mb, "ram": ram, "gpu": gpu, "psu": psu, "case": case,
                  "cooling": cool, "storage": disco}
        if fans:
            partes["fans"] = fans
        precio = round(sum(p["precio_usd"] for p in partes.values()), 2)
        # el 30 % es regla de gaming; en streaming e IA la CPU y la RAM pesan más a propósito
        # en las peceras el gabinete, la AIO y los ventiladores suben el total a propósito: 27 %
        # (streaming e IA con estilo: 22 %, por lo mismo)
        gpu_min = (0.27 if estilo else 0.30) if perfil.get("uso", "gaming") == "gaming" else (0.22 if estilo else 0.25)
        if precio > 700 and gpu["precio_usd"] / precio < gpu_min:
            rechazos.append(f"{objetivo}/{perfil['enfoque']}/{opcion['chip']}{' (abaratada)' if barata else ''}: "
                            f"GPU al {gpu['precio_usd'] / precio:.0%} del total (< {gpu_min:.0%})")
            continue
        # transparencia: qué piezas no son de la gama del nivel (el catálogo no siempre tiene
        # opciones compatibles en la gama exacta, p. ej. los X3D son "alta" y van en Extrema)
        fuera_de_gama = {k: p["gama"] for k, p in partes.items() if p.get("gama") != objetivo}
        return {"uso": perfil.get("uso", "gaming"), "estilo": estilo or "estandar", "enfoque": perfil["enfoque"],
                "componentes": {k: p["idx"] for k, p in partes.items()},
                "precio_usd": precio, "fuera_de_gama": fuera_de_gama, "abaratada": barata}
    return None


combos = {t: [] for t in PERFILES}
avisos_tramo, rechazos = [], []
for nombre, perfiles in PERFILES.items():
    # la variedad (no repetir placa, gabinete ni disipador) es entre builds del mismo uso: la de IA
    # no tiene por qué esquivar las piezas de las de gaming (así acababa con un gabinete de US$ 513)
    usados_por_uso = collections.defaultdict(set)
    for perfil in perfiles:
        usados = usados_por_uso[(perfil.get("uso", "gaming"), perfil.get("estilo"))]
        b = armar(perfil, nombre, usados, rechazos)
        if not b:
            avisos_tramo.append(f"Nivel '{nombre}': no se pudo armar '{perfil['enfoque']}'")
            continue
        usados |= set(b["componentes"].values())
        combos[nombre].append(b)
    print(f"  {nombre:8}: {len(combos[nombre])} builds, US$ "
          + ", ".join(f"{b['precio_usd']:.0f} ({b['uso']}: {b['enfoque']})" for b in combos[nombre]))
for r in rechazos:
    print("  (descartado)", r)
for a in avisos_tramo:
    print("AVISO:", a)
avisos += avisos_tramo

total_combos = sum(len(v) for v in combos.values())
print(f"\n{total_combos} builds completas y verificadas (no exhaustivo a propósito, ver docstring).")

json.dump({
    "generado": "2026-09-13",
    "alcance": "combos: sólo local/importacion_us; productos_globales: sólo para el configurador",
    "productos": productos, "productos_globales": productos_globales,
    "avisos": avisos, "combos_por_tramo": combos,
}, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"Escrito: {OUT}")
