"use client";

import React, { useState } from "react";
import { Camera as CameraType } from "@/types/security";
import { CameraCard } from "./CameraCard";
import { 
  Grid2X2, 
  ShieldCheck, 
  AlertOctagon, 
  Square, 
  CheckCircle2,
  Video,
  Plus
} from "lucide-react";

interface CameraGridProps {
  cameras: CameraType[];
  onResolveAlert: (cameraId: string) => void;
  onInspectCamera?: (camera: CameraType) => void;
  onTriggerEmergency?: (camera: CameraType) => void;
  onDeleteCamera?: (cameraId: string) => void;
  onOpenAddCameraModal?: () => void;
}

export const CameraGrid: React.FC<CameraGridProps> = ({
  cameras,
  onResolveAlert,
  onInspectCamera,
  onTriggerEmergency,
  onDeleteCamera,
  onOpenAddCameraModal,
}) => {
  const [layoutMode, setLayoutMode] = useState<"grid" | "focus">("grid");
  const [filter, setFilter] = useState<"all" | "alert" | "normal">("all");

  const alertCameras = cameras.filter((c) => c.status === "alert");
  const alertCount = alertCameras.length;

  const filteredCameras = cameras.filter((cam) => {
    if (filter === "alert") return cam.status === "alert";
    if (filter === "normal") return cam.status === "normal";
    return true;
  });

  return (
    <section className="flex flex-col gap-4">
      
      {/* Barra de Controles y Filtros M3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-m3-2xl bg-white dark:bg-m3-surface-container-low border border-slate-200/90 dark:border-m3-outline-variant/30 p-4 shadow-sm transition-colors">
        
        {/* Lado Izquierdo: Título y Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 pr-3 border-r border-slate-200 dark:border-m3-outline-variant/30">
            <Video className="h-5 w-5 text-blue-600 dark:text-m3-primary" />
            <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-m3-on-surface">
              Canales en Directo
            </h2>
          </div>

          {/* M3 Filter Chips con estados tonales claros */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`m3-state-layer px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                filter === "all"
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200/80 dark:bg-transparent dark:text-m3-on-surface-variant dark:border-m3-outline-variant/40"
              }`}
            >
              Todas ({cameras.length})
            </button>
            <button
              onClick={() => setFilter("alert")}
              className={`m3-state-layer px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                filter === "alert"
                  ? "bg-red-600 text-white border-red-600 shadow-xs"
                  : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-red-50 hover:text-red-700 dark:bg-transparent dark:text-m3-on-surface-variant dark:border-m3-outline-variant/40"
              }`}
            >
              En Alerta ({alertCount})
            </button>
            <button
              onClick={() => setFilter("normal")}
              className={`m3-state-layer px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                filter === "normal"
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                  : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-transparent dark:text-m3-on-surface-variant dark:border-m3-outline-variant/40"
              }`}
            >
              Normales ({cameras.length - alertCount})
            </button>
          </div>
        </div>

        {/* Lado Derecho: Añadir Cámara & Switcher de Layout */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
          
          {/* Botón Añadir Cámara */}
          {onOpenAddCameraModal && (
            <button
              onClick={onOpenAddCameraModal}
              className="m3-state-layer flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-m3-surface-container-highest dark:text-m3-primary border border-blue-200 dark:border-m3-outline-variant/40 font-bold shadow-xs active:scale-95 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Añadir Cámara</span>
            </button>
          )}

          {/* M3 Segmented Button para Grid vs Focus */}
          <div className="inline-flex rounded-full bg-slate-100 dark:bg-m3-surface-container p-0.5 border border-slate-200 dark:border-m3-outline-variant/30">
            <button
              onClick={() => setLayoutMode("grid")}
              className={`m3-state-layer flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all ${
                layoutMode === "grid"
                  ? "bg-white text-blue-700 dark:bg-m3-surface-container-highest dark:text-m3-primary font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-m3-on-surface-variant dark:hover:text-m3-on-surface"
              }`}
              title="Cuadrícula 2x2"
            >
              <Grid2X2 className="h-3.5 w-3.5" />
              <span className="hidden md:inline">2x2</span>
            </button>
            <button
              onClick={() => setLayoutMode("focus")}
              className={`m3-state-layer flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all ${
                layoutMode === "focus"
                  ? "bg-white text-blue-700 dark:bg-m3-surface-container-highest dark:text-m3-primary font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-m3-on-surface-variant dark:hover:text-m3-on-surface"
              }`}
              title="Vista de Enfoque Ampliada"
            >
              <Square className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Focus</span>
            </button>
          </div>

        </div>

      </div>

      {/* Grid de Cámaras */}
      {filteredCameras.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-m3-surface-container-low rounded-m3-3xl border border-slate-200 dark:border-m3-outline-variant/30 text-center shadow-sm">
          <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-m3-tertiary-container flex items-center justify-center mb-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-m3-tertiary" />
          </div>
          <p className="text-sm font-bold text-slate-800 dark:text-m3-on-surface">No hay cámaras en esta categoría</p>
          <p className="text-xs text-slate-500 dark:text-m3-on-surface-variant mt-1">
            Cambia el filtro de visualización superior para inspeccionar otros canales.
          </p>
        </div>
      ) : (
        <div className={`grid gap-5 ${
          layoutMode === "grid" 
            ? "grid-cols-1 md:grid-cols-2" 
            : "grid-cols-1"
        }`}>
          {filteredCameras.map((camera) => (
            <CameraCard
              key={camera.id}
              camera={camera}
              onResolveAlert={onResolveAlert}
              onInspectCamera={onInspectCamera}
              onTriggerEmergency={onTriggerEmergency}
              onDeleteCamera={onDeleteCamera}
            />
          ))}
        </div>
      )}

    </section>
  );
};
