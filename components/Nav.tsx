export default function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-[var(--line)] bg-bg/70 backdrop-blur-md">
      <nav className="edge flex items-center justify-between py-4">
        <a
          href="#top"
          className="font-display text-lg font-bold track-head text-ink"
        >
          satumusim
        </a>
        <p className="hidden font-mono text-xs text-muted sm:block">
          Premier League 2018/19 &middot; a data story
        </p>
      </nav>
    </header>
  );
}
