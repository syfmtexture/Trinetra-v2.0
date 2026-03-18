"""
app.py — Trinetra Verdict Presentation Layer.

Minimal Gradio Blocks UI focused on forensic explainability.
Run with:  python app.py
"""

import json
import os

import gradio as gr
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

from src.inference.infer import run_inference, InferenceResult
from src.core.config import CHECKPOINT_DIR


# ──────────────────────────────────────────────
#  Temporal Anomaly Plot
# ──────────────────────────────────────────────

def _build_temporal_plot(scores: list[float] | None):
    """Return a matplotlib Figure or None if no temporal data."""
    if scores is None or len(scores) <= 1:
        return None

    fig, ax = plt.subplots(figsize=(8, 3), dpi=100)
    fig.patch.set_facecolor("#0d1117")
    ax.set_facecolor("#0d1117")

    x = np.arange(1, len(scores) + 1)
    y = np.array(scores)

    # Color the line red above 50%, green below
    ax.plot(x, y, color="#f85149", linewidth=2, marker="o",
            markersize=6, markerfacecolor="#f85149", markeredgecolor="white",
            markeredgewidth=1, zorder=3)
    ax.axhline(y=50, color="#8b949e", linestyle="--", linewidth=1,
               alpha=0.6, label="Decision boundary")
    ax.fill_between(x, y, 50, where=(y >= 50),
                    color="#f85149", alpha=0.15, interpolate=True)
    ax.fill_between(x, y, 50, where=(y < 50),
                    color="#3fb950", alpha=0.15, interpolate=True)

    ax.set_xlabel("Frame Index", color="#c9d1d9", fontsize=10)
    ax.set_ylabel("Manipulation Confidence (%)", color="#c9d1d9", fontsize=10)
    ax.set_title("Temporal Anomaly Distribution", color="#e6edf3",
                 fontsize=12, fontweight="bold", pad=10)
    ax.set_xlim(0.5, len(scores) + 0.5)
    ax.set_ylim(0, 100)
    ax.set_xticks(x)
    ax.tick_params(colors="#8b949e", labelsize=9)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.spines["bottom"].set_color("#30363d")
    ax.spines["left"].set_color("#30363d")
    ax.legend(loc="upper right", fontsize=8, facecolor="#0d1117",
              edgecolor="#30363d", labelcolor="#8b949e")
    fig.tight_layout()
    return fig


# ──────────────────────────────────────────────
#  Temporal Attention Rollout Plot
# ──────────────────────────────────────────────

def _build_rollout_plot(rollout: dict | None):
    """Bar chart of LSTM per-frame confidence with shatter-point."""
    if rollout is None:
        return None

    confs = rollout["per_frame_confidence"]
    shatter = rollout["shatter_index"]
    shatter_d = rollout["shatter_delta"]

    fig, ax = plt.subplots(figsize=(8, 3), dpi=100)
    fig.patch.set_facecolor("#0d1117")
    ax.set_facecolor("#0d1117")

    x = np.arange(1, len(confs) + 1)
    colors = ["#f85149" if c >= 50 else "#3fb950" for c in confs]
    bars = ax.bar(x, confs, color=colors, edgecolor="#30363d",
                  linewidth=0.8, width=0.65, zorder=3)

    # Highlight shatter frame
    if shatter < len(x):
        ax.bar(x[shatter], confs[shatter], color="#ffa657",
               edgecolor="white", linewidth=1.5, width=0.65, zorder=4)
        ax.annotate(
            f"SHATTER\n\u0394{shatter_d:.1f}%",
            xy=(x[shatter], confs[shatter]),
            xytext=(x[shatter], min(confs[shatter] + 12, 98)),
            ha="center", fontsize=8, fontweight="bold",
            color="#ffa657",
            arrowprops=dict(arrowstyle="->", color="#ffa657", lw=1.2),
        )

    ax.axhline(y=50, color="#8b949e", linestyle="--", linewidth=1, alpha=0.6)
    ax.set_xlabel("Frame Index", color="#c9d1d9", fontsize=10)
    ax.set_ylabel("LSTM Activation (%)", color="#c9d1d9", fontsize=10)
    ax.set_title("Temporal Attention Rollout — LSTM Hidden State Confidence",
                 color="#e6edf3", fontsize=11, fontweight="bold", pad=10)
    ax.set_xlim(0.3, len(confs) + 0.7)
    ax.set_ylim(0, 105)
    ax.set_xticks(x)
    ax.tick_params(colors="#8b949e", labelsize=9)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.spines["bottom"].set_color("#30363d")
    ax.spines["left"].set_color("#30363d")
    fig.tight_layout()
    return fig


