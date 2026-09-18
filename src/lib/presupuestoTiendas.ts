import configStoreLinks from "@/data/configuradorStoreLinks.json";
import presupuestoLinks from "@/data/presupuestoStoreLinks.json";

export interface ComponentStoreInfo {
  store: string;
  url: string;
  backupStore: string;
  backupUrl: string;
  mpn?: string;
  amazonUrl?: string;
  neweggUrl?: string;
  officialUrl?: string;
  storeNote?: string;
  isGlobal?: boolean;
  sinStock?: boolean;
}

const CONFIG_MAP = ((configStoreLinks as any)?.items || {}) as Record<string, ComponentStoreInfo>;
const PRESUPUESTO_MAP = ((presupuestoLinks as any)?.items || {}) as Record<string, ComponentStoreInfo>;

/**
 * Retorna la información de tienda y enlaces directos / respaldo por MPN para cualquier componente,
 * tanto del Configurador (329 productos) como de Presupuestos (102 productos).
 *
 * Si el producto es de importación global (europeo/asiático), enlaza a su web oficial y al comparador Geizhals.
 * Si es de EE.UU., enlaza a la tienda verificada (Amazon/Newegg/Best Buy/B&H) con respaldo a la tienda alterna.
 */
export function obtenerInfoTienda(comp: {
  id?: string;
  mpn?: string;
  name?: string;
  brand?: string;
  disponibilidad?: string;
  sinStock?: boolean;
  importacionGlobal?: boolean;
}): ComponentStoreInfo {
  if (comp.id && CONFIG_MAP[comp.id]) {
    const item = CONFIG_MAP[comp.id];
    return {
      ...item,
      amazonUrl: item.amazonUrl || `https://www.amazon.com/s?k=${encodeURIComponent(item.mpn || comp.mpn || "")}`,
      neweggUrl: item.neweggUrl || `https://www.newegg.com/p/pl?d=${encodeURIComponent(item.mpn || comp.mpn || "")}`,
    };
  }

  if (comp.id && PRESUPUESTO_MAP[comp.id]) {
    const item = PRESUPUESTO_MAP[comp.id];
    return {
      store: item.store,
      url: item.url,
      backupStore: item.store === "Amazon" ? "Newegg" : "Amazon",
      backupUrl: (item.store === "Amazon" ? item.neweggUrl : item.amazonUrl) || item.url,
      amazonUrl: item.amazonUrl,
      neweggUrl: item.neweggUrl,
      officialUrl: item.officialUrl,
      storeNote: item.storeNote,
    };
  }

  // Fallback inteligente para componentes no mapeados o futuras adiciones
  const mpn = comp.mpn || "";
  const query = encodeURIComponent(mpn || `${comp.brand || ""} ${comp.name || ""}`.trim());
  const isGlobal = comp.disponibilidad === "importacion_global" || comp.importacionGlobal === true;

  if (isGlobal) {
    return {
      store: "Web Oficial",
      url: `https://www.google.com/search?q=${query}`,
      backupStore: "Geizhals (EU)",
      backupUrl: `https://geizhals.de/?fs=${query}`,
      isGlobal: true,
      sinStock: !!comp.sinStock,
    };
  }

  const amazonUrl = `https://www.amazon.com/s?k=${query}`;
  const neweggUrl = `https://www.newegg.com/p/pl?d=${query}`;

  return {
    store: "Amazon",
    url: amazonUrl,
    backupStore: "Newegg",
    backupUrl: neweggUrl,
    amazonUrl,
    neweggUrl,
    sinStock: !!comp.sinStock,
  };
}
