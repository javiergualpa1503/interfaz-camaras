"use client";

import React, { useState } from "react";
import { SecurityAlert } from "@/types/security";
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  RotateCcw, 
  Flame, 
  CheckCheck,
  Search,
  Download,
  CheckSquare
} from "lucide-react";

interface AlertsPanelProps {
  alerts: SecurityAlert[];
  onResolveAlertByCameraId: (cameraId: string) => void;
  onResolveSpecificAlert: (alertId: string) => void;
  onResolveAllAlerts?: () => void;
  onSelectCameraFromAlert?: (cameraId: string) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  onResolveAlertByCameraId,
  onResolveSpecificAlert,
  onResolveAllAlerts,
  onSelectCameraFromAlert,
}) => {
  const [filter, setFilter] = useState<"all" | "pending" | "resolved">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const pendingAlerts = alerts.filter((a) => a.status === "pending");
  const resolvedAlerts = alerts.filter((a) => a.status === "resolved");

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "pending" && alert.status !== "pending") return false;
    if (filter === "resolved" && alert.status !== "resolved") return false;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchCam = alert.cameraName.toLowerCase().includes(query);
      const matchEvent = alert.eventType.toLowerCase().includes(query);
      return matchCam || matchEvent;
    }

    return true;
  });

  /**
   * Exportar el historial de incidentes a un archivo CSV descargable
   */
  const handleExportCSV = () => {
    if (alerts.length === 0) return;

    const headers = ["ID Alerta", "Camara ID", "Nombre Camara", "Hora", "Tipo de Evento", "Certeza IA (%)", "Estado", "Hora Resolucion"];
    const rows = alerts.map((a) => [
      `"${a.id}"`,
      `"${a.cameraId}"`,
      `"${a.cameraName}"`,
      `"${a.timestamp}"`,
      `"${a.eventType}"`,
      a.confidence,
      `"${a.status}"`,
      `"${a.resolvedAt || "N/A"}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute("href", url);
    link.setAttribute("download", `reporte_incidentes_sentineleye_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <aside className="flex flex-col rounded-m3-3xl border border-slate-200/90 dark:border-m3-outline-variant/30 bg-white dark:bg-m3-surface-container-low shadow-sm overflow-hidden h-full transition-colors">
      
      {/* 1. Encabezado del Panel Lateral */}
      <div className="border-b border-slate-100 dark:border-m3-outline-variant/30 bg-slate-50/80 dark:bg-m3-surface-container/80 p-4">
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-m3-error-container dark:text-m3-on-error-container shadow-xs">
              <Bell className="h-5 w-5" />
              {pendingAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
                </span>
              )}
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-m3-on-surface">
                Registro de Incidentes
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-m3-on-surface-variant">Feed cronológico con IA</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExportCSV}
              title="Descargar Reporte en CSV"
              className="m3-state-layer h-8 w-8 flex items-center justify-center rounded-full bg-white dark:bg-m3-surface-container-highest border border-slate-200 dark:border-m3-outline-variant/40 text-slate-600 dark:text-m3-on-surface hover:text-blue-600 shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
            <span className="rounded-full bg-red-600 text-white px-2.5 py-0.5 font-mono text-xs font-bold shadow-xs">
              {pendingAlerts.length}
            </span>
          </div>
        </div>

        {/* Campo de Búsqueda M3 */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-m3-outline" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar por cámara o tipo..."
            className="w-full bg-white dark:bg-m3-surface-container-highest border border-slate-200 dark:border-m3-outline-variant/40 rounded-full pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-m3-on-surface placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-xs"
          />
        </div>

        {/* Pestañas de Filtro (M3 Segmented Buttons) */}
        <div className="flex items-center justify-between gap-1 bg-slate-100 dark:bg-m3-surface-container-highest p-1 rounded-full border border-slate-200 dark:border-m3-outline-variant/30 text-xs font-medium">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 py-1 px-2 rounded-full text-center transition-all ${
              filter === "all"
                ? "bg-white text-slate-900 font-bold shadow-xs dark:bg-m3-surface-container dark:text-m3-on-surface"
                : "text-slate-600 hover:text-slate-900 dark:text-m3-on-surface-variant"
            }`}
          >
            Todas ({alerts.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`flex-1 py-1 px-2 rounded-full text-center transition-all ${
              filter === "pending"
                ? "bg-red-600 text-white font-bold shadow-xs dark:bg-m3-error-container dark:text-m3-on-error-container"
                : "text-slate-600 hover:text-red-600 dark:text-m3-on-surface-variant"
            }`}
          >
            Activas ({pendingAlerts.length})
          </button>
          <button
            onClick={() => setFilter("resolved")}
            className={`flex-1 py-1 px-2 rounded-full text-center transition-all ${
              filter === "resolved"
                ? "bg-emerald-600 text-white font-bold shadow-xs dark:bg-m3-tertiary-container dark:text-m3-on-tertiary-container"
                : "text-slate-600 hover:text-emerald-700 dark:text-m3-on-surface-variant"
            }`}
          >
            Resueltas ({resolvedAlerts.length})
          </button>
        </div>
      </div>

      {/* 2. Feed Cronológico de Incidentes */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-[420px] max-h-[calc(100vh-280px)]">
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-56 text-center text-slate-400 dark:text-m3-on-surface-variant py-8 px-4">
            <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-m3-surface-container-highest flex items-center justify-center mb-2">
              <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-m3-tertiary" />
            </div>
            <p className="text-sm font-bold text-slate-700 dark:text-m3-on-surface">Sin incidentes que mostrar</p>
            <p className="text-xs text-slate-500 dark:text-m3-on-surface-variant mt-1">
              {filter === "pending"
                ? "No hay incidentes de violencia pendientes de revisión."
                : "El feed de alertas se actualizará automáticamente."}
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isPending = alert.status === "pending";

            return (
              <div
                key={alert.id}
                className={`group relative rounded-m3-2xl border p-3.5 transition-all duration-200 ${
                  isPending
                    ? "bg-red-50/70 border-red-200 hover:border-red-300 shadow-xs dark:bg-m3-error-container/25 dark:border-m3-error/60"
                    : "bg-slate-50/70 border-slate-200/80 hover:border-slate-300 dark:bg-m3-surface-container/50 dark:border-m3-outline-variant/30"
                }`}
              >
                {/* Cabecera del Item */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                      isPending 
                        ? "bg-red-600 text-white animate-pulse" 
                        : "bg-emerald-100 text-emerald-800 dark:bg-m3-tertiary-container dark:text-m3-on-tertiary-container"
                    }`}>
                      {isPending ? (
                        <Flame className="h-4 w-4" />
                      ) : (
                        <CheckCheck className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900 dark:text-m3-on-surface block leading-tight">
                        {alert.cameraName}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-m3-on-surface-variant font-mono">
                        ID: {alert.cameraId}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 font-mono text-[11px] text-slate-600 dark:text-m3-on-surface-variant bg-white dark:bg-m3-surface-container-highest px-2 py-0.5 rounded-full border border-slate-200 dark:border-m3-outline-variant/20 shadow-2xs">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span>{alert.timestamp}</span>
                  </div>
                </div>

                {/* Detalle del Evento y Confianza */}
                <div className="mb-3 text-xs">
                  <p className="font-semibold text-slate-800 dark:text-m3-on-surface leading-snug">
                    {alert.eventType}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[11px] text-slate-500 dark:text-m3-on-surface-variant">
                      Confianza IA:
                    </span>
                    <span
                      className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        alert.confidence >= 90
                          ? "bg-red-100 text-red-800 border border-red-200 dark:bg-m3-error-container dark:text-m3-on-error-container"
                          : "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-m3-warning-container dark:text-m3-on-warning-container"
                      }`}
                    >
                      {alert.confidence}% CERTEZA
                    </span>
                  </div>
                </div>

                {/* Pie del Item con Acción */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 dark:border-m3-outline-variant/30 text-xs">
                  <div>
                    {isPending ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-red-600 dark:text-m3-error">
                        <span className="h-2 w-2 rounded-full bg-red-600 animate-ping" />
                        Acción Requerida
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-m3-tertiary font-semibold">
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
                      className="m3-state-layer inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-m3-surface-container-highest hover:bg-slate-100 dark:hover:bg-m3-secondary-container text-slate-800 dark:text-m3-on-surface px-3 py-1 text-[11px] font-semibold border border-slate-300 dark:border-m3-outline-variant/40 active:scale-95 transition-all shadow-xs"
                    >
                      <RotateCcw className="h-3 w-3 text-amber-600" />
                      <span>Resolver</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. Pie del Panel de Alertas con opción de resolver todas */}
      <div className="border-t border-slate-100 dark:border-m3-outline-variant/30 bg-slate-50/90 dark:bg-m3-surface-container/90 px-4 py-2.5 text-[11px] text-slate-500 dark:text-m3-on-surface-variant font-mono flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Canal WS: /ws/alerts</span>
        </span>
        
        {pendingAlerts.length > 0 && onResolveAllAlerts && (
          <button
            onClick={onResolveAllAlerts}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 dark:text-m3-primary flex items-center gap-1 transition-colors"
          >
            <CheckSquare className="h-3.5 w-3.5" />
            <span>Resolver Todas</span>
          </button>
        )}
      </div>

    </aside>
  );
};
