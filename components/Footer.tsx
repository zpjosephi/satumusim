export default function Footer() {
  return (
    <footer className="edge border-t border-[var(--line)] py-32 md:py-40">
      <p className="track-display font-display text-[clamp(3.5rem,13vw,11rem)] font-extrabold leading-none">
        One point.
      </p>
      <div className="mt-12 grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
        <p className="max-w-xl text-muted">
          Liverpool&apos;s 97 points would have won 25 of the previous 26
          Premier League titles. In 2018/19 it wasn&apos;t enough.
        </p>
        <div className="flex flex-col gap-1 font-mono text-xs text-muted md:text-right">
          <p>satumusim &middot; a scroll-driven data story</p>
          <p>Data: football-data.org, via the xeleven archive</p>
          <p>Built with Next.js and GSAP</p>
          <p className="mt-3 max-w-[52ch] text-muted/80 md:ml-auto">
            Photos via Wikimedia Commons: Etihad at night by mjtmail/tiggy (CC
            BY 2.0), Etihad bowl by Ank Kumar (CC BY-SA 4.0), Anfield by
            Ruaraidh Gillies (CC BY-SA 2.0), John Stones by Brad Tutterow (CC
            BY 2.0), Sergio Aguero by joshjdss (CC BY 2.0), the Kop by Colin
            Pyle (CC BY-SA 2.0). Portraits are duotone-treated.
          </p>
        </div>
      </div>
    </footer>
  );
}
