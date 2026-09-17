r"""Mueve a JORGE las fotos del catálogo que la web no usa (decisión del usuario, 2026-09-13).

La web usa UNA foto por producto (la principal, `imagen_principal`, que exportar_web.py reduce
y copia a public/images/catalogo/). El resto de la galería -- las demás fotos `high` y todas
las copias `medium` -- no las usa nada y pesaban ~1,36 GB dentro de la carpeta de la web.
No se borra nada: se copian a JORGE, se comprueba cada copia por SHA-256 y sólo entonces se
quita el original. En catalogo-final.json cada producto conserva su principal en
`imagenes_local.high` y la lista de lo archivado en `imagenes_archivadas_jorge` (para poder
devolverlas a su sitio con las mismas rutas).

Se quedan en C: las principales (una por producto) y las 8 genéricas de `imagenes/_generica/`.

python archivar_fotos_no_usadas.py            -> sólo cuenta (no toca nada)
python archivar_fotos_no_usadas.py --aplicar  -> copia, verifica, mueve y actualiza el JSON
"""
import ctypes, hashlib, json, os, shutil, sys, time

sys.stdout.reconfigure(encoding="utf-8")
APLICAR = "--aplicar" in sys.argv
CATD = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo"
CAT = os.path.join(CATD, "catalogo-final.json")
NOMBRE_DESTINO = "FOTOS-CATALOGO-no-usadas-en-web_2026-09-13"


def unidad_jorge():
    """El USB se busca por etiqueta, nunca por letra (cambia según el orden de conexión)."""
    for letra in "DEFGHIJKLMNOPQRSTUVWXYZ":
        raiz = f"{letra}:\\"
        if not os.path.exists(raiz):
            continue
        etiqueta = ctypes.create_unicode_buffer(261)
        if ctypes.windll.kernel32.GetVolumeInformationW(raiz, etiqueta, 261, None, None, None, None, 0):
            if etiqueta.value == "JORGE":
                return raiz
    return None


def sha256(ruta):
    h = hashlib.sha256()
    with open(ruta, "rb") as f:
        for bloque in iter(lambda: f.read(1 << 20), b""):
            h.update(bloque)
    return h.hexdigest()


jorge = unidad_jorge()
if not jorge:
    sys.exit("JORGE no está conectado: no se mueve nada (regla: no guardar en otro sitio).")
ARCHIVO = os.path.join(jorge, "catalogo-investigacion-ARCHIVO")
DESTINO = os.path.join(ARCHIVO, NOMBRE_DESTINO)

cat = json.load(open(CAT, encoding="utf-8"))
principales = {p["imagen_principal"] for p in cat}
en_disco = []
for raiz, _, archivos in os.walk(os.path.join(CATD, "imagenes")):
    for a in archivos:
        en_disco.append(os.path.relpath(os.path.join(raiz, a), CATD).replace(os.sep, "/"))
mover = sorted(r for r in en_disco if r not in principales and not r.startswith("imagenes/_generica/"))
quedan = [r for r in en_disco if r not in mover]
peso = sum(os.path.getsize(os.path.join(CATD, r)) for r in mover)
print(f"JORGE en {jorge} · {len(en_disco)} fotos en catalogo/imagenes")
print(f"  se mueven: {len(mover)} ({peso / 2**20:,.0f} MB) · se quedan: {len(quedan)} "
      f"({sum(os.path.getsize(os.path.join(CATD, r)) for r in quedan) / 2**20:,.0f} MB)")
libre = shutil.disk_usage(jorge).free
if peso * 1.1 > libre:
    sys.exit(f"No hay sitio en JORGE: hacen falta {peso / 2**30:.2f} GB y hay {libre / 2**30:.2f} GB.")
if not APLICAR:
    sys.exit("(modo prueba: no se ha tocado nada; repetir con --aplicar)")

# 1) backup del catálogo (se guardan aquí los 3 últimos; el más viejo pasa a JORGE, ver README)
sello = time.strftime("%Y%m%d-%H%M")
backup = os.path.join(CATD, f"catalogo-final.BACKUP-{sello}-antes-archivar-fotos.json")
shutil.copy2(CAT, backup)
backups = sorted(f for f in os.listdir(CATD) if f.startswith("catalogo-final.BACKUP-"))
viejos = os.path.join(ARCHIVO, "pruebas-y-superados", "BACKUPS-catalogo-antiguos_2026-09-13")
os.makedirs(viejos, exist_ok=True)
for f in backups[:-3]:
    src, dst = os.path.join(CATD, f), os.path.join(viejos, f)
    shutil.copy2(src, dst)
    if sha256(src) != sha256(dst):
        sys.exit(f"La copia de {f} en JORGE no coincide: se detiene todo sin mover nada más.")
    os.remove(src)
    print(f"  backup antiguo a JORGE: {f}")

# 2) copiar TODO y verificar TODO antes de quitar ningún original
por_foto = {}
for p in cat:
    for tipo in ("high", "medium"):
        for r in p["imagenes_local"].get(tipo, []):
            por_foto.setdefault(r, []).append(p["slug"])
manifiesto = []
for i, r in enumerate(mover, 1):
    src, dst = os.path.join(CATD, r), os.path.join(DESTINO, r)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copy2(src, dst)
    h = sha256(src)
    if sha256(dst) != h:
        sys.exit(f"La copia de {r} no coincide por hash: se detiene sin haber quitado ningún original.")
    manifiesto.append({"ruta": r, "bytes": os.path.getsize(src), "sha256": h, "productos": por_foto.get(r, [])})
    if i % 250 == 0:
        print(f"  copiadas y verificadas {i}/{len(mover)}")
json.dump({"fecha": time.strftime("%Y-%m-%d %H:%M"), "motivo":
           "La web usa una sola foto por producto (la principal); el resto de la galería se archiva aquí. "
           "Para devolver una foto: copiarla de vuelta a catalogo-investigacion/catalogo/ con la misma ruta "
           "y añadirla a imagenes_local del producto (ver imagenes_archivadas_jorge en catalogo-final.json).",
           "total": len(manifiesto), "bytes": sum(m["bytes"] for m in manifiesto), "fotos": manifiesto},
          open(os.path.join(DESTINO, "MANIFIESTO.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"  {len(manifiesto)} copias verificadas por SHA-256 + MANIFIESTO.json")

# 3) sólo ahora se quitan los originales y se actualiza el catálogo
for r in mover:
    os.remove(os.path.join(CATD, r))
movidas = set(mover)
for p in cat:
    high, medium = p["imagenes_local"].get("high", []), p["imagenes_local"].get("medium", [])
    arch_h, arch_m = [r for r in high if r in movidas], [r for r in medium if r in movidas]
    if arch_h or arch_m:
        p["imagenes_archivadas_jorge"] = {"carpeta": NOMBRE_DESTINO, "high": arch_h, "medium": arch_m}
    p["imagenes_local"] = {"medium": [r for r in medium if r not in movidas],
                           "high": [r for r in high if r not in movidas]}
    p["n_fotos"] = len(p["imagenes_local"]["high"])
    p["n_imagenes"] = p["n_fotos"] + len(p["imagenes_local"]["medium"])
json.dump(cat, open(CAT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for raiz, dirs, archivos in os.walk(os.path.join(CATD, "imagenes"), topdown=False):
    if not dirs and not archivos:
        os.rmdir(raiz)
    elif not os.listdir(raiz):
        os.rmdir(raiz)

rotas = [p["slug"] for p in cat if not os.path.exists(os.path.join(CATD, p["imagen_principal"]))]
print(f"Hecho. Principales que faltan: {len(rotas)} {rotas[:5]}")
