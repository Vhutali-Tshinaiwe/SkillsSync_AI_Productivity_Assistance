import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { buildInstructions } from "@/lib/prompts";

const Body = z.object({
  tool: z.enum(["email", "meeting", "planner"]),
  input: z.string().min(1).max(20000),
});

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = Body.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return Response.json({ error: "Invalid request." }, { status: 400 });
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) return Response.json({ error: "AI is not configured." }, { status: 500 });
        try {
          const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
            method: "POST",
            signal: request.signal,
            headers: {
              "Content-Type": "application/json",
              "Lovable-API-Key": apiKey,
              "X-Lovable-AIG-SDK": "fetch",
            },
            body: JSON.stringify({
              model: "openai/gpt-6-astra",
              instructions: buildInstructions(parsed.data.tool),
              input: parsed.data.input,
              stream: true,
              store: false,
              reasoning: { effort: "low", summary: "auto" },
              include: ["reasoning.encrypted_content"],
            }),
          });
          if (!res.ok) {
            let msg = "The AI service had a problem. Please try again shortly.";
            if (res.status === 429) msg = "Too many requests right now. Please wait a moment and try again.";
            if (res.status === 402) msg = "AI credits have run out for this workspace.";
            try {
              const j = await res.json();
              if (j?.message && (res.status === 402 || res.status === 403)) msg = j.message;
            } catch {}
            return Response.json({ error: msg }, { status: res.status });
          }
          return new Response(res.body, { headers: { "Content-Type": "text/event-stream" } });
        } catch (e) {
          if (request.signal.aborted) return new Response(null, { status: 499 });
          return Response.json({ error: "Could not reach the AI service." }, { status: 502 });
        }
      },
    },
  },
});
