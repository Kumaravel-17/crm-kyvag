"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, ChannelTag } from "@/components/ui";
import { formatDate, formatTime, timeAgo, type Lead } from "@/lib/data";

const th = "px-4 py-3 text-left text-[10.5px] font-semibold uppercase tracking-wider text-foreground-tertiary whitespace-nowrap";
const td = "px-4 py-3.5 align-middle";

type Variant = "leads" | "customers";

/** Leads as cards on phones and a table from tablets up. Customers show when they started paying instead of the source. */
export function LeadList({ leads, variant = "leads", empty, loading }: { leads: Lead[]; variant?: Variant; empty: string; loading?: boolean }) {
  const router = useRouter();
  const customers = variant === "customers";
  const when = (l: Lead) => (customers && l.paidAt ? l.paidAt : l.createdAt);
  const dash = <span className="text-foreground-tertiary">—</span>;

  return (
    <div className={`transition-opacity ${loading ? "opacity-60" : ""}`} aria-busy={loading || undefined}>
      {/* Phones and small tablets: one card per lead */}
      <ul className="flex flex-col gap-3 p-3 md:hidden">
        {leads.map((l) => (
          <li key={l.id} className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            <Link href={`/leads/${l.id}`} className="flex flex-col gap-3 p-4 transition-colors active:bg-accent/[0.06]">
              <div className="flex items-start gap-3">
                <Avatar name={l.name} />
                <div className="min-w-0 flex-1">
                  <span className="font-semibold">{l.name}</span>
                  <p className="truncate text-[12.5px] text-foreground-secondary">{l.company}</p>
                </div>
                <ChannelTag channel={l.source} />
              </div>
              <dl className="grid grid-cols-1 gap-2 border-t border-divider pt-3 text-[12.5px] min-[420px]:grid-cols-2">
                <Field k="Domain" v={l.domain ? <span className="text-foreground-secondary">{l.domain}</span> : dash} />
                <Field k="Phone" v={l.phone ? <span className="tabular-nums">{l.phone}</span> : dash} />
                <Field k="Email" v={l.email ?? dash} />
                <Field
                  k={customers ? "Customer since" : "Date & Time"}
                  v={<>{formatDate(when(l))} at {formatTime(when(l))} <span className="text-foreground-tertiary">({timeAgo(when(l))})</span></>}
                />
              </dl>
            </Link>
          </li>
        ))}
        {!leads.length && !loading && <li className="px-4 py-14 text-center text-foreground-tertiary">{empty}</li>}
      </ul>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[980px]">
          <thead className="border-b border-border bg-surface-sunken/50">
            <tr>
              <th className={th}>Name</th><th className={th}>Store name</th><th className={th}>Domain</th><th className={th}>Phone</th>
              <th className={th}>Email</th><th className={th}>{customers ? "Source" : "Platform"}</th><th className={th}>{customers ? "Customer since" : "Date & Time"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-divider">
            {leads.map((l) => (
              <tr key={l.id} onClick={() => router.push(`/leads/${l.id}`)} className="group cursor-pointer transition-colors hover:bg-accent/[0.04]">
                <td className={td}>
                  <div className="flex items-center gap-3">
                    <Avatar name={l.name} />
                    <Link href={`/leads/${l.id}`} onClick={(e) => e.stopPropagation()} className="font-semibold transition-colors group-hover:text-accent">
                      {l.name}
                    </Link>
                  </div>
                </td>
                <td className={`${td} text-[13.5px]`}>{l.company}</td>
                <td className={`${td} text-[13px] text-foreground-secondary`}>
                  {l.domain ? (
                    <a href={`https://${l.domain}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="hover:text-accent hover:underline">
                      {l.domain}
                    </a>
                  ) : dash}
                </td>
                <td className={`${td} whitespace-nowrap text-[13px] tabular-nums`}>{l.phone ?? dash}</td>
                <td className={`${td} text-[13px] text-foreground-secondary`}>{l.email ?? dash}</td>
                <td className={td}><ChannelTag channel={l.source} /></td>
                <td className={`${td} whitespace-nowrap text-[13px]`}>
                  <div className="font-medium text-foreground">{formatDate(when(l))}</div>
                  <div className="text-[11.5px] text-foreground-tertiary">{formatTime(when(l))} · {timeAgo(when(l))}</div>
                </td>
              </tr>
            ))}
            {!leads.length && !loading && (
              <tr><td colSpan={7} className="px-4 py-14 text-center text-foreground-tertiary">{empty}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10.5px] font-semibold uppercase tracking-wider text-foreground-tertiary">{k}</dt>
      <dd className="mt-0.5 truncate">{v}</dd>
    </div>
  );
}

/** Error line with a retry button, for cards whose data failed to load */
export function LoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-wrap items-center justify-center gap-3 px-4 py-10 text-center text-[13px] text-foreground-secondary">
      {message}
      <button type="button" onClick={onRetry} className="cursor-pointer font-semibold text-accent hover:text-accent-hover">Try again</button>
    </div>
  );
}
