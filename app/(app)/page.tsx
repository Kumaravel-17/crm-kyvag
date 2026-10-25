"use client";

import Link from "next/link";
import { ArrowRight, Store, Timer, TrendingUp, UserPlus } from "lucide-react";
import { AreaChart, Funnel, Sparkline } from "@/components/charts";
import { LeadList, LoadError } from "@/components/LeadList";
import { Badge, Card, CardBody, CardHeader, Loader, Page, PageTitle, StatCard, buttonClass } from "@/components/ui";
import { api, type Dashboard } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { CHANNEL_LABEL } from "@/lib/data";
import { useApi } from "@/lib/useApi";

/** 3.5 → 3m 30s, as JSX with small unit letters */
function Duration({ minutes }: { minutes: number }) {
  const total = Math.round(Math.abs(minutes) * 60);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return <>{m > 0 && <>{m}<small>m</small> </>}{s}<small>s</small></>;
}

const durationText = (minutes: number) => {
  const total = Math.round(Math.abs(minutes) * 60);
  return `${Math.floor(total / 60)}m ${total % 60}s`;
};

const signed = (n: number, unit = "") => `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n)}${unit}`;

function greeting(hour: number) {
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

export default function Overview() {
  const { user } = useAuth();
  const { data, error, reload } = useApi(api.dashboard, []);
  const now = new Date();
  const firstName = user.name.split(" ")[0];

  return (
    <Page>
      <PageTitle
        eyebrow={now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
        title={<>{greeting(now.getHours())}, <em>{firstName}</em></>}
        subtitle={data ? summaryLine(data) : "Here's how your leads are doing."}
        actions={
          <>
            <Link href="/customers" className={buttonClass("secondary")}>Customers</Link>
            <Link href="/leads" className={buttonClass("primary")}>View leads<ArrowRight /></Link>
          </>
        }
      />

      {error && <Card><LoadError message={error} onRetry={reload} /></Card>}
      {data && <DashboardBody data={data} />}
      {!data && !error && <Loader label="Loading today's numbers…" />}
    </Page>
  );
}

/** "1 new merchant today · Instagram brought …"; the count is left out when there are none today */
function summaryLine(d: Dashboard) {
  const today = d.newLeadsToday.count;
  return [today > 0 && `${today} new ${today === 1 ? "merchant" : "merchants"} today`, topSourceLine(d)].filter(Boolean).join(" · ");
}

function topSourceLine(d: Dashboard) {
  if (!d.topSource) return "No new leads in the last 7 days.";
  const { source, share, change } = d.topSource;
  const trend = change === null ? "" : change >= 0 ? `, up ${change}% on the week before` : `, down ${Math.abs(change)}% on the week before`;
  return `${CHANNEL_LABEL[source]} brought ${share}% of this week's leads${trend}.`;
}

function DashboardBody({ data: d }: { data: Dashboard }) {
  const month = new Date().toLocaleDateString("en-IN", { month: "long" });
  const reply = d.firstReply;
  const replyChange = reply.medianMin !== null && reply.previousMedianMin !== null ? reply.medianMin - reply.previousMedianMin : null;
  const paidChange = d.payingThisMonth.count - d.payingThisMonth.lastMonth;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4 lg:gap-5">
        <StatCard
          icon={UserPlus}
          label="New leads · today"
          value={d.newLeadsToday.count}
          delta={d.newLeadsToday.change === null ? undefined : signed(d.newLeadsToday.change, "%")}
          deltaUp={(d.newLeadsToday.change ?? 0) >= 0}
          note={`vs this time last ${new Date(Date.now() - 7 * 864e5).toLocaleDateString("en-IN", { weekday: "long" })}`}
          aside={<Sparkline data={d.daily.leads.slice(-14)} />}
        />
        <StatCard
          icon={Timer}
          label="Median first reply"
          value={reply.medianMin === null ? <>0<small>m</small></> : <Duration minutes={reply.medianMin} />}
          delta={replyChange === null || Math.round(replyChange * 60) === 0 ? undefined : `${replyChange < 0 ? "−" : "+"}${durationText(replyChange)}`}
          deltaUp={(replyChange ?? 0) <= 0}
          note="leads from the last 7 days"
          aside={reply.medianMin !== null && (reply.medianMin <= 5 ? <Badge tone="success">Under 5 min</Badge> : <Badge tone="warning">Over 5 min</Badge>)}
        />
        <StatCard
          icon={TrendingUp}
          label="Trial → Paid"
          value={<>{d.trialToPaid?.rate ?? 0}<small>%</small></>}
          note={d.trialToPaid ? `${d.trialToPaid.paid} of ${d.trialToPaid.reachedTrial} trials · last 90 days` : "No trials in the last 90 days"}
          aside={<Sparkline data={d.daily.paid.slice(-14)} />}
        />
        <StatCard
          icon={Store}
          label={`New paying stores · ${month}`}
          value={d.payingThisMonth.count}
          delta={signed(paidChange)}
          deltaUp={paidChange >= 0}
          note={`vs ${d.payingThisMonth.lastMonth} last month`}
        />
      </div>

      <div className="grid grid-cols-12 gap-4 lg:gap-5">
        <Card className="col-span-12 xl:col-span-7">
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
              labels={d.daily.labels}
              series={[
                { name: "Leads captured", data: d.daily.leads, color: "var(--accent)", fill: true },
                { name: "Became paying", data: d.daily.paid, color: "var(--success)" },
              ]}
            />
          </CardBody>
        </Card>

        <Card className="col-span-12 xl:col-span-5">
          <CardHeader
            title="Conversion funnel"
            subtitle={d.funnel.total ? `Last 90 days · ${d.funnel.total.toLocaleString("en-IN")} ${d.funnel.total === 1 ? "lead" : "leads"} still in the pipeline or paid` : "Last 90 days"}
          />
          <CardBody><Funnel steps={d.funnel.steps} /></CardBody>
        </Card>

        <Card className="col-span-12 overflow-hidden">
          <CardHeader
            title="Latest leads"
            subtitle="The five most recent merchants to reach out"
            action={<Link href="/leads" className={buttonClass("ghost", "sm")}>View all<ArrowRight /></Link>}
          />
          <LeadList leads={d.latest} empty="No leads yet." />
        </Card>
      </div>
    </>
  );
}
