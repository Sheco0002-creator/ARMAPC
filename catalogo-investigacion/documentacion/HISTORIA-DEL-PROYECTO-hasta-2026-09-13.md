> **Archivo histórico (compactado el 2026-09-13).** Es la copia íntegra, sin cambios, de
> `ESTADO-DEL-PROYECTO.md` tal como estaba antes de compactarlo: fuentes y métodos de cada categoría,
> trampas ya resueltas, auditoría, compatibilidad, integración en la web paso a paso y las cifras de cada
> hito. **El estado vigente está en `../ESTADO-DEL-PROYECTO.md`**; donde este texto dice "este archivo"
> o "Siguiente paso", se refiere a esa versión antigua.

# Estado del proyecto — ArmaPC

> **Última actualización:** 13 de septiembre de 2026, 08:50.
>
> **Estado hoy — la web ya funciona con el catálogo real y no queda nada pendiente de lo pedido.**
> - **Catálogo** (`catalogo/catalogo-final.json`, cerrado y auditado): 274 productos · 13 `local` /
>   202 `importacion_us` / 59 `importacion_global` · **1 foto por producto en C:** (las otras 1.830 fotos,
>   1,36 GB, en JORGE `FOTOS-CATALOGO-no-usadas-en-web_2026-09-13/`) · 8 con imagen genérica. Guía de datos:
>   `catalogo/README.md`.
> - **Web** (`src/data/components.json` + `public/images/catalogo/`, generados por
>   `scripts/compatibilidad.py` → `scripts/exportar_web.py`; no se editan a mano):
>   - **Configurador:** 267 productos (209 americanos + 58 europeos/asiáticos con aviso naranja), **paso a
>     paso**: 8 pasos plegables, modelos ("RTX 5070 · desde US$ 840 · 7 versiones") y "Elige la versión"
>     con la recomendada; barra fija en móvil; compatibilidad en vivo (socket, RAM, largo de GPU, fuente vs.
>     lo que pide la GPU, altura/radiador del disipador, formato de placa).
>   - **Presupuestos:** 12 builds (3 por nivel, cada una con su enfoque: AMD/Intel × NVIDIA/Radeon, X3D,
>     creación), sólo con productos americanos con stock; "Cargar en Configurador" lleva la build exacta y
>     "Empezar desde cero" abre el configurador vacío.
>   - Precios en US$; bajo el total, "≈ S/ referencial" (TC 3,373) con la nota de 25-45 % más en Perú.
> - **Hecho el 13-09**, en este orden (detalle en "Integración en la web"): integración de los 209
>   americanos → análisis de lo hecho (encontró fallos) → europeos/asiáticos al configurador + fotos no
>   usadas a JORGE → arreglo de "Cargar en Configurador" / "Empezar desde cero" → imágenes y vídeo sin usar
>   de `public/` a JORGE → builds variadas → configurador sencillo → fichas mejoradas.
> - **Ojo — hay otro editor trabajando en la web a la vez** (no es otra sesión de Claude en este equipo):
>   el 13-09 cambió migas de pan y fondos de vídeo en todas las páginas, añadió el botón "Ver más" del
>   configurador (reutilizado) y `?nivel=` en presupuestos (con `useSearchParams` + `Suspense`). Antes de
>   editar un archivo de `src/`, releerlo; al terminar, comprobar que los cambios de los dos siguen ahí.
> - Qué queda abierto: ver **"Siguiente paso"**, al final del archivo.
>
> **Decisiones del usuario que siguen vigentes** (del 12-09 salvo que se diga otra cosa):
>
> **Una sola foto por producto (13-09):** la web sólo usa la principal; el resto de la galería está en JORGE
> (ver cabecera). No volver a buscar fotos de galería salvo que el usuario lo pida.
>
> **Estándar de fotos (decisión del usuario, 2026-09-12)** — sustituye a la regla del 11-09 de retirar productos:
> - Se quedan: fotos **del producto ≥ 900 px**, **fotos de caja** (aceptadas en todas las categorías; en CPUs
>   son casi las únicas) y fotos del producto montado en un PC.
> - Fuera: < 900 px, **sellos/logos flotando encima** (80 PLUS, GeForce RTX, WiFi/USB40, Red Dot, Editor's
>   Choice, WINNER — aunque sea sobre una caja), QR, personas, accesorios/manuales, diagramas con medidas,
>   banners, fotos de otro producto y cantos donde no se ve el producto.
> - Un producto **sin ninguna foto válida no se retira**: se publica con su ficha y precio y la **imagen
>   genérica de su categoría** (`imagenes/_generica/<categoria>.png`: silueta + logo ARMAPC, 1200 px).
> - La foto principal es la primera foto válida que no sea de caja (la caja queda en la galería).
> - Revisión **a ojo en hoja de contactos**, no basta medir píxeles. Lo descartado se **mueve** (no se borra)
>   a JORGE `pruebas-y-superados/IMAGENES-fuera-de-estandar_2026-09-12/` con `MANIFIESTO.json` (producto,
>   foto, motivo). 2026-09-12: 160 fotos + 51 copias de 500 px; el usuario había borrado antes 67 a mano.
> - Desde el 13-09 sólo cuenta la foto principal (una por producto); el número de fotos de galería ya
>   no es un criterio.
>
> **Gama por modelo, nunca por precio (decisión del usuario, 2026-09-12)** — los precios reales de 2026
> (escasez de memoria) rompían los rangos. Script `scripts/gama_por_modelo.py` (mueve las fotos a
> `imagenes/<cat>/<gama>/` y reescribe rutas; campo `gama_criterio: "modelo"`). 34 productos cambiaron.
> - **Placas** — línea de la marca: básica (PRO, PG, PRIME, EAGLE, GAMING X, SILVER) = entrada ·
>   intermedia (MAG Tomahawk/Mortar, TUF, AORUS ELITE, Steel Legend) = media · superior (ROG STRIX,
>   AORUS PRO, MPG, Nova) = alta · buque insignia (Hero, AORUS MASTER, Taichi, MEG) = extrema. 7·11·7·5.
> - **Procesadores** — Ryzen 5 / Ultra 5 / i5 = entrada · Ryzen 7 / Ultra 7 / i7 (y 5700X3D, AM4) =
>   media · Ryzen 7 X3D de AM5 y Ryzen 9 de 12 núcleos = alta · Ryzen 9 16 núcleos / Ultra 9 / i9 =
>   extrema. 8·6·4·4.
> - **Almacenamiento** — SATA, HDD y NVMe básicos (NV3, P3 Plus, P310, SN5000) = entrada · NVMe con
>   buen rendimiento (990 EVO Plus, SN7100, T500, NM790, Gold P31) = media · PCIe 4.0 tope (990 PRO,
>   SN850X) = alta · PCIe 5.0 (9100 PRO, SN8100, T705, Renegade G5) = extrema. La capacidad no cuenta. 13·11·6·4.
> - **Fuentes** — Bronze/Silver = entrada · Gold ≤ 850 W = media · Gold ≥ 1000 W o Platinum ≤ 1000 W =
>   alta · Platinum ≥ 1200 W o Titanium = extrema. 7·13·9·5.
> - GPUs (chip), RAM (tipo y capacidad), gabinetes (diseño) y refrigeración (línea de cada marca) ya
>   iban por modelo: sin cambios.
> - Scripts en `scripts/estandar-fotos/`: `medir2.py` (mide) → `hojas.py` (hojas de contactos numeradas
>   `producto.foto`) → `clasificar.py` (exclusiones a ojo) → `aplicar_estandar.py` (mueve y reescribe) →
>   `validar.py`; `genericas.py` regenera las imágenes genéricas. Los números `producto.foto` son del catálogo
>   **antes** del 12-09: para una revisión nueva, volver a medir y hacer hojas.
>
> **Mercado objetivo (decisión del usuario, 2026-09-12)** — la web se dirige a **EE.UU., América
> hispanohablante y Brasil**. Nada de Europa es mercado. Consecuencias ya aplicadas
> (`scripts/limpieza_region.py`, backup `catalogo-final.BACKUP-20260912-1534-antes-limpieza-region.json`):
> - **Retirados 14 descatalogados globales** (no se borran: fotos + `MANIFIESTO.json` en JORGE
>   `pruebas-y-superados/DESCATALOGADOS_2026-09-12/`): GPUs RTX 4060/4070/4070 Ti S/4080/4080 S/4090,
>   RX 7700 XT/7800 XT/7900 XT/7900 XTX (Gigabyte y ASRock Taichi), Ryzen 7 5700X3D, SK hynix Gold P31 1TB y 2TB.
> - **14 de distribución europea se publican SIN precio**, con ficha e imágenes: las 6 **Palit** y las 6
>   **Gainward** (`disponibilidad_motivo: "marca_europea"`), más Cooler Master MWE Bronze 750 V3 **230V** y
>   Thermaltake Toughpower PF3 1200W (`"version_europea"`). Campos nuevos: `disponibilidad_region:
>   "no_disponible"`, `disponibilidad_motivo`, `disponibilidad_nota` (texto que ve el cliente) y
>   `precio_referencia_eu` (el importe europeo ya calculado). **Desde el 13-09** el configurador sí enseña,
>   en el aviso naranja, el país y el precio de tienda europeo (ver "Europeos/asiáticos en el configurador").
> - **ZOTAC, be quiet!, DeepCool, Phanteks y HYTE NO son "europeos"**: se comprobó que tienen canal en
>   América (ZOTAC LATAM + distribuidor en México; be quiet! tienda oficial en MiPC.com.mx; DeepCool en
>   Infotec/Supertec/Promart Perú y Cyberpuerta México; Phanteks y HYTE en Mercado Libre México con
>   vendedor local). Su falta de precio es **agotado en EE.UU. ese día**, no ausencia de mercado.
> - **Ojo, la fórmula del PEN sólo vale con base sin impuestos.** `precio_pen` = `precio_usd` × TC × 1,18
>   asume que `precio_usd` NO lleva impuesto. Un precio de Mercado Libre o Kabum ya trae IGV/ICMS dentro:
>   usarlo como base cobraría el impuesto dos veces. Cambiar de fuente obliga a rehacer el cálculo.
> - **Mercado Libre no se deja automatizar**: la API pública da 403 sin clave, el HTML por curl devuelve
>   un esqueleto vacío, y navegar varias búsquedas seguidas manda la sesión a `/gz/account-verification`.
>   Un "0 resultados" así **no prueba** que el producto no exista. Para usarlo haría falta que el usuario
>   pase la verificación en su Chrome, como ya se hizo con Micro Center.
>
> **Tres niveles de disponibilidad (decisión del usuario, 2026-09-12)** — `scripts/aplicar_disponibilidad.py`.
> El campo `disponibilidad` sustituye al antiguo `disponibilidad_region` binario, que obligaba a mentir:
> decía "no se comercializa en América" de marcas que sí se venden aquí.
> - **`local` (13)** — `precio_pen` REAL de tienda peruana, con IGV. No es un cálculo.
> - **`importacion_us` (202)** — precio de EE.UU. verificado; sin stock local. Se muestra sólo el precio
>   en dólares y el aviso de que la importación (Amazon, Newegg…) corre por cuenta del comprador, sin
>   garantía local. **Su `precio_pen` calculado se movió a `precio_pen_estimado` (interno, NO se muestra)**:
>   la fórmula `usd × TC × 1,18` se queda entre un **25 % y un 44 %** por debajo del precio peruano real
>   (medido en 6 productos: AK400 G2 S/116 calculado vs S/165 real; P310 4TB S/2.449 vs S/3.529).
> - **`importacion_global` (59)** — sin precio americano. El texto se diferencia por `disponibilidad_motivo`:
>   `sin_precio_verificado` (42: marcas con venta en América pero sin precio confirmado),
>   `marca_europea`/`version_europea`/`sin_canal_america` (11: Gainward, Cooler Master 230V,
>   Thermaltake EU, Sparkle), `modelo_no_en_peru` (5 Palit) y `en_peru_pendiente_confirmar` (1).
>   En la web (13-09): en el configurador con aviso naranja, **nunca en presupuestos**.
> - **Palit NO es "marca europea"** (error corregido): Infotec vende Palit en Perú. De nuestros 6 modelos
>   sólo la RTX 5070 Infinity 3 está allí (S/ 2.909, pendiente de confirmar a mano); los otros 5 son
>   `modelo_no_en_peru`. La lección: no encontrar distribuidor no prueba que no exista.
>
> **Perú como base de precio (decisión del usuario, 2026-09-12)** — `scripts/precios/precios_peru.py`.
> El precio de tienda peruana ya viene en soles con IGV, así que `precio_pen` pasa a ser dato observado y
> `precio_usd` se deriva hacia atrás (`pen / 1,18 / TC`). Fuentes que funcionan: **Infotec** (PrestaShop;
> el nombre trae el MPN entre paréntesis y el precio en `<span class="product-price" content="...">`) y
> **Promart** (VTEX, API pública sin clave). Cobertura real: **13 `local`, todos de Infotec** — Infotec no
> llega a fuentes de gama alta, RAM de 64 GB ni refrigeración premium. Sólo se aplican coincidencias de
> score 1.0, y las dudosas se revisan a mano (campo `precio_peru_revisado`).
> Trampas ya resueltas, **no volver a caer**:
> - **El marketplace de Promart NO vale como precio.** Su API devuelve varios `sellers` por producto: hay
>   que quedarse **sólo con `sellerName == "Promart"`**. El Crucial P310 4TB salía a S/ 3.529 = US$ 886 del
>   vendedor "ProSmart" mientras Promart tenía stock 0, y su precio oficial en EE.UU. es US$ 365. Es el
>   mismo caso de MemoryC que el proyecto ya descartaba. Se aplicó por error y se revirtió el 12-09.
>   En la práctica Promart no aporta componentes de PC con stock propio.
> - **El certificado TLS de infotec.com.pe está CADUCADO.** urllib lo rechaza y devuelve cadena vacía
>   (parece "no hay producto"); curl lo acepta. El script reintenta con contexto sin verificar.
> - **Comparar por subcadena mete productos hermanos**: `"z890" in "z890m"` es cierto, y la Z890M micro-ATX
>   (S/1.069) se colaba por delante de la Z890 ATX (S/1.249). Usar límites de palabra (`\b`).
> - **`wifi`, `ddr4` y `ddr5` NO son palabras genéricas al comparar**: distinguen variantes reales
>   (PRIME B650M-A II ≠ PRIME B650M-A WIFI II, MPN distinto). Sí se ignoran al construir la consulta.
> - Infotec **sólo responde a consultas cortas**; con la cadena completa devuelve 0 resultados.
> - **Brasil no sirve como base de precio**: Kabum da el doble que Alemania para el mismo producto
>   (Z890 A ELITE: US$ 497 vs US$ 240) por el II del 20 % + IPI + PIS/COFINS en cascada. Sólo disponibilidad.
> - **Mercado Libre no se deja automatizar**: API 403 sin clave, HTML por curl es un esqueleto, y encadenar
>   búsquedas manda la sesión a `/gz/account-verification`. Un "0 resultados" así no prueba nada.
>
> **Tramo de entrada (2026-09-12)** — `scripts/entrada_peru.py` + `entrada_fichas.py` + `integrar_gpus_nuevas.py`.
> El catálogo no tenía **ninguna** GPU por debajo de US$ 300, que es donde está el volumen en América
> (Steam: la RTX 3050/4060 mandan; ML México: RX 6600). Se eligieron por lo que Infotec vende HOY:
> ZOTAC/ASUS/MSI/Palit RTX 3050 6GB, XFX RX 7600, y ASUS/Gigabyte/MSI RTX 5050. Fichas: **Open Icecat sin
> clave** para 5 (pedir SIN el parámetro `content` para que devuelva `FeaturesGroups`; **MSI se indexa por
> NOMBRE de modelo**, no por el SKU de tienda) y **ficha de Infotec** para ZOTAC, Palit y XFX, que están en
> el Icecat de pago y cuyas webs bloquean (zotac.com pide verificación anti-bot: **no la resolvemos
> nosotros**; palit.com devuelve cuerpo vacío). Las fotos de Infotec llegan a 1100×1422, por encima del
> estándar. **3 SPARKLE Intel Arc** (B580 TITAN `SB580T-12GOC`, B580 ROC Luna `SB580RW-12GOC`, B570 GUARDIAN
> `SB570G-10GOC`): la web pinta por JS, así que las URLs se sacaron con el navegador; specs y **EAN** salen
> de la hoja PDF (viñetas `⚫ clave: valor`), fotos PNG de 2000×2000 (el .jpg de 1920×7750 es un banner, fuera).
>
> **Pendiente de revisar a mano (4)** — coincidencia dudosa, precio NO aplicado: ASUS PRIME B650M-A WIFI II
> (0,75; Infotec tiene la variante SIN wifi), ZOTAC RTX 5060 Ti 16GB (0,62; Infotec tiene la RTX 5060 8GB),
> DeepCool LT360 VISION (0,67) y Lian Li HydroShift II (0,75). Borrador: JORGE `PRECIOS_peru_2026-09-12.json`.
>
> Este archivo es una **foto del presente**, no una bitácora. Se **sobrescribe**,
> nunca se acumula. Si algo cambia de estado, edítalo — no añadas historia debajo.
> **Es el punto de entrada para cualquier IA que retome el proyecto.**

