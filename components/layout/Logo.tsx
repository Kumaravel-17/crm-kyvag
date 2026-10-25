/** Kyvag mark: purple K on a dark rounded tile, followed by the wordmark */
export function Logo({ tag }: { tag?: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-[10px] bg-[#121016] shadow-sm ring-1 ring-black/5">
        <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
          <defs>
            <linearGradient id="kyvag-k" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#c94bff" />
              <stop offset="1" stopColor="#8f00d6" />
            </linearGradient>
          </defs>
          {/* stem */}
          <path d="M4.5 3.5h5v17h-5z" fill="url(#kyvag-k)" />
          {/* upper arm */}
          <path d="M9.5 12.4 15.6 3.5h4.9l-7.3 10.2z" fill="#af00f8" />
          {/* lower arm */}
          <path d="M12.4 12.2 20.2 20.5h-5.3l-5.4-6.1z" fill="url(#kyvag-k)" />
        </svg>
      </span>
      <span className="flex items-baseline gap-1.5">
        <span className="text-[19px] font-bold tracking-[0.04em] text-foreground">KYVAG</span>
        {tag && <span className="rounded-md bg-accent/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">{tag}</span>}
      </span>
    </span>
  );
}
