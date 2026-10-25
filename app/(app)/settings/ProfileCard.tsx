"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Moon, Sun } from "lucide-react";
import { Avatar, Card, CardBody, CardHeader, EditButton, SaveBar } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { applyTheme, getStoredTheme, type Theme } from "@/lib/theme";
import { InlineError, fieldLabel, input } from "./parts";

const PROFILE_FIELDS = [
  { key: "name", label: "Full name", type: "text", autoComplete: "name" },
  { key: "title", label: "Job title", type: "text", autoComplete: "organization-title" },
  { key: "email", label: "Email", type: "email", autoComplete: "email" },
  { key: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
] as const;

type Profile = Record<(typeof PROFILE_FIELDS)[number]["key"], string>;

export default function ProfileCard({ onSaved }: { onSaved: () => void }) {
  const { user, setUser } = useAuth();
  const profile: Profile = { name: user.name, title: user.title ?? "", email: user.email, phone: user.phone ?? "" };
  // Read-only until Edit is pressed; null means not editing
  const [draft, setDraft] = useState<Profile | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => setTheme(getStoredTheme()), []);

  const emailChanged = !!draft && draft.email.trim().toLowerCase() !== user.email;

  const cancel = () => { setDraft(null); setCurrentPassword(""); setError(null); };

  const save = async () => {
    if (!draft) return;
    if (!draft.name.trim()) return setError("Enter your name.");
    if (emailChanged && !currentPassword) return setError("Enter your current password to change your email.");
    setSaving(true);
    setError(null);
    try {
      const { user: updated } = await api.updateMe({
        name: draft.name,
        title: draft.title.trim() || null,
        phone: draft.phone.trim() || null,
        ...(emailChanged ? { email: draft.email, currentPassword } : {}),
      });
      setUser(updated);
      cancel();
      onSaved();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card id="profile" className="flex flex-col">
      <CardHeader
        title="Profile"
        subtitle="How you appear to your team and to merchants"
        action={!draft && <EditButton onClick={() => setDraft(profile)} />}
      />
      <CardBody className="flex flex-1 flex-col gap-3.5">
        <Avatar name={user.name} size="md" />
        {draft ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {PROFILE_FIELDS.map((f) => (
              <label key={f.key} className={fieldLabel}>
                {f.label}
                <input
                  id={`set-${f.key}`}
                  type={f.type}
                  autoComplete={f.autoComplete}
                  className={input}
                  value={draft[f.key]}
                  onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                />
              </label>
            ))}
            {emailChanged && (
              <label className={`${fieldLabel} sm:col-span-2`}>
                Current password <span className="font-normal text-foreground-tertiary">· needed to change your email</span>
                <input id="set-email-password" type="password" autoComplete="current-password" className={input} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              </label>
            )}
            <div className="sm:col-span-2"><InlineError message={error} /></div>
          </div>
        ) : (
          <dl className="grid gap-3 sm:grid-cols-2">
            {PROFILE_FIELDS.map((f) => (
              <div key={f.key} className="min-w-0">
                <dt className="text-[12px] font-semibold text-foreground-secondary">{f.label}</dt>
                <dd className="mt-1 truncate text-[13px]">{profile[f.key] || <span className="text-foreground-tertiary">—</span>}</dd>
              </div>
            ))}
          </dl>
        )}
        <div id="appearance" className="flex flex-col gap-1.5">
          <p className="text-[12px] font-semibold text-foreground-secondary">
            Appearance <span className="font-normal text-foreground-tertiary">· applies right away, in this browser</span>
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {([["light", "Light", Sun], ["dark", "Dark", Moon]] as const).map(([value, label, Icon]) => (
              <button
                key={value}
                type="button"
                aria-pressed={theme === value}
                onClick={() => { setTheme(value); applyTheme(value); }}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition-colors
                  ${theme === value ? "border-accent bg-accent/[0.06] ring-2 ring-accent/20" : "border-border hover:border-border-strong"}`}
              >
                <span className={`flex size-7 items-center justify-center rounded-md ${theme === value ? "bg-accent text-accent-foreground" : "bg-surface-sunken text-foreground-tertiary"}`}>
                  <Icon className="size-4" />
                </span>
                <span className="flex-1 text-[13px] font-semibold">{label}</span>
                {theme === value && <CheckCircle2 className="size-4 text-accent" />}
              </button>
            ))}
          </div>
        </div>
      </CardBody>
      {draft && <SaveBar onCancel={cancel} onSave={save} saving={saving} />}
    </Card>
  );
}
