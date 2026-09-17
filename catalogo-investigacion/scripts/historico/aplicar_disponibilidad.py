"""Tres niveles de disponibilidad + precios peruanos reales + corrección de las Palit (2026-09-12).

Sustituye el `disponibilidad_region` binario ("no_disponible") por un campo `disponibilidad` de tres
estados, porque el binario obligaba a mentir: decía "no se comercializa en América" de productos que
sí se venden aquí y que sólo faltaban en la tienda que consultamos.

  local              precio_pen REAL de tienda peruana (con IGV). Es el precio final, no un cálculo.
  importacion_us     precio de EE.UU. verificado. Sin stock local; importable por cuenta del comprador.
  importacion_global ni EE.UU. ni Perú. Ficha e imágenes, sin precio.

`precio_pen` sólo sobrevive cuando es REAL. En importacion_us se traslada a `precio_pen_estimado`
(interno, no se muestra): la fórmula usd x TC x IGV se queda entre un 25 % y un 44 % por debajo del
precio peruano observado, así que publicarla engañaría al cliente.

python aplicar_disponibilidad.py [--escribir]
"""
import json, os, re, shutil, sys, datetime

sys.stdout.reconfigure(encoding="utf-8")
ESCRIBIR = "--escribir" in sys.argv
BASE = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\catalogo"
CAT = os.path.join(BASE, "catalogo-final.json")
PERU = r"D:\catalogo-investigacion-ARCHIVO\PRECIOS_peru_2026-09-12.json"
PALIT = r"C:\Users\USUARIO\Desktop\Primera Pagina Web\catalogo-investigacion\scripts\precios\palit_peru.json"
TC, IGV = 3.373, 0.18
SCORE_MIN = 1.0          # sólo coincidencias exactas se aplican solas

NOTA = {
    "local": "Disponible en Perú.",
    "importacion_us": ("No hay stock local. Este producto se vende en EE.UU. y puedes importarlo por tu "
                       "cuenta (Amazon, Newegg y similares). El envío, los impuestos de importación y la "
                       "garantía corren por cuenta del comprador: no hay garantía local."),
    "importacion_global": ("Sin canal de venta en América: conseguirlo exige importarlo desde Europa o Asia, "
                           "por cuenta y riesgo del comprador, sin garantía local. No mostramos precio "
                           "porque no hay una referencia americana fiable."),
}

cat = json.load(open(CAT, encoding="utf-8"))
peru = json.load(open(PERU, encoding="utf-8"))
palit = json.load(open(PALIT, encoding="utf-8")) if os.path.exists(PALIT) else {}

# --- 1. precios peruanos reales (sólo score 1.0; el resto se lista para revisar a mano) ---
aplicados, revisar = [], []
for k, v in peru.items():
    i = int(k)
    if not v["candidatos"]:
        continue
    c = v["candidatos"][0]
    (aplicados if c["score"] >= SCORE_MIN else revisar).append((i, c, v))

for i, c, v in aplicados:
    p = cat[i]
    p["precio_pen"] = c["pen"]
    p["precio_pen_sin_igv"] = round(c["pen"] / (1 + IGV), 2)
    p["precio_usd"] = c["usd_derivado"]
    p["precio_pais"] = "PE"
    p["precio_pen_fuente"] = f"{c['tienda']} (Perú), precio de tienda con IGV {int(IGV*100)} %"
    p["precio_usd_fuente"] = f"derivado del precio peruano de {c['tienda']} (sin IGV, TC {TC})"
    p["precio_usd_nota"] = f"Precio real de tienda peruana: S/ {c['pen']:.2f} con IGV. {c['titulo'][:70]}"
    p["precio_verificado"] = True
    p["precio_usd_fecha"] = "2026-09-12"

# --- 2. Palit: la etiqueta "marca_europea" es falsa, la marca sí se vende en Perú ---
palit_local, palit_fuera = [], []
for k, v in palit.items():
    i = int(k)
    if v["candidatos"]:
        palit_local.append((i, v["candidatos"][0]))
    else:
        palit_fuera.append(i)

