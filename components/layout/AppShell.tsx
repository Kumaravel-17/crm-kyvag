"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BadgeCheck, Bell, LayoutDashboard, LogOut, Menu, PlusCircle, Settings, Users, X } from "lucide-react";
import { roleLabel, useAuth } from "@/lib/auth";
import { refreshPipeline, usePipeline, useStageCounts } from "@/lib/stages";
import { ThemeToggle } from "../theme/ThemeToggle";
import { Logo } from "./Logo";
import { Avatar, IconButton, buttonClass } from "../ui";

const NAV = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  // Badge: leads still in the first stage, waiting for a reply
  { href: "/leads", label: "Leads", icon: Users, countFirstStage: true },
  { href: "/customers", label: "Customers", icon: BadgeCheck },
  { href: "/settings", label: "Settings", icon: Settings },
];

/** Left sidebar + top bar wrapping every page */
export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);

  // Stage counts change as people work leads, so fetch them again on every page and when the tab comes back into view
  useEffect(() => { refreshPipeline(); }, [path]);
  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === "visible") refreshPipeline(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  return (
    <div className="flex min-h-screen">
      {open && <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px] lg:hidden" onClick={() => setOpen(false)} />}
      <Sidebar path={path} open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenu={() => setOpen(true)} />
        {children}
      </div>
    </div>
  );
}

function Sidebar({ path, open, onClose }: { path: string; open: boolean; onClose: () => void }) {
  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
  const pipeline = usePipeline();
  const counts = useStageCounts();
  const waiting = counts[pipeline[0]?.id];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-[256px] shrink-0 flex-col border-r border-border bg-background text-foreground transition-transform duration-300
        lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open ? "translate-x-0 shadow-lg" : "-translate-x-full"}`}
    >
      {/* Brand */}
      <div className="flex h-[66px] items-center justify-between border-b border-border px-5">
        <Link href="/" aria-label="Kyvag CRM home" className="rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">
          <Logo tag="CRM" />
        </Link>
        <button onClick={onClose} aria-label="Close menu" className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-foreground-tertiary hover:bg-border/50 lg:hidden">
          <X className="size-[18px]" />
        </button>
      </div>

      {/* Nav */}
      <nav aria-label="Main" className="flex flex-col gap-1 px-3 py-5">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-foreground-tertiary/80">Workspace</p>
        {NAV.map(({ href, label, icon: Icon, countFirstStage }) => {
          const on = isActive(href);
          const count = countFirstStage ? waiting : undefined;
          return (
            <Link
              key={href}
              href={href}
              aria-current={on ? "page" : undefined}
              className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-semibold transition-colors
                ${on ? "bg-accent/10 text-accent" : "text-foreground-tertiary hover:bg-border/50 hover:text-foreground"}`}
            >
              {on && <span className="absolute -left-3 inset-y-2 w-[3px] rounded-r-full bg-accent" />}
              <Icon className={`size-[18px] ${on ? "text-accent" : ""}`} strokeWidth={2} />
              {label}
              {count ? (
                <span className="ml-auto rounded-full bg-accent px-1.5 text-[10.5px] font-bold leading-[18px] text-accent-foreground">{count}</span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto flex flex-col gap-4 p-4">
     
        <SignedInUser />
      </div>
    </aside>
  );
}

function SignedInUser() {
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  return (
    <div className="flex items-center gap-3 px-1">
      <Link href="/settings" className="flex min-w-0 flex-1 items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">
        <Avatar name={user.name} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold">{user.name}</p>
          <p className="truncate text-[11.5px] text-foreground-tertiary">{user.title || roleLabel(user.role)}</p>
        </div>
      </Link>
      <button
        type="button"
        onClick={() => { setSigningOut(true); signOut(); }}
        disabled={signingOut}
        aria-label="Sign out"
        title="Sign out"
        className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-foreground-tertiary transition-colors hover:bg-error/10 hover:text-error disabled:opacity-50"
      >
        <LogOut className="size-4" />
      </button>
    </div>
  );
}

function TopBar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 shadow-sm backdrop-blur-xl">
      <div className="flex h-[66px] items-center gap-2 px-3 sm:gap-3 sm:px-5">
        <IconButton aria-label="Open menu" onClick={onMenu} className="lg:hidden">
          <Menu strokeWidth={2} />
        </IconButton>
        <span className="flex-1" />
        <Link href="/leads?new=1" className={buttonClass("primary", "md", "max-sm:hidden")}>
          <PlusCircle strokeWidth={2.5} />
          Add lead
        </Link>
        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />
        <IconButton aria-label="Notifications">
          <Bell strokeWidth={2} />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-accent ring-2 ring-background" />
        </IconButton>
        <ThemeToggle />
      </div>
    </header>
  );
}
