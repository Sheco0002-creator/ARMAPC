"use client";

import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { ruta as rutaDe, traductor, type ClaveRuta, type Lang } from "./rutas";

// Idioma de la página. Lo fija el layout de cada rama: app/(en)/layout.tsx y app/es/layout.tsx.
// Fuera de ellas (p. ej. la página 404) vale "es".
const IdiomaContext = createContext<Lang>("es");

export function IdiomaProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  // <html lang> lo escribe el layout raíz, común a todo el sitio, en "en" (idioma principal); las
  // páginas españolas lo corrigen al montarse.
  useEffect(() => {
    const antes = document.documentElement.lang;
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = antes;
    };
  }, [lang]);
  return <IdiomaContext.Provider value={lang}>{children}</IdiomaContext.Provider>;
}

export function useIdioma() {
  const lang = useContext(IdiomaContext);
  // estable mientras no cambie el idioma: así `tr` puede ir en las dependencias de un useMemo
  return useMemo(
    () => ({
      lang,
      en: lang === "en",
      tr: traductor(lang),
      ruta: (clave: ClaveRuta) => rutaDe(lang, clave),
    }),
    [lang]
  );
}
