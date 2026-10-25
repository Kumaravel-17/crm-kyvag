"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, Filter, Search, X } from "lucide-react";
import { LeadList, LoadError } from "@/components/LeadList";
import { Button, Card, Pagination } from "@/components/ui";
import { api, errorMessage, type NewLead } from "@/lib/api";
import { CHANNEL_LABEL, LEAD_SOURCES, type Channel } from "@/lib/data";
import { CHURNED, refreshPipeline, usePipeline } from "@/lib/stages";
import { useApi, useDebounced } from "@/lib/useApi";

export default function LeadsTable() {
  const params = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState("");
  const search = useDebounced(q.trim());
  const pipeline = usePipeline();
  const [stage, setStage] = useState<string>("all");
  const [source, setSource] = useState<Channel | "all">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [toast, setToast] = useState<string | null>(null);
  const showAdd = params.get("new") === "1";

  // Any filter change starts again from the first page
  useEffect(() => setPage(1), [search, stage, source, pageSize]);

  const { data, error, loading, reload } = useApi(
    () => api.leads({ q: search, stage, source: source === "all" ? undefined : source, page, pageSize }),
    [search, stage, source, page, pageSize],
  );

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2600); };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5 border-b border-border px-4 py-3.5 sm:px-5">
          <label className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-input-border bg-input-bg px-3 py-2 text-foreground-tertiary focus-within:border-accent">
            <Search className="size-4 shrink-0" />
            <input id="lead-search" className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-foreground-tertiary" placeholder="Name, store, phone or email" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>

          <div className="scrollbar-hide flex max-w-full overflow-x-auto rounded-lg bg-surface-sunken p-1 ring-1 ring-divider" role="tablist" aria-label="Stage">
            {[{ id: "all", label: "All" }, ...pipeline, CHURNED].map((s) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={stage === s.id}
                onClick={() => setStage(s.id)}
                className={`shrink-0 cursor-pointer rounded-md px-3 py-1.5 text-[12.5px] font-semibold transition-colors
                  ${stage === s.id ? "bg-surface text-accent shadow-sm" : "text-foreground-tertiary hover:text-foreground"}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 rounded-lg border border-input-border bg-input-bg px-3 py-2 text-foreground-tertiary">
            <Filter className="size-4" />
            <select id="lead-source" className="bg-transparent text-foreground outline-none" value={source} onChange={(e) => setSource(e.target.value as Channel | "all")}>
              <option value="all">All platforms</option>
              {LEAD_SOURCES.map((c) => <option key={c} value={c}>{CHANNEL_LABEL[c]}</option>)}
            </select>
          </label>
        </div>

        {error ? (
          <LoadError message={error} onRetry={reload} />
        ) : (
          <LeadList leads={data?.leads ?? []} loading={loading} empty="No leads match these filters. Clear the search or pick another stage." />
        )}

        <Pagination
          page={page}
          pageSize={pageSize}
          total={data?.total ?? 0}
          noun="leads"
          onPage={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          onPageSize={setPageSize}
        />
      </Card>

      {showAdd && (
        <AddLead
          onClose={() => router.replace("/leads")}
          onSaved={() => {
            router.replace("/leads");
            flash("Lead added");
            reload();
            refreshPipeline();
          }}
        />
      )}
      {toast && (
        <div role="status" className="fixed bottom-6 right-6 z-50 flex animate-rise items-center gap-2.5 rounded-xl border border-border bg-surface-elevated px-4 py-3 font-semibold shadow-lg">
          <CheckCircle2 className="size-[18px] text-success" />{toast}
        </div>
      )}
    </>
  );
}

const ADD_SOURCES: Channel[] = ["instagram", "facebook", "whatsapp", "google", "youtube", "website", "linkedin", "referral"];
const field = "flex flex-col gap-1.5 text-[12.5px] font-semibold text-foreground-secondary";
const input = "rounded-lg border border-input-border bg-input-bg px-3 py-2.5 text-[13.5px] font-normal text-foreground outline-none transition-colors focus:border-accent";

function AddLead({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<NewLead>({ name: "", company: "", phone: "", email: "", source: "instagram" });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const set = (k: keyof NewLead) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Enter the merchant's name.");
    if (!form.company.trim()) return setError("Enter the store name.");
    if (form.phone.trim().length < 6) return setError("Enter a phone number.");
    setSaving(true);
    setError(null);
    try {
      await api.createLead(form);
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[2px]" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        noValidate
        className="flex h-full w-full max-w-[440px] animate-rise flex-col overflow-y-auto border-l border-border bg-surface shadow-lg"
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-6 py-5">
          <div>
            <h2 className="font-display text-[24px]">Add a lead</h2>
            <p className="mt-0.5 text-[13px] text-foreground-tertiary">Enter the merchant&apos;s details. It goes to the rep with the fewest open leads.</p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-foreground-tertiary hover:bg-border/50 hover:text-foreground">
            <X className="size-[18px]" />
          </button>
        </div>
        <div className="flex flex-col gap-4 px-6 py-5">
          <label className={field}>Name<input id="add-name" autoFocus className={input} placeholder="Meera Krishnan" value={form.name} onChange={set("name")} /></label>
          <label className={field}>
            Store name
            <input id="add-store" className={input} placeholder="Kanjeevaram House" value={form.company} onChange={set("company")} />
            <span className="text-[11.5px] font-normal text-foreground-tertiary">Brand or company name</span>
          </label>
          <label className={field}>Phone<input id="add-phone" type="tel" className={input} placeholder="+91 98400 21873" value={form.phone} onChange={set("phone")} /></label>
          <label className={field}>Email <span className="sr-only">(optional)</span><input id="add-email" type="email" className={input} placeholder="meera@kanjeevaramhouse.in" value={form.email} onChange={set("email")} /></label>
          <label className={field}>
            Platform
            <select id="add-platform" className={input} value={form.source} onChange={set("source")}>
              {ADD_SOURCES.map((c) => <option key={c} value={c}>{CHANNEL_LABEL[c]}</option>)}
            </select>
            <span className="text-[11.5px] font-normal text-foreground-tertiary">Where the lead came from</span>
          </label>
          {error && <p role="alert" className="rounded-lg bg-error/10 px-3 py-2 text-[13px] font-medium text-error">{error}</p>}
        </div>
        <div className="mt-auto flex justify-end gap-2 border-t border-border px-6 py-4">
          <Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? "Adding…" : "Add lead"}</Button>
        </div>
      </form>
    </div>
  );
}
