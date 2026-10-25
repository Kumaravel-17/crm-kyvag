"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button, Card, CardBody, CardHeader, EditButton, STAGE_COLOR_STYLE, SaveBar } from "@/components/ui";
import { errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { PAID_STAGE, STAGE_COLORS, savePipeline, usePipeline, useStageCounts, type PipelineStage } from "@/lib/stages";

export default function StagesCard({ onSaved }: { onSaved: () => void }) {
  const saved = usePipeline();
  const counts = useStageCounts();
  const leadCount = (id: string) => counts[id] ?? 0;
  // Changing the pipeline affects everyone, so it's for admins and managers
  const canEdit = useAuth().user.role !== "rep";
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<PipelineStage[]>(saved);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  // Pick up the saved list once it loads from this browser
  useEffect(() => setDraft(saved), [saved]);

  const cancel = () => { setDraft(saved); setError(null); setEditing(false); };

  const update = (i: number, patch: Partial<PipelineStage>) =>
    setDraft((d) => d.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const move = (i: number, by: -1 | 1) =>
    setDraft((d) => {
      const next = [...d];
      [next[i], next[i + by]] = [next[i + by], next[i]];
      return next;
    });
  const remove = (i: number) => setDraft((d) => d.filter((_, j) => j !== i));
  // Colors are assigned, not picked: a new stage takes the first one not in use yet
  const add = () =>
    setDraft((d) => {
      const color = STAGE_COLORS.find((c) => c !== "error" && !d.some((s) => s.color === c)) ?? STAGE_COLORS[d.length % STAGE_COLORS.length];
      return [...d, { id: `stage-${Date.now().toString(36)}`, label: "", color }];
    });

  const save = async () => {
    const stages = draft.map((s) => ({ ...s, label: s.label.trim() }));
    const names = stages.map((s) => s.label.toLowerCase());
    if (names.some((n) => n === "")) return setError("Give every stage a name.");
    if (new Set(names).size !== names.length) return setError("Two stages have the same name.");
    if (names.includes("churned")) return setError("“Churned” is reserved for leads that drop out.");
    setError(null);
    setSaving(true);
    try {
      await savePipeline(stages);
      setEditing(false);
      onSaved();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card id="stages" className="flex flex-col">
      <CardHeader
        title="Lead stages"
        subtitle="The steps every lead moves through, in order"
        action={editing ? <Button variant="secondary" size="sm" onClick={add}><Plus />Add stage</Button> : canEdit && <EditButton onClick={() => setEditing(true)} />}
      />
      <CardBody className="flex flex-1 flex-col gap-2.5">
        <ol className="flex flex-col divide-y divide-divider rounded-lg border border-border">
          {draft.map((s, i) => {
            const count = leadCount(s.id);
            return (
              <li key={s.id} className="flex flex-wrap items-center gap-2.5 px-3 py-2.5">
                <span className="w-4 text-center text-[12px] font-semibold tabular-nums text-foreground-tertiary">{i + 1}</span>
                <span className={`size-3 shrink-0 rounded-full ${STAGE_COLOR_STYLE[s.color].bg}`} aria-hidden />
                {editing ? (
                  <input
                    id={`stage-${i}`}
                    aria-label={`Stage ${i + 1} name`}
                    autoFocus={s.label === ""}
                    className="min-w-[140px] max-w-md flex-1 rounded-lg border border-input-border bg-input-bg px-3 py-1.5 text-[13px] text-foreground outline-none transition-colors focus:border-accent"
                    placeholder="Stage name"
                    value={s.label}
                    onChange={(e) => update(i, { label: e.target.value })}
                  />
                ) : (
                  <span className={`min-w-0 flex-1 truncate py-1.5 text-[13px] font-semibold ${s.label ? "" : "italic text-foreground-tertiary"}`}>{s.label || "Unnamed stage"}</span>
                )}
                <span className="ml-auto w-16 text-right text-[11.5px] tabular-nums text-foreground-tertiary">{count} {count === 1 ? "lead" : "leads"}</span>
                {editing && (
                  <div className="flex items-center">
                    <IconButton label="Move up" disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp /></IconButton>
                    <IconButton label="Move down" disabled={i === draft.length - 1} onClick={() => move(i, 1)}><ArrowDown /></IconButton>
                    <IconButton
                      label={s.id === PAID_STAGE ? "Can't delete: customers are the leads in this stage" : count > 0 ? `Can't delete: ${count} ${count === 1 ? "lead is" : "leads are"} in this stage` : "Delete stage"}
                      disabled={s.id === PAID_STAGE || count > 0 || draft.length <= 2}
                      onClick={() => remove(i)}
                      danger
                    >
                      <Trash2 />
                    </IconButton>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
        {error && <p role="alert" className="text-[12px] font-semibold text-error">{error}</p>}
      </CardBody>
      {editing && <SaveBar onCancel={cancel} onSave={save} saving={saving} />}
    </Card>
  );
}

function IconButton({ label, disabled, danger, onClick, children }: { label: string; disabled?: boolean; danger?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`flex size-7 cursor-pointer items-center justify-center rounded-md text-foreground-tertiary transition-colors disabled:cursor-not-allowed disabled:opacity-30 [&>svg]:size-3.5
        ${danger ? "enabled:hover:bg-error/10 enabled:hover:text-error" : "enabled:hover:bg-surface-sunken enabled:hover:text-foreground"}`}
    >
      {children}
    </button>
  );
}
