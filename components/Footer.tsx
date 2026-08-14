export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] px-6 py-32 md:py-40">
      <div className="mx-auto max-w-5xl text-center">
        <p className="font-display text-[clamp(3rem,10vw,7rem)] font-extrabold leading-none tracking-tight">
          One point.
        </p>
        <p className="mx-auto mt-8 max-w-xl text-muted">
          Liverpool&apos;s 97 points would have won 25 of the previous 26
          Premier League titles. In 2018/19 it wasn&apos;t enough.
        </p>
        <div className="mt-16 flex flex-col items-center gap-2 font-mono text-xs text-muted">
          <p>satumusim &middot; a scroll-driven data story</p>
          <p>
            Data: football-data.org, via the xeleven archive &middot; Built with
            Next.js and GSAP
          </p>
        </div>
      </div>
    </footer>
  );
}