# ──────────────────────────────────────────────
#  Human-Readable Summary Helper
# ──────────────────────────────────────────────

def _get_rd_human_summary(rd_result: dict | None) -> str:
    """Translate technical RD model results into natural language."""
    if not rd_result or rd_result.get("status") == "DISABLED":
        return "🛡️  **Cloud Analysis:** Analysis not performed (API key missing)."
        
    if rd_result.get("status") == "SKIPPED":
        reason = rd_result.get("error", "File format not supported by cloud layer.")
        return f"⏭️  **Cloud Verification Skipped:** {reason}"

    if rd_result.get("status") == "ERROR":
        return f"🔴  **Cloud Analysis Error:** {rd_result.get('error', 'Unknown error')}"

    status = rd_result.get("status", "INCONCLUSIVE")
    score = rd_result.get("score", 0.0)
    models = rd_result.get("models", [])
    
    # Analyze model disagreement
    manipulated_models = [m for m in models if m.get("status") == "MANIPULATED"]
    
    if status == "AUTHENTIC":
        if not manipulated_models:
            summary = "✅  **Verdict:** This media looks **Authentic**. All forensic models confirmed no AI artifacts."
        else:
            # Handle the "Pine" case: overall authentic but one model flagged it
            summary = f"⚠️  **Verdict:** Generally **Authentic**, but with **Forensic Exceptions**. One or more specialized models detected suspicious patterns."
    else:
        summary = f"🚨  **Verdict:** This media is **MANIPULATED**. High probability of AI generation or editing detected."

    # Specific model insights
    if manipulated_models:
        model_names = ", ".join([m['name'].replace('rd-', '') for m in manipulated_models])
        summary += f"\n\n> **Insight:** The `{model_names}` model flagged specific manipulation. This suggests the file may have been created or altered using a specific AI architecture."

    summary += f"\n\n📊  *Overall Confidence Score: {score:.2f}*"
    return summary

def analyze(file_obj):
    """Gradio callback — receives uploaded file, returns all UI components."""
    if file_obj is None:
        return (
            "⚠️  No file uploaded.",
            None, None, None, None, None, {}, {}, "",
        )

    file_path = file_obj if isinstance(file_obj, str) else file_obj.name
    from src.core.config import MODEL_DIR
    ckpt = os.path.join(MODEL_DIR, "best_model.pt")

    if not os.path.isfile(ckpt):
        return (
            "❌  Checkpoint not found at: " + ckpt,
            None, None, None, None, None,
            {"error": "best_model.pt missing"},
            {"status": "ERROR", "error": "Model missing"},
            "🔴  **System Error:** Model checkpoint missing."
        )

    try:
        result: InferenceResult = run_inference(file_path, ckpt)
    except Exception as e:
        return (
            f"❌  Inference failed: {e}",
            None, None, None, None, None, {}, {}, "",
        )

    # ── Probability text ──
    pct = result.fake_probability * 100
    if result.label == "FAKE":
        prob_text = f"🔴  FAKE — {pct:.2f}% manipulation probability"
    else:
        prob_text = f"🟢  REAL — {100 - pct:.2f}% authenticity confidence"

    # ── Add Cloud Verdict if available ──
    rd = result.rd_result
    if rd and rd.get("status") != "ERROR":
        status_emoji = "🛡️"
        rd_status = rd.get("status", "UNKNOWN")
        rd_score = rd.get("score", 0.0)
        prob_text += f"\n{status_emoji}  RD Cloud: {rd_status} (score: {rd_score:.2f})"
    elif rd and rd.get("error"):
        prob_text += f"\n⚠️  RD Cloud: Offline / Error"

    # ── Temporal anomaly plot ──
    temporal_fig = _build_temporal_plot(result.per_frame_scores)

    # ── XAI: Temporal Attention Rollout plot ──
    rollout_fig = _build_rollout_plot(result.temporal_rollout)

    # ── XAI: Noise Residual image ──
    noise_img = result.noise_residual  # PIL Image or None

    # ── XAI: Geometric Jitter metrics ──
    jitter_data = result.geometric_jitter if result.geometric_jitter else None

    # ── Forensic log ──
    forensic = result.forensic_log

    # ── Forensic summary text for humans ──
    rd_human_summary = _get_rd_human_summary(result.rd_result)

    return (
        prob_text,
        result.gradcam_overlay,
        temporal_fig,
        rollout_fig,
        noise_img,
        jitter_data,
        forensic,
        result.rd_result or {"status": "DISABLED", "info": "API key missing"},
        rd_human_summary,
    )


