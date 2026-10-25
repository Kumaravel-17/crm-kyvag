// Lightweight SVG charts drawn on one scale per chart. Colors come from theme tokens.

function niceMax(v: number) {
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  return Math.ceil(v / p) * p;
}

export function AreaChart({
  series, labels, height = 260,
}: {
  series: { name: string; data: number[]; color: string; fill?: boolean }[];
  labels: string[];
  height?: number;
}) {
  const W = 1000, H = height, padL = 36, padR = 12, padT = 12, padB = 26;
  const max = niceMax(Math.max(...series.flatMap((s) => s.data)));
  const n = labels.length;
  const x = (i: number) => padL + (i / (n - 1)) * (W - padL - padR);
  const y = (v: number) => padT + (1 - v / max) * (H - padT - padB);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t));
  const path = (d: number[]) => d.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Daily leads and paid conversions">
      <defs>
        {series.map((s, k) => (
          <linearGradient key={k} id={`ag${k}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={s.color} stopOpacity=".22" />
            <stop offset="1" stopColor={s.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {ticks.map((t) => (
        <g key={t}>
          <line stroke="var(--divider)" x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} strokeDasharray={t ? "2 4" : undefined} />
          <text x={padL - 8} y={y(t) + 3.5} textAnchor="end">{t}</text>
        </g>
      ))}
      {labels.map((l, i) => (i % 5 === 0 || i === n - 1) && (
        <text key={i} x={x(i)} y={H - 6} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}>{l}</text>
      ))}
      {series.map((s, k) => (
        <g key={s.name}>
          {s.fill && <path d={`${path(s.data)}L${x(n - 1)},${y(0)}L${x(0)},${y(0)}Z`} fill={`url(#ag${k})`} />}
          <path d={path(s.data)} fill="none" stroke={s.color} strokeWidth={s.fill ? 1.8 : 1.5} strokeDasharray={s.fill ? undefined : "4 3"} />
          <circle cx={x(n - 1)} cy={y(s.data[n - 1])} r="4" fill={s.color} stroke="var(--surface)" strokeWidth="2" />
        </g>
      ))}
    </svg>
  );
}

export function Sparkline({ data, w = 84, h = 26 }: { data: number[]; w?: number; h?: number }) {
  const max = Math.max(...data), min = Math.min(...data);
  const x = (i: number) => (i / (data.length - 1)) * (w - 4) + 2;
  const y = (v: number) => h - 3 - ((v - min) / (max - min || 1)) * (h - 6);
  const d = data.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden>
      <path d={`${d}L${x(data.length - 1)},${h}L2,${h}Z`} fill="color-mix(in srgb, var(--accent) 10%, transparent)" />
      <path d={d} fill="none" stroke="var(--accent)" strokeWidth="1.4" />
      <circle cx={x(data.length - 1)} cy={y(data[data.length - 1])} r="2.5" fill="var(--bronze)" />
    </svg>
  );
}

export function BarList({ items }: { items: { label: React.ReactNode; value: number; display: string }[] }) {
  const max = Math.max(...items.map((i) => i.value));
  return (
    <div className="flex flex-col gap-3.5">
      {items.map((it, k) => (
        <div key={k}>
          <div className="mb-1.5 flex justify-between gap-3 text-[12.5px]"><span>{it.label}</span><span className="tabular-nums">{it.display}</span></div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-sunken ring-1 ring-divider"><div className="h-full rounded-full bg-gradient-to-r from-bronze to-accent" style={{ width: `${(it.value / max) * 100}%` }} /></div>
        </div>
      ))}
    </div>
  );
}

export function Funnel({ steps }: { steps: { label: string; value: number }[] }) {
  const top = steps[0].value;
  const row = "grid grid-cols-[80px_1fr_90px] items-center gap-3.5 sm:grid-cols-[110px_1fr_120px]";
  return (
    <div className="flex flex-col gap-2">
      {steps.map((s, i) => (
        <div key={s.label} className="contents">
          {i > 0 && (
            <div className={row}>
              <span />
              <span className="text-center text-[11px] tracking-wide text-foreground-tertiary/70">↓ {Math.round((s.value / steps[i - 1].value) * 100)}% move on</span>
              <span />
            </div>
          )}
          <div className={row}>
            <span className="text-[12.5px] text-foreground-secondary">{s.label}</span>
            <span className="flex h-[34px] justify-center">
              <i
                className="block h-full rounded border border-accent/25"
                style={{
                  width: `${Math.max(6, (s.value / top) * 100)}%`,
                  background: "linear-gradient(180deg, color-mix(in srgb, var(--accent) 30%, transparent), color-mix(in srgb, var(--accent) 10%, transparent))",
                }}
              />
            </span>
            <span className="text-right tabular-nums">
              {s.value.toLocaleString("en-IN")}
              <small className="ml-1.5 text-foreground-tertiary">{Math.round((s.value / top) * 100)}%</small>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Donut({ parts, size = 150 }: { parts: { value: number; color: string }[]; size?: number }) {
  const total = parts.reduce((a, p) => a + p.value, 0);
  const r = size / 2 - 10, c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-sunken)" strokeWidth="12" />
      {parts.map((p, i) => {
        const len = (p.value / total) * c;
        const el = (
          <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={p.color} strokeWidth="12"
            strokeDasharray={`${Math.max(0, len - 2)} ${c}`} strokeDashoffset={-acc}
            transform={`rotate(-90 ${size / 2} ${size / 2})`} />
        );
        acc += len;
        return el;
      })}
    </svg>
  );
}
