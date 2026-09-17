"""Integra las fotos Kingston FURY Beast revisadas a ojo (2026-09-13), de kingston_fotos.py.

Las 20 cumplen el estándar (2048 px; la del blíster es de caja, vale). Fuera: la vista 5 (módulo suelto
en ángulo) porque es la foto que ya tenían (dHash 0), y la 97.1 porque de frente el kit DDR4 se ve igual
que un módulo suelto (repite la 97.4).
Principal: el kit en ángulo (vista 2), porque el producto es un kit de 2 y la anterior mostraba 1 módulo.
python kingston_integrar.py [--escribir]
"""
import json, os, shutil, sys, datetime, subprocess
from PIL import Image

sys.stdout.reconfigure(encoding="utf-8")
ESCRIBIR = "--escribir" in sys.argv
BASE = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo"
CAT = os.path.join(BASE, "catalogo-final.json")
ACEPTADAS = {81: [2, 1, 3, 4], 85: [2, 1, 3, 4], 94: [2, 1, 3, 4], 97: [2, 3, 4]}   # la primera = principal

L = subprocess.run(["powershell", "-NoProfile", "-Command",
                    "(Get-Volume | Where-Object FileSystemLabel -eq 'JORGE').DriveLetter"],
                   capture_output=True, text=True).stdout.strip()
if not L:
    sys.exit("USB JORGE no conectado.")
ORIG = os.path.join(f"{L}:\\", "catalogo-investigacion-ARCHIVO", "RAM_fotos-kingston_2026-09-13")

cat = json.load(open(CAT, encoding="utf-8"))
total = 0
for idx, fotos in ACEPTADAS.items():
    p = cat[idx]
    alta = f"imagenes/ram/{p['gama']}/high"
    media = alta.replace("/high", "/medium")
    nuevas = []
    for n in fotos:
        o = os.path.join(ORIG, p["mpn"].replace("/", "_"), f"{n:02d}.jpg")
        nombre = f"KINGSTON_{p['mpn'].replace('/', '_')}_FAB_{n}.jpg"
        rh, rm = f"{alta}/{nombre}", f"{media}/{nombre}"
        if ESCRIBIR:
            os.makedirs(os.path.join(BASE, media), exist_ok=True)
            shutil.copy2(o, os.path.join(BASE, rh))
            im = Image.open(o).convert("RGB"); im.thumbnail((500, 500))
            im.save(os.path.join(BASE, rm), quality=88)
        nuevas.append(rh)
        p["imagenes_local"].setdefault("medium", []).append(rm)
        total += 1
    # la principal va primera en la galería
    p["imagenes_local"]["high"] = [nuevas[0]] + p["imagenes_local"]["high"] + nuevas[1:]
    p["imagen_principal"] = nuevas[0]
    p["n_fotos"] = len(p["imagenes_local"]["high"])
    p["n_imagenes"] = p["n_fotos"] + len(p["imagenes_local"]["medium"])
    p["fotos_fuente"] = "media.kingston.com (galería FURY Beast por color/EXPO/kit), 2026-09-13"
    print(f"  #{idx} {p['modelo'][:44]:44} -> {p['n_fotos']} fotos (principal = kit en ángulo)")

print(f"\n{total} fotos nuevas")
if not ESCRIBIR:
    print("(simulación: no se ha copiado ni escrito nada; añade --escribir)")
    sys.exit()
sello = datetime.datetime.now().strftime("%Y%m%d-%H%M")
shutil.copy2(CAT, os.path.join(BASE, f"catalogo-final.BACKUP-{sello}-antes-fotos-kingston.json"))
json.dump(cat, open(CAT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"HECHO. Backup: catalogo-final.BACKUP-{sello}-antes-fotos-kingston.json")
