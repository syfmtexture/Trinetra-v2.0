# Trinetra V2 - Frontend Implementation Plan

## 1. Architectural Overview & Vision

Trinetra requires a robust, high-performance frontend that matches the sophistication of its underlying hybrid deepfake detection model (EfficientNet-B4 + LSTM + Reality Defender). 

The goal is to transition from the current minimal Gradio interface to a **dedicated, premium web application**. The design language will emphasize a modern, "Glassbox" aesthetic—dark-themed, information-dense, and highly interactive, incorporating glassmorphism and subtle 3D interactions to feel best-in-class.

### Core Ecosystem
- **Main Web Dashboard**: A central hub for uploading media, viewing deep forensic analytics (Grad-CAM, Temporal Rollout), and managing analysis logs.
- **Chrome Extension Hook**: The dashboard will share design tokens and API communication patterns with the existing Chrome Extension `content.js`.
- **FastAPI Backend**: The frontend will communicate exclusively with the existing backend (`api.py`) for inference and health checks.

---

## 2. Technology Stack

> **⚠️ MANDATORY ARCHITECTURE DECISION**: The **entire frontend** of Trinetra V2 — including the main dashboard, all feature modules (Blast Radius Containment, SSMI Takedown Engine, Digital Lockdown Protocol), and every page/component — **must be built exclusively in Next.js (App Router)**. No standalone HTML/JS pages or alternative frameworks are permitted. All new features described in this document are to be implemented as Next.js pages and React components within the same Next.js project.

* **Framework**: **Next.js (App Router)** — Mandatory for the entire frontend. Provides optimal performance, file-based routing, server components, and SEO flexibility.
* **Core Logic**: React + TypeScript - Ensures type safety when handling complex forensic JSON payloads.
* **Styling**: Vanilla CSS with CSS Modules (or TailwindCSS if preferred) focusing on customized HSL color palettes, modern fonts (e.g., *Inter*, *Outfit*), and glassmorphic utility classes.
* **3D & Visualizations**: 
  * `Three.js` (via `@react-three/fiber` and `@react-three/drei`) — **Mandatory** for interactive, rotatable 3D visualizations.
  * **3D Heatmaps**: Volumetric or surface-based 3D Grad-CAM heatmaps that users can rotate and zoom to inspect spatial artifacts from all angles.
  * **3D Bar Graphs & Charts**: Deep forensic metrics (like Temporal Rollout or Jitter) rendered as rotatable 3D bar charts for a "Tactical" look.
  * `Chart.js` or `Recharts` — For secondary 2D fallback visualizations.
* **State Management**: Zustand or React Context for managing uploading states, analysis results, and forensic logs.
* **LLM Integration**: Groq API (Mandatory) or local Ollama endpoint for AI-generated legal payloads, pre-bunking messages, and crisis checklists.
* **Database**: MongoDB Atlas for persistent forensic history and user session management.

---

## 3. Core Pages and Routing

### `/login` (Authentication)
A high-premium, glassmorphic entry point.
* **`LoginForm`**: Minimalist fields for email/password.
* **`GuestLoginButton`**: A prominent "Access as Guest" button for immediate entry without credentials (limited persistence).
* **Animations**: Subtle 3D background effects (moving particles or scanned grid) to set the tone.

### `/` (Dashboard / Deepfake Analyzer)
The primary workspace for users.

#### Tab 1 — 🛡️ Executive Summary
* **Hero Section**: Sleek drag-and-drop zone for images/videos. Supported formats: JPEG, PNG, WEBP (≤10 MB), MP4/MOV/AVI/MKV (≤250 MB).
* **Analysis State**: Spinner/progress bar during backend processing. Displays `inference_latency_ms` prominently after completion (e.g., "Analyzed in 312 ms").
* **Dual-Verdict Display** — maps directly to the backend's cloud-priority logic:
  * **Primary Verdict Badge** (`primary_verdict`): Large `FAKE` / `REAL` badge with color coding (Crimson / Neon Lime).
  * **Primary Confidence Arc** (`confidence_score`): Animated circular gauge 0–100%.
  * **Source Label**: Shows whether verdict came from Cloud (Reality Defender) or Local (EfficientNet-B4 fallback), styled as a small tag.
  * **Local Model Sub-row**: Displays `local_label` + `local_confidence` as a secondary data point below the primary verdict.
  * **Cloud Sub-row**: Displays `rd_status` (AUTHENTIC / MANIPULATED / SUSPICIOUS / INCONCLUSIVE / SKIPPED / ERROR / DISABLED) + `rd_score` formatted as a percentage.
  * **Human-readable RD Summary** (`forensic_summary`): The plain-language explanation paragraph (mirrors `_get_rd_human_summary()` output).
