"use client";

// Aviso de precios (15-09-2026, decisión del usuario). Los precios no se consultan en vivo: son
// referencias vistas en tiendas de EE.UU. y se revisan a mano. Mientras la revisión más antigua
// (preciosDesde, lo escribe exportar_web.py) tenga 15 días o menos, se dice "en los últimos 15 días";
// si pasan más días sin revisar, se enseña el rango de fechas real, para no afirmar algo falso.
import { useSyncExternalStore } from "react";
import componentsData from "@/data/components.json";
import { useIdioma } from "@/i18n/Idioma";
import type { Lang } from "@/i18n/rutas";

const DIAS = 15;
const MESES: Record<Lang, string[]> = {
  es: ["enero", "febrero", "marzo", "abril", "mayo", "junio",
       "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
  en: ["January", "February", "March", "April", "May", "June",
       "July", "August", "September", "October", "November", "December"],
};
const { preciosDesde, preciosHasta } = componentsData as { preciosDesde?: string; preciosHasta?: string };

// "2026-09-12" + "2026-09-15" -> "del 12 al 15 de septiembre de 2026" / "September 12-15, 2026"
function rangoFechas(desde: string, hasta: string, lang: Lang): string {
  const [y1, m1, d1] = desde.split("-").map(Number);
  const [y2, m2, d2] = hasta.split("-").map(Number);
  const mes = (m: number) => MESES[lang][m - 1];
  if (lang === "en") {
    if (desde === hasta) return `on ${mes(m1)} ${d1}, ${y1}`;
    if (y1 === y2 && m1 === m2) return `between ${mes(m1)} ${d1} and ${d2}, ${y1}`;
    if (y1 === y2) return `between ${mes(m1)} ${d1} and ${mes(m2)} ${d2}, ${y1}`;
    return `between ${mes(m1)} ${d1}, ${y1} and ${mes(m2)} ${d2}, ${y2}`;
  }
  if (desde === hasta) return `el ${d1} de ${mes(m1)} de ${y1}`;
  if (y1 === y2 && m1 === m2) return `del ${d1} al ${d2} de ${mes(m1)} de ${y1}`;
  if (y1 === y2) return `del ${d1} de ${mes(m1)} al ${d2} de ${mes(m2)} de ${y1}`;
  return `del ${d1} de ${mes(m1)} de ${y1} al ${d2} de ${mes(m2)} de ${y2}`;
}

// Texto fijo con las fechas (el que sale al copiar la build y antes de hidratar)
export function textoPreciosConFechas(lang: Lang = "es"): string {
  if (!preciosDesde || !preciosHasta)
    return lang === "en" ? "Reference prices from US stores" : "Precios de referencia de tiendas de EE.UU.";
  const rango = rangoFechas(preciosDesde, preciosHasta, lang);
  return lang === "en"
    ? `Reference prices seen at US stores ${rango}`
    : `Precios de referencia vistos en tiendas de EE.UU. ${rango}`;
}

export function avisoPreciosTexto(lang: Lang, reciente: boolean): string {
  const base = reciente
    ? lang === "en"
      ? `Reference prices seen at US stores in the last ${DIAS} days`
      : `Precios de referencia vistos en tiendas de EE.UU. en los últimos ${DIAS} días`
    : textoPreciosConFechas(lang);
  return lang === "en"
    ? `${base}. They are not the exact price: they can change with the store and the day.`
    : `${base}. No son el precio exacto: pueden variar según la tienda y el día.`;
}

function esReciente(): boolean {
  if (!preciosDesde) return false;
  return (Date.now() - Date.parse(`${preciosDesde}T00:00:00Z`)) / 86_400_000 <= DIAS;
}
// Al hidratar, React usa el texto del servidor y no vuelve a mirar la fecha por su cuenta: este
// "aviso" único, justo después de montar, hace que la compruebe y cambie el texto si toca.
const revisarAlMontar = (avisar: () => void) => {
  const id = setTimeout(avisar, 0);
  return () => clearTimeout(id);
};

export function AvisoPrecios({ className }: { className?: string }) {
  const { lang } = useIdioma();
  // En el servidor (página estática) no se sabe qué día la abrirán: sale el rango de fechas, y en
  // el navegador se cambia a "últimos 15 días" si sigue siendo verdad.
  const reciente = useSyncExternalStore(revisarAlMontar, esReciente, () => false);
  return <span className={className}>{avisoPreciosTexto(lang, reciente)}</span>;
}
