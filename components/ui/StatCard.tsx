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
    <div className="group min-w-0 rounded-xl border border-border bg-surface p-3 shadow-sm transition-all hover:border-border-strong hover:shadow-md sm:p-4">
      <div className="mb-1.5 flex items-center gap-2 sm:mb-2 sm:gap-2.5">
        {Icon && (
          <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground sm:size-8">
            <Icon className="size-3 sm:size-4" strokeWidth={2} />
          </div>
        )}
        <p className="min-w-0 text-[10px] font-semibold uppercase leading-tight tracking-wider text-foreground-tertiary sm:text-[11px]">{label}</p>
      </div>
      <div className="flex items-end justify-between gap-2.5">
        <p className="font-display text-[22px] leading-none tabular-nums tracking-tight sm:text-[30px] [&_small]:ml-0.5 [&_small]:text-[12px] [&_small]:text-foreground-tertiary sm:[&_small]:text-[15px]">
          {value}
        </p>
        {/* Sparkline or badge: room only from small tablets up */}
        {aside && <div className="max-sm:hidden">{aside}</div>}
      </div>
      {(delta || note) && (
        <p className="mt-1.5 text-[10.5px] leading-snug text-foreground-tertiary sm:mt-2 sm:text-[11.5px]">
          {delta && <span className={`font-semibold tabular-nums ${deltaUp ? "text-success" : "text-error"}`}>{delta}</span>} {note}
        </p>
      )}
    </div>
  );
}
