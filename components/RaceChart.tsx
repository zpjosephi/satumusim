"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { RACE, BEATS, WEEKS } from "@/lib/season";

gsap.registerPlugin(ScrollTrigger);

const W = 1000;
const H = 560;
const ML = 48;
const MR = 136;
const MT = 24;
const MB = 44;
const PW = W - ML - MR;
const PH = H - MT - MB;
const MAX_PTS = 100;

const xAt = (wk: number) => ML + ((wk - 1) / (WEEKS - 1)) * PW;
const yAt = (pts: number) => MT + (1 - pts / MAX_PTS) * PH;

const series = RACE.map((line) => {
  const pts = line.byWeek.map((p, i) => ({ x: xAt(i + 1), y: yAt(p) }));
  const d = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  }
  return { ...line, pts, d, cum, total: cum[cum.length - 1] };
});

// point and drawn length along a polyline at a fractional matchweek
function along(s: (typeof series)[number], wk: number) {
  const i = Math.min(Math.max(Math.floor(wk) - 1, 0), s.pts.length - 2);
  const f = Math.min(Math.max(wk - 1 - i, 0), 1);
  const a = s.pts[i];
  const b = s.pts[i + 1];
  return {
    x: a.x + (b.x - a.x) * f,
    y: a.y + (b.y - a.y) * f,
    len: s.cum[i] + (s.cum[i + 1] - s.cum[i]) * f,
  };
}

const Y_TICKS = [0, 25, 50, 75, 100];
const X_TICKS = [1, 10, 20, 30, 38];

