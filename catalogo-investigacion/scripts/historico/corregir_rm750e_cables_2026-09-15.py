# -*- coding: utf-8 -*-
"""Corsair RM750e (CP-9020295-NA): la ficha del catalogo (alternate/geizhals) decia que trae un solo
cable de 8 pines para la grafica. La ficha oficial de Corsair (corsair.com, 15-09-2026) lista:

  1x Modular ATX 24-pin · 2x EPS / ATX 12V 8-pin (4+4) · 1x 12V-2x6 (12+4) Pin ·
  1x "12V-2x6 to Dual 8-Pin (6+2)" (2 conectores) · 1x PCIe 8-Pin (6+2) ·
  1x SATA (4) · 1x SATA/PATA (2 SATA + 2 PATA)

Es decir: la grafica tiene hasta 3 conectores de 8 pines (1 directo + 2 del cable que sale del
puerto 12V-2x6), o el 12V-2x6 nativo. Con el dato viejo, la regla nueva de cables del
configurador habria bloqueado las 4 RX 9070 de 2 cables, que si se pueden montar.
Se comprobo antes de crear la regla, como quedo anotado en el analisis de montaje.

Respaldo previo: catalogo/catalogo-final.BACKUP-2026-09-15-1640-antes-reglas-montaje.json
"""
import json
import os

CAT = os.path.join(os.path.dirname(__file__), "..", "catalogo", "catalogo-final.json")
cat = json.load(open(CAT, encoding="utf-8"))
p = next(x for x in cat if x.get("mpn") == "CP-9020295-NA")
antes = p["specs"].get("Conectores")
p["specs"]["Conectores"] = ("1x 24-Pin-ATX12V-2.x, 2x 4+4-Pin-12V, 2x 4-Pin-5,25\", "
                            "3x 6+2-Pin-gráfica, 1x 12+4 Pin (12V-2x6), 6x 15-Pin-SATA")
p["specs_corregido_2026_09_15"] = {
    "campo": "Conectores", "antes": antes,
    "fuente": "corsair.com, ficha oficial de CP-9020295-NA (15-09-2026)",
    "nota": ("De los 3 conectores de 8 pines, 2 salen del cable '12V-2x6 to Dual 8-Pin', que usa el "
             "mismo puerto que el cable 12V-2x6: o 3x 8 pines, o 1x 8 pines + el 12V-2x6 nativo."),
}
json.dump(cat, open(CAT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("RM750e Conectores:\n  antes:", antes, "\n  ahora:", p["specs"]["Conectores"])
