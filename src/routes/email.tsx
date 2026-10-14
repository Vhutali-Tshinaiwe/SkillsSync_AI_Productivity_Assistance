import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { RefreshCw, Wand2 } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { ResultBox } from "@/components/ResultBox";
import { runAI } from "@/lib/ai-client";

export const Route = createFileRoute("/email")({
  validateSearch: z.object({ context: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Smart Email Generator — TrainDeskAI" },
      { name: "description", content: "Generate professional emails for clients, learners, managers and SETA contacts." },
      { property: "og:title", content: "Smart Email Generator — TrainDeskAI" },
      { property: "og:description", content: "Generate professional emails for clients, learners, managers and SETA contacts." },
    ],
  }),
  component: EmailPage,
});

const RECIPIENTS = ["Client", "Manager", "Team member", "Learner", "SETA/partner contact"];
const TONES = ["Formal", "Friendly", "Persuasive"];

function EmailPage() {
  const { context } = Route.useSearch();
  const [purpose, setPurpose] = useState(context ?? "");
  const [recipient, setRecipient] = useState(context ? "Team member" : "Client");
  const [tone, setTone] = useState("Formal");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!purpose.trim()) return setError("Please describe the purpose of the email first.");
    setError(null);
    setOut("");
    setLoading(true);
    try {
      await runAI("email", `Recipient: ${recipient}\nTone: ${tone}\nPurpose/context:\n${purpose}`, setOut);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Tool 01" title="Smart Email Generator" desc="Describe what you need to say. Get a subject line and a concise email body." />
      <div className="panel space-y-5 p-6">
        <div>
          <label className="label">Purpose / context</label>
          <textarea className="field" rows={5} value={purpose} onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g. Remind the client that the moderation report for the Project Management learnership is due next Friday…" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label">Recipient</label>
            <select className="field" value={recipient} onChange={(e) => setRecipient(e.target.value)}>
              {RECIPIENTS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Tone</label>
            <div className="flex gap-2">
              {TONES.map((t) => (
                <button key={t} onClick={() => setTone(t)} className={tone === t ? "chip chip-active" : "chip"}>{t}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="btn-primary" onClick={generate} disabled={loading}><Wand2 className="h-4 w-4" /> Generate email</button>
          {out && <button className="btn-outline" onClick={generate} disabled={loading}><RefreshCw className="h-4 w-4" /> Regenerate</button>}
        </div>
      </div>
      <div className="mt-6"><ResultBox value={out} onChange={setOut} loading={loading} error={error} /></div>
    </div>
  );
}
