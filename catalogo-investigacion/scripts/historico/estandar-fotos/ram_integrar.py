"""Integra las fotos de RAM del fabricante que pasaron la revisión a ojo (2026-09-13).

De 101 descargadas (ram_fotos.py) entran 51. Fuera:
  - Corsair: los cuadros de marketing con texto encima (Intel XMP Ready, iCUE, 5000MHz, garantía),
    la persona del 88.6, el PC montado donde la RAM casi no se ve (x.7 / 90.6), la foto con ventiladores
    y fuente (otros productos), la tira vista desde arriba (2000x108), la tira de luz del 88.11 y la
    foto 1 de cada uno (mismo render que la que ya tenían, sólo con fondo negro).
  - Corsair Vengeance LPX (#95): su galería es de 800 px -> sigue con imagen genérica.
  - G.Skill: las que duplican una foto que el producto ya tenía (91.2, 91.3, 93.4, 96.2).
Además la foto que tenía el #87 (Trident Z5 RGB PLATEADA, TZ5RS) era de la versión NEGRA (la misma
del #93): se saca y se mueve a JORGE pruebas-y-superados.

Principal: se mantiene la que había, salvo en 84 y 89 (tenían genérica) y 87 (tenía la equivocada).
python ram_integrar.py [--escribir]
"""
import json, os, shutil, sys, datetime, subprocess
from PIL import Image

sys.stdout.reconfigure(encoding="utf-8")
ESCRIBIR = "--escribir" in sys.argv
BASE = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo"
CAT = os.path.join(BASE, "catalogo-final.json")

ACEPTADAS = {80: [8, 10, 12], 83: [8, 10, 12], 92: [8, 10, 12], 90: [7, 9, 10], 88: [7, 8, 9, 10],
             84: [1, 2, 3, 4, 5, 6, 7, 8], 87: [1, 2, 3, 4, 5, 6, 7, 8], 89: [1, 2, 3, 4, 5, 6],
             91: [1, 4, 5, 6, 7, 8], 93: [1, 2, 3, 5, 6], 96: [1, 3]}
NUEVA_PRINCIPAL = {84, 87, 89}
VARIANTE_EQUIVOCADA = (87, "imagenes/ram/alta/high/ram-08-gskill-trident-z5-rgb-ddr5-6400-32gb.png")

L = subprocess.run(["powershell", "-NoProfile", "-Command",
                    "(Get-Volume | Where-Object FileSystemLabel -eq 'JORGE').DriveLetter"],
                   capture_output=True, text=True).stdout.strip()
if not L:
    sys.exit("USB JORGE no conectado.")
ARCH = os.path.join(f"{L}:\\", "catalogo-investigacion-ARCHIVO")
ORIG = os.path.join(ARCH, "RAM_fotos-fabricante_2026-09-13")
SUPERADOS = os.path.join(ARCH, "pruebas-y-superados", "RAM_foto-variante-equivocada_2026-09-13")

cat = json.load(open(CAT, encoding="utf-8"))

idx, ruta = VARIANTE_EQUIVOCADA
p = cat[idx]
p["imagenes_local"]["high"].remove(ruta)
print(f"  #{idx} fuera {ruta} (es la TZ5RK negra)")
if ESCRIBIR:
    os.makedirs(SUPERADOS, exist_ok=True)
    shutil.move(os.path.join(BASE, ruta), os.path.join(SUPERADOS, os.path.basename(ruta)))

total = 0
for idx, fotos in ACEPTADAS.items():
    p = cat[idx]
    alta = f"imagenes/ram/{p['gama']}/high"
    media = alta.replace("/high", "/medium")
    marca = p["marca"].replace(".", "").replace(" ", "")
    for n in fotos:
        o = os.path.join(ORIG, p["mpn"], f"{n:02d}.jpg")
        nombre = f"{marca}_{p['mpn']}_FAB_{n}.jpg"
        rh, rm = f"{alta}/{nombre}", f"{media}/{nombre}"
        if ESCRIBIR:
            os.makedirs(os.path.join(BASE, alta), exist_ok=True)
            os.makedirs(os.path.join(BASE, media), exist_ok=True)
            shutil.copy2(o, os.path.join(BASE, rh))
            im = Image.open(o).convert("RGB"); im.thumbnail((500, 500))
            im.save(os.path.join(BASE, rm), quality=88)
        p["imagenes_local"]["high"].append(rh)
        p["imagenes_local"].setdefault("medium", []).append(rm)
        total += 1
    if idx in NUEVA_PRINCIPAL:
        p["imagen_principal"] = f"{alta}/{marca}_{p['mpn']}_FAB_{fotos[0]}.jpg"
        p["imagen_generica"] = False
    p["n_fotos"] = len(p["imagenes_local"]["high"])
    p["n_imagenes"] = p["n_fotos"] + len(p["imagenes_local"]["medium"])
    p["fotos_fuente"] = "web del fabricante (galería del SKU exacto), 2026-09-13"
    print(f"  #{idx} {p['modelo'][:44]:44} -> {p['n_fotos']} fotos"
          + ("  (principal nueva)" if idx in NUEVA_PRINCIPAL else ""))

print(f"\n{total} fotos nuevas")
if not ESCRIBIR:
    print("(simulación: no se ha copiado ni escrito nada; añade --escribir)")
    sys.exit()
sello = datetime.datetime.now().strftime("%Y%m%d-%H%M")
shutil.copy2(CAT, os.path.join(BASE, f"catalogo-final.BACKUP-{sello}-antes-fotos-ram.json"))
json.dump(cat, open(CAT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"HECHO. Backup: catalogo-final.BACKUP-{sello}-antes-fotos-ram.json")
