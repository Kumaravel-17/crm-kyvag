// Client for the Kyvag backend. Calls go to /api on this app, which next.config.ts forwards to the backend.

import type { Channel, Lead, Platform } from "./data";
import type { PipelineStage, StageColor } from "./stages";

export type Role = "admin" | "manager" | "rep";

export type User = {
  id: string;
  email: string;
  name: string;
  title: string | null;
  phone: string | null;
  role: Role;
  disabled: boolean;
  createdAt: number;
};

export type Paged<K extends string, T> = { [key in K]: T[] } & { total: number; page: number; pageSize: number };

export type LeadQuery = { q?: string; stage?: string; source?: Channel; page?: number; pageSize?: number };

export type ActivityKind = "note" | "call" | "whatsapp" | "email" | "meeting" | "trial" | "message" | "merge" | "auto" | "capture" | "stage";
export type Activity = { id: string; kind: ActivityKind; text: string; authorId: string | null; authorName: string | null; createdAt: number };

export type Pipeline = {
  stages: (PipelineStage & { count: number })[];
  churned: { id: "churned"; label: string; color: StageColor; count: number };
};

export type Dashboard = {
  timeZone: string;
  newLeadsToday: { count: number; sameTimeLastWeek: number; change: number | null };
  firstReply: { medianMin: number | null; previousMedianMin: number | null };
  trialToPaid: { rate: number; reachedTrial: number; paid: number } | null;
  payingThisMonth: { count: number; lastMonth: number };
  daily: { labels: string[]; leads: number[]; paid: number[] };
  funnel: { steps: { id: string; label: string; value: number }[]; total: number };
  topSource: { source: Channel; count: number; share: number; change: number | null } | null;
  latest: Lead[];
};

export type NewLead = { name: string; company: string; phone: string; email?: string; domain?: string; source: Channel };
export type LeadChanges = Partial<{
  name: string; company: string; phone: string | null; email: string | null; domain: string | null; city: string | null;
  category: string | null; platform: Platform; source: Channel; stage: string; ownerId: string | null; tags: string[];
}>;

const queryString = (q: Record<string, string | number | undefined>) => {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) if (v !== undefined && v !== "") params.set(k, String(v));
  const s = params.toString();
  return s ? `?${s}` : "";
};

export class ApiError extends Error {
  constructor(public status: number, message: string, public details?: { field: string; message: string }[]) {
    super(message);
  }
}

// Set by AuthProvider: a 401 on a signed-in request means the session ended (expired, signed out elsewhere, account turned off)
let onSessionEnded: (() => void) | null = null;
export const setSessionEndedHandler = (fn: (() => void) | null) => { onSessionEnded = fn; };

// Sign-in answers 401 for a wrong password, and /auth/me for a visitor who isn't signed in; neither is a session ending
const SIGN_IN_PATHS = ["/auth/login", "/auth/me"];

async function request<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, "Can't reach Kyvag. Check your connection and try again.");
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401 && !SIGN_IN_PATHS.includes(path)) onSessionEnded?.();
    const fallback = res.status >= 500 ? "Kyvag isn't responding right now. Try again in a minute." : "Something went wrong. Try again.";
    throw new ApiError(res.status, data?.error ?? fallback, data?.details);
  }
  return data as T;
}

const post = <T = { ok: true }>(path: string, body: unknown = {}) => request<T>(path, "POST", body);

export const api = {
  // Sign in / out
  login: (body: { email: string; password: string; remember: boolean }) => post<{ user: User }>("/auth/login", body),
  logout: () => post("/auth/logout"),

  // Current user
  me: () => request<{ user: User }>("/auth/me"),
  updateMe: (body: { name?: string; title?: string | null; phone?: string | null; email?: string; currentPassword?: string }) =>
    request<{ user: User }>("/auth/me", "PATCH", body),

  // Passwords
  changePassword: (body: { currentPassword: string; newPassword: string }) => post("/auth/password", body),
  forgotPassword: (email: string) => post<{ ok: true; message: string }>("/auth/forgot-password", { email }),
  checkResetLink: (token: string) =>
    request<{ email: string; name: string }>(`/auth/reset-password?token=${encodeURIComponent(token)}`),
  resetPassword: (body: { token: string; newPassword: string }) => post<{ ok: true; email: string }>("/auth/reset-password", body),


  // Leads and customers
  leads: (q: LeadQuery = {}) => request<Paged<"leads", Lead>>(`/leads${queryString(q)}`),
  lead: (id: string) => request<{ lead: Lead }>(`/leads/${encodeURIComponent(id)}`),
  createLead: (body: NewLead) => post<{ lead: Lead }>("/leads", body),
  updateLead: (id: string, body: LeadChanges) => request<{ lead: Lead }>(`/leads/${encodeURIComponent(id)}`, "PATCH", body),
  leadCategories: () => request<{ categories: string[] }>("/leads/categories"),
  customers: (q: Pick<LeadQuery, "q" | "page" | "pageSize"> = {}) => request<Paged<"customers", Lead>>(`/customers${queryString(q)}`),

  // Activity on one lead
  activities: (leadId: string) => request<{ activities: Activity[] }>(`/leads/${encodeURIComponent(leadId)}/activities`),
  logActivity: (leadId: string, body: { kind: ActivityKind; text: string }) =>
    post<{ activity: Activity }>(`/leads/${encodeURIComponent(leadId)}/activities`, body),
  deleteActivity: (leadId: string, id: string) =>
    request<{ ok: true }>(`/leads/${encodeURIComponent(leadId)}/activities/${encodeURIComponent(id)}`, "DELETE"),

  // Pipeline stages (editing: admins and managers)
  pipeline: () => request<Pipeline>("/pipeline"),
  savePipeline: (stages: PipelineStage[]) => request<Pipeline>("/pipeline", "PUT", { stages }),

  dashboard: () => request<Dashboard>("/dashboard"),
};

/** Message to show for any thrown value */
export const errorMessage = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong. Try again.");
