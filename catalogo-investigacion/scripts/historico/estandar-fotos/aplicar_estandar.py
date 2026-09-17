"""Aplica el estándar de fotos (2026-09-12).
Se quedan: fotos del producto >= 900 px, cajas (aceptadas) y fotos ambientadas.
Fuera: < 900 px, sellos/logos sobrepuestos, QR, accesorios, diagramas, banners, otro producto, cantos sin detalle.
Lo que sale se MUEVE a JORGE (pruebas-y-superados/IMAGENES-fuera-de-estandar_2026-09-12/), verificado por MD5.
Productos sin ninguna foto -> imagen genérica de su categoría (imagen_generica: true).
Uso: python aplicar_estandar.py            (simulación)
     python aplicar_estandar.py --escribir"""
import json, os, sys, shutil, hashlib, subprocess, collections, datetime
sys.stdout.reconfigure(encoding="utf-8")
ESCRIBIR = "--escribir" in sys.argv
D = os.path.dirname(os.path.abspath(__file__))
BASE = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo"
CAT = os.path.join(BASE, "catalogo-final.json")
M = {r["i"]: r for r in json.load(open(os.path.join(D, "medidas2.json"), encoding="utf-8"))}
EXC0 = json.load(open(os.path.join(D, "clasificacion.json"), encoding="utf-8"))["EXC"]

ES_CAJA = {k for k, v in EXC0.items() if v == "CAJA"}          # para no elegirlas como principal
EXC = {k: v for k, v in EXC0.items() if v not in ("CAJA", "AMB")}
EXC["12.7"] = "ACC"                                              # caja + accesorios + manual
for k in ["0.1", "1.1", "2.1", "3.1", "4.1", "5.1", "26.1", "51.2", "52.2", "79.1", "80.1", "81.1", "82.1", "83.1", "84.1",
          "134.2", "145.1", "146.1", "151.1", "152.1", "153.1", "154.1", "155.1", "156.1", "157.1", "158.1", "160.1",
          "161.1", "167.1", "168.1", "169.1"]:
    EXC[k] = "SELLO"                                             # caja con sellos flotando encima

GEN = {"Placas base": "placas", "Tarjetas gráficas": "gpus", "Módulos de memoria": "ram", "Procesadores": "procesadores",
       "Fuentes de poder": "fuentes-poder", "Almacenamiento": "almacenamiento", "Gabinetes": "gabinetes", "Refrigeración": "refrigeracion"}
stem = lambda r: os.path.splitext(os.path.basename(r))[0]

def jorge():
    out = subprocess.run(["powershell", "-NoProfile", "-Command",
                          "(Get-Volume | Where-Object FileSystemLabel -eq 'JORGE').DriveLetter"], capture_output=True, text=True).stdout.strip()
    if not out: sys.exit("USB JORGE no conectado: no se mueve nada.")
    return out + ":\\"

def md5(p):
    h = hashlib.md5()
    with open(p, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""): h.update(b)
    return h.hexdigest()

