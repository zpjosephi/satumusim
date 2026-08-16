"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { STATS } from "@/lib/season";

gsap.registerPlugin(ScrollTrigger);

export default function StatGrid() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tiles = gsap.utils.toArray<HTMLElement>("[data-tile]");

        gsap.from(tiles, {
          y: 32,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 70%" },
        });

        tiles.forEach((tile) => {
          const num = tile.querySelector("[data-stat-value]");
          if (!num) return;
          const target = Number(num.getAttribute("data-stat-value"));
          const proxy = { v: 0 };
          gsap.to(proxy, {
            v: target,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: { trigger: tile, start: "top 75%" },
            onUpdate: () => {
              num.textContent = String(Math.round(proxy.v));
            },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="edge relative isolate py-32 md:py-44">
      <div aria-hidden="true" className="wash wash-duel" />
      <h2 className="track-head max-w-3xl font-display text-3xl font-semibold md:text-5xl">
        A race with no room to breathe
      </h2>
      <div className="mt-16 grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <div
            key={s.label}
            data-tile
            className="border-l border-[var(--line)] pl-6 md:pl-8"
          >
            <span
              data-stat-value={s.value}
              className="track-display font-display text-[clamp(3.5rem,7vw,6.5rem)] font-extrabold leading-none text-ink"
            >
              {s.value}
            </span>
            <p className="mt-4 max-w-[24ch] text-sm leading-relaxed text-muted md:text-base">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
