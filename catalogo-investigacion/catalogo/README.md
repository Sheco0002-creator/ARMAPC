# Catálogo — cómo leer los datos

Datos de producto (fichas, fotos, precios y disponibilidad) para la web ArmaPC. Mercado: EE.UU.,
Hispanoamérica y Brasil. Estado general y decisiones del proyecto en `../ESTADO-DEL-PROYECTO.md`.
Reescrito el 2026-09-13 (el anterior describía la versión de 30 placas).

## Punto de entrada

**`catalogo-final.json`** — el único archivo que necesita la web: una lista de **274 productos**.

| Categoría (`categoria`) | N | Carpeta de imágenes |
|---|---|---|
| Placas base | 30 | `placas` |
| Tarjetas gráficas | 61 | `gpus` |
| Módulos de memoria | 30 | `ram` |
| Procesadores | 21 | `procesadores` |
| Almacenamiento | 32 | `almacenamiento` |
| Fuentes de poder | 34 | `fuentes-poder` |
| Gabinetes | 28 | `gabinetes` |
| Refrigeración | 38 | `refrigeracion` |

Las rutas de imagen del JSON son **relativas a esta carpeta** (`catalogo/`).

## Campos para mostrar

| Campo | Descripción |
|---|---|
| `slug` | Identificador único para URLs — `gigabyte-z890-a-elite-wifi7` |
| `marca` / `modelo` / `mpn` | Identificación. `mpn` y `slug` son únicos |
| `ean` | Código de barras (3 productos sin él) |
| `categoria` · `gama` | Categoría (tabla de arriba) · `entrada` · `media` · `alta` · `extrema` (por **modelo**, no por precio) |
| `tipo` | Sólo refrigeración: `aire` o `liquida` |
| `titulo` / `resumen` | Textos para mostrar. **Ojo:** 16 `resumen` están en inglés (TeamGroup, AMD…) |
| `specs` / `n_specs` | Especificaciones en español (objeto clave → valor) |
| `imagen_principal` | La foto del producto (la única que usa la web; está dentro de `imagenes_local.high`) |
| `imagenes_local.high` | Desde el 13-09, **sólo la principal** · `n_fotos` = cuántas hay en C: (1, o 0 si es genérica) |
| `imagenes_local.medium` | Vacío desde el 13-09 (las copias de 500 px se archivaron con el resto) |
| `imagenes_archivadas_jorge` | `{carpeta, high, medium}`: el resto de la galería, movido a JORGE con las mismas rutas |
| `imagen_generica` | `true` = no hay foto válida; la principal es la silueta de `imagenes/_generica/` (8 productos) |
| `url_oficial` | Página del fabricante, cuando la hay |

## Precio y disponibilidad — la regla de la web

`disponibilidad` decide qué se muestra:

| `disponibilidad` | N | Qué significa | Precio que se muestra |
|---|---|---|---|
| `local` | 0 | *(vacío desde el 15-09-2026: era "se vende en Perú, con precio de Infotec")* | — |
| `importacion_us` | 223 | Precio verificado en EE.UU. | `precio_usd` (US$) |
| `importacion_global` | 55 | Sin precio verificado en EE.UU. (versión europea, sin canal, marca sancionada…) | Sólo en el **configurador**, nunca en presupuestos: aviso naranja + país y precio de tienda de ese país (ver abajo) |

- `disponibilidad_nota`: texto para el usuario. `disponibilidad_motivo` (sólo en `importacion_global`):
  `sin_precio_verificado` · `marca_europea` · `version_europea` · `modelo_no_en_peru` · `sin_canal_america` ·
  `sancion_eeuu` (4 DeepCool) · `en_peru_pendiente_confirmar`.
- `precio_usd` y su `precio_usd_fecha` / `precio_usd_fuente`: **siempre de una tienda de EE.UU.**
  (pcpartpicker.com, Newegg, Amazon, B&H). La web se dirige a EE.UU. y el precio base es el dólar
  americano (decisión del usuario, 15-09-2026).
- **Nada de precios peruanos.** Los 13 productos que tenían `precio_usd` derivado del precio de Infotec
  (Perú) se repreciaron el 15-09-2026 con precio americano; los que no se venden en EE.UU. pasaron a
  `importacion_global`. El rastro peruano de cada uno quedó en `precio_peru_interno` (dato interno, no se
  exporta). Lo hizo `scripts/precios_us_2026-09-15.py`. En una 2.ª ronda
  (`scripts/precios_us_sin_precio_2026-09-15.py`) se buscó precio americano para los 25 que no tenían
  ninguno: 6 lo tienen y 18 no se venden en EE.UU.; estos últimos llevan `precio_usd_revisado_us`
  {fecha, resultado, detalle, buscado_en} para no repetir la búsqueda. En una 3.ª ronda
  (`scripts/equivalentes_us_2026-09-15.py`) tres pasaron a su equivalente americano; cuando cambia el
  producto y no sólo el código, la ficha anterior queda en `sustituye_a` y, si la foto se hereda de un
  hermano de la misma serie, se explica en `foto_compartida`.
