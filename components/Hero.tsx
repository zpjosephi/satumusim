"use client";

import { useRef } from "react";
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
          y: 28,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.12,
        });

        counters.forEach(({ sel, to }) => {
          const el = root.current?.querySelector(sel);
          if (!el) return;
          const proxy = { v: 0 };
          tl.to(
            proxy,
            {
              v: to,
              duration: 1.6,
              ease: "power2.inOut",
              onUpdate: () => {
                el.textContent = String(Math.round(proxy.v));
              },
            },
            0.35,
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
      className="pitch-stripes relative flex min-h-svh flex-col items-center justify-center px-6 pt-24 text-center"
    >
      <div className="flex items-end justify-center gap-5 md:gap-10" data-hero-fade>
        <div className="text-right">
          <span
            data-count-city
            className="font-display text-[clamp(5rem,17vw,13rem)] font-extrabold leading-none text-city"
          >
            98
          </span>
          <p className="mt-1 font-mono text-xs tracking-widest text-muted md:text-sm">
            MANCHESTER CITY
          </p>
        </div>
        <span className="pb-8 font-display text-[clamp(2rem,6vw,4.5rem)] font-medium text-muted/60 md:pb-14">
          /
        </span>
        <div className="text-left">
          <span
            data-count-liv
            className="font-display text-[clamp(5rem,17vw,13rem)] font-extrabold leading-none text-liv"
          >
            97
          </span>
          <p className="mt-1 font-mono text-xs tracking-widest text-muted md:text-sm">
            LIVERPOOL
          </p>
        </div>
      </div>

      <h1
        data-hero-fade
        className="mx-auto mt-10 w-full max-w-6xl font-display text-[clamp(1.75rem,3.6vw,3.25rem)] font-semibold leading-tight tracking-tight"
      >
        The closest title race the Premier League has ever seen.
      </h1>

      <p data-hero-fade className="mt-5 max-w-xl text-base text-muted md:text-lg">
        Ten months, 76 matches, 184 goals. Settled by a single point. Scroll to
        watch the whole season unfold, one matchweek at a time.
      </p>

      <div data-hero-fade className="mt-10 flex items-center gap-4">
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

      <div
        data-scroll-cue
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 h-10 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-muted to-transparent"
      />
    </section>
  );
}
