"use client";

import React, { useState } from "react";
import { SecurityAlert } from "@/types/security";
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RotateCcw, 
  Filter, 
  ShieldAlert,
  Flame,
  CheckCheck
} from "lucide-react";

interface AlertsPanelProps {
  alerts: SecurityAlert[];
  onResolveAlertByCameraId: (cameraId: string) => void;
  onResolveSpecificAlert: (alertId: string) => void;
  onClearAllResolved?: () => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  onResolveAlertByCameraId,
  onResolveSpecificAlert,
  onClearAllResolved,
}) => {
  const [filter, setFilter] = useState<"all" | "pending" | "resolved">("all");

  const pendingAlerts = alerts.filter((a) => a.status === "pending");
  const resolvedAlerts = alerts.filter((a) => a.status === "resolved");

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "pending") return alert.status === "pending";
    if (filter === "resolved") return alert.status === "resolved";
    return true;
  });

  return (
    <aside className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/80 backdrop-blur-md overflow-hidden h-full shadow-xl">
      
      {/* Encabezado del Panel Lateral */}
      <div className="border-b border-slate-800 bg-slate-950/70 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="h-5 w-5 text-red-500" />
              {pendingAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
              )}
            </div>
            <h2 className="text-sm font-bold tracking-wider text-slate-100 uppercase">
              Alertas en Tiempo Real
            </h2>
          </div>

          <span className="rounded-full bg-red-950/80 border border-red-800/80 px-2 py-0.5 font-mono text-xs font-bold text-red-400">
            {pendingAlerts.length} pendientes
          </span>
        </div>

        {/* Pestañas de Filtro */}
        <div className="flex items-center justify-between gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800/80 text-xs font-medium">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 py-1 rounded text-center transition-colors ${
              filter === "all"
                ? "bg-slate-800 text-slate-100 font-semibold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Todas ({alerts.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`flex-1 py-1 rounded text-center transition-colors ${
              filter === "pending"
                ? "bg-red-950/80 text-red-300 font-semibold shadow-sm border border-red-800/50"
                : "text-slate-400 hover:text-red-400"
            }`}
          >
            Activas ({pendingAlerts.length})
          </button>
          <button
            onClick={() => setFilter("resolved")}
            className={`flex-1 py-1 rounded text-center transition-colors ${
              filter === "resolved"
                ? "bg-slate-800 text-emerald-400 font-semibold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Resueltas ({resolvedAlerts.length})
          </button>
        </div>
      </div>

      {/* Lista Desplazable de Incidentes (Feed Cronológico) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-[400px] max-h-[calc(100vh-280px)]">
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-52 text-center text-slate-500 py-8 px-4">
            <CheckCircle className="h-10 w-10 text-slate-700 mb-2 stroke-[1.5]" />
            <p className="text-sm font-medium text-slate-400">Sin alertas que mostrar</p>
            <p className="text-xs text-slate-600 mt-1">
              {filter === "pending"
                ? "No hay incidentes pendientes de revisión."
                : "El feed de alertas se actualizará automáticamente."}
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isPending = alert.status === "pending";

            return (
              <div
                key={alert.id}
                className={`group relative rounded-lg border p-3 transition-all duration-200 ${
                  isPending
                    ? "bg-red-950/30 border-red-800/80 hover:border-red-600/90 shadow-md shadow-red-950/30"
                    : "bg-slate-950/40 border-slate-800/60 hover:border-slate-700/60 opacity-80"
                }`}
              >
                {/* Cabecera del Item: Nombre de Cámara y Hora */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {isPending ? (
                      <Flame className="h-4 w-4 text-red-500 shrink-0 animate-pulse" />
                    ) : (
                      <CheckCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                    )}
                    <span className="font-semibold text-xs text-slate-100">
                      {alert.cameraName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400 shrink-0">
                    <Clock className="h-3 w-3" />
                    <span>{alert.timestamp}</span>
                  </div>
                </div>

                {/* Detalle del Evento y Confianza */}
                <div className="mb-2 text-xs text-slate-300">
                  <p className="font-medium text-slate-200">
                    {alert.eventType}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-slate-400 font-mono">
                      Confianza IA:
                    </span>
                    <span
                      className={`font-mono text-xs font-bold px-1.5 py-0.2 rounded ${
                        alert.confidence >= 90
                          ? "bg-red-900/60 text-red-300 border border-red-700/50"
                          : "bg-amber-900/60 text-amber-300 border border-amber-700/50"
                      }`}
                    >
                      {alert.confidence}%
                    </span>
                  </div>
                </div>

                {/* Estado y Acción */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                  <div>
                    {isPending ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-ping" />
                        Pendiente
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                        Revisado {alert.resolvedAt && `(${alert.resolvedAt})`}
                      </span>
                    )}
                  </div>

                  {isPending && (
                    <button
                      onClick={() => {
                        onResolveSpecificAlert(alert.id);
                        onResolveAlertByCameraId(alert.cameraId);
                      }}
                      className="inline-flex items-center gap-1 rounded bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-[11px] font-medium text-slate-200 hover:text-white border border-slate-700 hover:border-slate-600 transition-colors active:scale-95"
                    >
                      <RotateCcw className="h-3 w-3 text-amber-400" />
                      <span>Falsa alarma / Resuelto</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pie del Panel de Alertas con Nota de Arquitectura */}
      <div className="border-t border-slate-800 bg-slate-950/80 p-3 text-[11px] text-slate-500 font-mono flex items-center justify-between">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          Canal WS: /ws/alerts (Simulado)
        </span>
        <span>Polling: Activo</span>
      </div>

    </aside>
  );
};
