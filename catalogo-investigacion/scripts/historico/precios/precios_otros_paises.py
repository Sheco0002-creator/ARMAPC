"""Precios de productos sin precio en EE.UU. tomados de PCPartPicker de otros países (2026-09-12).
Se convierte el precio local (con IVA) a dólares SIN impuestos, para que sea comparable con el de EE.UU.:
  usd = precio_local / (1 + IVA) × (USD por unidad de moneda, BCE)
Misma regla de tiendas: fuera MemoryC y 'Available soon'; el más bajo con stock, si no, precio de tienda agotado.
No se aceptan: sólo Amazon con tarjetas descatalogadas; distribuidores con precios viejos sin stock (Clove Technology).
Uso: python precios_otros_paises.py   (después: precios_pen.py)"""
import json, os, sys, shutil, datetime, subprocess
sys.stdout.reconfigure(encoding="utf-8")
BASE = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo"
CAT = os.path.join(BASE, "catalogo-final.json")
L = subprocess.run(["powershell", "-NoProfile", "-Command", "(Get-Volume | Where-Object FileSystemLabel -eq 'JORGE').DriveLetter"],
                   capture_output=True, text=True).stdout.strip()
BORR = f"{L}:\\catalogo-investigacion-ARCHIVO\\PRECIOS_pcpartpicker_2026-09-12.json"
EURUSD, EURGBP = 1.1592, 0.85815          # BCE, 11-09-2026
PAIS = {"DE": dict(moneda="EUR", simbolo="€", iva=0.19, usd=EURUSD, web="de.pcpartpicker.com (Alemania)"),
        "UK": dict(moneda="GBP", simbolo="£", iva=0.20, usd=EURUSD / EURGBP, web="uk.pcpartpicker.com (Reino Unido)")}
