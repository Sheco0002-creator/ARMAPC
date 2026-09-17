import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import { Scale } from "lucide-react";
import { ruta, traductor, type Lang } from "@/i18n/rutas";

const Correo = () => (
  <a href="mailto:contacto@tupcgamer.com" className="text-white underline font-mono">
    contacto@tupcgamer.com
  </a>
);

function Titulo({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <h2 className="text-lg md:text-xl font-medium text-white tracking-tight flex items-center gap-2">
      <span className="text-xs font-mono text-gray-400">{n}.</span> {children}
    </h2>
  );
}

export function TerminosVista({ lang }: { lang: Lang }) {
  const tr = traductor(lang);
  const en = lang === "en";

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
            <span className="text-gray-300">{tr("Términos y Condiciones", "Terms and Conditions")}</span>
          </div>
        </div>

        {/* Header */}
        <div className="border-b border-white/10 pb-8 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#08090a]/50 backdrop-blur-sm border border-white/10 text-[11px] font-mono tracking-[0.25em] text-emerald-400 uppercase mb-3">
            <Scale size={13} /> {tr("[ MARCO LEGAL & CONDICIONES DE USO // EE.UU. & GLOBAL ]", "[ LEGAL FRAMEWORK & TERMS OF USE // US & GLOBAL ]")}
          </div>
          <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-4">
            {tr("Términos y Condiciones", "Terms and Conditions")}
          </h1>
          <p className="text-xs font-mono text-gray-400 tracking-wider uppercase">
            {tr(
              "ÚLTIMA ACTUALIZACIÓN: SEPTIEMBRE DE 2026 // EDICIÓN ESTADOS UNIDOS & INTERNACIONAL",
              "LAST UPDATED: SEPTEMBER 2026 // UNITED STATES & INTERNATIONAL EDITION"
            )}
          </p>
        </div>

        {/* Legal Text Body */}
        <div className="p-8 md:p-12 rounded-2xl bg-[#08090a]/60 backdrop-blur-md border border-white/10 space-y-12 text-gray-300 font-sans leading-relaxed text-sm md:text-base shadow-2xl">
          <p className="text-base md:text-lg text-gray-300 leading-relaxed font-light">
            {en ? (
              <>
                Welcome to <strong className="text-white font-medium">ArmaPC</strong>. By accessing, browsing or using this website,
                our interactive build simulators, guides and technical compatibility engines, you agree to be bound by these Terms and
                Conditions of Use, drafted in accordance with the laws of the <strong className="text-white">United States of America</strong>{" "}
                and international business guidelines. Please read them carefully before using our services.
              </>
            ) : (
              <>
                Bienvenido a <strong className="text-white font-medium">ArmaPC</strong>. Al acceder, navegar o utilizar este portal
                web, nuestros simuladores interactivos de ensamblaje, guías didácticas y motores de compatibilidad técnica, aceptas
                quedar sujeto a los presentes Términos y Condiciones de Uso, formulados de conformidad con la legislación de los{" "}
                <strong className="text-white">Estados Unidos de América</strong> y las directrices comerciales internacionales. Te
                solicitamos leerlos detenidamente antes de utilizar nuestros servicios.
              </>
            )}
          </p>

          {/* 01. Naturaleza del Servicio */}
          <section className="space-y-3">
            <Titulo n="01">{tr("Naturaleza Didáctica, Analítica e Independiente", "Educational, Analytical and Independent Nature")}</Titulo>
            <p>
              {tr(
                "ArmaPC es una iniciativa educativa digital e independiente especializada en la arquitectura de computadoras personales (PC Gamer y estaciones de trabajo), análisis de rendimiento por costo y verificación algorítmica de compatibilidad física y eléctrica para consumidores en los Estados Unidos y la comunidad hispanohablante internacional.",
                "ArmaPC is an independent digital educational initiative specializing in personal computer architecture (gaming PCs and workstations), performance-per-dollar analysis and algorithmic checking of physical and electrical compatibility for consumers in the United States and the English- and Spanish-speaking community worldwide."
              )}
            </p>
            <p>
              {en ? (
                <>
                  <strong className="text-white">ArmaPC is not a retailer and does not sell parts directly</strong>. We do not process
                  payments for physical parts, manage warehouse inventory or ship packages ourselves.
                </>
              ) : (
                <>
                  <strong className="text-white">ArmaPC no es una tienda minorista (retailer) ni comercializa componentes directamente</strong>.
                  No procesamos pagos directos por piezas físicas, no gestionamos inventarios de almacén ni realizamos envíos de
                  paquetería de forma propia.
                </>
              )}
            </p>
          </section>

          {/* 02. Simuladores y Motores de Compatibilidad */}
          <section className="space-y-3">
            <Titulo n="02">{tr("Herramientas Interactivas y Motor de Compatibilidad", "Interactive Tools and Compatibility Engine")}</Titulo>
            <p>
              {en ? (
                <>
                  The <em>Interactive Configurator</em>, the <em>Full Setup</em> simulator and the <em>Power Draw (Wattage) Estimator</em>{" "}
                  run algorithms based on the public specifications and datasheets provided by original technology manufacturers (AMD,
                  Intel, NVIDIA, ASUS, MSI, Gigabyte, Corsair, etc.) and independent lab research:
                </>
              ) : (
                <>
                  El <em>Configurador Interactivo</em>, el simulador de <em>Setup Completo</em> y el{" "}
                  <em>Estimador de Consumo Energético (Wattage)</em> ejecutan algoritmos basados en las especificaciones públicas y hojas
                  de datos provistas por fabricantes originales de tecnología (AMD, Intel, NVIDIA, ASUS, MSI, Gigabyte, Corsair, etc.) e
                  investigaciones de laboratorio independientes:
                </>
              )}
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs md:text-sm text-gray-300">
              <li>
                <strong>{tr("Propósito orientativo:", "For guidance only:")}</strong>{" "}
                {tr(
                  "Las alertas sobre sockets, chipsets, espacio en el gabinete, capacidad térmica (TDP) y potencia de fuentes de poder son de carácter analítico preliminar.",
                  "Alerts about sockets, chipsets, case clearance, thermal capacity (TDP) and power supply wattage are a preliminary analysis."
                )}
              </li>
              <li>
                <strong>{tr("Deber de verificación del usuario:", "User's duty to verify:")}</strong>{" "}
                {tr(
                  "Es responsabilidad exclusiva del usuario contrastar los manuales de usuario, las listas de compatibilidad de memoria (QVL) y las revisiones de firmware antes de realizar cualquier desembolso económico.",
                  "It is solely the user's responsibility to check user manuals, memory qualified vendor lists (QVL) and firmware revisions before spending any money."
                )}
              </li>
              <li>
                <strong>{tr("Builds por uso (gaming, streaming e IA local):", "Builds by use (gaming, streaming and local AI):")}</strong>{" "}
                {tr(
                  "Las configuraciones de Presupuestos y los presets del Configurador para streaming e inteligencia artificial local son recomendaciones orientativas. El rendimiento en IA depende de los modelos, del tamaño que ocupen en la memoria de video (VRAM) y del software que utilices; el de streaming, de la plataforma y de los ajustes de codificación.",
                  "The Budgets builds and the Configurator presets for streaming and local artificial intelligence are guidance only. AI performance depends on the models, how much video memory (VRAM) they take up and the software you use; streaming performance depends on the platform and your encoding settings."
                )}
              </li>
              <li>
                <strong>{tr("Setup Completo y total “PC + Setup”:", "Full Setup and the “PC + Setup” total:")}</strong>{" "}
                {tr(
                  "Las recomendaciones de monitor y periféricos se ajustan al nivel elegido y son orientativas. El total combinado de tu PC y tu setup, así como la lista copiada y el PDF, se calculan con los precios de referencia vigentes en la página y no constituyen una cotización ni una oferta de venta.",
                  "Monitor and peripheral recommendations match the chosen level and are guidance only. The combined total of your PC and your setup, as well as the copied list and the PDF, are calculated with the reference prices shown on the site at the time and are not a quote or an offer to sell."
                )}
              </li>
              <li>
                <strong>{tr("Versiones de BIOS y revisiones de placa:", "BIOS versions and board revisions:")}</strong>{" "}
                {tr(
                  "Ciertos procesadores de última generación pueden requerir una versión actualizada de BIOS para iniciar en placas base con chipsets previos. El usuario debe constatar con su vendedor minorista si la unidad comercializada incluye la versión de microcódigo requerida.",
                  "Some latest-generation processors may need an updated BIOS to boot on motherboards with older chipsets. The user must confirm with the retailer whether the unit sold ships with the required microcode version."
                )}
              </li>
            </ul>
          </section>

          {/* 03. Precios en USD, MSRP y Mercado de EE.UU. */}
          <section className="space-y-3 p-6 bg-white/[0.02] border border-white/10 rounded-xl">
            <Titulo n="03">
              {tr(
                "Precios de Referencia en Dólares (USD), MSRP y Minoristas de EE.UU.",
                "Reference Prices in US Dollars (USD), MSRP and US Retailers"
              )}
            </Titulo>
            <p>
              {en ? (
                <>
                  All amounts shown on ArmaPC are in <strong>US Dollars ($ USD)</strong>, using the US retail market as the reference:
                </>
              ) : (
                <>
                  Todas las cifras monetarias presentadas en ArmaPC se expresan en <strong>Dólares Estadounidenses ($ USD)</strong>,
                  tomando como referencia el mercado minorista de los Estados Unidos:
                </>
              )}
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs md:text-sm text-gray-300">
              <li>
                <strong>{tr("Precios oficiales y muestreo de mercado:", "Official prices and market sampling:")}</strong>{" "}
                {tr(
                  "Los valores reflejan el precio sugerido por el fabricante (MSRP) y muestreos periódicos en los principales minoristas y distribuidores autorizados de EE.UU. (tales como Amazon.com, Newegg, Best Buy, Micro Center y B&H Photo Video).",
                  "Prices reflect the manufacturer's suggested retail price (MSRP) and periodic sampling at the main authorized US retailers and distributors (such as Amazon.com, Newegg, Best Buy, Micro Center and B&H Photo Video)."
                )}
              </li>
              <li>
                <strong>{tr("Monitores y periféricos (Setup Completo):", "Monitors and peripherals (Full Setup):")}</strong>{" "}
                {tr(
                  "Sus precios provienen de minoristas de EE.UU. (como Newegg) y de las tiendas oficiales de cada fabricante, al precio normal, sin aplicar cupones ni códigos de descuento. Cuando un módulo ofrece varias opciones del mismo tipo, el total del setup cuenta la más económica; el kit de streaming es opcional y no se suma al total.",
                  "Their prices come from US retailers (such as Newegg) and each manufacturer's official store, at the regular price, without coupons or discount codes. When a module offers several options of the same type, the setup total counts the cheapest one; the streaming kit is optional and is not added to the total."
                )}
              </li>
              <li>
                <strong>{tr("Fluctuaciones de inventario y oferta/demanda:", "Inventory swings and supply/demand:")}</strong>{" "}
                {tr(
                  "El mercado informático experimenta cambios de precios continuos causados por promociones temporales, disponibilidad de existencias y dinámicas de importación. ArmaPC no garantiza el congelamiento de precios de terceros ni la disponibilidad permanente de stock.",
                  "Computer hardware prices change constantly due to limited-time promotions, stock availability and import dynamics. ArmaPC does not guarantee that third-party prices will stay the same or that stock will always be available."
                )}
              </li>
              <li>
                <strong>{tr("Compradores internacionales (fuera de EE.UU.):", "International buyers (outside the US):")}</strong>{" "}
                {tr(
                  "Los precios en USD son importes de referencia netos en origen y no contemplan impuestos locales al valor agregado (IVA), aranceles aduaneros ni costos de transporte internacional aplicables al ingresar mercancías en tu país de residencia.",
                  "USD prices are net reference amounts at origin and do not include local value-added tax (VAT), customs duties or international shipping costs that apply when goods enter your country of residence."
                )}
              </li>
            </ul>
          </section>

          {/* 04. Cumplimiento FTC y Afiliados */}
          <section className="space-y-3">
            <Titulo n="04">
              {tr(
                "Divulgación de Enlaces de Afiliación (Cumplimiento de la FTC de EE.UU.)",
                "Affiliate Link Disclosure (US FTC Compliance)"
              )}
            </Titulo>
            <p>
              {en ? (
                <>
                  In strict compliance with the guides of the United States Federal Trade Commission (
                  <strong>Federal Trade Commission - FTC</strong>, 16 CFR Part 255) and the agreements with partner retailers:
                </>
              ) : (
                <>
                  En estricto cumplimiento de las guías de la Comisión Federal de Comercio de los Estados Unidos (
                  <strong>Federal Trade Commission - FTC</strong>, 16 CFR Part 255) y los acuerdos comerciales de distribuidores
                  asociados:
                </>
              )}
            </p>
            <p>
              {en ? (
                <>
                  ArmaPC takes part in several affiliate marketing programs (including the Amazon Services LLC Associates Program and
                  approved retail networks). This means that if you click a retail link to a hardware store and complete an eligible
                  purchase,{" "}
                  <strong className="text-white">
                    ArmaPC may earn a small advertising commission without adding a single cent to the price you pay
                  </strong>
                  .
                </>
              ) : (
                <>
                  ArmaPC participa en diversos programas de mercadeo de afiliación (incluyendo el Programa de Afiliados de Amazon
                  Services LLC y redes comerciales homologadas). Esto significa que si haces clic en un enlace comercial hacia un
                  minorista de hardware y completas una compra elegible,{" "}
                  <strong className="text-white">
                    ArmaPC puede recibir una pequeña comisión por intermediación publicitaria sin que ello incremente en un solo
                    centavo el precio que pagas
                  </strong>
                  .
                </>
              )}
            </p>
            <p className="text-xs text-gray-400">
              {tr(
                "Nuestras selecciones técnicas de hardware se fundamentan exclusivamente en méritos de rendimiento, confiabilidad y relación costo-beneficio para el usuario, sin favoritismos comerciales hacia ninguna marca.",
                "Our hardware picks are based solely on performance, reliability and value for the user, with no commercial favoritism toward any brand."
              )}
            </p>
          </section>

          {/* 05. Propiedad Intelectual y Notificación DMCA */}
          <section className="space-y-3">
            <Titulo n="05">
              {tr(
                "Propiedad Intelectual y Notificaciones DMCA (Digital Millennium Copyright Act)",
                "Intellectual Property and DMCA Notices (Digital Millennium Copyright Act)"
              )}
            </Titulo>
            <p>
              {tr(
                "El código informático, diseño de interfaz gráfica, esquemas de bases de datos, algoritmos de cálculo de wattage y contenidos editoriales didácticos de ArmaPC constituyen propiedad protegida por las leyes de derechos de autor de los Estados Unidos y tratados internacionales de propiedad intelectual.",
                "ArmaPC's source code, interface design, database schemas, wattage calculation algorithms and editorial content are property protected by United States copyright law and international intellectual property treaties."
              )}
            </p>
            <p>
              {en ? (
                <>
                  Trademarks, logos, product model names (for example, <em>GeForce RTX™</em>, <em>AMD Ryzen™</em>, <em>Radeon™</em>,{" "}
                  <em>Intel® Core™ Ultra</em>) and illustrative images of parts belong to their respective owners and are used solely
                  for identification, technical education and <em>fair use</em> under US case law.
                </>
              ) : (
                <>
                  Las marcas comerciales, logotipos, nombres de modelos de productos (por ejemplo, <em>GeForce RTX™</em>,{" "}
                  <em>AMD Ryzen™</em>, <em>Radeon™</em>, <em>Intel® Core™ Ultra</em>) e imágenes ilustrativas de componentes pertenecen a
                  sus respectivos propietarios y se utilizan exclusivamente con fines de identificación informativa, educación técnica y
                  uso legítimo (<em>fair use</em>) bajo la jurisprudencia estadounidense.
                </>
              )}
            </p>
            <div className="p-4 bg-white/[0.02] border border-white/10 rounded-lg text-xs space-y-2">
              <div className="font-mono font-medium text-white">
                {tr("Procedimiento de Notificación y Retirada DMCA:", "DMCA Notice and Takedown Procedure:")}
              </div>
              <p className="text-gray-400">
                {en ? (
                  <>
                    If you are a copyright owner or an authorized agent and believe in good faith that any material on ArmaPC infringes
                    your rights under Title 17 of the United States Code (17 U.S.C. § 512(c)), you may send a written notice to our
                    designated agent at <Correo /> stating: (a) identification of the copyrighted work, (b) the exact URL of the
                    allegedly infringing material, (c) your official contact details and (d) a formal statement made under penalty of
                    perjury.
                  </>
                ) : (
                  <>
                    Si eres titular de derechos de autor o un agente autorizado y consideras de buena fe que cualquier material en
                    ArmaPC infringe tus derechos conforme al Título 17 del Código de los Estados Unidos (17 U.S.C. § 512(c)), puedes
                    remitir una notificación por escrito a nuestro agente designado a través de <Correo /> indicando: (a) identificación
                    de la obra protegida, (b) URL exacta del material presuntamente infractor, (c) tus datos de contacto oficiales y (d)
                    declaración formal bajo fe de juramento.
                  </>
                )}
              </p>
            </div>
          </section>

          {/* 06. Exclusión de Garantías y Limitación de Responsabilidad */}
          <section className="space-y-3">
            <Titulo n="06">
              {tr(
                "Exclusión de Garantías (“AS IS”) y Limitación de Responsabilidad",
                "Disclaimer of Warranties (“AS IS”) and Limitation of Liability"
              )}
            </Titulo>
            <p>
              {tr(
                "EN LA MÁXIMA MEDIDA PERMITIDA POR LA LEY APLICABLE DE LOS ESTADOS UNIDOS:",
                "TO THE FULLEST EXTENT PERMITTED BY APPLICABLE UNITED STATES LAW:"
              )}
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs md:text-sm text-gray-300">
              <li>
                <strong>{tr("Suministro “Tal Cual”:", "Provided “As Is”:")}</strong>{" "}
                {tr(
                  "La plataforma, sus simuladores y sus recomendaciones se proporcionan “TAL CUAL” (“AS IS”) y “SEGÚN DISPONIBILIDAD” (“AS AVAILABLE”), sin garantías de ningún tipo, expresas o implícitas (incluyendo garantías implícitas de comerciabilidad, adecuación para un fin particular o ausencia de errores).",
                  "The platform, its simulators and its recommendations are provided “AS IS” and “AS AVAILABLE”, without warranties of any kind, express or implied (including implied warranties of merchantability, fitness for a particular purpose or freedom from errors)."
                )}
              </li>
              <li>
                <strong>{tr("Responsabilidad en el Ensamblaje Físico:", "Responsibility for Physical Assembly:")}</strong>{" "}
                {tr(
                  "ArmaPC no asume responsabilidad alguna por daños materiales directos, indirectos o accidentales que sufra el hardware durante el proceso físico de manipulación o ensamblaje por parte del usuario (por ejemplo, descargas electrostáticas, pines doblados en sockets de procesador, exceso de presión en disipadores o conexiones defectuosas a la fuente de poder).",
                  "ArmaPC accepts no liability for any direct, indirect or incidental damage to hardware while the user handles or assembles it (for example, electrostatic discharge, bent pins in processor sockets, excessive cooler mounting pressure or faulty power supply connections)."
                )}
              </li>
              <li>
                <strong>{tr("Decisiones de Compra:", "Purchase Decisions:")}</strong>{" "}
                {tr(
                  "El usuario asume plena responsabilidad por las adquisiciones realizadas en comercios externos y por corroborar la compatibilidad física y eléctrica final con los fabricantes antes de comprar.",
                  "The user is fully responsible for purchases made at third-party stores and for confirming final physical and electrical compatibility with the manufacturers before buying."
                )}
              </li>
            </ul>
          </section>

          {/* 07. Modificación de los Términos */}
          <section className="space-y-3">
            <Titulo n="07">{tr("Modificación y Vigencia de las Condiciones", "Changes to and Validity of These Terms")}</Titulo>
            <p>
              {tr(
                "Nos reservamos el derecho de actualizar o modificar estos Términos y Condiciones en cualquier momento para adaptarlos a cambios tecnológicos, nuevas herramientas del portal o disposiciones legales. Las revisiones entrarán en vigencia inmediatamente tras su publicación en esta dirección web, con la fecha de actualización correspondiente en el encabezado.",
                "We reserve the right to update or change these Terms and Conditions at any time to reflect technological changes, new site tools or legal requirements. Revisions take effect immediately upon publication at this web address, with the corresponding update date in the header."
              )}
            </p>
          </section>

          {/* 08. Ley Aplicable y Jurisdicción (Estados Unidos) */}
          <section className="space-y-3">
            <Titulo n="08">
              {tr(
                "Ley Aplicable, Jurisdicción y Resolución de Controversias",
                "Governing Law, Jurisdiction and Dispute Resolution"
              )}
            </Titulo>
            <p>
              {en ? (
                <>
                  These Terms and Conditions are governed by and construed in accordance with the laws of the{" "}
                  <strong className="text-white">United States of America</strong> and the laws of the{" "}
                  <strong className="text-white">State of Delaware</strong>, without regard to any conflict of law principles.
                </>
              ) : (
                <>
                  Estos Términos y Condiciones se regirán e interpretarán de conformidad con las leyes de los{" "}
                  <strong className="text-white">Estados Unidos de América</strong> y las leyes del{" "}
                  <strong className="text-white">Estado de Delaware</strong>, sin dar efecto a ningún principio sobre conflicto de leyes.
                </>
              )}
            </p>
            <p>
              {tr(
                "Cualquier controversia, reclamo o disputa que surja en relación con el uso de este portal web se resolverá mediante comunicación directa y de buena fe entre las partes. Si no fuera posible alcanzar un acuerdo, las partes acuerdan someterse a la jurisdicción de los tribunales competentes ubicados en los Estados Unidos.",
                "Any controversy, claim or dispute arising from the use of this website will be resolved through direct, good-faith communication between the parties. If no agreement can be reached, the parties agree to submit to the jurisdiction of the competent courts located in the United States."
              )}
            </p>
            <p className="text-xs text-gray-400 pt-2">
              {tr(
                "Para consultas legales o notificaciones relacionadas con estos términos, contáctanos en:",
                "For legal questions or notices related to these terms, contact us at:"
              )}{" "}
              <Correo />.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter className="bg-[#08090a]/80 backdrop-blur-md" />
    </div>
  );
}
