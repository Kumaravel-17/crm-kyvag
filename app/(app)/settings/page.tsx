"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Page, PageTitle } from "@/components/ui";
import ProfileCard from "./ProfileCard";
import SecurityCard from "./SecurityCard";
import StagesCard from "./StagesCard";

export default function SettingsPage() {
  const [toast, setToast] = useState<string | null>(null);
  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2200); };
  const saved = (what: string) => flash(`${what} saved`);

  return (
    <Page>
      <PageTitle eyebrow="Settings" title={<>Your <em>settings</em></>} subtitle="Manage your profile, lead stages, how the app looks, and your account security." />

      <div className="grid gap-3.5 lg:grid-cols-2">
        <ProfileCard onSaved={() => saved("Profile")} />
        <StagesCard onSaved={() => saved("Lead stages")} />
        <SecurityCard flash={flash} />
      </div>

      {toast && (
        <div role="status" className="fixed bottom-6 right-6 z-50 flex animate-rise items-center gap-2.5 rounded-xl border border-border bg-surface-elevated px-4 py-3 font-semibold shadow-lg">
          <CheckCircle2 className="size-[18px] text-success" />{toast}
        </div>
      )}
    </Page>
  );
}
