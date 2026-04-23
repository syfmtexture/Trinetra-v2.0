'use client';

import React, { useState, useEffect } from 'react';
import {
  Globe, Search, AlertTriangle, CheckCircle2,
  ExternalLink, Copy, TrendingUp, Eye, Shield,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SpreadEntry {
  id: string;
  url: string;
  platform: string;
  domain: string;
  dateFound: string;
  views: string;
  risk: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'taken-down' | 'pending';
  region: { x: number; y: number; label: string };
}

const RISK_STYLES: Record<string, string> = {
  critical: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  high: 'bg-brand-orange/10 text-brand-orange border-brand-orange/20',
  medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  low: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
};

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-red-500/10 text-red-600 dark:text-red-400',
  'taken-down': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
};

const SIMULATED_RESULTS: SpreadEntry[] = [
  { id: '1', url: 'https://twitter.com/user/status/1234567890', platform: 'X (Twitter)', domain: 'twitter.com', dateFound: '2 hours ago', views: '12.4K', risk: 'critical', status: 'active', region: { x: 25, y: 35, label: 'North America' } },
  { id: '2', url: 'https://facebook.com/post/deepfake-video', platform: 'Facebook', domain: 'facebook.com', dateFound: '5 hours ago', views: '8.2K', risk: 'high', status: 'active', region: { x: 48, y: 30, label: 'Europe' } },
  { id: '3', url: 'https://reddit.com/r/videos/comments/abc', platform: 'Reddit', domain: 'reddit.com', dateFound: '1 day ago', views: '3.1K', risk: 'medium', status: 'pending', region: { x: 25, y: 40, label: 'North America' } },
  { id: '4', url: 'https://telegram.me/channel/post/456', platform: 'Telegram', domain: 'telegram.me', dateFound: '1 day ago', views: '2.8K', risk: 'high', status: 'active', region: { x: 55, y: 35, label: 'Middle East' } },
  { id: '5', url: 'https://tiktok.com/@user/video/789', platform: 'TikTok', domain: 'tiktok.com', dateFound: '3 days ago', views: '45.6K', risk: 'critical', status: 'active', region: { x: 75, y: 45, label: 'South Asia' } },
  { id: '6', url: 'https://whatsapp-forward.archive.org/media', platform: 'WhatsApp Forward', domain: 'archive.org', dateFound: '4 days ago', views: '~1K', risk: 'low', status: 'taken-down', region: { x: 75, y: 50, label: 'India' } },
];

const WORLD_MAP_SVG = `M25,18 L35,12 L55,14 L72,18 L80,28 L75,42 L78,55 L70,62 L55,58 L42,65 L35,55 L25,52 L18,42 L12,35 L15,25 Z
M28,20 L32,15 L48,16 L55,18 L62,22 L68,20 L74,25 L72,35 L68,42 L62,48 L55,52 L48,55 L42,50 L35,48 L28,42 L22,35 L20,28 Z`;