* **Face Crop Display**: The detected face region (MTCNN output) shown as a small thumbnail next to the Grad-CAM overlay. If no face was found, shows "Full-Frame Fallback" badge.
* **3D Grad-CAM Heatmap**: An interactive, **rotatable 3D surface map** of the Grad-CAM detections. Users can orbit the face crop to see "hotspots" in a 3D volume, built with `@react-three/fiber`.
* **System Status Bar** (persistent, in nav): `GET /health` response — shows `EfficientNet-B4 + LSTM: Online`, `Reality Defender: Online/Offline`, and current inference device (`GPU` / `CPU`).

#### Tab 2 — 📈 Temporal Analysis *(Video Only)*
* **Per-Frame Anomaly Line Chart** (`per_frame_scores`): Interactive Recharts line plot. X-axis = Frame Index, Y-axis = Manipulation Confidence (%). Decision boundary line at 50%. Fill area red above 50%, green below.
* **Segment-Level Score Panel** (`segment_scores_pct`): Chip-row showing each segment's score (e.g., Seg1=72.3%, Seg2=85.1%, Seg3=61.0%). Ensemble formula shown in tooltip: `0.6×mean + 0.4×max`.
* **Temporal Consistency Warning** (`temporal_consistent`): If `false`, a pulsing amber alert banner renders: "⚠️ Temporal Inconsistency Detected — Manipulation may be localised to a specific segment."
* **3D Temporal Attention Rollout Chart**: A **rotatable 3D bar chart** of LSTM hidden-state confidence per frame. Each bar is a 3D pillar height-mapped to confidence.
  * **Shatter Frame Annotation** (`shatter_index`, `shatter_delta`): The frame with the largest inter-frame confidence jump is highlighted in amber (`#FFA657`) with a 3D floating label.

#### Tab 3 — 🔬 Deep Forensics (XAI)
* **ELA Noise Residual Image** (`noise_residual`): The amplified Error Level Analysis map displayed beside the original face crop. Tooltip explains: "Brighter regions indicate compression inconsistencies typical of AI-generated or edited faces."
* **Geometric Landmark Jitter Panel** (`geometric_jitter`) *(Video Only)*: 
  * 5-point radar/spider chart showing `per_landmark_variance` for `left_eye`, `right_eye`, `nose`, `mouth_left`, `mouth_right`.
  * Aggregate `jitter_score` shown prominently (higher = more instability = more likely synthetic).
  * `frame_count` shown as subtitle (e.g., "Analysed across 28 valid frames").
* **Reality Defender Model Breakdown** (`rd_result.models[]`): Expandable card per sub-model returned from RD API. Each card shows:
  * Model name (stripped of `rd-` prefix for readability).
  * Status: `MANIPULATED` (red) / `AUTHENTIC` (green) / `INCONCLUSIVE` (amber).
  * Highlights models that disagree with the overall verdict (the "forensic exception" case).
  * Shows `request_id`, `key_used_index`, `attempts`, `latency_ms` in a collapsible debug section.

#### Tab 4 — ⚙️ Raw Data & Logs
* **Forensic Triage Log Viewer** (`forensic_log`): Formatted, syntax-highlighted JSON block (monospace font). Displays:
  * `inference_latency_ms`
  * `face_tensor_dims`
  * `classification_label`, `fake_threshold`
  * `n_segments_analysed`, `segment_scores_pct`
  * `temporal_consistent`
  * `shatter_frame`, `shatter_delta` (if video)
  * `jitter_score` (if video)
  * `reality_defender` (nested RD result object)
* **Reality Defender Raw JSON** (`rd_result`): Separate JSON block showing the full `RDResult` response.
* **Copy to Clipboard** button on both JSON blocks.

### `/history` (Forensic Logs)
* A data table displaying previous analysis runs.
* Columns: Thumbnail, `primary_verdict`, `confidence_score`, `rd_status`, `local_confidence`, Inference Latency, Timestamp.
* Clicking a row reloads the full `AnalysisResponse` + `forensic_log` into the main dashboard.
(Use MongoDB atlas for this)

### `/extension-sync` (Chrome Extension Bridge)
* A page explaining how the web dashboard links with the Trinetra Chrome Extension (`content.js` + `background.js`).
* Documents the flow: Extension crops a face region → converts to base64 → `POST /analyze` → renders verdict in page overlay.
* Interactive API key configuration panel (for setting `RD_API_KEYS` via the backend `.env`).
* Shows current local server status (pings `GET /health`) and displays the model name and device in use.

---

## 4. Component Architecture

Building reusable, modular components is critical for maintaining the premium aesthetic.

### Core Layout
* **`GlassPanel`**: Wrapper applying frosted-glass effect (`backdrop-filter: blur(12px)`). Base for all content panels.
* **`SystemStatusBar`**: Persistent nav bar component. Pings `GET /health` on load and every 30s. Displays: model name (`EfficientNet-B4 + LSTM`), device (`GPU` / `CPU`), RD status (`Online` / `Offline`), and latency result.

