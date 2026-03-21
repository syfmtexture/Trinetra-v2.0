"use client";

import { useEffect } from 'react';
import { useTrinetraStore } from '@/store/useTrinetraStore';
import { Activity, Cpu, ShieldCheck } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function SystemStatusBar() {
  const { 
    backendOnline, 
    modelName, 
    systemDevice, 
    updateSystemStatus, 
    setBackendOffline,
    result
  } = useTrinetraStore();

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/health');
        if (res.ok) {
          const data = await res.json();
          updateSystemStatus(data);
        } else {
          setBackendOffline();
        }
      } catch (err) {
        setBackendOffline();
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // 30s as per plan
    return () => clearInterval(interval);
  }, [updateSystemStatus, setBackendOffline]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-3 glass-panel rounded-none border-t-0 border-x-0 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-accent-lime/20 flex items-center justify-center p-1.5 border border-accent-lime/30">
          <ShieldCheck className="text-accent-lime w-full h-full" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight uppercase">Trinetra V2</h1>
          <p className="text-[10px] uppercase tracking-widest text-muted font-bold font-mono">Forensic Dashboard</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Model Identity */}
        <div className="hidden md:flex flex-col items-end">
          <p className="text-[10px] uppercase font-bold text-muted">Core Architecture</p>
          <div className="flex items-center gap-2 group cursor-help">
            <span className="text-xs font-mono font-bold">{modelName}</span>
            <div className="opacity-0 group-hover:opacity-100 absolute top-full right-0 mt-2 p-2 glass-panel text-[9px] w-48 transition-all pointer-events-none">
              Hybrid CNN (EfficientNet-B4) + Temporal LSTM (Spatio-temporal analysis). 5 frozen blocks.
            </div>
          </div>
        </div>

        {/* System Status Indicators */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-muted-dark bg-white/5">
            <Activity className={cn("w-3 h-3", backendOnline ? "text-accent-lime animate-pulse" : "text-accent-red")} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {backendOnline ? "System Online" : "System Offline"}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-muted-dark bg-white/5">
            <Cpu className="w-3 h-3 text-muted" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {systemDevice}
            </span>
          </div>
          
          {result?.latency_ms && (
            <div className="animate-in zoom-in-50 fade-in duration-500 flex items-center gap-2 px-3 py-1 rounded-full border border-accent-lime/20 bg-accent-lime/5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent-lime">
                ⚡ {result.latency_ms} ms
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
