'use client';

import { CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import type { AnalysisResponse } from '@/lib/api';

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Map API response to verdict meta
function getVerdictMeta(result: AnalysisResponse) {
  const isFake = result.primary_verdict === 'FAKE';
  if (isFake) {
    return {
      icon: ShieldAlert,
      label: 'Likely Manipulated',
      tone: 'text-brand-orange',
      chip: 'bg-brand-orange/10 text-brand-orange border-brand-orange/30',
    };
  }
  return {
    icon: CheckCircle2,
    label: 'Likely Authentic',
    tone: 'text-emerald-600',
    chip: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
  };
}

// Derive detection signals from API result
function getMetrics(result: AnalysisResponse) {
  const isFake = result.primary_verdict === 'FAKE';
  return [
    {
      label: 'Local AI Model',
      value: Math.round(result.local_confidence),
      color: result.local_label === 'FAKE' ? 'bg-brand-orange' : 'bg-emerald-500',
    },
    {
      label: 'Reality Defender Cloud',
      value: result.rd_score ? Math.round(result.rd_score * 100) : 0,
      color: 'bg-brand-purple',
    },
    {
      label: 'Combined Confidence',
      value: Math.round(result.confidence_score),
      color: isFake ? 'bg-brand-orange' : 'bg-emerald-500',
    },
  ];
}

export const ResultTab = ({ result }: { result: AnalysisResponse }) => {
  const v = getVerdictMeta(result);
  const Icon = v.icon;
  const metrics = getMetrics(result);

  return (
    <div className="space-y-6">
      {/* Verdict header */}
      <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <span
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold',
                v.chip
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              Verdict
            </span>
            <h2
              className={cn(
                'mt-4 font-display text-4xl md:text-5xl font-bold tracking-tighter',
                v.tone
              )}
            >
              {v.label}
            </h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-md">
              {result.forensic_summary}
            </p>
          </div>

          {/* Confidence ring */}
          <ConfidenceRing value={Math.round(result.confidence_score)} />
        </div>
      </div>

      {/* Metric bars */}
      <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
        <h3 className="font-display text-lg font-semibold">Detection signals</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Per‑model confidence on individual artifact categories.
        </p>

        <div className="mt-6 space-y-5">
          {metrics.map((m) => (
            <div key={m.label}>
              <div className="flex justify-between items-baseline text-sm mb-2">
                <span className="font-medium">{m.label}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {m.value}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all', m.color)}
                  style={{ width: `${m.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meta stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { k: 'Latency', v: `${result.latency_ms.toFixed(0)} ms` },
          { k: 'Model', v: 'EfficientNet-V2-S' },
          { k: 'RD Status', v: result.rd_status || 'DISABLED' },
        ].map((stat) => (
          <div
            key={stat.k}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
              {stat.k}
            </p>
            <p className="mt-1 font-display font-semibold">{stat.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ConfidenceRing = ({ value }: { value: number }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg className="-rotate-90 h-full w-full" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="url(#ringGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--brand-purple))" />
            <stop offset="60%" stopColor="hsl(var(--brand-orange))" />
            <stop offset="100%" stopColor="hsl(var(--brand-yellow))" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-bold tracking-tight">
          {value}%
        </span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          confidence
        </span>
      </div>
    </div>
  );
};
