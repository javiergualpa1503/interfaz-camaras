"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Camera, SecurityAlert } from "@/types/security";
import { INITIAL_CAMERAS, INITIAL_ALERTS } from "@/data/mockCameras";
import { Navbar } from "@/components/Navbar";
import { CameraGrid } from "@/components/CameraGrid";
import { AlertsPanel } from "@/components/AlertsPanel";
import { CameraModal } from "@/components/CameraModal";
import { EmergencyProtocolModal } from "@/components/EmergencyProtocolModal";
import { AddCameraModal } from "@/components/AddCameraModal";
import { AIConfigModal } from "@/components/AIConfigModal";
import { 
  ShieldAlert, 
  Cpu, 
  Server, 
  Layers,
  ShieldCheck,
  CheckCircle2,
  BellRing
} from "lucide-react";

// Tipos de altercados violentos simulados para variedad realista
const VIOLENCE_EVENT_TYPES = [
  "Agresión física / Pelea en curso",
  "Conducta violenta con forcejeo",
  "Ataque súbito a transeúnte",
  "Altercado violento entre múltiples personas",
  "Uso sospechoso de fuerza física",
];

export default function SecurityDashboardPage() {
  // Estado de cámaras y alertas
  const [cameras, setCameras] = useState<Camera[]>(INITIAL_CAMERAS);
  const [alerts, setAlerts] = useState<SecurityAlert[]>(INITIAL_ALERTS);
  const [isAiActive, setIsAiActive] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [voiceAlertsEnabled, setVoiceAlertsEnabled] = useState<boolean>(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(75);
  const [autoSimulation, setAutoSimulation] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  // Modales
  const [inspectedCamera, setInspectedCamera] = useState<Camera | null>(null);
  const [emergencyCamera, setEmergencyCamera] = useState<Camera | null>(null);
  const [isAddCameraOpen, setIsAddCameraOpen] = useState<boolean>(false);
  const [isAIConfigOpen, setIsAIConfigOpen] = useState<boolean>(false);

  // Mensaje flotante de notificación (Toast)
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  // Manejo del tema Claro / Oscuro
  const handleToggleTheme = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  // Cantidad de incidentes pendientes
  const activeAlertsCount = alerts.filter((a) => a.status === "pending").length;

  /**
   * Anuncio verbal de voz con Text-to-Speech (Web Speech API)
   */
  const speakVoiceAlert = useCallback((cameraLocation: string) => {
    if (!voiceAlertsEnabled || !soundEnabled) return;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const text = `Alerta de seguridad. Conflicto detectado en: ${cameraLocation}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "es-ES";
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Fallback si el navegador no permite audio automático
      }
    }
  }, [voiceAlertsEnabled, soundEnabled]);

  /**
   * Reproductor de audio sintetizado con Web Audio API para alertas en tiempo real
   */
  const playAlertSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      // Tono 1 (880 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(880, ctx.currentTime);
      gain1.gain.setValueAtTime(0.08, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.25);

      // Tono 2 descendente (659 Hz)
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime);
        gain2.gain.setValueAtTime(0.1, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.35);
      }, 120);
    } catch {
      // Ignorar
    }
  }, [soundEnabled]);

  /**
   * Simular una nueva detección de violencia por la IA
   */
  const handleSimulateDetection = useCallback(() => {
    if (cameras.length === 0) return;

    // 1. Priorizar cámaras normales
    const normalCameras = cameras.filter((c) => c.status === "normal");
    const candidateCameras = normalCameras.length > 0 ? normalCameras : cameras;
    const randomIndex = Math.floor(Math.random() * candidateCameras.length);
    const targetCamera = candidateCameras[randomIndex];

    // 2. Porcentaje de certeza ajustado al umbral
    const minConf = Math.max(confidenceThreshold, 80);
    const confidence = Math.floor(Math.random() * (98 - minConf + 1)) + minConf;

    // 3. Hora actual formateada
    const now = new Date();
    const timeString = now.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    // 4. Seleccionar tipo de altercado
    const randomEvent =
      VIOLENCE_EVENT_TYPES[Math.floor(Math.random() * VIOLENCE_EVENT_TYPES.length)];

    // 5. Crear la nueva alerta
    const newAlert: SecurityAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      cameraId: targetCamera.id,
      cameraName: targetCamera.name,
      timestamp: timeString,
      confidence,
      eventType: randomEvent,
      status: "pending",
    };

    // 6. Actualizar cámara a estado 'alert'
    setCameras((prevCameras) =>
      prevCameras.map((cam) =>
        cam.id === targetCamera.id
          ? {
              ...cam,
              status: "alert",
              confidence,
              lastAlertTime: timeString,
            }
          : cam
      )
    );

    // 7. Sincronizar modal si está abierto en esa cámara
    setInspectedCamera((prev) => {
      if (prev && prev.id === targetCamera.id) {
        return {
          ...prev,
          status: "alert",
          confidence,
          lastAlertTime: timeString,
        };
      }
      return prev;
    });

    // 8. Insertar alerta
    setAlerts((prevAlerts) => [newAlert, ...prevAlerts]);

    // 9. Sonido de alarma y voz
    playAlertSound();
    speakVoiceAlert(targetCamera.name);

    showToast(`¡Alerta IA detectada en ${targetCamera.name}! (${confidence}% certeza)`);
  }, [cameras, confidenceThreshold, playAlertSound, speakVoiceAlert, showToast]);

  /**
   * Efecto de Demostración Continua / Simulación Automática
   */
  useEffect(() => {
    if (!autoSimulation) return;
    const interval = setInterval(() => {
      handleSimulateDetection();
    }, 24000);
    return () => clearInterval(interval);
  }, [autoSimulation, handleSimulateDetection]);

  /**
   * Resolver alerta por ID de cámara
   */
  const handleResolveAlertByCameraId = useCallback((cameraId: string) => {
    const now = new Date();
    const resolvedTime = now.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    setCameras((prevCameras) =>
      prevCameras.map((cam) =>
        cam.id === cameraId
          ? {
              ...cam,
              status: "normal",
              confidence: undefined,
            }
          : cam
      )
    );

    setInspectedCamera((prev) => {
      if (prev && prev.id === cameraId) {
        return {
          ...prev,
          status: "normal",
          confidence: undefined,
        };
      }
      return prev;
    });

    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.cameraId === cameraId && alert.status === "pending"
          ? {
              ...alert,
              status: "resolved",
              resolvedAt: resolvedTime,
            }
          : alert
      )
    );

    showToast(`Cámara restaurada a estado Normal.`);
  }, [showToast]);

  /**
   * Resolver alerta específica por su ID
   */
  const handleResolveSpecificAlert = useCallback((alertId: string) => {
    const now = new Date();
    const resolvedTime = now.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: "resolved",
              resolvedAt: resolvedTime,
            }
          : alert
      )
    );

    showToast(`Incidente marcado como Resuelto.`);
  }, [showToast]);

  /**
   * Resolver todas las alertas activas con un clic
   */
  const handleResolveAllAlerts = useCallback(() => {
    const now = new Date();
    const resolvedTime = now.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    setCameras((prev) =>
      prev.map((c) => ({
        ...c,
        status: "normal",
        confidence: undefined,
      }))
    );

    setAlerts((prev) =>
      prev.map((a) =>
        a.status === "pending"
          ? { ...a, status: "resolved", resolvedAt: resolvedTime }
          : a
      )
    );

    showToast(`Todos los incidentes han sido marcados como resueltos.`);
  }, [showToast]);

  /**
   * Añadir nueva cámara
   */
  const handleAddCamera = useCallback((newCamera: Camera) => {
    setCameras((prev) => [...prev, newCamera]);
    showToast(`Cámara "${newCamera.name}" conectada con éxito.`);
  }, [showToast]);

  /**
   * Eliminar cámara
   */
  const handleDeleteCamera = useCallback((cameraId: string) => {
    setCameras((prev) => prev.filter((c) => c.id !== cameraId));
    showToast(`Cámara eliminada del monitoreo.`);
  }, [showToast]);

  return (
    <div className="min-h-screen bg-[#f4f6fa] dark:bg-m3-surface text-slate-900 dark:text-m3-on-surface flex flex-col font-sans transition-colors duration-200">
      
      {/* 1. M3 Top App Bar */}
      <Navbar
        onSimulateDetection={handleSimulateDetection}
        isAiActive={isAiActive}
        activeAlertsCount={activeAlertsCount}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        onOpenAddCamera={() => setIsAddCameraOpen(true)}
        onOpenAIConfig={() => setIsAIConfigOpen(true)}
        autoSimulation={autoSimulation}
      />

      {/* Toast Flotante de Notificaciones */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700 animate-bounce">
          <BellRing className="h-4 w-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. Área Principal del Command Center */}
      <main className="flex-1 p-4 lg:p-6 max-w-[1920px] mx-auto w-full flex flex-col gap-6">
        
        {/* Franja de Métricas KPI */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Tarjeta KPI 1: Cámaras Conectadas */}
          <div className="p-4 rounded-m3-2xl bg-white dark:bg-m3-surface-container-low border border-slate-200/90 dark:border-m3-outline-variant/30 flex items-center justify-between shadow-sm transition-transform hover:-translate-y-0.5">
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-m3-on-surface-variant uppercase tracking-wider">
                Cámaras Conectadas
              </p>
              <h4 className="text-2xl font-black font-mono text-slate-900 dark:text-m3-on-surface mt-1">
                {cameras.length} Canales
              </h4>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                ● Transmisión RTSP en vivo
              </p>
            </div>
            <div className="h-11 w-11 rounded-2xl bg-blue-50 dark:bg-m3-surface-container-highest flex items-center justify-center text-blue-600 dark:text-m3-primary shadow-xs">
              <Layers className="h-5 w-5" />
            </div>
          </div>

          {/* Tarjeta KPI 2: Estado de Violencia / Amenazas */}
          <div className={`p-4 rounded-m3-2xl border flex items-center justify-between shadow-sm transition-all hover:-translate-y-0.5 ${
            activeAlertsCount > 0
              ? "bg-red-50/90 border-red-300 dark:bg-m3-error-container/40 dark:border-m3-error/60"
              : "bg-white dark:bg-m3-surface-container-low border-slate-200/90 dark:border-m3-outline-variant/30"
          }`}>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-m3-on-surface-variant">
                Amenazas Detectadas
              </p>
              <h4 className={`text-2xl font-black font-mono mt-1 ${
                activeAlertsCount > 0 ? "text-red-700 dark:text-red-300" : "text-slate-900 dark:text-m3-on-surface"
              }`}>
                {activeAlertsCount > 0 ? `${activeAlertsCount} CRÍTICAS` : "0 (Despejado)"}
              </h4>
              <p className={`text-[11px] font-semibold mt-0.5 ${
                activeAlertsCount > 0 ? "text-red-600 animate-pulse" : "text-emerald-600"
              }`}>
                {activeAlertsCount > 0 ? "● Requiere intervención" : "● Todos los sectores seguros"}
              </p>
            </div>
            <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shadow-xs ${
              activeAlertsCount > 0 
                ? "bg-red-600 text-white animate-pulse" 
                : "bg-emerald-50 text-emerald-700 dark:bg-m3-tertiary-container dark:text-m3-on-tertiary-container"
            }`}>
              {activeAlertsCount > 0 ? (
                <ShieldAlert className="h-5 w-5" />
              ) : (
                <ShieldCheck className="h-5 w-5" />
              )}
            </div>
          </div>

          {/* Tarjeta KPI 3: Motor ViT / Red Neuronal */}
          <div 
            onClick={() => setIsAIConfigOpen(true)}
            className="p-4 rounded-m3-2xl bg-white dark:bg-m3-surface-container-low border border-slate-200/90 dark:border-m3-outline-variant/30 flex items-center justify-between shadow-sm transition-transform hover:-translate-y-0.5 cursor-pointer"
            title="Clic para configurar el modelo de IA"
          >
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-m3-on-surface-variant uppercase tracking-wider">
                Motor de Inferencia
              </p>
              <h4 className="text-base font-extrabold text-indigo-700 dark:text-m3-primary mt-1">
                ViT-Violence v2.4
              </h4>
              <p className="text-[11px] font-mono text-slate-600 dark:text-m3-on-surface-variant mt-0.5">
                Umbral: <strong className="text-blue-600">{confidenceThreshold}%</strong> • 14ms
              </p>
            </div>
            <div className="h-11 w-11 rounded-2xl bg-indigo-50 dark:bg-m3-surface-container-highest flex items-center justify-center text-indigo-600 dark:text-m3-primary shadow-xs">
              <Cpu className="h-5 w-5" />
            </div>
          </div>

          {/* Tarjeta KPI 4: Servidor & Disponibilidad */}
          <div className="p-4 rounded-m3-2xl bg-white dark:bg-m3-surface-container-low border border-slate-200/90 dark:border-m3-outline-variant/30 flex items-center justify-between shadow-sm transition-transform hover:-translate-y-0.5">
            <div>
              <p className="text-[11px] font-bold text-slate-500 dark:text-m3-on-surface-variant uppercase tracking-wider">
                Disponibilidad Global
              </p>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-m3-on-surface mt-1">
                99.98% Uptime
              </h4>
              <p className="text-[11px] font-mono text-slate-600 dark:text-m3-on-surface-variant mt-0.5">
                Voz TTS: <strong className={voiceAlertsEnabled ? "text-emerald-600" : "text-slate-400"}>{voiceAlertsEnabled ? "Activa" : "Muda"}</strong>
              </p>
            </div>
            <div className="h-11 w-11 rounded-2xl bg-teal-50 dark:bg-m3-surface-container-highest flex items-center justify-center text-teal-600 dark:text-m3-secondary shadow-xs">
              <Server className="h-5 w-5" />
            </div>
          </div>

        </div>

        {/* Layout 70/30: Cuadrícula de Cámaras | Panel Lateral de Incidentes */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
          
          {/* Sección Cámaras (70% del ancho) */}
          <div className="lg:col-span-7">
            <CameraGrid
              cameras={cameras}
              onResolveAlert={handleResolveAlertByCameraId}
              onInspectCamera={(camera) => setInspectedCamera(camera)}
              onTriggerEmergency={(camera) => setEmergencyCamera(camera)}
              onDeleteCamera={handleDeleteCamera}
              onOpenAddCameraModal={() => setIsAddCameraOpen(true)}
            />
          </div>

          {/* Sección Panel Lateral de Alertas (30% del ancho) */}
          <div className="lg:col-span-3 sticky top-24">
            <AlertsPanel
              alerts={alerts}
              onResolveAlertByCameraId={handleResolveAlertByCameraId}
              onResolveSpecificAlert={handleResolveSpecificAlert}
              onResolveAllAlerts={handleResolveAllAlerts}
            />
          </div>

        </div>
      </main>

      {/* 3. Modales Funcionales */}
      
      {/* Modal 1: Inspección Forense en Detalle */}
      <CameraModal
        camera={inspectedCamera}
        isOpen={Boolean(inspectedCamera)}
        onClose={() => setInspectedCamera(null)}
        onResolveAlert={handleResolveAlertByCameraId}
      />

      {/* Modal 2: Protocolo de Intervención Rápida */}
      <EmergencyProtocolModal
        camera={emergencyCamera}
        isOpen={Boolean(emergencyCamera)}
        onClose={() => setEmergencyCamera(null)}
        onResolveAlert={handleResolveAlertByCameraId}
        onLogAction={(action) => showToast(action)}
      />

      {/* Modal 3: Añadir Cámara IP / RTSP */}
      <AddCameraModal
        isOpen={isAddCameraOpen}
        onClose={() => setIsAddCameraOpen(false)}
        onAddCamera={handleAddCamera}
      />

      {/* Modal 4: Calibración de IA */}
      <AIConfigModal
        isOpen={isAIConfigOpen}
        onClose={() => setIsAIConfigOpen(false)}
        voiceAlertsEnabled={voiceAlertsEnabled}
        onToggleVoiceAlerts={() => setVoiceAlertsEnabled(!voiceAlertsEnabled)}
        confidenceThreshold={confidenceThreshold}
        onChangeThreshold={(val) => setConfidenceThreshold(val)}
        autoSimulation={autoSimulation}
        onToggleAutoSimulation={() => setAutoSimulation(!autoSimulation)}
      />

      {/* 4. Pie de Página M3 Luminoso */}
      <footer className="mt-auto border-t border-slate-200/80 dark:border-m3-outline-variant/30 bg-white dark:bg-m3-surface-container px-6 py-4 text-xs text-slate-500 dark:text-m3-on-surface-variant flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="font-medium text-slate-700 dark:text-m3-on-surface">
            SentinelEye Command Center • Interfaz <strong>Material Design 3 (M3)</strong>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-slate-400 dark:text-m3-outline">
            Motor ViT v2.4 Activo • Audio TTS & Captura de Evidencia Integrada
          </span>
        </div>
      </footer>

    </div>
  );
}