### Upload & Analysis
* **`DragDropUploader`**: Handles file validation before API submission. Enforces: images ≤10MB (JPEG/PNG/WEBP), videos ≤250MB (MP4/MOV/AVI/MKV). Shows file type badge and size on drop.
* **`AnalysisProgressOverlay`**: Full-screen loading overlay shown during `POST /analyze`. Shows animated Trinetra eye logo and a running elapsed time counter.

### Verdict Display
* **`VerdictGauge`**: Animated circular gauge showing `confidence_score`. Animates from 0 to final value on render. Color: Crimson for FAKE, Neon Lime for REAL.
* **`DualVerdictPanel`**: Side-by-side display of:
  * **Primary** — `primary_verdict` + `confidence_score` (Cloud if RD online, Local if fallback)
  * **Local** — `local_label` + `local_confidence` from the local EfficientNet-B4 model
  * **Cloud** — `rd_status` + `rd_score` from Reality Defender
  * A small source tag showing which verdict is authoritative.
* **`FaceCropThumbnail`**: Renders the face crop detected via MTCNN. Shows "Full-Frame Fallback" badge if no face was detected. Displayed beside Grad-CAM overlay.
* **`InferenceLatencyBadge`**: Displays `latency_ms` in a subtle monospace badge (e.g., "⚡ 312 ms").

### Spatial XAI
* **`EvidenceVisualizer`**: Renders `gradcam_overlay` and `noise_residual` (PIL images from backend) side-by-side with zoom/pan capabilities (using `react-zoom-pan-pinch`). Includes heatmap color legend.
* **`ELANoiseViewer`**: Dedicated component for the `noise_residual` ELA map. Shows the amplified JPEG re-compression difference. Tooltip: "Bright regions = compression inconsistencies = AI manipulation boundary scars."

### Temporal XAI
* **`TemporalAnomalyChart`**: Recharts `LineChart` mapped to `per_frame_scores`. Decision boundary at 50%. Filled areas above/below. Interactive tooltip on hover per frame.
* **`SegmentScoreRow`**: Chip-style display for `segment_scores_pct`. Each chip labeled `Seg N`. Tooltip shows: `0.6×mean + 0.4×max` formula.
* **`TemporalConsistencyAlert`**: Renders an amber pulsing banner when `temporal_consistent === false`.
* **`TemporalAttentionRolloutChart`**: Bar chart for `temporal_rollout.per_frame_confidence`. Bars color-coded red/green by 50% threshold. `shatter_index` bar highlighted amber with an annotated arrow showing `Δ{shatter_delta}%`.

### Geometric XAI
* **`GeometricJitterPanel`**: Visual for `geometric_jitter` data (video only).
  * Spider/radar chart (or set of progress bars) for `per_landmark_variance` across the 5 MTCNN landmarks (`left_eye`, `right_eye`, `nose`, `mouth_left`, `mouth_right`).
  * Large `jitter_score` numeric display with color coding (low = green, high = red).
  * `frame_count` subtitle showing how many valid frames contributed.

### Reality Defender(KEEP THIS OPTIONAL with a warning that recommended since our lightweight model's accuracy is 60%)
* **`RDModelBreakdown`**: Expandable accordion per model in `rd_result.models[]`. Each entry shows model name, verdict badge, and flags "Forensic Exception" if the model disagrees with the top-level RD verdict. Debug section shows `request_id`, `key_used_index`, `attempts`, `latency_ms`.
* **`RDStatusChip`**: Inline status badge showing AUTHENTIC / MANIPULATED / SUSPICIOUS / INCONCLUSIVE / SKIPPED / ERROR / DISABLED with appropriate color-coding.

### Authentication & Access
* **`LoginForm`**: Glassmorphic card for user credentials. Uses Framer Motion for entry transitions.
* **`GuestLoginButton`**: Styled as a secondary, low-friction entry point with a "Neon Lime" glow on hover.

### 3D Visualizations (Three.js Suite)
* **`ThreeJSHeatmap`**: A component that takes the Grad-CAM data and wraps it onto a 3D geometry (plane or face-mask mesh). Supports full orbit control (rotation/zoom).
* **`Rotatable3DBarChart`**: Custom pillar-based visualization for temporal data. Uses `OrbitControls` to allow 360-degree inspection of frame-by-frame hidden states.

### Logs & Data
* **`ForensicTriageLogViewer`**: Syntax-highlighted JSON block for `forensic_log`. Displays all keys in a formatted, monospace panel with a "Copy" button.
* **`RDRawJsonViewer`**: Separate viewer for the raw `rd_result` JSON response from the Reality Defender API.
* **`TimelineChart`**: Reusable chart wrapper (used by `TemporalAnomalyChart` internally) — maps any `number[]` to a line/bar chart with shared styling.
* **`MongoDBHistoryPanel`**: Integrated view of analysis history fetched from MongoDB Atlas.

---

## 5. API Integration Strategy

The frontend will communicate with `api.py` (running on `http://127.0.0.1:8000`).

### Endpoints to Consume

