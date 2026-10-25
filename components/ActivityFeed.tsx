"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Bot, CalendarCheck, GitMerge, Mail, MessageCircle, Phone, Radar, Rocket, Send, StickyNote, Trash2 } from "lucide-react";
import { api, errorMessage, type Activity, type ActivityKind } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useApi } from "@/lib/useApi";
import { Button, Card, CardBody, CardHeader, Loader } from "./ui";

const ICON: Record<ActivityKind, React.ElementType> = {
  note: StickyNote,
  call: Phone,
  whatsapp: MessageCircle,
  email: Mail,
  meeting: CalendarCheck,
  trial: Rocket,
  message: Send,
  merge: GitMerge,
  auto: Bot,
  capture: Radar,
  stage: ArrowRight,
};

/* Icon chip color per kind; classes spelled out so Tailwind can see them */
const TONE: Record<ActivityKind, string> = {
  note: "bg-accent/10 text-accent",
  call: "bg-info/10 text-info",
  whatsapp: "bg-success/10 text-success",
  email: "bg-warning/10 text-warning",
  meeting: "bg-aqua/10 text-aqua",
  trial: "bg-accent/10 text-accent",
  message: "bg-success/10 text-success",
  merge: "bg-secondary/12 text-secondary",
  auto: "bg-surface-sunken text-foreground-tertiary",
  capture: "bg-info/10 text-info",
  stage: "bg-secondary/12 text-secondary",
};

/** Types a rep can log by hand */
const LOG_TYPES: { kind: ActivityKind; label: string; placeholder: string }[] = [
  { kind: "note", label: "Note", placeholder: "Add a note about this lead…" },
  { kind: "call", label: "Call", placeholder: "What was discussed on the call?" },
  { kind: "whatsapp", label: "WhatsApp", placeholder: "Summarise the WhatsApp conversation…" },
  { kind: "email", label: "Email", placeholder: "What did you send or receive?" },
  { kind: "meeting", label: "Meeting", placeholder: "Demo or meeting notes…" },
];
const LOGGABLE = new Set(LOG_TYPES.map((t) => t.kind));

/** "Today", "Yesterday", "Monday" within the week, otherwise "12 Oct 2026" */
function dayLabel(ts: number) {
  const startOfToday = new Date().setHours(0, 0, 0, 0);
  const days = Math.floor((startOfToday - new Date(ts).setHours(0, 0, 0, 0)) / 864e5);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return new Date(ts).toLocaleDateString("en-IN", { weekday: "long" });
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const timeLabel = (ts: number) => new Date(ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });

/**
 * The lead's timeline with a box to log notes, calls and messages.
 * `version` reloads it after changes made elsewhere on the page (a stage move adds an entry).
 */