# --- 3. asignar los tres niveles ---
conteo = {"local": 0, "importacion_us": 0, "importacion_global": 0}
for i, p in enumerate(cat):
    if p.get("precio_pais") == "PE":
        nivel = "local"
    elif p.get("precio_pais") == "US" and p.get("precio_usd") is not None:
        nivel = "importacion_us"
    else:
        nivel = "importacion_global"

    p["disponibilidad"] = nivel
    p["disponibilidad_nota"] = NOTA[nivel]
    p.pop("disponibilidad_region", None)

    if nivel == "importacion_us":
        # el PEN de estos es un cálculo que subestima el precio local: se guarda, no se muestra
        if p.get("precio_pen") is not None:
            p["precio_pen_estimado"] = {"pen": p["precio_pen"], "formula": f"usd x {TC} x {1+IGV}",
                                        "aviso": "interno: subestima el precio peruano real entre 25 % y 44 %"}
        p["precio_pen"] = p["precio_pen_sin_igv"] = None
    elif nivel == "importacion_global":
        p["precio_usd"] = p["precio_pen"] = p["precio_pen_sin_igv"] = None
        p["precio_verificado"] = False
        motivo = p.get("disponibilidad_motivo")
        if p["marca"] == "PALIT" and i in palit_fuera:
            p["disponibilidad_motivo"] = "modelo_no_en_peru"
            p["disponibilidad_nota"] = ("La marca se vende en Perú, pero este modelo concreto no se "
                                        "encuentra aquí. " + NOTA["importacion_global"])
        elif motivo in ("marca_europea", "version_europea"):
            pass                       # Gainward/Cooler Master 230V/Thermaltake EU: no hay canal americano
        else:
            # ASUS, MSI, Corsair, Crucial, Seasonic, ZOTAC, DeepCool... SÍ se venden en América: aquí lo
            # que falta es un precio verificado, no el canal. Decir "sin canal" sería falso.
            p["disponibilidad_motivo"] = "sin_precio_verificado"
            p["disponibilidad_nota"] = ("Producto de marca con venta en América, pero no hemos podido "
                                        "verificar precio ni en Perú ni en EE.UU. Consúltanos por "
                                        "disponibilidad y plazo antes de decidir.")
    conteo[nivel] += 1

# las Palit que sí están en Perú dejan de ser "europeas"
for i, c in palit_local:
    p = cat[i]
    p["disponibilidad_motivo"] = "en_peru_pendiente_confirmar"
    p["disponibilidad_nota"] = (f"Se vende en Perú (visto en {c['tienda']} a S/ {c['pen']:.0f}). "
                                "Precio pendiente de confirmar a mano.")

print(f"NIVELES  local={conteo['local']}  importacion_us={conteo['importacion_us']}  "
      f"importacion_global={conteo['importacion_global']}  (total {len(cat)})\n")
print(f"Precios peruanos aplicados (score 1.0): {len(aplicados)}")
for i, c, v in aplicados:
    print(f"   #{i:3} {v['producto'][:40]:40} S/ {c['pen']:>8.2f}  ({c['tienda']})")
print(f"\nPARA REVISAR A MANO ({len(revisar)}): coincidencia dudosa, NO se ha aplicado precio")
for i, c, v in revisar:
    print(f"   #{i:3} {v['producto'][:38]:38} score {c['score']}  S/ {c['pen']:>8.2f}  {c['titulo'][:46]}")
print(f"\nPalit: {len(palit_local)} en Perú, {len(palit_fuera)} sólo importables (etiqueta 'marca_europea' retirada de las 6)")

if not ESCRIBIR:
    print("\n(simulación: no se ha escrito nada; añade --escribir)")
    sys.exit()

sello = datetime.datetime.now().strftime("%Y%m%d-%H%M")
shutil.copy2(CAT, os.path.join(BASE, f"catalogo-final.BACKUP-{sello}-antes-disponibilidad.json"))
json.dump(cat, open(CAT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"\nHECHO. Backup: catalogo-final.BACKUP-{sello}-antes-disponibilidad.json")
