"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ArrowLeft, LinkIcon } from "lucide-react";
import { FormError, PasswordField, SubmitButton } from "@/components/auth/AuthFields";
import { AuthHeading, AuthLayout } from "@/components/auth/AuthLayout";
import { Loader } from "@/components/ui";
import { api, errorMessage } from "@/lib/api";

// Opened from a password-reset email; sets a new password with the token in the link
export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}

type ResetLink = { email: string; name: string };

function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [link, setLink] = useState<ResetLink | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return setLinkError("This link is missing its code. Open it again from your email.");
    api.checkResetLink(token).then(setLink, (e) => setLinkError(errorMessage(e)));
  }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("The two passwords don't match.");
    setError(null);
    setLoading(true);
    try {
      const { email } = await api.resetPassword({ token, newPassword: password });
      router.replace(`/login?reset=1&email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(errorMessage(err));
      setLoading(false);
    }
  };

  if (linkError) {
    return (
      <div className="flex flex-col items-start gap-4">
        <span className="flex size-12 items-center justify-center rounded-full bg-error/10 text-error ring-1 ring-error/15">
          <LinkIcon className="size-6" />
        </span>
        <AuthHeading title="This link doesn't work" subtitle={linkError} />
        <div className="flex flex-wrap gap-4 text-[13px] font-semibold">
          <Link href="/forgot-password" className="text-accent hover:text-accent-hover">Get a new reset link</Link>
          <Link href="/login" className="flex items-center gap-1.5 text-foreground-tertiary hover:text-foreground"><ArrowLeft className="size-4" />Back to sign in</Link>
        </div>
      </div>
    );
  }

  if (!link) {
    return <Loader size="sm" label="Checking your link…" />;
  }

  return (
    <>
      <AuthHeading
        title="Choose a new password"
        subtitle={<>Set a new password for <span className="font-semibold text-foreground">{link.email}</span>.</>}
      />
      <form onSubmit={submit} noValidate className="mt-6 flex flex-col gap-4 sm:mt-8 sm:gap-5">
        {/* Lets password managers save the new password against the right account */}
        <input type="email" autoComplete="username" value={link.email} readOnly hidden />
        <PasswordField
          id="reset-password"
          label="New password"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          placeholder="At least 8 characters"
          autoFocus
          invalid={!!error && !error.includes("match")}
        />
        <PasswordField
          id="reset-confirm"
          label="Confirm new password"
          autoComplete="new-password"
          value={confirm}
          onChange={setConfirm}
          placeholder="Repeat new password"
          invalid={!!error?.includes("match")}
        />
        <FormError message={error} />
        <SubmitButton loading={loading} loadingText="Saving…">Save new password</SubmitButton>
      </form>
    </>
  );
}
