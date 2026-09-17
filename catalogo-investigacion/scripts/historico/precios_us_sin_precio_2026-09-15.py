# -*- coding: utf-8 -*-
"""Segunda ronda de precios americanos: los 25 productos que no tenían ningún precio.

Continuación de precios_us_2026-09-15.py. Se buscó cada uno por MPN en pcpartpicker.com (EE.UU.)
y, cuando no lo lista, en Newegg, Amazon y B&H, comprobando el MPN en la ficha de la tienda.
Resultado: 6 sí se venden en EE.UU. y pasan a `importacion_us` con precio; 1 es DeepCool (marca
sancionada, se trata como los otros tres) y los 17 restantes son referencias de mercado europeo
sin ninguna tienda americana, así que se quedan con el aviso naranja y sin precio.

No se aceptó como precio americano una oferta de marketplace que envía desde fuera de EE.UU.:
la ASUS TUF Gaming 650W Bronze sólo aparece en Newegg a US$ 201 desde Hong Kong (un 650 W bronce
cuesta ~US$ 70 en tienda), así que se queda sin precio.

Respaldo previo: catalogo/catalogo-final.BACKUP-2026-09-15-1150-antes-2a-ronda-precios.json
"""
import json
import os

CAT = os.path.join(os.path.dirname(__file__), "..", "catalogo", "catalogo-final.json")
HOY = "2026-09-15"
NOTA_US = ("No hay stock local. Este producto se vende en EE.UU. y puedes importarlo por tu cuenta "
           "(Amazon, Newegg y similares). El envío, los impuestos de importación y la garantía corren "
           "por cuenta del comprador: no hay garantía local.")

US = {
    "SB580T-12GOC": (369.99, "pcpartpicker.com (EE.UU.), revisado tienda por tienda en la ficha",
        "revisado en ficha: Amazon con stock a US$ 369.99 (MemoryC US$ 531.47)"),
    "SB570G-10GOC": (278.69, "amazon.com (EE.UU.)",
        "revisado en ficha: Amazon, Sparkle Intel Arc B570 Guardian OC 10 GB. PCPartPicker sólo lo "
        "lista en MemoryC a US$ 461.42, muy por encima de tienda"),
    "CT4000P310SSD8": (594.79, "newegg.com (EE.UU.)",
        "revisado en ficha: Newegg, MPN exacto, con stock (el reacondicionado a US$ 469.00 no cuenta)"),
    "CW-9061045-WW": (239.99, "newegg.com (EE.UU.)",
        "revisado en ficha: Newegg, MPN exacto, con stock"),
    "G89.GHS2LCDS36NB.00": (159.99, "newegg.com (EE.UU.)",
        "revisado en ficha: Newegg lo vende como Hydroshift II-S 360, modelo HS2LCDS36NB (el mismo "
        "código que va dentro del MPN de fabricante), con stock"),
    "90RC01N1-B0EAY0": (393.99, "newegg.com (EE.UU.)",
        "revisado en ficha: Newegg, ROG RYUO IV 360 ARGB con pantalla AMOLED curva, con stock"),
}

# DeepCool: mismo trato que los otros tres (sancionada por EE.UU., precio alemán de referencia)
DEEPCOOL = {"R-LT360VISION-BKAMMC-G-1": dict(eur=139.90, tienda="Alternate",
            nota_extra="Mindfactory €139,89")}
AVISO_DEEPCOOL = "DeepCool está sancionada por EE.UU.: las tiendas estadounidenses no la venden"

