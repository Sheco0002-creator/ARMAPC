"""Aplica la revisión de TODAS las fichas de PCPartPicker (2026-09-12, 200 productos con precio).
Regla (misma que precios_revision.py): se descarta MemoryC y 'Available soon'; precio = el más bajo con
stock en el resto de tiendas; si ninguna tiene stock, el precio de tienda más bajo anotado como agotado;
si no queda nada, sin precio. Caso manual: MSI RTX 4080 Super (sólo Amazon, stock residual) -> sin precio.
python precios_fichas.py <fichas_decision.json>   (después: precios_pen.py para los soles)"""
import json, os, sys, shutil, datetime, subprocess
sys.stdout.reconfigure(encoding="utf-8")
BASE = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo"
CAT = os.path.join(BASE, "catalogo-final.json")
L = subprocess.run(["powershell", "-NoProfile", "-Command", "(Get-Volume | Where-Object FileSystemLabel -eq 'JORGE').DriveLetter"],
                   capture_output=True, text=True).stdout.strip()
BORR = f"{L}:\\catalogo-investigacion-ARCHIVO\\PRECIOS_pcpartpicker_2026-09-12.json"
DEC = json.load(open(sys.argv[1], encoding="utf-8"))
MANUAL = {44: "revisado en ficha: sólo Amazon $1795 (stock residual de una tarjeta descatalogada) — no se publica"}
cat = json.load(open(CAT, encoding="utf-8")); B = json.load(open(BORR, encoding="utf-8"))
sello = datetime.datetime.now().strftime("%Y%m%d-%H%M")
shutil.copy2(CAT, os.path.join(BASE, f"catalogo-final.BACKUP-{sello}-antes-revision-fichas.json"))
shutil.copy2(BORR, BORR.replace(".json", f".BACKUP-{sello}.json"))
cambios = []
for k, (p, tipo, tiendas) in DEC.items():
    i = int(k); prod = cat[i]; b = B["precios"][k]
    previa = prod.get("precio_usd_nota", "")
    extra = "" if (not previa or previa.startswith("revisado")) else f" | {previa}"
    if i in MANUAL:
        p, nota = None, MANUAL[i]
    elif p is None:
        nota = f"revisado en ficha: sólo MemoryC o sin stock (antes ${prod['precio_usd']}) — no se publica"
    else:
        nota = f"revisado en ficha: {tiendas}" + (" (agotado en la fecha; precio de tienda)" if tipo == "a" else " (con stock)")
    nota += extra
    if prod["precio_usd"] != p: cambios.append((i, prod["modelo"], prod["precio_usd"], p))
    prod["precio_usd"] = p; b["usd"] = p
    prod["precio_usd_nota"] = nota; b["nota"] = nota
    prod["precio_usd_revisar"] = False
    prod["precio_verificado"] = p is not None
    prod["precio_usd_fuente"] = "pcpartpicker.com (EE.UU.), revisado tienda por tienda en la ficha"
B.setdefault("fuentes", []).append("Revisión completa 2026-09-12: 200 fichas de producto (worker en la página, 1 cada ~10 s); regla sin MemoryC ni 'Available soon'")
json.dump(cat, open(CAT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
json.dump(B, open(BORR, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for c in cambios: print(f"  #{c[0]:3} {c[1][:40]:40} {c[2]} -> {c[3]}")
print(f"{len(cambios)} cambios | con precio: {sum(p['precio_usd'] is not None for p in cat)}/{len(cat)} | backup {sello}")
