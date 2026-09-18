"use client";

import React, { useState, useMemo, useLayoutEffect, useEffect, useRef } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import {
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  RotateCcw,
  Cpu,
  CircuitBoard,
  Layers,
  Zap,
  HardDrive,
  Gauge,
  Box,
  Wind,
  Search,
  Share2,
  Printer,
  Sparkles,
  Info,
  X,
  ShieldCheck,
  Percent,
  ChevronDown,
  ArrowRight,
  Fan,
} from "lucide-react";
import componentsData from "@/data/components.json";
import { useConfiguratorStore, TierType } from "@/store/useConfiguratorStore";
import { AvisoPrecios, textoPreciosConFechas } from "@/components/AvisoPrecios";
import { VistaPreviaFlotante, vistaPrevia, ampliarAlTocar } from "@/components/VistaPreviaProducto";
import { InformeEquipo } from "@/components/InformeEquipo";
import {
  useEquipo,
  useCargarEquipo,
  lineasSetup,
  lineasSetupSeleccionado,
  totalSetup as calcularTotalSetup,
  calcularTotalProductos,
  nombreNivelSetup,
  usd,
  usosBuild,
  usoDe,
  esUso,
  type UsoBuild,
  estilosBuild,
  estiloDe,
  esEstilo,
  CATEGORIAS_OBLIGATORIAS,
  type EstiloBuild,
} from "@/lib/equipoCompleto";
import { useIdioma } from "@/i18n/Idioma";
import { nombreFiltro, txt } from "@/i18n/datos";
import type { Lang } from "@/i18n/rutas";

// Campos que sólo traen algunos productos de components.json (ver exportar_web.py)
type ItemCatalogo = {
  id: string;
  name: string;
  price: number;
  image?: string;
  specs?: string;
  grupo?: string;
  socket?: string;
  tdp?: number;
  powerDraw?: number;
  wattage?: number;
  efficiency?: string;
  recommendedPsu?: number;
  sinStock?: boolean;
  importacionGlobal?: boolean;
  sinPrecio?: boolean;
  avisoTitulo?: string;
  avisoDetalle?: string;
  avisoExtra?: string;
  avisoImportacion?: string;
  // reglas de montaje (15-09-2026): largo de la fuente frente al gabinete y cables de la gráfica
  psuLength?: number;
  maxPsuLength?: number;
  pcie8pin?: number;
  connector12v2x6?: number;
  powerConnector?: string; // "12V-2x6" o "8-pin"
  pcie8pinCount?: number;
  adapter8pin?: number;
  // avisos de montaje (15-09-2026): conectores de CPU (placa y fuente) y velocidad de RAM
  epsConnectors?: number;
  ramMaxSpeed?: number;
  ramSpeed?: number;
  // estilo pecera (16-09-2026): color, gabinetes de cristal panorámico con sus huecos de ventilador
  // (abajo y lateral) y packs de ventiladores reverse
  color?: string;
  pecera?: boolean;
  fanSlots?: { bottom?: HuecoVentilador; side?: HuecoVentilador };
  fanSize?: number;
  fanPack?: number;
  fanThickness?: number;
  fanEcosystem?: string;
};
type HuecoVentilador = { "120": number; "140": number; included: boolean; maxThickness?: number };

// Configurador sencillo (13-09): cada categoría enseña MODELOS ("RTX 5070 · desde US$ 840 ·
// 7 versiones"); al elegir uno se pone la versión recomendada y se puede cambiar en "Elige la
// versión". CPU y gabinete no tienen versiones: cada producto es su propio modelo (grupo = id).
type Grupo = {
  key: string;
  nombre: string;
  versiones: ItemCatalogo[];
  recomendada: ItemCatalogo;
  desde: number | null;
  fuera: number;
  soloFuera: boolean;
  compatible: boolean;
  razon?: string;
};
const MODELOS_VISIBLES = 6;
const VERSIONES_VISIBLES = 4;
// Formatos de placa tal y como los escribe el exportador (formFactor / supports)
const FORMATOS_FILTRO: Record<string, string> = { atx: "ATX", matx: "mATX", "e-atx": "EATX", eatx: "EATX" };
// Recomendada = la más barata con stock en EE.UU. (nunca una sin stock ni una europea/asiática)
const esComprable = (it: ItemCatalogo) => !it.sinStock && !it.importacionGlobal;

// Cables de la gráfica frente a la fuente (15-09-2026). La gráfica pide un conector 12V-2x6 (16 pines)
// o N cables de 8 pines; si la fuente no trae 12V-2x6, las RTX 5070 en adelante usan el adaptador de
// su caja, que pide adapter8pin cables de 8 pines. Sin dato en alguna de las dos fichas no se juzga
// (null). Es la misma lógica que cables_gpu_psu() en compatibilidad.py, con la que se arman los presupuestos.
type EstadoCables = { estado: "ok" } | { estado: "adaptador" | "faltan"; detalle: string };
function cablesGpuFuente(gpu: ItemCatalogo, psu: ItemCatalogo, lang: Lang = "es"): EstadoCables | null {
  const en = lang === "en";
  const ocho = psu.pcie8pin;
  if (gpu.powerConnector === "8-pin") {
    if (ocho === undefined || !gpu.pcie8pinCount) return null;
    if (ocho >= gpu.pcie8pinCount) return { estado: "ok" };
    return {
      estado: "faltan",
      detalle: en
        ? `the graphics card needs ${gpu.pcie8pinCount} 8-pin cables and the power supply has ${ocho}`
        : `la gráfica pide ${gpu.pcie8pinCount} cables de 8 pines y la fuente trae ${ocho}`,
    };
  }
  if (gpu.powerConnector === "12V-2x6") {
    if (psu.connector12v2x6 === undefined) return null;
    if (psu.connector12v2x6 >= 1) return { estado: "ok" };
    if (ocho === undefined || !gpu.adapter8pin) return null;
    if (ocho >= gpu.adapter8pin) {
      return {
        estado: "adaptador",
        detalle: en
          ? `the power supply has no 12V-2x6 connector: use the adapter that comes with the graphics card (${gpu.adapter8pin} 8-pin cables)`
          : `la fuente no trae conector 12V-2x6: usa el adaptador que viene con la gráfica (${gpu.adapter8pin} cables de 8 pines)`,
      };
    }
    return {
      estado: "faltan",
      detalle: en
        ? `the power supply has no 12V-2x6 and the card's adapter needs ${gpu.adapter8pin} 8-pin cables; the power supply has ${ocho}`
        : `la fuente no trae 12V-2x6 y el adaptador de la gráfica pide ${gpu.adapter8pin} cables de 8 pines; la fuente trae ${ocho}`,
    };
  }
  return null;
}
// Ventiladores frente al gabinete (16-09-2026): el pack va abajo o al lateral, donde se ve por el cristal.
// Devuelve las posiciones donde cabe (vacío = no cabe); null si el gabinete no trae ese dato. Es la
// misma regla que compatible_fan_case() en compatibilidad.py.
function huecosParaVentiladores(fans: ItemCatalogo, pcCase: ItemCatalogo): ("bottom" | "side")[] | null {
  if (!pcCase.fanSlots || !fans.fanSize) return null;
  const tam = String(fans.fanSize) as "120" | "140";
  return (["bottom", "side"] as const).filter((pos) => {
    const h = pcCase.fanSlots?.[pos];
    return h && h[tam] > 0 && !(fans.fanThickness && h.maxThickness && fans.fanThickness > h.maxThickness);
  });
}

const ordenVersiones = (a: ItemCatalogo, b: ItemCatalogo) =>
  Number(!!a.sinPrecio) - Number(!!b.sinPrecio) ||
  Number(!!a.importacionGlobal) - Number(!!b.importacionGlobal) ||
  Number(!!a.sinStock) - Number(!!b.sinStock) ||
  a.price - b.price;

// Decodifica ?b= (el mismo formato que "Compartir Link") y se queda sólo con las piezas que existen
// hoy en components.json: un enlace viejo puede apuntar a un producto que ya no está.
function buildDeUrl(b: string | null): Record<string, string> | null {
  if (!b) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(atob(b)));
    if (!parsed || typeof parsed !== "object") return null;
    const limpio: Record<string, string> = {};
    for (const [catId, itemId] of Object.entries(parsed)) {
      const cat = componentsData.categories.find((c) => c.id === catId);
      if (typeof itemId === "string" && cat?.items.some((it) => it.id === itemId)) limpio[catId] = itemId;
    }
    return limpio;
  } catch {
    return null;
  }
}

