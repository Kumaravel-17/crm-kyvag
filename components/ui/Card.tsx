import type { HTMLAttributes, ReactNode } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={`min-w-0 rounded-2xl border border-border bg-surface shadow-sm transition-shadow duration-(--duration-normal) ease-(--ease-out) hover:shadow-md ${className}`}
      {...props}
    />
  );
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 sm:px-6">
      <div>
        <h2 className="font-display text-[21px] leading-tight">{title}</h2>
        {subtitle && <p className="mt-0.5 text-[12px] text-foreground-tertiary">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`px-5 pb-5 pt-4 sm:px-6 sm:pb-6 ${className}`} {...props} />;
}