export const BlastRadiusTab = () => {
  const [scanning, setScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<SpreadEntry[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const startScan = () => {
    setScanning(true);
    setScanDone(false);
    setProgress(0);
    setResults([]);
  };

  useEffect(() => {
    if (!scanning) return;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setScanning(false);
          setScanDone(true);
          setResults(SIMULATED_RESULTS);
          return 100;
        }
        // Add results incrementally
        if (p === 20) setResults(SIMULATED_RESULTS.slice(0, 1));
        if (p === 40) setResults(SIMULATED_RESULTS.slice(0, 3));
        if (p === 60) setResults(SIMULATED_RESULTS.slice(0, 4));
        if (p === 80) setResults(SIMULATED_RESULTS.slice(0, 5));
        return p + 2;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [scanning]);

  const toggleStatus = (id: string) => {
    setResults(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'active' ? 'taken-down' : 'active' } : r));
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const activeCount = results.filter(r => r.status === 'active').length;
  const takenDownCount = results.filter(r => r.status === 'taken-down').length;
  const containment = results.length > 0 ? Math.round((takenDownCount / results.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center shadow-lg">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold">Blast Radius Containment</h2>
              <p className="text-xs text-muted-foreground">Track where the deepfake has spread across the internet</p>
            </div>
          </div>
          {!scanning && !scanDone && (
            <button onClick={startScan} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-foreground text-background hover:bg-foreground/90 text-sm font-semibold transition-colors">
              <Search className="h-4 w-4" /> Scan the Internet
            </button>
          )}
        </div>

        {/* Scanning progress */}
        {(scanning || scanDone) && (
          <div className="mt-6">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground font-medium">{scanning ? 'Scanning reverse image/video databases...' : 'Scan complete'}</span>
              <span className="font-mono text-brand-orange">{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-brand-purple via-brand-orange to-brand-yellow"
                animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
            </div>
          </div>
        )}

        {/* Stats */}
        {scanDone && (
          <div className="mt-4 grid grid-cols-4 gap-3">
            {[
              { val: results.length, label: 'Found', cls: 'text-brand-orange' },
              { val: activeCount, label: 'Active', cls: 'text-red-500' },
              { val: takenDownCount, label: 'Removed', cls: 'text-emerald-500' },
              { val: `${containment}%`, label: 'Contained', cls: 'text-brand-purple' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl border border-border bg-muted/30 p-3 text-center">
                <p className={`text-2xl font-display font-bold ${s.cls}`}>{s.val}</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* World Map Visualization */}
      {results.length > 0 && (
        <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
          <h3 className="font-display text-lg font-semibold mb-1">Spread Heatmap</h3>
          <p className="text-xs text-muted-foreground mb-6">Geographic distribution of discovered deepfake instances</p>

          <div className="relative aspect-[2/1] rounded-2xl bg-muted/20 border border-border overflow-hidden">
            {/* Simple world map grid */}
            <div className="absolute inset-0 grid-pattern opacity-30" />

            {/* Continent outlines (simplified) */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 60" preserveAspectRatio="none">
              <path d="M15,15 L30,10 L35,12 L32,18 L28,22 L22,28 L18,25 L15,20 Z" fill="hsl(var(--muted-foreground))" opacity="0.1" />
              <path d="M15,28 L22,30 L25,35 L20,45 L15,42 L12,35 Z" fill="hsl(var(--muted-foreground))" opacity="0.1" />
              <path d="M42,12 L55,10 L60,14 L58,22 L52,28 L48,30 L42,25 L40,18 Z" fill="hsl(var(--muted-foreground))" opacity="0.1" />
              <path d="M45,32 L52,30 L55,35 L50,48 L45,45 L42,38 Z" fill="hsl(var(--muted-foreground))" opacity="0.1" />
              <path d="M62,15 L78,12 L82,20 L80,35 L75,40 L65,38 L60,28 L62,20 Z" fill="hsl(var(--muted-foreground))" opacity="0.1" />
              <path d="M82,40 L90,38 L92,48 L85,52 L80,48 Z" fill="hsl(var(--muted-foreground))" opacity="0.1" />
            </svg>

            {/* Hotspot dots */}
            {results.filter(r => r.status === 'active').map((r, i) => (
              <React.Fragment key={r.id}>
                <motion.div
                  className="absolute h-3 w-3 rounded-full bg-red-500"
                  style={{ left: `${r.region.x}%`, top: `${r.region.y}%`, transform: 'translate(-50%, -50%)' }}
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
                <div className="absolute h-8 w-8 rounded-full bg-red-500/20 blur-md"
                  style={{ left: `${r.region.x}%`, top: `${r.region.y}%`, transform: 'translate(-50%, -50%)' }} />
                <span className="absolute text-[9px] font-mono text-red-400 font-bold"
                  style={{ left: `${r.region.x + 2}%`, top: `${r.region.y + 3}%` }}>{r.views}</span>
              </React.Fragment>
            ))}

            {/* Taken-down dots (green) */}
            {results.filter(r => r.status === 'taken-down').map((r) => (
              <motion.div key={`td-${r.id}`}
                className="absolute h-3 w-3 rounded-full bg-emerald-500/60"
                style={{ left: `${r.region.x}%`, top: `${r.region.y}%`, transform: 'translate(-50%, -50%)' }} />
            ))}
          </div>

          <div className="flex items-center gap-6 mt-4 text-xs">
            <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-semibold">Legend</span>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-red-500 animate-pulse" /> Active</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-amber-500" /> Pending</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-emerald-500" /> Removed</div>
          </div>
        </div>
      )}

      {/* URL Table */}
      {results.length > 0 && (
        <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
          <h3 className="font-display text-lg font-semibold mb-1">Discovered URLs</h3>
          <p className="text-xs text-muted-foreground mb-6">Prioritized by reach and risk level — take down high-risk first</p>

          <div className="space-y-3">
            {results.sort((a, b) => {
              const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
              return riskOrder[a.risk] - riskOrder[b.risk];
            }).map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className={`rounded-2xl border p-4 transition-all ${r.status === 'taken-down' ? 'border-emerald-500/20 bg-emerald-500/5 opacity-70' : 'border-border bg-muted/20'}`}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-medium">{r.platform}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${RISK_STYLES[r.risk]}`}>
                        {r.risk.toUpperCase()}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_STYLES[r.status]}`}>
                        {r.status === 'taken-down' ? '✓ Removed' : r.status === 'pending' ? '⏳ Pending' : '● Active'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono truncate">{r.url}</p>
                    <div className="flex items-center gap-4 mt-2 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {r.views} views</span>
                      <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {r.dateFound}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => copyUrl(r.url, r.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors">
                      {copied === r.id ? <><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
                    </button>
                    <button onClick={() => toggleStatus(r.id)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                        r.status === 'taken-down' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                        'bg-brand-orange text-white hover:bg-brand-orange/90'}`}>
                      {r.status === 'taken-down' ? <><CheckCircle2 className="h-3 w-3" /> Done</> : <><Shield className="h-3 w-3" /> Mark Removed</>}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
