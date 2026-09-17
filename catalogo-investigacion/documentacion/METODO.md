# Método que funciona (probado 2026-09-08)

Documentado para poder continuar sin volver a descubrirlo.

## Datos (specs + precios) — ✅ fiable
Búsqueda web. Devuelve specs y precios con buena calidad.
Contrastar siempre con **2 fuentes** antes de dar un precio por bueno.

## Imágenes — ✅ funciona, con truco
1. El **panel del navegador debe permanecer abierto**. Si se cierra, `navigate`
   falla con "denied or failed". Reabrir con `preview_start` + url, no con `navigate`.
2. Las imágenes de producto son **lazy-loaded**: leer `img.src` directamente
   devuelve placeholders `data:image/gif;base64,...`. Inútil.
3. La imagen buena está en el carrusel. Selector que funciona:
   `[class*=gallery] img` o `[class*=swiper] img`
4. Descargar con `curl -L -A "Mozilla/5.0"`.
5. **Verificar mirando la imagen** con la herramienta Read. Imprescindible:
   la extracción automática trae banners y productos relacionados con facilidad.

## Estado de las fuentes probadas

| Fuente | Estado | Nota |
|---|---|---|
| Búsqueda web | ✅ | Para specs y precios |
| corsair.com | ✅ | Galería en `[class*=gallery] img`. Imagen 1600px con **fondo transparente** |
| techpowerup.com | ✅ | Solo bases de datos de CPU y GPU (no RAM ni placas) |
| gskill.com | ✅ carga | URLs de producto hay que buscarlas, no adivinarlas |
| **icecat.biz** | ❌ **429 Too Many Requests** | Bloqueado por límite de peticiones. Ver nota |
| Descarga simple (sin navegador) | ❌ 403 | msi.com, techpowerup |

### Nota sobre Icecat
Devuelve **429** desde este entorno sin autenticar. Para usarlo haría falta
la sesión autenticada del usuario vía Claude en Chrome. Mientras tanto,
la vía que funciona es la web del fabricante.

## Ejemplo verificado extremo a extremo
`Corsair Vengeance DDR5-6000 32GB CL30`
- Imagen: `assets.corsair.com/.../Gallery/VENGEANCE_DDR5_BLK_01_2up.webp`
- Descargada: 1599x969 WebP con canal alpha, 168 KB
- **Verificada visualmente:** 2 módulos negros Vengeance DDR5, fondo transparente. Correcta.