# índice: (país, precio local con IVA, s=stock/a=agotado, nº tiendas, tiendas, id pcpp, nota extra)
P = {
 6: ("DE", 107.08, "s", 10, "PC Componentes", "zFJgXL", ""), 24: ("DE", 229.00, "s", 1, "Galaxus", "ysvD4D", ""),
 51: ("DE", 356.19, "s", 7, "Galaxus", "rh7scf", ""), 56: ("DE", 707.99, "s", 8, "notebooksbilliger.de", "nXG2FT", ""),
 57: ("DE", 501.90, "s", 7, "Alza", "fpLp99", ""), 58: ("DE", 1482.96, "s", 8, "Galaxus", "D8YfrH", ""),
 59: ("DE", 5813.00, "s", 1, "Galaxus", "d6sMnQ", "una sola tienda"), 60: ("DE", 742.99, "s", 5, "Alternate/Galaxus", "2CcBD3", ""),
 61: ("DE", 496.90, "s", 7, "Alza", "CPzp99", ""), 64: ("DE", 1539.00, "s", 7, "Alza", "G3bypg", ""),
 65: ("DE", 5890.99, "s", 5, "Alternate", "wr62FT", ""), 77: ("DE", 855.99, "s", 4, "Computeruniverse", "sVTFf7", ""),
 79: ("DE", 5305.99, "s", 2, "Computeruniverse", "qkdMnQ", ""), 80: ("DE", 822.99, "s", 6, "Alternate", "QKXMnQ", ""),
 81: ("DE", 668.99, "s", 9, "PC Componentes", "zWrp99", ""), 83: ("DE", 1531.99, "s", 12, "Amazon Deutschland", "WDzp99", ""),
 84: ("DE", 1186.99, "s", 9, "Alternate/Galaxus", "mTm2FT", ""), 90: ("DE", 742.75, "s", 5, "Galaxus", "QPFCmG", ""),
 102: ("DE", 1570.45, "a", 1, "Proshop", "DGkqqs", ""), 105: ("DE", 876.37, "s", 6, "Amazon Deutschland", "4jxRsY", ""),
 191: ("DE", 265.80, "s", 4, "reichelt elektronik", "chzhP6", ""), 203: ("DE", 631.55, "s", 3, "Senetic", "fP9nTW", ""),
 246: ("DE", 74.81, "s", 11, "Galaxus", "Xm2j4D", ""), 266: ("DE", 289.46, "s", 10, "CS MEGASTORE", "tmFCmG", ""),
 20: ("DE", 246.73, "s", 7, "Galaxus/notebooksbilliger.de", "WjP8TW", "listada como Z890 AORUS ELITE WIFI7 (mismo modelo)"),
 153: ("DE", 197.89, "s", 5, "Alternate/Galaxus", "NyxxFT", ""),
 162: ("DE", 136.84, "s", 5, "Amazon Deutschland", "K3tLrH", "listada como PS-TPD-1200FNFAPU-3 (misma fuente, otro enchufe)"),
 173: ("DE", 167.90, "s", 2, "Alza", "ZwpQzy", ""),
 174: ("DE", 65.22, "s", 6, "Galaxus", "wVxxFT", "listada como MPE-7501-ACABW-3BUK (misma fuente, enchufe UK)"),
 221: ("DE", 199.90, "s", 4, "Amazon Deutschland", "cFGhP6", ""), 228: ("DE", 139.88, "s", 9, "Amazon Deutschland", "cPvD4D", ""),
 230: ("DE", 114.95, "s", 11, "PC Componentes", "JbkH99", ""), 235: ("DE", 507.89, "s", 2, "Alternate/Galaxus", "FNsMnQ", ""),
 243: ("DE", 28.90, "s", 14, "Alza", "N6bRsY", ""), 247: ("DE", 29.90, "s", 6, "Alza", "Y7Hp99", ""),
 248: ("DE", 59.90, "s", 5, "Alza", "GDFCmG", ""), 249: ("DE", 152.89, "s", 6, "Alternate/Galaxus/Proshop", "fLG2FT", ""),
 62: ("UK", 719.99, "s", 1, "Overclockers.co.uk", "Tw62FT", ""), 63: ("UK", 1199.99, "a", 1, "Overclockers.co.uk", "fr62FT", ""),
 113: ("UK", 229.99, "a", 1, "Overclockers.co.uk", "T6DnTW", ""),
}
cat = json.load(open(CAT, encoding="utf-8")); B = json.load(open(BORR, encoding="utf-8"))
sello = datetime.datetime.now().strftime("%Y%m%d-%H%M")
shutil.copy2(CAT, os.path.join(BASE, f"catalogo-final.BACKUP-{sello}-antes-otros-paises.json"))
shutil.copy2(BORR, BORR.replace(".json", f".BACKUP-{sello}.json"))
for p in cat:
    if p["precio_usd"] is not None and "precio_pais" not in p: p["precio_pais"] = "US"
for i, (pais, loc, tipo, n, tiendas, pid, extra) in P.items():
    c = PAIS[pais]; p = cat[i]
    usd = round(loc / (1 + c["iva"]) * c["usd"], 2)
    nota = (f"revisado en ficha ({c['web'].split(' ')[1].strip('()')}): {tiendas}" + (" (agotado; precio de tienda)" if tipo == "a" else f" (con stock, {n} tienda{'s' if n > 1 else ''})")
            + f"; {c['simbolo']}{loc:.2f} con IVA {int(c['iva']*100)} % → sin IVA → US$ al BCE 11-09-2026" + (f"; {extra}" if extra else ""))
    p.update(precio_usd=usd, precio_pais=pais, precio_original={"moneda": c["moneda"], "valor": loc, "iva_incluido": c["iva"]},
             precio_usd_fuente=c["web"], precio_usd_nota=nota, precio_usd_revisar=False, precio_verificado=True, precio_usd_fecha="2026-09-12")
    B["precios"][str(i)].update(usd=usd, pais=pais, local=loc, pcpp=pid, nota=nota)
    print(f"  #{i:3} {pais} {c['simbolo']}{loc:>8.2f} -> US$ {usd:>8.2f}  {p['marca']} {p['modelo'][:34]}")
B.setdefault("fuentes", []).append("Otros países 2026-09-12: de.pcpartpicker.com y uk.pcpartpicker.com para los sin precio en EE.UU.; precio local con IVA -> sin IVA -> USD (BCE)")
json.dump(cat, open(CAT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
json.dump(B, open(BORR, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"{len(P)} precios de otros países | con precio: {sum(p['precio_usd'] is not None for p in cat)}/{len(cat)} | backup {sello}")
