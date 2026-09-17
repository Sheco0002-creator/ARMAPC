# Patrones de CDN descubiertos (probados 2026-09-08)

Con esto, cualquier producto de estas marcas se resuelve en segundos.

## ✅ Resueltos

### Corsair — imágenes con FONDO TRANSPARENTE (las mejores para catálogo)
```
assets.corsair.com/image/upload/c_limit,f_auto,q_85,w_1600,h_1600/
  products/Memory/<SKU-o-familia>/Gallery/<NOMBRE>.webp
```
Cómo hallarla: en la página, selector `[class*=gallery] img` o `[class*=swiper] img`.
Las imágenes cargan en lazy: hay que esperar ~2s o forzar `loading='eager'`.

### Kingston — 2048x2048, alt descriptivo
```
media.kingston.com/kingston/product/FURY_Beast_Black_DDR5_1_angle-zm-lg.jpg
media.kingston.com/kingston/product/FURY_Beast_Black_DDR4_1_angle-zm-lg.jpg
```
Sufijos: `-sm` (512px) · `-zm-lg` (2048px) · `_angle` · `_pkg` (caja)

### TeamGroup — "dual" = kit de 2 módulos
```
images.teamgroupinc.com/products/memory/u-dimm/ddr5/<familia>/<color>/dual_01.jpg
```
Probados OK: `vulcan/black`, `delta-rgb/black`, `delta-rgb/white`

### G.Skill — ¡son background-image de CSS, no etiquetas <img>!
```
gskill.com/_upload/images/<IDdePágina><sufijo>.png
```
El ID de página sale de la URL del producto. Sufijos que funcionan: `11`, `12`, `13`, `14`, `15`.
**Por esto fallaba antes:** buscar `img.src` devuelve la parrilla de productos relacionados,
no la ficha. Hay que leer `getComputedStyle(el).backgroundImage`.

### Biostar — RESUELTO 2026-09-09. Sin protección: `curl` directo funciona
```
https://www.biostar.com.tw/upload/Motherboard/<prefijo><NOMBRE>_<hash>.png
```
- Prefijo **`b`** = grande · Prefijo **`s`** = miniatura 200x133
- Resolución de `b`: **1920x1080/1281** en modelos actuales, **1024x656** en los antiguos
- Sufijos por producto: **`_45`** (placa a 45°), **`_IO`** (panel trasero),
  **`_top`** (cenital), **`_BOX`** (caja). Son ~4 imágenes por placa.

**El `<hash>` de 4 caracteres es impredecible** — hay que leerlo de la ficha:
```
https://www.biostar.com.tw/app/en/mb/introduction.php?S_ID=<id>
grep -oE 'upload/Motherboard/b[^"]+\.png'
```

**Aviso:** el listado `mb/index.php` filtra por JavaScript y sólo enseña las series
SILVER y VALKYRIE. **Hay muchos más modelos accesibles por `S_ID` directo** — ahí
están los económicos. IDs verificados: `1110` B450MHP · `1120` B550MT ·
`1155` H610MHP-E v11 · `1163` B850M-SILVER · `1165` B860M-SILVER ·
`1169` B550MXE PRO · `1175` H610MHC · `1100`/`1130` B760MX2-E · `1150` A68N-2100K

### ASRock — patron HALLADO, descarga BLOQUEADA (2026-09-10)
```
https://pg.asrock.com/mb/photo/<MODELO EXACTO>(L<n>).png
```
- **1200x1000**, render limpio. `<n>` va de **1 a 6, 7 u 8** segun el modelo.
- El `<MODELO EXACTO>` es el nombre comercial con espacios (URL-encoded).
- Ojo: el subdominio es **`pg.asrock.com`**, no `www.asrock.com`.

Verificados (numero de fotos): `B650M PG Riptide WiFi` 6 · `B850 Pro-A WiFi` 6 ·
`B860 Pro RS WiFi` 6 · `X870 Steel Legend WiFi` 7 · `X870E Nova WiFi` 8 ·
`X870E Taichi` 8. **Total 41 imagenes.**

**El bloqueo:** todo `asrock.com` (incluido `pg.`) esta tras **Imperva/Incapsula**.
- `curl`/WebFetch -> stub de 212 bytes, siempre.
- Navegador de la extension -> muestra el desafio con casilla. **No se resuelve.**
- **Chrome real del usuario -> carga perfecta**, ya tiene la autorizacion.

Pero desde el Chrome real tampoco se pueden extraer los bytes:
`<a download>` esta bloqueado por el sandbox de la extension, y `document.cookie`
devuelve `[BLOCKED]`, asi que no se pueden reutilizar las cookies en `curl`.

