"""Specs completas para las 12 RAM que tenían 5-7 campos escritos a mano (2026-09-13): 6 Corsair y 6 G.Skill.

Open Icecat no sirve (Corsair es de pago, G.Skill no está). Las webs oficiales sí, por curl:
  - Corsair: la URL completa sale de https://www.corsair.com/us-sitemap-products-1.xml (la corta da 404).
    La página trae TODAS las variantes (colores, capacidades) en __NEXT_DATA__ -> productDetail.items[];
    se toma SÓLO el item cuyo `sku` coincide EXACTO con nuestro MPN.
  - G.Skill: página /specification/... (sale de https://www.gskill.com/sitemap.xml), por MPN exacto.

Se conservan los 7 campos en español de siempre (resumen) y se añaden los del fabricante traducidos.
Además se comparan los 7 de siempre con los del fabricante y se avisa si alguno no cuadra.
python ram_specs.py [--escribir]
"""
import json, os, re, shutil, sys, time, datetime, urllib.request

sys.stdout.reconfigure(encoding="utf-8")
ESCRIBIR = "--escribir" in sys.argv
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36"
BASE = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo"
CAT = os.path.join(BASE, "catalogo-final.json")

# G.Skill: nuestros MPN son COMPLETOS (-TZ5N, -TZ5RS, -TR5NS...): coincidencia exacta con la URL del
# sitemap, seguida de "-" o fin, para que TZ5N no case con TZ5NR.
GSKILL = {84: [""], 87: [""], 89: [""], 91: [""], 93: [""], 96: [""]}
CORSAIR = [80, 83, 88, 90, 92, 95]

ES = {"Package Contents": "Contenido", "Tested Latency": "Latencia probada", "Tested Speed": "Velocidad probada",
      "Tested Voltage": "Voltaje probado", "SPD Voltage": "Voltaje SPD", "Speed Rating": "Clasificación",
      "SPD Speed": "Velocidad SPD", "SPD Latency": "Latencia SPD", "Performance Profile": "Perfil de rendimiento",
      "Package Memory Format": "Formato", "Memory Series": "Serie", "Package Memory Pin": "Pines",
      "Heat Spreader": "Disipador", "Memory Color": "Color", "Memory Compatibility": "Compatibilidad",
      "Memory Type": "Tipo de memoria", "PMIC Type": "Tipo de PMIC", "LED Lighting": "Iluminación LED",
      "Single Zone / Multi-Zone Lighting": "Zonas de iluminación", "Capacity": "Capacidad total",
      "Multi-Channel Kit": "Kit multicanal", "OC Profile Support": "Perfiles de overclock",
      "Tested Speed (XMP/EXPO)": "Velocidad probada (XMP/EXPO)", "Tested Latency (XMP/EXPO)": "Latencia probada (XMP/EXPO)",
      "Tested Voltage (XMP/EXPO)": "Voltaje probado (XMP/EXPO)", "Registered/Unbuffered": "Registrada/sin búfer",
      "Error Checking": "Corrección de errores", "SPD Speed (Default)": "Velocidad SPD (por defecto)",
      "SPD Voltage (Default)": "Voltaje SPD (por defecto)", "Fan Included": "Ventilador incluido",
      "Height": "Altura", "Warranty": "Garantía", "Features": "Características", "Color": "Color",
      "Tested Speed (XMP)": "Velocidad probada (XMP)", "Tested Latency (XMP)": "Latencia probada (XMP)",
      "Tested Voltage (XMP)": "Voltaje probado (XMP)", "Tested Speed (EXPO)": "Velocidad probada (EXPO)"}
ES.update({"Error Checking (ECC)": "Corrección de errores (ECC)", "Lighting": "Iluminación",
           "Additional Notes": "Nota"})
# Weight "0kg" es un dato roto de Corsair; Memory Detail Compatibility duplica Memory Compatibility;
# Features de G.Skill repite los perfiles de overclock.
DESCARTAR = {"Weight", "Memory Detail Compatibility", "Features"}
VALORES = [("Dual Channel Kit", "Kit de doble canal"), ("Quad Channel Kit", "Kit de cuatro canales"),
           ("Unbuffered", "Sin búfer"), ("Non-ECC", "Sin ECC"), ("Limited Lifetime", "Limitada de por vida"),
           ("Aluminum", "Aluminio"), ("BLACK", "Negro"), ("WHITE", "Blanco"), ("Up to ", "Hasta "),
           ("*", ""), (" Series", " serie"), (",Intel", ", Intel"), (",AMD", ", AMD")]


def valor_es(k, v):
    import html
    v = html.unescape(v).replace("&", "y")
    if k == "Additional Notes":            # aviso largo en inglés: se deja la idea en una línea
        return "No mezcles kits: se venden emparejados para funcionar juntos." if "mix" in v.lower() else ""
    for a, b in VALORES:
        v = v.replace(a, b)
    return v.strip()


def get(u):
    return urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": UA}), timeout=40).read().decode("utf-8", "replace")


def corsair(mpn, locs):
    url = next((l for l in locs if f"/{mpn.lower()}/" in l.lower()), None) \
        or next((l for l in locs if mpn.lower() in l.lower()), None)
    if not url:
        return None, None, "sin URL en el sitemap"
    h = get(url)
    d = json.loads(re.search(r'id="__NEXT_DATA__"[^>]*>(.*?)</script>', h, re.S).group(1))
    hall = []

    def walk(o):
        if isinstance(o, dict):
            if str(o.get("sku", "")).upper() == mpn.upper():
                for v in o.values():
                    if isinstance(v, list) and v and isinstance(v[0], dict) and {"code", "value"} <= set(v[0]):
                        hall.append(v)
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)
    walk(d)
    if not hall:
        return None, url, "la página no trae el SKU exacto (sólo otras variantes)"
    return {x["code"]: str(x["value"]).strip() for x in hall[0] if str(x["value"]).strip()}, url, None


