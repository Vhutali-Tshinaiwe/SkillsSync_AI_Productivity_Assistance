import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Mail, Wand2 } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { ResultBox } from "@/components/ResultBox";
import { runAI } from "@/lib/ai-client";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — TrainDeskAI" },
      { name: "description", content: "Summarise meeting notes into decisions, action items and deadlines." },
      { property: "og:title", content: "Meeting Notes Summarizer — TrainDeskAI" },
      { property: "og:description", content: "Summarise meeting notes into decisions, action items and deadlines." },
    ],
  }),
  component: MeetingsPage,
});

const SAMPLE = `Weekly Ops Meeting – Learnership Programmes
Attendees: Thandi (Programme Manager), Sipho (Admin), Lerato (Facilitator Coordinator), Johan (Finance)

- Thandi: MICT SETA site visit confirmed for 14 October. Need all learner PoEs filed and the attendance registers signed.
- Sipho to compile the learner attendance registers for the Business Admin NQF4 group by 10 October.
- Lerato said two facilitators are still waiting for contracts. Someone from HR should follow up – not sure who.
- Johan: Tranche 2 invoice to the client is overdue. He will resubmit once the signed progress report is received.
- Agreed: moving the Project Management workshop from Venue B to the Midrand campus.
- Discussed new learner intake for January – numbers still unclear, maybe 25 or 30?
- Lerato to send updated facilitation schedule to all facilitators.
- Next meeting: Thursday.`;

function MeetingsPage() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (notes.trim().length < 20) return setError("Please paste some meeting notes (or load the sample) first.");
    setError(null);
    setOut("");
    setLoading(true);
    try {
      await runAI("meeting", notes, setOut);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const draftFollowUp = () => {
    const m = out.match(/## Action Items([\s\S]*?)(\n## |$)/);
    const items = (m?.[1] ?? out).trim();
    navigate({ to: "/email", search: { context: `Send a follow-up email after our meeting confirming these action items, owners and deadlines:\n${items}` } });
  };

  return (
    <div>
      <PageHeader eyebrow="Tool 02" title="Meeting Notes Summarizer" desc="Paste meeting notes or contract text. Get a summary, decisions, action items and deadlines." />
      <div className="panel space-y-5 p-6">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="label mb-0">Meeting notes</label>
            <button className="btn-ghost" onClick={() => setNotes(SAMPLE)}><FileText className="h-4 w-4" /> Load sample notes</button>
          </div>
          <textarea className="field" rows={10} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Paste your notes here…" />
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="btn-primary" onClick={generate} disabled={loading}><Wand2 className="h-4 w-4" /> Summarise</button>
          {out && !loading && <button className="btn-outline" onClick={draftFollowUp}><Mail className="h-4 w-4" /> Draft follow-up email</button>}
        </div>
      </div>
      <div className="mt-6"><ResultBox value={out} onChange={setOut} loading={loading} error={error} rows={20} /></div>
    </div>
  );
}
