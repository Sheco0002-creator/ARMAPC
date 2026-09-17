<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Proyecto ArmaPC — lee esto antes de tocar nada

**Antes de cualquier trabajo sobre el catálogo de componentes, lee
`catalogo-investigacion/ESTADO-DEL-PROYECTO.md`.** Contiene el estado actual,
el flujo acordado con el usuario, los bloqueos conocidos y el siguiente paso.
No improvises sobre el catálogo sin haberlo leído.

## Reglas que no se negocian

1. **Flujo de datos (actualizado 13-09-2026; la versión anterior de esta regla,
   `Original Catalogo/` → `catalogo-verificado/`, describía una tubería que ya no existe).**
   La fuente de verdad es `catalogo-investigacion/catalogo/catalogo-final.json` (274 productos,
   fichas + fotos + precio + disponibilidad + compatibilidad, todo verificado). Los originales sin
   procesar viven en el USB **JORGE**, no en el repo. Para la web: un script de exportación
   (`catalogo-investigacion/scripts/exportar_web.py`) lee `catalogo-final.json` +
   `compatibilidad.json`, escribe primero a `catalogo-investigacion/catalogo/export/` para revisar,
   y **sólo al final** se copia a mano a `public/images/catalogo/` y `src/data/components.json`.
   No saltarse pasos, y backup del `components.json` anterior antes de sobrescribir.

2. Los ZIP y descargas originales de Icecat/fabricantes están en el USB **JORGE**
   (`catalogo-investigacion-ARCHIVO/`), no en este repo. No se borran.

3. **Icecat: buscar siempre por MPN**, nunca por nombre de modelo. Y emparejar
   no es poder usar — varias marcas son de pago. Detalle en el estado.

4. **Verificar por hash** antes de afirmar que algo está duplicado.

5. **Avisar antes de acciones destructivas** y esperar confirmación.

6. **Un backup de código o de datos de la web (`.tsx`, `.json`) nunca se deja dentro de este
   repo**, ni siquiera en `catalogo-investigacion/`: `tsc`/Next.js escanean todo el árbol y un
   `.tsx` de respaldo con un esquema antiguo rompe el build con errores falsos. Los backups de la
   web van al USB JORGE (`pruebas-y-superados/BACKUP-web-...`); los backups del catálogo
   (`catalogo-final.BACKUP-*.json`) sí pueden vivir en `catalogo-investigacion/catalogo/` porque
   no son código ni los toca `tsc`.

## Actualiza el estado

Actualiza `ESTADO-DEL-PROYECTO.md` tras completar cualquiera de estos hitos:
un lote descargado, un lote organizado, una marca comprobada como abierta o de
pago, o algo trasladado a `public/` o `src/data/`.

Hazlo también de inmediato **si el usuario dice "actualiza el estado"** — es su
forma de asegurar el traspaso antes de quedarse sin tokens.

Ese archivo es una foto del presente: **sobrescribe** las filas que cambian, no
dupliques un mismo hito en dos sitios. Se compactó el 13-09-2026 (de 95 KB a
~15 KB): el detalle histórico está en
`catalogo-investigacion/documentacion/HISTORIA-DEL-PROYECTO-hasta-2026-09-13.md`.
Si vuelve a crecer mucho, mover el detalle a `documentacion/`, nunca borrarlo.
