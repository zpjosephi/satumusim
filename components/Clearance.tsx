"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Clearance() {
  const root = useRef<HTMLElement>(null);
  const ball = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // the ball's resting spot (11.7mm short of the line) is set in CSS;
        // the scrub just replays the journey there from the left edge
        gsap.set("[data-mm-label]", { autoAlpha: 0 });
        gsap.set("[data-mm-copy]", { autoAlpha: 0, y: 20 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=1800",
            scrub: 0.6,
            pin: "[data-mm-pin]",
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          ball.current,
          { x: () => -(ball.current?.offsetLeft ?? 0) },
          { x: 0, duration: 3, ease: "power2.out" },
        )
          .to("[data-mm-label]", { autoAlpha: 1, duration: 0.5 }, 2.4)
          .to("[data-mm-copy]", { autoAlpha: 1, y: 0, duration: 0.6 }, 2.5);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative">
      <div
        data-mm-pin
        className="edge flex min-h-svh flex-col justify-center py-16"
      >
        <p className="track-label font-mono text-xs text-muted">
          MATCHWEEK 21 &middot; THE ETIHAD &middot; JANUARY 3
        </p>
        <h2 className="track-display mt-5 max-w-[16ch] font-display text-[clamp(2.75rem,7vw,6.5rem)] font-extrabold leading-[0.95]">
          Eleven point seven millimetres
        </h2>

        <div className="relative mt-16 h-40 md:mt-20">
          {/* everything right of the line is a Liverpool goal */}
          <div className="absolute inset-y-0 right-0 w-[12%] bg-liv/10" />
          <p className="track-label absolute right-2 top-2 font-mono text-[10px] text-muted md:right-4">
            OVER THE LINE
          </p>
          <div className="absolute inset-y-0 right-[12%] w-[3px] bg-ink" />

          <div
            ref={ball}
            className="absolute top-1/2 size-14 -translate-y-1/2 rounded-full bg-ink shadow-[0_0_30px_rgba(233,238,245,0.25)]"
            style={{ left: "calc(88% - 3.5rem - 4px)" }}
          />

          <p
            data-mm-label
            className="absolute right-[12.5%] top-[15%] font-mono text-sm font-semibold text-ink md:text-base"
          >
            11.7 mm
          </p>
          <p className="absolute bottom-0 left-0 font-mono text-[10px] text-muted/70">
            not to scale
          </p>
        </div>

        <div data-mm-copy className="mt-14 md:ml-auto md:max-w-[52ch]">
          <p className="leading-relaxed text-muted">
            Nineteen minutes in, still 0-0, Sadio Mane&apos;s shot rolls toward
            an open goal. John Stones scrapes it off the line with 11.7
            millimetres to spare. City go on to win 2-1. That clearance is the
            difference between trailing by four points and trailing by ten.
          </p>
        </div>
      </div>
    </section>
  );
}
