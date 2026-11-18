"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Cpu, 
  Clock, 
  Zap, 
  Activity, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Plus,
  SlidersHorizontal,
  Bot
} from "lucide-react";

interface NavbarProps {
  onSimulateDetection: () => void;
  isAiActive?: boolean;
  activeAlertsCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenAddCamera: () => void;
  onOpenAIConfig: () => void;
  autoSimulation: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSimulateDetection,
  isAiActive = true,
  activeAlertsCount,
  soundEnabled,
  onToggleSound,
  isDarkMode,
  onToggleTheme,
  onOpenAddCamera,
  onOpenAIConfig,
  autoSimulation,
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
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-m3-surface-container/95 backdrop-blur-md border-b border-slate-200/80 dark:border-m3-outline-variant/30 px-4 py-3 lg:px-6 shadow-sm transition-colors">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between max-w-[1920px] mx-auto">
        
        {/* Marca & Identidad M3 */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white shadow-md transition-transform hover:scale-105">
            <ShieldAlert className="h-6 w-6" />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-m3-on-surface">
                SENTINEL<span className="text-blue-600 dark:text-m3-primary">.AI</span>
              </h1>
              <span className="text-[11px] font-mono tracking-wider font-semibold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-m3-surface-container-highest dark:text-m3-on-surface-variant dark:border-m3-outline-variant/40">
                Material You 3.0
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-m3-on-surface-variant flex items-center gap-1.5 mt-0.5">
              <span>Centro de Monitoreo & Detección de Violencia</span>
              <span className="inline-block w-1 h-1 rounded-full bg-slate-300 dark:bg-m3-outline" />
              <span className="text-emerald-600 dark:text-m3-tertiary font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                IA Online (ViT)
              </span>
            </p>
          </div>
        </div>

        {/* Centro: Telemetría & M3 Assist Chips */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          
          {/* M3 Assist Chip: Estado de IA y Ajustes */}
          <button
            onClick={onOpenAIConfig}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/70 dark:bg-m3-surface-container-high border border-slate-200 dark:border-m3-outline-variant/40 text-slate-700 dark:text-m3-on-surface shadow-xs transition-colors"
            title="Abrir Calibración de IA"
          >
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
            </div>
            <Cpu className="h-3.5 w-3.5 text-blue-600 dark:text-m3-primary" />
            <span className="font-medium text-[11px] sm:text-xs">
              IA: <strong>ViT-Violence v2.4</strong>
            </span>
            <SlidersHorizontal className="h-3 w-3 text-slate-400" />
          </button>

          {/* Indicador de Auto Simulación Activa */}
          {autoSimulation && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 dark:bg-m3-warning-container dark:text-m3-on-warning-container font-semibold animate-pulse text-[11px]">
              <Bot className="h-3.5 w-3.5 text-amber-600" />
              <span>Demo Continuo Activo</span>
            </span>
          )}

          {/* M3 Assist Chip: Incidentes Activos */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 text-[11px] sm:text-xs ${
            activeAlertsCount > 0
              ? "bg-red-50 text-red-700 border-red-300 dark:bg-m3-error-container dark:text-m3-on-error-container dark:border-m3-error/50 font-bold shadow-xs animate-pulse"
              : "bg-slate-100/90 text-slate-600 border-slate-200 dark:bg-m3-surface-container-high dark:text-m3-on-surface-variant dark:border-m3-outline-variant/40"
          }`}>
            <Activity className="h-3.5 w-3.5" />
            <span>
              Incidentes: <strong className={activeAlertsCount > 0 ? "text-red-700 dark:text-red-300" : "text-slate-800 dark:text-m3-on-surface"}>{activeAlertsCount}</strong>
            </span>
          </div>

          {/* M3 Assist Chip: Reloj y Fecha */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/90 dark:bg-m3-surface-container-high border border-slate-200 dark:border-m3-outline-variant/40 text-slate-700 dark:text-m3-on-surface font-mono text-[11px] sm:text-xs">
            <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-m3-warning" />
            <span className="hidden xl:inline font-sans text-slate-500 dark:text-m3-on-surface-variant">{currentDate}</span>
            <span className="font-bold tabular-nums text-slate-900 dark:text-m3-on-surface">
              {currentTime || "00:00:00"}
            </span>
            <span className="text-[10px] text-blue-700 dark:text-m3-primary font-bold px-1.5 rounded-full bg-blue-100/80 dark:bg-m3-surface-container-highest">
              UTC-5
            </span>
          </div>

        </div>

        {/* Acciones del Operador */}
        <div className="flex items-center gap-2">
          
          {/* Añadir Cámara Rápido */}
          <button
            onClick={onOpenAddCamera}
            className="m3-state-layer h-10 px-3.5 hidden sm:flex items-center gap-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-m3-surface-container-highest text-slate-700 dark:text-m3-on-surface border border-slate-200 dark:border-m3-outline-variant/40 text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="h-4 w-4 text-blue-600" />
            <span>Añadir</span>
          </button>

          {/* Toggle de Tema (Claro / Oscuro) */}
          <button
            onClick={onToggleTheme}
            aria-label={isDarkMode ? "Cambiar a Tema Claro" : "Cambiar a Tema Oscuro"}
            title={isDarkMode ? "Cambiar a Tema Claro" : "Cambiar a Tema Oscuro"}
            className="m3-state-layer h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-m3-surface-container-highest text-slate-700 dark:text-m3-on-surface border border-slate-200 dark:border-m3-outline-variant/40 hover:bg-slate-200 transition-colors"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>

          {/* Toggle Sonido Alarma */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? "Desactivar alarma sonora" : "Activar alarma sonora"}
            title={soundEnabled ? "Alarma Sonora Activa" : "Alarma Sonora Silenciada"}
            className={`m3-state-layer h-10 w-10 flex items-center justify-center rounded-full border transition-all ${
              soundEnabled
                ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-m3-surface-container-highest dark:text-m3-primary dark:border-m3-outline-variant/50"
                : "bg-slate-100 text-slate-400 border-slate-200 dark:bg-m3-surface-container dark:text-m3-outline dark:border-m3-outline-variant/30"
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-blue-600 dark:text-m3-primary" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>

          {/* Extended Action Button: Simular Detección */}
          <button
            onClick={onSimulateDetection}
            className="m3-state-layer group flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-medium text-xs shadow-md hover:shadow-lg active:scale-95 transition-all duration-200"
            title="Genera un evento de violencia simulado evaluado por IA"
          >
            <Zap className="h-4 w-4 fill-current group-hover:rotate-12 transition-transform text-amber-300" />
            <span className="font-semibold tracking-wide">Simular Violencia IA</span>
            <span className="flex h-2 w-2 rounded-full bg-white animate-ping" />
          </button>

        </div>

      </div>
    </header>
  );
};
