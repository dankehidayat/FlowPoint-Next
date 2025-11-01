import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Flowpoint - Real-time Energy & Environment Monitoring Dashboard",
    template: "%s | Flowpoint",
  },
  description:
    "Monitor energy consumption, environmental conditions, and power quality in real-time with Flowpoint's advanced IoT monitoring dashboard. Track voltage, current, power, temperature, and humidity metrics.",
  keywords: [
    "energy monitoring",
    "IoT dashboard",
    "power consumption",
    "environmental sensors",
    "real-time analytics",
    "smart energy",
    "power quality",
    "temperature monitoring",
    "humidity tracking",
  ],
  authors: [{ name: "Danke Hidayat" }],
  creator: "Danke Hidayat",
  publisher: "Danke Hidayat",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://flowpoint.dankehidayat.my.id"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://flowpoint.dankehidayat.my.id",
    title: "Flowpoint - Real-time Energy & Environment Monitoring Dashboard",
    description:
      "Monitor energy consumption, environmental conditions, and power quality in real-time with Flowpoint's advanced IoT monitoring dashboard.",
    siteName: "Flowpoint",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