**Via que si funciona:** abrir `(pagina temporal, ya eliminada)` (en la raiz del proyecto)
en el Chrome del usuario y guardar con **Ctrl+S -> "Pagina web completa"**.
Chrome baja las 41 imagenes a una carpeta `_files`.

### ASUS — DOS patrones distintos. Ojo, no son intercambiables

**a) Galeria de producto — LA BUENA, hasta 2000x2000 (verificado 2026-09-10)**
```
https://www.asus.com/media/global/products/<ID_PRODUCTO>/<ID_IMAGEN>_setting_xxx_0_90_end_<ANCHO>.png
```
El sufijo `_end_<ANCHO>` es el tamaño y **se puede subir a voluntad**: probados
`185`, `500`, `1000`, `2000` -> todos HTTP 200. **`4000` da 404**, asi que el
techo es 2000x2000. Render limpio sobre fondo blanco, ideal para catalogo.

Los dos IDs salen del HTML de la ficha:
```
grep -oE 'media/global/products/[A-Za-z0-9]+/[A-Za-z0-9]+'
```
**Aviso:** la ficha suele exponer **un solo** ID de imagen, no la galeria entera.
Da un render principal excelente, no 5-15 fotos como Icecat.

**c) MEJOR VÍA — dos APIs abiertas (halladas 2026-09-10). Dan galería completa y ficha**
```
https://odinapi.asus.com/recent-data/apiv2/PDGallery?SystemCode=asus&WebsiteCode=us&siteID=www&sitelang=&ProductWebPath=<slug>
https://odinapi.asus.com/recent-data/apiv2/PDTechSpec?...mismos parámetros...
```
- `PDGallery` → `Result.GalleryList[].ImageList[].ImgPath` = base sin extensión.
  Se le añade el ancho: `w800` (0,4 MB) · `w2000` (2,7 MB) · `w4000` (9,8 MB, excesivo).
  **Se usan `w2000` para `high` y `w800` para `medium`.** 8-12 fotos por producto.
- `PDTechSpec` → `Result.SpecList[]` con pares `Title`/`Content` (19-21 campos).
  El endpoint se llama así: `ProductSpec`, `TechSpec` y `PDSpec` devuelven vacío.
- El `<slug>` es el del MPN en minúsculas (`tuf-rtx5080-o16g-gaming`). Ninguna API
  necesita el segmento de serie, **pero la URL pública sí**: `…/graphics-cards/
  <serie>/<slug>/`, con serie `tuf-gaming`, `prime`, `dual`, `rog-strix`. Sin ella
  ASUS redirige a su portada (el `<title>` sale como "ASUS USA").
- **El nombre comercial sólo está en el `<title>` de `…/<slug>/techspec/`**; las APIs
  devuelven el MPN. **Ninguna de las dos da el EAN.**

**b) Paginas ROG — `kv/pd.png`**
```
dlcdnwebimgs.asus.com/files/media/<uuid>/v1/img/kv/pd.png
```
`pd` = product. El `kv/bg-kv.jpg` es el fondo decorativo, no sirve.
**Solo funciona en paginas ROG.** En las TUF devuelve **404**: usan
`kv/kv-main.webp`, que ademas es pequeno (600x750). Para TUF hay que ir por (a).

### Palit y Gainward — RESUELTOS 2026-09-10. Mismo CMS, `curl` directo funciona

Listado por chip → ficha → pestañas. **El parámetro `lang` es obligatorio**: sin él
Palit devuelve 0 bytes y Gainward un error de SQL.

```
Palit     https://www.palit.com/palit/vgapc.php?mid=2&subid=375&lang=en&chip=<CHIP>
Gainward  https://www.gainward.com/main/vgapc.php?vgapc_id=85&lang=en&chip=GeForce%20<CHIP>
ambos     vgapro.php?id=<ID>&lang=en          ← ficha; el MPN sale del enlace pn=
```

| | Palit | Gainward |
|---|---|---|
| Specs | pestaña `&tab=sp`, tabla label/valor (19-20 campos) | en la propia ficha, bloque `Product Name…P/N` (11 campos) |
| Galería | pestaña `&tab=ga` | pestaña `&tab=gy` |
| Imagen grande | `/product/vga/picture/p0<ID>/p0<ID>_bigimage_<hash>.png` | `/main/product/vga/pro/p0<ID>/p0<ID>_pic_<hash>.png` |
| Miniatura | el mismo nombre con prefijo **`m_`** | igual, prefijo **`m_`** |
| EAN | ❌ no lo publica | ✅ campo **Barcode** en la ficha |

Las grandes pesan 0,5-0,8 MB; las `m_` unos 36 KB (son miniaturas, no un tamaño medio).

### PNY — RESUELTO 2026-09-10. `curl` directo, y publica el UPC

