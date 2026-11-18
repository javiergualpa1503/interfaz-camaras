"use client";

import React, { useState } from "react";
import { Camera } from "@/types/security";
import { 
  X, 
  Video, 
  Plus, 
  Radio, 
  MapPin, 
  Sliders, 
  CheckCircle,
  Wifi
} from "lucide-react";

interface AddCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCamera: (newCamera: Camera) => void;
}

export const AddCameraModal: React.FC<AddCameraModalProps> = ({
  isOpen,
  onClose,
  onAddCamera,
}) => {
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [resolution, setResolution] = useState<string>("1080p (1920x1080)");
  const [fps, setFps] = useState<number>(30);
  const [streamUrl, setStreamUrl] = useState<string>("rtsp://192.168.1.105:554/live/ch1");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newId = `cam-0${Math.floor(Math.random() * 80) + 10}`;
    const newCamera: Camera = {
      id: newId,
      name: name.trim(),
      location: location.trim() || "Sector General",
      resolution,
      fps,
      status: "normal",
    };

    onAddCamera(newCamera);
    // Reset form
    setName("");
    setLocation("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-m3-surface-container-high text-slate-900 dark:text-m3-on-surface rounded-m3-3xl shadow-2xl border border-slate-200 dark:border-m3-outline-variant/40 overflow-hidden flex flex-col animate-scale-in"
        role="dialog"
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-m3-outline-variant/30 bg-slate-50 dark:bg-m3-surface-container">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-100 text-blue-700 dark:bg-m3-primary-container dark:text-m3-on-primary-container flex items-center justify-center">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-m3-on-surface tracking-tight">
                Conectar Nueva Cámara
              </h3>
              <p className="text-xs text-slate-500 dark:text-m3-on-surface-variant">
                Vincular feed IP / RTSP al Centro de Monitoreo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="m3-state-layer h-9 w-9 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 dark:hover:bg-m3-surface-container-highest"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-m3-on-surface mb-1">
              Nombre de la Cámara:
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Pasillo Sur - Nivel 2, Acceso Peatonal C"
              className="w-full text-xs p-3 rounded-full bg-slate-50 dark:bg-m3-surface-container border border-slate-200 dark:border-m3-outline-variant/40 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-m3-on-surface mb-1">
              Ubicación / Sector:
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej: Edificio 3 - Pasillo Central"
              className="w-full text-xs p-3 rounded-full bg-slate-50 dark:bg-m3-surface-container border border-slate-200 dark:border-m3-outline-variant/40 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-m3-on-surface mb-1">
              URL del Stream RTSP / IP:
            </label>
            <div className="relative">
              <Wifi className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={streamUrl}
                onChange={(e) => setStreamUrl(e.target.value)}
                placeholder="rtsp://usuario:pass@192.168.1.50:554/live"
                className="w-full text-xs pl-9 pr-3 py-3 rounded-full bg-slate-50 dark:bg-m3-surface-container border border-slate-200 dark:border-m3-outline-variant/40 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-m3-on-surface mb-1">
                Resolución:
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full text-xs p-3 rounded-full bg-slate-50 dark:bg-m3-surface-container border border-slate-200 dark:border-m3-outline-variant/40 focus:outline-none focus:border-blue-500"
              >
                <option value="1080p (1920x1080)">1080p FHD</option>
                <option value="2K (2560x1440)">2K QHD</option>
                <option value="4K (3840x2160)">4K UHD</option>
                <option value="720p (1280x720)">720p HD</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-m3-on-surface mb-1">
                Tasa de Cuadros (FPS):
              </label>
              <select
                value={fps}
                onChange={(e) => setFps(Number(e.target.value))}
                className="w-full text-xs p-3 rounded-full bg-slate-50 dark:bg-m3-surface-container border border-slate-200 dark:border-m3-outline-variant/40 focus:outline-none focus:border-blue-500"
              >
                <option value={25}>25 FPS (Ahorro)</option>
                <option value={30}>30 FPS (Estándar)</option>
                <option value={60}>60 FPS (Alta Fluidez)</option>
              </select>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-m3-outline-variant/30">
            <button
              type="button"
              onClick={onClose}
              className="m3-state-layer px-4 py-2 rounded-full border border-slate-300 dark:border-m3-outline-variant text-xs font-semibold text-slate-700 dark:text-m3-on-surface hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="m3-state-layer px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Conectar Cámara</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
