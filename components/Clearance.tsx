"use client";

import { useRef } from "react";
import Image from "next/image";
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
        // babak 1: bola menggelinding ke arah garis (posisi berhenti 11.7mm
        // di-set CSS). babak 2: label muncul. babak 3: Stones nyapu bolanya
        // keluar layar, itu clearance-nya.
        gsap.set("[data-mm-label]", { autoAlpha: 0 });
        gsap.set("[data-mm-save]", { autoAlpha: 0 });
        gsap.set("[data-mm-copy]", { autoAlpha: 0, y: 20 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=2400",
            scrub: 0.6,
            pin: "[data-mm-pin]",
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          ball.current,
          { x: () => -(ball.current?.offsetLeft ?? 0), rotation: -540 },
          { x: 0, rotation: 0, duration: 3, ease: "power2.out" },
        )
          .to("[data-mm-label]", { autoAlpha: 1, duration: 0.4 }, 2.5)
          .to(
            ball.current,
            {
              x: () => -window.innerWidth,
              rotation: "-=900",
              duration: 1.1,
              ease: "power3.in",
            },
            3.7,
          )
          .to("[data-mm-save]", { autoAlpha: 1, duration: 0.5 }, 4.3)
          .to("[data-mm-copy]", { autoAlpha: 1, y: 0, duration: 0.6 }, 4.5);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative">
      <div
        data-mm-pin
        className="edge relative isolate flex min-h-svh flex-col justify-center py-16"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <Image
            src="/img/etihad-bowl.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-40 saturate-[0.7]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/45 to-bg/80" />
          <div className="wash wash-city" />
        </div>

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

          {/* GSAP megang transform-nya, jadi offset vertikal ga boleh pake
              translate class (bakal ketimpa) */}
          <div
            ref={ball}
            className="absolute top-[calc(50%-2rem)] size-16 rounded-full bg-ink shadow-[0_0_30px_rgba(233,238,245,0.25)]"
            style={{ left: "calc(88% - 4rem - 4px)" }}
          >
            <div className="absolute left-[16%] top-[30%] h-[24%] w-[24%] rounded-full bg-bg/70" />
          </div>

          <p
            data-mm-label
            className="absolute right-[12.5%] top-[8%] font-mono text-sm font-semibold text-ink md:text-base"
          >
            11.7 mm
          </p>
          <p
            data-mm-save
            className="track-label absolute bottom-[14%] right-[13%] font-mono text-xs font-semibold text-city md:text-sm"
          >
            CLEARED &middot; STONES, 19&apos;
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