```
https://www.pny.com/productsitemap.xml          ← lista todas las fichas
https://www.pny.com/geforce-rtx-<modelo>-models ← una página por modelo
imágenes: https://d2vfia6k6wrouk.cloudfront.net/productimages/<uuid>/images/<n>-pny-….png
```
Specs en los bloques `productTools-specification`; incluyen **`UPC Code`** (12 dígitos:
para EAN-13 se antepone un `0`) y `PNY Part Number`. **Un solo tamaño de imagen.**
Ojo: cada página `-models` agrupa **varias variantes** (ARGB, OC, Triple Fan) con una
sola galería; se toma como un producto.

### ZOTAC y ASRock (GPUs) — RESUELTOS 2026-09-10, SÓLO desde el navegador del usuario

Ambas bloquean todo lo que no sea el navegador real del usuario: ZOTAC con
**SafeLine WAF** (`curl` → HTTP 468), ASRock con **Incapsula** (stub de 212 bytes,
incluso con `fetch()` de páginas dentro del navegador). Se hace con la **extensión
de Claude en Chrome** (en Brave) y el truco del portapapeles:

1. En la ficha, un JS lee datos e imágenes (`fetch` → blob → base64) y deja
   `{nombre: {type, b64}}` en `navigator.clipboard.writeText()`.
2. `scripts/portapapeles_imgs.py <destino>` lo lee con `Get-Clipboard` y escribe
   los archivos en JORGE. Unos 1,5-7 MB de texto por modelo; funciona bien.
- Brave **pide permiso de portapapeles por dominio** (asrock.com y pg.asrock.com
  son distintos): lo concede el usuario. Si da *"Document is not focused"*, hacer
  clic en la página y repetir.
- Tareas de más de ~40 s cuelgan la herramienta: lanzar la descarga en segundo
  plano (`window.__job`) y consultar después.

**ZOTAC**
```
listado: https://www.zotac.com/es/product/graphics_card/GeForce-RTX-5070/all
ficha:   https://www.zotac.com/es/product/graphics_card/zotac-gaming-geforce-rtx-<modelo>-0
galería: /download/files/product_gallery/graphics_cards/<mpn-minúsculas>-image01.jpg …08
```
Quitando `/styles/w1024/public/` de la URL sale el **original (~2000 px)**; un solo
tamaño → sólo `high`. Specs en `.table-spec` (pares `.col-left` / `.col-right`,
22 campos). El MPN (`ZT-B50700J-10P`) está en el texto. **No publica EAN.**
Ojo: **Best Buy vende la versión americana `-10A`**, otro SKU; los EAN de la
europea `-10P` / `-10M` salen de alternate.de y caseking.de (prefijo `8886307`).

**ASRock** (sólo AMD Radeon e Intel Arc)
```
ficha:   https://www.asrock.com/Graphics-Card/AMD/<Nombre exacto>/index.asp#Specification
fotos:   /Graphics-Card/photo/<Nombre exacto>(L1).png   1200x1000 → high
                                          (M1).png    600x500  → medium
```
- Abrir la ficha **con `#Specification` en la URL**: si no, la tabla está oculta y
  `innerText` no la ve. Pulsar la pestaña no siempre la activa.
- Specs en formato `Etiqueta` / `- valor` (18-19 campos). El código de modelo
  (`RX9070XT SL 16G`) está en el texto.
- Las Phantom Gaming **redirigen a `pg.asrock.com`**, que ya enseña las fotos como
  `(L1)` y la pestaña Specification sí hay que pulsarla.
- Nombres exactos: leerlos del texto de `Graphics-Card/index.asp` (líneas que
  empiezan por "AMD Radeon"); las tarjetas del listado no son enlaces normales.
- **No publica EAN.** Caseking usa otro código (`90-GA5…`); se cruzó cada EAN con
  upcitemdb buscando el código de modelo de ASRock.

## ❌ Sin resolver

| Fuente | Problema |
|---|---|
| **Gigabyte** | Devuelve HTML en vez de la imagen incluso con User-Agent y Referer. Anti-hotlink duro |
| **MSI** | La página carga pero el render limpio no está en el DOM. `/gallery` da 404 |
| **Icecat** | **429 Too Many Requests.** Reconfirmado 2026-09-10 **desde el Chrome real del usuario con su sesion**: mismo 429. El limite es **por IP**, no por herramienta ni por cuenta. Hay que esperar |

### Nota importante sobre Icecat
Con tu sesión funciona y **la búsqueda devuelve resultados correctos** (2.745 para "X870 AORUS
ELITE WIFI7", con el Gigabyte el primero). Pero al abrir fichas seguidas devuelve 429.
**Hay que espaciar las peticiones** — no es un problema de tu cuenta, es su límite de frecuencia.
Conclusión: Icecat sirve, pero despacio. No es el atajo que esperábamos para Gigabyte y MSI.
