import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, CalendarClock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SkilssDesk AI — Workplace Productivity Assistant" },
      { name: "description", content: "AI email drafting, meeting summaries and task planning for training-provider administrators." },
      { property: "og:title", content: "SkilssDesk AI — Workplace Productivity Assistant" },
      { property: "og:description", content: "AI email drafting, meeting summaries and task planning for training-provider administrators." },
    ],
  }),
  component: Index,
});

const CARDS = [
  { to: "/email", icon: Mail, title: "Smart Email Generator", desc: "Draft clear emails to clients, learners, managers and SETA contacts in the right tone." },
  { to: "/meetings", icon: FileText, title: "Meeting Notes Summarizer", desc: "Turn messy notes into decisions, action items, owners and deadlines." },
  { to: "/planner", icon: CalendarClock, title: "AI Task Planner", desc: "Build a daily or weekly plan using the Eisenhower matrix and flag what's at risk." },
] as const;

function Index() {
  return (
    <div>
      <section className="hero-panel mb-10 p-8 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">For skills development admins</p>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-5xl">
          Projects, contracts, deadlines — handled.
        </h1>
        <p className="mt-4 max-w-xl text-primary-foreground/80">
          SkilssDesk AI helps you write follow-ups, summarise meetings and plan your week, so you can spend
          less time on admin and more time on learners.
        </p>
      </section>
      <div className="grid gap-5 md:grid-cols-3">
        {CARDS.map(({ to, icon: Icon, title, desc }) => (
          <Link key={to} to={to} className="panel group flex flex-col p-6 transition hover:-translate-y-1 hover:shadow-lg">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-secondary text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-display text-lg font-semibold">{title}</h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{desc}</p>
            <span className="mt-5 flex items-center gap-1 text-sm font-semibold text-primary">
              Open tool <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
