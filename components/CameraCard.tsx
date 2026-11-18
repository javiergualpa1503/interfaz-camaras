"use client";

import React, { useState, useEffect } from "react";
import { 
  Camera as CameraType 
} from "@/types/security";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Video, 
  Maximize2, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Eye
} from "lucide-react";

interface CameraCardProps {
  camera: CameraType;
  onResolveAlert: (cameraId: string) => void;
}

export const CameraCard: React.FC<CameraCardProps> = ({
  camera,
  onResolveAlert,
}) => {
  const [timestamp, setTimestamp] = useState<string>("");
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const isAlert = camera.status === "alert";

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimestamp(
        now.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-slate-900 transition-all duration-300 shadow-lg ${
        isAlert
          ? "border-red-500 shadow-red-950/60 ring-2 ring-red-500/80 animate-pulse-fast"
          : "border-slate-800 hover:border-slate-700/80 shadow-slate-950/50"
      }`}
    >
      {/* Barra superior de la tarjeta (HUD Metadata) */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-3 py-2 text-xs backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400"></span>
          <span className="font-semibold text-slate-200 tracking-wide">
            {camera.name}
          </span>
          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
            ({camera.location})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
            {camera.fps} FPS
          </span>
          <span className="font-mono text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
            {camera.resolution}
          </span>
        </div>
      </div>

      {/* Área de Visualización de Transmisión de Cámara (Simulación de Video) */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950 flex items-center justify-center">
        
        {/* Grilla de fondo / HUD de seguridad */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        {/* Efecto de línea de escaneo (Scanline) */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-16 w-full animate-scanline" />

        {/* Viñeta para ambientación cinematográfica */}
        <div className="absolute inset-0 pointer-events-none bg-radial-vignette opacity-70" />

        {/* Silueta visual de la cámara (Simulación gráfica de espacio monitoreado) */}
        <div className="relative z-0 flex flex-col items-center justify-center text-slate-700 select-none">
          <div className="relative w-24 h-24 rounded-full border border-dashed border-slate-700/50 flex items-center justify-center">
            {/* Mirilla / Crosshair */}
            <div className="absolute w-full h-[1px] bg-slate-700/40" />
            <div className="absolute h-full w-[1px] bg-slate-700/40" />
            <div className="w-8 h-8 rounded-full border border-slate-600/60" />
            <Eye className="w-5 h-5 text-slate-600" />
          </div>
          <span className="mt-2 text-[11px] font-mono tracking-widest uppercase text-slate-600">
            FEED ACTIVO // CANAL {camera.id.toUpperCase()}
          </span>
        </div>

        {/* Caja Bounding Box de la IA cuando se detecta violencia */}
        {isAlert && (
          <div className="absolute z-10 top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-red-500 rounded bg-red-500/10 pointer-events-none flex flex-col justify-between p-1 shadow-[0_0_20px_rgba(239,68,68,0.5)]">
            <div className="flex items-center justify-between">
              <span className="bg-red-600 text-white font-mono text-[9px] font-bold px-1 rounded uppercase tracking-wider animate-pulse">
                OBJETO: CONFLICTO #{camera.id}
              </span>
              <span className="bg-red-950/80 text-red-300 font-mono text-[9px] px-1 rounded border border-red-600/50">
                CONF: {camera.confidence || 94}%
              </span>
            </div>
            
            <div className="text-right">
              <span className="text-[9px] font-mono text-red-400 bg-black/60 px-1 rounded">
                DETECCIÓN EN TIEMPO REAL
              </span>
            </div>
          </div>
        )}

        {/* Indicadores en esquina superior izquierda del stream: REC + EN VIVO */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded bg-black/75 px-2 py-1 text-[11px] font-bold text-red-400 backdrop-blur-sm border border-red-900/40">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span>EN VIVO</span>
          </div>

          <div className="rounded bg-black/75 px-2 py-1 text-[10px] font-mono text-slate-300 backdrop-blur-sm border border-slate-800">
            REC ●
          </div>
        </div>

        {/* Timestamp en esquina inferior izquierda del stream */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
          <div className="rounded bg-black/75 px-2 py-0.5 font-mono text-xs text-slate-300 backdrop-blur-sm border border-slate-800">
            {timestamp || "12:00:00"}
          </div>
        </div>

        {/* Controles de cámara rápidos (esquina inferior derecha) */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="rounded bg-black/70 p-1 text-slate-300 hover:text-white hover:bg-black/90 transition-colors"
            title={isMuted ? "Activar audio" : "Silenciar audio"}
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>
          <button
            className="rounded bg-black/70 p-1 text-slate-300 hover:text-white hover:bg-black/90 transition-colors"
            title="Pantalla completa"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Alerta Banner Flotante dentro del video si hay violencia */}
        {isAlert && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-lg bg-red-600/95 px-2.5 py-1 text-xs font-bold text-white shadow-lg shadow-red-950/80 animate-bounce">
            <AlertTriangle className="h-4 w-4" />
            <span>¡VIOLENCIA DETECTADA!</span>
            <span className="font-mono text-red-200 text-[11px]">
              ({camera.confidence || 94}%)
            </span>
          </div>
        )}
      </div>

      {/* Pie de la tarjeta: Estado de la IA y Botón de Acción */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 bg-slate-950/90 px-3 py-2.5">
        
        {/* Badge de Estado de la IA */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium">Estado IA:</span>
          {isAlert ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-950/80 border border-red-700/80 px-2.5 py-0.5 text-xs font-bold text-red-400 shadow-sm animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
              ¡VIOLENCIA ({camera.confidence || 94}%)!
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/70 border border-emerald-800/60 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Normal
            </span>
          )}
        </div>

        {/* Botón de Falsa Alarma / Resolver cuando la cámara está en alerta */}
        {isAlert && (
          <button
            onClick={() => onResolveAlert(camera.id)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-100 hover:text-white border border-slate-700 hover:border-slate-600 transition-colors shadow-sm active:scale-95"
          >
            <RotateCcw className="h-3 w-3 text-amber-400" />
            <span>Falsa alarma / Resolver</span>
          </button>
        )}
      </div>
    </div>
  );
};
