# Cómo subir la lista a Icecat

**Archivo:** `REFERENCIA_101-productos-catalogo-completo_LISTA-MAESTRA.csv` · 101 productos · 14 KB · UTF-8 con BOM

## Pasos

1. Entra en Icecat **en inglés** (`icecat.biz/en/`) — recuerda que la versión
   `es-pe` tiene rota la validación de idioma.
   Usuario: `Everything2026` (no el correo).
2. Menú ☰ → **My feed coverage**, o directo a `icecat.biz/en/myPricelist`
3. Pestaña **Import/Export** → **Upload from PC** → **+ BROWSE**
4. Deja el selector en **Auto** (detecta el formato solo)
5. Sube el archivo

## Qué contiene

| Columna | Para qué |
|---|---|
| `Brand` | Lo que Icecat usa para emparejar. 20 marcas |
| `MPN` | Código de fabricante. Solo 6 lo tienen — ver limitación abajo |
| `EAN` | Vacío. **Es lo que queremos que Icecat nos devuelva** |
| `Model` | Modelo sin la marca delante |
| `Description` | Nombre completo, por si el emparejamiento automático falla |
| `Category` | Referencia nuestra |
| `SourceURL` | Página oficial del fabricante |

Reparto: CPU 22 · GPU 22 · Placas 20 · RAM 18 · Almacenamiento 4 ·
Fuentes 6 · Gabinetes 4 · Refrigeración 5

## Limitación conocida

Solo 6 de 101 llevan MPN, porque el catálogo original nunca los registró.
El emparejamiento irá sobre **marca + modelo**, que es menos preciso que
por MPN o EAN.

Es de esperar que algunos no emparejen a la primera, sobre todo donde el
nombre comercial no coincide con el del fabricante. Si Icecat deja corregir
los fallos a mano en su informe, esos se recuperan.

## Qué esperamos del informe

1. **Cuántos de los 101 tiene Icecat** — el número que llevamos toda la semana buscando
2. **Cuáles traen imagen** y a qué resolución
3. **El EAN de cada uno** — es la llave para enlazar después con Mercado Libre,
   Amazon y eBay en la función "dónde comprarlo"
4. **Cuáles son Open y cuáles piden Full Icecat**

Con eso sabremos el número real de huecos, en vez de estimarlo.
