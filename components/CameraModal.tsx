"use client";

import React, { useEffect } from "react";
import { Camera as CameraType } from "@/types/security";
import { 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  RotateCcw, 
  Eye, 
  Radio, 
  Download,
  AlertOctagon,
  Sliders,
  Sparkles,
  MapPin
} from "lucide-react";

interface CameraModalProps {
  camera: CameraType | null;
  isOpen: boolean;
  onClose: () => void;
  onResolveAlert: (cameraId: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  camera,
  isOpen,
  onClose,
  onResolveAlert,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !camera) return null;

  const isAlert = camera.status === "alert";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-m3-surface-container-high text-slate-900 dark:text-m3-on-surface rounded-m3-3xl shadow-2xl border border-slate-200 dark:border-m3-outline-variant/40 overflow-hidden flex flex-col max-h-[90vh] animate-scale-in"
        role="dialog"
        aria-modal="true"
      >
        {/* Cabecera del Dialog (M3 Title Bar en fondo claro) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-m3-outline-variant/30 bg-slate-50/90 dark:bg-m3-surface-container">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
              isAlert ? "bg-red-100 text-red-600 dark:bg-m3-error-container dark:text-m3-on-error-container" : "bg-blue-100 text-blue-700 dark:bg-m3-primary-container dark:text-m3-on-primary-container"
            }`}>
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-m3-on-surface tracking-tight">
                  Inspección Detallada: {camera.name}
                </h3>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-m3-surface-container-highest dark:text-m3-primary dark:border-m3-outline-variant/30 font-semibold">
                  {camera.resolution} • {camera.fps} FPS
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-m3-on-surface-variant flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3 text-slate-400" />
                <span>Ubicación: <strong className="text-slate-800 dark:text-m3-on-surface">{camera.location}</strong></span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="m3-state-layer h-10 w-10 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 dark:text-m3-on-surface-variant dark:hover:text-m3-on-surface dark:hover:bg-m3-surface-container-highest transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cuerpo del Dialog */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Feed de Video en Alta Definición */}
          <div className="relative aspect-video w-full rounded-m3-2xl overflow-hidden bg-[#090d16] border border-slate-800 shadow-inner flex items-center justify-center">
            {/* Patrón HUD */}
            <div className="absolute inset-0 m3-hud-grid opacity-30 pointer-events-none" />
            <div className="absolute inset-0 m3-vignette pointer-events-none" />
            
