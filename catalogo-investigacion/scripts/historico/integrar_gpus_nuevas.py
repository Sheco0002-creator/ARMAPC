"""Integra en el catálogo las 11 GPUs nuevas (2026-09-12):

  8 del tramo de entrada  -> nivel `local`, con precio REAL de tienda peruana (S/ 869 a S/ 1.439).
                             El catálogo no tenía ninguna GPU por debajo de US$ 300.
  3 SPARKLE Intel Arc     -> nivel `importacion_global`: no se venden en Perú ni en EE.UU.,
                             se publican con ficha y fotos pero sin precio.

Las fotos ya están descargadas y medidas en JORGE; aquí sólo se copian al árbol del catálogo
(imagenes/gpus/entrada/high) y se genera la versión medium de 500 px que usan los listados.

python integrar_gpus_nuevas.py [--escribir]
"""
import json, os, re, shutil, sys, datetime, unicodedata
from PIL import Image

sys.stdout.reconfigure(encoding="utf-8")
ESCRIBIR = "--escribir" in sys.argv
BASE = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo"
CAT = os.path.join(BASE, "catalogo-final.json")
J = r"D:\catalogo-investigacion-ARCHIVO"
ENTRADA = os.path.join(J, "ENTRADA_gpus_2026-09-12")
SPARKLE = os.path.join(J, "ARC_sparkle_2026-09-12")
DEST_H = os.path.join(BASE, "imagenes", "gpus", "entrada", "high")
DEST_M = os.path.join(BASE, "imagenes", "gpus", "entrada", "medium")
TC, IGV = 3.373, 0.18

NOTA_LOCAL = "Disponible en Perú."
NOTA_GLOBAL = ("Sin canal de venta en América: conseguirlo exige importarlo desde Europa o Asia, "
               "por cuenta y riesgo del comprador, sin garantía local. No mostramos precio "
               "porque no hay una referencia americana fiable.")


# El nombre de modelo lo ve el cliente. Ni Icecat ni la tienda lo dan limpio: Icecat devuelve
# "Dual -RTX3050-O6G" y la tienda repite la marca y añade cola ("... GDDR6 96 BITS"). Se fijan a mano.
MODELOS = {
    "DUAL-RTX3050-O6G": ("Dual GeForce RTX 3050 OC 6GB", "RTX 3050"),
    "GeForce RTX 3050 VENTUS 2X 6G OC": ("GeForce RTX 3050 VENTUS 2X 6G OC", "RTX 3050"),
    "GV-N5050WF2OCV2-8GD": ("GeForce RTX 5050 WINDFORCE OC V2 8G", "RTX 5050"),
    "GeForce RTX 5050 8G GAMING OC": ("GeForce RTX 5050 8G GAMING OC", "RTX 5050"),
    "DUAL-RTX5050-O8G": ("Dual GeForce RTX 5050 OC 8GB", "RTX 5050"),
    "228-1N754-200Z6": ("GAMING GeForce RTX 3050 Twin Edge OC 6GB", "RTX 3050"),
    "NE63050018JE-1072F": ("GeForce RTX 3050 StormX 6GB", "RTX 3050"),
    "RX-76PSWFTFY": ("SPEEDSTER SWFT 210 Radeon RX 7600 8GB", "RX 7600"),
}


