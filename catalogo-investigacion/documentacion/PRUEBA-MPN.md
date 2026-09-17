# Prueba con MPN reales — 2026-09-09

## Hipótesis 1: los MPN arreglan el emparejamiento — CONFIRMADA

| | Nombres de modelo | **MPN reales** |
|---|---|---|
| Productos | 101 | 7 |
| Emparejados | 21.78% | **85.71%** |

Con el código de fabricante correcto, Icecat encuentra los productos.
El problema nunca fue su cobertura.

## Hipótesis 2: hay un segundo filtro, la autorización de marca — CONFIRMADA

| Marca | MPN | Resultado |
|---|---|---|
| **Kingston** | KF560C36BBEK2-32 | ✅ **UTILIZABLE** — EAN 0740617330755, imagen 2400x1500 |
| **Kingston** | KF560C36BBEK2-64 | ✅ **UTILIZABLE** — EAN 0740617331707, imagen 2400x1500 |
| AMD | 100-100000719WOF | ❌ *You are not allowed to access* |
| AMD | 100-100001084WOF | ❌ *You are not allowed to access* |
| Corsair | CMK32GX5M2B6000C30 | ❌ *You are not allowed to access* |
| Corsair | CMK32GX4M2E3200C16 | ❌ *You are not allowed to access* |

**Emparejar y poder usar son dos cosas distintas.** Icecat tiene los productos de
AMD y Corsair, los encuentra por MPN, pero su contenido es de nivel Full.

## Mapa de marcas según lo comprobado

| Estado | Marcas |
|---|---|
| ✅ **Abiertas (Open)** | ASUS · MSI · Gigabyte · **Kingston** |
| ❌ **Bloqueadas (Full)** | AMD · Corsair · ASRock · Thermalright · Noctua |
| ❓ Sin comprobar | Intel · NVIDIA · G.Skill · TeamGroup · Crucial · Samsung · Seasonic · be quiet! · Lian Li · Fractal · Arctic |

## Qué implica para el plan

Conseguir los 33 MPN restantes **solo sirve para las marcas abiertas**. Para AMD,
Corsair y las demás bloqueadas, el MPN perfecto seguirá devolviendo *not allowed*.

Antes de invertir en más códigos hay que:

1. **Probar "Add authorization"** en el perfil (*Authorized Reseller of*). Icecat
   permite declararte revendedor autorizado de marcas concretas, lo que podría
   desbloquear su contenido Full.
2. **Comprobar qué marcas son Open** antes de buscarles el MPN. Una prueba barata:
   un CSV con un producto por marca.

Ese segundo paso es el más rentable: con una sola pasada sabríamos exactamente
qué parte del catálogo es alcanzable, y solo entonces buscar los MPN que valen.
