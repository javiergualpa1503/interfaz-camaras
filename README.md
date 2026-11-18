# SentinelEye AI - Monitoreo & Detección de Violencia (Frontend MVP)

MVP en Next.js (App Router), TypeScript y Tailwind CSS para monitoreo de cámaras de seguridad en tiempo real con detección de violencia asistida por Inteligencia Artificial.

---

## 🚀 Puesta en Marcha Rápida

1. **Instalar dependencias:**
   ```bash
   npm install
   # o
   pnpm install
   # o
   yarn install
   ```

2. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📁 Estructura del Proyecto

```text
├── app/
│   ├── globals.css         # Estilos globales, efectos de escaneo y paleta Dark Mode
│   ├── layout.tsx          # Layout raíz con metadatos y fuente
│   └── page.tsx            # Dashboard principal: orquestación de estado y layout 70/30
├── components/
│   ├── Navbar.tsx          # Barra superior con reloj en tiempo real, estado IA y botón simulador
│   ├── CameraCard.tsx      # Tarjeta individual con simulación de video, HUD, badges y alertas
│   ├── CameraGrid.tsx      # Cuadrícula 2x2 responsiva de cámaras
│   └── AlertsPanel.tsx     # Panel lateral cronológico con filtros y resolución de alertas
├── data/
│   └── mockCameras.ts      # Datos iniciales simulados de cámaras y registros históricos
├── types/
│   └── security.ts         # Definiciones TypeScript de cámaras, alertas y estados
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔌 Integración Futura con Backend / WebSockets

Este MVP está estructurado para conectarse de manera inmediata a un backend real (FastAPI, NestJS, Go, WebSockets o WebRTC):

1. **WebSockets para Alertas en Tiempo Real:**
   - En `app/page.tsx`, reemplaza el botón `handleSimulateDetection` o complementa con un hook `useSecurityWebSocket()` escuchando eventos `VIOLENCE_DETECTED`.
2. **Transmisiones de Video en Vivo:**
   - En `components/CameraCard.tsx`, reemplaza el contenedor de simulación de video por reproductores HLS (`hls.js`), WebRTC o streams RTSP convertidos a WebSockets (ej. `jsmpeg` o `mediamtx`).
3. **Resolución de Alertas:**
   - En `handleResolveAlertByCameraId` y `handleResolveSpecificAlert`, invoca una llamada HTTP `PATCH /api/alerts/:id` con la causa (`"false_alarm"` o `"resolved"`).
