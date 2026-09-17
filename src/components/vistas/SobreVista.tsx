import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import { BookOpen, SlidersHorizontal, Globe, Monitor } from "lucide-react";
import { ruta, traductor, type Lang } from "@/i18n/rutas";

export function SobreVista({ lang }: { lang: Lang }) {
  const tr = traductor(lang);
  const en = lang === "en";
  const pilares = [
    {
      titulo: tr("Presupuestos Reales en USD", "Real Budgets in USD"),
      texto: tr(
        "Configuraciones balanceadas por nivel para gaming, streaming e IA local, basadas en precios oficiales MSRP y minoristas de referencia en EE.UU. (Amazon, Newegg, Best Buy, Micro Center).",
        "Balanced builds for every level, for gaming, streaming and local AI, based on official MSRP and reference US retailers (Amazon, Newegg, Best Buy, Micro Center)."
      ),
    },
    {
      titulo: tr("Configurador Inteligente", "Smart Configurator"),
      texto: tr(
        "Motor interactivo que valida en tiempo real sockets, dimensiones de tarjeta gráfica frente al gabinete y demanda eléctrica en watts para evitar fuentes cortas.",
        "An interactive engine that checks sockets, graphics card size against the case, and power draw in watts in real time, so your power supply is never too small."
      ),
    },
    {
      titulo: tr("Guías Didácticas Claras", "Clear, Practical Guides"),
      texto: tr(
        "Explicaciones técnicas rigurosas redactadas en español llano y directo, sin dar por sentado que ya eres ingeniero de sistemas ni abrumarte con tecnicismos vacíos.",
        "Rigorous technical explanations in plain, direct language, without assuming you're already an engineer or burying you in empty jargon."
      ),
    },
    {
      titulo: tr("Setup Completo", "Full Setup"),
      texto: tr(
        "Monitor, teclado, ratón, audio, silla y kit de streaming a la altura de tu PC, con modelos reales por nivel. Tu PC y tu setup se suman en una sola lista y un solo PDF.",
        "Monitor, keyboard, mouse, audio, chair and streaming kit to match your PC, with real models for each level. Your PC and your setup add up in one list and one PDF."
      ),
    },
  ];

  return (
    <div className="relative min-h-screen text-white flex flex-col selection:bg-white selection:text-black overflow-x-hidden">
      <SiteHeader />

      <main className="relative z-10 flex-1 max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#08090a]/50 backdrop-blur-sm border border-white/10 text-[10px] font-mono tracking-widest text-gray-500 uppercase">
            <Link href={ruta(lang, "guias")} className="hover:text-white transition-colors">
              {tr("Guías", "Guides")}
            </Link>
            <span>/</span>
            <span className="text-gray-300">{tr("Sobre Nosotros", "About Us")}</span>
          </div>
        </div>

        {/* Header */}
        <div className="border-b border-white/10 pb-10 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#08090a]/50 backdrop-blur-sm border border-white/10 text-[11px] font-mono tracking-[0.25em] text-emerald-400 uppercase mb-3">
            <Globe size={14} /> {tr("[ MANIFIESTO EDITORIAL // EE.UU. & MERCADO GLOBAL ]", "[ EDITORIAL MANIFESTO // US & GLOBAL MARKET ]")}
          </div>
          <h1 className="text-3xl md:text-5xl font-medium tracking-tight leading-tight text-white mb-6">
            {tr(
              "Armar tu propia PC gamer no debería ser un privilegio de expertos.",
              "Building your own gaming PC shouldn't be a privilege for experts."
            )}
          </h1>
          <p className="text-base md:text-lg text-gray-300 leading-relaxed font-sans font-light">
            {tr(
              "Con la información correcta, cualquiera puede hacerlo: aprovechando la transparencia del mercado de hardware en Estados Unidos y a nivel mundial, ahorrando dinero y entendiendo con exactitud cada componente que compras.",
              "With the right information, anyone can do it: taking advantage of how transparent the hardware market is in the United States and worldwide, saving money and understanding exactly every part you buy."
            )}
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-16 text-gray-300 font-sans leading-relaxed">
          {/* Section 1: Qué hacemos */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium text-white tracking-tight flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-white" />
              {tr("Qué hacemos", "What we do")}
            </h2>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
              {en ? (
                <>
                  We are an <strong className="text-white font-semibold">independent educational guide</strong>, not a store. Our
                  goal is to help anyone —in English or in Spanish, whether they live in the <strong className="text-white">United States</strong> or
                  buy and import parts from anywhere in the world— choose their hardware with technical judgment, avoiding middleman
                  markups and compatibility mistakes:
                </>
              ) : (
                <>
                  Somos una <strong className="text-white font-semibold">guía educativa independiente</strong>, no una tienda. Nuestro
                  objetivo es que la comunidad hispanohablante —tanto quienes residen en los{" "}
                  <strong className="text-white">Estados Unidos</strong> como quienes arman o importan componentes desde cualquier
                  parte del mundo— pueda elegir su hardware con criterio técnico, evitando sobreprecios de intermediarios y errores de
                  compatibilidad:
                </>
              )}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {pilares.map((p, i) => (
                <div key={p.titulo} className="p-6 bg-[#08090a]/45 backdrop-blur-md border border-white/10 rounded-lg">
                  <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
                    0{i + 1}. {tr("PILAR", "PILLAR")}
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">{p.titulo}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{p.texto}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: En qué creemos */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium text-white tracking-tight flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-white" />
              {tr("En qué creemos", "What we believe in")}
            </h2>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
              {en ? (
                <>
                  We believe in honest data. The US tech market serves as the global benchmark for prices and availability. By basing
                  our numbers on <strong className="text-white">US Dollars ($ USD)</strong> and manufacturer suggested retail prices
                  (MSRP), we give you a clean, neutral point of comparison, free from the speculation that often affects local stores.
                </>
              ) : (
                <>
                  Creemos en la honestidad de datos. El mercado tecnológico de Estados Unidos sirve como estándar global de precios y
                  disponibilidad. Al basar nuestras métricas en <strong className="text-white">Dólares Estadounidenses ($ USD)</strong> y
                  precios de venta al consumidor recomendados por fabricantes (MSRP), te ofrecemos un punto de comparación limpio y
                  neutral, sin la especulación que a menudo afecta a las tiendas locales.
                </>
              )}
            </p>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
              {tr(
                "Cuando un componente es una excelente compra por su relación precio/rendimiento, te explicamos por qué. Y cuando un procesador o gráfica tiene sobreprecio o requiere una fuente desproporcionada, te alertamos antes de que gastes tu dinero.",
                "When a part is a great buy for its price-to-performance, we explain why. And when a processor or graphics card is overpriced or needs an oversized power supply, we warn you before you spend your money."
              )}
            </p>
          </section>

          {/* Section 3: Por qué existe ArmaPC */}
          <section className="p-8 md:p-10 bg-[#08090a]/50 backdrop-blur-md border border-white/10 rounded-xl space-y-6">
            <div className="text-[10px] font-mono tracking-[0.2em] text-emerald-400 uppercase">
              {tr("HISTORIA DEL PROYECTO", "PROJECT STORY")}
            </div>
            <h2 className="text-xl md:text-2xl font-medium text-white tracking-tight">
              {tr("Por qué existe ArmaPC", "Why ArmaPC exists")}
            </h2>
            <div className="space-y-4 text-sm md:text-base text-gray-300 leading-relaxed">
              {en ? (
                <>
                  <p>
                    Millions of people in the United States and across the Americas buy PC parts from US stores every year, many of
                    them building a computer for the first time. More than 42 million of them also speak Spanish at home.
                  </p>
                  <p>
                    Yet most tools either assume you already know everything, or are commercial blogs trying to sell you leftover
                    stock. Almost none take the time to explain <em>why</em> DDR5-6000 CL30 memory is the sweet spot for gaming, or{" "}
                    <em>how</em> to work out the power headroom of an ATX 3.1 power supply.
                  </p>
                  <p>
                    ArmaPC was born to fill that gap: to put the best hardware information from the US and international market within
                    everyone&apos;s reach, in English and in Spanish, patiently, without detours, and with interactive tools that do the
                    math for you.
                  </p>
                  <p className="text-white font-medium">
                    Whether it&apos;s your first time building a PC or you want to upgrade your rig for the demands of 2026, you&apos;re in
                    the right place.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    En los Estados Unidos viven más de 42 millones de personas que hablan español en su día a día, y en el resto del
                    continente y del mundo millones más compran piezas directamente en comercios estadounidenses aprovechando ofertas
                    en línea y servicios de paquetería internacional.
                  </p>
                  <p>
                    Sin embargo, la mayoría de herramientas y análisis de compatibilidad serios solo existen en inglés, o bien se
                    limitan a blogs comerciales que intentan venderte inventario sobrante. Casi ninguna herramienta se toma el tiempo
                    de explicar didácticamente <em>por qué</em> una memoria DDR5 a 6000MHz CL30 es el estándar ideal para gaming, o{" "}
                    <em>cómo</em> calcular el margen eléctrico de una fuente ATX 3.1.
                  </p>
                  <p>
                    ArmaPC nació para llenar ese vacío: poner la mejor información de hardware del mercado estadounidense e
                    internacional al alcance de la comunidad hispana, con paciencia, sin rodeos y con herramientas interactivas que
                    hacen los cálculos matemáticos por ti.
                  </p>
                  <p className="text-white font-medium">
                    Si es tu primera vez armando una computadora personal o si buscas actualizar tu equipo para las exigencias de 2026,
                    estás en el lugar correcto.
                  </p>
                </>
              )}
            </div>
          </section>

          {/* Section 4: Cómo nos financiamos */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-medium text-white tracking-tight flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-white" />
              {tr("Transparencia y Financiamiento (Normativa FTC)", "Transparency and Funding (FTC Guidelines)")}
            </h2>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
              {tr(
                "Mantener este portal con bases de datos sincronizadas y algoritmos en tiempo real conlleva costos de infraestructura. Para sostenerlo 100% gratuito y libre para el usuario, participamos en programas de afiliación autorizados (como el programa de afiliados de Amazon y redes de distribuidores de EE.UU.) y mostramos publicidad moderada a través de Google AdSense.",
                "Running this site with synced databases and real-time tools has infrastructure costs. To keep it 100% free for you, we take part in authorized affiliate programs (such as the Amazon Associates program and US retailer networks) and show moderate advertising through Google AdSense."
              )}
            </p>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
              {en ? (
                <>
                  In line with the US Federal Trade Commission (FTC) guidelines: if you buy a part after clicking one of our retail
                  links, we may earn a small commission <strong>at no extra cost to you</strong>. Our editorial commitment is
                  non-negotiable: we never recommend a part because of a business deal, only for its genuine technical value.
                </>
              ) : (
                <>
                  Conforme a las pautas de la Comisión Federal de Comercio (FTC) de EE.UU.: si decides adquirir una pieza haciendo clic
                  en nuestros enlaces comerciales, recibimos una pequeña comisión publicitaria{" "}
                  <strong>sin que a ti te cueste un solo centavo extra</strong>. Nuestro compromiso editorial es innegociable: jamás
                  recomendamos una pieza basándonos en acuerdos comerciales, sino en su valor técnico genuino.
                </>
              )}
            </p>
          </section>

          {/* CTA Box */}
          <div className="p-6 md:p-8 rounded-2xl bg-[#08090a]/50 backdrop-blur-sm border border-white/10 flex flex-col sm:flex-row gap-6 items-center justify-between mt-12 shadow-xl">
            <div>
              <div className="text-white font-medium text-lg mb-1">{tr("¿Listo para armar tu equipo?", "Ready to build your rig?")}</div>
              <div className="text-xs text-gray-400 font-mono">
                {tr("Comprueba compatibilidad y wattage ahora mismo.", "Check compatibility and wattage right now.")}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={ruta(lang, "configurador")}
                className="inline-flex items-center gap-2 bg-white text-black px-5 py-3 rounded font-mono text-xs uppercase tracking-wider font-semibold hover:bg-gray-200 transition-all cursor-pointer"
              >
                <SlidersHorizontal size={14} />
                {tr("Configurador", "Configurator")}
              </Link>
              <Link
                href={ruta(lang, "setup")}
                className="inline-flex items-center gap-2 border border-white/20 text-white px-5 py-3 rounded font-mono text-xs uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer"
              >
                <Monitor size={14} />
                {tr("Setup Completo", "Full Setup")}
              </Link>
              <Link
                href={ruta(lang, "guias")}
                className="inline-flex items-center gap-2 border border-white/20 text-white px-5 py-3 rounded font-mono text-xs uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer"
              >
                <BookOpen size={14} />
                {tr("Ver Guías", "View Guides")}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter className="bg-[#08090a]/80 backdrop-blur-md" />
    </div>
  );
}
