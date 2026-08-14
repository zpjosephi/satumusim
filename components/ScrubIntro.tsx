"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const TEXT =
  "In August 2018, two managers started a season neither of them deserved to lose. Manchester City were defending champions with a hundred points behind them. Liverpool had just rebuilt their entire spine. Between them they would win 62 of their 76 matches, and the title would stay undecided until the final ten minutes of the final day.";

export default function ScrubIntro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.4,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top 75%",
              end: "bottom 45%",
              scrub: 0.5,
            },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section id="intro" ref={root} className="edge py-40 md:py-56">
      <p className="track-head max-w-[34ch] font-display text-[clamp(1.6rem,3.2vw,3rem)] font-medium leading-snug md:ml-[16vw]">
        {TEXT.split(" ").map((word, i) => (
          <span key={i} data-word className="inline">
            {word}{" "}
          </span>
        ))}
      </p>
    </section>
  );
}
