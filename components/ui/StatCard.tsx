import type { ElementType, ReactNode } from "react";

export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  deltaUp,
  note,
  aside,
}: {
  label: string;
  value: ReactNode;
  icon?: ElementType;
  delta?: string;
  deltaUp?: boolean;
  note?: string;
  aside?: ReactNode;
}) {
  return (
    <div className="group min-w-0 rounded-2xl border border-border bg-surface p-3.5 shadow-sm transition-all hover:border-border-strong hover:shadow-md sm:p-5">
      <div className="mb-2 flex items-center gap-2 sm:mb-3 sm:gap-3">
        {Icon && (
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground sm:size-9">
            <Icon className="size-3.5 sm:size-[18px]" strokeWidth={2} />
          </div>
        )}
        <p className="min-w-0 text-[10px] font-semibold uppercase leading-tight tracking-wider text-foreground-tertiary sm:text-[11.5px]">{label}</p>
      </div>
      <div className="flex items-end justify-between gap-3">
        <p className="font-display text-[26px] leading-none tabular-nums tracking-tight sm:text-[36px] [&_small]:ml-0.5 [&_small]:text-[13px] [&_small]:text-foreground-tertiary sm:[&_small]:text-[18px]">
          {value}
        </p>
        {/* Sparkline or badge: room only from small tablets up */}
        {aside && <div className="max-sm:hidden">{aside}</div>}
      </div>
      {(delta || note) && (
        <p className="mt-2 text-[11px] leading-snug text-foreground-tertiary sm:mt-3 sm:text-[12px]">
          {delta && <span className={`font-semibold tabular-nums ${deltaUp ? "text-success" : "text-error"}`}>{delta}</span>} {note}
        </p>
      )}
    </div>
  );
}
