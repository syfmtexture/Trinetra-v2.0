export type Verdict = 'FAKE' | 'REAL';

export interface RDModel {
  name: string;
  status: 'AUTHENTIC' | 'MANIPULATED' | 'SUSPICIOUS' | 'INCONCLUSIVE' | 'SKIPPED' | 'ERROR' | 'DISABLED';
  score?: number;
}

export interface RDResult {
  status: string;
  overall_score: number;
  models: RDModel[];
  request_id: string;
  key_used_index: number;
  attempts: number;
  latency_ms: number;
  error?: string;
}

export interface TemporalRollout {
  per_frame_confidence: number[];
  shatter_index: number;
  shatter_delta: number;
}

export interface GeometricJitter {
  per_landmark_variance: Record<string, number>;
  jitter_score: number;
  frame_count: number;
}

export interface ForensicLog {
  inference_latency_ms: number;
  face_tensor_dims: number[];
  classification_label: Verdict;
  fake_threshold: number;
  n_segments_analysed: number;
  segment_scores_pct: number[];
  temporal_consistent: boolean | null;
  shatter_frame?: number;
  shatter_delta?: number;
  jitter_score?: number;
  reality_defender?: RDResult;
}

export interface AnalysisResponse {
  primary_verdict: Verdict;
  confidence_score: number;
  local_label: Verdict;
  local_confidence: number;
  rd_status: string;
  rd_score: number | null;
  forensic_summary: string;
  latency_ms: number;
  // Extended fields from the full inference result
  gradcam_overlay?: string; // base64
  per_frame_scores?: number[];
  temporal_rollout?: TemporalRollout;
  noise_residual?: string; // base64
  geometric_jitter?: GeometricJitter;
  rd_result?: RDResult;
  forensic_log?: ForensicLog;
}

export interface HealthResponse {
  status: string;
  model: string;
}
