import { AppShell } from "@/components/layout/AppShell";
import { AuthProvider } from "@/lib/auth";

/** Signed-in area: loads the current user, then the sidebar + top bar around every page */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}
