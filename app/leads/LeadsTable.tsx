"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, CreditCard, Filter, Flame, GitMerge, Search, Upload, X } from "lucide-react";
import { Avatar, Button, Card, ChannelTag, Hot, Pagination, StagePill, isHot } from "@/components/ui";
import { CHANNEL_LABEL, LEADS, STAGES, inrShort, repById, type Channel, type Stage } from "@/lib/data";

const th = "px-4 py-3 text-left text-[10.5px] font-semibold uppercase tracking-wider text-foreground-tertiary whitespace-nowrap";
const td = "px-4 py-3.5 align-middle";

export default function LeadsTable() {
  const params = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [stage, setStage] = useState<Stage | "all">("all");
  const [source, setSource] = useState<Channel | "all">("all");
  const [hotOnly, setHotOnly] = useState(params.get("hot") === "1");
  const [merged, setMerged] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const showAdd = params.get("new") === "1";

  const rows = useMemo(
    () =>
      LEADS.filter((l) =>
        (stage === "all" || l.stage === stage) &&
        (source === "all" || l.source === source) &&
        (!hotOnly || isHot(l)) &&
        (q === "" || `${l.name} ${l.company} ${l.email} ${l.phone} ${l.city}`.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, stage, source, hotOnly],
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // Any filter change starts again from the first page
  useEffect(() => setPage(1), [q, stage, source, hotOnly, pageSize]);
  const pageRows = rows.slice((page - 1) * pageSize, page * pageSize);
  const dupes = LEADS.filter((l) => l.duplicates?.length);
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2600); };

  return (
    <>
      {!merged && dupes.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-bronze/30 bg-gradient-to-r from-bronze/10 to-transparent px-5 py-4">
          <span className="flex size-9 items-center justify-center rounded-lg bg-bronze/15 text-bronze"><GitMerge className="size-[18px]" /></span>
          <div className="min-w-[220px] flex-1">
            <p className="font-semibold">{dupes.length} possible duplicate{dupes.length > 1 ? "s" : ""} found</p>
            <p className="text-[12.5px] text-foreground-tertiary">
              Meera Krishnan signed up on the website with the same phone as her Instagram lead. Merging keeps all messages, UTM data and trial activity on one profile.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => router.push(`/leads/${dupes[0].id}`)}>Review</Button>
          <Button size="sm" onClick={() => { setMerged(true); flash("Duplicates merged by phone and email"); }}>Merge</Button>
        </div>
      )}

      <Card className="overflow-hidden hover:shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5 border-b border-border px-4 py-3.5 sm:px-5">
          <label className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-input-border bg-input-bg px-3 py-2 text-foreground-tertiary focus-within:border-accent">
            <Search className="size-4 shrink-0" />
            <input id="lead-search" className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-foreground-tertiary" placeholder="Name, store, phone or city" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>

          <div className="scrollbar-hide flex max-w-full overflow-x-auto rounded-lg bg-surface-sunken p-1 ring-1 ring-divider" role="tablist" aria-label="Stage">
            {[{ id: "all" as const, label: "All" }, ...STAGES].map((s) => (
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
              <option value="all">All sources</option>
              {(["instagram", "facebook", "whatsapp", "google", "youtube", "website", "linkedin", "csv", "referral"] as Channel[]).map((c) => (
                <option key={c} value={c}>{CHANNEL_LABEL[c]}</option>
              ))}
            </select>
          </label>

          <Button variant={hotOnly ? "primary" : "secondary"} onClick={() => setHotOnly(!hotOnly)} aria-pressed={hotOnly}>
            <Flame />Hot only
          </Button>
        </div>

        {/* Phones and small tablets: one card per lead instead of the wide table */}
        <ul className="flex flex-col gap-3 bg-surface-sunken/40 p-3 md:hidden">
          {pageRows.map((l) => {
            const owner = repById(l.ownerId);
            return (
              <li key={l.id} className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
                <Link href={`/leads/${l.id}`} className="flex flex-col gap-3 p-4 transition-colors active:bg-accent/[0.06]">
                  <div className="flex items-start gap-3">
                    <Avatar name={l.name} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">{l.company}</span>
                        {isHot(l) && <Hot />}
                      </div>
                      <p className="truncate text-[12px] text-foreground-tertiary">{l.name} · {l.city}</p>
                    </div>
                    <StagePill stage={l.stage} />
                  </div>

                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 rounded-lg bg-surface-sunken/60 px-3 py-2.5 text-[12.5px] ring-1 ring-divider">
                    <div className="min-w-0">
                      <dt className="text-[10.5px] font-semibold uppercase tracking-wider text-foreground-tertiary">Source</dt>
                      <dd className="mt-0.5"><ChannelTag channel={l.source} /></dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-[10.5px] font-semibold uppercase tracking-wider text-foreground-tertiary">GMV / mo</dt>
                      <dd className="mt-0.5 font-semibold tabular-nums">{inrShort(l.gmv)}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-[10.5px] font-semibold uppercase tracking-wider text-foreground-tertiary">Store</dt>
                      <dd className="mt-0.5 truncate">{l.platform === "None" ? "No store yet" : l.platform}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-[10.5px] font-semibold uppercase tracking-wider text-foreground-tertiary">Category</dt>
                      <dd className="mt-0.5 truncate">{l.category}</dd>
                    </div>
                  </dl>

                  <div className="flex items-center justify-between gap-3 text-[12px] text-foreground-tertiary">
                    <span className="min-w-0 truncate">
                      <span className="text-foreground-secondary">{l.lastActivity}</span> · {l.created}
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      <Avatar name={owner.name} size="sm" />
                      {owner.name.split(" ")[0]}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
          {rows.length === 0 && (
            <li className="px-4 py-14 text-center text-foreground-tertiary">No leads match these filters. Clear the search or pick another stage.</li>
          )}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[960px]">
            <thead className="border-b border-border bg-surface-sunken/50">
              <tr>
                <th className={th}>Merchant</th><th className={th}>Source · campaign</th><th className={th}>Stage</th>
                <th className={th}>Store</th><th className={`${th} !text-right`}>GMV / mo</th><th className={th}>Owner</th><th className={th}>Last activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider">
              {pageRows.map((l) => (
                <tr key={l.id} onClick={() => router.push(`/leads/${l.id}`)} className="group cursor-pointer transition-colors hover:bg-accent/[0.04]">
                  <td className={td}>
                    <div className="flex items-center gap-3">
                      <Avatar name={l.name} />
                      <div className="min-w-0">
                        <Link href={`/leads/${l.id}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 font-semibold transition-colors group-hover:text-accent">
                          {l.company}{isHot(l) && <Hot />}
                        </Link>
                        <div className="text-[12px] text-foreground-tertiary">{l.name} · {l.city}</div>
                      </div>
                    </div>
                  </td>
                  <td className={td}>
                    <ChannelTag channel={l.source} />
                    <div className="mt-1 font-mono text-[11.5px] text-foreground-tertiary">{l.utm.campaign}</div>
                  </td>
                  <td className={td}><StagePill stage={l.stage} /></td>
                  <td className={td}>
                    <div className="text-[13px]">{l.platform === "None" ? "No store yet" : l.platform}</div>
                    <div className="text-[12px] text-foreground-tertiary">{l.category}</div>
                  </td>
                  <td className={`${td} text-right tabular-nums`}>{inrShort(l.gmv)}</td>
                  <td className={td}><span title={repById(l.ownerId).name}><Avatar name={repById(l.ownerId).name} size="sm" /></span></td>
                  <td className={td}>
                    <div className="text-[13px]">{l.lastActivity}</div>
                    <div className="text-[11.5px] text-foreground-tertiary">{l.created}</div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={7}className="px-4 py-14 text-center text-foreground-tertiary">No leads match these filters. Clear the search or pick another stage.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={page}
          pageSize={pageSize}
          total={rows.length}
          noun="leads"
          onPage={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          onPageSize={setPageSize}
        />
      </Card>

      {showAdd && (
        <AddLead
          onClose={() => router.replace("/leads")}
          onSave={() => { router.replace("/leads"); flash("Lead added and assigned to Ananya Iyer"); }}
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

const field = "flex flex-col gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground-tertiary";
const input = "rounded-lg border border-input-border bg-input-bg px-3 py-2.5 text-[13.5px] font-normal normal-case tracking-normal text-foreground outline-none transition-colors focus:border-accent";

function AddLead({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[2px]" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => { e.preventDefault(); onSave(); }}
        className="flex h-full w-full max-w-[480px] animate-rise flex-col overflow-y-auto border-l border-border bg-surface shadow-lg"
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-6 py-5">
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-bronze">Manual entry</p>
            <h2 className="mt-1 font-display text-[28px]">Add a lead</h2>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-foreground-tertiary hover:bg-border/50 hover:text-foreground">
            <X className="size-[18px]" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-2">
          <label className={field}>Full name<input id="add-name" required className={input} placeholder="Meera Krishnan" /></label>
          <label className={field}>Store name<input id="add-store" className={input} placeholder="Kanjeevaram House" /></label>
          <label className={field}>Phone<input id="add-phone" required className={input} placeholder="+91 98400 21873" /></label>
          <label className={field}>Email<input id="add-email" type="email" className={input} placeholder="meera@store.in" /></label>
          <label className={field}>Platform
            <select id="add-platform" className={input} defaultValue="Shopify">
              <option>Shopify</option><option>WooCommerce</option><option>Magento</option><option>Custom</option><option>No store yet</option>
            </select>
          </label>
          <label className={field}>Monthly GMV<input id="add-gmv" className={input} placeholder="₹18,50,000" /></label>
          <label className={`${field} sm:col-span-2`}>How did they find us<input id="add-source" className={input} placeholder="Referral from Urban Kurta Co." /></label>
        </div>
        <div className="flex flex-col gap-2.5 px-6 pb-5">
          <p className="text-[10.5px] font-semibold uppercase tracking-wider text-foreground-tertiary">Or capture faster</p>
          <Button variant="secondary"><CreditCard />Scan a business card</Button>
          <Button variant="secondary"><Upload />Import a CSV file</Button>
        </div>
        <div className="mt-auto flex justify-end gap-2 border-t border-border px-6 py-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit">Add lead</Button>
        </div>
      </form>
    </div>
  );
}
