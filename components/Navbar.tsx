"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Cpu, 
  Clock, 
  Radio, 
  Zap,
  Activity
} from "lucide-react";

interface NavbarProps {
  onSimulateDetection: () => void;
  isAiActive?: boolean;
  activeAlertsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSimulateDetection,
  isAiActive = true,
  activeAlertsCount,
}) => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
      setCurrentDate(
        now.toLocaleDateString("es-ES", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 py-3 lg:px-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        
        {/* Marca & Título */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 shadow-lg shadow-red-950/40 border border-red-500/30">
            <ShieldAlert className="h-5 w-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-wider text-slate-100 uppercase">
                SENTINEL<span className="text-red-500">.AI</span>
              </h1>
              <span className="text-[10px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/70">
                MVP v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Sistema de Monitoreo & Detección de Violencia
            </p>
          </div>
        </div>

        {/* Centro: Estado de la IA & Telemetría */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-mono">
          {/* Badge Estado IA */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <div className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                isAiActive ? "bg-emerald-400 opacity-75" : "bg-zinc-400"
              }`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isAiActive ? "bg-emerald-500" : "bg-zinc-500"
              }`} />
            </div>
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-slate-300">
              IA:{" "}
              <strong className={isAiActive ? "text-emerald-400" : "text-zinc-400"}>
                {isAiActive ? "ACTIVA (ResNet-Violence)" : "STANDBY"}
              </strong>
            </span>
          </div>

          {/* Estado de Alertas Activas */}
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
            activeAlertsCount > 0
              ? "bg-red-950/40 border-red-800/80 text-red-300 animate-pulse"
              : "bg-slate-900 border-slate-800 text-slate-400"
          }`}>
            <Activity className="h-3.5 w-3.5" />
            <span>
              Incidentes Activos:{" "}
              <strong className={activeAlertsCount > 0 ? "text-red-400" : "text-slate-300"}>
                {activeAlertsCount}
              </strong>
            </span>
          </div>

          {/* Reloj en tiempo real */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-slate-400 hidden xl:inline">{currentDate}</span>
            <span className="font-semibold tabular-nums text-slate-100">
              {currentTime || "00:00:00"}
            </span>
            <span className="text-[10px] text-cyan-400 font-bold">UTC-5</span>
          </div>
        </div>

        {/* Acciones: Botón Simulador */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSimulateDetection}
            className="group relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg text-white bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 shadow-md shadow-red-950/50 border border-red-500/50 hover:border-red-400 transition-all duration-200 active:scale-95"
            title="Simula un evento de violencia detectado por la IA"
          >
            <Zap className="h-4 w-4 text-amber-300 group-hover:scale-110 transition-transform" />
            <span>Simular Detección de Violencia</span>
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
          </button>
        </div>

      </div>
    </header>
  );
};