def gskill(mpn, prefs, locs):
    specs_urls = [l for l in locs if "/specification/" in l and "/tw/" not in l and "/cn/" not in l
                  and f"/{mpn.lower()}" in l.lower()]
    url = None
    for suf in prefs:
        url = next((l for l in specs_urls if re.search(re.escape(mpn + suf) + r"(-|$)", l, re.I)), None)
        if url:
            break
    if not url:
        return None, None, "variante no encontrada; candidatas: " + ", ".join(l.split("/")[-1] for l in specs_urls[:5])
    h = get(url)
    pares = re.findall(r'list-block list-tit">\s*(.*?)\s*</div>\s*<div class="list-block">\s*(.*?)\s*</div>', h, re.S)
    specs = {}
    for k, v in pares:
        k = re.sub(r"<[^>]+>", "", k).strip()
        v = re.sub(r"\s+", " ", re.sub(r"<br\s*/?>", " / ", v))
        v = re.sub(r"<[^>]+>", "", v).strip()
        if k and v:
            specs[k] = v
    return specs, url, None


cat = json.load(open(CAT, encoding="utf-8"))
print("sitemaps...")
c_locs = re.findall(r"<loc>([^<]+)</loc>", get("https://www.corsair.com/us-sitemap-products-1.xml"))
g_locs = re.findall(r"<loc>([^<]+)</loc>", get("https://www.gskill.com/sitemap.xml"))
print(f"  corsair {len(c_locs)} URLs | gskill {len(g_locs)} URLs\n")

resultado = {}
for idx in CORSAIR + list(GSKILL):
    p = cat[idx]
    try:
        if idx in GSKILL:
            specs, url, err = gskill(p["mpn"], GSKILL[idx], g_locs)
        else:
            specs, url, err = corsair(p["mpn"], c_locs)
    except Exception as e:
        specs, url, err = None, None, f"error {e}"
    resultado[idx] = {"specs": specs, "url": url, "err": err}
    estado = f"{len(specs)} specs" if specs else f"FALLO: {err}"
    print(f"#{idx} {p['marca']:8} {p['modelo'][:40]:40} {estado}")
    if url:
        print(f"      {url.split('/')[-1][:80]}")
    time.sleep(2)

# --- comparar los 7 campos de siempre con el fabricante ---
print("\nCOMPARACIÓN con los campos escritos a mano:")
def num(s):
    return re.findall(r"\d+(?:\.\d+)?", s or "")
for idx, r in resultado.items():
    if not r["specs"]:
        continue
    viejo, s = cat[idx]["specs"], r["specs"]
    # cada marca nombra distinto el campo ("Tested Latency", "Tested Latency (XMP/EXPO)", "CAS Latency"...)
    fab_lat = next((v for k, v in s.items() if "latency" in k.lower() and "spd" not in k.lower()), "")
    fab_vol = next((v for k, v in s.items() if "voltage" in k.lower() and "spd" not in k.lower()), "")
    avisos = []
    if viejo.get("Latencia") and num(viejo["Latencia"])[:1] != num(fab_lat)[:1]:
        avisos.append(f"latencia {viejo['Latencia']} vs fabricante {fab_lat}")
    if viejo.get("Voltaje") and num(viejo["Voltaje"])[:1] != num(fab_vol)[:1]:
        avisos.append(f"voltaje {viejo['Voltaje']} vs fabricante {fab_vol}")
    r["avisos"] = avisos
    print(f"  #{idx} {cat[idx]['modelo'][:38]:38} " + ("; ".join(avisos) if avisos else "cuadra"))

if not ESCRIBIR:
    json.dump(resultado, open(os.path.join(os.environ.get("TEMP", "."), "ram_specs_simulacion.json"), "w",
                              encoding="utf-8"), ensure_ascii=False, indent=1)
    print("\n(simulación: no se ha escrito nada; añade --escribir)")
    sys.exit()

sello = datetime.datetime.now().strftime("%Y%m%d-%H%M")
shutil.copy2(CAT, os.path.join(BASE, f"catalogo-final.BACKUP-{sello}-antes-specs-ram.json"))
for idx, r in resultado.items():
    if not r["specs"]:
        continue
    p = cat[idx]
    nuevas = {ES.get(k, k): valor_es(k, v) for k, v in r["specs"].items() if k not in DESCARTAR}
    nuevas = {k: v for k, v in nuevas.items() if v}
    # el voltaje escrito a mano estaba mal en 3 módulos: manda el fabricante y se guarda el valor viejo
    fab_vol = next((v for k, v in r["specs"].items() if "voltage" in k.lower() and "spd" not in k.lower()), "")
    if any(a.startswith("voltaje") for a in r.get("avisos", [])):
        p["specs_corregido"] = f"Voltaje: antes {p['specs'].get('Voltaje')} (escrito a mano), fabricante {fab_vol}"
        p["specs"]["Voltaje"] = fab_vol
    p["specs"] = {**p["specs"], **{k: v for k, v in nuevas.items() if k not in p["specs"]}}
    p["n_specs"] = len(p["specs"])
    p["specs_fuente"] = r["url"]
    otros = [a for a in r.get("avisos", []) if not a.startswith("voltaje")]
    if otros:
        p["specs_aviso"] = "; ".join(otros) + " (revisar: el resumen se escribió a mano)"
json.dump(cat, open(CAT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"\nHECHO. Backup: catalogo-final.BACKUP-{sello}-antes-specs-ram.json")
