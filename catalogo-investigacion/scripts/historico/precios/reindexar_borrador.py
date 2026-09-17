"""Reindexa el borrador de precios de JORGE por MPN en vez de por índice del catálogo.

El borrador `PRECIOS_pcpartpicker_2026-09-12.json` usaba el índice del catálogo como clave. Al retirar
los 14 descatalogados (scripts/limpieza_region.py) los índices se desplazaron y quedó desalineado.
Se reconstruye con el catálogo ANTERIOR a la limpieza, y la clave pasa a ser el MPN (estable).

python reindexar_borrador.py [--escribir]
"""
import json, os, sys, shutil, datetime, subprocess

sys.stdout.reconfigure(encoding="utf-8")
ESCRIBIR = "--escribir" in sys.argv
BASE = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo"
ANTES = os.path.join(BASE, "catalogo-final.BACKUP-20260912-1534-antes-limpieza-region.json")
AHORA = os.path.join(BASE, "catalogo-final.json")

L = subprocess.run(["powershell", "-NoProfile", "-Command",
                    "(Get-Volume | Where-Object FileSystemLabel -eq 'JORGE').DriveLetter"],
                   capture_output=True, text=True).stdout.strip()
if not L:
    sys.exit("USB JORGE no conectado.")
BORR = f"{L}:\\catalogo-investigacion-ARCHIVO\\PRECIOS_pcpartpicker_2026-09-12.json"

viejo = json.load(open(ANTES, encoding="utf-8"))
nuevo = json.load(open(AHORA, encoding="utf-8"))
b = json.load(open(BORR, encoding="utf-8"))
vivos = {p["mpn"] for p in nuevo}

precios, retirados, huerfanos = {}, {}, 0
for k, v in b["precios"].items():
    i = int(k)
    if i >= len(viejo):
        huerfanos += 1
        continue
    p = viejo[i]
    v = dict(v, marca=p["marca"], modelo=p["modelo"], categoria=p["categoria"], ean=p.get("ean"))
    (precios if p["mpn"] in vivos else retirados)[p["mpn"]] = v

print(f"borrador: {len(b['precios'])} entradas por índice")
print(f"  -> {len(precios)} por MPN (productos vivos)")
print(f"  -> {len(retirados)} de productos retirados (se guardan aparte, no se pierden)")
print(f"  -> {huerfanos} huérfanas descartadas")
if not ESCRIBIR:
    print("\n(simulación: no se ha escrito nada; añade --escribir)")
    sys.exit()

sello = datetime.datetime.now().strftime("%Y%m%d-%H%M")
shutil.copy2(BORR, BORR.replace(".json", f".BACKUP-{sello}-antes-reindexar.json"))
b["_clave"] = "MPN del producto (antes: índice del catálogo, desalineado tras retirar los descatalogados)"
b["precios"] = precios
b["precios_productos_retirados"] = retirados
b.setdefault("fuentes", []).append(
    f"Reindexado por MPN el {datetime.date.today()}: los índices dejaron de servir al retirar 14 descatalogados.")
json.dump(b, open(BORR, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"\nHECHO. Borrador reindexado por MPN. Backup: {os.path.basename(BORR).replace('.json', f'.BACKUP-{sello}-antes-reindexar.json')}")
