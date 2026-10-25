import { IndianRupee, Store, Target, Users } from "lucide-react";
import { BarList, Donut, Funnel } from "@/components/charts";
import { Avatar, Badge, Card, CardBody, CardHeader, ChannelIcon, ChannelTag, Page, PageTitle, StatCard } from "@/components/ui";
import { CAMPAIGNS, CHANNEL_LABEL, FUNNEL, REPS, SOURCES, inr, inrShort } from "@/lib/data";

const MIX_COLORS = ["var(--accent)", "var(--bronze)", "var(--accent-hover)", "var(--bronze-light)", "var(--info)", "var(--success)", "var(--warning)", "var(--foreground-tertiary)"];
const th = "px-4 py-3 text-[10.5px] font-semibold uppercase tracking-wider text-foreground-tertiary whitespace-nowrap";
const td = "px-4 py-3.5";

export default function AnalyticsPage() {
  const totalLeads = SOURCES.reduce((a, s) => a + s.leads, 0);
  const totalSpend = SOURCES.reduce((a, s) => a + s.spend, 0);
  const totalPaid = SOURCES.reduce((a, s) => a + s.paid, 0);
  const totalMrr = SOURCES.reduce((a, s) => a + s.mrr, 0);
  const paidLeads = SOURCES.filter((s) => s.spend).reduce((a, s) => a + s.leads, 0);
  const bySize = [...SOURCES].sort((a, b) => b.leads - a.leads);

  return (
    <Page>
      <PageTitle
        eyebrow="Analytics · October 2026"
        title={<>Which ads bring <em>paying stores</em></>}
        subtitle="Every lead keeps its source, campaign, ad set and ad, so revenue traces back to the creative that earned it."
        actions={
          <div className="flex rounded-lg bg-surface-sunken p-1 ring-1 ring-divider">
            {["7 days", "30 days", "Quarter"].map((p) => (
              <button key={p} className={`cursor-pointer rounded-md px-3 py-1.5 text-[12.5px] font-semibold ${p === "30 days" ? "bg-surface text-accent shadow-sm" : "text-foreground-tertiary hover:text-foreground"}`}>
                {p}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4 lg:gap-5">
        <StatCard icon={Users} label="Leads" value={totalLeads.toLocaleString("en-IN")} note="All sources, last 30 days" />
        <StatCard icon={Target} label="Cost per lead" value={inr(Math.round(totalSpend / paidLeads))} note="Paid channels only" />
        <StatCard icon={Store} label="Cost per paying store" value={inr(Math.round(totalSpend / totalPaid))} note={`${totalPaid} new stores`} />
        <StatCard icon={IndianRupee} label="MRR from new stores" value={inrShort(totalMrr)} note={`On ${inrShort(totalSpend)} spend · ${(totalMrr / totalSpend).toFixed(2)}× in month one`} />
      </div>

      <Card className="overflow-hidden">
        <CardHeader title="Source economics" subtitle="First-touch attribution · spend from Meta, Google, LinkedIn and YouTube ad accounts" />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[920px]">
            <thead className="border-y border-border bg-surface-sunken/50">
              <tr className="text-right">
                <th className={`${th} text-left`}>Source</th><th className={th}>Leads</th><th className={th}>Spend</th><th className={th}>Cost / lead</th>
                <th className={th}>Paid</th><th className={th}>Lead → paid</th><th className={th}>Cost / paying store</th><th className={th}>New MRR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider text-right tabular-nums">
              {SOURCES.map((s) => {
                const cpa = s.spend ? s.spend / s.paid : 0;
                return (
                  <tr key={s.channel} className="transition-colors hover:bg-accent/[0.04]">
                    <td className={`${td} text-left`}><ChannelTag channel={s.channel} /></td>
                    <td className={td}>{s.leads.toLocaleString("en-IN")}</td>
                    <td className={td}>{s.spend ? inrShort(s.spend) : <span className="text-foreground-tertiary">Organic</span>}</td>
                    <td className={td}>{s.spend ? inr(Math.round(s.spend / s.leads)) : "—"}</td>
                    <td className={td}>{s.paid}</td>
                    <td className={td}>{((s.paid / s.leads) * 100).toFixed(1)}%</td>
                    <td className={td}>
                      {s.spend ? <Badge tone={cpa < 4000 ? "success" : cpa < 6000 ? "warning" : "error"}>{inr(Math.round(cpa))}</Badge> : "—"}
                    </td>
                    <td className={`${td} font-semibold`}>{inrShort(s.mrr)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-12 gap-4 lg:gap-5">
        <Card className="col-span-12 xl:col-span-7">
          <CardHeader title="Funnel by stage" subtitle="Share of leads reaching each stage" />
          <CardBody><Funnel steps={FUNNEL} /></CardBody>
        </Card>

        <Card className="col-span-12 xl:col-span-5">
          <CardHeader title="Lead mix" subtitle={`Share of ${totalLeads.toLocaleString("en-IN")} leads`} />
          <CardBody className="flex flex-wrap items-center gap-6">
            <div className="relative">
              <Donut parts={bySize.map((s, i) => ({ value: s.leads, color: MIX_COLORS[i] }))} size={176} />
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <div className="font-display text-[30px] leading-none">{Math.round((bySize[0].leads / totalLeads) * 100)}%</div>
                  <div className="mt-1 text-[11px] text-foreground-tertiary">{CHANNEL_LABEL[bySize[0].channel]}</div>
                </div>
              </div>
            </div>
            <ul className="flex min-w-[170px] flex-1 flex-col gap-2">
              {bySize.map((s, i) => (
                <li key={s.channel} className="flex items-center gap-2.5 text-[12.5px]">
                  <i className="size-2.5 rounded-sm" style={{ background: MIX_COLORS[i] }} />
                  <span className="flex-1">{CHANNEL_LABEL[s.channel]}</span>
                  <span className="tabular-nums text-foreground-tertiary">{((s.leads / totalLeads) * 100).toFixed(1)}%</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card className="col-span-12 overflow-hidden xl:col-span-7">
          <CardHeader title="Revenue by campaign" subtitle="New MRR traced to the campaign of first touch" />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[620px]">
              <thead className="border-y border-border bg-surface-sunken/50">
                <tr className="text-right">
                  <th className={`${th} text-left`}>Campaign</th><th className={th}>Leads</th><th className={th}>CPL</th><th className={th}>Paid</th><th className={th}>MRR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider text-right tabular-nums">
                {CAMPAIGNS.map((c) => (
                  <tr key={c.name} className="transition-colors hover:bg-accent/[0.04]">
                    <td className={`${td} text-left`}>
                      <div className="flex items-center gap-2.5"><ChannelIcon channel={c.channel} /><span className="font-mono text-[12px]">{c.name}</span></div>
                    </td>
                    <td className={td}>{c.leads}</td>
                    <td className={td}>{inr(c.cpl)}</td>
                    <td className={td}>{c.paid}</td>
                    <td className={`${td} font-semibold`}>{inrShort(c.mrr)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="col-span-12 xl:col-span-5">
          <CardHeader title="Rep response time" subtitle="Median minutes to first reply · target 5" />
          <CardBody>
            <BarList items={REPS.map((r) => ({
              label: <span className="flex items-center gap-2"><Avatar name={r.name} size="sm" />{r.name}</span>,
              value: r.avgResponseMin,
              display: `${r.avgResponseMin} min · ${Math.round((r.conversions / r.assigned) * 100)}% won`,
            }))} />
          </CardBody>
        </Card>
      </div>
    </Page>
  );
}
