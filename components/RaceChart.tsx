"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { RACE, BEATS, WEEKS } from "@/lib/season";

gsap.registerPlugin(ScrollTrigger);

const MAX_PTS = 100;

// dua layout chart: desktop lebar, mobile lebih tegak dengan tipografi
// digedein (viewBox 1200 diskala ke 390px bikin axis ga kebaca)
type ChartCfg = {
  W: number;
  H: number;
  ML: number;
  MR: number;
  MT: number;
  MB: number;
  tick: number;
  endLabel: number;
  lineW: number;
  dotR: number;
};

const CFG: Record<"d" | "m", ChartCfg> = {
  d: { W: 1200, H: 520, ML: 52, MR: 150, MT: 24, MB: 46, tick: 17, endLabel: 19, lineW: 2.5, dotR: 5.5 },
  m: { W: 680, H: 640, ML: 62, MR: 96, MT: 26, MB: 58, tick: 26, endLabel: 27, lineW: 3.5, dotR: 8 },
};

function buildChart(cfg: ChartCfg) {
  const PW = cfg.W - cfg.ML - cfg.MR;
  const PH = cfg.H - cfg.MT - cfg.MB;
  const xAt = (wk: number) => cfg.ML + ((wk - 1) / (WEEKS - 1)) * PW;
  const yAt = (pts: number) => cfg.MT + (1 - pts / MAX_PTS) * PH;
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
  return { cfg, xAt, yAt, series };
}

const CHARTS = { d: buildChart(CFG.d), m: buildChart(CFG.m) };
type Chart = (typeof CHARTS)["d"];