---

## Qué es el proyecto

Tienda web de PCs y componentes (**ArmaPC**), en
`C:/Users/USUARIO/Desktop/Primera Pagina Web`.

**Next.js 16.3.4 con App Router.** Frontend y backend son el **mismo proyecto**.
Stack: React 19.2.8, TypeScript, Tailwind 4, Zustand, Framer Motion, GSAP.

Rutas existentes: `configurador`, `presupuestos`, `guias`, `contacto`,
`sobre-nosotros`, `privacidad`.

## Dónde vive cada cosa

| Ruta | Papel |
|---|---|
| `src/app/` | Páginas y rutas de la app (`configurador/page.tsx`, `presupuestos/page.tsx`, portada `page.tsx`) |
| `src/data/components.json` | **Lo que lee la web**: 267 productos (`categories`) + 12 builds (`tiers[].builds`). Lo genera `scripts/exportar_web.py`: no editar a mano |
| `public/images/catalogo/` | 267 fotos (1 por producto, ≤ 900 px, ~20 MB), también del exportador |
| `public/images/components/` | Fotos genéricas por categoría (respaldo si un producto no trae `image`) |
| `catalogo-investigacion/` | **Esta carpeta.** Estado, documentación, catálogo y scripts — no es código de app |
| USB **`JORGE`** → `catalogo-investigacion-ARCHIVO/` | Descargas en bruto, respaldos y lo retirado (nunca se borra) |

**El proyecto no es un repositorio git**: no hay historial. Los respaldos de la web van a JORGE
`pruebas-y-superados/BACKUP-web-...` (nunca dentro del repo: `tsc` los escanea y rompe el build).

## Regla de almacenamiento y flujo — LEER ANTES DE DESCARGAR

```
USB JORGE / catalogo-investigacion-ARCHIVO/   ← 1. toda descarga o investigación en bruto aterriza aquí
        ↓
catalogo-investigacion/catalogo/              ← 2. se extrae, renombra, deduplica y clasifica por gama
        ↓
scripts/compatibilidad.py → exportar_web.py   ← 3. normaliza, arma las builds y exporta a catalogo/export/
        ↓
public/images/catalogo/  +  src/data/         ← 4. se copia a mano, con backup del components.json anterior
```

Para regenerar la web tras tocar el catálogo (desde `catalogo-investigacion/scripts/`):
`python compatibilidad.py` → `python exportar_web.py` → revisar `catalogo/export/` → copiar
`export/components.json` a `src/data/` y `export/images/*.jpg` a `public/images/catalogo/`. Hoy los scripts
reproducen exactamente lo que hay en la web (comprobado byte a byte el 13-09).

- **En JORGE:** ZIPs de Icecat, exportaciones, CSV/XLSX sin procesar, pruebas.
  El original **se queda allí como respaldo** después de extraerlo.
- **En esta carpeta (C:):** documentación, este archivo, y **lo procesado que se
  usa** — `catalogo/catalogo-final.json` y las imágenes clasificadas.
- **El catálogo nunca va al USB:** si el pendrive no está puesto se rompe, y
  Next.js sirve las imágenes desde `public/`, en C:.

**Identificar el USB por su etiqueta `JORGE`, nunca por la letra.** Windows
cambia la letra según el orden de conexión (en una misma sesión JORGE, SAMUEL y
BATOCERA se turnaron D: y E:). Comprobar antes de escribir:

```powershell
Get-Volume | Where-Object FileSystemLabel -eq 'JORGE'
```

Si no está conectado, **avisar al usuario y no guardar en otro sitio.**

Al depositar descargas nuevas, darles **nombre descriptivo** con el patrón
`ORIGEN_CATEGORIA_que-contiene_fecha` — Icecat entrega nombres genéricos
(`159790_ES_PE.xlsx`, `PIF.csv`, ZIPs con UUID) que se pisan entre sí.

## Mapa de carpetas

```
catalogo-investigacion/
├── ESTADO-DEL-PROYECTO.md       este archivo
├── catalogo/                    LO QUE SE USA · README.md = guía de datos para la web
│   ├── catalogo-final.json         274 productos (8 categorías; ver "Cobertura del catálogo")
│   ├── catalogo-final.BACKUP-*.json   sólo los 3 últimos (los antiguos, en JORGE)
│   ├── compatibilidad.json         campos normalizados + las 12 builds (lo escribe compatibilidad.py)
│   ├── export/                     salida de exportar_web.py, para revisar antes de copiar a la web
│   ├── fuentes/                    datos de Icecat ya procesados:
│   │   placas-madre/ · gpus/ · ram/ · referencia/
│   └── imagenes/<categoria>/<gama>/high/   SÓLO la foto principal de cada producto (13-09)
│       gamas: entrada · media · alta · extrema
│       categorias: placas · gpus · ram · procesadores · almacenamiento
│                   fuentes-poder · gabinetes · refrigeracion
│       imagenes/_generica/<categoria>.png   imagen de productos sin foto válida
├── documentacion/               METODO, PATRONES-CDN, precios, guías de Icecat
├── scripts/                     integrar_gpu_ram.py (regenera GPUs y RAM) ·
│                                marcas_gpu.py (baja Palit/Gainward/PNY/ASUS) · xlsx.py
│                                12-09: limpieza_region.py · aplicar_disponibilidad.py ·
│                                revision_manual.py · entrada_peru.py · entrada_fichas.py ·
│                                arc_sparkle.py · integrar_gpus_nuevas.py
│                                precios/: precios_peru.py (Infotec+Promart) · revisar_palit.py ·
│                                reindexar_borrador.py · precios_americanos.py (MX/BR, superado)
│                                13-09: ram_specs.py · limpieza_auditoria.py ·
│                                estandar-fotos/: cpu_bestbuy · cpu_integrar · cpu_ajustes ·
│                                ram_fotos · ram_integrar · kingston_fotos · kingston_integrar ·
│                                precios/precios_sin_stock.py
│                                13-09 WEB: compatibilidad.py (normaliza + 12 builds por PERFILES) ·
│                                exportar_web.py (components.json + fotos) ·
│                                archivar_fotos_no_usadas.py (galerías a JORGE)
└── investigacion/               01_PROCESADORES … 04_MEMORIA_RAM (research original)
```

```
USB JORGE / catalogo-investigacion-ARCHIVO/
├── LEEME.txt
├── ZIPS-ICECAT-originales/      6 ZIP — incluye el RESPALDO-ORIGINAL
├── DATOS-ICECAT-originales/     CSV/XLSX tal cual los entrega Icecat, renombrados
├── DATOS-FABRICANTE-originales/ specs oficiales (PDF Biostar, JSON ASRock)
├── pruebas-y-superados/         pruebas de MPN y versiones reemplazadas
│   ├── DESCATALOGADOS_2026-09-12/   fotos de los 14 retirados + MANIFIESTO.json
│   ├── CPU_banners_2026-09-13/ · RAM_foto-variante-equivocada_2026-09-13/
│   ├── DUPLICADOS-auditoria_2026-09-13/   14 fotos (+3 medium) + MANIFIESTO.json
│   ├── BACKUPS-catalogo-antiguos_2026-09-13/   backups antiguos del catálogo (los 3 últimos, en C:)
│   ├── RESTOS-auditoria_2026-09-13/   =900px= vacío, los 2 __pycache__, out.json
│   ├── BACKUP-web-antes-*_2026-09-13/   la web antes de cada cambio del 13-09 (integracion, globales,
│   │                                    arreglo-flujo, builds-variadas, configurador-sencillo, fichas)
│   └── WEB-public-no-usados_2026-09-13/   4 imágenes + Prueba 4.mp4 sin uso en public/ + MANIFIESTO.json
├── FOTOS-CATALOGO-no-usadas-en-web_2026-09-13/   1.830 fotos de galería (1,36 GB) + MANIFIESTO.json
├── PRECIOS_pcpartpicker_2026-09-12.json   borrador EE.UU./DE/UK, indexado por MPN
├── PRECIOS_peru_2026-09-12.json           candidatos Infotec/Promart con score
├── PRECIOS_americanos_2026-09-12.json     MX/BR parcial (12 productos; superado)
├── ENTRADA_gpus_2026-09-12/               8 GPUs de entrada: fichas + fotos
├── ARC_sparkle_2026-09-12/                3 Sparkle Arc: fichas, fotos, PDF de specs
├── CPU_fotos-bestbuy_2026-09-13/          originales Best Buy + hoja de contactos
├── RAM_fotos-fabricante_2026-09-13/       galerías Corsair y G.Skill + hoja
└── RAM_fotos-kingston_2026-09-13/         galería FURY Beast + hoja
```

**Nombres de datos en `fuentes/`:** `CATEGORIA_que-contiene_TIPO`.
`INDICE` = EAN + URLs de imagen · `FICHAS` = especificaciones ·
`LISTA-subida` = lo que se mandó a Icecat · `NO-ENCONTRADOS`.


## Auditoría 13-09 — duplicados y restos (limpieza HECHA, aprobada por el usuario)

Revisadas las 4 carpetas (`catalogo`, `documentacion`, `investigacion`, `scripts`: 2.259 archivos) por
hash exacto (MD5), por parecido visual (dHash) y a ojo en hojas de contactos.

**Está bien (no se toca):**
- 0 rutas rotas, 0 fotos `high` < 900 px, 0 productos repetidos (MPN, EAN, slug y marca+modelo únicos),
  0 rutas repetidas dentro de un producto, principal siempre dentro de su galería.
- **Fotos idénticas entre productos distintos (108 grupos por hash)**: son hermanos de capacidad o versión
  del mismo diseño (RX 9060 XT 8/16 GB, SN850X 1/2/4 TB, Core Reactor II 650-1200 W, FURY Beast…), las
  cajas genéricas de AMD por gama (la caja de "Ryzen 5" no lleva el modelo) y los renders que Gainward
  comparte entre 5070/5080 Phoenix GS y 5070 Ti/5090 Phantom GS. **Es a propósito** (README de
  `catalogo/`): cada producto tiene sus fotos bajo su nombre. Revisado a ojo: ninguna muestra otro modelo
  (el comparador visual emparejó las cajas 5070 y 5080 de Gainward, pero son distintas y cada una está en
  su producto). Al integrar en la web se puede ahorrar espacio sirviendo un solo archivo por hash.
- Excel/CSV de `fuentes/`: **ninguno repetido**. Cada tanda de Icecat tiene su LISTA-subida → INDICE →
  FICHAS; los MPN sólo se repiten dentro de la misma tanda. `PLACAS_16` está en CSV (export crudo de
  Icecat) y en JSON (procesado): mismo dato en dos formatos, se conservan ambos.
- Textos `.md`: ningún párrafo duplicado entre documentos (sólo la cabecera común de los 4 de
  `investigacion/` y enlaces oficiales repetidos para variantes del mismo modelo).
