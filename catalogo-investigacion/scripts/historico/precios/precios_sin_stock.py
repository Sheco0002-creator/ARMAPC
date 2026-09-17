"""Precios tomados de tiendas AGOTADAS: se conservan pero se avisan (decisión del usuario, 2026-09-13).

12 de los 215 precios en US$ salieron de una tienda sin stock en la fecha (nota "agotado" en
precio_usd_nota). Opción 2 elegida por el usuario: mantener el precio de lista y marcarlo, para que la web
muestre "Sin stock en EE.UU. · precio de lista" en vez de presentarlo como precio vigente.

Campos nuevos (sólo en esos 12):
  precio_usd_sin_stock: true
  precio_usd_aviso:     texto para la tarjeta
  precio_usd_ultimo_con_stock: {valor, tienda, fecha}  (sólo donde se ha comprobado; hoy la PNY 5090)
PNY RTX 5090 (VCG509032TFXXPB1-O): historial de PCPartPicker revisado el 13-09 — B&H subió la lista a
US$ 4.999,99 el 25-08 ya sin stock; el último precio con stock fue Newegg US$ 4.199,99 el 10-07-2026.
python precios_sin_stock.py [--escribir]
"""
import datetime, json, os, shutil, sys

sys.stdout.reconfigure(encoding="utf-8")
ESCRIBIR = "--escribir" in sys.argv
BASE = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo"
CAT = os.path.join(BASE, "catalogo-final.json")
AVISO = "Sin stock en EE.UU. · precio de lista"
ULTIMO = {"VCG509032TFXXPB1-O": {"valor": 4199.99, "tienda": "Newegg", "fecha": "2026-07-10",
                                 "fuente": "historial de precios de PCPartPicker, revisado 2026-09-13"}}

cat = json.load(open(CAT, encoding="utf-8"))
marcados = [p for p in cat if p.get("precio_usd") and "agotado" in (p.get("precio_usd_nota") or "").lower()]
assert len(marcados) == 12, len(marcados)
for p in marcados:
    p["precio_usd_sin_stock"] = True
    p["precio_usd_aviso"] = AVISO
    if p["mpn"] in ULTIMO:
        p["precio_usd_ultimo_con_stock"] = ULTIMO[p["mpn"]]
    print(f"  {p['marca']} {p['modelo'][:42]:42} US$ {p['precio_usd']:>8}"
          + (f"  (último con stock US$ {ULTIMO[p['mpn']]['valor']}, {ULTIMO[p['mpn']]['fecha']})" if p["mpn"] in ULTIMO else ""))
assert "VCG509032TFXXPB1-O" in {p["mpn"] for p in marcados}

if not ESCRIBIR:
    print("\n(simulación: no se ha escrito nada; añade --escribir)")
    sys.exit()
sello = datetime.datetime.now().strftime("%Y%m%d-%H%M")
shutil.copy2(CAT, os.path.join(BASE, f"catalogo-final.BACKUP-{sello}-antes-precios-sin-stock.json"))
json.dump(cat, open(CAT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"\nHECHO. Backup: catalogo-final.BACKUP-{sello}-antes-precios-sin-stock.json")