export default function RaceChart() {
  const root = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const chartBox = useRef<HTMLDivElement>(null);
  const tooltip = useRef<HTMLDivElement>(null);
  const crosshair = useRef<SVGLineElement>(null);
  const hoverDots = useRef<(SVGCircleElement | null)[]>([]);
  const drawnWk = useRef(WEEKS);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = root.current;
        if (!el) return;
        el.classList.add("race-pinned");

        const paths = gsap.utils.toArray<SVGPathElement>("[data-race-path]");
        const dots = gsap.utils.toArray<SVGCircleElement>("[data-head-dot]");
        const roWeek = el.querySelector("[data-ro-week]");
        const roPts = gsap.utils.toArray<HTMLElement>("[data-ro-pts]");
        const captions = gsap.utils.toArray<HTMLElement>("[data-race-caption]");

        paths.forEach((p, i) => {
          gsap.set(p, {
            strokeDasharray: series[i].total,
            strokeDashoffset: series[i].total,
          });
        });
        gsap.set("[data-end-label]", { autoAlpha: 0 });
        gsap.set(captions, { autoAlpha: 0, y: 24 });
        drawnWk.current = 1;

        // park the head dots and readout at week 1 until the scrub takes over
        series.forEach((s, i) => {
          const p = along(s, 1);
          dots[i]?.setAttribute("cx", p.x.toFixed(2));
          dots[i]?.setAttribute("cy", p.y.toFixed(2));
        });
        if (roWeek) roWeek.textContent = "01";
        roPts.forEach((n, i) => {
          n.textContent = String(RACE[i].byWeek[0]);
        });

        const proxy = { wk: 1 };
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=3400",
            scrub: 0.6,
            pin: "[data-race-pin]",
            anticipatePin: 1,
          },
        });

        tl.to(proxy, {
          wk: WEEKS,
          duration: WEEKS - 1,
          ease: "none",
          onUpdate: () => {
            const wk = proxy.wk;
            drawnWk.current = wk;
            series.forEach((s, i) => {
              const p = along(s, wk);
              paths[i].style.strokeDashoffset = String(s.total - p.len);
              dots[i]?.setAttribute("cx", p.x.toFixed(2));
              dots[i]?.setAttribute("cy", p.y.toFixed(2));
            });
            const w = Math.max(1, Math.floor(wk));
            if (roWeek) roWeek.textContent = String(w).padStart(2, "0");
            roPts.forEach((n, i) => {
              n.textContent = String(RACE[i].byWeek[w - 1]);
            });
          },
        });

        // captions ride the same clock: timeline time == matchweek - 1
        BEATS.forEach((beat, i) => {
          const cap = captions[i];
          if (!cap) return;
          tl.to(cap, { autoAlpha: 1, y: 0, duration: 1.4 }, Math.max(beat.week - 1.8, 0.5));
          const next = BEATS[i + 1];
          if (next) {
            tl.to(cap, { autoAlpha: 0, y: -18, duration: 1 }, next.week - 3.4);
          }
        });

        tl.to("[data-end-label]", { autoAlpha: 1, duration: 1.6 }, WEEKS - 3);
      });
    },
    { scope: root },
  );

  function handleMove(e: ReactPointerEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    const box = chartBox.current;
    const tip = tooltip.current;
    if (!svg || !box || !tip) return;

    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    let wk = Math.round(((px - ML) / PW) * (WEEKS - 1) + 1);
    wk = Math.min(Math.max(wk, 1), Math.max(1, Math.floor(drawnWk.current)));

    const cx = xAt(wk);
    crosshair.current?.setAttribute("x1", String(cx));
    crosshair.current?.setAttribute("x2", String(cx));
    if (crosshair.current) crosshair.current.style.opacity = "1";

    series.forEach((s, i) => {
      const dot = hoverDots.current[i];
      dot?.setAttribute("cx", String(cx));
      dot?.setAttribute("cy", String(yAt(s.byWeek[wk - 1])));
      if (dot) dot.style.opacity = "1";
    });

    const [city, liv] = [RACE[0].byWeek[wk - 1], RACE[1].byWeek[wk - 1]];
    tip.innerHTML = `<span class="font-mono">WK ${String(wk).padStart(2, "0")}</span> &nbsp; Man City ${city} &middot; Liverpool ${liv}`;

    const boxRect = box.getBoundingClientRect();
    const left = (cx / W) * boxRect.width;
    const flip = left > boxRect.width - 220;
    tip.style.left = `${flip ? left - 12 : left + 12}px`;
    tip.style.transform = flip ? "translateX(-100%)" : "none";
    tip.style.top = `${((Math.min(yAt(city), yAt(liv)) / H) * boxRect.height) - 44}px`;
    tip.style.opacity = "1";
  }

  function handleLeave() {
    if (crosshair.current) crosshair.current.style.opacity = "0";
    hoverDots.current.forEach((d) => d && (d.style.opacity = "0"));
    if (tooltip.current) tooltip.current.style.opacity = "0";
  }

  return (
    <section ref={root} className="relative">
      <div
        data-race-pin
        className="flex min-h-svh flex-col justify-center px-6 py-16 md:px-10"
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Thirty-eight weeks, one line each
            </h2>
            <p className="font-mono text-sm text-muted">
              MATCHWEEK <span data-ro-week className="text-ink">38</span>
              <span className="mx-3 text-muted/50">|</span>
              Man City <span data-ro-pts className="font-semibold text-city">98</span>
              <span className="mx-2 text-muted/50">&middot;</span>
              Liverpool <span data-ro-pts className="font-semibold text-liv">97</span>
            </p>
          </div>

          <div className="mt-10 grid items-center gap-10 md:grid-cols-[1.6fr_1fr] md:gap-14">
            <div ref={chartBox} className="relative">
              <div className="mb-4 flex gap-6" aria-hidden="true">
                {series.map((s) => (
                  <span key={s.team} className="flex items-center gap-2 text-sm text-muted">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ background: s.color }}
                    />
                    {s.team}
                  </span>
                ))}
              </div>

              <figure>
                <svg
                  ref={svgRef}
                  viewBox={`0 0 ${W} ${H}`}
                  className="w-full cursor-crosshair"
                  role="img"
                  aria-label="Line chart of cumulative points per matchweek for Manchester City and Liverpool in the 2018/19 season. City finish on 98, Liverpool on 97."
                  onPointerMove={handleMove}
                  onPointerLeave={handleLeave}
                >
                  {Y_TICKS.map((t) => (
                    <g key={t}>
                      <line
                        x1={ML}
                        x2={W - MR}
                        y1={yAt(t)}
                        y2={yAt(t)}
                        stroke="var(--line)"
                        strokeWidth="1"
                      />
                      <text
                        x={ML - 10}
                        y={yAt(t) + 5}
                        textAnchor="end"
                        fontSize="17"
                        fill="var(--muted)"
                        fontFamily="var(--font-geist-mono)"
                      >
                        {t}
                      </text>
                    </g>
                  ))}
                  {X_TICKS.map((t) => (
                    <text
                      key={t}
                      x={xAt(t)}
                      y={H - 12}
                      textAnchor="middle"
                      fontSize="17"
                      fill="var(--muted)"
                      fontFamily="var(--font-geist-mono)"
                    >
                      {t}
                    </text>
                  ))}

                  <line
                    ref={crosshair}
                    x1={xAt(1)}
                    x2={xAt(1)}
                    y1={MT}
                    y2={H - MB}
                    stroke="var(--muted)"
                    strokeWidth="1"
                    strokeDasharray="3 4"
                    style={{ opacity: 0, transition: "opacity 150ms" }}
                  />

                  {series.map((s, i) => (
                    <g key={s.team}>
                      <path
                        data-race-path
                        d={s.d}
                        fill="none"
                        stroke={s.color}
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />
                      <circle
                        data-head-dot
                        cx={s.pts[s.pts.length - 1].x}
                        cy={s.pts[s.pts.length - 1].y}
                        r="5.5"
                        fill={s.color}
                        stroke="var(--bg)"
                        strokeWidth="2"
                      />
                      <circle
                        ref={(node) => {
                          hoverDots.current[i] = node;
                        }}
                        r="4.5"
                        fill={s.color}
                        stroke="var(--bg)"
                        strokeWidth="2"
                        style={{ opacity: 0, transition: "opacity 150ms" }}
                      />
                    </g>
                  ))}

                  <g data-end-label>
                    <text
                      x={xAt(WEEKS) + 14}
                      y={yAt(98) - 2}
                      fontSize="19"
                      fontWeight="600"
                      fill="var(--ink)"
                    >
                      Man City 98
                    </text>
                    <text
                      x={xAt(WEEKS) + 14}
                      y={yAt(97) + 22}
                      fontSize="19"
                      fontWeight="600"
                      fill="var(--ink)"
                    >
                      Liverpool 97
                    </text>
                  </g>
                </svg>
                <figcaption className="mt-3 font-mono text-xs text-muted">
                  Cumulative points by matchweek &middot; 2018/19
                </figcaption>
              </figure>

              <div
                ref={tooltip}
                aria-hidden="true"
                className="pointer-events-none absolute z-10 whitespace-nowrap rounded-lg border border-[var(--line)] bg-surface px-3 py-2 text-xs text-ink shadow-xl"
                style={{ opacity: 0, transition: "opacity 150ms" }}
              />
            </div>

            <div className="race-caption-stack">
              {BEATS.map((beat) => (
                <div key={beat.week} data-race-caption className="race-caption">
                  <p className="font-mono text-xs tracking-widest text-muted">
                    MATCHWEEK {String(beat.week).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight md:text-3xl">
                    {beat.title}
                  </h3>
                  <p className="mt-4 max-w-[40ch] leading-relaxed text-muted">
                    {beat.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-24">
        <details className="mx-auto max-w-2xl rounded-xl border border-[var(--line)] bg-surface/60 px-6 py-4">
          <summary className="cursor-pointer text-sm text-muted transition-colors hover:text-ink">
            View the race as a table
          </summary>
          <div className="mt-4 max-h-80 overflow-y-auto">
            <table className="w-full text-left font-mono text-sm">
              <thead className="sticky top-0 bg-surface">
                <tr className="text-muted">
                  <th className="py-2 pr-4 font-normal">Wk</th>
                  <th className="py-2 pr-4 font-normal">Man City</th>
                  <th className="py-2 font-normal">Liverpool</th>
                </tr>
              </thead>
              <tbody>
                {RACE[0].byWeek.map((cityPts, i) => (
                  <tr key={i} className="border-t border-[var(--line)]">
                    <td className="py-1.5 pr-4 text-muted">{i + 1}</td>
                    <td className="py-1.5 pr-4">{cityPts}</td>
                    <td className="py-1.5">{RACE[1].byWeek[i]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </section>
  );
}
