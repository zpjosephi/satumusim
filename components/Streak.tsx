"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { STREAK } from "@/lib/season";

gsap.registerPlugin(ScrollTrigger);

export default function Streak() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = track.current;
        if (!el) return;
        const amount = () => el.scrollWidth - window.innerWidth;

        gsap.to(el, {
          x: () => -amount(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => "+=" + amount(),
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="wash wash-city" />
      <div className="streak-viewport flex min-h-svh flex-col justify-center py-16">
        <div className="edge flex flex-wrap items-end justify-between gap-4">
          <h2 className="track-head max-w-xl font-display text-3xl font-semibold md:text-5xl">
            Then City won every single week
          </h2>
          <p className="track-label font-mono text-xs text-muted md:text-sm">
            MATCHWEEK 25 &rarr; 38 &middot; 14 WINS
          </p>
        </div>

        <div
          ref={track}
          className="mt-16 flex w-max items-stretch pl-[var(--edge)] pr-[var(--edge)]"
        >
          {STREAK.map((m, i) => (
            <div
              key={m.wk}
              className="flex min-w-[240px] flex-col justify-between border-l border-[var(--line)] pb-2 pl-6 pr-12 md:min-w-[300px]"
            >
              <span className="track-display font-display text-[clamp(3.5rem,6vw,5.5rem)] font-extrabold leading-none text-ink/15">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="mt-10">
                <p className="track-label font-mono text-xs text-muted">
                  WK {m.wk} &middot; {m.venue === "H" ? "HOME" : "AWAY"}
                </p>
                <p className="track-head mt-2 font-display text-2xl font-semibold md:text-3xl">
                  {m.opp}
                </p>
                <p className="mt-2 font-mono text-lg text-city">{m.score}</p>
              </div>
            </div>
          ))}
          <div className="flex min-w-[320px] flex-col justify-center border-l border-[var(--line)] pl-6 pr-10 md:min-w-[420px]">
            <p className="track-display font-display text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold leading-[0.95]">
              42 points from 42.
            </p>
            <p className="mt-5 max-w-[34ch] leading-relaxed text-muted">
              Liverpool won nine of their last ten and it moved the gap by
              nothing at all.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
