import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { advanceScan } from '@/lib/api';

interface AdvancedScanTabProps {
  file: File;
}

export function AdvancedScanTab({ file }: AdvancedScanTabProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await advanceScan(file);
      setAnalysis(result.analysis);
    } catch (err: any) {
      setError(err.message || 'Advanced scan failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold">Deep Forensic Analysis</h3>
            <p className="text-sm text-muted-foreground">Powered by Gemini Gemma-4-31B-IT</p>
          </div>
        </div>

        {!analysis && !isLoading && !error && (
          <div className="mt-6 flex flex-col items-center justify-center py-10 text-center border border-dashed border-border rounded-xl bg-muted/30">
            <p className="text-muted-foreground mb-4 max-w-sm text-sm">
              Run an advanced multimodal scan to inspect every visible region for signs of AI generation, face swapping, body editing, and synthetic reconstruction.
            </p>
            <button
              onClick={handleScan}
              className="px-6 py-2.5 rounded-xl bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors flex items-center gap-2 shadow-glow"
            >
              <Sparkles className="h-4 w-4" /> Start Advanced Scan
            </button>
          </div>
        )}

        {isLoading && (
          <div className="mt-6 flex flex-col items-center justify-center py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-orange mb-4" />
            <p className="text-sm font-medium animate-pulse text-foreground">
              Running deep multimodal forensic analysis...
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              This may take up to 20 seconds depending on image complexity.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div className="text-sm">{error}</div>
          </div>
        )}

        {analysis && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <div className="prose prose-sm dark:prose-invert max-w-none bg-muted/30 p-5 rounded-xl border border-border whitespace-pre-wrap">
              {analysis}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleScan}
                className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-medium text-sm transition-colors"
              >
                Rescan Image
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
