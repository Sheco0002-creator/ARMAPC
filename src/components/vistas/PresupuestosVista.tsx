"use client";

import React, { useState, useEffect, Suspense } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AvisoPrecios } from "@/components/AvisoPrecios";
import { VistaPreviaFlotante, vistaPrevia, ampliarAlTocar } from "@/components/VistaPreviaProducto";
import {
  useEquipo,
  useCargarEquipo,
  usosBuild,
  usoDe,
  esUso,
  type UsoBuild,
  estilosBuild,
  estiloDe,
  esEstilo,
  type EstiloBuild,
} from "@/lib/equipoCompleto";
import { useIdioma } from "@/i18n/Idioma";
import { txt } from "@/i18n/datos";
import { capituloEnIdioma } from "@/data/setupPeripherals.en";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Layers,
  Cpu,
  Zap,
  HardDrive,
  Gauge,
  CheckCircle2,
  SlidersHorizontal,
  ArrowRight,
  Sparkles,
  Monitor,
  ExternalLink,
  Search,
} from "lucide-react";
import componentsData from "@/data/components.json";
import { useConfiguratorStore, TierType } from "@/store/useConfiguratorStore";
import { setupPeripheralsData } from "@/data/setupPeripherals";
import { obtenerInfoTienda } from "@/lib/presupuestoTiendas";

// Piezas de una build sin huecos: sólo las builds pecera traen "fans"
const piezasDe = (b: { components: Partial<Record<string, string>> }): Record<string, string> =>
  Object.fromEntries(Object.entries(b.components).filter((e): e is [string, string] => typeof e[1] === "string"));

