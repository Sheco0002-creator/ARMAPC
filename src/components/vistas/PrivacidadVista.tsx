import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import { ShieldCheck, Mail } from "lucide-react";
import { ruta, traductor, type Lang } from "@/i18n/rutas";
import { siteConfig } from "@/config/siteConfig";

const Correo = () => (
  <a href={`mailto:${siteConfig.contact.email}`} className="text-white underline font-mono">
    {siteConfig.contact.email}
  </a>
);

function Titulo({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <h2 className="text-lg md:text-xl font-medium text-white tracking-tight flex items-center gap-2">
      <span className="text-xs font-mono text-gray-400">{n}.</span> {children}
    </h2>
  );
}

function EnlaceExterno({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-white underline font-mono">
      {children}
    </a>
  );
}

export function PrivacidadVista({ lang }: { lang: Lang }) {
  const tr = traductor(lang);
  const en = lang === "en";

  const derechos = [
    {
      titulo: tr("Derecho a Saber y Acceder", "Right to Know and Access"),
      texto: tr(
        "Derecho a solicitar qué categorías de información recopilamos y el propósito con el que se utilizan.",
        "The right to ask which categories of information we collect and the purpose for which they are used."
      ),
    },
    {
      titulo: tr("Derecho a la Eliminación", "Right to Delete"),
      texto: tr(
        "Derecho a solicitar el borrado de cualquier dato personal recopilado sobre ti, con las salvedades técnicas y legales aplicables.",
        "The right to request deletion of any personal data collected about you, subject to applicable technical and legal exceptions."
      ),
    },
    {
      titulo: tr("Derecho de No Discriminación", "Right to Non-Discrimination"),
      texto: tr(
        "Nunca recibirás un trato desigual, ni se te negará el acceso a nuestras guías o configurador por ejercer tus derechos de privacidad.",
        "You will never be treated differently or denied access to our guides or configurator for exercising your privacy rights."
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
            <span className="text-gray-300">{tr("Privacidad", "Privacy")}</span>
          </div>
        </div>

        {/* Header */}
        <div className="border-b border-white/10 pb-8 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#08090a]/50 backdrop-blur-sm border border-white/10 text-[11px] font-mono tracking-[0.25em] text-emerald-400 uppercase mb-3">
            <ShieldCheck size={14} /> {tr("[ MARCO DE PRIVACIDAD EE.UU. & GLOBAL ]", "[ US & GLOBAL PRIVACY FRAMEWORK ]")}
          </div>
          <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-4">
            {tr("Política de Privacidad", "Privacy Policy")}
          </h1>
          <p className="text-xs font-mono text-gray-400 tracking-wider uppercase">
            {tr(
              "ÚLTIMA ACTUALIZACIÓN: SEPTIEMBRE DE 2026 // EDICIÓN ESTADOS UNIDOS & INTERNACIONAL",
              "LAST UPDATED: SEPTEMBER 2026 // UNITED STATES & INTERNATIONAL EDITION"
            )}
          </p>
        </div>

        {/* Legal text */}
        <div className="p-8 md:p-12 rounded-2xl bg-[#08090a]/60 backdrop-blur-md border border-white/10 space-y-12 text-gray-300 font-sans leading-relaxed text-sm md:text-base shadow-2xl">
          <p className="text-base md:text-lg text-gray-300 leading-relaxed font-light">
            {en ? (
              <>
                At <strong className="text-white font-medium">ArmaPC</strong> we value and respect our users&apos; privacy. This Privacy
                Policy transparently describes what information is processed when you use our site, interactive tools and hardware
                simulators, how that information is handled, and the rights you have under the federal and state laws of the{" "}
                <strong className="text-white">United States of America</strong> (including California&apos;s{" "}
                <strong className="text-white">CCPA / CPRA</strong>) and related international regulations.
              </>
            ) : (
              <>
                En <strong className="text-white font-medium">ArmaPC</strong> valoramos y respetamos la privacidad de nuestros usuarios.
                Esta Política de Privacidad describe de manera transparente qué información se procesa cuando utilizas nuestro portal,
                herramientas interactivas y simuladores de hardware, cómo se administra dicha información y los derechos que te asisten
                bajo las leyes federales y estatales de los <strong className="text-white">Estados Unidos de América</strong> (incluyendo
                la <strong className="text-white">CCPA / CPRA</strong> de California) y normativas internacionales afines.
              </>
            )}
          </p>

          {/* 01. Quiénes somos y Ámbito */}
          <section className="space-y-3">
            <Titulo n="01">{tr("Quiénes Somos y Ámbito Territorial", "Who We Are and Territorial Scope")}</Titulo>
            <p>
              {tr(
                "ArmaPC es un recurso educativo, analítico e independiente en línea concebido para asistir a entusiastas y consumidores hispanohablantes en los Estados Unidos y alrededor del mundo en la elección, verificación técnica y costeo de componentes para computadoras personales de alto rendimiento.",
                "ArmaPC is an independent online educational and analytical resource designed to help enthusiasts and consumers in the United States and around the world choose, technically check and price parts for high-performance personal computers."
              )}
            </p>
            <p>
              {tr(
                "Nuestra infraestructura técnica y servidores operan conforme a los estándares de telecomunicaciones y comercio digital de los Estados Unidos. Para cualquier requerimiento de privacidad, puedes comunicarte directamente con nuestro equipo a través de",
                "Our technical infrastructure and servers operate in accordance with United States telecommunications and e-commerce standards. For any privacy request, you can contact our team directly at"
              )}{" "}
              <Correo />.
            </p>
          </section>

          {/* 02. Información que Recopilamos */}
          <section className="space-y-3">
            <Titulo n="02">
              {tr("Información que Recopilamos y Almacenamiento Local", "Information We Collect and Local Storage")}
            </Titulo>
            <p>
              <strong className="text-white">
                {tr("No recopilamos información personal sensible de forma directa:", "We do not directly collect sensitive personal information:")}
              </strong>{" "}
              {tr(
                "ArmaPC no requiere registro de cuenta, nombres de usuario, contraseñas, números de seguridad social ni información financiera para navegar por las guías ni usar el configurador.",
                "ArmaPC does not require an account, usernames, passwords, Social Security numbers or financial information to browse the guides or use the configurator."
              )}
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs md:text-sm text-gray-300">
              <li>
                <strong>{tr("Datos técnicos automáticos (Logs de servidor):", "Automatic technical data (server logs):")}</strong>{" "}
                {tr(
                  "De forma rutinaria en la web, nuestros proveedores de alojamiento y redes de distribución de contenido (CDN) pueden registrar direcciones IP anonimizadas, tipo de navegador, sistema operativo, páginas de referencia y marcas de tiempo para fines de seguridad, prevención de ataques de denegación de servicio (DDoS) y diagnóstico de rendimiento.",
                  "As is routine on the web, our hosting providers and content delivery networks (CDN) may log anonymized IP addresses, browser type, operating system, referring pages and timestamps for security, denial-of-service (DDoS) prevention and performance diagnostics."
                )}
              </li>
              <li>
                <strong>{tr("Almacenamiento Local en tu Navegador (localStorage):", "Local Storage in Your Browser (localStorage):")}</strong>{" "}
                {en ? (
                  <>
                    The PC you build in the Configurator or pick in Budgets (selected parts, level and use: gaming, streaming or local
                    AI) and the level you choose in <em>Full Setup</em> (monitor and peripherals) are stored{" "}
                    <em>100% locally on your own device</em> through your browser&apos;s web storage. They let your PC and setup add up as
                    you move between pages and survive a reload. This data is never sent to our servers or linked to your real-world
                    identity, and you can delete it at any time by clearing this site&apos;s data in your browser settings.
                  </>
                ) : (
                  <>
                    La PC que armas en el Configurador o eliges en Presupuestos (piezas seleccionadas, nivel y uso: gaming, streaming o
                    IA local) y el nivel que eliges en <em>Setup Completo</em> (monitor y periféricos) se guardan de forma{" "}
                    <em>100% local en tu propio dispositivo</em> a través de la memoria web de tu navegador. Sirven para que la PC y el
                    setup se sumen al pasar de una página a otra y no se pierdan al recargar. Estos datos jamás se envían a nuestros
                    servidores ni se vinculan con tu identidad física, y puedes borrarlos en cualquier momento eliminando los datos de
                    este sitio desde la configuración de tu navegador.
                  </>
                )}
              </li>
              <li>
                <strong>{tr("Cookie de idioma:", "Language cookie:")}</strong>{" "}
                {tr(
                  "Si usas el selector EN / ES de la cabecera, guardamos una cookie propia llamada “lang” con el idioma elegido (en o es) durante un año, para mostrarte las páginas en ese idioma en tus próximas visitas. Solo contiene esas dos letras, no te identifica y no se usa con fines publicitarios. Sin esa cookie, el sitio elige el idioma según la preferencia de tu navegador.",
                  "If you use the EN / ES switch in the header, we store a first-party cookie called “lang” with the language you chose (en or es) for one year, so we can show you pages in that language on future visits. It only contains those two letters, does not identify you and is not used for advertising. Without it, the site picks the language based on your browser's preference."
                )}
              </li>
              <li>
                <strong>{tr("Listas copiadas y PDF:", "Copied lists and PDF:")}</strong>{" "}
                {tr(
                  "Las funciones “Copiar Lista” e “Imprimir / PDF” generan el texto y el documento en tu propio navegador. El contenido va a tu portapapeles o a tu impresora; ArmaPC no recibe ni guarda una copia.",
                  "The “Copy List” and “Print / PDF” features create the text and the document in your own browser. The content goes to your clipboard or your printer; ArmaPC does not receive or keep a copy."
                )}
              </li>
            </ul>
          </section>

          {/* 03. Cookies y Publicidad de Google AdSense */}
          <section className="space-y-3 p-6 bg-white/[0.02] border border-white/10 rounded-xl">
            <Titulo n="03">
              {tr("Cookies de Terceros y Publicidad de Google AdSense", "Third-Party Cookies and Google AdSense Advertising")}
            </Titulo>
            <p>
              {en ? (
                <>
                  To keep all our tools and guides open and free, ArmaPC uses and optimizes ad space through{" "}
                  <strong>Google AdSense</strong> (a service of Google LLC, headquartered in Mountain View, California, USA).
                </>
              ) : (
                <>
                  Para mantener el acceso abierto y gratuito a todas nuestras herramientas y guías didácticas, ArmaPC utiliza y optimiza
                  espacios publicitarios a través de <strong>Google AdSense</strong> (servicio de Google LLC, con sede en Mountain View,
                  California, EE.UU.).
                </>
              )}
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs md:text-sm text-gray-300">
              <li>
                {tr(
                  "Google y sus socios de tecnología publicitaria utilizan cookies para publicar anuncios basados en las visitas previas del usuario a este u otros sitios web.",
                  "Google and its ad technology partners use cookies to serve ads based on a user's prior visits to this or other websites."
                )}
              </li>
              <li>
                {tr(
                  "El uso de cookies publicitarias permite a Google y a sus socios presentar anuncios relevantes a los usuarios en función de sus visitas a ArmaPC y a otros sitios de Internet.",
                  "Advertising cookies enable Google and its partners to serve relevant ads to users based on their visits to ArmaPC and other sites on the Internet."
                )}
              </li>
              <li>
                <strong>{tr("Cómo inhabilitar la publicidad personalizada:", "How to opt out of personalized advertising:")}</strong>{" "}
                {tr("Puedes optar por no recibir publicidad personalizada visitando la", "You can opt out of personalized advertising by visiting")}{" "}
                <EnlaceExterno href="https://www.google.com/settings/ads">
                  {tr("Configuración de Anuncios de Google", "Google Ads Settings")}
                </EnlaceExterno>
                .
              </li>
              <li>
                {tr(
                  "Alternativamente, puedes gestionar o inhabilitar el uso de cookies para publicidad dirigida por parte de múltiples proveedores a través de la plataforma de la Network Advertising Initiative (NAI) o visitando",
                  "Alternatively, you can manage or opt out of the use of cookies for targeted advertising by multiple vendors through the Network Advertising Initiative (NAI) platform or by visiting"
                )}{" "}
                <EnlaceExterno href="https://www.aboutads.info/choices/">www.aboutads.info</EnlaceExterno>{" "}
                {tr("(Digital Advertising Alliance en EE.UU.).", "(Digital Advertising Alliance in the US).")}
              </li>
            </ul>
          </section>

          {/* 04. Derechos de Privacidad de California (CCPA / CPRA) */}
          <section className="space-y-4">
            <Titulo n="04">
              {tr("Derechos de Privacidad en EE.UU. (CCPA / CPRA de California)", "US Privacy Rights (California CCPA / CPRA)")}
            </Titulo>
            <p>
              {en ? (
                <>
                  If you live in California or in a state with comprehensive privacy laws (such as Virginia, Colorado, Connecticut, Utah or
                  Texas), the California Consumer Privacy Act (<strong>CCPA</strong>) and its <strong>CPRA</strong> amendment give you
                  specific rights over your information:
                </>
              ) : (
                <>
                  Si resides en el estado de California o en estados con legislación de privacidad integral (como Virginia, Colorado,
                  Connecticut, Utah o Texas), la Ley de Privacidad del Consumidor de California (California Consumer Privacy Act o{" "}
                  <strong>CCPA</strong>) y su enmienda <strong>CPRA</strong> te otorgan derechos específicos sobre tu información:
                </>
              )}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {derechos.map((d) => (
                <div key={d.titulo} className="p-4 bg-white/[0.02] border border-white/10 rounded-lg">
                  <div className="text-xs font-mono font-medium text-white mb-1">{d.titulo}</div>
                  <div className="text-xs text-gray-400">{d.texto}</div>
                </div>
              ))}
              <div className="p-4 bg-white/[0.02] border border-white/10 rounded-lg">
                <div className="text-xs font-mono font-medium text-white mb-1">
                  {tr("No Venta de Datos (Do Not Sell)", "Do Not Sell")}
                </div>
                <div className="text-xs text-gray-400">
                  <strong className="text-emerald-400">
                    {tr("ArmaPC NO vende ni comercializa tu información personal", "ArmaPC does NOT sell or trade your personal information")}
                  </strong>{" "}
                  {tr(
                    "con intermediarios ni empresas de corretaje de datos (data brokers).",
                    "to intermediaries or data brokers."
                  )}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 pt-2">
              {tr(
                "Para ejercer cualquiera de estos derechos, contáctanos indicando “Solicitud de Privacidad CCPA” a",
                "To exercise any of these rights, contact us with the subject “CCPA Privacy Request” at"
              )}{" "}
              <Correo />.{" "}
              {tr(
                "Responderemos a tu requerimiento dentro del plazo establecido por ley (45 días naturales).",
                "We will respond within the period required by law (45 calendar days)."
              )}
            </p>
          </section>

          {/* 05. Protección de Menores (COPPA) */}
          <section className="space-y-3">
            <Titulo n="05">{tr("Privacidad de Menores (Ley COPPA)", "Children's Privacy (COPPA)")}</Titulo>
            <p>
              {en ? (
                <>
                  In strict compliance with the US Children&apos;s Online Privacy Protection Act (<strong>COPPA</strong>), this website is
                  not directed to children under 13. We do not knowingly collect personal information from children under 13. If you have
                  reason to believe a minor has given us identifiable data through our contact forms, contact us immediately and we will
                  promptly delete that information from our records.
                </>
              ) : (
                <>
                  En estricto cumplimiento de la Ley de Protección de la Privacidad Infantil en Línea de los Estados Unidos (
                  <strong>COPPA</strong> - Children&apos;s Online Privacy Protection Act), este sitio web no está dirigido a niños menores
                  de 13 años. No recopilamos conscientemente información personal de niños menores de 13 años. Si tienes motivos para creer
                  que un menor nos ha provisto datos identificables a través de nuestros formularios de contacto, comunícate con nosotros
                  inmediatamente y eliminaremos dicha información de nuestros registros de forma expedita.
                </>
              )}
            </p>
          </section>

          {/* 06. Usuarios Internacionales y GDPR */}
          <section className="space-y-3">
            <Titulo n="06">
              {tr("Visitantes Internacionales y Normativa Europea (GDPR / RGPD)", "International Visitors and European Regulation (GDPR)")}
            </Titulo>
            <p>
              {en ? (
                <>
                  Although our primary audience is in the United States, ArmaPC welcomes users from all over the world. For visitors in
                  the European Economic Area (EEA), the United Kingdom or Switzerland, we process the minimum data on the basis of our
                  legitimate interest in providing content and protecting the integrity of the network, and we recognize your rights of
                  access, rectification, erasure and restriction under the General Data Protection Regulation (<strong>GDPR</strong>).
                </>
              ) : (
                <>
                  Aunque nuestro público primario se ubica en los Estados Unidos, ArmaPC recibe a usuarios de todo el mundo
                  hispanohablante. Para los visitantes ubicados en el Espacio Económico Europeo (EEE), el Reino Unido o Suiza, procesamos
                  los datos mínimos con base en el interés legítimo de suministrar contenidos y salvaguardar la integridad de la red,
                  reconociendo tus derechos de acceso, rectificación, supresión y limitación conforme al Reglamento General de Protección
                  de Datos (<strong>GDPR</strong>).
                </>
              )}
            </p>
          </section>

          {/* 07. Enlaces Externos a Comercios de EE.UU. */}
          <section className="space-y-3">
            <Titulo n="07">{tr("Enlaces Externos a Distribuidores y Minoristas", "External Links to Distributors and Retailers")}</Titulo>
            <p>
              {tr(
                "Nuestras listas, el configurador y la página de Setup Completo enlazan a comercios electrónicos autorizados de hardware con sede en EE.UU. (como Amazon.com, Newegg, Best Buy o B&H Photo) y a las tiendas oficiales de los fabricantes de periféricos (por ejemplo, Elgato, HyperX o Keychron). Al pulsar un enlace hacia esos portales, te trasladas al entorno de dicho distribuidor, cuyas políticas de privacidad y condiciones de servicio son completamente independientes de ArmaPC. Te sugerimos revisar las políticas de dichos minoristas antes de procesar cualquier transacción.",
                "Our lists, the configurator and the Full Setup page link to authorized US-based hardware stores (such as Amazon.com, Newegg, Best Buy or B&H Photo) and to the official stores of peripheral manufacturers (for example, Elgato, HyperX or Keychron). When you click a link to those sites, you move to that retailer's environment, whose privacy policies and terms of service are completely independent of ArmaPC. We suggest reviewing those retailers' policies before making any purchase."
              )}
            </p>
          </section>

          {/* 08. Contacto Oficial de Privacidad */}
          <section className="space-y-3">
            <Titulo n="08">{tr("Contacto y Consultas sobre Privacidad", "Privacy Contact and Questions")}</Titulo>
            <p>
              {tr(
                "Si tienes preguntas sobre nuestra Política de Privacidad, deseas presentar una solicitud conforme a la ley de tu estado o sugerir una mejora, nuestro canal oficial de privacidad está disponible en:",
                "If you have questions about our Privacy Policy, want to file a request under your state's law or suggest an improvement, our official privacy channel is:"
              )}
            </p>
            <div className="p-4 bg-white/[0.02] border border-white/10 rounded-lg inline-flex items-center gap-3">
              <Mail className="text-gray-400" size={16} />
              <span className="text-sm font-mono text-white">contacto@tupcgamer.com</span>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter className="bg-[#08090a]/80 backdrop-blur-md" />
    </div>
  );
}
