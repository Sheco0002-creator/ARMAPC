"use client";

import React, { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";
import { Send, CheckCircle2, HelpCircle, Globe, Clock, Mail } from "lucide-react";
import { useIdioma } from "@/i18n/Idioma";

// Motivos de consulta: [español, inglés]. El valor que viaja en el correo es el del idioma de la página.
const MOTIVOS: [string, string][] = [
  ["Duda sobre compatibilidad de piezas (EE.UU. / Global)", "Part compatibility question (US / Global)"],
  ["Consulta sobre presupuesto en USD para gaming o trabajo", "USD budget question for gaming or work"],
  [
    "Reporte de precio o stock desactualizado (Amazon, Newegg, Best Buy, etc.)",
    "Outdated price or stock report (Amazon, Newegg, Best Buy, etc.)",
  ],
  ["Sugerencia para nueva guía educativa", "Suggestion for a new guide"],
  ["Notificaciones legales / Solicitud de Privacidad CCPA / DMCA", "Legal notices / CCPA privacy request / DMCA"],
  ["Propuesta comercial, prensa o colaboración", "Business proposal, press or partnership"],
];

export function ContactoVista() {
  const { en, tr, ruta } = useIdioma();
  const motivo = (m: [string, string]) => (en ? m[1] : m[0]);
  const [formData, setFormData] = useState({ name: "", email: "", subject: motivo(MOTIVOS[0]), message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pre-fill mailto link with encoded parameters
    const mailtoUrl = `mailto:contacto@tupcgamer.com?subject=${encodeURIComponent(
      `[${tr("Contacto", "Contact")} ArmaPC] ${formData.subject} - ${formData.name}`
    )}&body=${encodeURIComponent(
      tr(
        `Nombre: ${formData.name}\nCorreo de contacto: ${formData.email}\nMotivo: ${formData.subject}\n\nMensaje:\n${formData.message}`,
        `Name: ${formData.name}\nContact email: ${formData.email}\nTopic: ${formData.subject}\n\nMessage:\n${formData.message}`
      )
    )}`;
    window.location.href = mailtoUrl;
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen text-white flex flex-col selection:bg-white selection:text-black overflow-x-hidden">
      <SiteHeader />

      <main className="relative z-10 flex-1 max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-24 w-full">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#08090a]/50 backdrop-blur-sm border border-white/10 text-[10px] font-mono tracking-widest text-gray-500 uppercase">
            <Link href={ruta("guias")} className="hover:text-white transition-colors">
              {tr("Guías", "Guides")}
            </Link>
            <span>/</span>
            <span className="text-gray-300">{tr("Contacto", "Contact")}</span>
          </div>
        </div>

        {/* Header */}
        <div className="border-b border-white/10 pb-8 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#08090a]/50 backdrop-blur-sm border border-white/10 text-[11px] font-mono tracking-[0.25em] text-emerald-400 uppercase mb-3">
            <Globe size={14} /> {tr("[ COMUNICACIÓN DIRECTA // ATENCIÓN EE.UU. & GLOBAL ]", "[ DIRECT CONTACT // US & GLOBAL SUPPORT ]")}
          </div>
          <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-4">
            {tr("Escríbenos. Leemos cada mensaje.", "Write to us. We read every message.")}
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed font-sans font-light">
            {tr(
              "¿Tienes una duda técnica sobre compatibilidad, encontraste un precio desactualizado en tiendas de EE.UU. o deseas sugerir una nueva guía? Nuestro equipo técnico está a tu disposición.",
              "Have a technical question about compatibility, found an outdated price at a US store, or want to suggest a new guide? Our tech team is here to help."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Main Form */}
          <div className="md:col-span-2 bg-[#08090a]/60 backdrop-blur-md border border-white/10 p-8 rounded-xl shadow-xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-xl font-medium text-white">
                  {tr("¡Mensaje preparado en tu cliente de correo!", "Your message is ready in your email app!")}
                </h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto font-mono leading-relaxed">
                  {tr(
                    "Si tu aplicación de correo no se abrió de forma automática, puedes enviarnos tu mensaje directamente a",
                    "If your email app didn't open automatically, you can send your message directly to"
                  )}{" "}
                  <strong className="text-white">contacto@tupcgamer.com</strong>.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-mono text-gray-400 underline hover:text-white cursor-pointer"
                >
                  {tr("Escribir otro mensaje", "Write another message")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">
                    {tr("Tu Nombre o Alias", "Your Name or Nickname")}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={tr("Ej. Carlos Mendoza", "E.g. Alex Johnson")}
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/15 rounded text-white text-sm focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">
                    {tr("Tu Correo Electrónico", "Your Email")}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={tr("tucorreo@ejemplo.com", "you@example.com")}
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/15 rounded text-white text-sm focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">
                    {tr("Motivo de Consulta", "Topic")}
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-[#111316] border border-white/15 rounded text-white text-sm focus:outline-none focus:border-white transition-colors cursor-pointer"
                  >
                    {MOTIVOS.map((m) => (
                      <option key={m[0]} value={motivo(m)}>
                        {motivo(m)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">
                    {tr("Tu Mensaje", "Your Message")}
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={tr(
                      "Detalla los componentes que estás considerando, tu presupuesto objetivo en USD o la duda técnica que deseas resolver...",
                      "Tell us the parts you're considering, your target budget in USD, or the technical question you'd like answered..."
                    )}
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/15 rounded text-white text-sm focus:outline-none focus:border-white transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-white text-black py-3.5 rounded font-mono text-xs uppercase tracking-widest font-semibold hover:bg-gray-200 transition-all cursor-pointer shadow-lg"
                >
                  <Send size={14} />
                  {tr("Enviar Consulta vía Correo", "Send via Email")}
                </button>
              </form>
            )}
          </div>

          {/* Contact Details & Info Card */}
          <div className="space-y-6">
            <div className="p-6 bg-[#08090a]/60 backdrop-blur-md border border-white/10 rounded-xl space-y-4 shadow-lg">
              <div className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 flex items-center gap-1.5">
                <Mail size={12} /> {tr("CANAL OFICIAL DE ATENCIÓN", "OFFICIAL SUPPORT CHANNEL")}
              </div>
              <div className="flex items-center gap-3 text-white">
                <a
                  href="mailto:contacto@tupcgamer.com"
                  className="text-sm font-mono hover:text-gray-300 transition-colors break-all"
                >
                  contacto@tupcgamer.com
                </a>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                {en ? (
                  <>
                    Support in English and Spanish for users in the <strong className="text-gray-300">United States</strong> and
                    worldwide.
                  </>
                ) : (
                  <>
                    Atención preferente en español para usuarios en los <strong className="text-gray-300">Estados Unidos</strong> y el
                    mercado internacional.
                  </>
                )}
              </p>
              <div className="pt-2 border-t border-white/5 space-y-2 text-[11px] font-mono text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-gray-500" />
                  <span>{tr("Horario: Lun - Vie (Eastern Time / ET)", "Hours: Mon - Fri (Eastern Time / ET)")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  <span>{tr("Respuesta habitual: 24 a 48 horas", "Typical reply: 24 to 48 hours")}</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#08090a]/60 backdrop-blur-md border border-white/10 rounded-xl space-y-3 shadow-lg">
              <div className="text-[10px] font-mono tracking-widest uppercase text-gray-400 flex items-center gap-1.5">
                <HelpCircle size={12} /> {tr("TEMAS FRECUENTES", "COMMON TOPICS")}
              </div>
              <ul className="text-xs text-gray-300 space-y-2.5 leading-relaxed">
                {[
                  tr("¿Qué fuente de poder ATX 3.1 necesito para una RTX serie 50?", "Which ATX 3.1 power supply do I need for an RTX 50 series card?"),
                  tr("¿Entra esta gráfica en mi gabinete Micro-ATX o Mini-ITX?", "Will this graphics card fit in my Micro-ATX or Mini-ITX case?"),
                  tr("¿Conviene un combo de CPU + Placa + RAM en tiendas de EE.UU.?", "Is a CPU + motherboard + RAM combo from a US store worth it?"),
                  tr("Correcciones o actualizaciones en la base de datos de componentes.", "Corrections or updates to the parts database."),
                  tr("Consultas sobre solicitudes de privacidad CCPA o avisos DMCA.", "Questions about CCPA privacy requests or DMCA notices."),
                ].map((tema) => (
                  <li key={tema} className="flex items-start gap-2">
                    <span className="text-white">•</span>
                    {tema}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter className="bg-[#08090a]/80 backdrop-blur-md" />
    </div>
  );
}