export function ConfiguradorVista() {
  const { lang, tr, ruta } = useIdioma();
  const USOS = usosBuild(lang);
  const { selectedTier, selectTier } = useConfiguratorStore();

  // Build de partida: el preset del nivel elegido en el store, para que "Abrir en Configurador" de
  // la portada abra el nivel que se estaba viendo. La URL NO se lee aquí: el servidor no la conoce y
  // el primer render del navegador tiene que ser idéntico al suyo (si no, error de hidratación).
  const [selectedComponents, setSelectedComponents] = useState<Record<string, string>>(() => {
    const defaultTier = componentsData.tiers.find((t) => t.id === selectedTier) || componentsData.tiers[1];
    return { ...defaultTier.components };
  });
  // Botón de "Presets probados" que se ve activo (null = ninguno: build desde cero o compartida)
  const [presetActivo, setPresetActivo] = useState<string | null>(selectedTier);
  // Uso de los presets (15-09-2026): gaming, streaming o IA local; cada nivel carga su build de ese uso
  const [usoPreset, setUsoPreset] = useState<UsoBuild>("gaming");
  // Estilo (16-09-2026): estándar, pecera o pecera blanca. Además de cargar su preset, filtra las listas:
  // en pecera sólo gabinetes pecera; en pecera blanca, sólo piezas blancas donde las hay.
  const [estilo, setEstilo] = useState<EstiloBuild>("estandar");
  const ESTILOS = estilosBuild(lang);

  // UI States
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyCompatible, setOnlyCompatible] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<Record<string, string>>({});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleExpandCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // Paso a paso: sólo una categoría abierta. Con una build cargada todas empiezan cerradas (se ven
  // las 8 piezas elegidas en una línea cada una); "Empezar desde cero" y "Limpiar" abren la CPU.
  const [pasoAbierto, setPasoAbierto] = useState<string | null>(null);
  // Modelo cuyas versiones se enseñan en cada categoría (sin valor = el de la pieza elegida)
  const [modeloAbierto, setModeloAbierto] = useState<Record<string, string | null>>({});
  const [versionesTodas, setVersionesTodas] = useState<Record<string, boolean>>({});

  // La URL se mira una sola vez al abrir la página, antes de pintar (no se ve el preset ni un instante):
  //   ?b=<build>&nivel=<id>  "Cargar en Configurador" (presupuestos) y "Compartir Link": esa build exacta
  //   ?desde=cero            "Empezar desde cero": sin ninguna pieza
  // Antes la leía el useState y un useEffect([selectedTier]) la pisaba al montar con la 1.ª build del
  // nivel: por eso no llegaban la 2.ª/3.ª build de presupuestos ni los enlaces compartidos.
  const urlConBuild = useRef(false); // la URL trae build: manda sobre la PC guardada
  useLayoutEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inicial = params.get("desde") === "cero" ? {} : buildDeUrl(params.get("b"));
    if (!inicial) return;
    urlConBuild.current = true;
    const nivel = params.get("nivel");
    const usoUrl = params.get("uso");
    const estiloUrl = params.get("estilo");
    /* eslint-disable react-hooks/set-state-in-effect -- sincroniza con la URL una sola vez, al montar */
    setSelectedComponents(inicial);
    setPresetActivo(nivel && componentsData.tiers.some((t) => t.id === nivel) ? nivel : null);
    if (esUso(usoUrl)) setUsoPreset(usoUrl);
    if (esEstilo(estiloUrl)) setEstilo(estiloUrl);
    if (Object.keys(inicial).length === 0) setPasoAbierto(componentsData.categories[0].id);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // La PC se guarda en el navegador para que Setup completo la sume a los periféricos (15-09-2026).
  // Sin build en la URL, al volver se abre la última PC (del configurador o elegida en presupuestos)
  // en vez del preset. setupNivel: el nivel elegido en Setup completo (null = ninguno).
  const equipoListo = useCargarEquipo(({ pc }) => {
    if (urlConBuild.current || !pc) return;
    setSelectedComponents(pc.componentes);
    setPresetActivo(pc.nivel && componentsData.tiers.some((t) => t.id === pc.nivel) ? pc.nivel : null);
    if (pc.uso) setUsoPreset(pc.uso);
    if (pc.estilo) setEstilo(pc.estilo);
    if (Object.keys(pc.componentes).length === 0) setPasoAbierto(componentsData.categories[0].id);
  });
  const guardarPc = useEquipo((s) => s.guardarPc);
  const setupNivel = useEquipo((s) => s.setupNivel);
  const setupProductos = useEquipo((s) => s.setupProductos);
  const totalSetupElegido =
    setupProductos && setupProductos.length > 0
      ? calcularTotalProductos(setupProductos)
      : setupNivel
      ? calcularTotalSetup(setupNivel)
      : 0;
  useEffect(() => {
    if (equipoListo)
      guardarPc({ componentes: selectedComponents, origen: "configurador", nivel: presetActivo, uso: usoPreset, estilo });
  }, [equipoListo, selectedComponents, presetActivo, usoPreset, estilo, guardarPc]);

  // Load a preset: la build del nivel para el uso elegido (gaming = la de siempre, la más barata)
  const handleLoadPreset = (tierId: string, u: UsoBuild = usoPreset, e: EstiloBuild = estilo) => {
    setModeloAbierto({});
    if (!tierId) {
      // Clear
      setSelectedComponents({});
      setPresetActivo(null);
      setPasoAbierto(componentsData.categories[0].id);
      return;
    }
    const targetTier = componentsData.tiers.find((t) => t.id === tierId);
    if (targetTier) {
      const build =
        e === "estandar" && u === "gaming"
          ? null
          : targetTier.builds.find((b) => usoDe(b) === u && estiloDe(b) === e) ?? null;
      setSelectedComponents({ ...(build ? build.components : targetTier.components) });
      setPresetActivo(tierId);
      setPasoAbierto(null);
      selectTier(tierId as TierType, false);
    }
  };

  // Cambiar de uso con un preset puesto recarga ese nivel en el uso nuevo
  const elegirUsoPreset = (u: UsoBuild) => {
    setUsoPreset(u);
    if (presetActivo) handleLoadPreset(presetActivo, u, estilo);
  };

  // Cambiar de estilo, con un preset puesto, carga la build de ese estilo en el uso elegido
  const elegirEstilo = (e: EstiloBuild) => {
    setEstilo(e);
    if (presetActivo) handleLoadPreset(presetActivo, usoPreset, e);
  };

  // Select component in a category
  const handleSelectComponent = (categoryId: string, itemId: string) => {
    setSelectedComponents((prev) => {
      // If already selected, do nothing or keep it
      return {
        ...prev,
        [categoryId]: itemId,
      };
    });
  };

  // Remove component from category
  const handleRemoveComponent = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedComponents((prev) => {
      const copy = { ...prev };
      delete copy[categoryId];
      return copy;
    });
  };

  // Helper to find item object
  const getItem = (catId: string, itemId?: string) => {
    if (!itemId) return null;
    const cat = componentsData.categories.find((c) => c.id === catId);
    return cat?.items.find((it) => it.id === itemId) || null;
  };

  // Selected item objects
  const cpu = getItem("cpu", selectedComponents.cpu);
  const mobo = getItem("motherboard", selectedComponents.motherboard);
  const ram = getItem("ram", selectedComponents.ram);
  const gpu = getItem("gpu", selectedComponents.gpu);
  const storage = getItem("storage", selectedComponents.storage);
  const psu = getItem("psu", selectedComponents.psu);
  const pcCase = getItem("case", selectedComponents.case);
  const cooling = getItem("cooling", selectedComponents.cooling);
  const fans = getItem("fans", selectedComponents.fans) as ItemCatalogo | null;
  const piezasObligatorias = CATEGORIAS_OBLIGATORIAS.filter((id) => selectedComponents[id]).length;

  // Europeos/asiáticos (importacionGlobal): se pueden elegir y se les revisa la compatibilidad
  // como a cualquiera, pero llevan aviso naranja y nunca entran en los presupuestos. Su precio
  // es el de la tienda europea sin IVA pasado a dólares (≈); si no hay precio, no suman.
  const precioTexto = (it: ItemCatalogo) =>
    it.sinPrecio ? tr("Sin precio", "No price") : `${it.importacionGlobal ? "≈ " : ""}$${it.price} USD`;
  // textos de las fichas en el idioma de la página (components.json trae specsEn, avisoTituloEn...)
  const dato = (it: ItemCatalogo | null | undefined, campo: string) => txt(it, campo, lang);
  const piezasGlobales = Object.entries(selectedComponents)
    .map(([catId, itemId]) => getItem(catId, itemId) as ItemCatalogo | null)
    .filter((it): it is ItemCatalogo => Boolean(it?.importacionGlobal));
  const gpuRec = (gpu as ItemCatalogo | null)?.recommendedPsu;
  const psuW = (psu as ItemCatalogo | null)?.wattage || 0;

  // Calculations
  const totalPrice = useMemo(() => {
    let sum = 0;
    Object.entries(selectedComponents).forEach(([catId, itemId]) => {
      const item = getItem(catId, itemId);
      if (item) sum += item.price;
    });
    return sum;
  }, [selectedComponents]);

  const estimatedWattage = useMemo(() => {
    const cpuTdp = (cpu as any)?.tdp || 65;
    const gpuDraw = (gpu as any)?.powerDraw || 150;
    const baseSystem = 85; // RAM, storage, fans, chipset
    return cpuTdp + gpuDraw + baseSystem;
  }, [cpu, gpu]);

  const recommendedPsuWatts = useMemo(() => {
    return Math.ceil((estimatedWattage * 1.35) / 50) * 50;
  }, [estimatedWattage]);

  // Compatibility Validations
  const compatibilityIssues = useMemo(() => {
    const issues: { type: "error" | "warning"; message: string }[] = [];

    // Socket check
    if (cpu && mobo) {
      if ((cpu as any).socket !== (mobo as any).socket) {
        issues.push({
          type: "error",
          message: tr(
            `Incompatibilidad de Socket: La CPU usa socket ${(cpu as any).socket} pero la placa base es ${(mobo as any).socket}. No encajarán físicamente.`,
            `Socket mismatch: the CPU uses socket ${(cpu as any).socket} but the motherboard is ${(mobo as any).socket}. They will not fit together.`
          ),
        });
      }
    }

    // RAM type check
    if (mobo && ram) {
      if ((mobo as any).ramType !== (ram as any).ramType) {
        issues.push({
          type: "error",
          message: tr(
            `Incompatibilidad de RAM: La placa base requiere memoria ${(mobo as any).ramType} y seleccionaste ${(ram as any).ramType}.`,
            `RAM mismatch: the motherboard needs ${(mobo as any).ramType} memory and you picked ${(ram as any).ramType}.`
          ),
        });
      }
    }

    // PSU Wattage check
    if (psu) {
      const psuWatts = (psu as any).wattage || 0;
      if (psuWatts < estimatedWattage) {
        issues.push({
          type: "error",
          message: tr(
            `Potencia Insuficiente: La fuente es de ${psuWatts}W, pero tu ensamble demanda ~${estimatedWattage}W. Tu PC podría apagarse en plena carga.`,
            `Not enough power: the power supply is ${psuWatts}W, but your build draws ~${estimatedWattage}W. Your PC could shut down under load.`
          ),
        });
      } else if (psuWatts < recommendedPsuWatts) {
        issues.push({
          type: "warning",
          message: tr(
            `Margen Eléctrico Justo: La fuente tiene ${psuWatts}W. Te sugerimos al menos ${recommendedPsuWatts}W para soportar picos transitorios con holgura.`,
            `Tight power headroom: the power supply is ${psuWatts}W. We suggest at least ${recommendedPsuWatts}W to handle transient spikes comfortably.`
          ),
        });
      }
    }

    // Fuente vs lo que pide el fabricante de la GPU (su ficha o, si no lo da, otras fichas del
    // mismo chip). Es la misma regla con la que se arman los presupuestos.
    if (psu && gpu && gpuRec && psuW < gpuRec) {
      issues.push({
        type: "error",
        message: tr(
          `Fuente por Debajo de lo Recomendado: el fabricante de la ${gpu.name} pide al menos ${gpuRec}W y la fuente es de ${psuW}W.`,
          `Power supply below the recommendation: the maker of the ${gpu.name} asks for at least ${gpuRec}W and yours is ${psuW}W.`
        ),
      });
    }

    // GPU Length vs Case
    if (gpu && pcCase) {
      const gpuLength = (gpu as any).length || 0;
      const caseMaxGpu = (pcCase as any).maxGpuLength || 400;
      if (gpuLength > caseMaxGpu) {
        issues.push({
          type: "error",
          message: tr(
            `Gabinete Demasiado Pequeño: La tarjeta gráfica mide ${gpuLength}mm, pero el gabinete solo admite tarjetas de hasta ${caseMaxGpu}mm.`,
            `Case too small: the graphics card is ${gpuLength}mm long, but the case only fits cards up to ${caseMaxGpu}mm.`
          ),
        });
      }
    }

    // Largo de la fuente vs hueco del gabinete (las de 1000-1200 W llegan a 200 mm)
    if (psu && pcCase) {
      const largo = (psu as ItemCatalogo).psuLength;
      const hueco = (pcCase as ItemCatalogo).maxPsuLength;
      if (largo && hueco && largo > hueco) {
        issues.push({
          type: "error",
          message: tr(
            `Fuente Demasiado Larga: Mide ${largo}mm y el gabinete admite fuentes de hasta ${hueco}mm.`,
            `Power supply too long: it is ${largo}mm and the case fits power supplies up to ${hueco}mm.`
          ),
        });
      }
    }

    // Cables de la gráfica: que la fuente traiga el conector que pide (o los cables del adaptador)
    if (gpu && psu) {
      const cables = cablesGpuFuente(gpu as ItemCatalogo, psu as ItemCatalogo, lang);
      if (cables?.estado === "faltan") {
        issues.push({
          type: "error",
          message: tr(`Faltan Cables para la Gráfica: ${cables.detalle}.`, `Missing cables for the graphics card: ${cables.detalle}.`),
        });
      } else if (cables?.estado === "adaptador") {
        issues.push({
          type: "warning",
          message: tr(`Gráfica con Adaptador: ${cables.detalle}.`, `Graphics card with adapter: ${cables.detalle}.`),
        });
      }
    }

    // Conectores de CPU (EPS): sólo aviso, la placa arranca con uno
    if (psu && mobo) {
      const epsFuente = (psu as ItemCatalogo).epsConnectors;
      const epsPlaca = (mobo as ItemCatalogo).epsConnectors;
      if (epsFuente && epsPlaca && epsFuente < epsPlaca) {
        issues.push({
          type: "warning",
          message: tr(
            `Conector de CPU Libre: La placa trae ${epsPlaca} conectores de 8 pines para el procesador y la fuente ${epsFuente}. Arranca con uno; el segundo sólo hace falta para overclock o procesadores de mucho consumo.`,
            `Spare CPU connector: the motherboard has ${epsPlaca} 8-pin CPU connectors and the power supply ${epsFuente}. It boots with one; the second is only needed for overclocking or very power-hungry processors.`
          ),
        });
      }
    }

    // RAM más rápida que la placa: funciona, pero a la velocidad de la placa
    if (ram && mobo) {
      const velocidad = (ram as ItemCatalogo).ramSpeed;
      const maxPlaca = (mobo as ItemCatalogo).ramMaxSpeed;
      if (velocidad && maxPlaca && velocidad > maxPlaca) {
        issues.push({
          type: "warning",
          message: tr(
            `RAM Más Rápida que la Placa: El kit es ${(ram as any).ramType}-${velocidad} y la placa llega a ${maxPlaca} MT/s. Funciona, pero a ${maxPlaca}.`,
            `RAM faster than the board: the kit is ${(ram as any).ramType}-${velocidad} and the board tops out at ${maxPlaca} MT/s. It works, but at ${maxPlaca}.`
          ),
        });
      }
    }

    // Cooler Socket check
    if (cpu && cooling) {
      const cpuSocket = (cpu as any).socket;
      const coolerSockets = (cooling as any).socketSupport || [];
      if (cpuSocket && !coolerSockets.includes(cpuSocket)) {
        issues.push({
          type: "warning",
          message: tr(
            `Anclaje de Disipador: Verifica que el disipador incluya los brackets para socket ${cpuSocket}.`,
            `Cooler mounting: check that the cooler includes the brackets for socket ${cpuSocket}.`
          ),
        });
      }
    }

    // Cooler TDP vs CPU TDP
    if (cpu && cooling) {
      const cpuTdp = (cpu as any).tdp;
      const coolerTdp = (cooling as any).tdpCapacity;
      if (cpuTdp && coolerTdp && coolerTdp < cpuTdp) {
        issues.push({
          type: "warning",
          message: tr(
            `Disipación Justa: El disipador soporta hasta ${coolerTdp}W y la CPU puede llegar a ${cpuTdp}W. Podría no bajar todo el potencial en cargas sostenidas.`,
            `Tight cooling: the cooler handles up to ${coolerTdp}W and the CPU can reach ${cpuTdp}W. It may not keep full performance under sustained loads.`
          ),
        });
      }
    }

    // Cooler height (air) or radiator size (liquid) vs Case
    if (cooling && pcCase) {
      const coolType = (cooling as any).type;
      if (coolType === "aire") {
        const coolerH = (cooling as any).height;
        const caseMaxH = (pcCase as any).maxCoolerHeight;
        if (coolerH && caseMaxH && coolerH > caseMaxH) {
          issues.push({
            type: "error",
            message: tr(
              `Disipador Demasiado Alto: Mide ${coolerH}mm, pero el gabinete admite hasta ${caseMaxH}mm.`,
              `Cooler too tall: it is ${coolerH}mm, but the case fits up to ${caseMaxH}mm.`
            ),
          });
        }
      } else if (coolType === "liquida") {
        const radSize = (cooling as any).radiatorSize;
        const caseRadMax = (pcCase as any).radiatorMax;
        if (radSize && caseRadMax && radSize > caseRadMax) {
          issues.push({
            type: "error",
            message: tr(
              `Radiador Demasiado Grande: Es de ${radSize}mm y el gabinete admite hasta ${caseRadMax}mm.`,
              `Radiator too big: it is ${radSize}mm and the case fits up to ${caseRadMax}mm.`
            ),
          });
        }
      }
    }

    // Ventiladores reverse (opcionales): que quepan abajo o al lateral del gabinete, y lo que piden aparte
    if (fans && pcCase) {
      const huecos = huecosParaVentiladores(fans, pcCase as ItemCatalogo);
      if (huecos && huecos.length === 0) {
        issues.push({
          type: "error",
          message: tr(
            `Ventiladores Sin Hueco: el gabinete no admite ventiladores de ${fans.fanSize}mm${fans.fanThickness ? ` y ${fans.fanThickness}mm de grosor` : ""} abajo ni en el lateral.`,
            `Fans don't fit: the case has no ${fans.fanSize}mm${fans.fanThickness ? `, ${fans.fanThickness}mm thick` : ""} fan mounts at the bottom or side.`
          ),
        });
      }
    }
    if (fans?.fanEcosystem === "icue-link") {
      issues.push({
        type: "warning",
        message: tr(
          "Ventiladores iCUE LINK: necesitan el Corsair iCUE LINK System Hub, que no viene en el pack.",
          "iCUE LINK fans: they need the Corsair iCUE LINK System Hub, which isn't included in the pack."
        ),
      });
    } else if (fans?.fanEcosystem === "eurux") {
      issues.push({
        type: "warning",
        message: tr(
          "Ventiladores ROG Eurux: usan su controlador USB propio; hace falta un USB 2.0 interno libre en la placa.",
          "ROG Eurux fans: they use their own USB controller; you need a free internal USB 2.0 header on the board."
        ),
      });
    }
    if (fans?.fanThickness && fans.fanThickness >= 30) {
      issues.push({
        type: "warning",
        message: tr(
          `Ventiladores de ${fans.fanThickness}mm de Grosor: más gruesos que los normales (25mm). Comprueba la holgura con la placa y el radiador.`,
          `${fans.fanThickness}mm thick fans: thicker than the usual 25mm. Check the clearance with the motherboard and radiator.`
        ),
      });
    }

    // Motherboard form factor vs Case
    if (mobo && pcCase) {
      const moboFF = (mobo as any).formFactor;
      const caseSupports = (pcCase as any).supports || [];
      if (moboFF && caseSupports.length > 0 && !caseSupports.includes(moboFF)) {
        issues.push({
          type: "error",
          message: tr(
            `Placa No Entra: Es formato ${moboFF} y el gabinete sólo admite ${caseSupports.join("/")}.`,
            `Motherboard doesn't fit: it is ${moboFF} and the case only takes ${caseSupports.join("/")}.`
          ),
        });
      }
    }

    return issues;
  }, [cpu, mobo, ram, gpu, psu, pcCase, cooling, fans, estimatedWattage, recommendedPsuWatts, gpuRec, psuW, lang, tr]);

  // Check individual item compatibility with current selection
  const checkItemCompatibility = (catId: string, item: any): { compatible: boolean; reason?: string } => {
    if (catId === "motherboard" && cpu) {
      if (item.socket !== (cpu as any).socket) {
        return { compatible: false, reason: tr(`Requiere CPU ${item.socket}`, `Needs an ${item.socket} CPU`) };
      }
    }
    if (catId === "cpu" && mobo) {
      if (item.socket !== (mobo as any).socket) {
        return {
          compatible: false,
          reason: tr(
            `Incompatible con placa ${mobo.name} (${(mobo as any).socket})`,
            `Not compatible with the ${mobo.name} board (${(mobo as any).socket})`
          ),
        };
      }
    }
    if (catId === "gpu" && pcCase) {
      if (item.length > ((pcCase as any).maxGpuLength || 400)) {
        return {
          compatible: false,
          reason: tr(
            `Excede largo max (${(pcCase as any).maxGpuLength}mm)`,
            `Longer than the max (${(pcCase as any).maxGpuLength}mm)`
          ),
        };
      }
    }
    if (catId === "case" && gpu) {
      if ((gpu as any).length > (item.maxGpuLength || 400)) {
        return { compatible: false, reason: tr(`GPU demasiado larga para este chasis`, `GPU too long for this case`) };
      }
    }
    if (catId === "psu") {
      if (item.wattage < estimatedWattage) {
        return { compatible: false, reason: tr(`Insuficiente potencia (<${estimatedWattage}W)`, `Not enough power (<${estimatedWattage}W)`) };
      }
      if (gpuRec && item.wattage < gpuRec) {
        return { compatible: false, reason: tr(`La GPU pide fuente de ${gpuRec}W o más`, `The GPU needs ${gpuRec}W or more`) };
      }
    }
    if (catId === "gpu" && psu && item.recommendedPsu && psuW < item.recommendedPsu) {
      return {
        compatible: false,
        reason: tr(
          `Pide fuente de ${item.recommendedPsu}W (tienes ${psuW}W)`,
          `Needs a ${item.recommendedPsu}W power supply (you have ${psuW}W)`
        ),
      };
    }
    // Largo de la fuente vs gabinete, en los dos sentidos
    if (catId === "psu" && pcCase) {
      const hueco = (pcCase as ItemCatalogo).maxPsuLength;
      if (item.psuLength && hueco && item.psuLength > hueco) {
        return {
          compatible: false,
          reason: tr(
            `Mide ${item.psuLength}mm: el gabinete admite hasta ${hueco}mm`,
            `It is ${item.psuLength}mm: the case fits up to ${hueco}mm`
          ),
        };
      }
    }
    if (catId === "case" && psu) {
      const largo = (psu as ItemCatalogo).psuLength;
      if (largo && item.maxPsuLength && largo > item.maxPsuLength) {
        return {
          compatible: false,
          reason: tr(
            `La fuente (${largo}mm) no entra: admite hasta ${item.maxPsuLength}mm`,
            `Your power supply (${largo}mm) doesn't fit: up to ${item.maxPsuLength}mm`
          ),
        };
      }
    }
    // Cables de la gráfica, en los dos sentidos (el adaptador no descarta: sólo avisa en el resumen)
    if (catId === "psu" && gpu && cablesGpuFuente(gpu as ItemCatalogo, item, lang)?.estado === "faltan") {
      return { compatible: false, reason: tr(`No trae los cables que pide la gráfica`, `Missing the cables the GPU needs`) };
    }
    if (catId === "gpu" && psu && cablesGpuFuente(item, psu as ItemCatalogo, lang)?.estado === "faltan") {
      return { compatible: false, reason: tr(`Tu fuente no trae los cables que pide`, `Your power supply lacks the cables it needs`) };
    }
    if (catId === "cooling" && cpu) {
      const coolerSockets = item.socketSupport || [];
      if (coolerSockets.length > 0 && !coolerSockets.includes((cpu as any).socket)) {
        return {
          compatible: false,
          reason: tr(`Sin bracket para socket ${(cpu as any).socket}`, `No bracket for socket ${(cpu as any).socket}`),
        };
      }
    }
    if (catId === "cooling" && pcCase) {
      if (item.type === "aire" && item.height && (pcCase as any).maxCoolerHeight && item.height > (pcCase as any).maxCoolerHeight) {
        return {
          compatible: false,
          reason: tr(
            `No entra en el gabinete (máx. ${(pcCase as any).maxCoolerHeight}mm)`,
            `Doesn't fit the case (max. ${(pcCase as any).maxCoolerHeight}mm)`
          ),
        };
      }
      if (item.type === "liquida" && item.radiatorSize && (pcCase as any).radiatorMax && item.radiatorSize > (pcCase as any).radiatorMax) {
        return {
          compatible: false,
          reason: tr(
            `Radiador ${item.radiatorSize}mm no entra (máx. ${(pcCase as any).radiatorMax}mm)`,
            `${item.radiatorSize}mm radiator doesn't fit (max. ${(pcCase as any).radiatorMax}mm)`
          ),
        };
      }
    }
    if (catId === "case" && mobo) {
      const supports = item.supports || [];
      if (supports.length > 0 && (mobo as any).formFactor && !supports.includes((mobo as any).formFactor)) {
        return {
          compatible: false,
          reason: tr(`No admite placas ${(mobo as any).formFactor}`, `Doesn't take ${(mobo as any).formFactor} boards`),
        };
      }
    }
    if (catId === "fans" && pcCase) {
      const huecos = huecosParaVentiladores(item, pcCase as ItemCatalogo);
      if (huecos && huecos.length === 0) {
        return { compatible: false, reason: tr(`Sin hueco de ${item.fanSize}mm abajo ni al lateral`, `No ${item.fanSize}mm mount at the bottom or side`) };
      }
    }
    if (catId === "case" && fans) {
      const huecos = huecosParaVentiladores(fans, item);
      if (huecos && huecos.length === 0) {
        return { compatible: false, reason: tr(`Tus ventiladores de ${fans.fanSize}mm no caben abajo ni al lateral`, `Your ${fans.fanSize}mm fans don't fit at the bottom or side`) };
      }
    }
    if (catId === "motherboard" && pcCase) {
      const supports = (pcCase as any).supports || [];
      if (supports.length > 0 && item.formFactor && !supports.includes(item.formFactor)) {
        return {
          compatible: false,
          reason: tr(`El gabinete no admite formato ${item.formFactor}`, `The case doesn't take ${item.formFactor}`),
        };
      }
    }
    return { compatible: true };
  };

  // Agrupa los productos (ya filtrados) por modelo. Orden: primero lo compatible con lo ya elegido
  // (con una CPU AM5, las placas AM5 van delante), luego lo que se vende en EE.UU., por precio
  // "desde"; lo que sólo se vende fuera, al final.
  const agrupar = (catId: string, lista: ItemCatalogo[]): Grupo[] => {
    const mapa = new Map<string, ItemCatalogo[]>();
    for (const it of lista) {
      const k = it.grupo || it.id;
      mapa.set(k, [...(mapa.get(k) || []), it]);
    }
    return [...mapa.entries()]
      .map(([key, vs]) => {
        const versiones = [...vs].sort(ordenVersiones);
        const compatibles = versiones.filter((v) => checkItemCompatibility(catId, v).compatible);
        const recomendada = compatibles.find(esComprable) || compatibles[0] || versiones.find(esComprable) || versiones[0];
        const pool = [versiones.filter(esComprable), versiones.filter((v) => !v.importacionGlobal), versiones]
          .map((p) => p.filter((v) => !v.sinPrecio))
          .find((p) => p.length > 0);
        return {
          key,
          nombre:
            versiones.length > 1 || versiones[0].grupo
              ? dato(versiones[0], "grupo") || versiones[0].name
              : versiones[0].name,
          versiones,
          recomendada,
          desde: pool ? Math.min(...pool.map((v) => v.price)) : null,
          fuera: versiones.filter((v) => v.importacionGlobal).length,
          soloFuera: versiones.every((v) => v.importacionGlobal),
          compatible: compatibles.length > 0,
          razon: compatibles.length > 0 ? undefined : checkItemCompatibility(catId, versiones[0]).reason,
        };
      })
      .sort(
        (a, b) =>
          Number(!a.compatible) - Number(!b.compatible) ||
          Number(a.soloFuera) - Number(b.soloFuera) ||
          (a.desde ?? Infinity) - (b.desde ?? Infinity)
      );
  };

  // Elegir un modelo = quedarse con su versión recomendada (quien no quiera decidir, sigue) y
  // abrir "Elige la versión" por si quiere otra marca.
  const elegirModelo = (catId: string, g: Grupo) => {
    handleSelectComponent(catId, g.recomendada.id);
    setModeloAbierto((prev) => ({ ...prev, [catId]: g.versiones.length > 1 ? g.key : null }));
  };

  // "Siguiente paso": la próxima categoría sin pieza (o la siguiente en orden); al terminar, al resumen
  const irAlSiguientePaso = (catId: string) => {
    const orden = componentsData.categories.map((c) => c.id);
    const despues = [...orden.slice(orden.indexOf(catId) + 1), ...orden.slice(0, orden.indexOf(catId))];
    const siguiente = despues.find((id) => !selectedComponents[id]) || orden[orden.indexOf(catId) + 1] || null;
    setPasoAbierto(siguiente);
    setTimeout(() => {
      document.getElementById(siguiente ? `paso-${siguiente}` : "resumen")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  // Budget Distribution Percentages
  const budgetShares = useMemo(() => {
    if (totalPrice === 0) return [];
    const categoriesToShow = [
      { id: "gpu", label: "GPU", item: gpu, color: "bg-emerald-400" },
      { id: "cpu", label: "CPU", item: cpu, color: "bg-sky-400" },
      { id: "motherboard", label: tr("Placa", "Board"), item: mobo, color: "bg-violet-400" },
      { id: "ram", label: "RAM", item: ram, color: "bg-amber-400" },
      { id: "storage", label: tr("Disco", "Storage"), item: storage, color: "bg-rose-400" },
      { id: "psu", label: tr("Fuente", "PSU"), item: psu, color: "bg-teal-400" },
      { id: "case", label: tr("Caja", "Case"), item: pcCase, color: "bg-indigo-400" },
      { id: "cooling", label: "Cooler", item: cooling, color: "bg-cyan-400" },
      { id: "fans", label: tr("Ventiladores", "Fans"), item: fans, color: "bg-fuchsia-400" },
    ];

    return categoriesToShow
      .filter((c) => c.item)
      .map((c) => ({
        id: c.id,
        label: c.label,
        price: c.item!.price,
        color: c.color,
        pct: Math.round((c.item!.price / totalPrice) * 100),
      }));
  }, [totalPrice, gpu, cpu, mobo, ram, storage, psu, pcCase, cooling, fans, tr]);

  const gpuPercentage = useMemo(() => {
    if (!gpu || totalPrice === 0) return 0;
    return Math.round((gpu.price / totalPrice) * 100);
  }, [gpu, totalPrice]);

  // Export build to clipboard
  const handleCopyBuild = () => {
    const pieza = (it: ItemCatalogo | null, etiquetaEs: string, etiquetaEn: string) =>
      it
        ? `• ${tr(etiquetaEs, etiquetaEn)}: ${it.name} (${precioTexto(it)})`
        : `• ${tr(etiquetaEs, etiquetaEn)}: ${tr("Pendiente", "Pending")}`;
    const lines = [
      tr("=== MI CONFIGURACIÓN PC GAMER 2026 ===", "=== MY 2026 GAMING PC BUILD ==="),
      tr(
        `Costo Estimado: $${totalPrice.toLocaleString("en-US")} USD (${textoPreciosConFechas(lang)}; no son el precio exacto)`,
        `Estimated cost: $${totalPrice.toLocaleString("en-US")} USD (${textoPreciosConFechas(lang)}; not the exact price)`
      ),
      tr(
        `Demanda Eléctrica: ~${estimatedWattage}W (Fuente recomendada: ${recommendedPsuWatts}W+)`,
        `Power draw: ~${estimatedWattage}W (recommended power supply: ${recommendedPsuWatts}W+)`
      ),
      `${tr("Estado", "Status")}: ${
        compatibilityIssues.length === 0
          ? tr("100% Compatible", "100% compatible")
          : `${compatibilityIssues.length} ${tr("Observaciones", "notes")}`
      }`,
      "",
      pieza(cpu as ItemCatalogo | null, "Procesador", "Processor"),
      pieza(mobo as ItemCatalogo | null, "Placa Base", "Motherboard"),
      pieza(ram as ItemCatalogo | null, "Memoria RAM", "Memory (RAM)"),
      pieza(gpu as ItemCatalogo | null, "Tarjeta Gráfica", "Graphics card"),
      pieza(storage as ItemCatalogo | null, "Almacenamiento", "Storage"),
      pieza(psu as ItemCatalogo | null, "Fuente de Poder", "Power supply"),
      pieza(pcCase as ItemCatalogo | null, "Gabinete", "Case"),
      pieza(cooling as ItemCatalogo | null, "Refrigeración", "Cooling"),
      ...(fans ? [pieza(fans, "Ventiladores", "Fans")] : []),
      ...(piezasGlobales.length > 0
        ? [
            "",
            tr(
              `Aviso: ${piezasGlobales.length} pieza(s) sin venta verificada en EE.UU.: ${piezasGlobales
                .map((it) => `${it.name} (${dato(it, "avisoDetalle")})`)
                .join("; ")}`,
              `Notice: ${piezasGlobales.length} part(s) with no verified US sale: ${piezasGlobales
                .map((it) => `${it.name} (${dato(it, "avisoDetalle")})`)
                .join("; ")}`
            ),
          ]
        : []),
      // con periféricos elegidos o un nivel en Setup completo
      ...(setupNivel || (setupProductos && setupProductos.length > 0)
        ? [
            "",
            ...(setupProductos && setupProductos.length > 0
              ? lineasSetupSeleccionado(setupProductos, setupNivel, lang)
              : lineasSetup(setupNivel!, lang)),
            "",
            tr(
              `TOTAL PC + SETUP: ${usd(totalPrice + totalSetupElegido)} USD`,
              `PC + SETUP TOTAL: ${usd(totalPrice + totalSetupElegido)} USD`
            ),
          ]
        : []),
      "",
      `${tr("Verificado en", "Checked at")} https://tupcgamer.com${ruta("configurador")}`,
    ];

    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Share link
  const handleShareLink = () => {
    if (typeof window === "undefined") return;
    try {
      const encoded = btoa(encodeURIComponent(JSON.stringify(selectedComponents)));
      const url = `${window.location.origin}${ruta("configurador")}?b=${encoded}${estilo !== "estandar" ? `&estilo=${estilo}` : ""}`;
      navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case "cpu":
        return Cpu;
      case "motherboard":
        return CircuitBoard;
      case "ram":
        return Layers;
      case "gpu":
        return Zap;
      case "storage":
        return HardDrive;
      case "psu":
        return Gauge;
      case "case":
        return Box;
      case "cooling":
        return Wind;
      case "fans":
        return Fan;
      default:
        return SlidersHorizontal;
    }
  };

  const getCategoryDefaultImage = (catId: string) => {
    switch (catId) {
      case "cpu":
        return "/images/components/cpu.jpg";
      case "motherboard":
        return "/images/components/motherboard.jpg";
      case "gpu":
        return "/images/components/gpu.jpg";
      case "ram":
        return "/images/components/ram.jpg";
      case "storage":
        return "/images/components/storage.jpg";
      case "psu":
        return "/images/components/psu.jpg";
      case "case":
        return "/images/components/case.jpg";
      case "cooling":
        return "/images/components/cooling.jpg";
      case "fans":
        return "/images/components/fans.jpg";
      default:
        return "/images/components/cpu.jpg";
    }
  };

  // Tarjeta de una versión (la ficha completa de siempre) dentro de "Elige la versión"
  const tarjetaVersion = (categoryId: string, item: ItemCatalogo, currentSelectedId: string | undefined, recomendada: boolean) => {
    const isChecked = currentSelectedId === item.id;
    const compat = checkItemCompatibility(categoryId, item);
    return (
      <div
        key={item.id}
        onClick={() => handleSelectComponent(categoryId, item.id)}
        {...vistaPrevia(item.image || getCategoryDefaultImage(categoryId), item.name)}
        className={`p-4 rounded-xl border text-left cursor-pointer transition-all relative group ${
          isChecked
            ? "bg-white/[0.08] border-white shadow-lg shadow-white/5 ring-1 ring-white/20"
            : compat.compatible
            ? "bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.06]"
            : "bg-rose-950/20 border-rose-900/30 opacity-70 hover:opacity-100 hover:border-rose-500/40"
        }`}
      >
        <div className="flex gap-3.5 items-start">
          <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-black/60 border border-white/10 p-1 flex items-center justify-center">
            <img
              src={item.image || getCategoryDefaultImage(categoryId)}
              alt={item.name}
              className="w-full h-full object-contain filter drop-shadow group-hover:scale-105 transition-transform duration-300 touch-manipulation"
              loading="lazy"
              {...ampliarAlTocar(item.image || getCategoryDefaultImage(categoryId), item.name)}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1 gap-2">
              <span className="text-sm font-medium text-white leading-snug">{item.name}</span>
              <span
                className={`text-xs font-mono font-semibold ml-2 shrink-0 ${
                  item.importacionGlobal ? "text-orange-300" : "text-white"
                }`}
              >
                {precioTexto(item)}
              </span>
            </div>

            <div className="text-xs text-gray-400 font-mono leading-relaxed space-y-0.5">
              <div>{dato(item, "specs")}</div>
              <div className="text-[11px] text-gray-500 flex flex-wrap gap-x-2 pt-0.5">
                {"socket" in item && <span>Socket: {item.socket}</span>}
                {"tdp" in item && <span>TDP: {item.tdp}W</span>}
                {"powerDraw" in item && <span>{tr("Consumo", "Draw")}: {item.powerDraw}W</span>}
                {"wattage" in item && <span>{tr("Capacidad", "Capacity")}: {item.wattage}W</span>}
                {"efficiency" in item && <span>{tr("Certif", "Cert")}: {item.efficiency}</span>}
              </div>
              {item.sinStock && (
                <div className="flex flex-wrap gap-x-2 pt-1">
                  <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                    {tr("Sin stock EE.UU. · precio de lista", "Out of stock in the US · list price")}
                  </span>
                </div>
              )}
              {item.importacionGlobal && (
                <div className="mt-1.5 px-2 py-1.5 rounded border border-orange-500/30 bg-orange-500/10 text-[10px] leading-snug text-orange-300">
                  <div className="font-semibold text-orange-400">{dato(item, "avisoTitulo")}</div>
                  <div>{dato(item, "avisoDetalle")}</div>
                  {item.avisoExtra && <div className="mt-0.5 text-orange-200">{dato(item, "avisoExtra")}</div>}
                  {item.avisoImportacion && (
                    <div className="mt-0.5 text-orange-200/80">{dato(item, "avisoImportacion")}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compatibility Badge on item */}
        <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between gap-2">
          {compat.compatible ? (
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 size={11} /> {tr("Compatible", "Compatible")}
            </span>
          ) : (
            <span className="text-[10px] font-mono text-rose-400 flex items-center gap-1">
              <AlertTriangle size={11} /> {compat.reason || tr("Incompatible", "Not compatible")}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            {recomendada && (
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                {tr("RECOMENDADA", "RECOMMENDED")}
              </span>
            )}
            {isChecked && (
              <span className="text-[10px] font-mono text-black bg-white px-1.5 py-0.5 rounded font-bold">
                {tr("ACTIVA", "ACTIVE")}
              </span>
            )}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen text-white flex flex-col selection:bg-white selection:text-black overflow-x-hidden">
      <SiteHeader />

      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-6 md:px-12 pt-10 md:pt-14 pb-28 lg:pb-14 w-full print:p-0">
        {/* Breadcrumb */}
        <div className="mb-6 print:hidden">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#08090a]/50 backdrop-blur-sm border border-white/10 text-[10px] font-mono tracking-widest text-gray-500 uppercase">
            <Link href={ruta("guias")} className="hover:text-white transition-colors">
              {tr("Guías", "Guides")}
            </Link>
            <span>/</span>
            <Link href={ruta("presupuestos")} className="hover:text-white transition-colors">
              {tr("Presupuestos", "Budgets")}
            </Link>
            <span>/</span>
            <span className="text-gray-300">{tr("Configurador Interactivo 2026", "Interactive Configurator 2026")}</span>
          </div>
        </div>

        {/* Intro & Controls Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/10 pb-8 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#08090a]/50 backdrop-blur-sm border border-white/10 text-[11px] font-mono tracking-[0.25em] text-emerald-400 uppercase mb-2">
              <ShieldCheck size={14} /> {tr("[ MOTOR DE COMPATIBILIDAD EN TIEMPO REAL ]", "[ REAL-TIME COMPATIBILITY ENGINE ]")}
            </div>
            <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-2">
              {tr("Arma tu PC pieza por pieza.", "Build your PC part by part.")}
            </h1>
            <p className="text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed font-sans font-light">
              {tr(
                "Filtra, ajusta y compara cada componente. El sistema detecta incompatibilidades de socket, cuello de botella de fuente y dimensiones de gabinete al instante.",
                "Filter, tweak and compare every part. The tool spots socket mismatches, power supply bottlenecks and case clearance problems instantly."
              )}
            </p>
          </div>

          {/* Preset Buttons & Reset (con el uso encima: gaming, streaming o IA local) */}
          {/* Preset Buttons & Reset */}
          <div className="flex flex-col gap-3 print:hidden">
            
            {/* Fila 1: Uso y Estilo */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              
              {/* Uso */}
              <div className="flex items-center gap-1.5" title={USOS.find((u) => u.id === usoPreset)?.descripcion}>
                <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest mr-1">
                  {tr("Uso:", "Use:")}
                </span>
                <div className="flex bg-[#08090a]/80 backdrop-blur-sm border border-white/10 p-0.5 rounded-lg shadow-inner">
                  {USOS.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => elegirUsoPreset(u.id)}
                      aria-pressed={usoPreset === u.id}
                      className={`px-3.5 py-1.5 rounded-md text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                        usoPreset === u.id
                          ? "bg-emerald-500 text-black font-bold shadow-sm"
                          : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Estilo */}
              <div className="flex items-center gap-1.5" title={ESTILOS.find((x) => x.id === estilo)?.descripcion}>
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
                      className={`px-3.5 py-1.5 rounded-md text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                        estilo === x.id
                          ? "bg-sky-400 text-black font-bold shadow-sm"
                          : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                      }`}
                    >
                      {x.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Fila 2: Presets probados */}
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest mr-1">
                {tr("Presets probados:", "Tested presets:")}
              </span>
              <div className="flex flex-wrap items-center bg-[#08090a]/80 backdrop-blur-sm border border-white/10 p-0.5 rounded-lg shadow-inner">
                {componentsData.tiers.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => handleLoadPreset(tier.id)}
                    className={`px-3.5 py-1.5 rounded-md text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      presetActivo === tier.id
                        ? "bg-white text-black font-bold shadow-sm"
                        : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    {txt(tier, "name", lang)}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleLoadPreset("")}
                title={tr("Limpiar selección", "Reset selection")}
                className="ml-2 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#08090a]/80 backdrop-blur-sm border border-white/10 text-gray-400 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 transition-all cursor-pointer shadow-sm"
              >
                <RotateCcw size={14} />
              </button>
            </div>
            
          </div>
        </div>

        {/* Global Toolbar: Search & Compatibility Toggle */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#08090a]/60 backdrop-blur-md border border-white/10 mb-8 print:hidden shadow-lg">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tr(
                "Buscar por modelo, marca o especificación (ej. AM5, RTX, Gen5)...",
                "Search by model, brand or spec (e.g. AM5, RTX, Gen5)..."
              )}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-white/40 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Toggles */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => setOnlyCompatible(!onlyCompatible)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono tracking-wider uppercase transition-all cursor-pointer border ${
                onlyCompatible
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                  : "bg-white/[0.02] border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              <ShieldCheck size={14} />
              <span>{tr("Ocultar Incompatibles", "Hide incompatible")}</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  onlyCompatible ? "bg-emerald-400 animate-pulse" : "bg-gray-600"
                }`}
              />
            </button>

            <span className="text-[11px] font-mono text-gray-400">
              {tr(
                `${piezasObligatorias} de ${CATEGORIAS_OBLIGATORIAS.length} componentes listos`,
                `${piezasObligatorias} of ${CATEGORIAS_OBLIGATORIAS.length} parts ready`
              )}
            </span>
          </div>
        </div>

        {/* Main Grid: Categories (Left 65%) + Summary Aside (Right 35%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Categories List */}
          <div className="lg:col-span-8 space-y-8">
            {componentsData.categories.map((category) => {
              const Icon = getCategoryIcon(category.id);
              const currentSelectedId = selectedComponents[category.id];
              const selectedItemObj = getItem(category.id, currentSelectedId);

              // Filter category items
              const activeFilterTag = categoryFilter[category.id] || "Todos";
              let items: any[] = category.items;

              // Apply search query
              if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                items = items.filter(
                  (it: any) =>
                    it.name.toLowerCase().includes(q) ||
                    (it.specs && it.specs.toLowerCase().includes(q)) ||
                    (it.brand && it.brand.toLowerCase().includes(q)) ||
                    (it.socket && it.socket.toLowerCase().includes(q))
                );
              }

              // Apply category tag filter
              if (activeFilterTag !== "Todos") {
                items = items.filter((it: any) => {
                  const tagLower = activeFilterTag.toLowerCase();
                  // Los formatos se comparan exactos: "mATX" y "E-ATX" contienen "atx", así que
                  // buscarlos como texto suelto hacía que el filtro "ATX" de las placas devolviera
                  // las 30 (24 ATX + 5 mATX + 1 E-ATX). Placas por formFactor, gabinetes por lo
                  // que admiten (supports).
                  const formato = FORMATOS_FILTRO[tagLower];
                  if (formato) {
                    if (it.formFactor) return it.formFactor === formato;
                    if (Array.isArray(it.supports)) return it.supports.includes(formato);
                    return false;
                  }
                  if (it.brand && it.brand.toLowerCase().includes(tagLower)) return true;
                  if (it.socket && it.socket.toLowerCase().includes(tagLower)) return true;
                  if (it.specs && it.specs.toLowerCase().includes(tagLower)) return true;
                  if (it.type && it.type.toLowerCase().includes(tagLower)) return true;
                  if (it.formFactor && it.formFactor.toLowerCase().includes(tagLower)) return true;
                  if (it.capacity && it.capacity.toLowerCase().includes(tagLower)) return true;
                  if (it.tierRange && it.tierRange.toLowerCase().includes(tagLower)) return true;
                  return false;
                });
              }

              // Estilo: pecera = sólo gabinetes pecera; pecera blanca = además, sólo lo blanco en las
              // categorías que tienen versión blanca (la CPU, la fuente o el SSD no cambian)
              let notaEstilo: string | null = null;
              if (estilo !== "estandar") {
                const antes = items.length;
                if (category.id === "case") items = items.filter((it: ItemCatalogo) => it.pecera);
                if (estilo === "pecera-blanca" && category.items.some((it: ItemCatalogo) => it.color === "blanco")) {
                  items = items.filter((it: ItemCatalogo) => it.color === "blanco");
                }
                if (items.length !== antes) {
                  notaEstilo = tr(
                    `Estilo ${ESTILOS.find((x) => x.id === estilo)?.label.toLowerCase()}: ${items.length} de ${antes}. Elige "Estándar" para ver todo.`,
                    `${ESTILOS.find((x) => x.id === estilo)?.label} style: ${items.length} of ${antes}. Pick "Standard" to see everything.`
                  );
                }
              }

              // Apply onlyCompatible toggle
              if (onlyCompatible) {
                items = items.filter((it) => checkItemCompatibility(category.id, it).compatible);
              }

              // Paso abierto: el que eligió el usuario o, mientras se busca, todos los que tengan resultados
              const buscando = searchQuery.trim().length > 0;
              const abierto = buscando ? items.length > 0 : pasoAbierto === category.id;
              const grupos = agrupar(category.id, items as ItemCatalogo[]);
              const grupoElegido = selectedItemObj ? (selectedItemObj as ItemCatalogo).grupo || selectedItemObj.id : null;
              // pocos modelos a la vista (+ "Ver más"); el elegido se ve siempre aunque sea más caro
              const isExpanded = !!expandedCategories[category.id];
              const hasMore = grupos.length > MODELOS_VISIBLES;
              const gruposVisibles =
                hasMore && !isExpanded
                  ? [...grupos.slice(0, MODELOS_VISIBLES), ...grupos.slice(MODELOS_VISIBLES).filter((g) => g.key === grupoElegido)]
                  : grupos;
              // "Elige la versión": del modelo recién pulsado o, si no, del de la pieza elegida
              const claveVersiones = modeloAbierto[category.id] !== undefined ? modeloAbierto[category.id] : grupoElegido;
              const grupoVersiones = grupos.find((g) => g.key === claveVersiones && g.versiones.length > 1) || null;
              const versionesVisibles = !grupoVersiones
                ? []
                : versionesTodas[category.id]
                ? grupoVersiones.versiones
                : grupoVersiones.versiones.filter((v, i) => i < VERSIONES_VISIBLES || v.id === currentSelectedId);
              const compatElegida = selectedItemObj ? checkItemCompatibility(category.id, selectedItemObj) : null;
              const ordenIds = componentsData.categories.map((c) => c.id);
              const posicion = ordenIds.indexOf(category.id);
              const idSiguiente =
                [...ordenIds.slice(posicion + 1), ...ordenIds.slice(0, posicion)].find((id) => !selectedComponents[id]) ||
                ordenIds[posicion + 1];
              const siguienteCat = componentsData.categories.find((c) => c.id === idSiguiente);
              const textoSiguiente = idSiguiente
                ? `${tr("Siguiente", "Next")}: ${siguienteCat ? txt(siguienteCat, "label", lang) : ""}`
                : tr("Ver resumen", "See summary");

              return (
                <div
                  key={category.id}
                  id={`paso-${category.id}`}
                  className={`p-4 md:p-5 bg-[#08090a]/60 backdrop-blur-md border rounded-xl space-y-4 transition-colors shadow-lg scroll-mt-24 ${
                    abierto ? "border-white/25" : "border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* Cabecera del paso: la pieza elegida en una línea; al pulsarla se abre o se cierra */}
                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setPasoAbierto(abierto && !buscando ? null : category.id)}
                      aria-expanded={abierto}
                      className="flex items-center gap-3 min-w-0 flex-1 text-left cursor-pointer"
                      {...vistaPrevia(
                        selectedItemObj
                          ? (selectedItemObj as ItemCatalogo).image || getCategoryDefaultImage(category.id)
                          : undefined,
                        selectedItemObj?.name ?? ""
                      )}
                    >
                      <div className="w-12 h-12 rounded-lg bg-black/60 border border-white/10 overflow-hidden flex items-center justify-center text-gray-300 shrink-0">
                        {selectedItemObj ? (
                          <img
                            src={(selectedItemObj as ItemCatalogo).image || getCategoryDefaultImage(category.id)}
                            alt={txt(category, "label", lang)}
                            className="w-full h-full object-contain p-0.5 filter drop-shadow touch-manipulation"
                            {...ampliarAlTocar(
                              (selectedItemObj as ItemCatalogo).image || getCategoryDefaultImage(category.id),
                              selectedItemObj.name
                            )}
                          />
                        ) : (
                          <Icon size={18} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono text-gray-500">
                            {posicion + 1}/{ordenIds.length}
                          </span>
                          <h3 className="text-base font-medium text-white tracking-tight">{txt(category, "label", lang)}</h3>
                          {compatElegida &&
                            (compatElegida.compatible ? (
                              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 size={11} /> {tr("Compatible", "Compatible")}
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono text-rose-400 flex items-center gap-1">
                                <AlertTriangle size={11} /> {compatElegida.reason || tr("Incompatible", "Not compatible")}
                              </span>
                            ))}
                        </div>
                        <div className="text-xs mt-0.5 truncate">
                          {selectedItemObj ? (
                            <span className="text-gray-200">
                              {selectedItemObj.name}{" "}
                              <span className="font-mono text-gray-400">— {precioTexto(selectedItemObj as ItemCatalogo)}</span>
                              {(selectedItemObj as ItemCatalogo).importacionGlobal && (
                                <span className="text-orange-400"> · {dato(selectedItemObj as ItemCatalogo, "avisoTitulo")}</span>
                              )}
                            </span>
                          ) : (
                            <span className="text-gray-500">{tr("Elige una pieza", "Pick a part")}</span>
                          )}
                        </div>
                      </div>
                    </button>

                    <div className="flex items-center gap-3 shrink-0">
                      {currentSelectedId && (
                        <button
                          onClick={(e) => handleRemoveComponent(category.id, e)}
                          className="text-[11px] font-mono text-gray-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                          title={tr("Quitar componente", "Remove part")}
                        >
                          <X size={13} />
                          <span className="hidden sm:inline">{tr("Quitar", "Remove")}</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setPasoAbierto(abierto && !buscando ? null : category.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                          abierto
                            ? "bg-white/[0.08] border-white/30 text-white"
                            : "bg-white/[0.03] border-white/10 text-gray-300 hover:text-white hover:border-white/30"
                        }`}
                      >
                        {abierto ? tr("Cerrar", "Close") : currentSelectedId ? tr("Cambiar", "Change") : tr("Elegir", "Choose")}
                        <ChevronDown size={13} className={`transition-transform duration-300 ${abierto ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                  </div>

                  {abierto && (
                    <div className="space-y-4 pt-3 border-t border-white/5">
                      {/* Filter Pills per category if available */}
                      {"filterOptions" in category && (category as any).filterOptions.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          {(category as any).filterOptions.map((opt: string) => {
                            const isFilterActive = activeFilterTag === opt;
                            return (
                              <button
                                key={opt}
                                onClick={() =>
                                  setCategoryFilter((prev) => ({
                                    ...prev,
                                    [category.id]: opt,
                                  }))
                                }
                                className={`px-2.5 py-1 rounded text-[10px] font-mono tracking-wider transition-all cursor-pointer border ${
                                  isFilterActive
                                    ? "bg-white text-black border-white font-semibold shadow-sm"
                                    : "bg-white/[0.03] border-white/10 text-gray-300 hover:text-white hover:border-white/30"
                                }`}
                              >
                                {nombreFiltro(opt, lang)}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {notaEstilo && <div className="text-[10px] font-mono text-sky-300">{notaEstilo}</div>}
                      {category.id === "fans" && (
                        <div className="text-[11px] text-gray-400 leading-relaxed">
                          {tr(
                            "Opcional. Los ventiladores reverse enseñan su luz hacia dentro mientras meten aire: van abajo y en el lateral de un gabinete pecera. Cada tarjeta es un pack; para llenar abajo y el lateral hacen falta dos.",
                            "Optional. Reverse fans show their lighting inward while pulling air in: they go at the bottom and side of a fishbowl case. Each card is one pack; filling both the bottom and the side takes two."
                          )}
                          {pcCase && (pcCase as ItemCatalogo).fanSlots && (
                            <span className="block mt-1 text-gray-300">
                              {tr("Tu gabinete", "Your case")}:{" "}
                              {(["bottom", "side"] as const)
                                .map((pos) => {
                                  const h = (pcCase as ItemCatalogo).fanSlots?.[pos];
                                  if (!h) return null;
                                  const donde = pos === "bottom" ? tr("abajo", "bottom") : tr("lateral", "side");
                                  const tams = [h["120"] ? `${h["120"]}×120` : "", h["140"] ? `${h["140"]}×140` : ""].filter(Boolean).join(tr(" o ", " or "));
                                  return `${donde} ${tams} mm${h.included ? tr(" (ya trae ventiladores)", " (fans included)") : ""}`;
                                })
                                .filter(Boolean)
                                .join(" · ")}
                            </span>
                          )}
                        </div>
                      )}
                      {grupos.length === 0 ? (
                        <div className="p-8 text-center rounded-lg bg-white/[0.01] border border-dashed border-white/10 text-xs font-mono text-gray-500">
                          {tr(
                            "No hay componentes que coincidan con los filtros seleccionados.",
                            "No parts match the selected filters."
                          )}
                        </div>
                      ) : (
                        <>
                          {/* Modelos: pocos a la vista, del más barato al más caro */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {gruposVisibles.map((g) => {
                              const elegido = g.key === grupoElegido;
                              const multi = g.versiones.length > 1;
                              const r = g.recomendada;
                              return (
                                <button
                                  key={g.key}
                                  type="button"
                                  onClick={() => elegirModelo(category.id, g)}
                                  {...vistaPrevia(r.image || getCategoryDefaultImage(category.id), g.nombre)}
                                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex gap-3 items-center ${
                                    elegido
                                      ? "bg-white/[0.08] border-white ring-1 ring-white/20"
                                      : g.compatible
                                      ? "bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.06]"
                                      : "bg-rose-950/20 border-rose-900/30 opacity-70 hover:opacity-100"
                                  }`}
                                >
                                  <div className="w-14 h-14 shrink-0 rounded-lg bg-black/60 border border-white/10 p-1 flex items-center justify-center overflow-hidden">
                                    <img
                                      src={r.image || getCategoryDefaultImage(category.id)}
                                      alt={g.nombre}
                                      className="w-full h-full object-contain touch-manipulation"
                                      loading="lazy"
                                      {...ampliarAlTocar(r.image || getCategoryDefaultImage(category.id), g.nombre)}
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0 space-y-0.5">
                                    <div className="flex items-start justify-between gap-2">
                                      <span className="text-sm font-medium text-white leading-snug">{g.nombre}</span>
                                      <span
                                        className={`text-xs font-mono font-semibold shrink-0 ${
                                          g.soloFuera ? "text-orange-300" : "text-white"
                                        }`}
                                      >
                                        {g.desde != null
                                          ? `${multi ? tr("desde ", "from ") : ""}${g.soloFuera ? "≈ " : ""}$${g.desde}`
                                          : tr("Sin precio", "No price")}
                                      </span>
                                    </div>
                                    <div className="text-[11px] font-mono text-gray-400 truncate">
                                      {multi
                                        ? `${g.versiones.length} ${tr("versiones", "versions")}${
                                            g.fuera && !g.soloFuera
                                              ? ` · ${g.fuera} ${tr("fuera de EE.UU.", "outside the US")}`
                                              : ""
                                          }`
                                        : dato(r, "specs")}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-mono flex-wrap">
                                      {g.compatible ? (
                                        <span className="text-emerald-400 flex items-center gap-1">
                                          <CheckCircle2 size={11} /> {tr("Compatible", "Compatible")}
                                        </span>
                                      ) : (
                                        <span className="text-rose-400 flex items-center gap-1">
                                          <AlertTriangle size={11} /> {g.razon || tr("Incompatible", "Not compatible")}
                                        </span>
                                      )}
                                      {g.soloFuera && <span className="text-orange-400">{dato(r, "avisoTitulo")}</span>}
                                      {!multi && r.sinStock && (
                                        <span className="text-amber-400">{tr("Sin stock EE.UU.", "Out of stock in the US")}</span>
                                      )}
                                      {elegido && (
                                        <span className="ml-auto text-black bg-white px-1.5 py-0.5 rounded font-bold">
                                          {tr("ELEGIDO", "CHOSEN")}
                                        </span>
                                      )}
                                    </div>
                                    {!multi && r.importacionGlobal && (
                                      <div className="text-[10px] text-orange-300 leading-snug">
                                        {dato(r, "avisoDetalle")}
                                        {r.avisoImportacion && (
                                          <span className="text-orange-200/80"> · {dato(r, "avisoImportacion")}</span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          {hasMore && (
                            <div className="flex justify-center">
                              <button
                                type="button"
                                onClick={() => toggleExpandCategory(category.id)}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#08090a]/50 hover:bg-[#08090a]/80 backdrop-blur-sm border border-white/10 hover:border-white/25 text-xs font-mono text-gray-300 hover:text-white transition-all cursor-pointer group shadow-sm"
                              >
                                <ChevronDown
                                  size={14}
                                  className={`transition-transform duration-300 ${
                                    isExpanded ? "rotate-180 text-emerald-400" : "text-gray-400 group-hover:text-white"
                                  }`}
                                />
                                <span>{isExpanded ? tr("Ver menos", "Show less") : tr("Ver más modelos", "Show more models")}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400 font-mono">
                                  {isExpanded ? `${grupos.length} ${tr("en total", "in total")}` : `+${grupos.length - MODELOS_VISIBLES}`}
                                </span>
                              </button>
                            </div>
                          )}

                          {/* Elige la versión: las marcas de ese modelo, con la recomendada marcada */}
                          {grupoVersiones && (
                            <div className="rounded-xl border border-white/10 bg-black/30 p-3 md:p-4 space-y-3">
                              <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <div className="text-xs font-mono uppercase tracking-widest text-gray-200">
                                  {tr("Elige la versión", "Choose the version")} · {grupoVersiones.nombre}
                                </div>
                                <div className="text-[10px] font-mono text-gray-500">
                                  {tr(
                                    "Recomendada: la más barata compatible con stock en EE.UU.",
                                    "Recommended: the cheapest compatible one in stock in the US"
                                  )}
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {versionesVisibles.map((v) =>
                                  tarjetaVersion(category.id, v, currentSelectedId, v.id === grupoVersiones.recomendada.id)
                                )}
                              </div>
                              {grupoVersiones.versiones.length > VERSIONES_VISIBLES && (
                                <div className="flex justify-center">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setVersionesTodas((prev) => ({ ...prev, [category.id]: !prev[category.id] }))
                                    }
                                    className="text-[11px] font-mono text-gray-400 hover:text-white underline cursor-pointer"
                                  >
                                    {versionesTodas[category.id]
                                      ? tr("Ver menos versiones", "Show fewer versions")
                                      : tr(
                                          `Ver las ${grupoVersiones.versiones.length} versiones`,
                                          `Show all ${grupoVersiones.versiones.length} versions`
                                        )}
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}

                      {/* Siguiente paso: a la próxima categoría sin pieza (o al resumen al terminar) */}
                      {currentSelectedId && !buscando && (
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => irAlSiguientePaso(category.id)}
                            className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded font-mono text-xs uppercase tracking-widest font-semibold hover:bg-gray-200 transition-all cursor-pointer"
                          >
                            {textoSiguiente}
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Summary Sidebar (Right Column) */}
          <div id="resumen" className="lg:col-span-4 lg:sticky lg:top-6 space-y-6 scroll-mt-24">
            <div className="p-4 sm:p-6 md:p-8 bg-[#0d0f12] border border-white/10 rounded-2xl space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs font-mono tracking-widest text-gray-400 uppercase">
                  {tr("RESUMEN DE TU BUILD", "YOUR BUILD SUMMARY")}
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <Sparkles size={12} /> 2026 VERIFIED
                </span>
              </div>

              {/* Status Alert Badge */}
              <div>
                {compatibilityIssues.length === 0 ? (
                  <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono flex items-center gap-2">
                    <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                    <div>
                      <div className="font-semibold">{tr("Compatibilidad 100% Garantizada", "100% Compatibility Guaranteed")}</div>
                      <div className="text-[10px] text-emerald-400/80 mt-0.5">
                        {tr(
                          "Sockets, memorias y dimensiones físicas verificados.",
                          "Sockets, memory and physical clearances checked."
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {compatibilityIssues.map((issue, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg text-xs font-mono flex items-start gap-2 ${
                          issue.type === "error"
                            ? "bg-rose-500/10 border border-rose-500/20 text-rose-300"
                            : "bg-amber-500/10 border border-amber-500/20 text-amber-300"
                        }`}
                      >
                        <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{issue.message}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Disponibilidad (naranja): aparte de la compatibilidad, que puede ser total */}
              {piezasGlobales.length > 0 && (
                <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-mono flex items-start gap-2">
                  <AlertTriangle size={15} className="shrink-0 mt-0.5 text-orange-400" />
                  <div className="leading-relaxed space-y-1">
                    <div className="font-semibold text-orange-400">
                      {piezasGlobales.length === 1
                        ? tr("1 pieza sin venta verificada en EE.UU.", "1 part with no verified US sale")
                        : tr(
                            `${piezasGlobales.length} piezas sin venta verificada en EE.UU.`,
                            `${piezasGlobales.length} parts with no verified US sale`
                          )}
                    </div>
                    {piezasGlobales.map((it) => (
                      <div key={it.id} className="text-[11px]">
                        {it.name}: {dato(it, "avisoDetalle")}
                        {it.avisoExtra ? `. ${dato(it, "avisoExtra")}` : ""}
                      </div>
                    ))}
                    <div className="text-[10px] text-orange-300/80">
                      {tr(
                        "Su precio es el de la tienda europea sin IVA, pasado a dólares, sin envío ni aranceles.",
                        "Their price is the European store price without VAT, converted to dollars, with no shipping or duties."
                      )}
                      {piezasGlobales.some((it) => it.sinPrecio)
                        ? tr(" Las piezas sin precio no suman al total.", " Parts with no price are not added to the total.")
                        : ""}
                    </div>
                  </div>
                </div>
              )}

              {/* Budget Distribution Visual Bar */}
              {totalPrice > 0 && (
                <div className="space-y-2 pt-1 border-t border-white/10">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Percent size={13} /> {tr("Distribución de Presupuesto:", "Budget split:")}
                    </span>
                    <span className="text-white font-semibold">
                      GPU: {gpuPercentage}%
                    </span>
                  </div>

                  {/* Multi-color segment bar */}
                  <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden flex">
                    {budgetShares.map((share) => (
                      <div
                        key={share.id}
                        style={{ width: `${share.pct}%` }}
                        className={`${share.color} h-full transition-all duration-300 hover:opacity-80`}
                        title={`${share.label}: $${share.price} (${share.pct}%)`}
                      />
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-mono text-gray-400 pt-1">
                    {budgetShares.slice(0, 4).map((s) => (
                      <span key={s.id} className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${s.color}`} />
                        {s.label} {s.pct}%
                      </span>
                    ))}
                  </div>

                  {/* consejo de gaming: en streaming e IA la CPU y la RAM pesan más a propósito; en las peceras,
                      el gabinete, la AIO y los ventiladores (compatibilidad.py les pide un 27 %) */}
                  {usoPreset === "gaming" && gpuPercentage > 0 && gpuPercentage < (estilo === "estandar" ? 30 : 27) && totalPrice > 700 && (
                    <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono text-amber-300 flex items-start gap-1.5 mt-2">
                      <Info size={13} className="shrink-0 mt-0.5" />
                      <span>
                        {tr(
                          `Tip Gamer: Tu GPU representa solo el ${gpuPercentage}%. Para máximo rendimiento en FPS, procura que ronde el 35-45%.`,
                          `Gamer tip: your GPU is only ${gpuPercentage}% of the build. For maximum FPS, aim for around 35-45%.`
                        )}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Power / Wattage Metrics */}
              <div className="p-4 rounded-lg bg-white/[0.03] border border-white/10 space-y-2.5 text-xs font-mono">
                <div className="flex justify-between items-center text-gray-400">
                  <span>{tr("Demanda Eléctrica:", "Power draw:")}</span>
                  <span className="text-white font-semibold">~{estimatedWattage} W</span>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>{tr("Fuente Sugerida:", "Suggested power supply:")}</span>
                  <span className="text-emerald-400 font-semibold">
                    {recommendedPsuWatts} W {tr("o más", "or more")}
                  </span>
                </div>
                {psu && (
                  <div className="flex justify-between items-center text-gray-400 pt-1 border-t border-white/5">
                    <span>{tr("Fuente Seleccionada:", "Chosen power supply:")}</span>
                    <span
                      className={
                        (psu as any).wattage >= recommendedPsuWatts
                          ? "text-emerald-300"
                          : (psu as any).wattage >= estimatedWattage
                          ? "text-amber-300"
                          : "text-rose-400 font-bold"
                      }
                    >
                      {(psu as any).wattage} W
                    </span>
                  </div>
                )}
              </div>

              {/* Components selected list breakdown */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-mono tracking-widest uppercase text-gray-400 block">
                  {tr("Piezas Seleccionadas:", "Chosen parts:")}
                </span>
                {componentsData.categories.map((cat) => {
                  const it = getItem(cat.id, selectedComponents[cat.id]);
                  return (
                    <div
                      key={cat.id}
                      className="flex justify-between items-center text-gray-300 py-1.5 border-b border-white/[0.03] gap-2 touch-manipulation"
                      {...vistaPrevia(it ? (it as ItemCatalogo).image || getCategoryDefaultImage(cat.id) : undefined, it?.name ?? "")}
                      {...ampliarAlTocar(it ? (it as ItemCatalogo).image || getCategoryDefaultImage(cat.id) : undefined, it?.name ?? "")}
                    >
                      <span className="text-gray-400 font-mono text-[11px] uppercase shrink-0">
                        {txt(cat, "label", lang)}:
                      </span>
                      {it ? (
                        <div className="flex items-center gap-2 truncate min-w-0 max-w-[200px] sm:max-w-xs">
                          <img
                            src={(it as any).image || getCategoryDefaultImage(cat.id)}
                            alt={it.name}
                            className="w-5 h-5 rounded object-contain bg-black/40 border border-white/10 shrink-0 p-0.5"
                          />
                          <span className={`truncate font-medium text-xs ${(it as ItemCatalogo).importacionGlobal ? "text-orange-300" : "text-white"}`}>
                            {it.name}{" "}
                            <span className="text-gray-400 font-mono text-[10px]">
                              (
                              {(it as ItemCatalogo).sinPrecio
                                ? tr("sin precio", "no price")
                                : `${(it as ItemCatalogo).importacionGlobal ? "≈ " : ""}$${it.price}`}
                              )
                            </span>
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-600 italic text-xs">{tr("Sin elegir", "Not chosen")}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Total Price */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-baseline">
                  <div>
                    <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                      {tr("Costo Total Estimado", "Estimated total cost")}
                    </div>
                    <div className="text-[11px] text-gray-400 font-mono">
                      {piezasGlobales.length > 0 && (
                        <span className="text-orange-400">
                          {tr("Incluye piezas fuera de EE.UU. (ver aviso)", "Includes parts from outside the US (see notice)")}
                        </span>
                      )}
                    </div>
                    <AvisoPrecios className="block max-w-[15rem] mt-0.5 text-[10px] leading-snug text-gray-500 font-mono" />
                  </div>
                  <div className="text-3xl font-medium tracking-tight text-white font-mono">
                    ${totalPrice.toLocaleString("en-US")}
                  </div>
                </div>
              </div>

              {/* Con un nivel elegido en Setup completo: sus periféricos y el total de PC + setup */}
              {(setupNivel || (setupProductos && setupProductos.length > 0)) && (
                <div className="p-3.5 rounded-lg bg-white/[0.03] border border-white/10 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between items-baseline text-gray-400">
                    <span>
                      {tr("Setup completo", "Full setup")}{setupNivel ? ` · ${nombreNivelSetup(setupNivel, lang)}` : ""}:
                    </span>
                    <span className="text-gray-200">+ {usd(totalSetupElegido)}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-1.5 border-t border-white/10">
                    <span className="text-[10px] tracking-widest uppercase text-emerald-400">
                      {tr("PC + Setup total", "Total PC + Setup")}
                    </span>
                    <span className="text-lg font-medium text-white">{usd(totalPrice + totalSetupElegido)}</span>
                  </div>
                  <Link href={ruta("setup")} className="block text-[11px] text-gray-400 hover:text-white underline">
                    {tr("Cambiar periféricos del setup", "Change setup peripherals")}
                  </Link>
                </div>
              )}

              {/* Actions: Copy, Share, Print */}
              <div className="space-y-2.5 print:hidden">
                <button
                  onClick={handleCopyBuild}
                  className="w-full inline-flex items-center justify-center gap-2 bg-white text-black py-3.5 rounded font-mono text-xs uppercase tracking-widest font-semibold hover:bg-gray-200 transition-all cursor-pointer"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? tr("¡Build Copiada al Portapapeles!", "Build copied to clipboard!") : tr("Copiar Lista Completa", "Copy full list")}
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleShareLink}
                    className="inline-flex items-center justify-center gap-1.5 bg-white/[0.04] border border-white/10 hover:border-white/30 text-white py-2.5 rounded font-mono text-[11px] uppercase tracking-wider transition-all cursor-pointer"
                  >
                    {linkCopied ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
                    {linkCopied ? tr("¡Enlace Copiado!", "Link copied!") : tr("Compartir Link", "Share link")}
                  </button>

                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center justify-center gap-1.5 bg-white/[0.04] border border-white/10 hover:border-white/30 text-white py-2.5 rounded font-mono text-[11px] uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <Printer size={13} />
                    {tr("Imprimir / PDF", "Print / PDF")}
                  </button>
                </div>
              </div>

              <div className="text-center pt-2 print:hidden">
                <Link
                  href={ruta("setup")}
                  className="text-xs font-mono text-gray-400 hover:text-white underline inline-flex items-center gap-1"
                >
                  {tr("Ver Periféricos Compatibles para esta Build", "See matching peripherals for this build")} &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <VistaPreviaFlotante soloIzquierda />
      <InformeEquipo
        componentes={selectedComponents}
        origenPc={tr("del Configurador", "from the Configurator")}
        setupNivel={setupNivel}
        setupProductos={setupProductos}
        notasPc={[
          `${tr("Compatibilidad", "Compatibility")}: ${
            compatibilityIssues.length === 0
              ? tr("100% compatible", "100% compatible")
              : compatibilityIssues.map((i) => i.message).join(" · ")
          }`,
          ...(estilo !== "estandar" ? [`${tr("Estilo", "Style")}: ${ESTILOS.find((x) => x.id === estilo)?.label}`] : []),
          tr(
            `Demanda eléctrica ~${estimatedWattage} W · fuente recomendada ${recommendedPsuWatts} W o más`,
            `Power draw ~${estimatedWattage} W · recommended power supply ${recommendedPsuWatts} W or more`
          ),
          ...(piezasGlobales.length > 0
            ? [
                tr(
                  `Sin venta verificada en EE.UU.: ${piezasGlobales.map((it) => it.name).join(", ")}`,
                  `No verified US sale: ${piezasGlobales.map((it) => it.name).join(", ")}`
                ),
              ]
            : []),
        ]}
      />

      {/* En móvil y tablet el resumen queda al final: una barra fija con total y estado */}
      <div className="lg:hidden print:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-[#0d0f12]/95 backdrop-blur-md px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-lg font-mono font-medium text-white leading-tight">${totalPrice.toLocaleString("en-US")}</div>
            <div
              className={`text-[11px] font-mono truncate ${
                compatibilityIssues.some((i) => i.type === "error")
                  ? "text-rose-400"
                  : compatibilityIssues.length > 0
                  ? "text-amber-300"
                  : "text-emerald-400"
              }`}
            >
              {tr(
                `${piezasObligatorias} de ${CATEGORIAS_OBLIGATORIAS.length} piezas`,
                `${piezasObligatorias} of ${CATEGORIAS_OBLIGATORIAS.length} parts`
              )}{" "}
              ·{" "}
              {compatibilityIssues.length === 0
                ? tr("Compatible", "Compatible")
                : tr(
                    `${compatibilityIssues.length} aviso${compatibilityIssues.length > 1 ? "s" : ""}`,
                    `${compatibilityIssues.length} notice${compatibilityIssues.length > 1 ? "s" : ""}`
                  )}
              {piezasGlobales.length > 0 && (
                <span className="text-orange-400"> · {tr("fuera de EE.UU.", "outside the US")}</span>
              )}
            </div>
          </div>
          <a
            href="#resumen"
            className="shrink-0 inline-flex items-center gap-1.5 bg-white text-black px-4 py-2 rounded font-mono text-xs uppercase tracking-widest font-semibold"
          >
            {tr("Ver resumen", "See summary")}
          </a>
        </div>
      </div>

      <SiteFooter className="bg-[#08090a]/80 backdrop-blur-md" />
    </div>
  );
}