#### `GET /health`
* **Action**: Pinged on app load and every 30 seconds.
* **Response**: `{ "status": "online", "model": "EfficientNet-B4 + LSTM" }`
* **UI**: Updates `SystemStatusBar` — shows model name, sets `Local Core: Online/Offline`, infers device from backend environment.

#### `POST /analyze`
* **Payload**: `{ "base64_data": "data:image/png;base64,..." }` — file converted client-side to a data URL base64 string.
* **Response** — Full `AnalysisResponse` field mapping to UI:

| Field | Type | Frontend Usage |
|---|---|---|
| `primary_verdict` | `"FAKE" \| "REAL"` | Large verdict badge, page background tint, badge color |
| `confidence_score` | `float` (0–100) | `VerdictGauge` arc animation, primary % display |
| `local_label` | `"FAKE" \| "REAL"` | `DualVerdictPanel` local row |
| `local_confidence` | `float` (0–100) | `DualVerdictPanel` local confidence % |
| `rd_status` | `string` | `RDStatusChip` color badge; one of: AUTHENTIC, MANIPULATED, SUSPICIOUS, INCONCLUSIVE, SKIPPED, ERROR, DISABLED |
| `rd_score` | `float \| null` | `DualVerdictPanel` cloud row, formatted as % |
| `forensic_summary` | `string` | Human-readable RD summary paragraph in Executive Summary tab |
| `latency_ms` | `float` | `InferenceLatencyBadge`, shown post-analysis |

* **Note on dual-verdict priority logic** (from `api.py` lines 87–99):
  * If RD returns `FAKE / MANIPULATED / SUSPICIOUS` → `primary_verdict = "FAKE"`, confidence = `rd_score × 100`.
  * If RD returns `AUTHENTIC` → `primary_verdict = "REAL"`, confidence = `(1 - rd_score) × 100`.
  * If RD is `DISABLED / INCONCLUSIVE / offline` → fall back to local EfficientNet-B4 verdict.
  * The frontend must display the **source tag** ("Cloud" or "Local Fallback") on the `DualVerdictPanel` to make this transparent to the user.

#### `POST /takedown/generate` *(New — Phase 7)*
* Accepts: `{ forensic_result: AnalysisResponse, platform: "meta" | "x" | "youtube" }`
* Returns: Platform-specific legal compliance payload (JSON).

#### `POST /takedown/submit/{platform}` *(New — Phase 7)*
* Proxies the formatted payload to the respective platform's reporting endpoint.
* Returns: `{ success: bool, reference_id: string, timestamp: string }`

### State Management (Zustand Store Shape)
```typescript
interface TrinetraStore {
  // Upload state
  uploadedFile: File | null;
  isAnalyzing: boolean;

  // Analysis results — maps 1:1 to AnalysisResponse
  primaryVerdict: 'FAKE' | 'REAL' | null;
  confidenceScore: number | null;
  localLabel: string | null;
  localConfidence: number | null;
  rdStatus: string | null;
  rdScore: number | null;
  forensicSummary: string | null;
  latencyMs: number | null;

  // XAI outputs (returned by app.py / infer.py, exposed via extended API)
  gradcamOverlay: string | null;       // base64 PIL image
  perFrameScores: number[] | null;     // per_frame_scores
  temporalRollout: TemporalRollout | null; // { per_frame_confidence, shatter_index, shatter_delta }
  noiseResidual: string | null;        // base64 PIL image (ELA map)
  geometricJitter: GeometricJitter | null; // { per_landmark_variance, jitter_score, frame_count }
  rdResult: RDResult | null;           // full rd_result dict
  forensicLog: ForensicLog | null;     // full forensic_log dict
  segmentScores: number[] | null;      // segment_scores_pct
  temporalConsistent: boolean | null;  // temporal_consistent

  // System
  backendOnline: boolean;
  modelName: string;
}
```

---

## 6. Design & Aesthetic Guidelines (The "Glassbox" UI)

To achieve the "WOW" factor requested in past interactions:

1. **Color Palette**:
   * **Background**: Deep obsidian/charcoal (`#0B0C10` to `#111112`).
   * **Accents**: Neon Lime (`#D2FF00`) for success/REAL, Crimson/Neon Red (`#F85149`) for danger/FAKE.
   * **Surfaces**: Semi-transparent dark grays with `backdrop-filter: blur(12px)` for panels.
2. **Typography**:
   * Default to high-legibility modern sans-serif like *Inter*.
   * Use bold, angular fonts (e.g., *Anton* or *Oswald*) for large metric displays.
3. **Animations**:
   * Elements should fade and slide in slightly upon rendering.
   * Hover effects on interactive panels should trigger a subtle 3D tilt (parallax) effect, making the dashboard feel tactile and alive.
4. **Data Density**: 
   * Information should be dense but hierarchically organized. Executive summaries are large and prominent; deep forensics are neatly tucked into accordions or secondary tabs.

---

## 7. Implementation Roadmap

* **Phase 0: Authentication & Secure Access**
  * Implement the Login Page, Guest Access logic, and MongoDB Atlas connection for user session persistence.
