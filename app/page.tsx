import Link from "next/link";
import { ArrowRight, Clock, Flame, IndianRupee, Timer, TrendingUp, UserPlus } from "lucide-react";
import { AreaChart, BarList, Funnel, Sparkline } from "@/components/charts";
import { Avatar, Badge, Card, CardBody, CardHeader, ChannelTag, Hot, Page, PageTitle, Score, StatCard, buttonClass, isHot } from "@/components/ui";
import { CHANNEL_LABEL, DAILY_LEADS, DAILY_PAID, FUNNEL, LEADS, REPS, SOURCES, inrShort, repById } from "@/lib/data";

const DAYS = Array.from({ length: 30 }, (_, i) =>
  new Date(2026, 8, 26 + i).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
);

export default function Overview() {
  const hot = LEADS.filter(isHot).sort((a, b) => b.score - a.score);
  const cold = LEADS.filter((l) => (l.firstReplyMin ?? 0) > 20 || (l.trial && l.trial.day >= 5));

  return (
    <Page>
      <PageTitle
        eyebrow="Sunday, 25 October"
        title={<>Good evening, Kumaravel. <em>186 new merchants</em> today.</>}
        subtitle={`Leads from Instagram are up 18% since the Diwali campaign went live. ${hot.length} hot leads are waiting for a first call.`}
        actions={
          <>
            <Link href="/analytics" className={buttonClass("secondary")}>Full report</Link>
            <Link href="/leads" className={buttonClass("primary")}>View leads<ArrowRight /></Link>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4 lg:gap-5">
        <StatCard icon={UserPlus} label="New leads · today" value="186" delta="+12.4%" deltaUp note="vs last Sunday" aside={<Sparkline data={DAILY_LEADS.slice(-14)} />} />
        <StatCard icon={Timer} label="Median first reply" value={<>3<small>m</small> 48<small>s</small></>} delta="−1m 12s" deltaUp note="this week" aside={<Badge tone="success">Under 5 min</Badge>} />
        <StatCard icon={TrendingUp} label="Trial → Paid" value={<>37.2<small>%</small></>} delta="+2.1 pts" deltaUp note="vs September" aside={<Sparkline data={DAILY_PAID.slice(-14)} />} />
        <StatCard icon={IndianRupee} label="New MRR · October" value={<>₹4.1<small>L</small></>} delta="−3.0%" note="vs September pace" aside={<Badge tone="bronze">164 stores</Badge>} />
      </div>

      <div className="grid grid-cols-12 gap-4 lg:gap-5">
        <Card className="col-span-12 xl:col-span-8">
          <CardHeader
            title="Lead flow"
            subtitle="Last 30 days, all sources"
            action={
              <div className="flex flex-wrap gap-4 text-[12px] text-foreground-tertiary">
                <span className="flex items-center gap-2"><i className="h-0.5 w-3 bg-accent" />Leads captured</span>
                <span className="flex items-center gap-2"><i className="h-0.5 w-3 bg-success" />Became paying</span>
              </div>
            }
          />
          <CardBody>
            <AreaChart
              labels={DAYS}
              series={[
                { name: "Leads", data: DAILY_LEADS, color: "var(--accent)", fill: true },
                { name: "Paid", data: DAILY_PAID, color: "var(--success)" },
              ]}
            />
          </CardBody>
        </Card>

        <Card className="col-span-12 xl:col-span-4">
          <CardHeader
            title="Hot leads"
            subtitle="Score 75+, not yet paid"
            action={<Link href="/leads?hot=1" className={buttonClass("ghost", "sm")}>View all</Link>}
          />
          <CardBody className="divide-y divide-divider !pt-2">
            {hot.slice(0, 5).map((l) => (
              <Link key={l.id} href={`/leads/${l.id}`} className="group flex items-center gap-3 py-3">
                <Avatar name={l.name} />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold transition-colors group-hover:text-accent">{l.company}</div>
                  <div className="truncate text-[12px] text-foreground-tertiary">{l.name} · {l.lastActivity}</div>
                </div>
                <Score value={l.score} />
              </Link>
            ))}
          </CardBody>
        </Card>

        <Card className="col-span-12 lg:col-span-6">
          <CardHeader title="Conversion funnel" subtitle="October cohort · 4,741 leads" />
          <CardBody><Funnel steps={FUNNEL} /></CardBody>
        </Card>

        <Card className="col-span-12 lg:col-span-6">
          <CardHeader title="Where paying stores come from" subtitle="New MRR by first-touch source" />
          <CardBody>
            <BarList
              items={[...SOURCES].sort((a, b) => b.mrr - a.mrr).slice(0, 6).map((s) => ({
                label: <ChannelTag channel={s.channel} />,
                value: s.mrr,
                display: `${inrShort(s.mrr)} · ${s.paid} stores`,
              }))}
            />
          </CardBody>
        </Card>

        <Card className="col-span-12 xl:col-span-7">
          <CardHeader title="Team this month" subtitle="Sorted by MRR closed" />
          <CardBody className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="border-b border-border text-[10.5px] font-semibold uppercase tracking-wider text-foreground-tertiary">
                  <th className="py-2.5 pr-3 font-semibold">Rep</th>
                  <th className="px-3 py-2.5 font-semibold">Region</th>
                  <th className="px-3 py-2.5 text-right font-semibold">First reply</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Won</th>
                  <th className="py-2.5 pl-3 text-right font-semibold">MRR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {REPS.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-accent/[0.04]">
                    <td className="py-3 pr-3"><div className="flex items-center gap-3"><Avatar name={r.name} size="sm" /><span className="font-semibold">{r.name}</span></div></td>
                    <td className="px-3 py-3 text-foreground-tertiary">{r.region} · {r.languages[0]}</td>
                    <td className="px-3 py-3 text-right">
                      <Badge tone={r.avgResponseMin <= 5 ? "success" : r.avgResponseMin <= 8 ? "warning" : "error"}>{r.avgResponseMin} min</Badge>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">{r.conversions}<span className="text-foreground-tertiary"> / {r.assigned}</span></td>
                    <td className="py-3 pl-3 text-right font-semibold tabular-nums">{inrShort(r.mrr)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>

        <Card className="col-span-12 xl:col-span-5">
          <CardHeader title="Needs attention" subtitle="Going cold or stuck in trial" />
          <CardBody className="divide-y divide-divider !pt-2">
            {cold.map((l) => (
              <Link key={l.id} href={`/leads/${l.id}`} className="group flex items-center gap-3 py-3">
                <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${l.trial ? "bg-warning/10 text-warning" : "bg-error/10 text-error"}`}>
                  <Clock className="size-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold transition-colors group-hover:text-accent">{l.company}</div>
                  <div className="truncate text-[12px] text-foreground-tertiary">
                    {l.trial
                      ? `Trial day ${l.trial.day}, no activity in 3 days`
                      : `No reply for ${l.firstReplyMin} min · ${CHANNEL_LABEL[l.source]}`}
                  </div>
                </div>
                <span title={repById(l.ownerId).name}><Avatar name={repById(l.ownerId).name} size="sm" /></span>
              </Link>
            ))}
            <div className="flex items-center gap-3 py-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent"><Flame className="size-[18px]" /></span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">Ishita Banerjee commented “price?”</div>
                <div className="truncate text-[12px] text-foreground-tertiary">Auto-replied in 34 s · awaiting rep</div>
              </div>
              <Hot />
            </div>
          </CardBody>
        </Card>
      </div>
    </Page>
  );
}
