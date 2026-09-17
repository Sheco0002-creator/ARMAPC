# Setup completo — investigación de periféricos

Datos para la página `/setup-completo` (hoy usa `src/data/setupPeripherals.ts`, escrito a mano y con
modelos genéricos). Empezado el 15-09-2026.

## Archivo

`setup-perifericos.json` → `productos[]`, uno por modelo real:

| campo | qué es |
|---|---|
| `modulo` | `monitor`, `keyboard`, `mouse`, `audio`, `ergonomics`, `accessories`, `streaming` (los 7 módulos de la página) |
| `gama` | `entrada`, `media`, `alta`, `extrema` (las mismas que los presupuestos) |
| `tipo` | en módulos mixtos: ratón/alfombrilla, auriculares/micrófono/DAC, silla/escritorio, brazo/lámpara/hub |
| `mpn` | referencia del fabricante; `null` si falta confirmarla |
| `precio_usd`, `tienda`, `url`, `fecha` | precio visto en esa tienda de EE.UU. ese día (referencia, igual que el catálogo) |
| `stock` | "disponible" o lo que decía la tienda |
| `specs` | 2–5 datos que se enseñan en la ficha |
| `nota` | aclaración para el texto de la web |

## Método

- Precio: ficha de producto de **Newegg** (vendida por Newegg o por un vendedor de EE.UU.; se descartan
  los que envían desde Hong Kong/China o con precio inflado) o la **tienda oficial** de la marca.
- Las tiendas oficiales Shopify dan precio, SKU y stock en JSON: `<url-del-producto>.js`, y buscan con
  `/search/suggest.json?q=…&resources[type]=product`. Funciona en keychron.com, pulsar.gg, hyperx.com,
  apos.audio, sihoooffice.com, branchfurniture.com, huanuo.com, quntis.com, us.ugreen.com y
  us.sennheiser-hearing.com. No funciona en flexispot.com (precio por JavaScript), benq.com, ergotron.com,
  elgato.com ni caldigit.com (anti-bot).
- Bloquean la lectura: listados de búsqueda de Newegg (403), Sweetwater, Micro Center.

## A la web

`python ../scripts/exportar_setup.py` → `src/data/setupProducts.json`, que lee `/setup-completo`.
Fotos: una por producto (campo `imagen`), original en `imagenes/`, versión web de 900 px en
`public/images/setup/`; `imagen_fuente` dice de dónde salió. Se eligieron a ojo en hojas de contactos
(sin sellos ni textos; los Keychron van recortados para quitar los iconos de su foto oficial).
La Branch Ergonomic Chair se enseña en gris (la foto negra oficial es de 800 px); el precio es el del negro.

Módulo `streaming` (07): opcional, no suma al total del setup (`optional: true` en la página). Precios de
Elgato en elgato.com (WebFetch funciona; la galería va por JavaScript, así que las fotos salen de las
imágenes "In The Box" de images.ctfassets.net / elgato-assets.imgix.net, o de la imagen Open Graph
recortada sin el logo). Falta el MPN de las dos Key Light (no aparece en su página).

Módulo `coolant` (08, 17-09-2026): líquidos para refrigeración de circuito abierto en pecera, opcional
(no suma al total). Precios en primochill.com y performance-pcs.com (Florida), las dos Shopify
(`<url>.js` y `/search/suggest.json` funcionan). Entrada: agua Mayhems Ultra Pure + aditivo PrimoChill
Liquid Utopia (se suman); media: dos premezclas transparentes (alternativas); alta: concentrado pastel
PrimoChill True Opaque blanco + agua; extrema: PrimoChill Vue (brillo, 24 colores, la referencia cambia con el
color) + kit de limpieza Mayhems Blitz System. El Thermaltake P1000 Pastel se descartó: foto de 720 px y
thermaltake.com/Newegg con anti-bot. Candidatas de foto en JORGE `SETUP-fotos-candidatas_2026-09-15/liquidos_2026-09-17`.
Performance-PCs tiene algunos Mayhems a US$ 4,99 que parecen liquidación: no se usaron.

Los MPN de Razer se leen en la ficha de Newegg (`RZ0x-xxxxxxxx-R3U1` = versión EE.UU.).
vivo-us.com también es Shopify.
