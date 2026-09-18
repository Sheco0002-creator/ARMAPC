import storeLinksData from "@/data/presupuestoStoreLinks.json";

export interface ComponentStoreInfo {
  store: string;
  url: string;
  amazonUrl: string;
  neweggUrl: string;
  officialUrl?: string;
  storeNote?: string;
}

const ITEMS_MAP = (storeLinksData as any).items as Record<string, ComponentStoreInfo>;

/**
 * Retorna la información de tienda y enlaces directos / respaldo por MPN para cualquier componente.
 * Si el componente no está en el mapa estático, genera dinámicamente los enlaces por MPN a Amazon y Newegg.
 */
export function obtenerInfoTienda(comp: {
  id?: string;
  mpn?: string;
  name?: string;
  brand?: string;
}): ComponentStoreInfo {
  if (comp.id && ITEMS_MAP[comp.id]) {
    return ITEMS_MAP[comp.id];
  }

  // Fallback inteligente para componentes no mapeados o futuras adiciones
  const mpn = comp.mpn || "";
  const query = encodeURIComponent(mpn || `${comp.brand || ""} ${comp.name || ""}`.trim());
  const amazonUrl = `https://www.amazon.com/s?k=${query}`;
  const neweggUrl = `https://www.newegg.com/p/pl?d=${query}`;

  return {
    store: "Amazon",
    url: amazonUrl,
    amazonUrl,
    neweggUrl,
  };
}