            {/* Línea de escaneo */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent h-20 w-full animate-scanline" />

            {/* Simulación Gráfica Central */}
            <div className="relative flex flex-col items-center justify-center text-slate-500 select-none">
              <div className="relative w-32 h-32 rounded-full border border-dashed border-slate-600/50 flex items-center justify-center">
                <div className="absolute w-full h-[1px] bg-slate-600/30" />
                <div className="absolute h-full w-[1px] bg-slate-600/30" />
                <div className="w-12 h-12 rounded-full border border-slate-500/50 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <span className="mt-3 font-mono text-xs tracking-widest text-slate-400 font-semibold uppercase">
                FEED HD // CÁMARA #{camera.id.toUpperCase()}
              </span>
            </div>

            {/* Bounding Box si hay alerta */}
            {isAlert && (
              <div className="absolute z-10 top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-red-500 rounded-m3-lg bg-red-600/15 flex flex-col justify-between p-2 shadow-[0_0_30px_rgba(239,68,68,0.5)]">
                <div className="flex items-center justify-between">
                  <span className="bg-red-600 text-white font-mono text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                    CONF CONFLICTO: {camera.confidence || 94}%
                  </span>
                  <span className="bg-black/80 text-red-200 font-mono text-xs px-2 py-0.5 rounded-full border border-red-500/50">
                    BBOX [X: 250, Y: 180, W: 400, H: 300]
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-red-300 bg-black/80 px-2 py-0.5 rounded-full">
                    MODELO: ViT-Violence-Detect-v2.4
                  </span>
                </div>
              </div>
            )}

            {/* Badges superiores en el feed */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1 text-xs font-bold text-red-400 border border-red-900/50 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                <span>EN VIVO 1080p</span>
              </span>
              <span className="rounded-full bg-black/80 px-3 py-1 font-mono text-xs text-slate-300 border border-slate-700/60 backdrop-blur-md">
                REC ● 24/7 CLOUD
              </span>
            </div>

            {/* Banner Flotante si hay alerta */}
            {isAlert && (
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2 rounded-full bg-red-600 text-white px-4 py-1.5 text-xs font-bold shadow-lg animate-bounce">
                <AlertTriangle className="h-4 w-4 fill-current text-yellow-300" />
                <span>¡AGRESIÓN DETECTADA EN CURSO!</span>
              </div>
            )}
          </div>

          {/* Panel de Telemetría en M3 Cards Claros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Card 1: Nivel de Amenaza */}
            <div className={`p-4 rounded-m3-2xl border transition-all ${
              isAlert 
                ? "bg-red-50 border-red-200 text-red-900 dark:bg-m3-error-container/40 dark:border-m3-error/60 dark:text-m3-on-error-container"
                : "bg-slate-50 border-slate-200 text-slate-900 dark:bg-m3-surface-container dark:border-m3-outline-variant/30 dark:text-m3-on-surface"
            }`}>
              <div className="flex items-center gap-2 text-xs font-semibold mb-1 opacity-80">
                <AlertOctagon className="h-4 w-4" />
                <span>Nivel de Amenaza</span>
              </div>
              <p className="text-base font-bold">
                {isAlert ? "CRÍTICO (Acción Requerida)" : "NORMAL (Despejado)"}
              </p>
              <p className="text-xs mt-1 opacity-80">
                {isAlert ? "Patrones violentos verificados por IA." : "Sin conductas atípicas reportadas."}
              </p>
            </div>

            {/* Card 2: Certeza IA */}
            <div className="p-4 rounded-m3-2xl bg-slate-50 border border-slate-200 text-slate-900 dark:bg-m3-surface-container dark:border-m3-outline-variant/30 dark:text-m3-on-surface">
              <div className="flex items-center gap-2 text-xs font-semibold mb-1 text-slate-600 dark:text-m3-on-surface-variant">
                <Sparkles className="h-4 w-4 text-blue-600 dark:text-m3-primary" />
                <span>Certeza Algorítmica</span>
              </div>
              <p className="text-base font-bold font-mono">
                {isAlert ? `${camera.confidence || 94}% Certeza` : "99.8% Calibrado"}
              </p>
              <div className="w-full bg-slate-200 dark:bg-m3-surface-container-highest h-2 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    isAlert ? "bg-red-600 w-[94%]" : "bg-emerald-500 w-[99%]"
                  }`} 
                />
              </div>
            </div>

            {/* Card 3: Datos de Dispositivo */}
            <div className="p-4 rounded-m3-2xl bg-slate-50 border border-slate-200 text-slate-900 dark:bg-m3-surface-container dark:border-m3-outline-variant/30 dark:text-m3-on-surface">
              <div className="flex items-center gap-2 text-xs font-semibold mb-1 text-slate-600 dark:text-m3-on-surface-variant">
                <Sliders className="h-4 w-4 text-slate-600 dark:text-m3-secondary" />
                <span>Especificaciones Stream</span>
              </div>
              <div className="text-xs font-mono space-y-0.5 text-slate-600 dark:text-m3-on-surface-variant mt-1">
                <div>Codec: <strong className="text-slate-900 dark:text-m3-on-surface">H.265 / HEVC</strong></div>
                <div>Bitrate: <strong className="text-slate-900 dark:text-m3-on-surface">8.4 Mbps</strong></div>
                <div>Latencia RTSP: <strong className="text-emerald-600 dark:text-m3-tertiary">32 ms</strong></div>
              </div>
            </div>

          </div>

        </div>

        {/* Barra de Acciones Inferior */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 dark:border-m3-outline-variant/30 bg-slate-50/90 dark:bg-m3-surface-container">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => alert(`Descargando captura forense de evidencia para ${camera.name}...`)}
              className="m3-state-layer inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 dark:border-m3-outline-variant text-xs font-medium text-slate-700 dark:text-m3-on-surface hover:bg-slate-100 dark:hover:bg-m3-surface-container-highest transition-colors shadow-xs"
            >
              <Download className="h-4 w-4" />
              <span>Guardar Evidencia</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {isAlert && (
              <button
                onClick={() => {
                  onResolveAlert(camera.id);
                  onClose();
                }}
                className="m3-state-layer inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700 active:scale-95 transition-all"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Marcar Resuelto / Falsa Alarma</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="m3-state-layer px-5 py-2.5 rounded-full bg-slate-200 dark:bg-m3-surface-container-highest hover:bg-slate-300 dark:hover:bg-m3-surface-container-highest/80 text-xs font-semibold text-slate-800 dark:text-m3-on-surface transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
