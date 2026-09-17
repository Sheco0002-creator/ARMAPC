# -*- coding: utf-8 -*-
"""Precio americano para los 13 productos que tenían precio derivado de tienda peruana.

La web pasa a estar dirigida a EE.UU. (decisión del usuario, 15-09-2026): el precio base es el
dólar americano y no se menciona ningún precio peruano. Los 13 productos que tenían
`disponibilidad: local` llevaban un precio_usd derivado del precio de Infotec (Perú) sin IGV: eso
no es un precio de EE.UU. Aquí se sustituye por el precio americano verificado el 15-09-2026, y
los que no se venden en EE.UU. pasan al mismo trato que los europeos/asiáticos (aviso naranja).

El dato peruano NO se borra: se guarda en `precio_peru_interno` (nunca se exporta a la web).
Respaldo previo: catalogo/catalogo-final.BACKUP-2026-09-15-1010-antes-precios-us.json
"""
import json
import os

CAT = os.path.join(os.path.dirname(__file__), "..", "catalogo", "catalogo-final.json")
HOY = "2026-09-15"

NOTA_US = ("No hay stock local. Este producto se vende en EE.UU. y puedes importarlo por tu cuenta "
           "(Amazon, Newegg y similares). El envío, los impuestos de importación y la garantía corren "
           "por cuenta del comprador: no hay garantía local.")
FUENTE_PCPP = "pcpartpicker.com (EE.UU.), revisado tienda por tienda en la ficha"

# --- Con precio americano verificado -------------------------------------------------------
US = {
    "Z890 A ELITE WIFI7": (279.99, FUENTE_PCPP,
        "revisado en ficha: tienda con stock a US$ 279.99 (PCPartPicker lista el mismo modelo "
        "como Z890 AORUS ELITE WIFI7; segunda y tercera tienda a US$ 281.00 y US$ 289.99, agotadas)"),
    "90DC00F0-B39000": (512.99, "newegg.com (EE.UU.)",
        "revisado en ficha: Newegg, negro, con stock (segunda referencia del mismo modelo a US$ 519.99)"),
    "DUAL-RTX3050-O6G": (259.99, FUENTE_PCPP,
        "revisado en ficha: Newegg con stock; B&H US$ 280.99 y ASUS US$ 299.99"),
    "GeForce RTX 3050 VENTUS 2X 6G OC": (259.99, FUENTE_PCPP,
        "revisado en ficha: tres tiendas con stock a US$ 259.99"),
    "GV-N5050WF2OCV2-8GD": (399.99, FUENTE_PCPP,
        "revisado en ficha: Best Buy con stock. La ficha americana corresponde a la revisión sin V2 "
        "del mismo modelo (GV-N5050WF2OC-8GD), idéntica en especificaciones"),
    "DUAL-RTX5050-O8G": (419.99, FUENTE_PCPP,
        "revisado en ficha: Amazon, ASUS, B&H y Best Buy, todas con stock a US$ 419.99"),
    "RX-76PSWFTFY": (329.99, FUENTE_PCPP,
        "revisado en ficha: Amazon con stock; Newegg Sellers US$ 349.99"),
}
# Con precio de lista pero agotado en EE.UU. (mismo trato que los otros 12 sin stock)
US_SIN_STOCK = {
    "GeForce RTX 5050 8G GAMING OC": (429.99, FUENTE_PCPP,
        "revisado en ficha: B&H y MSI a US$ 429.99, agotados en la fecha; precio de tienda"),
}
# --- Sin venta en EE.UU.: pasan a aviso naranja, como los europeos/asiáticos ----------------
# DeepCool está en la lista SDN de la OFAC desde junio de 2024 y las tiendas de EE.UU. no la
# venden; sí se vende en Alemania, así que se muestra ese precio como referencia.
GLOBAL = {
    "R-AK400G2-BKNNMN-GJD": dict(eur=35.26, motivo="sancion_eeuu", tienda="Galaxus",
                                 nota_extra="Alza €29,90 + envío; notebooksbilliger.de €35,89"),
    "R-AK620G2-BKNNMN-GJD": dict(eur=65.89, motivo="sancion_eeuu", tienda="notebooksbilliger.de",
                                 nota_extra="Alza €59,90 + envío; Galaxus €66,72"),
    "R-SPT360-BKDSMP-G-1": dict(eur=152.89, motivo="sancion_eeuu", tienda="Alternate",
                                nota_extra="Galaxus €152,89; Mindfactory €153,79"),
}
AVISO_DEEPCOOL = "DeepCool está sancionada por EE.UU.: las tiendas estadounidenses no la venden"
# Sin precio en ninguna tienda americana ni europea
SIN_PRECIO = {
    "228-1N754-200Z6": dict(motivo="sin_precio_verificado",
        nota="Revisado el 15-09-2026 sin encontrar precio americano: PCPartPicker EE.UU. no lista esta "
             "versión, Newegg la da agotada sin precio, Amazon 'no disponible' y B&H no la trabaja."),
    "NE63050018JE-1072F": dict(motivo="sin_canal_america",
        nota="Marca de distribución europea y asiática: no se comercializa en EE.UU. PCPartPicker la "
             "cataloga sin ninguna tienda americana. Ficha e imágenes a título informativo."),
}

