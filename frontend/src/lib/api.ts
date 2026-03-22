/**
 * api.ts — Frontend API service layer for Trinetra backend.
 * 
 * Communicates with the FastAPI backend at /api/backend/* (proxied by Next.js rewrites).
 * 
 * Backend endpoints:
 *   POST /analyze  — Send base64-encoded media for deepfake analysis
 *   GET  /health   — Check backend health status
 */

const API_BASE = '/api/backend';

// ── Types matching the FastAPI AnalysisResponse model ──

export interface AnalysisResponse {
  primary_verdict: 'FAKE' | 'REAL';
  confidence_score: number;    // 0-100
  local_label: string;
  local_confidence: number;    // 0-100
  rd_status: string | null;
  rd_score: number | null;
  forensic_summary: string;
  latency_ms: number;
  face_crop_base64?: string;
  gradcam_base64?: string;
}

export interface HealthResponse {
  status: string;
  model: string;
}

// ── Health Check ──

export async function checkHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE}/health`, {
    method: 'GET',
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
}

// ── Analyze Media ──

/**
 * Convert a File object to a base64 data URL string.
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Send a file for deepfake analysis.
 * Encodes the file as base64 and POSTs to the /analyze endpoint.
 */
export async function analyzeMedia(file: File): Promise<AnalysisResponse> {
  const base64Data = await fileToBase64(file);

  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64_data: base64Data }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(errorBody.detail || `Analysis failed: ${res.status}`);
  }

  return res.json();
}

/**
 * Subscribe a user's email to the newsletter.
 */
export async function subscribeToNewsletter(email: string): Promise<{ status: string, message: string }> {
  const res = await fetch(`${API_BASE}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ detail: 'Subscription failed' }));
    throw new Error(errorBody.detail || `Subscription failed: ${res.status}`);
  }

  return res.json();
}
