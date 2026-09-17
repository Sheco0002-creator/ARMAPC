# -*- coding: utf-8 -*-
"""ASUS TUF Gaming 650W Bronze EVO: el ultimo producto de la web sin ningun precio.

El usuario aporto el 15-09-2026 la ficha oficial de ASUS y la lista de tiendas de la propia
pagina del fabricante ("Disponible en:"): ASUS Store, BEEP, PCBOX, APP Informatica, COOLMOD,
NEOBYTE y PC Componentes -- todas **espanolas** -- y Amazon marcado "No disponible". Es decir:
no es un producto aleman, es espanol. Precio de tienda 74,90 EUR con IVA (21 % en Espana), en
oferta a 64,90 EUR el 15-09-2026; se guarda el precio normal, que es el estable, y la oferta
queda anotada dentro del catalogo (no se muestra en la web: caduca).

Geizhals habia cortado con verificacion anti-bot al intentar leer el precio, asi que la ficha
se quedo como "Se vende en Alemania, precio por confirmar". Con el dato del fabricante se
corrige el pais y entra el precio.

La ficha oficial ademas desmiente dos datos que venian de Icecat/alternate:

  * **No es modular.** El catalogo decia "Cableado modular: Si". Los contenidos del paquete son
    cables fijos (motherboard 500 mm, CPU 650 mm, PCI-E 1-a-2, dos SATA+periferico) y los
    conectores son 1x 24/20, 1x 4+4 CPU, 2x 6+2 PCIe, 4x SATA, 2x periferico: cableado fijo.
    El resumen que se ve en la tarjeta tambien decia "modular" y se corrige.
  * **Los conectores eran los de una fuente mayor** (2x 4+4 CPU y 3x 6+2 PCIe). Se sustituyen
    por los de la ficha de ASUS.

Y se corrigen/anaden: certificacion 80 PLUS Bronze (la ficha oficial no menciona el Cybenetics
Silver que traia Icecat, y el nombre del producto es "Bronze"), peso real 1,252 kg, +12V
54,16 A, estandar "ATX12V, ATX 3.1", MTBF y un "Ventilador: 1x null mm ventilador" que era
basura de importacion y se elimina (la ficha de ASUS no da el tamano del ventilador).

Lo que NO se toca: las corrientes de +3,3 V y +5 V (20 A) y los 110 W combinados que ya estaban.
La tabla de ASUS ahi se contradice consigo misma (dice 12 A de carga maxima y 80 W combinados,
imposible en 3,3 V), asi que se deja el dato anterior antes que meter uno peor.

Respaldo previo: catalogo/catalogo-final.BACKUP-2026-09-15-1450-antes-asus-tuf-650b-espana.json
"""
import json
import os

CAT = os.path.join(os.path.dirname(__file__), "..", "catalogo", "catalogo-final.json")
HOY = "2026-09-15"
MPN = "90YE00D6-B0NA00"
EUR, EUR_OFERTA, IVA_ES = 74.90, 64.90, 0.21
FX_EUR = 1.1592   # mismo tipo de cambio que usa precio_referencia_eu y el exportador

cat = json.load(open(CAT, encoding="utf-8"))
p = next(x for x in cat if x.get("mpn") == MPN)

p.update(
    precio_usd=None,
    precio_usd_fecha=HOY,
    precio_usd_fuente="asus.com/es (España)",
    precio_usd_nota=(
        "revisado en la ficha oficial de ASUS (apartado 'Disponible en'): se vende en España "
        "en ASUS Store, BEEP, PCBOX, APP, COOLMOD, NEOBYTE y PC Componentes; en Amazon figura "
        "como no disponible. Precio de tienda 74,90 EUR con IVA (en oferta a 64,90 EUR el "
        "15-09-2026). Sin tiendas en EE.UU."),
    precio_usd_revisar=False,
    precio_pais="ES",
    pais_venta="España",
    precio_original={"moneda": "EUR", "valor": EUR, "iva_incluido": IVA_ES},
    precio_referencia_eu={"usd": round(EUR / (1 + IVA_ES) * FX_EUR, 2), "origen": "ES",
                          "local": {"moneda": "EUR", "valor": EUR, "iva_incluido": IVA_ES},
                          "oferta_local": {"moneda": "EUR", "valor": EUR_OFERTA, "fecha": HOY,
                                           "nota": "oferta puntual, no se muestra en la web"},
                          "fecha": HOY, "nota": "dato interno, no se muestra en la web"},
    resumen="ASUS TUF Gaming 650W Bronze EVO, 80 PLUS Bronze, ATX 3.1, no modular",
)
p.pop("precio_usd_revisado_us", None)   # ya no procede: el producto tiene precio y pais

s = p["specs"]
s["Certificacion" if "Certificacion" in s else "Certificación"] = "80 PLUS Bronze"
s["Estandar" if "Estandar" in s else "Estándar"] = "ATX12V, ATX 3.1"
s["Cableado modular"] = "No"
s["Peso"] = "1,252 kg"
s["Corriente +12 V total"] = "54,16 A"
s["Corriente +12 V1"] = "54,16 A"
s["Conectores"] = ("1x 24/20-Pin-ATX12V, 1x 4+4-Pin-12V, 2x 6+2-Pin-gráfica, "
                   "4x 15-Pin-SATA, 2x 4-Pin-periférico")
s["MTBF"] = "> 120.000 h a 40 °C"
s.pop("Ventilador", None)               # venia como "1x null mm ventilador"
p["n_specs"] = len(s)

json.dump(cat, open(CAT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("%s %s" % (p["marca"], p["modelo"]))
print("  pais    : %s (antes Alemania)" % p["pais_venta"])
print("  precio  : EUR %.2f con IVA %d %%  ->  US$ %.2f sin IVA (interno)"
      % (EUR, IVA_ES * 100, p["precio_referencia_eu"]["usd"]))
print("  modular : %s (antes Si)" % s["Cableado modular"])
print("  specs   : %d" % p["n_specs"])
