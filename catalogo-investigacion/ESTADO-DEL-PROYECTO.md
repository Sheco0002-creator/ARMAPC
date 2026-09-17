# Estado del proyecto — ArmaPC

> **Última actualización:** 17 de septiembre de 2026 (Guías también en inglés y español).
> **Punto de entrada para cualquier IA que retome el proyecto.** Es una foto del presente: se
> sobrescribe, no se acumula. Cómo se llegó hasta aquí (fuentes y métodos de cada categoría, trampas ya
> resueltas, auditoría, integración paso a paso, cifras de cada hito) está en
> `documentacion/HISTORIA-DEL-PROYECTO-hasta-2026-09-13.md` (copia íntegra del estado anterior).

## Estado hoy

**La web funciona con el catálogo real.** Último cambio: estilo pecera (16-09-2026, ver su sección).

- **La web se dirige a EE.UU.** (decisión del usuario, 15-09-2026): el precio base es el dólar americano y
  **no se menciona ningún precio peruano** en ninguna pantalla. Los 13 productos cuyo precio salía de una
  tienda de Perú se repreciaron con precio de EE.UU. (ver "Reglas y decisiones vigentes").
- **Catálogo** — `catalogo/catalogo-final.json`, cerrado y auditado: 274 productos (30 placas · 61 GPUs ·
  30 RAM · 21 CPUs · 32 almacenamiento · 38 fuentes · 28 gabinetes · 38 refrigeración), 278 tras dar
  de alta 4 fuentes americanas. Disponibilidad: 223 `importacion_us` · 55 `importacion_global`
  (ya no hay `local`). **1 foto por producto en C:** (8 con
  imagen genérica); el resto de la galería, en JORGE. Guía de campos: `catalogo/README.md`.
- **Configurador** — 263 productos (217 americanos + 46 europeos con aviso naranja), paso a paso,
  con modelos y versiones. Ver "Cómo funciona la web".
- **Presupuestos** — 20 builds (5 por nivel: 3 de gaming, 1 de streaming y 1 de IA local, con selector
  "Uso" en Presupuestos y en el configurador), sólo con productos de EE.UU. con stock.
- **Otro editor trabaja en la web a la vez** (no es otra sesión de Claude en este equipo). El 13-09 cambió
  migas de pan y fondos de vídeo en todas las páginas, añadió el botón "Ver más" del configurador y
  `?nivel=` en presupuestos (`useSearchParams` + `Suspense`). **Antes de editar un archivo de `src/`,
  releerlo; al terminar, comprobar que siguen los cambios de los dos.**
- **Última verificación completa (15-09-2026):** compatibilidad de las 12 builds, imágenes, precios y
  marcas, con `tsc` y `npm run build` limpios. Salió un fallo, ya corregido: el filtro "ATX" de las placas
  devolvía las 30 (buscaba el texto suelto y "mATX"/"E-ATX" también contienen "ATX").
- **Mesa interactiva de ensamble por capas (15-09-2026):** se procesaron los recortes de
  `catalogo-investigacion/imagenes prueba1/` (`Background (1..8).png`, `cat.png`, `Principal.png`),
  alineándolos al milímetro con la composición original. Se exportaron 11 capas WebP ultraligeras a
  `public/images/escena/` (~1,2 MB en total frente a >16 MB originales, con canal alfa sin pérdida).
  Se integró en `InteractiveDeskScene.tsx` con el diseño en tonos rojos del prototipo original,
  modal de información centrado en pantalla, clip-path en la GPU para eliminar cualquier bloqueo sobre
  la CPU (100% interactiva), selector rápido superior por botones y ficha completa para todos los
  componentes (incluyendo el Rabisho Supervisor). Vive en Guías (`/` y `/es`); se eliminó la ruta
  separada `/escena`.
- **Navegación horizontal fluida y ficha técnica SSD (15-09-2026):** se implementó un sistema de
  desplazamiento animado con botones Chevron laterales, gradientes de sombra en los bordes, auto-centrado
  al seleccionar cualquier pieza y soporte para rueda de ratón, resolviendo el desbordamiento de botones
  como RAM y CPU. Se integró la investigación técnica del catálogo de 32 SSDs en la ficha de
  Almacenamiento SSD M.2 NVMe (PCIe 4.0/5.0, velocidades de 5.000 a 14.700 MB/s, DirectStorage, TBW,
  formato 2280, DRAM/HMB y regla de oro del plástico protector en el Thermal Pad) con resolución
  exhaustiva con fallback en el modal.
- **Resolución definitiva de superposición GPU y CPU (15-09-2026):** se aplicó una jerarquía de
  superposición física relativa por `z-index` (CPU en primer plano con base 55, máx 63; GPU en plano medio
  con base 32, máx 40 al seleccionarse) combinada con un recorte `clip-path: polygon(...)` en el contenedor
  de la GPU que elimina el cuadrante transparente inferior derecho. Esto garantiza que la caja de la GPU
  jamás invada ni bloquee los clics sobre el CPU, permitiendo seleccionarlo en todo momento sin tener que
  moverlo de su posición natural en la mesa.
- **Limpieza de cabecera en la escena interactiva (15-09-2026):** se retiró el botón redundante
  "Ver Ficha de <componente>" de la barra superior, manteniendo únicamente el interruptor "Ver/Ocultar Nombres"
  para una interfaz más limpia y directa.
- **Integración de guías técnicas en la Mesa de Taller y nueva Guía de Ensamblaje (15-09-2026):**
  se auditaron las 9 guías didácticas y se implementaron todos los consejos técnicos específicos
  (regla de núcleos e IPC, 3D V-Cache, VRAM según resolución, no conectar HDMI a placa madre, 32GB Dual Channel
  y activación XMP/EXPO, disipador aire doble torre vs AIO, margen de 150-200W en PSU 80+ Gold, norma ATX 3.1
  con cable 12V-2x6, y presión positiva con panel frontal Mesh) directamente en las fichas de `src/data/componentesMesa.ts`.
  Se creó el componente interactivo `GuiaEnsamblajeStepByStep.tsx` con 10 pasos cronológicos, lista de chequeo
  interactiva, medidor de progreso y advertencias para principiantes, ocupando el nuevo espacio dedicado en
  `GuiasView.tsx`. Las guías transversales y estratégicas (`compatibilidad`, `errores-comunes`, `glosario`)
  se mantienen fijas en su ubicación de la biblioteca como lecturas maestras de consulta rápida.