- Las 5 genéricas "huérfanas" (`_generica/` de almacenamiento, fuentes, gabinetes, CPU, refrigeración) no
  las usa hoy ningún producto pero son el respaldo de la web: se quedan.

**Limpieza — HECHA el 13-09** (`scripts/limpieza_auditoria.py`; todo movido a JORGE `pruebas-y-superados/`, nada borrado):
1. **12 fotos duplicadas dentro del mismo producto** (la misma imagen dos veces, a veces una en PNG y otra
   en JPG) → movidas a `DUPLICADOS-auditoria_2026-09-13/` con `MANIFIESTO.json`. #12 TUF B850-PLUS (INT_10), #48 Palit
   5080 GamingPro (CDN_7), #135 CX550 (CDN_2 de 1824 px; la principal pasa a CDN_7 de 2000 px), #158/160/161
   Core Reactor II 650/1000/1200 W (CDN_3), #159 Core Reactor II 850 W (CDN_7), #237/238/239/240 Thermalright
   (la copia JPG), #270 XFX RX 7600 (TDA_6). Las otras 10 parejas parecidas son variantes reales (RGB
   encendido/apagado, con o sin tapa del zócalo, otro panel) y se quedan.
2. **Backups del catálogo:** se quedan los 3 últimos en `catalogo/`; 40 (31 MB) movidos a `BACKUPS-catalogo-antiguos_2026-09-13/`.
3. Basura: archivo vacío `catalogo/=900px=`, `scripts/__pycache__/`, `scripts/precios/__pycache__/` y `scripts/precios/out.json`
   (salida de una prueba) → movidos a `RESTOS-auditoria_2026-09-13/`.
4. `n_specs` recontado: #95 y #96 (22→23 y 19→20: no se recontó al añadir "Perfil XMP/EXPO").
5. `catalogo/README.md` **reescrito** con el esquema actual (274 productos, regla de precio y
   disponibilidad, campos internos que la web no debe mostrar). Es la guía de datos para la integración.
6. `documentacion/` DISCREPANCIAS, HALLAZGO-CRITICO, PLACAS-PRECIOS y RANGOS-PRECIO-RAM son del 08-09 y
   sus precios ya no valen → llevan ya la nota "informe histórico" (como RESULTADO-ICECAT).
7. Foto del ventilador suelto de DeepCool AK400 G2 y AK620 G2 (accesorio, decisión del usuario) → movida con las duplicadas.

Resultado: 1.524 → **1.510 fotos**, 0 rutas rotas, `n_fotos` y `n_specs` cuadran en los 274.

**Observación para la integración:** 16 `resumen` están en inglés (TeamGroup, AMD…), 2 pares repetidos
entre hermanos TeamGroup. Traducir al integrar o antes.

**Decisión del usuario (13-09): integración simple, sólo América, dólar como base.** Rechazó el primer
boceto (página `/componentes` con los 274 productos y tres estados) por poder perder al usuario; pidió en
su lugar integrar dentro del configurador ya existente **sólo** los 215 productos `local`/`importacion_us`
(los 59 europeos/asiáticos NO se integran ni se borran, quedan para después), **1 foto por producto**,
mostrando la info de cada uno, con **compatibilidad completa entre TODOS los componentes primero**, y esas
combinaciones ya compatibles reutilizadas en los 4 presupuestos (varias por tramo, no una sola build fija),
sin perder la opción de ir directo al configurador desde cero. Precio: dólar en toda la web; soles sólo
como línea de referencia bajo el total (no por producto: convertir US$→S/ da un precio que ya medimos
25-44 % por debajo del real en Perú al faltar envío e impuestos).

**Compatibilidad — HECHA (13-09)**, `scripts/compatibilidad.py` → `catalogo/compatibilidad.json` (sólo
lectura, no toca la web). Normaliza para los 215 americanos: socket y TDP de CPU; socket, tipo de RAM y
formato de placa (el socket se saca del **chipset**, no de "Familia del chipset": la MSI MAG B860M Mortar
trae ese campo mal, dice AMD siendo Intel); tipo y capacidad de RAM; chip, longitud, consumo y fuente
recomendada de GPU (si el fabricante no la da, se estima `TDP×1.6+150` redondeado a 50 W, marcado
`fuente_recomendada_estimada`); vatios de fuente; límites de GPU/disipador/formato y tamaño de radiador
del gabinete (de "Radiadores compatibles"); tipo, altura o tamaño de radiador y TDP máx. del disipador.
Reglas aplicadas: socket CPU↔placa · tipo de RAM placa↔RAM · longitud GPU↔gabinete · vatios fuente↔GPU ·
altura/radiador disipador↔gabinete · TDP y socket disipador↔CPU · formato placa↔gabinete. Los sockets del
disipador salen de su ficha (antes se asumían los 4); LGA1851 se añade a los que sólo dicen LGA1700
(mismo anclaje) y el V8 ACE 3DHP queda sólo para AMD.
**Fuerza bruta descartada**: cruzar los 215 (CPU×placa×RAM×GPU×fuente×gabinete×disipador) da miles de
millones de combinaciones y tardaba minutos sin aportar nada que unas pocas builds por nivel no den ya
(el propio configurador filtra en vivo, con `checkItemCompatibility`). En su lugar, perfiles por nivel
con reglas de gama y variedad: **12 builds**, ver "Builds variadas" más abajo (sustituyen a las 9 del
primer reparto por precio de GPU, en las que dentro de un nivel sólo cambiaba la GPU).
**Avisos que siguen abiertos (aceptados por ahora):**
- **5 kits DDR4 sin ninguna placa DDR4 en todo el catálogo** (Corsair Vengeance LPX, G.Skill Ripjaws V,
  Kingston FURY Beast DDR4, TeamGroup Delta RGB DDR4 y el XPG Spectrix D35G, este europeo/asiático): fuera
  del configurador y de los presupuestos hasta que haya una placa DDR4.
- **2 Ryzen 5 5600/5600X (socket AM4) sin ninguna placa AM4 en todo el catálogo**: mismo caso.
- **9 GPUs sin longitud en su ficha** (eran 18: las otras 9 la traían como "Board Size"/"Dimensions" y ya
  se leen): las 6 PNY y las 3 sin ficha de fabricante (Zotac 3050 Twin Edge, Palit 3050 StormX, XFX RX
  7600 — zotac.com y techpowerup.com bloquearon la consulta con un captcha, no se intentó saltar). Se
  tratan como compatibles con cualquier gabinete; las builds prefieren GPUs con largo verificado.
- **Las RTX 5090 están sin stock en EE.UU.** (`sin_stock`, ver el bloque de precios de arriba): Extrema
  usa RTX 5080. Si vuelve el stock, basta añadir `{"chip": "RTX 5090"}` a los perfiles de Extrema.

**Huérfanos fuera de la web (decisión del usuario, 13-09).** Los 7 del punto anterior (5 RAM DDR4 y
2 Ryzen 5 AM4) **no se borran ni se tocan en `catalogo-final.json`** — siguen con su `disponibilidad`
real — pero el exportador los deja fuera del configurador y de los presupuestos hasta que haya con qué
combinarlos. (Los demás europeos/asiáticos sí entraron al configurador el 13-09, con aviso naranja.)
Lista exacta y motivo, en `scripts/exportar_web.py` (`HUERFANOS_MPN`).

## Integración en la web — HECHA (13-09)

`scripts/exportar_web.py`: lee `catalogo-final.json` + `compatibilidad.json` y genera, en
`catalogo/export/` (dentro de catalogo-investigacion, para revisar antes de copiar), la misma forma que ya
leía la web (`categories` + `tiers`) pero con datos reales. Luego se copió a mano a `src/data/components.json`
y `public/images/catalogo/` (209 fotos, 1 por producto, máx. 900 px, ~16 MB). Backup de lo anterior
(`components.json`, `configurador/`, `presupuestos/`) en JORGE, no en el repo (un backup `.tsx` dentro del
repo lo recoge `tsc` como código real y rompía el build con errores de un esquema que ya no existe).

**209 productos americanos exportados** (215 − 6 huérfanos): 19 CPU · 27 placas · 19 RAM · 39 GPU ·
30 almacenamiento · 20 fuentes · 24 gabinetes · 31 refrigeración — más, desde la tarde del 13-09, **58
europeos/asiáticos sólo en el configurador** (ver "Europeos/asiáticos en el configurador"). Mismas claves que ya leía
`configurador/page.tsx` (`socket`, `ramType`, `tdp`, `length`, `powerDraw`, `wattage`, `maxGpuLength`,
`socketSupport`...) — así casi todo el motor de compatibilidad ya existente empezó a funcionar con datos
reales **sin tocar su código**. Nuevas: `radiatorMax` (gabinete), `radiatorSize`/`tdpCapacity` (disipador),
`sinStock`/`notaSinStock`, `disponibleLocalPen`. **Ningún campo se deja en `null`**: si un dato no se
verificó (hoy 9 GPUs sin longitud: las 6 PNY, 2 RTX 3050 y la XFX RX 7600), la clave no existe — dejarla en `null` rompía las
comprobaciones `"campo" in item` del configurador y mostraba textos vacíos ("Consumo: W").
Auto-verificación en el propio script: cada botón de filtro debe encontrar al menos 1 producto con la
misma lógica de substring que usa la página (si no, es un filtro muerto — así se detectó que **los
filtros de CPU, RAM, fuente y refrigeración de los 45 productos anteriores nunca habían funcionado**:
comparaban contra campos que esos productos no tenían).

**Cambios de código (con backup, `npm run build` limpio tras cada uno):**
- `configurador/page.tsx`: 3 comprobaciones de compatibilidad nuevas, ahora que hay datos para ellas —
  altura del disipador vs. gabinete, tamaño de radiador vs. gabinete, TDP del disipador vs. CPU, y formato
  de placa vs. gabinete (antes sólo se comprobaba socket, RAM, fuente y longitud de GPU). Insignias
  "Sin stock EE.UU." y "Disponible en Perú: S/ X" junto al precio. Línea "≈ S/ X referencial" bajo el
  total, con el aviso de siempre (25-45% más caro en Perú por envío e impuestos).
- `presupuestos/page.tsx`: cada nivel ahora tiene **2-3 builds distintas y compatibles** (de
  `compatibilidad.json`), con pestañas para cambiar entre ellas ("Opciones en este nivel") — ya no es una
  única combinación fija por nivel. "Cargar en Configurador" manda la build elegida por URL
  (`/configurador?b=<build>&nivel=<id>`, el mismo formato que "Compartir Link") y "Empezar desde cero"
  va a `/configurador?desde=cero` (vacío). Se quitó el panel de "alternativas" de una sola pieza suelta
  (ahora las alternativas son builds completas).
- **Arreglo del flujo (13-09, tras el análisis):** el configurador leía `?b=` en el `useState` (error de
  hidratación: el servidor no conoce la URL) y un `useEffect([selectedTier])` lo pisaba al montar con la
  1.ª build del nivel. Ahora la URL se lee una sola vez en un `useLayoutEffect` al montar (`?b=` se filtra
  a piezas que existen; `?desde=cero` = vacío); sin parámetros abre el preset del nivel del store, como
  antes (así "Abrir en Configurador" de la portada abre el nivel que se veía). El botón de preset activo
  es estado propio (`presetActivo`): ninguno tras "desde cero", "Limpiar" o un enlace compartido.
  Verificado en el navegador: las 9 builds llegan exactas (mismo total que en presupuestos), "Empezar
  desde cero" = 0 de 8 y $0, un enlace compartido abierto en frío llega exacto y sin errores en consola.
  Se descartó `useSearchParams`: en una página prerenderizada obliga a un `<Suspense>` y el servidor
  dejaría de pintar el configurador (ver `node_modules/next/dist/docs/.../use-search-params.md`).
- Un ajuste hecho a mitad de camino: los totales de cada build se recalculan sumando el precio YA
  redondeado de cada pieza exportada, para que sume exactamente lo que el desglose muestra (si no,
  aparecía "$1069" arriba y "$1070" sumando las 8 piezas, un desajuste tonto pero visible).

**Verificado en el navegador** (servidor de desarrollo del propio usuario, puerto 3000): fotos y precios
reales en las 8 categorías del configurador, compatibilidad "100% Garantizada" al cargar el preset
"Media" (Ryzen 7 7700X + X870 Steel Legend + 32GB + RX 9060 XT + fuente de 750W), badges de sin-stock y
selector de builds en presupuestos. **Corrección (análisis del 13-09):** se había dado por verificado que
"Cargar en Configurador" llevaba la build elegida y no era cierto para la 2.ª y 3.ª build de cada nivel
(arreglado el mismo día, ver "Arreglo del flujo").

**Europeos/asiáticos en el configurador (13-09, decisión del usuario)** — los 59 `importacion_global`
menos el kit XPG Spectrix DDR4 (no hay placa DDR4 en todo el catálogo) = **58 en el configurador,
ninguno en presupuestos** ni en la calculadora de la portada. Compatibilidad normal (verde/rojo) + aviso
**naranja** con el motivo real del catálogo: "No disponible en América" (16), "Sin precio verificado en
América" (41: la marca sí se vende aquí) o "Visto en Perú, precio por confirmar" (Palit RTX 5070 Infinity 3),
y "Se vende en Alemania/Reino Unido: €X con IVA". 35 tienen precio: se muestra "≈ US$" (precio europeo sin
IVA × 1,1592 EUR / 1,3508 GBP, los tipos de `precio_referencia_eu`) y suma al total; 23 sin precio muestran
"Sin precio" y no suman. Las 2 fuentes que sólo van a 200-240 V (be quiet! System Power 11, Cooler Master
MWE 230V) avisan de que no sirven en EE.UU. ni México. En el resumen, un recuadro naranja lista las piezas
fuera de América y el total dice "Incluye piezas fuera de América". Verificado en el navegador: 267
tarjetas, 58 con aviso naranja; presupuestos sin cambios; `tsc` y `npm run build` limpios; ESLint sin
avisos nuevos (el configurador ya tenía 58 `any` antes).
- **Datos corregidos de paso** (`compatibilidad.py`, 13-09): el largo de GPU salía a veces del "Largo del
  paquete" (MSI RTX 5080 = 90 mm, RX 9070 Gigabyte = 488 mm); ahora "Longitud" o, si falta, "Board
  Size"/"Product Size"/"Dimension(s)". Consumo y fuente recomendada que falten se toman de otras fichas
  del mismo chip (`*_origen: "por chip"`). Chip "Arc B5xx" reconocido. Las 9 builds no cambiaron.
