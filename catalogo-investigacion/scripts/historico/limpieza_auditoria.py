"""Limpieza aprobada por el usuario tras la auditoría del 2026-09-13 (puntos 1-4 y 7).

1. 12 fotos duplicadas dentro del mismo producto (misma imagen dos veces; a veces PNG + JPG) y
7. la foto del ventilador suelto (accesorio) de DeepCool AK400 G2 y AK620 G2 (CDN_7)
   -> se MUEVEN (high y su medium, si hay) a JORGE pruebas-y-superados/ con MANIFIESTO.json.
   En la CX550 se quita la copia pequeña (CDN_2, 1824 px), que era la principal: pasa a serlo CDN_7 (2000 px).
2. Backups del catálogo: se quedan los 3 más recientes (el de esta limpieza incluido); el resto a JORGE.
3. Restos: `catalogo/=900px=` (vacío), `scripts/__pycache__/`, `scripts/precios/out.json` -> JORGE.
4. n_specs recontado en todo el catálogo (#95 y #96 estaban desfasados).
Nada se borra: todo va a JORGE.
python limpieza_auditoria.py [--escribir]
"""
import datetime, glob, json, os, shutil, subprocess, sys

sys.stdout.reconfigure(encoding="utf-8")
ESCRIBIR = "--escribir" in sys.argv
RAIZ = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion"
BASE = os.path.join(RAIZ, "catalogo")
CAT = os.path.join(BASE, "catalogo-final.json")

# (referencia, foto a quitar, motivo); el producto se localiza por la foto
QUITAR = [
    ("90MB1J30-M0EAY0", "ASUS_90MB1J30-M0EAY0_INT_10.jpg", "duplicada de INT_9"),
    ("NE75080S19T2-GB2031A", "PALIT_NE75080S19T2-GB2031A_CDN_7.png", "duplicada de CDN_4"),
    ("CP-9020277-NA", "CORSAIR_CP-9020277-NA_CDN_2.jpg", "duplicada de CDN_7 y más pequeña (1824 px)"),
    ("COREREACTORII650G-BKCUS", "XPG_COREREACTORII650G-BKCUS_CDN_3.jpg", "duplicada de CDN_1"),
    ("COREREACTORII850G-BKCUS", "XPG_COREREACTORII850G-BKCUS_CDN_7.jpg", "duplicada de CDN_5"),
    ("COREREACTORII1000G-BKCUS", "XPG_COREREACTORII1000G-BKCUS_CDN_3.jpg", "duplicada de CDN_1"),
    ("COREREACTORII1200G-BKCUS", "XPG_COREREACTORII1200G-BKCUS_CDN_3.jpg", "duplicada de CDN_1"),
    ("AX-120R-DIG-BLK", "THERMALRIGHT_AX-120R-DIG-BLK_CDN_6.jpg", "copia JPG de CDN_1.png"),
    ("PA120-DIG-ARGB", "THERMALRIGHT_PA120-DIG-ARGB_CDN_4.jpg", "copia JPG de CDN_1.png"),
    ("PS-120-SE-ARGB", "THERMALRIGHT_PS-120-SE-ARGB_CDN_6.jpg", "copia JPG de CDN_1.png"),
    ("TV360-ARGB-BK", "THERMALRIGHT_TV360-ARGB-BK_CDN_2.jpg", "copia JPG de CDN_1.png"),
    ("RX-76PSWFTFY", "XFX_RX-76PSWFTFY_TDA_6.jpg", "duplicada de TDA_1"),
    ("R-AK400G2-BKNNMN-GJD", "DEEPCOOL_R-AK400G2-BKNNMN-GJD_CDN_7.jpg", "ventilador suelto (accesorio)"),
    ("R-AK620G2-BKNNMN-GJD", "DEEPCOOL_R-AK620G2-BKNNMN-GJD_CDN_7.jpg", "ventilador suelto (accesorio)"),
]
NUEVA_PRINCIPAL = {"CP-9020277-NA": "CORSAIR_CP-9020277-NA_CDN_7.jpg"}   # por MPN del catálogo
RESTOS = [os.path.join(BASE, "=900px="), os.path.join(RAIZ, "scripts", "__pycache__"),
          os.path.join(RAIZ, "scripts", "precios", "out.json")]
BACKUPS_QUE_QUEDAN = 3

