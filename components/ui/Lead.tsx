import { BadgeIndianRupee, CalendarCheck, Check, Flame, MessageSquare, Rocket, Sparkles, UserX } from "lucide-react";
import { CHANNEL_LABEL, STAGES, type Channel, type Stage } from "@/lib/data";
import { ChannelGlyph } from "../icons";

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("");
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
    <span title={CHANNEL_LABEL[channel]} className={`flex size-6 shrink-0 items-center justify-center rounded-md bg-bronze/12 text-bronze ${className}`}>
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
        <i className="block h-full rounded-full bg-gradient-to-r from-bronze to-accent" style={{ width: `${value}%` }} />
      </span>
    </span>
  );
}

type Tone = "neutral" | "accent" | "bronze" | "success" | "warning" | "error" | "info";
const TONES: Record<Tone, string> = {
  neutral: "bg-surface-sunken text-foreground-secondary ring-border",
  accent: "bg-accent/10 text-accent ring-accent/15",
  bronze: "bg-bronze/12 text-bronze ring-bronze/20",
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

const STAGE_TONE: Record<Stage, Tone> = {
  new: "info",
  contacted: "accent",
  demo: "bronze",
  trial: "warning",
  paid: "success",
  churned: "error",
};

export function StagePill({ stage }: { stage: Stage }) {
  return <Badge tone={STAGE_TONE[stage]} dot>{STAGES.find((s) => s.id === stage)!.label}</Badge>;
}

export function Hot() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-accent-hover to-accent py-0.5 pl-1.5 pr-2 text-[10px] font-bold uppercase tracking-[0.14em] text-accent-foreground shadow-sm">
      <Flame className="size-3 fill-current" strokeWidth={0} />
      Hot
    </span>
  );
}

/* Each stage owns a color; classes are spelled out so Tailwind can see them */
const STAGE_STYLE: Record<Stage, { bg: string; text: string; ring: string; from: string; to: string; icon: React.ElementType }> = {
  new: { bg: "bg-info", text: "text-info", ring: "ring-info/20", from: "from-info", to: "to-info", icon: Sparkles },
  contacted: { bg: "bg-accent", text: "text-accent", ring: "ring-accent/20", from: "from-accent", to: "to-accent", icon: MessageSquare },
  demo: { bg: "bg-bronze", text: "text-bronze", ring: "ring-bronze/25", from: "from-bronze", to: "to-bronze", icon: CalendarCheck },
  trial: { bg: "bg-warning", text: "text-warning", ring: "ring-warning/20", from: "from-warning", to: "to-warning", icon: Rocket },
  paid: { bg: "bg-success", text: "text-success", ring: "ring-success/20", from: "from-success", to: "to-success", icon: BadgeIndianRupee },
  churned: { bg: "bg-error", text: "text-error", ring: "ring-error/20", from: "from-error", to: "to-error", icon: UserX },
};

/** Horizontal stepper: done stages filled in their own color, current one ringed, upcoming ones muted */
export function StageTrack({ stage }: { stage: Stage }) {
  const track = STAGES.filter((s) => s.id !== "churned");
  const current = track.findIndex((s) => s.id === stage);
  const churned = stage === "churned";

  return (
    <div className="flex flex-col gap-4">
      {churned && (
        <div className="flex items-center gap-2 text-[12.5px] font-semibold text-error">
          <UserX className="size-4" />This lead churned. The track shows where they dropped off.
        </div>
      )}
      <ol className="grid grid-cols-5">
        {track.map((s, i) => {
          const st = STAGE_STYLE[s.id];
          const next = track[i + 1] && STAGE_STYLE[track[i + 1].id];
          const done = !churned && i < current;
          const isNow = !churned && i === current;
          const reached = done || isNow;
          const Icon = done ? Check : st.icon;
          return (
            <li key={s.id} className="relative flex flex-col items-center gap-2 text-center">
              {/* connector to the next step, drawn behind the circles */}
              {next && (
                <span
                  className={`absolute left-1/2 top-[17px] h-[3px] w-full rounded-full ${
                    done ? `bg-gradient-to-r ${st.from} ${next.to}` : "bg-border-strong/60"
                  }`}
                  aria-hidden
                />
              )}
              <span
                className={`relative z-[1] flex size-9 items-center justify-center rounded-full transition-all
                  ${reached ? `${st.bg} text-surface shadow-sm` : "border-2 border-border-strong bg-surface text-foreground-tertiary"}
                  ${isNow ? `ring-[6px] ${st.ring}` : ""}`}
              >
                <Icon className="size-4" strokeWidth={done ? 3 : 2} />
              </span>
              <span className="flex flex-col leading-tight">
                <span className={`text-[12.5px] font-semibold ${reached ? st.text : "text-foreground-tertiary"}`}>{s.label}</span>
                <span className="text-[11px] text-foreground-tertiary">{done ? "Completed" : isNow ? "Current stage" : "Upcoming"}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export const isHot =(l: { score: number; stage: Stage }) => l.score >= 75 && l.stage !== "paid" && l.stage !== "churned";
