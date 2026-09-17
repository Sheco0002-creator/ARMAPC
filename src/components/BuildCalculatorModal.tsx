"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertTriangle, Cpu, Zap, CircuitBoard, Layers, Gauge, ArrowRight, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import componentsData from "@/data/components.json";

interface BuildCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ComponentOption {
  id: string;
  name: string;
  price: number;
  socket?: string;
  tdp?: number;
  powerDraw?: number;
  wattage?: number;
  ramType?: string;
}

const getCategoryItems = (catId: string): ComponentOption[] => {
  const cat = componentsData.categories.find((c) => c.id === catId);
  // Esta calculadora es de presupuesto: los europeos/asiáticos (importacionGlobal) sólo se
  // ofrecen en el configurador, con su aviso naranja, igual que no entran en /presupuestos.
  const items = (cat?.items || []) as (ComponentOption & { importacionGlobal?: boolean })[];
  return items.filter((it) => !it.importacionGlobal);
};

export function BuildCalculatorModal({ isOpen, onClose }: BuildCalculatorModalProps) {
  const cpuOptions = getCategoryItems("cpu");
  const moboOptions = getCategoryItems("motherboard");
  const gpuOptions = getCategoryItems("gpu");
  const ramOptions = getCategoryItems("ram");
  const psuOptions = getCategoryItems("psu");

  const [selectedCpu, setSelectedCpu] = useState<ComponentOption>(cpuOptions[1] || cpuOptions[0]);
  const [selectedMobo, setSelectedMobo] = useState<ComponentOption>(moboOptions[1] || moboOptions[0]);
  const [selectedGpu, setSelectedGpu] = useState<ComponentOption>(gpuOptions[2] || gpuOptions[0]);
  const [selectedRam, setSelectedRam] = useState<ComponentOption>(ramOptions[1] || ramOptions[0]);
  const [selectedPsu, setSelectedPsu] = useState<ComponentOption>(psuOptions[2] || psuOptions[0]);

  const estimatedTotal =
    (selectedCpu?.price || 0) +
    (selectedMobo?.price || 0) +
    (selectedGpu?.price || 0) +
    (selectedRam?.price || 0) +
    (selectedPsu?.price || 0) +
    75; // + SSD NVMe 1TB base

  const cpuTdp = selectedCpu?.tdp || 65;
  const gpuPower = selectedGpu?.powerDraw || 220;
  const estimatedWattage = cpuTdp + gpuPower + 85; // +85W motherboard, fans, RAM & SSD
  const recommendedPsu = Math.ceil((estimatedWattage * 1.35) / 50) * 50;

  // Compatibility Checks
  const socketMatches = selectedCpu?.socket === selectedMobo?.socket;
  const psuSufficient = (selectedPsu?.wattage || 0) >= estimatedWattage;
  const ramCompatible = selectedMobo?.ramType === selectedRam?.ramType;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0d0f12] text-white rounded-xl border border-gray-800 shadow-2xl z-10 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800 sticky top-0 bg-[#0d0f12]/95 backdrop-blur-md z-20">
              <div>
                <div className="text-[10px] font-mono tracking-widest uppercase text-gray-400">
                  MATRIZ RÁPIDA DE COMPATIBILIDAD 2026
                </div>
                <h2 className="text-xl md:text-2xl font-medium tracking-tight text-white mt-0.5">
                  Simulador de Ensamble & Presupuesto USD
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar modal"
                className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 md:p-8 space-y-8">
              {/* Selectors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CPU Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-300 flex items-center gap-2">
                    <Cpu size={14} /> Procesador (CPU)
                  </label>
                  <select
                    value={selectedCpu?.id}
                    onChange={(e) => {
                      const item = cpuOptions.find((c) => c.id === e.target.value);
                      if (item) setSelectedCpu(item);
                    }}
                    className="w-full p-3 rounded-md bg-white/[0.04] border border-gray-700 text-sm text-white focus:outline-none focus:border-white transition-colors cursor-pointer"
                  >
                    {cpuOptions.map((opt) => (
                      <option key={opt.id} value={opt.id} className="bg-[#111] text-white">
                        {opt.name} — ${opt.price} USD ({opt.socket}, {opt.tdp}W)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Motherboard Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-300 flex items-center gap-2">
                    <CircuitBoard size={14} /> Placa Base (Motherboard)
                  </label>
                  <select
                    value={selectedMobo?.id}
                    onChange={(e) => {
                      const item = moboOptions.find((m) => m.id === e.target.value);
                      if (item) setSelectedMobo(item);
                    }}
                    className="w-full p-3 rounded-md bg-white/[0.04] border border-gray-700 text-sm text-white focus:outline-none focus:border-white transition-colors cursor-pointer"
                  >
                    {moboOptions.map((opt) => (
                      <option key={opt.id} value={opt.id} className="bg-[#111] text-white">
                        {opt.name} — ${opt.price} USD ({opt.socket}, {opt.ramType})
                      </option>
                    ))}
                  </select>
                </div>

                {/* GPU Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-300 flex items-center gap-2">
                    <Zap size={14} /> Tarjeta Gráfica (GPU)
                  </label>
                  <select
                    value={selectedGpu?.id}
                    onChange={(e) => {
                      const item = gpuOptions.find((g) => g.id === e.target.value);
                      if (item) setSelectedGpu(item);
                    }}
                    className="w-full p-3 rounded-md bg-white/[0.04] border border-gray-700 text-sm text-white focus:outline-none focus:border-white transition-colors cursor-pointer"
                  >
                    {gpuOptions.map((opt) => (
                      <option key={opt.id} value={opt.id} className="bg-[#111] text-white">
                        {opt.name} — ${opt.price} USD ({opt.powerDraw}W)
                      </option>
                    ))}
                  </select>
                </div>

                {/* RAM Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-300 flex items-center gap-2">
                    <Layers size={14} /> Memoria RAM
                  </label>
                  <select
                    value={selectedRam?.id}
                    onChange={(e) => {
                      const item = ramOptions.find((r) => r.id === e.target.value);
                      if (item) setSelectedRam(item);
                    }}
                    className="w-full p-3 rounded-md bg-white/[0.04] border border-gray-700 text-sm text-white focus:outline-none focus:border-white transition-colors cursor-pointer"
                  >
                    {ramOptions.map((opt) => (
                      <option key={opt.id} value={opt.id} className="bg-[#111] text-white">
                        {opt.name} — ${opt.price} USD
                      </option>
                    ))}
                  </select>
                </div>

                {/* PSU Selector */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-300 flex items-center gap-2">
                    <Gauge size={14} /> Fuente de Poder (PSU)
                  </label>
                  <select
                    value={selectedPsu?.id}
                    onChange={(e) => {
                      const item = psuOptions.find((p) => p.id === e.target.value);
                      if (item) setSelectedPsu(item);
                    }}
                    className="w-full p-3 rounded-md bg-white/[0.04] border border-gray-700 text-sm text-white focus:outline-none focus:border-white transition-colors cursor-pointer"
                  >
                    {psuOptions.map((opt) => (
                      <option key={opt.id} value={opt.id} className="bg-[#111] text-white">
                        {opt.name} — ${opt.price} USD ({opt.wattage}W)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status and Verification Panel */}
              <div className="p-6 rounded-lg bg-white/[0.03] border border-gray-800 space-y-4">
                <div className="text-xs font-mono uppercase tracking-widest text-gray-400">
                  DIAGNÓSTICO AUTOMATIZADO DE HARDWARE
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Socket Status */}
                  <div className="flex items-start gap-3 p-3 rounded bg-black/40 border border-gray-800">
                    {socketMatches ? (
                      <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                    ) : (
                      <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={18} />
                    )}
                    <div>
                      <div className="text-xs font-semibold text-white">Socket Físico</div>
                      <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                        {socketMatches
                          ? `Coincide (${selectedCpu?.socket})`
                          : `Incompatible: ${selectedCpu?.socket} vs ${selectedMobo?.socket}`}
                      </div>
                    </div>
                  </div>

                  {/* RAM Status */}
                  <div className="flex items-start gap-3 p-3 rounded bg-black/40 border border-gray-800">
                    {ramCompatible ? (
                      <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                    ) : (
                      <AlertTriangle className="text-rose-400 shrink-0 mt-0.5" size={18} />
                    )}
                    <div>
                      <div className="text-xs font-semibold text-white">Estándar DDR5</div>
                      <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                        {ramCompatible ? "DDR5 Compatible" : "Incompatibilidad de memoria"}
                      </div>
                    </div>
                  </div>

                  {/* Power Margin Status */}
                  <div className="flex items-start gap-3 p-3 rounded bg-black/40 border border-gray-800">
                    {psuSufficient ? (
                      <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                    ) : (
                      <AlertTriangle className="text-rose-400 shrink-0 mt-0.5" size={18} />
                    )}
                    <div>
                      <div className="text-xs font-semibold text-white">Consumo Eléctrico</div>
                      <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                        {estimatedWattage}W demanda / {selectedPsu?.wattage}W fuente
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Calculation & Full Configurator Link */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-4 border-t border-gray-800">
                <div>
                  <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                    Costo Total Estimado (USD)
                  </div>
                  <div className="text-3xl font-medium tracking-tight text-white mt-0.5">
                    ${estimatedTotal.toLocaleString()}{" "}
                    <span className="text-xs text-gray-500 font-mono font-normal">+ SSD Base</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    href="/configurador"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 bg-white text-black px-5 py-3 rounded-md font-mono text-xs uppercase tracking-wider font-semibold hover:bg-gray-200 transition-all cursor-pointer"
                  >
                    <SlidersHorizontal size={14} />
                    Configurador Completo
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
