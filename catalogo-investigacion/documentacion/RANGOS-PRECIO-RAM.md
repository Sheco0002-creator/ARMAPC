> **Nota (2026-09-13):** informe histórico. Sus precios son del 08-09 y ya no valen: los precios vigentes están en `catalogo/catalogo-final.json` (`precio_usd`, `precio_pen`, `disponibilidad`; Perú como base, EE.UU. verificado). Ver `ESTADO-DEL-PROYECTO.md`. Estos rangos sólo los usa `scripts/integrar_gpu_ram.py` como `precio_referencia`, un campo del esquema antiguo que la web no muestra.

# Rangos de precio de RAM — formato Opción 2

**Verificado:** 2026-09-08 · **Moneda:** USD · **Revisar:** cada 30 días

> ⚠️ Precios afectados por la escasez mundial de DRAM de 2026.
> Los fabricantes desviaron capacidad hacia memoria HBM para centros de datos de IA.
> El índice DDR5 de 3DCenter marcó **486%** de su nivel de julio 2025.
> TrendForce prevé **+13-18% adicional** este trimestre.

## Rangos para publicar en la web

| Tier | Rango real (sept 2026) | Decía el catálogo | Desvío |
|---|---|---|---|
| DDR5 16GB (2x8) | **$105 – $140** | $42 – $48 | ~2.6x |
| DDR5 32GB (2x16) | **$490 – $620** | $82 – $90 | ~6.2x |
| DDR5 48GB (2x24) | **$675 – $870** | $110 – $130 | ~6.0x |
| DDR5 64GB (2x32) | **$1,000 – $1,300** | $165 – $200 | ~5.8x |
| DDR4 16GB (2x8) | **$150 – $185** | $32 | ~5.8x |
| DDR4 32GB (2x16) | **$240 – $300** | $52 – $58 | ~4.9x |

## Texto sugerido para la web

> **Nota sobre precios de memoria:** los precios de RAM están excepcionalmente altos
> desde 2026 por la escasez global de DRAM: los fabricantes priorizan memoria HBM
> para centros de datos de IA. Un kit de 32 GB que en 2025 costaba unos $90 hoy
> ronda los $500. Los rangos mostrados se revisaron el 8 de septiembre de 2026
> y podrían seguir subiendo.

## Evidencia por producto

| Producto | Precio verificado | Fuente |
|---|---|---|
| Corsair Vengeance DDR5-6000 32GB CL30 | $539.99 (antes $625.99) | corsair.com oficial |
| Kingston Fury Beast DDR5-6000 32GB | $589.99 | Newegg |
| G.Skill Trident Z5 Neo DDR5-6000 32GB | $619.99 (pico $942.99 en julio) | Pangoly |
| TeamGroup T-Force Delta RGB DDR5-6000 32GB CL30 | $489.99 | Best Buy |
| Corsair Vengeance 48GB (2x24) 6000 CL36 | $689.99 | corsair.com oficial |
| Corsair Vengeance 48GB (2x24) 7000 CL36 | $870.99 | corsair.com oficial |
| G.Skill Trident Z5 6000 64GB (2x32) | $1,099.99 (pico $1,533 en agosto) | Pangoly |
| TeamGroup DDR5-6000 16GB (2x8) CL38 | $105.99 en oferta | Newegg / Slickdeals |
| Corsair Vengeance LPX DDR4-3200 32GB | $249.99 (antes $296.99) | corsair.com oficial |
| G.Skill Ripjaws V DDR4-3600 32GB | $239.99 | Pangoly |
| Kingston Fury Beast DDR4-3200 16GB | $184.99 | Pangoly |

## ⚠️ Dato descartado por inconsistente

Una ficha de Walmart lista un **Kingston Fury Beast DDR5 64GB (2x32) 5200 CL40 a $201.25**.
Es incoherente con el resto del mercado de 64GB ($1,000+) y con la propia crisis.
Probablemente sea un listado obsoleto o de un vendedor externo.
**No lo uso para el rango.** Queda anotado por transparencia.

## Fuente recomendada para revisiones futuras

Tom's Hardware mantiene un índice de precios de RAM actualizado:
https://www.tomshardware.com/pc-components/ram/ram-price-index-2026-lowest-price-on-ddr5-and-ddr4-memory-of-all-capacities
