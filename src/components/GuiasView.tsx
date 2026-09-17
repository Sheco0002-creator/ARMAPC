"use client";

import React, { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, X, CheckCircle2, ChevronRight, SlidersHorizontal, Sparkles, BookOpen } from "lucide-react";
import guidesData from "@/data/guides.json";
import InteractiveDeskScene from "@/components/InteractiveDeskScene";
import { GuiaEnsamblajeStepByStep } from "@/components/GuiaEnsamblajeStepByStep";
import { useIdioma } from "@/i18n/Idioma";
import { ARTICULOS_EN, ETIQUETAS_EN, TARJETAS_EN } from "@/data/guias.en";

// Extended didactic content for modal/expanded reader
const GUIDE_FULL_ARTICLES: Record<
  string,
  {
    keyPoints: string[];
    sections: { title: string; body: string }[];
  }
> = {
  glosario: {
    keyPoints: [
      "CPU: El cerebro que ejecuta la lógica y la física del juego.",
      "GPU: El músculo que dibuja los gráficos tridimensionales en pantalla.",
      "RAM: La mesa de trabajo ultrarrápida donde el juego carga datos inmediatos.",
      "Placa Madre: La columna vertebral que comunica a todos los órganos.",
      "Fuente (PSU): El corazón que bombea energía limpia a voltajes estables.",
    ],
    sections: [
      {
        title: "1. Unidad Central de Procesamiento (CPU)",
        body: "Es el procesador principal. Se encarga de calcular las trayectorias de las balas, la inteligencia artificial de los personajes no jugadores y sincronizar las órdenes que das con el teclado y el ratón. Para jugar, la velocidad por núcleo y el tamaño de la memoria caché (como 3D V-Cache de AMD) importan mucho más que tener 24 núcleos de oficina.",
      },
      {
        title: "2. Tarjeta de Video o Gráfica (GPU)",
        body: "Es la pieza responsable del 70% de tus fotogramas por segundo (FPS). Cuenta con miles de núcleos microscópicos diseñados para calcular geometría, sombras, reflejos e iluminación en tiempo real. Cuenta con su propia memoria dedicada llamada VRAM.",
      },
      {
        title: "3. Memoria de Acceso Aleatorio (RAM)",
        body: "Es la memoria temporal de alta velocidad. Cuando abres un juego, los escenarios y texturas se cargan del disco a la RAM para que la CPU y GPU accedan a ellos en nanosegundos. En 2026, 32 GB en configuración Dual Channel (2x16GB) es el estándar absoluto.",
      },
      {
        title: "4. Placa Base o Motherboard",
        body: "El circuito impreso principal. En ella se insertan el procesador, la memoria, la gráfica y los discos SSD. Determina qué procesadores puedes instalar (según el Socket) y cuántos puertos USB y ranuras M.2 tendrás.",
      },
    ],
  },
  compatibilidad: {
    keyPoints: [
      "El Socket físico de la CPU debe ser idéntico al de la placa madre.",
      "Las memorias DDR5 no entran en ranuras DDR4 ni viceversa.",
      "La longitud de la GPU no debe exceder los milímetros libres del gabinete.",
      "La fuente debe ofrecer al menos 150W de margen sobre el consumo total de GPU + CPU.",
    ],
    sections: [
      {
        title: "Regla 1: Socket del Procesador",
        body: "Si compras un AMD Ryzen 9000 necesitas una placa con socket AM5. Si compras un Intel Core Ultra serie 200 necesitas una placa con socket LGA1851. No hay adaptadores: los pines deben coincidir exactamente.",
      },
      {
        title: "Regla 2: Generación y Factor de Forma de RAM",
        body: "DDR5 y DDR4 tienen la muesca de seguridad en posiciones distintas para evitar accidentes eléctricos. Revisa la ficha técnica de tu placa madre antes de comprar.",
      },
      {
        title: "Regla 3: Espacio en Chasis y Disipador",
        body: "Las tarjetas gráficas modernas de 3 ventiladores superan los 300 mm de largo. Asegúrate de que tu gabinete admita esa longitud, especialmente si colocas un radiador de refrigeración líquida en el frente.",
      },
    ],
  },
  "elegir-gpu": {
    keyPoints: [
      "Define tu resolución: 1080p (8GB VRAM), 1440p (12-16GB VRAM), 4K (16-32GB VRAM).",
      "No compres una GPU de $1,000 USD si tienes un monitor de 60Hz de oficina.",
      "Revisa si tu fuente tiene los nuevos cables 12V-2x6 para evitar adaptadores rígidos.",
    ],
    sections: [
      {
        title: "La Resolución Dicta tu Elección",
        body: "Para jugar a 1080p con alta tasa de refresco, una RTX 5060 o RX 9060 XT ofrece el mejor rendimiento por dólar. Si juegas a 1440p (el sweet spot de 2026), la RTX 5070 o RX 9070 XT con al menos 12-16GB de VRAM te asegurará texturas ultra sin micro-tirones.",
      },
      {
        title: "¿NVIDIA o AMD?",
        body: "NVIDIA domina en eficiencia energética, trazado de rayos (Ray Tracing) y escalado con DLSS Frame Generation. AMD suele ofrecer mayor cantidad de memoria VRAM pura y excelente rendimiento en rasterización tradicional por un precio más agresivo.",
      },
    ],
  },
  "errores-comunes": {
    keyPoints: [
      "Ahorrar en la fuente de poder y comprar marcas genéricas sin certificación.",
      "Conectar el cable HDMI o DisplayPort a la placa madre en lugar de la GPU.",
      "Olvidar retirar el plástico protector transparente de la base del disipador de CPU.",
      "Instalar la memoria RAM en canales individuales sin activar el perfil XMP/EXPO.",
    ],
    sections: [
      {
        title: "El Conector de Video Equivocado",
        body: "Es el error novato número uno: conectar el monitor al puerto de la placa base en lugar de conectarlo directamente a los puertos de la tarjeta gráfica dedicada. Esto hace que el equipo use los gráficos integrados lentos en lugar de tu costosa GPU.",
      },
      {
        title: "El Plástico 'Invisible' del Disipador",
        body: "Muchos disipadores nuevos traen una lámina de plástico protectora que cubre la pasta térmica o la base de cobre. Si no la retiras, el procesador alcanzará 100°C en segundos y se apagará por protección térmica.",
      },
    ],
  },
  "cuanta-ram": {
    keyPoints: [
      "16 GB: Mínimo aceptable para presupuestos muy ajustados.",
      "32 GB (2x16GB): El estándar ideal en 2026 para no preocuparse nunca.",
      "64 GB: Solo justificado para edición 4K/8K, renderizado 3D y simuladores pesados.",
    ],
    sections: [
      {
        title: "¿Por qué 32 GB es el nuevo rey?",
        body: "Juegos contemporáneos como Cyberpunk, Starfield o Hogwarts Legacy consumen fácilmente 14 GB de memoria por sí solos. Con 16 GB, cualquier pestaña de Chrome, Discord o música en segundo plano forzará al sistema operativo a usar el disco como memoria swap, provocando caídas de FPS.",
      },
    ],
  },
  "fuente-de-poder": {
    keyPoints: [
      "La certificación 80 Plus mide eficiencia eléctrica, no calidad de componentes.",
      "Busca siempre protecciones OVP, UVP, OCP, SCP y OTP.",
      "Prefiere fuentes compatibles con la norma ATX 3.1 para soportar picos transitorios.",
    ],
    sections: [
      {
        title: "Qué significa 80+ Gold",
        body: "Significa que al menos el 90% de la energía que la fuente toma de la pared se entrega como corriente útil a tus componentes, disipando menos del 10% en forma de calor.",
      },
    ],
  },
  "elegir-cpu": {
    keyPoints: [
      "Los procesadores con memoria 3D V-Cache (como Ryzen 9850X3D) son los reyes del gaming.",
      "Para jugar no necesitas 24 núcleos; 6 a 8 núcleos modernos rinden al 100%.",
      "Revisa si el procesador incluye cooler de fábrica o si requiere disipador aparte.",
    ],
    sections: [
      {
        title: "La Trampa de los Núcleos",
        body: "Un procesador de 8 núcleos modernos de alta frecuencia supera por amplio margen en videojuegos a uno de 16 núcleos antiguos. Los juegos prefieren latencia de memoria baja e instrucciones rápidas por ciclo (IPC).",
      },
    ],
  },
  almacenamiento: {
    keyPoints: [
      "NVMe M.2 PCIe 4.0 es el estándar más equilibrado en precio y velocidad.",
      "Los SSD SATA son útiles para almacenar juegos secundarios o archivos.",
      "Un SSD rápido acelera la carga de escenarios y elimina el popping de texturas.",
    ],
    sections: [
      {
        title: "SATA vs NVMe Gen4",
        body: "Un disco SSD SATA transfiere a unos 550 MB/s, mientras que un NVMe M.2 Gen4 alcanza 7,000 MB/s. Aunque en juegos la diferencia de carga ronda los 2 a 4 segundos, el soporte de DirectStorage hace que NVMe sea indispensable.",
      },
    ],
  },
  "liquidos-pecera": {
    keyPoints: [
      "Usa agua destilada con aditivo o un líquido premezclado para PC; nunca agua del grifo ni anticongelante de coche.",
      "El transparente (incoloro o con tinte) es el que menos mantenimiento pide y el más seguro para empezar.",
      "Los pastel (opacos) y los de brillo se ven espectaculares en una pecera, pero ensucian más y piden limpieza frecuente.",
      "No mezcles marcas ni tipos de líquido, y no mezcles aluminio con cobre en el mismo circuito.",
      "Antes de encender la PC, deja el circuito lleno funcionando 24 horas sólo con la bomba para buscar fugas.",
    ],
    sections: [
      {
        title: "AIO o circuito abierto: dónde entra el líquido",
        body: "Un AIO (líquida de circuito cerrado) viene sellado de fábrica: no se rellena ni se elige su líquido, y es lo que usa el configurador. El circuito abierto (custom loop) se arma pieza a pieza —bloque de CPU o GPU, radiador, bomba, depósito y tubos— y tú eliges y cambias el líquido. En una pecera, con vidrio por dos lados, el líquido está siempre a la vista, así que su color forma parte del diseño.",
      },
      {
        title: "1. Agua destilada con aditivo",
        body: "La opción más barata y la que mejor enfría. El agua debe ser destilada o desionizada, nunca del grifo ni mineral: sus sales dejan depósitos y corroen. Se le añade un aditivo o concentrado para PC (biocida contra algas y bacterias e inhibidor de corrosión) en la dosis que indique el fabricante. Es totalmente transparente, así que el color lo ponen los tubos y la iluminación.",
      },
      {
        title: "2. Premezclados transparentes (incoloros o con tinte)",
        body: "Vienen listos para verter, con biocida e inhibidor incluidos, en versión incolora o teñida (rojo, azul, verde, morado...). Por ejemplo: Corsair Hydro X XL8, EK-CryoFuel Clear o Mayhems XT-1. Son la mejor elección para una primera pecera: casi no dejan residuos y el tinte da color sin los problemas de los opacos. Con luz UV o LED intensa, algunos tintes pierden color con los meses.",
      },
      {
        title: "3. Pastel u opacos (colores sólidos)",
        body: "Llevan partículas en suspensión que dan un color sólido y mate, como Mayhems Pastel o EK-CryoFuel Solid. El blanco pastel es el favorito de las peceras blancas. A cambio, las partículas pueden asentarse si la PC pasa mucho tiempo apagada y ensucian los microcanales de los bloques: revisa el circuito cada pocos meses y lava bien las piezas al cambiarlo. Enfrían un poco menos que los transparentes.",
      },
      {
        title: "4. Con brillo, nacarados o reactivos a UV",
        body: "Llevan micropartículas que forman remolinos brillantes al moverse (tipo Mayhems Aurora) o brillan con luz ultravioleta. Son los más llamativos para fotos y vídeo, y también los más delicados: se asientan, manchan tubos y bloques y piden limpieza completa a menudo. Elígelos sólo si aceptas ese mantenimiento; para una PC de uso diario es mejor un transparente con tinte.",
      },
      {
        title: "Lo que nunca debes usar",
        body: "Agua del grifo, agua mineral, bebidas o agua con colorante alimentario; anticongelante o refrigerante de coche, que corroe y ataca juntas y tubos; y mezclas de líquidos de distintas marcas o tipos, que pueden reaccionar y formar gel o sedimento. Tampoco mezcles metales: con un radiador de aluminio y bloques de cobre, la corrosión galvánica los degrada. En PC lo normal es cobre, latón y níquel en todo el circuito.",
      },
      {
        title: "Tubos: rígidos o flexibles",
        body: "Los rígidos (PETG o acrílico) son los de las peceras de exposición: líneas rectas y limpias, pero hay que doblarlos con calor y cortarlos con precisión. Los flexibles son más fáciles y perdonan errores; elige buena calidad, porque los baratos sueltan plastificante que enturbia el líquido. Con líquidos pastel, el tubo rígido transparente es el que mejor luce el color.",
      },
      {
        title: "Llenado, prueba de fugas y mantenimiento",
        body: "Llena el circuito desde el depósito con la fuente desconectada de la placa y de la gráfica; un puente de 24 pines enciende la fuente para alimentar sólo la bomba. Deja la bomba funcionando 24 horas con papel absorbente bajo cada unión: si sigue seco, puedes conectar el resto. Inclina el gabinete con cuidado para sacar las burbujas. Como referencia, un transparente se cambia más o menos una vez al año y un pastel o con brillo cada pocos meses; sigue siempre lo que diga el fabricante del líquido y cámbialo antes si lo ves turbio, con sedimento o manchas.",
      },
    ],
  },
  "gabinete-refrigeracion": {
    keyPoints: [
      "El frente debe ser de malla (Mesh) perforada para permitir entrada de aire fresco.",
      "Presión positiva (más ventiladores metiendo aire que sacando) reduce la acumulación de polvo.",
      "Disipador de aire grande es más confiable a largo plazo que una líquida económica.",
    ],
    sections: [
      {
        title: "Flujo de Aire Frontal vs Vidrio Sellado",
        body: "Evita gabinetes con frontal de vidrio sin aberturas laterales generosas. Aunque luzcan modernos con luces, asfixian a la tarjeta gráfica aumentando sus temperaturas en 15°C a 20°C.",
      },
    ],
  },
};

