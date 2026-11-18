"use client";

import React from "react";
import { Camera } from "@/types/security";
import { CameraCard } from "./CameraCard";
import { Grid2X2, Shield, AlertOctagon } from "lucide-react";

interface CameraGridProps {
  cameras: Camera[];
  onResolveAlert: (cameraId: string) => void;
}

export const CameraGrid: React.FC<CameraGridProps> = ({
  cameras,
  onResolveAlert,
}) => {
  const alertCount = cameras.filter((c) => c.status === "alert").length;

  return (
    <section className="flex flex-col gap-3">
      {/* Cabecera de la sección de cámaras */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-900/60 border border-slate-800/80 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Grid2X2 className="h-4 w-4 text-cyan-400" />
          <h2 className="text-sm font-semibold tracking-wide text-slate-200">
            Cuadrícula de Transmisiones (2x2)
          </h2>
          <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[11px] text-slate-400 border border-slate-700">
            {cameras.length} Cámaras Online
          </span>
        </div>

        {/* Resumen rápido de estado de la cuadrícula */}
        <div className="flex items-center gap-3 text-xs">
          {alertCount > 0 ? (
            <span className="flex items-center gap-1.5 font-medium text-red-400 bg-red-950/60 border border-red-800/80 px-2.5 py-1 rounded-md animate-pulse">
              <AlertOctagon className="h-3.5 w-3.5" />
              {alertCount} {alertCount === 1 ? "cámara en peligro" : "cámaras en peligro"}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 px-2.5 py-1 rounded-md">
              <Shield className="h-3.5 w-3.5" />
              Todos los sectores despejados
            </span>
          )}
        </div>
      </div>

      {/* Grid 2x2 de Cámaras */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cameras.map((camera) => (
          <CameraCard
            key={camera.id}
            camera={camera}
            onResolveAlert={onResolveAlert}
          />
        ))}
      </div>
    </section>
  );
};
