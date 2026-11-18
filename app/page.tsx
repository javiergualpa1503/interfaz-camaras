"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Camera, SecurityAlert } from "@/types/security";
import { INITIAL_CAMERAS, INITIAL_ALERTS } from "@/data/mockCameras";
import { Navbar } from "@/components/Navbar";
import { CameraGrid } from "@/components/CameraGrid";
import { AlertsPanel } from "@/components/AlertsPanel";

// Tipos de eventos violentos simulados para mayor realismo
const VIOLENCE_EVENT_TYPES = [
  "Agresión física / Pelea en curso",
  "Conducta violenta con forcejeo",
  "Ataque súbito a transeúnte",
  "Altercado violento entre múltiples personas",
  "Uso sospechoso de fuerza física",
];

export default function SecurityDashboardPage() {
  // Estado local para las cámaras y alertas
  const [cameras, setCameras] = useState<Camera[]>(INITIAL_CAMERAS);
  const [alerts, setAlerts] = useState<SecurityAlert[]>(INITIAL_ALERTS);
  const [isAiActive, setIsAiActive] = useState<boolean>(true);

  // Cantidad de alertas pendientes
  const activeAlertsCount = alerts.filter((a) => a.status === "pending").length;

  /**
   * ============================================================================
   * ARQUITECTURA / PUNTO DE CONEXIÓN FUTURO PARA WEBSOCKETS O BACKEND REAL:
   * ============================================================================
   * En producción con backend, aquí se iniciaría la conexión WebSocket:
   *
   * useEffect(() => {
   *   const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws/security");
   *   
   *   ws.onopen = () => console.log("Conectado al feed de IA en tiempo real");
   *   
   *   ws.onmessage = (event) => {
   *     const data = JSON.parse(event.data);
   *     if (data.type === "VIOLENCE_DETECTED") {
   *       handleIncomingBackendAlert(data.payload);
   *     }
   *   };
   *   
   *   return () => ws.close();
   * }, []);
   * ============================================================================
   */

  /**
   * Función para simular una detección de violencia por IA
   */
  const handleSimulateDetection = useCallback(() => {
    // 1. Seleccionar una cámara aleatoria
    // Priorizamos una cámara en estado normal si existe
    const normalCameras = cameras.filter((c) => c.status === "normal");
    const candidateCameras = normalCameras.length > 0 ? normalCameras : cameras;
    const randomIndex = Math.floor(Math.random() * candidateCameras.length);
    const targetCamera = candidateCameras[randomIndex];

    // 2. Generar porcentaje de confianza realista (88% a 98%)
    const confidence = Math.floor(Math.random() * (98 - 88 + 1)) + 88;

    // 3. Hora actual formateada
    const now = new Date();
    const timeString = now.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    // 4. Seleccionar un tipo de evento
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

    // 6. Actualizar el estado de la cámara seleccionada a 'alert'
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

    // 7. Insertar la nueva alerta al principio de la lista
    setAlerts((prevAlerts) => [newAlert, ...prevAlerts]);
  }, [cameras]);

  /**
   * Marcar como resuelto / Falsa alarma por ID de cámara
   */
  const handleResolveAlertByCameraId = useCallback((cameraId: string) => {
    const now = new Date();
    const resolvedTime = now.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    // Restaurar cámara a normal
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

    // Marcar alertas pendientes de esa cámara como resueltas
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
  }, []);

  /**
   * Marcar como resuelta una alerta específica por su ID
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
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* 1. Encabezado Superior */}
      <Navbar
        onSimulateDetection={handleSimulateDetection}
        isAiActive={isAiActive}
        activeAlertsCount={activeAlertsCount}
      />

      {/* 2. Área Principal del Dashboard: 70% Cuadrícula | 30% Panel Lateral */}
      <main className="flex-1 p-4 lg:p-6 max-w-[1920px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
          
          {/* Sección 1: Cuadrícula de Cámaras (70% del ancho en pantallas grandes) */}
          <div className="lg:col-span-7">
            <CameraGrid
              cameras={cameras}
              onResolveAlert={handleResolveAlertByCameraId}
            />
          </div>

          {/* Sección 2: Panel Lateral de Alertas en Tiempo Real (30% del ancho) */}
          <div className="lg:col-span-3 sticky top-20">
            <AlertsPanel
              alerts={alerts}
              onResolveAlertByCameraId={handleResolveAlertByCameraId}
              onResolveSpecificAlert={handleResolveSpecificAlert}
            />
          </div>

        </div>
      </main>

      {/* Pie de página con información del sistema */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-3 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          <span>Modelo IA: YOLOv8 / ViT-Violence Detector v2.4</span>
        </div>
        <div>
          <span>SentinelEye Command Center • Modo Frontend MVP</span>
        </div>
      </footer>
    </div>
  );
}
