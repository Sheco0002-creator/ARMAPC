"use client";

import { usePathname, useRouter } from "next/navigation";
import { COOKIE_IDIOMA, RUTAS, seccionDe, type Lang } from "@/i18n/rutas";

// EN / ES en la cabecera: lleva a la misma sección en el otro idioma (con la misma consulta, para
// no perder la build compartida) y recuerda la elección en una cookie de preferencia, que
// src/proxy.ts respeta por encima del idioma del navegador.
export function SelectorIdioma({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const seccion = seccionDe(pathname);
  if (!seccion) return null;

  const cambiar = (lang: Lang) => {
    document.cookie = `${COOKIE_IDIOMA}=${lang}; path=/; max-age=31536000; samesite=lax`;
    if (lang === seccion.lang) return;
    router.push(RUTAS[seccion.clave][lang] + window.location.search);
  };

  return (
    <div
      role="group"
      aria-label={seccion.lang === "en" ? "Language" : "Idioma"}
      className={`inline-flex items-center rounded border border-white/15 overflow-hidden text-[10px] font-mono tracking-widest ${className}`}
    >
      {(["en", "es"] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => cambiar(lang)}
          aria-pressed={seccion.lang === lang}
          lang={lang}
          title={lang === "en" ? "English" : "Español"}
          className={`px-2 py-1 uppercase transition-colors cursor-pointer ${
            seccion.lang === lang ? "bg-white text-black font-bold" : "text-gray-400 hover:text-white"
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
