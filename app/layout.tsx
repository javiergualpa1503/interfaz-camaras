import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SentinelEye AI - Centro de Monitoreo & Detección de Violencia",
  description: "Sistema de vigilancia inteligente en tiempo real con detección de violencia asistida por IA diseñado bajo Material Design 3.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-m3-surface text-m3-on-surface antialiased selection:bg-m3-primary/20 selection:text-m3-primary">
        {children}
      </body>
    </html>
  );
}
