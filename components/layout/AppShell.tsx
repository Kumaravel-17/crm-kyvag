"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BarChart3, Bell, LayoutDashboard, Menu, PlusCircle, Search, Users, X } from "lucide-react";
import { LEADS } from "@/lib/data";
import { ThemeToggle } from "../theme/ThemeToggle";
import { IconButton, buttonClass } from "../ui";

const NAV = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Users, count: LEADS.filter((l) => l.stage === "new").length },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

/** Left sidebar + top bar wrapping every page */
export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);

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

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-[256px] shrink-0 flex-col border-r border-border bg-background text-foreground transition-transform duration-300
        lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open ? "translate-x-0 shadow-lg" : "-translate-x-full"}`}
    >
      {/* Brand */}
      <div className="flex h-[66px] items-center justify-between border-b border-border px-5">
        <Link href="/" className="group flex items-end gap-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">
          <span className="w-[3px] self-stretch rounded-full bg-gradient-to-b from-bronze to-accent" aria-hidden />
          <span className="flex flex-col leading-none">
            <span className="mb-1 text-[9.5px] font-bold uppercase tracking-[0.3em] text-bronze">Kyvag</span>
            <span className="font-display text-[28px] font-semibold italic leading-none tracking-tight text-transparent bg-gradient-to-r from-accent via-accent to-bronze bg-clip-text">Leads</span>
          </span>
        </Link>
        <button onClick={onClose} aria-label="Close menu" className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-foreground-tertiary hover:bg-border/50 lg:hidden">
          <X className="size-[18px]" />
        </button>
      </div>

      {/* Nav */}
      <nav aria-label="Main" className="flex flex-col gap-1 px-3 py-5">
        <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-foreground-tertiary/80">Workspace</p>
        {NAV.map(({ href, label, icon: Icon, count }) => {
          const on = isActive(href);
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
        <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-bronze">This month</p>
          <p className="mt-1 font-display text-[22px] leading-tight">₹16.7 L MRR</p>
          <p className="mt-0.5 text-[12px] text-foreground-tertiary">83% of ₹20 L target</p>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-surface-sunken ring-1 ring-divider">
            <div className="h-full w-[83%] rounded-full bg-gradient-to-r from-bronze to-accent" />
          </div>
        </div>
        <div className="flex items-center gap-3 px-1">
          <span className="flex size-9 items-center justify-center rounded-full bg-accent/10 text-[11.5px] font-bold text-accent ring-1 ring-accent/15">KM</span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold">Kumaravel M.</p>
            <p className="truncate text-[11.5px] text-foreground-tertiary">Head of Sales</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function TopBar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 shadow-sm backdrop-blur-xl">
      <div className="flex h-[66px] items-center gap-2 px-3 sm:gap-3 sm:px-5">
        <IconButton aria-label="Open menu" onClick={onMenu} className="lg:hidden">
          <Menu strokeWidth={2} />
        </IconButton>
        <label className="flex min-w-0 max-w-[480px] flex-1 items-center gap-2 rounded-lg border border-input-border bg-input-bg px-3 py-2 text-foreground-tertiary transition-colors focus-within:border-accent">
          <Search className="size-4 shrink-0" />
          <input id="global-search" className="min-w-0 flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-foreground-tertiary" placeholder="Search leads, stores, phones…" />
          <kbd className="hidden rounded border border-border px-1.5 font-mono text-[10px] sm:block">⌘K</kbd>
        </label>
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