// point and drawn length along a polyline at a fractional matchweek
function along(s: Chart["series"][number], wk: number) {
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

      mm.add(
        {
          motionOK: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 768px)",
        },
        (ctx) => {
          const { motionOK, desktop } = ctx.conditions as {
            motionOK: boolean;
            desktop: boolean;
          };
          if (!motionOK) return;
          const el = root.current;
          if (!el) return;
          const variant = desktop ? "d" : "m";
          const chart = CHARTS[variant];
          el.classList.add("race-pinned");

          const paths = gsap.utils.toArray<SVGPathElement>(
            `[data-race-path="${variant}"]`,
          );
          const dots = gsap.utils.toArray<SVGCircleElement>(
            `[data-head-dot="${variant}"]`,
          );
          const endLabel = `[data-end-label="${variant}"]`;
          const roWeek = el.querySelector("[data-ro-week]");
          const roPts = gsap.utils.toArray<HTMLElement>("[data-ro-pts]");
          const captions = gsap.utils.toArray<HTMLElement>("[data-race-caption]");

          paths.forEach((p, i) => {
            gsap.set(p, {
              strokeDasharray: chart.series[i].total,
              strokeDashoffset: chart.series[i].total,
            });
          });
          gsap.set(endLabel, { autoAlpha: 0 });
          gsap.set(captions, { autoAlpha: 0, y: 24 });
          drawnWk.current = 1;

          // park the head dots and readout at week 1 until the scrub takes over
          chart.series.forEach((s, i) => {
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
              chart.series.forEach((s, i) => {
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

          tl.to(endLabel, { autoAlpha: 1, duration: 1.6 }, WEEKS - 3);

          return () => {
            el.classList.remove("race-pinned");
          };
        },
      );
    },
    { scope: root },
  );

  // hover cuma di chart desktop; di HP pointermove tabrakan sama scroll
  function handleMove(e: ReactPointerEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    const box = chartBox.current;
    const tip = tooltip.current;
    if (!svg || !box || !tip) return;
    const { cfg, xAt, yAt } = CHARTS.d;
    const PW = cfg.W - cfg.ML - cfg.MR;

    // the svg can letterbox inside its element (max-height cap), so map through
    // the real content scale instead of assuming element width == viewBox width
    const rect = svg.getBoundingClientRect();
    const scale = Math.min(rect.width / cfg.W, rect.height / cfg.H);
    const offY = (rect.height - cfg.H * scale) / 2; // preserveAspectRatio xMinYMid

    const px = (e.clientX - rect.left) / scale;
    let wk = Math.round(((px - cfg.ML) / PW) * (WEEKS - 1) + 1);
    wk = Math.min(Math.max(wk, 1), Math.max(1, Math.floor(drawnWk.current)));

    const cx = xAt(wk);
    crosshair.current?.setAttribute("x1", String(cx));
    crosshair.current?.setAttribute("x2", String(cx));
    if (crosshair.current) crosshair.current.style.opacity = "1";

    CHARTS.d.series.forEach((s, i) => {
      const dot = hoverDots.current[i];
      dot?.setAttribute("cx", String(cx));
      dot?.setAttribute("cy", String(yAt(s.byWeek[wk - 1])));
      if (dot) dot.style.opacity = "1";
    });

    const [city, liv] = [RACE[0].byWeek[wk - 1], RACE[1].byWeek[wk - 1]];
    tip.innerHTML = `<span class="font-mono">WK ${String(wk).padStart(2, "0")}</span> &nbsp; Man City ${city} &middot; Liverpool ${liv}`;

    const boxRect = box.getBoundingClientRect();
    const left = cx * scale + (rect.left - boxRect.left);
    const flip = left > boxRect.width - 230;
    tip.style.left = `${flip ? left - 12 : left + 12}px`;
    tip.style.transform = flip ? "translateX(-100%)" : "none";
    tip.style.top = `${Math.min(yAt(city), yAt(liv)) * scale + offY + (rect.top - boxRect.top) - 44}px`;
    tip.style.opacity = "1";
  }

  function handleLeave() {
    if (crosshair.current) crosshair.current.style.opacity = "0";
    hoverDots.current.forEach((d) => d && (d.style.opacity = "0"));
    if (tooltip.current) tooltip.current.style.opacity = "0";
  }

  function chartSvg(variant: "d" | "m") {
    const { cfg, xAt, yAt, series } = CHARTS[variant];
    const interactive = variant === "d";
    return (
      <svg
        ref={interactive ? svgRef : undefined}
        viewBox={`0 0 ${cfg.W} ${cfg.H}`}
        preserveAspectRatio="xMinYMid meet"
        className={
          interactive
            ? "hidden max-h-[58svh] w-full cursor-crosshair md:block"
            : "w-full md:hidden"
        }
        role="img"
        aria-label="Line chart of cumulative points per matchweek for Manchester City and Liverpool in the 2018/19 season. City finish on 98, Liverpool on 97."
        onPointerMove={interactive ? handleMove : undefined}
        onPointerLeave={interactive ? handleLeave : undefined}
      >
        {Y_TICKS.map((t) => (
          <g key={t}>
            <line
              x1={cfg.ML}
              x2={cfg.W - cfg.MR}
              y1={yAt(t)}
              y2={yAt(t)}
              stroke="var(--line)"
              strokeWidth="1"
            />
            <text
              x={cfg.ML - 10}
              y={yAt(t) + 5}
              textAnchor="end"
              fontSize={cfg.tick}
              fill="var(--muted)"
              fontFamily="var(--font-plexmono)"
            >
              {t}
            </text>
          </g>
        ))}
        {X_TICKS.map((t) => (
          <text
            key={t}
            x={xAt(t)}
            y={cfg.H - 14}
            textAnchor="middle"
            fontSize={cfg.tick}
            fill="var(--muted)"
            fontFamily="var(--font-plexmono)"
          >
            {t}
          </text>
        ))}

        {interactive && (
          <line
            ref={crosshair}
            x1={xAt(1)}
            x2={xAt(1)}
            y1={cfg.MT}
            y2={cfg.H - cfg.MB}
            stroke="var(--muted)"
            strokeWidth="1"
            strokeDasharray="3 4"
            style={{ opacity: 0, transition: "opacity 150ms" }}
          />
        )}

        {series.map((s, i) => (
          <g key={s.team}>
            <path
              data-race-path={variant}
              d={s.d}
              fill="none"
              stroke={s.color}
              strokeWidth={cfg.lineW}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <circle
              data-head-dot={variant}
              cx={s.pts[s.pts.length - 1].x}
              cy={s.pts[s.pts.length - 1].y}
              r={cfg.dotR}
              fill={s.color}
              stroke="var(--bg)"
              strokeWidth="2"
            />
            {interactive && (
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
            )}
          </g>
        ))}

        <g data-end-label={variant}>
          <text
            x={xAt(WEEKS) + 12}
            y={yAt(98) - 2}
            fontSize={cfg.endLabel}
            fontWeight="600"
            fill="var(--ink)"
          >
            Man City 98
          </text>
          <text
            x={xAt(WEEKS) + 12}
            y={yAt(97) + cfg.endLabel + 5}
            fontSize={cfg.endLabel}
            fontWeight="600"
            fill="var(--ink)"
          >
            Liverpool 97
          </text>
        </g>
      </svg>
    );
  }

  return (
    <section ref={root} className="relative">
      <div
        data-race-pin
        className="edge flex min-h-svh flex-col justify-center py-14"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="track-head max-w-2xl font-display text-3xl font-semibold md:text-4xl">
            Thirty-eight weeks, one line each
          </h2>
          <p className="whitespace-nowrap font-mono text-xs text-muted md:text-sm">
            MATCHWEEK <span data-ro-week className="text-ink">38</span>
            <span className="mx-3 text-muted/50">|</span>
            Man City <span data-ro-pts className="font-semibold text-city">98</span>
            <span className="mx-2 text-muted/50">&middot;</span>
            Liverpool <span data-ro-pts className="font-semibold text-liv">97</span>
          </p>
        </div>

        <div ref={chartBox} className="relative mt-6 md:mt-8">
          <div className="mb-4 flex gap-6" aria-hidden="true">
            {RACE.map((s) => (
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
            {chartSvg("d")}
            {chartSvg("m")}
            <figcaption className="mt-3 font-mono text-xs text-muted">
              Cumulative points by matchweek &middot; 2018/19
            </figcaption>
          </figure>

          {/* on desktop the beats overlay the chart's empty upper-left corner */}
          <div className="race-caption-stack mt-8 md:mt-0">
            {BEATS.map((beat) => (
              <div key={beat.week} data-race-caption className="race-caption">
                <p className="track-label font-mono text-xs text-muted">
                  MATCHWEEK {String(beat.week).padStart(2, "0")}
                </p>
                <h3 className="track-head mt-3 font-display text-2xl font-semibold md:text-3xl">
                  {beat.title}
                </h3>
                <p className="mt-4 max-w-[40ch] leading-relaxed text-muted">
                  {beat.body}
                </p>
              </div>
            ))}
          </div>

          <div
            ref={tooltip}
            aria-hidden="true"
            className="pointer-events-none absolute z-10 whitespace-nowrap rounded-lg border border-[var(--line)] bg-surface px-3 py-2 text-xs text-ink shadow-xl"
            style={{ opacity: 0, transition: "opacity 150ms" }}
          />
        </div>
      </div>

      <div className="edge pb-24">
        <details className="max-w-2xl rounded-xl border border-[var(--line)] bg-surface/60 px-6 py-4">
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
