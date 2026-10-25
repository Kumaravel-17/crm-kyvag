import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, GitMerge, MessageCircle, Phone } from "lucide-react";
import { ActivityFeed } from "@/components/ActivityFeed";
import { Avatar, Badge, Button, Card, CardBody, CardHeader, ChannelTag, Hot, Page, StagePill, StageTrack, isHot } from "@/components/ui";
import { CHANNEL_LABEL, LEADS, STAGES, inr, leadById, repById } from "@/lib/data";

export function generateStaticParams() {
  return LEADS.map((l) => ({ id: l.id }));
}

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const l = leadById(id);
  if (!l) notFound();
  const owner = repById(l.ownerId);
  const stageIdx = STAGES.findIndex((s) => s.id === l.stage);

  return (
    <Page>
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[13px]">
        <Link href="/leads" className="text-foreground-tertiary transition-colors hover:text-foreground">Leads</Link>
        <ChevronRight className="size-3.5 text-foreground-tertiary/60" />
        <span className="font-semibold" aria-current="page">{l.company}</span>
      </nav>

      <header className="flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-wrap items-center gap-5">
          <Avatar name={l.name} size="lg" />
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-secondary">{l.id} · {l.category}</p>
            <h1 className="mt-1.5 font-display text-[clamp(28px,3.2vw,44px)] leading-[1.06] tracking-tight">{l.company}</h1>
            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-foreground-tertiary">
              <span className="text-foreground">{l.name}</span>·<span>{l.city}</span>·<StagePill stage={l.stage} />{isHot(l) && <Hot />}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary"><Phone />Call</Button>
          <Button variant="secondary"><MessageCircle />WhatsApp</Button>
          <Button>Move to {STAGES[Math.min(stageIdx + 1, 4)].label}<ArrowRight /></Button>
        </div>
      </header>

      {/* Stage track */}
      <Card className="px-4 py-5 sm:px-6">
        <StageTrack stage={l.stage} />
      </Card>

      <div className="grid grid-cols-12 gap-4 lg:gap-5">
        <div className="col-span-12 flex flex-col gap-4 lg:col-span-8 lg:gap-5">
          {l.trial && (
            <Card className="overflow-hidden">
              <CardHeader title="Trial progress" subtitle="14-day free trial" />
              <div className="mt-4 grid grid-cols-2 gap-px border-t border-border bg-border sm:grid-cols-3 [&>*]:bg-surface">
                <Stat k="Trial day" v={`${l.trial.day} of 14`} />
                <Stat k="Days left" v={String(14 - l.trial.day)} tone={14 - l.trial.day <= 3 ? "text-warning" : ""} />
                <Stat k="First reply" v={l.firstReplyMin == null ? "Pending" : `${l.firstReplyMin} min`} />
              </div>
            </Card>
          )}

          <ActivityFeed leadId={l.id} author="Kumaravel M." />
        </div>

        <aside className="col-span-12 flex flex-col gap-4 lg:col-span-4 lg:gap-5">
          <Card>
            <CardHeader title="Contact" />
            <CardBody>
              <Dl rows={[
                ["Phone", <span key="p" className="tabular-nums">{l.phone}</span>],
                ["Email", l.email],
                ["Language", l.language],
                ["Owner", <span key="o" className="inline-flex items-center gap-2"><Avatar name={owner.name} size="sm" />{owner.name}</span>],
              ]} />
              {l.duplicates && (
                <div className="mt-4 flex items-center gap-2.5 rounded-lg bg-secondary/10 px-3 py-2.5 text-[12.5px]">
                  <GitMerge className="size-4 shrink-0 text-secondary" />
                  Also seen on {l.duplicates.map((d) => CHANNEL_LABEL[d]).join(", ")}. Merged by phone.
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Store" />
            <CardBody>
              <Dl rows={[
                ["Platform", l.platform === "None" ? "No store yet" : l.platform],
                ["Monthly GMV", <span key="g" className="tabular-nums">{inr(l.gmv)}</span>],
                ["Team size", l.storeSize],
                ["Category", l.category],
                ...(l.mrr > 0 ? [["Plan", <span key="m" className="tabular-nums text-success">{inr(l.mrr)} / mo</span>] as [string, React.ReactNode]] : []),
              ]} />
              <div className="mt-4 flex flex-wrap gap-1.5">
                {l.tags.map((t) => <Badge key={t}>{t}</Badge>)}
                <button className="cursor-pointer rounded-full border border-dashed border-accent/40 px-2.5 py-0.5 text-[11.5px] font-semibold text-accent hover:bg-accent/5">+ Tag</button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Attribution" subtitle="Where this lead came from" />
            <CardBody>
              <div className="mb-3"><ChannelTag channel={l.source} /></div>
              <Dl mono rows={[["utm_source", l.utm.source], ["Campaign", l.utm.campaign], ["Ad set", l.utm.adset], ["Ad", l.utm.ad]]} />
            </CardBody>
          </Card>
        </aside>
      </div>
    </Page>
  );
}

function Dl({ rows, mono }: { rows: [string, React.ReactNode][]; mono?: boolean }) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2.5 text-[13px]">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-foreground-tertiary">{k}</dt>
          <dd className={`text-right font-medium [overflow-wrap:anywhere] ${mono ? "font-mono text-[12px]" : ""}`}>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Stat({ k, v, tone = "" }: { k: string; v: string; tone?: string }) {
  return (
    <div className="px-5 py-4 sm:px-6">
      <div className="text-[10.5px] font-semibold uppercase tracking-wider text-foreground-tertiary">{k}</div>
      <div className={`mt-1 font-display text-[24px] ${tone}`}>{v}</div>
    </div>
  );
}