export function ActivityFeed({ leadId, createdLabel, version = 0, onLogged }: { leadId: string; createdLabel?: string; version?: number; onLogged?: (text: string) => void }) {
  const { user } = useAuth();
  const { data, error: loadError, reload, setData } = useApi(() => api.activities(leadId), [leadId, version]);
  const [kind, setKind] = useState<ActivityKind>("note");
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setError(null), [leadId]);

  const entries = data?.activities ?? [];
  const put = (activities: Activity[]) => setData({ activities });

  const add = async () => {
    const body = text.trim();
    if (!body || saving) return;
    setSaving(true);
    setError(null);
    try {
      const { activity } = await api.logActivity(leadId, { kind, text: body });
      put([activity, ...entries]);
      setText("");
      onLogged?.(body);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (a: Activity) => {
    put(entries.filter((e) => e.id !== a.id));
    try {
      await api.deleteActivity(leadId, a.id);
    } catch (e) {
      setError(errorMessage(e));
      reload();
    }
  };

  const current = LOG_TYPES.find((t) => t.kind === kind)!;
  const days: { day: string; items: Activity[] }[] = [];
  for (const e of entries) {
    const day = dayLabel(e.createdAt);
    const last = days[days.length - 1];
    if (last?.day === day) last.items.push(e);
    else days.push({ day, items: [e] });
  }

  return (
    <Card>
      <CardHeader
        title="Activity"
        subtitle={[createdLabel ?? "Every touch across channels", data && `${entries.length} ${entries.length === 1 ? "entry" : "entries"}`].filter(Boolean).join(" · ")}
      />
      <CardBody className="flex flex-col gap-5">
        <form
          onSubmit={(e) => { e.preventDefault(); add(); }}
          className="rounded-xl border border-input-border bg-input-bg p-2.5 transition-shadow focus-within:border-accent"
        >
          <div className="scrollbar-hide flex gap-1 overflow-x-auto rounded-lg bg-surface-sunken p-1" role="radiogroup" aria-label="Activity type">
            {LOG_TYPES.map((t) => {
              const Icon = ICON[t.kind];
              const on = kind === t.kind;
              return (
                <button
                  key={t.kind}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setKind(t.kind)}
                  className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-[12.5px] font-semibold transition-colors
                    ${on ? "bg-surface text-accent shadow-sm" : "text-foreground-tertiary hover:text-foreground"}`}
                >
                  <Icon className="size-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>
          <textarea
            id="activity-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); add(); } }}
            placeholder={current.placeholder}
            rows={2}
            className="mt-2 w-full resize-none rounded-lg bg-transparent px-2 py-1.5 text-[13.5px] text-foreground outline-none placeholder:text-foreground-tertiary"
          />
          <div className="flex items-center justify-between gap-3 px-1">
            <span className="hidden text-[11.5px] text-foreground-tertiary sm:inline">
              <kbd className="rounded border border-border bg-surface-sunken px-1 font-sans text-[10.5px]">Ctrl</kbd> +{" "}
              <kbd className="rounded border border-border bg-surface-sunken px-1 font-sans text-[10.5px]">Enter</kbd> to add
            </span>
            <Button type="submit" size="sm" disabled={!text.trim() || saving} className="ml-auto">
              {saving ? "Saving…" : `Log ${current.label.toLowerCase()}`}
            </Button>
          </div>
        </form>

        {(error || loadError) && (
          <p role="alert" className="flex flex-wrap items-center gap-2 rounded-lg bg-error/10 px-3 py-2 text-[12.5px] font-medium text-error">
            {error ?? loadError}
            {loadError && <button type="button" onClick={reload} className="cursor-pointer font-semibold underline">Try again</button>}
          </p>
        )}
        {!data && !loadError && <Loader size="sm" label="Loading activity…" />}

        <div className="flex flex-col gap-5">
          {days.map(({ day, items }) => (
            <section key={day} aria-label={day}>
              <h3 className="mb-2 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.12em] text-foreground-tertiary">
                {day}<span className="h-px flex-1 bg-divider" />
              </h3>
              <ol className="flex flex-col">
                {items.map((e) => {
                  const Icon = ICON[e.kind] ?? StickyNote;
                  const deletable = LOGGABLE.has(e.kind) && !!e.authorId && (e.authorId === user.id || user.role === "admin");
                  return (
                    <li key={e.id} className="group grid grid-cols-[32px_1fr_auto] items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface-sunken/70">
                      <span className={`flex size-8 items-center justify-center rounded-lg ${TONE[e.kind] ?? TONE.note}`}>
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0 pt-0.5">
                        <p className="whitespace-pre-wrap leading-snug [overflow-wrap:anywhere]">{e.text}</p>
                        {e.authorName && (
                          <p className="mt-0.5 text-[11.5px] text-foreground-tertiary">
                            {LOG_TYPES.find((t) => t.kind === e.kind)?.label ?? (e.kind === "stage" ? "Stage change" : "Logged")} by {e.authorName}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 pt-0.5">
                        {deletable && (
                          <button
                            type="button"
                            onClick={() => remove(e)}
                            aria-label="Delete activity"
                            className="flex size-6 cursor-pointer items-center justify-center rounded-md text-foreground-tertiary opacity-0 transition hover:bg-error/10 hover:text-error focus:opacity-100 group-hover:opacity-100"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        )}
                        <time dateTime={new Date(e.createdAt).toISOString()} className="text-[11.5px] tabular-nums text-foreground-tertiary">{timeLabel(e.createdAt)}</time>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
