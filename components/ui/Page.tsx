import type { ReactNode } from "react";

/** Full-width page body; content fills the space beside the sidebar */
export function Page({ children }: { children: ReactNode }) {
  return <main className="reveal flex w-full flex-col gap-6 px-3 pb-16 pt-6 sm:px-5 lg:gap-7 lg:px-7 lg:pt-8">{children}</main>;
}

export function PageTitle({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-5">
      <div className="min-w-0">
        <p className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground-tertiary">
          <span className="size-1.5 rounded-full bg-accent" />
          {eyebrow}
        </p>
        <h1 className="mt-2 font-display text-[24px] leading-[1.1] tracking-tight sm:text-[clamp(28px,3.2vw,44px)] sm:leading-[1.06] [&_em]:not-italic [&_em]:text-accent">
          {title}
        </h1>
        {subtitle && <p className="mt-4 max-w-[64ch] text-[12.5px] text-foreground-tertiary sm:text-[14px]">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}