* **Phase 1: Setup & Scaffolding**
  * Initialize Next.js project. Setup absolute imports and global CSS variables for the dark theme.
* **Phase 2: Core Components & Layout**
  * Build the Navigation, GlassPanels, and the main Layout shell.
* **Phase 3: The Uploader & API Hookup**
  * Implement the Drag & Drop zone. 
  * Write the `fetch` wrappers targeting `http://127.0.0.1:8000`.
* **Phase 4: Data Visualization (2D + 3D)**
  * Hook up Recharts for 2D charts and **setup the Three.js canvas** for rotatable 3D heatmaps and bar charts.
* **Phase 5: Polish & Animations**
  * Add the 3D tilt effects, smooth transitions between loading and loaded states, and refine the color contrast.
* **Phase 6: Blast Radius Containment Module** — Pre-bunking defense package with WhatsApp message composer and simplified forensic report attachment.
* **Phase 7: SSMI Takedown Engine** — Automated legal payload generator for Meta, X (Twitter), and YouTube compliance APIs.
* **Phase 8: Digital Lockdown Protocol** — LLM-powered crisis manager with rigid step-by-step digital security checklist.

---

## 8. Feature: Blast Radius Containment

### Purpose
When a deepfake is detected, the victim's immediate fear is uncontrolled viral spread. This module gives the victim a pre-built, credible defense they can deploy in minutes — killing the rumor before it reaches their extended network.

### Route
`/blast-radius` — accessible from the Verdict screen immediately after a `FAKE` verdict is confirmed.

### UI Components (Next.js)
* **`BlastRadiusPanel`** (`GlassPanel` variant): A dedicated full-screen modal or side-drawer that activates automatically post-verdict.
* **`MessageComposer`**: A pre-filled, AI-drafted WhatsApp-ready text block.
  * Tone: Calm, credible, non-panicked.
  * Content: States the video is confirmed synthetic, references Trinetra forensic analysis, and instructs recipients not to share.
  * Allows the victim to lightly edit (name, relationship context) before copying.
* **`ForensicReportAttachment`**: A simplified, one-page forensic summary card generated from the full analysis data:
  * Verdict badge (FAKE — Confirmed Synthetic).
  * Top 3 evidence points in plain language (e.g., "Temporal anomaly detected in frames 12–45", "Facial landmark inconsistency at 87% confidence").
  * Trinetra logo + timestamp watermark for credibility.
  * Exportable as a **PNG card** (using `html2canvas`) or **PDF** (using `jsPDF`) ready to attach to WhatsApp.
* **`ShareButtons`**: One-tap copy-to-clipboard for the message text. Deep-link button to open WhatsApp Web with the message pre-populated via the `wa.me` API.

### AI Agent Behavior
* On confirmed FAKE verdict, a Next.js **Server Action** calls the Gemini API.
* **Prompt template**: Passes the victim's context (media type, platform where found, forensic confidence score) and instructs the model to generate a calm, highly credible 3-paragraph WhatsApp message in plain language.
* Result is streamed back to the `MessageComposer` component using React's `use()` hook or a streaming state pattern.

### Design Notes
* Panel background: Deep crimson glass (`rgba(248, 81, 73, 0.08)`) with a Neon Lime action button (`#D2FF00`).
* The forensic summary card uses a dark-card design with a subtle Trinetra watermark.
* Animate in with a slide-up transition on verdict confirmation.

### Roadmap Integration
* Phase 6 of Implementation Roadmap.

---

## 9. Feature: Automated Platform Takedowns (SSMI Strikes)

### Purpose
Under the 2026 IT Rules (DPDP Act / SSMI obligations), platforms are mandated to remove flagged synthetic media within **3 hours** of a valid complaint. This engine converts a confirmed Trinetra detection into a perfectly formatted, one-click legal strike across Meta, X (Twitter), and YouTube — turning a multi-hour help-center nightmare into a single automated action.

### Route
`/takedown` — accessible from the Verdict screen alongside the Blast Radius panel.

### UI Components (Next.js)
* **`TakedownDashboard`**: Main page showing three platform cards (Meta, X, YouTube), each with:
  * Platform logo and color accent.
  * Status indicator: `PENDING` → `GENERATING` → `READY TO FIRE` → `SUBMITTED`.
  * A preview of the generated compliance payload.
* **`PayloadPreviewCard`** (per platform): Expandable accordion showing the exact JSON/form payload that will be submitted. Read-only but copy-able.
* **`OneClickStrikeButton`**: A large, prominent action button per platform. On click, dispatches the formatted payload to the backend, which proxies the request to the respective platform's reporting endpoint.
* **`SubmissionLog`**: A real-time log panel at the bottom showing HTTP responses, reference IDs, and timestamps for each submission.

