"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { Button, Loader } from "@/components/ui";
import { ApiError, api, errorMessage, setSessionEndedHandler, type User } from "./api";

type AuthContextValue = {
  user: User;
  /** Replaces the signed-in user after a change saved on the server (profile) */
  setUser: (user: User) => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/** Only same-site paths, so a crafted ?next= link can't send someone to another site after sign-in */
export function safeNext(next: string | null) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

/** Loads the signed-in user for the app pages and sends anyone without a valid session to the sign-in page */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname() ?? "/";
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toLogin = useCallback(() => {
    setUser(null);
    router.replace(path === "/" ? "/login" : `/login?next=${encodeURIComponent(path)}`);
  }, [router, path]);

  const load = useCallback(() => {
    setError(null);
    api.me().then(
      (r) => setUser(r.user),
      (e) => (e instanceof ApiError && e.status === 401 ? toLogin() : setError(errorMessage(e))),
    );
  }, [toLogin]);

  // Load once; a session that ends later is caught by the handler below
  useEffect(load, []);

  useEffect(() => {
    setSessionEndedHandler(toLogin);
    return () => setSessionEndedHandler(null);
  }, [toLogin]);

  const signOut = useCallback(async () => {
    setSessionEndedHandler(null);
    await api.logout().catch(() => {});
    router.replace("/login");
  }, [router]);

  if (!user && !error) return <Loader size="lg" label="Opening your workspace…" />;

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-6 text-center">
        <Logo tag="CRM" />
        <p role="alert" className="max-w-[340px] text-[13.5px] text-foreground-secondary">{error}</p>
        <Button onClick={load}>Try again</Button>
      </div>
    );
  }

  return <AuthContext.Provider value={{ user, setUser, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

/** Title-cases a role for display */
export const roleLabel = (role: User["role"]) => role[0].toUpperCase() + role.slice(1);
