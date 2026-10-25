"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ChevronRight, UserX } from "lucide-react";
import { ActivityFeed } from "@/components/ActivityFeed";
import { LoadError } from "@/components/LeadList";
import { Avatar, Button, Card, ChannelTag, Loader, NextStageButton, Page, StagePill, StageTrack } from "@/components/ui";
import { api, errorMessage, type LeadChanges } from "@/lib/api";
import { formatDate, formatTime } from "@/lib/data";
import { CHURNED, refreshPipeline, usePipeline } from "@/lib/stages";
import { useApi } from "@/lib/useApi";
import { LeadInfoCards } from "./LeadInfoCards";

export default function LeadPage() {
  const id = String(useParams<{ id: string }>().id);
  const { data, error, reload, setData } = useApi(() => api.lead(id), [id]);
  const pipeline = usePipeline();
  // Bumped after a change the timeline should show, like a stage move
  const [feedVersion, setFeedVersion] = useState(0);
  const [moving, setMoving] = useState(false);
  const [moveError, setMoveError] = useState<string | null>(null);

  if (error) {
    return (
      <Page>
        <Card><LoadError message={error} onRetry={reload} /></Card>
        <Link href="/leads" className="text-[13px] font-semibold text-accent hover:text-accent-hover">Back to leads</Link>
      </Page>
    );
  }
  if (!data) return <Page><Loader label="Loading lead…" /></Page>;

  const l = data.lead;

  /** Saves changes to the lead; stage moves also refresh the counts and the timeline */
  const save = async (changes: LeadChanges) => {
    const { lead } = await api.updateLead(l.id, changes);
    setData({ lead });
    if (changes.stage) {
      refreshPipeline();
      setFeedVersion((v) => v + 1);
    }
  };

  const move = async (stage: string) => {
    setMoving(true);
    setMoveError(null);
    try {
      await save({ stage });
    } catch (e) {
      setMoveError(errorMessage(e));
    } finally {
      setMoving(false);
    }
  };

  const churned = l.stage === CHURNED.id;

  return (
    <Page>
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[13px]">
        <Link href="/leads" className="text-foreground-tertiary transition-colors hover:text-foreground">Leads</Link>
        <ChevronRight className="size-3.5 text-foreground-tertiary/60" />
        <span className="font-semibold" aria-current="page">{l.company}</span>
      </nav>

      {/* Identity and pipeline position in one card */}
      <Card className="overflow-hidden">
        <header className="flex flex-wrap items-center justify-between gap-5 px-4 pt-5 sm:px-6 sm:pt-6">
          <div className="flex min-w-0 items-center gap-4">
            <Avatar name={l.name} size="lg" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] text-foreground-tertiary">
                {l.category && <span className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-secondary">{l.category}</span>}
                <ChannelTag channel={l.source} />
                <StagePill stage={l.stage} />
              </div>
              <h1 className="mt-1 font-display text-[clamp(24px,2.6vw,34px)] leading-[1.1] tracking-tight">{l.company}</h1>
              {l.city && <p className="mt-1.5 text-[13px] text-foreground-tertiary">{l.city}</p>}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {churned ? (
              <Button variant="secondary" onClick={() => move(pipeline[0].id)} disabled={moving}>{moving ? "Moving…" : `Reopen as ${pipeline[0].label}`}</Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => move(CHURNED.id)} disabled={moving}><UserX />Mark churned</Button>
                <NextStageButton stage={l.stage} onMove={move} busy={moving} />
              </>
            )}
          </div>
        </header>

        <div className="px-4 py-5 sm:px-6">
          {moveError && <p role="alert" className="mb-3 rounded-lg bg-error/10 px-3 py-2 text-[12.5px] font-medium text-error">{moveError}</p>}
          <StageTrack stage={l.stage} />
        </div>
      </Card>

      <div className="grid grid-cols-12 gap-4 lg:gap-5">
        <div className="col-span-12 flex flex-col gap-4 lg:col-span-8 lg:gap-5">
          <ActivityFeed
            leadId={l.id}
            createdLabel={`Created ${formatDate(l.createdAt)}, ${formatTime(l.createdAt)}`}
            version={feedVersion}
            onLogged={(lastActivity) => setData({ lead: { ...l, lastActivity } })}
          />
        </div>

        <aside className="col-span-12 flex flex-col gap-4 lg:col-span-4 lg:gap-5">
          <LeadInfoCards lead={l} onSave={save} />
        </aside>
      </div>
    </Page>
  );
}
