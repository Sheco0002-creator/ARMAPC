"""Limpieza por mercado objetivo (EE.UU. + Hispanoamérica + Brasil), 2026-09-12.

1. RETIRA del catálogo los productos descatalogados globalmente (RTX 40, RX 7000, SK hynix P31,
   Ryzen 7 5700X3D). Las fotos NO se borran: se MUEVEN a JORGE pruebas-y-superados/ con MANIFIESTO.json.
2. MARCA sin precio los de distribución europea (marca Palit/Gainward; versión 230 V / enchufe EU),
   que se publican con ficha e imágenes pero sin precio ni precio_pen.
   El importe europeo ya calculado se guarda en `precio_referencia_eu` como dato interno (no se muestra).

python limpieza_region.py            # simulación, no escribe
python limpieza_region.py --escribir
"""
import json, os, sys, shutil, datetime, subprocess

sys.stdout.reconfigure(encoding="utf-8")
ESCRIBIR = "--escribir" in sys.argv
BASE = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo"
CAT = os.path.join(BASE, "catalogo-final.json")

# --- identificados por MPN, no por índice (los índices cambian al retirar) ---
DESCATALOGADOS = [
    "GV-N4060EAGLE OC-8GD", "GV-N4070GAMING OCV2-12GD",
    "GEFORCE RTX 4070 TI SUPER 16G VENTUS 3X OC", "GEFORCE RTX 4080 SUPER 16G VENTUS 3X OC",
    "GV-N4080GAMING OC-16GD", "GV-N4090GAMING OC-24GD",
    "GV-R77XTGAMING OC-12GD", "GV-R78XTGAMING OC-16GD",
    "RADEON RX 7900 XT GAMING TRIO CLASSIC 20G", "GV-R79XTXGAMING OC-24GD",
    "RX7900XTX TC 24GO",
]
DESC_OTROS = [("AMD", "Ryzen 7 5700X3D"), ("SK HYNIX", "Gold P31 1TB"), ("SK HYNIX", "Gold P31 2TB")]

NOTA_MARCA = ("Marca de distribución europea: no se comercializa en América. "
              "Ficha técnica e imágenes a título informativo; sin precio para esta región.")
NOTA_VERSION = ("Versión europea de este modelo (230 V / enchufe europeo): no se comercializa en América. "
                "Ficha técnica e imágenes a título informativo; sin precio para esta región.")
EU_MARCAS = {"PALIT", "GAINWARD"}
EU_VERSION = ["MWE Bronze 750 V3 230V", "Toughpower PF3 1200W"]


def archivos(p):
    fs = []
    for v in (p.get("imagenes_local") or {}).values():
        fs += v if isinstance(v, list) else [v]
    if p.get("imagen_principal"):
        fs.append(p["imagen_principal"])
    return sorted(set(fs))


def letra_jorge():
    r = subprocess.run(["powershell", "-NoProfile", "-Command",
                        "(Get-Volume | Where-Object FileSystemLabel -eq 'JORGE').DriveLetter"],
                       capture_output=True, text=True).stdout.strip()
    if not r:
        sys.exit("USB JORGE no conectado: no se escribe nada.")
    return r


cat = json.load(open(CAT, encoding="utf-8"))
retirar, europeos = [], []
for i, p in enumerate(cat):
    if p["mpn"] in DESCATALOGADOS or (p["marca"], p["modelo"]) in DESC_OTROS:
        retirar.append(i)
    elif p["marca"] in EU_MARCAS:
        europeos.append((i, "marca_europea", NOTA_MARCA))
    elif p["modelo"] in EU_VERSION:
        europeos.append((i, "version_europea", NOTA_VERSION))

# seguridad: ninguna foto de los retirados puede estar en uso por un producto que se queda
usadas = set()
for i, p in enumerate(cat):
    if i not in retirar:
        usadas |= set(archivos(p))
mover = []
for i in retirar:
    for f in archivos(cat[i]):
        if f in usadas:
            sys.exit(f"ABORTADO: {f} lo usa un producto que se queda.")
        if os.path.exists(os.path.join(BASE, f)):
            mover.append((i, f))

print(f"Retirar {len(retirar)} productos | mover {len(mover)} archivos | marcar {len(europeos)} europeos")
for i in retirar:
    print(f"  retira #{i:3} {cat[i]['marca']:9} {cat[i]['modelo'][:44]}")
for i, motivo, _ in europeos:
    print(f"  marca  #{i:3} {cat[i]['marca']:14} {cat[i]['modelo'][:40]:40} {motivo}")

if not ESCRIBIR:
    print("\n(simulación: no se ha escrito nada; añade --escribir)")
    sys.exit()

sello = datetime.datetime.now().strftime("%Y%m%d-%H%M")
shutil.copy2(CAT, os.path.join(BASE, f"catalogo-final.BACKUP-{sello}-antes-limpieza-region.json"))
destino = os.path.join(f"{letra_jorge()}:\\", "catalogo-investigacion-ARCHIVO", "pruebas-y-superados",
                       f"DESCATALOGADOS_{datetime.date.today()}")
os.makedirs(destino, exist_ok=True)

manifiesto = []
for i, f in mover:
    org = os.path.join(BASE, f)
    dst = os.path.join(destino, f.replace("/", os.sep))
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.move(org, dst)
    manifiesto.append({"producto": f"{cat[i]['marca']} {cat[i]['modelo']}", "mpn": cat[i]["mpn"],
                       "ean": cat[i].get("ean"), "archivo": f, "motivo": "descatalogado globalmente"})
json.dump({"fecha": str(datetime.date.today()),
           "motivo": "Productos descatalogados retirados del catálogo (mercado objetivo: EE.UU., Hispanoamérica, Brasil)",
           "productos": [{"marca": cat[i]["marca"], "modelo": cat[i]["modelo"], "mpn": cat[i]["mpn"],
                          "ean": cat[i].get("ean"), "categoria": cat[i]["categoria"]} for i in retirar],
           "archivos": manifiesto},
          open(os.path.join(destino, "MANIFIESTO.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

for i, motivo, nota in europeos:
    p = cat[i]
    if p.get("precio_usd") is not None:
        p["precio_referencia_eu"] = {"usd": p["precio_usd"], "origen": p.get("precio_pais"),
                                     "local": p.get("precio_original"), "fecha": p.get("precio_usd_fecha"),
                                     "nota": "dato interno, no se muestra en la web"}
    p.update(precio_usd=None, precio_pen=None, precio_pen_sin_igv=None, precio_verificado=False,
             precio_pais=None, precio_usd_nota=nota,
             disponibilidad_region="no_disponible", disponibilidad_motivo=motivo, disponibilidad_nota=nota)

cat = [p for i, p in enumerate(cat) if i not in retirar]
json.dump(cat, open(CAT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
con = sum(p.get("precio_usd") is not None for p in cat)
print(f"\nHECHO. Catálogo: {len(cat)} productos | con precio {con} | sin precio {len(cat)-con}")
print(f"Backup: catalogo-final.BACKUP-{sello}-antes-limpieza-region.json")
print(f"Fotos movidas a: {destino}")
