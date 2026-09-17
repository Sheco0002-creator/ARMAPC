"""Escribe los precios USD del borrador de JORGE en catalogo-final.json (con backup).
Campos nuevos: precio_usd, precio_usd_fecha, precio_usd_fuente, precio_usd_nota, precio_usd_revisar.
precio_verificado = hay precio_usd y no está marcado para revisar. precio_referencia (estimación vieja) no se toca."""
import json, os, sys, shutil, datetime
sys.stdout.reconfigure(encoding="utf-8")
BASE = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo"
CAT = os.path.join(BASE, "catalogo-final.json")
B = json.load(open(r"D:\catalogo-investigacion-ARCHIVO\PRECIOS_pcpartpicker_2026-09-12.json", encoding="utf-8"))["precios"]
REVISAR = {  # precio observado muy por encima de lo esperable
    32: "el doble que la 5060 Ti 16GB más barata ($580)", 56: "1,8x la 5060 Ti 16GB más barata ($580)",
    81: "1,9x la 5060 Ti 16GB más barata ($580)", 77: "2,3x la 5070 más barata ($840)",
    40: "RTX 4060 más cara que una 5060 Ti: stock residual", 51: "RX 7600 muy por encima de su gama: stock residual",
    53: "RX 7800 XT más cara que una RX 9070 XT: stock residual",
    5: "por debajo de la X870E Taichi Lite", 246: "muy por encima de la de 360 mm ($69.89)"}
cat = json.load(open(CAT, encoding="utf-8"))
sello = datetime.datetime.now().strftime("%Y%m%d-%H%M")
shutil.copy2(CAT, os.path.join(BASE, f"catalogo-final.BACKUP-{sello}-antes-precios-usd.json"))
n = r = 0
for i, p in enumerate(cat):
    b = B[str(i)]
    p["precio_usd"] = b["usd"]
    p["precio_usd_fecha"] = b["fecha"]
    p["precio_usd_fuente"] = "pcpartpicker.com (EE.UU., precio más bajo con stock)"
    nota = b.get("nota", "")
    if i in REVISAR: nota = ("REVISAR: " + REVISAR[i] + ("; " + nota if nota and not nota.startswith("REVISAR") else "")).strip()
    p["precio_usd_nota"] = nota
    p["precio_usd_revisar"] = i in REVISAR
    p["precio_verificado"] = b["usd"] is not None and i not in REVISAR
    n += b["usd"] is not None; r += i in REVISAR
json.dump(cat, open(CAT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"escritos: {n} con precio, {len(cat)-n} sin precio, {r} marcados REVISAR. Backup catalogo-final.BACKUP-{sello}-antes-precios-usd.json")
