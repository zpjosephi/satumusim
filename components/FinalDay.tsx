"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FINAL_DAY } from "@/lib/season";

gsap.registerPlugin(ScrollTrigger);

export default function FinalDay() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = root.current;
        if (!el) return;
        el.classList.add("day-pinned");

        const panels = gsap.utils.toArray<HTMLElement>("[data-day-panel]");
        gsap.set(panels.slice(1), { autoAlpha: 0, y: 26 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=2600",
            scrub: 0.6,
            pin: "[data-day-pin]",
            anticipatePin: 1,
          },
        });

        panels.forEach((panel, i) => {
          if (i === 0) return;
          tl.to(panels[i - 1], { autoAlpha: 0, y: -22, duration: 0.4 }, i)
            .to(panel, { autoAlpha: 1, y: 0, duration: 0.5 }, i + 0.25);
        });
        // hold the last panel on screen for a beat before the pin releases
        tl.to({}, { duration: 0.8 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative">
      <div
        data-day-pin
        className="edge relative isolate flex min-h-svh flex-col justify-center py-16"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <Image
            src="/img/anfield-dusk.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-25 saturate-[0.55]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg/65 to-bg" />
        </div>

        <p className="track-label font-mono text-xs text-muted">
          MAY 12, 2019 &middot; THE FINAL DAY
        </p>

        <div className="day-stack mt-10">
          {FINAL_DAY.map((panel) => (
            <div key={panel.time} data-day-panel className="day-panel">
              <div className="flex flex-wrap items-center gap-x-10 gap-y-2 font-mono text-sm md:text-base">
                {panel.board.map((b) => (
                  <span key={b.fix} className="flex items-center gap-2.5 text-ink">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ background: b.color }}
                    />
                    {b.fix}
                  </span>
                ))}
                <span className="text-muted">{panel.time}</span>
              </div>
              <h3 className="track-display mt-6 max-w-[14ch] font-display text-[clamp(2.75rem,7.5vw,7rem)] font-extrabold leading-[0.95]">
                {panel.title}
              </h3>
              <p className="mt-6 max-w-[52ch] leading-relaxed text-muted">
                {panel.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