- **Configurador**: la fuente se compara también con la que pide el fabricante de la GPU
  (`recommendedPsu`). Antes una RTX 5080 con 550 W salía "100% Garantizada"; ahora da error.
- Nota bajo el total en soles: ya no muestra el texto interno ("Sólo para la línea de referencia...").
- La calculadora de la portada (`BuildCalculatorModal`) no la abre ningún botón hoy (código muerto).

**Builds variadas (13-09, pedido del usuario)** — `compatibilidad.py` ya no reparte las GPU por precio
(los niveles se solapaban: Alta y Extrema llevaban las dos una RTX 5080, y dentro de un nivel sólo
cambiaba la GPU). Ahora `PERFILES`: cada nivel es una **clase de GPU por chip** y tiene **3 builds con
enfoque distinto** (plataforma AMD/Intel × GPU NVIDIA/Radeon, X3D, creación). Entre las builds de un
nivel cambian CPU, GPU, placa, gabinete y disipador; RAM, disco y fuente van al mejor precio aunque se
repitan (forzar variedad ahí encarecía US$ 100 por un kit equivalente). Reglas: sólo NVMe (nunca disco
mecánico), RAM mínima 16/32 GB, ≥ 6000 MT/s en Alta/Extrema, ≤ 6400 en AM5 (punto óptimo de AMD),
≤ 48 GB salvo el perfil de creación (64); fuente ≥ margen de la web y ≥ la que pide la GPU; la GPU ≥ 30 %
del total (si no, el configurador muestra su "Tip Gamer"); si no llega, 2.º intento con placa/gabinete/
disipador más baratos y, si tampoco, la siguiente GPU del perfil. El disipador se comprueba también
por socket (el V8 ACE 3DHP es sólo AMD); a los que traen LGA1700 y no LGA1851 (Hyper 212 Black, ROG Strix
LC III) se les añade LGA1851, mismo anclaje (`sockets_inferidos`). Las RTX 5090 están sin stock en EE.UU.:
Extrema = RTX 5080. En la web: nombre "CPU + GPU" y línea "Enfoque de esta opción" en presupuestos;
los discos mecánicos se rotulan "HDD" (filtro nuevo).

| Nivel | Builds (US$) |
|---|---|
| Entrada (1.333–1.353) | Ryzen 5 7600X + RTX 5060 · Core Ultra 5 245K + RX 9060 XT 8 GB · Ryzen 5 9600X + RX 9060 XT 8 GB |
| Media (1.947–2.265) | Core Ultra 7 265K + RX 9070 · Ryzen 7 7700X + RTX 5070 · Core Ultra 5 250K Plus + RTX 5070 |
| Alta (2.471–2.872) | Core Ultra 7 270K Plus + RX 9070 XT · Ryzen 7 7800X3D + RX 9070 XT · Ryzen 7 9800X3D + RTX 5070 Ti |
| Extrema (3.917–5.018) | Ryzen 7 9850X3D + RTX 5080 · Core Ultra 9 285K + RTX 5080 · Ryzen 9 9950X3D + RTX 5080 + 64 GB |

Verificado: las 12 pasan las reglas del configurador (simuladas y en el navegador: "100% Garantizada",
sin "Tip Gamer", mismo total en presupuestos y configurador); `tsc` y `npm run build` limpios.
Descartados al probar: "La más económica" en Entrada (repetía casi todo de la 1.ª build; con RTX 5050
la GPU quedaba al 29 %) y "16 GB de VRAM" en Media (la RX 9060 XT 16G no llega al 30 % y caía en una
RTX 5060 Ti de US$ 800, casi el precio de la 5070).

**Configurador sencillo (13-09, el plan aprobado de la Opción 1)** — `configurador/page.tsx`:
- **Paso a paso:** cada categoría es un paso plegable (1/8 … 8/8) con la pieza elegida en una línea y su
  estado de compatibilidad; sólo uno abierto a la vez. Con una build cargada (preset, presupuestos, enlace)
  todos empiezan cerrados; "Empezar desde cero" y "Limpiar" abren la CPU; "Siguiente: <paso>" lleva a la
  próxima categoría sin pieza y, al terminar, al resumen. Al buscar se abren sólo los pasos con resultados.
- **Modelos, no productos:** `exportar_web.py` añade `grupo` a cada producto (GPU por chip y VRAM, placa
  por chipset, RAM por capacidad, disco por capacidad y tipo, fuente por potencia, refrigeración por tipo;
  CPU y gabinete van uno a uno): 61 GPUs → 17 modelos, 30 placas → 8, 25 RAM → 4, 32 discos → 7,
  34 fuentes → 6, 38 refrigeraciones → 4. Cada modelo: foto, "desde US$", nº de versiones (y cuántas
  fuera de América), compatible o no. Orden: compatibles primero, luego precio; 6 a la vista + "Ver más
  modelos" (el botón que había añadido el otro editor, reutilizado); el modelo elegido se ve siempre.
- **"Elige la versión":** al pulsar un modelo se pone su **versión recomendada** (la más barata compatible
  con stock en América; nunca una sin stock ni europea) y se despliegan sus versiones (4 + "Ver las N"),
  con la ficha completa de siempre y las marcas RECOMENDADA / ACTIVA.
- **Móvil/tablet:** barra fija abajo con total, piezas, estado y "Ver resumen" (el resumen queda al final).
- Resultado medido: con una build cargada, **3,4 pantallas** en escritorio (antes 23) y **4,7 en móvil**
  (antes 55); con un paso abierto, ~7 en móvil. Verificado en el navegador: desde cero (CPU → Siguiente →
  placas, con las AM5 delante tras elegir un AM5), cambio de modelo y de versión, búsqueda, "Ocultar
  incompatibles", Cargar en Configurador y Empezar desde cero; `tsc`, `npm run build` y ESLint sin
  avisos nuevos (59, antes 60). Backup: JORGE `BACKUP-web-antes-configurador-sencillo_2026-09-13/`.

**Fichas (13-09, pedido del usuario)** — `specs_str()` de `exportar_web.py` reescrita: usa los campos que
traen las fichas de verdad (antes buscaba "Número de núcleos" y los 19 procesadores repetían su nombre).
Ejemplos: CPU "14 núcleos (6P+8E) / 14 hilos · hasta 5.2 GHz · L3 24 MB" · placa "DDR5 · ATX · Wi-Fi 7 ·
4× M.2 · LAN 2.5G" (ASRock usa los campos "LAN"/"Wi-Fi") · RAM "32 GB (2×16) DDR5-6000 CL30 · XMP/EXPO ·
RGB" · GPU "RTX 5070 · 12 GB GDDR7 · 302 mm" (VRAM de la ficha, del nombre o de otras fichas del mismo
modelo: ninguna GPU queda sin ella) · disco "1TB · NVMe Gen4 · lee 7150 MB/s" / "2TB · HDD · 7200 rpm" ·
fuente "850W · Modular · cable 12V-2x6" · gabinete "Media torre · ATX/mATX · GPU hasta 375 mm · 4
ventiladores" · refrigeración "Aire, 158 mm de alto · 1×120 mm · hasta 129 W". La fuente rotulada
"Certif:" enseña ahora la certificación real: 80 PLUS o **Cybenetics** (11 fuentes Corsair/be quiet!/FSP/
MSI); antes salía "Hasta 90 %", que es eficiencia. Los filtros siguen encontrando todo (auto-verificación).
**Corrección de catálogo:** la MSI MAG B860M MORTAR WIFI era "ATX" y "Familia del chipset: AMD" en Icecat;
su propia ficha mide 243,8 × 243,8 mm (el estándar Micro-ATX) → "Micro ATX" e "Intel", anotado en
`specs_corregido` (backup `catalogo-final.BACKUP-20260913-0838-antes-fichas.json`). Ninguna otra placa
tenía ese desajuste (comprobadas las 30: formato vs. medidas y familia vs. chipset).

**Pendiente:** nada del análisis del 13-09. Ficha ampliada por producto: descartada por ahora (1 foto por
producto, decisión del usuario 13-09).
- ~~Imágenes y vídeo sin usar en `public/`~~ **hecho (13-09, aprobado por el usuario):** RTX.png,
  Renderizalo_2K.jpeg, 2 "ChatGPT Image" y `Prueba 4.mp4` (copia idéntica de `Prueba 3.mp4`, que sí se
  usa) movidos a JORGE `pruebas-y-superados/WEB-public-no-usados_2026-09-13/` con `MANIFIESTO.json`
  (10,6 MB, verificados por SHA-256). Comprobado que ninguna página los pedía. Quedan en `public/` sólo
  los que usa `src/data/mediaAssets.ts` (FinalPage.mp4, Prueba 3.mp4, Photoroom.png, Gato.jpeg), las
  fotos de `images/catalogo/` y `images/components/`, y los SVG de la plantilla de Next.

**Precios de tiendas agotadas (13-09, decisión del usuario: opción 2)** — `scripts/precios/precios_sin_stock.py`.
Al revisar la PNY RTX 5090 (US$ 4.999,99) salió que era el precio de lista de B&H **sin stock**: B&H lo
subió el 25-08 cuando ya no tenía unidades; el último precio con stock fue **US$ 4.199,99 en Newegg el
10-07** (historial de PCPartPicker; nadie la vende en EE.UU. desde el 12-07). No es un caso aislado:
**12 de 215 precios** en US$ salieron de una tienda agotada (6 GPUs, 4 placas, 2 gabinetes). Se conservan
pero llevan `precio_usd_sin_stock: true` + `precio_usd_aviso` ("Sin stock en EE.UU. · precio de lista"), y
la PNY 5090 además `precio_usd_ultimo_con_stock`. La web debe mostrar el aviso, nunca presentarlos como
precio vigente (ver `catalogo/README.md`). Backup: `…-0441-antes-precios-sin-stock.json`.

## Cobertura del catálogo

Estado a 13-09-2026 (tras limpieza por mercado, tres niveles, tramo de entrada, fotos de CPU y RAM y la
auditoría). **La columna "Fotos" es la galería que había antes del 13-09**: desde entonces en C: queda
sólo la principal de cada producto (266 fotos + 8 genéricas) y el resto está en JORGE
(`FOTOS-CATALOGO-no-usadas-en-web_2026-09-13/`); las columnas de fotos quedan como referencia histórica.

| Categoría | N | local | imp. US | global | Fotos (galería) | Genéricas | 1-2 fotos | Specs < 10 |
|---|---|---|---|---|---|---|---|---|
| Placas base | 30 | 1 | 26 | 3 | 186 | 1 | 0 | 0 |
| Procesadores | 21 | 0 | 21 | 0 | 47 | 0 | **14** | 0 |
| Memoria RAM | 30 | 0 | 23 | 7 | 135 | 1 | 0 | 0 |
| Tarjetas gráficas | 61 | 8 | 31 | 22 | 398 | 6 | 0 | 1 |
| Almacenamiento | 32 | 0 | 30 | 2 | 122 | 0 | 6 | 0 |
| Fuentes de poder | 34 | 0 | 20 | **14** | 179 | 0 | 3 | 0 |
| Gabinetes | 28 | 1 | 23 | 4 | 204 | 0 | 0 | 0 |
| Refrigeración | 38 | 3 | 28 | 7 | 239 | 0 | 1 | 0 |
| **Total** | **274** | **13** | **202** | **59** | **1.510** | **8** | **24** | **1** |

(La tabla cuenta el reparto tras `revision_manual.py`; el P310 4TB quedó en `global`, por eso almacenamiento
tiene 0 `local`.) **Sólidas:** placas, gabinetes, refrigeración, almacenamiento. **Flojas:** procesadores
(14 de 21 con 1-2 fotos: Intel/AMD casi no publican fotos de producto). RAM dejó de ser floja el 13-09:
ninguna con 1-2 fotos; sólo la Vengeance LPX DDR4 sigue con genérica. Fuentes tiene el peor ratio de disponibilidad (14 de 34 sin canal por versiones EU 230 V).

Los datos de research de las cuatro primeras están en `investigacion/`.
La lista maestra de 101 productos de todas las categorías está en
`catalogo/fuentes/referencia/REFERENCIA_101-productos-catalogo-completo_LISTA-MAESTRA.csv`.

## Placas madre — integradas

`catalogo/catalogo-final.json`: **30 placas con un único esquema de campos.**
Validado: **398 rutas de imagen, 0 rotas.**

| Marca | Placas | Completas (imagen + ficha + EAN) |
|---|---|---|
| GIGABYTE | 9 | 9 |
| ASUS | 7 | 7 |
| MSI | 7 | 7 |
| ASROCK | 6 | 6 |
| BIOSTAR | 1 | 1 |
| **TOTAL** | **30** | **30** |

**Truco — EAN que Icecat no tiene:** `upcitemdb.com/query?s=<MPN>&type=2`. **Sólo
funciona desde un navegador** (`curl` no devuelve nada). Para varios de golpe:
abrir `upcitemdb.com` y lanzar un bucle de `fetch()` en la consola sobre esa ruta,
con ~1,5 s entre consultas. Un **404 significa que no lo tiene**.
Validar siempre el prefijo del fabricante (ASRock `4710483` · MSI `4711377` /
UPC `824142` · ASUS `197105` y `199291` · Corsair `840006` · G.Skill `848354` ·
Gainward `4710562`) y el dígito de control. Los UPC de 12 dígitos se guardan con
`0` delante (EAN-13). **Descartar los listados de "Refurbished"** — la ASUS 5080
tenía uno (`700512074031`) junto al bueno.

Los EAN hallados así van en el diccionario `EAN_MANUAL` de
`scripts/integrar_gpu_ram.py`, para que no se pierdan al regenerar el catálogo.

