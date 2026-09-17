import json, os, sys, collections
from PIL import Image
sys.stdout.reconfigure(encoding="utf-8")
BASE = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo"
DEST = r"D:\catalogo-investigacion-ARCHIVO\pruebas-y-superados\IMAGENES-fuera-de-estandar_2026-09-12"
cat = json.load(open(os.path.join(BASE, "catalogo-final.json"), encoding="utf-8"))
man = json.load(open(os.path.join(DEST, "MANIFIESTO.json"), encoding="utf-8"))["fotos"]

rotas, chicas, total, ref = [], [], 0, set()
for i, p in enumerate(cat):
    rutas = p["imagenes_local"]["high"] + p["imagenes_local"]["medium"] + [p["imagen_principal"]]
    for r in rutas:
        ref.add(os.path.normpath(r).lower())
        if not os.path.isfile(os.path.join(BASE, r)): rotas.append((i, r))
    for r in p["imagenes_local"]["high"]:
        total += 1
        with Image.open(os.path.join(BASE, r)) as im:
            if max(im.size) < 900: chicas.append((i, r, im.size))
    if p["imagen_generica"] != (not p["imagenes_local"]["high"]): print("incoherente", i)
    if p["imagenes_local"]["high"] and p["imagen_principal"] != p["imagenes_local"]["high"][0]: print("principal no es la 1ª", i)
print("rutas rotas:", len(rotas), rotas[:5])
print("fotos high < 900 px:", len(chicas), chicas[:5])
print("fotos high en catálogo:", total)
# lo del manifiesto: ¿sigue alguna referenciada o en disco?
sigue = [m for m in man if os.path.normpath(m["ruta"]).lower() in ref]
en_disco = [m["ruta"] for m in man if os.path.isfile(os.path.join(BASE, m["ruta"]))]
en_jorge = [m["ruta"] for m in man if os.path.isfile(os.path.join(DEST, m["ruta"]))]
print("excluidas aún referenciadas:", len(sigue), "| aún en C:", len(en_disco), "| en JORGE:", len(en_jorge), "de", len(man))
print("no están en JORGE:", [m["ruta"] for m in man if m["ruta"] not in en_jorge])
# huérfanos en disco
huerf = []
for root, _, files in os.walk(os.path.join(BASE, "imagenes")):
    for fn in files:
        rel = os.path.normpath(os.path.relpath(os.path.join(root, fn), BASE)).lower()
        if rel not in ref and "_generica" not in rel: huerf.append(rel)
print("archivos en imagenes/ sin referenciar:", len(huerf), huerf[:5])
c = collections.Counter(p["categoria"] for p in cat if p["imagen_generica"])
print("con imagen genérica:", dict(c), "| completos:", sum(p["completo"] for p in cat), "de", len(cat))
