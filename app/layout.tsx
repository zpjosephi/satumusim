import type { Metadata } from "next";
import { Archivo, Fraunces, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// tipografi editorial, bukan default geometric-sans: Fraunces buat judul
// dan angka gede (rasa long-read majalah bola), Archivo buat body, Plex
// Mono buat label scoreboard
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plexmono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  // tab title dipendekin, versi panjang cukup di og/twitter buat share card
  title: "satumusim · 98:97",
  description:
    "A scroll-driven data story about the 2018/19 Premier League season, when Manchester City and Liverpool were separated by a single point.",
  openGraph: {
    title: "satumusim | 98 to 97, the closest title race",
    description:
      "A scroll-driven data story about the 2018/19 Premier League season, when Manchester City and Liverpool were separated by a single point.",
    type: "article",
    siteName: "satumusim",
  },
  twitter: {
    card: "summary_large_image",
    title: "satumusim | 98 to 97, the closest title race",
    description:
      "A scroll-driven data story about the 2018/19 Premier League season, when Manchester City and Liverpool were separated by a single point.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${plexMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
