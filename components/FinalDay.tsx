"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FINAL_DAY } from "@/lib/season";
import GettyEmbed from "./GettyEmbed";

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
        // klimaks: pas skor akhir masuk, lampu City banjir + judulnya mantap
        const climaxAt = panels.length - 1 + 0.3;
        tl.to("[data-day-flood]", { autoAlpha: 1, duration: 0.9 }, climaxAt);
        tl.fromTo(
          "[data-day-final]",
          { scale: 0.93 },
          { scale: 1, duration: 0.7, ease: "back.out(1.6)" },
          climaxAt,
        );
        // hold the last panel on screen for a beat before the pin releases
        tl.to({}, { duration: 1.2 });
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
            className="object-cover opacity-45 saturate-[0.8]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg/45 to-bg" />
          {/* pas panel terakhir, lampu biru City banjirin layar (diatur GSAP) */}
          <div
            data-day-flood
            className="absolute inset-0 opacity-0"
            style={{
              background:
                "radial-gradient(90% 80% at 50% 85%, rgba(62,155,224,0.22), transparent 70%)",
            }}
          />
        </div>

        <p className="track-label font-mono text-xs text-muted">
          MAY 12, 2019 &middot; THE FINAL DAY
        </p>

        <div className="day-stack mt-10">
          {FINAL_DAY.map((panel, i) => {
            const last = i === FINAL_DAY.length - 1;
            return (
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
                {last ? (
                  <h3
                    data-day-final
                    className="track-display mt-6 origin-left font-display text-[clamp(4rem,13vw,12rem)] font-extrabold leading-[0.9]"
                  >
                    <span className="text-city">98</span>
                    <span className="mx-[0.18em] align-[0.28em] text-[0.32em] font-semibold text-muted/70">
                      to
                    </span>
                    <span className="text-liv">97</span>
                  </h3>
                ) : (
                  <h3 className="track-display mt-6 max-w-[14ch] font-display text-[clamp(2.75rem,7.5vw,7rem)] font-extrabold leading-[0.95]">
                    {panel.title}
                  </h3>
                )}
                <p className="mt-6 max-w-[52ch] leading-relaxed text-muted">
                  {panel.body}
                </p>

                {i === 1 && (
                  <figure className="absolute right-0 top-1/2 hidden w-72 -translate-y-1/2 lg:block">
                    <div className="moment moment-liv aspect-[4/3]">
                      <Image
                        src="/img/kop.jpg"
                        alt="The Kop at Anfield covered in flags"
                        fill
                        sizes="288px"
                        className="object-cover"
                      />
                    </div>
                    <figcaption className="track-label mt-3 font-mono text-[10px] text-muted">
                      THE KOP &middot; CHAMPIONS FOR 83 SECONDS
                    </figcaption>
                  </figure>
                )}
                {last && (
                  <figure className="absolute right-0 top-1/2 hidden -translate-y-1/2 lg:block">
                    <GettyEmbed
                      embedId="dFwJkF7LQ193EY7u3JJTWA"
                      sig="BXdS680I0hKPD049eNcQG2LqegKlOJqXvKmE6M3uzHM="
                      item="1148631065"
                      w={594}
                      h={421}
                      scale={0.6}
                    />
                    <figcaption className="track-label mt-3 font-mono text-[10px] text-muted">
                      AGUERO&apos;S ANSWER &middot; VIA GETTY IMAGES
                    </figcaption>
                  </figure>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
