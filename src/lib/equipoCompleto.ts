// PC + setup completo (15-09-2026). El usuario arma la PC en el configurador (o elige una build en
// presupuestos) y el monitor y periféricos en Setup completo; antes cada página sólo conocía lo suyo,
// así que el total, el texto copiado y el PDF salían por separado. Aquí vive lo que comparten:
// - useEquipo: la última PC elegida y el nivel del setup, guardados en el navegador (localStorage)
//   para que sigan al cambiar de página o recargar.
// - Precios y listas del setup (antes dentro de setup-completo/page.tsx) y de la PC, en texto.
// - El azar de las miniaturas del setup.
import { useEffect, useState, useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import componentsData from "@/data/components.json";
import setupProducts from "@/data/setupProducts.json";
import type { TierType } from "@/store/useConfiguratorStore";
import { txt } from "@/i18n/datos";
import type { Lang } from "@/i18n/rutas";

// ---------- Setup: periféricos reales (generado por exportar_setup.py; no editar a mano) ----------

export interface SetupProduct {
  id: string;
  module: string;
  tier: string;
  kind: string | null;
  brand: string;
  model: string;
  mpn: string | null;
  price: number;
  store: string;
  url: string;
  stock: string | null;
  specs: { label: string; value: string }[];
  note: string | null;
  image: string | null;
  // versión inglesa (setup/setup-perifericos-en.json, 15-09-2026)
  kindEn?: string | null;
  specsEn?: { label: string; value: string }[];
  noteEn?: string | null;
  stockEn?: string | null;
  storeEn?: string;
}

/** Tipo del periférico ("ratón", "mouse") en el idioma de la página. */
export const tipoDe = (p: SetupProduct, lang: Lang) => (lang === "en" ? (p.kindEn ?? p.kind) : p.kind);

export const SETUP_PRODUCTS = setupProducts.items as SetupProduct[];

export const productosDe = (moduleId: string, tier: TierType) =>
  SETUP_PRODUCTS.filter((p) => p.module === moduleId && p.tier === tier);

// Mismo tipo = alternativas (cuenta la más barata); tipos distintos se complementan y se suman
export const precioModulo = (productos: SetupProduct[]) => {
  const porTipo = new Map<string, number>();
  for (const p of productos) {
    const k = p.kind ?? "";
    porTipo.set(k, Math.min(porTipo.get(k) ?? Infinity, p.price));
  }
  return [...porTipo.values()].reduce((a, b) => a + b, 0);
};

export const hayAlternativas = (productos: SetupProduct[]) =>
  new Set(productos.map((p) => p.kind ?? "")).size < productos.length;

export const usd = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Módulos del setup (el resto de su ficha está en components/vistas/SetupVista.tsx)
export const MODULOS_SETUP: { id: string; label: string; labelEn: string; optional?: boolean }[] = [
  { id: "monitor", label: "Pantalla & Refresco", labelEn: "Display & Refresh" },
  { id: "keyboard", label: "Teclado & Entrada", labelEn: "Keyboard & Input" },
  { id: "mouse", label: "Ratón & Mousepad", labelEn: "Mouse & Mousepad" },
  { id: "audio", label: "Audio & Comunicación", labelEn: "Audio & Voice" },
  { id: "ergonomics", label: "Silla & Escritorio", labelEn: "Chair & Desk" },
  { id: "accessories", label: "Brazos & Conectividad", labelEn: "Arms & Connectivity" },
  { id: "streaming", label: "Streaming (Opcional)", labelEn: "Streaming (Optional)", optional: true }, // no entra en el total
  { id: "coolant", label: "Líquidos para Pecera (Opcional)", labelEn: "Fishbowl Coolant (Optional)", optional: true }, // 17-09-2026, no entra en el total
];

export const nombreModulo = (m: { label: string; labelEn: string }, lang: Lang) => (lang === "en" ? m.labelEn : m.label);

const NOMBRE_NIVEL_SETUP_RECORD: Record<Lang, Record<TierType, string>> = {
  es: { entrada: "Nivel Entrada", media: "Nivel Medio", alta: "Nivel Alto", extrema: "Nivel Extremo" },
  en: { entrada: "Entry Level", media: "Mid Level", alta: "High Level", extrema: "Extreme Level" },
};
export const NOMBRE_NIVEL_SETUP = NOMBRE_NIVEL_SETUP_RECORD.es;
export const nombreNivelSetup = (nivel: TierType, lang: Lang) => NOMBRE_NIVEL_SETUP_RECORD[lang][nivel];

// Total del setup: la opción más barata de cada tipo de periférico, sin módulos opcionales
export const totalSetup = (nivel: TierType) =>
  MODULOS_SETUP.filter((m) => !m.optional).reduce((s, m) => s + precioModulo(productosDe(m.id, nivel)), 0);

export const totalStreaming = (nivel: TierType) => precioModulo(productosDe("streaming", nivel));

export const totalLiquidos = (nivel: TierType) => precioModulo(productosDe("coolant", nivel));

export function lineasSetup(nivel: TierType, lang: Lang): string[] {
  const en = lang === "en";
  const lineas = [
    en
      ? `--- FULL SETUP · ${nombreNivelSetup(nivel, lang)}: from ${usd(totalSetup(nivel))} USD ---`
      : `--- SETUP COMPLETO · ${nombreNivelSetup(nivel, lang)}: desde ${usd(totalSetup(nivel))} USD ---`,
  ];
  for (const m of MODULOS_SETUP) {
    const productos = productosDe(m.id, nivel);
    if (productos.length === 0) continue;
    // mismo tipo = alternativas ("o"); tipos distintos van en líneas aparte
    const porTipo = new Map<string, SetupProduct[]>();
    for (const p of productos) porTipo.set(p.kind ?? "", [...(porTipo.get(p.kind ?? "") ?? []), p]);
    const modulo = nombreModulo(m, lang).replace(en ? " (Optional)" : " (Opcional)", "");
    for (const lista of porTipo.values()) {
      const tipo = tipoDe(lista[0], lang);
      const nombre = tipo ? `${modulo} · ${tipo}` : modulo;
      const opciones = lista.map((p) => `${p.brand} ${p.model} (${usd(p.price)})`).join(en ? " or " : " o ");
      lineas.push(`• ${nombre}${m.optional ? (en ? " [optional, not added]" : " [opcional, no suma]") : ""}: ${opciones}`);
    }
  }
  return lineas;
}

// ---------- Uso de las builds (15-09-2026) ----------
// Cada nivel trae 3 builds de gaming, 1 de streaming y 1 de IA local (compatibilidad.py, PERFILES);
// Presupuestos y el configurador las separan con un selector "Uso".

export type UsoBuild = "gaming" | "streaming" | "ia";

type InfoUso = { id: UsoBuild; label: string; titulo: string; descripcion: string };

const USOS_POR_IDIOMA: Record<Lang, InfoUso[]> = {
  es: [
    {
      id: "gaming",
      label: "Gaming",
      titulo: "PC Gamer",
      descripcion: "Máximos FPS: la gráfica se lleva la mayor parte del presupuesto.",
    },
    {
      id: "streaming",
      label: "Streaming",
      titulo: "PC para Streaming",
      descripcion:
        "Juega y transmite en el mismo PC: más núcleos para OBS y NVENC de NVIDIA (AV1) para codificar sin perder FPS. 32 GB de RAM.",
    },
    {
      id: "ia",
      label: "IA local",
      titulo: "PC para IA local",
      descripcion:
        "Modelos de IA en tu propio PC (LM Studio, Ollama, ComfyUI): 16 GB de VRAM, el máximo con stock hoy en EE.UU., y 32 a 64 GB de RAM.",
    },
  ],
  en: [
    {
      id: "gaming",
      label: "Gaming",
      titulo: "Gaming PC",
      descripcion: "Maximum FPS: the graphics card takes most of the budget.",
    },
    {
      id: "streaming",
      label: "Streaming",
      titulo: "Streaming PC",
      descripcion:
        "Game and stream on the same PC: more cores for OBS and NVIDIA NVENC (AV1) to encode without losing FPS. 32 GB of RAM.",
    },
    {
      id: "ia",
      label: "Local AI",
      titulo: "Local AI PC",
      descripcion:
        "AI models on your own PC (LM Studio, Ollama, ComfyUI): 16 GB of VRAM, the most in stock in the US today, and 32 to 64 GB of RAM.",
    },
  ],
};

/** Los tres usos (gaming, streaming, IA local) con sus textos en el idioma de la página. */
export const USOS_POR_IDIOMA_LOCAL = USOS_POR_IDIOMA;
export const USOS_BUILD = USOS_POR_IDIOMA.es;
export const usosBuild = (lang: Lang) => USOS_POR_IDIOMA[lang];

export const usoDe = (b: { uso?: string }): UsoBuild =>
  b.uso === "streaming" || b.uso === "ia" ? b.uso : "gaming";

export const esUso = (v: string | null): v is UsoBuild => v === "gaming" || v === "streaming" || v === "ia";

// ---------- Estilo de las builds (16-09-2026) ----------
// Cada nivel trae además 1 build "pecera" (gabinete de cristal panorámico, AIO y ventiladores reverse) y
// 1 "pecera blanca" (todo lo que tiene versión blanca, en blanco), en gaming, streaming e IA (compatibilidad.py, ESTILOS).

export type EstiloBuild = "estandar" | "pecera" | "pecera-blanca";

type InfoEstilo = { id: EstiloBuild; label: string; descripcion: string };

const ESTILOS_POR_IDIOMA: Record<Lang, InfoEstilo[]> = {
  es: [
    { id: "estandar", label: "Estándar", descripcion: "Las builds de siempre: la mejor pieza por precio, del color que sea." },
    {
      id: "pecera",
      label: "Pecera",
      descripcion:
        "Gabinete de cristal panorámico (frontal y lateral), refrigeración líquida AIO y ventiladores reverse abajo, que enseñan su luz a través del cristal.",
    },
    {
      id: "pecera-blanca",
      label: "Pecera blanca",
      descripcion:
        "La pecera con gabinete, placa, RAM, gráfica, AIO y ventiladores blancos cuando hay versión blanca con stock. La fuente y el SSD quedan tapados.",
    },
  ],
  en: [
    { id: "estandar", label: "Standard", descripcion: "The usual builds: the best part for the price, in any color." },
    {
      id: "pecera",
      label: "Fishbowl",
      descripcion:
        "Panoramic glass case (front and side), AIO liquid cooling and reverse fans at the bottom that show their lighting through the glass.",
    },
    {
      id: "pecera-blanca",
      label: "White fishbowl",
      descripcion:
        "The fishbowl with a white case, motherboard, RAM, graphics card, AIO and fans whenever a white version is in stock. The power supply and SSD stay hidden.",
    },
  ],
};

export const estilosBuild = (lang: Lang) => ESTILOS_POR_IDIOMA[lang];

export const estiloDe = (b: { estilo?: string }): EstiloBuild =>
  b.estilo === "pecera" || b.estilo === "pecera-blanca" ? b.estilo : "estandar";

export const esEstilo = (v: string | null): v is EstiloBuild => v === "estandar" || v === "pecera" || v === "pecera-blanca";

/** Categorías que hacen falta para una PC completa (los ventiladores son opcionales). */
export const CATEGORIAS_OBLIGATORIAS = componentsData.categories.filter((c) => !("optional" in c && c.optional)).map((c) => c.id);

// ---------- PC ----------

type ItemPc = { id: string; name: string; price: number; sinPrecio?: boolean; importacionGlobal?: boolean };

export function piezasPc(componentes: Record<string, string>, lang: Lang = "es") {
  return componentsData.categories
    .map((cat) => {
      const item = (cat.items as ItemPc[]).find((it) => it.id === componentes[cat.id]);
      return item ? { categoria: txt(cat, "label", lang) ?? cat.label, item } : null;
    })
    .filter((p): p is { categoria: string; item: ItemPc } => p !== null);
}

export const totalPc = (componentes: Record<string, string>) =>
  piezasPc(componentes).reduce((s, p) => s + p.item.price, 0);

export const precioPiezaTexto = (it: ItemPc, lang: Lang = "es") =>
  it.sinPrecio
    ? lang === "en"
      ? "no price"
      : "sin precio"
    : `${it.importacionGlobal ? "≈ " : ""}$${it.price.toLocaleString("en-US")}`;

// ---------- Lo guardado en el navegador ----------

export type PcGuardada = {
  componentes: Record<string, string>;
  origen: "configurador" | "presupuestos";
  nombre?: string; // build de presupuestos ("Ryzen 7 7700X + RTX 5070")
  nivel?: string | null; // preset o nivel de donde salió
  uso?: UsoBuild; // gaming, streaming o ia (el selector "Uso")
  estilo?: EstiloBuild; // estándar, pecera o pecera blanca (el selector "Estilo")
};

type EstadoEquipo = {
  pc: PcGuardada | null;
  setupNivel: TierType | null; // null = sin nivel (no se ha elegido o se pulsó "Reset")
  guardarPc: (pc: PcGuardada) => void;
  guardarSetupNivel: (nivel: TierType | null) => void;
};

export const useEquipo = create<EstadoEquipo>()(
  persist(
    (set) => ({
      pc: null,
      setupNivel: null,
      guardarPc: (pc) => set({ pc }),
      guardarSetupNivel: (setupNivel) => set({ setupNivel }),
    }),
    {
      name: "armapc-equipo",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ pc: s.pc, setupNivel: s.setupNivel }),
      // Se carga después de montar: el servidor no conoce el localStorage y el primer render del
      // navegador tiene que ser igual al suyo (si no, error de hidratación)
      skipHydration: true,
    }
  )
);

