"use client";

import { useSyncExternalStore } from "react";
import { api } from "./api";

/** Colors a stage can take; each maps to a theme token */
export type StageColor = "info" | "accent" | "aqua" | "warning" | "success" | "secondary" | "error";
export const STAGE_COLORS: StageColor[] = ["info", "accent", "aqua", "warning", "success", "secondary", "error"];

export type PipelineStage = { id: string; label: string; color: StageColor };

/** Churned sits outside the pipeline: it is an outcome, not a step */
export const CHURNED = { id: "churned", label: "Churned", color: "error" } as const satisfies PipelineStage;

/** Customers are the leads in this stage; it can be renamed but not removed */
export const PAID_STAGE = "paid";

/** Shown until the pipeline loads from the server */
export const DEFAULT_PIPELINE: PipelineStage[] = [
  { id: "new", label: "New", color: "info" },
  { id: "contacted", label: "Contacted", color: "accent" },
  { id: "demo", label: "Demo Booked", color: "aqua" },
  { id: "trial", label: "Trial", color: "warning" },
  { id: "paid", label: "Paid", color: "success" },
];

// One copy of the pipeline for the whole app, loaded on first use and refreshed after changes
type Snapshot = { stages: PipelineStage[]; counts: Record<string, number> };
const EMPTY: Snapshot = { stages: DEFAULT_PIPELINE, counts: {} };
let snapshot: Snapshot = EMPTY;
let requested = false;
const listeners = new Set<() => void>();

function set(next: { stages: (PipelineStage & { count: number })[]; churned: { count: number } }) {
  snapshot = {
    stages: next.stages.map(({ id, label, color }) => ({ id, label, color })),
    counts: { ...Object.fromEntries(next.stages.map((s) => [s.id, s.count])), [CHURNED.id]: next.churned.count },
  };
  listeners.forEach((l) => l());
}

/** Fetches the stages and lead counts again, e.g. after a lead is added or moves stage */
export function refreshPipeline() {
  requested = true;
  return api.pipeline().then(set, () => { requested = false; });
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  if (!requested) refreshPipeline();
  return () => { listeners.delete(onChange); };
}

/** The pipeline stages in order (churned not included) */
export function usePipeline(): PipelineStage[] {
  return useSyncExternalStore(subscribe, () => snapshot.stages, () => EMPTY.stages);
}

/** Lead count per stage id, churned included; empty until loaded */
export function useStageCounts(): Record<string, number> {
  return useSyncExternalStore(subscribe, () => snapshot.counts, () => EMPTY.counts);
}

/** Saves a new ordered list of stages; throws the server's reason if it's refused */
export async function savePipeline(stages: PipelineStage[]) {
  set(await api.savePipeline(stages));
}

/** Any stage id, including churned, to its display label and color */
export function findStage(pipeline: PipelineStage[], id: string): PipelineStage {
  if (id === CHURNED.id) return CHURNED;
  return pipeline.find((s) => s.id === id) ?? { id, label: id, color: "secondary" };
}
