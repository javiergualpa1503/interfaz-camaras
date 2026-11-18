import { Camera, SecurityAlert } from "@/types/security";

export const INITIAL_CAMERAS: Camera[] = [
  {
    id: "cam-01",
    name: "Entrada Principal",
    location: "Acceso Peatonal A1",
    resolution: "4K (3840x2160)",
    fps: 30,
    status: "normal",
  },
  {
    id: "cam-02",
    name: "Pasillo Norte",
    location: "Edificio 2 - Nivel 1",
    resolution: "1080p (1920x1080)",
    fps: 30,
    status: "normal",
  },
  {
    id: "cam-03",
    name: "Estacionamiento",
    location: "Sótano S1 - Zona C",
    resolution: "2K (2560x1440)",
    fps: 25,
    status: "normal",
  },
  {
    id: "cam-04",
    name: "Recepción",
    location: "Lobby Central - Mostrador",
    resolution: "4K (3840x2160)",
    fps: 30,
    status: "normal",
  },
];

export const INITIAL_ALERTS: SecurityAlert[] = [
  {
    id: "alert-init-01",
    cameraId: "cam-03",
    cameraName: "Estacionamiento",
    timestamp: "10:14:22",
    confidence: 91,
    eventType: "Movimiento brusco / Forcejeo",
    status: "resolved",
    resolvedAt: "10:16:05",
  },
];