cat = json.load(open(CAT, encoding="utf-8"))
salen, manifiesto, resumen, muertas = set(), [], [], set()
cambios = []
for i, p in enumerate(cat):
    m = M[i]; il = p["imagenes_local"]
    med = {stem(r): r for r in il.get("medium", [])}
    fuera_high, fuera_med = set(), set()
    for n, fo in enumerate(m["fotos"], 1):
        k = f"{i}.{n}"
        motivo = EXC.get(k) or ("BAJA" if fo["lado"] < 900 or fo["medium"] else None)
        if not motivo: continue
        if fo["medium"]:
            fuera_med.add(fo["ruta"])
        else:
            fuera_high.add(fo["ruta"])
            if stem(fo["ruta"]) in med: fuera_med.add(med[stem(fo["ruta"])])
        manifiesto.append(dict(producto=i, marca=p["marca"], modelo=p["modelo"], foto=k, motivo=motivo, ruta=fo["ruta"]))
    viva = lambda r: os.path.isfile(os.path.join(BASE, r))      # fuera también las que el usuario ya borró
    muertas.update(r for k in ("medium", "high") for r in il.get(k, []) if not viva(r))
    high = [r for r in il.get("high", []) if r not in fuera_high and viva(r)]
    medium = [r for r in il.get("medium", []) if r not in fuera_med and viva(r)]
    salen |= fuera_high | fuera_med
    # principal: primera foto válida que no sea caja; si todas son caja, la primera
    claves = {f["ruta"]: f"{i}.{n}" for n, f in enumerate(m["fotos"], 1)}
    principal = next((r for r in high if claves.get(r) not in ES_CAJA), high[0] if high else None)
    if principal:
        high.remove(principal); high.insert(0, principal)
        if stem(principal) in {stem(r) for r in medium}:
            mp = next(r for r in medium if stem(r) == stem(principal)); medium.remove(mp); medium.insert(0, mp)
    nuevo = dict(p)
    nuevo["imagenes_local"] = {"medium": medium, "high": high}
    nuevo["n_imagenes"] = len(medium) + len(high)
    nuevo["n_fotos"] = len(high)
    if principal:
        nuevo["imagen_principal"] = principal; nuevo["imagen_generica"] = False
    else:
        nuevo["imagen_principal"] = f"imagenes/_generica/{GEN[p['categoria']]}.png"; nuevo["imagen_generica"] = True
        nuevo["faltante"] = sorted(set(p.get("faltante", [])) | {"imagen"}); nuevo["completo"] = False
    cambios.append(nuevo)
    resumen.append((i, p["categoria"], p["marca"], p["modelo"], m["n"], len(high), p["imagen_principal"] != nuevo["imagen_principal"]))

# no mover un archivo que otro producto siga usando
usadas = {r for p in cambios for k in ("medium", "high") for r in p["imagenes_local"][k]}
compartidas = salen & usadas
salen -= usadas

cnt = collections.Counter(x["motivo"] for x in manifiesto)
print("Fotos fuera (sin contar copias de 500 px):", len(manifiesto), dict(cnt))
print("Archivos a mover (incl. copias de 500 px):", len(salen), "| compartidos que se quedan:", len(compartidas),
      "| rutas de fotos ya borradas que se limpian:", len(muertas))
por = collections.OrderedDict()
for r in resumen: por.setdefault(r[1], []).append(r)
for c, rs in por.items():
    print(f"  {c:20} sin foto={sum(1 for r in rs if r[5]==0):2}  1-2 fotos={sum(1 for r in rs if 1<=r[5]<=2):2}  3+={sum(1 for r in rs if r[5]>=3):3}  principal cambia={sum(r[6] for r in rs):3}")
print("Con imagen genérica:", [f"{r[2]} {r[3]}" for r in resumen if r[5] == 0])

if not ESCRIBIR:
    print("\n(simulación: no se ha tocado nada)"); sys.exit()

# 1) copia de seguridad
sello = datetime.datetime.now().strftime("%Y%m%d-%H%M")
shutil.copy2(CAT, os.path.join(BASE, f"catalogo-final.BACKUP-{sello}-antes-estandar-fotos.json"))
# 2) mover a JORGE con verificación
DEST = os.path.join(jorge(), "catalogo-investigacion-ARCHIVO", "pruebas-y-superados", "IMAGENES-fuera-de-estandar_2026-09-12")
movidos = 0
for r in sorted(salen):
    src = os.path.join(BASE, r); dst = os.path.join(DEST, r)
    if not os.path.isfile(src): continue
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copy2(src, dst)
    if os.path.getsize(dst) != os.path.getsize(src) or md5(dst) != md5(src):
        sys.exit(f"Copia no verificada, se detiene sin borrar: {r}")
    os.remove(src); movidos += 1
json.dump(dict(fecha="2026-09-12", regla="fuera: <900 px, sellos/logos encima, QR, accesorios, diagramas, banners, otro producto, cantos; cajas y ambientadas se quedan",
               fotos=manifiesto), open(os.path.join(DEST, "MANIFIESTO.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
# 3) catálogo
json.dump(cambios, open(CAT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"\nMovidos a JORGE: {movidos} -> {DEST}\nCatálogo escrito. Backup: catalogo-final.BACKUP-{sello}-antes-estandar-fotos.json")
