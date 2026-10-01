import type { ToolId } from "./prompts";

export async function runAI(tool: ToolId, input: string, onText: (full: string) => void) {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tool, input }),
  });
  if (!res.ok || !res.body) {
    const j = await res.json().catch(() => null);
    throw new Error(j?.error ?? "Something went wrong. Please try again.");
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  let full = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const ev = JSON.parse(data);
        if (ev.type === "response.output_text.delta" && ev.delta) {
          full += ev.delta;
          onText(full);
        } else if (ev.type === "response.failed" || ev.type === "error") {
          throw new Error("The AI could not complete this request. Please try again.");
        }
      } catch (e) {
        if (e instanceof Error && e.message.startsWith("The AI")) throw e;
      }
    }
  }
  if (!full.trim()) throw new Error("The AI returned an empty response. Please try again.");
  return full;
}
