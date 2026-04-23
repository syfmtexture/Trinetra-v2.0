"""
model.py — Hybrid EfficientNet-V2-S + Transformer Deepfake Detector for Project Trinetra.

Architecture
────────────
1. Spatial backbone : EfficientNet-V2-S (ImageNet pre-trained, lower blocks frozen)
   → produces a 1280-d feature vector per frame.
2. Temporal head    : Transformer Encoder that consumes the per-frame feature sequence.
3. Adaptive routing : If the input has T == 1 (static image), the Transformer is
   bypassed and the spatial features go straight to the classification head.
"""

import torch
import torch.nn as nn
from torchvision import models

from src.core.config import (
    DROPOUT,
    EFFICIENTNET_FEATURE_DIM,
    FREEZE_BLOCKS,
    SEQ_LEN,
    TRANSFORMER_DIM_FF,
    TRANSFORMER_HEADS,
    TRANSFORMER_LAYERS,
)


class DeepfakeDetector(nn.Module):
    """
    Forward signature
    -----------------
    x : Tensor of shape (B, T, C, H, W)
        • T = SEQ_LEN for video sequences
        • T = 1       for static images

    Returns
    -------
    logits : Tensor of shape (B, 1)
        Raw logit (apply sigmoid for probability).
    """

    def __init__(self):
        super().__init__()

        # ── 1. Spatial feature extractor (EfficientNet-V2-S) ──
        backbone = models.efficientnet_v2_s(weights=models.EfficientNet_V2_S_Weights.IMAGENET1K_V1)

        # Remove the original classifier head
        self.features = backbone.features         # Sequential of blocks
        self.pool = backbone.avgpool              # AdaptiveAvgPool2d
        feature_dim = EFFICIENTNET_FEATURE_DIM    # 1280

        # Freeze the lower blocks
        for i, block in enumerate(self.features):
            if i < FREEZE_BLOCKS:
                for param in block.parameters():
                    param.requires_grad = False

        # ── 2. Temporal sequence analyzer (Transformer Encoder) ──
        self.pos_embedding = nn.Parameter(torch.randn(1, SEQ_LEN, feature_dim))

        encoder_layer = nn.TransformerEncoderLayer(
            d_model=feature_dim,
            nhead=TRANSFORMER_HEADS,
            dim_feedforward=TRANSFORMER_DIM_FF,
            dropout=DROPOUT,
            batch_first=True,
        )
        self.transformer = nn.TransformerEncoder(
            encoder_layer,
            num_layers=TRANSFORMER_LAYERS,
        )

        # ── 3. Classification head (shared for both paths) ──
        self.classifier = nn.Sequential(
            nn.Dropout(DROPOUT),
            nn.Linear(feature_dim, 256),
            nn.ReLU(),
            nn.Dropout(DROPOUT),
            nn.Linear(256, 1),
        )

    # ──────────────────────────────────────────

    def _extract_spatial(self, x: torch.Tensor) -> torch.Tensor:
        """
        x : (N, C, H, W)  →  (N, feature_dim)
        Passes through EfficientNet feature blocks + global avg pool.
        """
        x = self.features(x)
        x = self.pool(x)
        x = torch.flatten(x, 1)
        return x

    # ──────────────────────────────────────────

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        x : (B, T, C, H, W)

        Adaptive routing:
          • T > 1  → spatial features → Transformer → classifier
          • T == 1 → spatial features →               classifier
        """
        B, T, C, H, W = x.shape

        # Flatten batch and time for the CNN: (B*T, C, H, W)
        x_flat = x.reshape(B * T, C, H, W)
        features = self._extract_spatial(x_flat)    # (B*T, feat_dim)

        if T > 1:
            # ── Sequence path ──
            features = features.reshape(B, T, -1)   # (B, T, feat_dim)
            features = features + self.pos_embedding[:, :T, :]
            transformer_out = self.transformer(features)  # (B, T, feat_dim)
            # Use mean pooling over temporal dimension
            pooled = transformer_out.mean(dim=1)     # (B, feat_dim)
            logits = self.classifier(pooled)          # (B, 1)
        else:
            # ── Static image path (bypass Transformer) ──
            features = features.reshape(B, -1)       # (B, feat_dim)
            logits = self.classifier(features)        # (B, 1)

        return logits

    # ──────────────────────────────────────────

    def forward_with_hidden(self, x: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor | None]:
        """
        Same as forward() but additionally returns per-frame transformer
        hidden states for XAI temporal analysis.

        Returns
        -------
        logits           : (B, 1)
        temporal_states  : (B, T, feat_dim) or None (if T == 1)
        """
        B, T, C, H, W = x.shape

        x_flat = x.reshape(B * T, C, H, W)
        features = self._extract_spatial(x_flat)

        if T > 1:
            features = features.reshape(B, T, -1)
            features = features + self.pos_embedding[:, :T, :]
            transformer_out = self.transformer(features)
            pooled = transformer_out.mean(dim=1)
            logits = self.classifier(pooled)
            return logits, transformer_out
        else:
            features = features.reshape(B, -1)
            logits = self.classifier(features)
            return logits, None


# ──────────────────────────────────────────────
#  Quick sanity check
# ──────────────────────────────────────────────

if __name__ == "__main__":
    from src.core.config import DEVICE, IMG_SIZE, SEQ_LEN

    model = DeepfakeDetector().to(DEVICE)

    # Count parameters
    total = sum(p.numel() for p in model.parameters())
    trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
    print(f"Total params:     {total:,}")
    print(f"Trainable params: {trainable:,}")

    # Sequence smoke test
    dummy_seq = torch.randn(2, SEQ_LEN, 3, IMG_SIZE, IMG_SIZE, device=DEVICE)
    out_seq = model(dummy_seq)
    print(f"Sequence  input: {dummy_seq.shape} -> output: {out_seq.shape}")

    # Static smoke test
    dummy_static = torch.randn(2, 1, 3, IMG_SIZE, IMG_SIZE, device=DEVICE)
    out_static = model(dummy_static)
    print(f"Static    input: {dummy_static.shape} -> output: {out_static.shape}")

    print("[OK] Model forward pass OK for both sequence and static inputs.")