- **Sistema de Ilustraciones Didácticas Animadas en la Guía de Ensamblaje (16-09-2026):**
  se diseñó el sistema visual de apoyo con estilo animado/didáctico para cada sub-paso de la guía.
  Se generaron y optimizaron a WebP en `public/images/ensamblaje/` un total de 27 ilustraciones activas:
  - *Paso 1 completo (3/3):* `paso-1-1.webp` (descarga estática), `paso-1-2.webp` (placa en caja) y `paso-1-3.webp` (infografía DO/DON'T bolsa antiestática).
  - *Paso 2 completo (5/5):* `paso-2-1.webp` (apertura de palanca), `paso-2-2.webp` (sujeción por bordes del PCB), `paso-2-3.webp` (alineación de triángulos guía), `paso-2-4.webp` (asentamiento plano 'Zero Pressure') y `paso-2-5.webp` (cierre y expulsión del protector).
  - *Paso 3 completo (5/5):* `paso-3-1.webp` (retirar disipador M.2), `paso-3-2.webp` (retirar film del thermal pad), `paso-3-3.webp` (inserción de SSD a 30°), `paso-3-4.webp` (fijación al poste con tornillo M2 / EZ-Latch) y `paso-3-5.webp` (montaje y fijación del disipador térmico M.2).
  - *Paso 4 completo (4/4):* `paso-4-1.webp` (apertura de pestillos en ranuras A2 y B2), `paso-4-2.webp` (alineación de la muesca guía asimétrica), `paso-4-3.webp` (inserción firme con alineación de muesca y bloqueo automático de pestillos) y `paso-4-4.webp` (segundo módulo instalado y confirmación Dual Channel verificado).
  - *Paso 5 completo (5/5):* `paso-5-1.webp` (soportes y espaciadores del disipador), `paso-5-2.webp` (retirar pegatina plástica protectora de la base de cobre), `paso-5-3.webp` (aplicación de pasta térmica en grano de guisante), `paso-5-4.webp` (apriete en patrón cruzado alternado) y `paso-5-5.webp` (conexión PWM obligatoria al puerto CPU_FAN).
  - *Paso 6 completo (5/5):* `paso-6-1.webp` (retirar paneles laterales del gabinete), `paso-6-2.webp` (preconexión de cables en fuente modular), `paso-6-3.webp` (deslizar la fuente en el túnel inferior con ventilador hacia abajo), `paso-6-4.webp` (fijación trasera de la fuente con 4 tornillos hexagonales) y `paso-6-5.webp` (patrón de 9 postes elevadores de latón ATX y advertencia de no dejar postes sobrantes). Con estilo 100% idéntico a Pasos 1 y 2.
  La interfaz cuenta con previsualización flotante al pasar el ratón en PC y lightbox/modal emergente táctil en móviles y escritorio con botón de cierre 'X' y soporte para la tecla ESC.




## Qué es y dónde vive cada cosa

Tienda web de PCs y componentes **ArmaPC** en `C:/Users/USUARIO/Desktop/Primera Pagina Web`.
Next.js 16.3.4 (App Router), React 19.2.8, TypeScript, Tailwind 4, Zustand, Framer Motion, GSAP.
**Web entera en dos idiomas** (ver "Inglés y español"): inglés sin prefijo (`/` Guías,
`/configurator`, `/budgets`, `/full-setup`, `/about`, `/contact`, `/terms`, `/privacy`) y español bajo
`/es` (`/es` Guías, `/es/configurador`, `/es/presupuestos`, `/es/setup-completo`, `/es/sobre-nosotros`,
`/es/contacto`, `/es/terminos`, `/es/privacidad`). Guías pasó a los dos idiomas el 17-09-2026;
`/guias` redirige a `/es`.
`AGENTS.md` (raíz) obliga a leer la guía de Next.js de `node_modules/next/dist/docs/` antes de programar.

| Ruta | Papel |
|---|---|
| `src/components/vistas/*.tsx` | Una vista por sección (Configurador, Presupuestos, Setup, Sobre, Contacto, T&C, Privacidad); cada una se monta en su ruta inglesa y española |
| `src/components/GuiasView.tsx` (+ `InteractiveDeskScene`, `GuiaEnsamblajeStepByStep`) | Guías, la portada: `/` y `/es`; su texto inglés está en `src/data/*.en.ts` |
| `src/app/(en)/<ruta>/page.tsx`, `src/app/es/<ruta>/page.tsx` | Envoltorios de 10 líneas: metadatos (title, description, hreflang) + la vista |
| `src/i18n/` | `rutas.ts` (tabla de direcciones, `tr`, hreflang), `Idioma.tsx` (contexto + `useIdioma`), `datos.ts` (campos `*En` del catálogo) |
| `src/proxy.ts` | Idioma por navegador/cookie y redirecciones de las direcciones antiguas en español |
| `src/data/components.json` | Lo que lee la web: 263 productos (`categories`) + 20 builds (`tiers[].builds`, con `uso`). **Generado: no editar a mano** |
| `public/images/catalogo/` | 233 fotos para 263 productos (los hermanos comparten archivo; ≤ 900 px, ~18 MB), también generadas |
| `public/images/components/` | Foto genérica por categoría, de respaldo |
| `catalogo-investigacion/` | Esta carpeta: estado, documentación, catálogo y scripts (no es código de la app) |
| USB **`JORGE`** → `catalogo-investigacion-ARCHIVO/` | Descargas en bruto, respaldos y todo lo retirado |

**No es un repositorio git.** Los respaldos de la web van a JORGE `pruebas-y-superados/BACKUP-web-...`;
nunca dentro del repo, porque `tsc` escanea todo el árbol y un `.tsx` antiguo rompe el build.

## Flujo de datos y cómo regenerar la web

```
USB JORGE / catalogo-investigacion-ARCHIVO/   1. toda descarga o investigación en bruto aterriza aquí
catalogo-investigacion/catalogo/              2. se extrae, clasifica y verifica → catalogo-final.json
scripts/compatibilidad.py                     3. normaliza campos y arma las 20 builds → compatibilidad.json
scripts/exportar_web.py                       4. escribe catalogo/export/ (components.json + images/),
                                                 con los textos en inglés (`specsEn`, `taglineEn`...)
src/data/  +  public/images/catalogo/         5. se copia a mano, con backup del components.json anterior
```

Desde `catalogo-investigacion/scripts/`: `python compatibilidad.py` → `python exportar_web.py` → revisar
`catalogo/export/` → copiar `export/components.json` a `src/data/` y `export/images/*.jpg` a
`public/images/catalogo/` (sólo las que referencia el components.json nuevo: si el exportador avisa de
imágenes de exportaciones anteriores, esas se mueven a JORGE, no se copian). Hoy los scripts reproducen byte a byte lo que hay en la web (13-09). Después:
`npx tsc --noEmit` y `npm run build` (el servidor de desarrollo del usuario suele estar en el puerto 3000;
no matarlo). ESLint arrastra ~55 avisos `no-explicit-any` anteriores: el criterio es no sumar ninguno.

## Inglés y español (15-09-2026)

Decisión del usuario: **el idioma principal es el inglés** (público de EE.UU.) y el español es la
segunda versión, con direcciones en cada idioma. **Las páginas no están duplicadas**: cada sección es una
sola vista en `src/components/vistas/` y los textos van en el código como `tr("español", "inglés")`, con el
idioma que da `useIdioma()`.

- **Direcciones:** inglés sin prefijo, español bajo `/es` (lista completa arriba). La tabla única está en
  `src/i18n/rutas.ts`; de ahí salen el menú, el pie, el selector EN/ES, los `hreflang` y el proxy.
- **`src/proxy.ts`:** las direcciones antiguas en español (`/configurador`...) redirigen a `/es/...`;
  con el navegador en español, la versión inglesa redirige a la española; la cookie `lang` (selector
  EN/ES de la cabecera) manda sobre el navegador. `/es` es la portada (Guías) en español; `/guias` redirige ahí.
- **Textos de datos:** los exportadores escriben la versión inglesa junto a la española, sólo cuando
  cambia — `components.json`: `specsEn`, `grupoEn`, `labelEn`, `nameEn`, `taglineEn`, `targetEn`,
  `enfoqueEn`, avisos `...En` (`al_ingles()` y las tablas de `exportar_web.py`); `setupProducts.json`:
  `kindEn`, `specsEn`, `noteEn`, `stockEn`, `storeEn`, traducidos en
  `setup/setup-perifericos-en.json` (si falta algo, el script avisa al exportar).
  Las fichas didácticas de periféricos tienen su traducción en `src/data/setupPeripherals.en.ts`.
- **Los filtros del configurador siguen buscando el texto español** de las fichas (así lo comprueba la
  autoverificación de `exportar_web.py`); sólo se traduce la etiqueta del botón (`nombreFiltro`).
- **Guías (17-09-2026):** portada inglesa `src/app/(en)/page.tsx` ("/") y española `src/app/es/page.tsx`
  ("/es"), las dos con `GuiasView`. Traducciones aparte, con el español como fuente y los mismos ids:
  `src/data/componentesMesa.en.ts` (fichas de la mesa de taller + títulos de `escenaLayers.json`),
  `src/data/ensamblaje.en.ts` (10 pasos; si el número de subinstrucciones de un paso no cuadra con el
  español, ese paso se enseña en español) y `src/data/guias.en.ts` (tarjetas de `guides.json`, artículos
  y etiquetas; los filtros siguen comparando la etiqueta española). **Si el otro editor cambia o añade
  un texto en esos archivos españoles, hay que reflejarlo en su `.en.ts`.**
- **Pendiente de esta fase:** `<html lang>` (el layout raíz lo escribe en `en`, el idioma principal, y
  las páginas españolas lo corrigen al montarse) y `NEXT_PUBLIC_SITE_URL` para que los `hreflang` lleven el dominio
  real en vez de `localhost:3000`.

## Estilo pecera (16-09-2026)

Pedido del usuario: builds "pecera" (fishbowl), muy populares en EE.UU. Investigación en
`investigacion/05_PECERA_REVERSE_Y_BLANCOS.md`; implementado el mismo día ("Impleméntalos").

- **Catálogo** (`scripts/alta_pecera_2026-09-16.py`, idempotente): 344 productos. Campo `color` en todos
  ("blanco"/"negro"/"mixto"/null), `estilo_pecera` en los gabinetes (lista a mano, 12 + 7 blancos),
  **66 altas**: 9 GPUs, 8 gabinetes, 10 AIO y 8 placas blancas + 8 kits de RAM blancos, y la categoría
  nueva **"Ventiladores"** (23 packs reverse, campo `ventilador`: tamaño, pack, ecosistema, grosor). Los
  gabinetes blancos copian la ficha de su versión negra (`specs_de_hermano`). Fotos revisadas a ojo en
  `scripts/fotos_pecera_ok.txt`; el resto, genérica (`_generica/ventiladores.png` es nueva).
- **Compatibilidad** (`compatibilidad.py`): `posiciones_ventilador` lee los huecos de abajo y del lateral de
  cada gabinete (Notas de Icecat o fichas de Phanteks) y si ya trae ventiladores. Regla nueva: el pack
  tiene que caber abajo o al lateral (y en su grosor máximo, si la ficha lo da). `ESTILOS` añade por nivel
  1 build "pecera" y 1 "pecera-blanca" POR USO (gaming, streaming e IA: 6 por nivel, 24 en total; gabinete
  pecera obligatorio, AIO, un pack de ventiladores sin hub aparte; la blanca prefiere todo en blanco y la
  normal evita lo blanco; GPU ≥ 27 % en gaming y ≥ 22 % en streaming/IA). Las de streaming e IA copian el
  perfil de su uso (CPU, RAM, disco, GPU). Gaming: Entrada 1.460 / 1.636 · Media 2.210 / 2.168 · Alta
  3.063 / 2.725 · Extrema 4.052 / 4.240 (US$). 44 builds en total.
- **Las builds de siempre bajaron** con las piezas nuevas (p. ej. Alta Intel 2.471 → 2.308, IA Alta
  3.567 → 3.350): la regla "la más barata" ahora elige a veces la versión blanca.
- **Web:** `components.json` trae la categoría `fans` (`optional: true`, no cuenta en "8 de 8"), `color`,
  `pecera`, `fanSlots`, `fanSize/fanPack/fanThickness/fanEcosystem` y `estilo` en cada build.
  Presupuestos y el configurador tienen el selector **"Estilo: Estándar / Pecera / Pecera blanca"**
  (`estilosBuild`, `estiloDe` en `src/lib/equipoCompleto.ts`; estilo y uso se combinan libremente;
  `?estilo=` en la URL). En el configurador el estilo filtra las listas (pecera: sólo
  gabinetes pecera; blanca: sólo lo blanco donde lo hay) y avisa de ventiladores sin hueco, iCUE LINK
  (hub aparte), ROG Eurux (USB propio) y grosor de 30 mm. Imagen de categoría: `public/images/components/fans.jpg`.
- **Guía de líquidos (17-09-2026):** en Guías, filtro LÍQUIDA (`liquidos-pecera` en `guides.json`, artículo en `GuiasView.tsx` y su inglés en `guias.en.ts`): AIO vs circuito abierto, agua destilada con aditivo, premezclados transparentes, pastel, con brillo/UV, qué no usar, tubos, llenado y prueba de fugas de 24 h. Es educativa: sin productos ni precios. Respaldo previo: JORGE `pruebas-y-superados/BACKUP-web-antes-guia-liquidos_2026-09-17`.
- **Líquidos en Setup (17-09-2026):** módulo 08 `coolant` "Líquidos para Pecera (Opcional)" en `/full-setup` y
  `/es/setup-completo`: 8 fichas (7 productos) con foto y precio de primochill.com y performance-pcs.com;
  no suma al total, sale aparte ("+ $") igual que streaming. Desde: entrada 21,98 · media 13,95 · alta 37,98 ·
  extrema 46,98 US$. Detalle en `setup/README.md`. Respaldo previo: JORGE
  `pruebas-y-superados/BACKUP-web-antes-setup-liquidos_2026-09-17`.
- **Límite conocido:** una build lleva UN pack; no hay cantidades. El configurador enseña los huecos del
  gabinete para que el comprador sepa si necesita un segundo pack.

## Cómo funciona la web

**Configurador (paso a paso).** 8 pasos plegables (CPU, placa, RAM, GPU, disco, fuente, gabinete,
refrigeración), uno abierto a la vez, cada uno con la pieza elegida y su compatibilidad en una línea.
Con una build cargada todos empiezan cerrados (3,4 pantallas en escritorio, 4,7 en móvil); "Empezar desde
cero" y "Limpiar" abren la CPU; "Siguiente: <paso>" lleva a la próxima categoría sin pieza.
- Dentro de un paso se ven **modelos**, no productos: el campo `grupo` que pone el exportador (GPU por chip y
  VRAM, placa por chipset, RAM por capacidad, disco por capacidad y tipo, fuente por potencia,
  refrigeración por tipo; CPU y gabinete van uno a uno). Compatibles primero, luego por precio "desde";
  6 a la vista + "Ver más modelos"; el elegido se ve siempre.
- Al pulsar un modelo se pone la **versión recomendada** (la más barata compatible con stock en EE.UU.) y
  aparece "Elige la versión" con las demás marcas (4 + "Ver las N").
- La URL se lee una vez al montar (`useLayoutEffect`): `?b=<build>&nivel=<id>` = esa build exacta
  (presupuestos y "Compartir Link"); `?desde=cero` = vacío; sin parámetros = preset del nivel del store.
- En móvil y tablet, barra fija abajo con total, piezas, estado y "Ver resumen".
- **Foto grande al pasar el ratón** (15-09, `src/components/VistaPreviaProducto.tsx`): en cabeceras de
  paso, modelos, versiones, lista del resumen y tarjetas del desglose de presupuestos. Sólo con ratón, no
  en táctil. **Configurador: siempre a la izquierda y grande** (`soloIzquierda`, lo pidió el usuario):
  344 px en el margen en 1920; en pantallas más estrechas 360 px pegada al borde, pisando el borde de la
  lista (el usuario lo prefiere a que no salga: una versión que la ocultaba se descartó). No sale < 1024 px.
  Presupuestos: el margen más cercano al producto (al usuario le gusta así).
- **Móvil y tablet: doble toque en la foto la amplía** (15-09, `ampliarAlTocar` en el mismo archivo):
  ventana a pantalla completa con la foto y el nombre, X para cerrar (también tocando fuera o Escape).
  En las mismas fotos que la vista previa; en el resumen del configurador, toda la fila (la foto mide
  20 px). El segundo toque no llega a la tarjeta (la cabecera del paso no se abre y cierra). Con ratón no
  hace nada. Al probar en dev, ojo: la página de presupuestos tiene un `<main>` oculto duplicado del
  streaming; hay que tocar el visible.

**Compatibilidad en vivo** (`checkItemCompatibility` y `compatibilityIssues`): socket CPU↔placa · tipo de
RAM · largo de GPU↔gabinete · formato de placa↔gabinete · altura del disipador o tamaño de radiador↔
gabinete · TDP y socket del disipador↔CPU · fuente ≥ demanda estimada con margen ×1,35 **y ≥ la fuente que
pide el fabricante de la GPU** (`recommendedPsu`) · **largo de la fuente↔gabinete y cables de la
gráfica↔fuente** (desde el 15-09, ver abajo) · avisos de conector de CPU libre y de RAM más rápida
que la placa. Datos: el largo de GPU sale de "Longitud" o "Board
Size"/"Dimensions", nunca del paquete; consumo y fuente que falten, de otras fichas del mismo chip; los
disipadores que sólo dicen LGA1700 también sirven en LGA1851 (mismo anclaje, `sockets_inferidos`).
Quedan 9 GPUs sin largo en su ficha (6 PNY, Zotac y Palit RTX 3050, XFX RX 7600): se tratan como compatibles.

**Reglas de montaje añadidas el 15-09-2026** (pedidas por el usuario tras el análisis de montaje,
artefacto "Qué piezas no encajan"), en el configurador y en las builds (`compatibilidad.py`):
- **Largo de la fuente ↔ gabinete** — error. `psuLength` (la "Profundidad" de la ficha) frente a
  `maxPsuLength` ("Longitud máx. de fuente"). Choca en 11 parejas: la Corsair HX1200i (200 mm) no entra
  en 5 gabinetes, la ROG Thor (190) en 4, y la ROG Strix 1000W (180) y la Dark Power 14 (175) sólo en el
  Lancool 207, que admite 160 mm. Sin dato: FSP Hydro G Pro 1200W.
- **Cables de la gráfica ↔ fuente** — `cablesGpuFuente()` en `page.tsx`, la misma lógica que
  `cables_gpu_psu()` en `compatibilidad.py`. Gráfica de N cables de 8 pines (`pcie8pinCount`) con fuente
  de menos (`pcie8pin`) → error. Gráfica de 12V-2x6 (`powerConnector`) con fuente sin ese conector
  (`connector12v2x6: 0`) → aviso "usa el adaptador de la caja" si la fuente trae los cables de 8 pines que
  pide (`adapter8pin`: RTX 5070 2, 5070 Ti y 5080 3, 5090 4, sacado de las fichas de PNY y heredado por
  chip), y error si no. Las builds prefieren fuente con 12V-2x6 nativo. Hoy casi todos los errores de
  cable coinciden con fuentes a las que ya les falta potencia; lo nuevo son los avisos de adaptador
  (5 fuentes sin 12V-2x6 con las RTX 5070/5070 Ti). Sin dato: 5 GPUs y 4 fuentes (Seasonic GX-650/750,
  XPG Core Reactor II VE, FSP Hydro G Pro), que no se juzgan. Antes de activarla se comprobó la Corsair
  RM750e en corsair.com: la ficha decía 1 cable de 8 pines y trae 3 (1 + cable "12V-2x6 a doble 8
  pines"); con el dato viejo habría bloqueado 4 RX 9070 que sí se montan
  (`scripts/corregir_rm750e_cables_2026-09-15.py`, antes en `specs_corregido_2026_09_15`).
- Sin cambios en las 12 builds: ninguna chocaba.
- **Dos avisos más, el mismo día** (no descartan nada; salen en ámbar en el resumen):
  - **Conector de CPU libre** — la placa trae más conectores EPS de 8 pines (`epsConnectors`, dato en
    14 de 30 placas) que la fuente (`epsConnectors`, 33 de 37). Afecta a 9 placas y 5 fuentes de 1 EPS.
  - **RAM más rápida que la placa** — `ramSpeed` del kit frente a `ramMaxSpeed` de la placa (26 de 30):
    los dos kits DDR5-7200 en la MSI B650 Tomahawk (6600) y la ASUS Prime B650M-A II (6400).
  - Cualquier aviso le quita a una build el "100% Garantizada", así que `compatibilidad.py` elige la
    fuente sin aviso de EPS y no toma una RAM que la placa frene. Resultado: dos builds de entrada pasan
    de la MSI MAG A550BN (1 EPS) a la Thermaltake Smart BM3 650W (2 EPS), **+US$ 18 cada una**
    (Ryzen 5 7600X + RTX 5060: 1.333 → 1.351; Core Ultra 5 245K + RX 9060 XT: 1.348 → 1.366). Las 12
    salen sin avisos.
- Respaldo de la web antes de los avisos: JORGE `BACKUP-web-despues-reglas-montaje_2026-09-15/`
  (comprobado idéntico por SHA-256 a la web justo antes de editar).

**Presupuestos.** Cada nivel es una clase de GPU por chip y tiene 3 builds con enfoque distinto
(`PERFILES` en `compatibilidad.py`); en la web, nombre "CPU + GPU" y línea "Enfoque de esta opción".

| Nivel | US$ | Builds |
|---|---|---|
| Entrada | 1.351–1.366 | Ryzen 5 7600X + RTX 5060 · Ryzen 5 9600X + RX 9060 XT 8 GB · Core Ultra 5 245K + RX 9060 XT 8 GB |
| Media | 2.089–2.149 | Ryzen 7 7700X + RTX 5070 · Core Ultra 5 250K Plus + RTX 5070 · Core Ultra 7 265K + RX 9070 |
| Alta | 2.471–2.872 | Core Ultra 7 270K Plus + RX 9070 XT · Ryzen 7 7800X3D + RX 9070 XT · Ryzen 7 9800X3D + RTX 5070 Ti |
| Extrema | 3.917–5.018 | Ryzen 7 9850X3D + RTX 5080 · Core Ultra 9 285K + RTX 5080 · Ryzen 9 9950X3D + RTX 5080 + 64 GB |

Reglas de las builds: sólo americanos con stock; sólo NVMe (nunca disco mecánico); RAM mínima 16/32 GB,
≥ 6000 MT/s en Alta/Extrema, ≤ 6400 en AM5, ≤ 48 GB salvo el perfil de creación; fuente según las dos
reglas de la web; la GPU ≥ 30 % del total (si no, el configurador enseña su "Tip Gamer"). Entre builds de
un nivel cambian CPU, GPU, placa, gabinete y disipador; RAM, disco y fuente van al mejor precio. Desde el
15-09 la variedad de placa, gabinete y disipador es **filtro** y no desempate (`duro=True` en `mejor()`):
la gama iba delante y dos builds de Media acabaron con la misma placa. En la GPU sigue siendo desempate:
el chip lo fija el perfil y forzar otra marca sólo encarece la build. Las 12
salen "100% Garantizada" en el configurador. Las RTX 5090 están sin stock en EE.UU.: Extrema usa RTX 5080.

**Fichas.** Una línea de datos por producto (`specs_str` en `exportar_web.py`), p. ej. "14 núcleos
(6P+8E) / 14 hilos · hasta 5.2 GHz · L3 24 MB", "DDR5 · ATX · Wi-Fi 7 · 4× M.2 · LAN 2.5G", "RTX 5070 ·
12 GB GDDR7 · 302 mm", "1TB · NVMe Gen4 · lee 7150 MB/s"; la fuente muestra su certificación 80 PLUS o
Cybenetics. Sin ficha ampliada (1 foto por producto, decisión del usuario).

## Reglas y decisiones vigentes del usuario

- **Mercado: EE.UU.** (15-09-2026). El precio base es el dólar americano y **la web no muestra soles ni
  menciona precios peruanos** en ninguna pantalla: ni por producto, ni como referencia bajo el total.
- **Los precios son referencias, no el precio exacto** (15-09-2026). Bajo el total del configurador y
  de presupuestos (`src/components/AvisoPrecios.tsx`): "Precios de referencia vistos en tiendas de EE.UU.
  en los últimos 15 días. No son el precio exacto…". Lo de "15 días" sólo sale mientras sea verdad:
  el componente compara `preciosDesde` (la revisión más antigua, la escribe `exportar_web.py`) con la
  fecha del visitante y, si pasan de 15 días, enseña el rango real ("del 12 al 15 de septiembre de
  2026"). **Para que siga diciendo "15 días" hay que revisar todos los precios al menos cada 15 días.**
  Sustituye al "Precios reales verificados en EE.UU." del configurador. Los precios no se actualizan
  solos: no hay API usable sin ventas (Amazon Creators API pide 10 ventas de afiliado en 30 días).
- **Precio:** todo `precio_usd` sale de una tienda de EE.UU. (pcpartpicker.com y, si no lo lista, Newegg /
  Amazon / B&H), con su `precio_usd_fuente` y la tienda concreta en `precio_usd_nota`.
- **Disponibilidad** (`disponibilidad`): `importacion_us` = precio de EE.UU. verificado ·
  `importacion_global` = sin precio americano; su motivo (`disponibilidad_motivo`): 35
  `sin_precio_verificado` (la marca sí se vende allí), 15 europeos, sin canal o modelo que no llega,
  4 `sancion_eeuu` (DeepCool), 1 pendiente de confirmar. Ya no queda ningún `local`.
- **Los 13 con precio peruano (15-09-2026):** se repreciaron con precio de EE.UU. 8 lo tenían (Z890 AORUS
  ELITE WIFI7 US$ 280, ROG Hyperion GR701 US$ 513, ASUS Dual RTX 3050 6GB y MSI RTX 3050 VENTUS US$ 260,
  GIGABYTE RTX 5050 WINDFORCE US$ 400, ASUS Dual RTX 5050 US$ 420, XFX RX 7600 US$ 330, y la MSI RTX 5050
  GAMING OC a US$ 430 pero agotada). 5 no se venden en EE.UU. y pasaron al aviso naranja: los 3 DeepCool
  (marca en la lista SDN de la OFAC desde 2024; se muestra su precio alemán), la ZOTAC RTX 3050 Twin Edge
  6GB (sin precio en ninguna tienda) y la PALIT RTX 3050 StormX (sin canal en EE.UU.). El rastro peruano
  quedó en `precio_peru_interno`, sin exportar. Lo hizo `scripts/precios_us_2026-09-15.py`.
- **Los 25 que no tenían ningún precio (15-09-2026, 2.ª ronda):** 6 sí se venden en EE.UU. y ya tienen
  precio — las Sparkle Arc B580 TITAN (US$ 370) y B570 GUARDIAN (US$ 279), Crucial P310 4TB (US$ 595),
  Corsair iCUE LINK TITAN II 360 RX LCD (US$ 240), Lian Li HydroShift II LCD-S 360N (US$ 160) y ASUS ROG
  Ryuo IV 360 ARGB (US$ 394). El DeepCool LT360 VISION se unió a los sancionados. **Los otros 18 son
  referencias de mercado europeo sin ninguna tienda americana** y siguen en naranja sin precio; cada uno
  lleva `precio_usd_revisado_us` con la fecha y dónde se buscó, para no repetir el trabajo. Lo hizo
  `scripts/precios_us_sin_precio_2026-09-15.py`.
- **Sustitución por el equivalente americano (15-09-2026, 3.ª ronda, `scripts/equivalentes_us_2026-09-15.py`):**
  la ASUS ROG Thor 1200W Platinum III y la Cooler Master Elite Gold 1000 eran **el mismo producto con
  referencia europea**: se les puso la americana (90YE00V2-BPAA00 y MPX-A005-AFAG-BUS) y su precio
  (US$ 577 y US$ 137). La **Cooler Master Elite Gold 750 pasó a ser la Elite Gold 850** (US$ 100,
  MPX-8505-AFAG-BUS): en EE.UU. esa serie empieza en 850 W. Conserva la foto de la serie Elite (mismo
  diseño, lo permite el estándar de fotos) y la ficha anterior queda en `sustituye_a`. La foto que
  sobraba se movió a JORGE con SHA-256.
- **Duplicados retirados de la web (15-09-2026, 4.ª ronda, `scripts/retirar_duplicados_y_paises_2026-09-15.py`):**
  8 productos sin precio americano que repetían un modelo ya presente con precio de EE.UU. (2 Palit,
  Zotac RTX 3050, Sparkle ROC Luna, Kingston FURY Beast CL36, 2 XPG Lancer y la XPG Core Reactor II
  650W, descatalogada en todas partes). **No se borran:** llevan `fuera_de_web` con el motivo y el
  exportador los salta solo (lee ese campo, no hay lista que mantener). Sus 8 fotos, más la de la
  Elite Gold 750, están en JORGE `pruebas-y-superados/WEB-imagenes-retiradas_2026-09-15/`.
- **Los que no se venden en EE.UU. se quedan, con su país** (decisión del usuario): la tarjeta naranja
  dice "No disponible en EE.UU.", en qué país sí se venden y a qué precio de tienda, y una tercera
  línea, "Importarlo corre por tu cuenta: envío, aduana e impuestos, y sin garantía en EE.UU."
  (`avisoImportacion`). Se les buscó precio alemán por MPN en geizhals.de: Biostar B650M-SILVER
  €109, Seasonic CORE BC 650 €44,59, CORE GC 750 €58,90, be quiet! System Power 11 550W €52,87,
  FSP VITA GD 650W €63,89 y FSP MEGA GM 1200W €165,98.
- **Alta de 4 fuentes americanas (15-09-2026, 5.ª ronda, `scripts/altas_fuentes_us_2026-09-15.py`):**
  al lado de cada europea entra el modelo que sí se vende en EE.UU. — Seasonic **CORE GX-650**
  (SRP-CGX651-A5A32SF, US$ 114) y **CORE GX-750** (SRP-CGX751-A5A32SF, US$ 125), **XPG Core Reactor
  II VE 650W** (COREREACTORIIVE650G-BKCUS, US$ 93) y **FSP Hydro G Pro 1200W** (PPA12A1407, US$ 125).
  Fotos: galería oficial de Seasonic (1462×1080, fondo transparente que el exportador aplana sobre
  blanco; la GX-650 y la GX-750 comparten cuerpo y foto) y foto de producto del fabricante alojada en
  Newegg (1280 px) para XPG y FSP; la de xpg.com se descartó por ser un montaje con fondo de fantasía.
  Specs de alternate/geizhals, Icecat y la tabla de Newegg — lo que no se pudo verificar no se
  escribió. Originales en JORGE `FUENTES-PODER_fabricante_2026-09-15/`. **Icecat no sirvió:**
  Seasonic es marca *Full Icecat* (de pago, sin imagen para nosotros) y XPG sirve la foto incrustada
  a 500×500. **No vale un precio de marketplace que envía desde fuera
  de EE.UU.** (la ASUS TUF 650W Bronze sólo aparece a US$ 201 desde Hong Kong).
- **ASUS TUF Gaming 650W Bronze EVO (15-09-2026, 6.ª ronda, `scripts/precio_asus_tuf_650b_espana_2026-09-15.py`):**
  era el último producto de la web sin ningún precio. Lo resolvió el usuario con la ficha oficial de
  ASUS: el apartado "Disponible en" lista sólo tiendas **españolas** (ASUS Store, BEEP, PCBOX, APP,
  COOLMOD, NEOBYTE, PC Componentes) y Amazon como no disponible — **no es un producto alemán**. Precio
  €74,90 con IVA (21 % en España; en oferta a €64,90 ese día, que no se muestra porque caduca) →
  US$ 72 sin IVA en el total. `PAIS` del exportador aprende un país nuevo: `asus.com/es` → España.
  La ficha oficial además **desmintió dos datos de Icecat/alternate**: la fuente **no es modular**
  (los contenidos del paquete son cables fijos) y sus conectores eran los de una fuente mayor;
  también se corrigió la certificación (80 PLUS Bronze, no Cybenetics Silver), el peso (1,252 kg),
  el +12V (54,16 A) y se borró un `Ventilador: 1x null mm` que era basura de importación. Las
  corrientes de +3,3 V y +5 V se dejaron como estaban: ahí la tabla de ASUS se contradice
  (12 A de carga máxima con 80 W combinados es imposible en 3,3 V). **Ya no queda ningún producto
  sin precio en la web.**
- **Europeos/asiáticos:** en el configurador sí, con aviso **naranja** ("No disponible en EE.UU.", "No se
  vende en EE.UU." o "Sin precio verificado en EE.UU.") y el país y precio de tienda (Alemania 42,
  Reino Unido 3, España 1; en el total, sin IVA × 1,1592 EUR / 1,3508 GBP). Los 46 de la web tienen
  precio. **En presupuestos, nunca.**
- **Huérfanos:** 5 kits DDR4 y 2 Ryzen 5 AM4 no tienen placa compatible en todo el catálogo: fuera de la web
  (`HUERFANOS_MPN` en `exportar_web.py`), sin borrarlos del catálogo.
- **Sin stock:** 13 precios en US$ son de tienda agotada (`precio_usd_sin_stock`): se enseñan con el aviso
  "Sin stock EE.UU. · precio de lista" y nunca van en una build.
- **Gama por modelo, nunca por precio** (los precios de 2026, con escasez de memoria, rompían los rangos).
- **Compatibilidad antes que integración**, y builds variadas por nivel (no una sola fija).
- **Fotos:** una por producto (13-09); ver "Estándar de fotos".

## Estándar de fotos

- La web sólo usa la **foto principal** de cada producto. El resto de la galería (1.830 fotos, 1,36 GB) está
  en JORGE `FOTOS-CATALOGO-no-usadas-en-web_2026-09-13/`, con `MANIFIESTO.json`; en el catálogo, cada
  producto la lista en `imagenes_archivadas_jorge` para poder devolverla. No buscar más fotos de galería
  salvo que el usuario lo pida.
- Valen fotos del producto de **≥ 900 px**, **fotos de caja** y del producto montado. Fuera: < 900 px, sellos
  o logos flotando encima (80 PLUS, GeForce RTX, Red Dot…), QR, personas, accesorios, diagramas, banners y
  fotos de otro producto. Revisión a ojo en hoja de contactos, no basta medir píxeles.
- Un producto sin foto válida **no se retira**: lleva la imagen genérica de su categoría
  (`imagenes/_generica/`, `imagen_generica: true`).
- Fotos compartidas entre hermanos del mismo diseño (misma GPU en 8/16 GB, SSD de otra capacidad…) son
  intencionadas, y desde el 15-09-2026 **son un solo archivo**: en `catalogo/imagenes` los hermanos
  apuntan (`imagen_principal`) al archivo del primero del catálogo, y `exportar_web.py` escribe una
  copia por foto (hash SHA-256) y hace que los demás productos apunten a ella. Resultado: 263
  productos con 233 fotos en `public/images/catalogo/` (17 grupos compartidos), sin archivos
  repetidos. Las 57 copias sobrantes (30 de public/, 27 de `catalogo/imagenes`) más las 30 de
  `export/images` y 5 SVG de la plantilla de Next.js están en JORGE
  `pruebas-y-superados/IMAGENES-repetidas-y-sin-uso_2026-09-15/` (con MANIFIESTO y LEEME).
  Si el exportador avisa de "imágenes de exportaciones anteriores en export/images", no copiarlas.

## Mapa de carpetas

```
catalogo-investigacion/
├── ESTADO-DEL-PROYECTO.md      este archivo
├── catalogo/                   README.md (guía de campos) · catalogo-final.json · compatibilidad.json ·
│                               catalogo-final.BACKUP-*.json (sólo los 3 últimos) · export/ (salida del
│                               exportador) · fuentes/ (Icecat procesado) ·
│                               imagenes/<categoria>/<gama>/high/ (sólo la principal) + imagenes/_generica/
├── setup/                      setup-perifericos.json (periféricos de /setup-completo) · README.md
├── documentacion/              HISTORIA-DEL-PROYECTO-hasta-2026-09-13.md · METODO · PATRONES-CDN ·
│                               COMO-SUBIR-A-ICECAT · informes antiguos de precios (históricos)
├── scripts/                    compatibilidad.py · exportar_web.py (los únicos en uso) ·
│                               historico/ (desde el 15-09: todos los scripts de rondas ya ejecutados,
│                               incl. precios/ y estandar-fotos/; las rutas `scripts/x.py` citadas
│                               arriba están ahora en `scripts/historico/x.py`)
└── investigacion/              research original por categoría
```

```
USB JORGE / catalogo-investigacion-ARCHIVO/      (LEEME.txt describe cada carpeta)
├── ZIPS-ICECAT-originales/        incluye el …_RESPALDO-ORIGINAL.zip (1,04 GB): única copia, NO BORRAR
├── DATOS-ICECAT-originales/ · DATOS-FABRICANTE-originales/ · <CATEGORIA>_fabricante_<fecha>/ · PRECIOS_*.json
├── FOTOS-CATALOGO-no-usadas-en-web_2026-09-13/   galerías archivadas + MANIFIESTO.json
└── pruebas-y-superados/           lo retirado (con MANIFIESTO.json), BACKUPS-catalogo-antiguos_2026-09-13/
                                   (ahí van también los que salen de catalogo/; los del 15-09 con
                                   MANIFIESTO-movidos-2026-09-15.json),
                                   BACKUP-web-antes-*_2026-09-13/ (la web antes de cada cambio del 13-09),
                                   BACKUP-web-despues-reglas-montaje_2026-09-15/ y
                                   BACKUP-web-despues-avisos-y-precios_2026-09-15/ (la web antes de
                                   unificar fotos), IMAGENES-repetidas-y-sin-uso_2026-09-15/,
                                   BACKUP-web-antes-guias-bilingue_2026-09-17/, RESTOS-sin-uso_2026-09-17/
                                   (las page.tsx antiguas de Guías),
                                   RESTOS-sin-uso_2026-09-15/ (prompts iniciales, config y README de
                                   plantilla, gato-naranja.jpg, etapa de soles, mediciones de fotos),
                                   con LEEME de qué cambió y MANIFIESTO con SHA-256,
                                   WEB-public-no-usados_2026-09-13/ (4 imágenes + Prueba 4.mp4)
```

## Qué NO hacer

- **No editar a mano `src/data/components.json` ni `public/images/catalogo/`** (ni `src/data/setupProducts.json`
  / `public/images/setup/`): se regeneran con los scripts.
- **No editar un archivo de `src/` sin releerlo antes** (hay otro editor trabajando a la vez).
- **No dejar backups de la web dentro del repo**: van a JORGE.
- **No borrar nada**: lo retirado se **mueve** a JORGE con manifiesto y verificación por SHA-256.
- **No identificar el USB por la letra**: siempre por la etiqueta `JORGE`
  (`Get-Volume | Where-Object FileSystemLabel -eq 'JORGE'`); si no está conectado, avisar y no guardar en
  otro sitio.
- **No afirmar que algo está duplicado sin verificarlo por hash.**
- **No resolver captchas ni desafíos anti-bot** (Zotac, TechPowerUp, ASRock, Micro Center, Mercado Libre):
  que el usuario abra la página en su Chrome.
- **No meter europeos/asiáticos, productos sin stock ni discos mecánicos en los presupuestos.**
- **No buscar en Icecat por nombre de modelo**: siempre por MPN (y emparejar no es poder usar: varias marcas
  son de pago).
- Si el usuario dice "no hagas nada aún", sólo leer y responder.

## Siguiente paso

No queda nada pendiente de lo que pidió el usuario. Lo abierto, por si se retoma:

1. **Método para buscar precio americano** (queda escrito porque se repetirá): por MPN en
   pcpartpicker.com y, si no lo lista, en Newegg, Amazon o B&H, comprobando el MPN en la ficha de la
   tienda. No vale una oferta de marketplace que envía desde fuera de EE.UU. Para fotos: galería
   oficial del fabricante (hace falta un navegador real, cargan por JavaScript) o la foto de producto
   alojada en Newegg; alternate.de se queda en 600 px y el buscador de Icecat devuelve 429 si se le
   piden varias seguidas (y Seasonic es marca *Full Icecat*, de pago). **Tres sitios cortan con
   anti-bot**: PCPartPicker ("We need to know that you are human"), geizhals.de e Icecat — espaciar
   las consultas o pedírselo al usuario. **Atajo que funcionó (15-09):** la ficha oficial del
   fabricante tiene un apartado "Disponible en" con las tiendas reales de cada país; si un
   anti-bot corta, el usuario puede pasar esa lista y el precio.
2. ~~Precio del ASUS TUF Gaming 650W Bronze EVO~~ — resuelto el 15-09 (España, €74,90).
3. **9 GPUs sin largo en su ficha** (ver arriba). Las webs de Zotac y TechPowerUp piden captcha: necesita al
   usuario.
4. **Cuando vuelva el stock de RTX 5090:** añadir `{"chip": "RTX 5090"}` a los perfiles de Extrema en
   `compatibilidad.py`.
5. **Palit RTX 5070 Infinity 3:** el único `en_peru_pendiente_confirmar` que queda; con el mercado en
   EE.UU. lo que hace falta es precio americano, y Palit no tiene canal allí (probablemente se quede en
   naranja para siempre).
6. **Media subió de US$ 1.947 a US$ 2.089** al repreciar la Z890 (ver "Presupuestos"): la build Intel con
   Radeon dejó de pasar por la vía "abaratada" y se armó con piezas de gama. Si el usuario quiere una
   Media más barata, ahí está la palanca.
7. **Opcional:** 16 `resumen` en inglés (TeamGroup, AMD…); los avisos `any` de ESLint del configurador; la
   calculadora de la portada (`BuildCalculatorModal`) no la abre ningún botón; Entrada empieza en US$ 1.351
   (el usuario decidió el 13-09 no abaratarla; eran 1.333 hasta que el aviso de EPS del 15-09 cambió la fuente).
8. ~~Traducir Guías~~ — hecho el 17-09-2026 (ver "Inglés y español"). Queda en español sólo
   `BuildCalculatorModal` y `MesaInteractiva.tsx`, que no usa ninguna página. Respaldo previo: JORGE
   `pruebas-y-superados/BACKUP-web-antes-guias-bilingue_2026-09-17`; las dos `page.tsx` antiguas de Guías,
   en `RESTOS-sin-uso_2026-09-17`.
9. **Estilo pecera (EN LA WEB desde el 16-09-2026; ver "Estilo pecera" más abajo).** Pendiente: 44 de las
   66 altas usan foto genérica (PCPartPicker < 900 px; B&H cortó con anti-bot al buscar varias seguidas), 17
   de ellas ya salen en builds; fuentes blancas (dudas de color de las Corsair RMe); 5 peceras blancas sin
   hermano en el catálogo (O11 Vision Compact, O11D Mini V2, Y60, Montech XR, Vector V100R); la guía
   educativa de circuito abierto (aprobada, sin hacer: va en Guías, que es del otro editor).
10. **Coordinarse con el otro editor de la web** antes de cambios grandes en `src/`. Hay archivos suyos
   que hoy no usa ninguna página y que el usuario decidió **dejar donde están** (15-09-2026):
   `public/images/Photoroom.png` y `Gato.jpeg` (nombrados en `mediaAssets.ts`, entradas sin uso),
   la carpeta `catalogo-investigacion/imagenes prueba1/` (23 imágenes) y, en `src/` (también decidido
   dejarlos), `data/PCGAMER.mp4` + `PCGAMER2.mp4` (11,8 MB, nadie los importa), `components/
   BuildCalculatorModal.tsx`, `SandTransitionImage.tsx`, `StaticBackgroundImage.tsx` y
   `data/hardwareModules.ts` (nadie los importa). No moverlos sin confirmarlo con él.
   (`gato-naranja.jpg` sí se retiró a JORGE `RESTOS-sin-uso_2026-09-15` el 15-09.)
9. **Setup completo (15-09, en la web):** `setup/setup-perifericos.json` tiene 62 periféricos reales con
   precio EE.UU. y una foto cada uno (método en `setup/README.md`). `scripts/exportar_setup.py` →
   `src/data/setupProducts.json` (generado, no editar a mano); fotos en `public/images/setup/` (900 px) y
   originales en `setup/imagenes/`; candidatas descartadas en JORGE `SETUP-fotos-candidatas_2026-09-15/`.
   La página muestra tarjetas por módulo y gama, "desde" por módulo y total del setup (mismo tipo = elegir
   una, cuenta la más barata): Entrada US$ 525 · Media 1.082 · Alta 2.668 · Extrema 5.698, con AvisoPrecios.
   Todas las gamas y módulos tienen 2 productos. Módulo 07 **Streaming (opcional)**, 14 productos más
   (cámara, micrófono, Stream Deck, luz, brazo de micro, capturadora; Elgato con precio de elgato.com): no
   entra en el total; la página muestra "Con el kit de streaming" aparte (+105 / +310 / +680 / +2.028).
   Total: 62 periféricos.
   Se corrigieron textos de `setupPeripherals.ts` que contradecían a los modelos (RTX 5080/5090 en
   Alta/Extrema, 75% en Entrada, sensor 3395, 4000 Hz, 32 ohmios…); con productos, la página ya no enseña
   el título ni las fichas genéricas de ese archivo. Respaldo previo: JORGE
   `BACKUP-web-antes-setup-completo_2026-09-15`. Los precios del setup entran en la misma revisión de ≤15
   días. Ojo: el brazo VIVO PT-SD-AM01K NO vale (se monta en un poste de VIVO, no en la mesa).
   **"Reset" deja la página sin nivel** (15-09, pedido del usuario; antes volvía a Media): ningún nivel
   marcado, cada módulo pide elegir uno con sus 4 botones, resumen y total en "—", "Configurar PC" va a
   `/configurador` (abre la PC guardada). Es estado local (`sinNivel`): el nivel del store lo usan otras páginas.
   **Miniatura de cada módulo:** uno de sus productos al azar (distinto en cada visita y nivel), con la
   vista previa a la izquierda y el doble toque del configurador.
10. **PC + setup juntos (15-09, pedido del usuario):** `src/lib/equipoCompleto.ts` guarda en localStorage
   (`armapc-equipo`) la última PC y el nivel del setup (`useEquipo`, zustand persist con `skipHydration`;
   se carga al montar con `useCargarEquipo`). El configurador guarda su build en cada cambio y, sin build
   en la URL, abre la guardada; presupuestos guarda la build al elegir nivel, opción o "Explorar Setup
   Completo" (y al abrirse si no hay ninguna), para no pisar la del configurador por sólo mirar.
   Setup completo muestra "Tu PC" y "PC + Setup desde", botón "Copiar Lista PC + Setup"; el configurador
   suma el setup si hay nivel elegido. "Imprimir / PDF" de las dos páginas imprime sólo
   `InformeEquipo.tsx` (PC + setup + total, blanco y negro; regla `@media print` en `globals.css`).
   Los precios del setup (`productosDe`, `precioModulo`, módulos, nombres de nivel) viven ahora en ese lib.
11. **Builds de streaming e IA local (15-09, pedido del usuario):** 1 de cada una por nivel, además de las
   3 de gaming (20 en total). Perfiles con `"uso"` en `compatibilidad.py`; `exportar_web.py` lo exporta
   (id `<nivel>-<uso>-<cpu+gpu>`; las de gaming conservan su id) y los campos legacy del nivel
   (`priceMin/Max`, `components`) salen sólo de las de gaming. Web: selector "Uso" (`USOS_BUILD` en
   `equipoCompleto.ts`) en Presupuestos (`?uso=streaming|ia`) y en los presets del configurador (el
   "Tip Gamer" del 30 % sólo sale en gaming). Reglas: streaming = más núcleos + NVIDIA (NVENC) + 32 GB;
   IA = 16 GB de VRAM (techo con stock: la 5090 está agotada), 32 GB de RAM en Entrada/Medio y 64 GB en
   Alto/Extremo (decisión del usuario), 2 TB desde Medio; la GPU ≥ 25 % del total (30 % en gaming);
   la variedad de placa/gabinete/disipador es entre builds del mismo uso. IA de Entrada con RX 9060 XT
   16G: la única NVIDIA de 16 GB con stock ahí costaba US$ 800. Precios: streaming 1.632 / 2.324 /
   2.923 / 3.933 · IA 1.611 / 2.631 / 3.567 / 4.736. La antigua "Creación e IA local" de Extrema pasó a
   ser la de IA; su hueco de gaming lo ocupa "X3D de 16 núcleos" (9950X3D, 32 GB, US$ 4.374). Las 11
   builds de gaming restantes no cambiaron. Las 9 builds nuevas o cambiadas salen "100% Garantizada"
   en el configurador. Respaldo previo: JORGE `BACKUP-web-components-antes-builds-streaming-ia_2026-09-15`.

## Mantenimiento de este archivo

Actualízalo tras cada hito (un lote descargado u organizado, una marca comprobada abierta o de pago, algo
trasladado a `public/` o `src/data/`) y **de inmediato si el usuario dice "actualiza el estado"**: es su
forma de asegurar el traspaso antes de quedarse sin tokens. Cambia la fecha, "Estado hoy" y "Siguiente
paso"; sobrescribe lo que cambie, sin acumular historia. Si vuelve a crecer mucho, mover el detalle a
`documentacion/` en vez de borrarlo.