- **`fuera_de_web`** (8 productos, 15-09-2026): duplicados de un modelo que el catálogo ya ofrece con
  precio americano. Siguen en el catálogo con el motivo dentro del campo; `exportar_web.py` los salta
  leyendo ese mismo campo (no hay lista que mantener a mano).
- **`alta_2026_09_15`**: las 4 fuentes dadas de alta ese día como equivalente americano de una
  europea; dice a qué producto sustituyen en la práctica (la europea se conserva con su aviso).
- **`pais_venta`**: país donde se vende un producto que no llega a EE.UU. Si además tiene
  `precio_original` de una fuente de la tabla `PAIS` del exportador, la tarjeta naranja dice "Se vende
  en <país>: €X con IVA"; si no, "Se vende en <país>, precio por confirmar" (desde el 15-09-2026
  ningún producto de la web está en este caso). Todas las tarjetas naranjas llevan además
  `avisoImportacion`: importar corre por cuenta del comprador.
- **Precio español** (15-09-2026, ASUS TUF Gaming 650W Bronze EVO): `precio_usd_fuente`
  "asus.com/es (España)", `precio_original` con `iva_incluido: 0.21` (IVA español; el alemán es 0.19).
  Una oferta puntual se guarda en `precio_referencia_eu.oferta_local` y no se exporta.
- **Sin stock:** 13 precios en US$ salieron de una tienda agotada. Llevan `precio_usd_sin_stock: true` y
  `precio_usd_aviso` ("Sin stock en EE.UU. · precio de lista"): mostrar el precio **con ese aviso**, nunca
  como precio vigente. Donde se comprobó, `precio_usd_ultimo_con_stock` = `{valor, tienda, fecha}` para
  enseñarlo como contexto (hoy sólo la PNY RTX 5090: lista US$ 4.999,99; con stock US$ 4.199,99 el 10-07).
- `precio_pen*`: restos de la etapa peruana. **No se muestran en la web ni se exportan** (ni por producto
  ni como referencia bajo el total): se conservan sólo como registro interno.
- **`importacion_global` en el configurador (decisión del usuario, 13-09):** se pueden elegir y se les
  revisa la compatibilidad como a cualquiera, con un aviso **naranja**. Título según
  `disponibilidad_motivo`: "No disponible en EE.UU." (marca/versión europea, sin canal, modelo que no
  llega), "No se vende en EE.UU." (`sancion_eeuu`: los 3 DeepCool, marca en la lista SDN de la OFAC, con
  `aviso_extra` explicándolo) o "Sin precio verificado en EE.UU." (`sin_precio_verificado`: la marca sí se
  vende allí). Si `precio_usd_fuente` es de.pcpartpicker / uk.pcpartpicker, se enseña
  el precio de tienda de ese país (`precio_original`, con IVA) y para el total en dólares ese precio sin
  IVA × 1,1592 (EUR) o × 1,3508 (GBP), los tipos de `precio_referencia_eu`. Si no, "Sin precio" y no suma.
  El `precio_original` del Crucial P310 4TB **no** vale: sale de un marketplace peruano ya descartado.
  Lo hace `scripts/exportar_web.py`; el kit XPG Spectrix DDR4 queda fuera (no hay placa DDR4).

**Campos internos — no mostrar nunca:** `precio_pen_estimado` (fórmula que subestima 25-44 %),
`precio_referencia_eu` (salvo lo que el exportador toma para el aviso naranja, arriba), `precio_referencia` y
`precio_verificado` (esquema antiguo), `precio_peru_revisado`, `precio_usd_revisar`, `precio_usd_nota`,
`specs_corregido`, `specs_corregido_2026_09_15` (dato de la ficha cambiado por el del fabricante: campo,
valor anterior, fuente y nota; hoy sólo los cables de la Corsair RM750e), `specs_aviso`, `gama_criterio`, `fuente`, `icecat_id`, `imagen_alta*`, `imagen_500`,
`galeria` (URLs remotas de Icecat), `completo` / `faltante`. `precio_pais` (`DE`, `UK`, `ES`) es
informativo: manda `disponibilidad`.

