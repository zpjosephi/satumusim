export default function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-[var(--line)] bg-bg/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <a
          href="#top"
          className="font-display text-lg font-bold tracking-tight text-ink"
        >
          satumusim
        </a>
        <p className="font-mono text-xs text-muted">
          Premier League 2018/19 &middot; a data story
        </p>
      </nav>
    </header>
  );
}