### AI Agent Behavior
* A Next.js **Server Action** (or API route at `/api/takedown/generate`) calls the Gemini API with:
  * The forensic analysis result (confidence score, evidence summary, media hash).
  * The target platform identifier (`meta | x | youtube`).
  * A structured prompt instructing the model to output a **valid JSON payload** matching the platform's reporting API schema.
* **Platform-specific payload formats**:
  * **Meta**: Matches the Facebook/Instagram `intellectual_property` or `non_consensual_intimate_images` report schema. Includes `content_url`, `violation_type: synthetic_media`, `evidence_description`, `reporter_contact`.
  * **X (Twitter)**: Matches the X synthetic media policy report format. Includes `tweet_url`, `media_category: deepfake`, `forensic_summary`, `policy_violation: synthetic_impersonation`.
  * **YouTube**: Matches the YouTube Privacy/Impersonation claim format. Includes `video_url`, `claim_type: synthetic_media`, `detailed_description`, `supporting_evidence_url`.
* Payloads are validated against a Zod schema before submission to prevent malformed requests.

### Backend Integration
* New FastAPI endpoints to be added to `api.py`:
  * `POST /takedown/generate` — accepts forensic result + platform, returns AI-generated payload.
  * `POST /takedown/submit/{platform}` — submits formatted payload to platform reporting endpoint (proxied to avoid CORS).
* Submission responses are stored in the Forensic Log history (`/history`).

### Design Notes
* Each platform card uses its brand color as a subtle glass tint (Meta blue, X dark, YouTube red).
* The `OneClickStrikeButton` uses a pulsing Neon Lime glow animation when ready to fire.
* Submission success shows a green checkmark animation; failure shows the raw error with a retry option.

### Roadmap Integration
* Phase 7 of Implementation Roadmap.

---

## 10. Feature: Digital Lockdown Protocol

### Purpose
Victims of NCII (Non-Consensual Intimate Imagery) or financial identity cloning are in crisis — they won't think clearly. This module acts as a **tactical guide, not a therapist**. It immediately surfaces a rigid, step-by-step digital security checklist, walks victims through locking down their entire digital footprint, and handles backend reporting simultaneously. Every instruction includes a direct action link — no searching required.

### Route
`/lockdown` — accessible immediately from the Verdict screen. Can also be accessed independently.

### UI Components (Next.js)
* **`LockdownInitiator`**: A prominent "ACTIVATE LOCKDOWN" button on the Verdict screen (shown only on FAKE verdict). Styled with pulsing crimson animation to convey urgency.
* **`CrisisCommandCenter`** (`/lockdown` page): The core UI. Split into two panels:
  * **Left Panel — The Tactical Checklist**: An ordered, numbered list of immediate actions. Each item has:
    * A bold action statement (e.g., "Make your Instagram account private NOW.").
    * A direct deep-link button (e.g., → Opens `instagram.com/accounts/privacy/` directly).
    * A checkbox that the victim ticks as they complete each step.
    * A status state: `PENDING` | `IN PROGRESS` | `DONE`.
  * **Right Panel — The LLM Crisis Manager**: A chat-like interface with a local LLM (Gemini Flash or local Ollama model) acting as a tactical guide.
    * **NOT a therapy chatbot** — system prompt strictly constrains it to security actions, resource links, and sequential instructions only.
    * The LLM adapts its guidance based on which checklist items are complete and what the victim reports.
    * Responses are short, numbered, and directive (no empathy filler phrases).
* **`ProgressTracker`**: A top-bar progress indicator showing `X of Y lockdown steps completed`.

### Checklist Content (AI-Generated + Static Defaults)
The checklist is seeded by a Gemini API call that takes the attack type (`ncii | financial_clone | reputation_deepfake`) as input and generates a prioritized list. Static fallback defaults include:
1. Set Instagram to private → `instagram.com/accounts/privacy/`
2. Set Facebook profile to Friends Only → `facebook.com/settings?tab=privacy`
3. Enable two-factor authentication on all accounts → `myaccount.google.com/security`
4. Freeze biometric banking access → Direct link to victim's bank (configurable).
5. Change primary email password immediately.
6. Do NOT engage with the extortionist — document all messages.
7. File a formal SSMI complaint on Trinetra → Redirects to `/takedown`.
8. Contact the National Cyber Crime Portal → `cybercrime.gov.in`
9. Inform a trusted person (family/friend) — do not face this alone.
10. Screenshot and preserve all evidence before blocking the attacker.

### LLM Crisis Manager Behavior
* **Model**: Gemini 2.0 Flash (via Next.js Server Action) or a locally running `llama3` / `phi3` model via Ollama for fully offline operation.
* **System Prompt Constraints**:
  * Role: "You are a tactical digital security advisor. Your job is to give short, numbered, actionable instructions only. Do not express sympathy or offer emotional support. Do not discuss anything outside of digital security, account protection, and evidence preservation."
  * Context: Injected with the current checklist state (which steps are done) and the detected attack type.
* **Streaming**: Responses stream token-by-token into the chat panel using React streaming state for a real-time feel.
* **Offline Mode**: If no network is available, the LLM falls back to a pre-computed static response tree stored as a JSON file, ensuring the checklist is always accessible.

