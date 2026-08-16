"use client";

// Embed resmi Getty Images (gratis buat pemakaian editorial non-komersial):
// fotonya tetep di-host Getty lengkap sama kredit fotografernya di dalem
// frame. Ini jalur legal buat nampilin foto momen aslinya tanpa beli
// lisensi. Kode embed + signature diambil dari endpoint oEmbed resmi.
import { useEffect, useRef } from "react";

type GieQueue = Array<() => void>;
type Gie = ((cb: () => void) => void) & {
  q?: GieQueue;
  widgets?: { load: (opts: Record<string, unknown>) => void };
};

declare global {
  interface Window {
    gie?: Gie;
  }
}

type Props = {
  embedId: string; // id anchor dari oEmbed, kepasang ke signature
  sig: string;
  item: string;
  w: number; // ukuran asli widget dari oEmbed
  h: number;
  scale?: number; // dikecilin biar muat di layout tanpa ngerusak widget
};

export default function GettyEmbed({ embedId, sig, item, w, h, scale = 1 }: Props) {
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // strict mode manggil effect dua kali; begitu anchor udah dikonversi
    // jadi iframe sama widgets.js, load kedua bakal error, jadi skip
    if (!document.getElementById(embedId)) return;

    if (!window.gie) {
      const g = ((c: () => void) => {
        (g.q = g.q || []).push(c);
      }) as Gie;
      window.gie = g;
    }
    window.gie(function () {
      if (!document.getElementById(embedId)) return;
      window.gie?.widgets?.load({
        id: embedId,
        sig,
        w: `${w}px`,
        h: `${h}px`,
        items: item,
        caption: false,
        tld: "com",
        is360: false,
      });
    });
    if (!document.querySelector('script[src*="embed-cdn.gettyimages.com/widgets.js"]')) {
      const s = document.createElement("script");
      s.src = "https://embed-cdn.gettyimages.com/widgets.js";
      s.async = true;
      document.body.appendChild(s);
    }

    // widget nulis src protocol-relative (//embed.gettyimages.com); di dev
    // http://localhost itu bikin seluruh isi frame ke-load lewat http dan
    // diblokir. Paksa https, di produksi emang udah https jadi no-op.
    const fixer = window.setInterval(() => {
      const iframe = holder.current?.querySelector("iframe");
      if (iframe) {
        const src = iframe.getAttribute("src") ?? "";
        if (src.startsWith("//")) iframe.setAttribute("src", "https:" + src);
        window.clearInterval(fixer);
      }
    }, 200);
    const stop = window.setTimeout(() => window.clearInterval(fixer), 8000);
    return () => {
      window.clearInterval(fixer);
      window.clearTimeout(stop);
    };
  }, [embedId, sig, item, w, h]);

  return (
    <div
      style={{ width: w * scale, height: h * scale }}
      className="overflow-hidden rounded-sm border border-[var(--line)]"
    >
      <div
        ref={holder}
        style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: w, height: h }}
      >
        <a
          id={embedId}
          className="gie-single"
          href={`https://www.gettyimages.com/detail/${item}`}
          target="_blank"
          rel="noreferrer"
          style={{
            color: "#a7a7a7",
            textDecoration: "none",
            fontWeight: "normal",
            border: "none",
            display: "inline-block",
          }}
        >
          Embed from Getty Images
        </a>
      </div>
    </div>
  );
}
