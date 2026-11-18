# SentinelEye AI - Monitoreo & Detección de Violencia (Material Design 3)

Sistema avanzado en Next.js (App Router), TypeScript y Tailwind CSS para centros de monitoreo con detección de violencia asistida por IA, diseñado bajo los estándares oficiales de **Google Material Design 3 (M3 / Material You)**.

---

## ⚡ Nuevas Funcionalidades Integradas

1. **Simulación de Video Activa con HTML5 Canvas ([VideoCanvas.tsx](components/VideoCanvas.tsx))**:
   - Renderizado en tiempo real de siluetas en movimiento en el entorno vigilado.
   - Bounding boxes dinámicos que siguen el movimiento y detectan forcejeos/peleas físicas al dispararse una alerta.
   - **Visión Nocturna Infrarroja (IR Mode)**: Alterna entre el modo CCTV estándar y modo infrarrojo con fósforo verde y reducción de ruido.
   - **Zoom Digital PTZ**: Selector de aumento (1x, 1.5x, 2x) directamente sobre cada cámara.
   - **Captura Forense de Evidencia**: Botón fotográfico que genera y descarga una captura real en formato `.png` en la computadora del operador.

2. **Protocolo de Intervención Rápida ([EmergencyProtocolModal.tsx](components/EmergencyProtocolModal.tsx))**:
   - Al detectar un altercado, el operador puede activar el protocolo de emergencia Código Rojo:
     - *Despachar Guardia / Patrulla In Situ*.
     - *Emitir reporte de emergencia a Central 911 / Policía*.
     - *Bloquear puertas electromagnéticas y accesos perimetrales*.
     - *Activar sirena sonora estroboscópica en el recinto*.
     - *Bitácora de observaciones del operador*.

3. **Locución y Alertas por Voz (Web Speech API)**:
   - Sintetizador de voz en español integrado que anuncia verbalmente la cámara y ubicación afectada (ej: *"Alerta de seguridad. Conflicto detectado en Entrada Principal"*).

4. **Conexión Dinámica de Nuevas Cámaras ([AddCameraModal.tsx](components/AddCameraModal.tsx))**:
   - Permite vincular nuevas cámaras IP / RTSP al panel indicando nombre, sector, resolución (4K, 2K, 1080p) y FPS.
   - Opción para eliminar canales desde sus tarjetas.

5. **Exportación de Informes en CSV**:
   - En el panel de incidentes, el operador puede descargar un reporte forense completo en formato `.csv` con IDs, coordenadas de tiempo, nivel de confianza y estado de resolución.

6. **Calibración del Motor Neuronal ([AIConfigModal.tsx](components/AIConfigModal.tsx))**:
   - Selector deslizante para ajustar el umbral de certeza (60% a 95%).
   - Toggles para clases de eventos (Peleas físicas, Armas sospechosas, Caídas/desmayos).
   - Modo de Demostración Continua: genera incidentes simulados automáticos cada 24 segundos.

7. **Resolución en Lote**:
   - Botón *"Resolver Todas"* en el panel lateral para limpiar incidentes verificados con un solo clic.

---

## 🚀 Puesta en Marcha Rápida

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.
