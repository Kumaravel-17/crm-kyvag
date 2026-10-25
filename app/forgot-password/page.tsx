"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ArrowLeft, Mail, MailCheck } from "lucide-react";
import { AuthField, FormError, SubmitButton, isEmail } from "@/components/auth/AuthFields";
import { AuthHeading, AuthLayout } from "@/components/auth/AuthLayout";
import { api, errorMessage } from "@/lib/api";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <Suspense>
        <ForgotPasswordForm />
      </Suspense>
      <Link href="/login" className="mt-8 flex items-center justify-center gap-1.5 text-[13px] font-semibold text-foreground-tertiary hover:text-foreground">
        <ArrowLeft className="size-4" />Back to sign in
      </Link>
    </AuthLayout>
  );
}

function ForgotPasswordForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) return setError("Enter a valid work email, like name@company.com.");
    setError(null);
    setLoading(true);
    try {
      await api.forgotPassword(email);
      setSentTo(email.trim());
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (sentTo) {
    return (
      <div className="flex flex-col items-start gap-4">
        <span className="flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent ring-1 ring-accent/15">
          <MailCheck className="size-6" />
        </span>
        <AuthHeading
          title="Check your email"
          subtitle={<>If <span className="font-semibold text-foreground">{sentTo}</span> has a Kyvag account, we've sent it a link to reset the password. The link works for 1 hour.</>}
        />
        <button type="button" onClick={() => setSentTo(null)} className="cursor-pointer text-[13px] font-semibold text-accent hover:text-accent-hover">
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <>
      <AuthHeading title="Reset your password" subtitle="Enter your work email and we'll send you a link to choose a new password." />
      <form onSubmit={submit} noValidate className="mt-6 flex flex-col gap-4 sm:mt-8 sm:gap-5">
        <AuthField
          id="forgot-email"
          label="Work email"
          icon={Mail}
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          placeholder="name@company.com"
          autoFocus
          invalid={!!error}
        />
        <FormError message={error} />
        <SubmitButton loading={loading} loadingText="Sending…">Send reset link</SubmitButton>
      </form>
    </>
  );
}