**ASRock (6) y Biostar (1)** tienen imágenes de CDN y **specs oficiales del
fabricante** (`fuente: "cdn"`). No están normalizadas como las de Icecat: las
claves son las secciones del fabricante (Procesador, Memoria, Ranuras…) y los
valores, su texto en inglés. Originales en JORGE → `DATOS-FABRICANTE-originales/`.

Campos de control en cada placa:

| Campo | Qué dice |
|---|---|
| `fuente` | `icecat` o `cdn` |
| `completo` / `faltante` | si está completa y qué le falta (`ean`, `specs`…) |
| `url_oficial` | página del fabricante — el producto existe aunque falte ficha |
| `gama` | `entrada` · `media` · `alta` · `extrema` |
| `precio_referencia` / `precio_verificado` | **18 verificados, 12 estimados** (`false`) |

**Gama por modelo desde 2026-09-12** (ver "Gama por modelo" en la cabecera); los antiguos
rangos por precio ($150-200 · 200-300 · 300-450 · 450-700) ya no se usan.

## GPUs y RAM — integradas

Generadas con `scripts/integrar_gpu_ram.py` (desde `catalogo/`:
`python ..\scripts\integrar_gpu_ram.py . --escribir`). El script **sustituye**
las GPUs y RAM del JSON y **no toca las placas**; sin `--escribir` sólo muestra
el resumen. Mismo esquema que las placas.

**GPUs — 49 entradas, una por modelo de ensamblador**, con campo extra `chip`
(p. ej. `"RTX 5070"`) para agrupar por los 22 chips del catálogo. Tres chips
tienen varios modelos: RTX 5070 (Gigabyte, MSI, ASUS), RTX 5060 Ti 16GB
(Gigabyte, MSI) y RTX 4080 (Gigabyte **4080 sin Super** + MSI 4080 Super).
**Marcas: Gigabyte 17 · MSI 8 · ASUS 6 · Palit 6 · Gainward 6 · PNY 6 · ZOTAC 6 ·
ASRock 6.** ZOTAC y ASRock salieron del navegador del usuario con la extensión
de Claude (ver `PATRONES-CDN.md`), procesadas con `scripts/procesar_zotac_asrock.py`;
el crudo está en JORGE → `GPUS-ZOTAC-ASROCK_fabricante_2026-09-10/`. ASRock sólo
hace AMD, así que suma 6 Radeon.
- **Sustituidas por falta de EAN** (ninguna tienda accesible lo publicaba):
  ZOTAC 5080 SOLID OC → **5080 Solid Core OC** · 5070 Ti SOLID OC → **5070 Ti
  Solid SFF OC** · ASRock RX 9060 XT SL 8GB → **RX 9060 XT Challenger 16GB OC** ·
  RX 7800 XT Phantom Gaming → **RX 9070 Steel Legend OC** (no había otra 7800 XT de
  ASRock a la venta; misma gama, alta). Consecuencia: ASRock ya no cubre los chips
  RX 9060 XT 8GB ni RX 7800 XT. Fichas e imágenes de las retiradas en JORGE →
  `pruebas-y-superados/GPUS-zotac-asrock-sustituidas_2026-09-10/`.
- El EAN de la ASRock RX 9070 Steel Legend OC sólo sale en Caseking (nombre
  exacto y prefijo `4711581` de ASRock); el resto de ZOTAC/ASRock, en dos fuentes
  salvo la 7900 XTX (sólo upcitemdb).
Las 23 de Palit, Gainward, PNY y las 5 ASUS nuevas (`fuente: cdn`) se bajaron de
la web del fabricante con `scripts/marcas_gpu.py` — patrones en `PATRONES-CDN.md`.
Gainward trae EAN (campo Barcode) y PNY el UPC; **Palit y ASUS no publican EAN**.
Palit, Gainward y PNY son sólo NVIDIA; **ASUS aporta las únicas AMD que no son
Gigabyte ni MSI** (Prime RX 9070 y TUF RX 9070 XT).

- **EAN de Palit:** salen de **alternate.de** y **caseking.de**, que publican EAN
  y MPN en la ficha (Palit comparte el prefijo `4710562` de Gainward). La
  5070 GamingPro OC y la 5070 Ti GameRock OC no las vendía ninguna tienda, así
  que se **sustituyeron** por la **5070 Infinity 3 OC** y la **5070 Ti
  GamingPro-S OC**. Sus fichas e imágenes viejas están en JORGE →
  `pruebas-y-superados/GPUS-palit-sustituidas_2026-09-10/`.
- **Precio:** es el del **chip** según `investigacion/02_TARJETAS_GRAFICAS.md`,
  no el del SKU → las 49 van con `precio_verificado: false`. La Gigabyte 4080
  sin Super **no tiene precio** (la investigación sólo trae la Super).
- Fichas descargadas pero no usadas (sin imágenes): ASUS 5070 Ti
  `90YV0MD0-M0NA00`, AORUS 5090 Master, 5090 WindForce, MSI 5090 (vacía).

