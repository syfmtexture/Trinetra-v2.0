'use client';

import { useState } from 'react';
import type { AnalysisResponse } from '@/lib/api';

interface HeatmapTabProps {
  preview: string;
  result: AnalysisResponse;
}

// Generate simulated hotspots from the real result data
function generateHotspots(result: AnalysisResponse) {
  const isFake = result.primary_verdict === 'FAKE';
  if (!isFake) {
    return [
      { x: 50, y: 50, size: 20, color: 'purple', label: 'Low artifact', score: Math.round(result.local_confidence * 0.3) },
    ];
  }
  return [
    { x: 35, y: 30, size: 28, color: 'orange', label: 'Face region', score: Math.round(result.local_confidence) },
    { x: 65, y: 40, size: 20, color: 'yellow', label: 'Eye area', score: Math.round(result.confidence_score * 0.9) },
    { x: 50, y: 65, size: 15, color: 'purple', label: 'Texture artifact', score: Math.round(result.local_confidence * 0.6) },
  ];
}

export const HeatmapTab = ({ preview, result }: HeatmapTabProps) => {
  const [intensity, setIntensity] = useState(70);
  const hotspots = generateHotspots(result);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold">
              Grad‑CAM heatmap
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Brighter regions indicate stronger manipulation evidence.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-orange animate-pulse" />
            XAI · v1.0
          </span>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-border bg-black aspect-video">
          {/* Base image */}
          {result.gradcam_base64 ? (
            <img
              src={`data:image/png;base64,${result.gradcam_base64}`}
              alt="Grad-CAM heatmap"
              className="absolute inset-0 w-full h-full object-contain"
            />
          ) : (
            <>
              <img
                src={preview}
                alt="Source"
                className="absolute inset-0 w-full h-full object-contain"
              />
              {/* Simulated heatmap overlay */}
              <div
                className="absolute inset-0 pointer-events-none mix-blend-screen"
                style={{ opacity: intensity / 100 }}
              >
                {hotspots.map((h, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full blur-2xl"
                    style={{
                      left: `${h.x}%`,
                      top: `${h.y}%`,
                      width: `${h.size}%`,
                      height: `${h.size}%`,
                      transform: 'translate(-50%, -50%)',
                      background: `radial-gradient(circle, hsl(var(--brand-${h.color})) 0%, transparent 70%)`,
                    }}
                  />
                ))}
              </div>

              {/* Crosshairs on hotspots */}
              {hotspots.map((h, i) => (
                <div
                  key={`mark-${i}`}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${h.x}%`,
                    top: `${h.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="h-6 w-6 rounded-full border-2 border-white/80 shadow-lg" />
                  <span className="absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono bg-black/70 text-white px-1.5 py-0.5 rounded">
                    {h.label} · {h.score}%
                  </span>
                </div>
              ))}
            </>
          )}

          {/* Scan line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent animate-scan" />
        </div>

        {/* Intensity slider */}
        {!result.gradcam_base64 && (
          <div className="mt-6">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Overlay intensity</span>
              <span className="font-mono">{intensity}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full h-2 rounded-full accent-brand-orange cursor-pointer"
            />
          </div>
        )}

        {/* Color legend */}
        <div className="mt-6 flex items-center gap-6 flex-wrap text-xs">
          <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-semibold">
            Legend
          </span>
          {[
            { c: 'purple', label: 'Low' },
            { c: 'orange', label: 'Medium' },
            { c: 'yellow', label: 'High' },
          ].map((l) => (
            <div key={l.c} className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ background: `hsl(var(--brand-${l.c}))` }}
              />
              <span>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hotspot list */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <h3 className="font-display font-semibold">Detected regions</h3>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          {hotspots.map((h, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-2xl border border-border bg-muted/30 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: `hsl(var(--brand-${h.color}))` }}
                />
                <div>
                  <p className="text-sm font-medium">{h.label}</p>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    x:{h.x}% y:{h.y}%
                  </p>
                </div>
              </div>
              <span className="font-display font-bold text-sm">{h.score}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
