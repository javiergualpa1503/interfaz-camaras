"use client";

import React, { useState, useEffect, useRef } from "react";
import { Camera as CameraType } from "@/types/security";
import { VideoCanvas, VideoCanvasHandle } from "./VideoCanvas";
import { 
  AlertTriangle, 
  ShieldCheck, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Camera as CameraIcon,
  Moon,
  Sun,
  ZoomIn,
  MapPin,
  ExternalLink,
  ShieldAlert,
  Trash2
} from "lucide-react";

interface CameraCardProps {
  camera: CameraType;
  onResolveAlert: (cameraId: string) => void;
  onInspectCamera?: (camera: CameraType) => void;
  onTriggerEmergency?: (camera: CameraType) => void;
  onDeleteCamera?: (cameraId: string) => void;
}

export const CameraCard: React.FC<CameraCardProps> = ({
  camera,
  onResolveAlert,
  onInspectCamera,
  onTriggerEmergency,
  onDeleteCamera,
}) => {
  const [timestamp, setTimestamp] = useState<string>("");
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isNightVision, setIsNightVision] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const canvasRef = useRef<VideoCanvasHandle | null>(null);

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

  const handleCycleZoom = () => {
    setZoomLevel((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1));
  };

  const handleCaptureSnapshot = () => {
    canvasRef.current?.captureSnapshot(camera.name);
  };

  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-m3-3xl border transition-all duration-300 ${
        isAlert
          ? "bg-white dark:bg-m3-surface-container-low border-2 border-red-500 shadow-[0_4px_24px_rgba(239,68,68,0.22)] ring-1 ring-red-400"
          : "bg-white dark:bg-m3-surface-container-low border-slate-200/90 dark:border-m3-outline-variant/40 hover:border-blue-400 dark:hover:border-m3-primary shadow-sm hover:shadow-md"
      }`}
    >
      {/* 1. Barra Superior de la Tarjeta */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-m3-outline-variant/30 bg-slate-50/90 dark:bg-m3-surface-container/90 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-3 min-w-0">
          <span className={`flex h-3 w-3 shrink-0 rounded-full ${
            isAlert ? "bg-red-500 animate-ping" : "bg-emerald-500"
          }`} />
          <div className="truncate">
            <h3 className="font-bold text-sm text-slate-900 dark:text-m3-on-surface truncate">
              {camera.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-m3-on-surface-variant flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
              <span>{camera.location}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="font-mono text-[10px] font-semibold text-slate-600 dark:text-m3-on-surface-variant bg-white dark:bg-m3-surface-container-highest px-2 py-0.5 rounded-full border border-slate-200 dark:border-m3-outline-variant/30 shadow-xs">
            {camera.fps} FPS
          </span>
          <span className="font-mono text-[10px] font-semibold text-slate-600 dark:text-m3-on-surface-variant bg-white dark:bg-m3-surface-container-highest px-2 py-0.5 rounded-full border border-slate-200 dark:border-m3-outline-variant/30 shadow-xs">
            {camera.resolution}
          </span>
          {onDeleteCamera && (
            <button
              onClick={() => onDeleteCamera(camera.id)}
              title="Eliminar cámara"
              className="text-slate-400 hover:text-red-500 p-1 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Área de Transmisión CCTV con VideoCanvas Interactivo */}
      <div className="p-3 bg-white dark:bg-m3-surface-container-low">
        <div className="relative aspect-video w-full overflow-hidden rounded-m3-2xl bg-black border border-slate-800 shadow-inner flex items-center justify-center">
          
          {/* Canvas Interactivo con renderizado en tiempo real */}
          <VideoCanvas
            ref={canvasRef}
            cameraId={camera.id}
            cameraName={camera.name}
            isAlert={isAlert}
            confidence={camera.confidence}
            isNightVision={isNightVision}
            zoomLevel={zoomLevel}
          />

          {/* Indicadores en esquina: REC + EN VIVO */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 pointer-events-none">
            <div className="flex items-center gap-1.5 rounded-full bg-black/80 px-2.5 py-0.5 text-[11px] font-bold text-red-400 backdrop-blur-sm border border-red-900/40">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span>EN VIVO</span>
            </div>

            {isNightVision && (
              <div className="rounded-full bg-emerald-950/80 px-2 py-0.5 text-[10px] font-mono text-emerald-400 backdrop-blur-sm border border-emerald-800">
                IR ON
              </div>
            )}

            {zoomLevel > 1 && (
              <div className="rounded-full bg-blue-950/80 px-2 py-0.5 text-[10px] font-mono text-blue-300 backdrop-blur-sm border border-blue-800">
                {zoomLevel}X
              </div>
            )}
          </div>

          {/* Timestamp */}
          <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
            <div className="rounded-full bg-black/80 px-2.5 py-0.5 font-mono text-xs text-slate-200 backdrop-blur-sm border border-slate-700/50">
              {timestamp || "00:00:00"}
            </div>
          </div>

          {/* Controles de cámara interactivos en el stream */}
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5">
            {/* Botón Visión Nocturna / IR */}
            <button
              onClick={() => setIsNightVision(!isNightVision)}
              className={`m3-state-layer h-8 w-8 flex items-center justify-center rounded-full backdrop-blur-md transition-colors border ${
                isNightVision 
                  ? "bg-emerald-600 text-white border-emerald-400" 
                  : "bg-black/75 text-white hover:bg-black/90 border-slate-700/50"
              }`}
              title={isNightVision ? "Desactivar Visión Nocturna" : "Activar Visión Nocturna Infrarroja"}
            >
              <Moon className="h-3.5 w-3.5" />
            </button>

            {/* Botón Zoom Digital */}
            <button
              onClick={handleCycleZoom}
              className="m3-state-layer h-8 w-8 flex items-center justify-center rounded-full bg-black/75 text-white hover:bg-black/90 transition-colors border border-slate-700/50"
              title={`Zoom actual: ${zoomLevel}x (Clic para cambiar)`}
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>

            {/* Botón Tomar Captura de Pantalla PNG */}
            <button
              onClick={handleCaptureSnapshot}
              className="m3-state-layer h-8 w-8 flex items-center justify-center rounded-full bg-black/75 text-white hover:bg-black/90 transition-colors border border-slate-700/50"
              title="Descargar Foto / Evidencia PNG"
            >
              <CameraIcon className="h-3.5 w-3.5" />
            </button>

            {/* Botón Silenciar */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="m3-state-layer h-8 w-8 flex items-center justify-center rounded-full bg-black/75 text-white hover:bg-black/90 transition-colors border border-slate-700/50"
              title={isMuted ? "Activar audio" : "Silenciar audio"}
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            </button>
            
            {/* Botón Maximizar / Inspeccionar */}
            {onInspectCamera && (
              <button
                onClick={() => onInspectCamera(camera)}
                className="m3-state-layer h-8 w-8 flex items-center justify-center rounded-full bg-black/75 text-white hover:bg-black/90 transition-colors border border-slate-700/50"
                title="Inspeccionar feed en detalle"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Banner Flotante en Alerta de Violencia */}
          {isAlert && (
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-red-600 text-white px-3 py-1 text-xs font-bold shadow-lg animate-bounce">
              <AlertTriangle className="h-3.5 w-3.5 fill-current text-yellow-300" />
              <span>¡ALTERCADO DETECTADO!</span>
              <span className="font-mono text-red-100 text-[10px]">
                ({camera.confidence || 94}%)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Pie de la Tarjeta con Acciones Funcionales */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-m3-outline-variant/30 bg-slate-50/80 dark:bg-m3-surface-container/90 px-4 py-3">
        
        {/* Badge Semántico M3 de Estado */}
        <div className="flex items-center gap-2">
          {isAlert ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 text-red-700 border border-red-200 dark:bg-m3-error-container dark:text-m3-on-error-container dark:border-m3-error/40 px-3 py-1 text-xs font-bold shadow-xs animate-pulse">
              <span className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
              Alerta de Violencia ({camera.confidence || 94}%)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-m3-tertiary-container dark:text-m3-on-tertiary-container dark:border-m3-tertiary/30 px-3 py-1 text-xs font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-m3-tertiary" />
              Normal / Despejado
            </span>
          )}
        </div>

        {/* Botones de Acción Funcionales */}
        <div className="flex items-center gap-2">
          {isAlert && onTriggerEmergency && (
            <button
              onClick={() => onTriggerEmergency(camera)}
              className="m3-state-layer inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Activar Protocolo</span>
            </button>
          )}

          {isAlert ? (
            <button
              onClick={() => onResolveAlert(camera.id)}
              className="m3-state-layer inline-flex items-center gap-1.5 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-m3-secondary-container dark:text-m3-on-secondary-container text-slate-800 px-3.5 py-1.5 text-xs font-semibold transition-all shadow-xs"
            >
              <RotateCcw className="h-3.5 w-3.5 text-amber-600" />
              <span>Falsa Alarma</span>
            </button>
          ) : (
            onInspectCamera && (
              <button
                onClick={() => onInspectCamera(camera)}
                className="m3-state-layer inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white dark:bg-m3-surface-container-highest border border-slate-200 dark:border-m3-outline-variant/50 text-xs font-medium text-slate-700 dark:text-m3-on-surface hover:bg-slate-100 dark:hover:bg-m3-surface-container-high transition-colors shadow-xs"
              >
                <span>Detalles</span>
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </button>
            )
          )}
        </div>

      </div>
    </div>
  );
};
