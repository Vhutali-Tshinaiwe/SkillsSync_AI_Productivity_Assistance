import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Scale, Lock, UserCheck, ListChecks } from "lucide-react";
import { PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/responsible-ai")({
  head: () => ({
    meta: [
      { title: "Responsible AI — SkilssDesk AI" },
      { name: "description", content: "How to use SkilssDesk AI responsibly: limitations, bias, POPIA privacy and human review." },
      { property: "og:title", content: "Responsible AI — SkilssDesk AI" },
      { property: "og:description", content: "How to use SkilssDesk AI responsibly: limitations, bias, POPIA privacy and human review." },
    ],
  }),
  component: Page,
});

const SECTIONS = [
  { icon: AlertTriangle, title: "Limitations of AI", body: "AI predicts likely text. It can sound confident while being wrong, may miss context only you know, and does not know your organisation's policies or latest updates." },
  { icon: Scale, title: "Possible bias and errors", body: "Outputs can reflect bias in training data, misread dates or owners, or oversimplify. Watch for assumptions about people, language or culture." },
  { icon: Lock, title: "Privacy (POPIA)", body: "Do not enter real personal information — ID numbers, learner names, contact details, health or financial data. Use placeholders or dummy data, in line with the Protection of Personal Information Act." },
  { icon: UserCheck, title: "Human review required", body: "Every output is a draft. A person must read, correct and approve it before sending an email, sharing a summary or acting on a plan." },
];

const STEPS = [
  "Check every name, date, amount and deadline against the original source.",
  "Confirm action items and owners with the people involved.",
  "Make sure the tone suits the recipient and your organisation.",
  "Remove any placeholder like [Name] before sending.",
  "When unsure, ask a colleague or manager to review.",
];

function Page() {
  return (
    <div>
      <PageHeader eyebrow="Guidance" title="Responsible AI" desc="SkilssDesk AI is an assistant, not a decision-maker. Here's how to use it safely." />
      <div className="grid gap-5 sm:grid-cols-2">
        {SECTIONS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="panel p-6">
            <Icon className="h-5 w-5 text-primary" />
            <h2 className="mt-3 font-display text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
      <div className="panel mt-5 p-6">
        <div className="flex items-center gap-2"><ListChecks className="h-5 w-5 text-primary" /><h2 className="font-display text-lg font-semibold">Validation steps</h2></div>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
          {STEPS.map((s) => <li key={s}>{s}</li>)}
        </ol>
      </div>
    </div>
  );
}