## Imágenes

```
imagenes/<categoria>/<gama>/<high|medium>/<archivo>
imagenes/_generica/<categoria>.png     silueta + logo ARMAPC, 1200 px (respaldo)
```

Nombre: `MARCA_MPN_<ORIGEN>_n.ext` — `INT` Icecat, `CDN` web/CDN del fabricante, `FAB` galería del
fabricante (RAM), `BBY` Best Buy (CPU), `TDA` tienda peruana (Infotec). ASRock usa `_Ln`; quedan nombres
antiguos de RAM (`ram-NN-descripcion.ext`); `AMD_…_CHIP-AM5.jpg` es la foto de chip compartida del 7600.

**Fotos compartidas a propósito:** hermanos de capacidad o versión del mismo diseño (RX 9060 XT 8/16 GB,
SN850X 1/2/4 TB, FURY Beast…) y las cajas genéricas de AMD tienen la misma foto, copiada bajo el nombre
de cada producto. Revisado el 13-09: ninguna muestra otro modelo. En la web se puede servir un solo
archivo por hash.

Estándar de fotos y lo descartado: ver `../ESTADO-DEL-PROYECTO.md` ("Estándar de fotos"). Lo retirado
nunca se borra: está en el USB **JORGE**, `catalogo-investigacion-ARCHIVO/pruebas-y-superados/`.

**Una sola foto por producto (13-09):** la web sólo usa la principal, así que el resto de la galería
(1.830 fotos, 1,36 GB) se movió a JORGE `catalogo-investigacion-ARCHIVO/FOTOS-CATALOGO-no-usadas-en-web_2026-09-13/`
con las mismas rutas relativas y un `MANIFIESTO.json` (ruta, bytes, SHA-256, productos). Aquí quedan la
principal de cada producto y `_generica/`. Para devolver fotos: copiarlas con la misma ruta y volver a
ponerlas en `imagenes_local` (la lista está en `imagenes_archivadas_jorge`). Lo hizo
`scripts/archivar_fotos_no_usadas.py`.

## Datos de origen — `fuentes/`

Nombre: `CATEGORIA_que-contiene_TIPO`. Son los originales de Icecat y de fabricantes; la web no los usa.

| Tipo | Contenido |
|---|---|
| `LISTA-subida` | Lo que se mandó a Icecat para emparejar |
| `INDICE` | MPN → EAN → URL del XML de Icecat |
| `FICHAS` | Export de Icecat (`.xlsx`/`.csv`, ~190 columnas) o fichas de fabricante (`.json`) |
| `NO-ENCONTRADOS` | Lo que Icecat no emparejó |

Subcarpetas: `placas-madre/` · `gpus/` · `ram/` · `referencia/` (lista maestra de 101 productos, los 79
que Icecat no tiene y el catálogo web original de 38 productos).

## Respaldo

Se guardan aquí los **3 últimos** `catalogo-final.BACKUP-<fecha>-antes-<cambio>.json`; los anteriores
están en JORGE `pruebas-y-superados/BACKUPS-catalogo-antiguos_2026-09-13/`. Los ZIP originales de Icecat
(todas las resoluciones) están en JORGE `catalogo-investigacion-ARCHIVO/ZIPS-ICECAT-originales/`.

## Estilo pecera (16-09-2026)

Desde el 16-09-2026 el catálogo tiene **344 productos**: +66 de `scripts/alta_pecera_2026-09-16.py`
(llevan `alta_2026_09_16`) y una categoría nueva, **"Ventiladores"** (23 packs reverse, carpeta de imágenes
`ventiladores`).

| Campo | Descripción |
|---|---|
| `color` | Todos: `blanco` · `negro` · `mixto` · `null` (la ficha no lo dice). De la ficha, del nombre (White, ICE) o a mano |
| `estilo_pecera` | Gabinetes: `true` si es de cristal panorámico (frontal + lateral). Lista a mano en el script |
| `specs_de_hermano` | Altas blancas cuya ficha se copió de la versión negra del mismo modelo (su MPN) |
| `ventilador` | Ventiladores: `{tamano_mm, pack, reverse, ecosistema, grosor_mm, argb}`. Ecosistema: `estandar`, `lian-li-flex`, `lian-li-wireless`, `icue-link` (hub aparte), `eurux` (USB propio). `grosor_mm` sólo cuando se sabe (D30: 30) |
| `fotos_fuente` | En las altas: de dónde sale la foto, o "genérica" si la de PCPartPicker no llegaba a 900 px |