function PresupuestosContent() {
  const { lang, tr, ruta } = useIdioma();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nivelParam = searchParams.get("nivel") as TierType | null;
  const { selectedTier, selectTier } = useConfiguratorStore();

  const validTiers: TierType[] = ["entrada", "media", "alta", "extrema"];
  const initialTier: TierType =
    nivelParam && validTiers.includes(nivelParam)
      ? nivelParam
      : selectedTier && validTiers.includes(selectedTier)
      ? selectedTier
      : "media";

  const [activeTierId, setActiveTierId] = useState<TierType>(initialTier);

  // Uso (15-09-2026): gaming, streaming o IA local; cada nivel enseña sólo las builds de ese uso.
  // ?uso=streaming|ia abre la página en ese uso.
  const usoParam = searchParams.get("uso");
  const [uso, setUso] = useState<UsoBuild>(esUso(usoParam) ? usoParam : "gaming");
  const USOS = usosBuild(lang);
  const infoUso = USOS.find((u) => u.id === uso)!;

  // Estilo (16-09-2026): estándar, pecera o pecera blanca, en cualquier uso; ?estilo= abre en uno.
  const estiloParam = searchParams.get("estilo");
  const [estilo, setEstilo] = useState<EstiloBuild>(esEstilo(estiloParam) ? estiloParam : "estandar");
  const ESTILOS = estilosBuild(lang);
  const infoEstilo = ESTILOS.find((x) => x.id === estilo)!;

  const tiers = componentsData.tiers;
  const buildsDe = (tier: (typeof tiers)[number], u: UsoBuild, e: EstiloBuild = estilo) => {
    const deUso = tier.builds.filter((b) => usoDe(b) === u && estiloDe(b) === e);
    return deUso.length > 0 ? deUso : tier.builds.filter((b) => estiloDe(b) === "estandar");
  };
  const activeTier = tiers.find((t) => t.id === activeTierId) || tiers[1];
  const tierBuilds = buildsDe(activeTier, uso);
  const [activeBuildId, setActiveBuildId] = useState<string>(tierBuilds[0].id);

  // Sync state if query parameter changes
  useEffect(() => {
    if (nivelParam && validTiers.includes(nivelParam)) {
      setActiveTierId(nivelParam);
      selectTier(nivelParam, false);
      const t = tiers.find((x) => x.id === nivelParam);
      const b = t ? buildsDe(t, uso)[0] : null;
      if (b) setActiveBuildId(b.id);
    }
  }, [nivelParam, selectTier]);

  const activeBuild = tierBuilds.find((b: any) => b.id === activeBuildId) || tierBuilds[0];

  // La build que el usuario elige aquí pasa a ser su PC en Setup completo, que la suma a los
  // periféricos (15-09-2026). Sólo al elegir (nivel, opción o "Explorar Setup Completo"), para no
  // pisar una PC del configurador por mirar esta página; si aún no hay ninguna, vale la que se ve.
  const guardarPc = useEquipo((s) => s.guardarPc);
  const guardarBuild = (
    build: { components: Partial<Record<string, string>>; label?: string; uso?: string; estilo?: string },
    tierId: TierType
  ) =>
    guardarPc({
      componentes: piezasDe(build),
      origen: "presupuestos",
      nombre: build.label,
      nivel: tierId,
      uso: usoDe(build),
      estilo: estiloDe(build),
    });
  useCargarEquipo(({ pc }) => {
    if (!pc) guardarBuild(activeBuild, activeTierId);
  });

  // Al cambiar de nivel, seleccionar de nuevo la primera build de ese nivel y sincronizar tienda global
  const handleSelectTier = (tierId: TierType) => {
    setActiveTierId(tierId);
    selectTier(tierId, false);
    const t = tiers.find((x) => x.id === tierId);
    const b = t ? buildsDe(t, uso)[0] : null;
    if (b) {
      setActiveBuildId(b.id);
      guardarBuild(b, tierId);
    }
  };

  // Al cambiar de uso (o de estilo), la primera build de esa combinación en el nivel que se está viendo
  const elegirUso = (u: UsoBuild) => {
    setUso(u);
    const b = buildsDe(activeTier, u, estilo)[0];
    setActiveBuildId(b.id);
    guardarBuild(b, activeTierId);
  };

  const elegirEstilo = (e: EstiloBuild) => {
    setEstilo(e);
    const b = buildsDe(activeTier, uso, e)[0];
    setActiveBuildId(b.id);
    guardarBuild(b, activeTierId);
  };

  const buildTotal = Object.values(piezasDe(activeBuild)).reduce((sum, itemId) => {
    const comp = getComponentDetail2(itemId);
    return sum + (comp?.price || 0);
  }, 0);

  function getComponentDetail2(itemId: string) {
    for (const cat of componentsData.categories) {
      const found = cat.items.find((item) => item.id === itemId);
      if (found) return found;
    }
    return null;
  }

  const handleSelectTierForConfigurator = () => {
    try {
      const encoded = btoa(encodeURIComponent(JSON.stringify(piezasDe(activeBuild))));
      selectTier(activeTierId, false);
      // la build elegida (no siempre la 1.ª del nivel) + el nivel, el uso y el estilo, para marcar su preset en el configurador
      router.push(`${ruta("configurador")}?b=${encoded}&nivel=${activeTierId}&uso=${uso}&estilo=${estilo}`);
    } catch {
      selectTier(activeTierId, true);
      router.push(ruta("configurador"));
    }
  };

  // Find component names for active tier
  const getComponentDetail = (catId: string, itemId: string) => {
    const cat = componentsData.categories.find((c) => c.id === catId);
    if (!cat) return null;
    return cat.items.find((item) => item.id === itemId) || null;
  };

  const capituloMonitor = setupPeripheralsData[0] ? capituloEnIdioma(setupPeripheralsData[0], lang) : null;
  const peripheralRecommendation = capituloMonitor?.recommendations[activeTierId];

  return (
    <div className="relative min-h-screen text-white flex flex-col selection:bg-white selection:text-black overflow-x-hidden">
      <SiteHeader />

      <main className="relative z-10 flex-1 max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-24 w-full">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#08090a]/50 backdrop-blur-sm border border-white/10 text-[10px] font-mono tracking-widest text-gray-500 uppercase">
            <Link href={ruta("guias")} className="hover:text-white transition-colors">
              {tr("Guías", "Guides")}
            </Link>
            <span>/</span>
            <span className="text-gray-300">{tr("Presupuestos por Nivel", "Budgets by Level")}</span>
          </div>
        </div>

        {/* Header */}
        <div className="border-b border-white/10 pb-8 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#08090a]/50 backdrop-blur-sm border border-white/10 text-[11px] font-mono tracking-[0.25em] text-emerald-400 uppercase mb-3">
            {tr("[ CONFIGURACIONES RECOMENDADAS 2026 ]", "[ RECOMMENDED BUILDS 2026 ]")}
          </div>
          <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-4">
            {tr("Presupuestos probados sin cuellos de botella.", "Tested builds with no bottlenecks.")}
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-3xl leading-relaxed font-sans font-light">
            {tr(
              "Desde equipos de entrada para eSports a 1080p hasta monstruos de render y 4K Path Tracing. Conoce el costo real en dólares sin sobreprecio de tiendas.",
              "From entry-level eSports rigs at 1080p to render monsters and 4K path tracing. See the real cost in dollars, with no store markup."
            )}
          </p>
        </div>

        {/* Estilo y Uso: Filtros segmentados */}
        <div className="flex flex-col gap-3 mb-10">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            
            {/* Uso */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest mr-1">
                {tr("Uso:", "Use:")}
              </span>
              <div className="flex bg-[#08090a]/80 backdrop-blur-sm border border-white/10 p-0.5 rounded-lg shadow-inner">
                {USOS.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => elegirUso(u.id)}
                    aria-pressed={uso === u.id}
                    className={`px-4 py-2 rounded-md text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      uso === u.id
                        ? "bg-white text-black font-bold shadow-sm"
                        : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Estilo */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest mr-1">
                {tr("Estilo:", "Style:")}
              </span>
              <div className="flex bg-[#08090a]/80 backdrop-blur-sm border border-white/10 p-0.5 rounded-lg shadow-inner">
                {ESTILOS.map((x) => (
                  <button
                    key={x.id}
                    type="button"
                    onClick={() => elegirEstilo(x.id)}
                    aria-pressed={estilo === x.id}
                    className={`px-4 py-2 rounded-md text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      estilo === x.id
                        ? "bg-sky-300 text-black font-bold shadow-sm"
                        : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    {x.label}
                  </button>
                ))}
              </div>
            </div>
            
          </div>
          {estilo !== "estandar" && <p className="text-xs text-gray-400 max-w-3xl leading-relaxed">{infoEstilo.descripcion}</p>}
          <p className="text-xs text-gray-400 max-w-3xl leading-relaxed">{infoUso.descripcion}</p>
        </div>

        {/* Tier Selector Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-12">
          {tiers.map((tier) => {
            const isSelected = activeTierId === tier.id;
            const precios = buildsDe(tier, uso).map((b) => b.priceUSD);
            const desde = Math.min(...precios);
            const hasta = Math.max(...precios);
            return (
              <button
                key={tier.id}
                onClick={() => handleSelectTier(tier.id as TierType)}
                className={`p-5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white text-black border-white shadow-xl shadow-white/5"
                    : "bg-[#08090a]/50 backdrop-blur-sm border-white/10 text-gray-300 hover:border-white/30 hover:bg-[#08090a]/70"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-mono tracking-widest uppercase font-bold ${
                      isSelected ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    {tr("NIVEL", "LEVEL")} {(txt(tier, "name", lang) ?? tier.name).toUpperCase()}
                  </span>
                  {isSelected && <Sparkles size={14} className="text-black" />}
                </div>
                <div className="text-lg md:text-xl font-medium tracking-tight mb-1">
                  {desde === hasta
                    ? `$${desde.toLocaleString("en-US")} USD`
                    : `$${desde.toLocaleString("en-US")} - $${hasta.toLocaleString("en-US")} USD`}
                </div>
                <div
                  className={`text-xs leading-relaxed line-clamp-1 ${
                    isSelected ? "text-gray-700" : "text-gray-400"
                  }`}
                >
                  {uso === "gaming" && estilo === "estandar"
                    ? txt(tier, "tagline", lang)
                    : txt(buildsDe(tier, uso)[0], "enfoque", lang)}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Tier Overview Hero Card */}
        <div className="bg-[#08090a]/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-emerald-400 mb-2">
                <CheckCircle2 size={14} />
                {tr("CONFIGURACIÓN VERIFICADA // 0% CUELLO DE BOTELLA", "VERIFIED BUILD // 0% BOTTLENECK")}
              </div>
              <h2 className="text-3xl md:text-4xl font-medium text-white tracking-tight">
                {estilo !== "estandar" ? (
                  <>
                    {infoUso.titulo} · {infoEstilo.label} · {tr("Nivel", "Level")} {txt(activeTier, "name", lang)}
                  </>
                ) : uso === "gaming" ? (
                  <>
                    {tr("PC Gamer Nivel", "Gaming PC · Level")} {txt(activeTier, "name", lang)} — &ldquo;
                    {txt(activeTier, "tagline", lang)}&rdquo;
                  </>
                ) : (
                  <>
                    {infoUso.titulo} · {tr("Nivel", "Level")} {txt(activeTier, "name", lang)}
                  </>
                )}
              </h2>
              <p className="text-sm md:text-base text-gray-300 mt-2 max-w-2xl font-sans">
                {uso === "gaming" && estilo === "estandar" ? txt(activeTier, "target", lang) : txt(activeBuild, "enfoque", lang)}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button
                onClick={handleSelectTierForConfigurator}
                className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3.5 rounded font-mono text-xs uppercase tracking-widest font-semibold hover:bg-gray-200 transition-all cursor-pointer"
              >
                <SlidersHorizontal size={14} />
                {tr("Cargar en Configurador", "Load in Configurator")}
              </button>
              <Link
                href={`${ruta("configurador")}?desde=cero`}
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-6 py-3.5 rounded font-mono text-xs uppercase tracking-widest hover:bg-white/10 transition-all cursor-pointer"
              >
                <Monitor size={14} />
                {tr("Empezar desde cero", "Start from scratch")}
              </Link>
            </div>
          </div>

          {/* Build switcher: varias combinaciones compatibles distintas dentro del mismo nivel */}
          {tierBuilds.length > 1 && (
            <div className="pt-6 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mr-1">
                {tr("Opciones en este nivel:", "Options at this level:")}
              </span>
              {tierBuilds.map((b: any) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setActiveBuildId(b.id);
                    guardarBuild(b, activeTierId);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                    activeBuildId === b.id
                      ? "bg-white text-black border-white font-semibold"
                      : "bg-white/[0.03] border-white/10 text-gray-300 hover:border-white/30"
                  }`}
                >
                  {b.label}
                  {b.priceUSD ? <span className="opacity-60 ml-1.5">${b.priceUSD.toLocaleString("en-US")}</span> : null}
                </button>
              ))}
            </div>
          )}
          {/* Por qué hay varias: cada una tiene un enfoque (AMD/Intel, NVIDIA/Radeon, X3D, creación...) */}
          {/* (en streaming e IA el enfoque ya va bajo el título) */}
          {uso === "gaming" && activeBuild.enfoque && (
            <p className="pt-3 text-xs text-gray-400 font-mono">
              {tr("Enfoque de esta opción:", "What this option focuses on:")}{" "}
              <span className="text-gray-200">{txt(activeBuild, "enfoque", lang)}</span>
            </p>
          )}

          {/* Detailed Component Breakdown */}
          <div className="pt-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400">
                {tr("DESGLOSE DE COMPONENTES", "PARTS BREAKDOWN")} (
                {activeBuild.label ? activeBuild.label.toUpperCase() : (txt(activeTier, "name", lang) ?? "").toUpperCase()})
              </h3>
              <div className="text-right">
                <div className="text-sm font-mono font-semibold text-white">${buildTotal.toLocaleString("en-US")} USD</div>
                <AvisoPrecios className="block max-w-[16rem] text-[10px] leading-snug font-mono text-gray-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(piezasDe(activeBuild)).map(([catKey, itemId]) => {
                const comp = getComponentDetail(catKey, itemId);
                const categoryObj = componentsData.categories.find((c) => c.id === catKey);
                if (!comp) return null;

                const compImage = (comp as any).image || `/images/components/${catKey}.jpg`;
                const storeInfo = obtenerInfoTienda(comp);

                return (
                  <div
                    key={catKey}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-4 hover:border-white/25 transition-all group"
                    {...vistaPrevia(compImage, comp.name)}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-black/60 border border-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src={compImage}
                          alt={comp.name}
                          className="w-full h-full object-contain filter drop-shadow group-hover:scale-105 transition-transform duration-300 touch-manipulation"
                          loading="lazy"
                          {...ampliarAlTocar(compImage, comp.name)}
                        />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <div className="text-[10px] font-mono tracking-widest uppercase text-gray-400">
                          {(categoryObj ? txt(categoryObj, "label", lang) : null) || catKey}
                        </div>
                        <div className="text-sm font-medium text-white truncate">{comp.name}</div>
                        <div className="text-xs text-gray-400 font-mono truncate">
                          {txt(comp, "specs", lang)}
                          {comp.mpn ? ` // MPN: ${comp.mpn}` : ""}
                          {"socket" in comp ? ` // ${(comp as any).socket}` : ""}
                          {"tdp" in comp ? ` // ${(comp as any).tdp}W` : ""}
                        </div>
                        {(comp as any).sinStock && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            <span className="text-[9px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                              {tr("Sin stock EE.UU.", "Out of stock in the US")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                      <div>
                        <div className="text-[10px] font-mono text-gray-400 uppercase">
                          {storeInfo.store || tr("Referencia", "Reference")}
                        </div>
                        <div className="text-sm font-mono font-semibold text-white">
                          ${comp.price} USD
                        </div>
                      </div>

                      {/* Botones de tienda híbrida: Ficha directa + Respaldo de búsqueda por MPN */}
                      <div className="flex items-center gap-1.5 pt-0.5 print:hidden">
                        <a
                          href={storeInfo.url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 text-gray-300 hover:text-white text-[10px] font-mono tracking-wider transition-all"
                          title={
                            storeInfo.isGlobal
                              ? tr("Abrir web oficial del fabricante", "Open official manufacturer page")
                              : tr(`Abrir en ${storeInfo.store}`, `Open on ${storeInfo.store}`)
                          }
                        >
                          <span>{storeInfo.store}</span>
                          <ExternalLink size={10} className="text-gray-400" />
                        </a>

                        <a
                          href={storeInfo.backupUrl}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-0.5 px-1.5 py-1 rounded border border-white/5 hover:border-white/20 text-gray-400 hover:text-gray-200 text-[9px] font-mono transition-all"
                          title={
                            storeInfo.isGlobal
                              ? tr(`Buscar ${comp.mpn || comp.name} en Geizhals (Europa)`, `Search ${comp.mpn || comp.name} on Geizhals (Europe)`)
                              : tr(
                                  `Buscar por MPN (${comp.mpn || "modelo"}) en ${storeInfo.backupStore}`,
                                  `Search by MPN (${comp.mpn || "model"}) on ${storeInfo.backupStore}`
                                )
                          }
                        >
                          <Search size={9} />
                          <span>MPN · {storeInfo.backupStore}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {"fans" in activeBuild.components && activeBuild.components.fans && (
              <p className="mt-4 text-xs text-gray-400 leading-relaxed max-w-3xl">
                {tr(
                  "Ventiladores: la build lleva un pack para la parte de abajo o el lateral libre del gabinete. Para llenar las dos posiciones, añade otro pack igual (en el configurador verás cuántos huecos tiene tu gabinete).",
                  "Fans: the build includes one pack for the free bottom or side mount of the case. To fill both, add another identical pack (the configurator shows how many mounts your case has)."
                )}
              </p>
            )}
            {/* Antes había aquí un panel de "alternativas" de una sola pieza suelta; ahora las
                alternativas son builds completas y compatibles (el selector de arriba). */}
          </div>
        </div>

        {/* Synergy with Setup Section callout */}
        {peripheralRecommendation && (
          <div className="p-8 bg-[#08090a]/60 backdrop-blur-md border border-white/10 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-[10px] font-mono tracking-widest uppercase text-gray-400 mb-1">
                {tr("COMPATIBILIDAD CON PERIFÉRICOS", "PERIPHERAL MATCH")}
              </div>
              <h4 className="text-lg font-medium text-white mb-1">
                {tr("Monitor sugerido para nivel", "Suggested monitor for level")} {txt(activeTier, "name", lang)}:{" "}
                {peripheralRecommendation.title}
              </h4>
              <p className="text-xs text-gray-400 max-w-2xl leading-relaxed">
                {peripheralRecommendation.synergyNotice}
              </p>
            </div>
            <Link
              href={ruta("setup")}
              onClick={() => guardarBuild(activeBuild, activeTierId)}
              className="inline-flex items-center gap-2 bg-white text-black px-5 py-3 rounded font-mono text-xs uppercase tracking-widest font-semibold hover:bg-gray-200 transition-all shrink-0"
            >
              {tr("Explorar Setup Completo", "Explore Full Setup")}
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </main>

      <VistaPreviaFlotante />

      <SiteFooter className="bg-[#08090a]/80 backdrop-blur-md" />
    </div>
  );
}

export function PresupuestosVista() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#08090a] text-white" />}>
      <PresupuestosContent />
    </Suspense>
  );
}
