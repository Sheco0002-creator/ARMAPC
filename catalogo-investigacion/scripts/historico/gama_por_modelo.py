"""Gama por MODELO, no por precio (decisión del usuario, 2026-09-12).
Placas, procesadores, almacenamiento y fuentes. GPUs (chip), RAM (capacidad), gabinetes (diseño) y
refrigeración (línea de cada marca) ya iban por modelo y no se tocan.
Mueve las fotos a imagenes/<categoria>/<gama nueva>/... y reescribe las rutas.
Uso: python gama_por_modelo.py            (simulación)
     python gama_por_modelo.py --escribir"""
import json, os, re, sys, shutil, datetime, collections
sys.stdout.reconfigure(encoding="utf-8")
ESCRIBIR = "--escribir" in sys.argv
BASE = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo"
CAT = os.path.join(BASE, "catalogo-final.json")

# --- Placas: línea de la marca (1 básica · 2 intermedia · 3 superior · 4 buque insignia)
LINEA_PLACA = [(r"CROSSHAIR|MAXIMUS|AORUS MASTER|TAICHI|\bMEG\b", 4),
               (r"ROG STRIX|AORUS PRO|NOVA|\bMPG\b", 3),
               (r"\bTUF\b|AORUS ELITE|\bA ELITE\b|STEEL LEGEND|\bMAG\b", 2),
               (r".", 1)]
def gama_placa(p):
    t = f"{p['modelo']} {p['mpn']}".upper()
    n = next(v for pat, v in LINEA_PLACA if re.search(pat, t))
    return {1: "entrada", 2: "media", 3: "alta", 4: "extrema"}[n]

# --- Procesadores: serie del modelo
def gama_cpu(p):
    m = p["modelo"].upper()
    if re.search(r"RYZEN 9 99[5-9]0|ULTRA 9|I9-", m): return "extrema"      # 16 núcleos / i9 / Ultra 9
    if re.search(r"RYZEN 9|RYZEN 7 [789]\d{2}0X3D", m): return "alta"         # Ryzen 9 12 núcleos, Ryzen 7 X3D de AM5
    if re.search(r"RYZEN 7|ULTRA 7|I7-", m): return "media"                   # incl. 5700X3D (AM4)
    return "entrada"                                                          # Ryzen 5, Ultra 5, i5

# --- Almacenamiento: línea del producto (interfaz y posicionamiento)
LINEA_SSD = [(r"9100 PRO|SN8100|T705|RENEGADE G5", "extrema"),              # PCIe 5.0
             (r"990 PRO|SN850X", "alta"),                                     # PCIe 4.0 tope de gama
             (r"990 EVO|SN7100|T500|NM790|GOLD P31", "media"),                # PCIe 4.0 (o 3.0 tope) con buen rendimiento
             (r".", "entrada")]                                               # SATA, HDD y NVMe básicos (NV3, P3 Plus, P310, SN5000)
def gama_alm(p):
    t = p["modelo"].upper()
    return next(g for pat, g in LINEA_SSD if re.search(pat, t))

# --- Fuentes: certificación + potencia (datos del modelo)
def gama_psu(p):
    s = p.get("specs", {})
    cert = s.get("Certificación", "").upper()
    w = int(re.search(r"\d+", s.get("Potencia", "0")).group())
    if "TITANIUM" in cert or ("PLATINUM" in cert and w >= 1200): return "extrema"
    if "PLATINUM" in cert or ("GOLD" in cert and w >= 1000): return "alta"
    if "GOLD" in cert: return "media"
    return "entrada"                                                          # Bronze / Silver

REGLAS = {"Placas base": gama_placa, "Procesadores": gama_cpu, "Almacenamiento": gama_alm, "Fuentes de poder": gama_psu}

cat = json.load(open(CAT, encoding="utf-8"))
cambios, movs = [], []
for i, p in enumerate(cat):
    f = REGLAS.get(p["categoria"])
    if not f: continue
    g = f(p)
    if g == p["gama"]: continue
    cambios.append((i, p["categoria"], p["modelo"], p["gama"], g))
    for k in ("medium", "high"):
        for r in p["imagenes_local"][k]:
            partes = r.split("/")                                             # imagenes/<cat>/<gama>/<high|medium>/archivo
            if partes[2] != p["gama"]: sys.exit(f"ruta inesperada {r}")
            movs.append((i, r, "/".join(partes[:2] + [g] + partes[3:])))

cnt = collections.Counter()
for c in REGLAS:
    cnt.update({f"{c}|{g}": 1 for g in [REGLAS[c](p) for p in cat if p["categoria"] == c]} if False else {})
print(f"cambian de gama: {len(cambios)}  | fotos a mover: {len(movs)}")
for i, c, m, a, b in cambios: print(f"  #{i:3} {c[:12]:12} {m[:36]:36} {a:8} -> {b}")
print("\nreparto final:")
for c, f in REGLAS.items():
    r = collections.Counter(f(p) for p in cat if p["categoria"] == c)
    print(f"  {c:18} " + "  ".join(f"{g}={r[g]}" for g in ("entrada", "media", "alta", "extrema")))
if not ESCRIBIR: print("\n(simulación: no se ha tocado nada)"); sys.exit()

sello = datetime.datetime.now().strftime("%Y%m%d-%H%M")
shutil.copy2(CAT, os.path.join(BASE, f"catalogo-final.BACKUP-{sello}-antes-gama-por-modelo.json"))
for i, a, b in movs:
    src, dst = os.path.join(BASE, a), os.path.join(BASE, b)
    if os.path.exists(dst): sys.exit(f"ya existe, no piso: {b}")
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    os.replace(src, dst)
mapa = {a: b for _, a, b in movs}
for i, c, m, a, g in cambios:
    p = cat[i]
    p["gama"] = g
    for k in ("medium", "high"): p["imagenes_local"][k] = [mapa.get(r, r) for r in p["imagenes_local"][k]]
    p["imagen_principal"] = mapa.get(p["imagen_principal"], p["imagen_principal"])
for p in cat:
    if p["categoria"] in REGLAS: p["gama_criterio"] = "modelo"
json.dump(cat, open(CAT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"\nescrito. {len(movs)} fotos movidas. Backup catalogo-final.BACKUP-{sello}-antes-gama-por-modelo.json")
