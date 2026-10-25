import { Logo, LogoMark } from "@/components/layout/Logo";

/** Brand panel beside a form card; shared by sign-in, forgot-password and reset-password */
export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-dvh bg-background lg:grid-cols-[1.1fr_1fr]">
      {/* Brand panel — desktop only */}
      <section
        className="relative hidden overflow-hidden p-10 text-white lg:flex lg:flex-col xl:p-14"
        style={{ background: "linear-gradient(155deg, #8b00f0 0%, #5a0ab4 42%, #1c0636 100%)" }}
      >
        {/* The K, huge and white, bleeding off the corner */}
        <LogoMark height={900} className="pointer-events-none absolute -bottom-32 -right-40 h-[112%] w-auto opacity-[0.08] brightness-0 invert" />
        <div className="pointer-events-none absolute -left-40 top-1/4 size-[480px] rounded-full bg-white/10 blur-[140px]" aria-hidden />

        <div className="relative">
          <Logo light tag="CRM" />
        </div>

        {/* Vertically centered in the panel */}
        <div className="relative my-auto max-w-[640px] py-12">
          {/* Grows with the screen: ~47px on a small laptop, ~66px at 1440 wide, 76px at most */}
          <h2 className="text-[clamp(44px,4.6vw,76px)] font-bold leading-[1.02] tracking-[-0.03em]">
            Turn every message into a <span className="text-[#f0d4ff]">paying store</span>.
          </h2>
          <p className="mt-5 max-w-[460px] text-[15px] leading-relaxed text-white/75">
            Capture leads from Instagram, WhatsApp, Google Ads and your website — all in one inbox. Reply faster, track your pipeline and close more sales.
          </p>
        </div>
        {/* Balances the logo row above, so the text sits at the true middle */}
        <div aria-hidden className="h-[30px]" />
      </section>

      {/* Form side: a card on a soft dotted background */}
      <section
        className="flex flex-col items-center justify-center px-4 py-10 sm:px-8"
        style={{
          backgroundImage: "radial-gradient(color-mix(in srgb, var(--accent) 14%, transparent) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      >
        <div className="w-full max-w-[420px] animate-rise">
          <div className="mb-6 flex justify-center lg:hidden"><Logo tag="CRM" /></div>
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-xl shadow-accent/[0.06] sm:p-8">
            <LogoMark height={36} className="mb-5 hidden lg:block" />
            {children}
          </div>
          <p className="mt-6 text-center text-[12px] text-foreground-tertiary">© {new Date().getFullYear()} Kyvag · Secure sign-in</p>
        </div>
      </section>
    </main>
  );
}

export function AuthHeading({ title, subtitle }: { title: string; subtitle: React.ReactNode }) {
  return (
    <>
      <h1 className="font-display text-[26px] leading-tight tracking-tight sm:text-[28px]">{title}</h1>
      <p className="mt-1.5 text-[13.5px] text-foreground-tertiary sm:text-[14px]">{subtitle}</p>
    </>
  );
}
