"use client";

import { useEffect, useState } from "react";
import { Bot, CalendarCheck, GitMerge, Mail, MessageCircle, Phone, Radar, Rocket, Send, StickyNote, Trash2 } from "lucide-react";
import { TIMELINE } from "@/lib/data";
import { Button, Card, CardBody, CardHeader } from "./ui";

type Kind = "note" | "call" | "whatsapp" | "email" | "meeting" | "trial" | "message" | "merge" | "auto" | "capture";
type Entry = { id: string; kind: Kind; text: string; at: string; by?: string };

const ICON: Record<Kind, React.ElementType> = {
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
};

/** Types a rep can log by hand */
const LOG_TYPES: { kind: Kind; label: string; placeholder: string }[] = [
  { kind: "note", label: "Note", placeholder: "Add a note about this lead…" },
  { kind: "call", label: "Call", placeholder: "What was discussed on the call?" },
  { kind: "whatsapp", label: "WhatsApp", placeholder: "Summarise the WhatsApp conversation…" },
  { kind: "email", label: "Email", placeholder: "What did you send or receive?" },
  { kind: "meeting", label: "Meeting", placeholder: "Demo or meeting notes…" },
];

const storageKey = (leadId: string) => `kyvag-activity-${leadId}`;

function nowLabel() {
  const d = new Date();
  return `Today, ${d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false })}`;
}

export function ActivityFeed({ leadId, author }: { leadId: string; author: string }) {
  const seed: Entry[] = TIMELINE.map((t, i) => ({ id: `seed-${i}`, kind: t.kind as Kind, text: t.text, at: t.at }));
  const [added, setAdded] = useState<Entry[]>([]);
  const [kind, setKind] = useState<Kind>("note");
  const [text, setText] = useState("");

  // Entries logged by hand live in this browser until the backend exists
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey(leadId));
      if (saved) setAdded(JSON.parse(saved));
    } catch {}
  }, [leadId]);
  const persist = (next: Entry[]) => {
    setAdded(next);
    try { localStorage.setItem(storageKey(leadId), JSON.stringify(next)); } catch {}
  };

  const add = () => {
    const body = text.trim();
    if (!body) return;
    persist([{ id: `${Date.now()}`, kind, text: body, at: nowLabel(), by: author }, ...added]);
    setText("");
  };
  const remove = (id: string) => persist(added.filter((e) => e.id !== id));

  const entries = [...added, ...seed];
  const current = LOG_TYPES.find((t) => t.kind === kind)!;

  return (
    <Card>
      <CardHeader title="Activity" subtitle={`Every touch across channels · ${entries.length} entries`} />
      <CardBody className="flex flex-col gap-5">
        <form
          onSubmit={(e) => { e.preventDefault(); add(); }}
          className="rounded-xl border border-input-border bg-surface-sunken/60 p-3 transition-colors focus-within:border-accent"
        >
          <div className="scrollbar-hide flex gap-1 overflow-x-auto" role="radiogroup" aria-label="Activity type">
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
                  className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12.5px] font-semibold transition-colors
                    ${on ? "bg-surface text-accent shadow-sm ring-1 ring-border" : "text-foreground-tertiary hover:text-foreground"}`}
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
          <div className="flex items-center justify-between gap-3 border-t border-divider pt-2.5">
            <span className="hidden text-[11.5px] text-foreground-tertiary sm:inline">Ctrl + Enter to add</span>
            <Button type="submit" size="sm" disabled={!text.trim()} className="ml-auto">Add activity</Button>
          </div>
        </form>

        <ol className="relative before:absolute before:bottom-3 before:left-[17px] before:top-3 before:w-px before:bg-border-strong">
          {entries.map((e) => {
            const Icon = ICON[e.kind] ?? StickyNote;
            const mine = !e.id.startsWith("seed-");
            return (
              <li key={e.id} className="group relative grid grid-cols-[36px_1fr_auto] gap-3.5 pb-5 last:pb-0">
                <span className="z-[1] flex size-9 items-center justify-center rounded-full border border-border bg-surface text-accent shadow-sm">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 pt-1.5">
                  <p className="whitespace-pre-wrap [overflow-wrap:anywhere]">{e.text}</p>
                  <p className="text-[11.5px] text-foreground-tertiary">
                    {e.at}
                    {e.by && <> · {LOG_TYPES.find((t) => t.kind === e.kind)?.label ?? "Note"} by {e.by}</>}
                  </p>
                </div>
                {mine && (
                  <button
                    type="button"
                    onClick={() => remove(e.id)}
                    aria-label="Delete activity"
                    className="mt-1 flex size-7 cursor-pointer items-center justify-center rounded-lg text-foreground-tertiary opacity-0 transition hover:bg-error/10 hover:text-error focus:opacity-100 group-hover:opacity-100"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      </CardBody>
    </Card>
  );
}
