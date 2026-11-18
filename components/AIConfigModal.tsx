"use client";

import React, { useState } from "react";
import { 
  X, 
  Cpu, 
  Sliders, 
  Volume2, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Zap,
  SlidersHorizontal
} from "lucide-react";

interface AIConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  voiceAlertsEnabled: boolean;
  onToggleVoiceAlerts: () => void;
  confidenceThreshold: number;
  onChangeThreshold: (val: number) => void;
  autoSimulation: boolean;
  onToggleAutoSimulation: () => void;
}

export const AIConfigModal: React.FC<AIConfigModalProps> = ({
  isOpen,
  onClose,
  voiceAlertsEnabled,
  onToggleVoiceAlerts,
  confidenceThreshold,
  onChangeThreshold,
  autoSimulation,
  onToggleAutoSimulation,
}) => {
  const [detectWeapons, setDetectWeapons] = useState<boolean>(true);
  const [detectFalls, setDetectFalls] = useState<boolean>(true);
  const [detectFights, setDetectFights] = useState<boolean>(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-m3-surface-container-high text-slate-900 dark:text-m3-on-surface rounded-m3-3xl shadow-2xl border border-slate-200 dark:border-m3-outline-variant/40 overflow-hidden flex flex-col animate-scale-in"
        role="dialog"
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-m3-outline-variant/30 bg-slate-50 dark:bg-m3-surface-container">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-m3-primary-container dark:text-m3-on-primary-container flex items-center justify-center">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-m3-on-surface tracking-tight">
                Calibración del Motor de IA
              </h3>
              <p className="text-xs text-slate-500 dark:text-m3-on-surface-variant">
                ViT-Violence Neural Engine v2.4
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="m3-state-layer h-9 w-9 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 dark:hover:bg-m3-surface-container-highest"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* Slider de Umbral de Certeza */}
          <div className="p-4 rounded-m3-2xl bg-slate-50 dark:bg-m3-surface-container border border-slate-200/90 dark:border-m3-outline-variant/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-m3-on-surface">
                Umbral Mínimo de Detección:
              </span>
              <span className="font-mono font-bold text-blue-600 dark:text-m3-primary bg-blue-50 dark:bg-m3-surface-container-highest px-2 py-0.5 rounded-full border border-blue-200 dark:border-m3-outline-variant/30">
                {confidenceThreshold}% Certeza
              </span>
            </div>
            <input
              type="range"
              min={60}
              max={95}
              value={confidenceThreshold}
              onChange={(e) => onChangeThreshold(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>60% (Mayor Sensibilidad)</span>
              <span>95% (Alta Precisión)</span>
            </div>
          </div>

          {/* Opciones de Anuncio por Voz y Simulación Automática */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-700 dark:text-m3-on-surface text-[11px] uppercase tracking-wider">
              Automatizaciones & Alertas
            </h4>

            {/* Toggle de Anuncio por Voz Text-to-Speech */}
            <div 
              onClick={onToggleVoiceAlerts}
              className="p-3.5 rounded-m3-xl border border-slate-200 dark:border-m3-outline-variant/40 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-m3-surface-container-high transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  voiceAlertsEnabled ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-500"
                }`}>
                  <Volume2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-m3-on-surface">
                    Locución por Voz Sintetizada (TTS)
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-m3-on-surface-variant">
                    Anuncia verbalmente el canal y ubicación al detectar violencia.
                  </p>
                </div>
              </div>
              <div className={`h-5 w-9 rounded-full transition-colors relative flex items-center p-0.5 ${
                voiceAlertsEnabled ? "bg-blue-600" : "bg-slate-300"
              }`}>
                <div className={`h-4 w-4 rounded-full bg-white transition-transform ${
                  voiceAlertsEnabled ? "translate-x-4" : "translate-x-0"
                }`} />
              </div>
            </div>

            {/* Toggle de Simulación Automática */}
            <div 
              onClick={onToggleAutoSimulation}
              className="p-3.5 rounded-m3-xl border border-slate-200 dark:border-m3-outline-variant/40 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-m3-surface-container-high transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  autoSimulation ? "bg-amber-100 text-amber-700" : "bg-slate-200 text-slate-500"
                }`}>
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-m3-on-surface">
                    Modo Demostración Continua
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-m3-on-surface-variant">
                    Dispara incidentes simulados periódicos cada 25 segundos para pruebas.
                  </p>
                </div>
              </div>
              <div className={`h-5 w-9 rounded-full transition-colors relative flex items-center p-0.5 ${
                autoSimulation ? "bg-amber-500" : "bg-slate-300"
              }`}>
                <div className={`h-4 w-4 rounded-full bg-white transition-transform ${
                  autoSimulation ? "translate-x-4" : "translate-x-0"
                }`} />
              </div>
            </div>
          </div>

          {/* Clases de Detección Activas */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-700 dark:text-m3-on-surface text-[11px] uppercase tracking-wider">
              Clases de Comportamiento Monitoreadas
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setDetectFights(!detectFights)}
                className={`m3-state-layer px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  detectFights 
                    ? "bg-blue-50 text-blue-800 border-blue-300 dark:bg-m3-surface-container-highest dark:text-m3-primary" 
                    : "bg-slate-100 text-slate-500 border-slate-200 opacity-60"
                }`}
              >
                {detectFights && <Check className="h-3 w-3" />}
                <span>Peleas & Agresiones Físicas</span>
              </button>

              <button
                type="button"
                onClick={() => setDetectWeapons(!detectWeapons)}
                className={`m3-state-layer px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  detectWeapons 
                    ? "bg-blue-50 text-blue-800 border-blue-300 dark:bg-m3-surface-container-highest dark:text-m3-primary" 
                    : "bg-slate-100 text-slate-500 border-slate-200 opacity-60"
                }`}
              >
                {detectWeapons && <Check className="h-3 w-3" />}
                <span>Armas sospechosas</span>
              </button>

              <button
                type="button"
                onClick={() => setDetectFalls(!detectFalls)}
                className={`m3-state-layer px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  detectFalls 
                    ? "bg-blue-50 text-blue-800 border-blue-300 dark:bg-m3-surface-container-highest dark:text-m3-primary" 
                    : "bg-slate-100 text-slate-500 border-slate-200 opacity-60"
                }`}
              >
                {detectFalls && <Check className="h-3 w-3" />}
                <span>Caídas & Forcejeos</span>
              </button>
            </div>
          </div>

        </div>

        {/* Pie */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-100 dark:border-m3-outline-variant/30 bg-slate-50 dark:bg-m3-surface-container">
          <button
            onClick={onClose}
            className="m3-state-layer px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all"
          >
            Guardar Configuración
          </button>
        </div>

      </div>
    </div>
  );
};
