"use client";

// Lightweight SVG charts drawn on one scale per chart. Colors come from theme tokens.

import { useEffect, useRef, useState } from "react";

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
  // Drawn at the width it actually has, so text keeps its real size and the chart keeps its height on phones
  const box = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(1000);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setW(Math.max(260, Math.round(entry.contentRect.width))));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const H = W < 640 ? Math.min(height, 220) : height;
  const padL = 36, padR = 12, padT = 12, padB = 26;
  // At least 4, so an empty chart (all zeros) still has a scale and small counts get whole-number ticks
  const max = niceMax(Math.max(4, ...series.flatMap((s) => s.data)));
  const n = labels.length;
  const x = (i: number) => padL + (i / (n - 1)) * (W - padL - padR);
  const y = (v: number) => padT + (1 - v / max) * (H - padT - padB);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t));
  const path = (d: number[]) => d.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
  // Fewer date labels on narrow screens; the last one always shows, so skip any label crowding it
  const every = W < 480 ? 10 : W < 760 ? 7 : 5;
  const showLabel = (i: number) => i === n - 1 || (i % every === 0 && n - 1 - i >= every / 2);

  // Day under the pointer (mouse or touch), for the guide line, dots and tooltip
  const [hover, setHover] = useState<number | null>(null);
  const onPointer = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    setHover(Math.min(n - 1, Math.max(0, Math.round(((px - padL) / (W - padL - padR)) * (n - 1)))));
  };
  // Tooltip sits beside the guide line, flipping to the left near the right edge
  const tipLeft = hover !== null && x(hover) > W - 170;

  return (
    <div ref={box} className="relative w-full">
      <svg
        className="chart block touch-pan-y"
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        role="img"
        aria-label="Daily leads and paid conversions"
        onPointerMove={onPointer}
        onPointerDown={onPointer}
        onPointerLeave={() => setHover(null)}
      >
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
        {/* Y axis */}
        <line stroke="var(--border-strong)" x1={padL} x2={padL} y1={padT} y2={y(0)} />
        {labels.map((l, i) => showLabel(i) && (
          <text key={i} x={x(i)} y={H - 6} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}>{l}</text>
        ))}
        {series.map((s, k) => (
          <g key={s.name}>
            {s.fill && <path d={`${path(s.data)}L${x(n - 1)},${y(0)}L${x(0)},${y(0)}Z`} fill={`url(#ag${k})`} />}
            <path d={path(s.data)} fill="none" stroke={s.color} strokeWidth={s.fill ? 1.8 : 1.5} strokeDasharray={s.fill ? undefined : "4 3"} />
            {hover === null && <circle cx={x(n - 1)} cy={y(s.data[n - 1])} r="4" fill={s.color} stroke="var(--surface)" strokeWidth="2" />}
          </g>
        ))}
        {hover !== null && (
          <g pointerEvents="none">
            <line stroke="var(--border-strong)" x1={x(hover)} x2={x(hover)} y1={padT} y2={y(0)} strokeDasharray="3 3" />
            {series.map((s) => (
              <circle key={s.name} cx={x(hover)} cy={y(s.data[hover])} r="4.5" fill={s.color} stroke="var(--surface)" strokeWidth="2" />
            ))}
          </g>
        )}
      </svg>
      {hover !== null && (
        <div
          role="status"
          className="pointer-events-none absolute z-10 min-w-[150px] rounded-lg border border-border bg-surface-elevated px-3 py-2 text-[12px] shadow-md"
          style={{ top: padT, ...(tipLeft ? { right: W - x(hover) + 10 } : { left: x(hover) + 10 }) }}
        >
          <p className="mb-1 font-semibold">{labels[hover]}</p>
          {series.map((s) => (
            <p key={s.name} className="flex items-center gap-2 text-foreground-secondary">
              <i className="h-0.5 w-3" style={{ background: s.color }} />
              {s.name}
              <span className="ml-auto pl-3 font-semibold tabular-nums text-foreground">{s.data[hover]}</span>
            </p>
          ))}
        </div>
      )}
    </div>
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
      <circle cx={x(data.length - 1)} cy={y(data[data.length - 1])} r="2.5" fill="var(--accent)" />
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
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-sunken ring-1 ring-divider"><div className="h-full rounded-full bg-accent" style={{ width: `${(it.value / max) * 100}%` }} /></div>
        </div>
      ))}
    </div>
  );
}

/** Faded dashed bar for a step with no leads, narrowing down the funnel like a real one would */
function EmptyBar({ index, count }: { index: number; count: number }) {
  return (
    <i
      aria-hidden
      className="block h-full rounded border border-dashed border-accent/30 bg-accent/[0.04] opacity-60"
      style={{ width: `${100 - (index * 70) / Math.max(1, count - 1)}%` }}
    />
  );
}

export function Funnel({ steps }: { steps: { label: string; value: number }[] }) {
  const top = steps[0]?.value ?? 0;
  const row = "grid grid-cols-[80px_1fr_70px] items-center gap-3.5 sm:grid-cols-[110px_1fr_90px]";

  // No leads yet: a faded outline of the whole funnel
  if (top === 0) {
    return (
      <div className="flex flex-col gap-2.5">
        {steps.map((s, i) => (
          <div key={s.label} className={row}>
            <span className="text-[12.5px] text-foreground-tertiary/70">{s.label}</span>
            <span className="flex h-[34px] justify-start"><EmptyBar index={i} count={steps.length} /></span>
            <span />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {steps.map((s, i) => (
        <div key={s.label} className="contents">
          {/* A step with no leads gets a faded bar, and no "0 of 0 moved on" under it or 0 beside it */}
          {i > 0 && steps[i - 1].value > 0 && (
            <div className={row}>
              <span />
              <span className="pl-2 text-left text-[11px] tracking-wide text-foreground-tertiary/70">
                ↓ {s.value.toLocaleString("en-IN")} of {steps[i - 1].value.toLocaleString("en-IN")} moved on
              </span>
              <span />
            </div>
          )}
          <div className={row}>
            <span className="text-[12.5px] text-foreground-secondary">{s.label}</span>
            <span className="flex h-[34px] justify-start">
              {s.value > 0 ? (
                <i
                  className="block h-full rounded border border-accent/25"
                  style={{
                    width: `${Math.max(6, (s.value / top) * 100)}%`,
                    background: "linear-gradient(180deg, color-mix(in srgb, var(--accent) 30%, transparent), color-mix(in srgb, var(--accent) 10%, transparent))",
                  }}
                />
              ) : (
                <EmptyBar index={i} count={steps.length} />
              )}
            </span>
            <span className="text-right tabular-nums">
              {s.value > 0 && s.value.toLocaleString("en-IN")}
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
