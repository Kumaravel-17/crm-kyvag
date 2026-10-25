"use client";

import { ArrowRight, BadgeIndianRupee, CalendarCheck, Check, CircleDot, MessageSquare, Rocket, Sparkles, UserX } from "lucide-react";
import { CHURNED, findStage, usePipeline, type StageColor } from "@/lib/stages";
import { Button } from "./Button";
import { Badge } from "./Lead";

/* Each color's classes are spelled out so Tailwind can see them */
export const STAGE_COLOR_STYLE: Record<StageColor, { bg: string; soft: string; text: string; ring: string }> = {
  info: { bg: "bg-info", soft: "bg-info/12", text: "text-info", ring: "ring-info/20" },
  accent: { bg: "bg-accent", soft: "bg-accent/12", text: "text-accent", ring: "ring-accent/20" },
  aqua: { bg: "bg-aqua", soft: "bg-aqua/12", text: "text-aqua", ring: "ring-aqua/20" },
  warning: { bg: "bg-warning", soft: "bg-warning/12", text: "text-warning", ring: "ring-warning/20" },
  success: { bg: "bg-success", soft: "bg-success/12", text: "text-success", ring: "ring-success/20" },
  secondary: { bg: "bg-secondary", soft: "bg-secondary/12", text: "text-secondary", ring: "ring-secondary/20" },
  error: { bg: "bg-error", soft: "bg-error/12", text: "text-error", ring: "ring-error/20" },
};

// Chevron shapes: an arrow point on the right, a matching notch on the left (none on the ends)
const ARROW = 14;
const chevron = (first: boolean, last: boolean) =>
  `polygon(0 0, ${last ? "100%" : `calc(100% - ${ARROW}px)`} 0, 100% 50%, ${last ? "100%" : `calc(100% - ${ARROW}px)`} 100%, 0 100%, ${first ? "0" : `${ARROW}px`} 50%)`;

// Built-in stages keep their icons; stages added in Settings get a plain one
const STAGE_ICON: Record<string, React.ElementType> = {
  new: Sparkles,
  contacted: MessageSquare,
  demo: CalendarCheck,
  trial: Rocket,
  paid: BadgeIndianRupee,
};

export function StagePill({ stage }: { stage: string }) {
  const s = findStage(usePipeline(), stage);
  return <Badge tone={s.color} dot>{s.label}</Badge>;
}

/** Chevron path: completed stages tinted in their own color, the current one solid, upcoming ones muted */
export function StageTrack({ stage }: { stage: string }) {
  const track = usePipeline();
  const current = track.findIndex((s) => s.id === stage);
  const churned = stage === CHURNED.id;

  return (
    <div className="flex flex-col gap-3">
      {churned && (
        <div className="flex items-center gap-2 text-[12.5px] font-semibold text-error">
          <UserX className="size-4" />This lead churned. The track shows where they dropped off.
        </div>
      )}
      <ol className="flex">
        {track.map((s, i) => {
          const st = STAGE_COLOR_STYLE[s.color];
          const done = !churned && i < current;
          const isNow = !churned && i === current;
          const first = i === 0;
          const last = i === track.length - 1;
          const Icon = done ? Check : STAGE_ICON[s.id] ?? CircleDot;
          return (
            <li
              key={s.id}
              aria-current={isNow ? "step" : undefined}
              title={`${s.label} · ${done ? "Completed" : isNow ? "Current stage" : "Upcoming"}`}
              style={{ clipPath: chevron(first, last), paddingLeft: first ? 16 : ARROW + 10, paddingRight: last ? 16 : ARROW + 4 }}
              className={`flex h-12 min-w-0 flex-1 items-center gap-2 ${first ? "rounded-l-lg" : "-ml-2"} ${last ? "rounded-r-lg" : ""}
                ${isNow ? `${st.bg} text-white` : done ? `${st.soft} ${st.text}` : "bg-surface-sunken text-foreground-tertiary"}`}
            >
              <Icon className="size-4 shrink-0" strokeWidth={done ? 3 : 2} />
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="truncate text-[12.5px] font-semibold">{s.label}</span>
                <span className={`hidden truncate text-[10.5px] sm:block ${isNow ? "text-white/80" : "opacity-75"}`}>
                  {done ? "Completed" : isNow ? "Current stage" : "Upcoming"}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Moves the lead one step along the pipeline; hidden on the last stage and for churned leads */
export function NextStageButton({ stage, onMove, busy }: { stage: string; onMove: (stageId: string) => void; busy?: boolean }) {
  const track = usePipeline();
  const i = track.findIndex((s) => s.id === stage);
  const next = i >= 0 ? track[i + 1] : undefined;
  if (!next) return null;
  return <Button onClick={() => onMove(next.id)} disabled={busy}>{busy ? "Moving…" : <>Move to {next.label}<ArrowRight /></>}</Button>;
}
