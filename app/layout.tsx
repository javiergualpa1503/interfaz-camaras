import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SentinelEye AI - Centro de Monitoreo & Detección de Violencia",
  description: "Sistema de vigilancia inteligente en tiempo real con detección de violencia asistida por IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-red-500/30 selection:text-red-200">
        {children}
      </body>
    </html>
  );
}