# ──────────────────────────────────────────────
#  Gradio Interface
# ──────────────────────────────────────────────

_CSS = """
.gradio-container { max-width: 860px !important; }
#verdict-text textarea {
    font-size: 1.3rem !important;
    font-weight: 700 !important;
    text-align: center !important;
    background: #161b22 !important;
    color: #e6edf3 !important;
    border: 1px solid #30363d !important;
    border-radius: 8px !important;
    padding: 14px !important;
}
#forensic-json { font-family: 'JetBrains Mono', 'Fira Code', monospace !important; }
"""

def create_ui():
    with gr.Blocks(
        title="Trinetra — Deepfake Forensic Analyzer",
        theme=gr.themes.Base(
            primary_hue="red",
            neutral_hue="gray",
            font=gr.themes.GoogleFont("Inter"),
        ),
        css=_CSS,
    ) as app:
        gr.Markdown(
            "## 🔬  TRINETRA  —  Deepfake Forensic Analyzer\n"
            "Upload an image or video. The system returns a manipulation verdict "
            "with Grad-CAM spatial evidence, temporal analysis, and deep forensic XAI.",
        )

        with gr.Row():
            with gr.Column(scale=1):
                gr.Markdown("### Input")
                file_input = gr.File(
                    label="Upload Image or Video",
                    file_types=["image", "video"],
                    type="filepath",
                )
                analyse_btn = gr.Button("⚡ Analyze Media", variant="primary", size="lg")
                
                gr.Markdown(
                    "**Supported Formats:**\n"
                    "- Images (JPEG, PNG, WEBP, up to 10MB)\n"
                    "- Video (MP4, MOV, up to 250MB)\n\n"
                    "*All media is processed securely with dual-layer cloud verification when enabled.*"
                )

            with gr.Column(scale=2):
                with gr.Tabs():
                    with gr.TabItem("🛡️ Executive Summary"):
                        verdict_box = gr.Textbox(
                            label="Absolute Local Probability",
                            interactive=False,
                            elem_id="verdict-text",
                        )
                        rd_summary = gr.Markdown(
                            label="Cloud Forensic Insight",
                            value="*Cloud verification results will appear here after analysis.*"
                        )
                        gr.Markdown("---")
                        gradcam_img = gr.Image(
                            label="Grad-CAM Spatial Evidence (Local GPU)",
                            type="pil",
                            interactive=False,
                        )

                    with gr.TabItem("📈 Temporal Analysis"):
                        gr.Markdown("*(Video Only) Frame-by-frame anomaly detection.*")
                        temporal_plot = gr.Plot(
                            label="Temporal Anomaly Plot",
                        )
                        rollout_plot = gr.Plot(
                            label="Temporal Attention Rollout (LSTM)",
                        )

                    with gr.TabItem("🔬 Deep Forensics"):
                        noise_img = gr.Image(
                            label="Noise Residual Map (Error Level Analysis)",
                            type="pil",
                            interactive=False,
                        )
                        jitter_json = gr.JSON(
                            label="Geometric Landmark Jitter",
                        )

                    with gr.TabItem("⚙️ Raw Data & Logs"):
                        rd_json = gr.JSON(
                            label="Reality Defender Core JSON Response",
                        )
                        forensic_json = gr.JSON(
                            label="Trinetra Forensic Triage Log",
                            elem_id="forensic-json",
                        )

        # ── Wire callback ──
        analyse_btn.click(
            fn=analyze,
            inputs=[file_input],
            outputs=[
                verdict_box,
                gradcam_img,
                temporal_plot,
                rollout_plot,
                noise_img,
                jitter_json,
                forensic_json,
                rd_json,
                rd_summary,
            ],
        )

        gr.Markdown(
            "<center style='color:#8b949e;font-size:0.8rem;'>"
            "Project Trinetra · EfficientNet-B4 + LSTM · Grad-CAM + XAI Forensic Suite"
            "</center>"
        )

    return app


# ──────────────────────────────────────────────
#  Entry
# ──────────────────────────────────────────────

if __name__ == "__main__":
    app = create_ui()
    app.launch(
        server_name="127.0.0.1",
        server_port=7860,
        share=False,
        show_error=True,
    )
