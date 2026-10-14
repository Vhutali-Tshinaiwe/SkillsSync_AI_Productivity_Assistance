import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Home, Mail, FileText, CalendarClock, ShieldCheck, Menu, X, Sparkles } from "lucide-react";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/meetings", label: "Meeting Summarizer", icon: FileText },
  { to: "/planner", label: "Task Planner", icon: CalendarClock },
  { to: "/responsible-ai", label: "Responsible AI", icon: ShieldCheck },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const nav = (
    <nav className="space-y-1">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={() => setOpen(false)}
          activeOptions={{ exact: true }}
          className="nav-link"
          activeProps={{ className: "nav-link nav-link-active" }}
        >
          <Icon className="h-4 w-4" /> {label}
        </Link>
      ))}
    </nav>
  );
  const brand = (
    <div className="flex items-center gap-2.5">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-accent-foreground">
        <Sparkles className="h-5 w-5" />
      </div>
      <div className="leading-tight">
        <div className="font-display text-lg font-bold text-sidebar-foreground">TrainDeskAI</div>
        <div className="text-[11px] text-sidebar-foreground/60">Workplace Assistant</div>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden w-64 shrink-0 flex-col gap-8 bg-sidebar p-5 lg:sticky lg:top-0 lg:flex lg:h-screen">
        {brand}
        {nav}
        <p className="mt-auto text-[11px] text-sidebar-foreground/50">Demo app · dummy data only</p>
      </aside>
      <header className="flex items-center justify-between bg-sidebar p-4 lg:hidden">
        {brand}
        <button onClick={() => setOpen(!open)} className="text-sidebar-foreground" aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </header>
      {open && <div className="bg-sidebar p-4 pt-0 lg:hidden">{nav}</div>}
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  );
}

export function PageHeader({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
  return (
    <div className="mb-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{desc}</p>
    </div>
  );
}
