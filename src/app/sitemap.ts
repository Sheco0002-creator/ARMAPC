import type { MetadataRoute } from "next";
import { RUTAS, ClaveRuta } from "@/i18n/rutas";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://tupcgamer.com";
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];
  const claves = Object.keys(RUTAS) as ClaveRuta[];

  for (const clave of claves) {
    const enPath = RUTAS[clave].en;
    const esPath = RUTAS[clave].es;

    const enUrl = enPath === "/" ? baseUrl : `${baseUrl}${enPath}`;
    const esUrl = `${baseUrl}${esPath}`;

    const isMain = clave === "guias" || clave === "configurador" || clave === "presupuestos" || clave === "setup";
    const priority = clave === "guias" ? 1.0 : isMain ? 0.9 : 0.6;
    const changeFrequency: "daily" | "weekly" | "monthly" = isMain ? "weekly" : "monthly";

    // Entrada en inglés (con enlace alterno al español)
    entries.push({
      url: enUrl,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          en: enUrl,
          es: esUrl,
        },
      },
    });

    // Entrada en español (con enlace alterno al inglés)
    entries.push({
      url: esUrl,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          en: enUrl,
          es: esUrl,
        },
      },
    });
  }

  return entries;
}
