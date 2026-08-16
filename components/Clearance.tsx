"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import GettyEmbed from "./GettyEmbed";

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
        gsap.set("[data-mm-card]", { autoAlpha: 0, y: 20 });
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
          .fromTo(
            "[data-mm-streak]",
            { x: 0, autoAlpha: 0 },
            {
              x: -150,
              autoAlpha: 0.7,
              duration: 0.45,
              stagger: 0.08,
              ease: "power2.in",
            },
            3.75,
          )
          .to("[data-mm-streak]", { autoAlpha: 0, duration: 0.3 }, 4.25)
          .to("[data-mm-save]", { autoAlpha: 1, duration: 0.5 }, 4.3)
          .to("[data-mm-card]", { autoAlpha: 1, y: 0, duration: 0.6 }, 4.4)
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

        {/* rekonstruksi goal-line cam ala grafik goal-line technology:
            gawang + jaring digambar sendiri, bukan foto agensi */}
        <div className="relative mt-16 h-48 md:mt-20">
          {/* mulut gawang: zona gol + jaring */}
          <div className="absolute inset-y-0 right-0 w-[12%] bg-liv/10" />
          <div className="net-grid absolute inset-y-0 right-0 w-[12%]" />
          <p className="track-label absolute right-2 top-2 z-10 bg-bg/60 px-1 font-mono text-[10px] text-muted md:right-4">
            OVER THE LINE
          </p>
          {/* garis gawang + tiang atas-bawah (top-down) */}
          <div className="absolute inset-y-0 right-[12%] w-[4px] bg-ink" />
          <div className="absolute right-[calc(12%-6px)] top-0 size-4 rounded-full border-2 border-bg bg-ink" />
          <div className="absolute bottom-0 right-[calc(12%-6px)] size-4 rounded-full border-2 border-bg bg-ink" />
          {/* sugesti kotak enam yard */}
          <div className="absolute right-[42%] top-[10%] h-[80%] w-px bg-ink/10" />
          <div className="absolute right-[12%] top-[10%] h-px w-[30%] bg-ink/10" />
          <div className="absolute bottom-[10%] right-[12%] h-px w-[30%] bg-ink/10" />

          {/* posisi berhenti: bola udah HAMPIR seluruhnya masuk, cuma sisa
              belakangnya yang masih kena garis (gol = seluruh bola lewat).
              GSAP megang transform-nya, jadi offset vertikal ga boleh pake
              translate class (bakal ketimpa) */}
          <div
            ref={ball}
            className="absolute top-[calc(50%-2rem)] z-10 size-16 rounded-full bg-ink shadow-[0_0_30px_rgba(233,238,245,0.25)]"
            style={{ left: "calc(88% - 8px)" }}
          >
            <div className="absolute left-[16%] top-[30%] h-[24%] w-[24%] rounded-full bg-bg/70" />
          </div>

          {/* garis kecepatan pas bola disapu keluar */}
          <div aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                data-mm-streak
                className="absolute h-[3px] w-12 rounded-full bg-ink/60 opacity-0"
                style={{
                  left: "calc(88% - 8px)",
                  top: `calc(50% - ${14 - i * 14}px)`,
                }}
              />
            ))}
          </div>

          <p
            data-mm-label
            className="absolute right-[13.5%] top-[6%] rounded-md border border-ink/40 bg-surface/90 px-3 py-1.5 font-mono text-xs font-semibold text-ink md:text-sm"
          >
            NO GOAL &middot; 11.7 MM
          </p>
          <p
            data-mm-save
            className="track-label absolute bottom-[12%] right-[13.5%] font-mono text-xs font-semibold text-city md:text-sm"
          >
            CLEARED &middot; STONES, 19&apos;
          </p>
          <p className="absolute -bottom-6 left-0 font-mono text-[10px] text-muted/70">
            goal-line view &middot; not to scale
          </p>
        </div>

        <div className="mt-14 flex flex-wrap items-end justify-between gap-10">
          <figure data-mm-card className="hidden md:block">
            <GettyEmbed
              embedId="YWAM2CJuSSZgPTUitjDNFQ"
              sig="bP-46Tx555Te-y7oJWgya0psFHiQWYOrnI6J-As7RXA="
              item="1076859122"
              w={594}
              h={400}
              scale={0.62}
            />
            <figcaption className="track-label mt-3 font-mono text-[10px] text-muted">
              THE MOMENT ITSELF &middot; VIA GETTY IMAGES
            </figcaption>
          </figure>
          <div data-mm-copy className="md:max-w-[46ch]">
            <p className="leading-relaxed text-muted">
              Nineteen minutes in, still 0-0, Sadio Mane&apos;s shot rolls toward
              an open goal. John Stones scrapes it off the line with 11.7
              millimetres to spare. City go on to win 2-1. That clearance is the
              difference between trailing by four points and trailing by ten.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
