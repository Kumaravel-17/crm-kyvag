"use client";

import { useState } from "react";
import { GitMerge } from "lucide-react";
import { Card, CardBody, CardHeader, ChannelTag, EditButton, SaveBar } from "@/components/ui";
import { api, errorMessage, type LeadChanges } from "@/lib/api";
import { CHANNEL_LABEL, LEAD_SOURCES, type Channel, type Lead } from "@/lib/data";
import { useApi } from "@/lib/useApi";
import { Dl } from "./Dl";

type Info = { phone: string; email: string; source: Channel; category: string; domain: string };

const fieldLabel = "flex flex-col gap-1 text-[12px] font-semibold text-foreground-secondary";
const input =
  "rounded-lg border border-input-border bg-input-bg px-3 py-2 text-[13px] font-normal text-foreground outline-none transition-colors focus:border-accent";

const fromLead = (lead: Lead): Info => ({
  phone: lead.phone ?? "",
  email: lead.email ?? "",
  source: lead.source,
  category: lead.category ?? "",
  domain: lead.domain ?? "",
});

/** Contact and store details in one card, read-only until Edit is pressed */
export function LeadInfoCards({ lead, onSave }: { lead: Lead; onSave: (changes: LeadChanges) => Promise<void> }) {
  const [draft, setDraft] = useState<Info | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  // Suggestions for the business type box; any other value can still be typed
  const categories = useApi(api.leadCategories, []).data?.categories ?? [];
  const info = fromLead(lead);

  const cancel = () => { setDraft(null); setError(null); };

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    setError(null);
    try {
      await onSave({
        phone: draft.phone.trim() || null,
        email: draft.email.trim() || null,
        source: draft.source,
        category: draft.category.trim() || null,
        domain: draft.domain.trim() || null,
      });
      setDraft(null);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };
  const set = <K extends keyof Info>(k: K, v: Info[K]) => draft && setDraft({ ...draft, [k]: v });

  return (
    <Card>
      <CardHeader title="Contact" action={!draft && <EditButton onClick={() => setDraft(info)} />} />
      <CardBody>
        {draft ? (
          <div className="flex flex-col gap-3">
            <label className={fieldLabel}>Phone<input id="lead-phone" type="tel" className={input} value={draft.phone} onChange={(e) => set("phone", e.target.value)} /></label>
            <label className={fieldLabel}>Email<input id="lead-email" type="email" className={input} value={draft.email} onChange={(e) => set("email", e.target.value)} /></label>
            <label className={fieldLabel}>
              Platform
              <select id="lead-source" className={input} value={draft.source} onChange={(e) => set("source", e.target.value as Channel)}>
                {/* Keeps a source that isn't in the usual list, like email or SMS, selectable */}
                {[...new Set([...LEAD_SOURCES, draft.source])].map((c) => <option key={c} value={c}>{CHANNEL_LABEL[c]}</option>)}
              </select>
            </label>
            <label className={fieldLabel}>
              Type of business
              <input id="lead-category" list="business-types" className={input} placeholder="e.g. Sarees & ethnicwear" value={draft.category} onChange={(e) => set("category", e.target.value)} />
              <datalist id="business-types">{categories.map((t) => <option key={t} value={t} />)}</datalist>
            </label>
            <label className={fieldLabel}>Domain<input id="lead-domain" className={input} placeholder="store.com" value={draft.domain} onChange={(e) => set("domain", e.target.value)} /></label>
            {error && <p role="alert" className="rounded-lg bg-error/10 px-3 py-2 text-[12.5px] font-medium text-error">{error}</p>}
          </div>
        ) : (
          <Dl rows={[
            ["Phone", <span key="p" className="tabular-nums">{info.phone || "—"}</span>],
            ["Email", info.email || "—"],
            ["Platform", <ChannelTag key="s" channel={info.source} />],
            ["Type of business", info.category || "—"],
            ["Domain", info.domain
              ? <a key="d" href={`https://${info.domain}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{info.domain}</a>
              : "—"],
          ]} />
        )}
        {lead.duplicates.length > 0 && (
          <div className="mt-4 flex items-center gap-2.5 rounded-lg bg-secondary/10 px-3 py-2.5 text-[12.5px]">
            <GitMerge className="size-4 shrink-0 text-secondary" />
            Also seen on {lead.duplicates.map((d) => CHANNEL_LABEL[d]).join(", ")}. Merged by phone.
          </div>
        )}
      </CardBody>
      {draft && <SaveBar onCancel={cancel} onSave={save} saving={saving} />}
    </Card>
  );
}
