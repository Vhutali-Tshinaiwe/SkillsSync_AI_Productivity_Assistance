import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ListPlus, Plus, Trash2, Wand2 } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { ResultBox } from "@/components/ResultBox";
import { runAI } from "@/lib/ai-client";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — TrainDeskAI" },
      { name: "description", content: "Plan your day or week with Eisenhower-matrix prioritisation and at-risk flags." },
      { property: "og:title", content: "AI Task Planner — TrainDeskAI" },
      { property: "og:description", content: "Plan your day or week with Eisenhower-matrix prioritisation and at-risk flags." },
    ],
  }),
  component: PlannerPage,
});

type Level = "High" | "Low";
type Task = { id: number; title: string; due: string; urgency: Level; importance: Level };

const inDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

const sampleTasks = (): Task[] => [
  { id: 1, title: "Compile Business Admin NQF4 attendance registers", due: inDays(1), urgency: "High", importance: "High" },
  { id: 2, title: "Prepare PoE files for SETA site visit", due: inDays(3), urgency: "High", importance: "High" },
  { id: 3, title: "Follow up on facilitator contracts with HR", due: inDays(2), urgency: "High", importance: "Low" },
  { id: 4, title: "Draft January learner intake proposal", due: inDays(10), urgency: "Low", importance: "High" },
  { id: 5, title: "Update programme tracking spreadsheet", due: inDays(4), urgency: "Low", importance: "Low" },
  { id: 6, title: "Submit signed progress report for Tranche 2 invoice", due: inDays(1), urgency: "High", importance: "High" },
];

let nextId = 100;

function PlannerPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mode, setMode] = useState<"Daily" | "Weekly">("Weekly");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (id: number, patch: Partial<Task>) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const generate = async () => {
    const valid = tasks.filter((t) => t.title.trim());
    if (!valid.length) return setError("Add at least one task (or load the sample tasks) first.");
    setError(null);
    setOut("");
    setLoading(true);
    const today = new Date().toISOString().slice(0, 10);
    const list = valid.map((t, i) => `${i + 1}. ${t.title} | due ${t.due || "Not stated"} | urgency ${t.urgency} | importance ${t.importance}`).join("\n");
    try {
      await runAI("planner", `Today is ${today}. Create a ${mode} plan (${mode === "Daily" ? "today only" : "next 5 working days"}).\nTasks:\n${list}`, setOut);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Tool 03" title="AI Task Planner" desc="Add your tasks and get a prioritised schedule, at-risk list and time-saving tips." />
      <div className="panel space-y-5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="label mb-0">Tasks</label>
          <div className="flex gap-2">
            <button className="btn-ghost" onClick={() => setTasks(sampleTasks())}><ListPlus className="h-4 w-4" /> Load sample tasks</button>
            <button className="btn-ghost" onClick={() => setTasks((t) => [...t, { id: nextId++, title: "", due: inDays(2), urgency: "High", importance: "High" }])}>
              <Plus className="h-4 w-4" /> Add task
            </button>
          </div>
        </div>
        {tasks.length === 0 && <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">No tasks yet. Add one or load the samples.</p>}
        <div className="space-y-3">
          {tasks.map((t) => (
            <div key={t.id} className="grid gap-2 rounded-lg bg-muted/60 p-3 sm:grid-cols-[1fr_140px_110px_120px_auto] sm:items-center">
              <input className="field" placeholder="Task title" value={t.title} onChange={(e) => update(t.id, { title: e.target.value })} />
              <input className="field" type="date" value={t.due} onChange={(e) => update(t.id, { due: e.target.value })} />
              <select className="field" value={t.urgency} onChange={(e) => update(t.id, { urgency: e.target.value as Level })} aria-label="Urgency">
                <option value="High">Urgent</option><option value="Low">Not urgent</option>
              </select>
              <select className="field" value={t.importance} onChange={(e) => update(t.id, { importance: e.target.value as Level })} aria-label="Importance">
                <option value="High">Important</option><option value="Low">Less important</option>
              </select>
              <button className="btn-ghost justify-self-end text-destructive" onClick={() => setTasks((x) => x.filter((y) => y.id !== t.id))} aria-label="Remove task">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {(["Daily", "Weekly"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={mode === m ? "chip chip-active" : "chip"}>{m} plan</button>
          ))}
          <button className="btn-primary sm:ml-auto" onClick={generate} disabled={loading}><Wand2 className="h-4 w-4" /> Build plan</button>
        </div>
      </div>
      <div className="mt-6"><ResultBox value={out} onChange={setOut} loading={loading} error={error} rows={22} /></div>
    </div>
  );
}