def slug(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", s)).strip("-")


def chip_de(modelo):
    m = re.search(r"(RTX\s*\d{4}\s*(?:Ti)?(?:\s*SUPER)?|RX\s*\d{4}\s*(?:XT)?|Arc\s*B\d{3})", modelo, re.I)
    return re.sub(r"\s+", " ", m.group(1)).strip() if m else ""


def copiar(origen, destino_h, destino_m):
    """Copia la foto y genera la versión de 500 px. Devuelve (ruta_high, ruta_medium) relativas."""
    if ESCRIBIR:
        os.makedirs(os.path.dirname(destino_h), exist_ok=True)
        os.makedirs(os.path.dirname(destino_m), exist_ok=True)
        shutil.copy2(origen, destino_h)
        im = Image.open(origen)
        im.thumbnail((500, 500))
        im.convert("RGB").save(destino_m, quality=88)
    rel = lambda p: os.path.relpath(p, BASE).replace("\\", "/")
    return rel(destino_h), rel(destino_m)


nuevos = []

# ---------- 8 del tramo de entrada ----------
for f in json.load(open(os.path.join(ENTRADA, "fichas_entrada.json"), encoding="utf-8")):
    marca, mpn = f["marca"], str(f["mpn"])
    carp = os.path.join(ENTRADA, f"{marca}_{re.sub(r'[^A-Za-z0-9]+', '-', mpn)[:34]}")
    tag = "INT" if f["fuente"] == "icecat" else "TDA"
    modelo, chip = MODELOS[mpn]
    altas, medias = [], []
    if os.path.isdir(carp):
        for n, nombre in enumerate(sorted(os.listdir(carp)), 1):
            o = os.path.join(carp, nombre)
            base = f"{marca}_{mpn}_{tag}_{n}".replace("/", "-")
            h, m = copiar(o, os.path.join(DEST_H, base + ".jpg"), os.path.join(DEST_M, base + ".jpg"))
            altas.append(h); medias.append(m)
    ean = (f.get("gtin") or [None])[0] or f.get("ean")
    nuevos.append({
        "marca": marca, "modelo": modelo, "chip": chip, "mpn": mpn, "ean": ean,
        "categoria": "Tarjetas gráficas", "titulo": f.get("titulo") or f"{marca} {modelo}",
        "resumen": f.get("resumen", ""), "specs": f["specs"], "n_specs": len(f["specs"]),
        "slug": slug(f"{marca} {modelo}"), "gama": "entrada", "gama_criterio": "modelo",
        "imagenes_local": {"high": altas, "medium": medias},
        "imagen_principal": altas[0] if altas else "", "n_imagenes": len(altas) + len(medias),
        "n_fotos": len(altas), "imagen_generica": False, "fuente": f["fuente"],
        "completo": bool(altas and f["specs"]), "faltante": [] if altas else ["imagen"],
        "url_oficial": "", "precio_pais": "PE", "precio_usd": f["usd_derivado"],
        "precio_pen": f["pen"], "precio_pen_sin_igv": round(f["pen"] / (1 + IGV), 2), "precio_pen_igv": IGV,
        "precio_pen_tc": TC, "precio_pen_tc_fecha": "2026-09-10",
        "precio_pen_fuente": "Infotec (Perú), precio de tienda con IGV 18 %",
        "precio_usd_fuente": f"derivado del precio peruano (sin IGV, TC {TC})",
        "precio_usd_nota": f"Precio real de tienda peruana: S/ {f['pen']:.2f} con IGV.",
        "precio_usd_fecha": "2026-09-12", "precio_verificado": True, "precio_usd_revisar": False,
        "disponibilidad": "local", "disponibilidad_nota": NOTA_LOCAL,
    })

# ---------- 3 SPARKLE Intel Arc ----------
for f in json.load(open(os.path.join(SPARKLE, "fichas_sparkle.json"), encoding="utf-8")):
    mpn = f["mpn"]
    carp = os.path.join(SPARKLE, mpn.replace(" ", "_"))
    altas, medias = [], []
    if os.path.isdir(carp):
        for n, nombre in enumerate(sorted(os.listdir(carp)), 1):
            base = f"SPARKLE_{mpn}_CDN_{n}"
            h, m = copiar(os.path.join(carp, nombre),
                          os.path.join(DEST_H, base + ".jpg"), os.path.join(DEST_M, base + ".jpg"))
            altas.append(h); medias.append(m)
    specs = dict(f["resumen_es"]); specs.update(f["specs"])
    nuevos.append({
        "marca": "SPARKLE", "modelo": f["modelo"], "chip": f["chip"], "mpn": mpn, "ean": f["ean"],
        "categoria": "Tarjetas gráficas", "titulo": f"SPARKLE {f['modelo']}",
        "resumen": ", ".join(f"{k}: {v}" for k, v in list(f["resumen_es"].items())[:6]),
        "specs": specs, "n_specs": len(specs), "slug": slug("sparkle " + f["modelo"]),
        "gama": "entrada", "gama_criterio": "modelo", "requisitos": f["requisitos"],
        "imagenes_local": {"high": altas, "medium": medias},
        "imagen_principal": altas[0] if altas else "", "n_imagenes": len(altas) + len(medias),
        "n_fotos": len(altas), "imagen_generica": False, "fuente": "cdn",
        "completo": bool(altas and specs), "faltante": [], "url_oficial": f["url_oficial"],
        "precio_pais": None, "precio_usd": None, "precio_pen": None, "precio_pen_sin_igv": None,
        "precio_verificado": False, "precio_usd_revisar": False,
        "disponibilidad": "importacion_global", "disponibilidad_motivo": "sin_canal_america",
        "disponibilidad_nota": NOTA_GLOBAL,
    })

cat = json.load(open(CAT, encoding="utf-8"))
ya = {p["mpn"] for p in cat}
nuevos = [n for n in nuevos if n["mpn"] not in ya]

print(f"{len(nuevos)} GPUs a integrar\n")
for n in nuevos:
    print(f"  {n['marca']:9} {n['modelo'][:40]:40} {str(n['chip']):12} fotos={n['n_fotos']:2} "
          f"specs={n['n_specs']:3} {n['disponibilidad']:19} "
          + (f"S/ {n['precio_pen']:.0f}" if n["precio_pen"] else "sin precio"))

if not ESCRIBIR:
    print("\n(simulación: no se ha copiado ni escrito nada; añade --escribir)")
    sys.exit()

sello = datetime.datetime.now().strftime("%Y%m%d-%H%M")
shutil.copy2(CAT, os.path.join(BASE, f"catalogo-final.BACKUP-{sello}-antes-gpus-nuevas.json"))
cat.extend(nuevos)
json.dump(cat, open(CAT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"\nHECHO. Catálogo: {len(cat)} productos. Backup: catalogo-final.BACKUP-{sello}-antes-gpus-nuevas.json")
