import { useState } from "react";
import { Check, Copy, Loader2, AlertTriangle } from "lucide-react";

export function ResultBox({
  value,
  onChange,
  loading,
  error,
  rows = 14,
}: {
  value: string;
  onChange: (v: string) => void;
  loading: boolean;
  error: string | null;
  rows?: number;
}) {
  const [copied, setCopied] = useState(false);
  if (error)
    return (
      <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <p>{error}</p>
      </div>
    );
  if (!value && !loading) return null;
  return (
    <div className="panel space-y-3 p-4">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
          {loading ? "Generating…" : "Result (editable)"}
        </span>
        <button
          className="btn-ghost"
          disabled={!value}
          onClick={async () => {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <textarea
        className="field font-mono text-[13px] leading-relaxed"
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="flex items-center gap-1.5 text-xs font-medium text-accent-foreground">
        <AlertTriangle className="h-3.5 w-3.5 text-accent" /> AI-generated. Review before use.
      </p>
    </div>
  );
}