# Revisados hoy sin encontrar tienda americana: se quedan como están, pero queda constancia
SIN_TIENDA_US = {
    "B650M-SILVER": "Biostar; PCPartPicker lo cataloga sin ninguna tienda; nada en Newegg",
    "KF560C36BBEK2-32": "Kingston; PCPartPicker sin tiendas; Newegg sólo trae el kit de 64 GB, "
                        "Amazon otras latencias y B&H no lo trabaja",
    "AX5U6000C3624G-DTLABRWH": "XPG; sin ficha en PCPartPicker, sin resultados en Newegg ni Amazon",
    "AX5U8000C3816G-DCLARBK": "XPG; sin ficha en PCPartPicker, sin resultados en Newegg ni Amazon",
    "NE7507TS19T2-GB2031U": "Palit; sin canal de venta en EE.UU.",
    "SB580RW-12GOC": "Sparkle ROC Luna; sin ficha en PCPartPicker, nada en Newegg ni Amazon "
                     "(las otras dos Arc del catálogo sí se venden allí)",
    "SRP-CBC651-A5A51JF": "Seasonic; la línea CORE BC no se vende en EE.UU. (allí está la CORE GX)",
    "SRP-CGC751-A5A32SF": "Seasonic; la línea CORE GC no se vende en EE.UU. (allí está la CORE GX)",
    "BP010EU": "be quiet!; es la referencia europea (la americana sería BP010US) y ninguna tienda "
               "de EE.UU. la lista",
    "PPA6506804": "FSP; referencia europea, sin tienda americana",
    "PPA12A1502": "FSP; sin tienda americana (Newegg trae la Hydro G Pro 1200 W, otro modelo)",
    "90YE00D6-B0NA00": "ASUS TUF Gaming 650W Bronze EVO; en Newegg sólo desde Hong Kong a US$ 201, "
                       "precio de marketplace, no de tienda americana",
    "90YE00V2-B0NA00": "ASUS ROG Thor 1200W Platinum III; sin tienda americana",
    "COREREACTORII650G-BKCUS": "XPG; PCPartPicker lo cataloga sin ninguna tienda, nada en Newegg",
    "MPX-7505-AFAG-BEU": "Cooler Master; referencia europea (BEU), sin tienda americana",
    "MPW-A001-AFAG-BEU": "Cooler Master; referencia europea (BEU), sin tienda americana",
}

cat = json.load(open(CAT, encoding="utf-8"))
por_mpn = {p.get("mpn"): p for p in cat}
hechos = []

for mpn, (usd, fuente, nota) in US.items():
    p = por_mpn[mpn]
    p.update(precio_usd=usd, precio_usd_fecha=HOY, precio_usd_fuente=fuente, precio_usd_nota=nota,
             precio_usd_revisar=False, precio_verificado=True, precio_pais="US",
             disponibilidad="importacion_us", disponibilidad_nota=NOTA_US)
    for k in ("disponibilidad_motivo", "precio_usd_sin_stock", "precio_usd_aviso", "aviso_extra"):
        p.pop(k, None)
    hechos.append((p["marca"] + " " + p["modelo"], "US$ %.2f" % usd))

for mpn, d in DEEPCOOL.items():
    p = por_mpn[mpn]
    p.update(precio_usd=None, precio_usd_fecha=HOY,
             precio_usd_fuente="de.pcpartpicker.com (Alemania)",
             precio_usd_nota="revisado en ficha (Alemania, geizhals.de): %s con stock; %s. "
                             "Sin tiendas en EE.UU." % (d["tienda"], d["nota_extra"]),
             precio_usd_revisar=False, precio_verificado=False, precio_pais="DE",
             precio_original={"moneda": "EUR", "valor": d["eur"], "iva_incluido": 0.19},
             precio_referencia_eu={"usd": round(d["eur"] / 1.19 * 1.1592, 2), "origen": "DE",
                                   "local": {"moneda": "EUR", "valor": d["eur"], "iva_incluido": 0.19},
                                   "fecha": HOY, "nota": "dato interno, no se muestra en la web"},
             disponibilidad="importacion_global", disponibilidad_motivo="sancion_eeuu",
             disponibilidad_nota="La marca está sancionada por EE.UU. (lista SDN de la OFAC, junio de "
                                 "2024) y las tiendas estadounidenses la retiraron. Se sigue vendiendo "
                                 "en Europa: el precio que mostramos es el alemán, a título de "
                                 "referencia.",
             aviso_extra=AVISO_DEEPCOOL)
    hechos.append((p["marca"] + " " + p["modelo"], "sin venta en EE.UU. → €%.2f (Alemania)" % d["eur"]))

for mpn, motivo in SIN_TIENDA_US.items():
    p = por_mpn[mpn]
    p["precio_usd_revisado_us"] = {"fecha": HOY, "resultado": "sin tienda americana", "detalle": motivo,
                                   "buscado_en": "pcpartpicker.com, newegg.com, amazon.com, bhphotovideo.com"}
    hechos.append((p["marca"] + " " + p["modelo"], "sigue sin precio americano"))

json.dump(cat, open(CAT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("%d productos revisados" % len(hechos))
for n, v in hechos:
    print("  %-48s %s" % (n[:48], v))
