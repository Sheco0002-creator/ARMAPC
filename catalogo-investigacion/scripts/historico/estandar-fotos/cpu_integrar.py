"""Integra las fotos de CPU de Best Buy que pasaron la revisión a ojo (2026-09-13).

De 31 descargadas (cpu_bestbuy.py) quedan 9. Fuera: 4 por < 900 px; 110.2 (caja de Ryzen 7, otro
producto); 111.3 (disipador incluido = accesorio); 113.3, 115.3, 116.2, 117.3, 120.2 (parte trasera de la
caja: sólo texto, no se ve el producto); 118.3 (persona); 118.4 (banner). Y además las que duplican una
foto que el producto YA tenía (Best Buy usa las mismas imágenes de prensa de AMD): 111.1, 113.1, 115.1,
116.1, 117.1/2/4, 118.1, 120.1, 121.x.

Estándar: la foto principal es la primera que NO sea de caja -> el chip pasa a principal donde se añade.
python cpu_integrar.py [--escribir]
"""
import json, os, shutil, sys, datetime, subprocess
from PIL import Image

sys.stdout.reconfigure(encoding="utf-8")
ESCRIBIR = "--escribir" in sys.argv
BASE = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo"
CAT = os.path.join(BASE, "catalogo-final.json")

# indice -> [(n de la foto descargada, es_chip)]
ACEPTADAS = {
    110: [(1, False)],
    111: [(4, True)],
    113: [(2, False), (4, True)],
    115: [(2, False), (4, True)],
    118: [(2, False)],
    122: [(2, False), (3, False)],
}

L = subprocess.run(["powershell", "-NoProfile", "-Command",
                    "(Get-Volume | Where-Object FileSystemLabel -eq 'JORGE').DriveLetter"],
                   capture_output=True, text=True).stdout.strip()
if not L:
    sys.exit("USB JORGE no conectado.")
ORIG = os.path.join(f"{L}:\\", "catalogo-investigacion-ARCHIVO", "CPU_fotos-bestbuy_2026-09-13")

cat = json.load(open(CAT, encoding="utf-8"))
total = 0
for idx, fotos in ACEPTADAS.items():
    p = cat[idx]
    carpeta = os.path.dirname(p["imagenes_local"]["high"][0])            # imagenes/procesadores/<gama>/high
    media = carpeta.replace("/high", "/medium")
    for n, es_chip in fotos:
        o = os.path.join(ORIG, p["mpn"], f"{n:02d}.jpg")
        nombre = f"AMD_{p['mpn']}_BBY_{n}.jpg"
        rh, rm = f"{carpeta}/{nombre}", f"{media}/{nombre}"
        if ESCRIBIR:
            os.makedirs(os.path.join(BASE, media), exist_ok=True)
            shutil.copy2(o, os.path.join(BASE, rh))
            im = Image.open(o).convert("RGB"); im.thumbnail((500, 500))
            im.save(os.path.join(BASE, rm), quality=88)
        p["imagenes_local"]["high"].append(rh)
        p["imagenes_local"].setdefault("medium", []).append(rm)
        if es_chip:
            p["imagen_principal"] = rh
        total += 1
    p["n_fotos"] = len(p["imagenes_local"]["high"])
    p["n_imagenes"] = p["n_fotos"] + len(p["imagenes_local"]["medium"])
    print(f"  #{idx} {p['modelo']:18} -> {p['n_fotos']} fotos"
          + ("  (principal = chip)" if any(c for _, c in fotos) else ""))

print(f"\n{total} fotos nuevas")
if not ESCRIBIR:
    print("(simulación: no se ha copiado ni escrito nada; añade --escribir)")
    sys.exit()
sello = datetime.datetime.now().strftime("%Y%m%d-%H%M")
shutil.copy2(CAT, os.path.join(BASE, f"catalogo-final.BACKUP-{sello}-antes-fotos-cpu.json"))
json.dump(cat, open(CAT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"HECHO. Backup: catalogo-final.BACKUP-{sello}-antes-fotos-cpu.json")
