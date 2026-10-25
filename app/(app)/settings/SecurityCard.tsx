"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Card, CardBody, CardHeader, EditButton, SaveBar } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";
import { InlineError, fieldLabel, input } from "./parts";

const EMPTY_PASSWORDS = { current: "", next: "", confirm: "" };

/** Password change */
export default function SecurityCard({ flash }: { flash: (msg: string) => void }) {
  const [draft, setDraft] = useState<typeof EMPTY_PASSWORDS | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const cancel = () => { setDraft(null); setError(null); };

  const save = async () => {
    if (!draft) return;
    if (!draft.current) return setError("Enter your current password.");
    if (draft.next.length < 8) return setError("Your new password must be at least 8 characters.");
    if (draft.next !== draft.confirm) return setError("The two new passwords don't match.");
    setSaving(true);
    setError(null);
    try {
      await api.changePassword({ currentPassword: draft.current, newPassword: draft.next });
      cancel();
      flash("Password changed");
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const field = (key: keyof typeof EMPTY_PASSWORDS, label: string, placeholder: string, autoComplete: string) =>
    draft && (
      <label className={fieldLabel}>
        {label}
        <input
          id={`set-pw-${key}`}
          type="password"
          autoComplete={autoComplete}
          className={input}
          placeholder={placeholder}
          value={draft[key]}
          onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
        />
      </label>
    );

  return (
    <Card id="security">
      <CardHeader
        title="Security"
        subtitle="Keep your workspace safe"
        action={!draft && <EditButton onClick={() => setDraft(EMPTY_PASSWORDS)}>Change password</EditButton>}
      />
      <CardBody className="flex flex-col gap-3.5">
        {draft ? (
          <div className="flex flex-col gap-3">
            <div className="grid gap-3 sm:grid-cols-3">
              {field("current", "Current password", "••••••••", "current-password")}
              {field("next", "New password", "At least 8 characters", "new-password")}
              {field("confirm", "Confirm new password", "Repeat new password", "new-password")}
            </div>
            <InlineError message={error} />
          </div>
        ) : (
          <div className="flex items-center gap-2.5 text-[13px]">
            <KeyRound className="size-4 text-foreground-tertiary" />
            <span className="font-semibold">Password</span>
            <span className="tracking-widest text-foreground-tertiary">••••••••</span>
          </div>
        )}
      </CardBody>
      {draft && <SaveBar onCancel={cancel} onSave={save} saving={saving} saveLabel="Change password" />}
    </Card>
  );
}
