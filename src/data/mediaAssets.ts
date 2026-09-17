// Media configuration for PC Gamer Architecture Guide
// High-performance didactic guide integrated with components.json & guides.json 2026

export interface HardwareChapter {
  id: string;
  chapterNumber: string;
  title: string;
  subtitle: string;
  shortName: string;
  priceRange: string;
  compatibilityNotice: string;
  didacticExplanation: string;
  keySpecs: { label: string; value: string }[];
  image: string;
}

export const mediaAssets = {
  hero: {
    videoUrl: "/Prueba 3.mp4",
  },
  darkSection: {
    heroOverlayImage: "/images/Photoroom.png",
  },
  finalPage: {
    videoUrl: "/FinalPage.mp4",
  },
  catBackground: {
    imageUrl: "/images/Gato.jpeg",
  },
  chapters: [
    {
      id: "cpu",
      chapterNumber: "01",
      title: "El Cerebro: CPU & Arquitectura de Núcleos",
      subtitle: "Unidad Central de Procesamiento",
      shortName: "Procesadores (CPU)",
      priceRange: "$190 - $750 USD",
      compatibilityNotice: "El procesador y la placa base deben compartir la misma matriz física de pines: Socket AM5 para Ryzen serie 9000 o LGA1851 para Intel Core Ultra.",
      didacticExplanation: "Es el cerebro de tu equipo: procesa la lógica de los juegos, las físicas de colisión y calcula la posición de los jugadores antes de enviar los fotogramas a la GPU.",
      keySpecs: [
        { label: "Plataformas Clave", value: "AMD AM5 / Intel LGA1851" },
        { label: "Consumo Térmico (TDP)", value: "65W a 170W según gama" },
        { label: "Recomendados 2026", value: "Ryzen 5 9600X / Ryzen 7 9850X3D" }
      ],
      image: "https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624247/01_udnber.png"
    },
    {
      id: "motherboard",
      chapterNumber: "02",
      title: "El Sistema Nervioso: Placas Madre & Chipsets",
      subtitle: "Placa Base y Distribución de Corriente VRM",
      shortName: "Placa Base (Motherboard)",
      priceRange: "$110 - $400 USD",
      compatibilityNotice: "Verifica el factor de forma (ATX, Micro-ATX, Mini-ITX) para asegurar compatibilidad con tu gabinete y ranuras M.2 NVMe suficientes.",
      didacticExplanation: "Conecta todos los órganos de la PC. Sus fases de poder (VRM) alimentan limpiamente al procesador y definen el soporte de carriles PCIe 5.0 y memoria rápida.",
      keySpecs: [
        { label: "Chipsets Recomendados", value: "B650 / X870 (AMD) o Z890 (Intel)" },
        { label: "Memoria Soportada", value: "DDR5 de alta frecuencia" },
        { label: "Conectividad M.2", value: "NVMe PCIe 4.0 / PCIe 5.0 x4" }
      ],
      image: "https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624374/02_pmvxxl.png"
    },
    {
      id: "gpu",
      chapterNumber: "03",
      title: "El Músculo Visual: Gráficas (GPU) & Ray Tracing",
      subtitle: "Procesamiento Gráfico y Renderizado",
      shortName: "Tarjeta Gráfica (GPU)",
      priceRange: "$320 - $2,000 USD",
      compatibilityNotice: "Verifica el largo en milímetros (mm) de la tarjeta contra el espacio interior de tu gabinete y usa conectores nativos 12V-2x6 o PCIe 8-pines.",
      didacticExplanation: "La pieza que más define tu experiencia gamer. Genera los cuadros por segundo según la resolución objetivo (1080p, 1440p o 4K) sin pagar de más ni quedarte corto.",
      keySpecs: [
        { label: "VRAM Óptima", value: "8GB (1080p), 12-16GB (1440p), 24-32GB (4K)" },
        { label: "Gama Actual", value: "RTX 5060/5070/5080/5090 & RX 9060XT/9070XT" },
        { label: "Refrigeración", value: "Disipador triple fan con backplate metálico" }
      ],
      image: "https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624236/03_hcp3jc.png"
    },
    {
      id: "ram",
      chapterNumber: "04",
      title: "La Memoria Inmediata: RAM DDR5 & Latencias",
      subtitle: "Velocidad de Acceso y Multitarea Fluida",
      shortName: "Memoria RAM",
      priceRange: "$90 - $340 USD",
      compatibilityNotice: "Las memorias DDR5 no entran físicamente en placas DDR4. Usa 2 módulos en lugar de 4 (slots 2 y 4) para máxima estabilidad de reloj a 6000MHz.",
      didacticExplanation: "32 GB (2x16 GB) es el estándar de oro para jugar con fluidez absoluta mientras corres Discord, navegador y streaming sin tirones ni micro-cortes.",
      keySpecs: [
        { label: "Velocidad Sweet Spot", value: "DDR5-6000 MT/s CL30" },
        { label: "Configuración Óptima", value: "Kit Dual Channel (2 módulos iguales)" },
        { label: "Perfiles de Memoria", value: "AMD EXPO / Intel XMP 3.0" }
      ],
      image: "https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624256/04_get63z.png"
    },
    {
      id: "psu",
      chapterNumber: "05",
      title: "La Fuente Vital: Fuentes 80 Plus & Estándar ATX 3.1",
      subtitle: "Alimentación Continua y Eficiencia Energética",
      shortName: "Fuente de Poder (PSU)",
      priceRange: "$70 - $260 USD",
      compatibilityNotice: "Nunca ahorres en la fuente de poder. Suma el consumo de GPU + CPU y añade un margen de 150W para picos transitorios y norma ATX 3.1.",
      didacticExplanation: "Convierte la corriente alterna de la pared en voltajes limpios y protegidos. Una fuente certificada 80+ Gold o Platinum protege tu inversión ante cualquier fallo de red.",
      keySpecs: [
        { label: "Certificación Clave", value: "80 Plus Gold / Platinum / Cybenetics" },
        { label: "Estándar Actual", value: "ATX 3.1 con cable nativo PCIe 5.1 12V-2x6" },
        { label: "Rango Recomendado", value: "550W a 1000W según tarjeta gráfica" }
      ],
      image: "https://res.cloudinary.com/dsdxaxkiz/image/upload/v1779624251/05_kz1tyu.png"
    }
  ] as HardwareChapter[]
};
