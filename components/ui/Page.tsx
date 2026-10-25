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
  // A light accent-tinted banner: small label, title, one-line summary, actions on the right
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 rounded-xl border border-accent/15 bg-accent/[0.06] px-4 py-4 sm:px-6 sm:py-5">
      <div className="min-w-0">
        <p className="text-[12px] font-medium text-foreground-tertiary">{eyebrow}</p>
        <h1 className="mt-1 font-display text-[26px] font-semibold leading-tight tracking-tight sm:text-[32px] [&_em]:not-italic [&_em]:text-accent">
          {title}
        </h1>
        {subtitle && <p className="mt-1.5 max-w-[96ch] text-[13px] text-foreground-secondary sm:text-[13.5px]">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}
