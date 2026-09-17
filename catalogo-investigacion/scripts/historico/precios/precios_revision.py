"""Revisión de precios sospechosos (2026-09-12) mirando la ficha de PCPartPicker (tiendas y stock).
Criterio: vale el precio de una tienda de referencia (Newegg, Best Buy, B&H, tienda de la marca, Amazon
con otras tiendas a precio parecido), con stock o, si no hay, su precio de tienda anotado como agotado.
No vale: sólo MemoryC (revendedor), sólo "Available soon", o sólo Amazon muy por encima del chip.
Actualiza catalogo-final.json y el borrador de JORGE. Después correr precios_pen.py para los soles."""
import json, os, sys, shutil, datetime, subprocess
sys.stdout.reconfigure(encoding="utf-8")
BASE = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo"
CAT = os.path.join(BASE, "catalogo-final.json")
L = subprocess.run(["powershell", "-NoProfile", "-Command", "(Get-Volume | Where-Object FileSystemLabel -eq 'JORGE').DriveLetter"],
                   capture_output=True, text=True).stdout.strip()
BORR = f"{L}:\\catalogo-investigacion-ARCHIVO\\PRECIOS_pcpartpicker_2026-09-12.json"

R = {  # índice: (precio aceptado o None, nota)
    5:   (287.19, "revisado: en stock en Amazon $287.19 y Newegg $299.99 (precio real)"),
    32:  (799.99, "revisado: precio de Best Buy $799.99 (agotado); en stock sólo MemoryC $1159.97"),
    76:  (879.99, "revisado: precio de la tienda ASUS $879.99 (agotado); Amazon $1069.99"),
    56:  (None, "revisado: sólo Amazon (marketplace) $1068.74 y MemoryC $1089.25 — sobreprecio, no se publica"),
    81:  (None, "revisado: sólo MemoryC $1125.76 — sobreprecio, no se publica"),
    77:  (None, "revisado: sólo Amazon 'Available soon' $1968 — sin stock, no se publica"),
    40:  (None, "revisado: sólo Amazon $695 (usada desde $439) — stock residual, no se publica"),
    51:  (None, "revisado: Amazon 'Available soon' y MemoryC $507.56 — no se publica"),
    53:  (None, "revisado: sólo Amazon $961.87 — stock residual, no se publica"),
    246: (None, "revisado: sólo MemoryC $230.71 — sobreprecio, no se publica (la de 360 mm sí es real: $69.89)"),
    57:  (None, "revisado: sólo MemoryC $717.32 y Amazon $764 — sobreprecio, no se publica"),
    61:  (None, "revisado: Amazon 'Available soon' $666.62 y MemoryC $672.74 — no se publica"),
    58:  (None, "revisado: Amazon 'Available soon' y MemoryC $2202.83 — no se publica"),
    83:  (None, "revisado: sólo Amazon $2288.88 (1,4x la 5080 más barata) — no se publica"),
    90:  (None, "revisado: sólo Amazon $898 (1,4x la RX 9070 más barata) — no se publica"),
    33:  ("=", "revisado: en stock en Newegg $799.99 (precio real)"),
    73:  ("=", "revisado: $829.99 en stock en Amazon, ASUS, B&H, Best Buy y Newegg (precio real)"),
    245: ("=", "revisado: en stock en Amazon $69.89; HYTE e iBUYPOWER $99.99 (precio real)"),
}
cat = json.load(open(CAT, encoding="utf-8"))
B = json.load(open(BORR, encoding="utf-8"))
sello = datetime.datetime.now().strftime("%Y%m%d-%H%M")
shutil.copy2(CAT, os.path.join(BASE, f"catalogo-final.BACKUP-{sello}-antes-revision-precios.json"))
shutil.copy2(BORR, BORR.replace(".json", f".BACKUP-{sello}.json"))
for i, (u, nota) in R.items():
    p, b = cat[i], B["precios"][str(i)]
    if u != "=":
        p["precio_usd"] = u; b["usd"] = u
    p["precio_usd_nota"] = nota; b["nota"] = nota
    p["precio_usd_revisar"] = False
    p["precio_verificado"] = p["precio_usd"] is not None
B.setdefault("fuentes", []).append("Revisión 2026-09-12: fichas de producto de 18 precios dudosos; se descartan MemoryC, 'Available soon' y Amazon-sólo con sobreprecio")
json.dump(cat, open(CAT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
json.dump(B, open(BORR, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
con = sum(p["precio_usd"] is not None for p in cat)
print(f"con precio USD: {con}/{len(cat)} | revisar pendientes: {sum(p.get('precio_usd_revisar', False) for p in cat)} | backup {sello}")