L = subprocess.run(["powershell", "-NoProfile", "-Command",
                    "(Get-Volume | Where-Object FileSystemLabel -eq 'JORGE').DriveLetter"],
                   capture_output=True, text=True).stdout.strip()
if not L:
    sys.exit("USB JORGE no conectado: no se mueve nada.")
SUP = os.path.join(f"{L}:\\", "catalogo-investigacion-ARCHIVO", "pruebas-y-superados")
D_FOTOS = os.path.join(SUP, "DUPLICADOS-auditoria_2026-09-13")
D_BACKUPS = os.path.join(SUP, "BACKUPS-catalogo-antiguos_2026-09-13")
D_RESTOS = os.path.join(SUP, "RESTOS-auditoria_2026-09-13")


def mover(src, carpeta, rel=None):
    dst = os.path.join(carpeta, rel or os.path.basename(src))
    print(f"    mover {os.path.relpath(src, RAIZ)}")
    if ESCRIBIR:
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.move(src, dst)


cat = json.load(open(CAT, encoding="utf-8"))
manifiesto = []

print("1+7) FOTOS")
for mpn, foto, motivo in QUITAR:
    # el producto se busca por la foto (en Thermalright el MPN del catálogo no es el del nombre de archivo)
    dueños = [q for q in cat if any(r.endswith("/" + foto) for r in q["imagenes_local"]["high"])]
    assert len(dueños) == 1, (foto, len(dueños))
    p = dueños[0]; mpn = p["mpn"]
    stem = os.path.splitext(foto)[0]
    for tipo in ("high", "medium"):
        lista = p["imagenes_local"].get(tipo, [])
        for ruta in [r for r in lista if os.path.splitext(os.path.basename(r))[0] == stem]:
            lista.remove(ruta)
            mover(os.path.join(BASE, ruta), D_FOTOS, ruta.replace("/", os.sep))
            manifiesto.append({"producto": f"{p['marca']} {p['modelo']}", "mpn": mpn, "foto": ruta, "motivo": motivo})
    if mpn in NUEVA_PRINCIPAL:
        alta = p["imagenes_local"]["high"]
        nueva = next(r for r in alta if r.endswith("/" + NUEVA_PRINCIPAL[mpn]))
        alta.remove(nueva); alta.insert(0, nueva)
        p["imagen_principal"] = nueva
    assert p["imagen_principal"] in p["imagenes_local"]["high"], mpn
    p["n_fotos"] = len(p["imagenes_local"]["high"])
    p["n_imagenes"] = p["n_fotos"] + len(p["imagenes_local"].get("medium", []))
    print(f"  {p['marca']} {p['modelo'][:34]:34} -> {p['n_fotos']} fotos ({motivo})")

print("\n4) n_specs")
for p in cat:
    if "n_specs" in p and p["n_specs"] != len(p.get("specs", {})):
        print(f"  {p['modelo']}: {p['n_specs']} -> {len(p['specs'])}")
        p["n_specs"] = len(p["specs"])

sello = datetime.datetime.now().strftime("%Y%m%d-%H%M")
nuevo_bk = os.path.join(BASE, f"catalogo-final.BACKUP-{sello}-antes-limpieza-auditoria.json")
if ESCRIBIR:
    shutil.copy2(CAT, nuevo_bk)
    json.dump(cat, open(CAT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

print(f"\n2) BACKUPS (se quedan los {BACKUPS_QUE_QUEDAN} más recientes)")
bks = sorted(glob.glob(os.path.join(BASE, "catalogo-final.BACKUP-*.json")) + ([] if ESCRIBIR else [nuevo_bk]))
for b in bks[:-BACKUPS_QUE_QUEDAN]:
    mover(b, D_BACKUPS)
print("  se quedan:", [os.path.basename(b) for b in bks[-BACKUPS_QUE_QUEDAN:]])

print("\n3) RESTOS")
for r in RESTOS:
    if os.path.exists(r):
        mover(r, D_RESTOS, os.path.relpath(r, RAIZ))

print(f"\n{len(manifiesto)} fotos movidas (con su medium) · {len(bks) - BACKUPS_QUE_QUEDAN} backups · restos")
if not ESCRIBIR:
    print("(simulación: no se ha movido ni escrito nada; añade --escribir)")
    sys.exit()
json.dump(manifiesto, open(os.path.join(D_FOTOS, "MANIFIESTO.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"HECHO. Backup: {os.path.basename(nuevo_bk)} · manifiesto en {D_FOTOS}")
