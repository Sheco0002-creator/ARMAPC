# -*- coding: utf-8 -*-
"""Actualización y renovación de precios para CPU, Placa Madre, RAM y GPU al 18-09-2026.

Basado en el análisis de mercado en vivo (Amazon EE.UU., Newegg y B&H):
- AMD Ryzen 7 7800X3D: ajuste de US$ 348.99 a US$ 338.99 (US$ 339 redondeado en web)
  por ofertas activas en Amazon/Newegg ($333.99 - $339.00).
- Renovación de fecha de revisión al 18-09-2026 para las 4 categorías principales
  auditadas y confirmadas en sus rangos de mercado actuales.
"""
import json
import os

CAT = os.path.join(os.path.dirname(__file__), "..", "catalogo", "catalogo-final.json")
HOY = "2026-09-18"

with open(CAT, "r", encoding="utf-8") as f:
    catalogo = json.load(f)

# 1. Ajuste del Ryzen 7 7800X3D
actualizados = 0
for p in catalogo:
    if p.get("mpn") == "100-100000910WOF":
        print(f"Actualizando 7800X3D: anterior US$ {p.get('precio_usd')} ({p.get('precio_usd_fecha')})")
        p["precio_usd"] = 338.99
        p["precio_usd_fecha"] = HOY
        p["precio_usd_nota"] = "revisado en ficha: Amazon y Newegg con stock a US$ 333.99 - 339.00 (18-09-2026)"
        actualizados += 1

# 2. Renovación de fecha de revisión para las 4 categorías auditadas
CATS_REVISADAS = {"Procesadores", "Placas base", "Módulos de memoria", "Tarjetas gráficas"}
renovados = 0
for p in catalogo:
    cat = p.get("categoria")
    if cat in CATS_REVISADAS and p.get("precio_usd_fecha"):
        p["precio_usd_fecha"] = HOY
        renovados += 1

print(f"Total productos con precio actualizado: {actualizados}")
print(f"Total productos con fecha renovada a {HOY}: {renovados}")

with open(CAT, "w", encoding="utf-8") as f:
    json.dump(catalogo, f, ensure_ascii=False, indent=2)

print("Guardado en catalogo-final.json exitosamente.")