**RAM — 30 entradas, 30 completas (2026-09-11): 6 por marca** (ranking del
usuario: G.Skill, Corsair, Kingston, TeamGroup, XPG). Números 1-18 = investigación
(lista `RAM` de `integrar_gpu_ram.py`; las 4 Kingston originales con ficha Icecat);
3, 7 y 19-30 = web del fabricante, generadas por `scripts/procesar_ram_fabricante.py`
→ `catalogo/fuentes/ram/RAM_fabricante_FICHAS.json` (10-17 specs, 3-6 fotos).
Imágenes en `imagenes/ram/<gama>/high/ram-NN-*`. Las sustituidas (#3, #7, #12) están
en JORGE `pruebas-y-superados/RAM-imagenes-sustituidas_2026-09-11/`.
Precio = rango por tipo y capacidad de `RANGOS-PRECIO-RAM.md`;
`precio_verificado: true` sólo en 4, 5, 6, 7, 14, 16, 17, 18.
- Orígenes en JORGE (2026-09-11):
  - **TeamGroup 6/6 con EAN** → `RAM-TEAMGROUP_fabricante_2026-09-11/`
    (`teamgroup_fichas.json` + `_hermanas.json`, fotos del CDN `images.teamgroupinc.com`).
    Sustituyen a las 2 TeamGroup actuales. La Vulcan 5600 CL36 no existe (sólo
    CL40, y sin EAN) → hermana 5200 CL40; la Delta 48GB 6000 → 6400 CL32.
  - **XPG 6/6 con EAN** → `RAM-XPG_fabricante_2026-09-11/xpg_fichas.json`. Icecat
    sigue dando 429 al buscar (la portada sí carga). xpg.com no publica MPN por
    SKU: specs de familia en `?tab=spec`, fotos 2000px en `webapi3.adata.com/storage/product/`;
    MPN+EAN de alternate.de y upcitemdb.
  - **Kingston +2 con EAN** → `RAM-KINGSTON_fabricante_2026-09-11/kingston_fichas.json`:
    Beast RGB EXPO 6000 CL30 32GB `KF560C30BBEAK2-32` y Renegade RGB 7200 CL38
    32GB `KF572C38RSAK2-32`. Specs por SKU en `kingston.com/en/memory/search?partId=<MPN>`.
  - **EAN de G.Skill (4) y Corsair (2) resueltos** → `RAM-GSKILL-CORSAIR_ean_2026-09-11.json`
    (número de tupla `n`, MPN nuevo, EAN, nota). 5 de 6 cambian de MPN: el Neo
    32GB `…3040G…-TZ5N` y el Royal Neo 6800 **no existen**; Vengeance 16GB → 5200 C40;
    Dominator → versión B; Neo 48GB → Neo **RGB** CL26 (foto nueva de
    `gskill.com/_upload/images/1741936977{11,12}.png`, en `RAM-GSKILL-neo-rgb-48_2026-09-11/`).
- **MPN de Corsair corregidos (2026-09-10):** la investigación decía
  `CMK32GX5M2D6000C30` y `CMK64GX5M2D6000C30`; **esos SKU no existen**. Los reales
  son `…M2B6000C30` (comprobado en el buscador de corsair.com y en Best Buy).
  La Dominator **`CMP32GX5M2X6400C32` sí existe** (Corsair tiene X y B); Best Buy
  sólo vende la B (`840006674351`).
- **Best Buy publica el UPC en el JSON de la ficha** (`"upc":"…"`) y se lee desde el
  navegador integrado, añadiendo `&intl=nosplash` a la URL para saltar el selector
  de país. Galaxus no sirve para estos kits: son SKU americanos y responde
  "Deine Suche wurde erweitert" (búsqueda ampliada = no lo tiene).
- **Cuidado al buscar RAM por nombre:** upcitemdb devuelve kits *parecidos* pero
  de otro SKU (distinta latencia, color o capacidad). Ejemplos vistos: para la
  Dominator Titanium salió `CMP32GX5M2B6400C32` cuando la nuestra es la `…X…`, y
  para la Vulcan de 16GB, kits de 32GB. **Sólo se acepta si el MPN coincide.**
  Así se resolvió la Ripjaws V, que además no tenía MPN: `F4-3600C18D-32GVK`.
- Corsair **no publica el UPC** en sus fichas.
- La Kingston nº 6 es el SKU `KF560C36BBEK2-32` (**CL36**), no CL30 como decía
  la investigación: se usa el dato real del SKU.
- La imagen de la G.Skill Royal Neo (nº 10, 32 GB) se movió de `entrada/` a
  `alta/` para cumplir la regla de gama.

**Origen de las GPUs:** dos pasadas por Icecat: 23 de 24 (95,83 %) y 7 de 7
(100 %), **todo Open Icecat**. Datos en `fuentes/gpus/`.

La RTX 5090 se resolvió cambiando de ensamblador: la ficha de MSI está vacía en
Icecat, la de Gigabyte (`GV-N5090GAMING OC-32GD`) no. **Si una ficha viene
vacía, probar otro ensamblador antes de darla por perdida.**

**RAM:** 18 imágenes del CDN de los fabricantes, en `imagenes/ram/<gama>/high/`,
con nombre `ram-NN-<descripcion>.<ext>` donde `NN` es el número del producto en
`investigacion/04_MEMORIA_RAM.md`. Gama por capacidad: DDR5 16 GB y DDR4 16 GB =
entrada · DDR4 32 GB = media · DDR5 32 GB = alta · DDR5 48/64 GB = extrema.
Rangos en `documentacion/RANGOS-PRECIO-RAM.md` (precios disparados por la
escasez de DRAM de 2026).

**No re-descargar Kingston desde Icecat:** su medium-res es 500x313, peor que
los 2048x2048 del CDN de Kingston. Lo único útil de Icecat fueron los EAN
(`fuentes/ram/RAM_5-kingston-fury_INDICE-ean-e-imagenes.csv`).

### Imágenes compartidas — NO son duplicados

Productos distintos usan **la misma foto** porque el fabricante no hace fotos
por variante: RX 9060 XT 8/16 GB, RX 7700 XT / 7800 XT, RTX 5070 / 5070 Ti,
Corsair Vengeance DDR5 (16/32/48/64 GB), Kingston Fury Beast DDR5, G.Skill
Trident Z5 Neo y RGB, y fotos genéricas de caja entre algunas placas ASUS y
Gigabyte. Comprobado el 2026-09-09: Corsair sirve un recurso "config" por
familia, G.Skill una imagen por familia, e Icecat comparte las mismas fotos
entre SKUs de Kingston.

**Cada producto conserva su copia bajo su propio nombre. No borrarlas.** Borrar
una deja a ese producto sin imagen y rompe rutas del catálogo. Los duplicados
reales (copias con otro nombre) ya se eliminaron el 2026-09-10, verificados por MD5.

**Truco reutilizable:** el XML de Icecat exige auth (401), pero el PCF en **CSV**
trae URLs de `images.icecat.biz`, un **CDN público sin auth** — se puede leer el
PCF y descargar con `curl`. Las descargas del navegador tardan varios minutos en
aparecer en disco.

## Bloqueos conocidos

(Resueltos el 13-09: las imágenes ya están en `public/images/catalogo/` y el formato de la web lo genera
`exportar_web.py`, así que ya no bloquean nada.)

**Las fotos originales del catálogo no deben ir a producción** (`catalogo-investigacion/catalogo/imagenes/`,
~256 MB aunque ya sea 1 por producto). La web sólo necesita `public/images/catalogo/` (~20 MB). Si algún
día se despliega desde esta carpeta, excluir `catalogo-investigacion/` (p. ej. en `.vercelignore`).

**Icecat corta con HTTP 429 por IP**, no por cuenta ni por herramienta
(reconfirmado desde el Chrome del usuario con su sesión). Sólo queda esperar.

**Webs con verificación anti-bot** (zotac.com, techpowerup.com, ASRock con Incapsula, Micro Center,
Mercado Libre): no se resuelven los captchas; si hace falta, que el usuario abra la página en su Chrome.

## Los dos hallazgos que condicionan todo

**1. Buscar por MPN, nunca por nombre de modelo.** El emparejamiento en Icecat
pasa de 21,78 % a 85,71 %. Los 79 de
`fuentes/referencia/REFERENCIA_79-productos-que-icecat-no-tiene.csv` fallaron por
pedirse como "Ryzen 5 5600" en lugar de su código de fabricante.

**2. Emparejar no es poder usar.** Icecat encuentra el producto pero devuelve
*"You are not allowed to access a Full Icecat product"* si la marca es de pago.
Full Icecat cuesta desde €375/mes con facturación anual — no compensa.

| | Marcas |
|---|---|
| ✅ Abiertas | ASUS · MSI · Gigabyte · Kingston · **XPG** · Klevv · Integral · Goodram · HP · Lenovo · DELL · Origin Storage · Biwin · bluechip |
| ❌ De pago | **AMD** · **Intel** · **G.Skill** · **TeamGroup** · **Crucial** · **Patriot** · Corsair · ASRock · Thermalright · Noctua · Thermaltake · Phanteks · Enermax · Kolink · PNY · **Biostar** |
| ⚠️ No está en Icecat | **KingBank** (0 productos) |
| ❓ Sin comprobar | NVIDIA · ADATA (marca madre; **XPG sí es abierta**) · Samsung · Seasonic · be quiet! · Lian Li · Fractal · Arctic |

**Cómo comprobar una marca sin subir nada:** buscar en
`icecat.co.uk/en/search?keyword=<marca+modelo>`. `(sponsor)` con logo =
**abierta**; `<Marca> (Explore sponsors & opportunities)` = **de pago**.

**Truco — EAN gratis aunque la marca sea de pago:** abrir la ficha **pública** del
producto en Icecat (clic en el resultado de búsqueda). Muchas muestran el campo
**GTIN (EAN/UPC)** aunque la marca sea Full Icecat. Así salieron 6 EAN (Biostar y 5
ASRock). Si una ficha no lo tiene, probar **otra variante regional** del mismo
modelo (misma placa, otro código): la Crosshair X870E Hero sólo lo tenía en
`90MB1IE0-M0EAY0`. Cuidado con los nombres parecidos (`B650M` ≠ `B650E`,
`B860M` ≠ `B860`).

**Truco — sacar texto de webs con anti-bot (ASRock):** abrir la página en el Chrome
del usuario, extraer con JavaScript, copiar con `navigator.clipboard.writeText()` y
leer desde Windows con `Get-Clipboard -Raw` directamente a un archivo en JORGE. Evita
el límite de ~1.000 caracteres por salida de la herramienta del navegador. Si da
*"Document is not focused"*, hacer clic en la página y repetir. Las specs de ASRock
están en `index.asp`, pestaña **Specification** (hay que pulsarla).

**Cómo subir un lote a Icecat** (lo que dio 100 % con Gigabyte): ver
`documentacion/COMO-SUBIR-A-ICECAT.md`. Los pasos que se olvidan: en **Matching**
asignar `MPN` → *Manufacturer product code* y `Brand` → *Manufacturer brand
name*, dejar GTIN vacío y pulsar **SAVE SETTINGS**; luego en *My downloads*
marcar las tres casillas (Index, Catalog, Images) y **GENERATE**. Las filas de
descarga viejas **no se actualizan solas** — comprobar la fecha antes de bajar.
Subir un feed nuevo **reemplaza** el anterior, no lo suma.

**Vía alternativa — CDN de fabricantes:** patrones en
`documentacion/PATRONES-CDN.md`. Resueltos: Corsair, Kingston, TeamGroup,
G.Skill, **ASUS** (galería hasta 2000x2000), **Biostar** (curl directo) y
**ASRock** (`pg.asrock.com`, tras Incapsula: sólo desde el Chrome del usuario).
Sin resolver: Gigabyte y MSI — usar Icecat, que para ellas es abierto.

## Qué NO hacer

- **No borrar el `…_RESPALDO-ORIGINAL.zip`** (1,04 GB) del USB JORGE. Es la
  **única copia** de la exportación inicial de Icecat. Idealmente, tener una
  segunda copia fuera del USB.
- **No editar a mano `src/data/components.json` ni `public/images/catalogo/`**: se regeneran con
  `compatibilidad.py` → `exportar_web.py` y un cambio manual se perdería en la siguiente exportación.
- **No dejar backups de la web (`.tsx`, `.json`) dentro del repo**: van a JORGE (`tsc` los escanea).
- **No editar un archivo de `src/` sin releerlo antes**: hay otro editor trabajando en la web a la vez.
- **No meter productos europeos/asiáticos, sin stock o con disco mecánico en los presupuestos** (decisión
  del usuario y reglas de `PERFILES` en `compatibilidad.py`).
- **No borrar imágenes "repetidas" entre productos distintos** (ver arriba).
- **No afirmar que algo está duplicado sin verificarlo por hash.**
- **No guardar en el USB por letra de unidad** — siempre por la etiqueta `JORGE`.
- **No resolver desafíos anti-bot** (Imperva/Incapsula en ASRock). Si una web
  los muestra, pedir al usuario que la abra en su navegador.

## Cómo se recopiló cada categoría (histórico, 11-13/09)

> Referencia de fuentes, métodos y trampas por si hay que ampliar el catálogo. **No son tareas
> pendientes**: lo que queda abierto está en "Siguiente paso", al final.

1. **CPUs (22: AMD 14 · Intel 8) — INTEGRADAS** (2026-09-11) con
   `scripts/integrar_cpus.py . <JORGE>/CPUS_fabricante_2026-09-11 --escribir`
   (desde `catalogo/`; sólo reemplaza la categoría "Procesadores"). Fotos en
   `imagenes/procesadores/<gama>/high/`. Gama por modelo desde el 12-09 (antes por precio:
   entrada <$200 · media $200-350 · alta $350-500 · extrema >$500); precios
   **sin verificar** (ojo: Intel da RCP $219-229 al 250K Plus y $339-349 al 270K
   Plus, por debajo de lo que dice la investigación). Sólo Ryzen y Core (el usuario
   descartó Threadripper/Xeon: no hay placas sTR5/LGA4677 ni RAM RDIMM).
   Origen en JORGE `CPUS_fabricante_2026-09-11/`:
   - `cpu_codigos.json`: MPN de **caja** (AMD `100-…WOF/BOX`, Intel `BX…`) + EAN de
     upcitemdb, los 22 con dígito de control OK. El 250K Plus (`BX80768250K`) salió
     de Best Buy; los códigos de los "Plus" de `intel.com/…/sku/<id>/ordering.html`.
   - **AMD** (`scripts/cpus_amd.py`): amd.com se descarga **directo desde Python**.
     Specs = pares `<dt>/<dd>`; fotos 1200px en `/content/dam/amd/en/images/products/processors/ryzen/`.
     Las cajas sólo muestran la gama (5/7/9), así que hermanos comparten foto. El 5600
     y el 5700X3D **ya no tienen página** en amd.com: specs de la investigación.
   - **Intel** (`scripts/cpus_intel.py`): intel.com da **403** fuera del navegador;
     specs leídas en el navegador (`table.cmp-list-section__table`). intel.com no tiene
     fotos de producto → galería "Zoom" de **Best Buy** (hasta 2000px, `;maxHeight=2000`).
   - alternate.de puso **Cloudflare 429** tras muchas consultas seguidas: no forzar.
2. **Almacenamiento (2026-09-11) — INTEGRADO, 34 (41 − 7 retirados por la regla de calidad).**
   Retirados (`RETIRADAS.json` en JORGE; carpetas en `pruebas-y-superados/ALMACENAMIENTO-regla-calidad_2026-09-11/`):
   WD SN7100 2TB, SK hynix P41 1TB y 2TB, Seagate FireCuda 530 1/2/4TB y 540 2TB. Rescatados con fotos
   nuevas (script `trabajo/ssd_calidad.py`): Best Buy zoom (`piscesHref` con `rel` Zoom, `;maxHeight=2000;maxWidth=2000`,
   buscado por UPC desde la pestaña con fetch + AbortController) para SA510, T500 2TB, SN7100 1TB y — con
   fotos de la hermana de otra capacidad porque la etiqueta no la muestra — T500 1TB y P3 Plus 1TB;
   alternate.de /p/o/ para SN8100 2TB, BarraCuda 2TB/4TB (sin los banners "STORE MORE…") y WD Blue 2TB;
   NM790 1TB con las fotos de 1600 px de la 2TB. `integrar_almacenamiento.py` salta RETIRADAS y sólo copia
   fotos ≥ 900 px. Seagate queda sólo con las 2 BarraCuda. Reparto final: Samsung 8, WD 9
   (incl. HDD WD Blue), SK hynix 4, Crucial 6, Kingston 5, Seagate 6 (incl. 2 BarraCuda HDD),
   Lexar 3. Integración: `python ..\scripts\integrar_almacenamiento.py . <JORGE>/ALMACENAMIENTO_fabricante_2026-09-11 --escribir`
   desde `catalogo/`; sustituye sólo la categoría "Almacenamiento". Resumen en español
   (Tipo, Capacidad, Formato, Interfaz, Lectura/Escritura, Velocidad de giro, TBW, Garantía)
   delante de la ficha cruda; campos nuevos `ean_confirmado` y `nota` ("EAN por nombre, sin
   confirmar": 13, 15, 16, 35-37). Gama por modelo desde el 12-09 (antes por precio: entrada <$80 ·
   media $80-150 · alta $150-250 · extrema >$250). Sin TBW en la fuente: EVO Plus 1-2TB, 9100 PRO,
   P31, NM790 y HDD. Historia de la recopilación (abajo) — el plan original era:
   Samsung 6, WD 6+1 HDD, SK hynix 4, Crucial 5, Kingston 5, Solidigm 4,
   Seagate 4+2 HDD, Lexar 4. **Hecho:** códigos y EAN en JORGE
   `ALMACENAMIENTO_fabricante_2026-09-11/ssd_codigos.json` (41, GS1 OK).
   **30 confirmados** por MPN; **11 "EAN por nombre, sin confirmar"**
   (`ean_confirmado: false`, decisión del usuario): SK hynix P31 1TB/2TB y P41 2TB,
   Solidigm P41 Plus 2TB y P44 Pro 1TB, FireCuda 530R ×3 (MPN también sin
   confirmar), Lexar NM790 ×3. Sustituidos por no tener EAN: Platinum P51 → Gold P31
   2TB; NM1090 Pro → NM710 2TB. SK hynix, Solidigm, Lexar y la 530R **no se venden**
   en alternate, Best Buy ni Micro Center (Micro Center sí da "Mfr Part#" + "UPC"
   en sus fichas y funciona tras pasar el usuario su Cloudflare).
   **Fichas y fotos: 7/41** (`fichas_bestbuy_lote1.json` + `<MARCA>/<MPN>/NN.jpg`):
   los 6 Samsung y el WD SA510 (este de un vendedor externo de Best Buy, sólo
   4 specs → rehacer). Método: buscar en Best Buy **por UPC** (`/site/searchpage.jsp?st=<upc>`)
   y aceptar la ficha si `"upc"` coincide; specs = pares `displayName/value` de
   `ProductSpecification`; fotos = `piscesHref` con `rel` *Zoom* (+`;maxHeight=2000`).
   **Best Buy bloqueó las fichas ("Failed to fetch", Akamai) tras ~15 seguidas.**
   Salida de datos del navegador: el portapapeles no funciona en bestbuy.com y
   la extensión **bloquea fetch a 127.0.0.1** ("privacy-gateway") → leer por trozos
   de ≤900 caracteres (la herramienta corta a ~1.000; base64 se bloquea).
   **+7 de fabricante** (`fichas_skhynix_lexar.json`): SK hynix ×4
   (`ssd.skhynix.com/<gold_p31|platinum_p41>/`, specs en texto, fotos
   `wp-content/uploads/2021/07/{p41_1080,p41_box_1080,gold_p31_0N}.jpg`) y Lexar
   NM790 ×3 (`window.__NUXT__` → `childModelList` por capacidad con galería webp en
   `www-oss.lexar.com`; la tabla de specs no está en texto). **Total 14/41.**
   Decisiones del usuario (2026-09-11): **Solidigm fuera** (P41 Plus y P44 Pro
   "discontinued" en solidigm.com) → nº 27-30 = Samsung 990 EVO Plus 4TB, WD SN850X
   1TB, Kingston NV3 2TB, Crucial P310 4TB. **FireCuda 530R → FireCuda 530**
   (`ZP…GM3A013`, confirmados): seagate.com redirige a Latinoamérica por IP (también
   desde Python) y allí no existe la 530R. Lexar NM710: página 404 en lexar.com
   (posiblemente descatalogado; se mantiene porque su EAN sí está confirmado).
   **+4 sustitutos de Solidigm** (`fichas_sustitutos_solidigm.json`, nº 27-30), de
   fabricante con curl/Python SIN navegador: samsung.com/uk (la página US da 404; SKU UK
   MZ-V9S4T0BW = mismo modelo; fotos `images.samsung.com/...?$2052_1641_PNG$`),
   sandisk.com (WD ya está en sandisk.com; hace falta `--compressed`), kingston.com
   (`media.kingston.com/kingston/product/<MPN>_<cap>{-zm-lg,_angle-zm-lg,_pkg-zm-lg}.jpg`,
   2048 px) y crucial.com (specs en `pdpObj` JSON; fotos en assets.micron.com, que
   rechaza peticiones sin cabeceras de navegador + Referer crucial.com). **Total 18/41.**
   **+15 y #7 rehecho** (`fichas_fabricante_lote2.json`, 16 fichas; script en la carpeta
   temporal `trabajo/lote_fabricante2.py`): WD 7-12 + HDD 41, Crucial 18-21, Kingston
   22-26. URLs correctas de WD salen de `sandisk.com/products-sitemap.xml` (SN7100 =
   `wd-black-sn7100-nvme-internal-ssd?sku=…-00CJA0`, SN8100 = `wd-black-sn8100-ssd`); la web
   sólo muestra specs de la SKU por defecto, así que SN7100/SN8100/SA510 salen de sus
   **datasheets PDF** (documents.sandisk.com). #7 SA510: la ficha actual es de la revisión
   WDS100T5B0A (nuestro WDS100T3B0A es la anterior); sus fotos de Best Buy se apartaron a
   JORGE `pruebas-y-superados/ALMACENAMIENTO-imagenes-sustituidas_2026-09-11/`. **Al
   integrar, lote2 manda sobre lote1 para el #7.** KC3000 (24, 25): la página de producto
   ya no existe en kingston.com (sólo soporte + datasheet `kingston.com/datasheets/KC3000_en.pdf`);
   ficha completa pero **sin fotos**. Precios oficiales vistos: P310 4TB $364.99, P3 Plus 1TB
   $61.99, T500 1TB $165.99, T500 2TB $264.99, T705 2TB $303.99. **Total 33/41.**
   **Descatalogados sustituidos** (decisión del usuario 2026-09-11; script
   `trabajo/sustitutos_descatalogados.py`, salida `fichas_sustitutos_descatalogados.json`):
   #17 BX500 1TB → **Crucial P310 1TB** (CT1000P310SSD8, 0649528942081); #24 KC3000 1TB →
   **Kingston NV3 4TB** (SNV3S/4000G, 0740617346602); #25 KC3000 2TB → **WD SN850X 4TB**
   (WDS400T2X0E, 0718037891378); #38 Lexar NM710 2TB → **Samsung 990 PRO 1TB**
   (MZ-V9P1T0B/AM, 0887276657004; ficha de samsung.com/uk, SKU MZ-V9P1T0BW). Los 4 EAN
   confirmados (upcitemdb API `api.upcitemdb.com/prod/trial/search?s=<MPN>` funciona desde
   curl, pero da `TOO_FAST` tras ~4 consultas seguidas). La lista anterior, el lote2 anterior
   (con los KC3000) y las carpetas vacías KC3000 están en JORGE
   `pruebas-y-superados/ALMACENAMIENTO-descatalogados_2026-09-11/`. Precio oficial P310 1TB
   $106.99. **Total 35/41** (35 EAN confirmados; sin confirmar: 13, 15, 16, 35-37).
   **Seagate hecho** (`fichas_seagate.json`, script `trabajo/seagate.py`): las páginas de
   seagate.com dan Cloudflare 429 a curl, pero en el navegador cargan (redirigen a /la/es/ y a
   la página de **soporte**); los **PDF** bajo `/content/dam/` sí se descargan con curl.
   Datasheets es_LA: FireCuda 530 `DS2059-5-2310`, 540 `DS2120-2-2304`, BarraCuda `DS17-2-2603US`.
   Los PDF de 530 y 540 **confirman nuestros UPC**. La web sólo tiene la FireCuda a 270 px, así
   que las fotos son las incrustadas en el PDF (pypdf; 562 px la 530, 796×298 la 540, 562 px la
   BarraCuda). Las fotos web de la BarraCuda (rotulado "24TB") se apartaron a
   pruebas-y-superados. FireCuda 530/540 ya **no las venden Best Buy ni Micro Center** y la
   540 no tiene página de producto en Latinoamérica (posible retirada; revisar al fijar precios).
   **Total 41/41 con ficha y fotos** (fotos más pobres: Seagate, T500 y P3 Plus con 1 foto).
   **Integrado** uniendo (el más nuevo manda por `n`, y se descarta la ficha cuyo MPN ya no
   coincide con `ssd_codigos.json`): `fichas_bestbuy_lote1.json` (1-6; su #7 queda anulado por lote2),
   `fichas_skhynix_lexar.json`, `fichas_sustitutos_solidigm.json`, `fichas_fabricante_lote2.json`,
   `fichas_sustitutos_descatalogados.json`, `fichas_seagate.json`.
2b. **Fuentes de poder (2026-09-11) — INTEGRADAS, 34** (también retirada la MSI MAG A850GL PCIE5, 1 foto). Retiradas por la regla de calidad (en JORGE
   `pruebas-y-superados/FUENTES-PODER-descartadas_2026-09-11/`, lista en `RETIRADAS.json`): las 4 Super
   Flower y la Cooler Master MWE Gold 1050 V2 (2 fotos). MSI: fotos de alternate (630-920 px) sustituidas
   por las de Icecat (~1024 px). `integrar_fuentes.py` sólo copia fotos de lado ≥ 900 px (mín. 1): la MSI
   MAG A850GL PCIE5 se queda con 1 foto. Ficha de alternate traducida del alemán (claves y valores; se
   quitan EAN/MPN europeos y los textos libres "Weitere Informationen"/"Feature"); XPG con la de Icecat en
   inglés. Precio de referencia = precio de alternate en € ≈ $ (sin verificar); gama por modelo desde el
   12-09 (antes por precio: <$80 · $80-130 · $130-200 · >$200). Ojo: Dark Power 14 (EU) acepta sólo 200-240 V.
   Historia de la recopilación: Ranking del usuario (Seasonic, Corsair, Super Flower,
   be quiet!, FSP, Thermaltake, MSI, ASUS, XPG, Cooler Master) × **4 cada una, 550-1200 W** = 40.
   JORGE `FUENTES-PODER_fabricante_2026-09-11/`: `psu_codigos_lote1.json` + `fichas_lote1.json` (32:
   todas menos Super Flower y XPG), `icecat/<EAN>.json`, fotos `<MARCA>/<MPN>/NN.ext`. Scripts en la
   carpeta temporal `trabajo/` (`psu_alt_listas.py`, `psu_alt_fichas.py`, `psu_icecat.py`, `psu_lote1.py`).
   **Fuentes que funcionan:** alternate.de por curl (MPN, EAN, tabla de specs en alemán, fotos originales
   ~2000 px cambiando `/p/1200x630/` por `/p/o/`; pausa ≥12 s); **Open Icecat API sin clave**
   `live.icecat.biz/api?shopname=openicecat-live&lang=en&GTIN=<ean>` (o `&Brand=&ProductCode=`): da specs,
   fotos 800 px y **todos los GTIN** (así sale el UPC de EE. UU.) para MSI, ASUS, be quiet!, FSP y XPG;
   Seasonic/Corsair/Thermaltake/Cooler Master/Super Flower = 403 (sólo Full Icecat). upcitemdb: límite
   ~100/día y 429 si se va rápido (≥45 s entre consultas). Micro Center: MPN+UPC en ficha, pero Cloudflare
   y se colgó la pestaña con fetch en bucle.
   **Versión:** US donde está confirmada (Corsair -NA; MSI A550BN/A650GL/A850GL; ASUS TUF 650B/850G y Thor
   1200); **europea** en be quiet!, Thermaltake y Cooler Master (decisión del usuario) y MSI A1000G;
   Seasonic/FSP/ASUS Strix 1000 código global. Cooler Master Elite Gold: fotos de la galería
   `coolermaster.com/on/demandware.static/-/Sites-cooler-master-main/.../Assets/<slug>/large/`.
   **Lote 2 hecho** (`psu_codigos_lote2.json` + `fichas_lote2.json`, script `trabajo/psu_lote2.py`):
   **XPG = Core Reactor II 650/850/1000/1200** (cambio aprobado por el usuario; MPN `COREREACTORII<W>G-BKCUS`,
   UPC US de Icecat 0842243029390/…413/…420/…437, specs y 6-8 fotos 800 px de Icecat) y **Super Flower**
   Leadex III Gold 650 (SF-650F14GE), VII Gold 850 (SF-850F14XG), VII Platinum PRO 1000 (SF-1000F14XP),
   VIII Platinum PRO 1200 (SF-1200F14SP): tabla técnica de super-flower.com.tw por columna de potencia;
   **EAN vacío, marcado sin confirmar** (decisión del usuario: no hay fuente libre). Fotos Super Flower
   pobres: la web sólo tiene 1 foto limpia de 420 px por familia (`upload/catalog_list_pic/`) + portadas
   por potencia (`catalog_b/..._01_<W/10>__`); las infografías `catalog_b/..._0N__` se descartaron (en
   pruebas-y-superados). **Total 40/40.** **Siguiente:** integrar como categoría "Fuentes de poder"
   (specs de alternate en alemán → resumen en español).
2c. **Gabinetes (2026-09-11) — INTEGRADOS, 24** (`scripts/integrar_gabinetes.py`). Pedido del usuario:
   ranking Lian Li, Fractal Design, Phanteks, Corsair, be quiet!, NZXT; pensados para IA + GPU grande
   (flujo de aire, espacio GPU, nº de ventiladores, radiadores); 4 por marca y **la gama la da el diseño,
   no el precio** (extrema = torre grande / pecera de cada marca). Todos negros.
   | Marca | Entrada | Media | Alta | Extrema |
   |---|---|---|---|---|
   | Lian Li | LANCOOL 207 | LANCOOL 217 Infinity | O11 Dynamic EVO RGB | O11 Dynamic EVO XL |
   | Fractal | Pop 2 Air | North | Meshify 3 XL | Torrent |
   | Phanteks | XT Pro Ultra | NV5 MKII | NV7 | NV9 MKII |
   | Corsair | 3500X | FRAME 4000D RS ARGB | FRAME 5000D RS ARGB | iCUE LINK 9000D Airflow |
   | be quiet! | Pure Base 501 Airflow | Shadow Base 800 FX | Light Base 900 FX | Dark Base Pro 901 |
   | NZXT | H5 Flow 2024 | H6 Flow | H7 Flow 2024 | H9 Flow RGB+ |
   JORGE `GABINETES_fabricante_2026-09-11/`: `fichas_gabinetes.json` + fotos `<MARCA>/<MPN>/NN.ext` (hasta 8).
   Fuentes: alternate.de (MPN, EAN, specs en alemán, fotos `/p/o/` ~2000 px; ojo, negro y blanco comparten
   slug → mirar `Farbe`) y, para Phanteks, **phanteks.com** (specs en inglés y **UPC del fabricante**; tabla
   = `<h4>` etiqueta + todos los `<p>` hasta el siguiente `<h4>`; fotos `wp-content/uploads`, `-scaled` = grande).
   Los códigos de cajas son globales (sin versión EU/US). Resumen en español: formato, placa, **GPU máx.,
   disipador máx., radiadores por zona, ventiladores incluidos**, posiciones (Phanteks), malla, medidas,
   peso; ficha completa traducida; los "Hinweis" libres traducidos a mano (`NOTAS`). Fotos excluidas
   (diagramas de medidas y despieces de be quiet!) en `EXCLUIR`. Precio ref. = € de alternate ≈ $ (sin
   verificar); Phanteks estimado. Scripts de recopilación en `trabajo/` (`gab_alt_listas.py`,
   `gab_alt_fichas.py`, `gab_phanteks.py`, `gab_ph_specs.py`, `gab_lote.py`, `gab_hoja.py`).
   **+ 4 temáticos (n 25-28, gama extrema, campo `tematico: true`)** pedidos por el usuario, en
   `fichas_tematicos.json` (script `trabajo/tem_listas.py`, `tem_fichas.py`, `tem_lote.py`): HYTE Y70 Touch
   Infinite GUNDAM WING (CS-HYTE-Y70TTI-GWING), Montech KING 95 PRO negro (KING95PROB), ROG Hyperion GR701
   negro (90DC00F0-B39000), ROG Cronox GR801 CURVE negro (90DC00T0-B09030). Montech: alternate sólo tiene
   630 px → fotos de montechpc.com `/images/<id>/0/2000` (original real grande; las de 630 px en
   pruebas-y-superados/GABINETES-montech-630px_2026-09-11).
2d. **Refrigeración (2026-09-11) — INTEGRADA, 38** (`scripts/integrar_refrigeracion.py`, campo `tipo` aire|liquida).
   Ranking del usuario: Noctua, Arctic, DeepCool, be quiet!, Thermalright, Corsair, NZXT, Cooler Master, Lian Li,
   ASUS ROG × entrada/media/alta/extrema. Reparto aprobado: sólo aire Noctua/Thermalright (Thermalright extrema =
   AIO Trofeo Vision); sólo AIO Corsair/NZXT/Lian Li/ROG; mixtas (aire entrada-media, AIO alta-extrema) Arctic,
   be quiet!, DeepCool, Cooler Master. JORGE `REFRIGERACION_fabricante_2026-09-11/`: `fichas_refrigeracion.json`,
   fotos `<MARCA>/<MPN>/NN.ext`, `EXCLUIR_fotos.json` (fotos no-producto por n), `RETIRADAS.json`.
   **Thermalright no está en alternate.de:** UPC + Mfr Part# de **Micro Center** (Cloudflare: la verificación la
   pasa el usuario en su Chrome; fetch en segundo plano con AbortController y resultado en `window._x`, la
   herramienta corta a 45 s), specs en inglés y fotos 1500 px de `thermalright.com/product/<slug>/`
   (lista en `wp-sitemap-posts-product-1.xml`). Entrada/media = versiones **Digital** (las SE sólo 800 px).
   Sustituciones/rescates: Noctua NH-U12A con fotos de `cdn.noctua.at/media/nh_u12a_chromax_black_N.jpg`
   (3500 px); DeepCool LQ360 ULTRA → **Spartacus 360** (las AIO LQ/LE/LM/Mystique de DeepCool en alternate sólo
   600-770 px; deepcool.com da 403); Atmos II LCD + foto de bomba de coolermaster.com. **Retiradas:** Cooler
   Master Atmos II LED (y su sustituta VRM Fan: 1 sola foto negra 360) y Lian Li LCD-C 360N (2 fotos útiles);
   Lian Li LCD-S 360N pasa a entrada. Precio ref. = € alternate ≈ $; Thermalright = Micro Center.