cat = json.load(open(CAT, encoding="utf-8"))
por_mpn = {p.get("mpn"): p for p in cat}
tocados = []


def guardar_peru(p):
    """Mueve el rastro peruano a un bloque interno; no se exporta ni se borra."""
    if "precio_peru_interno" in p:
        return
    p["precio_peru_interno"] = {
        "pen": p.get("precio_pen"), "pen_sin_igv": p.get("precio_pen_sin_igv"),
        "igv": p.get("precio_pen_igv"), "tc": p.get("precio_pen_tc"),
        "fuente": p.get("precio_pen_fuente"), "usd_derivado": p.get("precio_usd"),
        "nota": p.get("precio_usd_nota"), "disponibilidad_anterior": p.get("disponibilidad"),
        "disponibilidad_nota_anterior": p.get("disponibilidad_nota"),
        "archivado": HOY,
        "aviso": "interno: la web se dirige a EE.UU. y no muestra precios peruanos (15-09-2026)",
    }
    for k in ("precio_pen", "precio_pen_sin_igv"):
        p[k] = None
    p["precio_pen_fuente"] = ("precio_usd × TC BCRP (sistema bancario SBS, venta) + IGV 18 %; "
                              "sin envío ni aranceles")


for mpn, (usd, fuente, nota) in list(US.items()) + list(US_SIN_STOCK.items()):
    p = por_mpn[mpn]
    guardar_peru(p)
    p.update(precio_usd=usd, precio_usd_fecha=HOY, precio_usd_fuente=fuente, precio_usd_nota=nota,
             precio_usd_revisar=False, precio_verificado=True, precio_pais="US",
             disponibilidad="importacion_us", disponibilidad_nota=NOTA_US)
    p.pop("disponibilidad_motivo", None)
    if mpn in US_SIN_STOCK:
        p["precio_usd_sin_stock"] = True
        p["precio_usd_aviso"] = "Sin stock en EE.UU. · precio de lista"
    else:
        p.pop("precio_usd_sin_stock", None)
        p.pop("precio_usd_aviso", None)
    tocados.append((p["marca"] + " " + p["modelo"], "US$ %.2f" % usd))

for mpn, d in GLOBAL.items():
    p = por_mpn[mpn]
    guardar_peru(p)
    p.update(precio_usd=None, precio_usd_fecha=HOY,
             precio_usd_fuente="de.pcpartpicker.com (Alemania)",
             precio_usd_nota="revisado en ficha (Alemania): %s (con stock); %s. Sin tiendas en EE.UU."
                             % (d["tienda"], d["nota_extra"]),
             precio_usd_revisar=False, precio_verificado=False, precio_pais="DE",
             precio_original={"moneda": "EUR", "valor": d["eur"], "iva_incluido": 0.19},
             precio_referencia_eu={"usd": round(d["eur"] / 1.19 * 1.1592, 2), "origen": "DE",
                                   "local": {"moneda": "EUR", "valor": d["eur"], "iva_incluido": 0.19},
                                   "fecha": HOY, "nota": "dato interno, no se muestra en la web"},
             disponibilidad="importacion_global", disponibilidad_motivo=d["motivo"],
             disponibilidad_nota="La marca está sancionada por EE.UU. (lista SDN de la OFAC, junio de "
                                 "2024) y las tiendas estadounidenses la retiraron. Se sigue vendiendo "
                                 "en Europa: el precio que mostramos es el alemán, a título de "
                                 "referencia.",
             aviso_extra=AVISO_DEEPCOOL)
    tocados.append((p["marca"] + " " + p["modelo"], "sin venta en EE.UU. → €%.2f (Alemania)" % d["eur"]))

for mpn, d in SIN_PRECIO.items():
    p = por_mpn[mpn]
    guardar_peru(p)
    p.update(precio_usd=None, precio_usd_fecha=HOY,
             precio_usd_fuente=("sin precio verificado (revisado en pcpartpicker.com EE.UU., "
                                "de.pcpartpicker.com, Newegg, Amazon y B&H)"),
             precio_usd_nota=d["nota"], precio_usd_revisar=False, precio_verificado=False,
             precio_pais=None, disponibilidad="importacion_global",
             disponibilidad_motivo=d["motivo"], disponibilidad_nota=d["nota"])
    p.pop("precio_original", None)
    tocados.append((p["marca"] + " " + p["modelo"], "sin precio americano"))

json.dump(cat, open(CAT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("%d productos actualizados:" % len(tocados))
for n, v in tocados:
    print("  %-48s %s" % (n[:48], v))
locales = [p for p in cat if p["disponibilidad"] == "local"]
print("\nquedan %d productos con disponibilidad 'local'" % len(locales))
