"""Resultado de revisar a mano los 4 precios dudosos, + revertir el del P310 (2026-09-12).

Los 4 dudosos resultaron ser TODOS productos distintos (variante sin WiFi, 5060 sin Ti, LT360 sin
VISION, LCD-C en vez de LCD-S). Se comprobó además por MPN que el producto correcto NO está en Perú.

Y al revisarlos salió un fallo mío peor: el precio del Crucial P310 4TB venía del MARKETPLACE de
Promart (vendedor "ProSmart", S/ 3.529 = US$ 886) y no de Promart, que tiene stock 0. El precio
oficial de ese SSD en EE.UU. es US$ 365. Es el mismo caso que MemoryC en PCPartPicker, que el
proyecto ya descartaba. Se revierte y se deja anotado.

python revision_manual.py [--escribir]
"""
import json, os, shutil, sys, datetime

sys.stdout.reconfigure(encoding="utf-8")
ESCRIBIR = "--escribir" in sys.argv
BASE = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo"
CAT = os.path.join(BASE, "catalogo-final.json")

NOTA_SIN = ("Producto de marca con venta en América, pero no hemos podido verificar precio ni en Perú "
            "ni en EE.UU. Consúltanos por disponibilidad y plazo antes de decidir.")

# (mpn, veredicto para el registro interno)
REVISADOS = [
    ("90MB1EG0-M0EAY0",
     "2026-09-12 revisado a mano: NO está en Perú. Infotec ofrece la PRIME B650M-A II sin WiFi "
     "(90MB1EH0-M0EAY0) y la B650M-AYW WIFI; Promart la PRIME B650M-A-CSM. Búsqueda por MPN: 0 resultados."),
    ("ZT-B50620H-10M",
     "2026-09-12 revisado a mano: NO está en Perú. Infotec sólo tiene la RTX 5060 (sin Ti) de 8GB "
     "(288-1N780-200Z6). Búsqueda por MPN: 0 resultados."),
    ("R-LT360VISION-BKAMMC-G-1",
     "2026-09-12 revisado a mano: NO está en Perú. Lo que hay es el LT360 ARGB Infinity "
     "(R-LT360-BKAMNC-G-1), otro modelo. Búsqueda por 'LT360 VISION' y por MPN: 0 resultados."),
    ("G89.GHS2LCDS36NB.00",
     "2026-09-12 revisado a mano: NO está en Perú. Sólo existe el HydroShift II LCD-C 360CL, que además "
     "es el modelo que retiramos por calidad de foto. Búsqueda por MPN: 0 resultados."),
]

# el precio aplicado que hay que deshacer
REVERTIR = ("CT4000P310SSD8", "P310 4TB")

cat = json.load(open(CAT, encoding="utf-8"))
por_mpn = {p["mpn"]: p for p in cat}

print("REVISADOS A MANO — los 4 siguen sin precio (coincidencias eran otros productos):\n")
for mpn, nota in REVISADOS:
    p = por_mpn.get(mpn)
    if not p:
        print(f"  !! no encuentro {mpn}"); continue
    p["precio_peru_revisado"] = nota
    print(f"  {p['marca']:9} {p['modelo'][:42]:42} -> {p['disponibilidad']}")

print("\nREVERTIR (precio de marketplace, no de la tienda):\n")
objetivo = next((p for p in cat if p["mpn"] == REVERTIR[0] or REVERTIR[1] in p["modelo"]), None)
if objetivo:
    print(f"  {objetivo['marca']} {objetivo['modelo']}")
    print(f"     antes: S/ {objetivo.get('precio_pen')} · US$ {objetivo.get('precio_usd')} · "
          f"{objetivo.get('disponibilidad')}")
    objetivo.update(
        precio_pen=None, precio_pen_sin_igv=None, precio_usd=None, precio_pais=None,
        precio_verificado=False, disponibilidad="importacion_global",
        disponibilidad_motivo="sin_precio_verificado", disponibilidad_nota=NOTA_SIN,
        precio_peru_revisado=("2026-09-12: el S/ 3.529 era del MARKETPLACE de Promart (vendedor "
                              "'ProSmart'), no de la tienda, que tiene stock 0. Equivale a US$ 886 "
                              "frente a los US$ 365 de precio oficial en EE.UU. Descartado por la misma "
                              "regla que MemoryC. Falta precio verificado."))
    objetivo.pop("precio_usd_nota", None)
    print(f"     ahora: sin precio · {objetivo['disponibilidad']}")
else:
    print("  !! no encuentro el P310 4TB")

if not ESCRIBIR:
    print("\n(simulación: no se ha escrito nada; añade --escribir)")
    sys.exit()

sello = datetime.datetime.now().strftime("%Y%m%d-%H%M")
shutil.copy2(CAT, os.path.join(BASE, f"catalogo-final.BACKUP-{sello}-antes-revision-manual.json"))
json.dump(cat, open(CAT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
import collections
print(f"\nHECHO. Niveles: {dict(collections.Counter(p['disponibilidad'] for p in cat))}")
print(f"Backup: catalogo-final.BACKUP-{sello}-antes-revision-manual.json")
