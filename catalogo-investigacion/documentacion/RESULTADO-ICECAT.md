> **Nota (2026-09-10):** informe histórico. Las rutas `imagenes/icecat/` que cita ya no existen: las imágenes están ahora en `catalogo/imagenes/placas/<gama>/`. Ver `ESTADO-DEL-PROYECTO.md`.

# Resultado de la prueba con Icecat — 2026-09-09

## El embudo

```
101  productos enviados
 22  emparejados por Icecat        (21.78%)
 16  UTILIZABLES con tu cuenta Open
  6  emparejados pero sin autorizacion  (ASRock x3, Thermalright x2, Noctua)
 79  no emparejados
```

## Qué entrega Icecat por cada producto utilizable

| Dato | Cobertura |
|---|---|
| **EAN / GTIN** | 14 de 16 |
| Especificaciones estructuradas | **72 de media por producto** |
| Imágenes de galería | **129 en total (~8 por producto)** |
| Título comercial | 16 de 16 |
| Resumen descriptivo | 16 de 16 |
| MPN real del fabricante | 16 de 16 |
| Descripción larga | 0 de 16 (es contenido de nivel Full) |

Las specs vienen con nombres legibles en español:
`Tipos de BIOS = UEFI AMI` · `Factor de forma = Micro ATX` · `Familia del chipset = AMD`

## Las imágenes

El ZIP trae **5 resoluciones de cada imagen**:

| Resolución | Archivos | Tamaño | Media | Uso |
|---|---|---|---|---|
| thumb | 129 | 0.6 MB | 5 KB | listados compactos |
| low-res | 129 | 2.8 MB | 22 KB | miniaturas |
| **medium-res** | 129 | **14.5 MB** | **110 KB** | **fichas y tarjetas** ← extraídas |
| high-res | 129 | 397 MB | 3.1 MB | origen para portadas |
| original | 129 | 675 MB | 5.2 MB | **descartable** (hasta 34 MB por archivo) |

`medium-res` son 500 px en el lado largo. `high-res` van de 2000 a 2800 px.

Extraje las 129 de `medium-res` en `imagenes/icecat/`. Verificada visualmente
la primera: ASUS PRIME B650M-A WIFI II con caja y antena, fondo blanco limpio.

## Por qué solo 16 de 101

**Placas madre 19/20. Todo lo demás cerca de cero.**

Las placas casaron porque su nombre comercial ES el código de fabricante
(`MAG X870 TOMAHAWK WIFI`). En el resto le dimos nombres de marketing:

| Le mandamos | El código real |
|---|---|
| `Ryzen 5 5600` | `100-100000927BOX` |
| `Vengeance DDR5-6000 32GB` | `CMK32GX5M2B6000C30` |

**No es falta de cobertura de Icecat. Es que no supimos identificar los productos.**

Prueba de ello: Icecat nos devolvió el MPN real de los que sí casaron
(`90MB1EG0-M0EAY0` para el ASUS PRIME). Tiene los datos; hay que preguntarle bien.

## Archivos generados

| Archivo | Contenido |
|---|---|
| `PLACAS_16-originales_FICHAS-especificaciones.json` | Los 16 con EAN, specs, imágenes y galería |
| `PLACAS_16-originales_FICHAS-especificaciones.csv` | PCF original de Icecat (206 columnas) |
| `PLACAS_16-originales_INDICE-ean-e-imagenes.csv` | PIF con EAN y URL del XML por producto |
| `REFERENCIA_79-productos-que-icecat-no-tiene.csv` | Los que no emparejaron |
| `imagenes/icecat/` | 129 imágenes medium-res |

## Siguiente paso lógico

Conseguir los MPN reales de las 4 categorías que fallaron (CPU, GPU, RAM,
almacenamiento/fuentes) y relanzar. Cada MPN correcto es un producto recuperado.
