import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Redirecciones permanentes (301) de URLs antiguas indexadas por Google
      {
        source: "/configurador.html",
        destination: "/es/configurador",
        permanent: true,
      },
      {
        source: "/configurador",
        destination: "/es/configurador",
        permanent: true,
      },
      {
        source: "/presupuestos.html",
        destination: "/es/presupuestos",
        permanent: true,
      },
      {
        source: "/presupuestos",
        destination: "/es/presupuestos",
        permanent: true,
      },
      {
        source: "/niveles/entrada",
        destination: "/es/presupuestos?nivel=entrada",
        permanent: true,
      },
      {
        source: "/niveles/media",
        destination: "/es/presupuestos?nivel=media",
        permanent: true,
      },
      {
        source: "/niveles/alta",
        destination: "/es/presupuestos?nivel=alta",
        permanent: true,
      },
      {
        source: "/niveles/extrema",
        destination: "/es/presupuestos?nivel=extrema",
        permanent: true,
      },
      {
        source: "/niveles/:path*",
        destination: "/es/presupuestos",
        permanent: true,
      },
      {
        source: "/setup.html",
        destination: "/es/setup-completo",
        permanent: true,
      },
      {
        source: "/setup",
        destination: "/es/setup-completo",
        permanent: true,
      },
      {
        source: "/setup-completo.html",
        destination: "/es/setup-completo",
        permanent: true,
      },
      {
        source: "/full-setup.html",
        destination: "/full-setup",
        permanent: true,
      },
      {
        source: "/privacidad.html",
        destination: "/es/privacidad",
        permanent: true,
      },
      {
        source: "/privacidad",
        destination: "/es/privacidad",
        permanent: true,
      },
      {
        source: "/terminos.html",
        destination: "/es/terminos",
        permanent: true,
      },
      {
        source: "/terminos",
        destination: "/es/terminos",
        permanent: true,
      },
      {
        source: "/contacto.html",
        destination: "/es/contacto",
        permanent: true,
      },
      {
        source: "/contacto",
        destination: "/es/contacto",
        permanent: true,
      },
      {
        source: "/sobre-nosotros.html",
        destination: "/es/sobre-nosotros",
        permanent: true,
      },
      {
        source: "/sobre-nosotros",
        destination: "/es/sobre-nosotros",
        permanent: true,
      },
      {
        source: "/about.html",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/guias.html",
        destination: "/es",
        permanent: true,
      },
      {
        source: "/guias",
        destination: "/es",
        permanent: true,
      },
      {
        source: "/index.html",
        destination: "/es",
        permanent: true,
      },
      {
        source: "/favicon.svg",
        destination: "/icon.svg",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
