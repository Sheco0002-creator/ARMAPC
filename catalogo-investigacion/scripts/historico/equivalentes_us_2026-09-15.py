# -*- coding: utf-8 -*-
"""Sustituye por su equivalente americano los productos que sólo existían en versión europea.

Tercera ronda del 15-09-2026. De los 18 que seguían sin precio americano, tres tienen equivalente
directo y verificado en EE.UU.:

1. ASUS ROG Thor 1200W Platinum III — es el MISMO producto: ASUS lo vende en EE.UU. como
   ROG-THOR-1200P3-GAMING con la referencia regional 90YE00V2-BPAA00 (la nuestra, -B0NA00, es la
   europea). Sólo cambia el código y entra el precio de tienda.
2. Cooler Master Elite Gold 1000 — misma fuente con referencia americana MPX-A005-AFAG-BUS
   (la nuestra, MPW-A001-AFAG-BEU, es la europea). De paso se corrige "Cableado modular", que
   faltaba en la ficha alemana y hacía que la web dijera "No modular" siendo full-modular.
3. Cooler Master Elite Gold 750 → **Elite Gold 850**: en EE.UU. esta línea empieza en 850 W
   (MPX-8505-AFAG-BUS, US$ 99.99, la 850 W más barata del catálogo). Es cambio de producto, no de
   código: se reescriben modelo, MPN, título, slug y specs con la ficha oficial de Cooler Master.
   La foto se mantiene: Elite Gold 750, 850 y 1000 son el mismo diseño de la serie Elite, y el
   estándar de fotos del proyecto admite expresamente compartir foto entre hermanos de diseño.

Lo anterior no se borra: queda en `sustituye_a` dentro de la propia ficha.
Respaldo previo: catalogo/catalogo-final.BACKUP-2026-09-15-1240-antes-equivalentes-us.json
"""
import json
import os

CAT = os.path.join(os.path.dirname(__file__), "..", "catalogo", "catalogo-final.json")
HOY = "2026-09-15"
NOTA_US = ("No hay stock local. Este producto se vende en EE.UU. y puedes importarlo por tu cuenta "
           "(Amazon, Newegg y similares). El envío, los impuestos de importación y la garantía corren "
           "por cuenta del comprador: no hay garantía local.")

cat = json.load(open(CAT, encoding="utf-8"))
por_mpn = {p.get("mpn"): p for p in cat}


def a_americano(p, precio, nota, mpn_us=None):
    p["sustituye_a"] = {"mpn": p["mpn"], "modelo": p["modelo"], "fecha": HOY,
                        "motivo": "referencia europea sin venta en EE.UU."}
    if mpn_us:
        p["mpn"] = mpn_us
    p.update(precio_usd=precio, precio_usd_fecha=HOY, precio_usd_fuente="newegg.com (EE.UU.)",
             precio_usd_nota=nota, precio_usd_revisar=False, precio_verificado=True,
             precio_pais="US", disponibilidad="importacion_us", disponibilidad_nota=NOTA_US)
    for k in ("disponibilidad_motivo", "precio_usd_revisado_us", "aviso_extra"):
        p.pop(k, None)


# 1) ASUS ROG Thor 1200W Platinum III -> referencia americana
thor = por_mpn["90YE00V2-B0NA00"]
a_americano(thor, 577.00,
            "revisado en ficha: Newegg, ROG-THOR-1200P3-GAMING, con stock. La referencia americana "
            "es 90YE00V2-BPAA00 (la europea era 90YE00V2-B0NA00); mismo producto",
            mpn_us="90YE00V2-BPAA00")

# 2) Cooler Master Elite Gold 1000 -> referencia americana + corregir cableado modular
cm1000 = por_mpn["MPW-A001-AFAG-BEU"]
a_americano(cm1000, 136.98,
            "revisado en ficha: Newegg, MPX-A005-AFAG-BUS, con stock. Referencia americana de la "
            "misma fuente (la europea era MPW-A001-AFAG-BEU)",
            mpn_us="MPX-A005-AFAG-BUS")
cm1000["specs"]["Cableado modular"] = "Sí"   # ficha oficial de Cooler Master: full modular
cm1000["specs"]["PCIe"] = "5.1"

# 3) Cooler Master Elite Gold 750 -> Elite Gold 850 (la de la línea que sí se vende en EE.UU.)
cm750 = por_mpn["MPX-7505-AFAG-BEU"]
a_americano(cm750, 99.99,
            "revisado en ficha: Newegg, MPX-8505-AFAG-BUS, con stock. En EE.UU. la serie Elite Gold "
            "empieza en 850 W: sustituye a la Elite Gold 750, que sólo se vende en Europa",
            mpn_us="MPX-8505-AFAG-BUS")
cm750.update(modelo="Elite Gold 850",
             titulo="Fuente de poder Cooler Master Elite Gold 850",
             resumen="Cooler Master Elite Gold 850, 80 PLUS Gold, ATX 3.1, modular",
             slug="cooler-master-elite-gold-850",
             url_oficial="https://www.coolermaster.com/en-global/products/elite-gold-850/",
             ean="", ean_confirmado=False, gama="media", precio_referencia="~$100")
cm750["specs"].update({  # ficha oficial de Cooler Master (coolermaster.com), 15-09-2026
    "Potencia": "850 W",
    "Potencia total": "850 W",
    "Certificación": "80 PLUS Gold",
    "Eficiencia": "Hasta 90 %",
    "Estándar": "ATX12V 3.1, EPS12V",
    "PCIe": "5.1",
    "Formato": "ATX",
    "Cableado modular": "Sí",
    "Conector 12V-2x6 / 12VHPWR": "Sí",
    "Ventilador": "1x 120 mm ventilador (rodamiento rifle)",
    "Dimensiones": "Ancho: 150 mm x Alto: 86 mm x Profundidad: 140 mm",
    "Tensión de entrada": "100-240 V",
    "Conectores": "1x 24-Pin-ATX12V-2.x, 1x 4+4-Pin-12V, 1x 8-Pin-12V, 3x 6+2-Pin-gráfica, "
                  "1x 12+4 Pin, 4x SATA/periféricos",
    "Protecciones": "Sobretensión (OVP), Subtensión (UVP), Sobrecarga (OLP/OPP), "
                    "Sobretemperatura (OTP), Cortocircuito (SCP)",
    "Serie": "Elite",
    "Color": "negro",
})
cm750["foto_compartida"] = ("Misma foto que la Elite Gold 750/1000: idéntico diseño de la serie "
                            "Elite (140 x 150 x 86 mm). Ver 'Estándar de fotos' en ESTADO.")

json.dump(cat, open(CAT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for p in (thor, cm1000, cm750):
    print("%-42s %-24s US$ %s" % (p["marca"] + " " + p["modelo"], p["mpn"], p["precio_usd"]))
