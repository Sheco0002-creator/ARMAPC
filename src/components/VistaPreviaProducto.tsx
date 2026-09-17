"use client";

import React, { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useIdioma } from "@/i18n/Idioma";

// Foto grande de un producto al pasar el ratón (15-09-2026). Las miniaturas del configurador y de
// presupuestos miden 20–64 px y no dejan ver el producto. La foto flota en el margen libre de la
// página, sin tapar las tarjetas. Sólo con ratón: en pantallas táctiles no aparece.
// - Presupuestos: el margen más cercano al producto; en pantallas estrechas, junto a la tarjeta.
// - Configurador (soloIzquierda, pedido por el usuario): siempre a la izquierda y con el tamaño
//   grande; si el margen izquierdo es estrecho, pegada al borde de la ventana aunque pise el borde de
//   la lista (el usuario prefiere eso a que no salga). No sale por debajo de 1024 px.
//
// En móvil y tablet (sin ratón) no hay vista previa: un doble toque sobre la foto la abre en grande,
// a pantalla completa, con una X para cerrar (también se cierra tocando fuera o con Escape).
//
// Uso: <VistaPreviaFlotante /> una vez por página, {...vistaPrevia(src, nombre)} en el elemento del
// producto y {...ampliarAlTocar(src, nombre)} en su foto. El estado vive fuera de React para que cada
// paso del ratón no vuelva a renderizar la página entera (el configurador pinta decenas de tarjetas).

type Estado = { src: string; alt: string; ancla: HTMLElement; visible: boolean };

let estado: Estado | null = null;
const oyentes = new Set<() => void>();

function emitir(nuevo: Estado | null) {
  estado = nuevo;
  oyentes.forEach((f) => f());
}

function suscribir(f: () => void) {
  oyentes.add(f);
  return () => {
    oyentes.delete(f);
  };
}

const hayRaton = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export function vistaPrevia(src: string | undefined, alt: string) {
  return {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      if (src && hayRaton()) emitir({ src, alt, ancla: e.currentTarget, visible: true });
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      if (estado && estado.ancla === e.currentTarget) emitir({ ...estado, visible: false });
    },
  };
}

type Foto = { src: string; alt: string };

let ampliada: Foto | null = null;

function emitirAmpliada(nueva: Foto | null) {
  ampliada = nueva;
  oyentes.forEach((f) => f());
}

const DOBLE_TOQUE_MS = 350;
let ultimoToque: { el: EventTarget | null; t: number } = { el: null, t: 0 };

export function ampliarAlTocar(src: string | undefined, alt: string) {
  return {
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      if (!src || hayRaton()) return;
      const ahora = Date.now();
      if (ultimoToque.el === e.currentTarget && ahora - ultimoToque.t < DOBLE_TOQUE_MS) {
        // El segundo toque no llega a la tarjeta: si no, la cabecera del paso se abriría y se cerraría
        e.stopPropagation();
        ultimoToque = { el: null, t: 0 };
        emitirAmpliada({ src, alt });
      } else {
        ultimoToque = { el: e.currentTarget, t: ahora };
      }
    },
  };
}

function FotoAmpliada() {
  const { tr } = useIdioma();
  const foto = useSyncExternalStore(suscribir, () => ampliada, () => null);
  const cerrar = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!foto) return;
    const overflowAntes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cerrar.current?.focus();
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") emitirAmpliada(null);
    };
    window.addEventListener("keydown", tecla);
    return () => {
      document.body.style.overflow = overflowAntes;
      window.removeEventListener("keydown", tecla);
    };
  }, [foto]);

  if (!foto) return null;
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={foto.alt}
      onClick={() => emitirAmpliada(null)}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-xl border border-white/15 bg-[#0d0f12] p-3 shadow-2xl"
      >
        <button
          ref={cerrar}
          type="button"
          onClick={() => emitirAmpliada(null)}
          aria-label={tr("Cerrar", "Close")}
          className="absolute top-2 right-2 z-10 w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shadow-lg cursor-pointer"
        >
          <X size={22} />
        </button>
        <div className="rounded-lg bg-black/60 flex items-center justify-center overflow-hidden">
          <img src={foto.src} alt={foto.alt} className="w-full max-h-[70vh] object-contain" />
        </div>
        <div className="pt-3 px-1 text-sm font-mono text-gray-200 leading-snug">{foto.alt}</div>
      </div>
    </div>,
    document.body
  );
}

