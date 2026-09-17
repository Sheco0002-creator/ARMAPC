"""Dos ajustes de fotos de CPU aprobados por el usuario (2026-09-13).

1. Fuera los banners de 1200x675 del 9800X3D y del 9950X3D (CDN_1): son artes de campaña, no foto de
   producto. Se MUEVEN (high y medium) a JORGE pruebas-y-superados, no se borran.
2. El Ryzen 5 7600 sólo tenía la caja: recibe la foto del chip AM5 del 7600X (BBY_4). Es el mismo
   encapsulado y el disipador integrado sólo dice "AMD RYZEN", sin modelo. Pasa a foto principal.
python cpu_ajustes.py [--escribir]
"""
import json, os, shutil, sys, datetime, subprocess

sys.stdout.reconfigure(encoding="utf-8")
ESCRIBIR = "--escribir" in sys.argv
BASE = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo"
CAT = os.path.join(BASE, "catalogo-final.json")

BANNERS = {"100-100001084WOF": "AMD_100-100001084WOF_CDN_1.jpg", "100-100000719WOF": "AMD_100-100000719WOF_CDN_1.jpg"}
CHIP_ORIGEN, CHIP_DESTINO = ("100-100000593WOF", "AMD_100-100000593WOF_BBY_4.jpg"), "100-100001015BOX"

L = subprocess.run(["powershell", "-NoProfile", "-Command",
                    "(Get-Volume | Where-Object FileSystemLabel -eq 'JORGE').DriveLetter"],
                   capture_output=True, text=True).stdout.strip()
if not L:
    sys.exit("USB JORGE no conectado.")
SUPERADOS = os.path.join(f"{L}:\\", "catalogo-investigacion-ARCHIVO", "pruebas-y-superados", "CPU_banners_2026-09-13")

cat = json.load(open(CAT, encoding="utf-8"))
por_mpn = {p["mpn"]: p for p in cat}

for mpn, nombre in BANNERS.items():
    p = por_mpn[mpn]
    for tipo in ("high", "medium"):
        lista = p["imagenes_local"].get(tipo, [])
        ruta = next((r for r in lista if r.endswith("/" + nombre)), None)
        if not ruta:
            continue
        lista.remove(ruta)
        print(f"  mover {ruta}")
        if ESCRIBIR:
            os.makedirs(os.path.join(SUPERADOS, tipo), exist_ok=True)
            shutil.move(os.path.join(BASE, ruta), os.path.join(SUPERADOS, tipo, nombre))
    p["n_fotos"] = len(p["imagenes_local"]["high"])
    p["n_imagenes"] = p["n_fotos"] + len(p["imagenes_local"]["medium"])
    print(f"  #{p['modelo']} -> {p['n_fotos']} fotos")

o, d = por_mpn[CHIP_ORIGEN[0]], por_mpn[CHIP_DESTINO]
nuevo = f"AMD_{CHIP_DESTINO}_CHIP-AM5.jpg"
for tipo in ("high", "medium"):
    src = next(r for r in o["imagenes_local"][tipo] if r.endswith("/" + CHIP_ORIGEN[1]))
    # muchas fichas no tienen versión medium de las fotos originales: la carpeta sale de la de high
    dst = os.path.dirname(d["imagenes_local"]["high"][0]).replace("/high", f"/{tipo}") + "/" + nuevo
    print(f"  copiar {src} -> {dst}")
    if ESCRIBIR:
        shutil.copy2(os.path.join(BASE, src), os.path.join(BASE, dst))
    d["imagenes_local"][tipo].append(dst)
    if tipo == "high":
        d["imagen_principal"] = dst
d["n_fotos"] = len(d["imagenes_local"]["high"])
d["n_imagenes"] = d["n_fotos"] + len(d["imagenes_local"]["medium"])
d["imagen_compartida"] = "Foto del chip AM5 tomada del Ryzen 5 7600X (mismo encapsulado; no muestra el modelo)."
print(f"  {d['modelo']} -> {d['n_fotos']} fotos (principal = chip)")

if not ESCRIBIR:
    print("\n(simulación: no se ha movido ni escrito nada; añade --escribir)")
    sys.exit()
sello = datetime.datetime.now().strftime("%Y%m%d-%H%M")
shutil.copy2(CAT, os.path.join(BASE, f"catalogo-final.BACKUP-{sello}-antes-ajustes-cpu.json"))
json.dump(cat, open(CAT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"\nHECHO. Backup: catalogo-final.BACKUP-{sello}-antes-ajustes-cpu.json")
