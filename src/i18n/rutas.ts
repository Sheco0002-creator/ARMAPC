// Dos idiomas sin duplicar páginas (15-09-2026). Cada sección es UNA vista (src/components/vistas/)
// que se monta en dos rutas: la inglesa sin prefijo (idioma principal, público de EE.UU.) y la
// española bajo /es con palabras en español. Esta tabla es la única fuente de las direcciones:
// la usan el menú, el selector EN/ES, los metadatos (hreflang) y src/proxy.ts.
// Guías (la portada) pasó a los dos idiomas el 17-09-2026: "/" en inglés y "/es" en español.

export type Lang = "en" | "es";
export const IDIOMAS: Lang[] = ["en", "es"];

export const RUTAS = {
  guias: { en: "/", es: "/es" },
  presupuestos: { en: "/budgets", es: "/es/presupuestos" },
  configurador: { en: "/configurator", es: "/es/configurador" },
  setup: { en: "/full-setup", es: "/es/setup-completo" },
  sobre: { en: "/about", es: "/es/sobre-nosotros" },
  contacto: { en: "/contact", es: "/es/contacto" },
  terminos: { en: "/terms", es: "/es/terminos" },
  privacidad: { en: "/privacy", es: "/es/privacidad" },
} as const;

export type ClaveRuta = keyof typeof RUTAS;

/** Textos a dos idiomas en el mismo sitio del código: tr("Copiar lista", "Copy list"). */
export function traductor(lang: Lang) {
  return (es: string, en: string) => (lang === "en" ? en : es);
}

export function ruta(lang: Lang, clave: ClaveRuta): string {
  return RUTAS[clave][lang];
}

/** Sección y idioma de una dirección traducida (null si no es de las traducidas). */
export function seccionDe(pathname: string): { clave: ClaveRuta; lang: Lang } | null {
  const limpio = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  for (const clave of Object.keys(RUTAS) as ClaveRuta[]) {
    for (const lang of IDIOMAS) if (RUTAS[clave][lang] === limpio) return { clave, lang };
  }
  return null;
}

/** Cookie con el idioma que el visitante eligió en el selector EN/ES (manda sobre el del navegador). */
export const COOKIE_IDIOMA = "lang";

/** Dominio público para las URL absolutas de los metadatos (hreflang/canonical). */
export const SITIO_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/** canonical + hreflang de una sección, para `metadata.alternates`. */
export function alternativas(clave: ClaveRuta, lang: Lang) {
  return {
    canonical: RUTAS[clave][lang],
    languages: { en: RUTAS[clave].en, es: RUTAS[clave].es, "x-default": RUTAS[clave].en },
  };
}
