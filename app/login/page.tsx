"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { AuthField, FormError, FormNotice, PasswordField, SubmitButton, isEmail } from "@/components/auth/AuthFields";
import { AuthHeading, AuthLayout } from "@/components/auth/AuthLayout";
import { api, errorMessage } from "@/lib/api";
import { safeNext } from "@/lib/auth";

export default function LoginPage() {
  return (
    <AuthLayout>
      {/* useSearchParams needs a Suspense boundary so the page can still be prerendered */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));

  const [email, setEmail] = useState(params.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Someone who is already signed in skips the form
  useEffect(() => {
    api.me().then(() => router.replace(next), () => {});
  }, [router, next]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) return setError("Enter a valid work email, like name@company.com.");
    if (!password) return setError("Enter your password.");
    setError(null);
    setLoading(true);
    try {
      await api.login({ email, password, remember });
      router.replace(next);
    } catch (err) {
      setError(errorMessage(err));
      setLoading(false);
    }
  };

  return (
    <>
      <AuthHeading title="Welcome back" subtitle="Sign in to your Kyvag CRM workspace." />
      <form onSubmit={submit} noValidate className="mt-6 flex flex-col gap-4 sm:mt-8 sm:gap-5">
        {params.get("reset") === "1" && <FormNotice>Your password is set. Sign in with it now.</FormNotice>}
        <AuthField
          id="login-email"
          label="Work email"
          icon={Mail}
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          placeholder="name@company.com"
          invalid={!!error?.includes("email")}
        />
        <PasswordField
          id="login-password"
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
          invalid={!!error?.toLowerCase().includes("password")}
          labelAction={
            <Link href={`/forgot-password${isEmail(email) ? `?email=${encodeURIComponent(email.trim())}` : ""}`} className="text-[12.5px] font-semibold text-accent hover:text-accent-hover">
              Forgot password?
            </Link>
          }
        />
        <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-foreground-secondary">
          <input id="login-remember" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-4 cursor-pointer accent-[var(--accent)]" />
          Keep me signed in for 30 days
        </label>
        <FormError message={error} />
        <SubmitButton loading={loading} loadingText="Signing in…">Sign in</SubmitButton>
      </form>

        </>
  );
}
