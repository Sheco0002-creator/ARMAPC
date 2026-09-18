import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_IDIOMA, RUTAS, seccionDe, type ClaveRuta, type Lang } from "@/i18n/rutas";

// Idioma de las secciones traducidas (15-09-2026):
//  1. Las direcciones antiguas en español sin prefijo (/configurador...) pasan a /es/...
//     (enlaces ya compartidos). /guias, la antigua segunda dirección de Guías, pasa a /es.
//  2. Quien eligió idioma en el selector EN/ES (cookie) va siempre a ese idioma.
//  3. Sin cookie, la versión inglesa (la principal) manda a la española si el navegador prefiere
//     español. Una dirección /es/... pedida a propósito no se toca.
// Se conserva la consulta (?b=...&uso=...) para no perder la build compartida.

const ANTIGUAS: Record<string, ClaveRuta> = {
  "/guias": "guias",
  "/presupuestos": "presupuestos",
  "/configurador": "configurador",
  "/setup-completo": "setup",
  "/sobre-nosotros": "sobre",
  "/contacto": "contacto",
  "/terminos": "terminos",
  "/privacidad": "privacidad",
};

function prefiereEspanol(acceptLanguage: string | null): boolean {
  if (!acceptLanguage) return false;
  const idiomas = acceptLanguage
    .split(",")
    .map((parte) => {
      const [etiqueta, ...params] = parte.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { base: etiqueta.trim().toLowerCase().split("-")[0], q: q ? Number(q.trim().slice(2)) || 0 : 1 };
    })
    .filter((x) => x.base === "en" || x.base === "es")
    .sort((a, b) => b.q - a.q);
  return idiomas[0]?.base === "es";
}

function redirigir(request: NextRequest, destino: string) {
  const url = request.nextUrl.clone();
  url.pathname = destino;
  return NextResponse.redirect(url);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let limpio = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  // Si viene con .html (URL antigua de Google), limpiarlo
  if (limpio.endsWith(".html")) {
    limpio = limpio.slice(0, -5);
    const antigua = ANTIGUAS[limpio];
    if (antigua) return redirigir(request, RUTAS[antigua].es);
  }

  const antigua = ANTIGUAS[limpio];
  if (antigua) return redirigir(request, RUTAS[antigua].es);

  const seccion = seccionDe(limpio);
  if (!seccion) return NextResponse.next();

  const cookie = request.cookies.get(COOKIE_IDIOMA)?.value;
  const elegido: Lang | null = cookie === "en" || cookie === "es" ? cookie : null;
  if (elegido && elegido !== seccion.lang) return redirigir(request, RUTAS[seccion.clave][elegido]);
  if (!elegido && seccion.lang === "en" && prefiereEspanol(request.headers.get("accept-language")))
    return redirigir(request, RUTAS[seccion.clave].es);

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/guias",
    "/presupuestos",
    "/configurador",
    "/setup-completo",
    "/sobre-nosotros",
    "/contacto",
    "/terminos",
    "/privacidad",
    "/budgets",
    "/configurator",
    "/full-setup",
    "/about",
    "/contact",
    "/terms",
    "/privacy",
    "/es",
    "/es/:path*",
    "/:path*.html",
  ],
};
