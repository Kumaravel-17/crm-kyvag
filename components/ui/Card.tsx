import type { HTMLAttributes, ReactNode } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={`min-w-0 rounded-xl border border-border bg-surface shadow-sm transition-shadow duration-(--duration-normal) ease-(--ease-out) hover:shadow-md ${className}`}
      {...props}
    />
  );
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-2.5 px-4 pt-3.5 sm:px-5 sm:pt-4">
      <div>
        <h2 className="font-display text-[17px] leading-tight sm:text-[18px]">{title}</h2>
        {subtitle && <p className="mt-0.5 text-[11.5px] text-foreground-tertiary">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`px-4 pb-4 pt-3 sm:px-5 sm:pb-4 ${className}`} {...props} />;
}
