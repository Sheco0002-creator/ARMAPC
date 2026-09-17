# -*- coding: utf-8 -*-
"""Cuarta ronda del 15-09-2026, a petición del usuario:

  1. **Retirar de la web los duplicados.** Ocho productos sin precio americano que repiten un modelo
     que el catálogo YA ofrece con precio de EE.UU.: no aportan nada y sólo ensucian el configurador
     con tarjetas naranjas sin precio. No se borran del catálogo: se marcan con `fuera_de_web` (qué
     producto lo cubre y por qué) y el exportador los salta, igual que a los huérfanos.

  2. **Los que no se venden en EE.UU. se quedan**, pero con la ficha completa: en qué país SÍ se
     venden y a qué precio de tienda, dejando claro que importarlo corre por cuenta del comprador.
     Precios de geizhals.de (Alemania, con IVA 19 %), comprobados por MPN el 15-09-2026.

Respaldo previo: catalogo/catalogo-final.BACKUP-2026-09-15-1320-antes-retirar-duplicados.json
"""
import json
import os

CAT = os.path.join(os.path.dirname(__file__), "..", "catalogo", "catalogo-final.json")
HOY = "2026-09-15"

# --- 1. Duplicados: qué producto del catálogo cubre ya ese hueco -----------------------------
RETIRAR = {
    "NE7507TS19T2-GB2031U": "Palit no tiene canal en EE.UU. La RTX 5070 Ti ya está en el catálogo con "
                            "precio americano en MSI, ASUS, GIGABYTE, PNY y ZOTAC.",
    "228-1N754-200Z6": "Sin tienda americana. La RTX 3050 6 GB ya está con precio en ASUS Dual "
                       "(US$ 260) y MSI VENTUS 2X (US$ 260).",
    "NE63050018JE-1072F": "Palit no tiene canal en EE.UU. Mismo chip y memoria que las dos RTX 3050 "
                          "6 GB que sí tienen precio americano.",
    "SB580RW-12GOC": "Sin tienda americana. La Arc B580 ya está con precio en la Sparkle TITAN OC "
                     "(US$ 370), del mismo fabricante y chip.",
    "KF560C36BBEK2-32": "Sin tienda americana. El catálogo ya trae Kingston FURY Beast DDR5-6000 "
                        "32 GB con precio (versión RGB EXPO CL30, US$ 570).",
    "AX5U6000C3624G-DTLABRWH": "Sin tienda americana. Los 48 GB DDR5-6000 ya están cubiertos por "
                               "G.SKILL Trident Z5 Neo RGB y TEAMGROUP T-Force Delta RGB 6400.",
    "AX5U8000C3816G-DCLARBK": "Sin tienda americana. Por encima de 7000 MT/s el catálogo ya ofrece "
                              "TEAMGROUP T-Force Xtreem 7200 y KINGSTON FURY Renegade RGB 7200.",
    "COREREACTORII650G-BKCUS": "Descatalogada: sin ofertas ni en EE.UU. ni en Alemania (geizhals: "
                               "'keine Angebote'). La línea sigue en el catálogo con precio "
                               "americano en 850 W, 1000 W y 1200 W.",
}

# --- 2. Los que se quedan: país y precio de tienda de ese país -------------------------------
FUENTE_DE = "geizhals.de (Alemania)"
ALEMANIA = {
    "B650M-SILVER": (109.00, "Biostar B650M-Silver, 28-09 ofertas listadas en geizhals.de"),
    "SRP-CBC651-A5A51JF": (44.59, "Seasonic Core BC-650 650W ATX 3.1, 28 ofertas en geizhals.de"),
    "SRP-CGC751-A5A32SF": (58.90, "Seasonic Core GC-750 750W ATX 3.1, 26 ofertas en geizhals.de"),
    "BP010EU": (52.87, "be quiet! System Power 11 550W ATX 3.1, 46 ofertas en geizhals.de"),
    "PPA6506804": (63.89, "FSP VITA GD 650W ATX 3.1, 8 ofertas en geizhals.de"),
    "PPA12A1502": (165.98, "FSP Mega GM 1200W ATX 3.1 (MEGA-1200GM), 12 ofertas en geizhals.de"),
}
# Se vende en Alemania pero sin precio firme comprobado (geizhals pidió verificación humana)
SOLO_PAIS = {
    "90YE00D6-B0NA00": "ASUS TUF Gaming 650B EVO: figura en geizhals.de y alternate.de con ofertas, "
                       "pero no se pudo leer el precio exacto (verificación anti-bot)",
}
NOTA_NO_EEUU = ("Este producto no se vende en EE.UU. Sí se vende en Europa: traerlo corre por cuenta "
                "del comprador (envío, aduana e impuestos) y sin garantía en EE.UU.")

cat = json.load(open(CAT, encoding="utf-8"))
por_mpn = {p.get("mpn"): p for p in cat}

for mpn, motivo in RETIRAR.items():
    p = por_mpn[mpn]
    p["fuera_de_web"] = {"fecha": HOY, "motivo": motivo,
                         "decision": "usuario, 15-09-2026: retirar de la web los duplicados sin "
                                     "precio americano; el producto NO se borra del catálogo"}
    print("retirado de la web: %-46s" % (p["marca"] + " " + p["modelo"])[:46])

for mpn, (eur, nota) in ALEMANIA.items():
    p = por_mpn[mpn]
    p.update(precio_usd=None, precio_usd_fecha=HOY, precio_usd_fuente=FUENTE_DE,
             precio_usd_nota="revisado en ficha (Alemania): %s. Sin tiendas en EE.UU." % nota,
             precio_usd_revisar=False, precio_pais="DE",
             precio_original={"moneda": "EUR", "valor": eur, "iva_incluido": 0.19},
             precio_referencia_eu={"usd": round(eur / 1.19 * 1.1592, 2), "origen": "DE",
                                   "local": {"moneda": "EUR", "valor": eur, "iva_incluido": 0.19},
                                   "fecha": HOY, "nota": "dato interno, no se muestra en la web"},
             disponibilidad="importacion_global", disponibilidad_motivo="sin_canal_america",
             disponibilidad_nota=NOTA_NO_EEUU, pais_venta="Alemania")
    print("se queda, precio alemán: %-40s €%.2f" % ((p["marca"] + " " + p["modelo"])[:40], eur))

for mpn, nota in SOLO_PAIS.items():
    p = por_mpn[mpn]
    p.update(precio_usd=None, precio_usd_fecha=HOY, precio_usd_fuente=FUENTE_DE,
             precio_usd_nota="revisado en ficha: %s. Sin tiendas en EE.UU." % nota,
             precio_usd_revisar=True, precio_pais="DE",
             disponibilidad="importacion_global", disponibilidad_motivo="sin_canal_america",
             disponibilidad_nota=NOTA_NO_EEUU, pais_venta="Alemania")
    p.pop("precio_original", None)
    print("se queda, sólo país:     %-40s Alemania" % (p["marca"] + " " + p["modelo"])[:40])

json.dump(cat, open(CAT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("\n%d retirados de la web · %d con país y precio · %d sólo con país"
      % (len(RETIRAR), len(ALEMANIA), len(SOLO_PAIS)))