### Design Notes
* The `/lockdown` page uses a high-contrast dark-red glass aesthetic to signal urgency without being alarming.
* Checklist items animate in sequentially with a staggered slide-in effect.
* Completed items are visually struck through with a green checkmark and reduced opacity.
* The entire page is optimized for **mobile-first use** — victims will likely be on their phones.
* A persistent top banner shows: `🔒 LOCKDOWN ACTIVE — X steps remaining`.

### Roadmap Integration
* Phase 8 of Implementation Roadmap.

---

## 11. Backend → Frontend Feature Coverage Map

This table is the **canonical reference** ensuring every backend capability is surfaced in the Next.js frontend. Any backend field not listed here must be added before a phase is considered complete.

### 11.1 `InferenceResult` Fields (`infer.py`)

| Backend Field | Source Module | Frontend Component | Page/Tab |
|---|---|---|---|
| `fake_probability` | `infer.py` | `VerdictGauge` (drives animation) | `/` — Executive Summary |
| `label` (`FAKE`/`REAL`) | `infer.py` | `DualVerdictPanel`, verdict badge | `/` — Executive Summary |
| `face_crop` | `infer.py` (MTCNN) | `FaceCropThumbnail` (shows MTCNN crop or "Full-Frame Fallback" badge) | `/` — Executive Summary |
| `gradcam_overlay` | `infer.py` (GradCAM) | `EvidenceVisualizer` (zoom/pan, color legend) | `/` — Deep Forensics |
| `per_frame_scores` | `infer.py` (video) | `TemporalAnomalyChart` (line chart, 50% boundary) | `/` — Temporal Analysis |
| `temporal_rollout.per_frame_confidence` | `xai.py` | `TemporalAttentionRolloutChart` (bar chart, red/green) | `/` — Temporal Analysis |
| `temporal_rollout.shatter_index` | `xai.py` | Amber highlighted bar + annotation arrow | `/` — Temporal Analysis |
| `temporal_rollout.shatter_delta` | `xai.py` | `Δ{delta}%` annotation on shatter bar | `/` — Temporal Analysis |
| `noise_residual` | `xai.py` (ELA) | `ELANoiseViewer` (amplified JPEG diff map) | `/` — Deep Forensics |
| `geometric_jitter.per_landmark_variance` | `xai.py` | `GeometricJitterPanel` spider/radar chart | `/` — Deep Forensics |
| `geometric_jitter.jitter_score` | `xai.py` | Large numeric in `GeometricJitterPanel` (color-coded) | `/` — Deep Forensics |
| `geometric_jitter.frame_count` | `xai.py` | Subtitle in `GeometricJitterPanel` | `/` — Deep Forensics |
| `rd_result.status` | `reality_defender.py` | `RDStatusChip`, `DualVerdictPanel` cloud row | `/` — Executive Summary |
| `rd_result.overall_score` | `reality_defender.py` | `DualVerdictPanel` cloud confidence % | `/` — Executive Summary |
| `rd_result.models[]` | `reality_defender.py` | `RDModelBreakdown` accordion (per-model verdicts) | `/` — Deep Forensics |
| `rd_result.request_id` | `reality_defender.py` | Debug section in `RDModelBreakdown` | `/` — Deep Forensics |
| `rd_result.key_used_index` | `reality_defender.py` | Debug section in `RDModelBreakdown` | `/` — Deep Forensics |
| `rd_result.attempts` | `reality_defender.py` | Debug section in `RDModelBreakdown` | `/` — Deep Forensics |
| `rd_result.latency_ms` | `reality_defender.py` | Debug section in `RDModelBreakdown` | `/` — Deep Forensics |
| `rd_result.error` | `reality_defender.py` | Error state in `RDStatusChip` / `DualVerdictPanel` | `/` — Executive Summary |
| `forensic_log.inference_latency_ms` | `infer.py` | `InferenceLatencyBadge` + `ForensicTriageLogViewer` | `/` — all tabs |
| `forensic_log.face_tensor_dims` | `infer.py` | `ForensicTriageLogViewer` (raw log only) | `/` — Raw Data |
| `forensic_log.classification_label` | `infer.py` | `ForensicTriageLogViewer` | `/` — Raw Data |
| `forensic_log.fake_threshold` | `infer.py` | `ForensicTriageLogViewer` (shown as 50%) | `/` — Raw Data |
| `forensic_log.n_segments_analysed` | `infer.py` | `SegmentScoreRow` subtitle | `/` — Temporal Analysis |
| `forensic_log.segment_scores_pct` | `infer.py` | `SegmentScoreRow` chip row | `/` — Temporal Analysis |
| `forensic_log.temporal_consistent` | `infer.py` | `TemporalConsistencyAlert` amber banner | `/` — Temporal Analysis |
| `forensic_log.shatter_frame` | `infer.py` | Referenced in `ForensicTriageLogViewer` | `/` — Raw Data |
| `forensic_log.shatter_delta` | `infer.py` | Referenced in `ForensicTriageLogViewer` | `/` — Raw Data |
| `forensic_log.jitter_score` | `infer.py` | Referenced in `ForensicTriageLogViewer` | `/` — Raw Data |
| `forensic_log.reality_defender` | `infer.py` | `RDRawJsonViewer` nested inside `ForensicTriageLogViewer` | `/` — Raw Data |