3. **Precios USD — HECHOS y ESCRITOS en el catálogo (2026-09-12).**
   **Estado actual tras la limpieza por mercado objetivo: 263 productos, 229 con precio y 34 sin precio**
   (14 marcados `no_disponible` por europeos + 20 pendientes de fuente regional; ver "Mercado objetivo").
   Historia: los 277 productos de entonces se consultaron el mismo día en **pcpartpicker.com**
   (EE.UU., precio más bajo con stock): **202 con precio, todos `precio_verificado: true` y revisados
   tienda por tienda en su ficha**, y 75 sin precio; después se añadieron **40 de de./uk.pcpartpicker**
   (€/£ con IVA → sin IVA → USD al BCE 11-09), de los que 14 se han quedado sin precio por europeos y el
   resto sigue pendiente de confirmarse en fuente americana. Campos: `precio_usd`, `precio_usd_fecha`, `precio_usd_fuente`,
   `precio_usd_nota`, `precio_usd_revisar`; `precio_referencia` (estimación vieja) sin tocar.
   Backup: `catalogo-final.BACKUP-20260912-0512-antes-precios-usd.json`. Borrador con id de
   PCPartPicker y nota por producto en JORGE `PRECIOS_pcpartpicker_2026-09-12.json` (clave =
   índice del catálogo). Scripts en `scripts/precios/`.
   - **Método (rápido, sin 429):** navegador integrado en `/products/<categoria>/`, cambiar
     `location.hash = 'm=<id marca>&page=N'`, esperar a que cambie la tabla y leer
     `tr.tr__product` (enlace + `.td__price`); ~2 s por página, 100 filas. El **final del
     enlace es el MPN** → cruce exacto quitando signos (`MZ-V9P2T0B/AM` = `mz-v9p2t0bam`).
     La API interna (`/qapi/product/category/`) lleva token: no llamarla directo. La
     **búsqueda** tiene límite (`/ratelimit/`): no usarla. Ids de marca: `data-value-id` del
     checkbox del filtro. Llamadas de JS > 45 s se cortan: ≤ 10 páginas por llamada.
     Best Buy **no sirve** como fuente única (marketplace y agotados con precios inflados).
   - Versiones: Samsung se lista como global `…BW`, Lexar `-RNNNG`, y las fuentes EU
     (be quiet! `…EU`, Thermaltake `…E-…`) con su equivalente US → anotado en `precio_usd_nota`.
   - **Revisión de dudosos (2026-09-12, `scripts/precios/precios_revision.py`)**: 18 precios mirados en
     la ficha (`/product/<id>/`, tabla `table.xs-col-12`: tienda en el `alt` del logo, stock y total;
     con `fetch` + `DOMParser`, 1 cada 8 s). **Criterio:** vale una tienda de referencia (Newegg, Best
     Buy, B&H, tienda de la marca, Amazon si otras tiendas coinciden), con stock o su precio de tienda
     anotado como agotado. **No vale:** sólo **MemoryC** (revendedor con sobreprecio), sólo "Available
     soon", o sólo Amazon muy por encima del chip → `precio_usd: null` con el precio visto en la nota.
     Resultado: confirmados X870E Taichi ($287.19), MSI y ASUS 5060 Ti 16GB, Arctic LF III Pro 360;
     corregidos Gigabyte 5060 Ti 16GB ($799.99 Best Buy) y ASUS TUF 9070 XT ($879.99 tienda ASUS);
     **sin precio 12**: Palit 5060 Ti 16/8GB, 5070 y 5080, ZOTAC 5060 Ti 16GB y 5080, Gainward 5060 Ti
     8GB, ASRock 9070 Steel Legend, RTX 4060, RX 7600, RX 7800 XT y Arctic LF III Pro 420.
   - **Revisión completa de fichas (2026-09-12, `scripts/precios/precios_fichas.py` +
     `fichas_decision.json`)**: las 200 fichas restantes con la misma regla (fuera MemoryC y "Available
     soon"; el más bajo con stock; si nadie tiene stock, precio de tienda anotado como agotado). 185
     confirmados, 12 ajustes menores (Amazon) o a precio de tienda oficial (MSI B860M Mortar $149.99,
     Z790 Tomahawk $229.99, Z890 Edge Ti $369.99 — agotados), **4 sin precio**: ASUS PRIME B650M-A WIFI II
     y Kingston Fury Beast 64GB (sólo MemoryC), NZXT Kraken Elite 420 (sin stock), MSI RTX 4080 Super
     (sólo Amazon, stock residual). La nota de cada producto dice en qué tiendas se vio y si había stock.
     **Ojo:** la lista de categoría muestra el precio más bajo aunque esté agotado o sea de MemoryC →
     para verificar hay que mirar la ficha. **Método sin freno:** el navegador integrado oculto frena
     los `setTimeout` de la página (una ficha por minuto); un **Web Worker** creado desde un Blob
     (`fetch` con URL absoluta + regex sobre `td__logo` / `td__availability` / `td__finalPrice`) va a
     1 ficha cada ~10 s sin 429 (200 fichas ≈ 35 min).
   - **Sin precio (59 de origen + 12 dudosos + 4 de la revisión completa = 75):** de origen, 18 GPUs (serie 40 y RX 7700-7900 agotadas, 5 Gainward, 2 Palit,
     3 ZOTAC), 14 fuentes (versiones EU/marcas sin venta en EE.UU.), 6 RAM, 8 refrigeración
     (**DeepCool no vende en EE.UU.: 0 precios**), 5 gabinetes, 4 almacenamiento, 3 placas,
     Ryzen 7 5700X3D.
   - **La memoria y el almacenamiento están carísimos** (escasez de 2026): 16GB DDR5 ≈ $240-340,
     64GB ≈ $1.200-1.500, un 870 EVO 1TB $320. Por eso **la gama ya no sale del precio**: ver
     "Gama por modelo" arriba.
   - **PEN (Perú): HECHO** (decisiones del usuario, 2026-09-12): `precio_pen` = `precio_usd` ×
     **3,373** × **1,18 (IGV)** — es el precio a mostrar; `precio_pen_sin_igv` = sólo la conversión.
     TC = BCRP "sistema bancario SBS – venta" del 10-09-2026 (el último publicado; API
     `estadisticas.bcrp.gob.pe/estadisticas/series/api/PD04639PD-PD04640PD/json/<desde>/<hasta>`).
     Campos `precio_pen`, `precio_pen_sin_igv`, `precio_pen_igv`, `precio_pen_tc`, `precio_pen_tc_fecha`,
     `precio_pen_fuente`. No incluye envío ni aranceles. Para actualizar el TC:
     `scripts/precios/precios_pen.py <tc> <fecha>`. Backup: `catalogo-final.BACKUP-20260912-0518-antes-precios-pen.json`.
4. **Antes del traslado (13-09) — HECHO:**
   - **Fotos de CPU — primera pasada HECHA (13-09)**: +9 fotos en 6 AMD (`scripts/estandar-fotos/cpu_bestbuy.py`
     descarga y hace hoja de contactos; `cpu_integrar.py` integra; originales y hoja en JORGE
     `CPU_fotos-bestbuy_2026-09-13/`). Ahora 48 fotos, 14 CPUs con 1-2. Método: en el navegador, búsqueda
     de Best Buy **por nombre** (por EAN no encuentra nada; la búsqueda se pinta con JS, esperar ~6 s), ficha
     con `piscesHref` + `rel` Zoom, y **sólo si el UPC de la ficha = nuestro EAN sin el 0** (el 9600X se
     descartó: su ficha era de un revendedor con otro UPC). Best Buy primero muestra un selector de país.
     **Rendimiento bajo**: de 31 fotos quedaron 9. Best Buy usa las mismas imágenes de prensa de AMD que ya
     teníamos, y la trasera de la caja (sólo texto) no vale. Una CPU tiene en la práctica 3 vistas
     distintas (caja de frente, caja en ángulo, chip), así que "1-2 fotos" exagera el problema.
     Open Icecat da 403 en las 21 (AMD e Intel son de pago); Cyberpuerta da 1 foto y a menudo < 900 px.
     Sin fuente: Ryzen 5 7600, 9600X y 9850X3D. Intel no se repasó (sus fotos ya salían de Best Buy).
     **Ajustes aprobados y hechos (13-09)**, `cpu_ajustes.py`: fuera los banners 1200×675 del 9800X3D y
     9950X3D (movidos a JORGE `pruebas-y-superados/CPU_banners_2026-09-13/`); el Ryzen 5 7600 recibe la foto
     del chip AM5 del 7600X (mismo encapsulado, no muestra el modelo; campo `imagen_compartida`) como principal.
   - **Specs de RAM — HECHO (13-09)**, `scripts/ram_specs.py`: los 12 con 5-7 campos escritos a mano (6 Corsair,
     6 G.Skill) pasan a 19-21 specs del fabricante; ya no queda ninguna RAM con menos de 10. Open Icecat no
     sirve (Corsair es de pago, G.Skill no está). **Corsair**: la URL completa sale de
     `corsair.com/us-sitemap-products-1.xml` (la corta da 404); la página trae todas las variantes en
     `__NEXT_DATA__` → se toma sólo el item con `sku` EXACTO. **G.Skill**: página `/specification/...` del
     `gskill.com/sitemap.xml`, por MPN exacto (ojo: `-TZ5N` no debe casar con `-TZ5NR`); pares
     `list-block list-tit` / `list-block`. Claves y valores traducidos; fuera "Weight 0kg" (dato roto de
     Corsair), "Memory Detail Compatibility" y "Features" (duplicados). Campo `specs_fuente` con la URL.
     **Se corrigieron datos escritos a mano que estaban MAL** (nota en `specs_corregido`): voltaje de Corsair
     Vengeance DDR5-6000 32GB y 64GB (1,35 V → 1,40 V) y G.Skill Z5 Neo RGB 48GB (1,40 → 1,45 V); y el perfil
     de la **Corsair CMK32GX5M2B6000C30, que figuraba como AMD EXPO y es Intel XMP** (la versión EXPO es otro
     SKU, `…Z30`) — importa para el configurador. "Perfil XMP/EXPO" ahora sale del fabricante en las 12.
   - **Fotos de RAM — HECHO (13-09)**: `scripts/estandar-fotos/ram_fotos.py` descarga la galería del SKU
     exacto a JORGE `RAM_fotos-fabricante_2026-09-13/` (+ hoja de contactos) y `ram_integrar.py` integra.
     **+51 fotos en 11 módulos** (RAM: 70 → 120; 1-2 fotos: 13 → 4; genéricas: 3 → 1). **Corsair**: en el
     `__NEXT_DATA__`, `media_gallery` del producto con `sku` exacto; son URLs de Cloudinary a 96 px → cambiar
     la transformación a `/upload/c_limit,w_2000,q_95/` y la extensión a `.jpg` (a ratos da "certificate
     has expired": reintento sin verificar). La mitad de su galería son cuadros de marketing con texto
     (fuera). **G.Skill**: `/product/...` del sitemap (la URL puede ser `<MPN>-<MPN variante GA2>`), enlaces
     `rel="example_group"`; publica todo a 1100×590 (vale: el estándar mira el lado mayor). **Trampa**: sus
     PNG son transparentes → componer sobre blanco antes de pasar a JPG, si no salen franjas basura.
     Duplicados detectados con dHash contra las fotos que ya había. **Error antiguo corregido**: la foto del
     #87 Trident Z5 RGB **plateada** (TZ5RS) era la de la **negra** (TZ5RK) → movida a JORGE
     `pruebas-y-superados/RAM_foto-variante-equivocada_2026-09-13/`.
     **Kingston (13-09)**: kingston.com da 403 por curl, pero su CDN `media.kingston.com` no. Nombres vistos
     en el navegador: `FURY_Beast_<Black|White>[_EXPO]_<DDR4|DDR5>_<1|2|4>[_angle|_pkg]-zm-lg.jpg` (2048 px;
     el número = módulos del kit). La ficha no enlaza part number → galería: se asigna por nomenclatura
     (`BB` = Beast Black, `BBE` = Black EXPO, `K2` = kit de 2). `kingston_fotos.py` + `kingston_integrar.py`:
     **+15 fotos** en las 4 FURY Beast (1 → 4-5 fotos; principal = kit en ángulo). Originales en JORGE
     `RAM_fotos-kingston_2026-09-13/`. **RAM queda sin ningún módulo de 1-2 fotos (135 fotos).** Única
     pendiente: Vengeance LPX DDR4 (Corsair sólo publica 800 px; sigue genérica).
   - Opcional para subir la cobertura `local` (hoy 13, todo Infotec): **PC Factory** y **Memory Kings**
     pintan resultados con JavaScript → necesitan navegador. Promart no sirve (sólo marketplace).
   - Pendientes menores: Palit RTX 5070 Infinity 3 (S/ 2.909, score 0,8) a confirmar a mano; coste
     "puesto en Lima" (IGV sobre CIF + arancel + mínimo exento courier) **a verificar en SUNAT antes de
     mostrar ninguna cifra**; ASRock Arc B580/B570 sin fuente accesible.
5. **Traslado a la web — HECHO el 13-09**, con otro enfoque: el usuario rechazó el boceto de una página
   `/componentes` con los 274 y tres estados de tarjeta (riesgo de que el usuario se pierda) y eligió la
   Opción 1: todo dentro del configurador existente, dólar como base y soles sólo como referencia bajo el
   total. Ver "Integración en la web — HECHA (13-09)".

## Siguiente paso

**No queda nada pendiente de lo que pidió el usuario** (13-09). Lo abierto, por si se retoma:

1. **Precio americano para los europeos/asiáticos que más aportan** (hoy en el configurador con aviso
   naranja y fuera de presupuestos): MSI MAG B760M Mortar WiFi II (daría builds Intel LGA1700 baratas), las
   2 B650M, las 3 Intel Arc (sustituirían a la RTX 3050 en Entrada) y las fuentes de 650 W. 23 de los 58
   no tienen ningún precio de referencia.
2. **9 GPUs sin largo en su ficha** (las 6 PNY, Zotac y Palit RTX 3050, XFX RX 7600): hoy se tratan como
   compatibles con cualquier gabinete. Las webs de Zotac y TechPowerUp piden captcha: necesita al usuario.
3. **Cuando vuelva el stock de RTX 5090** en EE.UU.: añadir `{"chip": "RTX 5090"}` a los perfiles de
   Extrema en `compatibilidad.py` (hoy las 3 builds Extrema llevan RTX 5080).
4. **Palit RTX 5070 Infinity 3**: vista en Infotec a S/ 2.909, falta confirmarla a mano para pasarla a `local`.
5. **Coste "puesto en Lima"** de lo importado (IGV sobre CIF + arancel + mínimo exento courier): verificar
   en SUNAT antes de mostrar cualquier cifra en soles que no sea la referencia del total.
6. **Opcional / higiene:** 16 `resumen` en inglés (TeamGroup, AMD…); el configurador arrastra 55 avisos de
   ESLint `no-explicit-any` anteriores a este trabajo; la calculadora de la portada (`BuildCalculatorModal`)
   no la abre ningún botón (código muerto); la línea de Entrada empieza en US$ 1.333 (el usuario decidió
   dejarla así el 13-09).
7. **Coordinarse con el otro editor de la web** antes de cambios grandes en `src/` (ver cabecera).

## Mantenimiento de este archivo

Actualízalo **tras cualquiera de estos hitos**:

- se descargó un lote nuevo al USB JORGE
- se procesó un lote en `catalogo/`
- se comprobó si una marca es abierta o de pago
- se trasladó algo a `public/` o a `src/data/`

Hazlo también **de inmediato si el usuario dice "actualiza el estado"** — lo
avisa cuando se acerca a su límite de tokens, y es su forma de asegurar el
traspaso antes de un corte. Antes de una tarea larga, guarda el estado primero.

Al actualizar, cambia la fecha y el bloque "Estado hoy" de la cabecera, y la lista de "Siguiente paso".
