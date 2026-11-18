"use client";

import React, { useState } from "react";
import { Camera, SecurityAlert } from "@/types/security";
import { 
  X, 
  ShieldAlert, 
  PhoneCall, 
  Lock, 
  Unlock, 
  Siren, 
  UserCheck, 
  CheckCircle,
  FileText,
  AlertTriangle,
  Clock
} from "lucide-react";

interface EmergencyProtocolModalProps {
  camera: Camera | null;
  isOpen: boolean;
  onClose: () => void;
  onResolveAlert: (cameraId: string) => void;
  onLogAction?: (actionText: string) => void;
}

export const EmergencyProtocolModal: React.FC<EmergencyProtocolModalProps> = ({
  camera,
  isOpen,
  onClose,
  onResolveAlert,
  onLogAction,
}) => {
  const [patrolDispatched, setPatrolDispatched] = useState<boolean>(false);
  const [policeCalled, setPoliceCalled] = useState<boolean>(false);
  const [doorsLocked, setDoorsLocked] = useState<boolean>(false);
  const [sirenActive, setSirenActive] = useState<boolean>(false);
  const [operatorNotes, setOperatorNotes] = useState<string>("");
  const [protocolSuccess, setProtocolSuccess] = useState<boolean>(false);

  if (!isOpen || !camera) return null;

  const handleDispatchPatrol = () => {
    setPatrolDispatched(true);
    if (onLogAction) onLogAction(`Patrulla móvil despachada a: ${camera.location}`);
  };

  const handleCallPolice = () => {
    setPoliceCalled(true);
    if (onLogAction) onLogAction(`Llamada de emergencia 911 emitida para: ${camera.location} (${camera.name})`);
  };

  const handleToggleDoors = () => {
    const next = !doorsLocked;
    setDoorsLocked(next);
    if (onLogAction) {
      onLogAction(next 
        ? `Bloqueo electromagnético activado en accesos de: ${camera.location}` 
        : `Accesos desbloqueados en: ${camera.location}`);
    }
  };

  const handleToggleSiren = () => {
    const next = !sirenActive;
    setSirenActive(next);
    if (onLogAction) {
      onLogAction(next 
        ? `Sirena local estroboscópica activada en: ${camera.location}` 
        : `Sirena apagada en: ${camera.location}`);
    }
  };

  const handleFinishProtocol = () => {
    setProtocolSuccess(true);
    setTimeout(() => {
      onResolveAlert(camera.id);
      setProtocolSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-m3-surface-container-high text-slate-900 dark:text-m3-on-surface rounded-m3-3xl shadow-2xl border border-red-200 dark:border-m3-outline-variant/40 overflow-hidden flex flex-col max-h-[90vh] animate-scale-in"
        role="dialog"
      >
        {/* Cabecera de Alerta Roja */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-red-600 to-rose-700 text-white">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <ShieldAlert className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold tracking-tight">
                  Protocolo de Intervención Rápida
                </h3>
                <span className="bg-white/20 text-white font-mono text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">
                  Código Rojo
                </span>
              </div>
              <p className="text-xs text-red-100 mt-0.5">
                Cámara: <strong>{camera.name}</strong> • Ubicación: <strong>{camera.location}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="m3-state-layer h-9 w-9 flex items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenido del Protocolo */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {protocolSuccess ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                Protocolo Completado con Éxito
              </h4>
              <p className="text-xs text-slate-500 dark:text-m3-on-surface-variant max-w-sm mt-1">
                Las unidades han sido despachadas y el incidente fue registrado y mitigado en el sistema.
              </p>
            </div>
          ) : (
            <>
              {/* Resumen del Incidente */}
              <div className="p-4 rounded-m3-2xl bg-red-50 dark:bg-m3-error-container/30 border border-red-200 dark:border-m3-error/40 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <div className="text-xs text-red-950 dark:text-red-200">
                  <p className="font-bold text-sm">
                    Violencia Detectada con {camera.confidence || 94}% de Certeza
                  </p>
                  <p className="mt-1 opacity-90">
                    Se han identificado patrones de agresión física activa. Selecciona las medidas inmediatas de mitigación:
                  </p>
                </div>
              </div>

              {/* Acciones de Mitigación Inmediata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Acción 1: Despachar Patrulla */}
                <button
                  onClick={handleDispatchPatrol}
                  className={`m3-state-layer p-4 rounded-m3-2xl border text-left flex items-start justify-between transition-all shadow-xs ${
                    patrolDispatched
                      ? "bg-emerald-50 border-emerald-300 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-700 dark:text-emerald-200"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-900 dark:bg-m3-surface-container dark:border-m3-outline-variant/30 dark:text-m3-on-surface"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                      patrolDispatched ? "bg-emerald-600 text-white" : "bg-blue-100 text-blue-700"
                    }`}>
                      <UserCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-xs">Despachar Guardia / Patrulla</p>
                      <p className="text-[11px] text-slate-500 dark:text-m3-on-surface-variant mt-0.5">
                        {patrolDispatched ? "Unidad en camino (ETA: 2 min)" : "Asignar oficial más cercano"}
                      </p>
                    </div>
                  </div>
                  {patrolDispatched && <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />}
                </button>

                {/* Acción 2: Llamada 911 */}
                <button
                  onClick={handleCallPolice}
                  className={`m3-state-layer p-4 rounded-m3-2xl border text-left flex items-start justify-between transition-all shadow-xs ${
                    policeCalled
                      ? "bg-emerald-50 border-emerald-300 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-700 dark:text-emerald-200"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-900 dark:bg-m3-surface-container dark:border-m3-outline-variant/30 dark:text-m3-on-surface"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                      policeCalled ? "bg-emerald-600 text-white" : "bg-red-100 text-red-600"
                    }`}>
                      <PhoneCall className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-xs">Notificar a Central 911</p>
                      <p className="text-[11px] text-slate-500 dark:text-m3-on-surface-variant mt-0.5">
                        {policeCalled ? "Reporte #911-7489 emitido" : "Despacho de Policía Nacional"}
                      </p>
                    </div>
                  </div>
                  {policeCalled && <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />}
                </button>

                {/* Acción 3: Bloqueo de Puertas */}
                <button
                  onClick={handleToggleDoors}
                  className={`m3-state-layer p-4 rounded-m3-2xl border text-left flex items-start justify-between transition-all shadow-xs ${
                    doorsLocked
                      ? "bg-amber-50 border-amber-300 text-amber-950 dark:bg-amber-950/40 dark:border-amber-700 dark:text-amber-200"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-900 dark:bg-m3-surface-container dark:border-m3-outline-variant/30 dark:text-m3-on-surface"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                      doorsLocked ? "bg-amber-600 text-white" : "bg-slate-200 text-slate-700"
                    }`}>
                      {doorsLocked ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-xs">Bloqueo de Accesos</p>
                      <p className="text-[11px] text-slate-500 dark:text-m3-on-surface-variant mt-0.5">
                        {doorsLocked ? "Puertas magnéticas selladas" : "Cierre perimetral de seguridad"}
                      </p>
                    </div>
                  </div>
                  {doorsLocked && <Lock className="h-4 w-4 text-amber-600 shrink-0" />}
                </button>

                {/* Acción 4: Sirena Estroboscópica */}
                <button
                  onClick={handleToggleSiren}
                  className={`m3-state-layer p-4 rounded-m3-2xl border text-left flex items-start justify-between transition-all shadow-xs ${
                    sirenActive
                      ? "bg-rose-50 border-rose-300 text-rose-950 dark:bg-rose-950/40 dark:border-rose-700 dark:text-rose-200 animate-pulse"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-900 dark:bg-m3-surface-container dark:border-m3-outline-variant/30 dark:text-m3-on-surface"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                      sirenActive ? "bg-rose-600 text-white" : "bg-slate-200 text-slate-700"
                    }`}>
                      <Siren className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-xs">Sirena Estroboscópica</p>
                      <p className="text-[11px] text-slate-500 dark:text-m3-on-surface-variant mt-0.5">
                        {sirenActive ? "Sirena en el recinto SONANDO" : "Disuasión acústica y lumínica"}
                      </p>
                    </div>
                  </div>
                  {sirenActive && <Siren className="h-4 w-4 text-rose-600 shrink-0" />}
                </button>

              </div>

              {/* Notas del Operador */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-m3-on-surface flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-blue-600" />
                  <span>Bitácora del Operador (Opcional):</span>
                </label>
                <textarea
                  value={operatorNotes}
                  onChange={(e) => setOperatorNotes(e.target.value)}
                  placeholder="Detalles adicionales: dos sospechosos de vestimenta oscura, guardia Sánchez notificado..."
                  rows={2}
                  className="w-full text-xs p-3 rounded-m3-xl bg-slate-50 dark:bg-m3-surface-container border border-slate-200 dark:border-m3-outline-variant/40 focus:outline-none focus:border-blue-500"
                />
              </div>
            </>
          )}

        </div>

        {/* Barra de Acciones */}
        {!protocolSuccess && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 dark:border-m3-outline-variant/30 bg-slate-50 dark:bg-m3-surface-container">
            <button
              onClick={onClose}
              className="m3-state-layer px-4 py-2 rounded-full border border-slate-300 dark:border-m3-outline-variant text-xs font-semibold text-slate-700 dark:text-m3-on-surface hover:bg-slate-200/60"
            >
              Cancelar
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleFinishProtocol}
                className="m3-state-layer px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Finalizar Protocolo & Resolver Incidente</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
