import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SkyScope - Global Weather Forecast",
  description: "Hyper-accurate weather forecasts for any location on Earth. Real-time conditions, hourly forecasts, severe weather alerts, and beautiful dynamic themes.",
  keywords: ["weather", "forecast", "meteorology", "climate", "temperature", "rain", "alerts"],
  authors: [{ name: "SkyScope Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: "/icon-192.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SkyScope",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  openGraph: {
    title: "SkyScope - Global Weather Forecast",
    description: "Hyper-accurate weather forecasts for any location on Earth.",
    type: "website",
    locale: "en_US",
    siteName: "SkyScope",
  },
  twitter: {
    card: "summary",
    title: "SkyScope - Global Weather Forecast",
    description: "Hyper-accurate weather forecasts for any location on Earth.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#87CEEB" },
    { media: "(prefers-color-scheme: dark)", color: "#0F2027" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
