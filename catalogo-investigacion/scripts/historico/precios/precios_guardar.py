"""Mezcla precios nuevos en el borrador de JORGE.
python precios_guardar.py <nuevos.json> "<descripción de la fuente>"
nuevos.json = {"<idx>": [precio|null, "<id pcpartpicker>"|null, "nota opcional"]}"""
import json, os, sys, subprocess
sys.stdout.reconfigure(encoding="utf-8")
L = subprocess.run(["powershell", "-NoProfile", "-Command", "(Get-Volume | Where-Object FileSystemLabel -eq 'JORGE').DriveLetter"],
                   capture_output=True, text=True).stdout.strip()
if not L: sys.exit("JORGE no conectado")
DST = f"{L}:\\catalogo-investigacion-ARCHIVO\\PRECIOS_pcpartpicker_2026-09-12.json"
VIEJO = f"{L}:\\catalogo-investigacion-ARCHIVO\\PRECIOS_pcpartpicker_2026-09-11.json"
cat = json.load(open(r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo\catalogo-final.json", encoding="utf-8"))
if os.path.exists(DST):
    B = json.load(open(DST, encoding="utf-8"))
else:                                    # arranca con lo del 11-09
    v = json.load(open(VIEJO, encoding="utf-8"))
    B = {"_fuente": "pcpartpicker.com (EE.UU.), precio más bajo con stock en la lista de categoría; cruce por MPN en el enlace del producto",
         "precios": {}}
    for k, val in v.items():
        if k.startswith("_"): continue
        num = None; nota = ""
        if isinstance(val, str):
            try: num = float(val.split()[0])
            except ValueError: pass
            nota = " ".join(val.split()[1:])
        B["precios"][k] = {"usd": num, "fecha": "2026-09-11", "pcpp": None, "nota": nota or ("sin stock / no listado" if num is None else ""),
                           "producto": f"{cat[int(k)]['marca']} {cat[int(k)]['modelo']}"}
N = json.load(open(sys.argv[1], encoding="utf-8"))
for k, val in N.items():
    p, h = val[0], val[1]; nota = val[2] if len(val) > 2 else ("" if p is not None else "sin precio en EE.UU.")
    B["precios"][str(k)] = {"usd": p, "fecha": "2026-09-12", "pcpp": h, "nota": nota, "producto": f"{cat[int(k)]['marca']} {cat[int(k)]['modelo']}"}
if len(sys.argv) > 2: B.setdefault("fuentes", []).append(sys.argv[2])
json.dump(B, open(DST, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
con = sum(1 for x in B["precios"].values() if x["usd"] is not None)
print(f"{DST}: {len(B['precios'])} productos, {con} con precio")
