> **Nota (2026-09-13):** informe histórico. Sus precios son del 08-09 y ya no valen: los precios vigentes están en `catalogo/catalogo-final.json` (`precio_usd`, `precio_pen`, `disponibilidad`; Perú como base, EE.UU. verificado). Ver `ESTADO-DEL-PROYECTO.md`. `src/data/components.json` de la web no se ha tocado desde entonces: sus precios se sustituyen en la integración.

# 🚨 HALLAZGO CRÍTICO — Precios de RAM del catálogo inválidos

**Fecha de verificación:** 2026-09-08
**Afecta a:** los 18 kits de `04_MEMORIA_RAM.md` y a los 4 items de RAM de `src/data/components.json`

---

## El problema

Existe una **crisis mundial de memoria DRAM en 2026** causada por el desvío de capacidad
de fabricación hacia HBM para IA. Los precios de RAM del catálogo NO están
"un poco desactualizados": están **entre 4x y 7x por debajo del precio real**.

### Evidencia recogida (3 fuentes independientes)

| Fuente | Dato |
|---|---|
| Índice 3DCenter, agosto 2026 | DDR5 al **486%** de su base de julio 2025 (~4.9x) |
| TrendForce | Previsión de **+13% a +18% adicional** en Q3 2026 |
| SK Hynix (CEO Kwak Noh-Jung) | La escasez podría prolongarse **hasta 2030** |

### Comparación producto a producto

| # | Producto | Catálogo dice | Precio real (sept 2026) | Desvío |
|---|---|---|---|---|
| 4 | Corsair Vengeance DDR5-6000 32GB CL30 | ~$85 | **$489.99** | **5.8x** |
| 5 | G.Skill Trident Z5 Neo DDR5-6000 32GB CL30 | ~$90 | **$619.99** (pico $942 en julio) | **6.9x** |
| 6 | Kingston Fury Beast DDR5-6000 32GB | ~$82 | **$589.99** | **7.2x** |
| 14 | G.Skill Trident Z5 6000 64GB (2x32) | ~$200 | **$1,099.99** (pico $1,533 en agosto) | **5.5x** |
| 16 | Corsair Vengeance LPX **DDR4**-3200 32GB | ~$52 | **$249.99** | **4.8x** |

**La DDR4 también está afectada.** No hay refugio en la plataforma antigua.

---

## Impacto en tu web

Esto no es solo un error de catálogo. `src/data/components.json` lista la RAM entre
**$65 y $220**. Con precios reales de $250 a $1,100, tu **calculadora de presupuesto**
(`BuildCalculatorModal.tsx`) y la página `/presupuestos` están produciendo totales
que subestiman gravemente el costo de cualquier build.

Un build que tu web presenta como "$1,200" puede costar hoy $1,700 o más solo por la RAM.

---

## Decisión que requiere el usuario

Con los precios moviéndose un 13-18% por trimestre, publicar un precio fijo de RAM
en la web tiene fecha de caducidad de semanas. Tres opciones:

1. **Publicar precio + fecha visible** ("RAM: $490 — precio a 8 sept 2026"). Honesto, pero envejece.
2. **Publicar rango** ("$450-650") con aviso de crisis DRAM. Más robusto.
3. **Ocultar el precio de RAM** y enlazar a tienda. Nunca se equivoca, pero pierde la calculadora.

Recomendación: **opción 2**, más un aviso en la sección de RAM explicando la crisis.
Es información valiosa para tu lector, no solo un descargo de responsabilidad.

---

## Fuentes

- 3DCenter / Wccftech — https://wccftech.com/roundup/memory-crisis/
- Tech-Insider — https://tech-insider.org/ddr5-ram-prices-2026-pc-builders/
- TechTimes — https://www.techtimes.com/articles/324825/20260818/ai-wiped-out-two-decades-falling-ram-prices-full-ddr5-table-builders.htm
- Corsair (precio oficial DDR4 LPX) — https://www.corsair.com/us/en/p/memory/cmk32gx4m2e3200c16/
- Pangoly price history — https://pangoly.com/en/price-history/corsair-vengeance-32gb-2x16gb-ddr5-6000mhz-cl30
