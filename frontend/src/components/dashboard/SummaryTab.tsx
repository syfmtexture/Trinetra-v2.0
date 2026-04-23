'use client';

import { Download, Share2, FileText } from 'lucide-react';
import type { AnalysisResponse } from '@/lib/api';

interface SummaryTabProps {
  result: AnalysisResponse;
  fileName: string;
}

function SummaryStat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-muted/30 p-4">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
        {label}
      </p>
      <p
        className="mt-1 font-display text-xl font-bold"
        style={{ color: `hsl(var(--${color}))` }}
      >
        {value}
      </p>
    </div>
  );
}

export const SummaryTab = ({ result, fileName }: SummaryTabProps) => {
  const isFake = result.primary_verdict === 'FAKE';

  const handleDownload = () => {
    const report = {
      file: fileName,
      verdict: result.primary_verdict,
      confidence: result.confidence_score,
      local_label: result.local_label,
      local_confidence: result.local_confidence,
      rd_status: result.rd_status,
      rd_score: result.rd_score,
      latency_ms: result.latency_ms,
      forensic_summary: result.forensic_summary,
      analyzedAt: new Date().toISOString(),
      model: 'EfficientNet-B4 + Reality Defender',
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trinetra-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const recommendations = isFake
    ? [
        'Do not share or forward this media on any platform.',
        'Report the deepfake to the platform where it was found.',
        'If this content depicts you, contact legal authorities under IT Act 2000.',
        'Use the Blast Radius tool to notify your network immediately.',
      ]
    : [
        'This media appears authentic based on AI forensic analysis.',
        'You may safely share this content with confidence.',
        'Consider exporting this report as proof of authenticity if needed.',
      ];

  return (
    <div className="space-y-6">
      {/* Executive summary */}
      <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-glow">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold">
                Analysis summary
              </h2>
              <p className="text-xs text-muted-foreground">
                AI‑generated narrative from detection signals
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(result.forensic_summary)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border bg-muted/40 hover:bg-muted text-sm font-medium transition-colors"
            >
              <Share2 className="h-4 w-4" />
              Copy
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground text-background hover:bg-foreground/90 text-sm font-medium transition-colors"
            >
              <Download className="h-4 w-4" />
              Export JSON
            </button>
          </div>
        </div>

        <div>
          <p className="text-base leading-relaxed text-foreground">
            {result.forensic_summary}
          </p>
        </div>

        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          <SummaryStat
            label="Verdict"
            value={result.primary_verdict}
            color="brand-orange"
          />
          <SummaryStat
            label="Confidence"
            value={`${result.confidence_score.toFixed(1)}%`}
            color="brand-purple"
          />
          <SummaryStat
            label="Risk Level"
            value={isFake ? 'HIGH' : 'LOW'}
            color="brand-yellow"
          />
        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
        <h3 className="font-display text-lg font-semibold mb-4">
          Recommendations
        </h3>
        <ul className="space-y-3">
          {recommendations.map((r, i) => (
            <li
              key={i}
              className="flex gap-4 rounded-2xl border border-border bg-muted/30 p-4"
            >
              <span className="font-display font-bold text-brand-orange text-sm shrink-0 mt-0.5">
                0{i + 1}
              </span>
              <p className="text-sm leading-relaxed">{r}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Technical details */}
      <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
        <h3 className="font-display text-lg font-semibold mb-4">
          Technical details
        </h3>
        <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          {[
            ['File', fileName],
            ['Model', 'EfficientNet-B4 + BiLSTM'],
            ['Resolution', '—'],
            ['Latency', `${result.latency_ms.toFixed(2)} ms`],
            ['Backend', 'FastAPI · PyTorch'],
            ['Method', 'Grad‑CAM ensemble + RD'],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex justify-between border-b border-dashed border-border pb-2"
            >
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="font-mono text-xs text-right">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};
