import { LogoMark } from "../layout/Logo";

const SIZES = {
  sm: { logo: 24, bar: "w-12", text: "text-[12px]", box: "gap-2.5 py-6" },
  md: { logo: 40, bar: "w-20", text: "text-[12.5px]", box: "gap-3.5 py-16" },
  lg: { logo: 64, bar: "w-28", text: "text-[13px]", box: "min-h-screen gap-5 bg-background" },
};

/** The Kyvag K breathing over a sweeping bar, for anything that takes a moment. `lg` fills the screen. */
export function Loader({ label = "Loading…", size = "md" }: { label?: string; size?: keyof typeof SIZES }) {
  const s = SIZES[size];
  return (
    <div role="status" aria-live="polite" className={`flex flex-col items-center justify-center ${s.box}`}>
      <div className="relative flex items-center justify-center">
        <span aria-hidden className="absolute inset-[-40%] rounded-full bg-accent/20 blur-2xl animate-breathe" />
        <LogoMark height={s.logo} className="relative animate-breathe" />
      </div>
      <span aria-hidden className={`h-1 overflow-hidden rounded-full bg-accent/10 ${s.bar}`}>
        <span className="block h-full w-1/3 rounded-full bg-accent animate-sweep" />
      </span>
      <p className={`font-medium text-foreground-tertiary ${s.text}`}>{label}</p>
    </div>
  );
}
