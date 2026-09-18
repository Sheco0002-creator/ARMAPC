import Link from "next/link";
import { SlidersHorizontal, Home, DollarSign, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[85vh] flex items-center justify-center p-4 relative z-10">
      <div className="max-w-md w-full p-8 rounded-2xl bg-[#08090a]/85 backdrop-blur-xl border border-white/10 text-center space-y-6 shadow-2xl">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto">
          <AlertCircle size={32} />
        </div>

        <div className="space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
            ERROR 404 · PÁGINA NO ENCONTRADA
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Esta sección ha cambiado de lugar
          </h1>
          <p className="text-xs text-gray-400 leading-relaxed">
            La dirección que abriste proviene de una versión anterior o no existe. Puedes continuar armando tu PC o explorar nuestros presupuestos:
          </p>
        </div>

        <div className="space-y-2.5 pt-2">
          <Link
            href="/es/configurador"
            className="w-full inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 py-3 rounded-lg font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-md"
          >
            <SlidersHorizontal size={14} />
            <span>Ir al Configurador de PC</span>
          </Link>

          <Link
            href="/es/presupuestos"
            className="w-full inline-flex items-center justify-center gap-2 bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white py-3 rounded-lg font-mono text-xs uppercase tracking-wider transition-all"
          >
            <DollarSign size={14} />
            <span>Ver Presupuestos Recomendados</span>
          </Link>

          <Link
            href="/es"
            className="w-full inline-flex items-center justify-center gap-2 text-gray-400 hover:text-white py-2 font-mono text-xs transition-colors"
          >
            <Home size={14} />
            <span>Volver a la Guía Principal</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
