> **Nota (2026-09-13):** informe histórico. Sus precios son del 08-09 y ya no valen: los precios vigentes están en `catalogo/catalogo-final.json` (`precio_usd`, `precio_pen`, `disponibilidad`; Perú como base, EE.UU. verificado). Ver `ESTADO-DEL-PROYECTO.md`.

# Informe de discrepancias — Vuelta 1

**Fecha:** 2026-09-08 · **Alcance:** RAM (18) + Placas madre (20)
**Estado:** precios RAM completos · precios placas 6/20 · imágenes 5/38

---

## 1. DATO NO VERÍDICO

### 1.1 RAM — precios inválidos en bloque (los 18)
Ver `HALLAZGO-CRITICO.md` y `RANGOS-PRECIO-RAM.md`.
**Todos** los precios de RAM del catálogo están entre 2.6x y 7.2x por debajo.
Causa: crisis mundial de DRAM 2026. No es un error de redacción, es que el
mercado cambió por completo.

### 1.2 Placas madre — desvíos individuales (no hay crisis)
A diferencia de la RAM, las placas **no** están en crisis. Los precios del
catálogo son razonables en general, con estas excepciones:

| # | Placa | Catálogo | Real (sept 2026) | Veredicto |
|---|---|---|---|---|
| 17 | ASUS ROG Maximus Z890 Hero | ~$660 | $334 – $450 | ❌ **muy alto**, casi el doble |
| 7 | MSI MAG X870 Tomahawk WiFi | ~$260 | $189 – $227 | ❌ alto |
| 2 | MSI MAG B650 Tomahawk WiFi | ~$180 | $224 (MSRP $259) | ❌ bajo |
| 11 | ASUS ROG Crosshair X870E Hero | ~$600 | $580 (MSRP $699) | ✅ correcto |
| 9 | Gigabyte X870 AORUS Elite WiFi7 | ~$280 | $250 – $300 | ✅ correcto |
| 15 | MSI MPG Z890 Edge Ti WiFi | ~$369 | $369 oficial | ✅ exacto |

**Nota aparte:** `src/data/components.json` lista el Crosshair X870E Hero a **$420**.
El precio real es ~$580 y su MSRP $699. Ese dato de la web está mal, más que el del catálogo.

### 1.3 Sellos de verificación poco fiables
Verificado antes: el Ryzen 7 9850X3D venía marcado "✅ Verificado en búsqueda"
y su boost (5.4 GHz) y precio ($520 vs $489-499 reales) estaban mal.
**Conclusión: el sello ✅ del catálogo original no garantiza nada.**

---

## 2. IMAGEN NO COINCIDE

Casos reales detectados y **descartados** en esta ronda:

| Producto | Lo que devolvió la extracción | Por qué se descartó |
|---|---|---|
| TeamGroup T-Force Vulcan DDR5 | Banner de "XTREEM CKD DDR5" | Producto distinto: es la gama Xtreem, no Vulcan |
| G.Skill Trident Z5 Neo | Collage de 4 productos (Ripjaws S5 + Trident Z5) | No es una ficha de producto, es una parrilla del catálogo |

Ambas se detectaron **solo al abrir la imagen y mirarla**. La URL parecía legítima
en los dos casos. Esto confirma que la verificación visual no es opcional.

---

## 3. IMÁGENES CONSEGUIDAS Y VERIFICADAS (5)

| Archivo | Producto | Resolución | Comprobación visual |
|---|---|---|---|
| `ram/ram-04-corsair-vengeance-ddr5-6000-32gb.webp` | Corsair Vengeance DDR5 | 1599x969, alpha | ✅ 2 módulos negros Vengeance DDR5 |
| `ram/ram-09-corsair-dominator-titanium-ddr5-6400-32gb.webp` | Corsair Dominator Titanium RGB | 1599x1599, alpha | ✅ 2 módulos con barra RGB |
| `ram/ram-16-corsair-vengeance-lpx-ddr4-3200-32gb.webp` | Corsair Vengeance LPX DDR4 | 799x304, alpha | ✅ 2 módulos LPX DDR4 |
| `ram/ram-03-teamgroup-vulcan-ddr5-dual.jpg` | TeamGroup T-Force Vulcan DDR5 | 1000x1000 | ✅ 2 módulos T-Force Vulcan |
| `placas/placa-17-asus-rog-maximus-z890-hero.png` | ASUS ROG Maximus Z890 Hero | 828x982 | ✅ placa ROG Maximus Hero, LGA1851 |

Las cuatro de Corsair traen **canal alpha (fondo transparente)** — ideal para fichas web.

---

## 4. NO ENCONTRADO / BLOQUEADO

| Fuente | Problema | Salida |
|---|---|---|
| **Icecat** | HTTP 429 sin autenticar | Sesión abierta en tus dos Chrome para que entres a mano |
| **Gigabyte** | Devuelve HTML en vez de la imagen, incluso con Referer. Protección anti-hotlink | Buscar en media kit o vía Icecat |
| **MSI** | La página carga, pero el render limpio no está en el DOM inicial. `/gallery` da 404 | Requiere navegar la galería a mano |
| **G.Skill** | La página de familia no tiene ficha por SKU | Ir a la URL del modelo concreto |

---

## 5. PATRONES DE CDN QUE FUNCIONAN

Para acelerar el resto:

```
Corsair    assets.corsair.com/image/upload/c_limit,f_auto,q_85,w_1600,h_1600/
           products/Memory/<SKU>/Gallery/<NOMBRE>.webp        ← con alpha
TeamGroup  images.teamgroupinc.com/products/memory/u-dimm/ddr5/
           <familia>/<color>/dual_01.jpg                       ← "dual" = kit de 2
ASUS/ROG   dlcdnwebimgs.asus.com/files/media/<uuid>/v1/img/kv/pd.png
```
