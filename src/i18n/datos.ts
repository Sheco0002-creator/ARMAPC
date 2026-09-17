// Textos de los datos (components.json, setupProducts.json) en el idioma de la página. Los
// exportadores escriben la versión inglesa en el mismo objeto con sufijo En (specsEn, labelEn,
// enfoqueEn...) sólo cuando difiere del español; sin ella, se usa el español.
import type { Lang } from "./rutas";

export function txt(obj: object | null | undefined, campo: string, lang: Lang): string | undefined {
  if (!obj) return undefined;
  const o = obj as Record<string, unknown>;
  const v = lang === "en" ? (o[`${campo}En`] ?? o[campo]) : o[campo];
  return typeof v === "string" ? v : undefined;
}

// Botones de filtro del configurador: el filtro sigue buscando el texto español de las fichas
// (lo comprueba exportar_web.py); aquí sólo cambia lo que se lee en el botón.
const FILTROS_EN: Record<string, string> = { Todos: "All", Aire: "Air", "Líquida": "Liquid" };
export const nombreFiltro = (opcion: string, lang: Lang) => (lang === "en" ? (FILTROS_EN[opcion] ?? opcion) : opcion);

/** Precio en dólares con el formato de EE.UU. en los dos idiomas ($1,234). */
export const dolares = (n: number) => `$${n.toLocaleString("en-US")}`;
