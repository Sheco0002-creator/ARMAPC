"use client";

// Informe para "Imprimir / PDF" (15-09-2026): la PC y el setup completo en un mismo documento, con
// el total de los dos. Antes el PDF era la página tal cual y cada página sólo traía lo suyo. Sólo se
// ve al imprimir: globals.css oculta el resto de la página cuando existe .informe-equipo.
import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { TierType } from "@/store/useConfiguratorStore";
import { textoPreciosConFechas } from "@/components/AvisoPrecios";
import {
  SETUP_PRODUCTS,
  MODULOS_SETUP,
  nombreModulo,
  nombreNivelSetup,
  productosDe,
  precioModulo,
  tipoDe,
  totalSetup,
  piezasPc,
  totalPc,
  precioPiezaTexto,
  usd,
} from "@/lib/equipoCompleto";
import { useIdioma } from "@/i18n/Idioma";

// document sólo existe en el navegador: el portal se crea justo después de montar
const avisarAlMontar = (avisar: () => void) => {
  const id = setTimeout(avisar, 0);
  return () => clearTimeout(id);
};

export function InformeEquipo({
  componentes,
  origenPc,
  setupNivel,
  setupProductos,
  notasPc = [],
}: {
  componentes: Record<string, string> | null;
  origenPc: string;
  setupNivel: TierType | null;
  setupProductos?: string[];
  notasPc?: string[]; // p. ej. compatibilidad y consumo, que sólo conoce el configurador
}) {
  const { lang, tr } = useIdioma();
  const montado = useSyncExternalStore(avisarAlMontar, () => true, () => false);
  if (!montado) return null;

  const piezas = componentes ? piezasPc(componentes, lang) : [];
  const precioPc = componentes ? totalPc(componentes) : 0;
  const prodsElegidos = setupProductos && setupProductos.length > 0
    ? SETUP_PRODUCTS.filter((p) => setupProductos.includes(p.id))
    : null;
  const precioSetup = prodsElegidos
    ? prodsElegidos.reduce((s, p) => s + p.price, 0)
    : setupNivel
    ? totalSetup(setupNivel)
    : 0;
  const fecha = new Date().toLocaleDateString(lang === "en" ? "en-US" : "es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return createPortal(
    <div className="informe-equipo hidden print:block bg-white text-black p-8 font-sans text-[12px] leading-snug">
      <div className="flex justify-between items-baseline border-b-2 border-black pb-2 mb-4">
        <h1 className="text-xl font-bold">{tr("ArmaPC · Mi equipo completo", "ArmaPC · My complete rig")}</h1>
        <span>{fecha}</span>
      </div>

      <table className="w-full mb-5 border-collapse">
        <caption className="text-left font-bold text-sm mb-1">
          PC {origenPc ? `(${origenPc})` : ""}
        </caption>
        <tbody>
          {piezas.length === 0 ? (
            <tr>
              <td className="py-1">{tr("Aún sin armar.", "Not built yet.")}</td>
            </tr>
          ) : (
            piezas.map((p) => (
              <tr key={p.categoria} className="border-b border-gray-300">
                <td className="py-1 pr-3 w-40 text-gray-600">{p.categoria}</td>
                <td className="py-1 pr-3">{p.item.name}</td>
                <td className="py-1 text-right whitespace-nowrap">{precioPiezaTexto(p.item, lang)}</td>
              </tr>
            ))
          )}
          <tr>
            <td colSpan={2} className="pt-1.5 font-bold">
              {tr("Subtotal PC", "PC subtotal")}
            </td>
            <td className="pt-1.5 text-right font-bold">{usd(precioPc)}</td>
          </tr>
          {notasPc.map((n) => (
            <tr key={n}>
              <td colSpan={3} className="pt-0.5 text-[11px] text-gray-600">
                {n}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="w-full mb-5 border-collapse">
        <caption className="text-left font-bold text-sm mb-1">
          {tr("Setup completo", "Full setup")}{" "}
          {setupNivel
            ? `· ${nombreNivelSetup(setupNivel, lang)}`
            : prodsElegidos
            ? `· ${tr("Personalizado", "Custom")}`
            : ""}
        </caption>
        <tbody>
          {!setupNivel && !prodsElegidos ? (
            <tr>
              <td className="py-1">{tr("Sin selección de periféricos.", "No peripherals chosen.")}</td>
            </tr>
          ) : prodsElegidos ? (
            MODULOS_SETUP.map((m) => {
              const productos = prodsElegidos.filter((p) => p.module === m.id);
              if (productos.length === 0) return null;
              return (
                <tr key={m.id} className="border-b border-gray-300 align-top">
                  <td className="py-1 pr-3 w-40 text-gray-600">{nombreModulo(m, lang)}</td>
                  <td className="py-1 pr-3">
                    {productos.map((p) => (
                      <div key={p.id}>
                        {tipoDe(p, lang) ? `${tipoDe(p, lang)}: ` : ""}
                        {p.brand} {p.model} — {usd(p.price)}
                      </div>
                    ))}
                  </td>
                  <td className="py-1 text-right whitespace-nowrap">
                    {usd(productos.reduce((s, p) => s + p.price, 0))}
                  </td>
                </tr>
              );
            })
          ) : (
            MODULOS_SETUP.map((m) => {
              const productos = productosDe(m.id, setupNivel!);
              if (productos.length === 0) return null;
              return (
                <tr key={m.id} className="border-b border-gray-300 align-top">
                  <td className="py-1 pr-3 w-40 text-gray-600">{nombreModulo(m, lang)}</td>
                  <td className="py-1 pr-3">
                    {productos.map((p, i) => (
                      <div key={p.id}>
                        {i > 0 && (productos[i - 1].kind ?? "") === (p.kind ?? "") ? tr("o ", "or ") : ""}
                        {tipoDe(p, lang) ? `${tipoDe(p, lang)}: ` : ""}
                        {p.brand} {p.model} — {usd(p.price)}
                      </div>
                    ))}
                  </td>
                  <td className="py-1 text-right whitespace-nowrap">
                    {m.optional ? tr("no suma", "not added") : `${tr("desde", "from")} ${usd(precioModulo(productos))}`}
                  </td>
                </tr>
              );
            })
          )}
          <tr>
            <td colSpan={2} className="pt-1.5 font-bold">
              {prodsElegidos
                ? tr("Subtotal setup (periféricos elegidos)", "Setup subtotal (selected peripherals)")
                : tr("Subtotal setup (opción más barata de cada tipo)", "Setup subtotal (cheapest option of each type)")}
            </td>
            <td className="pt-1.5 text-right font-bold">{usd(precioSetup)}</td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-between items-baseline border-t-2 border-black pt-2 text-base font-bold">
        <span>{tr("Total PC + setup", "PC + setup total")}</span>
        <span>
          {tr("desde", "from")} {usd(precioPc + precioSetup)} USD
        </span>
      </div>
      <p className="mt-3 text-[10px] text-gray-600">
        {tr(
          `${textoPreciosConFechas(lang)}. No son el precio exacto: pueden variar según la tienda y el día. Donde hay varias opciones del mismo tipo, el total cuenta la más barata.`,
          `${textoPreciosConFechas(lang)}. They are not the exact price: they can change with the store and the day. Where there are several options of the same type, the total counts the cheapest one.`
        )}
      </p>
    </div>,
    document.body
  );
}