interface GuiasViewProps {
  isRoot?: boolean;
}

export function GuiasView({ isRoot = false }: GuiasViewProps) {
  const [selectedTag, setSelectedTag] = useState<string>("FUNDAMENTALES");
  const [activeArticleSlug, setActiveArticleSlug] = useState<string | null>(null);
  const { en, tr, ruta } = useIdioma();
  // Función auxiliar: los filtros siguen comparando las etiquetas españolas internamente; sólo cambia el texto mostrado según el idioma
  const etiqueta = (tag: string) => (en ? (ETIQUETAS_EN[tag] ?? tag) : tag);

  const guides = guidesData.guides.map((g) => (en && TARJETAS_EN[g.slug] ? { ...g, ...TARJETAS_EN[g.slug] } : g));
  const FUNDAMENTAL_SLUGS = ["liquidos-pecera", "errores-comunes", "glosario"];
  const tags = ["FUNDAMENTALES", "TODAS", "GPU", "CPU", "RAM", "FUENTE", "SSD", "GABINETE", "LÍQUIDA"];

  // Filtra las guías según la etiqueta seleccionada. Si es 'FUNDAMENTALES', muestra solo las más importantes.
  const filteredGuides =
    selectedTag === "FUNDAMENTALES"
      ? guides.filter((g) => FUNDAMENTAL_SLUGS.includes(g.slug))
      : selectedTag === "TODAS"
      ? guides
      : guides.filter((g) => g.tag.toUpperCase() === selectedTag.toUpperCase());

  // Obtiene la metadata de la guía actualmente seleccionada en el modal
  const currentArticle = activeArticleSlug
    ? guides.find((g) => g.slug === activeArticleSlug)
    : null;

  // Obtiene el contenido detallado de la guía seleccionada, usando el idioma correspondiente
  const currentArticleDetails = activeArticleSlug
    ? (en ? ARTICULOS_EN[activeArticleSlug] : undefined) ?? GUIDE_FULL_ARTICLES[activeArticleSlug]
    : null;

  return (
    <div className="relative min-h-screen text-white flex flex-col selection:bg-white selection:text-black overflow-x-hidden">
      <SiteHeader />

      <main className="relative z-10 flex-1 max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-24 w-full">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#08090a]/50 backdrop-blur-sm border border-white/10 text-[10px] font-mono tracking-widest text-gray-500 uppercase">
            {isRoot ? (
              <>
                <span className="text-gray-300">{tr("Guías Educativas 2026", "Learning Guides 2026")}</span>
                <span>/</span>
                <span>{tr("Hardware sin sobreprecio", "Hardware without the markup")}</span>
              </>
            ) : (
              <>
                <Link href={ruta("guias")} className="hover:text-white transition-colors">
                  {tr("Guías", "Guides")}
                </Link>
                <span>/</span>
                <span className="text-gray-300">{tr("Guías Educativas", "Learning Guides")}</span>
              </>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="border-b border-white/10 pb-8 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#08090a]/50 backdrop-blur-sm border border-white/10 text-[11px] font-mono tracking-[0.25em] text-emerald-400 uppercase mb-3">
            {tr("[ ACADEMIA DE HARDWARE 2026 ]", "[ HARDWARE ACADEMY 2026 ]")}
          </div>
          <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-4">
            {tr("Guías didácticas sin tecnicismos innecesarios.", "Easy-to-follow guides without needless jargon.")}
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-3xl leading-relaxed font-sans font-light">
            {tr(
              "Aprende a elegir y ensamblar cada componente con explicaciones sencillas, comprobadas en bancos de pruebas reales. Sin jerga vacía ni recomendaciones patrocinadas.",
              "Learn to choose and assemble every component with simple explanations, checked on real test benches. No empty jargon and no sponsored picks."
            )}
          </p>
        </div>

        {/* Mesa de Taller Interactiva con Capas WebP */}
        <InteractiveDeskScene />

        {/* Guía de Ensamblaje Paso a Paso: Del Unboxing al Primer Encendido */}
        <div className="border-t border-white/10 pt-16 mb-4">
          <GuiaEnsamblajeStepByStep />
        </div>

        {/* Separador y Encabezado de la Biblioteca de Guías Didácticas */}
        <div className="border-t border-white/10 pt-12 pb-6 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#08090a]/50 backdrop-blur-sm border border-white/10 text-[11px] font-mono tracking-[0.25em] text-emerald-400 uppercase mb-3">
            <BookOpen size={13} className="text-amber-400" />
            {tr("[ GUÍAS FUNDAMENTALES Y CONSEJOS ESTRATÉGICOS ]", "[ ESSENTIAL GUIDES & STRATEGIC TIPS ]")}
          </div>
          <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-white mb-2">
            {tr("Reglas de compatibilidad, glosario y prevención de errores", "Compatibility rules, glossary and mistake prevention")}
          </h2>
          <p className="text-sm text-gray-400 max-w-2xl font-sans">
            {tr(
              "Guías transversales que se mantienen en esta sección para consulta rápida. Los consejos específicos de cada componente individual (CPU, GPU, RAM, SSD, Fuente y Gabinete) se encuentran también integrados directamente en cada pieza de la mesa de taller interactiva.",
              "General guides kept here for quick reference. Tips for each individual component (CPU, GPU, RAM, SSD, power supply and case) are also built right into each part of the interactive workshop table."
            )}
          </p>
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap items-center bg-[#08090a]/80 backdrop-blur-sm border border-white/10 p-0.5 rounded-lg shadow-inner mb-10">
          {tags.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3.5 py-1.5 rounded-md text-[11px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white text-black font-bold shadow-sm"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {etiqueta(tag)}
              </button>
            );
          })}
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredGuides.map((guide) => {
            const isFundamental = FUNDAMENTAL_SLUGS.includes(guide.slug);

            return (
              <div
                key={guide.slug}
                onClick={() => setActiveArticleSlug(guide.slug)}
                className={`group bg-[#08090a]/45 backdrop-blur-md border p-6 rounded-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:bg-[#08090a]/65 cursor-pointer ${
                  isFundamental
                    ? "border-amber-500/30 hover:border-amber-400/60"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono tracking-widest uppercase text-gray-400 mb-4">
                    <span
                      className={`px-2 py-0.5 rounded font-medium ${
                        isFundamental
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      {isFundamental ? "★ " + etiqueta(guide.tag) : etiqueta(guide.tag)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {guide.readMinutes} {tr("min lectura", "min read")}
                    </span>
                  </div>

                  <h3 className="text-lg font-medium text-white group-hover:text-gray-200 mb-3 tracking-tight transition-colors">
                    {guide.title}
                  </h3>

                  <p className="text-xs text-gray-400 leading-relaxed font-sans mb-6">
                    {guide.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono uppercase tracking-wider text-gray-300 group-hover:text-white">
                  <span>{tr("Leer Guía Completa", "Read Full Guide")}</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Help banner */}
        <div className="p-8 bg-[#08090a]/50 backdrop-blur-md border border-white/10 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-medium text-white mb-1">
              {tr("¿Quieres comprobar si tus piezas encajan?", "Want to check whether your parts fit together?")}
            </h3>
            <p className="text-xs text-gray-400">
              {tr("El configurador calcula automáticamente el wattage y los sockets.", "The configurator checks wattage and sockets automatically.")}
            </p>
          </div>
          <Link
            href={ruta("configurador")}
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded font-mono text-xs uppercase tracking-widest font-semibold hover:bg-gray-200 transition-all cursor-pointer whitespace-nowrap"
          >
            <SlidersHorizontal size={14} />
            {tr("Abrir Configurador", "Open Configurator")}
          </Link>
        </div>
      </main>

      {/* Reader Modal for Selected Guide */}
      <AnimatePresence>
        {activeArticleSlug && currentArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveArticleSlug(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-[#0d0f12] text-white rounded-xl border border-white/15 shadow-2xl z-10 flex flex-col p-6 md:p-10"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-gray-400">
                  <span className="bg-white/10 px-2 py-0.5 rounded text-white">
                    {etiqueta(currentArticle.tag)}
                  </span>
                  <span>{currentArticle.readMinutes} {tr("MIN DE LECTURA", "MIN READ")}</span>
                </div>
                <button
                  onClick={() => setActiveArticleSlug(null)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  aria-label={tr("Cerrar guía", "Close guide")}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Title & Summary */}
              <h2 className="text-2xl md:text-3xl font-medium tracking-tight mb-4">
                {currentArticle.title}
              </h2>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed font-sans mb-8">
                {currentArticle.summary}
              </p>

              {/* Key Takeaways */}
              {currentArticleDetails && (
                <div className="p-5 rounded-lg bg-white/[0.04] border border-white/10 mb-8 space-y-3">
                  <div className="text-[10px] font-mono tracking-widest uppercase text-gray-400 flex items-center gap-2">
                    <Sparkles size={12} className="text-amber-300" />
                    {tr("PUNTOS CLAVE PARA RECORDAR", "KEY POINTS TO REMEMBER")}
                  </div>
                  <ul className="space-y-2 text-xs md:text-sm text-gray-200">
                    {currentArticleDetails.keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Detailed Sections */}
              {currentArticleDetails?.sections && (
                <div className="space-y-6 text-sm text-gray-300 leading-relaxed font-sans mb-8">
                  {currentArticleDetails.sections.map((sec, i) => (
                    <div key={i} className="space-y-2">
                      <h4 className="text-base font-medium text-white">{sec.title}</h4>
                      <p>{sec.body}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-mono text-gray-500">
                  {tr("ARMAPC GUÍA DIDÁCTICA VERIFICADA 2026", "ARMAPC VERIFIED GUIDE 2026")}
                </span>
                <Link
                  href={ruta("configurador")}
                  onClick={() => setActiveArticleSlug(null)}
                  className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded font-mono text-xs uppercase tracking-wider font-semibold hover:bg-gray-200 transition-colors"
                >
                  <SlidersHorizontal size={13} />
                  {tr("Simular esta build", "Simulate this build")}
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <SiteFooter className="bg-[#08090a]/80 backdrop-blur-md" />
    </div>
  );
}
