"use client";

import React, { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from "react";

export interface VideoCanvasHandle {
  captureSnapshot: (cameraName: string) => void;
}

interface VideoCanvasProps {
  cameraId: string;
  cameraName: string;
  isAlert: boolean;
  confidence?: number;
  isNightVision?: boolean;
  zoomLevel?: number; // 1, 1.5, 2
}

export const VideoCanvas = forwardRef<VideoCanvasHandle, VideoCanvasProps>(({
  cameraId,
  cameraName,
  isAlert,
  confidence = 94,
  isNightVision = false,
  zoomLevel = 1,
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Posición simulada del objetivo en movimiento
  const targetPos = useRef({
    x: 180 + Math.random() * 80,
    y: 110 + Math.random() * 40,
    vx: (Math.random() - 0.5) * 1.5,
    vy: (Math.random() - 0.5) * 1.2,
    boxWidth: 70,
    boxHeight: 90,
  });

  // Exportar función para tomar captura de pantalla en PNG
  useImperativeHandle(ref, () => ({
    captureSnapshot: (name: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      const now = new Date().toISOString().replace(/[:.]/g, "-");
      a.href = dataUrl;
      a.download = `evidencia-${name.toLowerCase().replace(/\s+/g, "_")}-${now}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
  }));

  // Render loop del canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let tick = 0;

    const render = () => {
      tick++;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Limpiar canvas
      ctx.clearRect(0, 0, width, height);

      // 2. Fondo del espacio vigilado
      if (isNightVision) {
        // Modo Visión Nocturna / Infrarrojo (Tonalidades verdes/monocromáticas)
        ctx.fillStyle = "#03140a";
        ctx.fillRect(0, 0, width, height);

        // Ruido infrarrojo
        ctx.fillStyle = "rgba(74, 222, 128, 0.03)";
        for (let i = 0; i < 40; i++) {
          const rx = Math.random() * width;
          const ry = Math.random() * height;
          ctx.fillRect(rx, ry, 2, 2);
        }
      } else {
        // Modo Estándar CCTV
        ctx.fillStyle = "#090d16";
        ctx.fillRect(0, 0, width, height);
      }

      // 3. Grilla de perspectiva de seguridad / piso
      ctx.strokeStyle = isNightVision ? "rgba(74, 222, 128, 0.08)" : "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      const gridSize = 32;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 4. Objetos y siluetas simuladas en el entorno
      // Estructuras del entorno (pasillo, pared, columnas)
      ctx.fillStyle = isNightVision ? "rgba(34, 197, 94, 0.12)" : "rgba(30, 41, 59, 0.6)";
      ctx.fillRect(20, 40, 60, height - 80);
      ctx.fillRect(width - 80, 40, 60, height - 80);

      // Líneas de perspectiva del pasillo
      ctx.strokeStyle = isNightVision ? "rgba(34, 197, 94, 0.2)" : "rgba(71, 85, 105, 0.3)";
      ctx.beginPath();
      ctx.moveTo(80, 40);
      ctx.lineTo(width / 2, height / 2 - 20);
      ctx.lineTo(width - 80, 40);
      ctx.stroke();

      // 5. Mover y dibujar silueta de persona / actor en la escena
      const target = targetPos.current;
      target.x += target.vx;
      target.y += target.vy;

      // Rebotar en bordes
      if (target.x < 100 || target.x > width - 180) target.vx *= -1;
      if (target.y < 80 || target.y > height - 150) target.vy *= -1;

      // Silueta humana simulada
      ctx.fillStyle = isNightVision 
        ? (isAlert ? "rgba(239, 68, 68, 0.85)" : "rgba(134, 239, 172, 0.7)") 
        : (isAlert ? "rgba(220, 38, 38, 0.8)" : "rgba(148, 163, 184, 0.6)");
      
      // Cabeza
      ctx.beginPath();
      ctx.arc(target.x + 35, target.y + 16, 12, 0, Math.PI * 2);
      ctx.fill();

      // Torso
      ctx.beginPath();
      ctx.roundRect(target.x + 23, target.y + 32, 24, 38, 4);
      ctx.fill();

      // Si hay alerta, dibujar una segunda silueta en forcejeo
      if (isAlert) {
        // Segunda silueta cercana
        const secondX = target.x + 35 + Math.sin(tick * 0.1) * 8;
        const secondY = target.y + 4;
        ctx.fillStyle = isNightVision ? "rgba(248, 113, 113, 0.9)" : "rgba(239, 68, 68, 0.85)";
        
        ctx.beginPath();
        ctx.arc(secondX + 25, secondY + 16, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.roundRect(secondX + 15, secondY + 32, 22, 38, 4);
        ctx.fill();
      }

      // 6. Detección y Bounding Box de la IA
      if (isAlert) {
        const boxX = target.x - 5;
        const boxY = target.y - 8;
        const boxW = target.boxWidth + (isAlert ? 40 : 0);
        const boxH = target.boxHeight + 10;

        // Bounding Box con pulso
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 2;
        ctx.strokeRect(boxX, boxY, boxW, boxH);

        // Esquinas reforzadas estilo visión artificial
        const cornerLen = 10;
        ctx.lineWidth = 3;
        // Superior Izquierda
        ctx.beginPath();
        ctx.moveTo(boxX, boxY + cornerLen);
        ctx.lineTo(boxX, boxY);
        ctx.lineTo(boxX + cornerLen, boxY);
        ctx.stroke();
        // Superior Derecha
        ctx.beginPath();
        ctx.moveTo(boxX + boxW - cornerLen, boxY);
        ctx.lineTo(boxX + boxW, boxY);
        ctx.lineTo(boxX + boxW, boxY + cornerLen);
        ctx.stroke();
        // Inferior Izquierda
        ctx.beginPath();
        ctx.moveTo(boxX, boxY + boxH - cornerLen);
        ctx.lineTo(boxX, boxY + boxH);
        ctx.lineTo(boxX + cornerLen, boxY + boxH);
        ctx.stroke();
        // Inferior Derecha
        ctx.beginPath();
        ctx.moveTo(boxX + boxW - cornerLen, boxY + boxH);
        ctx.lineTo(boxX + boxW, boxY + boxH);
        ctx.lineTo(boxX + boxW, boxY + boxH - cornerLen);
        ctx.stroke();

        // Relleno sutil
        ctx.fillStyle = "rgba(239, 68, 68, 0.15)";
        ctx.fillRect(boxX, boxY, boxW, boxH);

        // Etiqueta de la IA
        ctx.fillStyle = "#dc2626";
        ctx.fillRect(boxX, boxY - 18, 120, 18);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px monospace";
        ctx.fillText(`VIOLENCIA: ${confidence}%`, boxX + 4, boxY - 5);
      } else {
        // Modo Normal: Bounding box verde suave de presencia humana
        const boxX = target.x + 10;
        const boxY = target.y;
        ctx.strokeStyle = isNightVision ? "rgba(34, 197, 94, 0.5)" : "rgba(56, 189, 248, 0.4)";
        ctx.lineWidth = 1;
        ctx.strokeRect(boxX, boxY, 50, 75);

        ctx.fillStyle = isNightVision ? "rgba(34, 197, 94, 0.6)" : "rgba(56, 189, 248, 0.6)";
        ctx.font = "8px monospace";
        ctx.fillText("PERSONA", boxX, boxY - 4);
      }

      // 7. Línea de escaneo vertical
      const scanY = (tick * 1.5) % height;
      const grad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(0.5, isNightVision ? "rgba(74, 222, 128, 0.15)" : "rgba(56, 189, 248, 0.15)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 20, width, 40);

      // 8. Mirilla central HUD
      ctx.strokeStyle = isNightVision ? "rgba(74, 222, 128, 0.25)" : "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      const cx = width / 2;
      const cy = height / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 24, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx - 32, cy);
      ctx.lineTo(cx - 12, cy);
      ctx.moveTo(cx + 12, cy);
      ctx.lineTo(cx + 32, cy);
      ctx.moveTo(cx, cy - 32);
      ctx.lineTo(cx, cy - 12);
      ctx.moveTo(cx, cy + 12);
      ctx.lineTo(cx, cy + 32);
      ctx.stroke();

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [isAlert, confidence, isNightVision]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-black flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={480}
        height={270}
        style={{
          transform: `scale(${zoomLevel})`,
          transition: "transform 0.3s ease",
          filter: isNightVision ? "hue-rotate(50deg) saturate(1.8)" : "none",
        }}
        className="w-full h-full object-cover pointer-events-none"
      />
    </div>
  );
});

VideoCanvas.displayName = "VideoCanvas";
