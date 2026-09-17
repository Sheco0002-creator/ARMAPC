'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  CircuitBoard, 
  Layers, 
  HardDrive, 
  Zap, 
  Box, 
  Fan, 
  Sparkles, 
  Eye, 
  CheckCircle2, 
  X, 
  ExternalLink, 
  Ruler, 
  Cable, 
  Lightbulb, 
  ChevronRight, 
  ChevronLeft,
  Heart,
  HelpCircle,
  Scale,
  Maximize2,
  Info
} from 'lucide-react';
import escenaData from '@/data/escenaLayers.json';
import { COMPONENTES_MESA, ComponenteMesa } from '@/data/componentesMesa';
import { capaEnIdioma, fichaEnIdioma } from '@/data/componentesMesa.en';
import { useIdioma } from '@/i18n/Idioma';

interface LayerItem {
  id: string;
  mesaId?: string;
  title: string;
  category: string;
  image: string;
  x: number;
  y: number;
  width: number;
  height: number;
  percentLeft: number;
  percentTop: number;
  percentWidth: number;
  percentHeight: number;
  depth: number;
  zIndex: number;
  description: string;
}

export default function InteractiveDeskScene() {
  const [selectedLayer, setSelectedLayer] = useState<LayerItem | null>(null);
  const [hoveredLayer, setHoveredLayer] = useState<LayerItem | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'conectores' | 'medidas'>('general');
  const [catPurr, setCatPurr] = useState(false); // Estado para la animación del ronroneo del gato
  const [mounted, setMounted] = useState(false); // Bandera para saber si el componente ya se montó en el cliente
  const { lang, tr, ruta } = useIdioma(); // Hook personalizado para la internacionalización (idioma, traducción, rutas)
  // textos visibles de una capa en el idioma de la página (renderIcon sigue usando la categoría española)
  const capa = (l: LayerItem) => capaEnIdioma(l, lang);

  // Referencias para el contenedor de selección rápida y botones
  const pillsContainerRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Comprobar desbordamiento a izquierda y derecha
  const updateScrollButtons = () => {
    const el = pillsContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  };

  // Efecto que marca el componente como montado en el cliente para evitar errores de hidratación con React Portal
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const el = pillsContainerRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);
    const timer = setTimeout(updateScrollButtons, 300);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
      clearTimeout(timer);
    };
  }, []);

  // Animación de desplazamiento suave hacia el botón activo al seleccionar cualquier componente
  useEffect(() => {
    if (!selectedLayer) return;
    const targetBtn = pillRefs.current[selectedLayer.id];
    if (targetBtn && pillsContainerRef.current) {
      targetBtn.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
      setTimeout(updateScrollButtons, 350);
    }
  }, [selectedLayer]);

  const scrollPills = (direction: 'left' | 'right') => {
    if (!pillsContainerRef.current) return;
    const offset = direction === 'left' ? -260 : 260;
    pillsContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    setTimeout(updateScrollButtons, 320);
  };

  // Cerrar modal con la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mapear con la base de datos didáctica de COMPONENTES_MESA con resolución exhaustiva
  const fichaBase: ComponenteMesa | null = selectedLayer
    ? COMPONENTES_MESA.find(
        (c) =>
          c.id === selectedLayer.mesaId ||
          (selectedLayer.id === 'ssd' && (c.id === 'almacenamiento-ssd' || c.id === 'ssd')) ||
          (selectedLayer.id === 'cpu' && (c.id === 'procesador' || c.id === 'cpu')) ||
          (selectedLayer.id === 'gpu' && (c.id === 'tarjeta-grafica' || c.id === 'gpu')) ||
          (selectedLayer.id === 'ram' && (c.id === 'memoria-ram' || c.id === 'ram')) ||
          (selectedLayer.id === 'cooler' && (c.id === 'disipador-cpu' || c.id === 'cooler')) ||
          (selectedLayer.id === 'case' && (c.id === 'gabinete' || c.id === 'case')) ||
          (selectedLayer.id === 'psu' && (c.id === 'fuente-poder' || c.id === 'psu')) ||
          (selectedLayer.id === 'cat' && (c.id === 'asistente-felino' || c.id === 'cat')) ||
          (selectedLayer.id === 'motherboard' && (c.id === 'placa-madre' || c.id === 'motherboard')) ||
          c.id === selectedLayer.id
      ) || null
    : null;
  const selectedMesaInfo = fichaBase ? fichaEnIdioma(fichaBase, lang) : null;

  // Manejador que se ejecuta al hacer clic en un componente interactivo de la mesa
  const handleLayerClick = (layer: LayerItem) => {
    if (layer.id === 'cup') return; // El vaso de café no es interactivo
    if (layer.id === 'cat') {
      // Activa temporalmente la animación del ronroneo del gato
      setCatPurr(true);
      setTimeout(() => setCatPurr(false), 3000);
    }
    setSelectedLayer(layer); // Establece la capa seleccionada
    setIsModalOpen(true);    // Abre el modal de detalles
    setActiveTab('general'); // Muestra la pestaña general por defecto
  };

  // Función para cerrar el modal y limpiar la selección
  const handleReset = () => {
    setSelectedLayer(null);
    setIsModalOpen(false);
  };

  // Avanza al siguiente componente en la lista interactiva
  const handleNext = () => {
    const interactiveLayers = escenaData.layers.filter((l) => l.id !== 'cup');
    const currentIndex = interactiveLayers.findIndex((l) => l.id === selectedLayer?.id);
    const nextIndex = (currentIndex + 1) % interactiveLayers.length; // Ciclo infinito hacia adelante
    setSelectedLayer(interactiveLayers[nextIndex] as LayerItem);
    setActiveTab('general');
  };

  const handlePrev = () => {
    const interactiveLayers = escenaData.layers.filter((l) => l.id !== 'cup');
    const currentIndex = interactiveLayers.findIndex((l) => l.id === selectedLayer?.id);
    const prevIndex = (currentIndex - 1 + interactiveLayers.length) % interactiveLayers.length;
    setSelectedLayer(interactiveLayers[prevIndex] as LayerItem);
    setActiveTab('general');
  };

  const renderIcon = (iconName: string, size = 16, className = '') => {
    switch (iconName.toLowerCase()) {
      case 'circuitboard':
      case 'gpu':
      case 'placa madre':
        return <CircuitBoard size={size} className={className} />;
      case 'cpu':
        return <Cpu size={size} className={className} />;
      case 'layers':
      case 'ram':
        return <Layers size={size} className={className} />;
      case 'fan':
      case 'refrigeración':
        return <Fan size={size} className={className} />;
      case 'harddrive':
      case 'almacenamiento':
      case 'ssd':
      case 'disco':
        return <HardDrive size={size} className={className} />;
      case 'zap':
      case 'fuente':
        return <Zap size={size} className={className} />;
      case 'box':
      case 'gabinete':
        return <Box size={size} className={className} />;
      case 'cat':
      case 'mascota':
        return <Heart size={size} className={className} />;
      default:
        return <Sparkles size={size} className={className} />;
    }
  };

  // Selector rápido horizontal
  const interactivePills = escenaData.layers.filter((l) => l.id !== 'cup');

  // Modal centrado renderizado con React Portal para garantizar que esté 100% por encima de todo
  const modalContent = isModalOpen && selectedLayer && selectedLayer.id !== 'cup' && (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      {/* Telón de fondo oscuro para cerrar al hacer clic fuera */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={() => setIsModalOpen(false)}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#111318] to-[#0a0b0e] border border-white/20 rounded-2xl shadow-2xl shadow-black p-4 sm:p-6 text-slate-200 z-10 scrollbar-thin scrollbar-thumb-white/10"
      >
        {/* Cabecera del Modal */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-black/60 rounded-2xl border border-red-500/30 p-2 flex items-center justify-center overflow-hidden shadow-inner">
              <Image
                src={selectedLayer.image}
                alt={capa(selectedLayer).title}
                fill
                sizes="80px"
                className="object-contain p-1"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="flex items-center gap-1 text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 font-bold">
                  {renderIcon(selectedLayer.category, 12, 'text-red-400')}
                  {capa(selectedLayer).category}
                </span>
                <span className="text-xs text-gray-400 font-mono hidden sm:inline">
                  {tr('[ FICHA DE ARQUITECTURA ]', '[ ARCHITECTURE SHEET ]')}
                </span>
              </div>
              <h3 className="text-white text-lg sm:text-2xl font-bold tracking-tight">
                {selectedMesaInfo ? selectedMesaInfo.nombre : capa(selectedLayer).title}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {selectedMesaInfo ? selectedMesaInfo.subtitulo : capa(selectedLayer).description}
              </p>
            </div>
          </div>

          {/* Botón de Cierre Superior (X) */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors cursor-pointer shrink-0"
            aria-label={tr('Cerrar ficha', 'Close sheet')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Pestañas de Navegación Interna */}
        <div className="flex border-b border-white/10 my-4 gap-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-2.5 px-3 uppercase tracking-wider transition-colors cursor-pointer border-b-2 font-medium ${
              activeTab === 'general'
                ? 'border-red-500 text-white font-bold'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            {tr('1. Función y Concepto', '1. Role & Concept')}
          </button>
          <button
            onClick={() => setActiveTab('conectores')}
            className={`pb-2.5 px-3 uppercase tracking-wider transition-colors cursor-pointer border-b-2 font-medium ${
              activeTab === 'conectores'
                ? 'border-red-500 text-white font-bold'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            {tr('2. Conexiones e Interfaz', '2. Connections & Interface')}
          </button>
          <button
            onClick={() => setActiveTab('medidas')}
            className={`pb-2.5 px-3 uppercase tracking-wider transition-colors cursor-pointer border-b-2 font-medium ${
              activeTab === 'medidas'
                ? 'border-red-500 text-white font-bold'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            {tr('3. Medidas, Tamaño y Peso', '3. Dimensions, Size & Weight')}
          </button>
        </div>

        {/* Contenido según Pestaña Activa */}
        <div className="space-y-5 my-2">
          {selectedMesaInfo ? (
            <>
              {activeTab === 'general' && (
                <div className="space-y-4">
                  {/* Resumen Rápido */}
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm leading-relaxed text-gray-200 font-sans">
                    💡 <span className="font-semibold text-white">{selectedMesaInfo.resumenRapido}</span>
                  </div>

                  {/* ¿Qué es? */}
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2 font-semibold">
                      <HelpCircle size={15} />
                      <span>{tr('¿Qué es exactamente?', 'What is it, exactly?')}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
                      {selectedMesaInfo.queEs}
                    </p>
                  </div>

                  {/* ¿Qué función tiene? */}
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2 font-semibold">
                      <Zap size={15} />
                      <span>{tr('¿Qué función tiene en el ensamble?', 'What does it do in the build?')}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
                      {selectedMesaInfo.queFuncionTiene}
                    </p>
                  </div>

                  {/* Consejo de Oro del Técnico */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 to-transparent border border-red-500/30">
                    <div className="flex items-center gap-2 text-xs font-mono text-red-400 uppercase tracking-wider mb-2 font-semibold">
                      <Sparkles size={15} />
                      <span>{tr('Consejo de Oro del Técnico de Taller', 'Golden Tip from the Workshop Tech')}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans">
                      {selectedMesaInfo.consejoTecnico}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'conectores' && (
                <div className="space-y-4">
                  {/* Conectores principales */}
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-wider mb-3 font-semibold">
                      <Cable size={15} />
                      <span>{tr('Conectores y Puertos Principales', 'Main Connectors & Ports')}</span>
                    </div>
                    <ul className="space-y-2">
                      {selectedMesaInfo.conectores.map((con, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                          <CheckCircle2 size={15} className="text-blue-400 shrink-0 mt-0.5" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* ¿Con qué se conecta? */}
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-wider mb-3 font-semibold">
                      <CircuitBoard size={15} />
                      <span>{tr('¿Con qué otros componentes se conecta y de qué forma?', 'What does it connect to, and how?')}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedMesaInfo.conQueSeConecta.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1"
                        >
                          <div className="text-xs font-semibold text-white flex items-center justify-between">
                            <span>{item.componente}</span>
                            <span className="text-[10px] font-mono text-purple-300 px-1.5 py-0.5 rounded bg-purple-500/10">
                              {item.tipoConexion}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                            {item.explicacion}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'medidas' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                        {tr('Estándar / Formato', 'Standard / Form Factor')}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-white">
                        {selectedMesaInfo.medidas.estandar}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                        {tr('Dimensiones Físicas', 'Physical Dimensions')}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-amber-300 font-mono">
                        {selectedMesaInfo.medidas.dimensiones}
                      </span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                        {tr('Peso Promedio', 'Average Weight')}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-cyan-300 font-mono">
                        {selectedMesaInfo.tamanoYPeso.pesoPromedio}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-gray-400 font-bold flex items-center gap-1.5">
                      <Ruler size={15} className="text-amber-400" />
                      {tr('Detalle Físico y Recomendación de Espacio', 'Physical Details & Space Advice')}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
                      {selectedMesaInfo.medidas.descripcion} {selectedMesaInfo.tamanoYPeso.detalle}
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-300">{capa(selectedLayer).description}</p>
          )}
        </div>

        {/* Pie del Modal con Navegación y Botón al Configurador */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} />
              <span>{tr('Anterior', 'Previous')}</span>
            </button>
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              <span>{tr('Siguiente', 'Next')}</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {selectedLayer.id !== 'cat' && (
              <Link
                href={ruta("configurador")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-mono uppercase tracking-wider font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all cursor-pointer border border-red-400"
              >
                <span>{tr('Configurar con este componente', 'Build with this component')}</span>
                <ExternalLink size={14} />
              </Link>
            )}
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-mono text-white transition-colors cursor-pointer border border-white/10"
            >
              {tr('Cerrar', 'Close')}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="relative w-full max-w-7xl mx-auto select-none mb-12">
      {/* Barra superior de estado con acento rojo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 px-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono tracking-wider uppercase">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <span>{tr('Mesa de Taller y Componentes', 'Workshop Table & Components')}</span>
          </div>
          <span className="text-xs text-gray-400 font-sans hidden md:inline">
            {tr(
              'Haz clic en cualquier pieza para ver su función, medidas y conexiones: CPU, GPU, Placa Madre, RAM, etc.',
              'Click any part to see what it does, its size and its connections: CPU, GPU, motherboard, RAM and more.'
            )}
          </span>
        </div>

        {/* Controles: Ver/Ocultar Nombres */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all border cursor-pointer ${
              showLabels
                ? 'bg-red-600/20 text-red-300 border-red-500/40 shadow-lg shadow-red-600/10'
                : 'bg-[#0e1015]/80 text-gray-400 border-white/10 hover:text-white'
            }`}
          >
            <Eye size={14} />
            {showLabels ? tr('Ocultar Nombres', 'Hide Names') : tr('Ver Nombres', 'Show Names')}
          </button>
        </div>
      </div>

      {/* Pestañas de Selección Rápida con Desplazamiento Fluido y Animación */}
      <div className="relative flex items-center gap-1.5 mb-3 group/pills">
        {/* Botón Animado Desplazar Izquierda */}
        <button
          onClick={() => scrollPills('left')}
          disabled={!canScrollLeft}
          className={`shrink-0 z-10 flex items-center justify-center w-8 h-8 rounded-lg border transition-all cursor-pointer ${
            canScrollLeft
              ? 'bg-[#111318]/90 hover:bg-red-600 text-white border-white/20 hover:border-red-400 shadow-lg shadow-black/60 active:scale-95'
              : 'bg-white/[0.02] text-gray-600 border-white/5 opacity-25 cursor-not-allowed'
          }`}
          aria-label={tr('Desplazar componentes a la izquierda', 'Scroll components left')}
          title={tr('Desplazar a la izquierda', 'Scroll left')}
        >
          <ChevronLeft size={16} />
        </button>

        {/* Gradiente izquierdo cuando se puede desplazar */}
        {canScrollLeft && (
          <div className="absolute left-9 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0a0b0e] to-transparent z-[5] pointer-events-none" />
        )}

        {/* Contenedor desplazable con soporte de rueda de ratón y auto-scroll */}
        <div
          ref={pillsContainerRef}
          onWheel={(e) => {
            if (e.deltaY !== 0 && pillsContainerRef.current) {
              pillsContainerRef.current.scrollBy({ left: e.deltaY * 0.9, behavior: 'smooth' });
              setTimeout(updateScrollButtons, 100);
            }
          }}
          className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none text-xs font-mono scroll-smooth w-full select-none"
        >
          <button
            onClick={handleReset}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              !selectedLayer
                ? 'bg-white text-black font-bold shadow-lg shadow-white/10'
                : 'bg-[#0e1015]/80 border border-white/10 text-gray-400 hover:text-white hover:border-white/25'
            }`}
          >
            <Maximize2 size={12} />
            {tr('Mesa Completa', 'Full Table')}
          </button>

          {interactivePills.map((layer) => {
            const isCurrent = selectedLayer?.id === layer.id;
            return (
              <button
                key={layer.id}
                ref={(el) => {
                  pillRefs.current[layer.id] = el;
                }}
                onClick={() => handleLayerClick(layer as LayerItem)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isCurrent
                    ? 'bg-red-600 text-white font-semibold shadow-lg shadow-red-600/40 border border-red-400 scale-[1.02]'
                    : 'bg-[#0e1015]/80 border border-white/10 text-gray-400 hover:text-white hover:border-white/25'
                }`}
              >
                {renderIcon(layer.category, 13, isCurrent ? 'text-white' : 'text-gray-400')}
                <span>{capa(layer as LayerItem).category}</span>
              </button>
            );
          })}
        </div>

        {/* Gradiente derecho cuando hay elementos ocultos como RAM o CPU */}
        {canScrollRight && (
          <div className="absolute right-9 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0a0b0e] to-transparent z-[5] pointer-events-none" />
        )}

        {/* Botón Animado Desplazar Derecha (con pulso sutil cuando RAM/CPU quedan a la derecha) */}
        <button
          onClick={() => scrollPills('right')}
          disabled={!canScrollRight}
          className={`shrink-0 z-10 flex items-center justify-center w-8 h-8 rounded-lg border transition-all cursor-pointer ${
            canScrollRight
              ? 'bg-[#111318]/90 hover:bg-red-600 text-white border-white/20 hover:border-red-400 shadow-lg shadow-black/60 active:scale-95 animate-pulse hover:animate-none'
              : 'bg-white/[0.02] text-gray-600 border-white/5 opacity-25 cursor-not-allowed'
          }`}
          aria-label={tr('Desplazar componentes a la derecha para ver RAM y CPU', 'Scroll components right to see RAM and CPU')}
          title={tr('Desplazar a la derecha (Ver RAM y CPU)', 'Scroll right (see RAM and CPU)')}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Contenedor de la Mesa Aislado (isolate z-0 para que NUNCA escape por encima del modal) */}
      <div className="relative isolate z-0 w-full overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-black/90 bg-black aspect-[1672/941]">
        {/* Fondo Limpio Base */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <Image
            src={escenaData.canvas.backgroundImage}
            alt={tr('Fondo de Mesa de Trabajo Limpia', 'Clean workbench background')}
            fill
            priority
            sizes="(max-width: 1400px) 100vw, 1400px"
            className="object-cover"
          />
        </div>

        {/* Capas Interactivas (Sin escalado horizontal para evitar superposiciones entre piezas) */}
        {escenaData.layers.map((layer) => {
          const isHovered = hoveredLayer?.id === layer.id;
          const isSelected = selectedLayer?.id === layer.id;
          const isInteractive = layer.id !== 'cup';

          // Jerarquía de superposición por profundidad real en la mesa:
          // La CPU (55) y la RAM (42) están en primer plano. 
          // Cada pieza incrementa su zIndex de forma relativa al seleccionarse (+8) o pasar el cursor (+4),
          // impidiendo que piezas de fondo o intermedias (como la GPU, base 32 -> máx 40) sobrepasen al CPU (base 55 -> máx 63).
          const computedZ = layer.zIndex + (isSelected ? 8 : isHovered ? 4 : 0);

          const clipPath = layer.id === 'gpu'
            ? 'polygon(0% 0%, 100% 0%, 100% 43%, 65% 66%, 23% 100%, 0% 100%)'
            : undefined;

          return (
            <motion.div
              key={layer.id}
              className={`absolute ${isInteractive ? 'cursor-pointer' : 'pointer-events-none'}`}
              style={{
                left: `${layer.percentLeft}%`,
                top: `${layer.percentTop}%`,
                width: `${layer.percentWidth}%`,
                height: `${layer.percentHeight}%`,
                zIndex: computedZ,
              }}
              // Elevación suave en vertical únicamente (y: -6), SIN escalar en ancho (scale: 1)
              // Esto garantiza que jamás invada el espacio físico de los componentes vecinos
              animate={
                isInteractive
                  ? {
                      y: isHovered ? -6 : 0,
                      filter: isSelected
                        ? 'drop-shadow(0 0 16px rgba(239, 68, 68, 0.95)) drop-shadow(0 0 30px rgba(239, 68, 68, 0.5)) brightness(1.12)'
                        : isHovered
                        ? 'drop-shadow(0 8px 18px rgba(239, 68, 68, 0.75)) brightness(1.1)'
                        : 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))',
                    }
                  : { y: 0, filter: 'none' } // El vaso (cup) no tiene sombras ni movimiento
              }
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              onMouseEnter={() => isInteractive && setHoveredLayer(layer as LayerItem)}
              onMouseLeave={() => isInteractive && setHoveredLayer(null)}
              onClick={() => handleLayerClick(layer as LayerItem)}
            >
              <div className="relative w-full h-full" style={{ clipPath }}>
                <Image
                  src={layer.image}
                  alt={capa(layer as LayerItem).title}
                  fill
                  sizes="35vw"
                  className="object-contain"
                />

                {/* Etiquetas Flotantes en Rojo */}
                {showLabels && isInteractive && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase backdrop-blur-md border shadow-2xl transition-all ${
                        isSelected
                          ? 'bg-red-600 text-white border-red-400 font-bold shadow-red-600/50'
                          : isHovered
                          ? 'bg-red-500 text-white border-red-300 font-semibold shadow-red-500/30'
                          : 'bg-black/85 text-gray-200 border-white/15'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected || isHovered ? 'bg-white animate-ping' : 'bg-red-400'
                        }`}
                      />
                      <span>{capa(layer as LayerItem).category}</span>
                    </div>
                  </div>
                )}

                {/* Reacción purrr del gato */}
                {layer.id === 'cat' && catPurr && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: -22, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-600 text-white text-xs font-mono font-bold rounded-xl shadow-lg border border-red-400 whitespace-nowrap pointer-events-none z-50 flex items-center gap-1.5"
                  >
                    <Sparkles size={14} className="fill-current" />
                    {tr('¡Purrr! Zzz... (Ranbisho Supervisor)', 'Purrr! Zzz... (Ranbisho Supervisor)')}
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Renderizado del Modal con Portal en el body (Garantiza 100% z-index frontal sin interrupciones) */}
      {mounted && createPortal(
        <AnimatePresence>
          {isModalOpen && modalContent}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
