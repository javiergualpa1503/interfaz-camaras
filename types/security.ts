export type CameraStatus = 'normal' | 'alert';

export type AlertResolutionStatus = 'pending' | 'resolved';

export interface Camera {
  id: string;
  name: string;
  location: string;
  resolution: string;
  fps: number;
  status: CameraStatus;
  confidence?: number; // Porcentaje de confianza IA (ej. 94)
  lastAlertTime?: string;
  thumbnailUrl?: string; // Para futuras miniaturas reales o feeds HLS/RTSP
}

export interface SecurityAlert {
  id: string;
  cameraId: string;
  cameraName: string;
  timestamp: string;
  confidence: number; // Nivel de certeza de la IA (ej. 94%)
  eventType: string; // ej. "Violencia física / Agresión", "Conducta agresiva"
  status: AlertResolutionStatus;
  resolvedAt?: string;
}

export interface SystemStats {
  isAiActive: boolean;
  totalCameras: number;
  activeAlerts: number;
  systemLatencyMs: number;
}