const TAM_MAX = 360;
const TAM_MIN = 200;
const TAM_MIN_JUNTO = 160;
const TAM_AJUSTE_IZQ = 300;
const MARGEN = 16;
const MARGEN_IZQ = 12;
const ALTO_PIE = 40; // nombre bajo la foto

type Lado = { espacio: number; x: (tam: number) => number; distancia?: number };

function calcularPosicion(ancla: HTMLElement, soloIzquierda: boolean) {
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const a = ancla.getBoundingClientRect();
  const centro = a.left + a.width / 2;

  // Contenido de la página sin su relleno lateral: lo que queda fuera es margen libre
  const main = ancla.closest("main");
  let pagina = { left: 0, right: vw };
  if (main) {
    const r = main.getBoundingClientRect();
    const cs = getComputedStyle(main);
    pagina = { left: r.left + parseFloat(cs.paddingLeft), right: r.right - parseFloat(cs.paddingRight) };
  }
  let lado: Lado | undefined;
  if (soloIzquierda) {
    // si el margen casi alcanza, se ajusta a él para no pisar la lista; si no, tamaño completo
    const margen = pagina.left - 2 * MARGEN_IZQ;
    if (vw >= 1024) lado = { espacio: margen >= TAM_AJUSTE_IZQ ? margen : TAM_MAX, x: () => MARGEN_IZQ };
  } else {
    // 1) margen libre de la página, el más cercano al producto
    const margenes: Lado[] = [
      { espacio: pagina.left - 2 * MARGEN, x: (t: number) => pagina.left - MARGEN - t, distancia: centro - pagina.left },
      { espacio: vw - pagina.right - 2 * MARGEN, x: () => pagina.right + MARGEN, distancia: pagina.right - centro },
    ].filter((l) => l.espacio >= TAM_MIN);
    // 2) pegada al producto (pantallas estrechas con ratón)
    const junto: Lado[] = [
      { espacio: a.left - 2 * MARGEN, x: (t: number) => a.left - MARGEN - t },
      { espacio: vw - a.right - 2 * MARGEN, x: () => a.right + MARGEN },
    ].filter((l) => l.espacio >= TAM_MIN_JUNTO);
    lado = margenes.length
      ? margenes.sort((p, q) => (p.distancia ?? 0) - (q.distancia ?? 0))[0]
      : junto.sort((p, q) => q.espacio - p.espacio)[0];
  }
  if (!lado) return null;

  const tam = Math.min(TAM_MAX, lado.espacio, vh - ALTO_PIE - 2 * MARGEN);
  const alto = tam + ALTO_PIE;
  const y = Math.min(Math.max(a.top + a.height / 2 - alto / 2, MARGEN), vh - alto - MARGEN);
  return { x: lado.x(tam), y, tam };
}

export function VistaPreviaFlotante({ soloIzquierda = false }: { soloIzquierda?: boolean }) {
  const actual = useSyncExternalStore(suscribir, () => estado, () => null);
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = caja.current;
    if (!el || !actual) return;
    if (!actual.visible) {
      el.style.opacity = "0";
      return;
    }
    // Se recoloca en cada fotograma: sigue al producto al hacer scroll y se esconde si el ratón
    // ya no está encima (el producto desapareció, se cerró el paso o la página se desplazó)
    let id = 0;
    const colocar = () => {
      if (!actual.ancla.isConnected || !actual.ancla.matches(":hover")) {
        emitir({ ...actual, visible: false });
        return;
      }
      const p = calcularPosicion(actual.ancla, soloIzquierda);
      if (p) {
        el.style.width = `${p.tam}px`;
        el.style.transform = `translate(${p.x}px, ${p.y}px)`;
      }
      el.style.opacity = p ? "1" : "0";
      id = requestAnimationFrame(colocar);
    };
    colocar();
    return () => cancelAnimationFrame(id);
  }, [actual, soloIzquierda]);

  return (
    <>
      {actual &&
        createPortal(
          <div
            ref={caja}
            aria-hidden
            className="fixed left-0 top-0 z-[60] pointer-events-none opacity-0 transition-opacity duration-150 rounded-xl border border-white/15 bg-[#0d0f12]/95 backdrop-blur-md p-2.5 shadow-2xl shadow-black/60"
          >
            <div className="aspect-square w-full rounded-lg bg-black/60 flex items-center justify-center overflow-hidden">
              <img src={actual.src} alt="" className="w-full h-full object-contain" />
            </div>
            <div className="pt-2 px-0.5 text-[11px] font-mono text-gray-300 leading-snug line-clamp-2">{actual.alt}</div>
          </div>,
          document.body
        )}
      <FotoAmpliada />
    </>
  );
}
