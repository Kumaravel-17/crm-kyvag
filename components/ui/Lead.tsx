import { CHANNEL_LABEL, type Channel } from "@/lib/data";
import { ChannelGlyph } from "../icons";

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const initials = name.split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const sizes = {
    sm: "size-6 text-[9.5px]",
    md: "size-9 text-[11.5px]",
    lg: "size-16 font-display text-[22px] font-normal",
  };
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-accent/10 font-bold text-accent ring-1 ring-accent/15 ${sizes[size]}`}>
      {initials}
    </span>
  );
}

export function ChannelIcon({ channel, className = "" }: { channel: Channel; className?: string }) {
  return (
    <span title={CHANNEL_LABEL[channel]} className={`flex size-6 shrink-0 items-center justify-center rounded-md bg-secondary/12 text-secondary ${className}`}>
      <ChannelGlyph channel={channel} className="size-3.5" />
    </span>
  );
}

export function ChannelTag({ channel }: { channel: Channel }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-[12.5px] text-foreground-secondary">
      <ChannelIcon channel={channel} />
      {CHANNEL_LABEL[channel]}
    </span>
  );
}

export function Score({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <b className="min-w-[22px] font-bold tabular-nums">{value}</b>
      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-sunken ring-1 ring-divider">
        <i className="block h-full rounded-full bg-accent" style={{ width: `${value}%` }} />
      </span>
    </span>
  );
}

type Tone = "neutral" | "accent" | "secondary" | "aqua" | "success" | "warning" | "error" | "info";
const TONES: Record<Tone, string> = {
  neutral: "bg-surface-sunken text-foreground-secondary ring-border",
  accent: "bg-accent/10 text-accent ring-accent/15",
  secondary: "bg-secondary/12 text-secondary ring-secondary/20",
  aqua: "bg-aqua/10 text-aqua ring-aqua/20",
  success: "bg-success/10 text-success ring-success/20",
  warning: "bg-warning/10 text-warning ring-warning/20",
  error: "bg-error/10 text-error ring-error/20",
  info: "bg-info/10 text-info ring-info/20",
};

export function Badge({ tone = "neutral", dot, children }: { tone?: Tone; dot?: boolean; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ring-1 ring-inset ${TONES[tone]}`}>
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