### 11.2 `AnalysisResponse` Fields (`api.py` — FastAPI endpoint)

| API Response Field | Frontend Component | Notes |
|---|---|---|
| `primary_verdict` | `DualVerdictPanel`, verdict badge, page background tint | Cloud > Local priority per `api.py` logic |
| `confidence_score` | `VerdictGauge` arc | Cloud-derived if RD online, local-derived if fallback |
| `local_label` | `DualVerdictPanel` local row | Always the raw local EfficientNet-B4 output |
| `local_confidence` | `DualVerdictPanel` local confidence % | Always shown as secondary even if cloud wins |
| `rd_status` | `RDStatusChip`, `DualVerdictPanel` cloud row | 7 possible states displayed with distinct colors |
| `rd_score` | `DualVerdictPanel` cloud row | Shown as `rd_score × 100` percent |
| `forensic_summary` | Human-readable summary paragraph in Executive Summary | Mirrors `_get_rd_human_summary()` from `app.py` |
| `latency_ms` | `InferenceLatencyBadge` | Shown post-analysis as "⚡ 312 ms" |

### 11.3 System & Model Features (`config.py`, `model.py`, `health` endpoint)

| Backend Feature | Frontend Component | Notes |
|---|---|---|
| `EfficientNet-B4 + LSTM` (model architecture) | `SystemStatusBar` — model name display | Shown on nav bar always |
| `DEVICE` (`cuda` / `cpu`) | `SystemStatusBar` — GPU/CPU badge | Inferred from `/health` or backend env |
| `RD_ENABLED` (API key presence) | `RDStatusChip` — "DISABLED" state | Shown when no RD keys are configured |
| `FREEZE_BLOCKS = 5` | Tooltip in `SystemStatusBar` or `/extension-sync` — "5 frozen EfficientNet blocks" | Technical detail for power users |
| `SEQ_LEN = 10` | Tooltip in `SegmentScoreRow` — "10 frames per segment" | Shown in temporal analysis tooltips |
| `N_SEGMENTS = 3` | `SegmentScoreRow` chip count | 3 chips shown for N_SEGMENTS analysis windows |
| `FAKE_THRESHOLD = 0.50` | `ForensicTriageLogViewer`, decision boundary line in `TemporalAnomalyChart` | 50% boundary line always visible |
| File size limits (10MB image, 250MB video) | `DragDropUploader` validation error toasts | Enforced before upload, mirrors `RD_MAX_*_SIZE_MB` |

### 11.4 XAI Modules (`xai.py`)

| XAI Module | Algorithm | Frontend Visualization |
|---|---|---|
| **Temporal Attention Rollout** (`temporal_attention_rollout`) | LSTM hidden-state sigmoid per frame | `TemporalAttentionRolloutChart` — bar chart + shatter annotation |
| **Noise Residual Extraction** (`noise_residual_extraction`) | Error Level Analysis (ELA) — JPEG re-compression amplified diff | `ELANoiseViewer` — side-by-side with face crop |
| **Geometric Jitter Mapping** (`geometric_jitter_mapping`) | MTCNN 5-point landmark variance, normalized by inter-ocular distance | `GeometricJitterPanel` — radar chart + aggregate jitter score |

### 11.5 Chrome Extension (`extension/`)

| Extension File | Role | Frontend Integration Point |
|---|---|---|
| `content.js` | Crops face regions from web pages, converts to base64 data URL | Documented on `/extension-sync`. Future: live sync panel. |
| `background.js` | Calls `POST /analyze`, relays `AnalysisResponse` to content script | Documented on `/extension-sync`. Port + CORS setup guide. |

### 11.6 Dual-Verdict Source Tag Logic (Frontend Requirement)

The frontend **must** display a visible source tag on the `DualVerdictPanel` to show the user which system produced the primary verdict. Reference logic from `api.py`:

| Condition | `primary_verdict` | `confidence_score` | Source Tag |
|---|---|---|---|
| `rd_status ∈ {FAKE, MANIPULATED, SUSPICIOUS}` | `"FAKE"` | `rd_score × 100` | 🛡️ Cloud (Reality Defender) |
| `rd_status == AUTHENTIC` | `"REAL"` | `(1 - rd_score) × 100` | 🛡️ Cloud (Reality Defender) |
| `rd_status ∈ {DISABLED, INCONCLUSIVE, ERROR, SKIPPED}` | `local_label` | `local_confidence` | 💻 Local Fallback (EfficientNet-B4) |
