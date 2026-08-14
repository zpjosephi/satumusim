"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const counters = [
          { sel: "[data-count-city]", to: 98 },
          { sel: "[data-count-liv]", to: 97 },
        ];

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from("[data-hero-fade]", {
          y: 34,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.14,
        });

        counters.forEach(({ sel, to }) => {
          const el = root.current?.querySelector(sel);
          if (!el) return;
          const proxy = { v: 0 };
          tl.to(
            proxy,
            {
              v: to,
              duration: 1.7,
              ease: "power2.inOut",
              onUpdate: () => {
                el.textContent = String(Math.round(proxy.v));
              },
            },
            0.3,
          );
        });

        gsap.to("[data-scroll-cue]", {
          y: 8,
          repeat: -1,
          yoyo: true,
          duration: 0.9,
          ease: "sine.inOut",
          delay: 2,
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      className="pitch-stripes edge relative isolate flex min-h-svh flex-col overflow-hidden pb-14 pt-28"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div data-speed="0.88" className="absolute inset-x-0 -inset-y-[12%]">
          <Image
            src="/img/etihad-night.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-45 saturate-[0.85]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-bg/70 via-bg/40 to-bg" />
      </div>

      <div className="grid grid-cols-2 items-start">
        <div data-hero-fade>
          <span
            data-count-city
            className="track-display block font-display text-[clamp(7rem,24vw,21rem)] font-extrabold leading-[0.85] text-city"
          >
            98
          </span>
          <p className="track-label mt-3 font-mono text-xs text-muted md:text-sm">
            MANCHESTER CITY &middot; CHAMPIONS
          </p>
        </div>
        <div data-hero-fade className="mt-[13vw] justify-self-end text-right">
          <span
            data-count-liv
            className="track-display block font-display text-[clamp(7rem,24vw,21rem)] font-extrabold leading-[0.85] text-liv"
          >
            97
          </span>
          <p className="track-label mt-3 font-mono text-xs text-muted md:text-sm">
            LIVERPOOL &middot; SECOND
          </p>
        </div>
      </div>

      <div className="mt-auto grid items-end gap-10 pt-20 md:grid-cols-[1.3fr_1fr]">
        <h1
          data-hero-fade
          className="track-head max-w-[20ch] font-display text-[clamp(2.25rem,4.5vw,4.25rem)] font-semibold leading-[1.05]"
        >
          The closest title race the Premier League has ever seen.
        </h1>
        <div data-hero-fade className="md:justify-self-end">
          <p className="max-w-[44ch] text-base text-muted md:text-lg">
            Ten months, 76 matches, 184 goals. Settled by a single point.
            Scroll to watch the whole season unfold, one matchweek at a time.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#intro"
              className="rounded-full bg-ink px-7 py-3 text-sm font-semibold text-bg transition-colors duration-300 hover:bg-white"
            >
              Follow the race
            </a>
            <a
              href="#table"
              className="rounded-full border border-[var(--line)] px-7 py-3 text-sm font-semibold text-ink transition-colors duration-300 hover:border-ink/40"
            >
              Skip to the final table
            </a>
          </div>
        </div>
      </div>

      <div
        data-scroll-cue
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 h-10 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-muted to-transparent"
      />
    </section>
  );
}
