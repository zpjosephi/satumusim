"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FINAL_TOP6 } from "@/lib/season";

gsap.registerPlugin(ScrollTrigger);

const MAX = FINAL_TOP6[0].pts;

export default function FinalTable() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-bar]", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: root.current, start: "top 65%" },
        });
        gsap.from("[data-row-label]", {
          autoAlpha: 0,
          x: -12,
          duration: 0.7,
          stagger: 0.09,
          scrollTrigger: { trigger: root.current, start: "top 65%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="table" ref={root} className="px-6 py-32 md:py-48">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
          How it ended
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Two clubs finished on 97 points or more. Nobody else reached 73. Hover
          a bar for the full record.
        </p>

        <div className="mt-14 flex flex-col gap-0.5" role="list">
          {FINAL_TOP6.map((row, i) => (
            <div key={row.team} role="listitem" className="group">
              {i === 2 && (
                <p
                  aria-hidden="true"
                  className="border-t border-dashed border-[var(--line)] py-3 font-mono text-xs tracking-widest text-muted"
                >
                  25 POINTS BACK TO THIRD
                </p>
              )}
              <div className="grid grid-cols-[8rem_1fr] items-center gap-4 py-1 sm:grid-cols-[11rem_1fr]">
                <span
                  data-row-label
                  className="truncate text-sm text-ink sm:text-base"
                >
                  {row.team}
                </span>
                <div className="relative flex items-center gap-3">
                  <div
                    data-bar
                    className="h-9 rounded-r"
                    style={{
                      width: `${(row.pts / MAX) * 100}%`,
                      background: row.color ?? "var(--bar-rest)",
                    }}
                  />
                  <span className="font-mono text-sm font-semibold text-ink">
                    {row.pts}
                  </span>
                  <span
                    className={`pointer-events-none absolute left-4 font-mono text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                      row.color ? "text-bg font-medium" : "text-ink"
                    }`}
                  >
                    {row.w}W {row.d}D {row.l}L &middot; {row.gf}:{row.ga}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