// Carga lo guardado al montar la página. alCargar recibe el estado recién leído (p. ej. el
// configurador pone la PC guardada); devuelve true cuando ya se puede guardar sin pisar nada.
export function useCargarEquipo(alCargar?: (e: EstadoEquipo) => void) {
  const [listo, setListo] = useState(false);
  useEffect(() => {
    Promise.resolve(useEquipo.persist.rehydrate()).then(() => {
      alCargar?.(useEquipo.getState());
      setListo(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sólo al montar
  }, []);
  return listo;
}

// ---------- Azar de las miniaturas ----------

// Una semilla por visita. En el servidor es 0 (página estática) y justo después de montar se cambia
// por la del navegador; el mismo truco que AvisoPrecios, para no romper la hidratación.
let semilla: number | null = null;
const leerSemilla = () => (semilla ??= Math.floor(Math.random() * 2 ** 31));
const avisarAlMontar = (avisar: () => void) => {
  const id = setTimeout(avisar, 0);
  return () => clearTimeout(id);
};
export const useSemillaAzar = () => useSyncExternalStore(avisarAlMontar, leerSemilla, () => 0);

// Índice "al azar" pero estable para una misma semilla y clave (no cambia en cada render)
export function indiceAlAzar(semillaVisita: number, clave: string, n: number) {
  let h = semillaVisita ^ 0x9e3779b9;
  for (let i = 0; i < clave.length; i++) h = Math.imul(h ^ clave.charCodeAt(i), 0x85ebca6b);
  h ^= h >>> 13;
  return (h >>> 0) % n;
}
